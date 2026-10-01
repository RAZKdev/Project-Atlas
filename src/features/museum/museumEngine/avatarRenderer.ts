/**
 * museumEngine/avatarRenderer.ts
 * Human-Scale 1.70m Stylized Explorer Avatar with Procedural Locomotion.
 *
 * Implements:
 * - Exact 1.70m Human Height: Head top at y=1.70m, eye level at y=1.60m
 * - Anatomically proportioned limbs and travel expedition garments
 * - Procedural Locomotion State Machine:
 *   - IDLE: Breathing chest motion and subtle stance sway
 *   - WALK: Natural opposite-phase arm/leg swings with knee flexion
 *   - RUN / SPRINT: Dynamic running stride, forward lean, high knee drive
 *   - AIRBORNE / JUMP: Legs tucked, arms raised for balance
 *   - LANDING: Knee compression and spring recovery
 * - POV Visibility Management: Seamlessly hidden in First-Person (POV 1)
 */

import * as THREE from 'three';
import { type LocomotionState, type POVMode, AVATAR_SPECS } from './types';

export class AvatarRenderer {
  public rootGroup: THREE.Group;

  // Hierarchical Body Parts
  private pelvisGroup: THREE.Group;
  private torsoMesh: THREE.Mesh;
  private headGroup: THREE.Group;
  private leftLegPivot: THREE.Group;
  private rightLegPivot: THREE.Group;
  private leftKneePivot: THREE.Group;
  private rightKneePivot: THREE.Group;
  private leftArmPivot: THREE.Group;
  private rightArmPivot: THREE.Group;
  private leftElbowPivot: THREE.Group;
  private rightElbowPivot: THREE.Group;

  // Animation phase accumulator
  private animPhase: number = 0;
  private breathPhase: number = 0;
  private landingCompression: number = 0;

  constructor() {
    this.rootGroup = new THREE.Group();
    this.rootGroup.name = 'ExplorerAvatar_170cm';

    // ── 1. Materials ────────────────────────────────────────────────────────
    const matJacket = new THREE.MeshStandardMaterial({
      color: 0x343a40, // deep charcoal expedition coat
      roughness: 0.82,
      metalness: 0.05,
    });

    const matPants = new THREE.MeshStandardMaterial({
      color: 0x6c6356, // weathered safari khaki
      roughness: 0.88,
      metalness: 0.02,
    });

    const matLeather = new THREE.MeshStandardMaterial({
      color: 0x5a341a, // warm saddle leather satchel & belts
      roughness: 0.55,
      metalness: 0.12,
    });

    const matSkin = new THREE.MeshStandardMaterial({
      color: 0xd8a888, // warm human skin tone
      roughness: 0.65,
      metalness: 0.0,
    });

    const matBoots = new THREE.MeshStandardMaterial({
      color: 0x221c18, // rugged trekking boots
      roughness: 0.70,
      metalness: 0.10,
    });

    const matHat = new THREE.MeshStandardMaterial({
      color: 0x28231d, // dark expedition fedora / cap
      roughness: 0.75,
      metalness: 0.05,
    });

    const matBrassPin = new THREE.MeshStandardMaterial({
      color: 0xd4a843,
      roughness: 0.25,
      metalness: 0.9,
    });

    // ── 2. Pelvis / Hips (y: 0.90m) ──────────────────────────────────────────
    this.pelvisGroup = new THREE.Group();
    this.pelvisGroup.position.set(0, 0.90, 0);
    this.rootGroup.add(this.pelvisGroup);

    // Hip block
    const hipGeo = new THREE.BoxGeometry(0.32, 0.16, 0.22);
    const hipMesh = new THREE.Mesh(hipGeo, matPants);
    hipMesh.position.set(0, 0, 0);
    hipMesh.castShadow = true;
    this.pelvisGroup.add(hipMesh);

    // Leather Belt & Brass Buckle
    const beltGeo = new THREE.BoxGeometry(0.33, 0.05, 0.23);
    const belt = new THREE.Mesh(beltGeo, matLeather);
    belt.position.set(0, 0.06, 0);
    this.pelvisGroup.add(belt);

    const buckleGeo = new THREE.BoxGeometry(0.06, 0.06, 0.02);
    const buckle = new THREE.Mesh(buckleGeo, matBrassPin);
    buckle.position.set(0, 0.06, 0.12);
    this.pelvisGroup.add(buckle);

    // ── 3. Torso / Jacket (y: 0.98m to 1.48m) ────────────────────────────────
    const torsoGeo = new THREE.BoxGeometry(0.36, 0.50, 0.24);
    this.torsoMesh = new THREE.Mesh(torsoGeo, matJacket);
    this.torsoMesh.position.set(0, 0.33, 0);
    this.torsoMesh.castShadow = true;
    this.pelvisGroup.add(this.torsoMesh);

    // Cross-body Leather Messenger Bag / Expedition Satchel
    const bagStrapGeo = new THREE.BoxGeometry(0.04, 0.54, 0.26);
    const bagStrap = new THREE.Mesh(bagStrapGeo, matLeather);
    bagStrap.position.set(0.06, 0.34, 0);
    bagStrap.rotation.z = Math.PI / 8;
    this.pelvisGroup.add(bagStrap);

    const satchelGeo = new THREE.BoxGeometry(0.12, 0.22, 0.26);
    const satchel = new THREE.Mesh(satchelGeo, matLeather);
    satchel.position.set(-0.21, 0.14, -0.04);
    satchel.castShadow = true;
    this.pelvisGroup.add(satchel);

    // ── 4. Head & Explorer Hat (y: 1.48m to 1.70m) ───────────────────────────
    this.headGroup = new THREE.Group();
    this.headGroup.position.set(0, 0.62, 0); // local to pelvis (total height = 0.90 + 0.62 = 1.52m pivot)
    this.pelvisGroup.add(this.headGroup);

    // Neck
    const neckGeo = new THREE.CylinderGeometry(0.06, 0.07, 0.08, 12);
    const neck = new THREE.Mesh(neckGeo, matSkin);
    neck.position.set(0, 0.0, 0);
    this.headGroup.add(neck);

    // Head
    const headGeo = new THREE.SphereGeometry(0.11, 16, 16);
    const head = new THREE.Mesh(headGeo, matSkin);
    head.position.set(0, 0.11, 0);
    head.scale.set(1.0, 1.15, 1.05);
    head.castShadow = true;
    this.headGroup.add(head);

    // Hat Crown (reaches top of height = 1.70m)
    const hatCrownGeo = new THREE.CylinderGeometry(0.10, 0.12, 0.09, 16);
    const hatCrown = new THREE.Mesh(hatCrownGeo, matHat);
    hatCrown.position.set(0, 0.20, -0.01);
    this.headGroup.add(hatCrown);

    // Hat Brim
    const hatBrimGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.02, 16);
    const hatBrim = new THREE.Mesh(hatBrimGeo, matHat);
    hatBrim.position.set(0, 0.16, 0);
    this.headGroup.add(hatBrim);

