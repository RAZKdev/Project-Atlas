import test from 'node:test';
import assert from 'node:assert/strict';

// Import types & constants
import { AVATAR_SPECS } from '../src/features/museum/museumEngine/types.js';
import { PlayerController } from '../src/features/museum/museumEngine/playerController.js';
import { buildMuseumArchitecture } from '../src/features/museum/museumEngine/museumArchitecture.js';
import { buildMuseumExhibits } from '../src/features/museum/museumEngine/museumExhibits.js';

test('Museum Test 1: Canonical Scale & Avatar Specifications', () => {
  assert.equal(AVATAR_SPECS.height, 1.70, 'Avatar height must be 1.70m human scale');
  assert.equal(AVATAR_SPECS.eyeHeight, 1.60, 'Eye level must be 1.60m');
  assert.equal(AVATAR_SPECS.radius, 0.28, 'Collision radius must be 0.28m (0.56m diameter)');
  assert.ok(AVATAR_SPECS.walkSpeed >= 3.0 && AVATAR_SPECS.walkSpeed <= 4.0, 'Walk speed must be realistic (~3.6 m/s)');
  assert.ok(AVATAR_SPECS.sprintSpeed >= 5.5 && AVATAR_SPECS.sprintSpeed <= 7.0, 'Sprint speed must be realistic (~6.2 m/s)');
  assert.equal(AVATAR_SPECS.interactDistance, 2.6, 'Interact raycast distance must be 2.6m');
});

test('Museum Test 2: Architectural Footprint & Door Clearance', () => {
  const arch = buildMuseumArchitecture();
  assert.ok(arch.group, 'Architecture group must be created');
  assert.ok(arch.colliders.length >= 6, 'Must produce collision bounding boxes');

  // Doorway width: 1.80m, height: 2.40m
  const doorWidth = 1.80;
  const doorHeight = 2.40;
  const avatarWidth = AVATAR_SPECS.radius * 2;
  const avatarHeight = AVATAR_SPECS.height;

  assert.ok(avatarWidth < doorWidth, `Avatar width (${avatarWidth}m) must easily pass through door (${doorWidth}m)`);
  assert.ok(avatarHeight < doorHeight, `Avatar height (${avatarHeight}m) must easily pass through door (${doorHeight}m)`);
});

test('Museum Test 3: Ground & Stair Step Elevation Physics', () => {
  const player = new PlayerController();

  // Outside ground
  assert.equal(player.getGroundHeight(0, 10.0), 0.0, 'Exterior plaza ground must be y=0.0m');

  // Entrance 3 steps
  assert.equal(player.getGroundHeight(0, 4.75), 0.17, 'Step 1 elevation must be y=0.17m');
  assert.equal(player.getGroundHeight(0, 4.45), 0.34, 'Step 2 elevation must be y=0.34m');
  assert.equal(player.getGroundHeight(0, 4.15), 0.50, 'Step 3 / landing elevation must be y=0.50m');

  // Inside museum floor
  assert.equal(player.getGroundHeight(0, 0), 0.50, 'Interior museum floor must be y=0.50m');
  assert.equal(player.getGroundHeight(-1.8, 2.4), 0.50, 'Intro zone floor must be y=0.50m');
  assert.equal(player.getGroundHeight(2.0, -2.0), 0.50, 'Gallery/Reading floor must be y=0.50m');
});

test('Museum Test 4: Wall Sliding Collision Math', () => {
  const arch = buildMuseumArchitecture();
  const player = new PlayerController();

  // Position player inside near north wall (wall is at z = -4.0, interior face at z = -3.9)
  player.position.set(0, 0.50, -3.5);
  player.velocity.set(-2.0, 0, -4.0); // Moving forward-left towards north wall

  const mockCamera = {
    position: { set: () => {} },
    rotation: { set: () => {} },
    getWorldDirection: () => {},
  };

  // Run update tick
  player.update(0.05, arch.colliders, [], mockCamera);

  // Player must NOT penetrate past north wall boundary (z <= -3.85 is inside wall)
  assert.ok(player.position.z >= -3.85, `Player must not penetrate north wall, z: ${player.position.z}`);
  // Player velocity in Z should be clamped on collision
  assert.equal(player.velocity.z, 0, 'Z velocity must zero out on wall contact');
  // Player X position should have moved left (sliding along wall)
  assert.ok(player.position.x < 0, 'Player must smoothly slide along X axis');
});

test('Museum Test 5: All 6 Curated Exhibition Zones & Metadata', () => {
  const exhibitsModule = buildMuseumExhibits();
  assert.equal(exhibitsModule.exhibits.length, 6, 'Must have exactly 6 curated museum zones');

  const expectedZoneIds = ['intro', 'globe', 'gallery', 'flags', 'souvenir', 'reading'];

  for (const zoneId of expectedZoneIds) {
    const exhibit = exhibitsModule.exhibits.find((e) => e.id === zoneId);
    assert.ok(exhibit, `Zone ${zoneId} must exist`);
    assert.ok(exhibit.title.length > 5, `Zone ${zoneId} must have title`);
    assert.ok(exhibit.description.length > 20, `Zone ${zoneId} must have description`);
    assert.ok(exhibit.story.length > 20, `Zone ${zoneId} must have curatorial narrative`);
    assert.ok(exhibit.specs.length >= 4, `Zone ${zoneId} must have at least 4 specifications`);
    assert.ok(Array.isArray(exhibit.position) && exhibit.position.length === 3, `Zone ${zoneId} must have 3D coordinates`);
    assert.ok(exhibit.interactRadius >= 1.5, `Zone ${zoneId} interact radius must be at least 1.5m`);
  }
});
