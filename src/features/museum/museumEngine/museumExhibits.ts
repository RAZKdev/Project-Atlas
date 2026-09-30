/**
 * museumEngine/museumExhibits.ts
 * Curated 6-Zone Physical Exhibition for Museum Mini ("195 Negara, 1 Cerita")
 *
 * Implements:
 * 1. Intro & Buku Legacy (Plinth, Antique Atlas Book, Plaque, Library Bookshelf)
 * 2. Peta Dunia & Display Utama (Rotating Globe with Brass Gimbal, Glass Dome, Mahogany Pedestal)
 * 3. Galeri Foto Perjalanan (East Wall Salon Frames, Picture Lights, Velvet Stanchions)
 * 4. Koleksi Bendera & Mata Uang (Flag Shadowbox, Glass Banknote & Coin Vitrine Console)
 * 5. Lemari Kaca Suvenir (Tall Glass Vitrines, Curated 3D Artifacts from 5 Continents)
 * 6. Area Baca & Video Dokumentasi (Lounge Armchair, Side Table, Reading Lamp, Animated Video Monitor)
 */

import * as THREE from 'three';
import { type CollisionBox, type InteractableExhibit } from './types';

export interface ExhibitsResult {
  group: THREE.Group;
  exhibits: InteractableExhibit[];
  colliders: CollisionBox[];
  update: (delta: number) => void;
}

