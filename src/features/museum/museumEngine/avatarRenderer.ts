/**
 * museumEngine/avatarRenderer.ts
 * Human-scale 1.70 m explorer avatar with IK-driven procedural locomotion.
 *
 * Responsibilities (presentation only — never mutates player physics):
 * - Builds the stylised 1.70 m avatar (head top 1.70 m, eye level ≈1.60 m).
 * - Skeleton: pelvis → spine → (torso, head, arms); pelvis → hip → knee → ankle.
 * - Faces the direction of actual travel (third-person convention) and turns smoothly.
 * - Ground locomotion uses gaitKinematics.ts: the gait phase advances by real ground
 *   distance and planted feet are placed with analytic leg IK, so the flat-foot contact
 *   point does not slide. Walk → run → sprint parameters vary continuously with speed.
 * - Airborne / take-off / landing poses are crossfaded with time-based weights.
 * - Hidden in first-person POV (camera sits inside the head).
 *
 * Mesh convention: the avatar mesh faces local +Z. The player's yaw convention has
 * forward = (-sin yaw, 0, -cos yaw), so the root is rotated by (bodyYaw + π).
 */

import * as THREE from 'three';
import { type LocomotionState, type POVMode } from './types';
import {
  LEG,
  cycleLength,
  gaitParamsForSpeed,
  pelvisHeightFor,
  sampleFoot,
  solveLegIK,
  type FootSample,
  type GaitParams,
  type LegAngles,
} from './gaitKinematics';

const TWO_PI = Math.PI * 2;
const IDLE_PELVIS_Y = 0.90;

/** Joint angles applied to the rig (radians, metres for pelvis). */
export interface AvatarPose {
  pelvisY: number;
  pelvisX: number;
  spineLean: number;
  spineTwist: number;
  spineRoll: number;
  headPitch: number;
  headYaw: number;
  leftHip: number;
  leftHipRoll: number;
  leftKnee: number;
  leftAnkle: number;
  rightHip: number;
  rightHipRoll: number;
  rightKnee: number;
  rightAnkle: number;
  leftShoulder: number;
  leftShoulderRoll: number;
  rightShoulder: number;
  rightShoulderRoll: number;
  leftElbow: number;
  rightElbow: number;

  // Aliases for test contracts & backwards compatibility
  leftLegRotX: number;
  rightLegRotX: number;
  leftKneeRotX: number;
  rightKneeRotX: number;
  leftAnkleRotX: number;
  rightAnkleRotX: number;
  leftArmRotX: number;
  rightArmRotX: number;
  torsoRotX: number;
  torsoRotY: number;
  headRotX: number;
  headRotY: number;
}

const POSE_KEYS: (keyof AvatarPose)[] = [
  'pelvisY', 'pelvisX', 'spineLean', 'spineTwist', 'spineRoll', 'headPitch', 'headYaw',
  'leftHip', 'leftHipRoll', 'leftKnee', 'leftAnkle', 'rightHip', 'rightHipRoll', 'rightKnee', 'rightAnkle',
  'leftShoulder', 'leftShoulderRoll', 'rightShoulder', 'rightShoulderRoll', 'leftElbow', 'rightElbow',
  'leftLegRotX', 'rightLegRotX', 'leftKneeRotX', 'rightKneeRotX', 'leftAnkleRotX', 'rightAnkleRotX',
  'leftArmRotX', 'rightArmRotX', 'torsoRotX', 'torsoRotY', 'headRotX', 'headRotY',
];

function syncAliases(p: AvatarPose): void {
  p.leftLegRotX = p.leftHip;
  p.rightLegRotX = p.rightHip;
  p.leftKneeRotX = p.leftKnee;
  p.rightKneeRotX = p.rightKnee;
  p.leftAnkleRotX = p.leftAnkle;
  p.rightAnkleRotX = p.rightAnkle;
  p.leftArmRotX = p.leftShoulder;
  p.rightArmRotX = p.rightShoulder;
  p.torsoRotX = p.spineLean;
  p.torsoRotY = p.spineTwist;
  p.headRotX = p.headPitch;
  p.headRotY = p.headYaw;
}

