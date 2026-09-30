import React from 'react';
import { ArrowLeft, MapPin, Calendar, Tag, Trash2, Edit3, Heart, Archive, Camera, Share2 } from 'lucide-react';
import { Memory, Country } from '../../core/contracts';
import { Button } from '../../components/ui/Button';
import { AttributionBadge } from '../../components/ui/AttributionBadge';
import { ArchivalMedia } from '../../components/ui/ArchivalMedia';

interface MemoryDetailPageProps {
  memory: Memory;
  country?: Country;
  onBack: () => void;
  onEdit: (memory: Memory) => void;
  onDelete: (id: string) => void;
  onSelectCountry: (code: string) => void;
}

export const MemoryDetailPage: React.FC<MemoryDetailPageProps> = ({
  memory,
  country,
  onBack,
  onEdit,
  onDelete,
  onSelectCountry,
}) => {
  const handleDelete = () => {
    if (window.confirm(`Hapus rekaman arsip "${memory.title}"? Tindakan ini tidak dapat dibatalkan.`)) {
      onDelete(memory.id);
    }
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pb-20">
      
      {/* Top action row */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-mono text-stone-400 hover:text-parchment-200 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>KEMBALI KE MEMORI</span>
        </button>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={<Edit3 className="w-3.5 h-3.5" />}
            onClick={() => onEdit(memory)}
          >
            Edit Rekaman
          </Button>
          <Button
            variant="danger"
            size="sm"
            icon={<Trash2 className="w-3.5 h-3.5" />}
            onClick={handleDelete}
          >
            Hapus
          </Button>
        </div>
      </div>

      {/* Header: Place / Date / Title */}
      <header className="space-y-4 border-b border-museum-border pb-8">
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-earth-400">
          <span
            onClick={() => onSelectCountry(memory.countryCode)}
            className="hover:underline cursor-pointer flex items-center gap-1 text-earth-300 font-semibold"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>{country?.name || memory.countryCode}</span>
          </span>
          <span className="text-stone-600">•</span>
          <span className="text-stone-300">{memory.placeName}</span>
          <span className="text-stone-600">•</span>
          <span className="flex items-center gap-1 text-stone-400">
            <Calendar className="w-3 h-3" />
            <span>{memory.dateStart}</span>
            {memory.dateEnd && <span> sampai {memory.dateEnd}</span>}
          </span>
          {memory.favorite && (
            <span className="ml-auto inline-flex items-center gap-1 text-rose-400 text-xs">
              <Heart className="w-3.5 h-3.5 fill-current" />
              <span>Kenangan Favorit</span>
            </span>
          )}
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl text-parchment-100 leading-tight">
          {memory.title}
        </h1>

        <p className="font-serif italic text-lg sm:text-xl text-parchment-300 leading-relaxed max-w-3xl">
          "{memory.summary}"
        </p>

        {memory.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-2">
            {memory.tags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-museum-surface border border-museum-border text-[11px] font-mono text-stone-400"
              >
                <Tag className="w-2.5 h-2.5 text-earth-400" />
                <span>{tag}</span>
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Primary Archival Media (Photo or Video) */}
      {memory.coverImage && (
        <figure className="space-y-3">
          <div className="rounded-xl overflow-hidden border border-museum-border bg-museum-surface max-h-[550px]">
            <ArchivalMedia
              src={memory.coverImage.uri}
              alt={memory.coverImage.caption || memory.title}
              forceType={memory.coverImage.type}
              controls={true}
              className="w-full h-full object-cover object-center"
            />
          </div>
          <figcaption className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-stone-400 px-1">
            <span>{memory.coverImage.caption || (memory.coverImage.type === 'video' ? 'Rekaman video arsip' : 'Foto rekaman arsip')}</span>
            <AttributionBadge
              attribution={memory.coverImage.attribution}
              isPersonal={memory.coverImage.isPersonal}
            />
          </figcaption>
        </figure>
      )}

      {/* Archival Notes & Journal reflections */}
      {memory.notes && (
        <section className="space-y-4 rounded-xl border border-museum-border bg-museum-surface/70 p-6 sm:p-8">
          <h2 className="font-serif text-xl text-parchment-100 flex items-center gap-2">
            <span>Refleksi Jurnal & Catatan Perjalanan</span>
          </h2>
          <div className="text-sm sm:text-base text-parchment-300 leading-relaxed font-light whitespace-pre-line space-y-4">
            {memory.notes}
          </div>
        </section>
      )}

      {/* Supporting Media References */}
      {memory.mediaReferences?.length > 1 && (
        <section className="space-y-4">
          <h2 className="font-serif text-xl text-parchment-100 flex items-center gap-2">
            <Camera className="w-4 h-4 text-earth-400" />
            <span>Dokumentasi Media Tambahan ({memory.mediaReferences.length - 1})</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {memory.mediaReferences.slice(1).map((media, idx) => (
              <figure key={idx} className="space-y-1.5">
                <div className="aspect-[4/3] rounded-lg overflow-hidden border border-museum-border bg-museum-surface">
                  <ArchivalMedia
                    src={media.uri}
                    alt={media.caption || 'Media pendukung'}
                    forceType={media.type}
                    controls={media.type === 'video'}
                    className="w-full h-full object-cover"
                  />
                </div>
                {media.caption && (
                  <figcaption className="text-[11px] font-mono text-stone-400">
                    {media.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* Associated Museum Souvenirs */}
      {memory.souvenirs && memory.souvenirs.length > 0 && (
        <section className="space-y-4 pt-6 border-t border-museum-border">
          <h2 className="font-serif text-xl text-parchment-100 flex items-center gap-2">
            <Archive className="w-4 h-4 text-earth-400" />
            <span>Artefak Fisik & Suvenir yang Disimpan</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {memory.souvenirs.map(s => (
              <div key={s.id} className="p-4 rounded-lg bg-museum-surface border border-museum-border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-serif text-base text-parchment-200">{s.name}</span>
                  {s.category && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-museum-card border border-museum-border text-stone-400 uppercase">
                      {s.category}
                    </span>
                  )}
                </div>
                {s.description && (
                  <p className="text-xs text-stone-400 leading-relaxed">{s.description}</p>
                )}
                {s.acquiredDate && (
                  <span className="text-[11px] font-mono text-earth-400 block">Diperoleh: {s.acquiredDate}</span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Archival metadata stamps */}
      <footer className="pt-8 border-t border-museum-border text-xs font-mono text-stone-500 flex flex-wrap items-center justify-between gap-2">
        <span>ID REKAMAN ARSIP: {memory.id}</span>
        <span>DICATAT PADA: {new Date(memory.createdAt).toLocaleDateString('id-ID')}</span>
      </footer>

    </article>
  );
};
