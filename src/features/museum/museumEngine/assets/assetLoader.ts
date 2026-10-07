/**
 * museumEngine/assets/assetLoader.ts
 * Robust, cached asset loader with graceful procedural fallback.
 *
 * Responsibilities:
 * - Loads .glb models using Three.js GLTFLoader
 * - Loads textures using Three.js TextureLoader
 * - Caches loaded assets to eliminate redundant network/disk requests
 * - Clones cached scene hierarchies safely for instanced use
 * - Never throws runtime crashes if a remote/local asset is missing: returns null
 *   allowing caller to fall back to procedural geometry seamlessly
 * - Provides dispose() for clean memory reclamation on scene unmount
 */

import * as THREE from 'three';
import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { ASSET_MANIFEST, type AssetDefinition } from './assetManifest';

export class AssetLoader {
  private static instance: AssetLoader | null = null;
  private gltfLoader: GLTFLoader;
  private textureLoader: THREE.TextureLoader;

  // In-memory caches
  private gltfCache: Map<string, GLTF> = new Map();
  private textureCache: Map<string, THREE.Texture> = new Map();
  private pendingPromises: Map<string, Promise<GLTF | null>> = new Map();

  private constructor() {
    this.gltfLoader = new GLTFLoader();
    this.textureLoader = new THREE.TextureLoader();
  }

  public static getInstance(): AssetLoader {
    if (!AssetLoader.instance) {
      AssetLoader.instance = new AssetLoader();
    }
    return AssetLoader.instance;
  }

  /**
   * Asynchronously loads a GLTF model with in-memory caching and fallback guard.
   */
  public async loadGLTF(assetId: string): Promise<GLTF | null> {
    const def = ASSET_MANIFEST[assetId];
    if (!def) {
      console.warn(`[AssetLoader] Asset definition not found in manifest: ${assetId}`);
      return null;
    }

    // Check memory cache
    if (this.gltfCache.has(def.url)) {
      const cached = this.gltfCache.get(def.url)!;
      return {
        ...cached,
        scene: cached.scene.clone(true),
      };
    }

    // Deduplicate in-flight requests
    if (this.pendingPromises.has(def.url)) {
      return this.pendingPromises.get(def.url)!;
    }

    const loadPromise = new Promise<GLTF | null>((resolve) => {
      this.gltfLoader.load(
        def.url,
        (gltf) => {
          this.gltfCache.set(def.url, gltf);
          this.pendingPromises.delete(def.url);
          resolve({
            ...gltf,
            scene: gltf.scene.clone(true),
          });
        },
        undefined,
        (error) => {
          // Graceful fallback guard: log informative warning and return null
          console.info(
            `[AssetLoader] Optional GLB '${def.id}' not found at '${def.url}', utilizing procedural geometry fallback.`
          );
          this.pendingPromises.delete(def.url);
          resolve(null);
        }
      );
    });

    this.pendingPromises.set(def.url, loadPromise);
    return loadPromise;
  }

  /**
   * Synchronously or asynchronously load a texture with memory caching.
   */
  public loadTexture(url: string): Promise<THREE.Texture | null> {
    if (this.textureCache.has(url)) {
      return Promise.resolve(this.textureCache.get(url)!);
    }

    return new Promise((resolve) => {
      this.textureLoader.load(
        url,
        (tex) => {
          this.textureCache.set(url, tex);
          resolve(tex);
        },
        undefined,
        (err) => {
          console.warn(`[AssetLoader] Texture load error at '${url}':`, err);
          resolve(null);
        }
      );
    });
  }

  /**
   * Preload high-priority hero assets.
   */
  public async preloadHeroAssets(): Promise<void> {
    const heroes = Object.values(ASSET_MANIFEST).filter(
      (a) => a.preload && (a.priority === 'hero' || a.priority === 'important')
    );

    await Promise.all(
      heroes.map(async (asset) => {
        if (asset.category === 'textures') {
          await this.loadTexture(asset.url);
        } else {
          await this.loadGLTF(asset.id);
        }
      })
    );
  }

  /**
   * Dispose cached textures and geometries on application teardown.
   */
  public dispose(): void {
    for (const [, tex] of this.textureCache) {
      tex.dispose();
    }
    this.textureCache.clear();

    for (const [, gltf] of this.gltfCache) {
      gltf.scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry?.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach((m) => m.dispose());
          } else {
            child.material?.dispose();
          }
        }
      });
    }
    this.gltfCache.clear();
    this.pendingPromises.clear();
  }
}

export const assetLoader = AssetLoader.getInstance();
