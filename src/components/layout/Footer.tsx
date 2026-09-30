import React from 'react';
import { Compass, ShieldCheck, RefreshCw, Trash2 } from 'lucide-react';
import { storageService } from '../../core/services/storageService';

interface FooterProps {
  onRefresh: () => void;
  onOpenBackup: () => void;
  onOpenPassport: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onRefresh, onOpenBackup, onOpenPassport }) => {
  const handleResetSeed = () => {
    if (window.confirm('Pulihkan arsip ke data contoh kurasi memori & destinasi?')) {
      storageService.resetToCuratedSeed();
      onRefresh();
    }
  };

  const handleClearEmpty = () => {
    if (window.confirm('Kosongkan semua memori dan mulai dengan atlas bersih baru?')) {
      storageService.clearAllToEmpty();
      onRefresh();
    }
  };

  return (
    <footer className="border-t border-museum-border bg-museum-surface mt-20 text-parchment-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Compass className="w-5 h-5 text-earth-400" />
              <span className="font-serif text-base text-parchment-100">Project Atlas</span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              Atlas digital pribadi dan museum kenangan masa depan, mengabadikan setiap momen di penjuru dunia dengan fotografi otentik.
            </p>
          </div>

          <div className="text-xs space-y-2">
            <div className="flex items-center gap-2 text-earth-300 font-mono">
              <ShieldCheck className="w-4 h-4 text-earth-400" />
              <span>100% Local-First & Privasi Terjaga</span>
            </div>
            <p className="text-stone-400 leading-relaxed">
              Catatan, memori, dan foto Anda disimpan seutuhnya di browser laptop Anda. Tanpa analitik cloud, tanpa pelacak, dan tanpa sinkronisasi pihak ketiga.
            </p>
          </div>

          <div className="text-xs space-y-2 md:text-right">
            <span className="font-mono text-stone-500 uppercase tracking-wider block">Utilitas Arsip</span>
            <div className="flex flex-wrap items-center md:justify-end gap-2 pt-1">
              <button
                onClick={onOpenPassport}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-museum-card hover:bg-museum-hover border border-museum-border text-earth-300 hover:text-earth-200 transition-colors cursor-pointer text-xs"
              >
                <span>Buku Paspor</span>
              </button>
              <button
                onClick={onOpenBackup}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-museum-card hover:bg-museum-hover border border-museum-border text-earth-300 hover:text-earth-200 transition-colors cursor-pointer text-xs"
              >
                <span>Cadangkan Arsip</span>
              </button>
              <button
                onClick={handleResetSeed}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-museum-card hover:bg-museum-hover border border-museum-border text-stone-300 transition-colors cursor-pointer text-xs"
                title="Pulihkan data contoh destinasi dan memori"
              >
                <RefreshCw className="w-3 h-3 text-earth-400" />
                <span>Reset Contoh</span>
              </button>
              <button
                onClick={handleClearEmpty}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-museum-card hover:bg-museum-hover border border-museum-border text-stone-400 hover:text-red-300 transition-colors cursor-pointer text-xs"
                title="Kosongkan semua data arsip"
              >
                <Trash2 className="w-3 h-3" />
                <span>Kosongkan</span>
              </button>
            </div>
          </div>

        </div>

        <div className="border-t border-museum-border/60 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 font-mono">
          <span>PROJECT ATLAS — EDISI BAHASA INDONESIA</span>
          <span className="mt-2 sm:mt-0">PENYIMPANAN LOKAL • ENKRIPSI AES-GCM • DOSIR PASPOR DIGITAL</span>
        </div>
      </div>
    </footer>
  );
};
