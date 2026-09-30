import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import { Country, Memory } from '../../core/contracts';
import { ArchivalMedia } from '../../components/ui/ArchivalMedia';
import { COUNTRY_COORDINATES } from '../../data/countries';
import { getCountryLandmark, LandmarkInfo, LandmarkType } from '../../data/landmarks';
import { storageService } from '../../core/services/storageService';
import {
  RotateCw,
  RotateCcw,
  Play,
  Pause,
  ArrowRight,
  MapPin,
  Calendar,
  Sparkles,
  ZoomIn,
  ZoomOut,
  Search,
  X,
  CheckCircle,
  Navigation,
  Globe as GlobeIcon,
  Compass,
  Activity,
  Sun,
  ExternalLink,
} from 'lucide-react';
import { geoToVector3 } from '../../atlas/geo/geoToVector3';
import { calculateSolarPosition, SolarPosition } from '../../atlas/globe/solarCalculations';
import { countryRegistry, SearchMatch } from '../../atlas/countries/countryRegistry';
import { CanonicalCountry } from '../../atlas/countries/canonicalCountries';
import { MarkerLegend } from '../../atlas/markers/MarkerLegend';
import { AssetCoverageDashboard } from '../../atlas/diagnostics/AssetCoverageDashboard';

interface Globe3DProps {
  countries: Country[];
  memories: Memory[];
  onSelectCountry: (code: string) => void;
  onSelectMemory: (id: string) => void;
}

interface HoveredCountryInfo {
  country: Country;
  landmark?: LandmarkInfo;
  screenX: number;
  screenY: number;
}

/**
 * Procedural fallback canvas texture to guarantee instant photorealistic rendering
 */
function createProceduralEarthTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // 1. Deep ocean base with realistic gradient
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, 512);
  oceanGrad.addColorStop(0, '#0a2342');
  oceanGrad.addColorStop(0.5, '#0d325c');
  oceanGrad.addColorStop(1, '#0a2342');
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, 1024, 512);

  // 2. Continents silhouette
  ctx.fillStyle = '#1e3f20'; // Lush vegetation / landmass
  ctx.beginPath();
  ctx.ellipse(600, 200, 200, 100, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#2d5a27';
  ctx.beginPath();
  ctx.ellipse(540, 290, 90, 110, 0.2, 0, Math.PI * 2); // Africa
  ctx.fill();
  ctx.fillStyle = '#264e26';
  ctx.beginPath();
  ctx.ellipse(280, 170, 110, 80, -0.2, 0, Math.PI * 2); // North America
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(330, 330, 70, 100, 0.3, 0, Math.PI * 2); // South America
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(820, 360, 60, 45, 0, 0, Math.PI * 2); // Australia
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Shared materials for 3D landmarks (Rich natural, historic, and metallic palette)
const landmarkMaterials = {
  ancientStone: new THREE.MeshStandardMaterial({ color: 0x57534e, roughness: 0.85, metalness: 0.1 }),
  warmSandstone: new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.9, metalness: 0.05 }),
  terracotta: new THREE.MeshStandardMaterial({ color: 0xc2410c, roughness: 0.85, metalness: 0.1 }),
  graniteGrey: new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.8, metalness: 0.15 }),
  castleStone: new THREE.MeshStandardMaterial({ color: 0x78716c, roughness: 0.85, metalness: 0.1 }),
  warmIvory: new THREE.MeshStandardMaterial({ color: 0xe7e5e4, roughness: 0.4, metalness: 0.15 }),
  pagodaRed: new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.45, metalness: 0.2 }),
  orientalJade: new THREE.MeshStandardMaterial({ color: 0x0f766e, roughness: 0.4, metalness: 0.3 }),
  antiqueBronze: new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.5, metalness: 0.75 }),
  gold: new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xb45309, emissiveIntensity: 0.45, roughness: 0.2, metalness: 0.9 }),
  darkBasalt: new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.9, metalness: 0.1 }),
  wroughtIron: new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5, metalness: 0.7 }),
  copperPatina: new THREE.MeshStandardMaterial({ color: 0x0d9488, roughness: 0.45, metalness: 0.4 }),
  onionBlue: new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.35, metalness: 0.3 }),
  alpineSnow: new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3, metalness: 0.05 }),
};

