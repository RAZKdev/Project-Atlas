import React, { useState, useMemo } from 'react';
import { Search, Plus, Calendar, MapPin, Tag, Heart, Filter, Camera, Film } from 'lucide-react';
import { Memory, Country } from '../../core/contracts';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { ArchivalMedia } from '../../components/ui/ArchivalMedia';

interface MemoriesPageProps {
  memories: Memory[];
  countries: Country[];
  onSelectMemory: (id: string) => void;
  onNewMemory: () => void;
}

export const MemoriesPage: React.FC<MemoriesPageProps> = ({
  memories,
  countries,
  onSelectMemory,
  onNewMemory,
}) => {
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    memories.forEach(m => m.tags?.forEach(t => tags.add(t)));
    return ['all', ...Array.from(tags)];
  }, [memories]);

  // Filter memories
  const filteredMemories = useMemo(() => {
    return memories.filter(m => {
      const matchSearch = m.title.toLowerCase().includes(search.toLowerCase()) ||
                          m.placeName.toLowerCase().includes(search.toLowerCase()) ||
                          m.summary.toLowerCase().includes(search.toLowerCase());
      const matchTag = selectedTag === 'all' || m.tags?.includes(selectedTag);
      const matchFav = !onlyFavorites || m.favorite;
      return matchSearch && matchTag && matchFav;
    });
  }, [memories, search, selectedTag, onlyFavorites]);

  const getCountryName = (code: string) => {
    return countries.find(c => c.code === code)?.name || code;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-museum-border pb-6">
        <div>
          <span className="text-xs font-mono text-earth-400 uppercase tracking-wider">Koleksi Rekaman Arsip</span>
          <h1 className="font-serif text-3xl sm:text-4xl text-parchment-100 mt-1">
            Memori Terdokumentasi
          </h1>
          <p className="text-sm text-stone-400 mt-1">
            Catatan kronologis momen berharga, refleksi perjalanan, dan foto otentik.
          </p>
        </div>

        <Button
          variant="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={onNewMemory}
        >
          Catat Memori Baru
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-museum-surface/80 p-4 rounded-xl border border-museum-border">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari memori atau nama tempat..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-museum-card border border-museum-border rounded-md pl-9 pr-4 py-2 text-sm text-parchment-100 placeholder:text-stone-500 focus:outline-none focus:border-earth-500/50"
          />
        </div>

        {/* Tags */}
        {allTags.length > 1 && (
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-2.5 py-1 rounded text-xs font-mono whitespace-nowrap transition-colors cursor-pointer ${
                  selectedTag === tag
                    ? 'bg-earth-500 text-white font-medium'
                    : 'text-stone-400 hover:text-parchment-200 hover:bg-white/5'
                }`}
              >
                {tag === 'all' ? 'Semua Tag' : `#${tag}`}
              </button>
            ))}
          </div>
        )}

        {/* Favorite toggle */}
        <button
          onClick={() => setOnlyFavorites(!onlyFavorites)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono transition-colors cursor-pointer border ${
            onlyFavorites
              ? 'bg-rose-950/30 border-rose-500/50 text-rose-300'
              : 'border-museum-border bg-museum-card text-stone-400 hover:text-parchment-200'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-current' : ''}`} />
          <span>Kenangan Favorit</span>
        </button>

      </div>

      {/* Grid or Empty State */}
      {filteredMemories.length === 0 ? (
        <EmptyState
          title={memories.length === 0 ? "Arsip Anda masih hening untuk saat ini." : "Tidak ada memori yang cocok dengan pencarian Anda."}
          description={
            memories.length === 0
              ? "Mulailah dengan mencatat tempat dan pengalaman pertama yang berkesan bagi Anda."
              : "Coba hapus filter pencarian untuk melihat seluruh rekaman arsip yang ada."
          }
          actionLabel={memories.length === 0 ? "Catat Memori Pertama" : undefined}
          onAction={memories.length === 0 ? onNewMemory : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMemories.map(memory => (
            <article
              key={memory.id}
              onClick={() => onSelectMemory(memory.id)}
              className="group rounded-xl border border-museum-border bg-museum-surface hover:border-earth-500/50 transition-all cursor-pointer overflow-hidden flex flex-col justify-between shadow-sm"
            >
              {/* Cover Media */}
              <div className="aspect-[16/10] overflow-hidden relative bg-museum-card">
                {memory.coverImage ? (
                  <ArchivalMedia
                    src={memory.coverImage.uri}
                    alt={memory.title}
                    forceType={memory.coverImage.type}
                    controls={false}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-600">
                    <Camera className="w-10 h-10 opacity-40" />
                  </div>
                )}
                
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-museum-base/85 text-parchment-200 border border-museum-border">
                    {getCountryName(memory.countryCode)}
                  </span>
                  {memory.coverImage?.type === 'video' && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-sky-950/80 text-sky-300 border border-sky-500/40 flex items-center gap-1">
                      <Film className="w-2.5 h-2.5" />
                      <span>VIDEO</span>
                    </span>
                  )}
                </div>

                {memory.favorite && (
                  <div className="absolute top-3 right-3 p-1 rounded-full bg-museum-base/80 text-rose-400">
                    <Heart className="w-3.5 h-3.5 fill-current" />
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-stone-400">
                    <MapPin className="w-3 h-3 text-earth-400" />
                    <span>{memory.placeName}</span>
                    <span>•</span>
                    <span>{memory.dateStart}</span>
                  </div>

                  <h3 className="font-serif text-lg text-parchment-100 group-hover:text-earth-300 transition-colors line-clamp-1">
                    {memory.title}
                  </h3>

                  <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed">
                    {memory.summary}
                  </p>
                </div>

                {/* Footer tags & count */}
                <div className="pt-3 border-t border-museum-border/40 flex items-center justify-between text-[11px] font-mono text-stone-400">
                  <div className="flex items-center gap-1 text-stone-500">
                    <span>{memory.mediaReferences?.length || 0} Foto</span>
                    {memory.souvenirs && memory.souvenirs.length > 0 && (
                      <>
                        <span>•</span>
                        <span>{memory.souvenirs.length} Artefak</span>
                      </>
                    )}
                  </div>
                  <span className="text-earth-400 group-hover:translate-x-0.5 transition-transform">
                    Buka Arsip →
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

    </div>
  );
};
