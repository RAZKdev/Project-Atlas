import React, { useState } from 'react';
import { Archive, MapPin, Calendar, Camera, Film, HardDrive, Check, X, Sparkles, Tag, BookOpen, Store } from 'lucide-react';
import { Country, MediaReference, Memory, Souvenir } from '../../core/contracts';
import { mediaStore } from '../../core/services/mediaStore';
import { ArchivalMedia } from '../../components/ui/ArchivalMedia';
import { Button } from '../../components/ui/Button';

interface SouvenirWriterProps {
  countries: Country[];
  memories: Memory[];
  onSaveSouvenir: (data: Omit<Souvenir, 'id'>) => void;
  onCancel?: () => void;
}

const SOUVENIR_CATEGORIES = [
  { id: 'artifact', label: '🏺 Artefak / Kerajinan', desc: 'Patung, ukiran, gerabah, pajangan tangan' },
  { id: 'textile', label: '🧣 Tekstil & Pakaian', desc: 'Kain tenun, batik, syal, selimut wol, baju adat' },
  { id: 'ticket', label: '🎟️ Tiket & Karcis', desc: 'Tiket masuk museum, boarding pass, konser, kereta' },
  { id: 'postcard', label: '✉️ Kartu Pos & Surat', desc: 'Kartu pos berstempel, buku sketsa, surat kenangan' },
  { id: 'stamp', label: '📮 Cap & Perangko', desc: 'Cap paspor stasiun, perangko pos bersejarah' },
  { id: 'coin', label: '🪙 Koin & Mata Uang', desc: 'Uang kertas/koin kuno, medali peringatan, token' },
  { id: 'other', label: '📦 Cinderamata Lainnya', desc: 'Batu alam, botol pasir, gantungan kunci, kuliner khas' },
];

