/**
 * museumEngine/playerEntity.ts
 * Authoritative Player Entity for Museum Mini 3D.
 *
 * Implements:
 * - Decoupled from Camera: Holds authoritative transform, velocity, locomotion state
 * - Canonical Scale: Avatar height 1.70m, radius 0.28m, eye height 1.60m
 * - Independent X/Z AABB collision resolution with natural wall-sliding
 * - Accurate stepped floor & stair elevation
 * - Procedural Locomotion State derivation (IDLE, WALK, RUN, SPRINT, AIRBORNE, LANDING)
 * - Center-screen exhibit raycast
 * - Owns AvatarRenderer
 */

import * as THREE from 'three';
import {
  AVATAR_SPECS,
  type CollisionBox,
  type InteractableExhibit,
  type LocomotionState,
  type POVMode,
} from './types';
import { AvatarRenderer } from './avatarRenderer';

export class PlayerEntity {
  public position: THREE.Vector3;
  public velocity: THREE.Vector3;
  public yaw: number = 0;
  public pitch: number = 0;
  public isGrounded: boolean = false;
  public isSprinting: boolean = false;
  public locomotionState: LocomotionState = 'idle';
  public speed: number = 0;
  public landingTimer: number = 0;

  // Head bob for POV 1 (meters)
  public bobAmount: number = 0;
  public bobY: number = 0;
  public bobEnabled: boolean = true;

  // Visual Avatar
  public avatar: AvatarRenderer;

  // Exhibit raycasting
  public focusedExhibit: InteractableExhibit | null = null;

  constructor(initialPosition: THREE.Vector3 = new THREE.Vector3(0, 0.50, 5.2), initialYaw: number = Math.PI) {
    this.position = initialPosition.clone();
    this.velocity = new THREE.Vector3();
    this.yaw = initialYaw;
    this.pitch = 0;
    this.isGrounded = Math.abs(this.position.y - this.getGroundHeight(this.position.x, this.position.z)) <= 0.05;
    this.avatar = new AvatarRenderer();
  }

  /** Teleport player to coordinates and orientation */
  public teleport(x: number, y: number, z: number, yaw?: number, pitch: number = 0): void {
    this.position.set(x, y, z);
    this.velocity.set(0, 0, 0);
    if (yaw !== undefined) this.yaw = yaw;
    this.pitch = pitch;
    this.locomotionState = 'idle';
    this.landingTimer = 0;
    this.isGrounded = Math.abs(y - this.getGroundHeight(x, z)) <= 0.05;
  }

  /** Compute ground elevation under player's current (x, z) */
  public getGroundHeight(x: number, z: number): number {
    // 1. Entrance stairs leading into south entrance (z: 4.0 to 4.9, x: -1.2 to 1.2)
    if (Math.abs(x) <= 1.2 && z >= 4.0 && z <= 4.9) {
      if (z > 4.6) return 0.17;
      if (z > 4.3) return 0.34;
      return 0.50; // top landing
    }

    // 2. Interior museum floor (footprint: x in [-3.1, 3.1], z in [-4.1, 4.1])
    if (Math.abs(x) <= 3.1 && Math.abs(z) <= 4.1) {
      return 0.50;
    }

    // 3. Exterior site ground
    return 0.00;
  }

  /**
   * Main Kinematic Physics Tick
   */
  public update(
    delta: number,
    inputMove: { x: number; z: number },
    wantsJump: boolean,
    wantsSprint: boolean,
    colliders: CollisionBox[],
    exhibits: InteractableExhibit[],
    currentPOV: POVMode
  ): void {
    const dt = Math.min(delta, 0.06);

    // ── 1. Calculate Target Movement Direction in World Space ───────────────
    let desiredDirX = 0;
    let desiredDirZ = 0;

    const inputLen = Math.sqrt(inputMove.x * inputMove.x + inputMove.z * inputMove.z);
    if (inputLen > 0.001) {
      const normX = inputMove.x / Math.max(1, inputLen);
      const normZ = inputMove.z / Math.max(1, inputLen);

      // Rotate by yaw
      const sinY = Math.sin(this.yaw);
      const cosY = Math.cos(this.yaw);

      desiredDirX = normX * cosY + normZ * sinY;
      desiredDirZ = -normX * sinY + normZ * cosY;
    }

    // Determine target speed
    this.isSprinting = wantsSprint && inputMove.z < 0 && inputLen > 0.1;
    let targetSpeed = 0;
    if (inputLen > 0.001) {
      targetSpeed = this.isSprinting
        ? AVATAR_SPECS.sprintSpeed
        : wantsSprint
        ? AVATAR_SPECS.runSpeed
        : AVATAR_SPECS.walkSpeed;
    }

    const targetVelX = desiredDirX * targetSpeed;
    const targetVelZ = desiredDirZ * targetSpeed;

    // ── 2. Accelerate / Decelerate ───────────────────────────────────────────
    if (inputLen > 0.001) {
      this.velocity.x += (targetVelX - this.velocity.x) * Math.min(1.0, AVATAR_SPECS.acceleration * dt);
      this.velocity.z += (targetVelZ - this.velocity.z) * Math.min(1.0, AVATAR_SPECS.acceleration * dt);
    } else {
      const frictionMultiplier = Math.max(0, 1.0 - AVATAR_SPECS.friction * dt);
      this.velocity.x *= frictionMultiplier;
      this.velocity.z *= frictionMultiplier;
      if (Math.abs(this.velocity.x) < 0.01) this.velocity.x = 0;
      if (Math.abs(this.velocity.z) < 0.01) this.velocity.z = 0;
    }

    this.speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.z * this.velocity.z);

