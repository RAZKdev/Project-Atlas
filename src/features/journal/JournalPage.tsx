import React, { useState, useMemo } from 'react';
import { BookOpen, Search, MapPin, Calendar, Tag, ArrowRight, Camera, Sparkles, Filter, Feather, HelpCircle, HardDrive } from 'lucide-react';
import { Memory, Country } from '../../core/contracts';
import { ArchivalMedia } from '../../components/ui/ArchivalMedia';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';
import { JournalWriter } from './JournalWriter';
import { storageService } from '../../core/services/storageService';

interface JournalPageProps {
  memories: Memory[];
  countries: Country[];
  onSelectMemory: (id: string) => void;
  onSelectCountry: (code: string) => void;
  onNewMemory: () => void;
}

export const JournalPage: React.FC<JournalPageProps> = ({
  memories,
  countries,
  onSelectMemory,
  onSelectCountry,
  onNewMemory,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [isWriting, setIsWriting] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  const handleSaveJournal = (data: Omit<Memory, 'id' | 'createdAt' | 'updatedAt'>) => {
    const saved = storageService.saveMemory(data);
    setIsWriting(false);
    onSelectMemory(saved.id);
  };

  // Countries that have memories
  const countriesWithMemories = useMemo(() => {
    const codes = Array.from(new Set(memories.map(m => m.countryCode)));
    return codes.map(code => {
      const c = countries.find(item => item.code === code);
      return { code, name: c?.name || code };
    });
  }, [memories, countries]);

  // Filter memories with journal notes
  const filteredRecords = useMemo(() => {
    return memories.filter(m => {
      const matchCountry = selectedCountry === 'all' || m.countryCode === selectedCountry;
      const matchSearch =
        m.title.toLowerCase().includes(search.toLowerCase()) ||
        m.placeName.toLowerCase().includes(search.toLowerCase()) ||
        (m.notes && m.notes.toLowerCase().includes(search.toLowerCase())) ||
        m.summary.toLowerCase().includes(search.toLowerCase());
      return matchCountry && matchSearch;
    });
  }, [memories, selectedCountry, search]);

  const getCountryName = (code: string) => {
    return countries.find(c => c.code === code)?.name || code;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 pb-20">
      
      {/* Header */}
      <div className="border-b border-museum-border pb-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-earth-400 mb-1">
              <BookOpen className="w-3.5 h-3.5" />
              <span>CATATAN EKSPEDISI & JURNAL PERJALANAN</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl text-parchment-100">
              Jurnal Penjelajah
            </h1>
            <p className="font-serif italic text-base sm:text-lg text-parchment-300 mt-1 max-w-2xl font-light leading-relaxed">
              Ketik renungan, suasana tempat, dan percakapan langsung seperti menulis di buku catatan harian Anda.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Button
              variant="secondary"
              size="sm"
              icon={<HelpCircle className="w-3.5 h-3.5" />}
              onClick={() => setShowGuide(!showGuide)}
            >
              {showGuide ? 'Tutup Panduan' : 'Cara Upload'}
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<Feather className="w-3.5 h-3.5" />}
              onClick={() => setIsWriting(!isWriting)}
            >
              {isWriting ? 'Tutup Lembar Jurnal' : 'Tulis Jurnal Baru'}
            </Button>
          </div>
        </div>

        {/* Step-by-Step Media Upload Guide */}
        {showGuide && (
          <div className="p-5 rounded-xl bg-museum-surface/90 border border-sky-500/40 space-y-3 animate-fade-in text-xs">
            <div className="flex items-center gap-2 font-mono text-sky-400 font-semibold uppercase tracking-wider">
              <HardDrive className="w-4 h-4" />
              <span>PANDUAN LENGKAP: CARA UPLOAD FOTO & VIDEO DARI LAPTOP</span>
            </div>
            <ol className="list-decimal list-inside space-y-2 text-stone-300 leading-relaxed font-light">
              <li>
                <strong className="text-parchment-100">Klik tombol "Tulis Jurnal Baru"</strong> di atas atau tombol "Tambah Memori" di navigasi.
              </li>
              <li>
                <strong className="text-parchment-100">Tekan tombol "Pilih dari Laptop"</strong> pada bagian lampiran media.
              </li>
              <li>
                <strong className="text-parchment-100">Pilih file foto (JPG, PNG, WebP) atau klip video (MP4, WebM, MOV)</strong> dari folder laptop Anda.
              </li>
              <li>
                <strong className="text-parchment-100">Tersimpan 100% Lokal & Instan:</strong> File foto/video langsung disimpan ke database browser laptop Anda (IndexedDB), tidak pernah dikirim ke internet, dan langsung dapat diputar atau dilihat di jurnal, video player, dan bola dunia 3D!
              </li>
            </ol>
          </div>
        )}

        {/* Interactive Journal Writer Form ("Ketik Sendiri Kayak Nulis") */}
        {isWriting && (
          <div className="pt-2">
            <JournalWriter
              countries={countries}
              onSaveJournal={handleSaveJournal}
              onCancel={() => setIsWriting(false)}
            />
          </div>
        )}

        {/* Filter per Negara & Pencarian */}
        <div className="pt-2 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
          
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari kata kunci dalam jurnal atau tempat..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-museum-surface border border-museum-border rounded-md pl-9 pr-4 py-2 text-sm text-parchment-100 placeholder:text-stone-500 focus:outline-none focus:border-earth-500/50"
            />
          </div>

          {/* Country filter buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setSelectedCountry('all')}
              className={`px-3 py-1 rounded-md text-xs font-mono whitespace-nowrap transition-colors cursor-pointer ${
                selectedCountry === 'all'
                  ? 'bg-earth-500 text-white font-medium'
                  : 'bg-museum-surface text-stone-400 hover:text-parchment-200 border border-museum-border'
              }`}
            >
              Semua Negara
            </button>
            {countriesWithMemories.map(c => (
              <button
                key={c.code}
                onClick={() => setSelectedCountry(c.code)}
                className={`px-3 py-1 rounded-md text-xs font-mono whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCountry === c.code
                    ? 'bg-earth-500 text-white font-medium'
                    : 'bg-museum-surface text-stone-400 hover:text-parchment-200 border border-museum-border'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Timeline List of Journal Dispatches */}
      {filteredRecords.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="w-7 h-7" />}
          title="Belum ada catatan jurnal yang cocok."
          description="Tulis catatan dan refleksi pengalaman Anda saat merekam memori baru."
          actionLabel="Tulis Catatan Perjalanan"
          onAction={onNewMemory}
        />
      ) : (
        <div className="space-y-8 relative before:absolute before:inset-0 before:left-3.5 sm:before:left-5 before:w-0.5 before:bg-museum-border/60">
          {filteredRecords.map((item, index) => (
            <article
              key={item.id}
              className="relative pl-8 sm:pl-12 group transition-all"
            >
              {/* Timeline marker node */}
              <div className="absolute left-1.5 sm:left-3 top-6 -translate-x-1/2 w-4 h-4 rounded-full bg-museum-surface border-2 border-earth-400 group-hover:scale-125 transition-transform" />

              {/* Journal Card Box */}
              <div className="rounded-xl border border-museum-border bg-museum-surface/85 hover:border-earth-500/50 p-6 sm:p-8 space-y-6 transition-all shadow-md">
                
                {/* Header: Lokasi, Negara, Tanggal */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-museum-border/60 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-mono text-earth-300">
                      <span
                        onClick={() => onSelectCountry(item.countryCode)}
                        className="hover:underline cursor-pointer font-semibold flex items-center gap-1"
                      >
                        <MapPin className="w-3.5 h-3.5 text-earth-400" />
                        <span>{getCountryName(item.countryCode)}</span>
                      </span>
                      <span className="text-stone-600">•</span>
                      <span className="text-stone-300">{item.placeName}</span>
                    </div>

                    <h2
                      onClick={() => onSelectMemory(item.id)}
                      className="font-serif text-2xl text-parchment-100 group-hover:text-earth-300 transition-colors cursor-pointer"
                    >
                      {item.title}
                    </h2>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-mono text-stone-400 shrink-0">
                    <Calendar className="w-3.5 h-3.5 text-earth-400" />
                    <span>{item.dateStart}</span>
                  </div>
                </div>

                {/* Grid: Teks Jurnal + Foto Terlampir */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  
                  {/* Journal Text */}
                  <div className={`${item.coverImage ? 'md:col-span-8' : 'md:col-span-12'} space-y-4`}>
                    <blockquote className="font-serif italic text-base text-parchment-200 border-l-2 border-earth-500/60 pl-4 py-1 leading-relaxed">
                      "{item.summary}"
                    </blockquote>

                    {item.notes ? (
                      <div className="text-xs sm:text-sm text-stone-300 leading-relaxed font-light whitespace-pre-line space-y-3 bg-museum-card/50 p-4 rounded-lg border border-museum-border/50">
                        {item.notes}
                      </div>
                    ) : (
                      <p className="text-xs text-stone-500 italic">
                        (Hanya ringkasan singkat yang dicatat untuk perjalanan ini)
                      </p>
                    )}

                    {/* Tags */}
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {item.tags.map(tag => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-museum-card border border-museum-border text-[10px] font-mono text-stone-400"
                          >
                            <Tag className="w-2.5 h-2.5 text-earth-400" />
                            <span>#{tag}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Media (Photo or Video) Thumbnail if available */}
                  {item.coverImage && (
                    <div className="md:col-span-4 space-y-2">
                      <div
                        className="aspect-[4/3] rounded-lg overflow-hidden border border-museum-border bg-museum-card group/img"
                      >
                        <ArchivalMedia
                          src={item.coverImage.uri}
                          alt={item.title}
                          controls={item.coverImage.type === 'video'}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {item.coverImage.caption && (
                        <p className="text-[11px] font-mono text-stone-400 line-clamp-1">
                          {item.coverImage.type === 'video' ? '🎬 Video:' : '📷 Foto:'} {item.coverImage.caption}
                        </p>
                      )}
                    </div>
                  )}

                </div>

                {/* Footer link to record */}
                <div className="pt-2 border-t border-museum-border/40 flex items-center justify-between text-xs font-mono text-stone-400">
                  <span>DISPATCH #{index + 1}</span>
                  <button
                    onClick={() => onSelectMemory(item.id)}
                    className="text-earth-400 hover:text-earth-300 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Baca Selengkapnya</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            </article>
          ))}
        </div>
      )}

    </div>
  );
};