export const SouvenirWriter: React.FC<SouvenirWriterProps> = ({
  countries,
  memories,
  onSaveSouvenir,
  onCancel,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Souvenir['category']>('artifact');
  const [countryCode, setCountryCode] = useState('ID');
  const [placeName, setPlaceName] = useState('');
  const [acquiredDate, setAcquiredDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedMemoryId, setSelectedMemoryId] = useState<string>('');
  
  // Media upload state (identical to JournalWriter)
  const [mediaUri, setMediaUri] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [mediaCaption, setMediaCaption] = useState('');
  const [isPickingMedia, setIsPickingMedia] = useState(false);

  // Pick media from laptop hard drive & save binary to IndexedDB
  const handlePickMedia = async () => {
    try {
      setIsPickingMedia(true);
      const files = await mediaStore.pickLocalMedia({ type: 'all', multiple: false });
      if (files && files.length > 0) {
        const file = files[0];
        const isVid = file.type.startsWith('video/') || /\.(mp4|webm|mov|m4v)($|\?)/i.test(file.name);
        const mediaId = `souv-media-${Date.now()}`;
        const key = await mediaStore.saveMediaBlob(mediaId, file, file.name);
        setMediaUri(key);
        setMediaType(isVid ? 'video' : 'image');
        if (!mediaCaption) {
          setMediaCaption(file.name.replace(/\.[^/.]+$/, ''));
        }
      }
    } catch (err) {
      console.warn('Gagal memilih media suvenir dari laptop:', err);
    } finally {
      setIsPickingMedia(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Harap isi Nama Suvenir / Cinderamata.');
      return;
    }

    let photoReference: MediaReference | undefined = undefined;
    if (mediaUri.trim()) {
      photoReference = {
        id: `med-${Date.now()}`,
        type: mediaType,
        uri: mediaUri.trim(),
        caption: mediaCaption.trim() || name,
        date: acquiredDate,
        countryCode,
        isPersonal: true,
      };
    }

    onSaveSouvenir({
      name: name.trim(),
      category,
      countryCode,
      placeName: placeName.trim() || undefined,
      acquiredDate: acquiredDate || undefined,
      description: description.trim() || undefined,
      notes: notes.trim() || undefined,
      photoReference,
      memoryId: selectedMemoryId || undefined,
    });
  };

  return (
    <div className="bg-museum-surface/95 border border-earth-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md relative overflow-hidden animate-fadeIn">
      
      {/* Editorial Header */}
      <div className="flex items-start justify-between border-b border-museum-border pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-earth-400 mb-1">
            <Archive className="w-4 h-4" />
            <span>REGISTRASI ARTEFAK & CINDERAMATA</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-parchment-100 font-bold">
            Catat Koleksi Suvenir Baru
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-xl font-light">
            Abadikan artefak fisik, kerajinan tangan, atau cinderamata yang Anda bawa pulang dari berbagai penjuru dunia.
          </p>
        </div>

        {onCancel && (
          <button
            onClick={onCancel}
            className="p-2 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors"
            title="Tutup Formulir"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* 1. SEKSI UNGGAH FOTO / VIDEO SUVENIR (Sama Persis Seperti Jurnal Perjalanan) */}
        <div className="rounded-xl border border-museum-border/80 bg-stone-900/60 p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-mono text-stone-300 flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-earth-400" />
              <span>FOTO ATAU VIDEO SUVENIR (LOKAL LAPTOP)</span>
            </label>
            <span className="text-[11px] text-stone-400 font-mono">Tersimpan di IndexedDB Laptop</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            
            {/* Upload Action Card */}
            <div className="md:col-span-7 space-y-3">
              <button
                type="button"
                onClick={handlePickMedia}
                disabled={isPickingMedia}
                className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-earth-600/30 hover:bg-earth-600/40 border border-earth-500/50 text-earth-200 text-xs font-medium transition-all shadow-sm cursor-pointer"
              >
                <HardDrive className="w-4 h-4 text-earth-400" />
                <span>{isPickingMedia ? 'Memuat file dari laptop...' : 'Pilih Foto / Video dari Laptop'}</span>
              </button>

              <div className="flex items-center gap-2 text-stone-500 text-xs font-mono">
                <span className="h-px bg-stone-800 flex-1" />
                <span>atau ketik path lokal</span>
                <span className="h-px bg-stone-800 flex-1" />
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={mediaUri}
                  onChange={e => setMediaUri(e.target.value)}
                  placeholder="Contoh: /uploads/patung-bali.jpg atau URL foto/video"
                  className="flex-1 bg-stone-950/80 border border-museum-border rounded-lg px-3 py-2 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-earth-400 font-mono"
                />
                <select
                  value={mediaType}
                  onChange={e => setMediaType(e.target.value as 'image' | 'video')}
                  className="bg-stone-900 border border-museum-border rounded-lg px-2.5 py-2 text-xs text-stone-200 focus:outline-none focus:border-earth-400"
                >
                  <option value="image">Foto</option>
                  <option value="video">Video</option>
                </select>
              </div>

              <input
                type="text"
                value={mediaCaption}
                onChange={e => setMediaCaption(e.target.value)}
                placeholder="Keterangan foto (misal: Tampak samping ukiran kayu)"
                className="w-full bg-stone-950/80 border border-museum-border rounded-lg px-3 py-1.5 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-earth-400"
              />
            </div>

            {/* Media Live Preview */}
            <div className="md:col-span-5 flex flex-col items-center justify-center">
              {mediaUri ? (
                <div className="relative w-full h-36 rounded-xl overflow-hidden border border-museum-border bg-stone-950 shadow-md">
                  <ArchivalMedia
                    src={mediaUri}
                    alt={name || 'Preview suvenir'}
                    className="w-full h-full object-cover"
                    controls={true}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setMediaUri('');
                      setMediaCaption('');
                    }}
                    className="absolute top-2 right-2 p-1 rounded-full bg-black/70 text-stone-300 hover:text-white transition-colors"
                    title="Hapus media ini"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="w-full h-36 rounded-xl border border-dashed border-museum-border flex flex-col items-center justify-center text-stone-500 text-xs text-center p-4 bg-stone-950/30">
                  <Camera className="w-6 h-6 mb-1 text-stone-600" />
                  <span>Pratinjau foto atau video suvenir akan muncul di sini</span>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* 2. NAMA SUVENIR & KATEGORI BENDA */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          
          <div className="md:col-span-7 space-y-2">
            <label className="block text-xs font-mono text-stone-300">
              NAMA SUVENIR / CINDERAMATA *
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Contoh: Topeng Kayu Barong Gianyar, Syal Wol Domba Islandia..."
              required
              className="w-full bg-stone-950/90 border border-museum-border rounded-xl px-4 py-2.5 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-earth-400"
            />
          </div>

          <div className="md:col-span-5 space-y-2">
            <label className="block text-xs font-mono text-stone-300">
              KATEGORI BENDA
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as Souvenir['category'])}
              className="w-full bg-stone-950/90 border border-museum-border rounded-xl px-3 py-2.5 text-xs text-stone-200 focus:outline-none focus:border-earth-400"
            >
              {SOUVENIR_CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* 3. KATEGORI VISUAL PILLS */}
        <div>
          <label className="block text-xs font-mono text-stone-400 mb-2">
            PILIH KATEGORI KOLEKSI CEPAT:
          </label>
          <div className="flex flex-wrap gap-2">
            {SOUVENIR_CATEGORIES.map(cat => (
              <button
                type="button"
                key={cat.id}
                onClick={() => setCategory(cat.id as Souvenir['category'])}
                className={`px-3 py-1.5 rounded-lg text-xs transition-all flex items-center gap-1.5 ${
                  category === cat.id
                    ? 'bg-earth-600 text-stone-100 font-medium shadow-sm border border-earth-400'
                    : 'bg-stone-900/80 text-stone-400 border border-museum-border hover:border-stone-700'
                }`}
                title={cat.desc}
              >
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 4. ASAL NEGARA, TEMPAT DIBELI & TANGGAL */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Negara (195 Negara) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-mono text-stone-300 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-earth-400" />
              <span>NEGARA ASAL</span>
            </label>
            <select
              value={countryCode}
              onChange={e => setCountryCode(e.target.value)}
              className="w-full bg-stone-950/90 border border-museum-border rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-earth-400"
            >
              {countries.map(c => (
                <option key={c.code} value={c.code}>
                  {c.name} ({c.code}) - {c.continent}
                </option>
              ))}
            </select>
          </div>

          {/* Tempat / Toko Beli */}
          <div className="space-y-1.5">
            <label className="block text-xs font-mono text-stone-300 flex items-center gap-1">
              <Store className="w-3.5 h-3.5 text-earth-400" />
              <span>TEMPAT / PASAR DIBELI</span>
            </label>
            <input
              type="text"
              value={placeName}
              onChange={e => setPlaceName(e.target.value)}
              placeholder="Misal: Pasar Sukawati, Toko Antik Vík..."
              className="w-full bg-stone-950/90 border border-museum-border rounded-xl px-3 py-2 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-earth-400"
            />
          </div>

          {/* Tanggal */}
          <div className="space-y-1.5">
            <label className="block text-xs font-mono text-stone-300 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-earth-400" />
              <span>TANGGAL DIPEROLEH</span>
            </label>
            <input
              type="date"
              value={acquiredDate}
              onChange={e => setAcquiredDate(e.target.value)}
              className="w-full bg-stone-950/90 border border-museum-border rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-earth-400"
            />
          </div>

        </div>

        {/* 5. KISAH & CATATAN DI BALIK SUVENIR */}
        <div className="space-y-2">
          <label className="block text-xs font-mono text-stone-300">
            KISAH & KENANGAN DI BALIK BENDA INI
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Ceritakan bagaimana Anda mendapatkan benda ini, obrolan dengan pengrajin lokal, atau makna berharga yang terkandung di dalamnya..."
            className="w-full bg-stone-950/90 border border-museum-border rounded-xl p-3 text-xs sm:text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-earth-400 leading-relaxed resize-none"
          />
        </div>

        {/* 6. TAUTKAN DENGAN JURNAL PERJALANAN (OPSIONAL) */}
        {memories.length > 0 && (
          <div className="p-4 rounded-xl bg-stone-900/40 border border-museum-border/70 space-y-2">
            <label className="block text-xs font-mono text-stone-300 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-earth-400" />
              <span>TAUTKAN DENGAN CATATAN JURNAL PERJALANAN (OPSIONAL)</span>
            </label>
            <select
              value={selectedMemoryId}
              onChange={e => setSelectedMemoryId(e.target.value)}
              className="w-full bg-stone-950 border border-museum-border rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-earth-400"
            >
              <option value="">-- Tidak Ditautkan ke Jurnal Tertentu --</option>
              {memories.map(m => (
                <option key={m.id} value={m.id}>
                  [{m.countryCode}] {m.title} ({m.placeName} • {m.dateStart})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* SUBMIT BUTTONS */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-museum-border">
          {onCancel && (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={onCancel}
              className="text-xs"
            >
              Batal
            </Button>
          )}

          <Button
            type="submit"
            variant="primary"
            size="sm"
            className="text-xs flex items-center gap-1.5 shadow-lg"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Simpan ke Lemari Suvenir</span>
          </Button>
        </div>

      </form>

    </div>
  );
};
