/**
 * Country Registry & Search Index for Project Atlas.
 * Provides indexed lookup and full-text search across:
 * - Country Name (Indonesian & Official)
 * - ISO-2 and ISO-3 codes
 * - Capital City
 * - Landmark Name
 * - Subregion & Region
 */

import { CANONICAL_COUNTRIES, CanonicalCountry } from './canonicalCountries';

export interface SearchMatch {
  country: CanonicalCountry;
  matchType: 'country' | 'capital' | 'landmark' | 'code';
  matchedText: string;
}

class CountryRegistry {
  private countries: CanonicalCountry[];
  private byIdMap = new Map<string, CanonicalCountry>();
  private byIso3Map = new Map<string, CanonicalCountry>();

  constructor(countries: CanonicalCountry[] = CANONICAL_COUNTRIES) {
    this.countries = countries;
    for (const c of countries) {
      this.byIdMap.set(c.id.toUpperCase(), c);
      this.byIso3Map.set(c.isoAlpha3.toUpperCase(), c);
    }
  }

  public getAll(): CanonicalCountry[] {
    return this.countries;
  }

  public getById(idOrIso2: string): CanonicalCountry | undefined {
    return this.byIdMap.get(idOrIso2.toUpperCase());
  }

  public getByIso3(iso3: string): CanonicalCountry | undefined {
    return this.byIso3Map.get(iso3.toUpperCase());
  }

  /**
   * Global multi-field search for countries, capitals, and landmarks with relevance ranking.
   */
  public search(query: string, limit: number = 10): SearchMatch[] {
    if (!query || !query.trim()) return [];
    const q = query.trim().toLowerCase();

    const exactCodeMatches: SearchMatch[] = [];
    const nameMatches: SearchMatch[] = [];
    const capitalMatches: SearchMatch[] = [];
    const landmarkMatches: SearchMatch[] = [];

    for (const country of this.countries) {
      // 1. Exact ISO code match (Highest priority)
      if (country.isoAlpha2.toLowerCase() === q || country.isoAlpha3.toLowerCase() === q) {
        exactCodeMatches.push({ country, matchType: 'code', matchedText: country.isoAlpha2 });
        continue;
      }

      // 2. Country name match
      if (country.displayName.toLowerCase().startsWith(q) || country.officialName.toLowerCase().startsWith(q)) {
        nameMatches.push({ country, matchType: 'country', matchedText: country.displayName });
        continue;
      }
      if (country.displayName.toLowerCase().includes(q) || country.officialName.toLowerCase().includes(q)) {
        nameMatches.push({ country, matchType: 'country', matchedText: country.displayName });
        continue;
      }

      // 3. Capital city match
      if (country.capital && country.capital.toLowerCase().includes(q)) {
        capitalMatches.push({ country, matchType: 'capital', matchedText: country.capital });
        continue;
      }

      // 4. Landmark name match
      if (country.landmark && country.landmark.name.toLowerCase().includes(q)) {
        landmarkMatches.push({ country, matchType: 'landmark', matchedText: country.landmark.name });
        continue;
      }
    }

    const merged = [
      ...exactCodeMatches,
      ...nameMatches,
      ...capitalMatches,
      ...landmarkMatches,
    ];

    return merged.slice(0, limit);
  }
}

export const countryRegistry = new CountryRegistry();
