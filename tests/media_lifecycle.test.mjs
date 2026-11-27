import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const ROOT_DIR = path.resolve('.');

test('MediaUrlCache: revokes and evicts beyond the cap', async () => {
  const { MediaUrlCache, MAX_CACHED_OBJECT_URLS } = await import('../src/core/services/mediaStore.ts');
  const revoked = [];
  const cache = new MediaUrlCache((url) => revoked.push(url));

  for (let i = 0; i < MAX_CACHED_OBJECT_URLS + 5; i++) {
    cache.set(`local-media:${i}`, `blob:${i}`);
  }

  assert.equal(cache.size, MAX_CACHED_OBJECT_URLS, 'cache must stay at the cap');
  assert.equal(revoked.length, 5, 'each evicted entry must be revoked');
  assert.equal(revoked[0], 'blob:0', 'oldest entry is evicted first');
  assert.equal(cache.get('local-media:0'), undefined);
  assert.equal(cache.get(`local-media:${MAX_CACHED_OBJECT_URLS + 4}`), `blob:${MAX_CACHED_OBJECT_URLS + 4}`);
});

test('MediaUrlCache: replacing a key revokes the previous object URL', async () => {
  const { MediaUrlCache } = await import('../src/core/services/mediaStore.ts');
  const revoked = [];
  const cache = new MediaUrlCache((url) => revoked.push(url));

  cache.set('local-media:1', 'blob:first');
  cache.set('local-media:1', 'blob:second');

  assert.equal(cache.size, 1);
  assert.deepEqual(revoked, ['blob:first']);
  assert.equal(cache.get('local-media:1'), 'blob:second');
});

test('Service worker: cross-origin requests bypass the runtime cache', () => {
  const sw = fs.readFileSync(path.join(ROOT_DIR, 'public', 'sw.js'), 'utf8');
  assert.ok(/isSameOrigin/.test(sw), 'sw.js must compute a same-origin flag');
  assert.ok(
    /if\s*\(\s*!isSameOrigin\s*\)/.test(sw),
    'sw.js must short-circuit caching for cross-origin requests'
  );
});

test('Backup export: object URL revoke is deferred, not synchronous', () => {
  const src = fs.readFileSync(path.join(ROOT_DIR, 'src', 'features', 'backup', 'BackupModal.tsx'), 'utf8');
  const block = src.slice(src.indexOf('const downloadBlob'));
  const clickIdx = block.indexOf('a.click()');
  const revokeIdx = block.indexOf('URL.revokeObjectURL(url)');
  assert.ok(clickIdx > -1 && revokeIdx > -1, 'downloadBlob must click then revoke');
  assert.ok(
    /setTimeout\([\s\S]{0,120}revokeObjectURL/.test(block),
    'revokeObjectURL must be deferred with setTimeout so large downloads are not aborted'
  );
});

test('Media picker: cancelled file dialog resolves instead of hanging', () => {
  const src = fs.readFileSync(path.join(ROOT_DIR, 'src', 'core', 'services', 'mediaStore.ts'), 'utf8');
  assert.ok(/input\.oncancel/.test(src), 'fallback input must handle the cancel event');
  assert.ok(/addEventListener\('focus'/.test(src), 'fallback input must resolve when focus returns without a selection');
});