export function buildMuseumExhibits(): ExhibitsResult {
  const group = new THREE.Group();
  const colliders: CollisionBox[] = [];
  const exhibits: InteractableExhibit[] = [];

  // ── Shared PBR Materials ───────────────────────────────────────────────────
  const matWalnut = new THREE.MeshStandardMaterial({
    color: 0x3d2b1a,
    roughness: 0.55,
    metalness: 0.08,
  });

  const matOak = new THREE.MeshStandardMaterial({
    color: 0x6e4a28,
    roughness: 0.65,
    metalness: 0.05,
  });

  const matMahogany = new THREE.MeshStandardMaterial({
    color: 0x4a1f18,
    roughness: 0.48,
    metalness: 0.12,
  });

  const matBrass = new THREE.MeshStandardMaterial({
    color: 0xd4a843,
    roughness: 0.28,
    metalness: 0.92,
  });

  const matBronze = new THREE.MeshStandardMaterial({
    color: 0x684c30,
    roughness: 0.42,
    metalness: 0.82,
  });

  const matParchment = new THREE.MeshStandardMaterial({
    color: 0xf2e8d5,
    roughness: 0.88,
    metalness: 0.0,
  });

  const matLeather = new THREE.MeshStandardMaterial({
    color: 0x5a2d18,
    roughness: 0.62,
    metalness: 0.05,
  });

  const matVelvetRed = new THREE.MeshStandardMaterial({
    color: 0x7a1818,
    roughness: 0.85,
    metalness: 0.15,
  });

  const matGlassCabinet = new THREE.MeshPhysicalMaterial({
    color: 0xe8f4f8,
    transparent: true,
    opacity: 0.28,
    roughness: 0.05,
    metalness: 0.1,
    transmission: 0.85,
    ior: 1.5,
  });

  const matUpholstery = new THREE.MeshStandardMaterial({
    color: 0x424a48, // deep olive-grey tweed
    roughness: 0.85,
    metalness: 0.05,
  });

  // Animated elements references
  let globeMesh: THREE.Mesh | null = null;
  let videoScreenMesh: THREE.Mesh | null = null;
  let videoTimer = 0;

  // ═════════════════════════════════════════════════════════════════════════════
  // ZONE 1: INTRO & BUKU LEGACY (Front Left, x: -1.8, z: 2.4)
  // ═════════════════════════════════════════════════════════════════════════════
  const zoneIntroGroup = new THREE.Group();
  zoneIntroGroup.position.set(-1.8, 0.50, 2.4);

  // Walnut Display Plinth (0.80m wide x 0.60m deep x 0.90m high)
  const introPlinthGeo = new THREE.BoxGeometry(0.80, 0.90, 0.60);
  const introPlinth = new THREE.Mesh(introPlinthGeo, matWalnut);
  introPlinth.position.set(0, 0.45, 0);
  introPlinth.castShadow = true;
  introPlinth.receiveShadow = true;
  zoneIntroGroup.add(introPlinth);

  // Brass Plinth Base Ring
  const plinthBaseRingGeo = new THREE.BoxGeometry(0.86, 0.04, 0.66);
  const plinthBaseRing = new THREE.Mesh(plinthBaseRingGeo, matBrass);
  plinthBaseRing.position.set(0, 0.02, 0);
  zoneIntroGroup.add(plinthBaseRing);

  // Brass Easel Stand on top of Plinth
  const easelGeo = new THREE.BoxGeometry(0.50, 0.06, 0.35);
  const easel = new THREE.Mesh(easelGeo, matBrass);
  easel.position.set(0, 0.93, 0);
  easel.rotation.x = -Math.PI / 8; // 22.5 deg tilt
  zoneIntroGroup.add(easel);

  // Antique Atlas Book Cover (Open)
  const bookCoverGeo = new THREE.BoxGeometry(0.54, 0.03, 0.38);
  const bookCover = new THREE.Mesh(bookCoverGeo, matLeather);
  bookCover.position.set(0, 0.96, 0);
  bookCover.rotation.x = -Math.PI / 8;
  bookCover.castShadow = true;
  zoneIntroGroup.add(bookCover);

  // Open Curved Parchment Pages
  const pagesGeo = new THREE.BoxGeometry(0.50, 0.04, 0.34);
  const pages = new THREE.Mesh(pagesGeo, matParchment);
  pages.position.set(0, 0.985, 0);
  pages.rotation.x = -Math.PI / 8;
  zoneIntroGroup.add(pages);

  // Red Satin Ribbon Bookmark hanging down
  const ribbonGeo = new THREE.BoxGeometry(0.04, 0.005, 0.22);
  const ribbon = new THREE.Mesh(ribbonGeo, matVelvetRed);
  ribbon.position.set(0.04, 0.96, 0.14);
  ribbon.rotation.x = Math.PI / 6;
  zoneIntroGroup.add(ribbon);

  // Brass Engraved Dedication Plaque on Plinth Front
  const introPlaqueGeo = new THREE.BoxGeometry(0.40, 0.12, 0.015);
  const introPlaque = new THREE.Mesh(introPlaqueGeo, matBrass);
  introPlaque.position.set(0, 0.60, 0.31);
  zoneIntroGroup.add(introPlaque);

  // Solid Library Bookshelf against West Wall (x: -2.75, z: 2.4)
  const shelfGeo = new THREE.BoxGeometry(0.35, 2.20, 1.40);
  const shelf = new THREE.Mesh(shelfGeo, matOak);
  shelf.position.set(-0.95, 1.10, 0.0);
  shelf.castShadow = true;
  zoneIntroGroup.add(shelf);

  // Rows of Books inside the Shelf
  const bookColors = [0x7a2020, 0x1d3e5a, 0x245432, 0x5a4220, 0x2e2830];
  for (let row = 0; row < 4; row++) {
    const rowY = 0.35 + row * 0.50;
    for (let b = 0; b < 8; b++) {
      const bColor = bookColors[(row * 8 + b) % bookColors.length];
      const bMat = new THREE.MeshStandardMaterial({ color: bColor, roughness: 0.6 });
      const bGeo = new THREE.BoxGeometry(0.24, 0.38 + (b % 3) * 0.03, 0.08 + (b % 2) * 0.02);
      const bMesh = new THREE.Mesh(bGeo, bMat);
      bMesh.position.set(-0.95, rowY + 0.19, -0.55 + b * 0.15);
      zoneIntroGroup.add(bMesh);
    }
  }

  group.add(zoneIntroGroup);

  // Collider for Intro Plinth & Bookshelf
  colliders.push({
    min: [-2.25, 0.50, 2.05],
    max: [-1.35, 1.60, 2.75],
    name: 'intro_plinth',
  });
  colliders.push({
    min: [-2.95, 0.50, 1.65],
    max: [-2.55, 2.70, 3.15],
    name: 'intro_bookshelf',
  });

  exhibits.push({
    id: 'intro',
    zoneId: 'intro',
    title: 'Buku Induk Project Atlas & Pengantar 195 Negara',
    subtitle: 'Naskah Awal & Rekam Jejak Ekspedisi',
    category: 'Arsip & Manuskrip',
    description:
      'Volume komprehensif berkulit samak yang merangkum filosofi "195 Negara, 1 Cerita". Di dalamnya tercatat peta tangan, koordinat meridian, dan catatan kuratorial pertama sebelum perjalanan dimulai.',
    story:
      'Buku ini menjadi batu penjuru bagi seluruh ekspedisi. Setiap lembar kertas perkamen bebas-asam diisi dengan tinta archival tahan cuaca, menyimpan rute penerbangan, garis bujur, serta daftar lengkap 193 Negara Anggota PBB ditambah Takhta Suci Vatikan dan Negara Palestina.',
    curatorNotes:
      'Diletakkan di atas plinth kayu walnut padat tepat di dekat pintu masuk utama, menyambut setiap penjelajah untuk memulai penjelajahan dengan rasa takjub dan rasa hormat.',
    specs: [
      { label: 'Dimensi Buku', value: '45 × 32 cm (Terbuka)' },
      { label: 'Penjilidan', value: 'Kulit Samak Nabati & Sudut Kuningan' },
      { label: 'Koleksi', value: '195 Catatan Berdaulat Resmi' },
      { label: 'Tahun Inisiasi', value: '2024 — Sekarang' },
    ],
    position: [-1.8, 1.55, 2.4],
    interactRadius: 1.8,
    viewPosition: [-1.8, 1.60, 3.2],
    viewTarget: [-1.8, 1.45, 2.4],
    icon: '📖',
    tag: 'Buku Induk',
    accentColor: 'amber',
    relatedCountries: ['IDN', 'ISL', 'JPN', 'NOR'],
  });

  // ═════════════════════════════════════════════════════════════════════════════
  // ZONE 2: PETA DUNIA TENGAH & DISPLAY UTAMA (Center, x: 0, z: 0)
  // ═════════════════════════════════════════════════════════════════════════════
  const zoneGlobeGroup = new THREE.Group();
  zoneGlobeGroup.position.set(0, 0.50, 0);

  // Mahogany Presentation Pedestal (Octagonal / Cylindrical, 1.30m diameter x 0.85m high)
  const pedestalGeo = new THREE.CylinderGeometry(0.65, 0.70, 0.85, 24);
  const pedestal = new THREE.Mesh(pedestalGeo, matMahogany);
  pedestal.position.set(0, 0.425, 0);
  pedestal.castShadow = true;
  pedestal.receiveShadow = true;
  zoneGlobeGroup.add(pedestal);

  // Brass Plinth Ring & Capital
  const baseRingGeo = new THREE.CylinderGeometry(0.74, 0.74, 0.05, 24);
  const baseRing = new THREE.Mesh(baseRingGeo, matBrass);
  baseRing.position.set(0, 0.025, 0);
  zoneGlobeGroup.add(baseRing);

  const topRingGeo = new THREE.CylinderGeometry(0.68, 0.68, 0.04, 24);
  const topRing = new THREE.Mesh(topRingGeo, matBrass);
  topRing.position.set(0, 0.86, 0);
  zoneGlobeGroup.add(topRing);

  // Turned Brass Gimbal Stand (Gimbal ring tilted 23.5 degrees)
  const gimbalStandGeo = new THREE.CylinderGeometry(0.04, 0.06, 0.20, 16);
  const gimbalStand = new THREE.Mesh(gimbalStandGeo, matBrass);
  gimbalStand.position.set(0, 0.98, 0);
  zoneGlobeGroup.add(gimbalStand);

  // Brass Semi-Meridian Arc
  const meridianTorusGeo = new THREE.TorusGeometry(0.36, 0.015, 12, 32, Math.PI);
  const meridianArc = new THREE.Mesh(meridianTorusGeo, matBrass);
  meridianArc.position.set(0, 1.34, 0);
  meridianArc.rotation.z = Math.PI / 2;
  meridianArc.rotation.x = (23.5 * Math.PI) / 180; // axial tilt
  zoneGlobeGroup.add(meridianArc);

  // 3D Physical Globe Sphere (0.54m diameter)
  const globeGeo = new THREE.SphereGeometry(0.28, 36, 36);
  const globeMat = new THREE.MeshStandardMaterial({
    color: 0x1b4468, // rich deep ocean blue
    roughness: 0.35,
    metalness: 0.15,
  });
  globeMesh = new THREE.Mesh(globeGeo, globeMat);
  globeMesh.position.set(0, 1.34, 0);
  globeMesh.rotation.z = (23.5 * Math.PI) / 180;
  globeMesh.castShadow = true;
  zoneGlobeGroup.add(globeMesh);

  // Relief Continents on the Globe (Subtle raised geographical geometry)
  const continentMat = new THREE.MeshStandardMaterial({
    color: 0x6e8e52, // earthy green moss
    roughness: 0.75,
    metalness: 0.05,
  });
  // Procedural continental clusters
  const continentOffsets: [number, number, number, number][] = [
    [0.15, 0.12, 0.20, 0.11],   // Eurasia/Asia
    [-0.14, 0.10, 0.21, 0.09],  // Europe
    [0.18, -0.08, 0.16, 0.08],  // Australia
    [-0.18, 0.12, -0.16, 0.10], // North America
    [-0.12, -0.14, -0.18, 0.09],// South America
    [0.02, -0.05, 0.24, 0.10],  // Africa
  ];
  for (const [cx, cy, cz, rad] of continentOffsets) {
    const cGeo = new THREE.SphereGeometry(rad, 16, 16);
    const cMesh = new THREE.Mesh(cGeo, continentMat);
    cMesh.position.set(cx, cy, cz);
    cMesh.scale.set(1.1, 0.5, 1.1);
    globeMesh.add(cMesh);
  }

  // Cylindrical Glass Protective Vitrine Dome over Globe
  const glassDomeGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.90, 24, 1, true);
  const glassDome = new THREE.Mesh(glassDomeGeo, matGlassCabinet);
  glassDome.position.set(0, 1.33, 0);
  zoneGlobeGroup.add(glassDome);

  const glassCapGeo = new THREE.SphereGeometry(0.48, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2);
  const glassCap = new THREE.Mesh(glassCapGeo, matGlassCabinet);
  glassCap.position.set(0, 1.78, 0);
  zoneGlobeGroup.add(glassCap);

  // Brass Plaque on Front of Pedestal
  const globePlaqueGeo = new THREE.BoxGeometry(0.36, 0.10, 0.015);
  const globePlaque = new THREE.Mesh(globePlaqueGeo, matBrass);
  globePlaque.position.set(0, 0.55, 0.69);
  zoneGlobeGroup.add(globePlaque);

  group.add(zoneGlobeGroup);

  // Pedestal Collider (Circle AABB)
  colliders.push({
    min: [-0.75, 0.50, -0.75],
    max: [0.75, 1.85, 0.75],
    name: 'globe_pedestal',
  });

  exhibits.push({
    id: 'globe',
    zoneId: 'globe',
    title: 'Globe Master Atlas & Monumen Poros 195 Negara',
    subtitle: 'Simbol Pemersatu Seluruh Titik Perjalanan',
    category: 'Kartografi & Geodesi',
    description:
      'Globe presisi dengan kemiringan aksial 23,5 derajat yang dilindungi kubah kaca kristal. Menampilkan seluruh relief benua, garis ekuator kuningan, dan proyeksi koordinat geodesik yang tersinkronisasi langsung dengan sistem Project Atlas.',
    story:
      'Di jantung ruang pameran, globe ini berputar lambat tanpa henti. Di setiap titik koordinatnya tertanam rekam jejak memori digital, menghubungkan perjalanan dari kepulauan khatulistiwa Indonesia hingga gletser Arktik Islandia.',
    curatorNotes:
      'Didudukkan di atas plinth kayu mahoni tua bertatahkan kuningan poles. Pencahayaan spotlight terfokus dari kubah langit-langit menghasilkan pendaran hangat pada kubah kaca.',
    specs: [
      { label: 'Diameter Bola', value: '54 cm (Skala 1:23.500.000)' },
      { label: 'Gimbal & Poros', value: 'Kuningan Padat Mesin Bubut' },
      { label: 'Kubah Pelindung', value: 'Kaca Akrilik Kristal Berkualitas Tinggi' },
      { label: 'Rotasi Sumbu', value: '23,5° Axis Terkalibrasi Geodetik' },
    ],
    position: [0, 1.65, 0],
    interactRadius: 2.2,
    viewPosition: [0, 1.60, 1.4],
    viewTarget: [0, 1.40, 0],
    icon: '🌍',
    tag: 'Monumen Utama',
    accentColor: 'blue',
    relatedCountries: ['IDN', 'ISL', 'JPN', 'NOR', 'EGY', 'PER'],
  });

  // ═════════════════════════════════════════════════════════════════════════════
  // ZONE 3: GALERI FOTO PERJALANAN (East Wall, x: 2.8, z: [-2.0, 2.0])
  // ═════════════════════════════════════════════════════════════════════════════
  const zoneGalleryGroup = new THREE.Group();
  zoneGalleryGroup.position.set(2.86, 0.50, 0);

  // 6 Framed Photographs on the East Wall (2 rows x 3 columns)
  const photoData = [
    { title: 'Fajar di Gerbang Fushimi Inari, Kyoto', country: 'Jepang', z: -1.4, y: 2.20, color: 0xc84232 },
    { title: 'Cahaya Aurora Borealis di Lyngen Alps', country: 'Norwegia', z: 0.0, y: 2.20, color: 0x228b68 },
    { title: 'Piramida Agung Giza & Hamparan Sahara', country: 'Mesir', z: 1.4, y: 2.20, color: 0xd4a048 },
    { title: 'Kabut Pagi di Puncak Machu Picchu', country: 'Peru', z: -1.4, y: 1.35, color: 0x486e52 },
    { title: 'Kolom Basal & Pasir Hitam Reynisfjara', country: 'Islandia', z: 0.0, y: 1.35, color: 0x2a3848 },
    { title: 'Lentera Mosaik Grand Bazaar, Istanbul', country: 'Turki', z: 1.4, y: 1.35, color: 0xaa5832 },
  ];

  for (const photo of photoData) {
    // Moulded Wooden Frame (0.90m wide x 0.65m high)
    const frameGeo = new THREE.BoxGeometry(0.05, 0.65, 0.90);
    const frameMesh = new THREE.Mesh(frameGeo, matWalnut);
    frameMesh.position.set(0, photo.y, photo.z);
    frameMesh.castShadow = true;
    zoneGalleryGroup.add(frameMesh);

    // Cream Passepartout Mat
    const matGeo = new THREE.BoxGeometry(0.02, 0.56, 0.81);
    const matMesh = new THREE.Mesh(matGeo, matParchment);
    matMesh.position.set(-0.02, photo.y, photo.z);
    zoneGalleryGroup.add(matMesh);

    // Photograph Canvas Print
    const printMat = new THREE.MeshStandardMaterial({
      color: photo.color,
      roughness: 0.45,
      metalness: 0.05,
    });
    const printGeo = new THREE.BoxGeometry(0.015, 0.44, 0.68);
    const printMesh = new THREE.Mesh(printGeo, printMat);
    printMesh.position.set(-0.03, photo.y, photo.z);
    zoneGalleryGroup.add(printMesh);

    // Brass Picture Light mounted above top frame row
    if (photo.y > 1.8) {
      const lampArmGeo = new THREE.BoxGeometry(0.12, 0.015, 0.015);
      const lampArm = new THREE.Mesh(lampArmGeo, matBrass);
      lampArm.position.set(-0.08, photo.y + 0.38, photo.z);
      zoneGalleryGroup.add(lampArm);

      const lampHeadGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.28, 12);
      const lampHead = new THREE.Mesh(lampHeadGeo, matBrass);
      lampHead.position.set(-0.14, photo.y + 0.38, photo.z);
      lampHead.rotation.x = Math.PI / 2;
      zoneGalleryGroup.add(lampHead);
    }
  }

  // Velvet Rope Stanchions (Brass posts + Crimson velvet cord)
  const stanchionZPositions = [-1.8, -0.6, 0.6, 1.8];
  for (const sz of stanchionZPositions) {
    // Heavy base
    const baseGeo = new THREE.CylinderGeometry(0.14, 0.16, 0.05, 16);
    const base = new THREE.Mesh(baseGeo, matBrass);
    base.position.set(-0.85, 0.025, sz);
    base.castShadow = true;
    zoneGalleryGroup.add(base);

    // Brass Post
    const postGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.90, 16);
    const post = new THREE.Mesh(postGeo, matBrass);
    post.position.set(-0.85, 0.48, sz);
    zoneGalleryGroup.add(post);

    // Spherical Finial
    const finialGeo = new THREE.SphereGeometry(0.04, 16, 16);
    const finial = new THREE.Mesh(finialGeo, matBrass);
    finial.position.set(-0.85, 0.95, sz);
    zoneGalleryGroup.add(finial);
  }

  // Crimson Braided Velvet Rope Cords between stanchions
  for (let i = 0; i < stanchionZPositions.length - 1; i++) {
    const zA = stanchionZPositions[i];
    const zB = stanchionZPositions[i + 1];
    const ropeLen = Math.abs(zB - zA);
    const ropeGeo = new THREE.CylinderGeometry(0.016, 0.016, ropeLen, 8);
    const rope = new THREE.Mesh(ropeGeo, matVelvetRed);
    rope.position.set(-0.85, 0.78, (zA + zB) / 2);
    rope.rotation.x = Math.PI / 2;
    zoneGalleryGroup.add(rope);
  }

  group.add(zoneGalleryGroup);

  // Stanchion Line Collider
  colliders.push({
    min: [1.85, 0.50, -2.10],
    max: [2.15, 1.50, 2.10],
    name: 'gallery_stanchions',
  });

  exhibits.push({
    id: 'gallery',
    zoneId: 'gallery',
    title: 'Galeri Dinding Arsip Fotografi Penjelajah',
    subtitle: 'Enam Komposisi Visual dari Sudut-Sudut Dunia',
    category: 'Fotografi & Dokumentasi Visual',
    description:
      'Rangkaian pigura kayu walnut berpadu passepartout bebas-asam yang mengabadikan enam momen monumental: Torii Kyoto, Aurora Tromsø, Gurun Giza, Machu Picchu, Pantai Hitam Islandia, dan Lentera Mosaik Istanbul.',
    story:
      'Setiap cetakan dibuat di atas kertas katun archival dengan pigmen mineral yang tahan hingga puluhan tahun. Barisan pembatas tali beludru merah dan lampu kuningan beraksen lembut menjaga nuansa hening sebuah galeri seni rupa.',
    curatorNotes:
      'Dinding timur museum dirancang sebagai galeri potret dinamis. Setiap foto memiliki tautan langsung ke arsip jurnal digital dan metadata koordinat bujur/lintang.',
    specs: [
      { label: 'Teknik Cetak', value: 'Fine Art Giclée Pigment Print' },
      { label: 'Bingkai', value: 'Kayu Walnut Alami & Kuningan' },
      { label: 'Koleksi Karya', value: '6 Komposisi Kuratorial Terpilih' },
      { label: 'Pencahayaan', value: 'Overhead Brass Art Lamp 3000K' },
    ],
    position: [2.70, 1.80, 0],
    interactRadius: 2.0,
    viewPosition: [1.70, 1.60, 0],
    viewTarget: [2.80, 1.80, 0],
    icon: '🖼️',
    tag: 'Galeri Foto',
    accentColor: 'amber',
    relatedCountries: ['JPN', 'NOR', 'EGY', 'PER', 'ISL', 'TUR'],
  });

  // ═════════════════════════════════════════════════════════════════════════════
  // ZONE 4: KOLEKSI BENDERA & MATA UANG (North Wall, x: 0, z: -3.7)
  // ═════════════════════════════════════════════════════════════════════════════
  const zoneFlagsGroup = new THREE.Group();
  zoneFlagsGroup.position.set(0, 0.50, -3.70);

  // Large Wall Shadowbox Frame (2.60m wide x 1.20m high x 0.12m deep)
  const shadowboxGeo = new THREE.BoxGeometry(2.60, 1.20, 0.12);
  const shadowbox = new THREE.Mesh(shadowboxGeo, matWalnut);
  shadowbox.position.set(0, 2.10, -0.15);
  shadowbox.castShadow = true;
  zoneFlagsGroup.add(shadowbox);

  // Shadowbox Velvet Backing
  const shadowboxBackGeo = new THREE.BoxGeometry(2.48, 1.08, 0.02);
  const shadowboxBack = new THREE.Mesh(shadowboxBackGeo, matParchment);
  shadowboxBack.position.set(0, 2.10, -0.09);
  zoneFlagsGroup.add(shadowboxBack);

  // Row of Miniature Satin Flags on Brass Staffs
  const flagColors = [
    0xcc2222, 0x1a4a88, 0x228833, 0xffcc00, 0xee5522,
    0x882288, 0x2299aa, 0xaa4422, 0x333333, 0xdd2244,
  ];
  for (let f = 0; f < 10; f++) {
    const fx = -1.05 + f * 0.23;
    // Brass staff
    const staffGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.42, 8);
    const staff = new THREE.Mesh(staffGeo, matBrass);
    staff.position.set(fx, 2.10, -0.04);
    staff.rotation.z = -Math.PI / 16;
    zoneFlagsGroup.add(staff);

    // Spearhead finial
    const spearGeo = new THREE.ConeGeometry(0.015, 0.04, 8);
    const spear = new THREE.Mesh(spearGeo, matBrass);
    spear.position.set(fx + 0.04, 2.32, -0.04);
    zoneFlagsGroup.add(spear);

    // Flag Pennant
    const pennantMat = new THREE.MeshStandardMaterial({
      color: flagColors[f],
      roughness: 0.7,
      metalness: 0.1,
    });
    const pennantGeo = new THREE.BoxGeometry(0.18, 0.12, 0.005);
    const pennant = new THREE.Mesh(pennantGeo, pennantMat);
    pennant.position.set(fx + 0.10, 2.22, -0.04);
    zoneFlagsGroup.add(pennant);
  }

  // Horizontal Glass Vitrine Console below (2.40m wide x 0.65m deep x 0.85m high)
  const consoleGeo = new THREE.BoxGeometry(2.40, 0.80, 0.65);
  const consoleMesh = new THREE.Mesh(consoleGeo, matWalnut);
  consoleMesh.position.set(0, 0.40, 0.15);
  consoleMesh.castShadow = true;
  zoneFlagsGroup.add(consoleMesh);

  // Glass top display case with coin & banknote trays
  const vitrineGlassGeo = new THREE.BoxGeometry(2.30, 0.15, 0.58);
  const vitrineGlass = new THREE.Mesh(vitrineGlassGeo, matGlassCabinet);
  vitrineGlass.position.set(0, 0.88, 0.15);
  zoneFlagsGroup.add(vitrineGlass);

  // Row of Miniature Banknotes & Coins inside display tray
  const coinMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.25, metalness: 0.95 });
  const noteMat = new THREE.MeshStandardMaterial({ color: 0x98b898, roughness: 0.75, metalness: 0.05 });
  for (let c = 0; c < 6; c++) {
    const cx = -0.80 + c * 0.32;
    // Banknote
    const noteGeo = new THREE.BoxGeometry(0.14, 0.002, 0.08);
    const note = new THREE.Mesh(noteGeo, noteMat);
    note.position.set(cx, 0.82, 0.05);
    zoneFlagsGroup.add(note);

    // Commemorative Coin
    const coinGeo = new THREE.CylinderGeometry(0.028, 0.028, 0.006, 16);
    const coin = new THREE.Mesh(coinGeo, coinMat);
    coin.position.set(cx + 0.08, 0.82, 0.22);
    zoneFlagsGroup.add(coin);
  }

  group.add(zoneFlagsGroup);

  // Console Collider
  colliders.push({
    min: [-1.25, 0.50, -3.90],
    max: [1.25, 1.50, -3.20],
    name: 'flags_console',
  });

  exhibits.push({
    id: 'flags',
    zoneId: 'flags',
    title: 'Koleksi Bendera Miniatur & Numismatik Global',
    subtitle: 'Simbol Kedaulatan & Jejak Mata Uang Lintas Benua',
    category: 'Veksikologi & Numismatik',
    description:
      'Lemari kaca dinding yang menampilkan 10 perwakilan bendera satin sutra diapit etalase konsol horizontal berisi koleksi uang kertas fisik dan koin perak-emas dari berbagai benua.',
    story:
      'Setiap negara memiliki lambang kedaulatan visual dan mata uang yang merefleksikan identitas kulturalnya. Di etalase ini, pengunjung dapat mencermati detail grafis uang kertas, tanda air, serta ukiran koin bersejarah.',
    curatorNotes:
      'Pencahayaan tersembunyi LED mikro di dalam laci vitrine dirancang khusus tanpa radiasi UV untuk menjaga keutuhan serat kertas berharga.',
    specs: [
      { label: 'Etalase Dinding', value: 'Shadowbox Kayu Walnut 260 × 120 cm' },
      { label: 'Koleksi Numismatik', value: 'Uang Kertas Archival & Koin Khusus' },
      { label: 'Bendera Sutra', value: 'Satin Tenun Halus Bertombak Kuningan' },
      { label: 'Pengamanan', value: 'Kaca Tempered Laminasi Antirefleksi' },
    ],
    position: [0, 1.65, -3.4],
    interactRadius: 1.9,
    viewPosition: [0, 1.60, -2.4],
    viewTarget: [0, 1.55, -3.7],
    icon: '🚩',
    tag: 'Bendera & Uang',
    accentColor: 'red',
    relatedCountries: ['IDN', 'JPN', 'USA', 'GBR', 'CHE', 'SGP'],
  });

  // ═════════════════════════════════════════════════════════════════════════════
  // ZONE 5: LEMARI KACA SUVENIR (West Wall, x: -2.8, z: [-1.5, 1.5])
  // ═════════════════════════════════════════════════════════════════════════════
  const zoneSouvenirGroup = new THREE.Group();
  zoneSouvenirGroup.position.set(-2.82, 0.50, 0);

  // Twin Tall Museum Vitrine Cabinets (2.40m wide total x 2.20m high x 0.55m deep)
  const vitrineFrameGeo = new THREE.BoxGeometry(0.55, 2.20, 2.40);
  const vitrineFrame = new THREE.Mesh(vitrineFrameGeo, matBronze);
  vitrineFrame.position.set(0, 1.10, 0);
  vitrineFrame.castShadow = true;
  zoneSouvenirGroup.add(vitrineFrame);

  // Interior display cavity lined with light stone
  const cavityGeo = new THREE.BoxGeometry(0.48, 2.05, 2.28);
  const cavityMat = new THREE.MeshStandardMaterial({ color: 0x22201e, roughness: 0.8 });
  const cavity = new THREE.Mesh(cavityGeo, cavityMat);
  cavity.position.set(0.04, 1.10, 0);
  zoneSouvenirGroup.add(cavity);

  // 3 Tempered Glass Shelves
  const shelfYPositions = [0.60, 1.15, 1.70];
  for (const sy of shelfYPositions) {
    const glassShelfGeo = new THREE.BoxGeometry(0.42, 0.02, 2.24);
    const glassShelf = new THREE.Mesh(glassShelfGeo, matGlassCabinet);
    glassShelf.position.set(0.04, sy, 0);
    zoneSouvenirGroup.add(glassShelf);
  }

  // Glass Front Doors (Clear)
  const glassFrontGeo = new THREE.BoxGeometry(0.02, 2.05, 2.28);
  const glassFront = new THREE.Mesh(glassFrontGeo, matGlassCabinet);
  glassFront.position.set(0.28, 1.10, 0);
  zoneSouvenirGroup.add(glassFront);

  // ── Curated 3D Souvenir Artifacts ──
  // 1. Scandinavian Dala Horse (Red carved horse) on middle shelf (z = -0.7)
  const dalaMat = new THREE.MeshStandardMaterial({ color: 0xcc2828, roughness: 0.5, metalness: 0.05 });
  const dalaBodyGeo = new THREE.BoxGeometry(0.18, 0.16, 0.08);
  const dalaBody = new THREE.Mesh(dalaBodyGeo, dalaMat);
  dalaBody.position.set(0.04, 1.25, -0.70);
  zoneSouvenirGroup.add(dalaBody);

  const dalaHeadGeo = new THREE.ConeGeometry(0.06, 0.12, 6);
  const dalaHead = new THREE.Mesh(dalaHeadGeo, dalaMat);
  dalaHead.position.set(0.04, 1.37, -0.75);
  dalaHead.rotation.x = -Math.PI / 4;
  zoneSouvenirGroup.add(dalaHead);

  // 2. Japanese Miniature Pagoda (Top shelf, z = -0.2)
  const pagodaMat = new THREE.MeshStandardMaterial({ color: 0x2b2420, roughness: 0.6, metalness: 0.1 });
  for (let tier = 0; tier < 4; tier++) {
    const tierW = 0.22 - tier * 0.04;
    const tierGeo = new THREE.BoxGeometry(tierW, 0.04, tierW);
    const tierMesh = new THREE.Mesh(tierGeo, pagodaMat);
    tierMesh.position.set(0.04, 1.73 + tier * 0.08, -0.20);
    zoneSouvenirGroup.add(tierMesh);

    const roofGeo = new THREE.ConeGeometry(tierW * 0.8, 0.04, 4);
    const roofMesh = new THREE.Mesh(roofGeo, matBronze);
    roofMesh.position.set(0.04, 1.76 + tier * 0.08, -0.20);
    roofMesh.rotation.y = Math.PI / 4;
    zoneSouvenirGroup.add(roofMesh);
  }

  // 3. Ancient Mediterranean Terracotta Amphora (Bottom shelf, z = -0.6)
  const amphoraMat = new THREE.MeshStandardMaterial({ color: 0xbf5b30, roughness: 0.72, metalness: 0.02 });
  const amphoraGeo = new THREE.CylinderGeometry(0.08, 0.04, 0.26, 16);
  const amphora = new THREE.Mesh(amphoraGeo, amphoraMat);
  amphora.position.set(0.04, 0.75, -0.60);
  zoneSouvenirGroup.add(amphora);

  // 4. African Tribal Ebony Mask (Middle shelf, z = 0.5)
  const maskMat = new THREE.MeshStandardMaterial({ color: 0x181412, roughness: 0.45, metalness: 0.1 });
  const maskGeo = new THREE.BoxGeometry(0.06, 0.26, 0.14);
  const mask = new THREE.Mesh(maskGeo, maskMat);
  mask.position.set(0.04, 1.30, 0.50);
  mask.rotation.y = -Math.PI / 6;
  zoneSouvenirGroup.add(mask);

  // 5. Andean Incan Sun Medallion (Top shelf, z = 0.6)
  const goldMat = new THREE.MeshStandardMaterial({ color: 0xffd700, roughness: 0.22, metalness: 0.95 });
  const medallionGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.02, 24);
  const medallion = new THREE.Mesh(medallionGeo, goldMat);
  medallion.position.set(0.04, 1.82, 0.60);
  medallion.rotation.z = Math.PI / 2;
  zoneSouvenirGroup.add(medallion);

  group.add(zoneSouvenirGroup);

  // Vitrine Cabinet Collider
  colliders.push({
    min: [-2.95, 0.50, -1.35],
    max: [-2.45, 2.70, 1.35],
    name: 'souvenir_vitrine',
  });

  exhibits.push({
    id: 'souvenir',
    zoneId: 'souvenir',
    title: 'Lemari Vitrine Suvenir Etnografis & Artefak Budaya',
    subtitle: 'Koleksi Benda Fisik Tradisional dari 5 Benua',
    category: 'Etnografi & Kriya Budaya',
    description:
      'Lemari kaca setinggi 2,2 meter dengan pencahayaan LED vertikal tersembunyi yang menyimpan berbagai artefak fisik: Kuda Kayu Dala Swedia, Miniatur Pagoda 4-Tingkat Kyoto, Guci Terakota Mediterania, Topeng Kayu Eboni Afrika, dan Medali Matahari Inka Andes.',
    story:
      'Setiap suvenir dikumpulkan secara etis dari pengrajin lokal di negara asalnya. Benda-benda ini bukan sekadar cenderamata turistik, melainkan perwujudan teknik material warisan leluhur yang mencerminkan kearifan peradaban setempat.',
    curatorNotes:
      'Dilengkapi tiga ambalan kaca tempered berkekuatan tinggi serta sensor kelembapan terkontrol untuk mencegah kerusakan material organik seperti kayu dan tanah liat tua.',
    specs: [
      { label: 'Dimensi Vitrine', value: '240 × 220 × 55 cm' },
      { label: 'Pencahayaan', value: 'LED Sisi Vertikal Tersembunyi 3200K' },
      { label: 'Material Rangka', value: 'Perunggu Gelap Anodized & Kaca Tempered' },
      { label: 'Cakupan Wilayah', value: 'Eropa, Asia, Afrika, Mediterania, Amerika Latin' },
    ],
    position: [-2.55, 1.65, 0],
    interactRadius: 2.0,
    viewPosition: [-1.65, 1.60, 0],
    viewTarget: [-2.80, 1.60, 0],
    icon: '🏺',
    tag: 'Suvenir & Artefak',
    accentColor: 'teal',
    relatedCountries: ['SWE', 'JPN', 'GRC', 'KEN', 'PER'],
  });

  // ═════════════════════════════════════════════════════════════════════════════
  // ZONE 6: AREA BACA & VIDEO DOKUMENTASI (South-East, x: 1.8, z: -2.6)
  // ═════════════════════════════════════════════════════════════════════════════
  const zoneReadingGroup = new THREE.Group();
  zoneReadingGroup.position.set(1.85, 0.50, -2.60);

  // Mid-Century Upholstered Lounge Armchair
  // Seat cushion (0.65m wide x 0.65m deep x 0.40m high)
  const seatGeo = new THREE.BoxGeometry(0.65, 0.16, 0.65);
  const seat = new THREE.Mesh(seatGeo, matUpholstery);
  seat.position.set(0, 0.32, 0);
  seat.castShadow = true;
  zoneReadingGroup.add(seat);

  // Backrest (0.65m wide x 0.65m high x 0.14m deep)
  const backrestGeo = new THREE.BoxGeometry(0.65, 0.65, 0.14);
  const backrest = new THREE.Mesh(backrestGeo, matUpholstery);
  backrest.position.set(0, 0.65, 0.28);
  backrest.rotation.x = -Math.PI / 16;
  backrest.castShadow = true;
  zoneReadingGroup.add(backrest);

  // Armrests (Left & Right)
  const armrestGeo = new THREE.BoxGeometry(0.10, 0.26, 0.60);
  const armrestL = new THREE.Mesh(armrestGeo, matUpholstery);
  armrestL.position.set(-0.35, 0.46, 0.02);
  zoneReadingGroup.add(armrestL);

  const armrestR = new THREE.Mesh(armrestGeo, matUpholstery);
  armrestR.position.set(0.35, 0.46, 0.02);
  zoneReadingGroup.add(armrestR);

  // Wooden Tapered Chair Legs
  const legPositions: [number, number][] = [
    [-0.30, -0.25],
    [0.30, -0.25],
    [-0.30, 0.25],
    [0.30, 0.25],
  ];
  for (const [lx, lz] of legPositions) {
    const legGeo = new THREE.CylinderGeometry(0.02, 0.015, 0.26, 8);
    const leg = new THREE.Mesh(legGeo, matWalnut);
    leg.position.set(lx, 0.13, lz);
    zoneReadingGroup.add(leg);
  }

  // Low Brass & Smoked Glass Coffee Table (0.50m diameter x 0.42m high)
  const tableTopGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.025, 24);
  const tableTop = new THREE.Mesh(tableTopGeo, matBrass);
  tableTop.position.set(-0.65, 0.42, -0.15);
  zoneReadingGroup.add(tableTop);

  const tableStemGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.40, 12);
  const tableStem = new THREE.Mesh(tableStemGeo, matBrass);
  tableStem.position.set(-0.65, 0.21, -0.15);
  zoneReadingGroup.add(tableStem);

  const tableBaseGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.02, 24);
  const tableBase = new THREE.Mesh(tableBaseGeo, matBrass);
  tableBase.position.set(-0.65, 0.01, -0.15);
  zoneReadingGroup.add(tableBase);

  // Expedition Field Journals on Table
  const journalGeo = new THREE.BoxGeometry(0.18, 0.03, 0.14);
  const journal = new THREE.Mesh(journalGeo, matLeather);
  journal.position.set(-0.65, 0.45, -0.15);
  journal.rotation.y = Math.PI / 7;
  zoneReadingGroup.add(journal);

  // Reading Floor Lamp with Brass Arch & Warm Shaded Glow
  const lampBaseGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.03, 16);
  const lampBase = new THREE.Mesh(lampBaseGeo, matBrass);
  lampBase.position.set(0.60, 0.015, 0.35);
  zoneReadingGroup.add(lampBase);

  const lampPoleGeo = new THREE.CylinderGeometry(0.015, 0.015, 1.60, 8);
  const lampPole = new THREE.Mesh(lampPoleGeo, matBrass);
  lampPole.position.set(0.60, 0.80, 0.35);
  zoneReadingGroup.add(lampPole);

  const lampShadeGeo = new THREE.ConeGeometry(0.16, 0.18, 16, 1, true);
  const lampShadeMat = new THREE.MeshStandardMaterial({ color: 0xf6f0e4, roughness: 0.85 });
  const lampShade = new THREE.Mesh(lampShadeGeo, lampShadeMat);
  lampShade.position.set(0.52, 1.55, 0.28);
  lampShade.rotation.z = Math.PI / 10;
  zoneReadingGroup.add(lampShade);

  // Wall-Mounted Ultra-Slim Documentary Video Screen (1.30m wide x 0.75m high)
  const screenFrameGeo = new THREE.BoxGeometry(0.04, 0.75, 1.30);
  const screenFrame = new THREE.Mesh(screenFrameGeo, matBronze);
  screenFrame.position.set(0.98, 1.65, -0.10);
  zoneReadingGroup.add(screenFrame);

  // Glowing Video Surface
  const screenSurfaceGeo = new THREE.BoxGeometry(0.01, 0.70, 1.24);
  const screenSurfaceMat = new THREE.MeshBasicMaterial({ color: 0x1b344b });
  videoScreenMesh = new THREE.Mesh(screenSurfaceGeo, screenSurfaceMat);
  videoScreenMesh.position.set(0.96, 1.65, -0.10);
  zoneReadingGroup.add(videoScreenMesh);

  group.add(zoneReadingGroup);

  // Lounge Area Collider
  colliders.push({
    min: [1.15, 0.50, -3.20],
    max: [2.55, 1.60, -2.05],
    name: 'reading_lounge',
  });

  exhibits.push({
    id: 'reading',
    zoneId: 'reading',
    title: 'Area Baca Reflektif & Arsip Sinema Dokumentasi',
    subtitle: 'Ruang Kontemplasi Audio-Visual & Jurnal Perjalanan',
    category: 'Sinema & Literatur Ekspedisi',
    description:
      'Sudut santai yang tenang dengan kursi berlengan mid-century yang nyaman, lampu baca temaram, meja kopi kuningan berisi jurnal lapangan, dan layar video interaktif yang menayangkan dokumentasi perjalanan 195 negara.',
    story:
      'Perjalanan membutuhkan jeda untuk merenung dan mencerna makna dari setiap perjumpaan. Di sudut ini, pengunjung dapat duduk, membaca catatan harian petualang, serta menyaksikan cuplikan video sinematik bentang alam bumi.',
    curatorNotes:
      'Layar monitor menampilkan visualisasi data perjalanan teranyar dengan palet warna malam yang menenangkan. Dilengkapi pencahayaan baca terfokus berdaya rendah 2700K.',
    specs: [
      { label: 'Furnitur Duduk', value: 'Kursi Baca Tweed Upholstered & Kayu Walnut' },
      { label: 'Monitor Arsip', value: 'Layar Video Rasio 16:9 Dinding Timur' },
      { label: 'Pustaka Lapangan', value: 'Jurnal Ekspedisi & Panduan Kartografi' },
      { label: 'Lampu Baca', value: 'Lampu Kuningan Warm Brass 2700K' },
    ],
    position: [1.85, 1.55, -2.6],
    interactRadius: 1.9,
    viewPosition: [1.0, 1.60, -2.6],
    viewTarget: [2.60, 1.55, -2.6],
    icon: '🎬',
    tag: 'Baca & Video',
    accentColor: 'purple',
    relatedCountries: ['IDN', 'ISL', 'NOR', 'NZL', 'CHL'],
  });

  // ── Render Loop Update Callback ───────────────────────────────────────────
  const update = (delta: number) => {
    // 1. Slow, elegant continuous rotation of the Central Earth Globe
    if (globeMesh) {
      globeMesh.rotation.y += delta * 0.22; // ~1 rotation every 28 seconds
    }

    // 2. Subtle organic glow oscillation on documentary video screen
    if (videoScreenMesh) {
      videoTimer += delta * 1.5;
      const hue = 0.58 + Math.sin(videoTimer * 0.4) * 0.04;
      const lightness = 0.20 + Math.sin(videoTimer * 0.8) * 0.05;
      (videoScreenMesh.material as THREE.MeshBasicMaterial).color.setHSL(hue, 0.45, lightness);
    }
  };

  return { group, exhibits, colliders, update };
}
