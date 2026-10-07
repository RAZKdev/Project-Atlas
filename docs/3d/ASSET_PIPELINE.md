# Project Atlas Museum — 3D Asset Pipeline

## 1. Directory Structure
```
public/assets/3d/
├── characters/     # Rigged explorer character (.glb)
├── museum/         # Hero architectural elements (.glb)
├── environment/    # Landscaping props & park furniture (.glb)
├── vegetation/     # Organic trees, cypress, shrubs (.glb)
├── textures/       # PBR roughness/normal/albedo maps
└── shared/         # Common materials, decals, icons
```

## 2. Model Standards
* **Format:** Binary glTF (`.glb`).
* **Scale:** Modeled in meters (1 unit = 1 meter), transforms applied (`Scale: 1, 1, 1`), origin centered on ground base (`y = 0`).
* **Topology:** Clean quad/tri topology without non-manifold geometry or redundant interior faces.
* **Compression:** Optional Draco geometry compression and Meshopt where bundle optimization is beneficial.

## 3. Character Rigging Standards
* **Armature:** Standard humanoid hierarchy (Root → Pelvis → Spine → Chest → Neck → Head, Shoulders → Arms → Hands, Hips → Knees → Feet).
* **Bone Weighting:** Smooth 4-influence skinning per vertex.
* **Animation Clips:** `Idle`, `Walk`, `Run`, `Sprint`, `JumpStart`, `JumpLoop`, `Land`, `Turn`.
* **Zero Foot-Sliding:** Stride distance mathematically calibrated with ground velocity.

## 4. Runtime Asset Loader & Fallbacks
* Wrapped inside `src/features/museum/museumEngine/assets/assetLoader.ts`.
* Progressive loading with cached buffers and textures.
* Complete graceful fallback to procedural geometry if a network or file load error occurs.
