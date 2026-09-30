/**
 * museumEngine/playerController.ts
 * Kinematic First-Person Player Controller for Museum Mini 3D.
 *
 * Provides:
 * - PointerLock & Mouse look with clamped vertical pitch
 * - Frame-rate independent WASD movement, Sprint (Shift), Jump (Space)
 * - Independent X/Z AABB collision resolution with natural wall-sliding
 * - Accurate stepped floor / stair elevation handling
 * - Center-screen interaction raycasting for museum exhibits
 * - Touch input support for mobile devices
 * - Subtle head bobbing (can be toggled)
 */

import * as THREE from 'three';
import { AVATAR_SPECS, type CollisionBox, type InteractableExhibit } from './types';

export class PlayerController {
  public position: THREE.Vector3;
  public velocity: THREE.Vector3;
  public yaw: number = 0;       // horizontal angle around Y axis
  public pitch: number = 0;     // vertical angle around X axis (clamped)
  public isGrounded: boolean = false;
  public isSprinting: boolean = false;
  public isMoving: boolean = false;

  // Head bobbing state
  public bobAmount: number = 0;
  public bobEnabled: boolean = true;

  // Key tracking
  private keys: { [key: string]: boolean } = {};

  // Touch virtual inputs
  public touchMove: { x: number; y: number } = { x: 0, y: 0 };
  public touchLookDelta: { x: number; y: number } = { x: 0, y: 0 };
  public touchJump: boolean = false;

  // Mouse sensitivity
  public mouseSensitivity: number = 0.0022;

  // Interaction tracking
  public focusedExhibit: InteractableExhibit | null = null;
  public interactPressed: boolean = false;

  constructor(initialPosition: THREE.Vector3 = new THREE.Vector3(0, 0.5, 6.0), initialYaw: number = Math.PI) {
    this.position = initialPosition.clone();
    this.velocity = new THREE.Vector3();
    this.yaw = initialYaw;
    this.pitch = 0;
  }

  /** Handle mouse delta from PointerLock */
  public onMouseMove(movementX: number, movementY: number): void {
    this.yaw -= movementX * this.mouseSensitivity;
    this.pitch -= movementY * this.mouseSensitivity;

    // Clamp vertical pitch to [-85 deg, +85 deg]
    const maxPitch = (85 * Math.PI) / 180;
    this.pitch = Math.max(-maxPitch, Math.min(maxPitch, this.pitch));
  }

  /** Key down handler */
  public onKeyDown(code: string): void {
    this.keys[code] = true;
    if (code === 'KeyE') {
      this.interactPressed = true;
    }
  }

  /** Key up handler */
  public onKeyUp(code: string): void {
    this.keys[code] = false;
    if (code === 'KeyE') {
      this.interactPressed = false;
    }
  }

  /** Teleport player to specific coordinates and yaw */
  public teleport(x: number, y: number, z: number, yaw?: number, pitch: number = 0): void {
    this.position.set(x, y, z);
    this.velocity.set(0, 0, 0);
    if (yaw !== undefined) this.yaw = yaw;
    this.pitch = pitch;
  }

  /** Compute ground elevation under player's current (x, z) */
  public getGroundHeight(x: number, z: number): number {
    // 1. Entrance stairs leading into south entrance (z: 4.0 to 4.9, x: -1.2 to 1.2)
    if (Math.abs(x) <= 1.2 && z >= 4.0 && z <= 4.9) {
      if (z > 4.6) return 0.17;
      if (z > 4.3) return 0.34;
      return 0.50; // top landing
    }

    // 2. Interior museum floor (footprint: x in [-3.0, 3.0], z in [-4.0, 4.0])
    // Building perimeter slab extends to [-3.2, 3.2] x [-4.2, 4.2]
    if (Math.abs(x) <= 3.1 && Math.abs(z) <= 4.1) {
      return 0.50;
    }

    // 3. Exterior site walkway / ground
    return 0.00;
  }

