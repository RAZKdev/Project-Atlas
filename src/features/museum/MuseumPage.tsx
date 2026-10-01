/**
 * MuseumPage.tsx
 * Complete Interactive Experience Container for Museum Mini 3D ("195 Negara, 1 Cerita")
 *
 * Architecture:
 * - Sub-Tab Navigation:
 *   1. 'overview' (Ikhtisar): Museum introduction, real-scale specs, and PROMINENT [MASUK KE SIMULASI MUSEUM] CTA
 *   2. 'memories' (Memori Perjalanan): Curated travel memories connected to museum zones (Zero accidental 3D trigger)
 *   3. 'gallery' (Galeri Koleksi): Accessible 2D curatorial vitrines of the 6 zones with full artifact metadata
 *   4. 'info' (Informasi & Denah): 6×8m architectural blueprint layout, technical metrics, and control guide
 * - Simulation Lifecycle Gating:
 *   * Default: simulationState = 'idle' (3D scene NOT mounted, ZERO pointer-lock hijacking)
 *   * Only launched via explicit user confirmation button
 *   * Seamless exit back to web sub-tabs via ESC, pause menu, or header exit button
 * - Ambient Acoustic Atmosphere:
 *   * Procedural Web Audio API dual-oscillator drone (110 Hz A2 fundamental + 165 Hz E3 harmonic)
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Museum3D } from './Museum3D';
import { MUSEUM_ZONES, type MuseumZone } from '../../data/museumData';
import { storageService } from '../../core/services/storageService';
import { type Memory } from '../../core/contracts';
import { type MuseumPageView, type SimulationState, type InteractableExhibit } from './museumEngine/types';
import { ExhibitModal } from './ExhibitModal';

interface MuseumPageProps {
  onSelectCountry?: (countryCode: string) => void;
}

export const MuseumPage: React.FC<MuseumPageProps> = ({ onSelectCountry }) => {
  // Navigation & Lifecycle state
  const [activeSubTab, setActiveSubTab] = useState<MuseumPageView>('overview');
  const [simulationState, setSimulationState] = useState<SimulationState>('idle');

  // Modal & Detail states
  const [selectedZone, setSelectedZone] = useState<MuseumZone | null>(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [selectedExhibit, setSelectedExhibit] = useState<InteractableExhibit | null>(null);
  const [memorySearch, setMemorySearch] = useState('');

  // Audio ambience state
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Load memories from storage service safely
  const memories: Memory[] = useMemo(() => {
    try {
      return storageService.getMemories();
    } catch {
      return [];
    }
  }, []);

  // Filter memories for the 'memories' sub-tab
  const filteredMemories = useMemo(() => {
    if (!memorySearch.trim()) return memories;
    const q = memorySearch.toLowerCase();
    return memories.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.countryCode.toLowerCase().includes(q) ||
        m.placeName?.toLowerCase().includes(q) ||
        m.summary?.toLowerCase().includes(q)
    );
  }, [memories, memorySearch]);

  // ── Web Audio API Ambient Gallery Tone ────────────────────────────────────
  const toggleAudio = () => {
    try {
      if (isAudioMuted) {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AudioCtx) return;

        if (!audioCtxRef.current) {
          const ctx = new AudioCtx();
          audioCtxRef.current = ctx;

          // Warm harmonic drone (110 Hz A2 fundamental + 165 Hz E3 harmonic fifth)
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

          gain.gain.setValueAtTime(0.025, ctx.currentTime);

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
      // Audio autoplay policy fallback
    }
  };

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  // ── Launch 3D Simulation (Explicit Action Only) ───────────────────────────
  const startSimulation = () => {
    setSimulationState('active');
  };

  // ── Exit 3D Simulation ────────────────────────────────────────────────────
  const exitSimulation = () => {
    if (document.pointerLockElement) {
      document.exitPointerLock();
    }
    setSimulationState('idle');
  };

  // ── ACTIVE 3D SIMULATION CONTAINER ────────────────────────────────────────
  if (simulationState === 'active') {
    return (
      <div className="relative w-full bg-museum-dark overflow-hidden" style={{ height: 'calc(100vh - 64px)' }}>
        {/* Top Exit Control Strip */}
        <div className="absolute top-4 right-4 z-40 flex items-center gap-2">
          <button
            onClick={exitSimulation}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-red-500/50 bg-museum-surface/90 backdrop-blur-md text-xs font-mono text-red-200 hover:bg-red-900/60 hover:text-white transition-all shadow-xl cursor-pointer"
            title="Keluar dari Simulasi 3D dan kembali ke Halaman Museum"
          >
            <span>✕</span>
            <span>Tutup Simulasi</span>
          </button>
        </div>

        {/* 3D Engine Component */}
        <Museum3D
          onSelectCountry={onSelectCountry}
          onExitSimulation={exitSimulation}
          onZoneSelect={(exhibit) => {
            const matchedZone = MUSEUM_ZONES.find((z) => z.id === exhibit.zoneId);
            if (matchedZone) setSelectedZone(matchedZone);
          }}
        />
      </div>
    );
  }

  // ── STANDARD 2D SUB-TAB INTERFACE (ZERO 3D HIJACKING) ─────────────────────
  return (
    <div className="flex flex-col bg-museum-dark text-parchment-100 min-h-screen">
      {/* ── Top Header Strip ──────────────────────────────────────────────── */}
      <div className="flex-shrink-0 border-b border-parchment-800/80 bg-museum-surface/95 backdrop-blur-md px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4 z-20 sticky top-0">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-base sm:text-xl text-parchment-100 tracking-wide font-bold">
              Museum Mini — <span className="text-museum-gold">195 Negara, 1 Cerita</span>
            </h1>
            <span className="hidden md:inline-flex items-center text-[10px] font-mono px-2 py-0.5 rounded-full bg-earth-900/60 border border-earth-700/60 text-earth-300">
              Skala Nyata 1:1
            </span>
          </div>
          <p className="text-[11px] font-mono text-parchment-400 mt-0.5">
            Paviliun Kurasi 6×8 m (48 m²) · Multi-POV First-Person & Karakter · Arsip 195 Negara
          </p>
        </div>

        {/* Action Controls & Navigation Tabs */}
        <div className="flex items-center gap-2">
          {/* Sub-Tabs Nav */}
          <div className="flex items-center rounded-xl border border-parchment-800 bg-parchment-900/60 p-1 text-xs font-mono">
            <button
              onClick={() => setActiveSubTab('overview')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeSubTab === 'overview'
                  ? 'bg-museum-gold text-museum-dark font-bold shadow'
                  : 'text-parchment-400 hover:text-parchment-100'
              }`}
            >
              🏛️ Ikhtisar
            </button>
            <button
              onClick={() => setActiveSubTab('memories')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeSubTab === 'memories'
                  ? 'bg-museum-gold text-museum-dark font-bold shadow'
                  : 'text-parchment-400 hover:text-parchment-100'
              }`}
            >
              📸 Memori ({memories.length})
            </button>
            <button
              onClick={() => setActiveSubTab('gallery')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeSubTab === 'gallery'
                  ? 'bg-museum-gold text-museum-dark font-bold shadow'
                  : 'text-parchment-400 hover:text-parchment-100'
              }`}
            >
              🏺 Galeri Zona
            </button>
            <button
              onClick={() => setActiveSubTab('info')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeSubTab === 'info'
                  ? 'bg-museum-gold text-museum-dark font-bold shadow'
                  : 'text-parchment-400 hover:text-parchment-100'
              }`}
            >
              📐 Denah & Info
            </button>
          </div>

          {/* Audio Ambience Toggle */}
          <button
            onClick={toggleAudio}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono transition-colors cursor-pointer ${
              !isAudioMuted
                ? 'border-museum-gold bg-museum-gold/20 text-museum-gold'
                : 'border-parchment-800 bg-parchment-900/40 text-parchment-400 hover:text-parchment-200'
            }`}
            title={!isAudioMuted ? 'Matikan Suara Galeri' : 'Nyalakan Suara Galeri'}
          >
            <span>{!isAudioMuted ? '🔊' : '🔇'}</span>
            <span className="hidden sm:inline">{!isAudioMuted ? 'Suara ON' : 'Suara'}</span>
          </button>
        </div>
      </div>

      {/* ── Main Sub-Tab Content ──────────────────────────────────────────── */}
      <div className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* ── SUB-TAB 1: IKHTISAR (OVERVIEW) ───────────────────────────────── */}
        {activeSubTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Hero Card with Prominent Start Simulation CTA */}
            <div className="relative overflow-hidden rounded-3xl border-2 border-museum-gold/60 bg-gradient-to-br from-museum-surface via-museum-dark to-black p-6 sm:p-10 shadow-2xl">
              <div className="relative z-10 max-w-2xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-museum-gold/15 border border-museum-gold/30 text-museum-gold text-xs font-mono">
                  <span>🏛️</span>
                  <span>Eksplorasi Interaktif Tiga Dimensi</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-4xl text-parchment-100 font-bold leading-tight">
                  Masuki Paviliun Pribadi <br />
                  <span className="text-museum-gold">&ldquo;195 Negara, 1 Cerita&rdquo;</span>
                </h2>
                <p className="text-sm sm:text-base text-parchment-300 leading-relaxed font-sans">
                  Bangunan kurasi 6×8 meter (48 m²) dengan skala manusia nyata 1:1. Bergerak bebas
                  menggunakan avatar penjelajah teranimasi lengkap, beralih antara 3 sudut pandang (First-Person,
                  Karakter Pundak, dan Sinematik), serta periksa koleksi suvenir, artefak, dan peta dunia.
                </p>

                {/* Explicit Start Simulation Button */}
                <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <button
                    onClick={startSimulation}
                    className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-museum-gold to-amber-500 text-museum-dark font-mono font-bold text-sm sm:text-base uppercase tracking-wider hover:brightness-110 active:scale-98 transition-all shadow-[0_0_24px_rgba(212,168,67,0.4)] cursor-pointer"
                  >
                    <span className="text-xl">🏛️</span>
                    <span>Masuk ke Simulasi Museum (3D)</span>
                  </button>
                  <span className="text-xs font-mono text-parchment-400 text-center sm:text-left">
                    Klik untuk membuka dunia 3D · Kursor & kontrol hanya aktif di dalam simulasi
                  </span>
                </div>
              </div>

              {/* Decorative Blueprint Corner Accent */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-museum-gold/5 rounded-full blur-3xl pointer-events-none" />
              <div className="hidden lg:block absolute bottom-6 right-8 text-right font-mono text-[11px] text-parchment-500 space-y-1">
                <div>SKALA BANGUNAN: 6.00 × 8.00 M</div>
                <div>TINGGI AVATAR: 1.70 M (MATA 1.60 M)</div>
                <div>ZONA PAMERAN: 6 AREA KURATORIAL</div>
              </div>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl border border-parchment-800 bg-museum-surface/70 space-y-2">
                <span className="text-2xl block">🎥</span>
                <h3 className="font-serif text-base font-bold text-parchment-100">3 Sudut Pandang Kamera</h3>
                <p className="text-xs font-mono text-parchment-400 leading-relaxed">
                  Beralih seketika dengan tombol <kbd className="px-1 bg-parchment-800 text-parchment-200 rounded">V</kbd> antara POV 1 (FPS), POV 2 (Karakter Pundak), dan POV 3 (Sinematik Luas).
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-parchment-800 bg-museum-surface/70 space-y-2">
                <span className="text-2xl block">🧍</span>
                <h3 className="font-serif text-base font-bold text-parchment-100">Avatar Penjelajah 1.70m</h3>
                <p className="text-xs font-mono text-parchment-400 leading-relaxed">
                  Karakter proporsional dengan topi fedora, kacamata kuningan, mantel ekspedisi, dan tas selempang kulit teranimasi langkah kaki prosedural.
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-parchment-800 bg-museum-surface/70 space-y-2">
                <span className="text-2xl block">🧱</span>
                <h3 className="font-serif text-base font-bold text-parchment-100">Fisika Dinding & Tangga</h3>
                <p className="text-xs font-mono text-parchment-400 leading-relaxed">
                  Sistem tabrakan AABB mandiri dengan luncuran dinding natural (wall-sliding) serta kamera yang otomatis merapat saat mendekati dinding.
                </p>
              </div>
            </div>

            {/* Quick 6 Zones Overview */}
            <div className="space-y-4">
              <h3 className="font-serif text-xl font-bold text-parchment-100 flex items-center gap-2">
                <span>📍</span> 6 Zona Kuratorial di Dalam Museum
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {MUSEUM_ZONES.map((zone) => (
                  <div
                    key={zone.id}
                    className="p-5 rounded-2xl border border-parchment-850 bg-museum-surface/60 hover:border-museum-gold/40 transition-colors space-y-2"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{zone.icon}</span>
                      <h4 className="font-serif text-base font-bold text-parchment-100">{zone.name}</h4>
                    </div>
                    <p className="text-xs text-parchment-400 leading-relaxed">{zone.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── SUB-TAB 2: MEMORI PERJALANAN (TRAVEL MEMORIES) ───────────────── */}
        {activeSubTab === 'memories' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-parchment-800 pb-4">
              <div>
                <h2 className="font-serif text-2xl font-bold text-parchment-100">
                  Arsip Memori Perjalanan
                </h2>
                <p className="text-xs font-mono text-parchment-400 mt-1">
                  Koleksi ekspedisi dan catatan perjalanan yang tersimpan di dalam kurasi museum. Klik kartu untuk melihat tanpa mengganggu simulasi.
                </p>
              </div>

              {/* Memory Search */}
              <div className="w-full sm:w-64">
                <input
                  type="text"
                  value={memorySearch}
                  onChange={(e) => setMemorySearch(e.target.value)}
                  placeholder="Cari negara, judul, kota..."
                  className="w-full px-3.5 py-2 rounded-xl bg-parchment-900/60 border border-parchment-700 text-xs font-mono text-parchment-100 placeholder-parchment-500 focus:outline-none focus:border-museum-gold"
                />
              </div>
            </div>

            {filteredMemories.length === 0 ? (
              <div className="p-12 text-center rounded-2xl border border-dashed border-parchment-800 text-parchment-400 font-mono text-xs">
                Tidak ada memori yang cocok dengan pencarian &ldquo;{memorySearch}&rdquo;.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredMemories.map((mem) => (
                  <div
                    key={mem.id}
                    className="rounded-2xl border border-parchment-800/80 bg-museum-surface/80 overflow-hidden hover:border-museum-gold/50 transition-all flex flex-col justify-between"
                  >
                    {/* Thumbnail Image */}
                    {mem.coverImage?.uri ? (
                      <div className="w-full h-44 bg-parchment-950 overflow-hidden relative">
                        <img
                          src={mem.coverImage.uri}
                          alt={mem.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-sm text-[10px] font-mono text-museum-gold font-bold border border-museum-gold/30">
                          {mem.countryCode}
                        </span>
                      </div>
                    ) : (
                      <div className="w-full h-28 bg-parchment-900/60 flex items-center justify-center text-parchment-600 font-mono text-xs">
                        Tanpa Foto
                      </div>
                    )}

                    <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="text-[10px] font-mono text-parchment-400">
                          {mem.dateStart} · {mem.placeName || mem.countryCode}
                        </div>
                        <h3 className="font-serif text-base font-bold text-parchment-100 mt-1 line-clamp-1">
                          {mem.title}
                        </h3>
                        <p className="text-xs text-parchment-300 mt-1 line-clamp-2 leading-relaxed">
                          {mem.summary}
                        </p>
                      </div>

                      {mem.souvenirs && mem.souvenirs.length > 0 && (
                        <div className="pt-2 border-t border-parchment-850 flex items-center gap-1.5 text-[11px] font-mono text-museum-gold">
                          <span>🏺</span>
                          <span className="line-clamp-1">{mem.souvenirs[0].name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── SUB-TAB 3: GALERI ZONA (COLLECTION VITRINES) ─────────────────── */}
        {activeSubTab === 'gallery' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-parchment-800 pb-4">
              <h2 className="font-serif text-2xl font-bold text-parchment-100">
                Katalog Kurasi Vitrine 2D
              </h2>
              <p className="text-xs font-mono text-parchment-400 mt-1">
                Katalog terstruktur untuk peramban yang membutuhkan aksesibilitas penuh atau tanpa akselerasi 3D.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {MUSEUM_ZONES.map((zone) => (
                <div
                  key={zone.id}
                  className="p-6 rounded-2xl border border-parchment-800 bg-museum-surface/90 space-y-4 hover:border-museum-gold/60 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2 rounded-xl bg-parchment-900 border border-parchment-750">
                      {zone.icon}
                    </span>
                    <div>
                      <h3 className="font-serif text-lg font-bold text-parchment-100">{zone.name}</h3>
                      <span className="text-[10px] font-mono text-museum-gold uppercase tracking-wider">
                        Zona Kurasi Project Atlas
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-parchment-300 leading-relaxed">{zone.description}</p>

                  <div className="pt-2 border-t border-parchment-850 flex items-center justify-between text-xs font-mono">
                    <span className="text-parchment-400">Koordinat: [{zone.position.join(', ')}]</span>
                    <button
                      onClick={startSimulation}
                      className="text-museum-gold hover:underline font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <span>Jelajahi di 3D</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SUB-TAB 4: INFORMASI & DENAH (SPECS & BLUEPRINT) ─────────────── */}
        {activeSubTab === 'info' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="border-b border-parchment-800 pb-4">
              <h2 className="font-serif text-2xl font-bold text-parchment-100">
                Denah Arsitektural & Spesifikasi Teknis
              </h2>
              <p className="text-xs font-mono text-parchment-400 mt-1">
                Spesifikasi kanonikal paviliun museum berukuran 6×8 meter sesuai dokumen perancangan Project Atlas.
              </p>
            </div>

            {/* Blueprint Diagram Card */}
            <div className="p-6 rounded-3xl border border-museum-gold/40 bg-parchment-950 font-mono text-xs space-y-4">
              <div className="flex items-center justify-between text-museum-gold border-b border-parchment-800 pb-2">
                <span className="font-bold">DENAH LANTAI MUSEUM MINI (6.00 M × 8.00 M)</span>
                <span>SKALA 1:1 METRIK</span>
              </div>

              {/* Visual ASCII / SVG Layout Plan */}
              <div className="p-4 rounded-xl bg-black/60 border border-parchment-850 font-mono text-[11px] text-parchment-300 leading-relaxed overflow-x-auto">
                <pre>{`
  +----------------------- [ DINDING UTARA (8.00 M) ] -----------------------+
  | [Zona 6: Kubah Bendera & Perpustakaan]     [Zona 5: Layar Dokumentasi]   |
  |                                                                          |
  | [Zona 3: Dinding Souvenir]     [Zona 2: Globe 3D]       [Zona 4: Meja]   |
  |                                 (Pusat Ruang)           Kartografi       |
  |                                                                          |
  | [Zona 1: Poros Arsip Peta]                 [Area Pameran Khusus]         |
  +------------------------- [ PINTU MASUK ] --------------------------------+
                               | Tangga 3 Trap |
                               |   (Z = +5.2m) |
                `}</pre>
              </div>
            </div>

            {/* Technical Metrics Table */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
              <div className="p-5 rounded-2xl border border-parchment-800 bg-museum-surface/80 space-y-3">
                <h3 className="font-serif text-sm font-bold text-parchment-100 uppercase tracking-wider text-museum-gold">
                  Metrik Fisik Bangunan
                </h3>
                <div className="space-y-2 text-parchment-300">
                  <div className="flex justify-between border-b border-parchment-850 py-1">
                    <span>Dimensi Tapak:</span>
                    <span className="text-parchment-100 font-bold">6.00 m (L) × 8.00 m (P)</span>
                  </div>
                  <div className="flex justify-between border-b border-parchment-850 py-1">
                    <span>Luas Lantai:</span>
                    <span className="text-parchment-100 font-bold">48 m²</span>
                  </div>
                  <div className="flex justify-between border-b border-parchment-850 py-1">
                    <span>Tinggi Dinding Bersih:</span>
                    <span className="text-parchment-100 font-bold">3.50 m</span>
                  </div>
                  <div className="flex justify-between border-b border-parchment-850 py-1">
                    <span>Tinggi Puncak Atap (Ridge):</span>
                    <span className="text-parchment-100 font-bold">4.40 m</span>
                  </div>
                  <div className="flex justify-between border-b border-parchment-850 py-1">
                    <span>Elevasi Fondasi Lantai:</span>
                    <span className="text-parchment-100 font-bold">+0.50 m (3 Anak Tangga)</span>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-parchment-800 bg-museum-surface/80 space-y-3">
                <h3 className="font-serif text-sm font-bold text-parchment-100 uppercase tracking-wider text-museum-gold">
                  Metrik Avatar & Kamera 3D
                </h3>
                <div className="space-y-2 text-parchment-300">
                  <div className="flex justify-between border-b border-parchment-850 py-1">
                    <span>Tinggi Avatar Penjelajah:</span>
                    <span className="text-parchment-100 font-bold">1.70 m</span>
                  </div>
                  <div className="flex justify-between border-b border-parchment-850 py-1">
                    <span>Tinggi Pandangan Mata (POV 1):</span>
                    <span className="text-parchment-100 font-bold">1.60 m (FOV 72°)</span>
                  </div>
                  <div className="flex justify-between border-b border-parchment-850 py-1">
                    <span>Kamera Karakter (POV 2):</span>
                    <span className="text-parchment-100 font-bold">Jarak 2.2m (FOV 68°)</span>
                  </div>
                  <div className="flex justify-between border-b border-parchment-850 py-1">
                    <span>Kamera Sinematik (POV 3):</span>
                    <span className="text-parchment-100 font-bold">Jarak 4.4m (FOV 62°)</span>
                  </div>
                  <div className="flex justify-between border-b border-parchment-850 py-1">
                    <span>Pencegah Tembus Tembok:</span>
                    <span className="text-earth-400 font-bold">Ray-AABB Clamping (0.20m)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation & Controls Table */}
            <div className="p-5 rounded-2xl border border-parchment-800 bg-museum-surface/80 space-y-4">
              <h3 className="font-serif text-base font-bold text-parchment-100">
                🎮 Panduan Kontrol & Navigasi
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-parchment-900/60 border border-parchment-800">
                  <div className="text-museum-gold font-bold mb-1">Berjalan & Geser</div>
                  <div className="text-parchment-300">WASD / Tombol Panah</div>
                </div>
                <div className="p-3 rounded-xl bg-parchment-900/60 border border-parchment-800">
                  <div className="text-museum-gold font-bold mb-1">Ganti Sudut Pandang</div>
                  <div className="text-parchment-300">Tekan tombol [ V ]</div>
                </div>
                <div className="p-3 rounded-xl bg-parchment-900/60 border border-parchment-800">
                  <div className="text-museum-gold font-bold mb-1">Periksa Koleksi</div>
                  <div className="text-parchment-300">Dekati & Tekan [ E ] / Klik</div>
                </div>
                <div className="p-3 rounded-xl bg-parchment-900/60 border border-parchment-800">
                  <div className="text-museum-gold font-bold mb-1">Menu Jeda / Lepas Kursor</div>
                  <div className="text-parchment-300">Tekan [ ESC ]</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Curatorial Detail Modal (When opened from 2D gallery) ─────────── */}
      {selectedExhibit && (
        <ExhibitModal
          exhibit={selectedExhibit}
          onClose={() => setSelectedExhibit(null)}
          onSelectCountry={onSelectCountry}
        />
      )}
    </div>
  );
};
