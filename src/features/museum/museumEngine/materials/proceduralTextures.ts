/**
 * museumEngine/materials/proceduralTextures.ts
 * Lightweight, deterministic procedural PBR detail textures for Project Atlas Museum 3D.
 *
 * Generates tactile architectural surface maps (bump, roughness, and fine grain)
 * without requiring external image asset downloads.
 * 100% offline, immediate load, zero network latency.
 */

import * as THREE from 'three';

// Cache generated textures to avoid redundant memory allocations
const textureCache = new Map<string, THREE.CanvasTexture>();

function createNoiseCanvas(
  width: number,
  height: number,
  drawFn: (ctx: CanvasRenderingContext2D, width: number, height: number) => void
): HTMLCanvasElement | null {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  drawFn(ctx, width, height);
  return canvas;
}

/**
 * Travertine limestone surface: subtle porous micro-pitting and horizontal strata.
 */
export function getTravertineBumpTexture(): THREE.Texture | null {
  if (textureCache.has('travertine')) {
    return textureCache.get('travertine')!;
  }

  const canvas = createNoiseCanvas(256, 256, (ctx, w, h) => {
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, w, h);

    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;

    for (let y = 0; y < h; y++) {
      // Horizontal strata frequency
      const strata = Math.sin(y * 0.12) * 8;
      for (let x = 0; x < w; x++) {
        const idx = (y * w + x) * 4;
        // Fine grain noise
        const noise = (Math.random() - 0.5) * 22;
        // Occasional limestone pore cavity
        const pore = Math.random() < 0.02 ? -35 : 0;
        const val = Math.max(0, Math.min(255, 128 + strata + noise + pore));

        data[idx] = val;
        data[idx + 1] = val;
        data[idx + 2] = val;
        data[idx + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);
  });

  if (!canvas) return null;

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  textureCache.set('travertine', texture);
  return texture;
}

/**
 * Interior Terrazzo floor: fine marble aggregate flakes and varied specular response.
 */
export function getTerrazzoRoughnessTexture(): THREE.Texture | null {
  if (textureCache.has('terrazzo')) {
    return textureCache.get('terrazzo')!;
  }

  const canvas = createNoiseCanvas(256, 256, (ctx, w, h) => {
    // Base polished luster (roughness ~0.35)
    ctx.fillStyle = '#666666';
    ctx.fillRect(0, 0, w, h);

    // Marble chips and mineral aggregate specks
    for (let i = 0; i < 400; i++) {
      const cx = Math.random() * w;
      const cy = Math.random() * h;
      const r = 1 + Math.random() * 2.5;
      const shade = Math.random() < 0.5 ? 40 + Math.random() * 30 : 160 + Math.random() * 50;
      ctx.fillStyle = `rgb(${shade},${shade},${shade})`;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  if (!canvas) return null;

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 8);
  textureCache.set('terrazzo', texture);
  return texture;
}

/**
 * Rich Walnut Wood Grain: linear longitudinal striations.
 */
export function getWalnutWoodTexture(): THREE.Texture | null {
  if (textureCache.has('walnut')) {
    return textureCache.get('walnut')!;
  }

  const canvas = createNoiseCanvas(128, 256, (ctx, w, h) => {
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, w, h);

    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const idx = (y * w + x) * 4;
        // Wood grain rings / linear fibers along y
        const grain = Math.sin(x * 0.28 + Math.sin(y * 0.04) * 3) * 20;
        const fineNoise = (Math.random() - 0.5) * 12;
        const val = Math.max(0, Math.min(255, 128 + grain + fineNoise));

        data[idx] = val;
        data[idx + 1] = val;
        data[idx + 2] = val;
        data[idx + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);
  });

  if (!canvas) return null;

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 6);
  textureCache.set('walnut', texture);
  return texture;
}

/**
 * Sandstone Pavers: Subtle joint borders and paver relief for paths and plaza.
 */
export function getPaverBumpTexture(): THREE.Texture | null {
  if (textureCache.has('pavers')) {
    return textureCache.get('pavers')!;
  }

  const canvas = createNoiseCanvas(256, 256, (ctx, w, h) => {
    ctx.fillStyle = '#8a8a8a';
    ctx.fillRect(0, 0, w, h);

    // Draw paving stone grid with mortar grooves
    const tileSize = 32;
    ctx.strokeStyle = '#404040';
    ctx.lineWidth = 2;

    for (let x = 0; x <= w; x += tileSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y <= h; y += tileSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Add granular sand noise
    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const n = (Math.random() - 0.5) * 14;
      data[i] = Math.max(0, Math.min(255, data[i] + n));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + n));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + n));
    }
    ctx.putImageData(imgData, 0, 0);
  });

  if (!canvas) return null;

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(8, 8);
  textureCache.set('pavers', texture);
  return texture;
}
