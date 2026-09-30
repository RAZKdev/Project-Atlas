/**
 * museumEngine/museumArchitecture.ts
 * Human-scale 3D Architectural Shell for Museum Mini ("195 Negara, 1 Cerita")
 *
 * Reconstructed strictly from architectural reference board:
 * - Footprint: 6.00 m x 8.00 m (48 m2 floor area)
 * - Interior ceiling height: 3.50 m
 * - Raised foundation: 0.50 m
 * - Canonical Scale: 1 unit = 1 meter
 */

import * as THREE from 'three';
import { type CollisionBox } from './types';
import { MUSEUM_COLORS } from '../../../data/museumData';

export interface ArchitectureResult {
  group: THREE.Group;
  colliders: CollisionBox[];
}

export function buildMuseumArchitecture(): ArchitectureResult {
  const group = new THREE.Group();
  const colliders: CollisionBox[] = [];

  // ── Materials ──────────────────────────────────────────────────────────────
  const matFoundation = new THREE.MeshStandardMaterial({
    color: 0x8e8274,
    roughness: 0.92,
    metalness: 0.05,
  });

  const matExtWall = new THREE.MeshStandardMaterial({
    color: 0xf5efe6,
    roughness: 0.88,
    metalness: 0.02,
  });

  const matIntWall = new THREE.MeshStandardMaterial({
    color: 0xede6da,
    roughness: 0.84,
    metalness: 0.01,
  });

  const matBaseboard = new THREE.MeshStandardMaterial({
    color: 0x3d2b1a, // rich walnut trim
    roughness: 0.6,
    metalness: 0.1,
  });

  const matRoof = new THREE.MeshStandardMaterial({
    color: 0x2b2826, // dark charcoal architectural zinc
    roughness: 0.72,
    metalness: 0.35,
  });

  const matRoofRidge = new THREE.MeshStandardMaterial({
    color: 0x1f1d1b,
    roughness: 0.65,
    metalness: 0.45,
  });

  const matCeiling = new THREE.MeshStandardMaterial({
    color: 0xf8f5f0,
    roughness: 0.9,
    metalness: 0.0,
  });

  const matDoorFrame = new THREE.MeshStandardMaterial({
    color: 0x242220, // dark anodized bronze/aluminum
    roughness: 0.45,
    metalness: 0.75,
  });

  const matBrassHandle = new THREE.MeshStandardMaterial({
    color: 0xd4a843, // polished architectural brass
    roughness: 0.25,
    metalness: 0.9,
  });

  const matGlass = new THREE.MeshPhysicalMaterial({
    color: 0xe6f4f8,
    transparent: true,
    opacity: 0.32,
    roughness: 0.05,
    metalness: 0.1,
    transmission: 0.7,
    ior: 1.52,
    reflectivity: 0.5,
  });

  // ── 1. Exterior Site Ground & Landscaping ────────────────────────────────────
  // Lawn
  const lawnGeo = new THREE.PlaneGeometry(24, 28);
  const lawnMat = new THREE.MeshStandardMaterial({
    color: 0x3d4f33,
    roughness: 0.95,
    metalness: 0.0,
  });
  const lawn = new THREE.Mesh(lawnGeo, lawnMat);
  lawn.rotation.x = -Math.PI / 2;
  lawn.position.y = -0.01;
  lawn.receiveShadow = true;
  group.add(lawn);

  // Granite Plaza Slab around the building
  const plazaGeo = new THREE.BoxGeometry(11.0, 0.08, 14.0);
  const plazaMat = new THREE.MeshStandardMaterial({
    color: 0x9e9486,
    roughness: 0.85,
    metalness: 0.05,
  });
  const plaza = new THREE.Mesh(plazaGeo, plazaMat);
  plaza.position.set(0, 0.04, 0.5);
  plaza.receiveShadow = true;
  group.add(plaza);

  // Entrance stone pathway leading south
  const pathGeo = new THREE.BoxGeometry(2.8, 0.06, 6.0);
  const pathMat = new THREE.MeshStandardMaterial({
    color: 0xb5aa9c,
    roughness: 0.78,
    metalness: 0.04,
  });
  const path = new THREE.Mesh(pathGeo, pathMat);
  path.position.set(0, 0.05, 8.5);
  path.receiveShadow = true;
  group.add(path);

  // ── 2. Raised Concrete Foundation (y: 0 to 0.50m) ───────────────────────────
  // Footprint: 6.40 m wide x 8.40 m deep x 0.50 m high (centered at x=0, z=0)
  const fWidth = 6.4;
  const fDepth = 8.4;
  const fHeight = 0.50;
  const foundationGeo = new THREE.BoxGeometry(fWidth, fHeight, fDepth);
  const foundation = new THREE.Mesh(foundationGeo, matFoundation);
  foundation.position.set(0, fHeight / 2, 0);
  foundation.castShadow = true;
  foundation.receiveShadow = true;
  group.add(foundation);

  // Foundation perimeter colliders for exterior walking (so player on y=0 doesn't clip inside base)
  colliders.push({ min: [-fWidth / 2, 0, -fDepth / 2], max: [fWidth / 2, fHeight, -4.0], name: 'foundation_north' });
  colliders.push({ min: [-fWidth / 2, 0, -fDepth / 2], max: [-3.0, fHeight, fDepth / 2], name: 'foundation_west' });
  colliders.push({ min: [3.0, 0, -fDepth / 2], max: [fWidth / 2, fHeight, fDepth / 2], name: 'foundation_east' });
  // South foundation sides (leaving doorway steps open)
  colliders.push({ min: [-fWidth / 2, 0, 4.0], max: [-1.2, fHeight, fDepth / 2], name: 'foundation_south_left' });
  colliders.push({ min: [1.2, 0, 4.0], max: [fWidth / 2, fHeight, fDepth / 2], name: 'foundation_south_right' });

  // ── 3. Three Entrance Stone Steps (y: 0 to 0.50m, z: 4.0 to 4.9m) ───────────
  // Step 1 (lowest, z: 4.6 to 4.9, y: 0 to 0.17)
  const step1Geo = new THREE.BoxGeometry(2.4, 0.17, 0.35);
  const step1 = new THREE.Mesh(step1Geo, matFoundation);
  step1.position.set(0, 0.17 / 2, 4.75);
  step1.receiveShadow = true;
  group.add(step1);

  // Step 2 (middle, z: 4.3 to 4.6, y: 0 to 0.34)
  const step2Geo = new THREE.BoxGeometry(2.4, 0.34, 0.35);
  const step2 = new THREE.Mesh(step2Geo, matFoundation);
  step2.position.set(0, 0.34 / 2, 4.45);
  step2.receiveShadow = true;
  group.add(step2);

  // Step 3 (top landing, z: 4.0 to 4.3, y: 0 to 0.50)
  const step3Geo = new THREE.BoxGeometry(2.4, 0.50, 0.35);
  const step3 = new THREE.Mesh(step3Geo, matFoundation);
  step3.position.set(0, 0.50 / 2, 4.15);
  step3.receiveShadow = true;
  group.add(step3);

  // ── 4. Interior Floor (60x60 Ceramic Stone Tile Grid) ───────────────────────
  // Inside dimensions: 5.60 m wide x 7.60 m deep at y = 0.501 m
  const floorGeo = new THREE.PlaneGeometry(5.60, 7.60, 14, 19);
  const floorMat = new THREE.MeshStandardMaterial({
    color: 0xf4eee4,
    roughness: 0.42,
    metalness: 0.08,
  });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, 0.501, 0);
  floor.receiveShadow = true;
  group.add(floor);

  // Subtle tile grid lines
  const gridHelper = new THREE.GridHelper(7.60, 19, 0xd0c4b2, 0xe2d8cb);
  gridHelper.position.set(0, 0.502, 0);
  gridHelper.scale.set(5.6 / 7.6, 1, 1);
  group.add(gridHelper);

  // ── 5. Exterior & Interior Walls (y: 0.50m to 4.00m = 3.50m height) ─────────
  const wallH = 3.50;
  const wallY = 0.50 + wallH / 2;
  const wallThick = 0.20;

  // ── A. North Wall (Back - Solid) ──
  const northWallGeo = new THREE.BoxGeometry(6.0, wallH, wallThick);
  const northWall = new THREE.Mesh(northWallGeo, matExtWall);
  northWall.position.set(0, wallY, -4.0);
  northWall.castShadow = true;
  northWall.receiveShadow = true;
  group.add(northWall);

  colliders.push({
    min: [-3.1, 0.5, -4.15],
    max: [3.1, 4.0, -3.85],
    name: 'north_wall',
  });

  // Interior north wall lining
  const inNorthGeo = new THREE.BoxGeometry(5.6, wallH, 0.02);
  const inNorth = new THREE.Mesh(inNorthGeo, matIntWall);
  inNorth.position.set(0, wallY, -3.89);
  inNorth.receiveShadow = true;
  group.add(inNorth);

  // North baseboard
  const northBaseGeo = new THREE.BoxGeometry(5.6, 0.12, 0.04);
  const northBase = new THREE.Mesh(northBaseGeo, matBaseboard);
  northBase.position.set(0, 0.50 + 0.06, -3.87);
  group.add(northBase);

  // ── B. South Wall (Front Entrance with 1.80m x 2.40m doorway) ──
  const doorW = 1.80;
  const doorH = 2.40;
  const southSideW = (6.0 - doorW) / 2; // 2.10 m on each side

  // Left South Wall (-3.0 to -0.9)
  const southLeftGeo = new THREE.BoxGeometry(southSideW, wallH, wallThick);
  const southLeft = new THREE.Mesh(southLeftGeo, matExtWall);
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
  const southRightGeo = new THREE.BoxGeometry(southSideW, wallH, wallThick);
  const southRight = new THREE.Mesh(southRightGeo, matExtWall);
  southRight.position.set(doorW / 2 + southSideW / 2, wallY, 4.0);
  southRight.castShadow = true;
  southRight.receiveShadow = true;
  group.add(southRight);

  colliders.push({
    min: [doorW / 2, 0.5, 3.85],
    max: [3.1, 4.0, 4.15],
    name: 'south_right_wall',
  });

  // Top Lintel Wall above door (y: 0.5 + 2.4 = 2.9 to 4.0, height = 1.10m)
  const lintelH = wallH - doorH;
  const southLintelGeo = new THREE.BoxGeometry(doorW, lintelH, wallThick);
  const southLintel = new THREE.Mesh(southLintelGeo, matExtWall);
  southLintel.position.set(0, 0.50 + doorH + lintelH / 2, 4.0);
  southLintel.castShadow = true;
  southLintel.receiveShadow = true;
  group.add(southLintel);

  // South baseboards on left and right
  const southBaseLGeo = new THREE.BoxGeometry(southSideW - 0.2, 0.12, 0.04);
  const southBaseL = new THREE.Mesh(southBaseLGeo, matBaseboard);
  southBaseL.position.set(-(doorW / 2 + (southSideW - 0.2) / 2 + 0.1), 0.56, 3.87);
  group.add(southBaseL);

  const southBaseRGeo = new THREE.BoxGeometry(southSideW - 0.2, 0.12, 0.04);
  const southBaseR = new THREE.Mesh(southBaseRGeo, matBaseboard);
  southBaseR.position.set(doorW / 2 + (southSideW - 0.2) / 2 + 0.1, 0.56, 3.87);
  group.add(southBaseR);

  // ── Entrance Door Frame & Glass Doors ──
  // Outer frame
  const frameThick = 0.08;
  const frameDepth = 0.16;
  const doorPostLGeo = new THREE.BoxGeometry(frameThick, doorH, frameDepth);
  const doorPostL = new THREE.Mesh(doorPostLGeo, matDoorFrame);
  doorPostL.position.set(-doorW / 2 + frameThick / 2, 0.50 + doorH / 2, 4.0);
  group.add(doorPostL);

  const doorPostR = new THREE.Mesh(doorPostLGeo, matDoorFrame);
  doorPostR.position.set(doorW / 2 - frameThick / 2, 0.50 + doorH / 2, 4.0);
  group.add(doorPostR);

  const doorHeaderGeo = new THREE.BoxGeometry(doorW, frameThick, frameDepth);
  const doorHeader = new THREE.Mesh(doorHeaderGeo, matDoorFrame);
  doorHeader.position.set(0, 0.50 + doorH - frameThick / 2, 4.0);
  group.add(doorHeader);

  // Glass Door Panes (Partially open inviting entrance)
  // Left door panel (closed)
  const singleDoorW = (doorW - frameThick * 2) / 2;
  const glassDoorGeo = new THREE.BoxGeometry(singleDoorW, doorH - frameThick, 0.04);
  const doorLeftMesh = new THREE.Mesh(glassDoorGeo, matGlass);
  doorLeftMesh.position.set(-singleDoorW / 2 - 0.02, 0.50 + (doorH - frameThick) / 2, 4.0);
  group.add(doorLeftMesh);

  // Brass vertical door handle
  const handleGeo = new THREE.CylinderGeometry(0.018, 0.018, 0.90, 16);
  const handleL = new THREE.Mesh(handleGeo, matBrassHandle);
  handleL.position.set(-0.06, 0.50 + 1.10, 4.05);
  group.add(handleL);

  // Right door panel is open inward by 40 degrees for seamless entry!
  const doorRightPivot = new THREE.Group();
  doorRightPivot.position.set(doorW / 2 - frameThick, 0.50, 4.0);
  doorRightPivot.rotation.y = -Math.PI / 3.8; // swung inward

  const doorRightMesh = new THREE.Mesh(glassDoorGeo, matGlass);
  doorRightMesh.position.set(-singleDoorW / 2, (doorH - frameThick) / 2, 0);
  doorRightPivot.add(doorRightMesh);

  const handleR = new THREE.Mesh(handleGeo, matBrassHandle);
  handleR.position.set(-singleDoorW + 0.06, 1.10, 0.05);
  doorRightPivot.add(handleR);
  group.add(doorRightPivot);

  // ── C. East Wall (Right Wall with Clerestory Window) ──
  // Window: 1.40m wide x 1.60m high, sill at 1.00m above floor (y = 1.50m)
  const winW = 1.40;
  const winH = 1.60;
  const winSillH = 1.00;
  const eWallLen = 8.0;
  const eSideLen = (eWallLen - winW) / 2; // 3.30m on each side of window

  // Below sill (y: 0.5 to 1.5)
  const eBottomGeo = new THREE.BoxGeometry(wallThick, winSillH, eWallLen);
  const eBottom = new THREE.Mesh(eBottomGeo, matExtWall);
  eBottom.position.set(3.0, 0.50 + winSillH / 2, 0);
  eBottom.castShadow = true;
  eBottom.receiveShadow = true;
  group.add(eBottom);

  // Above window (y: 0.5 + 1.0 + 1.6 = 3.10 to 4.00, height = 0.90m)
  const winTopH = wallH - (winSillH + winH);
  const eTopGeo = new THREE.BoxGeometry(wallThick, winTopH, eWallLen);
  const eTop = new THREE.Mesh(eTopGeo, matExtWall);
  eTop.position.set(3.0, 0.50 + winSillH + winH + winTopH / 2, 0);
  eTop.castShadow = true;
  eTop.receiveShadow = true;
  group.add(eTop);

  // Left & Right sides of window
  const eSideGeo = new THREE.BoxGeometry(wallThick, winH, eSideLen);
  const eSideY = 0.50 + winSillH + winH / 2;

  const eSideNorth = new THREE.Mesh(eSideGeo, matExtWall);
  eSideNorth.position.set(3.0, eSideY, -(winW / 2 + eSideLen / 2));
  eSideNorth.castShadow = true;
  group.add(eSideNorth);

  const eSideSouth = new THREE.Mesh(eSideGeo, matExtWall);
  eSideSouth.position.set(3.0, eSideY, winW / 2 + eSideLen / 2);
  eSideSouth.castShadow = true;
  group.add(eSideSouth);

  // East Wall Window Glass & Bronze Mullions
  const eGlassGeo = new THREE.BoxGeometry(0.04, winH, winW);
  const eGlass = new THREE.Mesh(eGlassGeo, matGlass);
  eGlass.position.set(3.0, eSideY, 0);
  group.add(eGlass);

  const winMullionH = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.04, winW), matDoorFrame);
  winMullionH.position.set(3.0, eSideY, 0);
  group.add(winMullionH);

  const winMullionV = new THREE.Mesh(new THREE.BoxGeometry(0.06, winH, 0.04), matDoorFrame);
  winMullionV.position.set(3.0, eSideY, 0);
  group.add(winMullionV);

  // East wall baseboard
  const eBaseGeo = new THREE.BoxGeometry(0.04, 0.12, 7.60);
  const eBase = new THREE.Mesh(eBaseGeo, matBaseboard);
  eBase.position.set(2.87, 0.56, 0);
  group.add(eBase);

  colliders.push({
    min: [2.85, 0.5, -4.1],
    max: [3.15, 4.0, 4.1],
    name: 'east_wall',
  });

  // ── D. West Wall (Left Wall - Symmetrical to East) ──
  const wBottom = new THREE.Mesh(eBottomGeo, matExtWall);
  wBottom.position.set(-3.0, 0.50 + winSillH / 2, 0);
  wBottom.castShadow = true;
  wBottom.receiveShadow = true;
  group.add(wBottom);

  const wTop = new THREE.Mesh(eTopGeo, matExtWall);
  wTop.position.set(-3.0, 0.50 + winSillH + winH + winTopH / 2, 0);
  wTop.castShadow = true;
  group.add(wTop);

  const wSideNorth = new THREE.Mesh(eSideGeo, matExtWall);
  wSideNorth.position.set(-3.0, eSideY, -(winW / 2 + eSideLen / 2));
  wSideNorth.castShadow = true;
  group.add(wSideNorth);

  const wSideSouth = new THREE.Mesh(eSideGeo, matExtWall);
  wSideSouth.position.set(-3.0, eSideY, winW / 2 + eSideLen / 2);
  wSideSouth.castShadow = true;
  group.add(wSideSouth);

  const wGlass = new THREE.Mesh(eGlassGeo, matGlass);
  wGlass.position.set(-3.0, eSideY, 0);
  group.add(wGlass);

  const wWinMullionH = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.04, winW), matDoorFrame);
  wWinMullionH.position.set(-3.0, eSideY, 0);
  group.add(wWinMullionH);

  const wWinMullionV = new THREE.Mesh(new THREE.BoxGeometry(0.06, winH, 0.04), matDoorFrame);
  wWinMullionV.position.set(-3.0, eSideY, 0);
  group.add(wWinMullionV);

  const wBase = new THREE.Mesh(eBaseGeo, matBaseboard);
  wBase.position.set(-2.87, 0.56, 0);
  group.add(wBase);

  colliders.push({
    min: [-3.15, 0.5, -4.1],
    max: [-2.85, 4.0, 4.1],
    name: 'west_wall',
  });

  // ── 6. Interior Ceiling & Lighting Fixtures (y: 4.00m) ──────────────────────
  const ceilingGeo = new THREE.BoxGeometry(5.60, 0.10, 7.60);
  const ceiling = new THREE.Mesh(ceilingGeo, matCeiling);
  ceiling.position.set(0, 4.05, 0);
  ceiling.receiveShadow = true;
  group.add(ceiling);

  // Ceiling Recessed Can Downlights Geometry (Circles with warm emissive disc)
  const fixtureGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.02, 16);
  const fixtureRingMat = new THREE.MeshStandardMaterial({ color: 0x403d3a, roughness: 0.3 });
  const emissiveLensMat = new THREE.MeshBasicMaterial({ color: 0xfff0d0 });

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
    const fixtureRing = new THREE.Mesh(fixtureGeo, fixtureRingMat);
    fixtureRing.position.set(dx, 4.00, dz);
    group.add(fixtureRing);

    const lensGeo = new THREE.CircleGeometry(0.08, 16);
    const lens = new THREE.Mesh(lensGeo, emissiveLensMat);
    lens.rotation.x = Math.PI / 2;
    lens.position.set(dx, 3.99, dz);
    group.add(lens);
  }

  // ── 7. Architectural Pitched Gable Roof with Standing Seam Zinc ─────────────
  // Ridge height: 4.90m (0.90m pitch above ceiling), extends 0.40m over walls
  const roofSpanW = 6.80; // 3.40m per side
  const roofLen = 8.80;
  const pitchAngle = Math.atan2(0.90, roofSpanW / 2); // ~14.8 degrees slope
  const slopeLen = Math.sqrt(Math.pow(roofSpanW / 2, 2) + Math.pow(0.90, 2));

  // West Roof Slope
  const roofSlopeGeo = new THREE.BoxGeometry(slopeLen, 0.12, roofLen);
  const westSlope = new THREE.Mesh(roofSlopeGeo, matRoof);
  westSlope.position.set(-(roofSpanW / 4), 4.00 + 0.90 / 2 + 0.06, 0);
  westSlope.rotation.z = pitchAngle;
  westSlope.castShadow = true;
  group.add(westSlope);

  // East Roof Slope
  const eastSlope = new THREE.Mesh(roofSlopeGeo, matRoof);
  eastSlope.position.set(roofSpanW / 4, 4.00 + 0.90 / 2 + 0.06, 0);
  eastSlope.rotation.z = -pitchAngle;
  eastSlope.castShadow = true;
  group.add(eastSlope);

  // Roof Ridge Cap
  const ridgeGeo = new THREE.BoxGeometry(0.24, 0.10, roofLen + 0.10);
  const ridge = new THREE.Mesh(ridgeGeo, matRoofRidge);
  ridge.position.set(0, 4.95, 0);
  ridge.castShadow = true;
  group.add(ridge);

  // Gable end walls (Triangles at North and South tops)
  const gableShape = new THREE.Shape();
  gableShape.moveTo(-3.0, 0);
  gableShape.lineTo(0, 0.90);
  gableShape.lineTo(3.0, 0);
  gableShape.closePath();

  const gableExtrudeSettings = { depth: 0.20, bevelEnabled: false };
  const gableGeo = new THREE.ExtrudeGeometry(gableShape, gableExtrudeSettings);

  const northGable = new THREE.Mesh(gableGeo, matExtWall);
  northGable.position.set(0, 4.00, -4.10);
  group.add(northGable);

  const southGable = new THREE.Mesh(gableGeo, matExtWall);
  southGable.position.set(0, 4.00, 3.90);
  group.add(southGable);

  return { group, colliders };
}
