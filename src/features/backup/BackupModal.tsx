import React, { useState, useEffect, useRef } from 'react';
import { X, Download, Upload, Shield, Lock, FileJson, AlertCircle, CheckCircle2, Database } from 'lucide-react';
import { storageService } from '../../core/services/storageService';
import { mediaStore } from '../../core/services/mediaStore';
import { CryptoService, EncryptedPayload } from '../../core/services/cryptoService';
import { Button } from '../../components/ui/Button';
import { useModalFocusTrap } from '../../core/hooks/useModalFocusTrap';

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
  const [parsedRawData, setParsedRawData] = useState<string | null>(null);
  const [importMode, setImportMode] = useState<'merge' | 'replace'>('merge');
  const [isImporting, setIsImporting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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
      const plainJson = await storageService.createBackupArchive();
      const dateStr = new Date().toISOString().split('T')[0];

      if (encryptExport) {
        const encrypted = await CryptoService.encryptData(plainJson, exportPassword);
        const blob = new Blob([JSON.stringify(encrypted, null, 2)], { type: 'application/json' });
        downloadBlob(blob, `project-atlas-${dateStr}.atlas.enc`);
      } else {
        const blob = new Blob([plainJson], { type: 'application/json' });
        downloadBlob(blob, `project-atlas-${dateStr}.json`);
      }

      setStatusMessage({ type: 'success', text: 'Archive exported successfully!' });
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
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);

      if (parsed.version === '2.0-enc') {
        setIsEncryptedFile(true);
        setParsedRawData(text);
      } else if (parsed.memories) {
        setIsEncryptedFile(false);
        setParsedRawData(text);
      } else {
        setStatusMessage({ type: 'error', text: 'Unrecognized archive format.' });
        setImportFile(null);
        setParsedRawData(null);
      }
    } catch {
      setStatusMessage({ type: 'error', text: 'Could not read file. Invalid JSON.' });
      setImportFile(null);
      setParsedRawData(null);
    }
  };

  const handleImport = async () => {
    if (!parsedRawData) return;
    setStatusMessage(null);
    setIsImporting(true);

    try {
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

      const res = await storageService.importBackupArchive(jsonContent, importMode);
      setStatusMessage({
        type: 'success',
        text: `Archive imported! (${res.memoriesCount} memories in archive).`
      });
      onSuccess();
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Import failed.' });
    } finally {
      setIsImporting(false);
    }
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
          <div className={`px-6 py-3 text-xs flex items-center gap-2 ${
            statusMessage.type === 'success' ? 'bg-moss-500/20 text-moss-300 border-b border-moss-500/30' : 'bg-red-950/40 text-red-300 border-b border-red-800/40'
          }`}>
            {statusMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{statusMessage.text}</span>
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
                  {isExporting ? 'Generating...' : encryptExport ? 'Export Encrypted (.atlas.enc)' : 'Export JSON (.json)'}
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
                  accept=".json,.enc,.atlas.enc"
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

              {parsedRawData && (
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
                  disabled={!parsedRawData || isImporting}
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
