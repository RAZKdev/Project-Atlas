# Project Atlas

> Arsip perjalanan pribadi dan museum memori digital yang tenang, lokal-first, dan fokus pada fotografi serta cerita yang autentik.

## 1. Deskripsi Proyek

**Project Atlas** adalah aplikasi web untuk menyimpan dan menjelajahi perjalanan pribadi dalam bentuk atlas dunia, catatan jurnal, galeri foto, suvenir, dan museum 3D. Semua data tersimpan di perangkat pengguna; tidak ada feed publik, algoritma, like, atau follower.

Aplikasi ini menggabungkan dua sisi:

- **Atlas:** peta dunia interaktif, katalog negara, dossier negara, dan status kunjungan.
- **Museum:** ruang pameran 3D, arsip memori, jurnal, teater video, paspor penjelajah, dan kabinet suvenir.

## 2. Kenapa Proyek Ini Dibuat

Media sosial dirancang untuk feed yang cepat dan interaksi publik, bukan untuk menyimpan kenangan pribadi secara mendalam. Foto perjalanan sering tersebar di galeri ponsel, catatan di aplikasi lain, dan suvenir fisik tersimpan di lemari tanpa keterhubungan.

Project Atlas dibuat untuk:

- **Mengkurasi, bukan sekadar mengunggah:** setiap memori punya tempat, cerita, dan konteks.
- **Menjaga privasi:** data tetap di browser/perangkat pengguna, tanpa server pihak ketiga.
- **Menghubungkan artefak:** foto, jurnal, suvenir, dan kunjungan negara saling terhubung.
- **Membuat arsip yang terasa personal:** tampilan museum dan paspor memberi pengalaman yang lebih bermakna daripada daftar postingan.
- **Menjaga kualitas visual:** mengutamakan foto lanskap/arsitektur otentik dengan atribusi yang jelas.

## 3. Fungsi & Fitur Utama

1. **Landing Page Editorial** — hero editorial dengan latar gradient, pola titik, dan ikon kompas; ringkasan statistik arsip, pratinjau eksplorasi dunia, dan memori unggulan.
2. **Atlas Interaktif** — peta dunia SVG, globe 3D, filter benua, pencarian negara berdasarkan nama/kode ISO, dan lima status negara dengan label UI `Terdokumentasi` (`documented`), `Dikunjungi` (`visited`), `Direncanakan` (`planned`), `Diminati` (`interested`), dan `Belum Dijelajahi` (`unknown`).
3. **Katalog & Dossier Negara** — ringkasan negara, foto, daftar tempat, memori terkait, galeri, dan suvenir.
4. **Arsip Memori (CRUD)** — judul, tempat, negara, tanggal, ringkasan, catatan jurnal, tag, favorit, referensi foto, dan suvenir.
5. **Jurnal Perjalanan** — catatan kronologis dan reflektif yang terhubung ke memori dan negara.
6. **Kabinet Suvenir** — galeri artefak fisik seperti kerajinan, tekstil, tiket, stempel, kartu pos, dan koin.
7. **Teater Video** — halaman khusus untuk memutar dan mengelola video perjalanan.
8. **Museum 3D** — ruang pameran interaktif berbasis Three.js dengan arsitektur, pencahayaan, ekshibisi, karakter, dan navigasi kamera.
9. **Paspor Penjelajah** — dossier bergaya paspor dengan cap visa, catatan perjalanan, dan sorotan suvenir pertama dari setiap memori; tombol `Print Dossier / Save as PDF` memakai `window.print()` dan pengguna memilih “Save as PDF” di dialog cetak browser (tidak ada ekspor PDF programatik).
10. **Backup & Restore** — ekspor/impor seluruh arsip dalam JSON biasa atau terenkripsi AES-GCM 256-bit dengan derivasi PBKDF2.
11. **Penyimpanan Media Lokal** — foto disimpan sebagai Blob di IndexedDB; File System Access API memungkinkan pemilihan file langsung dari perangkat.
12. **PWA & Diagnostik** — manifest/service worker untuk pemasangan aplikasi, serta alat reset ke data kurasi atau arsip kosong.

## 4. Bahasa Pemrograman & Teknologi

| Lapisan | Teknologi |
| --- | --- |
| Bahasa utama | TypeScript |
| Struktur halaman | HTML5 |
| UI | React 19, Tailwind CSS 3, Lucide React |
| Build tool | Vite 6 |
| 3D & visual | Three.js |
| Penyimpanan | `localStorage`, IndexedDB, File System Access API |
| Keamanan data | Web Crypto API (AES-GCM 256-bit, PBKDF2) |
| PWA | Web App Manifest, Service Worker |
| Mobile | Capacitor 8 (^8.6.0) untuk shell Android |

## 5. Struktur Direktori

```text
Project-Atlas/
├── android/                 # Proyek Capacitor Android
├── src/
│   ├── atlas/               # Registry negara, koordinat, globe, marker
│   ├── components/          # Layout dan komponen UI
│   ├── core/                # Kontrak domain, storage, media, crypto, PWA
│   ├── data/                # Data negara, landmark, museum, seed
│   ├── features/            # Landing, atlas, countries, memories, journal, museum, videos, passport
│   ├── styles/              # Tailwind dan gaya global
│   ├── App.tsx              # Router/view orchestration
│   └── main.tsx
├── public/                  # Manifest, service worker, aset publik
├── scripts/                 # Skrip build katalog negara
├── tests/                   # Pengujian Node.js (node:test)
└── package.json
```

## 6. Cara Menjalankan

**Prasyarat:** Node.js 18+ dan npm.

```bash
npm install
npm run dev
```

Buka `http://localhost:5173`.

Di Windows, `start.bat` juga tersedia.

**Build produksi:**

```bash
npm run build
npm run preview
```

## 7. Pengujian

Repo ini tidak memiliki skrip `test` di `package.json`. Pengujian berupa file `.mjs` berbasis `node:test` di folder `tests/` dan dijalankan satu per satu, misalnya:

```bash
node --test tests/storage.test.mjs
node --test tests/navigation.test.mjs
```

Sebagian pengujian (`atlas_3d_master`, `museum_*`, `search`, `security_a11y`) mengimpor modul TypeScript dari `src/` dan memerlukan loader/build tambahan; tanpa itu Node akan gagal menemukan modul `.js` yang sesuai. Pengujian yang tidak bergantung pada modul TypeScript dapat dijalankan langsung.

## 8. Privasi, Atribusi & Lisensi

- Data memori, jurnal, dan media pribadi disimpan di perangkat pengguna; tidak ada pengiriman data pribadi ke server eksternal. Gambar contoh dimuat dari Unsplash.
- Foto contoh dari Unsplash digunakan sesuai ketentuan lisensi dan atribusi fotografer.
- Belum ada berkas lisensi kode di repo. Untuk penggunaan ulang, hubungi pemilik repo.
