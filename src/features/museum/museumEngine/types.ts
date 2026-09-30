/**
 * museumEngine/types.ts
 * Type definitions for Museum Mini 3D ("195 Negara, 1 Cerita")
 *
 * Canonical Scale: 1 Three.js unit = 1 meter.
 */

import * as THREE from 'three';

/** 3D Axis-Aligned Bounding Box for physical collision */
export interface CollisionBox {
  min: [number, number, number];
  max: [number, number, number];
  name?: string;
}

/** Player Kinematic State */
export interface PlayerState {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  yaw: number;     // horizontal rotation (radians)
  pitch: number;   // vertical rotation (radians, clamped)
  isGrounded: boolean;
  isSprinting: boolean;
  isMoving: boolean;
}

/** Physical Avatar Constants */
export const AVATAR_SPECS = {
  height: 1.70,       // 1.70 m adult avatar height
  eyeHeight: 1.60,    // 1.60 m realistic eye level
  radius: 0.28,       // 0.28 m radius (width ~0.56 m)
  stepHeight: 0.20,   // max step height for stairs
  walkSpeed: 3.6,     // ~3.6 m/s walking speed
  sprintSpeed: 6.2,   // ~6.2 m/s sprint speed
  jumpForce: 4.8,     // initial jump velocity (m/s)
  gravity: 16.0,      // realistic snappy gravity (m/s^2)
  friction: 10.0,     // ground deceleration
  acceleration: 38.0, // ground acceleration
  interactDistance: 2.6, // raycast max distance to inspect exhibits
} as const;

/** Curated Museum Exhibit Item for Interaction */
export interface InteractableExhibit {
  id: string;
  zoneId: string;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  story: string;
  curatorNotes: string;
  specs: { label: string; value: string }[];
  position: [number, number, number];
  interactRadius: number;
  viewPosition?: [number, number, number];
  viewTarget?: [number, number, number];
  icon: string;
  tag: string;
  accentColor: string;
  relatedCountries?: string[];
}

/** Navigation / Camera Mode */
export type MuseumViewMode = 'walkthrough' | 'diorama';

/** Quality Settings Tier */
export type MuseumQualityTier = 'high' | 'medium' | 'low';
