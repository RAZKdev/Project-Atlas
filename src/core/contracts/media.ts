/**
 * Core domain contracts for Media Reference & Attribution.
 * Source of truth: DESIGN.md & SKILL.md.
 */

export type MediaType = 'image' | 'video';

export interface ImageAttribution {
  photographer?: string;
  source?: string;
  license?: string;
  sourceUrl?: string;
}

export interface MediaReference {
  id: string;
  type: MediaType;
  uri: string;                     // Web URL or public asset path
  thumbnailUri?: string;
  caption?: string;
  date?: string;                   // ISO date string
  placeId?: string;
  countryCode?: string;
  isPersonal: boolean;             // True if personal photograph, false if curated public reference
  attribution?: ImageAttribution;
  width?: number;
  height?: number;
}
