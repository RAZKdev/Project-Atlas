import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';

import {
  AVATAR_SPECS,
} from '../src/features/museum/museumEngine/types.ts';
import { PlayerEntity } from '../src/features/museum/museumEngine/playerEntity.ts';
import { AvatarRenderer } from '../src/features/museum/museumEngine/avatarRenderer.ts';
import { CameraSystem } from '../src/features/museum/museumEngine/cameraSystem.ts';
import { PlayerController } from '../src/features/museum/museumEngine/playerController.ts';

test('Character Locomotion Test 1: Canonical Avatar Specs & Kinematic Rig Integrity', () => {
  // 1. Proportions & Scale Contract
  assert.equal(AVATAR_SPECS.height, 1.70, 'Avatar height must be exact 1.70m human scale');
  assert.equal(AVATAR_SPECS.eyeHeight, 1.60, 'Eye level must be 1.60m');
  assert.equal(AVATAR_SPECS.radius, 0.28, 'Collision radius must be 0.28m');
  assert.equal(AVATAR_SPECS.walkSpeed, 3.2, 'Canonical walk speed must be 3.2 m/s');
  assert.equal(AVATAR_SPECS.runSpeed, 4.8, 'Canonical run speed must be 4.8 m/s');
  assert.equal(AVATAR_SPECS.sprintSpeed, 6.2, 'Canonical sprint speed must be 6.2 m/s');

  // 2. Skeletal Joint Hierarchy
  const avatar = new AvatarRenderer();
  assert.ok(avatar.rootGroup, 'Avatar root group must exist');
  assert.ok(avatar.pelvisGroup, 'Pelvis group must exist at y=0.90m');
  assert.equal(avatar.pelvisGroup.position.y, 0.90, 'Pelvis height must be at 0.90m above ground');

  assert.ok(avatar.torsoMesh, 'Torso mesh must exist');
  assert.ok(avatar.headGroup, 'Head group must exist');

  // 3-Joint Leg Rig (Hip -> Knee -> Ankle)
  assert.ok(avatar.leftLegPivot, 'Left leg hip pivot must exist');
  assert.ok(avatar.leftKneePivot, 'Left knee pivot must exist');
  assert.ok(avatar.leftAnklePivot, 'Left ankle pivot must exist');

  assert.ok(avatar.rightLegPivot, 'Right leg hip pivot must exist');
  assert.ok(avatar.rightKneePivot, 'Right knee pivot must exist');
  assert.ok(avatar.rightAnklePivot, 'Right ankle pivot must exist');

  // Ankle pivot should be located at y = -0.42m from knee (-0.86m from hip), placing boot sole flush with ground (y=0.00m)
  assert.equal(avatar.leftAnklePivot.position.y, -0.42, 'Ankle pivot must be -0.42m from knee');
  assert.equal(avatar.rightAnklePivot.position.y, -0.42, 'Ankle pivot must be -0.42m from knee');

  // Arms
  assert.ok(avatar.leftArmPivot && avatar.leftElbowPivot, 'Left arm & elbow pivots must exist');
  assert.ok(avatar.rightArmPivot && avatar.rightElbowPivot, 'Right arm & elbow pivots must exist');
});

test('Character Locomotion Test 2: Distance-Driven Gait Phase & Zero Foot-Sliding', () => {
  const avatar = new AvatarRenderer();
  const worldPos = new THREE.Vector3(0, 0, 0);

  // Initial phase must be 0
  assert.equal(avatar.gaitPhase, 0, 'Initial gait phase must be 0');

  // CASE A: Stationary Idle (speed = 0)
  // When player is stationary, gait phase must NOT advance (ZERO foot sliding!)
  for (let i = 0; i < 20; i++) {
    avatar.update(0.05, worldPos, 0, 'idle', 0, 'third_person');
  }
  assert.equal(avatar.gaitPhase, 0, 'Gait phase must remain strictly 0 when stationary (no foot sliding)');

  // CASE B: Walking Forward (speed = 3.2 m/s over 0.5s = 1.6m covered)
  // With stride length ~1.35m, phase should advance: (1.6 / 1.35) * 2pi ~ 7.44 rad (wrapped modulo 2pi)
  const initialPhase = avatar.gaitPhase;
  avatar.update(0.5, worldPos, 0, 'walk', 3.2, 'third_person');
  assert.notEqual(avatar.gaitPhase, initialPhase, 'Gait phase must advance proportionally to distance traveled');
  assert.ok(avatar.gaitPhase >= 0 && avatar.gaitPhase <= Math.PI * 2, 'Gait phase must be normalized [0, 2pi]');

  // CASE C: Stop walking immediately -> Phase accumulation stops
  const stoppedPhase = avatar.gaitPhase;
  for (let i = 0; i < 10; i++) {
    avatar.update(0.05, worldPos, 0, 'idle', 0, 'third_person');
  }
  assert.equal(avatar.gaitPhase, stoppedPhase, 'Gait phase must freeze immediately when movement stops');
});

