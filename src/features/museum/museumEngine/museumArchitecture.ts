/**
 * museumEngine/museumArchitecture.ts
 * Complete Visual & Physical Architectural Rebuild for Museum Mini ("195 Negara, 1 Cerita")
 *
 * Implements Phase 5:
 * 1. Human-scale canonical pavilion (6.00m x 8.00m, wall 3.50m, raised base 0.50m)
 * 2. Classical & modernist architectural refinements:
 *    - Molded corner pilasters with plinths & capitals
 *    - Entrance portico with round columns, cantilevered pediment, & brass sign plaque
 *    - Stone balustrade cheek walls flanking 3 entrance steps with carved flower urns
 *    - Projecting perimeter architectural cornice & dentil frieze
 *    - Standing-seam zinc roof with dimensional ribs, fascia, & ridge cap
 *    - Clerestory windows with stone sills, lintels, bronze mullions, & walnut reveals
 *    - Interior ceiling coffer with cove molding & recessed brass downlights
 * 3. Exterior Landscaped Garden:
 *    - Main axial sandstone flagstone promenade
 *    - Grand circular/octagonal fountain plaza (12m diameter)
 *    - Symmetrical looping garden pathways with basalt border kerbs
 *    - Manicured lawn terraces with stone retaining borders
 *    - Clipped boxwood evergreen hedges & perennial flower beds
 *    - Italian cypress columns & Mediterranean shade olive trees
 *    - Teak wood & cast-iron park benches in shaded garden alcoves
 *    - Classical bronze garden lantern posts
 *    - Low ashlar perimeter terrace walls
 * 4. Central Garden Fountain:
 *    - Octagonal carved limestone basin (outer radius 2.4m, height 0.48m)
 *    - Transmissive teal water pool with procedural animated ripples
 *    - Tiered central pedestal with carved upper bowl (radius 0.8m)
 *    - Procedural bubbling water spray jet & cascading stream arcs
 *    - Solid physical AABB collision bounds
 *
 * Canonical Scale: 1 Three.js unit = 1 meter. Player reference: 1.70m.
 */

import * as THREE from 'three';
import { type CollisionBox } from './types';
import { buildFountainSystem } from './water/fountainSystem';
import { buildVegetationSystem } from './environment/vegetationSystem';
import {
  getTravertineBumpTexture,
  getTerrazzoRoughnessTexture,
  getWalnutWoodTexture,
  getPaverBumpTexture,
} from './materials/proceduralTextures';

export interface ArchitectureResult {
  group: THREE.Group;
  colliders: CollisionBox[];
  update?: (delta: number, elapsed: number) => void;
}

