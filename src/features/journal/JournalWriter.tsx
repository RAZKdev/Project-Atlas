import React, { useState, useEffect, useMemo } from 'react';
import { BookOpen, MapPin, Calendar, Camera, Film, HardDrive, Check, X, Sparkles, Feather, Clock, Trash2, CheckCircle2 } from 'lucide-react';
import { Country, MediaReference, Memory } from '../../core/contracts';
import { mediaStore } from '../../core/services/mediaStore';
import { ArchivalMedia } from '../../components/ui/ArchivalMedia';
import { Button } from '../../components/ui/Button';

interface JournalWriterProps {
  countries: Country[];
  onSaveJournal: (data: Omit<Memory, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel?: () => void;
}

const DRAFT_KEY = 'project_atlas_journal_draft_v1';

const WEATHER_MOODS = [
  { id: 'sunny', label: '☀️ Cerah & Hangat' },
  { id: 'rainy', label: '🌧️ Hujan & Tenang' },
  { id: 'foggy', label: '🌫️ Berkabut Misterius' },
  { id: 'night', label: '🌙 Senja / Malam' },
  { id: 'snowy', label: '❄️ Dingin Bersalju' },
  { id: 'cafe', label: '☕ Di Kedai Kopi' },
];

export const JournalWriter: React.FC<JournalWriterProps> = ({
  countries,
  onSaveJournal,
  onCancel,
}) => {
  const [title, setTitle] = useState('');
  const [countryCode, setCountryCode] = useState('ID');
  const [placeName, setPlaceName] = useState('');
  const [dateStart, setDateStart] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMood, setSelectedMood] = useState('sunny');
  const [content, setContent] = useState('');
  const [mediaUri, setMediaUri] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [mediaCaption, setMediaCaption] = useState('');
  const [isPickingMedia, setIsPickingMedia] = useState(false);
  const [draftSavedAt, setDraftSavedAt] = useState<string | null>(null);
  const [hasRestoredDraft, setHasRestoredDraft] = useState(false);

