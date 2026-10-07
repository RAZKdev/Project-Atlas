import React, { useState, useEffect, useRef } from 'react';
import { X, MapPin, Calendar, Camera, Tag, Heart, Archive, HardDrive, Upload, Check } from 'lucide-react';
import { Memory, Country, MediaReference, Souvenir } from '../../core/contracts';
import { Button } from '../../components/ui/Button';
import { mediaStore } from '../../core/services/mediaStore';
import { ArchivalMedia } from '../../components/ui/ArchivalMedia';
import { useModalFocusTrap } from '../../core/hooks/useModalFocusTrap';
import { isValidMediaUrl, sanitizePlainText } from '../../core/utils/securityUtils';

interface MemoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (memoryData: Omit<Memory, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => void;
  initialMemory?: Memory | null;
  countries: Country[];
  prefilledCountryCode?: string;
}

export const MemoryFormModal: React.FC<MemoryFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialMemory,
  countries,
  prefilledCountryCode,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  useModalFocusTrap(isOpen, onClose, modalRef);

  const [title, setTitle] = useState('');
  const [countryCode, setCountryCode] = useState('ID');
  const [placeName, setPlaceName] = useState('');
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [summary, setSummary] = useState('');
  const [notes, setNotes] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [imageCaption, setImageCaption] = useState('');
  const [imagePhotographer, setImagePhotographer] = useState('');
  const [isPersonalPhoto, setIsPersonalPhoto] = useState(true);
  const [favorite, setFavorite] = useState(false);

  // Souvenir fields (optional)
  const [souvenirName, setSouvenirName] = useState('');
  const [souvenirDesc, setSouvenirDesc] = useState('');
  const [souvenirCategory, setSouvenirCategory] = useState<Souvenir['category']>('artifact');

  useEffect(() => {
    if (initialMemory) {
      setTitle(initialMemory.title);
      setCountryCode(initialMemory.countryCode);
      setPlaceName(initialMemory.placeName);
      setDateStart(initialMemory.dateStart);
      setDateEnd(initialMemory.dateEnd || '');
      setSummary(initialMemory.summary);
      setNotes(initialMemory.notes || '');
      setTagsInput(initialMemory.tags?.join(', ') || '');
      setImageUrl(initialMemory.coverImage?.uri || '');
      setMediaType(initialMemory.coverImage?.type === 'video' ? 'video' : 'image');
      setImageCaption(initialMemory.coverImage?.caption || '');
      setImagePhotographer(initialMemory.coverImage?.attribution?.photographer || '');
      setIsPersonalPhoto(initialMemory.coverImage?.isPersonal ?? true);
      setFavorite(initialMemory.favorite || false);
      if (initialMemory.souvenirs && initialMemory.souvenirs.length > 0) {
        setSouvenirName(initialMemory.souvenirs[0].name || '');
        setSouvenirDesc(initialMemory.souvenirs[0].description || '');
        setSouvenirCategory(initialMemory.souvenirs[0].category || 'artifact');
      } else {
        setSouvenirName('');
        setSouvenirDesc('');
      }
    } else {
      // New memory reset
      setTitle('');
      setCountryCode(prefilledCountryCode || 'ID');
      setPlaceName('');
      setDateStart(new Date().toISOString().split('T')[0]);
      setDateEnd('');
      setSummary('');
      setNotes('');
      setTagsInput('');
      setImageUrl('');
      setMediaType('image');
      setImageCaption('');
      setImagePhotographer('');
      setIsPersonalPhoto(true);
      setFavorite(false);
      setSouvenirName('');
      setSouvenirDesc('');
    }
  }, [initialMemory, prefilledCountryCode, isOpen]);

  const [isPickingLocal, setIsPickingLocal] = useState(false);

  const handlePickLocalImage = async () => {
    try {
      setIsPickingLocal(true);
      const files = await mediaStore.pickLocalMedia({ type: 'all', multiple: false });
      if (files && files.length > 0) {
        const file = files[0];
        const isVid = file.type.startsWith('video/') || /\.(mp4|webm|mov|m4v)($|\?)/i.test(file.name);
        const mediaId = `local-${Date.now()}`;
        const mediaKey = await mediaStore.saveMediaBlob(mediaId, file, file.name);
        setImageUrl(mediaKey);
        setMediaType(isVid ? 'video' : 'image');
        if (!imageCaption) {
          setImageCaption(file.name.replace(/\.[^/.]+$/, ""));
        }
        setIsPersonalPhoto(true);
      }
    } catch (err) {
      console.error('Failed to pick local media:', err);
    } finally {
      setIsPickingLocal(false);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sanitizedTitle = sanitizePlainText(title, 200);
    const sanitizedPlace = sanitizePlainText(placeName, 200);
    const sanitizedSummary = sanitizePlainText(summary, 2000);
    const sanitizedNotes = notes.trim() ? sanitizePlainText(notes, 5000) : undefined;

    if (!sanitizedTitle || !sanitizedPlace || !dateStart) {
      alert('Harap isi kolom wajib: Judul, Nama Tempat, dan Tanggal.');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map(t => sanitizePlainText(t.trim().toLowerCase(), 50))
      .filter(t => t.length > 0);

    let coverImage: MediaReference | undefined = undefined;
    const mediaReferences: MediaReference[] = [];

    if (imageUrl.trim()) {
      if (!isValidMediaUrl(imageUrl.trim())) {
        alert('URL Media tidak valid atau mengandung skema protokol yang tidak diizinkan demi keamanan.');
        return;
      }

      coverImage = {
        id: `img-${Date.now()}`,
        type: mediaType,
        uri: imageUrl.trim(),
        caption: sanitizePlainText(imageCaption, 300) || sanitizedTitle,
        date: dateStart,
        countryCode,
        isPersonal: isPersonalPhoto,
        attribution: isPersonalPhoto ? undefined : {
          photographer: sanitizePlainText(imagePhotographer, 200) || 'Kurasi Referensi',
          source: 'Web',
          license: 'Creative Commons / Domain Publik'
        }
      };
      mediaReferences.push(coverImage);
    }

    const souvenirs: Souvenir[] = [];
    if (souvenirName.trim()) {
      souvenirs.push({
        id: `souv-${Date.now()}`,
        countryCode,
        name: sanitizePlainText(souvenirName, 200),
        description: sanitizePlainText(souvenirDesc, 1000),
        category: souvenirCategory,
        acquiredDate: dateStart
      });
    }

    onSave({
      id: initialMemory?.id,
      title: sanitizedTitle,
      countryCode,
      placeName: sanitizedPlace,
      dateStart,
      dateEnd: dateEnd ? dateEnd : undefined,
      summary: sanitizedSummary,
      notes: sanitizedNotes,
      tags,
      favorite,
      coverImage,
      mediaReferences,
      souvenirs: souvenirs.length > 0 ? souvenirs : undefined
    });

    onClose();
  };

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="memory-form-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto"
    >
      <div className="relative w-full max-w-2xl bg-museum-surface rounded-2xl border border-museum-border shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-museum-border bg-museum-card">
          <div>
            <span className="text-[11px] font-mono text-earth-400 uppercase tracking-wider">
              {initialMemory ? 'Edit Catatan Arsip' : 'Catat Memori Baru'}
            </span>
            <h2 id="memory-form-modal-title" className="font-serif text-xl text-parchment-100">
              {initialMemory ? initialMemory.title : 'Arsipkan Momen Perjalanan'}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup Formulir Memori"
            className="p-1 rounded-md text-stone-400 hover:text-parchment-100 hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Section: Primary Identity */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-parchment-300 mb-1">
                Judul Catatan *
              </label>
              <input
                type="text"
                required
                placeholder="cth. Fajar di Lautan Pasir Kaldera Bromo"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full bg-museum-card border border-museum-border rounded-md px-3.5 py-2 text-sm text-parchment-100 placeholder:text-stone-500 focus:outline-none focus:border-earth-500/50"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-parchment-300 mb-1">
                  Negara *
                </label>
                <select
                  value={countryCode}
                  onChange={e => setCountryCode(e.target.value)}
                  className="w-full bg-museum-card border border-museum-border rounded-md px-3.5 py-2 text-sm text-parchment-100 focus:outline-none focus:border-earth-500/50 cursor-pointer"
                >
                  {countries.map(c => (
                    <option key={c.code} value={c.code}>
                      {c.name} ({c.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-parchment-300 mb-1">
                  Nama Tempat / Wilayah *
                </label>
                <input
                  type="text"
                  required
                  placeholder="cth. Gunung Bromo, Jawa Timur"
                  value={placeName}
                  onChange={e => setPlaceName(e.target.value)}
                  className="w-full bg-museum-card border border-museum-border rounded-md px-3.5 py-2 text-sm text-parchment-100 placeholder:text-stone-500 focus:outline-none focus:border-earth-500/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-parchment-300 mb-1">
                  Tanggal (atau Tanggal Mulai) *
                </label>
                <input
                  type="date"
                  required
                  value={dateStart}
                  onChange={e => setDateStart(e.target.value)}
                  className="w-full bg-museum-card border border-museum-border rounded-md px-3.5 py-2 text-sm text-parchment-100 focus:outline-none focus:border-earth-500/50 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-parchment-300 mb-1">
                  Tanggal Selesai (Opsional)
                </label>
                <input
                  type="date"
                  value={dateEnd}
                  onChange={e => setDateEnd(e.target.value)}
                  className="w-full bg-museum-card border border-museum-border rounded-md px-3.5 py-2 text-sm text-parchment-100 focus:outline-none focus:border-earth-500/50 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Section: Reflections & Summary */}
          <div className="space-y-4 pt-4 border-t border-museum-border/60">
            <div>
              <label className="block text-xs font-mono text-parchment-300 mb-1">
                Ringkasan Singkat Memori *
              </label>
              <textarea
                required
                rows={2}
                placeholder="Ringkasan padat tentang momen, suasana, atau pengalaman..."
                value={summary}
                onChange={e => setSummary(e.target.value)}
                className="w-full bg-museum-card border border-museum-border rounded-md px-3.5 py-2 text-sm text-parchment-100 placeholder:text-stone-500 focus:outline-none focus:border-earth-500/50 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-parchment-300 mb-1">
                Catatan Jurnal & Refleksi Perjalanan (Opsional)
              </label>
              <textarea
                rows={4}
                placeholder="Detail suasana, percakapan, cuaca, aroma, atau pemikiran hari itu..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full bg-museum-card border border-museum-border rounded-md px-3.5 py-2 text-sm text-parchment-100 placeholder:text-stone-500 focus:outline-none focus:border-earth-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-parchment-300 mb-1">
                Label / Tag (Pisahkan dengan koma)
              </label>
              <input
                type="text"
                placeholder="cth. gunung api, matahari terbit, kebun teh, hujan"
                value={tagsInput}
                onChange={e => setTagsInput(e.target.value)}
                className="w-full bg-museum-card border border-museum-border rounded-md px-3.5 py-2 text-sm text-parchment-100 placeholder:text-stone-500 focus:outline-none focus:border-earth-500/50"
              />
            </div>
          </div>

          {/* Section: Photography Reference */}
          <div className="space-y-4 pt-4 border-t border-museum-border/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-earth-400 uppercase tracking-wider flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5" />
                <span>Referensi Foto Otentik</span>
              </span>
              {imageUrl && (
                <button
                  type="button"
                  onClick={() => { setImageUrl(''); setImageCaption(''); }}
                  className="text-[11px] font-mono text-stone-400 hover:text-red-400 cursor-pointer"
                >
                  Hapus Foto
                </button>
              )}
            </div>

            {/* Local Drive Picker Button */}
            <div className="p-3.5 rounded-lg bg-museum-card border border-museum-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-xs font-medium text-parchment-200 block">
                  Pilih Foto atau Video dari Drive Laptop
                </span>
                <span className="text-[11px] text-stone-400 font-mono block">
                  Mendukung foto (JPG, PNG) & rekaman video (MP4, WebM, MOV) via IndexedDB lokal.
                </span>
              </div>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handlePickLocalImage}
                disabled={isPickingLocal}
                icon={<HardDrive className="w-3.5 h-3.5 text-earth-400" />}
              >
                {isPickingLocal ? 'Membuka...' : 'Jelajahi Drive Laptop'}
              </Button>
            </div>

            {/* Or URL input */}
            <div>
              <label className="block text-xs font-mono text-stone-400 mb-1">
                Atau masukkan URL / Path Media Web:
              </label>
              <input
                type="text"
                placeholder="https://... atau local-media:..."
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
                className="w-full bg-museum-card border border-museum-border rounded-md px-3 py-1.5 text-xs text-parchment-100 placeholder:text-stone-500 focus:outline-none focus:border-earth-500/50"
              />
            </div>

            {/* Media preview container */}
            {imageUrl && (
              <div className="p-3 rounded-lg bg-museum-card border border-museum-border/70 flex items-center gap-4">
                <div className="w-20 h-20 rounded-md overflow-hidden bg-museum-surface shrink-0 border border-museum-border relative">
                  <ArchivalMedia
                    src={imageUrl}
                    forceType={mediaType}
                    controls={mediaType === 'video'}
                    className="w-full h-full object-cover"
                  />
                  {mediaType === 'video' && (
                    <span className="absolute bottom-1 right-1 px-1 rounded bg-black/80 text-[8px] font-mono text-sky-300">
                      VIDEO
                    </span>
                  )}
                </div>
                <div className="text-xs space-y-1">
                  <span className="text-earth-300 font-mono block text-[11px]">
                    {imageUrl.startsWith('local-media:')
                      ? (mediaType === 'video' ? 'Klip Video Laptop (IndexedDB)' : 'Foto Laptop Lokal (IndexedDB)')
                      : 'Referensi Media Web'}
                  </span>
                  <span className="text-stone-400 text-[11px] line-clamp-1 block">
                    {imageCaption || 'Media terlampir pada catatan'}
                  </span>
                </div>
              </div>
            )}

            {imageUrl && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-parchment-300 mb-1">
                    Keterangan Foto
                  </label>
                  <input
                    type="text"
                    placeholder="Deskripsi singkat foto"
                    value={imageCaption}
                    onChange={e => setImageCaption(e.target.value)}
                    className="w-full bg-museum-card border border-museum-border rounded-md px-3 py-1.5 text-xs text-parchment-100 focus:outline-none focus:border-earth-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-parchment-300 mb-1">
                    Asal Usul Foto
                  </label>
                  <div className="flex items-center gap-4 mt-2">
                    <label className="inline-flex items-center gap-1.5 text-xs text-stone-300 cursor-pointer">
                      <input
                        type="radio"
                        checked={isPersonalPhoto}
                        onChange={() => setIsPersonalPhoto(true)}
                        className="accent-earth-500"
                      />
                      <span>Foto Pribadi Sendiri</span>
                    </label>
                    <label className="inline-flex items-center gap-1.5 text-xs text-stone-300 cursor-pointer">
                      <input
                        type="radio"
                        checked={!isPersonalPhoto}
                        onChange={() => setIsPersonalPhoto(false)}
                        className="accent-earth-500"
                      />
                      <span>Kurasi Eksternal</span>
                    </label>
                  </div>
                </div>

                {!isPersonalPhoto && (
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-mono text-parchment-300 mb-1">
                      Fotografer / Atribusi Sumber
                    </label>
                    <input
                      type="text"
                      placeholder="cth. Jonatan Pie / Unsplash"
                      value={imagePhotographer}
                      onChange={e => setImagePhotographer(e.target.value)}
                      className="w-full bg-museum-card border border-museum-border rounded-md px-3 py-1.5 text-xs text-parchment-100 focus:outline-none focus:border-earth-500/50"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Section: Museum Souvenir */}
          <div className="space-y-4 pt-4 border-t border-museum-border/60">
            <span className="text-xs font-mono text-earth-400 uppercase tracking-wider flex items-center gap-1.5">
              <Archive className="w-3.5 h-3.5" />
              <span>Artefak / Suvenir Fisik (Opsional)</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-parchment-300 mb-1">
                  Nama Artefak / Barang
                </label>
                <input
                  type="text"
                  placeholder="cth. Kain Tenun Tradisional atau Cap Kuil"
                  value={souvenirName}
                  onChange={e => setSouvenirName(e.target.value)}
                  className="w-full bg-museum-card border border-museum-border rounded-md px-3.5 py-2 text-sm text-parchment-100 placeholder:text-stone-500 focus:outline-none focus:border-earth-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-parchment-300 mb-1">
                  Kategori
                </label>
                <select
                  value={souvenirCategory}
                  onChange={e => setSouvenirCategory(e.target.value as Souvenir['category'])}
                  className="w-full bg-museum-card border border-museum-border rounded-md px-3.5 py-2 text-sm text-parchment-100 focus:outline-none focus:border-earth-500/50 cursor-pointer"
                >
                  <option value="artifact">Artefak / Kerajinan Tangan</option>
                  <option value="textile">Tekstil / Kain Tradisional</option>
                  <option value="ticket">Tiket / Tiket Masuk / Boarding Pass</option>
                  <option value="stamp">Perangko / Cap Resmi</option>
                  <option value="postcard">Kartu Pos</option>
                  <option value="coin">Koin / Mata Uang</option>
                  <option value="other">Tanda Kenangan Lainnya</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-mono text-parchment-300 mb-1">
                  Deskripsi Artefak
                </label>
                <input
                  type="text"
                  placeholder="Di mana Anda mendapatkannya? Siapa pembuatnya?"
                  value={souvenirDesc}
                  onChange={e => setSouvenirDesc(e.target.value)}
                  className="w-full bg-museum-card border border-museum-border rounded-md px-3.5 py-2 text-sm text-parchment-100 placeholder:text-stone-500 focus:outline-none focus:border-earth-500/50"
                />
              </div>
            </div>
          </div>

          {/* Cherished Toggle */}
          <div className="pt-4 border-t border-museum-border/60">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={favorite}
                onChange={e => setFavorite(e.target.checked)}
                className="w-4 h-4 accent-earth-500 rounded"
              />
              <span className="text-xs font-mono text-parchment-200 flex items-center gap-1.5">
                <Heart className={`w-3.5 h-3.5 ${favorite ? 'text-rose-400 fill-current' : 'text-stone-400'}`} />
                <span>Tandai memori ini sebagai Sangat Berharga (Favorit)</span>
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-museum-border">
            <Button variant="ghost" type="button" onClick={onClose}>
              Batal
            </Button>
            <Button variant="primary" type="submit">
              {initialMemory ? 'Simpan Perubahan' : 'Catat Memori'}
            </Button>
          </div>

        </form>

      </div>
    </div>
  );
};
