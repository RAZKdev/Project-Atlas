/**
 * museumEngine/character/characterAnimator.ts
 * Three.js AnimationMixer Manager for Rigged Explorer Avatars.
 *
 * Implements:
 * - AnimationMixer with crossfading between clips (Idle, Walk, Run, Sprint, JumpStart, JumpLoop, Land)
 * - Playback rate synchronized with actual ground velocity for zero foot-sliding
 * - Safe fallback handling when rigged clips are not present
 * - Clean teardown and memory disposal
 */

import * as THREE from 'three';
import { type LocomotionState } from '../types';

export class CharacterAnimator {
  private mixer: THREE.AnimationMixer | null = null;
  private actions: Map<string, THREE.AnimationAction> = new Map();
  private currentAction: THREE.AnimationAction | null = null;
  private currentClipName: string = '';

  constructor(rootObject?: THREE.Object3D) {
    if (rootObject) {
      this.attachRoot(rootObject);
    }
  }

  public attachRoot(rootObject: THREE.Object3D): void {
    this.mixer = new THREE.AnimationMixer(rootObject);
  }

  public registerClips(clips: THREE.AnimationClip[]): void {
    if (!this.mixer) return;

    for (const clip of clips) {
      const action = this.mixer.clipAction(clip);
      this.actions.set(clip.name.toLowerCase(), action);
    }
  }

  /**
   * Transition smoothly to a target locomotion action with crossfading.
   */
  public transitionTo(
    state: LocomotionState,
    speed: number = 0,
    crossfadeDuration: number = 0.2
  ): void {
    if (!this.mixer || this.actions.size === 0) return;

    let targetClip = 'idle';
    switch (state) {
      case 'idle':
        targetClip = 'idle';
        break;
      case 'walk':
        targetClip = 'walk';
        break;
      case 'run':
        targetClip = 'run';
        break;
      case 'sprint':
        targetClip = 'sprint';
        break;
      case 'airborne':
        targetClip = 'jumploop';
        break;
      case 'landing':
        targetClip = 'land';
        break;
      default:
        targetClip = 'idle';
    }

    const nextAction = this.actions.get(targetClip) || this.actions.get('idle');
    if (!nextAction) return;

    // Adjust playback rate to prevent foot-sliding
    if (targetClip === 'walk' && speed > 0) {
      nextAction.timeScale = Math.max(0.5, speed / 3.2);
    } else if (targetClip === 'run' && speed > 0) {
      nextAction.timeScale = Math.max(0.7, speed / 4.8);
    } else if (targetClip === 'sprint' && speed > 0) {
      nextAction.timeScale = Math.max(0.8, speed / 6.2);
    } else {
      nextAction.timeScale = 1.0;
    }

    if (this.currentAction === nextAction) return;

    nextAction.reset();
    nextAction.play();

    if (this.currentAction) {
      this.currentAction.crossFadeTo(nextAction, crossfadeDuration, true);
    }

    this.currentAction = nextAction;
    this.currentClipName = targetClip;
  }

  public update(delta: number): void {
    if (this.mixer) {
      this.mixer.update(delta);
    }
  }

  public dispose(): void {
    if (this.mixer) {
      this.mixer.stopAllAction();
      this.actions.clear();
      this.currentAction = null;
      this.mixer = null;
    }
  }
}
