/**
 * museum_environment_visual.test.mjs
 * Comprehensive Verification Suite for Phase 5: Museum 3D Visual & Environment Rebuild
 *
 * Verifies:
 * 1. World scale contract: 1 Three.js unit = 1 meter, player reference = 1.70m.
 * 2. Museum pavilion architectural reconstruction (footprint, pilasters, portico, roof, doors, windows).
 * 3. Landscaped garden layout (axial promenade, fountain plaza, loop paths, lawns, hedges, trees, benches, lanterns).
 * 4. Central fountain structure, water pool, jet animation hook, and basin colliders.
 * 5. PBR material system (MeshStandardMaterial, MeshPhysicalMaterial, roughness, metalness, transmission).
 * 6. Lighting rig hierarchy (hemisphere, directional sun with shadows, portico, lanterns, fountain glow, spotlights).
 * 7. Collision boundaries and walkability.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';

import { AVATAR_SPECS } from '../src/features/museum/museumEngine/types.ts';
import { buildMuseumArchitecture } from '../src/features/museum/museumEngine/museumArchitecture.ts';
import { buildMuseumLighting } from '../src/features/museum/museumEngine/museumLighting.ts';

// ── Test 1: World Scale Contract & Pavilion Canonical Proportions ───────────
test('Phase 5 Test 1: World Scale Contract & Canonical Proportions', () => {
  const arch = buildMuseumArchitecture();
  assert.ok(arch.group, 'Architecture group must be built');

  // Verify avatar scale contract
  assert.equal(AVATAR_SPECS.height, 1.70, 'Avatar canonical height is 1.70m');
  assert.equal(AVATAR_SPECS.eyeHeight, 1.60, 'First-person eye level is 1.60m');

  // Find foundation collider
  const northWall = arch.colliders.find((c) => c.name === 'north_wall');
  const southLeft = arch.colliders.find((c) => c.name === 'south_left_wall');
  const southRight = arch.colliders.find((c) => c.name === 'south_right_wall');
  const eastWall = arch.colliders.find((c) => c.name === 'east_wall');
  const westWall = arch.colliders.find((c) => c.name === 'west_wall');

  assert.ok(northWall, 'North wall collider must exist');
  assert.ok(southLeft && southRight, 'South wall doorway colliders must exist');
  assert.ok(eastWall && westWall, 'East and west wall colliders must exist');

  // Width between east (x ~ 3.0) and west (x ~ -3.0) is 6.00m
  const pavilionWidth = eastWall.max[0] - westWall.min[0];
  assert.ok(
    pavilionWidth >= 5.9 && pavilionWidth <= 6.3,
    `Pavilion exterior width must be 6.00m, got ${pavilionWidth}m`
  );

  // Length between south (z ~ 4.0) and north (z ~ -4.0) is 8.00m
  const pavilionLength = southLeft.max[2] - northWall.min[2];
  assert.ok(
    pavilionLength >= 7.9 && pavilionLength <= 8.3,
    `Pavilion exterior length must be 8.00m, got ${pavilionLength}m`
  );

  // Entrance doorway clear opening width: 1.80m between south left and south right
  const doorClearWidth = southRight.min[0] - southLeft.max[0];
  assert.ok(
    Math.abs(doorClearWidth - 1.80) < 0.05,
    `Door clear opening must be 1.80m, got ${doorClearWidth}m`
  );
});

// ── Test 2: Central Garden Fountain Architecture & Colliders ────────────────
test('Phase 5 Test 2: Central Garden Fountain Dimensions & Physical Bounds', () => {
  const arch = buildMuseumArchitecture();

  // Find fountain basin collider
  const fountainCollider = arch.colliders.find((c) => c.name === 'fountain_basin');
  assert.ok(fountainCollider, 'Fountain basin must have solid physical collision');

  // Center coordinate of fountain in garden
  const fountainCenterX = (fountainCollider.min[0] + fountainCollider.max[0]) / 2;
  const fountainCenterZ = (fountainCollider.min[2] + fountainCollider.max[2]) / 2;

  assert.equal(fountainCenterX, 0, 'Fountain must be centered on the main garden axis (x=0)');
  assert.ok(
    Math.abs(fountainCenterZ - 14.5) < 0.1,
    `Fountain must be located at z=14.5m along promenade, got ${fountainCenterZ}`
  );

  // Fountain radius
  const fountainDiameter = fountainCollider.max[0] - fountainCollider.min[0];
  assert.ok(
    fountainDiameter >= 4.5 && fountainDiameter <= 5.0,
    `Fountain outer basin diameter must be ~4.8m, got ${fountainDiameter}m`
  );

  // Verify animation update hook exists
  assert.equal(typeof arch.update, 'function', 'Architecture must export an update function for fountain animation');
  // Run update function tick
  arch.update(0.016, 1.25);
});

// ── Test 3: Garden Landscape Features, Circulation & Physical Assets ────────
test('Phase 5 Test 3: Garden Landscape Features and Collision Coverage', () => {
  const arch = buildMuseumArchitecture();

  // Verify diverse garden collider categories
  const hedgeColliders = arch.colliders.filter((c) => c.name === 'hedge');
  const treeColliders = arch.colliders.filter((c) => c.name?.includes('tree'));
  const benchColliders = arch.colliders.filter((c) => c.name === 'garden_bench');
  const lanternColliders = arch.colliders.filter((c) => c.name === 'garden_lantern');
  const perimeterColliders = arch.colliders.filter((c) => c.name === 'perimeter_wall');

  assert.ok(hedgeColliders.length >= 4, `Must have clipped hedges framing circulation, got ${hedgeColliders.length}`);
  assert.ok(treeColliders.length >= 8, `Must have ornamental trees across garden, got ${treeColliders.length}`);
  assert.ok(benchColliders.length >= 4, `Must have park benches for visitors, got ${benchColliders.length}`);
  assert.ok(lanternColliders.length >= 6, `Must have bronze lantern posts along paths, got ${lanternColliders.length}`);
  assert.ok(perimeterColliders.length >= 4, `Must have perimeter terrace walls, got ${perimeterColliders.length}`);

  // Total collision boxes ensuring no ghost-walking
  assert.ok(arch.colliders.length >= 30, `Total colliders must be >= 30 for rich environment, got ${arch.colliders.length}`);
});

// ── Test 4: PBR Material Library Quality & Properties ───────────────────────
test('Phase 5 Test 4: PBR Material System and Physical Properties', () => {
  const arch = buildMuseumArchitecture();

  // Traverse scene to audit materials
  let hasStandardMaterial = false;
  let hasPhysicalMaterial = false;
  let hasTransmissiveGlass = false;
  let hasTransmissiveWater = false;

  arch.group.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      const mat = obj.material;
      if (mat instanceof THREE.MeshStandardMaterial) {
        hasStandardMaterial = true;
      }
      if (mat instanceof THREE.MeshPhysicalMaterial) {
        hasPhysicalMaterial = true;
        if (mat.transmission > 0.5 && mat.roughness < 0.15) {
          if (mat.color.getHex() === 0xeaf5f9) {
            hasTransmissiveGlass = true;
          }
          if (mat.color.getHex() === 0x2cb5b5) {
            hasTransmissiveWater = true;
          }
        }
      }
    }
  });

  assert.ok(hasStandardMaterial, 'Must utilize MeshStandardMaterial for PBR surfaces');
  assert.ok(hasPhysicalMaterial, 'Must utilize MeshPhysicalMaterial for transmissive surfaces');
  assert.ok(hasTransmissiveGlass, 'Must have physical transmissive glass on doors/windows');
  assert.ok(hasTransmissiveWater, 'Must have physical transmissive water on fountain pool');
});

// ── Test 5: Environmental & Curatorial Lighting Rig Hierarchy ───────────────
test('Phase 5 Test 5: Lighting Rig Hierarchy, Shadow Bounds & Quality Scaling', () => {
  const lighting = buildMuseumLighting('high');
  assert.ok(lighting.group, 'Lighting group must be created');
  assert.ok(lighting.sunLight, 'Sun light must be created');

  // Verify Directional Sun Shadow Frustum
  const sc = lighting.sunLight.shadow.camera;
  assert.ok(sc.left <= -20 && sc.right >= 20, 'Shadow camera width must cover garden estate');
  assert.ok(sc.top >= 25 && sc.bottom <= -15, 'Shadow camera depth must cover garden and pavilion');
  assert.equal(lighting.sunLight.shadow.mapSize.width, 2048, 'High quality shadow map must be 2048');
  assert.ok(lighting.sunLight.shadow.normalBias > 0, 'normalBias must be set to prevent shadow acne');

  // Count lights in rig
  let pointLightCount = 0;
  let spotLightCount = 0;
  let hemiLightCount = 0;

  lighting.group.traverse((obj) => {
    if (obj instanceof THREE.PointLight) pointLightCount++;
    if (obj instanceof THREE.SpotLight) spotLightCount++;
    if (obj instanceof THREE.HemisphereLight) hemiLightCount++;
  });

  assert.ok(hemiLightCount >= 1, 'Must have hemisphere sky/ground ambient light');
  assert.ok(spotLightCount >= 1, 'Must have dedicated spotlight for central exhibit');
  assert.ok(pointLightCount >= 10, `Must have >= 10 localized lights (interior + portico + lanterns + fountain), got ${pointLightCount}`);

  // Quality scaling test
  lighting.setQuality('low');
  assert.equal(lighting.sunLight.castShadow, false, 'Shadows disabled on low tier');

  lighting.setQuality('medium');
  assert.equal(lighting.sunLight.castShadow, true, 'Shadows enabled on medium tier');
  assert.equal(lighting.sunLight.shadow.mapSize.width, 1024, 'Medium tier shadow map is 1024');

  lighting.setQuality('high');
  assert.equal(lighting.sunLight.shadow.mapSize.width, 2048, 'High tier shadow map is 2048');
});