  // Restore draft on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.title || parsed.content || parsed.placeName) {
          setTitle(parsed.title || '');
          setCountryCode(parsed.countryCode || 'ID');
          setPlaceName(parsed.placeName || '');
          setDateStart(parsed.dateStart || new Date().toISOString().split('T')[0]);
          setSelectedMood(parsed.selectedMood || 'sunny');
          setContent(parsed.content || '');
          setMediaUri(parsed.mediaUri || '');
          setMediaType(parsed.mediaType || 'image');
          setMediaCaption(parsed.mediaCaption || '');
          if (parsed.savedAt) {
            const time = new Date(parsed.savedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
            setDraftSavedAt(time);
          }
          setHasRestoredDraft(true);
        }
      }
    } catch (err) {
      console.warn('Gagal membaca draf catatan lokal:', err);
    }
  }, []);

  // Debounced auto-save draft
  useEffect(() => {
    if (!title && !placeName && !content && !mediaUri) return;

    const timer = setTimeout(() => {
      try {
        const payload = {
          title,
          countryCode,
          placeName,
          dateStart,
          selectedMood,
          content,
          mediaUri,
          mediaType,
          mediaCaption,
          savedAt: new Date().toISOString(),
        };
        localStorage.setItem(DRAFT_KEY, JSON.stringify(payload));
        const now = new Date();
        setDraftSavedAt(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      } catch (err) {
        console.warn('Gagal menyimpan draf otomatis:', err);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [title, countryCode, placeName, dateStart, selectedMood, content, mediaUri, mediaType, mediaCaption]);

  const handleDiscardDraft = () => {
    if (window.confirm('Buang draf yang belum disimpan dan mulai lembar baru yang bersih?')) {
      localStorage.removeItem(DRAFT_KEY);
      setTitle('');
      setPlaceName('');
      setContent('');
      setMediaUri('');
      setMediaCaption('');
      setDraftSavedAt(null);
      setHasRestoredDraft(false);
    }
  };

  const wordCount = useMemo(() => {
    return content.trim() ? content.trim().split(/\s+/).length : 0;
  }, [content]);

  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  const handlePickMedia = async () => {
    try {
      setIsPickingMedia(true);
      const files = await mediaStore.pickLocalMedia({ type: 'all', multiple: false });
      if (files && files.length > 0) {
        const file = files[0];
        const isVid = file.type.startsWith('video/') || /\.(mp4|webm|mov|m4v)($|\?)/i.test(file.name);
        const mediaId = `media-${Date.now()}`;
        const key = await mediaStore.saveMediaBlob(mediaId, file, file.name);
        setMediaUri(key);
        setMediaType(isVid ? 'video' : 'image');
        if (!mediaCaption) {
          setMediaCaption(file.name.replace(/\.[^/.]+$/, ''));
        }
      }
    } catch (err) {
      console.warn('Gagal memilih media dari laptop:', err);
    } finally {
      setIsPickingMedia(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !placeName.trim() || !content.trim()) {
      alert('Harap isi Judul, Lokasi Tempat, dan Isi Catatan Jurnal Anda.');
      return;
    }

    let coverImage: MediaReference | undefined = undefined;
    const mediaReferences: MediaReference[] = [];

    if (mediaUri.trim()) {
      coverImage = {
        id: `med-${Date.now()}`,
        type: mediaType,
        uri: mediaUri.trim(),
        caption: mediaCaption.trim() || title,
        date: dateStart,
        countryCode,
        isPersonal: true,
      };
      mediaReferences.push(coverImage);
    }

    // Extract first 160 characters as summary
    const summary = content.trim().length > 160
      ? content.trim().slice(0, 160) + '...'
      : content.trim();

    const moodLabel = WEATHER_MOODS.find(m => m.id === selectedMood)?.label || '';

    onSaveJournal({
      title: title.trim(),
      countryCode,
      placeName: placeName.trim(),
      dateStart,
      summary,
      notes: content.trim(),
      tags: ['jurnal-perjalanan', moodLabel.toLowerCase().replace(/[^a-z0-9]/g, '-')],
      favorite: false,
      coverImage,
      mediaReferences,
    });

    // Clear draft
    localStorage.removeItem(DRAFT_KEY);
    setDraftSavedAt(null);
    setHasRestoredDraft(false);

    // Reset
    setTitle('');
    setPlaceName('');
    setContent('');
    setMediaUri('');
    setMediaCaption('');
  };

  return (
    <div className="bg-museum-surface rounded-2xl border border-museum-border p-6 sm:p-8 shadow-2xl space-y-6 animate-fade-in relative overflow-hidden">
      
      {/* Vintage Book Spine Accent */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-earth-600 via-earth-400 to-earth-600 opacity-80" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-museum-border/60 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-earth-500/10 border border-earth-500/30 flex items-center justify-center text-earth-300">
            <Feather className="w-4 h-4" />
          </div>
          <div>
            <span className="font-mono text-[11px] text-earth-400 uppercase tracking-widest block">
              LEMBAR TULIS JURNAL PENJELAJAH
            </span>
            <h2 className="font-serif text-xl sm:text-2xl text-parchment-100">
              Tulis Catatan Perjalanan Baru
            </h2>
          </div>
        </div>

        {onCancel && (
          <button
            onClick={onCancel}
            className="p-1 rounded-md text-stone-400 hover:text-white transition-colors cursor-pointer"
            title="Tutup Lembar Jurnal"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Draft Notification / Status Bar */}
      {draftSavedAt && (
        <div className="flex items-center justify-between px-3.5 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>
              {hasRestoredDraft ? 'Draf tulisan sebelumnya telah dipulihkan' : 'Draf otomatis tersimpan'} ({draftSavedAt})
            </span>
          </div>
          <button
            type="button"
            onClick={handleDiscardDraft}
            className="flex items-center gap-1 text-[11px] text-stone-400 hover:text-red-400 transition-colors cursor-pointer"
            title="Hapus draf ini"
          >
            <Trash2 className="w-3 h-3" />
            <span>Buang Draf</span>
          </button>
        </div>
      )}

      {/* Writing Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Title */}
        <div>
          <label className="block text-xs font-mono text-parchment-300 mb-1.5">
            Judul Catatan Jurnal *
          </label>
          <input
            type="text"
            required
            placeholder="cth. Hujan Pertama di Sudut Pasar Tradisional Kyoto"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full bg-museum-card border border-museum-border rounded-lg px-4 py-2.5 text-base sm:text-lg font-serif text-parchment-100 placeholder:text-stone-500 focus:outline-none focus:border-earth-500/60 transition-colors"
          />
        </div>

        {/* Location & Date */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-mono text-parchment-300 mb-1">
              Negara *
            </label>
            <select
              value={countryCode}
              onChange={e => setCountryCode(e.target.value)}
              className="w-full bg-museum-card border border-museum-border rounded-lg px-3.5 py-2 text-sm text-parchment-100 focus:outline-none focus:border-earth-500/50 cursor-pointer"
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
              placeholder="cth. Danau Ashi, Hakone"
              value={placeName}
              onChange={e => setPlaceName(e.target.value)}
              className="w-full bg-museum-card border border-museum-border rounded-lg px-3.5 py-2 text-sm text-parchment-100 placeholder:text-stone-500 focus:outline-none focus:border-earth-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-parchment-300 mb-1">
              Tanggal Penulisan *
            </label>
            <input
              type="date"
              required
              value={dateStart}
              onChange={e => setDateStart(e.target.value)}
              className="w-full bg-museum-card border border-museum-border rounded-lg px-3.5 py-2 text-sm text-parchment-100 focus:outline-none focus:border-earth-500/50 cursor-pointer"
            />
          </div>
        </div>

        {/* Atmosphere & Weather Pills */}
        <div>
          <label className="block text-xs font-mono text-parchment-300 mb-2">
            Suasana / Cuaca Hari Itu
          </label>
          <div className="flex flex-wrap gap-2">
            {WEATHER_MOODS.map(mood => (
              <button
                type="button"
                key={mood.id}
                onClick={() => setSelectedMood(mood.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer ${
                  selectedMood === mood.id
                    ? 'bg-earth-500 text-white font-medium shadow-md shadow-earth-500/20'
                    : 'bg-museum-card text-stone-400 border border-museum-border hover:text-parchment-200 hover:border-stone-600'
                }`}
              >
                {mood.label}
              </button>
            ))}
          </div>
        </div>

        {/* Authentic Journal Writing Textarea (Moleskine Parchment Notebook feel) */}
        <div>
          <label className="block text-xs font-mono text-parchment-300 mb-1.5 flex items-center justify-between">
            <span>Isi Tulisan Jurnal & Refleksi Naratif *</span>
            <div className="flex items-center gap-3 text-[11px] font-mono text-stone-400">
              <span className={wordCount > 0 ? 'text-parchment-200' : 'text-stone-500'}>
                {wordCount} kata
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-earth-400">
                <Clock className="w-3 h-3" />
                <span>±{readingTimeMinutes} mnt baca</span>
              </span>
            </div>
          </label>
          <textarea
            required
            rows={7}
            placeholder="Curahkan apa yang Anda alami: aroma udara pagi, suara lonceng kuil, rasa teh hangat di pinggir jalan, perbincangan dengan penduduk setempat, atau perenungan hening saat memandang cakrawala..."
            value={content}
            onChange={e => setContent(e.target.value)}
            className="w-full bg-museum-card/80 border border-museum-border rounded-xl p-4 text-sm sm:text-base font-serif text-parchment-100 placeholder:text-stone-500 focus:outline-none focus:border-earth-500/60 leading-relaxed transition-colors shadow-inner"
          />
        </div>

        {/* Media Attachment (Photo or Video from Laptop) */}
        <div className="p-4 rounded-xl bg-museum-card border border-museum-border space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-xs font-medium text-parchment-200 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-earth-400" />
                <Film className="w-3.5 h-3.5 text-sky-400" />
                <span>Lampirkan Foto atau Video dari Laptop (Opsional)</span>
              </span>
              <p className="text-[11px] text-stone-400 font-mono">
                Pilih foto (JPG, PNG) atau klip video (MP4, WebM) langsung dari laptop Anda.
              </p>
            </div>

            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handlePickMedia}
              disabled={isPickingMedia}
              icon={<HardDrive className="w-3.5 h-3.5 text-earth-400" />}
            >
              {isPickingMedia ? 'Membuka...' : 'Pilih dari Laptop'}
            </Button>
          </div>

          {/* Media Preview if attached */}
          {mediaUri && (
            <div className="p-3 rounded-lg bg-museum-surface border border-museum-border/70 flex items-center gap-4 animate-fade-in">
              <div className="w-20 h-20 rounded-md overflow-hidden bg-black shrink-0 border border-museum-border relative">
                <ArchivalMedia
                  src={mediaUri}
                  forceType={mediaType}
                  controls={false}
                  className="w-full h-full object-cover"
                />
                {mediaType === 'video' && (
                  <span className="absolute bottom-1 right-1 px-1 rounded bg-black/75 text-[9px] font-mono text-sky-300">
                    VIDEO
                  </span>
                )}
              </div>
              <div className="flex-1 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-sky-300 font-mono text-[11px]">
                    {mediaType === 'video' ? 'Klip Video Terlampir (IndexedDB)' : 'Foto Terlampir (IndexedDB)'}
                  </span>
                  <button
                    type="button"
                    onClick={() => { setMediaUri(''); setMediaCaption(''); }}
                    className="text-stone-400 hover:text-red-400 text-xs font-mono cursor-pointer"
                  >
                    Hapus
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Keterangan singkat media ini..."
                  value={mediaCaption}
                  onChange={e => setMediaCaption(e.target.value)}
                  className="w-full bg-museum-card border border-museum-border rounded px-2.5 py-1 text-xs text-parchment-200 focus:outline-none focus:border-earth-500/50"
                />
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-museum-border">
          {onCancel && (
            <Button variant="ghost" type="button" onClick={onCancel}>
              Batal
            </Button>
          )}
          <Button variant="primary" type="submit" icon={<Feather className="w-3.5 h-3.5" />}>
            Simpan ke Jurnal Perjalanan
          </Button>
        </div>

      </form>
    </div>
  );
};