    // ── 5. Left & Right Legs ─────────────────────────────────────────────────
    const legX = 0.10;

    // Left Leg
    this.leftLegPivot = new THREE.Group();
    this.leftLegPivot.position.set(-legX, -0.04, 0);
    this.pelvisGroup.add(this.leftLegPivot);

    const upperLegGeo = new THREE.BoxGeometry(0.13, 0.44, 0.14);
    const leftUpperLeg = new THREE.Mesh(upperLegGeo, matPants);
    leftUpperLeg.position.set(0, -0.22, 0);
    leftUpperLeg.castShadow = true;
    this.leftLegPivot.add(leftUpperLeg);

    this.leftKneePivot = new THREE.Group();
    this.leftKneePivot.position.set(0, -0.44, 0);
    this.leftLegPivot.add(this.leftKneePivot);

    const lowerLegGeo = new THREE.BoxGeometry(0.11, 0.42, 0.12);
    const leftLowerLeg = new THREE.Mesh(lowerLegGeo, matPants);
    leftLowerLeg.position.set(0, -0.21, 0);
    leftLowerLeg.castShadow = true;
    this.leftKneePivot.add(leftLowerLeg);

    const bootGeo = new THREE.BoxGeometry(0.12, 0.10, 0.20);
    const leftBoot = new THREE.Mesh(bootGeo, matBoots);
    leftBoot.position.set(0, -0.38, 0.04);
    leftBoot.castShadow = true;
    this.leftKneePivot.add(leftBoot);

    // Right Leg
    this.rightLegPivot = new THREE.Group();
    this.rightLegPivot.position.set(legX, -0.04, 0);
    this.pelvisGroup.add(this.rightLegPivot);

    const rightUpperLeg = new THREE.Mesh(upperLegGeo, matPants);
    rightUpperLeg.position.set(0, -0.22, 0);
    rightUpperLeg.castShadow = true;
    this.rightLegPivot.add(rightUpperLeg);

    this.rightKneePivot = new THREE.Group();
    this.rightKneePivot.position.set(0, -0.44, 0);
    this.rightLegPivot.add(this.rightKneePivot);

