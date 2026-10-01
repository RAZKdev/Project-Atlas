/**
 * museumEngine/cameraSystem.ts
 * Decoupled Three-POV Camera System for Museum Mini 3D.
 *
 * Implements:
 * - POV 1: First-Person (Eye height 1.60m, FOV 72°, direct attachment)
 * - POV 2: Third-Person Character (Distance ~2.2m, over-shoulder/behind, collision-aware)
 * - POV 3: Cinematic / Architectural Third-Person (Distance ~4.4m, height ~2.5m, broad view)
 * - Wall-Collision Raycasting: Prevents camera from ever clipping through walls/ceilings/furniture
 * - Smooth critically-damped transitions between POVs without sudden popping or player teleportation
 */

import * as THREE from 'three';
import {
  type POVMode,
  type CollisionBox,
  POV_CONFIGS,
} from './types';

export class CameraSystem {
  public currentPOV: POVMode = 'first_person';
  public targetPOV: POVMode = 'first_person';
  public isTransitioning: boolean = false;
  private transitionTimer: number = 1.0;

  // Smoothed camera state
  private smoothCamPos: THREE.Vector3 = new THREE.Vector3();
  private smoothLookAt: THREE.Vector3 = new THREE.Vector3();

  // Temporary vectors for zero garbage collection
  private tempHeadPos = new THREE.Vector3();
  private tempForward = new THREE.Vector3();
  private tempRight = new THREE.Vector3();
  private tempTargetPos = new THREE.Vector3();
  private tempTargetLookAt = new THREE.Vector3();

  constructor(initialPosition: THREE.Vector3 = new THREE.Vector3(0, 2.1, 5.2)) {
    this.smoothCamPos.copy(initialPosition);
    this.smoothLookAt.set(initialPosition.x, initialPosition.y, initialPosition.z - 1.0);
  }

  /** Set active camera POV mode with smooth transition */
  public setPOV(mode: POVMode): void {
    if (this.currentPOV === mode) return;
    this.targetPOV = mode;
    this.currentPOV = mode;
    this.isTransitioning = true;
    this.transitionTimer = 0.0;
  }

  /** Cycle to next POV mode: POV 1 -> POV 2 -> POV 3 -> POV 1 */
  public cyclePOV(): POVMode {
    const cycleOrder: POVMode[] = ['first_person', 'third_person', 'cinematic'];
    const currentIndex = cycleOrder.indexOf(this.currentPOV);
    const nextPOV = cycleOrder[(currentIndex + 1) % cycleOrder.length];
    this.setPOV(nextPOV);
    return nextPOV;
  }

  /**
   * Ray-AABB intersection test for camera obstruction
   * Returns distance from origin to intersection along ray, or Infinity if no hit
   */
  private checkRayAABB(
    rayOrigin: THREE.Vector3,
    rayDir: THREE.Vector3,
    maxDist: number,
    box: CollisionBox
  ): number {
    let tmin = 0.0;
    let tmax = maxDist;

    // X axis
    if (Math.abs(rayDir.x) < 1e-6) {
      if (rayOrigin.x < box.min[0] || rayOrigin.x > box.max[0]) return Infinity;
    } else {
      const invD = 1.0 / rayDir.x;
      let t1 = (box.min[0] - rayOrigin.x) * invD;
      let t2 = (box.max[0] - rayOrigin.x) * invD;
      if (t1 > t2) { const tmp = t1; t1 = t2; t2 = tmp; }
      tmin = Math.max(tmin, t1);
      tmax = Math.min(tmax, t2);
      if (tmin > tmax) return Infinity;
    }

    // Y axis
    if (Math.abs(rayDir.y) < 1e-6) {
      if (rayOrigin.y < box.min[1] || rayOrigin.y > box.max[1]) return Infinity;
    } else {
      const invD = 1.0 / rayDir.y;
      let t1 = (box.min[1] - rayOrigin.y) * invD;
      let t2 = (box.max[1] - rayOrigin.y) * invD;
      if (t1 > t2) { const tmp = t1; t1 = t2; t2 = tmp; }
      tmin = Math.max(tmin, t1);
      tmax = Math.min(tmax, t2);
      if (tmin > tmax) return Infinity;
    }

    // Z axis
    if (Math.abs(rayDir.z) < 1e-6) {
      if (rayOrigin.z < box.min[2] || rayOrigin.z > box.max[2]) return Infinity;
    } else {
      const invD = 1.0 / rayDir.z;
      let t1 = (box.min[2] - rayOrigin.z) * invD;
      let t2 = (box.max[2] - rayOrigin.z) * invD;
      if (t1 > t2) { const tmp = t1; t1 = t2; t2 = tmp; }
      tmin = Math.max(tmin, t1);
      tmax = Math.min(tmax, t2);
      if (tmin > tmax) return Infinity;
    }

    return tmin > 0 ? tmin : Infinity;
  }

