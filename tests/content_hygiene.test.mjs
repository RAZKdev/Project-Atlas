import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { SEED_MEMORIES, INITIAL_UPDATED_COUNTRIES } from '../src/data/seedData.ts';
import { CANONICAL_COUNTRIES } from '../src/atlas/countries/canonicalCountries.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

test('Content Hygiene Test 1: Complete Absence of Unwanted "baliy zek" / Bailey Zindel Photo', () => {
  const landingPagePath = path.join(ROOT_DIR, 'src', 'features', 'landing', 'LandingPage.tsx');
  const landingContent = fs.readFileSync(landingPagePath, 'utf-8');

  // Verify the Bailey Zindel photo ID is absent
  assert.ok(
    !landingContent.includes('1506744038136'),
    'LandingPage must not contain the unwanted photo-1506744038136 photo reference'
  );

  // Verify no text mentions of Bailey Zindel
  assert.ok(
    !landingContent.toLowerCase().includes('bailey zindel'),
    'LandingPage must not contain Bailey Zindel attribution'
  );

  // Verify no text mentions of baliy zek
  assert.ok(
    !landingContent.toLowerCase().includes('baliy zek'),
    'LandingPage must not contain baliy zek string'
  );
});

test('Content Hygiene Test 2: Seed Memories Integrity & No Corrupt Records', () => {
  assert.ok(SEED_MEMORIES.length >= 3, 'Seed memories must contain at least 3 curated records');

  for (const mem of SEED_MEMORIES) {
    assert.ok(mem.id && mem.id.length > 0, `Memory ID must exist: ${mem.id}`);
    assert.ok(mem.title && mem.title.length > 0, `Memory title must not be empty: ${mem.id}`);
    assert.ok(mem.countryCode && mem.countryCode.length === 2, `Country code must be ISO Alpha-2: ${mem.countryCode}`);
    assert.ok(mem.dateStart && /^\d{4}-\d{2}-\d{2}$/.test(mem.dateStart), `dateStart must be YYYY-MM-DD: ${mem.dateStart}`);
    assert.ok(mem.coverImage, `Cover image must exist for curated memory: ${mem.id}`);
    assert.ok(mem.coverImage.uri && mem.coverImage.uri.length > 0, `Cover image uri must not be empty: ${mem.id}`);
    assert.ok(!mem.coverImage.uri.includes('1506744038136'), `Curated memories must not reference unwanted photo: ${mem.id}`);
  }
});

test('Content Hygiene Test 3: Public Static Assets Existence', () => {
  const earthTexture = path.join(ROOT_DIR, 'public', 'assets', 'earth-texture.jpg');
  assert.ok(fs.existsSync(earthTexture), 'Earth texture for 3D globe must exist in public/assets/');
  const stats = fs.statSync(earthTexture);
  assert.ok(stats.size > 100000, `Earth texture must be non-empty (got ${stats.size} bytes)`);

  const compassSvg = path.join(ROOT_DIR, 'public', 'compass.svg');
  assert.ok(fs.existsSync(compassSvg), 'Compass icon must exist in public/');
});

test('Content Hygiene Test 4: All 195 Canonical Countries Valid & Complete', () => {
  assert.equal(CANONICAL_COUNTRIES.length, 195, 'Canonical countries count must remain 195');

  for (const country of CANONICAL_COUNTRIES) {
    assert.ok(country.id && country.id.length === 2, `Country ISO-2 code required: ${country.id}`);
    assert.ok(country.isoAlpha3 && country.isoAlpha3.length === 3, `Country ISO-3 code required: ${country.isoAlpha3}`);
    assert.ok(country.displayName && country.displayName.length > 0, `Display name required: ${country.id}`);
    assert.ok(country.landmark, `Landmark required: ${country.id}`);
    assert.ok(country.landmark.name && country.landmark.name.length > 0, `Landmark name required: ${country.id}`);
  }
});
