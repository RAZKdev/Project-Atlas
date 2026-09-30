/**
 * Core domain contracts for Memory.
 * Source of truth: DESIGN.md & SKILL.md.
 */

import { MediaReference } from './media';
import { Souvenir } from './souvenir';

export interface Memory {
  id: string;
  title: string;
  countryCode: string;
  placeId?: string;
  placeName: string;
  dateStart: string;              // ISO format: YYYY-MM-DD
  dateEnd?: string;               // ISO format: YYYY-MM-DD
  summary: string;
  notes?: string;                 // Detailed journal / archival text
  tags: string[];
  favorite: boolean;
  coverImage?: MediaReference;
  mediaReferences: MediaReference[];
  souvenirs?: Souvenir[];
  createdAt: string;              // ISO datetime
  updatedAt: string;              // ISO datetime
}

export interface AtlasStats {
  totalCountriesDocumented: number;
  totalCountriesVisited: number;
  totalMemories: number;
  totalPlaces: number;
  totalPhotos: number;
  totalSouvenirs: number;
}