    // ── 3. Jumping & Vertical Gravity ────────────────────────────────────────
    if (wantsJump && this.isGrounded) {
      this.velocity.y = AVATAR_SPECS.jumpForce;
      this.isGrounded = false;
      this.locomotionState = 'jump_takeoff';
    } else if (!this.isGrounded) {
      this.velocity.y -= AVATAR_SPECS.gravity * dt;
    }

    // ── 4. Independent Axis Movement & Collision Resolution (Wall Sliding) ──
    const r = AVATAR_SPECS.radius;
    const playerHeight = AVATAR_SPECS.height;

    // --- X Axis ---
    const nextX = this.position.x + this.velocity.x * dt;
    let resolvedX = nextX;

    for (const box of colliders) {
      const yOverlap = this.position.y + 0.15 < box.max[1] && this.position.y + playerHeight > box.min[1];
      const zOverlap = this.position.z + r > box.min[2] && this.position.z - r < box.max[2];

      if (yOverlap && zOverlap) {
        if (this.velocity.x > 0 && resolvedX + r > box.min[0] && this.position.x + r <= box.min[0] + 0.15) {
          resolvedX = box.min[0] - r - 0.001;
          this.velocity.x = 0;
        } else if (this.velocity.x < 0 && resolvedX - r < box.max[0] && this.position.x - r >= box.max[0] - 0.15) {
          resolvedX = box.max[0] + r + 0.001;
          this.velocity.x = 0;
        }
      }
    }
    this.position.x = resolvedX;

    // --- Z Axis ---
    const nextZ = this.position.z + this.velocity.z * dt;
    let resolvedZ = nextZ;

    for (const box of colliders) {
      const yOverlap = this.position.y + 0.15 < box.max[1] && this.position.y + playerHeight > box.min[1];
      const xOverlap = this.position.x + r > box.min[0] && this.position.x - r < box.max[0];

      if (yOverlap && xOverlap) {
        if (this.velocity.z > 0 && resolvedZ + r > box.min[2] && this.position.z + r <= box.min[2] + 0.15) {
          resolvedZ = box.min[2] - r - 0.001;
          this.velocity.z = 0;
        } else if (this.velocity.z < 0 && resolvedZ - r < box.max[2] && this.position.z - r >= box.max[2] - 0.15) {
          resolvedZ = box.max[2] + r + 0.001;
          this.velocity.z = 0;
        }
      }
    }
    this.position.z = resolvedZ;

    // --- Y Axis (Ground Clamping & Steps) ---
    this.position.y += this.velocity.y * dt;
    const groundY = this.getGroundHeight(this.position.x, this.position.z);

    const wasAirborne = !this.isGrounded;

    if (this.position.y <= groundY + 0.01) {
      this.position.y = groundY;
      this.velocity.y = 0;
      this.isGrounded = true;

      if (wasAirborne) {
        this.locomotionState = 'landing';
        this.landingTimer = 0.22;
        this.avatar.landingProgress = 0.0;
      }
    } else {
      const stepDiff = groundY - this.position.y;
      if (this.isGrounded && stepDiff > -AVATAR_SPECS.stepHeight && stepDiff < 0) {
        this.position.y = groundY;
      } else {
        this.isGrounded = false;
      }
    }

