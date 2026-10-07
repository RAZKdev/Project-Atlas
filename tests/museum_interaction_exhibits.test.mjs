import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';

import { buildMuseumExhibits } from '../src/features/museum/museumEngine/museumExhibits.ts';
import { PlayerEntity } from '../src/features/museum/museumEngine/playerEntity.ts';
import { AVATAR_SPECS } from '../src/features/museum/museumEngine/types.ts';
import { storageService } from '../src/core/services/storageService.ts';

test('Interaction & Exhibit Test 1: Canonical 6 Curated Exhibition Zones & Metadata Integrity', () => {
  const { exhibits } = buildMuseumExhibits();

  // Exactly 6 canonical exhibition zones
  assert.equal(exhibits.length, 6, 'Must contain exactly 6 curated exhibition zones');

  const expectedZoneIds = ['intro', 'globe', 'gallery', 'flags', 'souvenir', 'reading'];
  const actualZoneIds = exhibits.map((e) => e.id);
  assert.deepEqual(actualZoneIds.sort(), expectedZoneIds.sort(), 'Must match all 6 canonical zone IDs');

  for (const exhibit of exhibits) {
    assert.ok(exhibit.id, 'Exhibit must have an ID');
    assert.ok(exhibit.zoneId, 'Exhibit must have a zoneId');
    assert.ok(exhibit.title && exhibit.title.length > 5, `Exhibit ${exhibit.id} must have a rich title`);
    assert.ok(exhibit.subtitle && exhibit.subtitle.length > 5, `Exhibit ${exhibit.id} must have a subtitle`);
    assert.ok(exhibit.category, `Exhibit ${exhibit.id} must have a category`);
    assert.ok(exhibit.description && exhibit.description.length > 30, `Exhibit ${exhibit.id} must have a detailed description`);
    assert.ok(exhibit.story && exhibit.story.length > 30, `Exhibit ${exhibit.id} must have a curatorial story`);
    assert.ok(exhibit.curatorNotes && exhibit.curatorNotes.length > 20, `Exhibit ${exhibit.id} must have curator conservation notes`);
    assert.ok(Array.isArray(exhibit.specs) && exhibit.specs.length >= 3, `Exhibit ${exhibit.id} must have at least 3 curatorial specs`);
    assert.ok(Array.isArray(exhibit.position) && exhibit.position.length === 3, `Exhibit ${exhibit.id} must have 3D coordinates`);
    assert.ok(exhibit.interactRadius >= 1.5 && exhibit.interactRadius <= 2.5, `Exhibit ${exhibit.id} interactRadius must be human scale`);
    assert.ok(Array.isArray(exhibit.viewPosition) && exhibit.viewPosition.length === 3, `Exhibit ${exhibit.id} must have viewPosition`);
    assert.ok(Array.isArray(exhibit.viewTarget) && exhibit.viewTarget.length === 3, `Exhibit ${exhibit.id} must have viewTarget`);
    assert.ok(exhibit.icon, `Exhibit ${exhibit.id} must have an icon`);
    assert.ok(exhibit.tag, `Exhibit ${exhibit.id} must have a navigation tag`);
    assert.ok(exhibit.accentColor, `Exhibit ${exhibit.id} must have an accent color`);
  }
});

test('Interaction & Exhibit Test 2: Spatial Layout & Proportions Contract within 6x8m Pavilion', () => {
  const { exhibits, colliders } = buildMuseumExhibits();

  // Architectural Pavilion bounds: x in [-3.0, 3.0], z in [-4.0, 4.0]
  for (const exhibit of exhibits) {
    const [x, y, z] = exhibit.position;
    assert.ok(x >= -2.9 && x <= 2.9, `Exhibit ${exhibit.id} X (${x}) must be within interior footprint [-2.9, 2.9]`);
    assert.ok(z >= -3.9 && z <= 3.9, `Exhibit ${exhibit.id} Z (${z}) must be within interior footprint [-3.9, 3.9]`);
    assert.ok(y >= 0.50 && y <= 2.50, `Exhibit ${exhibit.id} Y (${y}) must be at realistic human viewing level`);
  }

  // Ensure colliders are properly registered for major exhibition structures
  assert.ok(colliders.length >= 5, 'Exhibits must provide collision boxes for physical pedestals and vitrines');
  for (const col of colliders) {
    assert.ok(col.min[0] <= col.max[0], 'Collider min.x must be <= max.x');
    assert.ok(col.min[1] <= col.max[1], 'Collider min.y must be <= max.y');
    assert.ok(col.min[2] <= col.max[2], 'Collider min.z must be <= max.z');
    assert.ok(col.name, 'Collider must have a descriptive identifier');
  }
});

test('Interaction & Exhibit Test 3: Floor Gaze / Proximity Inlay Halos & Animation Update Callback', () => {
  const { update } = buildMuseumExhibits();

  // Verify update callback exists and executes smoothly without error
  assert.equal(typeof update, 'function', 'Exhibits module must return an update function');

  // Tick with no focus
  assert.doesNotThrow(() => {
    update(0.016, null);
  }, 'update(dt, null) must execute safely');

  // Tick with focused exhibit 'globe'
  assert.doesNotThrow(() => {
    for (let i = 0; i < 10; i++) {
      update(0.016, 'globe');
    }
  }, 'update(dt, focusedId) must smoothly modulate halo opacity');

  // Tick with focused exhibit 'souvenir'
  assert.doesNotThrow(() => {
    for (let i = 0; i < 10; i++) {
      update(0.016, 'souvenir');
    }
  }, 'update(dt, focusedId) must smoothly switch focused target');
});

