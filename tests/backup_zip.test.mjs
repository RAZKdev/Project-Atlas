import test from 'node:test';
import assert from 'node:assert/strict';

const mockStorage = new Map();
globalThis.localStorage = {
  getItem: (key) => mockStorage.get(key) || null,
  setItem: (key, val) => mockStorage.set(key, String(val)),
  removeItem: (key) => mockStorage.delete(key),
  clear: () => mockStorage.clear()
};

test('ZIP store: CRC32 matches known vector', async () => {
  const { crc32 } = await import('../src/core/services/zipStore.ts');
  assert.equal(crc32(new TextEncoder().encode('123456789')), 0xcbf43926);
});

test('ZIP store: zipStore + unzipStore roundtrip preserves names and bytes', async () => {
  const { zipStore, unzipStore } = await import('../src/core/services/zipStore.ts');
  const entries = [
    { name: 'atlas.json', data: new TextEncoder().encode('{"version":"2.2"}') },
    { name: 'media/0.bin', data: new Uint8Array([0, 1, 2, 250, 251, 252, 253, 254, 255]) }
  ];
  const blob = zipStore(entries);
  assert.ok(blob.size > 0);
  const read = await unzipStore(blob);
  assert.equal(read.length, 2);
  assert.equal(read[0].name, 'atlas.json');
  assert.equal(await read[0].data.text(), '{"version":"2.2"}');
  assert.equal(read[1].name, 'media/0.bin');
  assert.deepEqual(new Uint8Array(await read[1].data.arrayBuffer()), entries[1].data);
});

test('ZIP store: dataUrlToBlob decodes without fetch', async () => {
  const { dataUrlToBlob } = await import('../src/core/services/zipStore.ts');
  const dataUrl = 'data:image/png;base64,iVBORw0KGgo=';
  const blob = dataUrlToBlob(dataUrl);
  assert.equal(blob.type, 'image/png');
  assert.equal(blob.size, 8);
  assert.equal(new Uint8Array(await blob.arrayBuffer())[0], 0x89);
});

test('Crypto: chunked encrypt/decrypt roundtrip returns original bytes', async () => {
  const { CryptoService } = await import('../src/core/services/cryptoService.ts');
  const src = new Blob([new TextEncoder().encode('Project Atlas chunked archive payload')]);
  const encBlob = await CryptoService.encryptZipBlob(src, 'passphrase-123', 16);
  assert.ok(encBlob.size > src.size);
  const decBlob = await CryptoService.decryptArchiveToBlob(encBlob, 'passphrase-123');
  assert.equal(await decBlob.text(), await src.text());
});

test('Crypto: chunked decrypt rejects wrong password', async () => {
  const { CryptoService } = await import('../src/core/services/cryptoService.ts');
  const encBlob = await CryptoService.encryptZipBlob(new Blob(['secret']), 'right-pass', 16);
  await assert.rejects(() => CryptoService.decryptArchiveToBlob(encBlob, 'wrong-pass'));
});

test('Storage: createBackupArchiveZip produces readable metadata ZIP', async () => {
  const { storageService } = await import('../src/core/services/storageService.ts');
  const { unzipStore } = await import('../src/core/services/zipStore.ts');
  const zipBlob = await storageService.createBackupArchiveZip();
  const entries = await unzipStore(zipBlob);
  const names = entries.map(e => e.name);
  assert.ok(names.includes('atlas.json'));
  const meta = JSON.parse(await entries.find(e => e.name === 'atlas.json').data.text());
  assert.equal(meta.version, '2.2');
  assert.ok(Array.isArray(meta.memories));
});

test('Media guardrail: size ceiling is 100 MB', async () => {
  const { MAX_MEDIA_SIZE_BYTES } = await import('../src/core/services/mediaStore.ts');
  assert.equal(MAX_MEDIA_SIZE_BYTES, 100 * 1024 * 1024);
});

test('Crypto: multi-chunk roundtrip with unique per-chunk IVs and GCM tag offset', async () => {
  // Regression: old code reused a single IV across all chunks AND computed the
  // ciphertext offset as plaintext offset instead of cumulative ciphertext offset.
  // Both bugs made multi-chunk decrypt fail (single-chunk worked by accident).
  const { CryptoService } = await import('../src/core/services/cryptoService.ts');
  const src = new Blob([new Uint8Array(64 * 1024 * 1024).fill(1)]); // 64 MB, 2 chunks at default 4 MB
  const encBlob = await CryptoService.encryptZipBlob(src, 'passphrase-123', 16);
  const decBlob = await CryptoService.decryptArchiveToBlob(encBlob, 'passphrase-123');
  assert.equal(decBlob.size, src.size);
  const dec = new Uint8Array(await decBlob.arrayBuffer());
  assert.equal(dec[0], 1);
  assert.equal(dec[dec.length - 1], 1);
  assert.equal(dec[4 * 1024 * 1024], 1); // first byte of chunk #2
});
