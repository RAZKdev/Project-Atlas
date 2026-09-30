import React, { useRef } from 'react';
import { X, Printer, Compass, MapPin, Calendar, Archive, Camera, Globe, Award, ShieldCheck } from 'lucide-react';
import { Country, Memory, Souvenir, AtlasStats } from '../../core/contracts';
import { Button } from '../../components/ui/Button';
import { ArchivalImage } from '../../components/ui/ArchivalImage';

interface PassportDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  countries: Country[];
  memories: Memory[];
  souvenirs: Souvenir[];
  stats: AtlasStats;
}

export const PassportDossierModal: React.FC<PassportDossierModalProps> = ({
  isOpen,
  onClose,
  countries,
  memories,
  souvenirs,
  stats,
}) => {
  const dossierRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const visitedOrDocumentedCountries = countries.filter(
    c => c.status === 'visited' || c.status === 'documented'
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      
      {/* Top Floating Action Bar (Hidden when printing) */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-3 print:hidden">
        <Button
          variant="primary"
          onClick={handlePrint}
          icon={<Printer className="w-4 h-4" />}
          className="shadow-xl"
        >
          Print Dossier / Save as PDF
        </Button>
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-museum-surface/90 border border-museum-border text-stone-300 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Passport Document Container */}
      <div
        ref={dossierRef}
        className="w-full max-w-4xl bg-[#FAF8F5] text-[#1E1D1B] rounded-2xl shadow-2xl overflow-hidden my-12 border border-[#E2D9CC] print:m-0 print:border-none print:shadow-none print:w-full print:max-w-none print:rounded-none"
      >
        
        {/* ========================================================================= */}
        {/* PAGE 1: DIPLOMATIC PASSPORT COVER & BEARER IDENTIFICATION */}
        {/* ========================================================================= */}
        <section className="p-8 sm:p-14 border-b-2 border-[#D6C7B2] bg-[#F4EFEA] print:page-break-after-always">
          <div className="border-4 border-double border-[#8C6D50]/50 p-8 sm:p-12 text-center space-y-8 bg-[#FAF8F5] relative">
            
            {/* Watermark Compass Seal */}
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full border-2 border-[#8C6D50] flex items-center justify-center text-[#8C6D50] bg-[#F4EFEA]/80">
                <Compass className="w-12 h-12" />
              </div>
            </div>

            <div className="space-y-2">
              <span className="font-mono text-xs tracking-[0.25em] text-[#70543D] uppercase block">
                GLOBAL EXPEDITION ARCHIVE • OFFICIAL DOSSIER
              </span>
              <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#141312]">
                PROJECT ATLAS PASSPORT
              </h1>
              <p className="font-serif italic text-base sm:text-lg text-[#543D2A]">
                Personal Travel Archive & Digital Museum of Voyages
              </p>
            </div>

            {/* Passport Spec Sheet */}
            <div className="pt-6 border-t border-[#D6C7B2] grid grid-cols-2 sm:grid-cols-4 gap-4 text-left font-mono text-xs">
              <div>
                <span className="text-[#8C6D50] uppercase text-[10px] block">Passport No.</span>
                <span className="font-bold text-[#1E1D1B]">ATLAS-EXP-V2</span>
              </div>
              <div>
                <span className="text-[#8C6D50] uppercase text-[10px] block">Bearer</span>
                <span className="font-bold text-[#1E1D1B]">Rangga</span>
              </div>
              <div>
                <span className="text-[#8C6D50] uppercase text-[10px] block">Countries Documented</span>
                <span className="font-bold text-[#1E1D1B]">{stats.totalCountriesDocumented} Nations</span>
              </div>
              <div>
                <span className="text-[#8C6D50] uppercase text-[10px] block">Date of Issue</span>
                <span className="font-bold text-[#1E1D1B]">{new Date().toLocaleDateString()}</span>
              </div>
            </div>

            <div className="pt-4 text-[11px] font-mono text-[#8C6D50] leading-relaxed max-w-lg mx-auto">
              This passport certifies the holder has explored, cataloged, and archived authentic memories, photographs, and artifacts from voyages across the globe.
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* PAGE 2: IMMIGRATION VISA STAMPS */}
        {/* ========================================================================= */}
        <section className="p-8 sm:p-12 border-b-2 border-[#D6C7B2] bg-[#FAF8F5] print:page-break-after-always">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-[#D6C7B2] pb-3">
              <div>
                <span className="font-mono text-xs text-[#8C6D50] tracking-wider uppercase block">PAGE 02 // VISA STAMPS</span>
                <h2 className="font-serif text-2xl font-bold text-[#1E1D1B]">Immigration & Arrival Stamps</h2>
              </div>
              <span className="font-mono text-xs text-[#70543D]">{visitedOrDocumentedCountries.length} Endorsements</span>
            </div>

            {/* Grid of vintage styled stamps */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-4">
              {visitedOrDocumentedCountries.map((c, i) => {
                // Alternating stamp colors for realistic ink feel
                const colors = [
                  'border-[#991B1B] text-[#991B1B]', // Crimson red
                  'border-[#1E40AF] text-[#1E40AF]', // Deep indigo
                  'border-[#166534] text-[#166534]', // Forest green
                  'border-[#854D0E] text-[#854D0E]', // Dark amber
                ];
                const colorClass = colors[i % colors.length];

                return (
                  <div
                    key={c.code}
                    className={`p-4 rounded-lg border-2 border-dashed ${colorClass} rotate-${(i % 3) - 1} flex flex-col justify-between items-center text-center space-y-2 bg-[#F4EFEA]/30 relative`}
                  >
                    <div className="text-[10px] font-mono tracking-widest uppercase">
                      OFFICIAL ENTRY
                    </div>
                    <div className="font-serif text-lg font-bold uppercase tracking-wide">
                      {c.name}
                    </div>
                    <div className="flex items-center gap-2 font-mono text-[10px]">
                      <span>ISO: {c.code}</span>
                      <span>•</span>
                      <span>{c.visitedYear ? `VISITED ${c.visitedYear}` : 'DOCUMENTED'}</span>
                    </div>
                    <div className="w-full border-t border-current/30 pt-1 text-[9px] font-mono tracking-wider">
                      PROJECT ATLAS • VERIFIED
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* PAGE 3+: EXPEDITION CHRONICLE & TRAVEL JOURNAL ENTRIES */}
        {/* ========================================================================= */}
        <section className="p-8 sm:p-12 space-y-12 bg-[#FAF8F5]">
          <div className="border-b border-[#D6C7B2] pb-4">
            <span className="font-mono text-xs text-[#8C6D50] tracking-wider uppercase block">PAGE 03 // EXPEDITION CHRONICLE</span>
            <h2 className="font-serif text-3xl font-bold text-[#1E1D1B]">Archived Travel Records</h2>
            <p className="font-serif italic text-sm text-[#70543D] mt-1">
              Field observations, photography, and personal reflections recorded on site.
            </p>
          </div>

          <div className="space-y-12">
            {memories.map((mem, index) => (
              <article
                key={mem.id}
                className="p-6 sm:p-8 rounded-xl border border-[#D6C7B2] bg-[#FDFCFA] space-y-6 print:break-inside-avoid"
              >
                {/* Entry header */}
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#E2D9CC] pb-3">
                  <div>
                    <span className="font-mono text-xs text-[#8C6D50] block">ENTRY #{index + 1} // {mem.countryCode}</span>
                    <h3 className="font-serif text-2xl font-bold text-[#141312] mt-0.5">
                      {mem.title}
                    </h3>
                  </div>
                  <div className="text-right font-mono text-xs text-[#70543D]">
                    <span className="block font-semibold">{mem.placeName}</span>
                    <span>{mem.dateStart}{mem.dateEnd ? ` to ${mem.dateEnd}` : ''}</span>
                  </div>
                </div>

                {/* Entry photograph */}
                {mem.coverImage && (
                  <div className="space-y-2">
                    <div className="aspect-[16/9] rounded-lg overflow-hidden border border-[#D6C7B2] max-h-72">
                      <ArchivalImage
                        src={mem.coverImage.uri}
                        alt={mem.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {mem.coverImage.caption && (
                      <p className="text-[11px] font-mono text-[#70543D] italic">
                        Photo: {mem.coverImage.caption}
                      </p>
                    )}
                  </div>
                )}

                {/* Summary quote */}
                <blockquote className="font-serif italic text-base text-[#2A2826] border-l-2 border-[#8C6D50] pl-4 py-1">
                  "{mem.summary}"
                </blockquote>

                {/* Journal notes */}
                {mem.notes && (
                  <div className="text-xs sm:text-sm text-[#38332E] leading-relaxed font-sans font-light whitespace-pre-line bg-[#F4EFEA]/40 p-4 rounded border border-[#EAE2D7]">
                    {mem.notes}
                  </div>
                )}

                {/* Attached souvenirs */}
                {mem.souvenirs && mem.souvenirs.length > 0 && (
                  <div className="pt-2 border-t border-[#E2D9CC] flex items-center gap-2 text-xs font-mono text-[#8C6D50]">
                    <Archive className="w-3.5 h-3.5" />
                    <span>Preserved Token: <strong>{mem.souvenirs[0].name}</strong></span>
                    {mem.souvenirs[0].description && (
                      <span className="text-stone-500 italic">({mem.souvenirs[0].description})</span>
                    )}
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* DOSSIER FOOTER & SEAL */}
        {/* ========================================================================= */}
        <footer className="p-8 border-t-2 border-[#D6C7B2] bg-[#F4EFEA] text-center space-y-3 font-mono text-xs text-[#70543D]">
          <div className="flex items-center justify-center gap-2 font-serif font-bold text-sm text-[#141312]">
            <ShieldCheck className="w-4 h-4 text-[#8C6D50]" />
            <span>END OF OFFICIAL DOSSIER • PROJECT ATLAS</span>
          </div>
          <p className="text-[11px]">
            Document rendered from local-first client storage. All rights and memories reserved to the explorer.
          </p>
        </footer>

      </div>
    </div>
  );
};
