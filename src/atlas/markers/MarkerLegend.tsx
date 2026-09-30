/**
 * Marker & Region Legend Component for Project Atlas 3D World Atlas.
 * Displays deterministic color codes for:
 * 1. Geographic Regions
 * 2. Representation Levels (Hero 3D, Procedural 3D, Cone Fallback)
 * 3. Personal Travel Status (Visited / Belum Dikunjungi)
 */

import React, { useState } from 'react';
import { Layers, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { REGION_COLORS, GeographicRegion } from '../countries/countryColors';

export const MarkerLegend: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const regionEntries = Object.values(REGION_COLORS);

  return (
    <div className="absolute bottom-4 left-4 z-20 select-none">
      <div className="bg-museum-base/90 backdrop-blur-md border border-museum-border rounded-xl shadow-xl overflow-hidden max-w-xs transition-all">
        {/* Header toggle */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-3.5 py-2 flex items-center justify-between gap-3 text-left hover:bg-white/5 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2 text-xs font-mono text-parchment-200">
            <Layers className="w-3.5 h-3.5 text-earth-400" />
            <span>Legenda Wilayah & Landmark</span>
          </div>
          {isExpanded ? (
            <ChevronDown className="w-3.5 h-3.5 text-parchment-400" />
          ) : (
            <ChevronUp className="w-3.5 h-3.5 text-parchment-400" />
          )}
        </button>

        {/* Collapsed quick strip */}
        {!isExpanded && (
          <div className="px-3.5 pb-2 flex items-center gap-2">
            {regionEntries.map(r => (
              <span
                key={r.region}
                className="w-2.5 h-2.5 rounded-full border border-black/40"
                style={{ backgroundColor: r.hex }}
                title={`${r.label}: ${r.description}`}
              />
            ))}
            <span className="text-[10px] font-mono text-stone-400 ml-1">6 Wilayah Dunia</span>
          </div>
        )}

        {/* Expanded detail list */}
        {isExpanded && (
          <div className="px-3.5 pb-3.5 pt-1 space-y-3 text-[11px] font-mono border-t border-museum-border/50">
            {/* Regions */}
            <div>
              <span className="text-[10px] text-earth-400 uppercase tracking-wider block mb-1.5 font-semibold">
                Warna Wilayah Geografis
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {regionEntries.map(r => (
                  <div key={r.region} className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0 border border-black/40"
                      style={{ backgroundColor: r.hex }}
                    />
                    <span className="text-parchment-300 truncate" title={r.description}>
                      {r.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Representation Levels */}
            <div className="pt-2 border-t border-museum-border/40">
              <span className="text-[10px] text-earth-400 uppercase tracking-wider block mb-1.5 font-semibold">
                Tingkat Representasi 3D
              </span>
              <div className="space-y-1 text-stone-300">
                <div className="flex items-center gap-2">
                  <span className="text-amber-400 font-bold">🏛️</span>
                  <span>Hero 3D: Arsitektur Utama Terinci</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sky-400 font-bold">📐</span>
                  <span>Prosedural 3D: 29 Arketipe Bersejarah</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-stone-400 font-bold">🔺</span>
                  <span>Cone Fallback: Penanda Kerucut Wilayah</span>
                </div>
              </div>
            </div>

            {/* Travel Status Pins */}
            <div className="pt-2 border-t border-museum-border/40">
              <span className="text-[10px] text-earth-400 uppercase tracking-wider block mb-1.5 font-semibold">
                Status Perjalanan Pribadi
              </span>
              <div className="flex items-center gap-4 text-stone-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_6px_#3b82f6]"></span>
                  <span>🔵 Dikunjungi</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_6px_#ef4444]"></span>
                  <span>🔴 Belum Dikunjungi</span>
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
