/**
 * Museum Mini 3D — Data & Config
 * "195 Negara, 1 Cerita" — Project Atlas Personal Mini Museum
 *
 * All dimensions in Three.js units where 1 unit = 1 meter.
 * Source: architectural concept board media_1790329033327.jpg
 */

// ─── Building Physical Constants ────────────────────────────────────────────
export const BUILDING_CONFIG = {
  // Site plan
  siteWidth: 10,
  siteLength: 12,

  // Building footprint
  buildingWidth: 6,
  buildingLength: 8,

  // Heights
  baseHeight: 0.5,       // raised concrete foundation
  wallHeight: 3.5,       // interior ceiling height
  roofPitch: 0.9,        // ridge height above wall top
  wallThickness: 0.2,    // lightweight brick wall

  // Openings
  doorWidth: 1.8,
  doorHeight: 2.6,
  windowWidth: 1.2,
  windowHeight: 1.4,
  windowSillHeight: 0.9,

  // Camera initial position (exterior, slightly elevated)
  defaultCameraPos: { x: 14, y: 8, z: 14 } as const,
  defaultCameraTarget: { x: 0, y: 1.5, z: 0 } as const,
} as const;

// ─── Camera Presets ──────────────────────────────────────────────────────────
export type CameraMode = 'exterior' | 'interior_overview' | 'zone';

export interface CameraPreset {
  id: CameraMode | string;
  label: string;
  position: [number, number, number];
  target: [number, number, number];
}

export const CAMERA_PRESETS: CameraPreset[] = [
  {
    id: 'exterior',
    label: 'Tampak Luar',
    position: [14, 8, 14],
    target: [0, 1.5, 0],
  },
  {
    id: 'exterior_front',
    label: 'Tampak Depan',
    position: [0, 5, 16],
    target: [0, 1.5, 0],
  },
  {
    id: 'interior_overview',
    label: 'Interior Keseluruhan',
    position: [0, 6, 0],
    target: [0, 0, 0],
  },
  {
    id: 'zone_intro',
    label: 'Area Intro',
    position: [-1.5, 2.5, 5],
    target: [-1.5, 1.5, 3],
  },
  {
    id: 'zone_globe',
    label: 'Peta Dunia Tengah',
    position: [0, 3.5, 2],
    target: [0, 1.5, 0],
  },
  {
    id: 'zone_gallery',
    label: 'Galeri Foto',
    position: [4, 2.5, 0],
    target: [2.8, 1.8, 0],
  },
  {
    id: 'zone_flags',
    label: 'Bendera & Mata Uang',
    position: [0, 2.5, -5],
    target: [0, 1.8, -3.5],
  },
  {
    id: 'zone_souvenir',
    label: 'Lemari Suvenir',
    position: [-4, 2.5, 0],
    target: [-2.8, 1.5, 0],
  },
  {
    id: 'zone_reading',
    label: 'Area Baca & Video',
    position: [1.5, 2.5, -5],
    target: [1.5, 1.3, -3.5],
  },
];

// ─── Museum Interior Zones ───────────────────────────────────────────────────
export interface MuseumZone {
  id: string;
  name: string;
  description: string;
  icon: string;
  // Center of zone in 3D space (for hotspot placement)
  position: [number, number, number];
  // Hotspot beacon position (slightly above the zone)
  hotspotPos: [number, number, number];
  // Camera preset ID that "enters" this zone
  cameraPreset: string;
  // Tailwind accent color token
  accent: string;
}

