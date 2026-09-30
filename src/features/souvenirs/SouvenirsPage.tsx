import React, { useState } from 'react';
import { Archive, MapPin, Calendar, Tag, Sparkles, Plus, Trash2, BookOpen, Store, Image as ImageIcon } from 'lucide-react';
import { Souvenir, Memory, Country } from '../../core/contracts';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';
import { ArchivalMedia } from '../../components/ui/ArchivalMedia';
import { SouvenirWriter } from './SouvenirWriter';

interface SouvenirsPageProps {
  souvenirs: Souvenir[];
  memories: Memory[];
  countries: Country[];
  onSelectMemory: (id: string) => void;
  onSelectCountry: (code: string) => void;
  onSaveSouvenir?: (data: Omit<Souvenir, 'id'>) => void;
  onDeleteSouvenir?: (id: string) => void;
}

export const SouvenirsPage: React.FC<SouvenirsPageProps> = ({
  souvenirs,
  memories,
  countries,
  onSelectMemory,
  onSelectCountry,
  onSaveSouvenir,
  onDeleteSouvenir,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isWriterOpen, setIsWriterOpen] = useState<boolean>(false);

  const categories = [
    { value: 'all', label: 'Semua Koleksi' },
    { value: 'artifact', label: '🏺 Artefak' },
    { value: 'textile', label: '🧣 Tekstil' },
    { value: 'ticket', label: '🎟️ Tiket' },
    { value: 'stamp', label: '📮 Cap & Perangko' },
    { value: 'postcard', label: '✉️ Kartu Pos' },
    { value: 'coin', label: '🪙 Koin' },
    { value: 'other', label: '📦 Lainnya' },
  ];

  const filtered = souvenirs.filter(s => {
    return selectedCategory === 'all' || s.category === selectedCategory;
  });

  const getCountryName = (code: string) => {
    return countries.find(c => c.code === code)?.name || code;
  };

  const handleSave = (data: Omit<Souvenir, 'id'>) => {
    if (onSaveSouvenir) {
      onSaveSouvenir(data);
    }
    setIsWriterOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus suvenir "${name}" dari lemari koleksi?`)) {
      if (onDeleteSouvenir) {
        onDeleteSouvenir(id);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* Editorial Header */}
      <div className="border-b border-museum-border pb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-earth-400 mb-1">
              <Archive className="w-4 h-4" />
              <span>LEMARI KOLEKSI PRIBADI</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl text-parchment-100 font-bold">
              Koleksi Suvenir & Cinderamata
            </h1>
            <p className="text-sm sm:text-base text-stone-300 mt-2 max-w-2xl font-light leading-relaxed">
              Artefak fisik dan benda nyata yang dikumpulkan sepanjang perjalanan. Setiap benda adalah jangkar kenangan terhadap tempat, orang, atau momen tertentu.
            </p>
          </div>

          {/* Action Button: + Catat Suvenir Baru */}
          <div className="shrink-0">
            <Button
              variant="primary"
              onClick={() => setIsWriterOpen(!isWriterOpen)}
              className="flex items-center gap-2 px-5 py-3 shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>{isWriterOpen ? 'Tutup Formulir' : 'Catat Suvenir Baru'}</span>
            </Button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap items-center gap-2 pt-6">
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                selectedCategory === cat.value
                  ? 'bg-earth-500 text-white font-medium shadow-sm'
                  : 'bg-museum-surface text-stone-400 hover:text-stone-200 border border-museum-border'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* SOUVENIR WRITER (FORMULIR PENDAFTARAN) */}
      {isWriterOpen && (
        <div className="mb-8">
          <SouvenirWriter
            countries={countries}
            memories={memories}
            onSaveSouvenir={handleSave}
            onCancel={() => setIsWriterOpen(false)}
          />
        </div>
      )}

      {/* Grid or Empty State */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Archive className="w-8 h-8 text-earth-400" />}
          title="Lemari koleksi saat ini masih kosong."
          description="Klik tombol 'Catat Suvenir Baru' di atas untuk mendokumentasikan cinderamata fisik, tiket masuk, kain khas, atau kerajinan tangan dari laptop Anda."
          actionLabel={isWriterOpen ? undefined : "Catat Suvenir Sekarang"}
          onAction={() => setIsWriterOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(s => {
            const memory = memories.find(m => m.id === s.memoryId);
            return (
              <div
                key={s.id}
                className="group rounded-2xl border border-museum-border bg-museum-surface/90 hover:border-earth-500/50 transition-all shadow-md overflow-hidden flex flex-col justify-between"
              >
                {/* Media Image / Video Banner */}
                {s.photoReference && s.photoReference.uri ? (
                  <div className="relative w-full h-48 bg-stone-950 overflow-hidden border-b border-museum-border">
                    <ArchivalMedia
                      src={s.photoReference.uri}
                      alt={s.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      controls={false}
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-stone-950/80 backdrop-blur-md border border-stone-800 text-stone-200 uppercase tracking-wider">
                        {s.category || 'Suvenir'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-28 bg-stone-900/40 border-b border-museum-border flex items-center justify-between px-5">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-stone-950/80 border border-stone-800 text-stone-300 uppercase tracking-wider">
                      {s.category || 'Suvenir'}
                    </span>
                    <Archive className="w-6 h-6 text-stone-600" />
                  </div>
                )}

                {/* Content Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    
                    {/* Country & Location */}
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <button
                        onClick={() => onSelectCountry(s.countryCode)}
                        className="font-mono text-earth-400 hover:text-earth-300 hover:underline flex items-center gap-1 cursor-pointer truncate"
                      >
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span>{getCountryName(s.countryCode)}</span>
                      </button>

                      {s.placeName && (
                        <span className="text-[11px] text-stone-400 font-light truncate max-w-[140px] flex items-center gap-1">
                          <Store className="w-3 h-3 text-stone-500 shrink-0" />
                          <span>{s.placeName}</span>
                        </span>
                      )}
                    </div>

                    {/* Souvenir Title */}
                    <h3 className="font-serif text-lg font-bold text-parchment-100 group-hover:text-earth-300 transition-colors">
                      {s.name}
                    </h3>

                    {/* Description / Story */}
                    {s.description && (
                      <p className="text-xs text-stone-300 leading-relaxed font-light line-clamp-3">
                        {s.description}
                      </p>
                    )}
                  </div>

                  {/* Footer Meta & Actions */}
                  <div className="pt-3 border-t border-museum-border/40 flex items-center justify-between text-xs font-mono text-stone-400">
                    <div>
                      {s.acquiredDate && (
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3 h-3 text-earth-400" />
                          <span>{s.acquiredDate}</span>
                        </div>
                      )}
                      
                      {memory && (
                        <button
                          onClick={() => onSelectMemory(memory.id)}
                          className="text-[11px] text-earth-400 hover:text-earth-300 hover:underline mt-1 flex items-center gap-1 cursor-pointer"
                        >
                          <BookOpen className="w-3 h-3" />
                          <span>Memori: {memory.title}</span>
                        </button>
                      )}
                    </div>

                    {/* Delete button */}
                    {onDeleteSouvenir && (
                      <button
                        onClick={() => handleDelete(s.id, s.name)}
                        className="p-1.5 rounded-lg text-stone-500 hover:text-red-400 hover:bg-stone-800 transition-colors"
                        title="Hapus Suvenir"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
