import React, { useState, useEffect, useRef } from 'react';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { X, Download, Upload, Shield, Lock, FileJson, AlertCircle, CheckCircle2, Database } from 'lucide-react';
import { storageService } from '../../core/services/storageService';
import { mediaStore } from '../../core/services/mediaStore';
import { CryptoService, EncryptedPayload } from '../../core/services/cryptoService';
import { Button } from '../../components/ui/Button';
import { useModalFocusTrap } from '../../core/hooks/useModalFocusTrap';
import { todayLocalISO } from '../../core/utils/localDate';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  useModalFocusTrap(isOpen, onClose, modalRef);

  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');
  
  // Storage Quota
  const [storageQuota, setStorageQuota] = useState<{
    usageFormatted: string;
    quotaFormatted: string;
    usagePercentage: number;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      mediaStore.getStorageEstimate().then(setStorageQuota);
    }
  }, [isOpen]);
  
  // Export states
  const [encryptExport, setEncryptExport] = useState(false);
  const [exportPassword, setExportPassword] = useState('');
  const [exportPasswordConfirm, setExportPasswordConfirm] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  // Import states
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importPassword, setImportPassword] = useState('');
  const [isEncryptedFile, setIsEncryptedFile] = useState(false);
  const [isZipArchive, setIsZipArchive] = useState(false);
  const [parsedRawData, setParsedRawData] = useState<string | null>(null);
  const [importMode, setImportMode] = useState<'merge' | 'replace'>('merge');
  const [isImporting, setIsImporting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'warning'; text: string; details?: string[] } | null>(null);

  if (!isOpen) return null;

  const handleExport = async () => {
    setStatusMessage(null);
    if (encryptExport) {
      if (!exportPassword || exportPassword.length < 6) {
        setStatusMessage({ type: 'error', text: 'Password must be at least 6 characters.' });
        return;
      }
      if (exportPassword !== exportPasswordConfirm) {
        setStatusMessage({ type: 'error', text: 'Password confirmation does not match.' });
        return;
      }
    }

    try {
      setIsExporting(true);
      const zipBlob = await storageService.createBackupArchiveZip();
      const dateStr = todayLocalISO();

      if (encryptExport) {
        const blob = await CryptoService.encryptZipBlob(zipBlob, exportPassword);
        await downloadBlob(blob, `project-atlas-${dateStr}.atlas.enc`);
      } else {
        await downloadBlob(zipBlob, `project-atlas-${dateStr}.zip`);
      }

      setStatusMessage({
        type: 'success',
        text: Capacitor.isNativePlatform()
          ? 'Cadangan siap. Pilih tempat menyimpan di menu yang terbuka.'
          : 'Archive exported successfully!',
      });
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Export failed.' });
    } finally {
      setIsExporting(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setStatusMessage(null);
    const file = e.target.files?.[0];
    if (!file) return;

    setImportFile(file);
    setIsZipArchive(false);
    setIsEncryptedFile(false);
    setParsedRawData(null);

    // ZIP binary: first 4 bytes = 0x50 0x4b 0x03 0x04 ('PK..')
    const head = new Uint8Array(await file.slice(0, 4).arrayBuffer());
    const isZipBinary = head[0] === 0x50 && head[1] === 0x4b;
    if (isZipBinary) {
      setIsZipArchive(true);
      return;
    }

    // JSON (old archive / encrypted ZIP header / plain)
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);

      if (parsed.version === '2.0-enc') {
        setIsEncryptedFile(true);
        setParsedRawData(text);
      } else if (parsed.version === '2.2-zipenc') {
        setIsEncryptedFile(true);
        setIsZipArchive(true);
      } else if (parsed.memories) {
        setParsedRawData(text);
      } else {
        setStatusMessage({ type: 'error', text: 'Unrecognized archive format.' });
        setImportFile(null);
      }
    } catch {
      setStatusMessage({ type: 'error', text: 'Could not read file. Invalid JSON.' });
      setImportFile(null);
    }
  };

  const handleImport = async () => {
    if (!parsedRawData && !isZipArchive) return;
    setStatusMessage(null);
    setIsImporting(true);

    try {
      let res;
      if (isZipArchive && importFile) {
        let zipBlob: Blob = importFile;
        if (isEncryptedFile) {
          if (!importPassword) {
            setStatusMessage({ type: 'error', text: 'Please enter the decryption password.' });
            setIsImporting(false);
            return;
          }
          zipBlob = await CryptoService.decryptArchiveToBlob(importFile, importPassword);
        }
        res = await storageService.importZipArchive(zipBlob, importMode);
      } else if (parsedRawData) {
        let jsonContent = parsedRawData;
        if (isEncryptedFile) {
          if (!importPassword) {
            setStatusMessage({ type: 'error', text: 'Please enter the decryption password.' });
            setIsImporting(false);
            return;
          }
          const payload: EncryptedPayload = JSON.parse(parsedRawData);
          jsonContent = await CryptoService.decryptData(payload, importPassword);
        }
        res = await storageService.importBackupArchive(jsonContent, importMode);
      } else {
        return;
      }

      const mediaReport = res.mediaReport;
      const hasMediaFailures = mediaReport.failed > 0;
      setStatusMessage({
        type: hasMediaFailures ? 'warning' : 'success',
        text: `Memori masuk: ${res.memoriesCount}. Foto dipulihkan: ${mediaReport.imported} dari ${mediaReport.total}. Gagal: ${mediaReport.failed}.`,
        details: hasMediaFailures
          ? mediaReport.failures.slice(0, 3).map(f => `${f.label} (${f.count}): ${f.message}`)
          : undefined,
      });
      onSuccess();
      if (!hasMediaFailures) {
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Import failed.' });
    } finally {
      setIsImporting(false);
    }
  };

  const blobToBase64 = (blob: Blob): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Failed to read backup blob.'));
      reader.onload = () => {
        const result = typeof reader.result === 'string' ? reader.result : '';
        const comma = result.indexOf(',');
        resolve(comma >= 0 ? result.slice(comma + 1) : '');
      };
      reader.readAsDataURL(blob);
    });

  const downloadBlob = async (blob: Blob, filename: string) => {
    if (!Capacitor.isNativePlatform()) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      // Revoking synchronously aborts large downloads: the browser reads the blob
      // asynchronously, so a 20+ MB archive ends up as a 0-byte file.
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
      return;
    }

    // Native path: write into the app cache (no storage permission needed),
    // then hand the file to the system share sheet.
    // ponytail: buffers the whole file (base64) in memory; fine for small archives.
    // For multi-GB native export, stream to a server instead (web pivot) or add chunked writes.
    const isJson = blob.type.includes('json') || filename.endsWith('.json');
    const data = isJson ? await blob.text() : await blobToBase64(blob);

    // Plugin v8 writes binary only when `encoding` is omitted and `data` is base64.
    await Filesystem.writeFile({
      path: filename,
      data,
      directory: Directory.Cache,
      ...(isJson ? { encoding: Encoding.UTF8 } : {}),
    });

    const { uri } = await Filesystem.getUri({
      path: filename,
      directory: Directory.Cache,
    });

    await Share.share({
      title: filename,
      files: [uri],
      dialogTitle: 'Simpan atau bagikan cadangan Atlas',
    });
  };

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="backup-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    >
      <div className="w-full max-w-lg bg-museum-surface rounded-2xl border border-museum-border shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-museum-border bg-museum-card">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-earth-400" />
            <h2 id="backup-modal-title" className="font-serif text-lg text-parchment-100 font-semibold">
              Manajemen Cadangan & Ekspor
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup Dialog Cadangan"
            className="p-1 rounded text-stone-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-museum-border bg-museum-base/50">
          <button
            onClick={() => { setActiveTab('export'); setStatusMessage(null); }}
            className={`flex-1 py-3 text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'export'
                ? 'text-earth-300 border-b-2 border-earth-400 bg-museum-surface'
                : 'text-stone-400 hover:text-parchment-200'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor Cadangan</span>
          </button>
          <button
            onClick={() => { setActiveTab('import'); setStatusMessage(null); }}
            className={`flex-1 py-3 text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'import'
                ? 'text-earth-300 border-b-2 border-earth-400 bg-museum-surface'
                : 'text-stone-400 hover:text-parchment-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Impor & Pulihkan</span>
          </button>
        </div>

        {/* Storage Quota Usage Bar */}
        {storageQuota && (
          <div className="px-6 py-2.5 bg-museum-card/40 border-b border-museum-border/70 flex items-center justify-between text-xs font-mono text-stone-300">
            <span className="flex items-center gap-1.5 text-stone-400">
              <Database className="w-3.5 h-3.5 text-sky-400" />
              <span>Memori Laptop (IndexedDB):</span>
            </span>
            <span className="text-stone-200">
              <strong className="text-sky-300">{storageQuota.usageFormatted}</strong> / ~{storageQuota.quotaFormatted} ({storageQuota.usagePercentage}%)
            </span>
          </div>
        )}

        {/* Status notice */}
        {statusMessage && (
          <div className={`px-6 py-3 text-xs flex items-start gap-2 border-b ${
            statusMessage.type === 'success'
              ? 'bg-moss-500/20 text-moss-300 border-moss-500/30'
              : statusMessage.type === 'warning'
              ? 'bg-amber-500/15 text-amber-200 border-amber-500/40'
              : 'bg-red-950/40 text-red-300 border-red-800/40'
          }`}>
            {statusMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />}
            <div className="space-y-1">
              <span className="block">{statusMessage.text}</span>
              {statusMessage.details?.map((detail, index) => (
                <span key={index} className="block opacity-90">• {detail}</span>
              ))}
            </div>
          </div>
        )}

        {/* Tab Body */}
        <div className="p-6 space-y-5">
          {activeTab === 'export' ? (
            <div className="space-y-4">
              <p className="text-xs text-stone-300 leading-relaxed font-light">
                Generate a standalone backup file containing all your documented places, memories, travel reflections, and souvenirs.
              </p>

              {/* Encryption toggle */}
              <div className="p-4 rounded-lg bg-museum-card border border-museum-border space-y-3">
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2 text-xs font-mono text-parchment-200">
                    <Lock className="w-3.5 h-3.5 text-earth-400" />
                    <span>Encrypt with AES-GCM 256-bit</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={encryptExport}
                    onChange={e => setEncryptExport(e.target.checked)}
                    className="accent-earth-500 w-4 h-4"
                  />
                </label>

                {encryptExport && (
                  <div className="space-y-2 pt-2 border-t border-museum-border/50">
                    <div>
                      <label className="text-[11px] font-mono text-stone-400 block mb-1">Passphrase</label>
                      <input
                        type="password"
                        placeholder="Choose a strong password..."
                        value={exportPassword}
                        onChange={e => setExportPassword(e.target.value)}
                        className="w-full bg-museum-surface border border-museum-border rounded px-3 py-1.5 text-xs text-parchment-100 focus:outline-none focus:border-earth-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-mono text-stone-400 block mb-1">Confirm Passphrase</label>
                      <input
                        type="password"
                        placeholder="Re-enter password..."
                        value={exportPasswordConfirm}
                        onChange={e => setExportPasswordConfirm(e.target.value)}
                        className="w-full bg-museum-surface border border-museum-border rounded px-3 py-1.5 text-xs text-parchment-100 focus:outline-none focus:border-earth-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  variant="primary"
                  onClick={handleExport}
                  disabled={isExporting}
                  icon={<Download className="w-3.5 h-3.5" />}
                >
                  {isExporting ? 'Generating...' : encryptExport ? 'Export Encrypted (.atlas.enc)' : 'Export Archive (.zip)'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-stone-300 leading-relaxed font-light">
                Select an existing `.json` or encrypted `.atlas.enc` backup file to restore into your local Atlas.
              </p>

              <div>
                <input
                  type="file"
                  accept=".json,.zip,.enc,.atlas.enc"
                  onChange={handleFileSelect}
                  className="w-full text-xs text-stone-400 file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-mono file:bg-museum-card file:text-earth-300 hover:file:bg-museum-hover cursor-pointer"
                />
              </div>

              {isEncryptedFile && (
                <div className="p-3.5 rounded-lg bg-museum-card border border-earth-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-earth-300">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Encrypted File Detected</span>
                  </div>
                  <input
                    type="password"
                    placeholder="Enter decryption password..."
                    value={importPassword}
                    onChange={e => setImportPassword(e.target.value)}
                    className="w-full bg-museum-surface border border-museum-border rounded px-3 py-1.5 text-xs text-parchment-100 focus:outline-none focus:border-earth-500"
                  />
                </div>
              )}

              {(parsedRawData || isZipArchive) && (
                <div className="space-y-2 pt-2 border-t border-museum-border/50">
                  <label className="text-[11px] font-mono text-stone-400 block">Import Mode</label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setImportMode('merge')}
                      className={`p-2.5 rounded border text-left cursor-pointer transition-colors ${
                        importMode === 'merge' ? 'bg-earth-500/20 border-earth-400 text-earth-300' : 'bg-museum-card border-museum-border text-stone-400'
                      }`}
                    >
                      <span className="font-semibold block">Merge Records</span>
                      <span className="text-[10px] text-stone-400">Keep current & add new</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setImportMode('replace')}
                      className={`p-2.5 rounded border text-left cursor-pointer transition-colors ${
                        importMode === 'replace' ? 'bg-red-950/40 border-red-500/50 text-red-300' : 'bg-museum-card border-museum-border text-stone-400'
                      }`}
                    >
                      <span className="font-semibold block">Full Replace</span>
                      <span className="text-[10px] text-stone-400">Overwrite entire archive</span>
                    </button>
                  </div>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <Button
                  variant="primary"
                  onClick={handleImport}
                  disabled={(!parsedRawData && !isZipArchive) || isImporting}
                  icon={<Upload className="w-3.5 h-3.5" />}
                >
                  {isImporting ? 'Decrypting & Importing...' : 'Restore Archive'}
                </Button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
