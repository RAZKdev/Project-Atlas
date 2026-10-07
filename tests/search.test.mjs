import test from 'node:test';
import assert from 'node:assert/strict';
import { countryRegistry, normalizeSearchString, levenshteinDistance } from '../src/atlas/countries/countryRegistry.ts';

test('Search Suite - Normalization Utility', () => {
  assert.equal(normalizeSearchString('  New   Delhi  '), 'new delhi');
  assert.equal(normalizeSearchString('San José'), 'san jose');
  assert.equal(normalizeSearchString('Côte d\'Ivoire'), 'cote d ivoire');
  assert.equal(normalizeSearchString('Washington, D.C.'), 'washington d c');
  assert.equal(normalizeSearchString('Port-au-Prince'), 'port au prince');
  assert.equal(normalizeSearchString(''), '');
});

test('Search Suite - Levenshtein Distance Utility', () => {
  assert.equal(levenshteinDistance('indonesia', 'indonesia'), 0);
  assert.equal(levenshteinDistance('indonesia', 'indoneisa'), 2);
  assert.equal(levenshteinDistance('jakarta', 'jakrata'), 2);
  assert.equal(levenshteinDistance('tokyo', 'toky'), 1);
});

test('Search Test 1: One-Word Country Search', () => {
  const res = countryRegistry.search('Indonesia');
  assert.ok(res.length > 0, 'Should return results for Indonesia');
  assert.equal(res[0].country.id, 'ID');
  assert.equal(res[0].matchType, 'country');

  const resJapan = countryRegistry.search('Jepang');
  assert.ok(resJapan.length > 0);
  assert.equal(resJapan[0].country.id, 'JP');
});

test('Search Test 2: Multi-Word Country Search', () => {
  // Indonesian canonical name
  const resUAE = countryRegistry.search('Uni Emirat Arab');
  assert.ok(resUAE.length > 0);
  assert.equal(resUAE[0].country.id, 'AE');

  // English international alias
  const resUAEEn = countryRegistry.search('United Arab Emirates');
  assert.ok(resUAEEn.length > 0);
  assert.equal(resUAEEn[0].country.id, 'AE');

  const resKorea = countryRegistry.search('South Korea');
  assert.ok(resKorea.length > 0);
  assert.equal(resKorea[0].country.id, 'KR');

  const resPNG = countryRegistry.search('Papua New Guinea');
  assert.ok(resPNG.length > 0);
  assert.equal(resPNG[0].country.id, 'PG');

  const resSaudi = countryRegistry.search('Saudi Arabia');
  assert.ok(resSaudi.length > 0);
  assert.equal(resSaudi[0].country.id, 'SA');

  const resUSA = countryRegistry.search('United States');
  assert.ok(resUSA.length > 0);
  assert.equal(resUSA[0].country.id, 'US');
});

test('Search Test 3: One-Word Capital City Search', () => {
  const resJakarta = countryRegistry.search('Jakarta');
  assert.ok(resJakarta.length > 0);
  assert.equal(resJakarta[0].country.id, 'ID');
  assert.equal(resJakarta[0].matchType, 'capital');
  assert.equal(resJakarta[0].matchedText, 'Jakarta');

  const resTokyo = countryRegistry.search('Tokyo');
  assert.ok(resTokyo.length > 0);
  assert.equal(resTokyo[0].country.id, 'JP');
  assert.equal(resTokyo[0].matchType, 'capital');

  const resParis = countryRegistry.search('Paris');
  assert.ok(resParis.length > 0);
  assert.equal(resParis[0].country.id, 'FR');
  assert.equal(resParis[0].matchType, 'capital');
});

test('Search Test 4: Two-Word Capital City Search', () => {
  const resNewDelhi = countryRegistry.search('New Delhi');
  assert.ok(resNewDelhi.length > 0);
  assert.equal(resNewDelhi[0].country.id, 'IN');
  assert.equal(resNewDelhi[0].matchType, 'capital');
  assert.equal(resNewDelhi[0].country.capital, 'New Delhi');

  const resBuenosAires = countryRegistry.search('Buenos Aires');
  assert.ok(resBuenosAires.length > 0);
  assert.equal(resBuenosAires[0].country.id, 'AR');
  assert.equal(resBuenosAires[0].matchType, 'capital');
  assert.equal(resBuenosAires[0].country.capital, 'Buenos Aires');

  const resKL = countryRegistry.search('Kuala Lumpur');
  assert.ok(resKL.length > 0);
  assert.equal(resKL[0].country.id, 'MY');
  assert.equal(resKL[0].matchType, 'capital');
});

test('Search Test 5: Three-Word Capital City Search (Full Preservation)', () => {
  const resBrunei = countryRegistry.search('Bandar Seri Begawan');
  assert.ok(resBrunei.length > 0, 'Should find Brunei for full 3-word capital');
  assert.equal(resBrunei[0].country.id, 'BN');
  assert.equal(resBrunei[0].matchType, 'capital');
  assert.equal(resBrunei[0].country.capital, 'Bandar Seri Begawan');

  // Verify full query preservation with whitespace
  const resBruneiSpaces = countryRegistry.search('  Bandar   Seri   Begawan  ');
  assert.ok(resBruneiSpaces.length > 0);
  assert.equal(resBruneiSpaces[0].country.id, 'BN');
  assert.equal(resBruneiSpaces[0].matchType, 'capital');
});

