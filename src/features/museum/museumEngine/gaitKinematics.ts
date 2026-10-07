/**
 * museumEngine/gaitKinematics.ts
 * Pure, deterministic gait mathematics for the 1.70 m explorer avatar.
 *
 * Conventions (avatar-local sagittal plane):
 * - +z = forward (the direction the avatar mesh faces), +y = up, metres.
 * - Joint rotation about X: positive moves the distal segment BACKWARD (-z).
 *   (This is the Three.js right-hand rule for a limb hanging along -y.)
 * - Foot pitch: positive = toe down, negative = toe up.
 *
 * Model:
 * - Each leg runs a cycle u ∈ [0, 1). u ∈ [0, duty) is stance, the rest swing.
 * - During stance the flat-foot ankle anchor moves backward relative to the hip
 *   by exactly the distance the body travels, so the ground contact point is
 *   stationary in world space (no foot sliding) as long as the phase is advanced
 *   by real ground speed: du = speed · dt / cycleLength.
 * - Heel strike pivots about the heel, toe-off pivots about the toe.
 * - The pelvis height is derived from the stance legs' reach so planted feet can
 *   actually reach the ground (inverted-pendulum bob emerges from geometry).
 */

export const LEG = {
  upper: 0.44, // hip → knee (m)
  lower: 0.42, // knee → ankle (m)
  hipY: -0.04, // hip pivot below pelvis origin (m)
  hipX: 0.10, // lateral hip offset (m)
  heel: 0.06, // ankle → heel contact, backward (m)
  toe: 0.14, // ankle → toe contact, forward (m)
} as const;

/** Maximum hip→ankle distance (tiny epsilon keeps acos() finite). */
export const LEG_MAX = LEG.upper + LEG.lower - 1e-4;

export interface GaitParams {
  /** Distance the body travels per step (half a cycle), metres. */
  stepLength: number;
  /** Fraction of the cycle a foot is on the ground. >0.5 walk, <0.5 run (flight). */
  duty: number;
  /** Flat-foot ankle anchor distance in front of the hip at heel strike, metres. */
  frontReach: number;
  /** Peak foot clearance during swing, metres. */
  lift: number;
  /** Foot pitch at heel strike (negative = toe up), radians. */
  heelStrikePitch: number;
  /** Foot pitch at toe-off (positive = toe down), radians. */
  toeOffPitch: number;
  /** Highest pelvis height (mid-stance walk / flight run), metres. */
  pelvisHigh: number;
  /** Lowest allowed pelvis height, metres. */
  pelvisLow: number;
  /** Fraction of full leg length used when choosing pelvis height (knee softness). */
  stanceStraightness: number;
  /** Forward spine lean, radians. */
  lean: number;
  /** Shoulder swing amplitude, radians. */
  armSwing: number;
  /** Base elbow flexion (positive number, applied as forward bend), radians. */
  elbowBase: number;
  /** Additional elbow flexion when the arm swings forward, radians. */
  elbowSwing: number;
  /** Spine counter-twist amplitude, radians. */
  twist: number;
}

/** Reference gait keyframes, indexed by ground speed (m/s). */
const GAIT_KEYS: { speed: number; p: GaitParams }[] = [
  {
    speed: 0.6,
    p: {
      stepLength: 0.50, duty: 0.65, frontReach: 0.22, lift: 0.06,
      heelStrikePitch: -0.12, toeOffPitch: 0.35, pelvisHigh: 0.90, pelvisLow: 0.80,
      stanceStraightness: 0.99, lean: 0.02, armSwing: 0.14, elbowBase: 0.18, elbowSwing: 0.10, twist: 0.02,
    },
  },
  {
    // Canonical Walk (AVATAR_SPECS.walkSpeed = 3.2 m/s)
    speed: 3.2,
    p: {
      stepLength: 1.05, duty: 0.55, frontReach: 0.35, lift: 0.10,
      heelStrikePitch: -0.26, toeOffPitch: 0.85, pelvisHigh: 0.90, pelvisLow: 0.80,
      stanceStraightness: 0.985, lean: 0.05, armSwing: 0.38, elbowBase: 0.28, elbowSwing: 0.25, twist: 0.06,
    },
  },
  {
    // Run (AVATAR_SPECS.runSpeed = 4.8 m/s)
    speed: 4.8,
    p: {
      stepLength: 1.35, duty: 0.38, frontReach: 0.28, lift: 0.22,
      heelStrikePitch: -0.10, toeOffPitch: 1.05, pelvisHigh: 0.88, pelvisLow: 0.78,
      stanceStraightness: 0.95, lean: 0.14, armSwing: 0.62, elbowBase: 1.05, elbowSwing: 0.22, twist: 0.09,
    },
  },
  {
    // Sprint (AVATAR_SPECS.sprintSpeed = 6.2 m/s)
    speed: 6.2,
    p: {
      stepLength: 1.60, duty: 0.30, frontReach: 0.22, lift: 0.30,
      heelStrikePitch: -0.04, toeOffPitch: 1.15, pelvisHigh: 0.86, pelvisLow: 0.76,
      stanceStraightness: 0.93, lean: 0.22, armSwing: 0.80, elbowBase: 1.20, elbowSwing: 0.18, twist: 0.12,
    },
  },
];

