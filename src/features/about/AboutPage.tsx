import React from 'react';
import { Compass, ShieldCheck, Heart, Camera, Globe, Database } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pb-16">
      
      {/* Header */}
      <div className="border-b border-museum-border pb-8">
        <div className="flex items-center gap-2 text-xs font-mono text-earth-400 mb-1">
          <Compass className="w-3.5 h-3.5" />
          <span>MANIFESTO & FILOSOFI ARSIP</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl text-parchment-100">
          Tentang Project Atlas
        </h1>
        <p className="font-serif italic text-lg sm:text-xl text-parchment-300 mt-2 leading-relaxed">
          Atlas digital yang tenang dan personal, dibangun berpusat pada fotografi otentik dan kenangan perjalanan.
        </p>
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="p-6 rounded-xl bg-museum-surface border border-museum-border space-y-3">
          <div className="w-10 h-10 rounded-full bg-museum-card flex items-center justify-center text-earth-400 border border-museum-border">
            <Compass className="w-5 h-5" />
          </div>
          <h2 className="font-serif text-xl text-parchment-100">Utamakan Arsip Personal</h2>
          <p className="text-xs text-stone-300 leading-relaxed font-light">
            Project Atlas bukan media sosial atau feed algoritma yang bising. Ini adalah ruang hening dan kontemplatif untuk mengenang ke mana Anda pernah melangkah dan momen-momen yang paling Anda hargai.
          </p>
        </div>

        <div className="p-6 rounded-xl bg-museum-surface border border-museum-border space-y-3">
          <div className="w-10 h-10 rounded-full bg-museum-card flex items-center justify-center text-earth-400 border border-museum-border">
            <Camera className="w-5 h-5" />
          </div>
          <h2 className="font-serif text-xl text-parchment-100">Fotografi Otentik</h2>
          <p className="text-xs text-stone-300 leading-relaxed font-light">
            Kami menghindari foto stok kartun, ilustrasi generik, atau gambar komersial yang terlalu jenuh. Setiap foto dipilih karena atmosfer nyata, keindahan komposisi, dan resonansi emosionalnya.
          </p>
        </div>

        <div className="p-6 rounded-xl bg-museum-surface border border-museum-border space-y-3">
          <div className="w-10 h-10 rounded-full bg-museum-card flex items-center justify-center text-earth-400 border border-museum-border">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h2 className="font-serif text-xl text-parchment-100">100% Local-First & Privasi Total</h2>
          <p className="text-xs text-stone-300 leading-relaxed font-light">
            Catatan, tanggal, dan foto Anda disimpan seutuhnya di penyimpanan lokal browser Anda. Tanpa akun online wajib, tanpa pelacak analitik, dan tanpa kebocoran data ke server cloud pihak ketiga.
          </p>
        </div>

        <div className="p-6 rounded-xl bg-museum-surface border border-museum-border space-y-3">
          <div className="w-10 h-10 rounded-full bg-museum-card flex items-center justify-center text-earth-400 border border-museum-border">
            <Database className="w-5 h-5" />
          </div>
          <h2 className="font-serif text-xl text-parchment-100">Sentuhan Kuratorial & Taktil</h2>
          <p className="text-xs text-stone-300 leading-relaxed font-light">
            Lebih dari sekadar koordinat di peta, aplikasi ini memperlakukan suvenir fisik, cap kuil/imigrasi, dan kain tenun tradisional sebagai artefak museum berharga yang terhubung langsung dengan ekspedisi perjalanan Anda.
          </p>
        </div>

      </div>

      {/* Attribution & Standards */}
      <div className="rounded-xl border border-museum-border bg-museum-surface/60 p-8 space-y-4">
        <h2 className="font-serif text-2xl text-parchment-100">Standar Kuratorial & Hak Cipta Gambar</h2>
        <p className="text-sm text-stone-300 leading-relaxed font-light">
          Contoh foto kurasi di Project Atlas bersumber dari komunitas Unsplash di bawah ketentuan lisensi bebas pakai, dengan atribusi fotografer yang tetap dicatat dalam arsip. Foto pribadi milik pengguna tersimpan mandiri dan dapat dibedakan jelas dari aset kurasi eksternal.
        </p>
        <div className="pt-2 text-xs font-mono text-stone-500">
          Prinsip Utama: DESIGN.md • SKILL.md • MASTER_PROMPT.md
        </div>
      </div>

    </div>
  );
};
