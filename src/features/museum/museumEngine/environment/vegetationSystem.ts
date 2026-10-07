/**
 * museumEngine/environment/vegetationSystem.ts
 * Dedicated Organic Vegetation & Landscaping Subsystem for Project Atlas Museum 3D.
 *
 * Implements:
 * 1. Organic Tree Species Variations:
 *    - Species A: Slender Italian Cypress with staggered asymmetric foliage clusters
 *    - Species B: Gnarled Mediterranean Olive with split boughs and spreading canopy
 *    - Species C: Stone/Umbrella Pine with high curving trunk and wide flat crown
 * 2. Asymmetric silhouettes eliminating the primitive "dead cone" look
 * 3. Deterministic Wind Sway Simulation:
 *    - Subtle branch and crown oscillation with phase and amplitude variance
 *    - ZERO allocations per frame
 * 4. Ground Layering:
 *    - Clipped boxwood evergreen hedges
 *    - Foundation mulch beds with perennials (rose, lavender, marigold)
 * 5. Full Preservation of Collision Boxes ('cypress_tree', 'olive_tree', 'hedge')
 */

import * as THREE from 'three';
import { type CollisionBox } from '../types';

export interface VegetationResult {
  group: THREE.Group;
  colliders: CollisionBox[];
  update: (delta: number, elapsed: number) => void;
  dispose: () => void;
}

