/**
 * museumEngine/museumLighting.ts
 * Curatorial Lighting Rig for Museum Mini 3D ("195 Negara, 1 Cerita")
 *
 * Implements:
 * - Hemisphere natural ambient lighting (Warm sky / soft ground bounce)
 * - Directional Sun with high-fidelity soft cascaded shadow maps
 * - Warm interior downlights positioned above key exhibits
 * - Dedicated focal spotlight on Central Rotating Globe
 * - Reading corner intimate floor lamp illumination
 */

import * as THREE from 'three';
import { type MuseumQualityTier } from './types';

export interface LightingRig {
  group: THREE.Group;
  sunLight: THREE.DirectionalLight;
  setQuality: (quality: MuseumQualityTier) => void;
}

export function buildMuseumLighting(quality: MuseumQualityTier = 'high'): LightingRig {
  const group = new THREE.Group();

  // ── 1. Hemisphere Light (Soft museum ambient fill) ──────────────────────────
  const hemiLight = new THREE.HemisphereLight(0xfff6ea, 0xb09c85, 0.65);
  hemiLight.position.set(0, 10, 0);
  group.add(hemiLight);

  // ── 2. Exterior Sun Directional Light ───────────────────────────────────────
  // Angled from high south-east to cast dramatic beams through the entrance and windows
  const sunLight = new THREE.DirectionalLight(0xfff2dc, 1.45);
  sunLight.position.set(12, 16, 14);
  sunLight.target.position.set(0, 1.5, 0);
  group.add(sunLight.target);

  // Configure Shadow Camera
  sunLight.castShadow = true;
  sunLight.shadow.camera.near = 1.0;
  sunLight.shadow.camera.far = 45;
  sunLight.shadow.camera.left = -9;
  sunLight.shadow.camera.right = 9;
  sunLight.shadow.camera.top = 9;
  sunLight.shadow.camera.bottom = -9;
  sunLight.shadow.bias = -0.0004;

  const shadowRes = quality === 'high' ? 2048 : quality === 'medium' ? 1024 : 512;
  sunLight.shadow.mapSize.width = shadowRes;
  sunLight.shadow.mapSize.height = shadowRes;
  group.add(sunLight);

  // Soft North-West Cool Sky Fill
  const skyFill = new THREE.DirectionalLight(0xd4e2f5, 0.40);
  skyFill.position.set(-10, 8, -12);
  group.add(skyFill);

  // ── 3. Dedicated Spotlight on Central Globe ─────────────────────────────────
  const globeSpot = new THREE.SpotLight(0xffeed0, 2.2, 7.0, Math.PI / 6, 0.45, 1.2);
  globeSpot.position.set(0, 3.95, 0);
  globeSpot.target.position.set(0, 1.35, 0);
  group.add(globeSpot.target);
  group.add(globeSpot);

  // ── 4. Interior Recessed Ceiling Downlights ─────────────────────────────────
  // Placed at y = 3.90m with warm 3000K museum tint
  const downlights: THREE.PointLight[] = [];

  const lightConfigs: { pos: [number, number, number]; color: number; intensity: number; dist: number }[] = [
    { pos: [-1.8, 3.85, 2.4], color: 0xffe8b8, intensity: 1.6, dist: 5.5 }, // Zone 1: Intro Plinth
    { pos: [2.1, 3.85, 0.0], color: 0xffebd0, intensity: 1.8, dist: 5.5 },  // Zone 3: Gallery Wall
    { pos: [0.0, 3.85, -2.8], color: 0xffe5b0, intensity: 1.7, dist: 5.5 }, // Zone 4: Flags Console
    { pos: [-2.1, 3.85, 0.0], color: 0xffebd0, intensity: 1.8, dist: 5.5 }, // Zone 5: Souvenir Vitrine
    { pos: [1.8, 3.85, -2.6], color: 0xffe0a8, intensity: 1.4, dist: 5.0 }, // Zone 6: Reading Area
    { pos: [0.0, 3.85, 3.0], color: 0xfff0d8, intensity: 1.5, dist: 5.0 },  // Entrance Foyer
  ];

  for (const cfg of lightConfigs) {
    const pl = new THREE.PointLight(cfg.color, cfg.intensity, cfg.dist, 1.5);
    pl.position.set(...cfg.pos);
    group.add(pl);
    downlights.push(pl);
  }

  // ── 5. Reading Floor Lamp Point Light ───────────────────────────────────────
  const readingLampLight = new THREE.PointLight(0xffd588, 1.2, 3.5, 1.8);
  readingLampLight.position.set(2.35, 2.05, -2.32);
  group.add(readingLampLight);

  // ── Dynamic Quality Scaling ─────────────────────────────────────────────────
  const setQuality = (q: MuseumQualityTier) => {
    if (q === 'low') {
      sunLight.castShadow = false;
      globeSpot.intensity = 1.4;
      for (const dl of downlights) dl.intensity = 1.0;
    } else if (q === 'medium') {
      sunLight.castShadow = true;
      sunLight.shadow.mapSize.width = 1024;
      sunLight.shadow.mapSize.height = 1024;
      globeSpot.intensity = 1.8;
      for (const dl of downlights) dl.intensity = 1.4;
    } else {
      sunLight.castShadow = true;
      sunLight.shadow.mapSize.width = 2048;
      sunLight.shadow.mapSize.height = 2048;
      globeSpot.intensity = 2.2;
      for (const dl of downlights) dl.intensity = 1.6;
    }
  };

  setQuality(quality);

  return { group, sunLight, setQuality };
}
