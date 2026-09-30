import React from 'react';
import { ArrowLeft, MapPin, Calendar, Camera, Archive, Plus, Globe } from 'lucide-react';
import { Country, CountryStatus, Memory } from '../../core/contracts';
import { StatusBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ArchivalImage } from '../../components/ui/ArchivalImage';

interface CountryDetailPageProps {
  country: Country;
  memories: Memory[];
  onBack: () => void;
  onSelectMemory: (id: string) => void;
  onNewMemory: (prefilledCountryCode: string) => void;
  onUpdateCountryStatus: (code: string, status: CountryStatus) => void;
}

export const CountryDetailPage: React.FC<CountryDetailPageProps> = ({
  country,
  memories,
  onBack,
  onSelectMemory,
  onNewMemory,
  onUpdateCountryStatus,
}) => {
  // Collect all unique places in this country
  const places = Array.from(new Set(memories.map(m => m.placeName)));
  // Collect all souvenirs
  const souvenirs = memories.flatMap(m => m.souvenirs || []);
  // Collect all photos
  const mediaPhotos = memories.flatMap(m => m.mediaReferences || []);

  const statusLabels: Record<CountryStatus, string> = {
    documented: 'Terdokumentasi',
    visited: 'Pernah Dikunjungi',
    planned: 'Direncanakan',
    interested: 'Diminati',
    unknown: 'Belum Dicatat',
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pb-16">
      
      {/* Back button */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-mono text-stone-400 hover:text-parchment-200 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>KEMBALI KE ATLAS</span>
        </button>
      </div>

      {/* Hero / Cover Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-museum-border bg-museum-surface aspect-[21/9] min-h-[260px]">
        {country.coverImage ? (
          <ArchivalImage
            src={country.coverImage}
            alt={country.name}
            className="w-full h-full object-cover filter brightness-[0.65]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-museum-card">
            <Globe className="w-16 h-16 text-stone-600" />
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-museum-base via-transparent to-transparent opacity-95" />

        <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <StatusBadge status={country.status} />
              <span className="font-mono text-xs text-earth-300">{country.continent}</span>
              <span className="font-mono text-xs text-stone-400">ISO: {country.code}</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl text-parchment-100">
              {country.name}
            </h1>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => onNewMemory(country.code)}
            >
              Tambah Memori
            </Button>
          </div>
        </div>
      </div>

      {/* Summary and Status Modifier */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start border-b border-museum-border pb-8">
        <div className="md:col-span-8 space-y-4">
          <span className="font-mono text-xs text-earth-400 uppercase tracking-wider">Catatan Arsip</span>
          <p className="text-sm sm:text-base text-parchment-300 leading-relaxed font-light">
            {country.summary || 'Belum ada catatan arsip yang dikompilasi untuk negara ini. Catat memori pertama Anda untuk mulai mendokumentasikan tempat.'}
          </p>
        </div>

        <div className="md:col-span-4 bg-museum-surface rounded-lg border border-museum-border p-4 space-y-3">
          <span className="font-mono text-xs text-stone-400 uppercase block">Status Perjalanan</span>
          <div className="flex flex-wrap gap-1.5">
            {(['documented', 'visited', 'planned', 'interested', 'unknown'] as CountryStatus[]).map(st => (
              <button
                key={st}
                onClick={() => onUpdateCountryStatus(country.code, st)}
                className={`px-2.5 py-1 text-xs font-mono rounded border transition-colors cursor-pointer ${
                  country.status === st
                    ? 'bg-earth-500 text-white border-earth-400 font-medium'
                    : 'bg-museum-card border-museum-border text-stone-400 hover:text-parchment-200'
                }`}
              >
                {statusLabels[st]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Documented Places in this Country */}
      {places.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-serif text-xl text-parchment-100 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-earth-400" />
            <span>Tempat Terdokumentasi ({places.length})</span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {places.map((place, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-full bg-museum-card border border-museum-border text-xs font-mono text-parchment-200"
              >
                {place}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Documented Memories Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-museum-border pb-3">
          <h2 className="font-serif text-2xl text-parchment-100">
            Memori Terarsip ({memories.length})
          </h2>
          <Button
            variant="secondary"
            size="sm"
            icon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => onNewMemory(country.code)}
          >
            Catatan Baru
          </Button>
        </div>

        {memories.length === 0 ? (
          <div className="p-8 rounded-lg border border-dashed border-museum-border text-center space-y-3 bg-museum-surface/30">
            <p className="text-sm text-stone-400">
              Belum ada memori yang didokumentasikan untuk {country.name}.
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={() => onNewMemory(country.code)}
            >
              Dokumentasikan Memori Pertama
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {memories.map(mem => (
              <div
                key={mem.id}
                onClick={() => onSelectMemory(mem.id)}
                className="group rounded-lg border border-museum-border bg-museum-card hover:border-earth-500/50 transition-all cursor-pointer overflow-hidden flex flex-col justify-between"
              >
                {mem.coverImage && (
                  <div className="aspect-[16/9] overflow-hidden bg-museum-surface">
                    <ArchivalImage
                      src={mem.coverImage.uri}
                      alt={mem.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono text-stone-400">
                    <Calendar className="w-3 h-3 text-earth-400" />
                    <span>{mem.dateStart}</span>
                    <span>•</span>
                    <span>{mem.placeName}</span>
                  </div>
                  <h3 className="font-serif text-lg text-parchment-100 group-hover:text-earth-300 transition-colors">
                    {mem.title}
                  </h3>
                  <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed">
                    {mem.summary}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Media References Gallery */}
      {mediaPhotos.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-museum-border">
          <h2 className="font-serif text-xl text-parchment-100 flex items-center gap-2">
            <Camera className="w-4 h-4 text-earth-400" />
            <span>Galeri Arsip Visual ({mediaPhotos.length})</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {mediaPhotos.map((photo, idx) => (
              <div key={idx} className="aspect-square rounded-lg overflow-hidden border border-museum-border relative group">
                <ArchivalImage
                  src={photo.uri}
                  alt={photo.caption || 'Foto arsip'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {photo.caption && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-museum-base via-museum-base/80 to-transparent p-2 text-[10px] text-parchment-300 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                    {photo.caption}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Souvenirs / Artifacts for this Country */}
      {souvenirs.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-museum-border">
          <h2 className="font-serif text-xl text-parchment-100 flex items-center gap-2">
            <Archive className="w-4 h-4 text-earth-400" />
            <span>Koleksi Artefak & Suvenir ({souvenirs.length})</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {souvenirs.map(s => (
              <div key={s.id} className="p-4 rounded-lg bg-museum-surface border border-museum-border space-y-1.5">
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
        </div>
      )}

    </div>
  );
};