    // ── 5. Derive Locomotion State Machine (with Hysteresis) ─────────────────
    if (!this.isGrounded) {
      if (this.velocity.y > 0.4) {
        this.locomotionState = 'jump_takeoff';
      } else {
        this.locomotionState = 'airborne';
      }
    } else if (this.landingTimer > 0) {
      this.landingTimer -= dt;
      if (this.landingTimer <= 0) {
        this.landingTimer = 0;
        // Smooth recovery into appropriate grounded state based on current velocity
        if (this.speed < 0.20) {
          this.locomotionState = 'idle';
        } else if (this.isSprinting && this.speed > 4.5) {
          this.locomotionState = 'sprint';
        } else if (this.speed > 3.8) {
          this.locomotionState = 'run';
        } else {
          this.locomotionState = 'walk';
        }
      } else {
        this.locomotionState = 'landing';
      }
    } else {
      // Grounded state machine with hysteresis to eliminate flickering near speed thresholds
      const current = this.locomotionState;
      if (current === 'idle') {
        if (this.speed >= 0.25) {
          this.locomotionState = this.isSprinting && this.speed > 4.5 ? 'sprint' : (this.speed > 3.8 ? 'run' : 'walk');
        }
      } else if (current === 'walk') {
        if (this.speed < 0.15) {
          this.locomotionState = 'idle';
        } else if (this.isSprinting && this.speed >= 4.5) {
          this.locomotionState = 'sprint';
        } else if (this.speed >= 3.8) {
          this.locomotionState = 'run';
        }
      } else if (current === 'run') {
        if (this.speed < 0.15) {
          this.locomotionState = 'idle';
        } else if (this.isSprinting && this.speed >= 4.5) {
          this.locomotionState = 'sprint';
        } else if (this.speed < 3.2) {
          this.locomotionState = 'walk';
        }
      } else if (current === 'sprint') {
        if (this.speed < 0.15) {
          this.locomotionState = 'idle';
        } else if (!this.isSprinting || this.speed < 4.0) {
          this.locomotionState = this.speed >= 3.2 ? 'run' : 'walk';
        }
      } else {
        this.locomotionState = this.speed >= 0.25 ? 'walk' : 'idle';
      }
    }

    // ── 6. Head Bobbing for POV 1 ───────────────────────────────────────────
    if (this.bobEnabled && this.isGrounded && this.speed > 0.15) {
      const bobFreq = this.isSprinting ? 14 : (this.locomotionState === 'run' ? 11 : 8.5);
      this.bobAmount += dt * bobFreq * (this.speed / AVATAR_SPECS.walkSpeed);
      this.bobY = Math.sin(this.bobAmount) * (this.isSprinting ? 0.035 : (this.locomotionState === 'run' ? 0.028 : 0.018));
    } else {
      this.bobAmount = 0;
      this.bobY = 0;
    }

    // ── 7. Animate Visual Avatar ─────────────────────────────────────────────
    this.avatar.update(dt, this.position, this.yaw, this.locomotionState, this.speed, currentPOV);

    // ── 8. Check Interactable Focus (Center Raycast) ─────────────────────────
    this.checkExhibitFocus(exhibits);
  }

  /** Raycast from player eye level towards view direction */
  private checkExhibitFocus(exhibits: InteractableExhibit[]): void {
    const eyePos = new THREE.Vector3(this.position.x, this.position.y + 1.60, this.position.z);

    const cosPitch = Math.cos(this.pitch);
    const sinPitch = Math.sin(this.pitch);
    const sinYaw = Math.sin(this.yaw);
    const cosYaw = Math.cos(this.yaw);

    const forward = new THREE.Vector3(
      -sinYaw * cosPitch,
      sinPitch,
      -cosYaw * cosPitch
    ).normalize();

    let closestExhibit: InteractableExhibit | null = null;
    let closestDist: number = AVATAR_SPECS.interactDistance;

    for (const exhibit of exhibits) {
      const exhibitPos = new THREE.Vector3(...exhibit.position);
      const toExhibit = exhibitPos.clone().sub(eyePos);
      const dist = toExhibit.length();

      if (dist <= AVATAR_SPECS.interactDistance) {
        toExhibit.normalize();
        const dot = forward.dot(toExhibit);

        const threshold = dist < 1.6 ? 0.35 : 0.60;
        if (dot > threshold && dist < closestDist) {
          closestDist = dist;
          closestExhibit = exhibit;
        }
      }
    }

    this.focusedExhibit = closestExhibit;
  }
}