test('Search Test 6: Diacritics and Unicode Normalization', () => {
  // With exact diacritic
  const resSanJoseWith = countryRegistry.search('San José');
  assert.ok(resSanJoseWith.length > 0);
  assert.equal(resSanJoseWith[0].country.id, 'CR');
  assert.equal(resSanJoseWith[0].matchType, 'capital');

  // Without diacritic (folded)
  const resSanJoseWithout = countryRegistry.search('San Jose');
  assert.ok(resSanJoseWithout.length > 0);
  assert.equal(resSanJoseWithout[0].country.id, 'CR');
  assert.equal(resSanJoseWithout[0].matchType, 'capital');

  // Ivory coast with diacritic
  const resCote = countryRegistry.search('Côte d\'Ivoire');
  assert.ok(resCote.length > 0);
  assert.equal(resCote[0].country.id, 'CI');

  const resCotePlain = countryRegistry.search('Cote d Ivoire');
  assert.ok(resCotePlain.length > 0);
  assert.equal(resCotePlain[0].country.id, 'CI');
});

test('Search Test 7: Case Insensitivity & Repeated Whitespace', () => {
  const res1 = countryRegistry.search('NEW DELHI');
  const res2 = countryRegistry.search('new delhi');
  const res3 = countryRegistry.search('   nEw    DeLhI   ');
  assert.equal(res1[0].country.id, 'IN');
  assert.equal(res2[0].country.id, 'IN');
  assert.equal(res3[0].country.id, 'IN');
});

test('Search Test 8: Punctuation & Hyphenated Queries', () => {
  // Washington, D.C.
  const resDC1 = countryRegistry.search('Washington, D.C.');
  assert.ok(resDC1.length > 0);
  assert.equal(resDC1[0].country.id, 'US');

  const resDC2 = countryRegistry.search('Washington DC');
  assert.ok(resDC2.length > 0);
  assert.equal(resDC2[0].country.id, 'US');

  // Port-au-Prince
  const resHaiti = countryRegistry.search('Port-au-Prince');
  assert.ok(resHaiti.length > 0);
  assert.equal(resHaiti[0].country.id, 'HT');
});

test('Search Test 9: Prefix & Partial Matches', () => {
  const resIndon = countryRegistry.search('Indon');
  assert.ok(resIndon.length > 0);
  assert.equal(resIndon[0].country.id, 'ID');

  const resBandar = countryRegistry.search('Bandar');
  assert.ok(resBandar.length > 0);
  assert.equal(resBandar[0].country.id, 'BN');
  assert.equal(resBandar[0].matchType, 'capital');

  const resBue = countryRegistry.search('Bue');
  assert.ok(resBue.length > 0);
  assert.equal(resBue[0].country.id, 'AR');
  assert.equal(resBue[0].matchType, 'capital');
});

test('Search Test 10: Typo / Fuzzy Fallback Matching', () => {
  // Transposed letters "Indoneisa" -> Indonesia
  const resTypoIndo = countryRegistry.search('Indoneisa');
  assert.ok(resTypoIndo.length > 0, 'Fuzzy should match Indoneisa to Indonesia');
  assert.equal(resTypoIndo[0].country.id, 'ID');

  // Typo "Jakrata" -> Jakarta
  const resTypoJakarta = countryRegistry.search('Jakrata');
  assert.ok(resTypoJakarta.length > 0);
  assert.equal(resTypoJakarta[0].country.id, 'ID');

  // Typo "Buenos Aries" -> Buenos Aires
  const resTypoBA = countryRegistry.search('Buenos Aries');
  assert.ok(resTypoBA.length > 0);
  assert.equal(resTypoBA[0].country.id, 'AR');
});

test('Search Test 11: ISO Alpha-2 and Alpha-3 Exact Codes', () => {
  const resID = countryRegistry.search('ID');
  assert.equal(resID[0].country.id, 'ID');
  assert.equal(resID[0].matchType, 'code');

  const resCHE = countryRegistry.search('CHE');
  assert.equal(resCHE[0].country.id, 'CH');
  assert.equal(resCHE[0].matchType, 'code');

  const resUSA = countryRegistry.search('USA');
  assert.equal(resUSA[0].country.id, 'US');
  assert.equal(resUSA[0].matchType, 'code');
});

test('Search Test 12: Empty & Non-Existent Queries', () => {
  assert.deepEqual(countryRegistry.search(''), []);
  assert.deepEqual(countryRegistry.search('   '), []);
  assert.deepEqual(countryRegistry.search('xyz999nonexistentplace123'), []);
});

test('Search Test 13: Deterministic Relevance Hierarchy (Exact > Partial > Fuzzy)', () => {
  // Exact code 'ID' outranks any partial match containing 'id'
  const resID = countryRegistry.search('ID', 5);
  assert.equal(resID[0].country.id, 'ID');
  assert.equal(resID[0].score, 1000);

  // Exact capital 'Jakarta' has higher score than a partial substring
  const resJak = countryRegistry.search('Jakarta', 5);
  assert.equal(resJak[0].country.id, 'ID');
  assert.ok(resJak[0].score >= 900);
});
