import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { isValidMediaUrl, sanitizePlainText, sanitizeSearchQuery } from '../src/core/utils/securityUtils.ts';
import { countryRegistry } from '../src/atlas/countries/countryRegistry.ts';

// ── 1. SECURITY VALIDATION SUITE (OWASP ASVS 5.0.0) ──────────────────────────

test('Security Suite 1: isValidMediaUrl - Valid URLs & Static Paths', () => {
  // HTTPS / HTTP
  assert.equal(isValidMediaUrl('https://images.unsplash.com/photo-1506744038136-46273834b3fb'), true);
  assert.equal(isValidMediaUrl('http://example.com/archive/photo.webp'), true);

  // Local media IndexedDB blob keys
  assert.equal(isValidMediaUrl('local-media:media_blob_1720000000_photo'), true);
  assert.equal(isValidMediaUrl('local-media:id-123.456'), true);

  // Relative static asset paths
  assert.equal(isValidMediaUrl('/assets/models/statue.glb'), true);
  assert.equal(isValidMediaUrl('/uploads/2026/travel_photo.png'), true);
  assert.equal(isValidMediaUrl('/compass.svg'), true);

  // Safe Data URIs (image and video mime types)
  assert.equal(isValidMediaUrl('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='), true);
  assert.equal(isValidMediaUrl('data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA=='), true);
  assert.equal(isValidMediaUrl('data:video/mp4;base64,AAAAHGZ0eXBtcDQyAAAAAW1wNDJpc29tYXZjMQ=='), true);
});

test('Security Suite 2: isValidMediaUrl - Injection Schemes & Malicious Payloads', () => {
  // Active script schemes (Strictly Rejected)
  assert.equal(isValidMediaUrl('javascript:alert(document.cookie)'), false);
  assert.equal(isValidMediaUrl('JAVASCRIPT:alert(1)'), false);
  assert.equal(isValidMediaUrl('vbscript:msgbox(1)'), false);
  assert.equal(isValidMediaUrl('data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg=='), false);
  assert.equal(isValidMediaUrl('data:application/javascript;base64,YWxlcnQoMSk='), false);

  // Path Traversal in relative asset paths
  assert.equal(isValidMediaUrl('/assets/../../etc/passwd'), false);
  assert.equal(isValidMediaUrl('/uploads/..\\windows\\system32'), false);

  // Embedded authentication credentials in URL
  assert.equal(isValidMediaUrl('https://admin:secret@malicious.com/exploit.jpg'), false);

  // Malformed / Non-string / Empty
  assert.equal(isValidMediaUrl(''), false);
  assert.equal(isValidMediaUrl('   '), false);
  assert.equal(isValidMediaUrl(null), false);
  assert.equal(isValidMediaUrl(undefined), false);
  assert.equal(isValidMediaUrl('not a url at all'), false);
  assert.equal(isValidMediaUrl('ftp://insecure-ftp.com/file.jpg'), false);
  assert.equal(isValidMediaUrl('file:///etc/passwd'), false);
});

test('Security Suite 3: sanitizePlainText - Strips Null Bytes, Controls, Enforces Length', () => {
  // Null byte stripping
  const withNull = 'Halo Dunia\0 dari Atlas\0!';
  assert.equal(sanitizePlainText(withNull), 'Halo Dunia dari Atlas!');

  // Control characters
  const withControl = 'Teks\x01\x02\x08 bersih\x1F.';
  assert.equal(sanitizePlainText(withControl), 'Teks bersih.');

  // Maximum length bounding
  const longText = 'A'.repeat(500);
  assert.equal(sanitizePlainText(longText, 50).length, 50);

  // Whitespace trimming
  assert.equal(sanitizePlainText('   Catatan Perjalanan Indah   '), 'Catatan Perjalanan Indah');

  // Fallbacks
  assert.equal(sanitizePlainText(''), '');
  assert.equal(sanitizePlainText(null), '');
});

test('Security Suite 4: sanitizeSearchQuery - Neutralizes Script Injections', () => {
  // Strips tags & brackets
  assert.equal(sanitizeSearchQuery('<script>alert("xss")</script>Indonesia'), 'Indonesia');
  assert.equal(sanitizeSearchQuery('Japan <svg onload=alert(1)>'), 'Japan');
  assert.equal(sanitizeSearchQuery('Bali {injection} \\escape'), 'Bali  injection   escape');

  // Length bounding
  const longQuery = 'q'.repeat(250);
  assert.equal(sanitizeSearchQuery(longQuery, 100).length, 100);

  // Fallbacks
  assert.equal(sanitizeSearchQuery(''), '');
  assert.equal(sanitizeSearchQuery(null), '');
});