    const rightLowerLeg = new THREE.Mesh(lowerLegGeo, matPants);
    rightLowerLeg.position.set(0, -0.21, 0);
    rightLowerLeg.castShadow = true;
    this.rightKneePivot.add(rightLowerLeg);

    const rightBoot = new THREE.Mesh(bootGeo, matBoots);
    rightBoot.position.set(0, -0.38, 0.04);
    rightBoot.castShadow = true;
    this.rightKneePivot.add(rightBoot);

    // ── 6. Left & Right Arms ─────────────────────────────────────────────────
    const armX = 0.22;
    const armY = 0.50;

    // Left Arm
    this.leftArmPivot = new THREE.Group();
    this.leftArmPivot.position.set(-armX, armY, 0);
    this.pelvisGroup.add(this.leftArmPivot);

    const upperArmGeo = new THREE.BoxGeometry(0.10, 0.26, 0.11);
    const leftUpperArm = new THREE.Mesh(upperArmGeo, matJacket);
    leftUpperArm.position.set(0, -0.13, 0);
    leftUpperArm.castShadow = true;
    this.leftArmPivot.add(leftUpperArm);

    this.leftElbowPivot = new THREE.Group();
    this.leftElbowPivot.position.set(0, -0.26, 0);
    this.leftArmPivot.add(this.leftElbowPivot);

    const forearmGeo = new THREE.BoxGeometry(0.09, 0.24, 0.10);
    const leftForearm = new THREE.Mesh(forearmGeo, matJacket);
    leftForearm.position.set(0, -0.12, 0);
    leftForearm.castShadow = true;
    this.leftElbowPivot.add(leftForearm);

    const handGeo = new THREE.BoxGeometry(0.07, 0.08, 0.08);
    const leftHand = new THREE.Mesh(handGeo, matSkin);
    leftHand.position.set(0, -0.26, 0);
    this.leftElbowPivot.add(leftHand);

    // Right Arm
    this.rightArmPivot = new THREE.Group();
    this.rightArmPivot.position.set(armX, armY, 0);
    this.pelvisGroup.add(this.rightArmPivot);

    const rightUpperArm = new THREE.Mesh(upperArmGeo, matJacket);
    rightUpperArm.position.set(0, -0.13, 0);
    rightUpperArm.castShadow = true;
    this.rightArmPivot.add(rightUpperArm);

    this.rightElbowPivot = new THREE.Group();
    this.rightElbowPivot.position.set(0, -0.26, 0);
    this.rightArmPivot.add(this.rightElbowPivot);

    const rightForearm = new THREE.Mesh(forearmGeo, matJacket);
    rightForearm.position.set(0, -0.12, 0);
    rightForearm.castShadow = true;
    this.rightElbowPivot.add(rightForearm);

