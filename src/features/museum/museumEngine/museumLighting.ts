/**
 * museumEngine/museumLighting.ts
 * Curatorial & Environmental Lighting Rig for Museum Mini 3D ("195 Negara, 1 Cerita")
 *
 * Implements Phase 5:
 * - Natural hemispheric sky & ground bounce ambient lighting
 * - Primary directional sunlight with wide-estate cascaded shadow mapping and normalBias
 * - Architectural portico entrance accent lighting
 * - Garden promenade lantern illumination
 * - Central fountain underwater aquatic glow
 * - Curatorial interior spotlights for all 6 exhibition zones
 * - Intimate reading corner lamp light
 * - Adaptive performance quality tiers (High / Medium / Low)
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

  // ── 1. Hemisphere Light (Soft Sky & Earth Bounce Ambient) ────────────────────
  const hemiLight = new THREE.HemisphereLight(0xfff6ea, 0x9c8b74, 0.68);
  hemiLight.position.set(0, 16, 0);
  group.add(hemiLight);

  // ── 2. Primary Directional Sunlight with Shadows ───────────────────────────
  // Angled from high south-east to cast dramatic architectural shadows across the garden
  const sunLight = new THREE.DirectionalLight(0xfff2dc, 1.50);
  sunLight.position.set(16, 22, 20);
  sunLight.target.position.set(0, 1.0, 8.0);
  group.add(sunLight.target);

  // Configure Shadow Camera for Garden & Pavilion Bounds
  sunLight.castShadow = true;
  sunLight.shadow.camera.near = 2.0;
  sunLight.shadow.camera.far = 65;
  sunLight.shadow.camera.left = -22;
  sunLight.shadow.camera.right = 22;
  sunLight.shadow.camera.top = 28;
  sunLight.shadow.camera.bottom = -18;
  sunLight.shadow.bias = -0.0003;
  sunLight.shadow.normalBias = 0.02; // Eliminates shadow acne on walls and cylinders

  const shadowRes = quality === 'high' ? 2048 : quality === 'medium' ? 1024 : 512;
  sunLight.shadow.mapSize.width = shadowRes;
  sunLight.shadow.mapSize.height = shadowRes;
  group.add(sunLight);

  // Soft North-West Cool Sky Fill (eliminates crushed black shadows)
  const skyFill = new THREE.DirectionalLight(0xd4e2f5, 0.38);
  skyFill.position.set(-14, 12, -14);
  group.add(skyFill);

  // ── 3. Portico Entrance Warm Downlight ─────────────────────────────────────
  // Mounted under the cantilevered canopy, illuminating entrance steps & doors
  const porticoLight = new THREE.PointLight(0xffe0a8, 1.6, 6.0, 1.6);
  porticoLight.position.set(0, 3.65, 4.45);
  group.add(porticoLight);

  // ── 4. Garden Promenade Lantern Lights ──────────────────────────────────────
  const gardenLights: THREE.PointLight[] = [];
  const lanternCoords: [number, number, number][] = [
    [-1.9, 2.5, 6.0],
    [1.9, 2.5, 6.0],
    [-1.9, 2.5, 11.0],
    [1.9, 2.5, 11.0],
  ];

  for (const [lx, ly, lz] of lanternCoords) {
    const pLight = new THREE.PointLight(0xffd588, 1.1, 5.5, 1.8);
    pLight.position.set(lx, ly, lz);
    group.add(pLight);
    gardenLights.push(pLight);
  }

  // ── 5. Central Fountain Underwater Aquatic Accent Light ─────────────────────
  const fountainGlow = new THREE.PointLight(0x44dddd, 1.1, 5.0, 1.8);
  fountainGlow.position.set(0, 0.45, 14.5);
  group.add(fountainGlow);

  // ── 6. Dedicated Spotlight on Central Globe ─────────────────────────────────
  const globeSpot = new THREE.SpotLight(0xffeed0, 2.2, 7.5, Math.PI / 6, 0.45, 1.2);
  globeSpot.position.set(0, 3.95, 0);
  globeSpot.target.position.set(0, 1.35, 0);
  group.add(globeSpot.target);
  group.add(globeSpot);

  // ── 7. Interior Recessed Ceiling Downlights ─────────────────────────────────
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

  // ── 8. Reading Floor Lamp Point Light ───────────────────────────────────────
  const readingLampLight = new THREE.PointLight(0xffd588, 1.2, 3.5, 1.8);
  readingLampLight.position.set(2.35, 2.05, -2.32);
  group.add(readingLampLight);

  // ── 9. Dynamic Quality Scaling Tier ─────────────────────────────────────────
  const setQuality = (q: MuseumQualityTier) => {
    if (q === 'low') {
      sunLight.castShadow = false;
      globeSpot.intensity = 1.3;
      porticoLight.intensity = 1.0;
      fountainGlow.intensity = 0.8;
      for (const dl of downlights) dl.intensity = 1.0;
      for (const gl of gardenLights) gl.intensity = 0.7;
    } else if (q === 'medium') {
      sunLight.castShadow = true;
      sunLight.shadow.mapSize.width = 1024;
      sunLight.shadow.mapSize.height = 1024;
      globeSpot.intensity = 1.8;
      porticoLight.intensity = 1.4;
      fountainGlow.intensity = 1.0;
      for (const dl of downlights) dl.intensity = 1.4;
      for (const gl of gardenLights) gl.intensity = 0.9;
    } else {
      sunLight.castShadow = true;
      sunLight.shadow.mapSize.width = 2048;
      sunLight.shadow.mapSize.height = 2048;
      globeSpot.intensity = 2.2;
      porticoLight.intensity = 1.6;
      fountainGlow.intensity = 1.1;
      for (const dl of downlights) dl.intensity = 1.6;
      for (const gl of gardenLights) gl.intensity = 1.1;
    }
  };

  setQuality(quality);

  return { group, sunLight, setQuality };
}