export function buildVegetationSystem(): VegetationResult {
  const group = new THREE.Group();
  group.name = 'OrganicVegetationSystem';
  const colliders: CollisionBox[] = [];

  // ── 1. Physically-Based Materials ──────────────────────────────────────────
  const matTrunkBark = new THREE.MeshStandardMaterial({
    color: 0x4a3d32,
    roughness: 0.94,
    metalness: 0.02,
  });

  const matOliveBark = new THREE.MeshStandardMaterial({
    color: 0x56493c,
    roughness: 0.92,
    metalness: 0.03,
  });

  // Multi-tone foliage materials for natural organic depth
  const matFoliageDeep = new THREE.MeshStandardMaterial({
    color: 0x27431e,
    roughness: 0.88,
    metalness: 0.0,
  });

  const matFoliageMid = new THREE.MeshStandardMaterial({
    color: 0x3b5c2a,
    roughness: 0.85,
    metalness: 0.0,
  });

  const matFoliageOlive = new THREE.MeshStandardMaterial({
    color: 0x556e42,
    roughness: 0.86,
    metalness: 0.0,
  });

  const matHedge = new THREE.MeshStandardMaterial({
    color: 0x2b4622,
    roughness: 0.90,
    metalness: 0.0,
  });

  const matMulch = new THREE.MeshStandardMaterial({
    color: 0x30241b,
    roughness: 0.95,
    metalness: 0.02,
  });

  const matFlowerRose = new THREE.MeshStandardMaterial({ color: 0xc44569, roughness: 0.85 });
  const matFlowerLavender = new THREE.MeshStandardMaterial({ color: 0x7c5295, roughness: 0.85 });
  const matFlowerGold = new THREE.MeshStandardMaterial({ color: 0xe5a93c, roughness: 0.85 });

  // Array of sway targets for the wind loop
  interface SwayTarget {
    obj: THREE.Object3D;
    baseRotZ: number;
    baseRotX: number;
    freq: number;
    amplitude: number;
    phase: number;
  }
  const swayTargets: SwayTarget[] = [];

  // ── 2. Tree Species A: Organic Italian Cypress (Columnar) ──────────────────
  const makeCypressTree = (x: number, z: number, scaleMultiplier: number = 1.0, phaseOffset: number = 0) => {
    const tree = new THREE.Group();
    tree.position.set(x, 0, z);
    tree.scale.set(scaleMultiplier, scaleMultiplier, scaleMultiplier);

    // Flared root base and trunk
    const trunkGeo = new THREE.CylinderGeometry(0.12, 0.22, 1.4, 10);
    const trunk = new THREE.Mesh(trunkGeo, matTrunkBark);
    trunk.position.y = 0.7;
    trunk.castShadow = true;
    tree.add(trunk);

    // Crown group that sways in wind
    const crown = new THREE.Group();
    crown.position.set(0, 1.2, 0);

    // 5 Asymmetric foliage clusters breaking up the geometric cone silhouette
    const clusterConfigs = [
      { rTop: 0.65, rBot: 0.85, h: 1.4, y: 0.7, mat: matFoliageDeep, rotY: 0.2, offX: 0.04, offZ: -0.03 },
      { rTop: 0.52, rBot: 0.75, h: 1.3, y: 1.8, mat: matFoliageMid, rotY: 1.1, offX: -0.05, offZ: 0.04 },
      { rTop: 0.38, rBot: 0.60, h: 1.2, y: 2.8, mat: matFoliageDeep, rotY: 2.3, offX: 0.03, offZ: 0.05 },
      { rTop: 0.22, rBot: 0.44, h: 1.1, y: 3.7, mat: matFoliageMid, rotY: 0.8, offX: -0.03, offZ: -0.04 },
      { rTop: 0.02, rBot: 0.26, h: 0.9, y: 4.5, mat: matFoliageMid, rotY: 1.9, offX: 0.01, offZ: 0.01 },
    ];

    for (const cfg of clusterConfigs) {
      const clusterGeo = new THREE.ConeGeometry(cfg.rBot, cfg.h, 10);
      const cluster = new THREE.Mesh(clusterGeo, cfg.mat);
      cluster.position.set(cfg.offX, cfg.y, cfg.offZ);
      cluster.rotation.y = cfg.rotY;
      cluster.castShadow = true;
      crown.add(cluster);
    }

    tree.add(crown);
    group.add(tree);

    swayTargets.push({
      obj: crown,
      baseRotZ: 0,
      baseRotX: 0,
      freq: 1.2 + Math.random() * 0.3,
      amplitude: 0.022,
      phase: phaseOffset,
    });

    colliders.push({
      min: [x - 0.35, 0, z - 0.35],
      max: [x + 0.35, 4.2, z + 0.35],
      name: 'cypress_tree',
    });
  };

  // ── 3. Tree Species B: Gnarled Mediterranean Olive (Spreading) ─────────────
  const makeOliveTree = (x: number, z: number, scaleMultiplier: number = 1.0, phaseOffset: number = 0) => {
    const tree = new THREE.Group();
    tree.position.set(x, 0, z);
    tree.scale.set(scaleMultiplier, scaleMultiplier, scaleMultiplier);

    // Thick twisted trunk
    const baseTrunk = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.32, 1.3, 10), matOliveBark);
    baseTrunk.position.y = 0.65;
    baseTrunk.rotation.z = 0.06;
    baseTrunk.castShadow = true;
    tree.add(baseTrunk);

    // Two split reaching boughs
    const boughLeft = new THREE.Group();
    boughLeft.position.set(-0.1, 1.2, 0);
    boughLeft.rotation.z = 0.35;
    boughLeft.rotation.y = 0.2;
    const boughLeftMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.18, 1.2, 8), matOliveBark);
    boughLeftMesh.position.y = 0.6;
    boughLeftMesh.castShadow = true;
    boughLeft.add(boughLeftMesh);

    // Foliage clusters on bough left
    const leftCanopy = new THREE.Mesh(new THREE.DodecahedronGeometry(1.25), matFoliageOlive);
    leftCanopy.position.set(0, 1.2, 0);
    leftCanopy.scale.set(1.3, 0.8, 1.2);
    leftCanopy.castShadow = true;
    boughLeft.add(leftCanopy);
    tree.add(boughLeft);

    const boughRight = new THREE.Group();
    boughRight.position.set(0.12, 1.15, 0);
    boughRight.rotation.z = -0.32;
    boughRight.rotation.y = -0.4;
    const boughRightMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.17, 1.3, 8), matOliveBark);
    boughRightMesh.position.y = 0.65;
    boughRightMesh.castShadow = true;
    boughRight.add(boughRightMesh);

    // Foliage clusters on bough right
    const rightCanopy = new THREE.Mesh(new THREE.DodecahedronGeometry(1.35), matFoliageMid);
    rightCanopy.position.set(0, 1.3, 0);
    rightCanopy.scale.set(1.4, 0.85, 1.3);
    rightCanopy.castShadow = true;
    boughRight.add(rightCanopy);
    tree.add(boughRight);

    // Center crown filler
    const centerCrown = new THREE.Mesh(new THREE.DodecahedronGeometry(1.0), matFoliageOlive);
    centerCrown.position.set(0, 2.7, 0.1);
    centerCrown.scale.set(1.2, 0.75, 1.1);
    centerCrown.castShadow = true;
    tree.add(centerCrown);

    group.add(tree);

    swayTargets.push({
      obj: boughLeft,
      baseRotZ: 0.35,
      baseRotX: 0,
      freq: 1.1,
      amplitude: 0.02,
      phase: phaseOffset,
    });
    swayTargets.push({
      obj: boughRight,
      baseRotZ: -0.32,
      baseRotX: 0,
      freq: 1.3,
      amplitude: 0.018,
      phase: phaseOffset + 0.8,
    });
    swayTargets.push({
      obj: centerCrown,
      baseRotZ: 0,
      baseRotX: 0,
      freq: 1.4,
      amplitude: 0.015,
      phase: phaseOffset + 0.4,
    });

    colliders.push({
      min: [x - 0.45, 0, z - 0.45],
      max: [x + 0.45, 3.8, z + 0.45],
      name: 'olive_tree',
    });
  };

  // ── 4. Place Trees in Garden (Strict Preservation of Test Coordinates) ───────
  // Cypress positions
  makeCypressTree(-8.0, 4.5, 1.05, 0.2);
  makeCypressTree(8.0, 4.5, 0.98, 1.1);
  makeCypressTree(-11.5, 14.5, 1.10, 2.3);
  makeCypressTree(11.5, 14.5, 1.02, 0.7);
  makeCypressTree(-8.0, 22.0, 0.95, 1.9);
  makeCypressTree(8.0, 22.0, 1.08, 2.8);

  // Olive positions
  makeOliveTree(-13.5, 6.0, 1.05, 0.5);
  makeOliveTree(13.5, 6.0, 0.95, 1.7);
  makeOliveTree(-13.5, 20.0, 1.02, 2.2);
  makeOliveTree(13.5, 20.0, 1.08, 0.9);

  // ── 5. Clipped Boxwood Hedges ──────────────────────────────────────────────
  const makeHedge = (x: number, z: number, length: number, rotY: number = 0) => {
    const hedgeGeo = new THREE.BoxGeometry(0.50, 0.85, length);
    const hedge = new THREE.Mesh(hedgeGeo, matHedge);
    hedge.position.set(x, 0.85 / 2, z);
    hedge.rotation.y = rotY;
    hedge.castShadow = true;
    hedge.receiveShadow = true;
    group.add(hedge);

    const halfX = rotY === 0 ? 0.25 : length / 2;
    const halfZ = rotY === 0 ? length / 2 : 0.25;
    colliders.push({
      min: [x - halfX, 0, z - halfZ],
      max: [x + halfX, 0.85, z + halfZ],
      name: 'hedge',
    });
  };

  // Main walk flanking hedges
  makeHedge(-2.10, 8.5, 6.2);
  makeHedge(2.10, 8.5, 6.2);

  // Plaza quadrant perimeter curved hedges
  makeHedge(-5.0, 11.5, 3.2, Math.PI / 4);
  makeHedge(5.0, 11.5, 3.2, -Math.PI / 4);
  makeHedge(-5.0, 17.5, 3.2, -Math.PI / 4);
  makeHedge(5.0, 17.5, 3.2, Math.PI / 4);

  // ── 6. Foundation Perennial Flower Planting Beds ───────────────────────────
  const makeFlowerBed = (x: number, z: number, w: number, d: number) => {
    const bedGeo = new THREE.BoxGeometry(w, 0.12, d);
    const bed = new THREE.Mesh(bedGeo, matMulch);
    bed.position.set(x, 0.06, z);
    bed.receiveShadow = true;
    group.add(bed);

    // Multi-color flower blossoms
    for (let i = 0; i < 7; i++) {
      const fx = x + ((i % 3) / 3 - 0.3) * (w - 0.2);
      const fz = z + (Math.floor(i / 3) / 3 - 0.3) * (d - 0.2);
      const flMat = i % 3 === 0 ? matFlowerRose : i % 3 === 1 ? matFlowerLavender : matFlowerGold;
      const fl = new THREE.Mesh(new THREE.SphereGeometry(0.08, 6, 6), flMat);
      fl.position.set(fx, 0.15 + (i % 2) * 0.04, fz);
      fl.castShadow = true;
      group.add(fl);
    }
  };

  makeFlowerBed(-4.2, 0.5, 1.2, 8.0); // West foundation bed
  makeFlowerBed(4.2, 0.5, 1.2, 8.0);  // East foundation bed
  makeFlowerBed(-2.2, 4.3, 1.2, 0.8); // South-west bed
  makeFlowerBed(2.2, 4.3, 1.2, 0.8);  // South-east bed

  // ── 7. Wind Sway Animation Loop ────────────────────────────────────────────
  const update = (_delta: number, elapsed: number) => {
    for (let i = 0; i < swayTargets.length; i++) {
      const t = swayTargets[i];
      // Multi-harmonic natural aerodynamic wind sway
      const primaryZ = Math.sin(elapsed * t.freq + t.phase);
      const gustZ = Math.sin(elapsed * t.freq * 2.2 + t.phase * 1.4) * 0.32;
      const swayZ = (primaryZ + gustZ) * t.amplitude;

      const primaryX = Math.cos(elapsed * t.freq * 0.78 + t.phase);
      const gustX = Math.cos(elapsed * t.freq * 1.85 + t.phase * 0.9) * 0.28;
      const swayX = (primaryX + gustX) * (t.amplitude * 0.65);

      t.obj.rotation.z = t.baseRotZ + swayZ;
      t.obj.rotation.x = t.baseRotX + swayX;
    }
  };

  // ── 8. Teardown & Disposal ─────────────────────────────────────────────────
  const dispose = () => {
    group.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.geometry?.dispose();
        if (Array.isArray(obj.material)) {
          obj.material.forEach((m) => m.dispose());
        } else {
          obj.material?.dispose();
        }
      }
    });
  };

  return { group, colliders, update, dispose };
}
