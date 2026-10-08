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
