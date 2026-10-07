import React from 'react';
import { ArrowRight, Compass, MapPin, Camera, Archive, BookOpen } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { ArchivalImage } from '../../components/ui/ArchivalImage';
import { Memory, Country, AtlasStats } from '../../core/contracts';
import { NavTab } from '../../components/layout/Navbar';

interface LandingPageProps {
  featuredMemories: Memory[];
  stats: AtlasStats;
  onNavigate: (tab: NavTab) => void;
  onSelectMemory: (id: string) => void;
  onSelectCountry: (code: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  featuredMemories,
  stats,
  onNavigate,
  onSelectMemory,
  onSelectCountry,
}) => {
  return (
    <div className="space-y-24 sm:space-y-32">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden -mt-6">
        {/* Serene Archival Ambiance (Eliminating unwanted third-party stock photo) */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-[#1c1a18] via-[#141312] to-[#121110]" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[520px] bg-earth-500/10 rounded-full blur-[140px]" />
          <div className="absolute inset-0 opacity-[0.035] bg-[radial-gradient(#C9AE92_1px,transparent_1px)] [background-size:24px_24px]" />
          <div className="absolute right-1/2 translate-x-1/2 top-1/2 -translate-y-1/2 opacity-[0.03] text-earth-300">
            <Compass className="w-[500px] h-[500px]" />
          </div>
          {/* Subtle gradient vignette to blend seamlessly into content */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#121110] via-transparent to-[#121110]/60" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-6 pt-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-earth-400/40 bg-museum-base/80 backdrop-blur-sm text-xs font-mono text-earth-300">
            <Compass className="w-3.5 h-3.5" />
            <span>ARSIP PERJALANAN PRIBADI</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal text-parchment-100 tracking-tight leading-[1.15]">
            Project Atlas
          </h1>

          <p className="font-serif italic text-xl sm:text-2xl text-parchment-300 max-w-2xl mx-auto leading-relaxed">
            Peta personal untuk tempat, kenangan, dan momen berharga.
          </p>

          <p className="text-sm sm:text-base text-stone-300 max-w-xl mx-auto leading-relaxed font-sans font-light">
            Ruang hening untuk mendokumentasikan tempat-tempat yang telah Anda jejaki, kenangan yang terpatri dalam ingatan dan foto, serta suvenir yang Anda bawa pulang.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="primary"
              size="lg"
              onClick={() => onNavigate('atlas')}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Jelajahi Atlas Dunia
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => onNavigate('journal')}
              icon={<BookOpen className="w-4 h-4 text-earth-400" />}
            >
              Baca Jurnal Perjalanan
            </Button>
          </div>
        </div>
      </section>

      {/* 2. ATLAS INTRODUCTION & RESTRAINED STATS */}
      <section className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center border-t border-b border-museum-border py-12">
          
          <div className="md:col-span-5 space-y-4">
            <span className="text-xs font-mono text-earth-400 tracking-wider uppercase">Ringkasan Arsip</span>
            <h2 className="font-serif text-2xl sm:text-3xl text-parchment-100 leading-snug">
              Menjaga apa yang ditinggalkan oleh perjalanan.
            </h2>
          </div>

          <div className="md:col-span-7 space-y-4 text-parchment-300 text-sm sm:text-base leading-relaxed">
            <p>
              Berbeda dari media sosial atau situs turisme komersial, Project Atlas memperlakukan setiap perjalanan sebagai koleksi berharga yang abadi. Setiap rekaman mengaitkan pengalaman nyata dengan koordinat geografis, catatan harian pribadi, foto otentik, dan suvenir fisik.
            </p>
            
            {/* Museum stats bar */}
            <div className="pt-4 border-t border-museum-border/60 space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <span className="font-mono text-2xl sm:text-3xl text-parchment-100 block">{stats.totalCountriesVisited}</span>
                  <span className="text-xs text-stone-400">Negara Dikunjungi</span>
                </div>
                <div>
                  <span className="font-mono text-2xl sm:text-3xl text-earth-300 block">{stats.totalMemories}</span>
                  <span className="text-xs text-stone-400">Memori Terarsip</span>
                </div>
                <div>
                  <span className="font-mono text-2xl sm:text-3xl text-parchment-100 block">{stats.totalSouvenirs}</span>
                  <span className="text-xs text-stone-400">Artefak & Suvenir</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. VISUAL WORLD / DISCOVERY PREVIEW */}
      <section className="max-w-6xl mx-auto px-6 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono text-earth-400 uppercase tracking-wider">Eksplorasi Global</span>
            <h2 className="font-serif text-3xl text-parchment-100 mt-1">Kartografi & Bola Dunia 3D</h2>
          </div>
          <button
            onClick={() => onNavigate('atlas')}
            className="text-xs font-mono text-earth-400 hover:text-earth-300 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Buka Atlas 3D</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Discovery visual banner card */}
        <div 
          onClick={() => onNavigate('atlas')}
          className="relative rounded-xl overflow-hidden border border-museum-border group cursor-pointer aspect-[21/9] min-h-[300px]"
        >
          <img
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1800&q=80"
            alt="Pemandangan bumi dari orbit pada senja hari"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-museum-base via-transparent to-transparent opacity-90" />
          
          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <span className="font-mono text-xs text-earth-300">Peta Dunia & Bola Dunia 3D</span>
              <h3 className="font-serif text-xl sm:text-2xl text-parchment-100">
                Putar Bola Dunia & Lihat Rekaman Foto
              </h3>
              <p className="text-xs text-stone-300 max-w-md">
                Pantau negara dalam lima status: Belum Dijelajahi, Diminati, Direncanakan, Dikunjungi, dan Terdokumentasi.
              </p>
            </div>
            
            <div className="shrink-0">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-museum-surface/90 border border-earth-500/40 text-xs font-mono text-earth-300 group-hover:bg-earth-500 group-hover:text-white transition-colors">
                <span>Buka Atlas</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED MEMORIES */}
      <section className="max-w-6xl mx-auto px-6 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono text-earth-400 uppercase tracking-wider">Koleksi Terpilih</span>
            <h2 className="font-serif text-3xl text-parchment-100 mt-1">Memori & Catatan Utama</h2>
          </div>
          <button
            onClick={() => onNavigate('memories')}
            className="text-xs font-mono text-earth-400 hover:text-earth-300 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Lihat Semua ({featuredMemories.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {featuredMemories.length === 0 ? (
          <div className="p-8 rounded-lg border border-museum-border text-center text-sm text-stone-400">
            Belum ada memori yang dicatat. Klik 'Catat Memori' untuk memulai arsip Anda.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredMemories.slice(0, 3).map(mem => (
              <div
                key={mem.id}
                onClick={() => onSelectMemory(mem.id)}
                className="group rounded-lg border border-museum-border bg-museum-card overflow-hidden hover:border-earth-500/50 transition-all duration-300 cursor-pointer flex flex-col"
              >
                {/* Image container */}
                <div className="aspect-[16/10] overflow-hidden relative bg-museum-surface">
                  {mem.coverImage ? (
                    <ArchivalImage
                      src={mem.coverImage.uri}
                      alt={mem.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-500">
                      <Camera className="w-8 h-8 opacity-40" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-museum-base/80 text-parchment-200 border border-museum-border">
                      {mem.countryCode}
                    </span>
                  </div>
                </div>

                {/* Card body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-mono text-stone-400">
                      <MapPin className="w-3 h-3 text-earth-400" />
                      <span>{mem.placeName}</span>
                      <span>•</span>
                      <span>{mem.dateStart}</span>
                    </div>
                    <h3 className="font-serif text-lg text-parchment-100 group-hover:text-earth-300 transition-colors line-clamp-1">
                      {mem.title}
                    </h3>
                    <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed">
                      {mem.summary}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-museum-border/40 text-[11px] text-stone-400 font-mono">
                    <span>{mem.mediaReferences?.length || 0} Foto</span>
                    <span className="text-earth-400 group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                      Buka Arsip →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 5. PERSONAL MUSEUM PHILOSOPHY */}
      <section className="max-w-5xl mx-auto px-6">
        <div className="rounded-2xl border border-museum-border bg-museum-surface/60 p-8 sm:p-12 relative overflow-hidden">
          <div className="max-w-2xl space-y-4 relative z-10">
            <span className="text-xs font-mono text-earth-400 uppercase tracking-wider flex items-center gap-1.5">
              <Archive className="w-3.5 h-3.5" />
              <span>Konsep Museum Pribadi</span>
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-parchment-100 leading-snug">
              Setiap artefak menyimpan sebuah babak dari perjalanan.
            </h2>
            <p className="text-sm text-stone-300 leading-relaxed font-light">
              Lebih dari sekadar koordinat peta dan bidikan lensa kamera, benda fisik—mulai dari jimat kuil, kain tenun lokal, hingga tiket ekspedisi—dijaga sebagai artefak pameran dalam museum pribadi Anda.
            </p>
            <div className="pt-2">
              <Button
                variant="secondary"
                size="sm"
                icon={<Archive className="w-3.5 h-3.5 text-earth-400" />}
                onClick={() => onNavigate('souvenirs')}
              >
                Lihat Kabinet Suvenir
              </Button>
            </div>
          </div>

          <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 opacity-5 pointer-events-none">
            <Compass className="w-80 h-80 text-earth-300" />
          </div>
        </div>
      </section>

      {/* 6. FINAL CALL TO ACTION */}
      <section className="max-w-4xl mx-auto px-6 text-center space-y-6 pb-8">
        <h2 className="font-serif text-3xl sm:text-4xl text-parchment-100">
          Masuki Arsip Dunia Anda
        </h2>
        <p className="text-sm text-stone-400 max-w-lg mx-auto leading-relaxed">
          Putar bola dunia 3D, baca kembali catatan perjalanan Anda, atau tambahkan destinasi baru.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="primary"
            size="lg"
            onClick={() => onNavigate('atlas')}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Buka Atlas Dunia
          </Button>
        </div>
      </section>

    </div>
  );
};