function makePose(): AvatarPose {
  const p = {} as AvatarPose;
  for (const k of POSE_KEYS) p[k] = 0;
  return p;
}

/** Ground pose described in target space (foot positions), resolved by IK later. */
interface GroundTarget {
  pelvisY: number;
  pelvisX: number;
  lz: number; ly: number; lp: number;
  rz: number; ry: number; rp: number;
  spineLean: number; spineTwist: number; spineRoll: number;
  headPitch: number; headYaw: number;
  lSh: number; rSh: number; lShRoll: number; rShRoll: number;
  lEl: number; rEl: number;
}

const GT_KEYS: (keyof GroundTarget)[] = [
  'pelvisY', 'pelvisX', 'lz', 'ly', 'lp', 'rz', 'ry', 'rp', 'spineLean', 'spineTwist', 'spineRoll',
  'headPitch', 'headYaw', 'lSh', 'rSh', 'lShRoll', 'rShRoll', 'lEl', 'rEl',
];

function makeGT(): GroundTarget {
  const g = {} as GroundTarget;
  for (const k of GT_KEYS) g[k] = 0;
  return g;
}

function approach(current: number, target: number, rate: number, dt: number): number {
  return current + (target - current) * (1 - Math.exp(-rate * dt));
}

function smoothstep(e0: number, e1: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
}

function wrapAngle(a: number): number {
  return Math.atan2(Math.sin(a), Math.cos(a));
}

export interface AvatarDebugState {
  phase: number;
  groundSpeed: number;
  gaitWeight: number;
  airWeight: number;
  landingWeight: number;
  bodyYaw: number;
  left: FootSample;
  right: FootSample;
}

export class AvatarRenderer {
  public rootGroup: THREE.Group;

  // Skeleton
  public pelvisGroup: THREE.Group;
  public spineGroup: THREE.Group;
  public torsoMesh: THREE.Mesh;
  public headGroup: THREE.Group;
  public leftLegPivot: THREE.Group;
  public rightLegPivot: THREE.Group;
  public leftKneePivot: THREE.Group;
  public rightKneePivot: THREE.Group;
  public leftAnklePivot: THREE.Group;
  public rightAnklePivot: THREE.Group;
  public leftArmPivot: THREE.Group;
  public rightArmPivot: THREE.Group;
  public leftElbowPivot: THREE.Group;
  public rightElbowPivot: THREE.Group;

  // Locomotion state (presentation only)
  /** Leg-cycle phase of the LEFT leg, u ∈ [0, 1). Right leg = u + 0.5. */
  public gaitPhase = 0;
  /** Set to 0 by PlayerEntity on touchdown; advanced here. */
  public landingProgress = 1.0;
  public bodyYaw = 0;
  public currentPose: AvatarPose = makePose();

  private breathPhase = 0;
  private smoothedSpeed = 0;
  private gaitWeight = 0;
  private airWeight = 0;
  private takeoffWeight = 0;
  private landingWeight = 0;
  private initialised = false;
  private lastPos = new THREE.Vector3();

  // Scratch objects (no per-frame allocation)
  private gait: GaitParams = gaitParamsForSpeed(0);
  private footL: FootSample = sampleFoot(0, this.gait);
  private footR: FootSample = sampleFoot(0.5, this.gait);
  private idleGT = makeGT();
  private gaitGT = makeGT();
  private landGT = makeGT();
  private mixGT = makeGT();
  private groundPose = makePose();
  private airPose = makePose();
  private takeoffPose = makePose();
  private ikL: LegAngles = { hip: 0, knee: 0, ankle: 0, reached: true };
  private ikR: LegAngles = { hip: 0, knee: 0, ankle: 0, reached: true };
  private scratchPos = new THREE.Vector3();