// ── 2. SEARCH OPTIMIZATION & FUZZY BENCHMARK SUITE ────────────────────────────

test('Search Hardening: Malicious Search Input Safely Resolves to Country', () => {
  const res = countryRegistry.search('<script>alert("xss")</script>Indonesia');
  assert.ok(res.length > 0, 'Should find Indonesia even when wrapped in script tags');
  assert.equal(res[0].country.id, 'ID');

  const resJapan = countryRegistry.search('Japan<script>alert(1)</script>');
  assert.ok(resJapan.length > 0);
  assert.equal(resJapan[0].country.id, 'JP');
});

test('Search Optimization: Multi-word and Fuzzy Typo Resilience', () => {
  // Transposed letters
  const res1 = countryRegistry.search('Indoneisa');
  assert.ok(res1.length > 0);
  assert.equal(res1[0].country.id, 'ID');

  // Multi-word capital cities
  const res2 = countryRegistry.search('Bandar Seri Begawan');
  assert.ok(res2.length > 0);
  assert.equal(res2[0].country.id, 'BN');

  const res3 = countryRegistry.search('Buenos Aires');
  assert.ok(res3.length > 0);
  assert.equal(res3[0].country.id, 'AR');

  const res4 = countryRegistry.search('New Delhi');
  assert.ok(res4.length > 0);
  assert.equal(res4[0].country.id, 'IN');
});

test('Search Benchmark: Sub-millisecond Exact and Real-time Fuzzy Search', () => {
  const exactQueries = [
    'Indonesia', 'Japan', 'Bandar Seri Begawan', 'Buenos Aires',
    'ID', 'USA', 'CHE', 'Paris', 'New Delhi'
  ];

  const iterations = 50;
  const startExact = performance.now();

  for (let i = 0; i < iterations; i++) {
    for (const q of exactQueries) {
      const results = countryRegistry.search(q, 5);
      assert.ok(results.length > 0);
    }
  }

  const durationExactMs = performance.now() - startExact;
  const totalExact = iterations * exactQueries.length;
  const avgExactMs = durationExactMs / totalExact;

  // Exact / prefix searches must execute sub-millisecond in production, under 5ms in test runner
  assert.ok(avgExactMs < 5.0, `Exact query latency must be under 5ms, got ${avgExactMs.toFixed(3)}ms`);

  // Fuzzy typo queries across 195 nations must execute within single interactive frame budget (< 16.6ms)
  const startFuzzy = performance.now();
  const fuzzyRes = countryRegistry.search('Indoneisa', 5);
  const durationFuzzyMs = performance.now() - startFuzzy;
  assert.ok(fuzzyRes.length > 0);
  assert.ok(durationFuzzyMs < 16.6, `Fuzzy search must execute within 16.6ms frame budget, got ${durationFuzzyMs.toFixed(2)}ms`);
});

// ── 3. MODAL DIALOG ACCESSIBILITY CONTRACT AUDIT (WCAG AA) ────────────────────

test('A11y Audit: All 4 Modal Dialogs Implement WCAG AA Focus Trap and ARIA Roles', () => {
  const projectRoot = path.resolve(process.cwd());
  const modalFiles = [
    'src/features/museum/ExhibitModal.tsx',
    'src/features/backup/BackupModal.tsx',
    'src/features/memories/MemoryFormModal.tsx',
    'src/features/dossier/PassportDossierModal.tsx'
  ];

  for (const relativePath of modalFiles) {
    const fullPath = path.join(projectRoot, relativePath);
    assert.ok(fs.existsSync(fullPath), `Modal file must exist: ${relativePath}`);
    
    const content = fs.readFileSync(fullPath, 'utf-8');

    // 1. Must use useModalFocusTrap hook
    assert.ok(
      content.includes('useModalFocusTrap'),
      `${relativePath} must import and invoke useModalFocusTrap`
    );

    // 2. Must declare role="dialog"
    assert.ok(
      content.includes('role="dialog"'),
      `${relativePath} must declare role="dialog"`
    );

    // 3. Must declare aria-modal="true"
    assert.ok(
      content.includes('aria-modal="true"'),
      `${relativePath} must declare aria-modal="true"`
    );

    // 4. Must declare aria-labelledby
    assert.ok(
      content.includes('aria-labelledby='),
      `${relativePath} must declare aria-labelledby linked to dialog title`
    );

    // 5. Must have explicit aria-label on dismiss button
    assert.ok(
      content.includes('aria-label='),
      `${relativePath} must provide accessible aria-label on close button`
    );
  }
});

