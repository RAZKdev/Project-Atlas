/**
 * Core domain contracts for Souvenir / Artifact.
 * Source of truth: DESIGN.md & SKILL.md.
 */

import { MediaReference } from './media';

export interface Souvenir {
  id: string;
  countryCode: string;
  memoryId?: string;
  name: string;
  description?: string;
  acquiredDate?: string;
  placeName?: string;
  photoReference?: MediaReference;
  category?: 'artifact' | 'ticket' | 'textile' | 'postcard' | 'stamp' | 'coin' | 'other';
  notes?: string;
}
