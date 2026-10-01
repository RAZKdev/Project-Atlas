/**
 * museumEngine/types.ts
 * Type definitions & configuration constants for Museum Mini 3D ("195 Negara, 1 Cerita")
 *
 * Canonical Scale: 1 Three.js unit = 1 meter.
 */

import * as THREE from 'three';

/** Simulation Lifecycle States */
export type SimulationState =
  | 'idle'            // On Museum Page, 3D simulation inactive
  | 'starting'        // Start requested by explicit button click
  | 'loading'         // Initializing 3D assets, physics, lighting
  | 'ready'           // Ready to render
  | 'active'          // Player actively exploring in 3D world
  | 'paused'          // In-simulation pause menu active
  | 'exiting';        // Leaving simulation to return to Museum Page

/** Museum Page Navigation Sub-Tabs */
export type MuseumPageView = 'overview' | 'memories' | 'gallery' | 'info';

/** Three POV Camera Modes */
export type POVMode = 'first_person' | 'third_person' | 'cinematic';

/** Locomotion Animation States */
export type LocomotionState =
  | 'idle'
  | 'walk'
  | 'run'
  | 'sprint'
  | 'jump_takeoff'
  | 'airborne'
  | 'landing';

/** 3D Axis-Aligned Bounding Box for physical collision */
export interface CollisionBox {
  min: [number, number, number];
  max: [number, number, number];
  name?: string;
}

/** Physical Avatar Constants */
export const AVATAR_SPECS = {
  height: 1.70,          // 1.70 m adult avatar height (Project Requirement)
  eyeHeight: 1.60,       // 1.60 m realistic eye level
  radius: 0.28,          // 0.28 m radius (width ~0.56 m)
  stepHeight: 0.20,      // max step height for stairs
  walkSpeed: 3.2,        // ~3.2 m/s comfortable walking speed
  runSpeed: 4.8,         // ~4.8 m/s running speed
  sprintSpeed: 6.2,      // ~6.2 m/s sprint speed
  jumpForce: 4.8,        // initial jump velocity (m/s)
  gravity: 16.0,         // realistic snappy gravity (m/s^2)
  friction: 10.0,        // ground deceleration
  acceleration: 38.0,    // ground acceleration
  interactDistance: 2.6, // raycast max distance to inspect exhibits
} as const;

/** POV Camera Configurations */
export interface POVConfig {
  distance: number;
  height: number;
  shoulderOffset: number;
  fov: number;
  damping: number;
  minDistance: number;
  maxPitch: number;
  minPitch: number;
  lookSensitivity: number;
}

export const POV_CONFIGS: Record<POVMode, POVConfig> = {
  first_person: {
    distance: 0.0,
    height: 1.60,
    shoulderOffset: 0.0,
    fov: 72,
    damping: 0.0, // direct attachment to eye
    minDistance: 0.0,
    maxPitch: (85 * Math.PI) / 180,
    minPitch: -(85 * Math.PI) / 180,
    lookSensitivity: 0.0022,
  },
  third_person: {
    distance: 2.2,
    height: 1.80,
    shoulderOffset: 0.22,
    fov: 68,
    damping: 0.15,
    minDistance: 0.6,
    maxPitch: (75 * Math.PI) / 180,
    minPitch: -(60 * Math.PI) / 180,
    lookSensitivity: 0.0022,
  },
  cinematic: {
    distance: 4.4,
    height: 2.50,
    shoulderOffset: 0.0,
    fov: 62,
    damping: 0.08,
    minDistance: 0.8,
    maxPitch: (70 * Math.PI) / 180,
    minPitch: -(45 * Math.PI) / 180,
    lookSensitivity: 0.0018,
  },
};

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

/** Quality Settings Tier */
export type MuseumQualityTier = 'high' | 'medium' | 'low';

/** View Mode for Museum (Free Walkthrough vs Orbit Diorama) */
export type MuseumViewMode = 'walkthrough' | 'diorama';
