/**
 * Landmark Representation Levels & Types for Project Atlas.
 * Defines the strict representation hierarchy mandated by the Master Prompt:
 * Level A: HERO_LANDMARK_3D
 * Level B: LOW_POLY_LANDMARK_3D
 * Level C: PROCEDURAL_LANDMARK_3D
 * Level D: COUNTRY_CONE_MARKER
 */

export type LandmarkRepresentationLevel =
  | 'HERO_LANDMARK_3D'
  | 'LOW_POLY_LANDMARK_3D'
  | 'PROCEDURAL_LANDMARK_3D'
  | 'COUNTRY_CONE_MARKER';

export type LandmarkCategory =
  | 'historic'
  | 'religious'
  | 'civic'
  | 'modern'
  | 'cultural'
  | 'engineering'
  | 'natural';

export interface LandmarkSourceReference {
  publisher: string;
  url: string;
  accessedAt: string;
  citationNotes?: string;
}

export interface LandmarkRecord {
  name: string;
  city: string;
  latitude: number;
  longitude: number;
  category: LandmarkCategory;
  archetype: string;
  reason: string;
  source: LandmarkSourceReference;
  representationType: LandmarkRepresentationLevel;
  heightMultiplier?: number;
}
