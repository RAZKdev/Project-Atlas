import React, { useState, useMemo, useEffect } from 'react';
import { Film, Play, Upload, HardDrive, MapPin, Calendar, Plus, Sparkles, Filter, Info, ArrowRight, Maximize2, X, Database } from 'lucide-react';
import { Country, Memory, MediaReference } from '../../core/contracts';
import { mediaStore } from '../../core/services/mediaStore';
import { storageService } from '../../core/services/storageService';
import { ArchivalMedia } from '../../components/ui/ArchivalMedia';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';

interface VideoTheaterPageProps {
  memories: Memory[];
  countries: Country[];
  onSelectCountry: (code: string) => void;
  onSelectMemory: (id: string) => void;
  onRefresh: () => void;
}

interface VideoItem {
  id: string;
  uri: string;
  title: string;
  placeName: string;
  countryCode: string;
  date: string;
  caption?: string;
  notes?: string;
  memoryId: string;
}

export const VideoTheaterPage: React.FC<VideoTheaterPageProps> = ({
  memories,
  countries,
  onSelectCountry,
  onSelectMemory,
  onRefresh,
}) => {
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadGuide, setShowUploadGuide] = useState(false);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [storageQuota, setStorageQuota] = useState<{
    usageFormatted: string;
    quotaFormatted: string;
    usagePercentage: number;
  } | null>(null);

  useEffect(() => {
    mediaStore.getStorageEstimate().then(setStorageQuota);
  }, [memories]);

  // Handle ESC key to exit theater mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsTheaterMode(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Extract all video references from memories
  const allVideos: VideoItem[] = useMemo(() => {
    const list: VideoItem[] = [];
    memories.forEach(m => {
      // Check coverImage if it's video
      if (m.coverImage && m.coverImage.type === 'video') {
        list.push({
          id: m.coverImage.id,
          uri: m.coverImage.uri,
          title: m.title,
          placeName: m.placeName,
          countryCode: m.countryCode,
          date: m.coverImage.date || m.dateStart,
          caption: m.coverImage.caption || m.title,
          notes: m.notes || m.summary,
          memoryId: m.id,
        });
      }

      // Check mediaReferences
      m.mediaReferences?.forEach(r => {
        if (r.type === 'video' && r.uri !== m.coverImage?.uri) {
          list.push({
            id: r.id,
            uri: r.uri,
            title: r.caption || m.title,
            placeName: m.placeName,
            countryCode: m.countryCode,
            date: r.date || m.dateStart,
            caption: r.caption,
            notes: m.notes || m.summary,
            memoryId: m.id,
          });
        }
      });
    });
    return list;
  }, [memories]);

  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  // Filtered videos
  const filteredVideos = useMemo(() => {
    return allVideos.filter(v => selectedCountry === 'all' || v.countryCode === selectedCountry);
  }, [allVideos, selectedCountry]);

  // Currently playing video
  const activeVideo = useMemo(() => {
    if (activeVideoId) {
      return allVideos.find(v => v.id === activeVideoId) || filteredVideos[0] || null;
    }
    return filteredVideos[0] || null;
  }, [activeVideoId, allVideos, filteredVideos]);

  const getCountryName = (code: string) => {
    return countries.find(c => c.code === code)?.name || code;
  };

  // Upload video modal / prompt
  const handleUploadVideoFromLaptop = async () => {
    try {
      setIsUploading(true);
      const files = await mediaStore.pickLocalMedia({ type: 'video', multiple: false });
      if (!files || files.length === 0) return;

      const file = files[0];
      const videoTitle = prompt('Masukkan Judul Video Klip Ini:', file.name.replace(/\.[^/.]+$/, '')) || file.name;
      const placeName = prompt('Lokasi / Tempat Pengambilan Video:', 'Destinasi Perjalanan') || 'Destinasi Perjalanan';
      
      const mediaId = `vid-${Date.now()}`;
      const mediaKey = await mediaStore.saveMediaBlob(mediaId, file, file.name);

      // Save as a new memory record with type video
      const newMemory: Omit<Memory, 'id' | 'createdAt' | 'updatedAt'> = {
        title: videoTitle,
        countryCode: 'ID',
        placeName: placeName,
        dateStart: new Date().toISOString().split('T')[0],
        summary: `Rekaman video perjalanan di ${placeName}.`,
        notes: `Klip video resolusi asli diunggah dari laptop: ${file.name} (${(file.size / (1024 * 1024)).toFixed(1)} MB).`,
        tags: ['video', 'sinematik', 'arsip-lokal'],
        favorite: false,
        coverImage: {
          id: mediaId,
          type: 'video',
          uri: mediaKey,
          caption: videoTitle,
          isPersonal: true,
          date: new Date().toISOString().split('T')[0],
          countryCode: 'ID',
        },
        mediaReferences: [
          {
            id: mediaId,
            type: 'video',
            uri: mediaKey,
            caption: videoTitle,
            isPersonal: true,
            date: new Date().toISOString().split('T')[0],
            countryCode: 'ID',
          }
        ],
      };

      const saved = storageService.saveMemory(newMemory);
      onRefresh();
      setActiveVideoId(mediaId);
      alert(`Video "${videoTitle}" berhasil disimpan ke arsip sinematik lokal Anda!`);
    } catch (err) {
      console.error('Gagal mengunggah video:', err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 pb-20">
      
      {/* Header */}
      <div className="border-b border-museum-border pb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-sky-400 mb-1">
              <Film className="w-3.5 h-3.5" />
              <span>ARSIP SINEMATIK & DOKUMENTASI GERAK</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl text-parchment-100">
              Ruang Sinema Perjalanan
            </h1>
            <p className="text-sm sm:text-base text-stone-300 mt-2 max-w-2xl font-light leading-relaxed">
              Tempat khusus untuk mengabadikan, memutar, dan mengorganisasi seluruh rekaman video perjalanan Anda langsung dari laptop.
            </p>

            {/* Storage Quota Usage Indicator */}
            {storageQuota && (
              <div className="mt-3.5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-museum-surface/90 border border-museum-border text-xs font-mono text-stone-300">
                <Database className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>
                  Penyimpanan Lokal: <strong className="text-sky-300">{storageQuota.usageFormatted}</strong> terpakai (~{storageQuota.quotaFormatted} kuota laptop, {storageQuota.usagePercentage}%)
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Button
              variant="secondary"
              size="sm"
              icon={<Info className="w-3.5 h-3.5" />}
              onClick={() => setShowUploadGuide(!showUploadGuide)}
            >
              {showUploadGuide ? 'Tutup Petunjuk' : 'Panduan Video'}
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<Upload className="w-3.5 h-3.5" />}
              onClick={handleUploadVideoFromLaptop}
              disabled={isUploading}
            >
              {isUploading ? 'Membuka...' : 'Unggah Video dari Laptop'}
            </Button>
          </div>
        </div>

        {/* Upload Guide Banner */}
        {showUploadGuide && (
          <div className="mt-6 p-5 rounded-xl bg-museum-surface/90 border border-sky-500/40 space-y-3 animate-fade-in text-xs">
            <div className="flex items-center gap-2 font-mono text-sky-400 font-semibold uppercase tracking-wider">
              <HardDrive className="w-4 h-4" />
              <span>CARA MENGUNGGAH & MENYIMPAN VIDEO DI PROJECT ATLAS</span>
            </div>
            <p className="text-stone-300 leading-relaxed font-light">
              1. Klik tombol <strong className="text-parchment-100">"Unggah Video dari Laptop"</strong> di kanan atas.<br />
              2. Pilih file rekaman video berformat <strong className="text-sky-300">MP4, WebM, atau MOV</strong> dari folder laptop Anda.<br />
              3. Beri judul dan nama tempat pengambilan rekaman video tersebut.<br />
              4. Video langsung tersimpan di database lokal browser (<strong className="text-parchment-100">IndexedDB</strong>), tidak dikompresi berlebihan, tidak menggunakan kuota internet, dan dapat diputar kapan pun dengan kualitas asli!
            </p>
          </div>
        )}

        {/* Country Filter */}
        {allVideos.length > 0 && (
          <div className="pt-6 flex items-center gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setSelectedCountry('all')}
              className={`px-3 py-1 rounded-md text-xs font-mono whitespace-nowrap transition-colors cursor-pointer ${
                selectedCountry === 'all'
                  ? 'bg-sky-600 text-white font-medium'
                  : 'bg-museum-surface text-stone-400 hover:text-parchment-200 border border-museum-border'
              }`}
            >
              Semua Video ({allVideos.length})
            </button>
            {Array.from(new Set(allVideos.map(v => v.countryCode))).map(code => (
              <button
                key={code}
                onClick={() => setSelectedCountry(code)}
                className={`px-3 py-1 rounded-md text-xs font-mono whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCountry === code
                    ? 'bg-sky-600 text-white font-medium'
                    : 'bg-museum-surface text-stone-400 hover:text-parchment-200 border border-museum-border'
                }`}
              >
                {getCountryName(code)} ({allVideos.filter(v => v.countryCode === code).length})
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Theater & Gallery */}
      {filteredVideos.length === 0 ? (
        <EmptyState
          icon={<Film className="w-8 h-8 text-sky-400" />}
          title="Belum ada video perjalanan terunggah di ruang sinema."
          description="Simpan momen bergerak Anda—mulai dari hiruk pikuk kereta api, deburan ombak pantai, hingga hembusan angin di puncak gunung."
          actionLabel="Unggah Video Pertama dari Laptop"
          onAction={handleUploadVideoFromLaptop}
        />
      ) : (
        <div className="space-y-8">
          
          {/* Main Cinematic Screen Player */}
          {activeVideo && (
            <div className="rounded-2xl border border-museum-border bg-black/90 overflow-hidden shadow-2xl space-y-4">
              <div className="relative aspect-[16/9] max-h-[520px] w-full bg-black flex items-center justify-center group">
                <ArchivalMedia
                  key={activeVideo.uri}
                  src={activeVideo.uri}
                  forceType="video"
                  controls={true}
                  className="w-full h-full object-contain"
                />
                
                {/* Floating Quick Theater Mode trigger */}
                <button
                  onClick={() => setIsTheaterMode(true)}
                  className="absolute top-4 right-4 z-10 px-3 py-1.5 rounded-lg bg-black/70 hover:bg-black/90 text-xs font-mono text-stone-200 hover:text-white border border-white/10 backdrop-blur-md flex items-center gap-1.5 transition-all opacity-80 group-hover:opacity-100 cursor-pointer shadow-lg"
                  title="Masuk ke Mode Bioskop Penuh Layar"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-sky-400" />
                  <span>Mode Bioskop</span>
                </button>
              </div>

              {/* Theater Information Bar */}
              <div className="p-6 bg-museum-surface border-t border-museum-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-mono text-sky-400">
                    <span
                      onClick={() => onSelectCountry(activeVideo.countryCode)}
                      className="hover:underline cursor-pointer flex items-center gap-1 font-semibold"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{getCountryName(activeVideo.countryCode)}</span>
                    </span>
                    <span className="text-stone-600">•</span>
                    <span className="text-stone-300">{activeVideo.placeName}</span>
                    <span className="text-stone-600">•</span>
                    <span className="text-stone-400">{activeVideo.date}</span>
                  </div>

                  <h2 className="font-serif text-2xl text-parchment-100">
                    {activeVideo.title}
                  </h2>

                  {activeVideo.notes && (
                    <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed max-w-3xl">
                      {activeVideo.notes}
                    </p>
                  )}
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<Maximize2 className="w-3.5 h-3.5 text-sky-400" />}
                    onClick={() => setIsTheaterMode(true)}
                    title="Masuk ke Mode Bioskop Penuh Layar"
                  >
                    Mode Bioskop
                  </Button>

                  <button
                    onClick={() => onSelectMemory(activeVideo.memoryId)}
                    className="px-3.5 py-1.5 rounded bg-museum-card hover:bg-museum-hover border border-museum-border text-xs font-mono text-parchment-200 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Buka Arsip Lengkap</span>
                    <ArrowRight className="w-3.5 h-3.5 text-earth-400" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Fullscreen Theater Mode Overlay (Lights Out) */}
          {isTheaterMode && activeVideo && (
            <div className="fixed inset-0 z-50 bg-[#090807]/95 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-8 animate-fade-in">
              {/* Theater Top Bar */}
              <div className="flex items-center justify-between text-xs font-mono text-stone-300 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Film className="w-4 h-4 text-sky-400" />
                  <span className="uppercase tracking-widest text-sky-300">RUANG SINEMA BIOSKOP</span>
                  <span>•</span>
                  <span className="text-stone-200">{activeVideo.title}</span>
                  <span>({getCountryName(activeVideo.countryCode)})</span>
                </div>
                <button
                  onClick={() => setIsTheaterMode(false)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  title="Keluar dari Mode Bioskop (atau tekan tombol Esc)"
                >
                  <X className="w-4 h-4" />
                  <span>Tutup Bioskop (Esc)</span>
                </button>
              </div>

              {/* Theater Centered Video Player */}
              <div className="flex-1 flex items-center justify-center my-auto max-w-6xl w-full mx-auto relative">
                <div className="w-full aspect-[16/9] max-h-[75vh] rounded-2xl overflow-hidden shadow-2xl shadow-sky-950/40 border border-white/10 bg-black">
                  <ArchivalMedia
                    key={`theater-${activeVideo.uri}`}
                    src={activeVideo.uri}
                    forceType="video"
                    controls={true}
                    autoPlay={true}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Theater Bottom Bar */}
              <div className="text-center text-xs font-mono text-stone-400 pt-2 border-t border-white/5">
                <span>{activeVideo.placeName} • {activeVideo.date} • Tekan </span>
                <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-stone-200">Esc</kbd>
                <span> untuk kembali ke galeri</span>
              </div>
            </div>
          )}

          {/* Video Reel / Catalog Grid */}
          <div className="space-y-4 pt-4">
            <h3 className="font-serif text-xl text-parchment-100 flex items-center gap-2">
              <Film className="w-4 h-4 text-sky-400" />
              <span>Koleksi Klip Video ({filteredVideos.length})</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredVideos.map(vid => {
                const isCurrent = activeVideo?.id === vid.id;
                return (
                  <div
                    key={vid.id}
                    onClick={() => setActiveVideoId(vid.id)}
                    className={`rounded-xl border p-3 bg-museum-surface transition-all cursor-pointer flex flex-col justify-between space-y-3 group ${
                      isCurrent
                        ? 'border-sky-400 shadow-lg shadow-sky-500/10 bg-museum-surface/90'
                        : 'border-museum-border hover:border-sky-500/50'
                    }`}
                  >
                    <div className="aspect-[16/10] rounded-lg overflow-hidden bg-black relative border border-museum-border/60">
                      <ArchivalMedia
                        src={vid.uri}
                        forceType="video"
                        controls={false}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 flex items-center justify-center transition-colors">
                        <div className="w-10 h-10 rounded-full bg-black/60 border border-white/30 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                          <Play className="w-4 h-4 fill-white ml-0.5" />
                        </div>
                      </div>
                      <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono text-sky-300">
                        VIDEO
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-stone-400">
                        <span>{getCountryName(vid.countryCode)}</span>
                        <span>•</span>
                        <span>{vid.date}</span>
                      </div>
                      <h4 className="font-serif text-sm font-semibold text-parchment-100 group-hover:text-sky-300 transition-colors line-clamp-1">
                        {vid.title}
                      </h4>
                      <p className="text-[11px] text-stone-400 line-clamp-1">
                        {vid.placeName}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
