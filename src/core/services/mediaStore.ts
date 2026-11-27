/**
 * Local Media Store using IndexedDB.
 * Safely persists image Blobs picked from local hard drive without uploading to servers.
 */
import { dataUrlToBlob } from './zipStore';

const DB_NAME = 'ProjectAtlasMediaDB';
const DB_VERSION = 1;
const STORE_NAME = 'media_blobs';

export const MAX_MEDIA_SIZE_BYTES = 100 * 1024 * 1024; // 100 MB per binary media
const ALLOWED_MIME_PREFIXES = ['image/', 'video/', 'audio/'];

// Object URLs are never garbage collected on their own. Keep a bounded cache and
// revoke evicted entries so long sessions do not leak blobs.
export const MAX_CACHED_OBJECT_URLS = 64;

export class MediaUrlCache {
  private map = new Map<string, string>();

  constructor(private revokeFn: (url: string) => void = (url) => URL.revokeObjectURL?.(url)) {}

  public get(key: string): string | undefined {
    return this.map.get(key);
  }

  public has(key: string): boolean {
    return this.map.has(key);
  }

  public get size(): number {
    return this.map.size;
  }

  public set(key: string, url: string): void {
    this.revoke(key);
    this.map.set(key, url);
    while (this.map.size > MAX_CACHED_OBJECT_URLS) {
      const oldest = this.map.keys().next().value as string | undefined;
      if (oldest === undefined) break;
      this.revoke(oldest);
    }
  }

  public revoke(key: string): void {
    const url = this.map.get(key);
    if (!url) return;
    this.revokeFn(url);
    this.map.delete(key);
  }
}

export type MediaImportFailureReason = 'tipe-blob' | 'ukuran-blob' | 'fetch' | 'simpan';

export interface MediaImportFailure {
  reason: MediaImportFailureReason;
  label: string;
  count: number;
  message: string;
}

export interface MediaImportReport {
  total: number;
  imported: number;
  failed: number;
  failures: MediaImportFailure[];
}

const MEDIA_IMPORT_FAILURE_LABELS: Record<MediaImportFailureReason, string> = {
  'tipe-blob': 'Tipe blob ditolak',
  'ukuran-blob': 'Ukuran blob ditolak',
  fetch: 'Fetch gagal',
  simpan: 'Simpan gagal',
};

const classifyMediaSaveError = (err: unknown): MediaImportFailureReason => {
  const message = err instanceof Error ? err.message : String(err);
  if (message.startsWith('Ukuran berkas (')) return 'ukuran-blob';
  if (message.startsWith('Tipe berkas ')) return 'tipe-blob';
  return 'simpan';
};

class MediaStore {
  private dbPromise: Promise<IDBDatabase> | null = null;
  private urlCache: MediaUrlCache = new MediaUrlCache();