  /**
   * Main Physics Tick
   * @param delta elapsed time in seconds
   * @param colliders list of solid 3D AABBs to collide against
   * @param exhibits list of interactable exhibits to raycast
   * @param camera Three.js perspective camera to position and rotate
   */
  public update(
    delta: number,
    colliders: CollisionBox[],
    exhibits: InteractableExhibit[],
    camera: THREE.PerspectiveCamera
  ): void {
    // Cap delta to prevent tunneling on frame hitching
    const dt = Math.min(delta, 0.06);

    // Apply touch look if present
    if (this.touchLookDelta.x !== 0 || this.touchLookDelta.y !== 0) {
      this.yaw -= this.touchLookDelta.x * 0.0035;
      this.pitch -= this.touchLookDelta.y * 0.0035;
      const maxPitch = (85 * Math.PI) / 180;
      this.pitch = Math.max(-maxPitch, Math.min(maxPitch, this.pitch));
      this.touchLookDelta.x = 0;
      this.touchLookDelta.y = 0;
    }

    // ── 1. Calculate Desired Movement Direction in World Space ──────────────
    const moveX =
      (this.keys['KeyD'] || this.keys['ArrowRight'] ? 1 : 0) -
      (this.keys['KeyA'] || this.keys['ArrowLeft'] ? 1 : 0) +
      this.touchMove.x;

    const moveZ =
      (this.keys['KeyS'] || this.keys['ArrowDown'] ? 1 : 0) -
      (this.keys['KeyW'] || this.keys['ArrowUp'] ? 1 : 0) +
      this.touchMove.y;

    const isSprintInput = Boolean(this.keys['ShiftLeft'] || this.keys['ShiftRight']);
    this.isSprinting = isSprintInput && moveZ < 0; // only sprint forward

    const targetSpeed = this.isSprinting ? AVATAR_SPECS.sprintSpeed : AVATAR_SPECS.walkSpeed;

    // Transform local input (moveX, moveZ) by yaw rotation
    let desiredDirX = 0;
    let desiredDirZ = 0;

    const inputLength = Math.sqrt(moveX * moveX + moveZ * moveZ);
    if (inputLength > 0.001) {
      const normX = moveX / Math.max(1, inputLength);
      const normZ = moveZ / Math.max(1, inputLength);

      // Camera forward vector on horizontal plane
      const sinY = Math.sin(this.yaw);
      const cosY = Math.cos(this.yaw);

      // forward: (-sinY, -cosY), right: (cosY, -sinY)
      desiredDirX = normX * cosY - normZ * sinY;
      desiredDirZ = -normX * sinY - normZ * cosY;
      this.isMoving = true;
    } else {
      this.isMoving = false;
    }

    // ── 2. Accelerate / Decelerate Horizontal Velocity ───────────────────────
    const targetVelX = desiredDirX * targetSpeed;
    const targetVelZ = desiredDirZ * targetSpeed;

    if (this.isMoving) {
      // Accelerate towards target velocity
      this.velocity.x += (targetVelX - this.velocity.x) * Math.min(1, AVATAR_SPECS.acceleration * dt);
      this.velocity.z += (targetVelZ - this.velocity.z) * Math.min(1, AVATAR_SPECS.acceleration * dt);
    } else {
      // Apply ground friction
      const frictionMultiplier = Math.max(0, 1 - AVATAR_SPECS.friction * dt);
      this.velocity.x *= frictionMultiplier;
      this.velocity.z *= frictionMultiplier;
      if (Math.abs(this.velocity.x) < 0.01) this.velocity.x = 0;
      if (Math.abs(this.velocity.z) < 0.01) this.velocity.z = 0;
    }

    // ── 3. Jumping & Vertical Gravity ────────────────────────────────────────
    const wantsJump = (this.keys['Space'] || this.touchJump) && this.isGrounded;
    if (wantsJump) {
      this.velocity.y = AVATAR_SPECS.jumpForce;
      this.isGrounded = false;
      this.touchJump = false;
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
      // Check vertical overlap: player feet to head [position.y, position.y + playerHeight]
      const yOverlap = this.position.y + 0.15 < box.max[1] && this.position.y + playerHeight > box.min[1];
      // Check Z overlap
      const zOverlap = this.position.z + r > box.min[2] && this.position.z - r < box.max[2];

      if (yOverlap && zOverlap) {
        // If moving right (+X) and penetrating left face
        if (this.velocity.x > 0 && resolvedX + r > box.min[0] && this.position.x + r <= box.min[0] + 0.15) {
          resolvedX = box.min[0] - r - 0.001;
          this.velocity.x = 0;
        }
        // If moving left (-X) and penetrating right face
        else if (this.velocity.x < 0 && resolvedX - r < box.max[0] && this.position.x - r >= box.max[0] - 0.15) {
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
        // If moving backwards (+Z) and penetrating front face
        if (this.velocity.z > 0 && resolvedZ + r > box.min[2] && this.position.z + r <= box.min[2] + 0.15) {
          resolvedZ = box.min[2] - r - 0.001;
          this.velocity.z = 0;
        }
        // If moving forward (-Z) and penetrating back face
        else if (this.velocity.z < 0 && resolvedZ - r < box.max[2] && this.position.z - r >= box.max[2] - 0.15) {
          resolvedZ = box.max[2] + r + 0.001;
          this.velocity.z = 0;
        }
      }
    }
    this.position.z = resolvedZ;

    // --- Y Axis (Ground Clamping & Steps) ---
    this.position.y += this.velocity.y * dt;
    const groundY = this.getGroundHeight(this.position.x, this.position.z);

    if (this.position.y <= groundY + 0.01) {
      this.position.y = groundY;
      this.velocity.y = 0;
      this.isGrounded = true;
    } else {
      // If dropping gently down a step, snap down if within stepHeight
      const stepDiff = groundY - this.position.y;
      if (this.isGrounded && stepDiff > -AVATAR_SPECS.stepHeight && stepDiff < 0) {
        this.position.y = groundY;
      } else {
        this.isGrounded = false;
      }
    }

    // ── 5. Head Bobbing Calculation ─────────────────────────────────────────
    let bobY = 0;
    if (this.bobEnabled && this.isGrounded && this.isMoving) {
      const speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.z * this.velocity.z);
      const bobFreq = this.isSprinting ? 14 : 9;
      this.bobAmount += dt * bobFreq * (speed / AVATAR_SPECS.walkSpeed);
      bobY = Math.sin(this.bobAmount) * (this.isSprinting ? 0.035 : 0.02);
    } else {
      this.bobAmount = 0;
    }

    // ── 6. Update Camera Position & Rotation ────────────────────────────────
    camera.position.set(this.position.x, this.position.y + AVATAR_SPECS.eyeHeight + bobY, this.position.z);
    camera.rotation.set(this.pitch, this.yaw, 0, 'YXZ');

    // ── 7. Center-Screen Interaction Raycast ─────────────────────────────────
    this.checkExhibitFocus(camera, exhibits);
  }

  /**
   * Raycast from camera center to detect interactable museum exhibits
   */
  private checkExhibitFocus(camera: THREE.PerspectiveCamera, exhibits: InteractableExhibit[]): void {
    const camPos = camera.position;
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);

    let closestExhibit: InteractableExhibit | null = null;
    let closestDist: number = AVATAR_SPECS.interactDistance;

    for (const exhibit of exhibits) {
      const exhibitPos = new THREE.Vector3(...exhibit.position);
      const toExhibit = exhibitPos.clone().sub(camPos);
      const dist = toExhibit.length();

      if (dist <= AVATAR_SPECS.interactDistance) {
        toExhibit.normalize();
        const dot = forward.dot(toExhibit);

        // Within ~55 degree viewing cone (dot > 0.55) or very close (< 1.5m, dot > 0.35)
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