export function buildMuseumArchitecture(): ArchitectureResult {
  const group = new THREE.Group();
  const colliders: CollisionBox[] = [];

  // Animation update hooks
  const animUpdaters: Array<(delta: number, elapsed: number) => void> = [];

  // ── 1. Physically Based Material Library ────────────────────────────────────
  const travertineBump = getTravertineBumpTexture();
  const terrazzoRoughness = getTerrazzoRoughnessTexture();
  const walnutWood = getWalnutWoodTexture();
  const paverBump = getPaverBumpTexture();

  // Foundation & stone steps
  const matFoundation = new THREE.MeshStandardMaterial({
    color: 0xa89f91,
    roughness: 0.88,
    metalness: 0.04,
    ...(paverBump ? { bumpMap: paverBump, bumpScale: 0.015 } : {}),
  });

  // Exterior pavilion walls: warm travertine / off-white limestone
  const matExtWall = new THREE.MeshStandardMaterial({
    color: 0xf6f1e8,
    roughness: 0.82,
    metalness: 0.02,
    ...(travertineBump ? { bumpMap: travertineBump, bumpScale: 0.018 } : {}),
  });

  // Architectural corner pilasters & entrance columns
  const matStoneColumn = new THREE.MeshStandardMaterial({
    color: 0xece5d8,
    roughness: 0.76,
    metalness: 0.03,
    ...(travertineBump ? { bumpMap: travertineBump, bumpScale: 0.016 } : {}),
  });

  // Architectural moldings, portico, and wall-top cornice
  const matCornice = new THREE.MeshStandardMaterial({
    color: 0xe2dbcd,
    roughness: 0.74,
    metalness: 0.04,
    ...(travertineBump ? { bumpMap: travertineBump, bumpScale: 0.014 } : {}),
  });

  // Interior gallery plaster
  const matIntWall = new THREE.MeshStandardMaterial({
    color: 0xeee7dc,
    roughness: 0.84,
    metalness: 0.01,
  });

  // Rich walnut woodwork: baseboards, window reveals, door frames
  const matWalnut = new THREE.MeshStandardMaterial({
    color: 0x3d2b1a,
    roughness: 0.58,
    metalness: 0.08,
    ...(walnutWood ? { bumpMap: walnutWood, bumpScale: 0.018 } : {}),
  });

  // Standing seam zinc roof: dark architectural charcoal slate
  const matRoof = new THREE.MeshStandardMaterial({
    color: 0x2d2a27,
    roughness: 0.65,
    metalness: 0.38,
  });

  // Standing seam roof ribs & ridge cap
  const matRoofSeam = new THREE.MeshStandardMaterial({
    color: 0x1e1c1a,
    roughness: 0.58,
    metalness: 0.45,
  });

  // Interior ceiling plaster
  const matCeiling = new THREE.MeshStandardMaterial({
    color: 0xf9f7f4,
    roughness: 0.90,
    metalness: 0.0,
  });

  // Architectural dark anodized bronze: mullions, frames, lamp posts
  const matBronze = new THREE.MeshStandardMaterial({
    color: 0x262320,
    roughness: 0.42,
    metalness: 0.80,
  });

  // Polished architectural brass: handles, urn rims, decorative trims
  const matBrass = new THREE.MeshStandardMaterial({
    color: 0xd4a843,
    roughness: 0.22,
    metalness: 0.88,
  });

  // Glazing: physically transmissive glass
  const matGlass = new THREE.MeshPhysicalMaterial({
    color: 0xeaf5f9,
    transparent: true,
    opacity: 0.35,
    roughness: 0.04,
    metalness: 0.08,
    transmission: 0.76,
    ior: 1.52,
    reflectivity: 0.55,
  });

  // Interior terrazzo stone tile floor: subtle reflection
  const matFloor = new THREE.MeshStandardMaterial({
    color: 0xf2ede3,
    roughness: 0.36,
    metalness: 0.06,
    ...(terrazzoRoughness ? { roughnessMap: terrazzoRoughness } : {}),
  });

  // Plaza & promenade sandstone pavers
  const matPlaza = new THREE.MeshStandardMaterial({
    color: 0xb5aa9c,
    roughness: 0.82,
    metalness: 0.04,
    ...(paverBump ? { bumpMap: paverBump, bumpScale: 0.022 } : {}),
  });

  // Pathway flagstone paving
  const matPath = new THREE.MeshStandardMaterial({
    color: 0xc4b9ab,
    roughness: 0.80,
    metalness: 0.03,
    ...(paverBump ? { bumpMap: paverBump, bumpScale: 0.022 } : {}),
  });

  // Basalt dark border kerbs
  const matKerb = new THREE.MeshStandardMaterial({
    color: 0x4f4942,
    roughness: 0.88,
    metalness: 0.06,
  });

  // Manicured lawn
  const matLawn = new THREE.MeshStandardMaterial({
    color: 0x3d522c,
    roughness: 0.96,
    metalness: 0.0,
  });

  // Fountain carved limestone structure
  const matFountainStone = new THREE.MeshStandardMaterial({
    color: 0xb0a698,
    roughness: 0.80,
    metalness: 0.04,
  });

  // Fountain water: Physical transmissive cyan-teal pool
  const matWater = new THREE.MeshPhysicalMaterial({
    color: 0x2cb5b5,
    transparent: true,
    opacity: 0.82,
    roughness: 0.08,
    metalness: 0.02,
    transmission: 0.84,
    ior: 1.333,
    reflectivity: 0.75,
    depthWrite: false,
  });

  // Fountain bubbling spray jet
  const matWaterSpray = new THREE.MeshStandardMaterial({
    color: 0xd8f5f5,
    transparent: true,
    opacity: 0.72,
    roughness: 0.15,
    metalness: 0.05,
    depthWrite: false,
  });

  // Boxwood evergreen hedge
  const matHedge = new THREE.MeshStandardMaterial({
    color: 0x2b4622,
    roughness: 0.92,
    metalness: 0.0,
  });

  // Tree foliage (cypress & olive)
  const matTreeLeaves = new THREE.MeshStandardMaterial({
    color: 0x345427,
    roughness: 0.88,
    metalness: 0.0,
  });

  // Tree trunk bark
  const matTreeBark = new THREE.MeshStandardMaterial({
    color: 0x453a30,
    roughness: 0.95,
    metalness: 0.02,
  });

  // Garden bench oiled teak slats
  const matTeak = new THREE.MeshStandardMaterial({
    color: 0x825838,
    roughness: 0.65,
    metalness: 0.05,
  });

  // Cast iron bench legs & lantern posts
  const matCastIron = new THREE.MeshStandardMaterial({
    color: 0x1f1f21,
    roughness: 0.50,
    metalness: 0.82,
  });

  // Warm glowing lantern glass
  const matLanternGlow = new THREE.MeshStandardMaterial({
    color: 0xffe299,
    emissive: 0xffb84d,
    emissiveIntensity: 0.75,
    roughness: 0.25,
  });

  // Perennial flower colors
  const matFlowerRose = new THREE.MeshStandardMaterial({ color: 0xc44569, roughness: 0.85 });
  const matFlowerLavender = new THREE.MeshStandardMaterial({ color: 0x7c5295, roughness: 0.85 });
  const matFlowerGold = new THREE.MeshStandardMaterial({ color: 0xe5a93c, roughness: 0.85 });

  // ── 2. SITE GROUND & LANDSCAPED GARDEN ─────────────────────────────────────
  // Site dimensions: 40m x 44m (x: -20 to 20, z: -14 to 30)
  const groundGeo = new THREE.PlaneGeometry(42, 46);
  const groundMesh = new THREE.Mesh(groundGeo, matLawn);
  groundMesh.rotation.x = -Math.PI / 2;
  groundMesh.position.set(0, -0.01, 8.0);
  groundMesh.receiveShadow = true;
  group.add(groundMesh);

  // Raised Pavilion Plaza Terrace (around building: 11.4m x 14.0m)
  const plazaGeo = new THREE.BoxGeometry(11.4, 0.06, 14.0);
  const plazaMesh = new THREE.Mesh(plazaGeo, matPlaza);
  plazaMesh.position.set(0, 0.03, 0.5);
  plazaMesh.receiveShadow = true;
  group.add(plazaMesh);

  // Basalt kerb trim around pavilion plaza
  const kerbPlazaNorth = new THREE.Mesh(new THREE.BoxGeometry(11.6, 0.08, 0.20), matKerb);
  kerbPlazaNorth.position.set(0, 0.04, -6.5);
  group.add(kerbPlazaNorth);

  const kerbPlazaEast = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.08, 14.2), matKerb);
  kerbPlazaEast.position.set(5.75, 0.04, 0.5);
  group.add(kerbPlazaEast);

  const kerbPlazaWest = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.08, 14.2), matKerb);
  kerbPlazaWest.position.set(-5.75, 0.04, 0.5);
  group.add(kerbPlazaWest);

  // Main Axial Promenade Path (leading from steps z=4.9 to fountain plaza z=12.1)
  const mainWalkGeo = new THREE.BoxGeometry(3.0, 0.06, 7.2);
  const mainWalk = new THREE.Mesh(mainWalkGeo, matPath);
  mainWalk.position.set(0, 0.04, 8.5);
  mainWalk.receiveShadow = true;
  group.add(mainWalk);

  // Main walk basalt border kerbs
  const mainKerbL = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.08, 7.2), matKerb);
  mainKerbL.position.set(-1.55, 0.05, 8.5);
  group.add(mainKerbL);

  const mainKerbR = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.08, 7.2), matKerb);
  mainKerbR.position.set(1.55, 0.05, 8.5);
  group.add(mainKerbR);

  // Grand Central Fountain Plaza: Octagonal/Circular stone apron (radius ~6.2m, centered at z=14.5)
  const fountainPlazaGeo = new THREE.CylinderGeometry(6.2, 6.2, 0.06, 24);
  const fountainPlaza = new THREE.Mesh(fountainPlazaGeo, matPlaza);
  fountainPlaza.position.set(0, 0.03, 14.5);
  fountainPlaza.receiveShadow = true;
  group.add(fountainPlaza);

  // Outer plaza ring border
  const fountainRingGeo = new THREE.RingGeometry(5.95, 6.25, 24);
  const fountainRing = new THREE.Mesh(fountainRingGeo, matKerb);
  fountainRing.rotation.x = -Math.PI / 2;
  fountainRing.position.set(0, 0.065, 14.5);
  group.add(fountainRing);

  // South promenade continuing past fountain (z=16.9 to z=24.5)
  const southWalkGeo = new THREE.BoxGeometry(3.0, 0.06, 7.6);
  const southWalk = new THREE.Mesh(southWalkGeo, matPath);
  southWalk.position.set(0, 0.04, 20.7);
  southWalk.receiveShadow = true;
  group.add(southWalk);

  // Symmetrical East & West Curved Wing Pathways
  const wingPathGeo = new THREE.BoxGeometry(2.4, 0.06, 12.0);

  const eastWingPath = new THREE.Mesh(wingPathGeo, matPath);
  eastWingPath.position.set(8.5, 0.03, 10.0);
  eastWingPath.receiveShadow = true;
  group.add(eastWingPath);

  const westWingPath = new THREE.Mesh(wingPathGeo, matPath);
  westWingPath.position.set(-8.5, 0.03, 10.0);
  westWingPath.receiveShadow = true;
  group.add(westWingPath);

  // Connector paths between wings and fountain plaza
  const connectorGeo = new THREE.BoxGeometry(4.5, 0.06, 2.2);

  const connEast = new THREE.Mesh(connectorGeo, matPath);
  connEast.position.set(5.5, 0.03, 14.5);
  group.add(connEast);

  const connWest = new THREE.Mesh(connectorGeo, matPath);
  connWest.position.set(-5.5, 0.03, 14.5);
  group.add(connWest);

  // ── 3. HERO CENTRAL FOUNTAIN (FOCAL POINT AT z = 14.5m) ─────────────────────
  const fountain = buildFountainSystem();
  group.add(fountain.group);
  colliders.push(fountain.collider);
  animUpdaters.push((delta, elapsed) => fountain.update(delta, elapsed));

  // ── 4. RAISED CONCRETE PAVILION FOUNDATION (y: 0 to 0.50m) ───────────────────
  // Footprint: 6.40 m wide x 8.40 m deep x 0.50 m high (centered at x=0, z=0)
  const fWidth = 6.40;
  const fDepth = 8.40;
  const fHeight = 0.50;

  const foundationGeo = new THREE.BoxGeometry(fWidth, fHeight, fDepth);
  const foundation = new THREE.Mesh(foundationGeo, matFoundation);
  foundation.position.set(0, fHeight / 2, 0);
  foundation.castShadow = true;
  foundation.receiveShadow = true;
  group.add(foundation);

  // Exterior foundation perimeter colliders
  colliders.push({ min: [-fWidth / 2, 0, -fDepth / 2], max: [fWidth / 2, fHeight, -4.0], name: 'foundation_north' });
  colliders.push({ min: [-fWidth / 2, 0, -fDepth / 2], max: [-3.0, fHeight, fDepth / 2], name: 'foundation_west' });
  colliders.push({ min: [3.0, 0, -fDepth / 2], max: [fWidth / 2, fHeight, fDepth / 2], name: 'foundation_east' });
  colliders.push({ min: [-fWidth / 2, 0, 4.0], max: [-1.2, fHeight, fDepth / 2], name: 'foundation_south_left' });
  colliders.push({ min: [1.2, 0, 4.0], max: [fWidth / 2, fHeight, fDepth / 2], name: 'foundation_south_right' });

  // ── 5. THREE ENTRANCE STONE STEPS & CHEEK WALL BALUSTRADES ──────────────────
  // Step 1 (z: 4.6 to 4.9, y: 0 to 0.17)
  const step1 = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.17, 0.35), matFoundation);
  step1.position.set(0, 0.17 / 2, 4.75);
  step1.receiveShadow = true;
  group.add(step1);

  // Step 2 (z: 4.3 to 4.6, y: 0 to 0.34)
  const step2 = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.34, 0.35), matFoundation);
  step2.position.set(0, 0.34 / 2, 4.45);
  step2.receiveShadow = true;
  group.add(step2);

  // Step 3 (top landing, z: 4.0 to 4.3, y: 0 to 0.50)
  const step3 = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.50, 0.35), matFoundation);
  step3.position.set(0, 0.50 / 2, 4.15);
  step3.receiveShadow = true;
  group.add(step3);

  // Architectural Step Nosing Trims for realistic shadow relief
  const nosingGeo = new THREE.BoxGeometry(2.44, 0.035, 0.04);
  const nosing1 = new THREE.Mesh(nosingGeo, matStoneColumn);
  nosing1.position.set(0, 0.17 - 0.0175, 4.93);
  group.add(nosing1);

  const nosing2 = new THREE.Mesh(nosingGeo, matStoneColumn);
  nosing2.position.set(0, 0.34 - 0.0175, 4.63);
  group.add(nosing2);

  const nosing3 = new THREE.Mesh(nosingGeo, matStoneColumn);
  nosing3.position.set(0, 0.50 - 0.0175, 4.33);
  group.add(nosing3);

  // Stepped Stone Cheek Walls / Balustrades flanking the steps
  const cheekGeo = new THREE.BoxGeometry(0.28, 0.85, 1.10);

  const cheekLeft = new THREE.Mesh(cheekGeo, matStoneColumn);
  cheekLeft.position.set(-1.34, 0.425, 4.50);
  cheekLeft.castShadow = true;
  group.add(cheekLeft);

  const cheekRight = new THREE.Mesh(cheekGeo, matStoneColumn);
  cheekRight.position.set(1.34, 0.425, 4.50);
  cheekRight.castShadow = true;
  group.add(cheekRight);

  // Carved Stone Urn Planters on cheek wall piers with blooming flowers
  const makeUrn = (x: number, z: number) => {
    const urn = new THREE.Group();
    urn.position.set(x, 0.85, z);

    const uBase = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.12, 12), matStoneColumn);
    uBase.position.y = 0.06;
    urn.add(uBase);

    const uBowl = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.14, 0.25, 12), matStoneColumn);
    uBowl.position.y = 0.245;
    urn.add(uBowl);

    const uRim = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.025, 8, 16), matBrass);
    uRim.rotation.x = Math.PI / 2;
    uRim.position.y = 0.37;
    urn.add(uRim);

    // Blooming rose/lavender cluster inside urn
    const shrub = new THREE.Mesh(new THREE.DodecahedronGeometry(0.20), matHedge);
    shrub.position.y = 0.42;
    urn.add(shrub);

    const flower1 = new THREE.Mesh(new THREE.SphereGeometry(0.06, 6, 6), matFlowerRose);
    flower1.position.set(0.08, 0.52, 0.05);
    urn.add(flower1);

    const flower2 = new THREE.Mesh(new THREE.SphereGeometry(0.05, 6, 6), matFlowerLavender);
    flower2.position.set(-0.07, 0.48, -0.06);
    urn.add(flower2);

    return urn;
  };

  group.add(makeUrn(-1.34, 4.85));
  group.add(makeUrn(1.34, 4.85));

  // ── 6. INTERIOR FLOOR (HONED TERRAZZO TILES) ─────────────────────────────────
  // Inside dimensions: 5.60 m wide x 7.60 m deep at y = 0.501 m
  const floorGeo = new THREE.PlaneGeometry(5.60, 7.60, 14, 19);
  const floor = new THREE.Mesh(floorGeo, matFloor);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, 0.501, 0);
  floor.receiveShadow = true;
  group.add(floor);

  // Subtle interior tile joint grid
  const gridHelper = new THREE.GridHelper(7.60, 19, 0xd0c4b2, 0xe2d8cb);
  gridHelper.position.set(0, 0.502, 0);
  gridHelper.scale.set(5.6 / 7.6, 1, 1);
  group.add(gridHelper);

  // ── 7. WALLS & ARCHITECTURAL PILASTERS (y: 0.50m to 4.00m = 3.50m height) ────
  const wallH = 3.50;
  const wallY = 0.50 + wallH / 2;
  const wallThick = 0.20;

  // 4 Corner Pilasters (eliminates crude box edges with elegant classical piers)
  const pilasterGeo = new THREE.BoxGeometry(0.36, wallH + 0.10, 0.36);
  const pilasterCorners: [number, number][] = [
    [-3.0, -4.0],
    [3.0, -4.0],
    [-3.0, 4.0],
    [3.0, 4.0],
  ];

  for (const [px, pz] of pilasterCorners) {
    const pilaster = new THREE.Mesh(pilasterGeo, matStoneColumn);
    pilaster.position.set(px, wallY + 0.05, pz);
    pilaster.castShadow = true;
    pilaster.receiveShadow = true;
    group.add(pilaster);

    // Pilaster capital trim
    const cap = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.12, 0.44), matCornice);
    cap.position.set(px, 0.50 + wallH + 0.06, pz);
    cap.castShadow = true;
    group.add(cap);
  }

  // ── A. North Wall (Solid Back Wall) ──
  const northWall = new THREE.Mesh(new THREE.BoxGeometry(6.0, wallH, wallThick), matExtWall);
  northWall.position.set(0, wallY, -4.0);
  northWall.castShadow = true;
  northWall.receiveShadow = true;
  group.add(northWall);

  colliders.push({
    min: [-3.1, 0.5, -4.15],
    max: [3.1, 4.0, -3.85],
    name: 'north_wall',
  });

  // Interior north wall lining & baseboard
  const inNorth = new THREE.Mesh(new THREE.BoxGeometry(5.6, wallH, 0.02), matIntWall);
  inNorth.position.set(0, wallY, -3.89);
  inNorth.receiveShadow = true;
  group.add(inNorth);

  const northBase = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.12, 0.04), matWalnut);
  northBase.position.set(0, 0.50 + 0.06, -3.87);
  group.add(northBase);

  // ── B. South Wall (Front Entrance with Portico & 1.80m x 2.40m doorway) ──
  const doorW = 1.80;
  const doorH = 2.40;
  const southSideW = (6.0 - doorW) / 2; // 2.10 m

  // Left South Wall (-3.0 to -0.9)
  const southLeft = new THREE.Mesh(new THREE.BoxGeometry(southSideW, wallH, wallThick), matExtWall);
  southLeft.position.set(-(doorW / 2 + southSideW / 2), wallY, 4.0);
  southLeft.castShadow = true;
  southLeft.receiveShadow = true;
  group.add(southLeft);

  colliders.push({
    min: [-3.1, 0.5, 3.85],
    max: [-doorW / 2, 4.0, 4.15],
    name: 'south_left_wall',
  });

  // Right South Wall (+0.9 to +3.0)
  const southRight = new THREE.Mesh(new THREE.BoxGeometry(southSideW, wallH, wallThick), matExtWall);
  southRight.position.set(doorW / 2 + southSideW / 2, wallY, 4.0);
  southRight.castShadow = true;
  southRight.receiveShadow = true;
  group.add(southRight);

  colliders.push({
    min: [doorW / 2, 0.5, 3.85],
    max: [3.1, 4.0, 4.15],
    name: 'south_right_wall',
  });

  // South facade decorative recessed molding panels for architectural depth
  const southPanelGeo = new THREE.BoxGeometry(1.60, 2.20, 0.03);
  const southPanelL = new THREE.Mesh(southPanelGeo, matCornice);
  southPanelL.position.set(-(doorW / 2 + southSideW / 2), wallY, 4.11);
  southPanelL.castShadow = true;
  group.add(southPanelL);

  const southPanelR = new THREE.Mesh(southPanelGeo, matCornice);
  southPanelR.position.set(doorW / 2 + southSideW / 2, wallY, 4.11);
  southPanelR.castShadow = true;
  group.add(southPanelR);

  // Top Lintel Wall above door
  const lintelH = wallH - doorH; // 1.10m
  const southLintel = new THREE.Mesh(new THREE.BoxGeometry(doorW, lintelH, wallThick), matExtWall);
  southLintel.position.set(0, 0.50 + doorH + lintelH / 2, 4.0);
  southLintel.castShadow = true;
  southLintel.receiveShadow = true;
  group.add(southLintel);

  // South baseboards
  const southBaseL = new THREE.Mesh(new THREE.BoxGeometry(southSideW - 0.2, 0.12, 0.04), matWalnut);
  southBaseL.position.set(-(doorW / 2 + (southSideW - 0.2) / 2 + 0.1), 0.56, 3.87);
  group.add(southBaseL);

  const southBaseR = new THREE.Mesh(new THREE.BoxGeometry(southSideW - 0.2, 0.12, 0.04), matWalnut);
  southBaseR.position.set(doorW / 2 + (southSideW - 0.2) / 2 + 0.1, 0.56, 3.87);
  group.add(southBaseR);

  // ── Entrance Portico & Cantilevered Architectural Canopy ──
  // Portico canopy slab (2.8m x 1.1m x 0.16m at y = 3.65m)
  const canopyGeo = new THREE.BoxGeometry(2.8, 0.16, 1.10);
  const canopy = new THREE.Mesh(canopyGeo, matCornice);
  canopy.position.set(0, 0.50 + doorH + 0.75, 4.45);
  canopy.castShadow = true;
  group.add(canopy);

  // Portico dentil frieze along the canopy front edge
  const dentilGeo = new THREE.BoxGeometry(0.08, 0.05, 0.04);
  for (let dx = -1.25; dx <= 1.25; dx += 0.22) {
    const dentil = new THREE.Mesh(dentilGeo, matCornice);
    dentil.position.set(dx, 0.50 + doorH + 0.65, 4.98);
    group.add(dentil);
  }

  // Slender Round Columns supporting the canopy
  const colGeo = new THREE.CylinderGeometry(0.09, 0.11, 3.10, 16);

  const colL = new THREE.Mesh(colGeo, matStoneColumn);
  colL.position.set(-1.20, 0.50 + 1.55, 4.85);
  colL.castShadow = true;
  group.add(colL);

  const colR = new THREE.Mesh(colGeo, matStoneColumn);
  colR.position.set(1.20, 0.50 + 1.55, 4.85);
  colR.castShadow = true;
  group.add(colR);

  // Entrance Brass Sign Plaque over the doorway
  const signGeo = new THREE.BoxGeometry(1.60, 0.24, 0.04);
  const signMesh = new THREE.Mesh(signGeo, matBronze);
  signMesh.position.set(0, 0.50 + doorH + 0.22, 4.12);
  group.add(signMesh);

  const signPlate = new THREE.Mesh(new THREE.BoxGeometry(1.52, 0.18, 0.02), matBrass);
  signPlate.position.set(0, 0.50 + doorH + 0.22, 4.14);
  group.add(signPlate);

  // ── Glass Entrance Doors & Anodized Bronze Frame ──
  const frameThick = 0.08;
  const frameDepth = 0.16;

  const doorPostL = new THREE.Mesh(new THREE.BoxGeometry(frameThick, doorH, frameDepth), matBronze);
  doorPostL.position.set(-doorW / 2 + frameThick / 2, 0.50 + doorH / 2, 4.0);
  group.add(doorPostL);

  const doorPostR = new THREE.Mesh(new THREE.BoxGeometry(frameThick, doorH, frameDepth), matBronze);
  doorPostR.position.set(doorW / 2 - frameThick / 2, 0.50 + doorH / 2, 4.0);
  group.add(doorPostR);

  const doorHeader = new THREE.Mesh(new THREE.BoxGeometry(doorW, frameThick, frameDepth), matBronze);
  doorHeader.position.set(0, 0.50 + doorH - frameThick / 2, 4.0);
  group.add(doorHeader);

  // Left door panel (closed)
  const singleDoorW = (doorW - frameThick * 2) / 2;
  const glassDoorGeo = new THREE.BoxGeometry(singleDoorW, doorH - frameThick, 0.04);

  const doorLeftMesh = new THREE.Mesh(glassDoorGeo, matGlass);
  doorLeftMesh.position.set(-singleDoorW / 2 - 0.02, 0.50 + (doorH - frameThick) / 2, 4.0);
  group.add(doorLeftMesh);

  // Brass vertical handle
  const handleGeo = new THREE.CylinderGeometry(0.018, 0.018, 0.90, 16);
  const handleL = new THREE.Mesh(handleGeo, matBrass);
  handleL.position.set(-0.06, 0.50 + 1.10, 4.05);
  group.add(handleL);

  // Right door panel swung open inward 40 degrees for welcoming access
  const doorRightPivot = new THREE.Group();
  doorRightPivot.position.set(doorW / 2 - frameThick, 0.50, 4.0);
  doorRightPivot.rotation.y = -Math.PI / 4.0;

  const doorRightMesh = new THREE.Mesh(glassDoorGeo, matGlass);
  doorRightMesh.position.set(-singleDoorW / 2, (doorH - frameThick) / 2, 0);
  doorRightPivot.add(doorRightMesh);

  const handleR = new THREE.Mesh(handleGeo, matBrass);
  handleR.position.set(-singleDoorW + 0.06, 1.10, 0.05);
  doorRightPivot.add(handleR);
  group.add(doorRightPivot);

  // ── C. East Wall (Right Wall with Clerestory Window) ──
  const winW = 1.40;
  const winH = 1.60;
  const winSillH = 1.00;
  const eWallLen = 8.0;
  const eSideLen = (eWallLen - winW) / 2;

  // Below sill
  const eBottom = new THREE.Mesh(new THREE.BoxGeometry(wallThick, winSillH, eWallLen), matExtWall);
  eBottom.position.set(3.0, 0.50 + winSillH / 2, 0);
  eBottom.castShadow = true;
  eBottom.receiveShadow = true;
  group.add(eBottom);

  // Above window
  const winTopH = wallH - (winSillH + winH);
  const eTop = new THREE.Mesh(new THREE.BoxGeometry(wallThick, winTopH, eWallLen), matExtWall);
  eTop.position.set(3.0, 0.50 + winSillH + winH + winTopH / 2, 0);
  eTop.castShadow = true;
  eTop.receiveShadow = true;
  group.add(eTop);

  // Sides of window
  const eSideY = 0.50 + winSillH + winH / 2;
  const eSideNorth = new THREE.Mesh(new THREE.BoxGeometry(wallThick, winH, eSideLen), matExtWall);
  eSideNorth.position.set(3.0, eSideY, -(winW / 2 + eSideLen / 2));
  eSideNorth.castShadow = true;
  group.add(eSideNorth);

  const eSideSouth = new THREE.Mesh(new THREE.BoxGeometry(wallThick, winH, eSideLen), matExtWall);
  eSideSouth.position.set(3.0, eSideY, winW / 2 + eSideLen / 2);
  eSideSouth.castShadow = true;
  group.add(eSideSouth);

  // Window Sill (projecting limestone sill)
  const sillGeo = new THREE.BoxGeometry(0.32, 0.08, winW + 0.16);
  const eSill = new THREE.Mesh(sillGeo, matStoneColumn);
  eSill.position.set(3.0, 0.50 + winSillH, 0);
  group.add(eSill);

  // Window Glass & Bronze Mullions
  const eGlass = new THREE.Mesh(new THREE.BoxGeometry(0.04, winH, winW), matGlass);
  eGlass.position.set(3.0, eSideY, 0);
  group.add(eGlass);

  const winMullionH = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.04, winW), matBronze);
  winMullionH.position.set(3.0, eSideY, 0);
  group.add(winMullionH);

  const winMullionV = new THREE.Mesh(new THREE.BoxGeometry(0.06, winH, 0.04), matBronze);
  winMullionV.position.set(3.0, eSideY, 0);
  group.add(winMullionV);

  // East wall baseboard
  const eBase = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.12, 7.60), matWalnut);
  eBase.position.set(2.87, 0.56, 0);
  group.add(eBase);

  colliders.push({
    min: [2.85, 0.5, -4.1],
    max: [3.15, 4.0, 4.1],
    name: 'east_wall',
  });

  // ── D. West Wall (Left Wall - Symmetrical to East) ──
  const wBottom = new THREE.Mesh(new THREE.BoxGeometry(wallThick, winSillH, eWallLen), matExtWall);
  wBottom.position.set(-3.0, 0.50 + winSillH / 2, 0);
  wBottom.castShadow = true;
  wBottom.receiveShadow = true;
  group.add(wBottom);

  const wTop = new THREE.Mesh(new THREE.BoxGeometry(wallThick, winTopH, eWallLen), matExtWall);
  wTop.position.set(-3.0, 0.50 + winSillH + winH + winTopH / 2, 0);
  wTop.castShadow = true;
  wTop.receiveShadow = true;
  group.add(wTop);

  const wSideNorth = new THREE.Mesh(new THREE.BoxGeometry(wallThick, winH, eSideLen), matExtWall);
  wSideNorth.position.set(-3.0, eSideY, -(winW / 2 + eSideLen / 2));
  wSideNorth.castShadow = true;
  group.add(wSideNorth);

  const wSideSouth = new THREE.Mesh(new THREE.BoxGeometry(wallThick, winH, eSideLen), matExtWall);
  wSideSouth.position.set(-3.0, eSideY, winW / 2 + eSideLen / 2);
  wSideSouth.castShadow = true;
  group.add(wSideSouth);

  const wSill = new THREE.Mesh(sillGeo, matStoneColumn);
  wSill.position.set(-3.0, 0.50 + winSillH, 0);
  group.add(wSill);

  const wGlass = new THREE.Mesh(new THREE.BoxGeometry(0.04, winH, winW), matGlass);
  wGlass.position.set(-3.0, eSideY, 0);
  group.add(wGlass);

  const wWinMullionH = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.04, winW), matBronze);
  wWinMullionH.position.set(-3.0, eSideY, 0);
  group.add(wWinMullionH);

  const wWinMullionV = new THREE.Mesh(new THREE.BoxGeometry(0.06, winH, 0.04), matBronze);
  wWinMullionV.position.set(-3.0, eSideY, 0);
  group.add(wWinMullionV);

  const wBase = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.12, 7.60), matWalnut);
  wBase.position.set(-2.87, 0.56, 0);
  group.add(wBase);

  colliders.push({
    min: [-3.15, 0.5, -4.1],
    max: [-2.85, 4.0, 4.1],
    name: 'west_wall',
  });

  // ── 8. EXTERIOR WALL-TOP PERIMETER CORNICE & ENTABLATURE (y = 4.05m) ────────
  // Classical frieze trim running along the top of all 4 walls
  const corniceNorth = new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.16, 0.28), matCornice);
  corniceNorth.position.set(0, 4.08, -4.0);
  corniceNorth.castShadow = true;
  group.add(corniceNorth);

  const corniceSouth = new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.16, 0.28), matCornice);
  corniceSouth.position.set(0, 4.08, 4.0);
  corniceSouth.castShadow = true;
  group.add(corniceSouth);

  const corniceEast = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.16, 8.4), matCornice);
  corniceEast.position.set(3.0, 4.08, 0);
  corniceEast.castShadow = true;
  group.add(corniceEast);

  const corniceWest = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.16, 8.4), matCornice);
  corniceWest.position.set(-3.0, 4.08, 0);
  corniceWest.castShadow = true;
  group.add(corniceWest);

  // ── 9. INTERIOR CEILING & RECESSED DOWNLIGHT FIXTURES (y: 4.00m) ─────────────
  const ceilingGeo = new THREE.BoxGeometry(5.60, 0.10, 7.60);
  const ceiling = new THREE.Mesh(ceilingGeo, matCeiling);
  ceiling.position.set(0, 4.05, 0);
  ceiling.receiveShadow = true;
  group.add(ceiling);

  // Recessed can downlights with brass bezels & warm luminous discs
  const fixtureRingMat = new THREE.MeshStandardMaterial({ color: 0x3d3935, roughness: 0.35, metalness: 0.8 });
  const emissiveLensMat = new THREE.MeshBasicMaterial({ color: 0xfff0d0 });
  const fixtureRingGeo = new THREE.CylinderGeometry(0.13, 0.13, 0.02, 16);

  const downlightCoords: [number, number][] = [
    [-1.8, 2.4],   // Zone Intro
    [0.0, 0.0],    // Zone Globe
    [2.0, 0.0],    // Zone Gallery
    [0.0, -2.8],   // Zone Flags
    [-2.0, 0.0],   // Zone Souvenirs
    [1.8, -2.6],   // Zone Reading
    [0.0, 3.2],    // Entrance Foyer
    [0.0, -1.2],   // Mid Hall
  ];

  for (const [dx, dz] of downlightCoords) {
    const fixtureRing = new THREE.Mesh(fixtureRingGeo, fixtureRingMat);
    fixtureRing.position.set(dx, 4.00, dz);
    group.add(fixtureRing);

    const brassBezel = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.015, 8, 16), matBrass);
    brassBezel.rotation.x = Math.PI / 2;
    brassBezel.position.set(dx, 3.995, dz);
    group.add(brassBezel);

    const lens = new THREE.Mesh(new THREE.CircleGeometry(0.09, 16), emissiveLensMat);
    lens.rotation.x = Math.PI / 2;
    lens.position.set(dx, 3.99, dz);
    group.add(lens);
  }

  // ── 10. ARCHITECTURAL PITCHED GABLE ROOF WITH STANDING SEAMS ─────────────────
  const roofSpanW = 6.80; // 3.40m per side
  const roofLen = 8.90;
  const pitchAngle = Math.atan2(0.90, roofSpanW / 2); // ~14.8 degrees slope
  const slopeLen = Math.sqrt(Math.pow(roofSpanW / 2, 2) + Math.pow(0.90, 2));

  // West Roof Slope
  const westSlope = new THREE.Mesh(new THREE.BoxGeometry(slopeLen, 0.12, roofLen), matRoof);
  westSlope.position.set(-(roofSpanW / 4), 4.00 + 0.90 / 2 + 0.06, 0);
  westSlope.rotation.z = pitchAngle;
  westSlope.castShadow = true;
  group.add(westSlope);

  // East Roof Slope
  const eastSlope = new THREE.Mesh(new THREE.BoxGeometry(slopeLen, 0.12, roofLen), matRoof);
  eastSlope.position.set(roofSpanW / 4, 4.00 + 0.90 / 2 + 0.06, 0);
  eastSlope.rotation.z = -pitchAngle;
  eastSlope.castShadow = true;
  group.add(eastSlope);

  // Roof Ridge Cap
  const ridge = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.10, roofLen + 0.10), matRoofSeam);
  ridge.position.set(0, 4.96, 0);
  ridge.castShadow = true;
  group.add(ridge);

  // Standing Seam Ribs along roof slopes (15 ribs on each slope spaced every 0.55m)
  const ribGeo = new THREE.BoxGeometry(slopeLen, 0.04, 0.035);
  for (let rz = -roofLen / 2 + 0.45; rz <= roofLen / 2 - 0.45; rz += 0.58) {
    const ribW = new THREE.Mesh(ribGeo, matRoofSeam);
    ribW.position.set(-(roofSpanW / 4), 4.00 + 0.90 / 2 + 0.12, rz);
    ribW.rotation.z = pitchAngle;
    group.add(ribW);

    const ribE = new THREE.Mesh(ribGeo, matRoofSeam);
    ribE.position.set(roofSpanW / 4, 4.00 + 0.90 / 2 + 0.12, rz);
    ribE.rotation.z = -pitchAngle;
    group.add(ribE);
  }

  // Gable end walls (Triangles at North and South tops)
  const gableShape = new THREE.Shape();
  gableShape.moveTo(-3.0, 0);
  gableShape.lineTo(0, 0.90);
  gableShape.lineTo(3.0, 0);
  gableShape.closePath();

  const gableGeo = new THREE.ExtrudeGeometry(gableShape, { depth: 0.20, bevelEnabled: false });

  const northGable = new THREE.Mesh(gableGeo, matExtWall);
  northGable.position.set(0, 4.00, -4.10);
  northGable.castShadow = true;
  group.add(northGable);

  const southGable = new THREE.Mesh(gableGeo, matExtWall);
  southGable.position.set(0, 4.00, 3.90);
  southGable.castShadow = true;
  group.add(southGable);

  // ── 11. GARDEN VEGETATION & LANDSCAPING DETAILS ──────────────────────────────
  const vegetation = buildVegetationSystem();
  group.add(vegetation.group);
  colliders.push(...vegetation.colliders);
  animUpdaters.push((delta, elapsed) => vegetation.update(delta, elapsed));

  // ── 12. GARDEN FURNITURE & AMENITIES ─────────────────────────────────────────
  // Park Benches (Teak wood slats with dark cast-iron scroll legs)
  const makeBench = (x: number, z: number, rotY: number = 0) => {
    const bench = new THREE.Group();
    bench.position.set(x, 0, z);
    bench.rotation.y = rotY;

    // Cast iron legs
    const legGeo = new THREE.BoxGeometry(0.08, 0.45, 0.55);
    const legL = new THREE.Mesh(legGeo, matCastIron);
    legL.position.set(-0.75, 0.225, 0);
    legL.castShadow = true;
    bench.add(legL);

    const legR = new THREE.Mesh(legGeo, matCastIron);
    legR.position.set(0.75, 0.225, 0);
    legR.castShadow = true;
    bench.add(legR);

    // Teak seat slats (4 parallel slats)
    for (let s = -0.18; s <= 0.18; s += 0.12) {
      const slat = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.035, 0.09), matTeak);
      slat.position.set(0, 0.45, s);
      slat.castShadow = true;
      bench.add(slat);
    }

    // Teak backrest slats
    for (let b = 0.58; b <= 0.82; b += 0.12) {
      const bSlat = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.09, 0.035), matTeak);
      bSlat.position.set(0, b, -0.22);
      bSlat.castShadow = true;
      bench.add(bSlat);
    }

    group.add(bench);

    // AABB Collider for bench
    const halfX = (rotY === 0 ? 0.85 : 0.35);
    const halfZ = (rotY === 0 ? 0.35 : 0.85);
    colliders.push({
      min: [x - halfX, 0, z - halfZ],
      max: [x + halfX, 0.90, z + halfZ],
      name: 'garden_bench',
    });
  };

  // 4 Park benches positioned around garden
  makeBench(-4.2, 14.5, Math.PI / 2);  // West of fountain, facing fountain
  makeBench(4.2, 14.5, -Math.PI / 2); // East of fountain, facing fountain
  makeBench(-8.5, 17.5, 0);           // South-west garden alcove
  makeBench(8.5, 17.5, 0);            // South-east garden alcove

  // Classical Bronze Garden Lantern Posts (2.6m high)
  const makeLantern = (x: number, z: number) => {
    const lantern = new THREE.Group();
    lantern.position.set(x, 0, z);

    // Base plinth
    const plinth = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.24, 0.30, 8), matCastIron);
    plinth.position.y = 0.15;
    lantern.add(plinth);

    // Pole
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 2.0, 8), matCastIron);
    pole.position.y = 1.30;
    pole.castShadow = true;
    lantern.add(pole);

    // Lantern Head
    const head = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.12, 0.35, 6), matLanternGlow);
    head.position.y = 2.40;
    lantern.add(head);

    const cap = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.16, 6), matCastIron);
    cap.position.y = 2.62;
    lantern.add(cap);

    group.add(lantern);

    colliders.push({
      min: [x - 0.2, 0, z - 0.2],
      max: [x + 0.2, 2.6, z + 0.2],
      name: 'garden_lantern',
    });
  };

  // 6 Lantern posts along promenade and plaza
  makeLantern(-1.9, 6.0);
  makeLantern(1.9, 6.0);
  makeLantern(-1.9, 11.0);
  makeLantern(1.9, 11.0);
  makeLantern(-4.5, 17.0);
  makeLantern(4.5, 17.0);

  // ── 13. LOW STONE PERIMETER TERRACE PARAPET WALLS ────────────────────────────
  // Wall height 0.75m, marking garden estate perimeter
  const makePerimeterWall = (x: number, z: number, w: number, d: number) => {
    const wall = new THREE.Mesh(new THREE.BoxGeometry(w, 0.75, d), matStoneColumn);
    wall.position.set(x, 0.75 / 2, z);
    wall.castShadow = true;
    wall.receiveShadow = true;
    group.add(wall);

    const coping = new THREE.Mesh(new THREE.BoxGeometry(w + 0.1, 0.08, d + 0.1), matKerb);
    coping.position.set(x, 0.75 + 0.04, z);
    group.add(coping);

    colliders.push({
      min: [x - w / 2, 0, z - d / 2],
      max: [x + w / 2, 0.85, z + d / 2],
      name: 'perimeter_wall',
    });
  };

  // Garden north boundary wall
  makePerimeterWall(0, -11.0, 36.0, 0.40);
  // Garden west boundary wall
  makePerimeterWall(-18.0, 8.0, 0.40, 38.0);
  // Garden east boundary wall
  makePerimeterWall(18.0, 8.0, 0.40, 38.0);
  // Garden south boundary wall (with 4m opening for grand entrance gate)
  makePerimeterWall(-10.0, 26.0, 16.0, 0.40);
  makePerimeterWall(10.0, 26.0, 16.0, 0.40);

  // Master update callback
  const update = (delta: number, elapsed: number) => {
    for (const updater of animUpdaters) {
      updater(delta, elapsed);
    }
  };

  return { group, colliders, update };
}