  constructor() {
    this.rootGroup = new THREE.Group();
    this.rootGroup.name = 'ExplorerAvatar_170cm';

    // ── Materials ───────────────────────────────────────────────────────────
    const matJacket = new THREE.MeshStandardMaterial({ color: 0x343a40, roughness: 0.82, metalness: 0.05 });
    const matPants = new THREE.MeshStandardMaterial({ color: 0x6c6356, roughness: 0.88, metalness: 0.02 });
    const matLeather = new THREE.MeshStandardMaterial({ color: 0x5a341a, roughness: 0.55, metalness: 0.12 });
    const matSkin = new THREE.MeshStandardMaterial({ color: 0xd8a888, roughness: 0.65, metalness: 0.0 });
    const matBoots = new THREE.MeshStandardMaterial({ color: 0x221c18, roughness: 0.7, metalness: 0.1 });
    const matHat = new THREE.MeshStandardMaterial({ color: 0x28231d, roughness: 0.75, metalness: 0.05 });
    const matBrass = new THREE.MeshStandardMaterial({ color: 0xd4a843, roughness: 0.25, metalness: 0.9 });

    const addMesh = (parent: THREE.Object3D, geo: THREE.BufferGeometry, mat: THREE.Material, x: number, y: number, z: number, shadow = true) => {
      const m = new THREE.Mesh(geo, mat);
      m.position.set(x, y, z);
      m.castShadow = shadow;
      parent.add(m);
      return m;
    };

    // ── Pelvis (origin y = 0.90 m in bind pose) ─────────────────────────────
    this.pelvisGroup = new THREE.Group();
    this.pelvisGroup.position.set(0, 0.9, 0);
    this.rootGroup.add(this.pelvisGroup);

    addMesh(this.pelvisGroup, new THREE.BoxGeometry(0.32, 0.16, 0.22), matPants, 0, 0, 0);
    addMesh(this.pelvisGroup, new THREE.BoxGeometry(0.33, 0.05, 0.23), matLeather, 0, 0.06, 0, false);
    addMesh(this.pelvisGroup, new THREE.BoxGeometry(0.06, 0.06, 0.02), matBrass, 0, 0.06, 0.12, false); // buckle = front (+Z)

    // ── Spine (waist pivot) carrying torso, head and arms ───────────────────
    this.spineGroup = new THREE.Group();
    this.spineGroup.position.set(0, 0.08, 0);
    this.pelvisGroup.add(this.spineGroup);

    this.torsoMesh = addMesh(this.spineGroup, new THREE.BoxGeometry(0.36, 0.5, 0.24), matJacket, 0, 0.25, 0);
    const strap = addMesh(this.spineGroup, new THREE.BoxGeometry(0.04, 0.54, 0.26), matLeather, 0.06, 0.26, 0, false);
    strap.rotation.z = Math.PI / 8;
    addMesh(this.spineGroup, new THREE.BoxGeometry(0.12, 0.22, 0.26), matLeather, -0.21, 0.06, -0.04);

    // Head (pivot at neck base, world ≈ 1.52 m)
    this.headGroup = new THREE.Group();
    this.headGroup.position.set(0, 0.54, 0);
    this.spineGroup.add(this.headGroup);
    addMesh(this.headGroup, new THREE.CylinderGeometry(0.06, 0.07, 0.08, 12), matSkin, 0, 0, 0, false);
    const head = addMesh(this.headGroup, new THREE.SphereGeometry(0.11, 16, 16), matSkin, 0, 0.11, 0);
    head.scale.set(1.0, 1.15, 1.05);
    addMesh(this.headGroup, new THREE.CylinderGeometry(0.1, 0.12, 0.09, 16), matHat, 0, 0.2, -0.01, false); // crown top = 1.70 m
    addMesh(this.headGroup, new THREE.CylinderGeometry(0.18, 0.18, 0.02, 16), matHat, 0, 0.16, 0, false);

    // ── Legs: hip → knee → ankle ────────────────────────────────────────────
    const upperLegGeo = new THREE.BoxGeometry(0.13, LEG.upper, 0.14);
    const lowerLegGeo = new THREE.BoxGeometry(0.11, LEG.lower, 0.12);
    const bootGeo = new THREE.BoxGeometry(0.12, 0.1, LEG.heel + LEG.toe);
    const bootZ = (LEG.toe - LEG.heel) / 2; // heel at -0.06, toe at +0.14 from the ankle

    const buildLeg = (side: -1 | 1) => {
      const hip = new THREE.Group();
      hip.position.set(side * LEG.hipX, LEG.hipY, 0);
      this.pelvisGroup.add(hip);
      addMesh(hip, upperLegGeo, matPants, 0, -LEG.upper / 2, 0);
      const knee = new THREE.Group();
      knee.position.set(0, -LEG.upper, 0);
      hip.add(knee);
      addMesh(knee, lowerLegGeo, matPants, 0, -LEG.lower / 2, 0);
      const ankle = new THREE.Group();
      ankle.position.set(0, -LEG.lower, 0);
      knee.add(ankle);
      addMesh(ankle, bootGeo, matBoots, 0, 0.05, bootZ); // sole flush with the ankle plane (ground)
      return { hip, knee, ankle };
    };
    const left = buildLeg(-1);
    const right = buildLeg(1);
    this.leftLegPivot = left.hip;
    this.leftKneePivot = left.knee;
    this.leftAnklePivot = left.ankle;
    this.rightLegPivot = right.hip;
    this.rightKneePivot = right.knee;
    this.rightAnklePivot = right.ankle;

    // ── Arms: shoulder → elbow ──────────────────────────────────────────────
    const upperArmGeo = new THREE.BoxGeometry(0.1, 0.26, 0.11);
    const forearmGeo = new THREE.BoxGeometry(0.09, 0.24, 0.1);
    const handGeo = new THREE.BoxGeometry(0.07, 0.08, 0.08);
    const buildArm = (side: -1 | 1) => {
      const shoulder = new THREE.Group();
      shoulder.position.set(side * 0.23, 0.42, 0);
      this.spineGroup.add(shoulder);
      addMesh(shoulder, upperArmGeo, matJacket, 0, -0.13, 0);
      const elbow = new THREE.Group();
      elbow.position.set(0, -0.26, 0);
      shoulder.add(elbow);
      addMesh(elbow, forearmGeo, matJacket, 0, -0.12, 0);
      addMesh(elbow, handGeo, matSkin, 0, -0.26, 0, false);
      return { shoulder, elbow };
    };
    const la = buildArm(-1);
    const ra = buildArm(1);
    this.leftArmPivot = la.shoulder;
    this.leftElbowPivot = la.elbow;
    this.rightArmPivot = ra.shoulder;
    this.rightElbowPivot = ra.elbow;

    this.buildAirPoses();
    this.computeIdleTarget(0);
    this.resolveGround(this.idleGT, this.currentPose);
    this.applyPose(this.currentPose);
  }

