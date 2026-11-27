/**
 * ZIP store (uncompressed) helpers for Project Atlas backup archives.
 * No external dependencies. Memory stays O(total size) due to Blob parts.
 */
export interface ZipWriteEntry {
  name: string;
  data: Uint8Array;
}

export interface ZipReadEntry {
  name: string;
  data: Blob;
}

export function crc32(data: Uint8Array): number {
  let crc = 0xffffffff;
  for (let i = 0; i < data.length; i++) {
    crc ^= data[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

export function zipStore(entries: ZipWriteEntry[]): Blob {
  const encoder = new TextEncoder();
  const parts: BlobPart[] = [];
  const central: Uint8Array[] = [];
  let offset = 0;
  for (const e of entries) {
    const nameBytes = encoder.encode(e.name);
    const c = crc32(e.data);
    const size = e.data.length;
    const lh = new Uint8Array(30 + nameBytes.length);
    const lv = new DataView(lh.buffer);
    lv.setUint32(0, 0x04034b50, true);
    lv.setUint16(4, 20, true);
    lv.setUint16(6, 0, true);
    lv.setUint16(8, 0, true);
    lv.setUint16(10, 0, true);
    lv.setUint16(12, 0, true);
    lv.setUint32(14, c, true);
    lv.setUint32(18, size, true);
    lv.setUint32(22, size, true);
    lv.setUint16(26, nameBytes.length, true);
    lv.setUint16(28, 0, true);
    lh.set(nameBytes, 30);

    const cd = new Uint8Array(46 + nameBytes.length);
    const cv = new DataView(cd.buffer);
    cv.setUint32(0, 0x02014b50, true);
    cv.setUint16(4, 20, true);
    cv.setUint16(6, 20, true);
    cv.setUint16(8, 0, true);
    cv.setUint16(10, 0, true);
    cv.setUint16(12, 0, true);
    cv.setUint16(14, 0, true);
    cv.setUint32(16, c, true);
    cv.setUint32(20, size, true);
    cv.setUint32(24, size, true);
    cv.setUint16(28, nameBytes.length, true);
    cv.setUint16(30, 0, true);
    cv.setUint16(32, 0, true);
    cv.setUint16(34, 0, true);
    cv.setUint16(36, 0, true);
    cv.setUint32(38, 0, true);
    cv.setUint32(42, offset, true);
    cd.set(nameBytes, 46);
    central.push(cd);

    parts.push(lh as unknown as BlobPart);
    parts.push(new Uint8Array(e.data) as unknown as BlobPart);
    offset += lh.length + e.data.length;
  }
  const cdStart = offset;
  let cdSize = 0;
  for (const cd of central) {
    parts.push(cd as unknown as BlobPart);
    cdSize += cd.length;
  }
  offset += cdSize;
  const eocd = new Uint8Array(22);
  const ev = new DataView(eocd.buffer);
  ev.setUint32(0, 0x06054b50, true);
  ev.setUint16(4, 0, true);
  ev.setUint16(6, 0, true);
  ev.setUint16(8, entries.length, true);
  ev.setUint16(10, entries.length, true);
  ev.setUint32(12, cdSize, true);
  ev.setUint32(16, cdStart, true);
  ev.setUint16(20, 0, true);
  parts.push(eocd);
  return new Blob(parts, { type: 'application/zip' });
}

export async function unzipStore(blob: Blob): Promise<ZipReadEntry[]> {
  const buf = await blob.arrayBuffer();
  const view = new DataView(buf);
  let eocdOffset = -1;
  const minStart = Math.max(0, buf.byteLength - 65557);
  for (let i = buf.byteLength - 22; i >= minStart; i--) {
    if (view.getUint32(i, true) === 0x06054b50) {
      eocdOffset = i;
      break;
    }
  }
  if (eocdOffset < 0) throw new Error('ZIP tidak valid: EOCD tidak ditemukan.');
  const cdSize = view.getUint32(eocdOffset + 12, true);
  const cdStart = view.getUint32(eocdOffset + 16, true);
  const totalEntries = view.getUint16(eocdOffset + 10, true);

  const entries: ZipReadEntry[] = [];
  let pos = cdStart;
  const end = cdStart + cdSize;
  for (let n = 0; n < totalEntries && pos < end; n++) {
    if (view.getUint32(pos, true) !== 0x02014b50) break;
    const nameLen = view.getUint16(pos + 28, true);
    const extraLen = view.getUint16(pos + 30, true);
    const commentLen = view.getUint16(pos + 32, true);
    const localOffset = view.getUint32(pos + 42, true);
    const size = view.getUint32(pos + 24, true);
    const nameBytes = new Uint8Array(buf, pos + 46, nameLen);
    const name = new TextDecoder().decode(nameBytes);
    const lhNameLen = view.getUint16(localOffset + 26, true);
    const lhExtraLen = view.getUint16(localOffset + 28, true);
    const dataOffset = localOffset + 30 + lhNameLen + lhExtraLen;
    const data = blob.slice(dataOffset, dataOffset + size);
    entries.push({ name, data });
    pos += 46 + nameLen + extraLen + commentLen;
  }
  return entries;
}

export function dataUrlToBlob(dataUrl: string): Blob {
  const comma = dataUrl.indexOf(',');
  const meta = comma >= 0 ? dataUrl.slice(0, comma) : '';
  const b64 = comma >= 0 ? dataUrl.slice(comma + 1) : dataUrl;
  const mimeMatch = /data:([^;]+)/.exec(meta);
  const mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}