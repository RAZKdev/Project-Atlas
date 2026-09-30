/**
 * Core domain contracts for Place.
 * Source of truth: DESIGN.md & SKILL.md.
 */

export interface Place {
  id: string;
  countryCode: string;
  name: string;
  region?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  description?: string;
  coverImage?: string;
}