function buildLandmark3D(landmark: LandmarkInfo): { group: THREE.Group; apexHeight: number } {
  const group = new THREE.Group();
  let apexHeight = landmark.height;

  switch (landmark.type) {
    case 'monas': {
      // 1. Cawan pelataran bawah
      const base = new THREE.Mesh(new THREE.BoxGeometry(0.040, 0.006, 0.040), landmarkMaterials.warmIvory);
      base.position.y = 0.003;
      // 2. Cawan tengah
      const tray = new THREE.Mesh(new THREE.BoxGeometry(0.026, 0.005, 0.026), landmarkMaterials.graniteGrey);
      tray.position.y = 0.0085;
      // 3. Tiang obelisk menjulang
      const shaft = new THREE.Mesh(new THREE.BoxGeometry(0.007, 0.048, 0.007), landmarkMaterials.warmIvory);
      shaft.position.y = 0.035;
      // 4. Lidah Api Emas Kemerdekaan
      const flame = new THREE.Mesh(new THREE.ConeGeometry(0.005, 0.014, 6), landmarkMaterials.gold);
      flame.position.y = 0.066;
      group.add(base, tray, shaft, flame);
      apexHeight = 0.073;
      break;
    }
    case 'eiffel': {
      const legBase = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.028, 0.028, 4), landmarkMaterials.wroughtIron);
      legBase.rotation.y = Math.PI / 4;
      legBase.position.y = 0.014;
      const deck = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.004, 0.018), landmarkMaterials.wroughtIron);
      deck.position.y = 0.030;
      const spire = new THREE.Mesh(new THREE.CylinderGeometry(0.002, 0.008, 0.048, 4), landmarkMaterials.wroughtIron);
      spire.rotation.y = Math.PI / 4;
      spire.position.y = 0.054;
      group.add(legBase, deck, spire);
      apexHeight = 0.078;
      break;
    }
    case 'pagoda': {
      // Tier 1
      const b1 = new THREE.Mesh(new THREE.BoxGeometry(0.028, 0.005, 0.028), landmarkMaterials.pagodaRed);
      b1.position.y = 0.0025;
      const r1 = new THREE.Mesh(new THREE.ConeGeometry(0.024, 0.005, 4), landmarkMaterials.orientalJade);
      r1.position.y = 0.007;
      r1.rotation.y = Math.PI / 4;
      // Tier 2
      const b2 = new THREE.Mesh(new THREE.BoxGeometry(0.020, 0.005, 0.020), landmarkMaterials.pagodaRed);
      b2.position.y = 0.012;
      const r2 = new THREE.Mesh(new THREE.ConeGeometry(0.018, 0.005, 4), landmarkMaterials.orientalJade);
      r2.position.y = 0.0165;
      r2.rotation.y = Math.PI / 4;
      // Tier 3
      const b3 = new THREE.Mesh(new THREE.BoxGeometry(0.014, 0.005, 0.014), landmarkMaterials.pagodaRed);
      b3.position.y = 0.0215;
      const r3 = new THREE.Mesh(new THREE.ConeGeometry(0.013, 0.005, 4), landmarkMaterials.orientalJade);
      r3.position.y = 0.026;
      r3.rotation.y = Math.PI / 4;
      // Spire
      const spire = new THREE.Mesh(new THREE.CylinderGeometry(0.001, 0.003, 0.018, 6), landmarkMaterials.gold);
      spire.position.y = 0.036;
      group.add(b1, r1, b2, r2, b3, r3, spire);
      apexHeight = 0.046;
      break;
    }
    case 'pyramid': {
      const base = new THREE.Mesh(new THREE.BoxGeometry(0.038, 0.003, 0.038), landmarkMaterials.ancientStone);
      base.position.y = 0.0015;
      const pyr = new THREE.Mesh(new THREE.ConeGeometry(0.032, 0.038, 4), landmarkMaterials.warmSandstone);
      pyr.position.y = 0.020;
      pyr.rotation.y = Math.PI / 4;
      const cap = new THREE.Mesh(new THREE.ConeGeometry(0.007, 0.009, 4), landmarkMaterials.gold);
      cap.position.y = 0.036;
      cap.rotation.y = Math.PI / 4;
      group.add(base, pyr, cap);
      apexHeight = 0.041;
      break;
    }
    case 'meso_pyramid': {
      // Piramida Bertingkat Maya / Aztek (Chichen Itza, Tikal, Copan)
      const t1 = new THREE.Mesh(new THREE.BoxGeometry(0.038, 0.006, 0.038), landmarkMaterials.ancientStone);
      t1.position.y = 0.003;
      const t2 = new THREE.Mesh(new THREE.BoxGeometry(0.030, 0.006, 0.030), landmarkMaterials.terracotta);
      t2.position.y = 0.009;
      const t3 = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.006, 0.022), landmarkMaterials.ancientStone);
      t3.position.y = 0.015;
      const temple = new THREE.Mesh(new THREE.BoxGeometry(0.013, 0.009, 0.013), landmarkMaterials.warmSandstone);
      temple.position.y = 0.0225;
      const stairs = new THREE.Mesh(new THREE.BoxGeometry(0.006, 0.020, 0.039), landmarkMaterials.ancientStone);
      stairs.position.y = 0.010;
      stairs.rotation.x = -0.28;
      group.add(t1, t2, t3, temple, stairs);
      apexHeight = 0.028;
      break;
    }
    case 'inca_citadel': {
      // Benteng Teras Batu Kuno Inka (Machu Picchu, Tiwanaku, Sigiriya)
      const lowerTerrace = new THREE.Mesh(new THREE.BoxGeometry(0.038, 0.007, 0.032), landmarkMaterials.graniteGrey);
      lowerTerrace.position.y = 0.0035;
      const upperTerrace = new THREE.Mesh(new THREE.BoxGeometry(0.026, 0.008, 0.022), landmarkMaterials.ancientStone);
      upperTerrace.position.set(0.004, 0.010, -0.003);
      const sanctuary = new THREE.Mesh(new THREE.BoxGeometry(0.014, 0.010, 0.012), landmarkMaterials.warmSandstone);
      sanctuary.position.set(-0.005, 0.017, 0.002);
      const sunStone = new THREE.Mesh(new THREE.ConeGeometry(0.004, 0.008, 4), landmarkMaterials.gold);
      sunStone.position.set(-0.005, 0.025, 0.002);
      group.add(lowerTerrace, upperTerrace, sanctuary, sunStone);
      apexHeight = 0.030;
      break;
    }
    case 'colosseum': {
      const arena = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.030, 0.020, 16), landmarkMaterials.warmSandstone);
      arena.position.y = 0.010;
      const interior = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.021, 16), landmarkMaterials.darkBasalt);
      interior.position.y = 0.0105;
      const rim = new THREE.Mesh(new THREE.TorusGeometry(0.026, 0.002, 6, 16), landmarkMaterials.ancientStone);
      rim.rotation.x = Math.PI / 2;
      rim.position.y = 0.020;
      group.add(arena, interior, rim);
      apexHeight = 0.022;
      break;
    }
    case 'tajmahal': {
      const plinth = new THREE.Mesh(new THREE.BoxGeometry(0.036, 0.005, 0.036), landmarkMaterials.terracotta);
      plinth.position.y = 0.0025;
      const main = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.016, 0.022), landmarkMaterials.warmIvory);
      main.position.y = 0.013;
      const dome = new THREE.Mesh(new THREE.SphereGeometry(0.010, 12, 12), landmarkMaterials.warmIvory);
      dome.position.y = 0.024;
      const finial = new THREE.Mesh(new THREE.ConeGeometry(0.002, 0.010, 6), landmarkMaterials.gold);
      finial.position.y = 0.033;
      const mOffsets = [-0.014, 0.014];
      for (const mx of mOffsets) {
        for (const mz of mOffsets) {
          const minaret = new THREE.Mesh(new THREE.CylinderGeometry(0.002, 0.0025, 0.028, 6), landmarkMaterials.warmIvory);
          minaret.position.set(mx, 0.014, mz);
          const mTip = new THREE.Mesh(new THREE.ConeGeometry(0.002, 0.005, 6), landmarkMaterials.gold);
          mTip.position.set(mx, 0.029, mz);
          group.add(minaret, mTip);
        }
      }
      group.add(plinth, main, dome, finial);
      apexHeight = 0.038;
      break;
    }
    case 'operahouse': {
      const plinth = new THREE.Mesh(new THREE.BoxGeometry(0.040, 0.006, 0.028), landmarkMaterials.graniteGrey);
      plinth.position.y = 0.003;
      group.add(plinth);
      for (let i = 0; i < 3; i++) {
        const sail = new THREE.Mesh(new THREE.ConeGeometry(0.012 - i * 0.002, 0.022 - i * 0.003, 5), landmarkMaterials.warmIvory);
        sail.position.set(-0.012 + i * 0.012, 0.014 - i * 0.002, 0);
        sail.rotation.z = -0.2;
        group.add(sail);
      }
      apexHeight = 0.028;
      break;
    }
    case 'kaaba': {
      const courtyard = new THREE.Mesh(new THREE.BoxGeometry(0.038, 0.003, 0.038), landmarkMaterials.warmIvory);
      courtyard.position.y = 0.0015;
      const cube = new THREE.Mesh(new THREE.BoxGeometry(0.026, 0.026, 0.026), landmarkMaterials.darkBasalt);
      cube.position.y = 0.015;
      const kiswah = new THREE.Mesh(new THREE.BoxGeometry(0.027, 0.003, 0.027), landmarkMaterials.gold);
      kiswah.position.y = 0.023;
      group.add(courtyard, cube, kiswah);
      apexHeight = 0.029;
      break;
    }
    case 'christ': {
      const crag = new THREE.Mesh(new THREE.ConeGeometry(0.022, 0.016, 6), landmarkMaterials.darkBasalt);
      crag.position.y = 0.008;
      const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.009, 0.008, 6), landmarkMaterials.ancientStone);
      pedestal.position.y = 0.018;
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.006, 0.028, 6), landmarkMaterials.warmIvory);
      body.position.y = 0.034;
      const arms = new THREE.Mesh(new THREE.BoxGeometry(0.034, 0.004, 0.004), landmarkMaterials.warmIvory);
      arms.position.y = 0.043;
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.004, 8, 8), landmarkMaterials.warmIvory);
      head.position.y = 0.049;
      group.add(crag, pedestal, body, arms, head);
      apexHeight = 0.054;
      break;
    }
    case 'petronas': {
      for (let i = 0; i < 2; i++) {
        const xOffset = i === 0 ? -0.009 : 0.009;
        const tower = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.007, 0.052, 8), landmarkMaterials.wroughtIron);
        tower.position.set(xOffset, 0.026, 0);
        const spire = new THREE.Mesh(new THREE.ConeGeometry(0.002, 0.018, 6), landmarkMaterials.gold);
        spire.position.set(xOffset, 0.058, 0);
        group.add(tower, spire);
      }
      const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.003, 0.004), landmarkMaterials.wroughtIron);
      bridge.position.y = 0.028;
      group.add(bridge);
      apexHeight = 0.068;
      break;
    }
    case 'angkor': {
      const base = new THREE.Mesh(new THREE.BoxGeometry(0.036, 0.008, 0.036), landmarkMaterials.terracotta);
      base.position.y = 0.004;
      const mid = new THREE.Mesh(new THREE.BoxGeometry(0.026, 0.006, 0.026), landmarkMaterials.ancientStone);
      mid.position.y = 0.011;
      const cTower = new THREE.Mesh(new THREE.ConeGeometry(0.008, 0.030, 6), landmarkMaterials.warmSandstone);
      cTower.position.y = 0.027;
      const offsets = [-0.011, 0.011];
      for (const ox of offsets) {
        for (const oz of offsets) {
          const cornerTower = new THREE.Mesh(new THREE.ConeGeometry(0.005, 0.018, 6), landmarkMaterials.warmSandstone);
          cornerTower.position.set(ox, 0.020, oz);
          group.add(cornerTower);
        }
      }
      group.add(base, mid, cTower);
      apexHeight = 0.043;
      break;
    }
    case 'burj': {
      const t1 = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.015, 0.026, 6), landmarkMaterials.wroughtIron);
      t1.position.y = 0.013;
      const t2 = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.010, 0.028, 6), landmarkMaterials.orientalJade);
      t2.position.y = 0.039;
      const t3 = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.006, 0.022, 6), landmarkMaterials.wroughtIron);
      t3.position.y = 0.063;
      const needle = new THREE.Mesh(new THREE.CylinderGeometry(0.001, 0.003, 0.022, 6), landmarkMaterials.gold);
      needle.position.y = 0.083;
      group.add(t1, t2, t3, needle);
      apexHeight = 0.094;
      break;
    }
    case 'hallgrim': {
      const heights = [0.015, 0.025, 0.036];
      const offsets = [0.015, 0.010, 0.005];
      for (let i = 0; i < 3; i++) {
        const colL = new THREE.Mesh(new THREE.BoxGeometry(0.004, heights[i], 0.012), landmarkMaterials.graniteGrey);
        colL.position.set(-offsets[i], heights[i] / 2, 0);
        const colR = new THREE.Mesh(new THREE.BoxGeometry(0.004, heights[i], 0.012), landmarkMaterials.graniteGrey);
        colR.position.set(offsets[i], heights[i] / 2, 0);
        group.add(colL, colR);
      }
      const belfry = new THREE.Mesh(new THREE.BoxGeometry(0.009, 0.048, 0.014), landmarkMaterials.ancientStone);
      belfry.position.y = 0.024;
      const spire = new THREE.Mesh(new THREE.ConeGeometry(0.007, 0.022, 4), landmarkMaterials.ancientStone);
      spire.position.y = 0.057;
      spire.rotation.y = Math.PI / 4;
      group.add(belfry, spire);
      apexHeight = 0.068;
      break;
    }
    case 'bigben': {
      const shaft = new THREE.Mesh(new THREE.BoxGeometry(0.016, 0.044, 0.016), landmarkMaterials.warmSandstone);
      shaft.position.y = 0.022;
      const clock = new THREE.Mesh(new THREE.BoxGeometry(0.020, 0.010, 0.020), landmarkMaterials.ancientStone);
      clock.position.y = 0.048;
      const dial = new THREE.Mesh(new THREE.BoxGeometry(0.021, 0.006, 0.021), landmarkMaterials.gold);
      dial.position.y = 0.048;
      const spire = new THREE.Mesh(new THREE.ConeGeometry(0.013, 0.020, 4), landmarkMaterials.wroughtIron);
      spire.position.y = 0.062;
      spire.rotation.y = Math.PI / 4;
      group.add(shaft, clock, dial, spire);
      apexHeight = 0.072;
      break;
    }
    case 'brandenburg': {
      const base = new THREE.Mesh(new THREE.BoxGeometry(0.038, 0.004, 0.016), landmarkMaterials.warmSandstone);
      base.position.y = 0.002;
      for (let i = -2; i <= 2; i++) {
        const col = new THREE.Mesh(new THREE.CylinderGeometry(0.002, 0.0025, 0.022, 6), landmarkMaterials.warmIvory);
        col.position.set(i * 0.007, 0.013, 0);
        group.add(col);
      }
      const roof = new THREE.Mesh(new THREE.BoxGeometry(0.038, 0.005, 0.018), landmarkMaterials.warmSandstone);
      roof.position.y = 0.026;
      const quadriga = new THREE.Mesh(new THREE.BoxGeometry(0.014, 0.008, 0.008), landmarkMaterials.antiqueBronze);
      quadriga.position.y = 0.032;
      const spear = new THREE.Mesh(new THREE.CylinderGeometry(0.001, 0.001, 0.014, 4), landmarkMaterials.gold);
      spear.position.set(0, 0.039, 0);
      group.add(base, roof, quadriga, spear);
      apexHeight = 0.046;
      break;
    }
    case 'windmills': {
      const millBase = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.016, 0.022, 8), landmarkMaterials.terracotta);
      millBase.position.y = 0.011;
      const cap = new THREE.Mesh(new THREE.ConeGeometry(0.012, 0.010, 8), landmarkMaterials.wroughtIron);
      cap.position.y = 0.027;
      const sailH = new THREE.Mesh(new THREE.BoxGeometry(0.036, 0.003, 0.001), landmarkMaterials.antiqueBronze);
      sailH.position.set(0, 0.026, 0.011);
      const sailV = new THREE.Mesh(new THREE.BoxGeometry(0.003, 0.036, 0.001), landmarkMaterials.antiqueBronze);
      sailV.position.set(0, 0.026, 0.011);
      group.add(millBase, cap, sailH, sailV);
      apexHeight = 0.045;
      break;
    }
    case 'parthenon': {
      const crep = new THREE.Mesh(new THREE.BoxGeometry(0.038, 0.005, 0.024), landmarkMaterials.warmSandstone);
      crep.position.y = 0.0025;
      for (let x = -0.014; x <= 0.014; x += 0.007) {
        for (let z of [-0.008, 0.008]) {
          const col = new THREE.Mesh(new THREE.CylinderGeometry(0.0018, 0.0022, 0.016, 6), landmarkMaterials.warmIvory);
          col.position.set(x, 0.013, z);
          group.add(col);
        }
      }
      const roof = new THREE.Mesh(new THREE.CylinderGeometry(0.013, 0.013, 0.038, 3), landmarkMaterials.warmSandstone);
      roof.position.y = 0.025;
      roof.rotation.z = Math.PI / 2;
      group.add(crep, roof);
      apexHeight = 0.032;
      break;
    }
    case 'sagrada': {
      const nave = new THREE.Mesh(new THREE.BoxGeometry(0.032, 0.016, 0.024), landmarkMaterials.warmSandstone);
      nave.position.y = 0.008;
      group.add(nave);
      const tX = [-0.009, -0.003, 0.003, 0.009];
      for (let i = 0; i < 4; i++) {
        const height = i === 1 || i === 2 ? 0.052 : 0.042;
        const sp = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.005, height, 6), landmarkMaterials.warmSandstone);
        sp.position.set(tX[i], height / 2 + 0.008, 0);
        const fin = new THREE.Mesh(new THREE.ConeGeometry(0.003, 0.010, 6), landmarkMaterials.gold);
        fin.position.set(tX[i], height + 0.012, 0);
        group.add(sp, fin);
      }
      apexHeight = 0.068;
      break;
    }
    case 'basil': {
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.028, 0.018, 0.028), landmarkMaterials.terracotta);
      body.position.y = 0.009;
      const cDome = new THREE.Mesh(new THREE.SphereGeometry(0.007, 10, 10), landmarkMaterials.gold);
      cDome.position.y = 0.026;
      const cTip = new THREE.Mesh(new THREE.ConeGeometry(0.002, 0.012, 6), landmarkMaterials.gold);
      cTip.position.y = 0.036;
      const offsets = [-0.009, 0.009];
      const domeMats = [landmarkMaterials.onionBlue, landmarkMaterials.pagodaRed, landmarkMaterials.orientalJade, landmarkMaterials.gold];
      let dIdx = 0;
      for (const ox of offsets) {
        for (const oz of offsets) {
          const cornerDome = new THREE.Mesh(new THREE.SphereGeometry(0.005, 8, 8), domeMats[dIdx % domeMats.length]);
          cornerDome.position.set(ox, 0.022, oz);
          group.add(cornerDome);
          dIdx++;
        }
      }
      group.add(body, cDome, cTip);
      apexHeight = 0.044;
      break;
    }
    case 'castle': {
      const wall = new THREE.Mesh(new THREE.BoxGeometry(0.032, 0.014, 0.024), landmarkMaterials.castleStone);
      wall.position.y = 0.007;
      const keep = new THREE.Mesh(new THREE.BoxGeometry(0.014, 0.028, 0.014), landmarkMaterials.castleStone);
      keep.position.y = 0.014;
      const keepRoof = new THREE.Mesh(new THREE.ConeGeometry(0.011, 0.012, 4), landmarkMaterials.terracotta);
      keepRoof.position.y = 0.034;
      keepRoof.rotation.y = Math.PI / 4;
      const offsets = [-0.014, 0.014];
      for (const ox of offsets) {
        for (const oz of [-0.010, 0.010]) {
          const tower = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.006, 0.024, 8), landmarkMaterials.castleStone);
          tower.position.set(ox, 0.012, oz);
          const tRoof = new THREE.Mesh(new THREE.ConeGeometry(0.005, 0.009, 8), landmarkMaterials.wroughtIron);
          tRoof.position.set(ox, 0.028, oz);
          group.add(tower, tRoof);
        }
      }
      group.add(wall, keep, keepRoof);
      apexHeight = 0.040;
      break;
    }
    case 'adobe_mosque': {
      const base = new THREE.Mesh(new THREE.BoxGeometry(0.036, 0.012, 0.028), landmarkMaterials.terracotta);
      base.position.y = 0.006;
      for (let i = -1; i <= 1; i++) {
        const minaret = new THREE.Mesh(new THREE.ConeGeometry(0.005, 0.026, 6), landmarkMaterials.warmSandstone);
        minaret.position.set(i * 0.011, 0.023, 0.010);
        const finial = new THREE.Mesh(new THREE.SphereGeometry(0.003, 6, 6), landmarkMaterials.warmIvory);
        finial.position.set(i * 0.011, 0.036, 0.010);
        group.add(minaret, finial);
      }
      group.add(base);
      apexHeight = 0.039;
      break;
    }
    case 'rock_church': {
      const trench = new THREE.Mesh(new THREE.BoxGeometry(0.036, 0.006, 0.036), landmarkMaterials.darkBasalt);
      trench.position.y = 0.003;
      const crossA = new THREE.Mesh(new THREE.BoxGeometry(0.024, 0.018, 0.008), landmarkMaterials.terracotta);
      crossA.position.y = 0.012;
      const crossB = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.018, 0.024), landmarkMaterials.terracotta);
      crossB.position.y = 0.012;
      const topCross = new THREE.Mesh(new THREE.SphereGeometry(0.004, 6, 6), landmarkMaterials.gold);
      topCross.position.y = 0.023;
      group.add(trench, crossA, crossB, topCross);
      apexHeight = 0.027;
      break;
    }
    case 'moai': {
      const platform = new THREE.Mesh(new THREE.BoxGeometry(0.032, 0.006, 0.022), landmarkMaterials.darkBasalt);
      platform.position.y = 0.003;
      for (let i = -1; i <= 1; i += 2) {
        const head = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.024, 0.010), landmarkMaterials.graniteGrey);
        head.position.set(i * 0.008, 0.017, 0);
        head.rotation.x = -0.12;
        const pukao = new THREE.Mesh(new THREE.CylinderGeometry(0.0045, 0.0045, 0.006, 8), landmarkMaterials.terracotta);
        pukao.position.set(i * 0.008, 0.031, -0.001);
        group.add(head, pukao);
      }
      group.add(platform);
      apexHeight = 0.034;
      break;
    }
    case 'nature_peak': {
      const mountain = new THREE.Mesh(new THREE.ConeGeometry(0.034, 0.028, 6), landmarkMaterials.darkBasalt);
      mountain.position.y = 0.014;
      const snowcap = new THREE.Mesh(new THREE.ConeGeometry(0.017, 0.016, 6), landmarkMaterials.alpineSnow);
      snowcap.position.y = 0.025;
      group.add(mountain, snowcap);
      apexHeight = 0.034;
      break;
    }
    case 'triumphal_arch': {
      const p1 = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.022, 0.014), landmarkMaterials.warmSandstone);
      p1.position.set(-0.010, 0.011, 0);
      const p2 = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.022, 0.014), landmarkMaterials.warmSandstone);
      p2.position.set(0.010, 0.011, 0);
      const attic = new THREE.Mesh(new THREE.BoxGeometry(0.032, 0.009, 0.016), landmarkMaterials.warmSandstone);
      attic.position.set(0, 0.026, 0);
      const crest = new THREE.Mesh(new THREE.BoxGeometry(0.016, 0.005, 0.010), landmarkMaterials.antiqueBronze);
      crest.position.set(0, 0.033, 0);
      group.add(p1, p2, attic, crest);
      apexHeight = 0.036;
      break;
    }
    case 'liberty': {
      const base = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.018, 0.022), landmarkMaterials.ancientStone);
      base.position.y = 0.009;
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.008, 0.034, 8), landmarkMaterials.copperPatina);
      body.position.y = 0.034;
      const torch = new THREE.Mesh(new THREE.ConeGeometry(0.003, 0.012, 6), landmarkMaterials.gold);
      torch.position.set(0.006, 0.052, 0);
      group.add(base, body, torch);
      apexHeight = 0.058;
      break;
    }
    case 'monument':
    default: {
      // Monumen Warisan Budaya & Sejarah Kebangsaan (Granit & Perunggu Artistik - Bukan Menara Putih!)
      const step1 = new THREE.Mesh(new THREE.BoxGeometry(0.030, 0.005, 0.030), landmarkMaterials.ancientStone);
      step1.position.y = 0.0025;
      const step2 = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.005, 0.022), landmarkMaterials.graniteGrey);
      step2.position.y = 0.007;
      const pedestal = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.016, 0.012), landmarkMaterials.antiqueBronze);
      pedestal.position.y = 0.0175;
      const crown = new THREE.Mesh(new THREE.SphereGeometry(0.0055, 8, 8), landmarkMaterials.gold);
      crown.position.y = 0.029;
      group.add(step1, step2, pedestal, crown);
      apexHeight = 0.034;
      break;
    }
  }

  return { group, apexHeight };
}

