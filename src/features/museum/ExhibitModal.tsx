/**
 * ExhibitModal.tsx
 * Interactive Curatorial Detail Modal for Museum Mini 3D ("195 Negara, 1 Cerita")
 */

import React, { useEffect, useMemo } from 'react';
import { type InteractableExhibit } from './museumEngine/types';
import { storageService } from '../../core/services/storageService';
import { type Country, type Memory, type Souvenir, type AtlasStats } from '../../core/contracts';

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
  // Safe read-only storage queries
  const stats = useMemo<AtlasStats>(() => {
    try {
      return storageService.getStats();
    } catch {
      return {
        totalCountriesDocumented: 0,
        totalCountriesVisited: 0,
        totalMemories: 0,
        totalPlaces: 0,
        totalPhotos: 0,
        totalSouvenirs: 0,
      };
    }
  }, []);

  const memories = useMemo<Memory[]>(() => {
    try {
      return storageService.getMemories();
    } catch {
      return [];
    }
  }, []);

  const souvenirs = useMemo<Souvenir[]>(() => {
    try {
      return storageService.getSouvenirs();
    } catch {
      return [];
    }
  }, []);

  const countries = useMemo<Country[]>(() => {
    try {
      return storageService.getCountries();
    } catch {
      return [];
    }
  }, []);

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

  const renderPersonalConnection = () => {
    if (!exhibit) return null;

    switch (exhibit.id) {
      case 'intro': {
        const visitedPercent = ((stats.totalCountriesVisited / 195) * 100).toFixed(1);
        return (
          <div className="mb-6 p-4 rounded-xl bg-parchment-900/60 border border-museum-gold/30 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono uppercase tracking-wider text-museum-gold font-bold flex items-center gap-1.5">
                <span>📊</span> Rekam Jejak Progres Project Atlas
              </h4>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-museum-gold/20 text-museum-gold font-bold">
                {stats.totalCountriesVisited} / 195 Negara ({visitedPercent}%)
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-black/40 rounded-full h-2 overflow-hidden border border-parchment-800">
              <div
                className="bg-gradient-to-r from-museum-gold to-amber-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(2, (stats.totalCountriesVisited / 195) * 100)}%` }}
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center font-mono">
              <div className="p-2 rounded-lg bg-black/30 border border-parchment-800/50">
                <div className="text-[10px] text-parchment-400">Terdokumentasi</div>
                <div className="text-sm font-bold text-parchment-100">{stats.totalCountriesDocumented}</div>
              </div>
              <div className="p-2 rounded-lg bg-black/30 border border-parchment-800/50">
                <div className="text-[10px] text-parchment-400">Total Memori</div>
                <div className="text-sm font-bold text-parchment-100">{stats.totalMemories}</div>
              </div>
              <div className="p-2 rounded-lg bg-black/30 border border-parchment-800/50">
                <div className="text-[10px] text-parchment-400">Lokasi Unik</div>
                <div className="text-sm font-bold text-parchment-100">{stats.totalPlaces}</div>
              </div>
              <div className="p-2 rounded-lg bg-black/30 border border-parchment-800/50">
                <div className="text-[10px] text-parchment-400">Koleksi Suvenir</div>
                <div className="text-sm font-bold text-museum-gold">{stats.totalSouvenirs}</div>
              </div>
            </div>
          </div>
        );
      }

      case 'globe': {
        const visitedList = countries.filter(c => c.status === 'visited' || c.status === 'documented');
        return (
          <div className="mb-6 p-4 rounded-xl bg-blue-950/30 border border-blue-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono uppercase tracking-wider text-blue-400 font-bold flex items-center gap-1.5">
                <span>🌐</span> Negara Terjelajah di Bola Dunia ({visitedList.length})
              </h4>
              <span className="text-[10px] font-mono text-parchment-400">
                Klik negara untuk melihat di Atlas Dunia
              </span>
            </div>
            {visitedList.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1">
                {visitedList.map(c => (
                  <button
                    key={c.code}
                    onClick={() => onSelectCountry?.(c.code)}
                    className="px-2.5 py-1 rounded-md text-xs font-mono bg-blue-900/40 border border-blue-600/40 text-blue-200 hover:bg-blue-800/60 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                    title={`${c.name} (${c.capital})`}
                  >
                    <span>📍</span>
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-xs font-mono text-parchment-400 italic">
                Belum ada negara yang ditandai sebagai dikunjungi. Tandai negara di Atlas Dunia untuk menghubungkannya ke poros bola dunia.
              </p>
            )}
          </div>
        );
      }

      case 'gallery': {
        const photoMemories = memories.filter(m => m.coverImage?.uri || (m.mediaReferences && m.mediaReferences.length > 0));
        return (
          <div className="mb-6 p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono uppercase tracking-wider text-museum-gold font-bold flex items-center gap-1.5">
                <span>📸</span> Arsip Foto Perjalanan Pribadi ({stats.totalPhotos} Foto)
              </h4>
              <span className="text-[10px] font-mono text-parchment-400">
                Tersambung ke Galeri Dinding
              </span>
            </div>
            {photoMemories.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto p-1">
                {photoMemories.slice(0, 6).map(m => (
                  <div key={m.id} className="rounded-lg bg-black/40 border border-parchment-800 overflow-hidden flex flex-col">
                    {m.coverImage?.uri ? (
                      <img
                        src={m.coverImage.uri}
                        alt={m.title}
                        className="w-full h-20 object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-20 bg-parchment-900 flex items-center justify-center text-xs text-parchment-500">
                        Foto
                      </div>
                    )}
                    <div className="p-1.5 text-[10px] font-mono">
                      <div className="text-parchment-200 font-bold truncate">{m.title}</div>
                      <div className="text-parchment-400">{m.countryCode} · {m.placeName}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs font-mono text-parchment-400 italic">
                Belum ada dokumentasi foto pribadi. Unggah foto pada jurnal perjalanan untuk memajangnya di dinding galeri.
              </p>
            )}
          </div>
        );
      }

      case 'flags': {
        const visitedList = countries.filter(c => c.status === 'visited' || c.status === 'documented');
        return (
          <div className="mb-6 p-4 rounded-xl bg-red-950/30 border border-red-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono uppercase tracking-wider text-red-400 font-bold flex items-center gap-1.5">
                <span>🚩</span> Mata Uang & Valuta Negara Terjelajah ({visitedList.length})
              </h4>
              <span className="text-[10px] font-mono text-parchment-400">
                Numismatik
              </span>
            </div>
            {visitedList.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-36 overflow-y-auto p-1">
                {visitedList.slice(0, 9).map(c => (
                  <div key={c.code} className="p-2 rounded-lg bg-black/40 border border-parchment-800/60 text-xs font-mono flex items-center justify-between">
                    <div>
                      <div className="text-parchment-200 font-bold">{c.code}</div>
                      <div className="text-[10px] text-parchment-400 truncate max-w-[90px]">{c.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-museum-gold font-bold">{c.capital || c.continent}</div>
                      <div className="text-[9px] text-parchment-500">{c.status === 'documented' ? 'Terdokumentasi' : 'Terkunjungi'}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs font-mono text-parchment-400 italic">
                Belum ada data mata uang negara terjelajah. Tandai negara yang pernah dikunjungi untuk mengisi etalase numismatik.
              </p>
            )}
          </div>
        );
      }

      case 'souvenir': {
        return (
          <div className="mb-6 p-4 rounded-xl bg-teal-950/30 border border-teal-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono uppercase tracking-wider text-teal-400 font-bold flex items-center gap-1.5">
                <span>🏺</span> Suvenir Pribadi di Lemari Vitrine ({souvenirs.length})
              </h4>
              <span className="text-[10px] font-mono text-parchment-400">
                Koleksi Fisik
              </span>
            </div>
            {souvenirs.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto p-1">
                {souvenirs.map(s => (
                  <div key={s.id} className="p-2 rounded-lg bg-black/40 border border-parchment-800/60 flex items-center gap-2.5 text-xs font-mono">
                    <span className="text-lg">🎁</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-parchment-100 font-bold truncate">{s.name}</div>
                      <div className="text-[10px] text-teal-300">
                        {s.countryCode} · {s.category || 'Suvenir'}
                      </div>
                    </div>
                    {s.acquiredDate && (
                      <span className="text-[9px] text-parchment-500">{s.acquiredDate}</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs font-mono text-parchment-400 italic">
                Belum ada suvenir fisik yang dicatat. Buka Memori Perjalanan untuk mendata suvenir dari negara yang dikunjungi.
              </p>
            )}
          </div>
        );
      }

      case 'reading': {
        const recentJournals = memories.slice(0, 3);
        return (
          <div className="mb-6 p-4 rounded-xl bg-purple-950/30 border border-purple-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono uppercase tracking-wider text-purple-400 font-bold flex items-center gap-1.5">
                <span>📖</span> Jurnal Lapangan & Catatan Terbaru ({memories.length})
              </h4>
              <span className="text-[10px] font-mono text-parchment-400">
                Pustaka
              </span>
            </div>
            {recentJournals.length > 0 ? (
              <div className="space-y-2 max-h-44 overflow-y-auto p-1">
                {recentJournals.map(j => (
                  <div key={j.id} className="p-2.5 rounded-lg bg-black/40 border border-parchment-800/60 text-xs font-mono">
                    <div className="flex items-center justify-between text-[10px] text-purple-300 mb-1">
                      <span>{j.countryCode} · {j.placeName || 'Catatan'}</span>
                      <span className="text-parchment-500">{j.dateStart}</span>
                    </div>
                    <div className="text-parchment-100 font-bold font-serif text-sm mb-1">{j.title}</div>
                    {j.summary && (
                      <p className="text-[11px] text-parchment-400 line-clamp-2 italic">{j.summary}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs font-mono text-parchment-400 italic">
                Belum ada jurnal lapangan tersimpan. Tulis memori ekspedisi untuk mengisi arsip bacaan museum.
              </p>
            )}
          </div>
        );
      }

      default:
        return null;
    }
  };

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

        {/* Dynamic Personal Travel Connection (Project Atlas Live Integration) */}
        {renderPersonalConnection()}

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