export const MUSEUM_ZONES: MuseumZone[] = [
  {
    id: 'intro',
    name: 'Area Intro & Buku Legacy',
    description:
      'Pintu masuk museum mini. Menampilkan buku besar Project Atlas Legacy, peta dinding pertama, dan pengantar 195 negara.',
    icon: '📖',
    position: [-1.5, 1.5, 3.2],
    hotspotPos: [-1.5, 2.6, 3.2],
    cameraPreset: 'zone_intro',
    accent: 'earth',
  },
  {
    id: 'globe',
    name: 'Peta Dunia & Display Utama',
    description:
      'Jantung museum — globe interaktif yang memutar dan menampilkan titik-titik perjalanan. Meja display kaca di tengah ruang.',
    icon: '🌍',
    position: [0, 1.5, 0],
    hotspotPos: [0, 2.8, 0],
    cameraPreset: 'zone_globe',
    accent: 'blue',
  },
  {
    id: 'gallery',
    name: 'Galeri Foto Perjalanan',
    description:
      'Dinding timur penuh bingkai foto hitam-putih dan berwarna dari berbagai negara. Setiap foto adalah sepotong kenangan.',
    icon: '🖼️',
    position: [2.8, 1.8, 0],
    hotspotPos: [2.8, 2.8, 0],
    cameraPreset: 'zone_gallery',
    accent: 'amber',
  },
  {
    id: 'flags',
    name: 'Koleksi Bendera & Mata Uang',
    description:
      'Dinding utara dipenuhi miniatur bendera 195 negara. Laci kaca menampung koleksi koin dan uang kertas dari seluruh dunia.',
    icon: '🚩',
    position: [0, 1.8, -3.5],
    hotspotPos: [0, 2.8, -3.5],
    cameraPreset: 'zone_flags',
    accent: 'red',
  },
  {
    id: 'souvenir',
    name: 'Lemari Kaca Suvenir',
    description:
      'Lemari kaca besar di dinding barat. Setiap rak menyimpan suvenir fisik dari negara yang berbeda — keramik, patung, tekstil.',
    icon: '🏺',
    position: [-2.8, 1.5, 0],
    hotspotPos: [-2.8, 2.6, 0],
    cameraPreset: 'zone_souvenir',
    accent: 'teal',
  },
  {
    id: 'reading',
    name: 'Area Baca & Video Dokumentasi',
    description:
      'Sudut selatan dengan kursi nyaman, rak buku, dan layar kecil yang memutar video dokumentasi perjalanan.',
    icon: '🎬',
    position: [1.5, 1.2, -3.5],
    hotspotPos: [1.5, 2.5, -3.5],
    cameraPreset: 'zone_reading',
    accent: 'purple',
  },
];

// ─── Museum Color Palette ────────────────────────────────────────────────────
// Hex colors for Three.js materials (matching DESIGN.md museum aesthetic)
export const MUSEUM_COLORS = {
  // Exterior
  wallPaint: 0xf5efe6,      // warm cream painted walls
  wallPaintSide: 0xede4d8,  // side walls slightly cooler
  roofMetal: 0x3a3530,      // dark metal roof (charcoal)
  roofRidge: 0x2a2420,      // darker ridge capping
  foundation: 0xb8a898,     // concrete base
  groundConcrete: 0x9a9080, // site concrete / pathway
  grassSite: 0x4a5c3a,      // surrounding landscape

  // Interior structural
  floorCeramic: 0xf0ebe2,   // 60x60 ceramic tile (near white)
  floorGrout: 0xd4c9b8,     // grout lines
  ceilingPlaster: 0xf2ede6, // white plaster ceiling
  innerWall: 0xede8df,      // interior wall paint

  // Furniture & display
  woodOak: 0x8b6914,        // warm oak shelving
  woodDark: 0x3d2b1a,       // dark mahogany display tables
  glassClear: 0x88ccee,     // glass panels (display cases)
  metalFrame: 0x555045,     // aluminium door/window frames
  metalBrass: 0xb08040,     // brass hardware / door handles

  // Lighting
  ambientWarm: 0xfff0d0,    // warm ambient
  downlightWarm: 0xffe8b0,  // ceiling spot lights (warm white)
  accentGold: 0xd4a843,     // accent / highlight gold

  // Globe display
  globeBlue: 0x1a4a7a,      // ocean color on interior globe
  globeLand: 0x5a7a3a,      // land color on interior globe
} as const;