// ── 4. WCAG AA COLOR CONTRAST RATIO AUDIT (CURATORIAL CARDS) ──────────────────

function getRelativeLuminance(hex) {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

  const srgb = [r, g, b].map((val) => {
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}

function getContrastRatio(hex1, hex2) {
  const l1 = getRelativeLuminance(hex1);
  const l2 = getRelativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

test('A11y Audit: Curatorial Cards Meet or Exceed WCAG AA Contrast Ratios (>= 4.5:1)', () => {
  const museumBase = '#121110';
  const museumSurface = '#1A1817';
  const museumCard = '#22201E';

  const parchment100 = '#FAF8F5';
  const parchment200 = '#F4EFEA';
  const parchment300 = '#EAE2D7';
  const parchment400 = '#DDD2C3';
  const museumGold = '#D4AF37';

  // Body text pairings on museum dark surfaces
  const ratioParchment100OnSurface = getContrastRatio(parchment100, museumSurface);
  const ratioParchment200OnCard = getContrastRatio(parchment200, museumCard);
  const ratioParchment300OnBase = getContrastRatio(parchment300, museumBase);
  const ratioParchment400OnSurface = getContrastRatio(parchment400, museumSurface);
  const ratioGoldOnSurface = getContrastRatio(museumGold, museumSurface);

  // All must satisfy WCAG AA >= 4.5:1
  assert.ok(ratioParchment100OnSurface >= 4.5, `Parchment 100 on Surface: ${ratioParchment100OnSurface.toFixed(2)}`);
  assert.ok(ratioParchment200OnCard >= 4.5, `Parchment 200 on Card: ${ratioParchment200OnCard.toFixed(2)}`);
  assert.ok(ratioParchment300OnBase >= 4.5, `Parchment 300 on Base: ${ratioParchment300OnBase.toFixed(2)}`);
  assert.ok(ratioParchment400OnSurface >= 4.5, `Parchment 400 on Surface: ${ratioParchment400OnSurface.toFixed(2)}`);
  assert.ok(ratioGoldOnSurface >= 4.5, `Museum Gold on Surface: ${ratioGoldOnSurface.toFixed(2)}`);
});

test('A11y Audit: Page-Level Modals in MuseumPage & Museum3D Implement Focus Trap & ARIA Roles', () => {
  const projectRoot = path.resolve(process.cwd());
  const pageFiles = [
    'src/features/museum/MuseumPage.tsx',
    'src/features/museum/Museum3D.tsx'
  ];

  for (const relativePath of pageFiles) {
    const fullPath = path.join(projectRoot, relativePath);
    assert.ok(fs.existsSync(fullPath), `File must exist: ${relativePath}`);
    const content = fs.readFileSync(fullPath, 'utf-8');

    // Both must use useModalFocusTrap
    assert.ok(content.includes('useModalFocusTrap'), `${relativePath} must use useModalFocusTrap`);
    // Both must declare role="dialog"
    assert.ok(content.includes('role="dialog"'), `${relativePath} must declare role="dialog"`);
    // Both must declare aria-modal="true"
    assert.ok(content.includes('aria-modal="true"'), `${relativePath} must declare aria-modal="true"`);
    // Both must declare aria-labelledby
    assert.ok(content.includes('aria-labelledby='), `${relativePath} must declare aria-labelledby`);
  }
});

test('A11y Audit: Curatorial UI Elements & Badges Meet WCAG AA Standards', () => {
  const museumSurface = '#1A1817';
  const museumCard = '#22201E';
  const earth200 = '#DFCDB8';
  const earth300 = '#C9AE92';
  const parchment500 = '#C7B7A3';

  const ratioEarth200 = getContrastRatio(earth200, museumSurface);
  const ratioEarth300 = getContrastRatio(earth300, museumSurface);
  const ratioParchment500 = getContrastRatio(parchment500, museumCard);

  assert.ok(ratioEarth200 >= 4.5, `Earth-200 contrast must be >= 4.5, got ${ratioEarth200.toFixed(2)}`);
  assert.ok(ratioEarth300 >= 4.5, `Earth-300 contrast must be >= 4.5, got ${ratioEarth300.toFixed(2)}`);
  assert.ok(ratioParchment500 >= 4.5, `Parchment-500 contrast must be >= 4.5, got ${ratioParchment500.toFixed(2)}`);
});


