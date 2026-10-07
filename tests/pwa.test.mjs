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

