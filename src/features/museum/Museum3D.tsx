/**
 * Museum3D.tsx
 * Interactive Multi-POV 3D Mini Museum — "195 Negara, 1 Cerita"
 *
 * Architecture & Upgrades:
 * - Decoupled Authoritative Player Entity (PlayerEntity): height 1.70m, radius 0.28m, eye 1.60m
 * - Decoupled Three-POV Camera System (CameraSystem):
 *   * POV 1: First-Person (Eye level 1.60m, FOV 72°, direct head attachment)
 *   * POV 2: Third-Person Character (Distance ~2.2m, height 1.80m, shoulder offset, wall-collision-aware)
 *   * POV 3: Cinematic Architectural (Distance ~4.4m, height 2.50m, wide panoramic view, wall-collision-aware)
 * - 1.70m Human Explorer Avatar (AvatarRenderer):
 *   * Fedora hat, brass goggles, expedition coat, leather satchel, limbs with procedural walking animation
 *   * Hidden in POV 1, visible in POV 2 & POV 3
 * - Strict Scoped Input Handling:
 *   * ZERO global window click hijacking
 *   * Pointer lock requested ONLY via canvas click in active simulation
 *   * In-simulation Pause Menu (ESC or button) with clean exit back to Museum Page
 * - Responsive Mobile Controls (virtual joystick, swipe look, jump, inspect, POV cycle)
 * - 6 Curated Exhibition Zones with rich PBR materials, procedural animations, and fast travel
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { PlayerController } from './museumEngine/playerController';
import { PlayerEntity } from './museumEngine/playerEntity';
import { CameraSystem } from './museumEngine/cameraSystem';
import { buildMuseumArchitecture } from './museumEngine/museumArchitecture';
import { buildMuseumExhibits } from './museumEngine/museumExhibits';
import { buildMuseumLighting } from './museumEngine/museumLighting';
import {
  type CollisionBox,
  type InteractableExhibit,
  type MuseumViewMode,
  type MuseumQualityTier,
  type POVMode,
} from './museumEngine/types';
import { ExhibitModal } from './ExhibitModal';
import { useModalFocusTrap } from '../../core/hooks/useModalFocusTrap';

export interface Museum3DProps {
  onSelectCountry?: (countryCode: string) => void;
  onZoneSelect?: (exhibit: InteractableExhibit) => void;
  onExitSimulation?: () => void;
}

const POV_LABELS: Record<POVMode, { name: string; icon: string; short: string }> = {
  first_person: { name: 'POV 1: First-Person (Mata)', icon: '👁️', short: 'FPS' },
  third_person: { name: 'POV 2: Karakter (Pundak)', icon: '🧍', short: 'Karakter' },
  cinematic: { name: 'POV 3: Sinematik (Luas)', icon: '🎥', short: 'Sinematik' },
};

export const Museum3D: React.FC<Museum3DProps> = ({
  onSelectCountry,
  onZoneSelect,
  onExitSimulation,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Engine references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const playerRef = useRef<PlayerEntity | null>(null);
  const cameraSysRef = useRef<CameraSystem | null>(null);
  const controllerRef = useRef<PlayerController | null>(null);
  const collidersRef = useRef<CollisionBox[]>([]);
  const exhibitsRef = useRef<InteractableExhibit[]>([]);
  const updateExhibitsRef = useRef<((delta: number, focusedExhibitId?: string | null) => void) | null>(null);
  const updateArchRef = useRef<((delta: number, elapsed: number) => void) | null>(null);
  const setLightingQualityRef = useRef<((q: MuseumQualityTier) => void) | null>(null);

  // Animation frame reference
  const animFrameIdRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  // Orbit controls state for 'diorama' mode
  const orbitRef = useRef({
    theta: Math.PI / 4,
    phi: Math.PI / 3.4,
    radius: 17,
    targetTheta: Math.PI / 4,
    targetPhi: Math.PI / 3.4,
    targetRadius: 17,
    pivot: new THREE.Vector3(0, 1.8, 0),
    isDragging: false,
    lastX: 0,
    lastY: 0,
  });

  // UI state
  const [viewMode, setViewMode] = useState<MuseumViewMode>('walkthrough');
  const [currentPOV, setCurrentPOV] = useState<POVMode>('first_person');
  const [isPointerLocked, setIsPointerLocked] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const pauseModalRef = useRef<HTMLDivElement>(null);
  useModalFocusTrap(isPaused, () => setIsPaused(false), pauseModalRef);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [focusedExhibit, setFocusedExhibit] = useState<InteractableExhibit | null>(null);
  const [activeModalExhibit, setActiveModalExhibit] = useState<InteractableExhibit | null>(null);
  const [quality, setQuality] = useState<MuseumQualityTier>('high');
  const [isMobile, setIsMobile] = useState(false);
  const [webglError, setWebglError] = useState<string | null>(null);
  const [headBobEnabled, setHeadBobEnabled] = useState(true);

  // Mutable refs for event handlers to avoid stale closures
  const isPausedRef = useRef(false);
  isPausedRef.current = isPaused;
  const activeModalExhibitRef = useRef<InteractableExhibit | null>(null);
  activeModalExhibitRef.current = activeModalExhibit;
  const viewModeRef = useRef<MuseumViewMode>('walkthrough');
  viewModeRef.current = viewMode;
  const lastFocusedExhibitIdRef = useRef<string | null>(null);

  // Mobile virtual joystick refs
  const joystickTouchIdRef = useRef<number | null>(null);
  const joystickStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [joystickThumbOffset, setJoystickThumbOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Mobile look swipe refs
  const lookTouchIdRef = useRef<number | null>(null);
  const lookLastPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Listen to fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // User-initiated fullscreen toggle (Requirement 10)
  const toggleFullscreen = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  }, []);

  // ── Open Exhibit Detail ───────────────────────────────────────────────────
  const openExhibitDetail = useCallback(
    (exhibit: InteractableExhibit) => {
      if (document.pointerLockElement) {
        document.exitPointerLock();
      }
      setActiveModalExhibit(exhibit);
      onZoneSelect?.(exhibit);
    },
    [onZoneSelect]
  );

  // ── Cycle POV ─────────────────────────────────────────────────────────────
  const cyclePOV = useCallback(() => {
    if (!cameraSysRef.current) return;
    const next = cameraSysRef.current.cyclePOV();
    setCurrentPOV(next);
  }, []);

  // ── Teleport to Zone ──────────────────────────────────────────────────────
  const teleportToZone = useCallback(
    (exhibitId: string) => {
      const player = playerRef.current;
      const exhibits = exhibitsRef.current;
      if (!player) return;

      if (exhibitId === 'entrance') {
        player.teleport(0, 0.50, 5.2, Math.PI, 0);
      } else {
        const targetExhibit = exhibits.find((e) => e.id === exhibitId);
        if (targetExhibit && targetExhibit.viewPosition && targetExhibit.viewTarget) {
          const vp = targetExhibit.viewPosition;
          const vt = targetExhibit.viewTarget;
          const dx = vt[0] - vp[0];
          const dz = vt[2] - vp[2];
          const targetYaw = Math.atan2(-dx, -dz);
          player.teleport(vp[0], 0.50, vp[2], targetYaw, 0);
        }
      }

      if (viewMode === 'diorama') {
        setViewMode('walkthrough');
      }
    },
    [viewMode]
  );

  // ── Request Pointer Lock ──────────────────────────────────────────────────
  const requestPointerLock = useCallback(() => {
    if (viewModeRef.current !== 'walkthrough' || activeModalExhibitRef.current || isPausedRef.current) return;
    const canvas = canvasRef.current;
    if (canvas && !document.pointerLockElement) {
      canvas.requestPointerLock();
    }
  }, []);

  // ── Pointer Lock Change Listener ──────────────────────────────────────────
  useEffect(() => {
    const handlePointerLockChange = () => {
      const isLocked = document.pointerLockElement === canvasRef.current;
      setIsPointerLocked(isLocked);
    };

    const handlePointerLockError = () => {
      setIsPointerLocked(false);
    };

    document.addEventListener('pointerlockchange', handlePointerLockChange);
    document.addEventListener('pointerlockerror', handlePointerLockError);
    return () => {
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
      document.removeEventListener('pointerlockerror', handlePointerLockError);
    };
  }, []);

  // ── Mouse & Keyboard Event Listeners for Player ───────────────────────────
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (viewModeRef.current === 'walkthrough') {
        if (document.pointerLockElement === canvasRef.current) {
          const player = playerRef.current;
          const cameraSys = cameraSysRef.current;
          const controller = controllerRef.current;
          if (player && cameraSys && controller) {
            controller.onMouseMove(e.movementX, e.movementY, player, cameraSys);
          }
        }
      } else if (viewModeRef.current === 'diorama' && orbitRef.current.isDragging) {
        const dx = e.clientX - orbitRef.current.lastX;
        const dy = e.clientY - orbitRef.current.lastY;
        orbitRef.current.lastX = e.clientX;
        orbitRef.current.lastY = e.clientY;

        orbitRef.current.targetTheta -= dx * 0.006;
        orbitRef.current.targetPhi = Math.max(
          0.15,
          Math.min(Math.PI / 2.05, orbitRef.current.targetPhi - dy * 0.006)
        );
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      // Only handle clicks inside container
      if (!containerRef.current?.contains(e.target as Node)) return;

      if (viewModeRef.current === 'diorama') {
        orbitRef.current.isDragging = true;
        orbitRef.current.lastX = e.clientX;
        orbitRef.current.lastY = e.clientY;
      } else if (viewModeRef.current === 'walkthrough') {
        if (activeModalExhibitRef.current || isPausedRef.current) return;

        if (!document.pointerLockElement) {
          requestPointerLock();
        } else if (document.pointerLockElement === canvasRef.current) {
          const player = playerRef.current;
          if (player?.focusedExhibit) {
            openExhibitDetail(player.focusedExhibit);
          }
        }
      }
    };

    const handleMouseUp = () => {
      if (viewModeRef.current === 'diorama') {
        orbitRef.current.isDragging = false;
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (viewModeRef.current === 'diorama') {
        e.preventDefault();
        const delta = e.deltaY * 0.015;
        orbitRef.current.targetRadius = Math.max(7, Math.min(26, orbitRef.current.targetRadius + delta));
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeModalExhibitRef.current) return;

      // Escape key opens or closes pause menu
      if (e.code === 'Escape') {
        e.preventDefault();
        setIsPaused((prev) => !prev);
        if (document.pointerLockElement) {
          document.exitPointerLock();
        }
        return;
      }

      if (isPausedRef.current) return;

      // Cycle POV key [V]
      if (e.code === 'KeyV') {
        e.preventDefault();
        cyclePOV();
        return;
      }

      // Check interaction key [E]
      if (e.code === 'KeyE') {
        const player = playerRef.current;
        if (player?.focusedExhibit) {
          openExhibitDetail(player.focusedExhibit);
          return;
        }
      }

      controllerRef.current?.onKeyDown(e.code);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      controllerRef.current?.onKeyUp(e.code);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      controllerRef.current?.resetInputs();
    };
  }, [requestPointerLock, openExhibitDetail, cyclePOV]);

  // ── Touch Virtual Joystick & Swipe Handlers ───────────────────────────────
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (viewMode !== 'walkthrough' || isPaused || activeModalExhibit) return;

    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      const screenWidth = window.innerWidth;

      // Left half of screen -> Joystick for movement
      if (touch.clientX < screenWidth * 0.45 && joystickTouchIdRef.current === null) {
        joystickTouchIdRef.current = touch.identifier;
        joystickStartRef.current = { x: touch.clientX, y: touch.clientY };
        setJoystickThumbOffset({ x: 0, y: 0 });
      }
      // Right half of screen -> Look swipe
      else if (touch.clientX >= screenWidth * 0.45 && lookTouchIdRef.current === null) {
        lookTouchIdRef.current = touch.identifier;
        lookLastPosRef.current = { x: touch.clientX, y: touch.clientY };
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (viewMode !== 'walkthrough' || isPaused || activeModalExhibit) return;

    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];

      // Handle Joystick Move
      if (touch.identifier === joystickTouchIdRef.current) {
        const dx = touch.clientX - joystickStartRef.current.x;
        const dy = touch.clientY - joystickStartRef.current.y;
        const maxDist = 45;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const clampedDist = Math.min(dist, maxDist);
        const angle = Math.atan2(dy, dx);

        const thumbX = Math.cos(angle) * clampedDist;
        const thumbY = Math.sin(angle) * clampedDist;
        setJoystickThumbOffset({ x: thumbX, y: thumbY });

        if (controllerRef.current) {
          controllerRef.current.touchMove.x = thumbX / maxDist;
          controllerRef.current.touchMove.y = thumbY / maxDist;
        }
      }

      // Handle Look Swipe
      if (touch.identifier === lookTouchIdRef.current) {
        const dx = touch.clientX - lookLastPosRef.current.x;
        const dy = touch.clientY - lookLastPosRef.current.y;
        lookLastPosRef.current = { x: touch.clientX, y: touch.clientY };

        if (controllerRef.current) {
          controllerRef.current.touchLookDelta.x += dx;
          controllerRef.current.touchLookDelta.y += dy;
        }
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation();
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];

      if (touch.identifier === joystickTouchIdRef.current) {
        joystickTouchIdRef.current = null;
        setJoystickThumbOffset({ x: 0, y: 0 });
        if (controllerRef.current) {
          controllerRef.current.touchMove.x = 0;
          controllerRef.current.touchMove.y = 0;
        }
      }

      if (touch.identifier === lookTouchIdRef.current) {
        lookTouchIdRef.current = null;
      }
    }
  };

  // ── Initialize Three.js Scene ─────────────────────────────────────────────
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: quality !== 'low',
        alpha: false,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglError('Browser Anda tidak mendukung akselerasi WebGL. Silakan gunakan peramban modern.');
      return;
    }

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, quality === 'high' ? 2 : 1.5));
    renderer.shadowMap.enabled = quality !== 'low';
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    rendererRef.current = renderer;

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      setWebglError('Konteks WebGL terputus (GPU context lost). Anda dapat kembali ke kurasi 2D.');
    };
    canvas.addEventListener('webglcontextlost', handleContextLost, false);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x181716);
    scene.fog = new THREE.FogExp2(0x181716, 0.025);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      72,
      container.clientWidth / container.clientHeight,
      0.1,
      80
    );
    cameraRef.current = camera;

    // Instantiate Authoritative Player Entity (Avatar 1.70m, Eye level 1.60m)
    const initialPos = new THREE.Vector3(0, 0.50, 5.2);
    const player = new PlayerEntity(initialPos, Math.PI);
    player.bobEnabled = headBobEnabled;
    playerRef.current = player;

    // Add Avatar Mesh to Scene
    scene.add(player.avatar.rootGroup);

    // Instantiate Decoupled Camera System (3 POVs, Wall-collision raycasting)
    const cameraSys = new CameraSystem(new THREE.Vector3(0, 2.1, 5.2));
    cameraSys.setPOV(currentPOV);
    cameraSysRef.current = cameraSys;

    // Instantiate Input Controller
    const controller = new PlayerController();
    controllerRef.current = controller;

    // Build Architectural Shell
    const architecture = buildMuseumArchitecture();
    scene.add(architecture.group);
    updateArchRef.current = architecture.update || null;

    // Build Exhibits
    const exhibitsModule = buildMuseumExhibits();
    scene.add(exhibitsModule.group);
    exhibitsRef.current = exhibitsModule.exhibits;
    updateExhibitsRef.current = exhibitsModule.update;

    // Aggregate Colliders
    collidersRef.current = [...architecture.colliders, ...exhibitsModule.colliders];

    // Build Lighting Rig
    const lighting = buildMuseumLighting(quality);
    scene.add(lighting.group);
    setLightingQualityRef.current = lighting.setQuality;

    // Handle Resize
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // ── Main Render Loop ────────────────────────────────────────────────────
    lastTimeRef.current = performance.now();

    const animate = (currentTime: number) => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      const delta = (currentTime - lastTimeRef.current) / 1000;
      lastTimeRef.current = currentTime;
      const safeDelta = Math.min(delta, 0.08);

      // Update exhibits animation (e.g. rotating globe, video screen glow, gaze halo)
      updateExhibitsRef.current?.(safeDelta, playerRef.current?.focusedExhibit?.id);
      // Update architecture & fountain animation (e.g. water spray, ripples)
      updateArchRef.current?.(safeDelta, currentTime / 1000);

      if (viewModeRef.current === 'walkthrough') {
        if (!isPausedRef.current && !activeModalExhibitRef.current) {
          controller.update(
            safeDelta,
            player,
            cameraSys,
            collidersRef.current,
            exhibitsRef.current,
            camera
          );
        }
        const nextFocusId = player.focusedExhibit ? player.focusedExhibit.id : null;
        if (nextFocusId !== lastFocusedExhibitIdRef.current) {
          lastFocusedExhibitIdRef.current = nextFocusId;
          setFocusedExhibit(player.focusedExhibit);
        }
      } else {
        // Diorama Orbit Camera
        const o = orbitRef.current;
        o.theta += (o.targetTheta - o.theta) * 0.12;
        o.phi += (o.targetPhi - o.phi) * 0.12;
        o.radius += (o.targetRadius - o.radius) * 0.12;

        const cx = o.pivot.x + o.radius * Math.sin(o.phi) * Math.sin(o.theta);
        const cy = o.pivot.y + o.radius * Math.cos(o.phi);
        const cz = o.pivot.z + o.radius * Math.sin(o.phi) * Math.cos(o.theta);

        camera.position.set(cx, cy, cz);
        camera.lookAt(o.pivot);
        if (lastFocusedExhibitIdRef.current !== null) {
          lastFocusedExhibitIdRef.current = null;
          setFocusedExhibit(null);
        }
      }

      renderer.render(scene, camera);
    };

    animFrameIdRef.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      cancelAnimationFrame(animFrameIdRef.current);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('webglcontextlost', handleContextLost);

      // Deep recursive GPU resource disposal (F-01)
      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const mesh = obj as THREE.Mesh;
          if (mesh.geometry) {
            mesh.geometry.dispose();
          }
          if (mesh.material) {
            const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            mats.forEach((mat) => {
              // Dispose standard texture map channels if present
              const m = mat as any;
              if (m.map && typeof m.map.dispose === 'function') m.map.dispose();
              if (m.lightMap && typeof m.lightMap.dispose === 'function') m.lightMap.dispose();
              if (m.bumpMap && typeof m.bumpMap.dispose === 'function') m.bumpMap.dispose();
              if (m.normalMap && typeof m.normalMap.dispose === 'function') m.normalMap.dispose();
              if (m.roughnessMap && typeof m.roughnessMap.dispose === 'function') m.roughnessMap.dispose();
              if (m.metalnessMap && typeof m.metalnessMap.dispose === 'function') m.metalnessMap.dispose();
              if (m.envMap && typeof m.envMap.dispose === 'function') m.envMap.dispose();
              mat.dispose();
            });
          }
        }
      });

      renderer.dispose();
      scene.clear();
    };
  }, [quality]);

  // Sync head bob setting
  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.bobEnabled = headBobEnabled;
    }
  }, [headBobEnabled]);

  // Sync POV mode when changed externally
  useEffect(() => {
    if (cameraSysRef.current) {
      cameraSysRef.current.setPOV(currentPOV);
    }
  }, [currentPOV]);

  // Handle Quality Tier Change
  const handleQualityChange = (q: MuseumQualityTier) => {
    setQuality(q);
    setLightingQualityRef.current?.(q);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full select-none overflow-hidden bg-museum-dark font-sans"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 3D Canvas */}
      <canvas
        ref={canvasRef}
        onClick={requestPointerLock}
        className="w-full h-full block cursor-crosshair focus:outline-none"
      />

      {/* WebGL Error Banner (Graceful Fallback - Requirement 13) */}
      {webglError && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-museum-dark/95 text-parchment-200 text-center">
          <div className="max-w-md p-6 rounded-2xl border border-red-500/40 bg-red-950/40 shadow-2xl space-y-4">
            <span className="text-3xl block">⚠️</span>
            <h3 className="font-serif text-lg font-bold text-red-400">Akselerasi 3D Tidak Tersedia</h3>
            <p className="text-xs font-mono text-parchment-400 leading-relaxed">{webglError}</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onExitSimulation?.();
              }}
              className="px-5 py-2.5 rounded-xl bg-museum-gold text-museum-dark font-mono font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all cursor-pointer shadow-lg inline-flex items-center gap-2"
            >
              <span>←</span>
              <span>Kembali ke Tampilan 2D</span>
            </button>
          </div>
        </div>
      )}

      {/* ── Top Floating Bar ───────────────────────────────────────────────── */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Left: Mode Badge & POV Switcher */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Mode Switcher: Penjelajah vs Diorama */}
          <button
            onClick={() => {
              if (viewMode === 'walkthrough') {
                if (document.pointerLockElement) document.exitPointerLock();
                setViewMode('diorama');
              } else {
                setViewMode('walkthrough');
              }
            }}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-parchment-700/60 bg-museum-surface/90 backdrop-blur-md text-xs font-mono text-parchment-200 hover:border-museum-gold hover:text-white transition-all shadow-lg cursor-pointer"
            title="Ganti Mode Pandangan (Penjelajah / Orbit Luar)"
          >
            <span>{viewMode === 'walkthrough' ? '🚶 Mode Penjelajah' : '🏛️ Mode Diorama (Orbit)'}</span>
            <span className="text-[10px] text-parchment-400 border-l border-parchment-700 pl-2">Ganti</span>
          </button>

          {/* POV Selector Button (only in walkthrough) */}
          {viewMode === 'walkthrough' && (
            <button
              onClick={cyclePOV}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-museum-gold/60 bg-museum-surface/95 backdrop-blur-md text-xs font-mono text-museum-gold hover:bg-museum-gold hover:text-museum-dark transition-all shadow-lg cursor-pointer group"
              title="Ganti Sudut Pandang Kamera (Tekan V)"
            >
              <span>{POV_LABELS[currentPOV].icon}</span>
              <span className="font-semibold">{POV_LABELS[currentPOV].name}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-museum-gold/20 text-museum-gold group-hover:bg-museum-dark group-hover:text-museum-gold font-bold">
                V
              </span>
            </button>
          )}

          {/* Quality Tier Selector */}
          <div className="hidden sm:flex items-center rounded-full border border-parchment-700/60 bg-museum-surface/90 backdrop-blur-md p-0.5 text-[11px] font-mono shadow-lg">
            {(['high', 'medium', 'low'] as MuseumQualityTier[]).map((q) => (
              <button
                key={q}
                onClick={() => handleQualityChange(q)}
                className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                  quality === q
                    ? 'bg-museum-gold text-museum-dark font-bold'
                    : 'text-parchment-400 hover:text-parchment-200'
                }`}
              >
                {q === 'high' ? 'HD' : q === 'medium' ? 'Med' : 'Eco'}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Keybinds, Fullscreen & Pause / Menu Button */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 rounded-full border border-parchment-800/80 bg-museum-surface/85 backdrop-blur-md text-[11px] font-mono text-parchment-400 shadow-lg">
            <span><kbd className="px-1.5 py-0.5 rounded bg-parchment-900 border border-parchment-700 text-parchment-200">WASD</kbd> Gerak</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-parchment-900 border border-parchment-700 text-parchment-200">Shift</kbd> Lari</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-parchment-900 border border-parchment-700 text-parchment-200">Spasi</kbd> Lompat</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-parchment-900 border border-parchment-700 text-parchment-200">V</kbd> POV</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-parchment-900 border border-parchment-700 text-parchment-200">E</kbd> Periksa</span>
            <button
              onClick={() => setHeadBobEnabled(!headBobEnabled)}
              title="Animasi Langkah Kepala"
              className={`px-2 py-0.5 rounded text-[10px] transition-colors cursor-pointer border ${
                headBobEnabled ? 'border-museum-gold/50 text-museum-gold' : 'border-parchment-700 text-parchment-500'
              }`}
            >
              {headBobEnabled ? 'Bob ON' : 'Bob OFF'}
            </button>
          </div>

          {/* User-Initiated Fullscreen Toggle Button (Requirement 10) */}
          <button
            onClick={toggleFullscreen}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-parchment-700/80 bg-museum-surface/90 backdrop-blur-md text-xs font-mono text-parchment-200 hover:text-white hover:border-museum-gold transition-all shadow-lg cursor-pointer"
            title={isFullscreen ? 'Keluar Layar Penuh' : 'Mode Layar Penuh'}
          >
            <span>{isFullscreen ? '🗗' : '⛶'}</span>
            <span className="hidden sm:inline">{isFullscreen ? 'Layar Biasa' : 'Layar Penuh'}</span>
          </button>

          {/* Pause / In-Simulation Menu Button */}
          <button
            onClick={() => {
              setIsPaused(true);
              if (document.pointerLockElement) document.exitPointerLock();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-parchment-700/80 bg-museum-surface/90 backdrop-blur-md text-xs font-mono text-parchment-200 hover:text-white hover:border-museum-gold transition-all shadow-lg cursor-pointer"
            title="Jeda Simulasi / Menu (ESC)"
          >
            <span>⏸️</span>
            <span>Menu (ESC)</span>
          </button>
        </div>
      </div>

      {/* ── Reticle & Proximity Prompt HUD (Walkthrough Mode) ──────────────── */}
      {viewMode === 'walkthrough' && !isPaused && (
        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center z-10">
          {/* First-person Reticle (only in POV 1) */}
          {currentPOV === 'first_person' && (
            <div className="relative flex items-center justify-center">
              {focusedExhibit ? (
                <div className="relative w-8 h-8 flex items-center justify-center animate-pulse">
                  <div className="absolute inset-0 rounded-full border-2 border-museum-gold opacity-80" />
                  <div className="w-1.5 h-1.5 rounded-full bg-museum-gold shadow-[0_0_8px_#d4a843]" />
                </div>
              ) : (
                <div className="w-2 h-2 rounded-full bg-parchment-300/60 shadow-sm" />
              )}
            </div>
          )}

          {/* Proximity Interaction Prompt */}
          {focusedExhibit && (
            <div className="mt-8 flex flex-col items-center pointer-events-auto animate-bounce">
              <button
                onClick={() => openExhibitDetail(focusedExhibit)}
                className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-museum-surface/95 border-2 border-museum-gold text-parchment-100 shadow-2xl backdrop-blur-md hover:bg-museum-gold hover:text-museum-dark transition-all cursor-pointer"
              >
                <span className="px-2 py-0.5 rounded bg-museum-gold text-museum-dark font-bold font-mono text-xs">
                  E
                </span>
                <span className="text-xs font-mono font-medium">
                  Periksa {focusedExhibit.title.split('&')[0]}
                </span>
              </button>
              <span className="text-[10px] font-mono text-museum-gold/90 mt-1">
                Jarak Dekat · Klik atau Tekan [E]
              </span>
            </div>
          )}

          {/* Unlocked Cursor Overlay Instruction (when not locked) */}
          {!isPointerLocked && !activeModalExhibit && !isMobile && (
            <div className="absolute bottom-20 px-5 py-2.5 rounded-2xl bg-black/85 border border-museum-gold/50 text-center pointer-events-auto backdrop-blur-md shadow-2xl">
              <p className="text-xs font-mono text-parchment-200">
                <span className="text-museum-gold font-bold">Klik Layar</span> untuk mengunci kursor & mulai berjalan
              </p>
              <p className="text-[10px] font-mono text-parchment-400 mt-0.5">
                <kbd className="px-1 bg-parchment-800 text-parchment-200 rounded">V</kbd> Ganti POV (FPS/Karakter/Sinematik) · <kbd className="px-1 bg-parchment-800 text-parchment-200 rounded">ESC</kbd> Menu Jeda
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── Mobile Touch Controls Overlay ─────────────────────────────────── */}
      {isMobile && viewMode === 'walkthrough' && !isPaused && !activeModalExhibit && (
        <div className="absolute inset-0 pointer-events-none z-30">
          {/* Left: Virtual Movement Thumbstick Base */}
          <div className="absolute bottom-8 left-8 w-28 h-28 rounded-full border-2 border-white/20 bg-black/30 backdrop-blur-sm flex items-center justify-center">
            {/* Moving Thumb */}
            <div
              className="w-12 h-12 rounded-full bg-museum-gold/80 border border-white/40 shadow-lg transform transition-transform"
              style={{
                transform: `translate(${joystickThumbOffset.x}px, ${joystickThumbOffset.y}px)`,
              }}
            />
          </div>

          {/* Right: Action Buttons (POV, Jump & Inspect) */}
          <div className="absolute bottom-8 right-8 flex flex-col gap-3 pointer-events-auto">
            {/* Inspect Button (if near exhibit) */}
            {focusedExhibit && (
              <button
                onClick={() => openExhibitDetail(focusedExhibit)}
                className="w-16 h-16 rounded-full bg-museum-gold text-museum-dark font-bold font-mono text-xs flex flex-col items-center justify-center shadow-2xl border-2 border-white/50 active:scale-95 transition-transform"
              >
                <span>🔍</span>
                <span className="text-[10px]">Periksa</span>
              </button>
            )}

            {/* Jump Button */}
            <button
              onClick={() => {
                if (controllerRef.current) controllerRef.current.touchJump = true;
              }}
              className="w-16 h-16 rounded-full bg-parchment-800/80 text-parchment-100 font-bold font-mono text-xs flex flex-col items-center justify-center shadow-lg border border-parchment-600 active:scale-95 transition-transform"
            >
              <span>⬆️</span>
              <span className="text-[10px]">Lompat</span>
            </button>

            {/* Cycle POV Button */}
            <button
              onClick={cyclePOV}
              className="w-14 h-14 rounded-full bg-museum-surface/90 border border-museum-gold/60 text-museum-gold font-bold font-mono text-xs flex flex-col items-center justify-center shadow-lg active:scale-95 transition-transform"
              title="Ganti Sudut Pandang"
            >
              <span>{POV_LABELS[currentPOV].icon}</span>
              <span className="text-[9px]">{POV_LABELS[currentPOV].short}</span>
            </button>
          </div>
        </div>
      )}

      {/* ── Bottom Teleport & Fast Travel Dock ─────────────────────────────── */}
      {!isPaused && (
        <div className="absolute bottom-3 left-4 right-4 z-20 flex justify-center pointer-events-none">
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl border border-parchment-800/80 bg-museum-surface/90 backdrop-blur-md pointer-events-auto shadow-2xl overflow-x-auto max-w-full">
            <span className="text-[10px] font-mono text-parchment-500 px-2 uppercase tracking-wider hidden lg:inline">
              Teleportasi:
            </span>

            <button
              onClick={() => teleportToZone('entrance')}
              className="px-2.5 py-1 rounded-xl text-xs font-mono text-parchment-300 hover:text-white hover:bg-parchment-800/60 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              title="Pintu Masuk Museum"
            >
              <span>🚪</span>
              <span className="hidden sm:inline">Pintu Masuk</span>
            </button>

            {exhibitsRef.current.map((exhibit) => (
              <button
                key={exhibit.id}
                onClick={() => teleportToZone(exhibit.id)}
                className="px-2.5 py-1 rounded-xl text-xs font-mono text-parchment-300 hover:text-white hover:bg-parchment-800/60 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                title={exhibit.title}
              >
                <span>{exhibit.icon}</span>
                <span className="hidden sm:inline">{exhibit.tag}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── In-Simulation Pause Modal ──────────────────────────────────────── */}
      {isPaused && (
        <div
          ref={pauseModalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="pause-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
        >
          <div className="w-full max-w-md rounded-2xl border border-museum-gold/50 bg-museum-surface p-6 text-parchment-100 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-parchment-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">⏸️</span>
                <h3 id="pause-modal-title" className="font-serif text-lg font-bold text-parchment-100">
                  Simulasi Museum Dijeda
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-museum-gold/20 text-museum-gold font-bold">
                {POV_LABELS[currentPOV].name}
              </span>
            </div>

            <div className="text-xs font-mono text-parchment-300 space-y-2 bg-parchment-900/50 p-3.5 rounded-xl border border-parchment-800">
              <div className="flex justify-between">
                <span>Posisi Penjelajah:</span>
                <span className="text-parchment-100 font-bold">
                  {playerRef.current ? `X: ${playerRef.current.position.x.toFixed(1)}m, Z: ${playerRef.current.position.z.toFixed(1)}m` : '0, 0'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Skala Tubuh:</span>
                <span className="text-parchment-100 font-bold">1.70 m (Mata 1.60 m)</span>
              </div>
              <div className="flex justify-between">
                <span>Sudut Pandang Kamera:</span>
                <span className="text-museum-gold font-bold">{POV_LABELS[currentPOV].short}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 pt-1">
              <button
                onClick={() => {
                  setIsPaused(false);
                  requestPointerLock();
                }}
                className="w-full py-2.5 rounded-xl bg-museum-gold text-museum-dark font-bold font-mono text-xs uppercase tracking-wider hover:bg-amber-400 transition-colors cursor-pointer shadow-lg flex items-center justify-center gap-2"
              >
                <span>▶️</span>
                <span>Lanjutkan Eksplorasi</span>
              </button>

              <button
                onClick={cyclePOV}
                className="w-full py-2 rounded-xl border border-parchment-700 bg-parchment-900/50 text-parchment-200 hover:text-white hover:border-museum-gold font-mono text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <span>🎥</span>
                <span>Ganti Sudut Pandang (Tekan V)</span>
              </button>

              <button
                onClick={() => {
                  setIsPaused(false);
                  if (document.pointerLockElement) document.exitPointerLock();
                  onExitSimulation?.();
                }}
                className="w-full py-2 rounded-xl border border-red-500/40 bg-red-950/20 text-red-300 hover:bg-red-900/40 hover:text-red-100 font-mono text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <span>🚪</span>
                <span>Keluar dari Simulasi ke Halaman Museum</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Curatorial Detail Modal ───────────────────────────────────────── */}
      {activeModalExhibit && (
        <ExhibitModal
          exhibit={activeModalExhibit}
          onClose={() => setActiveModalExhibit(null)}
          onSelectCountry={onSelectCountry}
        />
      )}
    </div>
  );
};