  /** Static airborne & take-off poses (angle space). */
  private buildAirPoses(): void {
    const a = this.airPose;
    a.pelvisY = 0.9;
    a.spineLean = -0.03;
    a.headPitch = 0.02;
    a.leftHip = -0.5; a.leftKnee = 0.95; a.leftAnkle = 0.3;
    a.rightHip = 0.12; a.rightKnee = 0.6; a.rightAnkle = 0.35;
    a.leftShoulder = -0.55; a.rightShoulder = -0.45;
    a.leftShoulderRoll = -0.35; a.rightShoulderRoll = 0.35;
    a.leftElbow = -0.6; a.rightElbow = -0.6;

    const t = this.takeoffPose;
    t.pelvisY = 0.9;
    t.spineLean = 0.06;
    t.headPitch = -0.04;
    t.leftHip = -0.18; t.leftKnee = 0.22; t.leftAnkle = 0.45;
    t.rightHip = 0.15; t.rightKnee = 0.3; t.rightAnkle = 0.5;
    t.leftShoulder = -0.9; t.rightShoulder = -0.8;
    t.leftShoulderRoll = -0.15; t.rightShoulderRoll = 0.15;
    t.leftElbow = -0.5; t.rightElbow = -0.5;

    syncAliases(a);
    syncAliases(t);
  }

