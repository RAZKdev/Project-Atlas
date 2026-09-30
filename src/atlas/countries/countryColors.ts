/**
 * Deterministic Geographic Region Color Palette for Project Atlas.
 * Adheres strictly to the Master Prompt directive:
 * - Colors are deterministic by broad geographic region.
 * - No arbitrary random colors.
 * - No political status implied through color.
 * - High-contrast, accessible, editorial museum aesthetic.
 */

export type GeographicRegion =
  | 'Asia'
  | 'Europe'
  | 'Africa'
  | 'North America'
  | 'South America'
  | 'Oceania';

export interface RegionColorToken {
  region: GeographicRegion;
  hex: string;
  threeColor: number;
  label: string;
  description: string;
}

export const REGION_COLORS: Record<GeographicRegion, RegionColorToken> = {
  Asia: {
    region: 'Asia',
    hex: '#F59E0B', // Amber gold
    threeColor: 0xf59e0b,
    label: 'Asia',
    description: '48 Negara di kawasan Asia Timur, Tenggara, Selatan, Barat & Tengah',
  },
  Europe: {
    region: 'Europe',
    hex: '#3B82F6', // Lapis blue
    threeColor: 0x3b82f6,
    label: 'Eropa',
    description: '44 Negara di kawasan Eropa Barat, Timur, Utara & Selatan',
  },
  Africa: {
    region: 'Africa',
    hex: '#10B981', // Emerald green
    threeColor: 0x10b981,
    label: 'Afrika',
    description: '54 Negara di benua Afrika',
  },
  'North America': {
    region: 'North America',
    hex: '#EC4899', // Rose coral
    threeColor: 0xec4899,
    label: 'Amerika Utara & Tengah',
    description: '23 Negara di kawasan Amerika Utara, Tengah & Karibia',
  },
  'South America': {
    region: 'South America',
    hex: '#8B5CF6', // Amethyst violet
    threeColor: 0x8b5cf6,
    label: 'Amerika Selatan',
    description: '12 Negara di daratan benua Amerika Selatan',
  },
  Oceania: {
    region: 'Oceania',
    hex: '#06B6D4', // Pacific turquoise
    threeColor: 0x06b6d4,
    label: 'Oseania',
    description: '14 Negara di Pasifik & Australasia',
  },
};

/**
 * Returns the deterministic Three.js color integer for a given region.
 */
export function getRegionColor(region: string): number {
  const token = REGION_COLORS[region as GeographicRegion];
  return token ? token.threeColor : 0xd4a843; // default earth-gold
}

/**
 * Returns the deterministic hex string for a given region.
 */
export function getRegionHex(region: string): string {
  const token = REGION_COLORS[region as GeographicRegion];
  return token ? token.hex : '#D4A843';
}