  /**
   * Main Camera Tick
   * @param delta frame time in seconds
   * @param playerPos world position of player feet
   * @param playerYaw horizontal heading angle (radians)
   * @param playerPitch vertical look angle (radians)
   * @param bobY procedural head-bob offset (for POV 1)
   * @param colliders static world collision boxes
   * @param camera Three.js perspective camera to position
   */
  public update(
    delta: number,
    playerPos: THREE.Vector3,
    playerYaw: number,
    playerPitch: number,
    bobY: number,
    colliders: CollisionBox[],
    camera: THREE.PerspectiveCamera
  ): void {
    const dt = Math.min(delta, 0.08);
    const config = POV_CONFIGS[this.currentPOV];

    // Smooth FOV
    if (Math.abs(camera.fov - config.fov) > 0.1) {
      camera.fov += (config.fov - camera.fov) * Math.min(1.0, 8.0 * dt);
      camera.updateProjectionMatrix();
    }

    // Player head anchor point (eye level at 1.60m)
    this.tempHeadPos.set(playerPos.x, playerPos.y + 1.60, playerPos.z);

    // Forward and Right vectors on 3D view sphere
    const cosPitch = Math.cos(playerPitch);
    const sinPitch = Math.sin(playerPitch);
    const sinYaw = Math.sin(playerYaw);
    const cosYaw = Math.cos(playerYaw);

    this.tempForward.set(
      -sinYaw * cosPitch,
      sinPitch,
      -cosYaw * cosPitch
    ).normalize();

    this.tempRight.set(cosYaw, 0, -sinYaw).normalize();

    // ── 1. Calculate Target Camera Position & LookAt for Current POV ─────────
    if (this.currentPOV === 'first_person') {
      // First person: Camera is placed directly at player's eye height + head bob
      this.tempTargetPos.set(
        playerPos.x,
        playerPos.y + 1.60 + bobY,
        playerPos.z
      );

      // Instant attachment for zero input lag in FPS
      this.smoothCamPos.copy(this.tempTargetPos);
      camera.position.copy(this.smoothCamPos);
      camera.rotation.set(playerPitch, playerYaw, 0, 'YXZ');
      this.isTransitioning = false;
      return;
    }

    // Third person & Cinematic modes
    const desiredDist = config.distance;
    const heightOffset = config.height - 1.60;
    const shoulderOffset = config.shoulderOffset;

    // Desired ideal camera position behind the player
    this.tempTargetPos.copy(this.tempHeadPos)
      .addScaledVector(this.tempForward, -desiredDist)
      .addScaledVector(this.tempRight, shoulderOffset);
    this.tempTargetPos.y += heightOffset;

    // ── 2. Wall-Collision Raycasting ─────────────────────────────────────────
    // Cast ray from player head to desired camera position
    const rayDir = new THREE.Vector3().subVectors(this.tempTargetPos, this.tempHeadPos);
    const totalRayLen = rayDir.length();

    if (totalRayLen > 0.001) {
      rayDir.normalize();
      let closestHitDist = totalRayLen;

      for (const box of colliders) {
        const hitDist = this.checkRayAABB(this.tempHeadPos, rayDir, totalRayLen, box);
        if (hitDist < closestHitDist) {
          closestHitDist = hitDist;
        }
      }

      // If a wall or ceiling obstructed the camera, clamp camera distance with 0.20m safety padding
      if (closestHitDist < totalRayLen) {
        const safeDist = Math.max(config.minDistance, closestHitDist - 0.20);
        this.tempTargetPos.copy(this.tempHeadPos).addScaledVector(rayDir, safeDist);
      }
    }

    // LookAt target: upper torso / head of the avatar
    this.tempTargetLookAt.copy(this.tempHeadPos);
    this.tempTargetLookAt.y -= 0.15; // look at chest level

    // ── 3. Smooth Critically-Damped Interpolation ───────────────────────────
    if (this.isTransitioning) {
      this.transitionTimer += dt * 4.0;
      const t = Math.min(1.0, this.transitionTimer);
      // Smooth cubic ease out
      const easeT = 1 - Math.pow(1 - t, 3);
      this.smoothCamPos.lerp(this.tempTargetPos, easeT);
      this.smoothLookAt.lerp(this.tempTargetLookAt, easeT);

      if (t >= 1.0) {
        this.isTransitioning = false;
      }
    } else {
      // Follow smoothing
      const posLerpFactor = Math.min(1.0, (1.0 / config.damping) * dt);
      this.smoothCamPos.lerp(this.tempTargetPos, posLerpFactor);
      this.smoothLookAt.lerp(this.tempTargetLookAt, Math.min(1.0, 14.0 * dt));
    }

    // Apply to camera
    camera.position.copy(this.smoothCamPos);
    camera.lookAt(this.smoothLookAt);
  }
}
