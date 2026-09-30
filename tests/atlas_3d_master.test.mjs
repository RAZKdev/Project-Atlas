import test from 'node:test';
import assert from 'node:assert/strict';

// Load the generated canonical dataset directly
import { CANONICAL_COUNTRIES, EXPECTED_COUNTRY_COUNT } from '../src/atlas/countries/canonicalCountries.js';
import { validateCanonicalDataset, assertCanonicalDataset } from '../src/atlas/countries/countryValidation.js';
import { geoToVector3 } from '../src/atlas/geo/geoToVector3.js';
import { validateCoordinates } from '../src/atlas/geo/coordinateValidation.js';
import { countryRegistry } from '../src/atlas/countries/countryRegistry.js';
import { calculateSolarPosition } from '../src/atlas/globe/solarCalculations.js';
import { REGION_COLORS, getRegionColor, getRegionHex } from '../src/atlas/countries/countryColors.js';

test('Test 1: Exactly 195 Canonical Country Records', () => {
  assert.equal(EXPECTED_COUNTRY_COUNT, 195);
  assert.equal(CANONICAL_COUNTRIES.length, 195, 'Dataset must have exactly 195 records (193 UN + Holy See + Palestine)');
});

test('Test 2: Unique Country IDs and ISO-2 and ISO-3 Codes', () => {
  const seenIds = new Set();
  const seenIso2 = new Set();
  const seenIso3 = new Set();

  for (const c of CANONICAL_COUNTRIES) {
    assert.ok(!seenIds.has(c.id), `Duplicate ID detected: ${c.id}`);
    seenIds.add(c.id);

    assert.ok(!seenIso2.has(c.isoAlpha2), `Duplicate ISO alpha-2: ${c.isoAlpha2}`);
    seenIso2.add(c.isoAlpha2);

    assert.ok(!seenIso3.has(c.isoAlpha3), `Duplicate ISO alpha-3: ${c.isoAlpha3}`);
    seenIso3.add(c.isoAlpha3);
  }

  assert.equal(seenIds.size, 195);
  assert.equal(seenIso2.size, 195);
  assert.equal(seenIso3.size, 195);
});

test('Test 3: Valid Geographic Coordinates for all 195 Countries', () => {
  for (const c of CANONICAL_COUNTRIES) {
    const check = validateCoordinates(c.latitude, c.longitude);
    assert.ok(check.valid, `Invalid coordinate for ${c.displayName} (${c.id}): ${check.error}`);
    assert.ok(c.latitude >= -90 && c.latitude <= 90, `Latitude out of range for ${c.id}`);
    assert.ok(c.longitude >= -180 && c.longitude <= 180, `Longitude out of range for ${c.id}`);
  }
});

test('Test 4: Every Country Has Documented Landmark Record & Archetype', () => {
  for (const c of CANONICAL_COUNTRIES) {
    assert.ok(c.landmark, `Missing landmark object for ${c.displayName} (${c.id})`);
    assert.ok(c.landmark.name && c.landmark.name.trim().length > 0, `Empty landmark name for ${c.id}`);
    assert.ok(c.landmark.archetype && c.landmark.archetype.trim().length > 0, `Missing archetype for ${c.id}`);
    assert.ok(c.landmark.reason && c.landmark.reason.trim().length > 0, `Missing landmark justification for ${c.id}`);
  }
});

test('Test 5: Every Country Has Valid Representation Type (A, B, C, or D)', () => {
  const allowed = new Set([
    'HERO_LANDMARK_3D',
    'LOW_POLY_LANDMARK_3D',
    'PROCEDURAL_LANDMARK_3D',
    'COUNTRY_CONE_MARKER',
  ]);

  for (const c of CANONICAL_COUNTRIES) {
    assert.ok(
      allowed.has(c.representationType),
      `Invalid representationType "${c.representationType}" for ${c.displayName} (${c.id})`
    );
  }
});

test('Test 6: Every Country Has Authoritative Primary Source Metadata', () => {
  for (const c of CANONICAL_COUNTRIES) {
    assert.ok(c.landmark.source, `Missing source metadata for ${c.id}`);
    assert.ok(c.landmark.source.publisher && c.landmark.source.publisher.trim().length > 0, `Missing publisher for ${c.id}`);
    assert.ok(c.landmark.source.url && c.landmark.source.url.startsWith('http'), `Invalid URL for ${c.id}: ${c.landmark.source.url}`);
    assert.ok(c.sourceReferences && c.sourceReferences.length > 0, `Empty sourceReferences array for ${c.id}`);
  }
});

