import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const ROOT_DIR = path.resolve('.');

test('PWA Test 1: Web App Manifest Schema & Invariants', () => {
  const manifestPath = path.join(ROOT_DIR, 'public', 'manifest.json');
  assert.ok(fs.existsSync(manifestPath), 'manifest.json must exist in public directory');

  const content = fs.readFileSync(manifestPath, 'utf8');
  const manifest = JSON.parse(content);

  // Core PWA specification requirements
  assert.equal(manifest.name, 'Project Atlas — Arsip Pribadi & Museum Mini');
  assert.equal(manifest.short_name, 'Project Atlas');
  assert.equal(manifest.start_url, '/');
  assert.equal(manifest.scope, '/');
  assert.equal(manifest.display, 'standalone');
  assert.equal(manifest.background_color, '#121110');
  assert.equal(manifest.theme_color, '#1c1917');

  // Icons array verification
  assert.ok(Array.isArray(manifest.icons), 'manifest must have an icons array');
  assert.ok(manifest.icons.length >= 2, 'manifest should have at least 2 icon declarations');

  // Verify each declared icon exists on disk
  for (const icon of manifest.icons) {
    assert.ok(icon.src, 'icon must have src');
    assert.ok(icon.sizes, 'icon must declare sizes');
    assert.ok(icon.type, 'icon must declare type');
    assert.ok(icon.purpose, 'icon should declare purpose (any or maskable)');

    const iconDiskPath = path.join(ROOT_DIR, 'public', icon.src.replace(/^\//, ''));
    assert.ok(fs.existsSync(iconDiskPath), `Icon file ${icon.src} must exist at ${iconDiskPath}`);
  }
});

test('PWA Test 2: Service Worker (sw.js) Offline Shell Contract', () => {
  const swPath = path.join(ROOT_DIR, 'public', 'sw.js');
  assert.ok(fs.existsSync(swPath), 'sw.js must exist in public directory');

  const swContent = fs.readFileSync(swPath, 'utf8');

  // Check event listeners
  assert.ok(swContent.includes("addEventListener('install'"), 'sw.js must handle install event');
  assert.ok(swContent.includes("addEventListener('activate'"), 'sw.js must handle activate event');
  assert.ok(swContent.includes("addEventListener('fetch'"), 'sw.js must handle fetch event');
  assert.ok(swContent.includes("addEventListener('message'"), 'sw.js must handle message event');

  // Check lifecycle hooks
  assert.ok(swContent.includes('skipWaiting()'), 'sw.js must invoke skipWaiting');
  assert.ok(swContent.includes('clients.claim()'), 'sw.js must claim active clients');

  // Check navigation fallback for offline access
  assert.ok(swContent.includes("request.mode === 'navigate'"), 'sw.js must handle navigation requests');
  assert.ok(swContent.includes("match('/index.html')"), 'sw.js must fall back to /index.html for offline navigation');

  // Verify precached assets exist on disk
  const precacheMatch = swContent.match(/const PRECACHE_ASSETS = \[([\s\S]*?)\];/);
  assert.ok(precacheMatch, 'PRECACHE_ASSETS array must be defined');

  const rawList = precacheMatch[1]
    .split(',')
    .map((s) => s.trim().replace(/['"]/g, ''))
    .filter(Boolean);

  for (const item of rawList) {
    if (item === '/' || item === '/index.html') {
      assert.ok(fs.existsSync(path.join(ROOT_DIR, 'index.html')), 'Root index.html must exist');
    } else {
      const diskPath = path.join(ROOT_DIR, 'public', item.replace(/^\//, ''));
      assert.ok(fs.existsSync(diskPath), `Precached asset ${item} must exist on disk at ${diskPath}`);
    }
  }
});

test('PWA Test 3: HTML Head Manifest Link & Apple Meta Tags', () => {
  const indexPath = path.join(ROOT_DIR, 'index.html');
  const html = fs.readFileSync(indexPath, 'utf8');

  assert.ok(html.includes('<link rel="manifest" href="/manifest.json"'), 'index.html must link to manifest.json');
  assert.ok(html.includes('<meta name="theme-color" content="#1c1917"'), 'index.html must specify theme-color');
  assert.ok(html.includes('<meta name="apple-mobile-web-app-capable" content="yes"'), 'index.html must specify apple-mobile-web-app-capable');
  assert.ok(html.includes('<meta name="apple-mobile-web-app-status-bar-style"'), 'index.html must specify apple status bar style');
  assert.ok(html.includes('<link rel="apple-touch-icon"'), 'index.html must specify apple-touch-icon');
});

test('PWA Test 4: pwaService Lifecycle & Invariant State', async () => {
  const { pwaService } = await import('../src/core/services/pwaService.ts');
  const state = pwaService.getState();

  assert.equal(typeof state.isInstalled, 'boolean');
  assert.equal(typeof state.isInstallable, 'boolean');
  assert.equal(typeof state.isOffline, 'boolean');
  assert.equal(typeof state.hasUpdate, 'boolean');

  // Subscription works
  let notified = false;
  const unsubscribe = pwaService.subscribe((s) => {
    if (s) notified = true;
  });
  assert.equal(notified, true);
  unsubscribe();
});

test('PWA Test 5: Service Worker Cache Version & Local Font Precache', () => {
  const swPath = path.join(ROOT_DIR, 'public', 'sw.js');
  const swContent = fs.readFileSync(swPath, 'utf8');

  const shellCache = swContent.match(/const CACHE_NAME = '([^']+)';/);
  const runtimeCache = swContent.match(/const RUNTIME_CACHE = '([^']+)';/);
  assert.equal(shellCache?.[1], 'project-atlas-shell-v1.4', 'sw.js must declare the v1.4 shell cache');
  assert.equal(runtimeCache?.[1], 'project-atlas-runtime-v1.4', 'sw.js must declare the v1.4 runtime cache');

  // Fonts are bundled locally; the CDN must no longer be referenced.
  assert.ok(!swContent.includes('fonts.googleapis.com'), 'sw.js must not depend on fonts.googleapis.com');
  assert.ok(!swContent.includes('fonts.gstatic.com'), 'sw.js must not depend on fonts.gstatic.com');

  const bundledFonts = [
    'inter-latin.woff2',
    'playfair-display-latin.woff2',
    'playfair-display-italic-latin.woff2',
    'space-mono-400-latin.woff2',
    'space-mono-700-latin.woff2',
  ];
  for (const font of bundledFonts) {
    assert.ok(swContent.includes(`/fonts/${font}`), `sw.js must precache /fonts/${font}`);
  }
});

test('PWA Test 6: Bundled Font Faces, Files & Offline Fallbacks', () => {
  const cssPath = path.join(ROOT_DIR, 'src', 'styles', 'index.css');
  const cssContent = fs.readFileSync(cssPath, 'utf8');
  const html = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');

  // Local @font-face declarations replace the Google Fonts stylesheet.
  assert.ok(cssContent.includes('@font-face'), 'index.css must declare local @font-face rules');
  assert.ok(!cssContent.includes('fonts.googleapis.com'), 'index.css must not reference Google Fonts');
  assert.ok(!html.includes('fonts.googleapis.com'), 'index.html must not reference Google Fonts');
  assert.ok(!html.includes('fonts.gstatic.com'), 'index.html must not preconnect to Google Fonts');

  const bundledFonts = [
    'inter-latin.woff2',
    'playfair-display-latin.woff2',
    'playfair-display-italic-latin.woff2',
    'space-mono-400-latin.woff2',
    'space-mono-700-latin.woff2',
  ];
  for (const font of bundledFonts) {
    assert.ok(cssContent.includes(`url('/fonts/${font}')`), `index.css must load /fonts/${font}`);

    const fontPath = path.join(ROOT_DIR, 'public', 'fonts', font);
    assert.ok(fs.existsSync(fontPath), `${font} must exist on disk`);
    const magic = fs.readFileSync(fontPath).subarray(0, 4).toString('ascii');
    assert.equal(magic, 'wOF2', `${font} must be a valid WOFF2 file`);
  }

  assert.ok(fs.existsSync(path.join(ROOT_DIR, 'public', 'fonts', 'LICENSE.txt')), 'bundled fonts must ship their OFL license');

  // Verify comprehensive system font fallbacks remain available.
  assert.ok(cssContent.includes('-apple-system'), 'body font stack must include -apple-system');
  assert.ok(cssContent.includes('BlinkMacSystemFont'), 'body font stack must include BlinkMacSystemFont');
  assert.ok(cssContent.includes('Georgia'), 'serif font stack must include Georgia');
  assert.ok(cssContent.includes('Cambria'), 'serif font stack must include Cambria');
  assert.ok(cssContent.includes('ui-monospace'), 'mono font stack must include ui-monospace');
});


