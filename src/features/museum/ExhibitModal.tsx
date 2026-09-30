/**
 * ExhibitModal.tsx
 * Interactive Curatorial Detail Modal for Museum Mini 3D ("195 Negara, 1 Cerita")
 */

import React, { useEffect } from 'react';
import { type InteractableExhibit } from './museumEngine/types';

interface ExhibitModalProps {
  exhibit: InteractableExhibit | null;
  onClose: () => void;
  onSelectCountry?: (countryCode: string) => void;
}

export const ExhibitModal: React.FC<ExhibitModalProps> = ({
  exhibit,
  onClose,
  onSelectCountry,
}) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Gentle acoustic chime when opening exhibit
  useEffect(() => {
    if (!exhibit) return;
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        const ctx = new AudioContextClass();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(528, ctx.currentTime); // 528 Hz pleasant harmonic
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.18);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.36);
      }
    } catch {
      // Audio autoplay policy fallback
    }
  }, [exhibit]);

  if (!exhibit) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="exhibit-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md transition-all animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-museum-gold/30 bg-museum-surface shadow-2xl p-6 sm:p-8 text-parchment-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Tutup Detail Pameran"
          className="absolute top-5 right-5 w-9 h-9 rounded-full border border-parchment-700/60 bg-museum-surface/90 text-parchment-300 hover:text-white hover:border-museum-gold transition-colors flex items-center justify-center cursor-pointer text-base"
        >
          ✕
        </button>

        {/* Header Badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">{exhibit.icon}</span>
          <span className="text-xs font-mono font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-museum-gold/20 text-museum-gold border border-museum-gold/40">
            {exhibit.category}
          </span>
          <span className="text-xs font-mono text-parchment-400">
            Zona {exhibit.zoneId.toUpperCase()}
          </span>
        </div>

        {/* Title & Subtitle */}
        <h2 id="exhibit-modal-title" className="font-serif text-2xl sm:text-3xl text-parchment-100 font-bold tracking-tight mb-1">
          {exhibit.title}
        </h2>
        <p className="font-serif italic text-sm text-museum-gold mb-5">
          {exhibit.subtitle}
        </p>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-museum-gold/60 via-parchment-700/40 to-transparent mb-5" />

        {/* Main Curatorial Narrative */}
        <div className="space-y-4 mb-6 text-sm sm:text-base leading-relaxed text-parchment-200">
          <p>{exhibit.description}</p>
          <div className="p-4 rounded-xl bg-museum-surface/60 border border-parchment-700/50">
            <h4 className="text-xs font-mono uppercase tracking-wider text-museum-gold mb-1.5 flex items-center gap-1.5 font-bold">
              <span>✦</span> Narasi Kuratorial & Filosofi
            </h4>
            <p className="text-xs sm:text-sm text-parchment-300 italic leading-relaxed">
              &ldquo;{exhibit.story}&rdquo;
            </p>
          </div>
        </div>

        {/* Technical & Curatorial Specifications Table */}
        <div className="mb-6">
          <h4 className="text-xs font-mono uppercase tracking-wider text-parchment-400 mb-2.5 font-bold">
            Spesifikasi Koleksi & Preservasi
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
            {exhibit.specs.map((item, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-parchment-900/40 border border-parchment-800/60 flex flex-col justify-between"
              >
                <span className="text-parchment-500 mb-0.5">{item.label}</span>
                <span className="text-parchment-200 font-semibold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Related Sovereign Countries */}
        {exhibit.relatedCountries && exhibit.relatedCountries.length > 0 && (
          <div className="mb-6">
            <h4 className="text-xs font-mono uppercase tracking-wider text-parchment-400 mb-2 font-bold">
              Negara Terkait di Atlas
            </h4>
            <div className="flex flex-wrap gap-2">
              {exhibit.relatedCountries.map((code) => (
                <button
                  key={code}
                  onClick={() => onSelectCountry?.(code)}
                  className="px-3 py-1 rounded-md text-xs font-mono bg-earth-800/40 border border-earth-600/40 text-earth-300 hover:bg-earth-700/50 hover:border-earth-400 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>📍</span>
                  <span>{code}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Curator Note Banner */}
        <div className="p-3 rounded-lg bg-earth-950/60 border border-earth-800/70 text-xs text-parchment-300 leading-relaxed mb-6">
          <span className="text-earth-400 font-bold mr-1">Catatan Konservasi:</span>
          {exhibit.curatorNotes}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-parchment-800/60">
          <span className="text-[11px] font-mono text-parchment-500 hidden sm:inline">
            Tekan <kbd className="px-1.5 py-0.5 rounded bg-parchment-800 text-parchment-300 border border-parchment-700">ESC</kbd> untuk kembali menjelajah
          </span>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-museum-gold text-museum-dark font-medium text-xs font-mono uppercase tracking-wider hover:bg-amber-400 transition-colors shadow-lg cursor-pointer"
          >
            Lanjut Menjelajah Museum
          </button>
        </div>
      </div>
    </div>
  );
};
