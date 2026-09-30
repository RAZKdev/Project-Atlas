/**
 * Machine-Checkable Country Dataset Validation Module for Project Atlas.
 * Enforces the strict requirements of the 3D World Atlas Master Prompt:
 * - EXPECTED_COUNTRY_COUNT = 195 (193 UN members + Holy See + State of Palestine)
 * - Fails if count !== 195
 * - Fails on duplicate IDs, duplicate ISO-2, duplicate ISO-3
 * - Fails on missing or out-of-range coordinates (Lat [-90, 90], Lng [-180, 180])
 * - Fails on missing landmark records, missing representation types, or missing source metadata
 */

import { CanonicalCountry, EXPECTED_COUNTRY_COUNT } from './canonicalCountries';
import { validateCoordinates } from '../geo/coordinateValidation';

export interface ValidationReport {
  valid: boolean;
  expectedCount: number;
  actualCount: number;
  errors: string[];
  warnings: string[];
  metrics: {
    heroCount: number;
    lowPolyCount: number;
    proceduralCount: number;
    coneCount: number;
    verifiedSourceCount: number;
  };
}

/**
 * Validates the canonical 195-country dataset against all required constraints.
 */
export function validateCanonicalDataset(countries: CanonicalCountry[]): ValidationReport {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 1. Exact Count Check
  if (countries.length !== EXPECTED_COUNTRY_COUNT) {
    errors.push(
      `[FATAL] Country count mismatch: expected exactly ${EXPECTED_COUNTRY_COUNT} sovereign countries, found ${countries.length}.`
    );
  }

  // 2. Uniqueness Checks
  const seenIds = new Set<string>();
  const seenIso2 = new Set<string>();
  const seenIso3 = new Set<string>();

  let heroCount = 0;
  let lowPolyCount = 0;
  let proceduralCount = 0;
  let coneCount = 0;
  let verifiedSourceCount = 0;

  countries.forEach((country, index) => {
    const idxPrefix = `Country #${index + 1} (${country.id || 'UNKNOWN'})`;

    // Check ID
    if (!country.id || typeof country.id !== 'string') {
      errors.push(`${idxPrefix}: missing or invalid id.`);
    } else {
      if (seenIds.has(country.id)) {
        errors.push(`${idxPrefix}: duplicate id "${country.id}".`);
      }
      seenIds.add(country.id);
    }

    // Check ISO alpha-2
    if (!country.isoAlpha2 || country.isoAlpha2.length !== 2) {
      errors.push(`${idxPrefix}: invalid ISO alpha-2 code "${country.isoAlpha2}".`);
    } else {
      if (seenIso2.has(country.isoAlpha2)) {
        errors.push(`${idxPrefix}: duplicate ISO alpha-2 code "${country.isoAlpha2}".`);
      }
      seenIso2.add(country.isoAlpha2);
    }

    // Check ISO alpha-3
    if (!country.isoAlpha3 || country.isoAlpha3.length !== 3) {
      errors.push(`${idxPrefix}: invalid ISO alpha-3 code "${country.isoAlpha3}".`);
    } else {
      if (seenIso3.has(country.isoAlpha3)) {
        errors.push(`${idxPrefix}: duplicate ISO alpha-3 code "${country.isoAlpha3}".`);
      }
      seenIso3.add(country.isoAlpha3);
    }

    // Check Name and Capital
    if (!country.displayName || !country.displayName.trim()) {
      errors.push(`${idxPrefix}: missing displayName.`);
    }
    if (!country.capital || !country.capital.trim()) {
      errors.push(`${idxPrefix}: missing capital.`);
    }

    // Check Coordinates
    const coordCheck = validateCoordinates(country.latitude, country.longitude);
    if (!coordCheck.valid) {
      errors.push(`${idxPrefix}: ${coordCheck.error}`);
    }

    // Check Landmark Record
    if (!country.landmark) {
      errors.push(`${idxPrefix}: missing mandatory landmark record.`);
    } else {
      if (!country.landmark.name || !country.landmark.name.trim()) {
        errors.push(`${idxPrefix}: landmark missing name.`);
      }
      if (!country.landmark.source || !country.landmark.source.url) {
        errors.push(`${idxPrefix}: landmark missing source URL.`);
      } else {
        verifiedSourceCount++;
      }
    }

    // Check Representation Type
    const validRepTypes = [
      'HERO_LANDMARK_3D',
      'LOW_POLY_LANDMARK_3D',
      'PROCEDURAL_LANDMARK_3D',
      'COUNTRY_CONE_MARKER',
    ];
    if (!validRepTypes.includes(country.representationType)) {
      errors.push(
        `${idxPrefix}: invalid representationType "${country.representationType}". Must be one of: ${validRepTypes.join(', ')}.`
      );
    }

    // Representation metrics
    if (country.representationType === 'HERO_LANDMARK_3D') heroCount++;
    else if (country.representationType === 'LOW_POLY_LANDMARK_3D') lowPolyCount++;
    else if (country.representationType === 'PROCEDURAL_LANDMARK_3D') proceduralCount++;
    else if (country.representationType === 'COUNTRY_CONE_MARKER') coneCount++;
  });

  return {
    valid: errors.length === 0,
    expectedCount: EXPECTED_COUNTRY_COUNT,
    actualCount: countries.length,
    errors,
    warnings,
    metrics: {
      heroCount,
      lowPolyCount,
      proceduralCount,
      coneCount,
      verifiedSourceCount,
    },
  };
}

/**
 * Asserts valid canonical dataset or throws detailed error.
 */
export function assertCanonicalDataset(countries: CanonicalCountry[]): void {
  const report = validateCanonicalDataset(countries);
  if (!report.valid) {
    throw new Error(
      `[Canonical Dataset Validation Failed]\n${report.errors.map(e => ` - ${e}`).join('\n')}`
    );
  }
}
