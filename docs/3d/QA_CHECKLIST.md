# Project Atlas Museum — 3D Visual & Functional QA Checklist

## 1. Visual & Environmental Quality
- [ ] **Fountain Hero:** Solid carved stone basin, volumetric water pool, multi-stream cascading ribbons, and dynamic spray particles.
- [ ] **Vegetation:** Organic tree variants with natural branching, varying crown shapes, and subtle wind motion.
- [ ] **Architecture:** Layered pavilion facade, recessed doorway depth, walnut window frames, and dimensional zinc roof seams.
- [ ] **Grounded Depth:** Clean shadow contacts without floating props or shadow acne.

## 2. Character & Locomotion Quality
- [ ] **Silhouette:** Realistic humanoid proportions (1.70 m), expedition attire, hat, and satchel.
- [ ] **Locomotion:** Smooth state machine progression (Idle → Walk → Run → Sprint → Jump → Land).
- [ ] **Foot Planting:** Synchronized stride frequency without noticeable ice-skating or sliding.
- [ ] **POV Switching:** Clean transitions between First-Person, Third-Person, and Panoramic Cinematic views.

## 3. Performance & Stability
- [ ] **Frame Rate:** Stable 60 FPS on desktop, ≥ 30 FPS on integrated/mobile GPU.
- [ ] **Draw Calls:** Controlled under 150 draw calls in standard viewing frustum.
- [ ] **Lifecycle Disposal:** Full resource cleanup (geometries, materials, textures, listeners) on simulation unmount.
- [ ] **Input Isolation:** Keyboard and pointer lock active strictly within the simulation canvas.