  private computeIdleTarget(dt: number): void {
    this.breathPhase += dt * 1.6;
    const breath = Math.sin(this.breathPhase);
    const shift = Math.sin(this.breathPhase * 0.31) * 0.006;
    const g = this.idleGT;
    g.pelvisY = IDLE_PELVIS_Y + breath * 0.003;
    g.pelvisX = shift;
    g.lz = 0.03; g.ly = 0; g.lp = 0;
    g.rz = -0.02; g.ry = 0; g.rp = 0;
    g.spineLean = 0.02 + breath * 0.008;
    g.spineTwist = 0;
    g.spineRoll = -shift * 1.5;
    g.headPitch = -0.01;
    g.headYaw = Math.sin(this.breathPhase * 0.23) * 0.05;
    g.lSh = 0.05 + breath * 0.015;
    g.rSh = 0.05 - breath * 0.015;
    g.lShRoll = -0.07; g.rShRoll = 0.07;
    g.lEl = -0.16; g.rEl = -0.16;
  }

  private computeGaitTarget(): void {
    const g = this.gait;
    const uL = this.gaitPhase;
    const uR = uL + 0.5;
    sampleFoot(uL, g, this.footL);
    sampleFoot(uR, g, this.footR);
    const t = this.gaitGT;
    t.pelvisY = pelvisHeightFor(this.footL, this.footR, g);

    // Lateral weight transfer toward the planted foot (walk only — no sway in flight gaits).
    const wl = this.footL.inStance ? Math.sin(Math.PI * this.footL.stanceProgress) : 0;
    const wr = this.footR.inStance ? Math.sin(Math.PI * this.footR.stanceProgress) : 0;
    const swayAmp = 0.016 * smoothstep(0.35, 0.55, g.duty);
    t.pelvisX = swayAmp * (wr - wl);

    t.lz = this.footL.ankleZ; t.ly = this.footL.ankleY; t.lp = this.footL.pitch;
    t.rz = this.footR.ankleZ; t.ry = this.footR.ankleY; t.rp = this.footR.pitch;

    const cL = Math.cos(TWO_PI * uL);
    const cR = Math.cos(TWO_PI * uR);
    t.spineLean = g.lean;
    t.spineTwist = g.twist * cR; // left shoulder forward while the right foot is forward
    t.spineRoll = -t.pelvisX * 1.2;
    t.headPitch = -g.lean * 0.75;
    t.headYaw = -t.spineTwist * 0.9; // keep gaze forward
    t.lSh = g.armSwing * cL; // left arm back while the left foot is forward
    t.rSh = g.armSwing * cR;
    t.lShRoll = -0.08; t.rShRoll = 0.08;
    t.lEl = -(g.elbowBase + g.elbowSwing * Math.max(0, -cL));
    t.rEl = -(g.elbowBase + g.elbowSwing * Math.max(0, -cR));
  }

  private computeLandingTarget(dt: number): void {
    this.landingProgress = Math.min(1, this.landingProgress + dt / 0.22);
    const k = 1 - this.landingProgress;
    const comp = 0.13 * k * k * (3 - 2 * k);
    const g = this.landGT;
    g.pelvisY = IDLE_PELVIS_Y - comp;
    g.pelvisX = 0;
    g.lz = 0.07; g.ly = 0; g.lp = 0;
    g.rz = -0.05; g.ry = 0; g.rp = 0;
    g.spineLean = 0.05 + comp * 1.1;
    g.spineTwist = 0; g.spineRoll = 0;
    g.headPitch = -comp * 0.6; g.headYaw = 0;
    g.lSh = -0.25; g.rSh = -0.25;
    g.lShRoll = -0.3; g.rShRoll = 0.3;
    g.lEl = -0.45; g.rEl = -0.45;
  }