test('Character Locomotion Test 3: Biomechanical Gait Articulation (Hip, Knee, Ankle, Arms)', () => {
  const avatar = new AvatarRenderer();
  const worldPos = new THREE.Vector3(0, 0, 0);

  // Step through half of a walk cycle (stride phase ~ pi/2)
  for (let i = 0; i < 15; i++) {
    avatar.update(0.04, worldPos, 0, 'walk', 3.2, 'third_person');
  }

  // 1. Alternating Anti-Phase Leg Motion
  // When left leg is forward (positive X rot), right leg must be backward (negative X rot) or vice versa
  const leftHipX = avatar.currentPose.leftLegRotX;
  const rightHipX = avatar.currentPose.rightLegRotX;
  assert.ok(
    (leftHipX > 0.05 && rightHipX < -0.05) || (leftHipX < -0.05 && rightHipX > 0.05),
    `Left hip (${leftHipX.toFixed(2)}) and Right hip (${rightHipX.toFixed(2)}) must swing in opposite phase`
  );

  // 2. Swing Knee Flexion vs Stance Knee Extension
  // The swing leg must bend significantly more than the stance leg for ground clearance
  const leftKneeX = avatar.currentPose.leftKneeRotX;
  const rightKneeX = avatar.currentPose.rightKneeRotX;
  assert.notEqual(
    leftKneeX.toFixed(2),
    rightKneeX.toFixed(2),
    'Swing knee and stance knee must have distinct biomechanical flexion values'
  );

  // 3. Ankle Articulation (Heel Strike & Toe Off)
  const leftAnkleX = avatar.currentPose.leftAnkleRotX;
  const rightAnkleX = avatar.currentPose.rightAnkleRotX;
  assert.ok(
    Math.abs(leftAnkleX) > 0.02 || Math.abs(rightAnkleX) > 0.02,
    'Ankle must articulate throughout gait cycle'
  );

  // 4. Arms Swing Anti-Phase with Legs
  // Left arm swings with right leg; right arm swings with left leg
  const leftArmX = avatar.currentPose.leftArmRotX;
  assert.ok(
    (leftHipX > 0 && leftArmX < 0) || (leftHipX < 0 && leftArmX > 0),
    'Arm swing must oppose hip swing on same side'
  );
});

