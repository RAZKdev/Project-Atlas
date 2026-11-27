import { zipStore, unzipStore } from '../src/core/services/zipStore.ts';
import { CryptoService } from '../src/core/services/cryptoService.ts';

const GB = 1024 * 1024 * 1024;
const SIZE = 256 * 1024 * 1024; // 256 MB: 4 x 64MB chunks, exercises GCM tag boundary
console.log(`Creating synthetic ${SIZE / GB} GB media entry...`);
const big = new Uint8Array(SIZE);
for (let i = 0; i < big.length; i += 65536) {
  const chunk = big.subarray(i, i + 65536);
  for (let j = 0; j < chunk.length; j++) chunk[j] = (i / 65536 + j) & 0xff;
}
console.log('Input data ready.');
console.log('  RSS before ZIP:', Math.round(process.memoryUsage.rss() / 1048576), 'MB');

console.log('Running zipStore...');
const t0 = Date.now();
const zipBlob = zipStore([
  { name: 'atlas.json', data: new TextEncoder().encode('{"version":"2.2","memories":[]}') },
  { name: 'media/0-test.bin', data: big }
]);
const t1 = Date.now();
console.log(`  ZIP blob size: ${(zipBlob.size / GB).toFixed(2)} GB in ${t1 - t0} ms`);
console.log('  RSS after ZIP:', Math.round(process.memoryUsage.rss() / 1048576), 'MB');

console.log('Verifying unzipStore round-trip...');
const t2 = Date.now();
const entries = await unzipStore(zipBlob);
console.log(`  unzip ${entries.length} entries in ${Date.now() - t2} ms`);
const metaText = await entries[0].data.text();
assertOk(metaText.includes('"version":"2.2"'), 'atlas.json content');
const mediaBuf = new Uint8Array(await entries[1].data.arrayBuffer());
assertOk(mediaBuf.length === SIZE, `media size ${mediaBuf.length}`);
// pattern: chunk i (offset i*65536) has byte (i + j) & 0xff at index j
assertOk(mediaBuf[0] === 0 && mediaBuf[1] === 1, 'media head bytes');
assertOk(mediaBuf[65536] === 1 && mediaBuf[65537] === 2, 'media at offset 65536');
assertOk(mediaBuf[3 * 65536] === 3, 'media at offset 196608');
console.log('  Round-trip verified.');

console.log('Testing encrypted ZIP chunked round-trip...');
const t3 = Date.now();
const encBlob = await CryptoService.encryptZipBlob(zipBlob, 'stress-pass', 100000, 64 * 1024 * 1024);
console.log(`  Encrypted size: ${(encBlob.size / GB).toFixed(2)} GB in ${Date.now() - t3} ms`);
const t4 = Date.now();
const decBlob = await CryptoService.decryptArchiveToBlob(encBlob, 'stress-pass');
console.log(`  Decrypted to ${(decBlob.size / GB).toFixed(2)} GB in ${Date.now() - t4} ms`);
assertOk(decBlob.size === zipBlob.size, 'decrypted size matches original ZIP');
const decEntries = await unzipStore(decBlob);
const decMedia = new Uint8Array(await decEntries[1].data.arrayBuffer());
assertOk(decMedia.length === SIZE && decMedia[0] === 0 && decMedia[1] === 1 && decMedia[65536] === 1, 'decrypted media bytes match');
console.log('  Encrypted round-trip verified.');
console.log('  Final RSS:', Math.round(process.memoryUsage.rss() / 1048576), 'MB');

function assertOk(cond, label) {
  if (!cond) {
    console.error(`FAILED: ${label}`);
    process.exit(1);
  }
  console.log(`  OK: ${label}`);
}