const PARAM_KEYS = Object.keys(GAIT_KEYS[0].p) as (keyof GaitParams)[];

/** Gait parameters as a continuous function of ground speed (no popping between gaits). */
export function gaitParamsForSpeed(speed: number, out?: GaitParams): GaitParams {
  const target = out ?? ({ ...GAIT_KEYS[0].p } as GaitParams);
  const v = Math.max(0, speed);
  let a = GAIT_KEYS[0];
  let b = GAIT_KEYS[0];
  let t = 0;
  if (v <= GAIT_KEYS[0].speed) {
    a = b = GAIT_KEYS[0];
  } else if (v >= GAIT_KEYS[GAIT_KEYS.length - 1].speed) {
    a = b = GAIT_KEYS[GAIT_KEYS.length - 1];
  } else {
    for (let i = 0; i < GAIT_KEYS.length - 1; i++) {
      if (v >= GAIT_KEYS[i].speed && v <= GAIT_KEYS[i + 1].speed) {
        a = GAIT_KEYS[i];
        b = GAIT_KEYS[i + 1];
        const raw = (v - a.speed) / (b.speed - a.speed);
        t = raw * raw * (3 - 2 * raw); // smoothstep
        break;
      }
    }
  }
  for (const k of PARAM_KEYS) {
    target[k] = a.p[k] + (b.p[k] - a.p[k]) * t;
  }
  return target;
}

export function cycleLength(p: GaitParams): number {
  return p.stepLength * 2;
}

export interface FootSample {
  /** Ankle position relative to the hip, forward (m). */
  ankleZ: number;
  /** Ankle height above the ground plane (m). */
  ankleY: number;
  /** Foot pitch (positive = toe down). */
  pitch: number;
  inStance: boolean;
  /** 0 → 1 through stance (0 when swinging). */
  stanceProgress: number;
}

const HEEL_PHASE = 0.12;
const TOE_PHASE_START = 0.6;

function stancePitch(p: number, g: GaitParams): number {
  if (p < HEEL_PHASE) return g.heelStrikePitch * (1 - p / HEEL_PHASE);
  if (p < TOE_PHASE_START) return 0;
  const q = (p - TOE_PHASE_START) / (1 - TOE_PHASE_START);
  return g.toeOffPitch * Math.pow(q, 1.3);
}

/** Ankle offset produced by rolling the foot about its heel (pitch<0) or toe (pitch>0). */
function rollOffset(pitch: number): { dz: number; dy: number } {
  if (pitch < 0) {
    const d = -LEG.heel;
    return { dz: d * (1 - Math.cos(pitch)), dy: LEG.heel * Math.sin(-pitch) };
  }
  const d = LEG.toe;
  return { dz: d * (1 - Math.cos(pitch)), dy: LEG.toe * Math.sin(pitch) };
}