test('Character Locomotion Test 4: 7-State Locomotion Machine Full Progression', () => {
  const player = new PlayerEntity(new THREE.Vector3(0, 0, 5.0), 0);
  const colliders = [];
  const exhibits = [];

  // Initial State: IDLE
  player.update(0.05, { x: 0, z: 0 }, false, false, colliders, exhibits, 'third_person');
  assert.equal(player.locomotionState, 'idle', 'Zero movement must produce IDLE state');

  // WALK: forward input at walk speed
  for (let i = 0; i < 20; i++) {
    player.update(0.05, { x: 0, z: -1 }, false, false, colliders, exhibits, 'third_person');
  }
  assert.equal(player.locomotionState, 'walk', 'Normal forward movement must produce WALK state');
  assert.ok(player.speed >= 3.0 && player.speed <= 3.3, 'Speed must settle around walk speed');

  // SPRINT: forward input with sprint key held
  for (let i = 0; i < 30; i++) {
    player.update(0.05, { x: 0, z: -1 }, false, true, colliders, exhibits, 'third_person');
  }
  assert.equal(player.locomotionState, 'sprint', 'Forward + Shift must produce SPRINT state');
  assert.ok(player.speed >= 5.8 && player.speed <= 6.3, 'Speed must settle around sprint speed');

  // JUMP TAKEOFF: press jump while grounded
  player.update(0.05, { x: 0, z: -1 }, true, true, colliders, exhibits, 'third_person');
  assert.equal(player.locomotionState, 'jump_takeoff', 'Initiating jump must produce JUMP_TAKEOFF state');
  assert.ok(player.velocity.y > 0, 'Vertical velocity must be positive on takeoff');
  assert.equal(player.isGrounded, false, 'Player must leave ground');

  // AIRBORNE: mid-air flight
  for (let i = 0; i < 8; i++) {
    player.update(0.05, { x: 0, z: -1 }, false, false, colliders, exhibits, 'third_person');
  }
  assert.equal(player.locomotionState, 'airborne', 'Falling or in air must produce AIRBORNE state');

  // LANDING: simulate impact on ground
  // Run until player hits ground y=0.0
  while (!player.isGrounded) {
    player.update(0.03, { x: 0, z: 0 }, false, false, colliders, exhibits, 'third_person');
  }
  assert.equal(player.locomotionState, 'landing', 'Touchdown after airborne must produce LANDING state');
  assert.ok(player.landingTimer > 0, 'Landing timer must be active to absorb impact');

  // LANDING -> IDLE RECOVERY: let landing timer expire while stationary
  for (let i = 0; i < 15; i++) {
    player.update(0.03, { x: 0, z: 0 }, false, false, colliders, exhibits, 'third_person');
  }
  assert.equal(player.locomotionState, 'idle', 'Landing must cleanly recover to IDLE when stationary');
  assert.equal(player.landingTimer, 0, 'Landing timer must reset to 0');
});

test('Character Locomotion Test 5: Velocity Hysteresis & Anti-Flicker Thresholds', () => {
  const player = new PlayerEntity(new THREE.Vector3(0, 0, 5.0), 0);
  player.isGrounded = true;

  // 1. Idle -> Walk transition threshold is 0.25 m/s
  player.locomotionState = 'idle';
  player.velocity.set(0.20, 0, 0);
  player.update(0.001, { x: 0, z: 0 }, false, false, [], [], 'third_person');
  // At speed ~0.20, state must stay idle
  assert.equal(player.locomotionState, 'idle', 'Speed < 0.25 must not prematurely trigger walk');

  // 2. Walk -> Idle transition threshold is 0.15 m/s (hysteresis band 0.15 to 0.25)
  player.locomotionState = 'walk';
  player.velocity.set(0.20, 0, 0);
  player.update(0.001, { x: 0, z: 0 }, false, false, [], [], 'third_person');
  assert.equal(player.locomotionState, 'walk', 'Decelerating to 0.20 must stay in walk (hysteresis guard)');

  // 3. Walk -> Run transition threshold is 3.8 m/s
  player.locomotionState = 'walk';
  player.velocity.set(3.5, 0, 0);
  player.update(0.001, { x: 0, z: 0 }, false, false, [], [], 'third_person');
  assert.equal(player.locomotionState, 'walk', 'Speed < 3.8 must stay in walk');

  // 4. Run -> Walk transition threshold is 3.2 m/s (hysteresis band 3.2 to 3.8)
  player.locomotionState = 'run';
  player.velocity.set(3.5, 0, 0);
  player.update(0.001, { x: 0, z: 0 }, false, false, [], [], 'third_person');
  assert.equal(player.locomotionState, 'run', 'Decelerating to 3.5 must stay in run (hysteresis guard)');
});

