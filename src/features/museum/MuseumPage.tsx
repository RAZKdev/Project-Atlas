/**
 * MuseumPage.tsx
 * Full-screen container for Museum Mini 3D ("195 Negara, 1 Cerita")
 *
 * Integrates:
 * - 3D First-Person & Orbit Canvas (Museum3D)
 * - Accessible 2D Curatorial Gallery Fallback
 * - Controls Help Modal (WASD, Mouse Look, Space Jump, Shift Sprint, E Inspect)
 * - Procedural Acoustic Gallery Atmosphere (Web Audio API ambient tone)
 */

import React, { useState, useEffect, useRef } from 'react';
import { Museum3D } from './Museum3D';
import { MUSEUM_ZONES, type MuseumZone } from '../../data/museumData';

interface MuseumPageProps {
  onSelectCountry?: (countryCode: string) => void;
}

export const MuseumPage: React.FC<MuseumPageProps> = ({ onSelectCountry }) => {
  const [selectedZone, setSelectedZone] = useState<MuseumZone | null>(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [is2DView, setIs2DView] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(true);

  // Audio ambience ref
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Toggle ambient acoustic drone
  const toggleAudio = () => {
    try {
      if (isAudioMuted) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AudioCtx) return;

        if (!audioCtxRef.current) {
          const ctx = new AudioCtx();
          audioCtxRef.current = ctx;

          // Warm harmonic drone (110 Hz A2 fundamental + 165 Hz E3 fifth)
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const filter = ctx.createBiquadFilter();
          const gain = ctx.createGain();

          osc1.type = 'sine';
          osc1.frequency.setValueAtTime(110, ctx.currentTime);
          osc2.type = 'triangle';
          osc2.frequency.setValueAtTime(165, ctx.currentTime);

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(260, ctx.currentTime);

          gain.gain.setValueAtTime(0.025, ctx.currentTime); // gentle background whisper

          osc1.connect(filter);
          osc2.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);

          osc1.start();
          osc2.start();
          gainNodeRef.current = gain;
        } else {
          if (audioCtxRef.current.state === 'suspended') {
            audioCtxRef.current.resume();
          }
          gainNodeRef.current?.gain.setTargetAtTime(0.025, audioCtxRef.current.currentTime, 0.1);
        }
        setIsAudioMuted(false);
      } else {
        if (audioCtxRef.current && gainNodeRef.current) {
          gainNodeRef.current.gain.setTargetAtTime(0.0001, audioCtxRef.current.currentTime, 0.1);
        }
        setIsAudioMuted(true);
      }
    } catch {
      // Audio playback restrictions
    }
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="flex flex-col bg-museum-dark text-parchment-100" style={{ height: 'calc(100vh - 64px)' }}>
      {/* ── Top Header Strip ──────────────────────────────────────────────── */}
      <div className="flex-shrink-0 border-b border-parchment-800/80 bg-museum-surface/95 backdrop-blur-md px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4 z-20">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-base sm:text-lg text-parchment-100 tracking-wide font-bold">
              Museum Mini — <span className="text-museum-gold">195 Negara, 1 Cerita</span>
            </h1>
            <span className="hidden md:inline-flex items-center text-[10px] font-mono px-2 py-0.5 rounded-full bg-earth-900/60 border border-earth-700/60 text-earth-300">
              Skala Nyata 1:1
            </span>
          </div>
          <p className="text-[11px] font-mono text-parchment-400 mt-0.5">
            Bangunan 6×8 m (48 m²) · 6 Zona Kurasi · Fisika First-Person & Orbit
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Controls Guide Button */}
          <button
            onClick={() => setIsHelpOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg border border-parchment-700/60 bg-parchment-900/40 text-xs font-mono text-parchment-300 hover:text-white hover:border-museum-gold transition-colors cursor-pointer"
            title="Panduan Navigasi & Kontrol"
          >
            <span>⌨️</span>
            <span className="hidden sm:inline">Kontrol</span>
          </button>

          {/* Audio Ambience Toggle */}
          <button
            onClick={toggleAudio}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-mono transition-colors cursor-pointer ${
              !isAudioMuted
                ? 'border-museum-gold bg-museum-gold/20 text-museum-gold'
                : 'border-parchment-700/60 bg-parchment-900/40 text-parchment-400 hover:text-parchment-200'
            }`}
            title={!isAudioMuted ? 'Matikan Suara Galeri' : 'Nyalakan Suara Galeri'}
          >
            <span>{!isAudioMuted ? '🔊' : '🔇'}</span>
            <span className="hidden sm:inline">{!isAudioMuted ? 'Suara ON' : 'Suara'}</span>
          </button>

          {/* 2D Fallback Switcher */}
          <button
            onClick={() => setIs2DView(!is2DView)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-mono transition-colors cursor-pointer ${
              is2DView
                ? 'border-earth-500 bg-earth-600/30 text-earth-200'
                : 'border-parchment-700/60 bg-parchment-900/40 text-parchment-400 hover:text-parchment-200'
            }`}
            title="Alihkan ke Katalog Kurasi 2D"
          >
            <span>{is2DView ? '🏛️' : '📋'}</span>
            <span className="hidden sm:inline">{is2DView ? 'Mode 3D' : 'Katalog 2D'}</span>
          </button>
        </div>
      </div>

      {/* ── Main View (3D Canvas or 2D Accessible Catalog) ────────────────── */}
      <div className="flex-1 relative overflow-hidden">
        {!is2DView ? (
          <Museum3D
            onSelectCountry={onSelectCountry}
            onZoneSelect={(exhibit) => {
              const matchedZone = MUSEUM_ZONES.find((z) => z.id === exhibit.zoneId);
              if (matchedZone) setSelectedZone(matchedZone);
            }}
          />
        ) : (
          /* ── Accessible 2D Curatorial Gallery ── */
          <div className="h-full overflow-y-auto p-6 sm:p-8 max-w-5xl mx-auto space-y-6">
            <div className="p-6 rounded-2xl border border-museum-gold/30 bg-museum-surface/90">
              <span className="text-xs font-mono text-museum-gold uppercase tracking-wider block mb-1">
                Katalog Kuratorial Terbuka
              </span>
              <h2 className="font-serif text-2xl text-parchment-100 font-bold mb-2">
                Museum Mini Project Atlas — &ldquo;195 Negara, 1 Cerita&rdquo;
              </h2>
              <p className="text-sm text-parchment-300 leading-relaxed">
                Pengalaman museum personal berdimensi 6×8 meter yang merangkum artefak, peta, bendera,
                fotografi, dan dokumentasi ekspedisi dari seluruh dunia. Versi ini dirancang untuk kemudahan
                aksesibilitas dan peramban tanpa dukungan akselerasi grafis 3D.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MUSEUM_ZONES.map((zone) => (
                <div
                  key={zone.id}
                  className="p-5 rounded-2xl border border-parchment-800 bg-museum-surface/80 hover:border-museum-gold/50 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{zone.icon}</span>
                    <h3 className="font-serif text-lg font-bold text-parchment-100">{zone.name}</h3>
                  </div>
                  <p className="text-xs text-parchment-300 leading-relaxed mb-4">{zone.description}</p>
                  <button
                    onClick={() => {
                      setIs2DView(false);
                    }}
                    className="text-xs font-mono text-museum-gold hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>Lihat di Mode 3D</span>
                    <span>→</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Controls Help Modal ───────────────────────────────────────────── */}
      {isHelpOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="controls-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn"
          onClick={() => setIsHelpOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl border border-museum-gold/40 bg-museum-surface p-6 text-parchment-100 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 id="controls-modal-title" className="font-serif text-xl font-bold text-parchment-100 flex items-center gap-2">
                <span>🎮</span> Panduan Navigasi & Eksplorasi
              </h3>
              <button
                onClick={() => setIsHelpOpen(false)}
                className="w-8 h-8 rounded-full border border-parchment-700 text-parchment-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs font-mono leading-relaxed mb-6">
              <div className="p-3 rounded-xl bg-parchment-900/60 border border-parchment-800">
                <h4 className="text-museum-gold font-bold mb-2 uppercase tracking-wider">
                  Mode Penjelajah (First-Person Walkthrough)
                </h4>
                <ul className="space-y-2 text-parchment-300">
                  <li className="flex items-center justify-between">
                    <span>Maju / Mundur / Geser Samping:</span>
                    <span className="font-bold text-parchment-100"><kbd className="px-1.5 py-0.5 rounded bg-parchment-800">W</kbd> <kbd className="px-1.5 py-0.5 rounded bg-parchment-800">A</kbd> <kbd className="px-1.5 py-0.5 rounded bg-parchment-800">S</kbd> <kbd className="px-1.5 py-0.5 rounded bg-parchment-800">D</kbd></span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Arah Pandangan (Mouse Look):</span>
                    <span className="font-bold text-parchment-100">Gerakkan Tetikus</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Lari Cepat (Sprint):</span>
                    <span className="font-bold text-parchment-100"><kbd className="px-1.5 py-0.5 rounded bg-parchment-800">Shift</kbd></span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Lompat:</span>
                    <span className="font-bold text-parchment-100"><kbd className="px-1.5 py-0.5 rounded bg-parchment-800">Spasi</kbd></span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Periksa Koleksi Pameran:</span>
                    <span className="font-bold text-museum-gold"><kbd className="px-1.5 py-0.5 rounded bg-museum-gold text-museum-dark font-bold">E</kbd> atau Klik Kiri</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Lepaskan Kursor Tetikus:</span>
                    <span className="font-bold text-parchment-100"><kbd className="px-1.5 py-0.5 rounded bg-parchment-800">ESC</kbd></span>
                  </li>
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-parchment-900/60 border border-parchment-800">
                <h4 className="text-earth-400 font-bold mb-2 uppercase tracking-wider">
                  Pengguna Layar Sentuh (Ponsel / Tablet)
                </h4>
                <p className="text-parchment-300">
                  Gunakan <span className="text-parchment-100 font-bold">Joystick Virtual</span> di sisi kiri layar untuk melangkah ke segala arah, dan usap area kanan layar untuk menengok bebas. Tekan tombol <span className="text-museum-gold font-bold">Periksa</span> saat mendekati koleksi.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsHelpOpen(false)}
              className="w-full py-2.5 rounded-lg bg-museum-gold text-museum-dark font-bold text-xs font-mono uppercase tracking-wider hover:bg-amber-400 transition-colors cursor-pointer"
            >
              Mengerti & Lanjutkan
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