test('Interaction & Exhibit Test 4: Center-Screen Raycasting & Focus Determination Math', () => {
  const { exhibits } = buildMuseumExhibits();
  const player = new PlayerEntity(new THREE.Vector3(0, 0.50, 5.2), Math.PI);

  // Initial state outside museum: no exhibit should be focused
  player.update(0.016, { x: 0, z: 0 }, false, false, [], exhibits, 'third_person');
  assert.equal(player.focusedExhibit, null, 'Far away player must have focusedExhibit === null');

  // Teleport player directly in front of the Central Globe (viewPosition: [0, 1.60, 1.4]) facing Globe at [0, 1.40, 0]
  // Vector to globe is (0, -0.2, -1.4), yaw is 0
  player.teleport(0, 0.50, 1.4, 0, 0);
  player.update(0.016, { x: 0, z: 0 }, false, false, [], exhibits, 'third_person');

  assert.ok(player.focusedExhibit, 'Player standing in front of globe must focus on an exhibit');
  assert.equal(player.focusedExhibit?.id, 'globe', 'Focused exhibit must be the Central Globe');

  // Turn player 180 degrees away from the Globe
  player.yaw = Math.PI; // facing +Z towards south exit
  player.update(0.016, { x: 0, z: 0 }, false, false, [], exhibits, 'third_person');
  assert.equal(player.focusedExhibit, null, 'Looking away from exhibit must immediately clear focus');
});

test('Interaction & Exhibit Test 5: Fast-Travel & Teleport Orientation Target Alignment', () => {
  const { exhibits } = buildMuseumExhibits();

  for (const exhibit of exhibits) {
    const vp = exhibit.viewPosition;
    const vt = exhibit.viewTarget;
    assert.ok(vp && vt, `Exhibit ${exhibit.id} must define viewPosition and viewTarget`);

    const dx = vt[0] - vp[0];
    const dz = vt[2] - vp[2];
    const dist = Math.sqrt(dx * dx + dz * dz);

    assert.ok(dist >= 0.5 && dist <= 2.5, `Exhibit ${exhibit.id} camera view distance (${dist.toFixed(2)}m) must be comfortable`);

    // Target yaw points from viewPosition to viewTarget
    const targetYaw = Math.atan2(-dx, -dz);
    assert.ok(!Number.isNaN(targetYaw), `Exhibit ${exhibit.id} target yaw must be a valid number`);
  }
});

test('Interaction & Exhibit Test 6: Live Project Atlas Storage Data Integration Invariants', () => {
  // 1. Query live Atlas data (read-only verification)
  const stats = storageService.getStats();
  const memories = storageService.getMemories();
  const souvenirs = storageService.getSouvenirs();
  const countries = storageService.getCountries();

  assert.ok(typeof stats.totalCountriesVisited === 'number', 'Stats must provide totalCountriesVisited');
  assert.ok(typeof stats.totalCountriesDocumented === 'number', 'Stats must provide totalCountriesDocumented');
  assert.ok(typeof stats.totalMemories === 'number', 'Stats must provide totalMemories');
  assert.ok(typeof stats.totalPlaces === 'number', 'Stats must provide totalPlaces');
  assert.ok(typeof stats.totalPhotos === 'number', 'Stats must provide totalPhotos');
  assert.ok(typeof stats.totalSouvenirs === 'number', 'Stats must provide totalSouvenirs');

  assert.equal(countries.length, 195, 'Project Atlas must catalog exactly 195 sovereign countries');
  assert.ok(Array.isArray(memories), 'Memories must be an array');
  assert.ok(Array.isArray(souvenirs), 'Souvenirs must be an array');

  // 2. Invariant: Querying stats must NOT mutate or dirty the data
  const statsAfter = storageService.getStats();
  assert.deepEqual(stats, statsAfter, 'Querying stats must be completely idempotent and read-only');
});

test('Interaction & Exhibit Test 7: Multi-POV & Interaction Decoupling Invariants', () => {
  const { exhibits } = buildMuseumExhibits();
  const player = new PlayerEntity(new THREE.Vector3(0, 0.50, 1.4), 0);

  // Exhibit focus must be determined identically regardless of current camera POV
  player.update(0.016, { x: 0, z: 0 }, false, false, [], exhibits, 'first_person');
  const pov1Focus = player.focusedExhibit?.id;

  player.update(0.016, { x: 0, z: 0 }, false, false, [], exhibits, 'third_person');
  const pov2Focus = player.focusedExhibit?.id;

  player.update(0.016, { x: 0, z: 0 }, false, false, [], exhibits, 'cinematic');
  const pov3Focus = player.focusedExhibit?.id;

  assert.equal(pov1Focus, 'globe', 'POV 1 must focus on globe');
  assert.equal(pov2Focus, 'globe', 'POV 2 must focus on globe');
  assert.equal(pov3Focus, 'globe', 'POV 3 must focus on globe');
});