test('Character Locomotion Test 6: Upper Body Dynamics (Torso Counter-Twist & Head Stabilization)', () => {
  const avatar = new AvatarRenderer();
  const worldPos = new THREE.Vector3(0, 0, 0);

  // Update in walk mode
  for (let i = 0; i < 20; i++) {
    avatar.update(0.03, worldPos, 0, 'walk', 3.2, 'third_person');
  }

  // 1. Torso Counter-Twist: Torso should rotate along Y axis opposite to pelvic motion
  assert.ok(
    Math.abs(avatar.currentPose.torsoRotY) > 0.005,
    'Torso must exhibit dynamic counter-twist around Y axis during locomotion'
  );

  // 2. Head Gaze Stabilization: Head should counter-rotate to keep gaze forward
  // Sign of headRotY should oppose torsoRotY to cancel angular deflection
  assert.ok(
    avatar.currentPose.headRotY * avatar.currentPose.torsoRotY <= 0.001,
    'Head yaw must oppose torso yaw for gaze stabilization'
  );

  // 3. Forward Posture Lean: Sprint lean > Run lean > Walk lean > Idle lean
  const idlePose = { ...avatar.currentPose };

  for (let i = 0; i < 25; i++) avatar.update(0.03, worldPos, 0, 'walk', 3.2, 'third_person');
  const walkLean = avatar.currentPose.torsoRotX;

  for (let i = 0; i < 25; i++) avatar.update(0.03, worldPos, 0, 'run', 4.8, 'third_person');
  const runLean = avatar.currentPose.torsoRotX;

  for (let i = 0; i < 25; i++) avatar.update(0.03, worldPos, 0, 'sprint', 6.2, 'third_person');
  const sprintLean = avatar.currentPose.torsoRotX;

  assert.ok(walkLean >= idlePose.torsoRotX, 'Walk lean must be >= idle lean');
  assert.ok(runLean > walkLean, 'Run lean must be greater than walk lean');
  assert.ok(sprintLean > runLean, 'Sprint lean must be greater than run lean (athletic drive posture)');
});

test('Character Locomotion Test 7: Smooth Pose Blending (Zero Popping / Snapping)', () => {
  const avatar = new AvatarRenderer();
  const worldPos = new THREE.Vector3(0, 0, 0);

  // Run at high speed
  for (let i = 0; i < 20; i++) {
    avatar.update(0.04, worldPos, 0, 'run', 4.8, 'third_person');
  }

  const runPelvisY = avatar.currentPose.pelvisY;
  const runLeftLegX = avatar.currentPose.leftLegRotX;

  // Abruptly switch to idle in the next single frame (dt = 0.016s)
  avatar.update(0.016, worldPos, 0, 'idle', 0, 'third_person');

  // Verify that limb transforms DID NOT snap instantly to resting 0 in 1 frame
  // Blending guarantees exponential smooth convergence over several frames
  const deltaLegX = Math.abs(avatar.currentPose.leftLegRotX - runLeftLegX);
  assert.ok(
    deltaLegX < 0.35,
    `Frame-to-frame rotational delta (${deltaLegX.toFixed(3)} rad) must be smooth (no instantaneous snapping)`
  );
  assert.notEqual(avatar.currentPose.leftLegRotX, 0, 'Limb must not snap instantly to 0 upon entering idle');
});

test('Character Locomotion Test 8: Multi-POV Decoupling & Visibility Invariants', () => {
  const player = new PlayerEntity(new THREE.Vector3(0, 0, 5.0), 0);
  const colliders = [];
  const exhibits = [];

  // POV 1: First-Person Mode
  // Avatar mesh must be hidden to prevent camera clipping inside head
  player.update(0.05, { x: 0, z: -1 }, false, false, colliders, exhibits, 'first_person');
  assert.equal(player.avatar.rootGroup.visible, false, 'Avatar mesh must be invisible in POV 1 (First-Person)');
  // Head bobbing must be active in POV 1
  assert.notEqual(player.bobY, 0, 'Head bobbing must be active during movement in POV 1');

  // POV 2: Third-Person Mode
  player.update(0.05, { x: 0, z: -1 }, false, false, colliders, exhibits, 'third_person');
  assert.equal(player.avatar.rootGroup.visible, true, 'Avatar mesh must be visible in POV 2 (Third-Person)');

  // POV 3: Cinematic Mode
  player.update(0.05, { x: 0, z: -1 }, false, false, colliders, exhibits, 'cinematic');
  assert.equal(player.avatar.rootGroup.visible, true, 'Avatar mesh must be visible in POV 3 (Cinematic)');

  // Switching POV must NOT alter player physics, velocity, or position
  const posBefore = player.position.clone();
  const velBefore = player.velocity.clone();
  const stateBefore = player.locomotionState;

  // Tick with POV 1 then POV 2 with identical inputs
  player.update(0.02, { x: 0, z: 0 }, false, false, colliders, exhibits, 'first_person');
  player.update(0.02, { x: 0, z: 0 }, false, false, colliders, exhibits, 'third_person');

  assert.equal(player.locomotionState, stateBefore, 'POV switch must not mutate locomotion state');
  assert.equal(player.position.y, posBefore.y, 'POV switch must not mutate player elevation');
});