/** Sample one foot at leg-cycle position u ∈ [0, 1). */
export function sampleFoot(u: number, g: GaitParams, out?: FootSample): FootSample {
  const s = out ?? { ankleZ: 0, ankleY: 0, pitch: 0, inStance: true, stanceProgress: 0 };
  const uu = ((u % 1) + 1) % 1;
  const travel = g.duty * cycleLength(g); // body travel while this foot is planted

  if (uu < g.duty) {
    const p = uu / g.duty;
    const anchor = g.frontReach - travel * p;
    const pitch = stancePitch(p, g);
    const r = rollOffset(pitch);
    s.ankleZ = anchor + r.dz;
    s.ankleY = r.dy;
    s.pitch = pitch;
    s.inStance = true;
    s.stanceProgress = p;
    return s;
  }

  // Swing: Hermite from toe-off pose to heel-strike pose.
  const w = (uu - g.duty) / (1 - g.duty);
  const r0 = rollOffset(g.toeOffPitch);
  const r1 = rollOffset(g.heelStrikePitch);
  const z0 = g.frontReach - travel + r0.dz;
  const z1 = g.frontReach + r1.dz;
  // Relative foot velocity at both ends matches stance (-travel per stance), scaled for a soft retraction.
  const m = (-travel / g.duty) * (1 - g.duty) * 0.35;
  const w2 = w * w;
  const w3 = w2 * w;
  const h00 = 2 * w3 - 3 * w2 + 1;
  const h10 = w3 - 2 * w2 + w;
  const h01 = -2 * w3 + 3 * w2;
  const h11 = w3 - w2;
  s.ankleZ = h00 * z0 + h10 * m + h01 * z1 + h11 * m;
  const clearance = Math.sin(Math.PI * Math.pow(w, 0.8));
  s.ankleY = r0.dy + (r1.dy - r0.dy) * w + g.lift * clearance;
  const pe = w * w * (3 - 2 * w);
  s.pitch = g.toeOffPitch + (g.heelStrikePitch - g.toeOffPitch) * pe;
  s.inStance = false;
  s.stanceProgress = 0;
  return s;
}

/**
 * Highest hip height (above ground) at which a planted foot can still reach its
 * target, softened at the start/end of stance so the pelvis curve is continuous.
 */
export function stanceHipLimit(f: FootSample, g: GaitParams): number {
  if (!f.inStance) return Infinity;
  const reach = LEG_MAX * g.stanceStraightness;
  const z = Math.min(Math.abs(f.ankleZ), reach - 1e-3);
  let limit = Math.sqrt(reach * reach - z * z) + f.ankleY;
  const p = f.stanceProgress;
  if (p < 0.08) limit += (1 - p / 0.08) * 0.06;
  if (p > 0.85) limit += ((p - 0.85) / 0.15) * 0.08;
  return limit;
}

/** Pelvis origin height for the given pair of foot samples. */
export function pelvisHeightFor(left: FootSample, right: FootSample, g: GaitParams): number {
  const hip = Math.min(stanceHipLimit(left, g), stanceHipLimit(right, g), g.pelvisHigh + LEG.hipY);
  return Math.max(g.pelvisLow, hip - LEG.hipY);
}

export interface LegAngles {
  hip: number;
  knee: number;
  ankle: number;
  /** False when the target was out of reach and the leg was fully extended toward it. */
  reached: boolean;
}

/**
 * Analytic 2-link IK in the sagittal plane.
 * @param z ankle target forward of the hip (m)
 * @param y ankle target relative to the hip (m, negative = below)
 * @param footPitch desired world foot pitch (positive = toe down)
 */
export function solveLegIK(z: number, y: number, footPitch: number, out?: LegAngles): LegAngles {
  const r = out ?? { hip: 0, knee: 0, ankle: 0, reached: true };
  const L1 = LEG.upper;
  const L2 = LEG.lower;
  let d = Math.sqrt(z * z + y * y);
  r.reached = d <= LEG_MAX;
  d = Math.min(Math.max(d, 0.15), LEG_MAX);
  const cosInterior = (L1 * L1 + L2 * L2 - d * d) / (2 * L1 * L2);
  const knee = Math.PI - Math.acos(Math.max(-1, Math.min(1, cosInterior)));
  const beta = Math.atan2(-z, -y);
  const gamma = Math.atan2(L2 * Math.sin(knee), L1 + L2 * Math.cos(knee));
  r.hip = beta - gamma;
  r.knee = knee;
  r.ankle = footPitch - (r.hip + r.knee);
  return r;
}

/** Forward kinematics (ankle position relative to the hip) — used by tests. */
export function legFK(hip: number, knee: number): { z: number; y: number } {
  return {
    z: -(LEG.upper * Math.sin(hip) + LEG.lower * Math.sin(hip + knee)),
    y: -(LEG.upper * Math.cos(hip) + LEG.lower * Math.cos(hip + knee)),
  };
}
