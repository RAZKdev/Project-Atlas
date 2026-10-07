/**
 * museumEngine/assets/assetManifest.ts
 * Strongly-typed asset registry and catalog for Project Atlas Museum 3D.
 *
 * Rules:
 * - All asset URLs are relative to the web root (`public/assets/3d/...`)
 * - Priority determines loading order (hero -> important -> secondary -> background)
 * - Fallbacks ensure the engine functions even if external .glb assets are unavailable
 */

export type AssetPriority = 'hero' | 'important' | 'secondary' | 'background';

export type AssetCategory =
  | 'character'
  | 'museum'
  | 'environment'
  | 'vegetation'
  | 'props'
  | 'textures';

export interface AssetDefinition {
  id: string;
  name: string;
  url: string;
  category: AssetCategory;
  priority: AssetPriority;
  preload?: boolean;
  mobile?: boolean;
  lod?: boolean;
  fallbackToProcedural?: boolean;
}

export const ASSET_MANIFEST: Record<string, AssetDefinition> = {
  // Character models
  explorer_character: {
    id: 'explorer_character',
    name: 'Explorer Avatar Rig',
    url: '/assets/3d/characters/explorer.glb',
    category: 'character',
    priority: 'hero',
    preload: true,
    mobile: true,
    fallbackToProcedural: true,
  },

  // Environmental vegetation
  cypress_tree: {
    id: 'cypress_tree',
    name: 'Italian Cypress Tree',
    url: '/assets/3d/vegetation/cypress_tree.glb',
    category: 'vegetation',
    priority: 'secondary',
    preload: false,
    mobile: true,
    fallbackToProcedural: true,
  },
  olive_tree: {
    id: 'olive_tree',
    name: 'Mediterranean Olive Tree',
    url: '/assets/3d/vegetation/olive_tree.glb',
    category: 'vegetation',
    priority: 'secondary',
    preload: false,
    mobile: true,
    fallbackToProcedural: true,
  },

  // Hero Fountain
  hero_fountain: {
    id: 'hero_fountain',
    name: 'Classical Tiered Fountain',
    url: '/assets/3d/environment/fountain.glb',
    category: 'environment',
    priority: 'hero',
    preload: true,
    mobile: true,
    fallbackToProcedural: true,
  },

  // Earth globe texture
  earth_texture: {
    id: 'earth_texture',
    name: 'Earth Cartographic Texture',
    url: '/assets/earth-texture.jpg',
    category: 'textures',
    priority: 'hero',
    preload: true,
    mobile: true,
    fallbackToProcedural: false,
  },
};