  private getDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    return this.dbPromise;
  }

  /**
   * Save a local file/blob to IndexedDB and return its media key.
   */
  public async saveMediaBlob(id: string, blob: Blob | File, filename?: string): Promise<string> {
    // Media guardrail: size ceiling (F-04)
    if (blob.size > MAX_MEDIA_SIZE_BYTES) {
      const sizeMB = (blob.size / (1024 * 1024)).toFixed(1);
      throw new Error(`Ukuran berkas (${sizeMB} MB) melebihi batas maksimal 100 MB.`);
    }

    // Media guardrail: allowed types
    if (blob.type && !ALLOWED_MIME_PREFIXES.some(prefix => blob.type.startsWith(prefix))) {
      throw new Error(`Tipe berkas '${blob.type}' tidak didukung. Hanya gambar, video, dan audio yang diizinkan.`);
    }

    const db = await this.getDB();
    const mediaKey = `local-media:${id}`;

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);

      const record = {
        id: mediaKey,
        blob: blob,
        name: filename || (blob instanceof File ? blob.name : `photo-${Date.now()}`),
        mimeType: blob.type,
        size: blob.size,
        savedAt: new Date().toISOString()
      };

      const request = store.put(record);
      request.onsuccess = () => {
        // Cache object URL
        const objectUrl = URL.createObjectURL(blob);
        this.urlCache.set(mediaKey, objectUrl);
        resolve(mediaKey);
      };
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Resolve an image URI: if it starts with 'local-media:', load blob from IndexedDB and return object URL.
   * If it's a web URL (http/https), return it directly.
   */
  public async resolveMediaUrl(uri: string): Promise<string> {
    if (!uri.startsWith('local-media:')) {
      return uri;
    }

    if (this.urlCache.has(uri)) {
      return this.urlCache.get(uri)!;
    }

    try {
      const db = await this.getDB();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const request = store.get(uri);

        request.onsuccess = () => {
          if (request.result && request.result.blob) {
            const objectUrl = URL.createObjectURL(request.result.blob);
            this.urlCache.set(uri, objectUrl);
            resolve(objectUrl);
          } else {
            resolve(''); // Not found
          }
        };
        request.onerror = () => resolve('');
      });
    } catch {
      return '';
    }
  }

  /**
   * Delete media blob from IndexedDB.
   */
  public async deleteMediaBlob(uri: string): Promise<void> {
    if (!uri.startsWith('local-media:')) return;

    if (this.urlCache.has(uri)) {
      this.urlCache.revoke(uri);
    }

    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.delete(uri);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get metadata of a stored media (mimeType, name, size).
   */
  public async getMediaMetadata(uri: string): Promise<{ mimeType?: string; name?: string; size?: number } | null> {
    if (!uri.startsWith('local-media:')) {
      const isVideoExt = /\.(mp4|webm|mov|ogg|m4v)($|\?)/i.test(uri);
      return isVideoExt ? { mimeType: 'video/mp4' } : { mimeType: 'image/jpeg' };
    }

    try {
      const db = await this.getDB();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const request = store.get(uri);

        request.onsuccess = () => {
          if (request.result) {
            resolve({
              mimeType: request.result.mimeType,
              name: request.result.name,
              size: request.result.size
            });
          } else {
            resolve(null);
          }
        };
        request.onerror = () => resolve(null);
      });
    } catch {
      return null;
    }
  }

  /**
   * Pick media files (Images and/or Videos) from local hard drive using File System Access API with fallback to input element.
   */
  public async pickLocalMedia(options: { type?: 'image' | 'video' | 'audio' | 'all'; multiple?: boolean } = {}): Promise<File[]> {
    const mediaType = options.type || 'all';
    const multiple = options.multiple ?? true;

    const acceptTypes: Record<string, string[]> = {};
    if (mediaType === 'image' || mediaType === 'all') {
      acceptTypes['image/*'] = ['.png', '.gif', '.jpeg', '.jpg', '.webp', '.avif'];
    }
    if (mediaType === 'video' || mediaType === 'all') {
      acceptTypes['video/*'] = ['.mp4', '.webm', '.mov', '.mkv', '.m4v'];
    }
    if (mediaType === 'audio' || mediaType === 'all') {
      acceptTypes['audio/*'] = ['.mp3', '.wav', '.m4a', '.ogg', '.aac', '.flac'];
    }

    // 1. Try modern File System Access API
    if ('showOpenFilePicker' in window) {
      try {
        const handles = await (window as any).showOpenFilePicker({
          multiple,
          types: [
            {
              description: mediaType === 'video' ? 'Videos' : mediaType === 'image' ? 'Images' : 'Photos and Videos',
              accept: acceptTypes
            }
          ]
        });

        const files: File[] = [];
        for (const handle of handles) {
          const file = await handle.getFile();
          files.push(file);
        }
        return files;
      } catch (err: any) {
        if (err.name === 'AbortError') return [];
        console.warn('showOpenFilePicker failed, falling back to file input:', err);
      }
    }

    // 2. Fallback to standard input element
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = mediaType === 'video' ? 'video/*' : mediaType === 'image' ? 'image/*' : 'image/*,video/*';
      input.multiple = multiple;
      input.style.display = 'none';

      let settled = false;
      const finish = (files: File[]) => {
        if (settled) return;
        settled = true;
        input.remove();
        resolve(files);
      };

      input.onchange = () => finish(Array.from(input.files || []));
      // Cancelling the dialog fires no change event. Without these guards the
      // promise never settles and the input stays attached to the DOM.
      input.oncancel = () => finish([]);
      window.addEventListener('focus', () => setTimeout(() => finish([]), 500), { once: true });

      document.body.appendChild(input);
      input.click();
    });
  }

  /**
   * Backward compatibility for pickLocalImages.
   */
  public async pickLocalImages(): Promise<File[]> {
    return this.pickLocalMedia({ type: 'image', multiple: true });
  }

  /**
   * Menghitung kuota penyimpanan memori fisik laptop yang digunakan oleh IndexedDB browser.
   */
  public async getStorageEstimate(): Promise<{
    usageBytes: number;
    quotaBytes: number;
    usageFormatted: string;
    quotaFormatted: string;
    usagePercentage: number;
  }> {
    if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.estimate) {
      try {
        const est = await navigator.storage.estimate();
        const usage = est.usage || 0;
        const quota = est.quota || 1;
        const formatBytes = (bytes: number) => {
          if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
          if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
          return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
        };
        return {
          usageBytes: usage,
          quotaBytes: quota,
          usageFormatted: formatBytes(usage),
          quotaFormatted: formatBytes(quota),
          usagePercentage: Math.min(100, Math.round((usage / quota) * 1000) / 10),
        };
      } catch (err) {
        console.warn('Gagal menghitung kuota penyimpanan browser:', err);
      }
    }
    return {
      usageBytes: 0,
      quotaBytes: 0,
      usageFormatted: '0 MB',
      quotaFormatted: 'Tidak terdeteksi',
      usagePercentage: 0,
    };
  }

  /**
   * Export media records as raw Blobs (no base64, no giant string).
   */
  public async exportMediaRecords(): Promise<Array<{ id: string; name: string; mimeType: string; blob: Blob }>> {
    if (typeof indexedDB === 'undefined') return [];
    try {
      const db = await this.getDB();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const request = store.getAll();
        request.onsuccess = () => {
          const records = (request.result || []).filter((item: any) => item && item.blob instanceof Blob);
          resolve(
            records.map((item: any) => ({
              id: item.id as string,
              name: (item.name || 'unnamed-media') as string,
              mimeType: (item.mimeType || item.blob.type || 'application/octet-stream') as string,
              blob: item.blob as Blob,
            }))
          );
        };
        request.onerror = () => resolve([]);
      });
    } catch {
      return [];
    }
  }

  /**
   * Import media blobs from archive into IndexedDB.
   */
  public async importMediaBlobs(records: Array<{ id: string; name: string; mimeType: string; dataUrl: string }>): Promise<MediaImportReport> {
    const emptyReport: MediaImportReport = { total: 0, imported: 0, failed: 0, failures: [] };
    if (!records || !Array.isArray(records) || records.length === 0 || typeof indexedDB === 'undefined') return emptyReport;
    try {
      const db = await this.getDB();
      const items = records.filter(item => item && item.dataUrl && item.id);
      let importedCount = 0;
      const failureTotals = new Map<MediaImportFailureReason, { count: number; message: string }>();

      const recordFailure = (reason: MediaImportFailureReason, message: string) => {
        const current = failureTotals.get(reason);
        if (current) {
          current.count++;
        } else {
          failureTotals.set(reason, { count: 1, message });
        }
      };

      for (const item of items) {
        let stage: 'fetch' | 'simpan' = 'fetch';
        try {
          const blob = dataUrlToBlob(item.dataUrl);
          stage = 'simpan';
          const cleanId = item.id.replace(/^local-media:/, '');
          await this.saveMediaBlob(cleanId, blob, item.name);
          importedCount++;
        } catch (err) {
          console.warn('Gagal memulihkan sebagian media blob:', item.id, err);
          const reason = stage === 'fetch' ? 'fetch' : classifyMediaSaveError(err);
          recordFailure(reason, err instanceof Error ? err.message : String(err));
        }
      }

      const failures: MediaImportFailure[] = Array.from(failureTotals.entries()).map(([reason, entry]) => ({
        reason,
        label: MEDIA_IMPORT_FAILURE_LABELS[reason],
        count: entry.count,
        message: entry.message,
      }));

      return {
        total: items.length,
        imported: importedCount,
        failed: failures.reduce((sum, failure) => sum + failure.count, 0),
        failures,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return {
        total: records.length,
        imported: 0,
        failed: records.length,
        failures: records.length > 0
          ? [{ reason: 'simpan', label: MEDIA_IMPORT_FAILURE_LABELS.simpan, count: records.length, message }]
          : [],
      };
    }
  }
}

export const mediaStore = new MediaStore();