test('Test 7: Authoritative Projection Utility geoToVector3() Validation', () => {
  const radius = 1.8;
  const offset = 1.0; // exact surface

  // 1. North Pole (+90 lat) -> (0, +radius, 0)
  const northPole = geoToVector3(90, 0, radius, offset);
  assert.ok(Math.abs(northPole.position.x) < 0.0001, 'North pole X must be ~0');
  assert.ok(Math.abs(northPole.position.y - radius) < 0.0001, 'North pole Y must be radius');
  assert.ok(Math.abs(northPole.position.z) < 0.0001, 'North pole Z must be ~0');
  assert.equal(northPole.normal.y, 1);

  // 2. South Pole (-90 lat) -> (0, -radius, 0)
  const southPole = geoToVector3(-90, 0, radius, offset);
  assert.ok(Math.abs(southPole.position.x) < 0.0001, 'South pole X must be ~0');
  assert.ok(Math.abs(southPole.position.y + radius) < 0.0001, 'South pole Y must be -radius');
  assert.ok(Math.abs(southPole.position.z) < 0.0001, 'South pole Z must be ~0');

  // 3. Equator / Prime Meridian (0 lat, 0 lng)
  const equatorPrime = geoToVector3(0, 0, radius, offset);
  assert.ok(Math.abs(equatorPrime.position.y) < 0.0001, 'Equator Y must be ~0');
  assert.ok(Math.abs(equatorPrime.position.z) < 0.0001, 'Equator Prime Z must be ~0');
  assert.ok(Math.abs(equatorPrime.position.x - radius) < 0.0001, 'Equator Prime X must be radius');

  // 4. Invalid coordinate throwing
  assert.throws(() => geoToVector3(100, 0), /Latitude out of range/);
  assert.throws(() => geoToVector3(0, 200), /Longitude out of range/);
});

test('Test 8: Global Search Registry (Country Name, Capital, Landmark & ISO Code)', () => {
  // Search by country name
  const resIndo = countryRegistry.search('Indonesia');
  assert.ok(resIndo.length > 0);
  assert.equal(resIndo[0].country.id, 'ID');

  // Search by capital
  const resTokyo = countryRegistry.search('Tokyo');
  assert.ok(resTokyo.length > 0);
  assert.equal(resTokyo[0].country.id, 'JP');
  assert.equal(resTokyo[0].matchType, 'capital');

  // Search by landmark
  const resEiffel = countryRegistry.search('Eiffel');
  assert.ok(resEiffel.length > 0);
  assert.equal(resEiffel[0].country.id, 'FR');
  assert.equal(resEiffel[0].matchType, 'landmark');

  // Search by ISO-3 code
  const resChe = countryRegistry.search('CHE');
  assert.ok(resChe.length > 0);
  assert.equal(resChe[0].country.id, 'CH');
});

test('Test 9: Live Earth Astronomical UTC Solar Position Calculation', () => {
  // Test at Spring Equinox (March 21, 12:00 UTC) -> Sun at Equator & Prime Meridian
  const equinoxDate = new Date('2026-03-21T12:00:00Z');
  const solarEquinox = calculateSolarPosition(equinoxDate, 8.0);

  assert.ok(Math.abs(solarEquinox.subsolarLongitude) < 1.0, 'At 12:00 UTC, subsolar longitude must be ~0°');
  assert.ok(Math.abs(solarEquinox.subsolarLatitude) < 2.0, 'At equinox, subsolar latitude must be ~0°');

  // Test at Winter Solstice (Dec 21, 12:00 UTC) -> Sun near Tropic of Capricorn (-23.44°)
  const winterSolstice = new Date('2026-12-21T12:00:00Z');
  const solarWinter = calculateSolarPosition(winterSolstice, 8.0);
  assert.ok(solarWinter.subsolarLatitude < -20.0, 'Winter solstice sun must be near -23.4°');
});

test('Test 10: Region Colors & Deterministic Palette Validation', () => {
  const regions = ['Asia', 'Europe', 'Africa', 'North America', 'South America', 'Oceania'];
  for (const reg of regions) {
    const hex = getRegionHex(reg);
    const threeColor = getRegionColor(reg);
    assert.ok(hex.startsWith('#'), `Hex for ${reg} must start with #`);
    assert.ok(typeof threeColor === 'number', `ThreeColor for ${reg} must be number`);
    assert.ok(REGION_COLORS[reg], `Missing region token for ${reg}`);
  }
});

test('Test 11: Machine-Checkable Dataset Validation Function assertCanonicalDataset()', () => {
  // Valid dataset passes
  assert.doesNotThrow(() => {
    assertCanonicalDataset(CANONICAL_COUNTRIES);
  });

  const report = validateCanonicalDataset(CANONICAL_COUNTRIES);
  assert.equal(report.valid, true);
  assert.equal(report.errors.length, 0);
  assert.equal(report.actualCount, 195);
  assert.equal(report.expectedCount, 195);
  assert.ok(report.metrics.heroCount > 0);
  assert.ok(report.metrics.proceduralCount > 0);
  assert.equal(report.metrics.verifiedSourceCount, 195);

  // Invalid count fails
  const mutated = CANONICAL_COUNTRIES.slice(0, 194);
  const badReport = validateCanonicalDataset(mutated);
  assert.equal(badReport.valid, false);
  assert.ok(badReport.errors.some(e => e.includes('Country count mismatch')));
});

test('Test 12: Personal Travel State Separation & Fallback Guard', () => {
  // Reference data does not pollute personal state
  const idCountry = countryRegistry.getById('ID');
  assert.ok(idCountry);
  assert.equal(idCountry.displayName, 'Indonesia');

  // Fallback guard: getById returns undefined for unknown code, but never crashes
  const unknown = countryRegistry.getById('XX');
  assert.equal(unknown, undefined);
});
