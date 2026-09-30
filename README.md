# Project Atlas

> **A quiet personal digital atlas and future museum of memories built around authentic photography and travel records.**

Project Atlas documents places, journeys, memories, photo references, and physical souvenirs. It is built strictly according to [`SKILL.md`](./SKILL.md), [`DESIGN.md`](./DESIGN.md), and [`MASTER_PROMPT.md`](./MASTER_PROMPT.md).

---

## 🏛️ Karakter & Filosofi Produk

- **Personal Archive First:** Bukan media sosial, tidak ada feed publik, algoritma, like, atau follower.
- **Museum-like Curation:** Menggabungkan eksplorasi kartografi dunia, arsip catatan jurnal perjalanan, dan artefak fisik (suvenir, tiket, kain tenun).
- **Authentic Photography:** Menghindari stok turis komersial, ilustrasi kartun, dan saturasi berlebihan. Mengutamakan foto lanskap dan arsitektur otentik dengan atribusi sumber yang jelas.
- **100% Local-First & Private:** Semua data memori, catatan, dan referensi media tersimpan aman di browser lokal Anda tanpa pelacakan atau server pihak ketiga.

---

## 🚀 Cara Menjalankan Aplikasi

Pastikan Node.js (v18+) telah terpasang di komputer Anda.

### 1. Menjalankan Mode Development
```bash
npm run dev
```
Akses di peramban: `http://localhost:5173`

### 2. Menjalankan Build Produksi & Preview
```bash
npm run build
npm run preview
```

### 3. Menjalankan Automated Tests
```bash
node --test tests/storage.test.mjs
```

---

## 🗺️ Fitur-Fitur V1

1. **Editorial Landing Page:**
   - Hero foto perjalanan nyata beresolusi tinggi dengan tipografi Playfair Display & Inter.
   - Ringkasan kurasi arsip & statistik tempat yang dikunjungi.
   - Pratinjau eksplorasi dunia (*World Discovery*).
   - Cuplikan memori unggulan (*Featured Memories*).
   - Pernyataan filosofi museum pribadi (*Personal Museum*).

2. **Atlas Cartography & World Exploration:**
   - Peta dunia kartografi SVG interaktif dengan titik koordinat negara.
   - Filter benua (Asia, Eropa, Afrika, Amerika Utara, Amerika Selatan, Oseania).
   - Pencarian instan berdasarkan nama negara atau kode ISO (misal `ID`, `JP`, `IS`).
   - Sistem 5 status negara: `Documented`, `Visited`, `Planned`, `Interested`, `Unexplored`.
   - Mode navigasi katalog alternatif (*Non-map Catalog Grid*).

3. **Country Dossier:**
   - Menampilkan ringkasan negara, foto lanskap otentik, daftar tempat terdokumentasi, memori terkait, galeri visual, dan suvenir fisik.

4. **Archival Memory Records (CRUD):**
   - Form pencatatan lengkap: judul, tempat, negara, rentang tanggal, ringkasan, catatan jurnal reflektif, tag, status favorit (*cherished*), referensi foto otentik, dan artefak suvenir fisik.
   - Tampilan detail arsip bergaya museum (*Archival Record View*).
   - Dukungan edit dan hapus rekaman dengan sinkronisasi status negara otomatis.

5. **Personal Museum Cabinet (Souvenirs):**
   - Galeri koleksi artefak fisik (kerajinan tangan, tekstil/kain tenun, tiket, stempel, kartu pos, koin kuno) yang terhubung langsung ke memori perjalanan.

---

## 🌟 Fitur Baru Milestone V2

1. **Portabilitas & Backup Arsip Terenkripsi (Web Crypto AES-GCM):**
   - Ekspor seluruh arsip memori, suvenir, dan negara ke format JSON terbuka atau terenkripsi standar militer AES-GCM 256-bit dengan derivasi password PBKDF2 (100.000 iterasi).
   - Opsi Impor dengan deteksi otomatis file terenkripsi, input password, serta pilihan strategi *Merge* (gabung) atau *Full Replace* (timpa penuh).

2. **File System Access API & IndexedDB Local Media Store:**
   - Memilih foto resolusi tinggi langsung dari hard drive laptop tanpa perlu mengunggah ke cloud.
   - Foto disimpan sebagai `Blob` aman di dalam database lokal browser (IndexedDB `ProjectAtlasMediaDB`), persisten dan tidak akan hilang saat browser direfresh atau laptop offline.

3. **Passport & Travel Journal Dossier (Print / Export PDF):**
   - Dokumen arsip resmi bergaya paspor diplomatik penjelajah dan jurnal buku ekspedisi museum.
   - Halaman identitas paspor penjelajah, cap visa stempel vintage grafis untuk setiap negara yang dikunjungi, catatan kronologis perjalanan, dan inventaris artefak.
   - Dilengkapi aturan `@media print` teroptimasi untuk cetak langsung ke kertas A4 atau disimpan menjadi file PDF berkualitas tinggi via dialog print browser.


6. **Archive Diagnostics:**
   - Fitur reset ke sampel kurasi (*Curated Seed*) atau pengosongan total (*Empty Archive*) untuk menguji *empty states*.

---

## 📁 Struktur Direktori

```text
PROJECT ATLAS/
├── src/
│   ├── core/
│   │   ├── contracts/        # Kontrak domain TypeScript (Country, Memory, Media, Souvenir)
│   │   └── services/         # Layer repository penyimpanan local-first
│   ├── features/
│   │   ├── landing/          # Halaman depan / Landing Page V1
│   │   ├── atlas/            # Peta dunia SVG interaktif & detail inspector
│   │   ├── countries/        # Detail negara & katalog negara
│   │   ├── memories/         # Daftar memori, tampilan arsip detail, form modal
│   │   ├── souvenirs/        # Museum kabinet suvenir & artefak fisik
│   │   └── about/            # Manifesto & jaminan privasi
│   ├── components/
│   │   ├── layout/           # Navbar & Footer
│   │   └── ui/               # Button, Badge, EmptyState, AttributionBadge
│   ├── data/                 # Katalog ISO negara & seed data kurasi
│   ├── styles/               # Tailwind CSS & tipografi museum
│   ├── App.tsx               # Orchestration & view routing
│   └── main.tsx              # React mounting
├── tests/                    # Automated unit tests
├── public/                   # Favicon & aset publik
├── DESIGN.md                 # UI/UX Source of Truth
├── MASTER_PROMPT.md          # Implementation Directives
└── SKILL.md                  # Engineering Source of Truth
```

---

## ⚖️ Lisensi Gambar & Privasi

- Seluruh foto kurasi contoh diperoleh dari komunitas Unsplash di bawah ketentuan lisensi bebas pakai dengan atribusi fotografer asli yang tercantum pada masing-masing memori.
- Foto pribadi pengguna ditandai secara terpisah dari referensi publik.
- Tidak ada data yang dikirimkan ke server eksternal.