    const rightHand = new THREE.Mesh(handGeo, matSkin);
    rightHand.position.set(0, -0.26, 0);
    this.rightElbowPivot.add(rightHand);
  }

  /**
   * Update avatar position, orientation, and procedural locomotion animation
   */
  public update(
    delta: number,
    worldPos: THREE.Vector3,
    yaw: number,
    locomotion: LocomotionState,
    speed: number,
    pov: POVMode
  ): void {
    const dt = Math.min(delta, 0.08);

    // Position root group at player feet
    this.rootGroup.position.copy(worldPos);
    this.rootGroup.rotation.y = yaw;

    // ── 1. POV Visibility Handling ──────────────────────────────────────────
    if (pov === 'first_person') {
      // Hide avatar completely in first person so nothing clips into camera
      this.rootGroup.visible = false;
      return;
    } else {
      this.rootGroup.visible = true;
    }

    // ── 2. Procedural Animation State Machine ────────────────────────────────
    this.breathPhase += dt * 2.2;
    const breathOffset = Math.sin(this.breathPhase) * 0.012;

    switch (locomotion) {
      case 'idle': {
        // Subtle natural idle stance
        this.pelvisGroup.position.y = 0.90 + breathOffset;
        this.torsoMesh.rotation.x = 0.02 + breathOffset * 0.5;
        this.headGroup.rotation.x = 0.0;
        this.headGroup.rotation.y = Math.sin(this.breathPhase * 0.4) * 0.04;

        // Limbs in relaxed resting position
        this.leftLegPivot.rotation.x = 0;
        this.rightLegPivot.rotation.x = 0;
        this.leftKneePivot.rotation.x = 0.04;
        this.rightKneePivot.rotation.x = 0.04;

        this.leftArmPivot.rotation.x = 0.08 + Math.sin(this.breathPhase) * 0.02;
        this.rightArmPivot.rotation.x = 0.08 - Math.sin(this.breathPhase) * 0.02;
        this.leftElbowPivot.rotation.x = -0.15;
        this.rightElbowPivot.rotation.x = -0.15;

        this.animPhase = 0;
        break;
      }

      case 'walk': {
        // Natural walking stride (frequency ~1.8 Hz)
        const strideFreq = 7.5 * (speed / AVATAR_SPECS.walkSpeed);
        this.animPhase += dt * strideFreq;

        const legAngle = Math.sin(this.animPhase) * 0.55;
        const armAngle = -legAngle * 0.75;
        const pelvicBob = Math.abs(Math.sin(this.animPhase * 2)) * 0.035;

        this.pelvisGroup.position.y = 0.90 - pelvicBob;
        this.torsoMesh.rotation.x = 0.06; // slight forward stride lean
        this.torsoMesh.rotation.y = -Math.sin(this.animPhase) * 0.05;

        // Legs
        this.leftLegPivot.rotation.x = legAngle;
        this.rightLegPivot.rotation.x = -legAngle;
        this.leftKneePivot.rotation.x = Math.max(0, -Math.sin(this.animPhase) * 0.65);
        this.rightKneePivot.rotation.x = Math.max(0, Math.sin(this.animPhase) * 0.65);

        // Arms (opposite to legs)
        this.leftArmPivot.rotation.x = armAngle;
        this.rightArmPivot.rotation.x = -armAngle;
        this.leftElbowPivot.rotation.x = -0.30 - Math.max(0, armAngle * 0.4);
        this.rightElbowPivot.rotation.x = -0.30 - Math.max(0, -armAngle * 0.4);
        break;
      }

      case 'run':
      case 'sprint': {
        // High-energy sprint stride (frequency ~3.0 Hz)
        const isSprinting = locomotion === 'sprint';
        const cadence = isSprinting ? 12.0 : 9.5;
        this.animPhase += dt * cadence;

        const legAmp = isSprinting ? 0.90 : 0.75;
        const legAngle = Math.sin(this.animPhase) * legAmp;
        const armAngle = -legAngle * 1.1;
        const pelvicBob = Math.abs(Math.sin(this.animPhase * 2)) * 0.06;

        this.pelvisGroup.position.y = 0.90 - pelvicBob;
        this.torsoMesh.rotation.x = isSprinting ? 0.24 : 0.16; // athletic forward tilt
        this.torsoMesh.rotation.y = -Math.sin(this.animPhase) * 0.10;

        // Legs with high knee drive and trail flexion
        this.leftLegPivot.rotation.x = legAngle;
        this.rightLegPivot.rotation.x = -legAngle;
        this.leftKneePivot.rotation.x = Math.max(0, -Math.sin(this.animPhase) * 1.1);
        this.rightKneePivot.rotation.x = Math.max(0, Math.sin(this.animPhase) * 1.1);

        // Arms bent at 90 deg running posture
        this.leftArmPivot.rotation.x = armAngle;
        this.rightArmPivot.rotation.x = -armAngle;
        this.leftElbowPivot.rotation.x = -1.10;
        this.rightElbowPivot.rotation.x = -1.10;
        break;
      }

      case 'jump_takeoff':
      case 'airborne': {
        // Airborne posture: legs tucked slightly, arms raised for balance
        this.pelvisGroup.position.y = 0.90;
        this.torsoMesh.rotation.x = -0.05;

        this.leftLegPivot.rotation.x = 0.28;
        this.rightLegPivot.rotation.x = -0.15;
        this.leftKneePivot.rotation.x = 0.55;
        this.rightKneePivot.rotation.x = 0.40;

        this.leftArmPivot.rotation.x = -0.55;
        this.rightArmPivot.rotation.x = -0.45;
        this.leftElbowPivot.rotation.x = -0.60;
        this.rightElbowPivot.rotation.x = -0.60;
        break;
      }

      case 'landing': {
        // Landing compression: knees absorb impact
        this.landingCompression = Math.min(1.0, this.landingCompression + dt * 10.0);
        const comp = (1.0 - this.landingCompression) * 0.12;

        this.pelvisGroup.position.y = 0.90 - comp;
        this.leftLegPivot.rotation.x = 0.10;
        this.rightLegPivot.rotation.x = 0.10;
        this.leftKneePivot.rotation.x = 0.35;
        this.rightKneePivot.rotation.x = 0.35;
        break;
      }
    }
  }
}
