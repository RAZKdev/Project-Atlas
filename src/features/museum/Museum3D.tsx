/**
 * Museum3D.tsx
 * Interactive First-Person 3D Mini Museum — "195 Negara, 1 Cerita"
 *
 * Architecture:
 * - Human Canonical Scale: 1 unit = 1 meter
 * - Kinematic First-Person Player Controller (Avatar 1.70m, Eye level 1.60m)
 * - Independent X/Z AABB collision resolution with natural wall-sliding
 * - Accurate 6x8m Architectural Shell with raised foundation and entrance steps
 * - 6 Curated Exhibition Zones with rich PBR materials and procedural animations
 * - Center-screen raycasting with dynamic crosshair and [E] prompt
 * - Dual Mode: Walkthrough (First-Person) & Diorama (Exterior Orbit)
 * - Touch Virtual Joystick & swipe-look controls for mobile devices
 * - WebGL context loss handling and quality settings
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { PlayerController } from './museumEngine/playerController';
import { buildMuseumArchitecture } from './museumEngine/museumArchitecture';
import { buildMuseumExhibits } from './museumEngine/museumExhibits';
import { buildMuseumLighting } from './museumEngine/museumLighting';
import {
  type CollisionBox,
  type InteractableExhibit,
  type MuseumViewMode,
  type MuseumQualityTier,
} from './museumEngine/types';
import { ExhibitModal } from './ExhibitModal';

interface Museum3DProps {
  onSelectCountry?: (countryCode: string) => void;
  onZoneSelect?: (exhibit: InteractableExhibit) => void;
}

export const Museum3D: React.FC<Museum3DProps> = ({ onSelectCountry, onZoneSelect }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Engine references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const playerRef = useRef<PlayerController | null>(null);
  const collidersRef = useRef<CollisionBox[]>([]);
  const exhibitsRef = useRef<InteractableExhibit[]>([]);
  const updateExhibitsRef = useRef<((delta: number) => void) | null>(null);
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
  const [isPointerLocked, setIsPointerLocked] = useState(false);
  const [focusedExhibit, setFocusedExhibit] = useState<InteractableExhibit | null>(null);
  const [activeModalExhibit, setActiveModalExhibit] = useState<InteractableExhibit | null>(null);
  const [quality, setQuality] = useState<MuseumQualityTier>('high');
  const [isMobile, setIsMobile] = useState(false);
  const [webglError, setWebglError] = useState<string | null>(null);
  const [headBobEnabled, setHeadBobEnabled] = useState(true);

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

  // ── Open Exhibit Detail ───────────────────────────────────────────────────
  const openExhibitDetail = useCallback(
    (exhibit: InteractableExhibit) => {
      // Release pointer lock when opening modal
      if (document.pointerLockElement) {
        document.exitPointerLock();
      }
      setActiveModalExhibit(exhibit);
      onZoneSelect?.(exhibit);
    },
    [onZoneSelect]
  );

  // ── Teleport to Zone ──────────────────────────────────────────────────────
  const teleportToZone = useCallback(
    (exhibitId: string) => {
      const player = playerRef.current;
      const exhibits = exhibitsRef.current;
      if (!player) return;

      const targetExhibit = exhibits.find((e) => e.id === exhibitId);
      if (targetExhibit && targetExhibit.viewPosition && targetExhibit.viewTarget) {
        const vp = targetExhibit.viewPosition;
        const vt = targetExhibit.viewTarget;

        // Calculate yaw pointing towards viewTarget
        const dx = vt[0] - vp[0];
        const dz = vt[2] - vp[2];
        const targetYaw = Math.atan2(-dx, -dz);

        player.teleport(vp[0], 0.50, vp[2], targetYaw, 0);

        if (viewMode === 'diorama') {
          setViewMode('walkthrough');
        }
      } else if (exhibitId === 'entrance') {
        // Outside entrance facing inward
        player.teleport(0, 0.50, 5.4, Math.PI, 0);
        if (viewMode === 'diorama') {
          setViewMode('walkthrough');
        }
      }
    },
    [viewMode]
  );

  // ── Request Pointer Lock ──────────────────────────────────────────────────
  const requestPointerLock = useCallback(() => {
    if (viewMode !== 'walkthrough' || activeModalExhibit) return;
    const canvas = canvasRef.current;
    if (canvas && !document.pointerLockElement) {
      canvas.requestPointerLock();
    }
  }, [viewMode, activeModalExhibit]);

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
      if (viewMode === 'walkthrough' && document.pointerLockElement === canvasRef.current) {
        playerRef.current?.onMouseMove(e.movementX, e.movementY);
      } else if (viewMode === 'diorama' && orbitRef.current.isDragging) {
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
      if (viewMode === 'diorama') {
        orbitRef.current.isDragging = true;
        orbitRef.current.lastX = e.clientX;
        orbitRef.current.lastY = e.clientY;
      } else if (viewMode === 'walkthrough') {
        if (!document.pointerLockElement && !activeModalExhibit) {
          requestPointerLock();
        } else if (document.pointerLockElement && playerRef.current?.focusedExhibit) {
          // Left click on focused exhibit inspects it
          openExhibitDetail(playerRef.current.focusedExhibit);
        }
      }
    };

    const handleMouseUp = () => {
      if (viewMode === 'diorama') {
        orbitRef.current.isDragging = false;
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (viewMode === 'diorama') {
        e.preventDefault();
        const delta = e.deltaY * 0.015;
        orbitRef.current.targetRadius = Math.max(7, Math.min(26, orbitRef.current.targetRadius + delta));
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeModalExhibit) return;

      // Check interaction key [E]
      if (e.code === 'KeyE') {
        if (playerRef.current?.focusedExhibit) {
          openExhibitDetail(playerRef.current.focusedExhibit);
        }
      }

      playerRef.current?.onKeyDown(e.code);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      playerRef.current?.onKeyUp(e.code);
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
    };
  }, [viewMode, activeModalExhibit, requestPointerLock, openExhibitDetail]);

  // ── Touch Virtual Joystick & Swipe Handlers ───────────────────────────────
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (viewMode !== 'walkthrough') return;

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
    if (viewMode !== 'walkthrough') return;

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

        // Normalize to [-1, 1]
        if (playerRef.current) {
          playerRef.current.touchMove.x = thumbX / maxDist;
          playerRef.current.touchMove.y = thumbY / maxDist;
        }
      }

      // Handle Look Swipe
      if (touch.identifier === lookTouchIdRef.current) {
        const dx = touch.clientX - lookLastPosRef.current.x;
        const dy = touch.clientY - lookLastPosRef.current.y;
        lookLastPosRef.current = { x: touch.clientX, y: touch.clientY };

        if (playerRef.current) {
          playerRef.current.touchLookDelta.x += dx;
          playerRef.current.touchLookDelta.y += dy;
        }
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];

      if (touch.identifier === joystickTouchIdRef.current) {
        joystickTouchIdRef.current = null;
        setJoystickThumbOffset({ x: 0, y: 0 });
        if (playerRef.current) {
          playerRef.current.touchMove.x = 0;
          playerRef.current.touchMove.y = 0;
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
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x181716); // dark gallery ambient
    scene.fog = new THREE.FogExp2(0x181716, 0.025);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      72, // 72 deg FOV for realistic human scale
      container.clientWidth / container.clientHeight,
      0.1,
      80
    );
    cameraRef.current = camera;

    // Build Player Controller (Spawns at entrance door, looking inward)
    const player = new PlayerController(new THREE.Vector3(0, 0.50, 5.2), Math.PI);
    player.bobEnabled = headBobEnabled;
    playerRef.current = player;

    // Build Architectural Shell
    const architecture = buildMuseumArchitecture();
    scene.add(architecture.group);

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

      // Cap delta
      const safeDelta = Math.min(delta, 0.08);

      // Update exhibits animation (e.g. rotating globe, video screen glow)
      updateExhibitsRef.current?.(safeDelta);

      if (viewMode === 'walkthrough') {
        // Update Kinematic Player
        player.update(safeDelta, collidersRef.current, exhibitsRef.current, camera);
        setFocusedExhibit(player.focusedExhibit);
      } else {
        // Update Diorama Orbit Camera
        const o = orbitRef.current;
        // Smoothly lerp towards targets
        o.theta += (o.targetTheta - o.theta) * 0.12;
        o.phi += (o.targetPhi - o.phi) * 0.12;
        o.radius += (o.targetRadius - o.radius) * 0.12;

        const cx = o.pivot.x + o.radius * Math.sin(o.phi) * Math.sin(o.theta);
        const cy = o.pivot.y + o.radius * Math.cos(o.phi);
        const cz = o.pivot.z + o.radius * Math.sin(o.phi) * Math.cos(o.theta);

        camera.position.set(cx, cy, cz);
        camera.lookAt(o.pivot);
        setFocusedExhibit(null);
      }

      renderer.render(scene, camera);
    };

    animFrameIdRef.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      cancelAnimationFrame(animFrameIdRef.current);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      scene.clear();
    };
  }, [quality, headBobEnabled]);

  // Sync head bob setting
  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.bobEnabled = headBobEnabled;
    }
  }, [headBobEnabled]);

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

      {/* WebGL Error Banner */}
      {webglError && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-museum-dark/95 text-parchment-200 text-center">
          <div className="max-w-md p-6 rounded-2xl border border-red-500/40 bg-red-950/20">
            <span className="text-3xl mb-3 block">⚠️</span>
            <h3 className="font-serif text-lg font-bold text-red-400 mb-2">Akselerasi 3D Tidak Tersedia</h3>
            <p className="text-xs font-mono text-parchment-400 leading-relaxed mb-4">{webglError}</p>
          </div>
        </div>
      )}

      {/* ── Top Floating Bar ───────────────────────────────────────────────── */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Left: Mode Badge & Quick Status */}
        <div className="flex items-center gap-2 pointer-events-auto">
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
          >
            <span>{viewMode === 'walkthrough' ? '🚶 Mode Penjelajah (FPS)' : '🏛️ Mode Diorama (Orbit)'}</span>
            <span className="text-[10px] text-parchment-400 border-l border-parchment-700 pl-2">Ganti</span>
          </button>

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

        {/* Right: Keybinds / Help Badge */}
        <div className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-full border border-parchment-800/80 bg-museum-surface/85 backdrop-blur-md text-[11px] font-mono text-parchment-400 pointer-events-auto shadow-lg">
          <span><kbd className="px-1.5 py-0.5 rounded bg-parchment-900 border border-parchment-700 text-parchment-200">WASD</kbd> Gerak</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-parchment-900 border border-parchment-700 text-parchment-200">Shift</kbd> Lari</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-parchment-900 border border-parchment-700 text-parchment-200">Spasi</kbd> Lompat</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-parchment-900 border border-parchment-700 text-parchment-200">E</kbd> Periksa</span>
          <button
            onClick={() => setHeadBobEnabled(!headBobEnabled)}
            title="Animasi Langkah Kepala"
            className={`px-2 py-0.5 rounded text-[10px] transition-colors cursor-pointer border ${
              headBobEnabled ? 'border-museum-gold/50 text-museum-gold' : 'border-parchment-700 text-parchment-500'
            }`}
          >
            {headBobEnabled ? 'Bobbing ON' : 'Bobbing OFF'}
          </button>
        </div>
      </div>

      {/* ── First-Person Crosshair & Proximity Prompt HUD ─────────────────── */}
      {viewMode === 'walkthrough' && (
        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center z-10">
          {/* Reticle */}
          <div className="relative flex items-center justify-center">
            {focusedExhibit ? (
              // Active Exhibit Reticle
              <div className="relative w-8 h-8 flex items-center justify-center animate-pulse">
                <div className="absolute inset-0 rounded-full border-2 border-museum-gold opacity-80" />
                <div className="w-1.5 h-1.5 rounded-full bg-museum-gold shadow-[0_0_8px_#d4a843]" />
              </div>
            ) : (
              // Idle Subtle Center Dot
              <div className="w-2 h-2 rounded-full bg-parchment-300/60 shadow-sm" />
            )}
          </div>

          {/* Interactive Inspection Tooltip Prompt */}
          {focusedExhibit && (
            <div className="mt-6 flex flex-col items-center pointer-events-auto animate-bounce">
              <button
                onClick={() => openExhibitDetail(focusedExhibit)}
                className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-museum-surface/95 border border-museum-gold text-parchment-100 shadow-2xl backdrop-blur-md hover:bg-museum-gold hover:text-museum-dark transition-all cursor-pointer"
              >
                <span className="px-2 py-0.5 rounded bg-museum-gold text-museum-dark font-bold font-mono text-xs">
                  E
                </span>
                <span className="text-xs font-mono font-medium">
                  Periksa {focusedExhibit.title.split('&')[0]}
                </span>
              </button>
              <span className="text-[10px] font-mono text-museum-gold/80 mt-1">
                Jarak Dekat · Klik atau Tekan [E]
              </span>
            </div>
          )}

          {/* Unlocked Cursor Overlay Instruction (when not locked) */}
          {!isPointerLocked && !activeModalExhibit && !isMobile && (
            <div className="absolute bottom-20 px-5 py-2.5 rounded-2xl bg-black/80 border border-museum-gold/40 text-center pointer-events-auto backdrop-blur-md shadow-2xl">
              <p className="text-xs font-mono text-parchment-200">
                <span className="text-museum-gold font-bold">Klik Layar</span> untuk mengunci kursor & mulai berjalan
              </p>
              <p className="text-[10px] font-mono text-parchment-400 mt-0.5">
                Gunakan tetikus untuk menengok · Tekan <kbd className="px-1 bg-parchment-800 text-parchment-200 rounded">ESC</kbd> untuk melepas kursor
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── Mobile Touch Controls Overlay ─────────────────────────────────── */}
      {isMobile && viewMode === 'walkthrough' && (
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

          {/* Right: Action Buttons (Jump & Inspect) */}
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
                if (playerRef.current) playerRef.current.touchJump = true;
              }}
              className="w-16 h-16 rounded-full bg-parchment-800/80 text-parchment-100 font-bold font-mono text-xs flex flex-col items-center justify-center shadow-lg border border-parchment-600 active:scale-95 transition-transform"
            >
              <span>⬆️</span>
              <span className="text-[10px]">Lompat</span>
            </button>
          </div>
        </div>
      )}

      {/* ── Bottom Teleport & Fast Travel Dock ─────────────────────────────── */}
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
