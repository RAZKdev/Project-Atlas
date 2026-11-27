/**
 * Native Web Crypto Service for Project Atlas.
 * Provides client-side AES-GCM 256-bit encryption with PBKDF2 key derivation.
 * Zero external dependencies.
 */

export interface EncryptedPayload {
  version: '2.0-enc';
  salt: string;   // Base64
  iv: string;     // Base64
  ciphertext: string; // Base64
  iterations?: number; // PBKDF2 iterations (default 100000)
  kdf?: string;        // 'PBKDF2-SHA-256'
  exportedAt: string;
}

export class CryptoService {
  private static async deriveKey(password: string, salt: Uint8Array, iterations = 100000): Promise<CryptoKey> {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      enc.encode(password),
      'PBKDF2',
      false,
      ['deriveKey']
    );

    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt as any,
        iterations: iterations,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  public static async encryptData(plainText: string, password: string, iterations = 100000): Promise<EncryptedPayload> {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await this.deriveKey(password, salt, iterations);

    const enc = new TextEncoder();
    const encodedData = enc.encode(plainText);

    const encryptedBuffer = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv as any },
      key,
      encodedData
    );

    return {
      version: '2.0-enc',
      salt: this.bufferToBase64(salt),
      iv: this.bufferToBase64(iv),
      ciphertext: this.bufferToBase64(new Uint8Array(encryptedBuffer)),
      iterations,
      kdf: 'PBKDF2-SHA-256',
      exportedAt: new Date().toISOString()
    };
  }

  public static async decryptData(payload: EncryptedPayload, password: string): Promise<string> {
    const salt = this.base64ToBuffer(payload.salt);
    const iv = this.base64ToBuffer(payload.iv);
    const ciphertext = this.base64ToBuffer(payload.ciphertext);
    const iterations = payload.iterations && payload.iterations > 0 ? payload.iterations : 100000;

    const key = await this.deriveKey(password, salt, iterations);

    try {
      const decryptedBuffer = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: iv as any },
        key,
        ciphertext as any
      );
      const dec = new TextDecoder();
      return dec.decode(decryptedBuffer);
    } catch {
      throw new Error('Decryption failed: Incorrect password or corrupted file.');
    }
  }

  public static async encryptZipBlob(
    blob: Blob,
    password: string,
    iterations = 100000,
    chunkSizeBytes = 4 * 1024 * 1024
  ): Promise<Blob> {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const baseIv = crypto.getRandomValues(new Uint8Array(12));
    const key = await this.deriveKey(password, salt, iterations);
    const total = blob.size;
    const part = (n: number, len: number) => blob.slice(n, n + len);
    const chunks: Uint8Array[] = [];
    let chunkIdx = 0;
    for (let off = 0; off < total; off += chunkSizeBytes) {
      // Unique IV per chunk: increment the 96-bit counter (last 4 bytes as big-endian index)
      const iv = new Uint8Array(baseIv);
      for (let b = 0; b < 4; b++) {
        iv[11 - b] = ((chunkIdx >> (b * 8)) & 0xff) ^ iv[11 - b];
      }
      chunks.push(
        new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, await part(off, chunkSizeBytes).arrayBuffer()))
      );
      chunkIdx++;
    }
    const header = JSON.stringify({
      version: '2.2-zipenc',
      salt: this.bufferToBase64(salt),
      iv: this.bufferToBase64(baseIv),
      iterations,
      kdf: 'PBKDF2-SHA-256',
      chunkSize: chunkSizeBytes,
      totalSize: total,
      exportedAt: new Date().toISOString()
    });
    const headerBytes = new TextEncoder().encode(`${header}\n`);
    const data = new Blob([headerBytes as unknown as BlobPart, ...chunks.map((c) => c as unknown as BlobPart)], { type: 'application/octet-stream' });
    return data;
  }

  public static async decryptArchiveToBlob(blob: Blob, password: string): Promise<Blob> {
    const head = new Uint8Array(await blob.slice(0, 4096).arrayBuffer());
    const headStr = new TextDecoder().decode(head).replace(/\u0000+$/, '');
    const nl = headStr.indexOf('\n');
    if (nl < 0) throw new Error('Format arsip terenkripsi tidak dikenali.');
    const meta = JSON.parse(headStr.slice(0, nl));
    if (meta.version !== '2.2-zipenc') throw new Error('Format arsip terenkripsi tidak dikenali.');
    const iterations = meta.iterations && meta.iterations > 0 ? meta.iterations : 100000;
    const key = await this.deriveKey(password, this.base64ToBuffer(meta.salt), iterations);
    const origLen = new TextEncoder().encode(`${headStr.slice(0, nl)}\n`).length;
    const total = meta.totalSize;
    const part = (n: number, len: number) => blob.slice(n, n + len);
    const chunks: Blob[] = [];
    let cipherOff = origLen;
    for (let off = 0; off < total; off += meta.chunkSize) {
      const ptLen = Math.min(meta.chunkSize, total - off);
      const encLen = ptLen + 16; // GCM auth tag
      const encPart = await part(cipherOff, encLen).arrayBuffer();
      cipherOff += encLen;
      // Reproduce per-chunk IV: same XOR counter scheme used in encryptZipBlob
      const chunkIdx = Math.floor(off / meta.chunkSize);
      const iv = new Uint8Array(this.base64ToBuffer(meta.iv));
      for (let b = 0; b < 4; b++) {
        iv[11 - b] = ((chunkIdx >> (b * 8)) & 0xff) ^ iv[11 - b];
      }
      const dec = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: iv as any }, key, encPart as any);
      chunks.push(new Blob([dec]));
    }
    return new Blob(chunks);
  }

  public static async computeSha256(data: string): Promise<string> {
    const enc = new TextEncoder();
    const hashBuffer = await crypto.subtle.digest('SHA-256', enc.encode(data));
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private static bufferToBase64(buffer: Uint8Array): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  private static base64ToBuffer(base64: string): Uint8Array {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }
}
