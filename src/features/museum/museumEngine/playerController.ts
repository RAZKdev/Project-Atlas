/**
 * museumEngine/playerController.ts
 * Centralized Input System & Controller for Museum Mini 3D.
 *
 * Implements:
 * - Scoped input mapping for Desktop (WASD, Mouse, Space, Shift, E, V, ESC)
 * - Virtual touch inputs for Mobile (analog thumbstick, swipe-look, buttons)
 * - Feeds input directly into PlayerEntity and CameraSystem
 * - ZERO global window event hijacking
 */

import * as THREE from 'three';
import { PlayerEntity } from './playerEntity';
import { CameraSystem } from './cameraSystem';
import { type CollisionBox, type InteractableExhibit, POV_CONFIGS } from './types';

export class PlayerController {
  // Input tracking
  private keys: Record<string, boolean> = {};

  // Touch virtual inputs
  public touchMove: { x: number; y: number } = { x: 0, y: 0 };
  public touchLookDelta: { x: number; y: number } = { x: 0, y: 0 };
  public touchJump: boolean = false;

  // Callbacks
  public onInspect?: () => void;
  public onCyclePOV?: () => void;
  public onPause?: () => void;

  /** Key Down Handler (only invoked when simulation is active) */
  public onKeyDown(code: string): void {
    this.keys[code] = true;

    if (code === 'KeyE') {
      this.onInspect?.();
    } else if (code === 'KeyV') {
      this.onCyclePOV?.();
    } else if (code === 'Escape') {
      this.onPause?.();
    }
  }

  /** Key Up Handler */
  public onKeyUp(code: string): void {
    this.keys[code] = false;
  }

  /** Mouse Move from PointerLock */
  public onMouseMove(movementX: number, movementY: number, player: PlayerEntity, cameraSys: CameraSystem): void {
    const config = POV_CONFIGS[cameraSys.currentPOV];
    const sens = config.lookSensitivity;

    player.yaw -= movementX * sens;
    player.pitch -= movementY * sens;

    // Clamp vertical pitch according to active POV mode
    player.pitch = Math.max(config.minPitch, Math.min(config.maxPitch, player.pitch));
  }

  /** Reset all held inputs (e.g. when pausing or leaving simulation) */
  public resetInputs(): void {
    this.keys = {};
    this.touchMove = { x: 0, y: 0 };
    this.touchLookDelta = { x: 0, y: 0 };
    this.touchJump = false;
  }

  /**
   * Main Controller Tick: Feeds input into PlayerEntity and positions CameraSystem
   */
  public update(
    delta: number,
    player: PlayerEntity,
    cameraSys: CameraSystem,
    colliders: CollisionBox[],
    exhibits: InteractableExhibit[],
    camera: THREE.PerspectiveCamera
  ): void {
    const dt = Math.min(delta, 0.08);

    // Apply touch swipe look if present
    if (this.touchLookDelta.x !== 0 || this.touchLookDelta.y !== 0) {
      const config = POV_CONFIGS[cameraSys.currentPOV];
      player.yaw -= this.touchLookDelta.x * 0.0035;
      player.pitch -= this.touchLookDelta.y * 0.0035;
      player.pitch = Math.max(config.minPitch, Math.min(config.maxPitch, player.pitch));
      this.touchLookDelta.x = 0;
      this.touchLookDelta.y = 0;
    }

    // Compute input movement vector in player local space
    const moveX =
      (this.keys['KeyD'] || this.keys['ArrowRight'] ? 1 : 0) -
      (this.keys['KeyA'] || this.keys['ArrowLeft'] ? 1 : 0) +
      this.touchMove.x;

    const moveZ =
      (this.keys['KeyS'] || this.keys['ArrowDown'] ? 1 : 0) -
      (this.keys['KeyW'] || this.keys['ArrowUp'] ? 1 : 0) +
      this.touchMove.y;

    const wantsJump = (this.keys['Space'] || this.touchJump) && player.isGrounded;
    if (this.touchJump) this.touchJump = false;

    const wantsSprint = Boolean(this.keys['ShiftLeft'] || this.keys['ShiftRight']);

    // Update authoritative player physics & animation
    player.update(
      dt,
      { x: moveX, z: moveZ },
      wantsJump,
      wantsSprint,
      colliders,
      exhibits,
      cameraSys.currentPOV
    );

    // Update decoupled camera presentation
    cameraSys.update(
      dt,
      player.position,
      player.yaw,
      player.pitch,
      player.bobY,
      colliders,
      camera
    );
  }
}
