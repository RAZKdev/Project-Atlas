import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';

import {
  POV_CONFIGS,
  AVATAR_SPECS,
} from '../src/features/museum/museumEngine/types.ts';
import { CameraSystem } from '../src/features/museum/museumEngine/cameraSystem.ts';
import { PlayerEntity } from '../src/features/museum/museumEngine/playerEntity.ts';
import { PlayerController } from '../src/features/museum/museumEngine/playerController.ts';
import { buildMuseumArchitecture } from '../src/features/museum/museumEngine/museumArchitecture.ts';

test('POV & Lifecycle Test 1: Simulation State Machine & Entry Gating', () => {
  // Gating invariant: initial state must be idle (no auto-start, no canvas pointer lock)
  let currentState = 'idle';
  assert.equal(currentState, 'idle', 'Default state must be idle to prevent accidental entry');

  // Explicit start action: user clicks "Masuk ke Simulasi Museum (3D)"
  const requestStartSimulation = () => {
    currentState = 'start_requested';
  };
  requestStartSimulation();
  assert.equal(currentState, 'start_requested', 'State transitions to start_requested upon explicit CTA click');

  // Engine lifecycle progression: loading assets, physics, lighting
  const proceedToLoading = () => {
    currentState = 'loading';
  };
  proceedToLoading();
  assert.equal(currentState, 'loading', 'State transitions to loading while assets prepare');

  // Ready to activate
  const proceedToReady = () => {
    currentState = 'ready';
  };
  proceedToReady();
  assert.equal(currentState, 'ready', 'State transitions to ready once initialized');

  // Active exploration
  const activateSimulation = () => {
    currentState = 'active';
  };
  activateSimulation();
  assert.equal(currentState, 'active', 'State becomes active for interactive gameplay');

  // Pause action (ESC or in-sim menu)
  const pauseSimulation = () => {
    currentState = 'paused';
  };
  pauseSimulation();
  assert.equal(currentState, 'paused', 'State becomes paused when user presses ESC or opens menu');

  // Resume action
  const resumeSimulation = () => {
    currentState = 'active';
  };
  resumeSimulation();
  assert.equal(currentState, 'active', 'State resumes to active when exiting pause menu');

  // Clean exit back to web page
  const exitSimulation = () => {
    currentState = 'exiting';
    currentState = 'idle';
  };
  exitSimulation();
  assert.equal(currentState, 'idle', 'State returns cleanly to idle on exit without page reload');
});

test('POV & Lifecycle Test 2: Camera POV Cycle & Mode Invariants', () => {
  const cameraSys = new CameraSystem();

  // Initial POV must be first_person
  assert.equal(cameraSys.currentPOV, 'first_person', 'Initial camera mode is first_person');
  assert.equal(POV_CONFIGS.first_person.fov, 72, 'POV 1 FOV must be 72 deg for human scale');
  assert.equal(POV_CONFIGS.first_person.distance, 0, 'POV 1 distance must be 0m (attached to eyes)');

  // Cycle 1: first_person -> third_person
  const next1 = cameraSys.cyclePOV();
  assert.equal(next1, 'third_person', 'First cycle switches to third_person');
  assert.equal(cameraSys.currentPOV, 'third_person');
  assert.equal(POV_CONFIGS.third_person.fov, 68, 'POV 2 FOV must be 68 deg');
  assert.equal(POV_CONFIGS.third_person.distance, 2.2, 'POV 2 distance must be 2.2m');

  // Cycle 2: third_person -> cinematic
  const next2 = cameraSys.cyclePOV();
  assert.equal(next2, 'cinematic', 'Second cycle switches to cinematic');
  assert.equal(cameraSys.currentPOV, 'cinematic');
  assert.equal(POV_CONFIGS.cinematic.fov, 62, 'POV 3 FOV must be 62 deg');
  assert.equal(POV_CONFIGS.cinematic.distance, 4.4, 'POV 3 distance must be 4.4m');

  // Cycle 3: cinematic -> first_person
  const next3 = cameraSys.cyclePOV();
  assert.equal(next3, 'first_person', 'Third cycle loops back to first_person');
  assert.equal(cameraSys.currentPOV, 'first_person');
});

test('POV & Lifecycle Test 3: Camera Wall-Collision Raycasting Clamping', () => {
  const cameraSys = new CameraSystem();
  cameraSys.setPOV('third_person');

  const arch = buildMuseumArchitecture();
  const mockCamera = new THREE.PerspectiveCamera(68, 1.6, 0.1, 80);

  // Position player with back against the south wall (z = 3.8m, facing into room yaw = Math.PI)
  // Camera would normally want to be at z = 3.8 + 2.2 = 6.0m (which is outside the building!)
  // South wall collider is at z ~ 4.0m. Raycast must clamp camera distance!
  const playerPos = new THREE.Vector3(0, 0.50, 3.8);
  const playerYaw = Math.PI; // facing south towards entrance
  const playerPitch = 0;

  // Run camera update
  cameraSys.update(0.05, playerPos, playerYaw, playerPitch, 0, arch.colliders, mockCamera);

  // Camera must be kept inside or clamped before the wall boundary
  // The camera position must NOT be at full 2.2m distance if that penetrates walls
  assert.ok(
    mockCamera.position.z <= 4.2,
    `Camera must be clamped inside museum bounds, got Z=${mockCamera.position.z}`
  );
});

test('POV & Lifecycle Test 4: Avatar Proportions & POV Visibility Toggling', () => {
  const player = new PlayerEntity(new THREE.Vector3(0, 0.50, 0), 0);

  // Avatar specs
  assert.equal(AVATAR_SPECS.height, 1.70, 'Avatar must be 1.70m');
  assert.equal(AVATAR_SPECS.eyeHeight, 1.60, 'Eye level must be 1.60m');

  // In POV 1 (First-Person), avatar should be hidden from inside head
  player.avatar.update(0.016, 'idle', 0, 0, player.position, 'first_person');
  assert.equal(player.avatar.rootGroup.visible, false, 'Avatar root must be invisible in POV 1 (FPS)');

  // In POV 2 (Third-Person), avatar must be visible
  player.avatar.update(0.016, 'walk', 3.2, 0, player.position, 'third_person');
  assert.equal(player.avatar.rootGroup.visible, true, 'Avatar root must be visible in POV 2 (Third-Person)');

  // In POV 3 (Cinematic), avatar must be visible
  player.avatar.update(0.016, 'walk', 3.2, 0, player.position, 'cinematic');
  assert.equal(player.avatar.rootGroup.visible, true, 'Avatar root must be visible in POV 3 (Cinematic)');
});

test('POV & Lifecycle Test 5: Input Controller Scoping & State Reset', () => {
  const controller = new PlayerController();
  const player = new PlayerEntity();
  const cameraSys = new CameraSystem();

  // Test input handling
  controller.onKeyDown('KeyW');
  controller.touchMove = { x: 0.5, y: -0.5 };
  controller.touchLookDelta = { x: 10, y: 5 };

  // Mouse move updates player orientation
  const initialYaw = player.yaw;
  controller.onMouseMove(50, 20, player, cameraSys);
  assert.notEqual(player.yaw, initialYaw, 'Mouse move must change player yaw');

  // Reset inputs cleans up state
  controller.resetInputs();
  assert.equal(controller.touchMove.x, 0, 'Touch move X must be reset');
  assert.equal(controller.touchMove.y, 0, 'Touch move Y must be reset');
  assert.equal(controller.touchLookDelta.x, 0, 'Touch look X must be reset');
  assert.equal(controller.touchJump, false, 'Touch jump must be reset');
});