  /** Resolve a target-space ground pose into joint angles via leg IK. */
  private resolveGround(t: GroundTarget, out: AvatarPose): void {
    const hipH = t.pelvisY + LEG.hipY;
    solveLegIK(t.lz, t.ly - hipH, t.lp, this.ikL);
    solveLegIK(t.rz, t.ry - hipH, t.rp, this.ikR);
    out.pelvisY = t.pelvisY;
    out.pelvisX = t.pelvisX;
    // Keep feet on their hip-width lines when the pelvis sways.
    const roll = -Math.asin(Math.max(-0.2, Math.min(0.2, t.pelvisX / Math.max(0.5, hipH))));
    out.leftHip = this.ikL.hip; out.leftKnee = this.ikL.knee; out.leftAnkle = this.ikL.ankle; out.leftHipRoll = roll;
    out.rightHip = this.ikR.hip; out.rightKnee = this.ikR.knee; out.rightAnkle = this.ikR.ankle; out.rightHipRoll = roll;
    out.spineLean = t.spineLean; out.spineTwist = t.spineTwist; out.spineRoll = t.spineRoll;
    out.headPitch = t.headPitch; out.headYaw = t.headYaw;
    out.leftShoulder = t.lSh; out.rightShoulder = t.rSh;
    out.leftShoulderRoll = t.lShRoll; out.rightShoulderRoll = t.rShRoll;
    out.leftElbow = t.lEl; out.rightElbow = t.rEl;
    syncAliases(out);
  }

  private applyPose(p: AvatarPose): void {
    this.pelvisGroup.position.set(p.pelvisX, p.pelvisY, 0);
    this.pelvisGroup.rotation.set(0, 0, 0);
    this.spineGroup.rotation.set(p.spineLean, p.spineTwist, p.spineRoll, 'YXZ');
    this.headGroup.rotation.set(p.headPitch, p.headYaw, 0, 'YXZ');
    this.leftLegPivot.rotation.set(p.leftHip, 0, p.leftHipRoll);
    this.rightLegPivot.rotation.set(p.rightHip, 0, p.rightHipRoll);
    this.leftKneePivot.rotation.set(p.leftKnee, 0, 0);
    this.rightKneePivot.rotation.set(p.rightKnee, 0, 0);
    this.leftAnklePivot.rotation.set(p.leftAnkle, 0, 0);
    this.rightAnklePivot.rotation.set(p.rightAnkle, 0, 0);
    this.leftArmPivot.rotation.set(p.leftShoulder, 0, p.leftShoulderRoll);
    this.rightArmPivot.rotation.set(p.rightShoulder, 0, p.rightShoulderRoll);
    this.leftElbowPivot.rotation.set(p.leftElbow, 0, 0);
    this.rightElbowPivot.rotation.set(p.rightElbow, 0, 0);
  }

  /** Read-only snapshot for tests / debugging. */
  public getDebugState(): AvatarDebugState {
    return {
      phase: this.gaitPhase,
      groundSpeed: this.smoothedSpeed,
      gaitWeight: this.gaitWeight,
      airWeight: this.airWeight,
      landingWeight: this.landingWeight,
      bodyYaw: this.bodyYaw,
      left: { ...this.footL },
      right: { ...this.footR },
    };
  }

