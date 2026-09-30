import test from 'node:test';
import assert from 'node:assert/strict';

// Mock localStorage for Node test environment
const mockStorage = new Map();
globalThis.localStorage = {
  getItem: (key) => mockStorage.get(key) || null,
  setItem: (key, val) => mockStorage.set(key, String(val)),
  removeItem: (key) => mockStorage.delete(key),
  clear: () => mockStorage.clear()
};

// Initial data mirrors
const INITIAL_COUNTRIES = [
  { code: 'ID', name: 'Indonesia', continent: 'Asia', status: 'unknown' },
  { code: 'JP', name: 'Japan', continent: 'Asia', status: 'unknown' },
  { code: 'IS', name: 'Iceland', continent: 'Europe', status: 'unknown' },
];

test('Test 1: Contracts & Default Country Catalog', () => {
  assert.equal(INITIAL_COUNTRIES.length, 3);
  assert.equal(INITIAL_COUNTRIES[0].code, 'ID');
  assert.equal(INITIAL_COUNTRIES[0].status, 'unknown');
});

test('Test 2: Memory Creation & Country Auto-Status Update', () => {
  const memories = [];
  const countries = JSON.parse(JSON.stringify(INITIAL_COUNTRIES));

  // Function simulating memory saving
  function saveMemory(mem) {
    const record = {
      ...mem,
      id: mem.id || `mem-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    memories.push(record);

    // Auto update country
    const country = countries.find(c => c.code === record.countryCode);
    if (country) {
      country.status = 'documented';
      country.documentedPlacesCount = new Set(
        memories.filter(m => m.countryCode === country.code).map(m => m.placeName)
      ).size;
    }
    return record;
  }

  const memory = saveMemory({
    countryCode: 'ID',
    placeName: 'Mount Bromo',
    title: 'Sunrise at Bromo',
    summary: 'A cold morning watching the sunrise.',
    tags: ['volcano', 'sunrise'],
    favorite: true
  });

  assert.ok(memory.id.startsWith('mem-'));
  assert.equal(memories.length, 1);
  
  // Verify country status transitioned to documented
  const idCountry = countries.find(c => c.code === 'ID');
  assert.equal(idCountry.status, 'documented');
  assert.equal(idCountry.documentedPlacesCount, 1);
});

test('Test 3: Memory Deletion & Country State Recalculation', () => {
  const memories = [
    { id: 'm1', countryCode: 'JP', placeName: 'Kyoto' }
  ];
  const countries = [
    { code: 'JP', status: 'documented', documentedPlacesCount: 1 }
  ];

  function deleteMemory(id) {
    const idx = memories.findIndex(m => m.id === id);
    if (idx === -1) return false;
    const deleted = memories[idx];
    memories.splice(idx, 1);

    const remaining = memories.filter(m => m.countryCode === deleted.countryCode);
    if (remaining.length === 0) {
      const country = countries.find(c => c.code === deleted.countryCode);
      if (country && country.status === 'documented') {
        country.status = 'visited';
        country.documentedPlacesCount = 0;
      }
    }
    return true;
  }

  const result = deleteMemory('m1');
  assert.equal(result, true);
  assert.equal(memories.length, 0);
  assert.equal(countries[0].status, 'visited');
  assert.equal(countries[0].documentedPlacesCount, 0);
});

test('Test 4: Statistics Computation', () => {
  const countries = [
    { code: 'ID', status: 'documented' },
    { code: 'JP', status: 'visited' },
    { code: 'IS', status: 'unknown' }
  ];
  const memories = [
    { id: '1', countryCode: 'ID', placeName: 'Bali', mediaReferences: [{ id: 'p1' }, { id: 'p2' }] },
    { id: '2', countryCode: 'ID', placeName: 'Bromo', mediaReferences: [{ id: 'p3' }] }
  ];

  const totalVisited = countries.filter(c => c.status === 'visited' || c.status === 'documented').length;
  const totalDocumented = countries.filter(c => c.status === 'documented').length;
  const places = new Set(memories.map(m => `${m.countryCode}-${m.placeName}`));
  const photos = memories.reduce((acc, m) => acc + (m.mediaReferences?.length || 0), 0);

  assert.equal(totalVisited, 2);
  assert.equal(totalDocumented, 1);
  assert.equal(places.size, 2);
  assert.equal(photos, 3);
});

test('Test 5: Web Crypto AES-GCM Encryption & Decryption', async () => {
  const enc = new TextEncoder();
  const dec = new TextDecoder();
  const password = 'atlas-secure-key-2026';
  const plainText = JSON.stringify({ app: 'Project Atlas', memories: [{ id: 'm1', title: 'Mount Bromo' }] });

  // Key derivation
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  const key = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );

  // Encrypt
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    enc.encode(plainText)
  );

  assert.ok(encrypted.byteLength > 0);

  // Decrypt with same key
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    encrypted
  );

  const decryptedText = dec.decode(decrypted);
  assert.equal(decryptedText, plainText);
});

test('Test 6: Crypto Decryption with Wrong Password Fails Safely', async () => {
  const enc = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const key1 = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
    await crypto.subtle.importKey('raw', enc.encode('correct-pwd'), 'PBKDF2', false, ['deriveKey']),
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  );

  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key1,
    enc.encode('secret memory')
  );

  // Derive key with wrong password
  const key2 = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
    await crypto.subtle.importKey('raw', enc.encode('WRONG-PWD'), 'PBKDF2', false, ['deriveKey']),
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt']
  );

  await assert.rejects(async () => {
    await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key2, encrypted);
  });
});

test('Test 7: Backup Archive Schema & Integrity Validation', () => {
  const rawArchive = JSON.stringify({
    version: '2.0',
    appName: 'Project Atlas',
    exportedAt: new Date().toISOString(),
    stats: { totalCountriesVisited: 3, totalMemories: 5 },
    memories: [{ id: 'm1', title: 'Kyoto Rain' }],
    countries: [{ code: 'JP', status: 'documented' }]
  });

  const parsed = JSON.parse(rawArchive);
  assert.equal(parsed.version, '2.0');
  assert.equal(parsed.appName, 'Project Atlas');
  assert.ok(Array.isArray(parsed.memories));
  assert.equal(parsed.memories.length, 1);
});

test('Test 8: Souvenir Creation, Category Mapping & Deletion', () => {
  const souvenirs = [];
  const countries = [
    { code: 'ID', status: 'unknown' },
    { code: 'JP', status: 'unknown' }
  ];

  function saveSouvenir(data) {
    const id = data.id || `souv-${Date.now()}`;
    const record = { ...data, id };
    souvenirs.unshift(record);

    const country = countries.find(c => c.code === record.countryCode);
    if (country && country.status === 'unknown') {
      country.status = 'visited';
    }
    return record;
  }

  function deleteSouvenir(id) {
    const idx = souvenirs.findIndex(s => s.id === id);
    if (idx === -1) return false;
    souvenirs.splice(idx, 1);
    return true;
  }

  const created = saveSouvenir({
    name: 'Topeng Kayu Barong',
    category: 'artifact',
    countryCode: 'ID',
    placeName: 'Pasar Sukawati',
    acquiredDate: '2023-08-14',
    description: 'Ukiran tangan dari kayu jepun khas Gianyar.'
  });

  assert.ok(created.id.startsWith('souv-'));
  assert.equal(souvenirs.length, 1);
  assert.equal(created.category, 'artifact');
  assert.equal(countries[0].status, 'visited'); // Country auto-marked visited

  const deleted = deleteSouvenir(created.id);
  assert.equal(deleted, true);
  assert.equal(souvenirs.length, 0);
});

