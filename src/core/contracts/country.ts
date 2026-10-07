/**
 * Core domain contracts for Country in Project Atlas.
 * Source of truth: DESIGN.md & SKILL.md.
 */

export type CountryStatus = 'unknown' | 'interested' | 'planned' | 'visited' | 'documented';

export interface Country {
  code: string;            // ISO 3166-1 alpha-2 code (uppercase, e.g. 'ID', 'JP', 'IS')
  name: string;
  nativeName?: string;
  continent: 'Asia' | 'Europe' | 'Africa' | 'North America' | 'South America' | 'Oceania' | 'Antarctica';
  status: CountryStatus;
  summary?: string;
  capital?: string;
  officialName?: string;
  coverImage?: string;     // URL or asset path
  visitedYear?: number;
  documentedPlacesCount?: number;
  notes?: string;
}

export interface ContinentSummary {
  name: string;
  totalCountries: number;
  visitedCountries: number;
  documentedCount: number;
}
