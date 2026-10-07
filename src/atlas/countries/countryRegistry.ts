/**
 * Country Registry & Search Index for Project Atlas.
 * Comprehensive multi-field search engine supporting:
 * - Country Display Name (Indonesian)
 * - Official Country Name & International Aliases (English, French, etc.)
 * - Capital City (Single-word & Multi-word: "Bandar Seri Begawan", "New Delhi", "Buenos Aires", "San José")
 * - ISO-2 and ISO-3 codes ("ID", "IDN", "BN", "CHE")
 * - Landmark Name ("Borobudur", "Eiffel", "Taj Mahal")
 * - Region & Subregion
 *
 * Architecture Highlights:
 * 1. Full Query Preservation: No word-count cutoff or truncation.
 * 2. Complete Unicode Normalization: Strips diacritics (NFD), collapses repeated spaces, ignores punctuation.
 * 3. Token-aware Matching: Resolves multi-word queries regardless of word order.
 * 4. Deterministic 7-Tier Relevance Ranking: Exact matches always outrank prefix, substring, and fuzzy matches.
 * 5. Typo Tolerance: Levenshtein distance fallback for user misspellings.
 */

import { CANONICAL_COUNTRIES, CanonicalCountry } from './canonicalCountries';

export interface SearchMatch {
  country: CanonicalCountry;
  matchType: 'country' | 'capital' | 'landmark' | 'code' | 'region' | 'alias' | 'fuzzy';
  matchedText: string;
  matchedField: 'code' | 'name' | 'capital' | 'landmark' | 'region' | 'alias';
  score: number;
  highlightDetail?: string;
}

/**
 * Normalizes text for search:
 * - Decomposes Unicode diacritics via NFD (e.g., "é" -> "e", "ô" -> "o")
 * - Lowers case
 * - Converts punctuation, hyphens, and apostrophes to spaces
 * - Collapses consecutive whitespace into a single space
 * - Trims edges
 */
export function normalizeSearchString(text: string): string {
  if (!text) return '';
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?'"“”]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Computes Levenshtein distance between two normalized strings.
 */
export function levenshteinDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const row = Array.from({ length: b.length + 1 }, (_, i) => i);

  for (let i = 1; i <= a.length; i++) {
    let prev = i;
    for (let j = 1; j <= b.length; j++) {
      const val = a[i - 1] === b[j - 1] ? row[j - 1] : Math.min(row[j - 1], prev, row[j]) + 1;
      row[j - 1] = prev;
      prev = val;
    }
    row[b.length] = prev;
  }

  return row[b.length];
}

/**
 * Authoritative common international aliases (English, alternative names, common abbreviations)
 * to ensure intuitive search across 195 nations.
 */
export const COUNTRY_ALIASES: Record<string, string[]> = {
  'KR': ['South Korea', 'Republic of Korea', 'Korea'],
  'KP': ['North Korea', 'DPRK', 'Democratic People\'s Republic of Korea'],
  'AE': ['United Arab Emirates', 'UAE', 'Emirates'],
  'PG': ['Papua New Guinea'],
  'US': ['United States', 'United States of America', 'USA', 'America'],
  'GB': ['United Kingdom', 'Great Britain', 'UK', 'Britain', 'England'],
  'SA': ['Saudi Arabia', 'KSA'],
  'CI': ['Côte d\'Ivoire', 'Cote d\'Ivoire', 'Ivory Coast'],
  'CH': ['Switzerland', 'Swiss Confederation', 'Swiss'],
  'VA': ['Holy See', 'Vatican', 'Vatican City'],
  'PS': ['Palestine', 'State of Palestine'],
  'NL': ['Netherlands', 'Holland'],
  'DE': ['Germany', 'Deutschland'],
  'NZ': ['New Zealand'],
  'ZA': ['South Africa'],
  'JP': ['Japan', 'Nippon'],
  'CN': ['China', 'PRC'],
  'EG': ['Egypt'],
  'ES': ['Spain', 'España'],
  'FR': ['France'],
  'IT': ['Italy', 'Italia'],
  'GR': ['Greece', 'Hellas'],
  'RU': ['Russia', 'Russian Federation'],
  'TR': ['Turkey', 'Türkiye'],
  'SY': ['Syria'],
  'LB': ['Lebanon'],
  'JO': ['Jordan'],
  'TL': ['East Timor', 'Timor-Leste'],
  'BN': ['Brunei'],
  'SG': ['Singapore'],
  'MY': ['Malaysia'],
  'PH': ['Philippines'],
  'VN': ['Vietnam'],
  'TH': ['Thailand'],
  'MM': ['Myanmar', 'Burma'],
  'KH': ['Cambodia'],
  'LA': ['Laos'],
  'CR': ['Costa Rica'],
  'MX': ['Mexico'],
  'BR': ['Brazil', 'Brasil'],
  'AR': ['Argentina'],
  'CL': ['Chile'],
  'PE': ['Peru', 'Perú'],
  'CO': ['Colombia'],
  'PL': ['Poland', 'Polska'],
  'CZ': ['Czechia', 'Czech Republic'],
  'BE': ['Belgium'],
  'AT': ['Austria', 'Österreich'],
  'SE': ['Sweden', 'Sverige'],
  'NO': ['Norway', 'Norge'],
  'FI': ['Finland', 'Suomi'],
  'DK': ['Denmark', 'Danmark'],
  'IS': ['Iceland', 'Ísland'],
  'IE': ['Ireland'],
  'PT': ['Portugal'],
  'UA': ['Ukraine'],
  'IN': ['India', 'Bharat'],
  'ID': ['Indonesia', 'Nusantara'],
};