  /**
   * Per-frame update.
   * Canonical: (delta, worldPos, yaw, locomotion, speed, pov)
   * Legacy (kept for older tests): (delta, locomotion, speed, yaw, worldPos, pov)
   * @param speed real horizontal ground speed in m/s (post-collision)
   */
  public update(
    delta: number,
    arg2: THREE.Vector3 | LocomotionState,
    arg3: number,
    arg4: LocomotionState | number,
    arg5: number | THREE.Vector3,
    pov: POVMode
  ): void {
    const dt = Math.min(Math.max(delta, 0), 0.08);

    let worldPos: THREE.Vector3;
    let yaw: number;
    let locomotion: LocomotionState;
    let speed: number;
    if (typeof arg2 === 'string') {
      locomotion = arg2;
      speed = arg3;
      yaw = typeof arg4 === 'number' ? arg4 : 0;
      worldPos = arg5 instanceof THREE.Vector3 ? arg5 : this.scratchPos.set(0, 0, 0);
    } else {
      worldPos = arg2;
      yaw = arg3;
      locomotion = arg4 as LocomotionState;
      speed = typeof arg5 === 'number' ? arg5 : 0;
    }

    // ── Facing: turn toward the direction of real travel ────────────────────
    if (!this.initialised) {
      this.bodyYaw = yaw;
      this.lastPos.copy(worldPos);
      this.initialised = true;
    }
    const dx = worldPos.x - this.lastPos.x;
    const dz = worldPos.z - this.lastPos.z;
    const disp = Math.sqrt(dx * dx + dz * dz);
    this.lastPos.copy(worldPos);
    const teleported = disp > 2.0;

    this.rootGroup.position.copy(worldPos);

    if (pov === 'first_person') {
      // Camera is inside the head: hide the body and keep it aligned with the view.
      this.rootGroup.visible = false;
      this.bodyYaw = yaw;
      this.rootGroup.rotation.y = this.bodyYaw + Math.PI;
      return;
    }
    this.rootGroup.visible = true;

    if (teleported) {
      this.bodyYaw = yaw;
    } else if (dt > 0 && disp / dt > 0.3) {
      const heading = Math.atan2(-dx, -dz);
      this.bodyYaw = wrapAngle(this.bodyYaw + wrapAngle(heading - this.bodyYaw) * (1 - Math.exp(-12 * dt)));
    }
    this.rootGroup.rotation.y = this.bodyYaw + Math.PI;

    // ── State weights ───────────────────────────────────────────────────────
    const airborne = locomotion === 'airborne' || locomotion === 'jump_takeoff';
    const v = Math.max(0, speed);
    this.smoothedSpeed = approach(this.smoothedSpeed, v, 6, dt);
    this.airWeight = approach(this.airWeight, airborne ? 1 : 0, airborne ? 14 : 20, dt);
    this.takeoffWeight = approach(this.takeoffWeight, locomotion === 'jump_takeoff' ? 1 : 0, 10, dt);
    this.landingWeight = approach(this.landingWeight, locomotion === 'landing' ? 1 : 0, locomotion === 'landing' ? 30 : 8, dt);
    this.gaitWeight = approach(this.gaitWeight, airborne ? this.gaitWeight : smoothstep(0.08, 0.6, v), 8, dt);

    // ── Gait phase: advanced by real ground distance only ───────────────────
    gaitParamsForSpeed(Math.max(this.smoothedSpeed, 0.6), this.gait);
    if (!airborne && v > 0.02) {
      this.gaitPhase = (this.gaitPhase + (v * dt) / cycleLength(this.gait)) % 1;
    }

    // ── Ground pose (target space → IK) ─────────────────────────────────────
    this.computeIdleTarget(dt);
    this.computeGaitTarget();
    if (this.landingWeight > 0.001 || locomotion === 'landing') this.computeLandingTarget(dt);

    const wg = this.gaitWeight;
    const wl = this.landingWeight;
    const m = this.mixGT;
    for (const k of GT_KEYS) {
      const base = this.idleGT[k] + (this.gaitGT[k] - this.idleGT[k]) * wg;
      m[k] = base + (this.landGT[k] - base) * wl;
    }
    this.resolveGround(m, this.groundPose);

    // ── Crossfade ground ↔ air (angle space) ────────────────────────────────
    const wa = this.airWeight;
    const wt = this.takeoffWeight;
    const out = this.currentPose;
    for (const k of POSE_KEYS) {
      const air = this.airPose[k] + (this.takeoffPose[k] - this.airPose[k]) * wt;
      out[k] = this.groundPose[k] + (air - this.groundPose[k]) * wa;
    }
    syncAliases(out);
    this.applyPose(out);
  }
}