export const Globe3D: React.FC<Globe3DProps> = ({
  countries,
  memories,
  onSelectCountry,
  onSelectMemory,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [filterMode, setFilterMode] = useState<'all' | 'visited' | 'unvisited'>('all');
  const [selectedContinent, setSelectedContinent] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Selected Pin modal with full Canonical Country metadata
  const [selectedPin, setSelectedPin] = useState<{
    country: Country;
    canonical?: CanonicalCountry;
    landmark?: LandmarkInfo;
    memory?: Memory;
  } | null>(null);

  const [isQADashboardOpen, setIsQADashboardOpen] = useState(false);
  const [solarInfo, setSolarInfo] = useState<SolarPosition>(() => calculateSolarPosition());

  // Hover Tooltip
  const [hoveredCountry, setHoveredCountry] = useState<HoveredCountryInfo | null>(null);

  // Scene references for animations
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const globeGroupRef = useRef<THREE.Group | null>(null);
  const pinsGroupRef = useRef<THREE.Group | null>(null);
  const pinMeshesRef = useRef<THREE.Mesh[]>([]);

  // Smooth target rotation state
  const targetRotationRef = useRef<{ x: number; y: number } | null>(null);
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const touchStartPosRef = useRef({ x: 0, y: 0 });

  // Map of memories by country code
  const memoriesByCountry = useMemo(() => {
    const map = new Map<string, Memory[]>();
    memories.forEach(m => {
      const list = map.get(m.countryCode) || [];
      list.push(m);
      map.set(m.countryCode, list);
    });
    return map;
  }, [memories]);

  // Filtered countries for display (considering Continent and Status)
  const displayedCountries = useMemo(() => {
    return countries.filter(c => {
      // Continent filter
      if (selectedContinent !== 'all' && c.continent !== selectedContinent) {
        return false;
      }
      // Status filter
      if (filterMode === 'visited' && c.status !== 'visited' && c.status !== 'documented') {
        return false;
      }
      if (filterMode === 'unvisited' && (c.status === 'visited' || c.status === 'documented')) {
        return false;
      }
      return true;
    });
  }, [countries, filterMode, selectedContinent]);

  // Global search across countries, capitals, landmarks, and ISO codes
  const searchResults: SearchMatch[] = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return countryRegistry.search(searchQuery, 8);
  }, [searchQuery]);

  // Statistics counters
  const stats = useMemo(() => {
    const total = countries.length;
    const visited = countries.filter(c => c.status === 'visited' || c.status === 'documented').length;
    const unvisited = total - visited;
    return { total, visited, unvisited };
  }, [countries]);

  // Smoothly rotate globe to center a target country
  const focusOnCountry = useCallback((code: string) => {
    const coords = COUNTRY_COORDINATES[code.toUpperCase()];
    if (!coords || !globeGroupRef.current) return;

    const latRad = (coords.lat * Math.PI) / 180;
    const lngRad = (coords.lng * Math.PI) / 180;

    targetRotationRef.current = {
      x: latRad * 0.7,
      y: -lngRad - Math.PI / 2
    };

    const targetCountry = countries.find(c => c.code.toUpperCase() === code.toUpperCase()) || {
      code: code.toUpperCase(),
      name: countryRegistry.getById(code)?.displayName || code,
      continent: (countryRegistry.getById(code)?.region as any) || 'Asia',
      status: 'unknown' as const,
    };
    const canonical = countryRegistry.getById(code);
    const countryMemories = memoriesByCountry.get(targetCountry.code);
    setSelectedPin({
      country: targetCountry,
      canonical,
      landmark: getCountryLandmark(targetCountry.code, targetCountry.name),
      memory: countryMemories && countryMemories.length > 0 ? countryMemories[0] : undefined,
    });
  }, [countries, memoriesByCountry]);

  // Toggle visited status directly from card
  const handleToggleVisited = (code: string) => {
    const current = countries.find(c => c.code === code);
    if (!current) return;
    const nextStatus = (current.status === 'visited' || current.status === 'documented') ? 'unknown' : 'visited';
    storageService.updateCountry(code, { status: nextStatus });
    if (selectedPin && selectedPin.country.code === code) {
      setSelectedPin({
        ...selectedPin,
        country: { ...selectedPin.country, status: nextStatus },
        landmark: selectedPin.landmark || getCountryLandmark(code, current.name),
      });
    }
  };

  // Reset view to Indonesia / default
  const handleResetView = () => {
    targetRotationRef.current = { x: 0, y: 1.6 };
    if (cameraRef.current) {
      cameraRef.current.position.z = 4.8;
    }
    setSelectedPin(null);
  };

  // Zoom controls
  const handleZoom = (direction: 'in' | 'out') => {
    if (!cameraRef.current) return;
    const step = 0.6;
    const newZ = cameraRef.current.position.z + (direction === 'in' ? -step : step);
    cameraRef.current.position.z = THREE.MathUtils.clamp(newZ, 3.2, 9.0);
  };

  // Main Three.js Scene Setup & Animation Loop
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 580;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 4.8;
    cameraRef.current = camera;

    // 3. Renderer with high-DPI support
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lighting System (Live Earth Solar Calculations from UTC Time)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    const solar = calculateSolarPosition();
    setSolarInfo(solar);
    const sunLight = new THREE.DirectionalLight(0xfffbeb, 1.6);
    sunLight.position.set(solar.sunVector.x, solar.sunVector.y, solar.sunVector.z);
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.5);
    rimLight.position.set(-solar.sunVector.x, -solar.sunVector.y, -solar.sunVector.z);
    scene.add(rimLight);

    // 5. Globe Group
    const globeGroup = new THREE.Group();
    globeGroup.rotation.y = 1.6;
    scene.add(globeGroup);
    globeGroupRef.current = globeGroup;

    // 6. Earth Sphere Geometry & Texture
    const radius = 1.8;
    const sphereGeo = new THREE.SphereGeometry(radius, 64, 64);
    const initialTexture = createProceduralEarthTexture();
    const earthMat = new THREE.MeshStandardMaterial({
      map: initialTexture,
      roughness: 0.7,
      metalness: 0.1,
    });
    const earthMesh = new THREE.Mesh(sphereGeo, earthMat);
    globeGroup.add(earthMesh);

    // Load high-resolution Earth texture
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      '/assets/earth-texture.jpg',
      (loadedTexture) => {
        loadedTexture.colorSpace = THREE.SRGBColorSpace;
        earthMat.map = loadedTexture;
        earthMat.needsUpdate = true;
      },
      undefined,
      (err) => {
        console.warn('Menggunakan tekstur prosedural lokal:', err);
      }
    );

    // 7. Atmospheric Halo / Glow Mesh
    const atmosphereVertexShader = `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;
    const atmosphereFragmentShader = `
      varying vec3 vNormal;
      void main() {
        float intensity = pow(0.65 - dot(vNormal, vec3(0, 0, 1.0)), 2.2);
        gl_FragColor = vec4(0.22, 0.68, 1.0, 1.0) * intensity;
      }
    `;
    const atmosphereGeo = new THREE.SphereGeometry(radius * 1.03, 48, 48);
    const atmosphereMat = new THREE.ShaderMaterial({
      vertexShader: atmosphereVertexShader,
      fragmentShader: atmosphereFragmentShader,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeo, atmosphereMat);
    scene.add(atmosphereMesh);

    // 8. Pins Group
    const pinsGroup = new THREE.Group();
    globeGroup.add(pinsGroup);
    pinsGroupRef.current = pinsGroup;

    // 9. Resize Observer
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // 10. Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Handle smooth camera glide towards target country
      if (targetRotationRef.current && globeGroup) {
        const target = targetRotationRef.current;
        const diffX = target.x - globeGroup.rotation.x;
        const diffY = target.y - globeGroup.rotation.y;

        globeGroup.rotation.x += diffX * 0.08;
        globeGroup.rotation.y += diffY * 0.08;

        if (Math.abs(diffX) < 0.001 && Math.abs(diffY) < 0.001) {
          targetRotationRef.current = null;
        }
      } else if (autoRotate && !isDraggingRef.current && globeGroup) {
        globeGroup.rotation.y += 0.0015;
      }

      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      sphereGeo.dispose();
      earthMat.dispose();
      atmosphereGeo.dispose();
      atmosphereMat.dispose();
    };
  }, []);

  // Update 3D Flagpoles whenever countries list or filter changes
  useEffect(() => {
    const pinsGroup = pinsGroupRef.current;
    if (!pinsGroup) return;

    while (pinsGroup.children.length > 0) {
      const obj = pinsGroup.children[0];
      pinsGroup.remove(obj);
    }
    pinMeshesRef.current = [];

    const radius = 1.8;
    const poleHeight = 0.055;
    const poleRadius = 0.003;

    // 1. Shared Flagpole Geometry
    const poleGeometry = new THREE.CylinderGeometry(poleRadius, poleRadius, poleHeight, 6);
    poleGeometry.translate(0, poleHeight / 2, 0);

    const poleMaterial = new THREE.MeshStandardMaterial({
      color: 0xd4d4d8,
      metalness: 0.85,
      roughness: 0.2,
    });

    // 2. Finial tip sphere on top of the pole
    const tipGeometry = new THREE.SphereGeometry(0.005, 8, 8);

    const tipMaterial = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.9,
      roughness: 0.15,
      emissive: 0xb45309,
      emissiveIntensity: 0.35,
    });

    // 3. Pennant Flag Cloth (relative to pole apex)
    const flagShape = new THREE.Shape();
    flagShape.moveTo(0, poleHeight - 0.026);
    flagShape.lineTo(0.038, poleHeight - 0.013);
    flagShape.lineTo(0, poleHeight);
    flagShape.closePath();
    const flagGeometry = new THREE.ShapeGeometry(flagShape);

    // 🔵 Bendera Biru (Visited / Terdokumentasi)
    const visitedFlagMaterial = new THREE.MeshStandardMaterial({
      color: 0x2563eb,
      emissive: 0x1d4ed8,
      emissiveIntensity: 0.65,
      roughness: 0.3,
      metalness: 0.1,
      side: THREE.DoubleSide,
    });

    // 🔴 Bendera Merah (Unvisited / Belum Dikunjungi)
    const unvisitedFlagMaterial = new THREE.MeshStandardMaterial({
      color: 0xdc2626,
      emissive: 0x991b1b,
      emissiveIntensity: 0.55,
      roughness: 0.3,
      metalness: 0.1,
      side: THREE.DoubleSide,
    });

    displayedCountries.forEach(country => {
      const coords = COUNTRY_COORDINATES[country.code.toUpperCase()];
      if (!coords) return;

      // Single Authoritative Geographic Projection Utility
      const proj = geoToVector3(coords.lat, coords.lng, radius, 1.002);
      const surfacePos = new THREE.Vector3(proj.position.x, proj.position.y, proj.position.z);
      const normal = new THREE.Vector3(proj.normal.x, proj.normal.y, proj.normal.z);

      const isVisited = country.status === 'visited' || country.status === 'documented';
      const landmark = getCountryLandmark(country.code, country.name);

      const flagGroup = new THREE.Group();
      flagGroup.position.copy(surfacePos);
      flagGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);

      // A. Miniatur Bangunan 3D Ikonik Negara
      const { group: landmarkMesh, apexHeight } = buildLandmark3D(landmark);
      flagGroup.add(landmarkMesh);

      // B. Tiang Bendera Tertancap di Puncak Bangunan
      const poleMesh = new THREE.Mesh(poleGeometry, poleMaterial);
      poleMesh.position.y = apexHeight;

      // C. Bola Finial Emas di Ujung Tiang
      const tipMesh = new THREE.Mesh(tipGeometry, tipMaterial);
      tipMesh.position.y = apexHeight + poleHeight;

      // D. Kain Bendera (Merah / Biru) Berkibar di Atas Bangunan
      const clothMesh = new THREE.Mesh(
        flagGeometry,
        isVisited ? visitedFlagMaterial : unvisitedFlagMaterial
      );
      clothMesh.position.y = apexHeight;

      // E. Hitbox Raycaster mencakup Bangunan dan Bendera
      const totalH = apexHeight + poleHeight;
      const hitGeometry = new THREE.CylinderGeometry(0.038, 0.038, totalH, 8);
      hitGeometry.translate(0, totalH / 2, 0);
      const hitMaterial = new THREE.MeshBasicMaterial({ visible: false });
      const hitMesh = new THREE.Mesh(hitGeometry, hitMaterial);

      hitMesh.userData = {
        countryCode: country.code,
        country: country,
        landmark: landmark,
        isVisited: isVisited,
      };

      flagGroup.add(poleMesh);
      flagGroup.add(tipMesh);
      flagGroup.add(clothMesh);
      flagGroup.add(hitMesh);

      pinsGroup.add(flagGroup);
      pinMeshesRef.current.push(hitMesh);
    });
  }, [displayedCountries]);

  // Pointer Interaction: Dragging, Zooming, and Raycasting
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    touchStartPosRef.current = { x: e.clientX, y: e.clientY };
    targetRotationRef.current = null;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const container = mountRef.current;
    if (!container || !cameraRef.current) return;

    if (isDraggingRef.current && globeGroupRef.current) {
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      globeGroupRef.current.rotation.y += deltaX * 0.005;
      globeGroupRef.current.rotation.x += deltaY * 0.005;

      globeGroupRef.current.rotation.x = THREE.MathUtils.clamp(
        globeGroupRef.current.rotation.x,
        -Math.PI / 2.2,
        Math.PI / 2.2
      );

      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
      setHoveredCountry(null);
      return;
    }

    const rect = container.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), cameraRef.current);

    const intersects = raycaster.intersectObjects(pinMeshesRef.current, false);

    if (intersects.length > 0) {
      const hit = intersects[0].object as THREE.Mesh;
      const country = hit.userData.country as Country;
      if (country) {
        setHoveredCountry({
          country,
          landmark: hit.userData.landmark || getCountryLandmark(country.code, country.name),
          screenX: e.clientX - rect.left,
          screenY: e.clientY - rect.top,
        });
        container.style.cursor = 'pointer';
        return;
      }
    }

    setHoveredCountry(null);
    container.style.cursor = 'grab';
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = false;
    const container = mountRef.current;
    if (!container || !cameraRef.current) return;

    const dist = Math.hypot(
      e.clientX - touchStartPosRef.current.x,
      e.clientY - touchStartPosRef.current.y
    );

    if (dist < 6) {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(x, y), cameraRef.current);

      const intersects = raycaster.intersectObjects(pinMeshesRef.current, false);

      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        const country = hit.userData.country as Country;
        if (country) {
          focusOnCountry(country.code);
        }
      }
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!cameraRef.current) return;
    const delta = e.deltaY * 0.003;
    const newZ = cameraRef.current.position.z + delta;
    cameraRef.current.position.z = THREE.MathUtils.clamp(newZ, 3.2, 9.0);
  };

  return (
    <div className="relative w-full rounded-2xl border border-museum-border bg-[#0b0f14] overflow-hidden shadow-2xl select-none">
      
      {/* TOP CONTROL BAR & FILTERS */}
      <div className="absolute top-0 left-0 right-0 z-20 p-3 sm:p-4 bg-gradient-to-b from-[#0b0f14]/95 via-[#0b0f14]/80 to-transparent flex flex-wrap items-center justify-between gap-3 pointer-events-auto">
        
        {/* Left: Statistics & Color Legend */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-museum-surface/90 border border-museum-border text-xs font-mono text-stone-200">
            <GlobeIcon className="w-3.5 h-3.5 text-blue-400" />
            <span>{stats.total} Negara</span>
          </div>

          <button
            onClick={() => setFilterMode(prev => prev === 'visited' ? 'all' : 'visited')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              filterMode === 'visited'
                ? 'bg-blue-600/30 border border-blue-400 text-blue-200 shadow-sm'
                : 'bg-museum-surface/70 border border-museum-border text-stone-300 hover:border-blue-500/50'
            }`}
            title="Tampilkan negara dengan bendera biru (sudah dikunjungi)"
          >
            <span className="text-xs">🔵</span>
            <span>{stats.visited} Bendera Biru</span>
          </button>

          <button
            onClick={() => setFilterMode(prev => prev === 'unvisited' ? 'all' : 'unvisited')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              filterMode === 'unvisited'
                ? 'bg-red-600/30 border border-red-400 text-red-200 shadow-sm'
                : 'bg-museum-surface/70 border border-museum-border text-stone-300 hover:border-red-500/50'
            }`}
            title="Tampilkan negara dengan bendera merah (belum dikunjungi)"
          >
            <span className="text-xs">🔴</span>
            <span>{stats.unvisited} Bendera Merah</span>
          </button>

        </div>

        {/* Right: Search 195 Countries & Quick Actions */}
        <div className="flex items-center gap-2 relative">
          
          {/* Search Box */}
          <div className="relative">
            <div className="flex items-center gap-1.5 bg-museum-surface/90 border border-museum-border px-3 py-1.5 rounded-full focus-within:border-earth-400 transition-colors w-48 sm:w-60">
              <Search className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 250)}
                placeholder="Cari negara, ibu kota, atau landmark..."
                className="bg-transparent text-xs text-stone-100 placeholder-stone-500 focus:outline-none w-full"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-stone-400 hover:text-stone-200">
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Global Search Dropdown (Countries, Capitals, Landmarks) */}
            {isSearchFocused && searchResults.length > 0 && (
              <div className="absolute top-full right-0 mt-2 w-72 sm:w-80 bg-museum-surface border border-museum-border rounded-xl shadow-2xl overflow-hidden z-40 max-h-64 overflow-y-auto">
                {searchResults.map(match => {
                  const c = match.country;
                  return (
                    <button
                      key={c.id}
                      onClick={() => {
                        focusOnCountry(c.id);
                        setSearchQuery('');
                      }}
                      className="w-full text-left px-3.5 py-2.5 text-xs flex items-center justify-between hover:bg-stone-800 transition-colors border-b border-museum-border/40 last:border-none cursor-pointer"
                    >
                      <div className="flex flex-col min-w-0 pr-2">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-stone-100 truncate">{c.displayName}</span>
                          <span className="text-[10px] font-mono text-stone-400">({c.id})</span>
                        </div>
                        <span className="text-[11px] text-earth-300 truncate mt-0.5">
                          {match.matchType === 'capital' ? `🏛️ Ibu Kota: ${match.matchedText}` :
                           match.matchType === 'landmark' ? `📍 Landmark: ${match.matchedText}` :
                           c.capital ? `${c.capital} • ${c.landmark.name}` : c.region}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-stone-400 shrink-0">{c.region}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Live UTC Solar Badge */}
          <div
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-museum-surface/90 border border-museum-border text-[11px] font-mono text-stone-300"
            title={`Posisi Matahari UTC Nyata: Lat ${solarInfo.subsolarLatitude.toFixed(1)}°, Lng ${solarInfo.subsolarLongitude.toFixed(1)}° (${solarInfo.utcTimeFormatted})`}
          >
            <Sun className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Live UTC</span>
          </div>

          {/* QA Diagnostics Button */}
          <button
            onClick={() => setIsQADashboardOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-museum-surface/90 border border-museum-border hover:border-earth-400 text-xs font-mono text-stone-300 hover:text-earth-300 transition-all cursor-pointer"
            title="Buka Diagnostik QA Cakupan Aset 195 Negara"
          >
            <Activity className="w-3.5 h-3.5 text-earth-400" />
            <span>QA 195</span>
          </button>

          {/* Reset View Button */}
          <button
            onClick={handleResetView}
            className="p-2 rounded-full bg-museum-surface/80 border border-museum-border text-stone-300 hover:text-stone-100 hover:bg-museum-surface transition-colors cursor-pointer"
            title="Fokus ke Indonesia"
          >
            <Navigation className="w-3.5 h-3.5 text-earth-400" />
          </button>

          {/* Auto Rotate Toggle */}
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-2 rounded-full border transition-colors cursor-pointer ${
              autoRotate
                ? 'bg-earth-900/40 border-earth-500/50 text-earth-300'
                : 'bg-museum-surface/80 border-museum-border text-stone-400'
            }`}
            title={autoRotate ? 'Hentikan Putaran Otomatis' : 'Mulai Putaran Otomatis'}
          >
            {autoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* CONTINENT FILTER PILLS (Floating Top Center) */}
      <div className="absolute top-16 left-0 right-0 z-20 flex justify-center px-4 pointer-events-none">
        <div className="flex items-center gap-1 overflow-x-auto max-w-full px-3 py-1.5 rounded-full bg-museum-surface/80 backdrop-blur-md border border-museum-border/70 pointer-events-auto">
          {['all', 'Asia', 'Europe', 'Africa', 'North America', 'South America', 'Oceania'].map(cont => {
            const labelMap: Record<string, string> = {
              all: 'Semua Benua',
              Asia: 'Asia',
              Europe: 'Eropa',
              Africa: 'Afrika',
              'North America': 'Amerika Utara',
              'South America': 'Amerika Selatan',
              Oceania: 'Oseania',
            };
            const isSelected = selectedContinent === cont;
            return (
              <button
                key={cont}
                onClick={() => setSelectedContinent(cont)}
                className={`px-2.5 py-1 rounded-full text-[11px] whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-earth-600 text-stone-100 font-medium shadow-sm'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {labelMap[cont]}
              </button>
            );
          })}
        </div>
      </div>

      {/* MAIN THREE.JS 3D CANVAS VIEWPORT */}
      <div
        ref={mountRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onWheel={handleWheel}
        className="w-full h-[540px] sm:h-[640px] cursor-grab active:cursor-grabbing"
      />

      {/* ZOOM & VIEW CONTROLS (Floating Bottom Left) */}
      <div className="absolute bottom-5 left-5 z-20 flex flex-col gap-1.5 bg-museum-surface/80 backdrop-blur-md border border-museum-border p-1.5 rounded-xl shadow-lg">
        <button
          onClick={() => handleZoom('in')}
          className="p-2 rounded-lg text-stone-300 hover:text-stone-100 hover:bg-stone-800 transition-colors"
          title="Perbesar (Zoom In)"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleZoom('out')}
          className="p-2 rounded-lg text-stone-300 hover:text-stone-100 hover:bg-stone-800 transition-colors"
          title="Perkecil (Zoom Out)"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <div className="h-px bg-museum-border/60 my-0.5" />
        <button
          onClick={handleResetView}
          className="p-2 rounded-lg text-stone-300 hover:text-earth-400 hover:bg-stone-800 transition-colors"
          title="Reset Sudut Pandang (Default)"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* HOVER TOOLTIP */}
      {hoveredCountry && !selectedPin && (
        <div
          className="absolute z-30 pointer-events-none transform -translate-x-1/2 -translate-y-full pb-2 transition-all duration-75"
          style={{ left: hoveredCountry.screenX, top: hoveredCountry.screenY }}
        >
          <div className="bg-museum-surface/95 backdrop-blur-md border border-museum-border px-3 py-1.5 rounded-lg shadow-xl text-xs flex items-center gap-2">
            <span className="text-xs">
              {hoveredCountry.country.status === 'visited' || hoveredCountry.country.status === 'documented' ? '🔵' : '🔴'}
            </span>
            <span className="font-semibold text-stone-100">{hoveredCountry.country.name}</span>
            {hoveredCountry.landmark && (
              <span className="text-[11px] text-earth-300 font-serif border-l border-stone-700 pl-2 flex items-center gap-1">
                <span>🏛️</span>
                <span>{hoveredCountry.landmark.name}</span>
              </span>
            )}
            <span className="text-[10px] text-stone-400">({hoveredCountry.country.continent})</span>
          </div>
        </div>
      )}

      {/* SELECTED COUNTRY POP-UP CARD (Bottom Right Floating Card) */}
      {selectedPin && (
        <div className="absolute bottom-5 right-5 z-30 w-80 sm:w-96 max-w-[calc(100vw-2.5rem)] bg-museum-surface/95 backdrop-blur-md border border-museum-border rounded-2xl shadow-2xl p-4 sm:p-5 overflow-hidden transition-all animate-fadeIn max-h-[80vh] overflow-y-auto">
          
          {/* Card Header */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-stone-800 text-stone-300 border border-stone-700">
                  {selectedPin.country.code}
                </span>
                <span className="text-xs text-stone-400">{selectedPin.country.continent}</span>
              </div>
              <h3 className="text-lg font-serif font-bold text-parchment-100 mt-1">
                {selectedPin.country.name}
              </h3>
              {selectedPin.country.nativeName && (
                <p className="text-xs text-stone-400 font-serif italic">
                  {selectedPin.country.nativeName}
                </p>
              )}
            </div>

            <button
              onClick={() => setSelectedPin(null)}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Status Badge */}
          <div className="mb-3">
            {selectedPin.country.status === 'visited' || selectedPin.country.status === 'documented' ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-900/30 text-blue-300 border border-blue-500/40">
                <span className="text-xs">🔵</span>
                <span>Sudah Dikunjungi (Bendera Biru)</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-900/30 text-red-300 border border-red-500/40">
                <span className="text-xs">🔴</span>
                <span>Belum Dikunjungi (Bendera Merah)</span>
              </span>
            )}
          </div>

          {/* Landmark Ikonik 3D Card */}
          {selectedPin.landmark && (
            <div className="mb-3 p-3 rounded-xl bg-gradient-to-r from-earth-950/70 to-stone-900/70 border border-earth-800/40 flex items-start gap-2.5">
              <div className="p-2 rounded-lg bg-earth-900/60 text-earth-300 border border-earth-700/50 shrink-0 text-base leading-none">
                🏛️
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-earth-400">
                    {selectedPin.canonical?.representationType === 'HERO_LANDMARK_3D' ? 'Hero 3D Landmark' : 'Miniatur 3D Ikonik'}
                  </span>
                  {selectedPin.canonical?.capital && (
                    <span className="text-[10px] font-mono text-stone-400">Ibu Kota: {selectedPin.canonical.capital}</span>
                  )}
                </div>
                <h4 className="text-xs font-semibold text-stone-100 font-serif mt-0.5">
                  {selectedPin.landmark.name}
                </h4>
                <p className="text-[11px] text-stone-400 leading-relaxed mt-0.5">
                  {selectedPin.landmark.description}
                </p>

                {/* Authoritative Source Reference */}
                {selectedPin.canonical?.landmark?.source && (
                  <div className="mt-2 pt-2 border-t border-earth-800/30 flex items-center justify-between text-[10px] font-mono text-stone-400">
                    <span className="truncate pr-1">Ref: {selectedPin.canonical.landmark.source.publisher}</span>
                    <a
                      href={selectedPin.canonical.landmark.source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-earth-400 hover:text-earth-300 inline-flex items-center gap-1 shrink-0 cursor-pointer"
                      title="Buka Referensi Otoritatif"
                    >
                      <span>Sumber</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                )}

                <div className="text-[10px] text-stone-400 mt-1.5 italic">
                  📍 Bendera {selectedPin.country.status === 'visited' || selectedPin.country.status === 'documented' ? 'biru' : 'merah'} berkibar di puncak bangunan ini
                </div>
              </div>
            </div>
          )}

          {/* Media & Memory Preview (if documented) */}
          {selectedPin.memory && (
            <div className="mb-3 p-3 rounded-xl bg-stone-900/70 border border-museum-border/70">
              <div className="text-[11px] font-mono text-stone-400 mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-earth-400" />
                <span>{selectedPin.memory.dateStart} • {selectedPin.memory.placeName}</span>
              </div>
              <p className="text-xs font-medium text-stone-200 line-clamp-1 mb-2">
                {selectedPin.memory.title}
              </p>
              {selectedPin.memory.coverImage && (
                <div className="h-28 w-full rounded-lg overflow-hidden border border-stone-800">
                  <ArchivalMedia
                    src={selectedPin.memory.coverImage.uri}
                    alt={selectedPin.memory.title}
                    className="w-full h-full object-cover"
                    controls={false}
                  />
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 mt-2">
            {selectedPin.memory ? (
              <button
                onClick={() => onSelectMemory(selectedPin.memory!.id)}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-earth-600 hover:bg-earth-500 text-stone-100 text-xs font-medium transition-colors cursor-pointer"
              >
                <span>Lihat Jurnal Memori</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => onSelectCountry(selectedPin.country.code)}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-earth-700/80 hover:bg-earth-600 text-stone-100 text-xs font-medium transition-colors cursor-pointer"
              >
                <span>Mulai Catat Jurnal Negara Ini</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Toggle Visited button */}
            <button
              onClick={() => handleToggleVisited(selectedPin.country.code)}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-300 text-[11px] transition-colors border border-museum-border/60 cursor-pointer"
            >
              <CheckCircle className="w-3.5 h-3.5 text-stone-400" />
              <span>
                {selectedPin.country.status === 'visited' || selectedPin.country.status === 'documented'
                  ? 'Ganti ke Bendera Merah (Belum Dikunjungi)'
                  : 'Tancapkan Bendera Biru (Sudah Dikunjungi)'}
              </span>
            </button>
          </div>

        </div>
      )}

      {/* MARKER & REGION LEGEND */}
      <MarkerLegend />

      {/* ASSET COVERAGE QA DASHBOARD MODAL */}
      <AssetCoverageDashboard
        isOpen={isQADashboardOpen}
        onClose={() => setIsQADashboardOpen(false)}
      />

      {/* FOOTER HELPER TEXT */}
      <div className="absolute bottom-2 left-0 right-0 z-10 flex justify-center pointer-events-none">
        <span className="text-[11px] font-mono text-stone-400 bg-museum-surface/60 px-3 py-1 rounded-full backdrop-blur-sm">
          Geser untuk memutar bola dunia • Scroll untuk zoom • Klik bendera negara untuk melihat arsip
        </span>
      </div>

    </div>
  );
};