interface IndexedCountry {
  country: CanonicalCountry;
  normIso2: string;
  normIso3: string;
  normDisplayName: string;
  compactDisplayName: string;
  normOfficialName: string;
  normCapital: string;
  compactCapital: string;
  normLandmark: string;
  normRegion: string;
  normSubregion: string;
  normAliases: { raw: string; normalized: string; compact: string }[];
  allTokens: Set<string>;
}

class CountryRegistry {
  private countries: CanonicalCountry[];
  private byIdMap = new Map<string, CanonicalCountry>();
  private byIso3Map = new Map<string, CanonicalCountry>();
  private indexedCountries: IndexedCountry[] = [];

  constructor(countries: CanonicalCountry[] = CANONICAL_COUNTRIES) {
    this.countries = countries;

    for (const c of countries) {
      const idUpper = c.id.toUpperCase();
      const iso3Upper = c.isoAlpha3.toUpperCase();
      this.byIdMap.set(idUpper, c);
      this.byIso3Map.set(iso3Upper, c);

      // Pre-compute normalized representations for fast sub-millisecond querying
      const normIso2 = normalizeSearchString(c.isoAlpha2);
      const normIso3 = normalizeSearchString(c.isoAlpha3);
      const normDisplayName = normalizeSearchString(c.displayName);
      const compactDisplayName = normDisplayName.replace(/\s+/g, '');
      const normOfficialName = normalizeSearchString(c.officialName);
      const normCapital = normalizeSearchString(c.capital);
      const compactCapital = normCapital.replace(/\s+/g, '');
      const normLandmark = c.landmark ? normalizeSearchString(c.landmark.name) : '';
      const normRegion = normalizeSearchString(c.region);
      const normSubregion = normalizeSearchString(c.subregion);

      const aliases = COUNTRY_ALIASES[idUpper] || [];
      const normAliases = aliases.map(raw => {
        const normalized = normalizeSearchString(raw);
        return {
          raw,
          normalized,
          compact: normalized.replace(/\s+/g, ''),
        };
      });

      // Aggregate all unique word tokens for token-level searching
      const allTokens = new Set<string>();
      [normDisplayName, normOfficialName, normCapital, normLandmark, normRegion, normSubregion].forEach(s => {
        s.split(' ').forEach(t => { if (t.length > 0) allTokens.add(t); });
      });
      normAliases.forEach(a => {
        a.normalized.split(' ').forEach(t => { if (t.length > 0) allTokens.add(t); });
      });

      this.indexedCountries.push({
        country: c,
        normIso2,
        normIso3,
        normDisplayName,
        compactDisplayName,
        normOfficialName,
        normCapital,
        compactCapital,
        normLandmark,
        normRegion,
        normSubregion,
        normAliases,
        allTokens,
      });
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
   * Deterministic layered multi-field search for countries, capitals, landmarks, and codes.
   * Preserves full user query (supports 2-word, 3-word, and 4-word capitals and countries).
   */
  public search(query: string, limit: number = 10): SearchMatch[] {
    if (!query || !query.trim()) return [];

    const rawTrimmed = query.trim();
    const qNorm = normalizeSearchString(rawTrimmed);
    if (!qNorm) return [];

    const qCompact = qNorm.replace(/\s+/g, '');
    const qTokens = qNorm.split(' ').filter(t => t.length > 0);
    const candidateMatches: SearchMatch[] = [];

    for (const item of this.indexedCountries) {
      const c = item.country;
      let matched = false;

      // ── TIER 1: Exact ISO Code Match (Highest Priority: 1000 pts) ───────────
      if (qNorm === item.normIso2 || qNorm === item.normIso3) {
        candidateMatches.push({
          country: c,
          matchType: 'code',
          matchedField: 'code',
          matchedText: c.isoAlpha2,
          score: 1000,
          highlightDetail: `Kode ISO: ${c.isoAlpha2} (${c.isoAlpha3})`,
        });
        continue;
      }

      // ── TIER 2: Exact Country Name Match (950 pts) ──────────────────────────
      if (qNorm === item.normDisplayName || qCompact === item.compactDisplayName || qNorm === item.normOfficialName) {
        candidateMatches.push({
          country: c,
          matchType: 'country',
          matchedField: 'name',
          matchedText: c.displayName,
          score: 950,
          highlightDetail: `Negara: ${c.displayName}`,
        });
        continue;
      }

      // ── TIER 3: Exact Capital City Match (900 pts) ──────────────────────────
      if (item.normCapital && (qNorm === item.normCapital || qCompact === item.compactCapital)) {
        candidateMatches.push({
          country: c,
          matchType: 'capital',
          matchedField: 'capital',
          matchedText: c.capital,
          score: 900,
          highlightDetail: `Ibu kota: ${c.capital}`,
        });
        continue;
      }

      // ── TIER 4: Exact Alias Match (880 pts) ─────────────────────────────────
      const exactAlias = item.normAliases.find(a => qNorm === a.normalized || qCompact === a.compact);
      if (exactAlias) {
        candidateMatches.push({
          country: c,
          matchType: 'country',
          matchedField: 'name',
          matchedText: c.displayName,
          score: 880,
          highlightDetail: `Negara: ${c.displayName} (${exactAlias.raw})`,
        });
        continue;
      }

      // ── TIER 5: Prefix Matches (Starts-With) (700 - 800 pts) ────────────────
      if (item.normDisplayName.startsWith(qNorm) || item.normOfficialName.startsWith(qNorm)) {
        const lenDelta = Math.min(50, (item.normDisplayName.length - qNorm.length) * 2);
        candidateMatches.push({
          country: c,
          matchType: 'country',
          matchedField: 'name',
          matchedText: c.displayName,
          score: 800 - lenDelta,
          highlightDetail: `Negara: ${c.displayName}`,
        });
        continue;
      }

      if (item.normCapital && item.normCapital.startsWith(qNorm)) {
        const lenDelta = Math.min(50, (item.normCapital.length - qNorm.length) * 2);
        candidateMatches.push({
          country: c,
          matchType: 'capital',
          matchedField: 'capital',
          matchedText: c.capital,
          score: 750 - lenDelta,
          highlightDetail: `Ibu kota: ${c.capital}`,
        });
        continue;
      }

      const prefixAlias = item.normAliases.find(a => a.normalized.startsWith(qNorm));
      if (prefixAlias) {
        candidateMatches.push({
          country: c,
          matchType: 'country',
          matchedField: 'alias',
          matchedText: c.displayName,
          score: 720,
          highlightDetail: `Negara: ${c.displayName} (${prefixAlias.raw})`,
        });
        continue;
      }

      if (item.normLandmark && item.normLandmark.startsWith(qNorm)) {
        candidateMatches.push({
          country: c,
          matchType: 'landmark',
          matchedField: 'landmark',
          matchedText: c.landmark.name,
          score: 700,
          highlightDetail: `Landmark: ${c.landmark.name}`,
        });
        continue;
      }

      // ── TIER 6: Multi-Token Matching (When user provides 2+ words: 550 - 600 pts)
      if (qTokens.length > 1) {
        const allTokensPresent = qTokens.every(qToken => {
          for (const token of item.allTokens) {
            if (token === qToken || token.startsWith(qToken)) return true;
          }
          return false;
        });

        if (allTokensPresent) {
          // Check if all tokens match specifically inside the capital city
          const capitalTokens = item.normCapital.split(' ');
          const allInCapital = qTokens.every(qToken =>
            capitalTokens.some(ct => ct === qToken || ct.startsWith(qToken))
          );

          if (allInCapital) {
            candidateMatches.push({
              country: c,
              matchType: 'capital',
              matchedField: 'capital',
              matchedText: c.capital,
              score: 600,
              highlightDetail: `Ibu kota: ${c.capital}`,
            });
            continue;
          }

          candidateMatches.push({
            country: c,
            matchType: 'country',
            matchedField: 'name',
            matchedText: c.displayName,
            score: 560,
            highlightDetail: `${c.displayName} (Ibu kota: ${c.capital})`,
          });
          continue;
        }
      }

      // ── TIER 7: Substring Matching (400 - 500 pts) ──────────────────────────
      if (item.normDisplayName.includes(qNorm) || item.normOfficialName.includes(qNorm)) {
        candidateMatches.push({
          country: c,
          matchType: 'country',
          matchedField: 'name',
          matchedText: c.displayName,
          score: 500,
          highlightDetail: `Negara: ${c.displayName}`,
        });
        continue;
      }

      if (item.normCapital && item.normCapital.includes(qNorm)) {
        candidateMatches.push({
          country: c,
          matchType: 'capital',
          matchedField: 'capital',
          matchedText: c.capital,
          score: 460,
          highlightDetail: `Ibu kota: ${c.capital}`,
        });
        continue;
      }

      const subAlias = item.normAliases.find(a => a.normalized.includes(qNorm));
      if (subAlias) {
        candidateMatches.push({
          country: c,
          matchType: 'country',
          matchedField: 'alias',
          matchedText: c.displayName,
          score: 440,
          highlightDetail: `Negara: ${c.displayName} (${subAlias.raw})`,
        });
        continue;
      }

      if (item.normLandmark && item.normLandmark.includes(qNorm)) {
        candidateMatches.push({
          country: c,
          matchType: 'landmark',
          matchedField: 'landmark',
          matchedText: c.landmark.name,
          score: 400,
          highlightDetail: `Landmark: ${c.landmark.name}`,
        });
        continue;
      }

      if (item.normSubregion.includes(qNorm) || item.normRegion.includes(qNorm)) {
        candidateMatches.push({
          country: c,
          matchType: 'region',
          matchedField: 'region',
          matchedText: c.displayName,
          score: 300,
          highlightDetail: `Kawasan: ${c.subregion || c.region}`,
        });
        continue;
      }

      // ── TIER 8: Fuzzy Typo Matching (100 - 200 pts) ─────────────────────────
      // Only triggered for queries of 4 or more characters
      if (qNorm.length >= 4) {
        const maxDist = qNorm.length <= 5 ? 1 : 2;

        // Check distance to country name
        const distName = levenshteinDistance(qNorm, item.normDisplayName);
        if (distName <= maxDist) {
          candidateMatches.push({
            country: c,
            matchType: 'fuzzy',
            matchedField: 'name',
            matchedText: c.displayName,
            score: 200 - distName * 30,
            highlightDetail: `Mungkin maksud Anda: ${c.displayName}`,
          });
          continue;
        }

        // Check distance to capital city
        if (item.normCapital) {
          const distCapital = levenshteinDistance(qNorm, item.normCapital);
          if (distCapital <= maxDist) {
            candidateMatches.push({
              country: c,
              matchType: 'capital',
              matchedField: 'capital',
              matchedText: c.capital,
              score: 190 - distCapital * 30,
              highlightDetail: `Ibu kota: ${c.capital} (${c.displayName})`,
            });
            continue;
          }
        }

        // Check distance to any individual token in country or capital
        let tokenFuzzyMatched = false;
        for (const token of item.allTokens) {
          if (token.length >= 4 && Math.abs(token.length - qNorm.length) <= maxDist) {
            const d = levenshteinDistance(qNorm, token);
            if (d <= maxDist) {
              candidateMatches.push({
                country: c,
                matchType: 'fuzzy',
                matchedField: 'name',
                matchedText: c.displayName,
                score: 150 - d * 25,
                highlightDetail: `Mungkin maksud Anda: ${c.displayName}`,
              });
              tokenFuzzyMatched = true;
              break;
            }
          }
        }
        if (tokenFuzzyMatched) continue;
      }
    }

    // ── Deterministic Sorting ────────────────────────────────────────────────
    candidateMatches.sort((a, b) => {
      // 1. Primary: Relevance Score (descending)
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      // 2. Secondary: Proximity of matched text length to query length
      const lenDiffA = Math.abs(a.matchedText.length - qNorm.length);
      const lenDiffB = Math.abs(b.matchedText.length - qNorm.length);
      if (lenDiffA !== lenDiffB) {
        return lenDiffA - lenDiffB;
      }
      // 3. Tertiary: Alphabetical order by country displayName
      return a.country.displayName.localeCompare(b.country.displayName);
    });

    return candidateMatches.slice(0, limit);
  }
}

export const countryRegistry = new CountryRegistry();
