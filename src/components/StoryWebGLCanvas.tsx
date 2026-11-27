import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

export type StoryActId = 0 | 1 | 2 | 3 | 4;

export interface StoryWebGLHandle {
  setAct: (act: StoryActId, triggerWarpTunnel?: boolean, warpColorHex?: number) => void;
  triggerWarp: (duration?: number, colorHex?: number) => void;
  triggerCameraShake: (intensity?: number) => void;
  triggerCameraKickBack: (amount?: number) => void;
  triggerImpactFlash: (colorHex?: number, intensity?: number) => void;
  setAct2State: (
    focusedIndex: number,
    ignitedFlags: [boolean, boolean, boolean, boolean],
    chargeProgress: number
  ) => void;
  triggerArtifactDetonation: (index: number, colorHex?: number) => void;
  triggerPlotTwistCrimson: () => void;
  setAct3BossState: (
    hpPercent: number,
    phase: 1 | 2 | 3,
    qteCharge: number,
    barrierActive: boolean,
    slowMoFactor: number
  ) => void;
  triggerBossHit3D: (isBackstab?: boolean) => void;
  triggerQteLightning3D: (charge: number) => void;
  triggerBossSupernova: () => void;
}

interface ActAtmosphere {
  fogHex: number;
  fogDensity: number;
  keyHex: number;
  rimHex: number;
  runeHex: number;
  hemiSky: number;
  hemiGround: number;
  camX: number;
  camY: number;
  camZ: number;
  lookY: number;
}

const ACT_ATMOSPHERES: Record<StoryActId, ActAtmosphere> = {
  // 0: Opening Title Sequence — Midnight Slate, Frost & Pale Gold
  0: {
    fogHex: 0x05070d,
    fogDensity: 0.015,
    keyHex: 0xa5e8ff,
    rimHex: 0xe6c999,
    runeHex: 0xa5e8ff,
    hemiSky: 0x2a3b68,
    hemiGround: 0x06080f,
    camX: 0,
    camY: 1.8,
    camZ: 28,
    lookY: 1.5,
  },
  // Act I: Midnight Storm Indigo & Frost
  1: {
    fogHex: 0x060a18,
    fogDensity: 0.016,
    keyHex: 0x8ad8ff,
    rimHex: 0x6c7bff,
    runeHex: 0xa5e8ff,
    hemiSky: 0x263973,
    hemiGround: 0x050712,
    camX: 0,
    camY: 1.1,
    camZ: 22.5,
    lookY: 0.9,
  },
  // Act II: Deep Cosmic Gold & Cyan (3D Artifact Sanctuary)
  2: {
    fogHex: 0x080b14,
    fogDensity: 0.0135,
    keyHex: 0xe6c999,
    rimHex: 0x5eead4,
    runeHex: 0xe6c999,
    hemiSky: 0x3b3545,
    hemiGround: 0x060910,
    camX: 0,
    camY: 1.3,
    camZ: 16.5,
    lookY: 0.65,
  },
  // Act III: Volcanic Crimson & Ash — The 3:00 AM Crucible
  3: {
    fogHex: 0x13060c,
    fogDensity: 0.016,
    keyHex: 0xff4c75,
    rimHex: 0xffa657,
    runeHex: 0xff5c82,
    hemiSky: 0x56192c,
    hemiGround: 0x0a0407,
    camX: 0,
    camY: 1.5,
    camZ: 18.5,
    lookY: 1.35,
  },
  // Act IV: Serene Golden Dawn 3D Horizon — The Summit
  4: {
    fogHex: 0x120f14,
    fogDensity: 0.011,
    keyHex: 0xf7d894,
    rimHex: 0xbdeeff,
    runeHex: 0xf7d894,
    hemiSky: 0x6d5846,
    hemiGround: 0x0d0a0e,
    camX: 0,
    camY: 2.8,
    camZ: 21.5,
    lookY: 2.3,
  },
};

const ARTIFACT_COLORS = [0xe6c999, 0x98f5e1, 0x90dbf4, 0xc8b6ff] as const;

// Reusable math objects outside render loop (zero per-frame GC allocations)
const _targetFog = new THREE.Color();
const _targetKey = new THREE.Color();
const _targetRim = new THREE.Color();
const _targetRune = new THREE.Color();
const _targetAmbient = new THREE.Color();
const _tmpColor = new THREE.Color();
const _dormantObsidian = new THREE.Color(0x0f1424);
const _lookTarget = new THREE.Vector3();
const _vortexTarget = new THREE.Vector3();
const _raycaster = new THREE.Raycaster();
const _pointerNdc = new THREE.Vector2();
const _parentDummy = new THREE.Object3D();
const _childDummy = new THREE.Object3D();
const _worldMat = new THREE.Matrix4();

function detectTouchDevice(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(
    window.matchMedia?.("(pointer: coarse)").matches ||
      navigator.maxTouchPoints > 0
  );
}

function detectSoftwareWebGL(): boolean {
  if (typeof document === "undefined") return false;
  try {
    const gl = document.createElement("canvas").getContext("webgl2");
    if (!gl) return true;
    const ext = gl.getExtension("WEBGL_debug_renderer_info");
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param));
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return false;
  }
}

function createRadialGlowTexture(
  innerHex: string,
  midHex: string,
  size = 128
): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d");
  if (ctx) {
    const half = size * 0.5;
    const g = ctx.createRadialGradient(half, half, 0, half, half, half);
    g.addColorStop(0, innerHex);
    g.addColorStop(0.32, midHex);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createMoonHaloTexture(): THREE.CanvasTexture {
  const size = 256;
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d");
  if (ctx) {
    const h = size * 0.5;
    const g = ctx.createRadialGradient(h, h, h * 0.2, h, h, h);
    g.addColorStop(0, "rgba(255, 248, 228, 0.98)");
    g.addColorStop(0.24, "rgba(230, 201, 153, 0.62)");
    g.addColorStop(0.48, "rgba(165, 232, 255, 0.24)");
    g.addColorStop(0.75, "rgba(124, 182, 235, 0.07)");
    g.addColorStop(1, "rgba(5, 7, 13, 0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createCrystalHaloTexture(): THREE.CanvasTexture {
  const size = 128;
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d");
  if (ctx) {
    const h = size * 0.5;
    const g = ctx.createRadialGradient(h, h, 0, h, h, h);
    g.addColorStop(0, "rgba(240, 252, 255, 0.96)");
    g.addColorStop(0.18, "rgba(165, 232, 255, 0.72)");
    g.addColorStop(0.45, "rgba(124, 232, 255, 0.24)");
    g.addColorStop(0.76, "rgba(230, 201, 153, 0.06)");
    g.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createMistCloudTexture(): THREE.CanvasTexture {
  const size = 256;
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d");
  if (ctx) {
    ctx.clearRect(0, 0, size, size);
    // Layered soft organic mist puffs
    const puffs = [
      { x: 0.5, y: 0.5, r: 0.48, a: 0.22 },
      { x: 0.34, y: 0.54, r: 0.32, a: 0.16 },
      { x: 0.68, y: 0.48, r: 0.34, a: 0.16 },
      { x: 0.48, y: 0.38, r: 0.28, a: 0.12 },
      { x: 0.52, y: 0.62, r: 0.3, a: 0.14 },
    ];
    for (const p of puffs) {
      const gx = p.x * size;
      const gy = p.y * size;
      const gr = p.r * size;
      const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr);
      g.addColorStop(0, `rgba(148, 198, 235, ${p.a})`);
      g.addColorStop(0.55, `rgba(74, 102, 146, ${p.a * 0.42})`);
      g.addColorStop(1, "rgba(5, 7, 13, 0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, size, size);
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createAbyssFloorTexture(): THREE.CanvasTexture {
  const size = 512;
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "#060912";
    ctx.fillRect(0, 0, size, size);
    // Subtle luminous central cathedral corridor sheen
    const g = ctx.createLinearGradient(0, 0, size, 0);
    g.addColorStop(0, "rgba(5, 7, 13, 0)");
    g.addColorStop(0.36, "rgba(165, 232, 255, 0.04)");
    g.addColorStop(0.5, "rgba(230, 201, 153, 0.09)");
    g.addColorStop(0.64, "rgba(165, 232, 255, 0.04)");
    g.addColorStop(1, "rgba(5, 7, 13, 0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);

    // Subtle carved obsidian stone slabs
    ctx.strokeStyle = "rgba(165, 232, 255, 0.06)";
    ctx.lineWidth = 1;
    for (let y = 0; y <= size; y += 64) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(size, y);
      ctx.stroke();
    }
    ctx.strokeStyle = "rgba(230, 201, 153, 0.08)";
    ctx.beginPath();
    ctx.moveTo(size * 0.42, 0);
    ctx.lineTo(size * 0.42, size);
    ctx.moveTo(size * 0.58, 0);
    ctx.lineTo(size * 0.58, size);
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, 5);
  return tex;
}

interface StoryWebGLCanvasProps {
  initialAct?: StoryActId;
  onSelectArtifact?: (index: number) => void;
}

const StoryWebGLCanvas = forwardRef<StoryWebGLHandle, StoryWebGLCanvasProps>(
  function StoryWebGLCanvas({ initialAct = 0, onSelectArtifact }, ref) {
    const mountRef = useRef<HTMLDivElement | null>(null);
    const onSelectArtifactRef = useRef(onSelectArtifact);
    onSelectArtifactRef.current = onSelectArtifact;

    const ctrlRef = useRef({
      act: initialAct as StoryActId,
      warpTimer: 0,
      warpDuration: 1.0,
      warpColorHex: 0xe6c999,
      shakeIntensity: 0,
      cameraKickZ: 0,
      flashIntensity: 0,
      flashColorHex: 0xa5e8ff,
      pointerX: 0,
      pointerY: 0,
      // Act II interactive 3D artifact state
      act2FocusedIndex: 0,
      act2Ignited: [false, false, false, false] as [boolean, boolean, boolean, boolean],
      act2Charge: 0,
      detonationTimer: 0,
      detonationIndex: 0,
      detonationColorHex: 0xe6c999,
      // Act II -> Act III plot twist flicker
      twistTimer: 0,
      // Act III 3D Boss Construct ("Titan of Entropy") state
      bossHp: 100,
      bossPhase: 1 as 1 | 2 | 3,
      bossQteCharge: 0,
      bossBarrierActive: false,
      bossSlowMo: 1,
      bossRecoilZ: 0,
      bossHitFlash: 0,
      bossSupernovaActive: false,
      bossSupernovaTime: 0,
      bossResetRequested: false,
    });

    useImperativeHandle(
      ref,
      () => ({
        setAct: (
          act: StoryActId,
          triggerWarpTunnel = true,
          warpColorHex = 0xe6c999
        ) => {
          ctrlRef.current.act = act;
          if (act === 3) {
            ctrlRef.current.bossHp = 100;
            ctrlRef.current.bossPhase = 1;
            ctrlRef.current.bossQteCharge = 0;
            ctrlRef.current.bossBarrierActive = false;
            ctrlRef.current.bossSlowMo = 1;
            ctrlRef.current.bossSupernovaActive = false;
            ctrlRef.current.bossSupernovaTime = 0;
            ctrlRef.current.bossResetRequested = true;
          }
          if (triggerWarpTunnel) {
            ctrlRef.current.warpDuration = 1.15;
            ctrlRef.current.warpTimer = 1.15;
            ctrlRef.current.warpColorHex = warpColorHex;
          }
        },
        triggerWarp: (duration = 1.25, colorHex = 0xe6c999) => {
          ctrlRef.current.warpDuration = duration;
          ctrlRef.current.warpTimer = duration;
          ctrlRef.current.warpColorHex = colorHex;
        },
        triggerCameraShake: (intensity = 0.75) => {
          ctrlRef.current.shakeIntensity = Math.max(
            ctrlRef.current.shakeIntensity,
            intensity
          );
        },
        triggerCameraKickBack: (amount = 3.2) => {
          ctrlRef.current.cameraKickZ = Math.max(
            ctrlRef.current.cameraKickZ,
            amount
          );
        },
        triggerImpactFlash: (colorHex = 0x98f5e1, intensity = 16) => {
          ctrlRef.current.flashColorHex = colorHex;
          ctrlRef.current.flashIntensity = Math.max(
            ctrlRef.current.flashIntensity,
            intensity
          );
        },
        setAct2State: (
          focusedIndex: number,
          ignitedFlags: [boolean, boolean, boolean, boolean],
          chargeProgress: number
        ) => {
          ctrlRef.current.act2FocusedIndex = focusedIndex;
          ctrlRef.current.act2Ignited = [...ignitedFlags] as [
            boolean,
            boolean,
            boolean,
            boolean,
          ];
          ctrlRef.current.act2Charge = Math.max(0, Math.min(1, chargeProgress));
        },
        triggerArtifactDetonation: (index: number, colorHex = 0xe6c999) => {
          ctrlRef.current.detonationIndex = index;
          ctrlRef.current.detonationTimer = 1.0;
          ctrlRef.current.detonationColorHex = colorHex;
          ctrlRef.current.shakeIntensity = Math.max(
            ctrlRef.current.shakeIntensity,
            1.45
          );
          ctrlRef.current.flashColorHex = colorHex;
          ctrlRef.current.flashIntensity = 42;
        },
        triggerPlotTwistCrimson: () => {
          ctrlRef.current.twistTimer = 1.65;
          ctrlRef.current.shakeIntensity = 1.5;
          ctrlRef.current.flashColorHex = 0xff2f5b;
          ctrlRef.current.flashIntensity = 36;
        },
        setAct3BossState: (
          hpPercent: number,
          phase: 1 | 2 | 3,
          qteCharge: number,
          barrierActive: boolean,
          slowMoFactor: number
        ) => {
          ctrlRef.current.bossHp = Math.max(0, Math.min(100, hpPercent));
          ctrlRef.current.bossPhase = phase;
          ctrlRef.current.bossQteCharge = Math.max(0, Math.min(1, qteCharge));
          ctrlRef.current.bossBarrierActive = barrierActive;
          ctrlRef.current.bossSlowMo = slowMoFactor;
        },
        triggerBossHit3D: (isBackstab = false) => {
          ctrlRef.current.bossRecoilZ = isBackstab ? -2.2 : -1.35;
          ctrlRef.current.bossHitFlash = 1.0;
          ctrlRef.current.shakeIntensity = Math.max(
            ctrlRef.current.shakeIntensity,
            isBackstab ? 1.35 : 0.85
          );
          ctrlRef.current.flashColorHex = isBackstab ? 0xffe49e : 0xa5e8ff;
          ctrlRef.current.flashIntensity = isBackstab ? 36 : 24;
        },
        triggerQteLightning3D: (charge: number) => {
          ctrlRef.current.bossQteCharge = Math.max(0, Math.min(1, charge));
          ctrlRef.current.bossHitFlash = 1.0;
          ctrlRef.current.shakeIntensity = Math.max(
            ctrlRef.current.shakeIntensity,
            0.85 + charge * 1.15
          );
          ctrlRef.current.flashColorHex = charge > 0.65 ? 0xfff0b5 : 0xa5e8ff;
          ctrlRef.current.flashIntensity = 26 + charge * 26;
        },
        triggerBossSupernova: () => {
          ctrlRef.current.bossSupernovaActive = true;
          ctrlRef.current.bossSupernovaTime = 0;
          ctrlRef.current.bossHp = 0;
          ctrlRef.current.bossBarrierActive = false;
          ctrlRef.current.shakeIntensity = 2.4;
          ctrlRef.current.flashColorHex = 0xfff5d4;
          ctrlRef.current.flashIntensity = 65;
        },
      }),
      []
    );

    useEffect(() => {
      const container = mountRef.current;
      if (!container) return;

      const isSoftwareGl = detectSoftwareWebGL();
      const isTouchDevice = detectTouchDevice();
      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || window.innerHeight;
      let viewportAspect = width / Math.max(1, height);

      const initAtmo = ACT_ATMOSPHERES[ctrlRef.current.act];

      // 1. Scene & Exponential Volumetric Fog
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(initAtmo.fogHex);
      const fog = new THREE.FogExp2(initAtmo.fogHex, initAtmo.fogDensity);
      scene.fog = fog;

      // 2. Camera (Responsive FOV & Aspect)
      const camera = new THREE.PerspectiveCamera(56, viewportAspect, 0.1, 240);
      camera.position.set(initAtmo.camX, initAtmo.camY, initAtmo.camZ);

      // 3. Renderer (Adaptive GPU Tiering: cap DPR 1.0 on touch, <= 1.5 on desktop, no AA on touch, no shadow maps)
      const renderer = new THREE.WebGLRenderer({
        antialias: !isTouchDevice && !isSoftwareGl,
        powerPreference: "high-performance",
      });
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      renderer.shadowMap.enabled = false;
      renderer.setPixelRatio(
        isTouchDevice || isSoftwareGl
          ? 1.0
          : Math.min(window.devicePixelRatio || 1, 1.5)
      );
      renderer.setSize(width, height);
      renderer.domElement.style.display = "block";
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      container.innerHTML = "";
      container.appendChild(renderer.domElement);

      // 4. Studio Environment Map for Metallic Obsidian & Crystal Reflections
      const pmrem = new THREE.PMREMGenerator(renderer);
      const roomEnv = new RoomEnvironment();
      const envRT = pmrem.fromScene(roomEnv, 0.04);
      scene.environment = envRT.texture;
      roomEnv.dispose();
      pmrem.dispose();

      // 5. Lean High-Performance Lighting Rig: 1 AmbientLight + 2 DirectionalLights (Zero PointLights!)
      const ambientLight = new THREE.AmbientLight(initAtmo.hemiSky, 0.95);
      scene.add(ambientLight);

      // Left dramatic pale frost-blue rim light so beveled obsidian edges catch crisp metallic sheen
      const frostRimDirLight = new THREE.DirectionalLight(0xa5e8ff, 2.85);
      frostRimDirLight.position.set(-28, 15, 18);
      scene.add(frostRimDirLight);

      // Behind-eclipse warm burnished-gold directional rim light
      const backMoonLight = new THREE.DirectionalLight(0xe6c999, 2.65);
      backMoonLight.position.set(6, 20, -52);
      scene.add(backMoonLight);

      // 6. Giant Luminous Eclipsed Moon / Golden Dawn Sun Halo in Deep Distance
      const moonGroup = new THREE.Group();
      moonGroup.position.set(0, 13.5, -92);

      const moonHaloTex = createMoonHaloTexture();
      const moonHaloMat = new THREE.SpriteMaterial({
        map: moonHaloTex,
        color: 0xffffff,
        transparent: true,
        opacity: 0.92,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        fog: false,
      });
      const moonHaloSprite = new THREE.Sprite(moonHaloMat);
      moonHaloSprite.scale.set(64, 64, 1);
      moonGroup.add(moonHaloSprite);

      // Secondary wide warm-gold atmospheric eclipse corona bloom sprite
      const eclipseBloomTex = createRadialGlowTexture(
        "rgba(255, 240, 204, 0.72)",
        "rgba(230, 201, 153, 0.22)",
        128
      );
      const eclipseBloomMat = new THREE.SpriteMaterial({
        map: eclipseBloomTex,
        color: 0xf7dca6,
        transparent: true,
        opacity: 0.62,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        fog: false,
      });
      const eclipseBloomSprite = new THREE.Sprite(eclipseBloomMat);
      eclipseBloomSprite.scale.set(92, 92, 1);
      moonGroup.add(eclipseBloomSprite);

      const coronaGeo = new THREE.TorusGeometry(11.4, 0.28, 16, 72);
      const coronaMat = new THREE.MeshBasicMaterial({
        color: 0xf9e8c5,
        transparent: true,
        opacity: 0.95,
        fog: false,
      });
      const coronaRing = new THREE.Mesh(coronaGeo, coronaMat);
      moonGroup.add(coronaRing);

      const eclipseDiscGeo = new THREE.CircleGeometry(11.12, 64);
      const eclipseDiscMat = new THREE.MeshBasicMaterial({
        color: 0x05070e,
        fog: false,
      });
      const eclipseDisc = new THREE.Mesh(eclipseDiscGeo, eclipseDiscMat);
      eclipseDisc.position.z = 0.2;
      moonGroup.add(eclipseDisc);

      scene.add(moonGroup);

      // 6B. Misty Obsidian Abyss Horizon Plane & Low Drifting Fog Layers
      const abyssFloorTex = createAbyssFloorTexture();
      abyssFloorTex.anisotropy = renderer.capabilities.getMaxAnisotropy();
      const abyssFloorGeo = new THREE.PlaneGeometry(180, 175, 1, 1);
      const abyssFloorMat = new THREE.MeshStandardMaterial({
        color: 0x080c17,
        map: abyssFloorTex,
        roughness: 0.28,
        metalness: 0.76,
        envMapIntensity: 0.9,
      });
      const abyssFloor = new THREE.Mesh(abyssFloorGeo, abyssFloorMat);
      abyssFloor.rotation.x = -Math.PI * 0.5;
      abyssFloor.position.set(0, -8.8, -42);
      scene.add(abyssFloor);

      const mistTex = createMistCloudTexture();
      const mistGeo = new THREE.PlaneGeometry(66, 26);
      const mistLayers: Array<{
        mesh: THREE.Mesh;
        mat: THREE.MeshBasicMaterial;
        baseX: number;
        driftSpeed: number;
        phase: number;
      }> = [];
      const mistConfigs = [
        { x: -16, y: -7.1, z: -4, opacity: 0.26, speed: 0.22, color: 0x89b9dc },
        { x: 18, y: -6.7, z: -22, opacity: 0.22, speed: -0.18, color: 0xb6a99a },
        { x: -8, y: -7.5, z: -42, opacity: 0.24, speed: 0.14, color: 0x7aa4cf },
        { x: 10, y: -7.2, z: -64, opacity: 0.2, speed: -0.12, color: 0x9eb8d6 },
      ];
      for (let i = 0; i < mistConfigs.length; i++) {
        const cfg = mistConfigs[i];
        const mMat = new THREE.MeshBasicMaterial({
          map: mistTex,
          color: cfg.color,
          transparent: true,
          opacity: cfg.opacity,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          side: THREE.DoubleSide,
        });
        const mMesh = new THREE.Mesh(mistGeo, mMat);
        mMesh.position.set(cfg.x, cfg.y, cfg.z);
        mMesh.rotation.x = -Math.PI * 0.36;
        scene.add(mMesh);
        mistLayers.push({
          mesh: mMesh,
          mat: mMat,
          baseX: cfg.x,
          driftSpeed: cfg.speed,
          phase: i * 1.7,
        });
      }

      // 7A. Layer 1: Adaptive Star-Dust Points (<= 350 single buffer on touch/tablet, 2,200 on desktop)
      const PARTICLE_COUNT = isTouchDevice ? 320 : 2200;
      const particlePositions = new Float32Array(PARTICLE_COUNT * 3);
      const particleColors = new Float32Array(PARTICLE_COUNT * 3);
      const particleSpeeds = new Float32Array(PARTICLE_COUNT);

      const palette = [
        new THREE.Color(0xa5e8ff),
        new THREE.Color(0xe6c999),
        new THREE.Color(0xc8b6ff),
        new THREE.Color(0x98f5e1),
        new THREE.Color(0xf2f4fb),
      ];

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3;
        const angle = Math.random() * Math.PI * 2;
        const radius = 5.5 + Math.pow(Math.random(), 0.72) * 48;
        particlePositions[i3] = Math.cos(angle) * radius;
        particlePositions[i3 + 1] = Math.sin(angle) * radius * 0.62 + 2.5;
        particlePositions[i3 + 2] = -115 + Math.random() * 145;

        const c = palette[i % palette.length];
        const dim = 0.55 + Math.random() * 0.45;
        particleColors[i3] = c.r * dim;
        particleColors[i3 + 1] = c.g * dim;
        particleColors[i3 + 2] = c.b * dim;

        particleSpeeds[i] = 2.1 + Math.random() * 5.2;
      }

      const particleGeo = new THREE.BufferGeometry();
      particleGeo.setAttribute(
        "position",
        new THREE.BufferAttribute(particlePositions, 3)
      );
      particleGeo.setAttribute(
        "color",
        new THREE.BufferAttribute(particleColors, 3)
      );

      const particleTex = createRadialGlowTexture(
        "rgba(255,255,255,1)",
        "rgba(180,225,255,0.45)",
        64
      );
      const particleMat = new THREE.PointsMaterial({
        size: isTouchDevice ? 0.68 : 0.38,
        map: particleTex,
        vertexColors: true,
        transparent: true,
        opacity: 0.86,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true,
      });

      const particleField = new THREE.Points(particleGeo, particleMat);
      particleField.frustumCulled = false;
      scene.add(particleField);

      // 7B. Layer 2: 120 Foreground Frost & Gold Embers (Desktop only — touch uses single <=350 Points buffer)
      const EMBER_COUNT = isTouchDevice ? 0 : 120;
      const emberPositions = new Float32Array(Math.max(1, EMBER_COUNT) * 3);
      const emberColors = new Float32Array(Math.max(1, EMBER_COUNT) * 3);
      const emberRiseSpeeds = new Float32Array(Math.max(1, EMBER_COUNT));
      const emberDriftPhases = new Float32Array(Math.max(1, EMBER_COUNT));

      let emberGeo: THREE.BufferGeometry | null = null;
      let emberTex: THREE.CanvasTexture | null = null;
      let emberMat: THREE.PointsMaterial | null = null;

      if (EMBER_COUNT > 0) {
        const emberFrost = new THREE.Color(0xa5e8ff);
        const emberGold = new THREE.Color(0xf2d194);
        const emberWarmWhite = new THREE.Color(0xfff5dc);

        for (let i = 0; i < EMBER_COUNT; i++) {
          const i3 = i * 3;
          emberPositions[i3] = (Math.random() - 0.5) * 38;
          emberPositions[i3 + 1] = -9.5 + Math.random() * 23;
          emberPositions[i3 + 2] = -24 + Math.random() * 48;

          const pick = i % 5 === 0 ? emberWarmWhite : i % 2 === 0 ? emberFrost : emberGold;
          const glow = 0.72 + Math.random() * 0.28;
          emberColors[i3] = pick.r * glow;
          emberColors[i3 + 1] = pick.g * glow;
          emberColors[i3 + 2] = pick.b * glow;

          emberRiseSpeeds[i] = 0.45 + Math.random() * 0.95;
          emberDriftPhases[i] = Math.random() * Math.PI * 2;
        }

        emberGeo = new THREE.BufferGeometry();
        emberGeo.setAttribute(
          "position",
          new THREE.BufferAttribute(emberPositions, 3)
        );
        emberGeo.setAttribute(
          "color",
          new THREE.BufferAttribute(emberColors, 3)
        );

        emberTex = createRadialGlowTexture(
          "rgba(255, 255, 255, 0.95)",
          "rgba(230, 215, 185, 0.34)",
          96
        );
        emberMat = new THREE.PointsMaterial({
          size: 1.55,
          map: emberTex,
          vertexColors: true,
          transparent: true,
          opacity: 0.78,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          sizeAttenuation: true,
        });

        const foregroundEmbers = new THREE.Points(emberGeo, emberMat);
        foregroundEmbers.frustumCulled = false;
        scene.add(foregroundEmbers);
      }

      // 8. 18 Symmetric Cathedral-Corridor Monoliths via InstancedMesh (5 Draw Calls instead of 90!)
      const monolithStoneMat = new THREE.MeshStandardMaterial({
        color: 0x0b0f1a,
        roughness: 0.25,
        metalness: 0.75,
        envMapIntensity: 1.45,
        flatShading: true,
      });
      const monolithTrimMat = new THREE.MeshStandardMaterial({
        color: 0x141b2e,
        roughness: 0.38,
        metalness: 0.62,
        envMapIntensity: 1.2,
        flatShading: true,
      });
      const monolithCollarMat = new THREE.MeshStandardMaterial({
        color: 0x4a3920,
        emissive: new THREE.Color(0xe6c999),
        emissiveIntensity: 1.15,
        roughness: 0.2,
        metalness: 0.92,
      });
      const runeEdgeMat = new THREE.LineBasicMaterial({
        color: 0xbfe9ff,
        transparent: true,
        opacity: 0.28,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const crownCrystalMat = new THREE.MeshStandardMaterial({
        color: 0xd8f3ff,
        emissive: new THREE.Color(0x7ce8ff),
        emissiveIntensity: 1.8,
        roughness: 0.14,
        metalness: 0.35,
        flatShading: true,
      });

      const crystalHaloTex = createCrystalHaloTexture();
      const crystalHaloMat = new THREE.SpriteMaterial({
        map: crystalHaloTex,
        color: 0xbef2ff,
        transparent: true,
        opacity: 0.82,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const spireGeo = new THREE.CylinderGeometry(0.46, 1.38, 8.6, 6, 1);
      const spireEdgesGeo = new THREE.EdgesGeometry(spireGeo, 18);
      const plinthGeo = new THREE.CylinderGeometry(1.52, 1.86, 1.4, 6, 1);
      const collarGeo = new THREE.TorusGeometry(1.52, 0.068, isTouchDevice ? 8 : 12, isTouchDevice ? 28 : 48);
      const collarSecondaryGeo = new THREE.TorusGeometry(1.92, 0.036, isTouchDevice ? 6 : 10, isTouchDevice ? 24 : 48);
      const crownGeo = new THREE.OctahedronGeometry(0.64, 0);

      const MONOLITH_PAIRS = 9;
      const MONOLITH_TOTAL = MONOLITH_PAIRS * 2;

      const spireInstanced = new THREE.InstancedMesh(spireGeo, monolithStoneMat, MONOLITH_TOTAL);
      const plinthInstanced = new THREE.InstancedMesh(plinthGeo, monolithTrimMat, MONOLITH_TOTAL);
      const ringPrimaryInstanced = new THREE.InstancedMesh(collarGeo, monolithCollarMat, MONOLITH_TOTAL);
      const ringSecondaryInstanced = new THREE.InstancedMesh(collarSecondaryGeo, monolithCollarMat, MONOLITH_TOTAL);
      const crownInstanced = new THREE.InstancedMesh(crownGeo, crownCrystalMat, MONOLITH_TOTAL);

      [
        spireInstanced,
        plinthInstanced,
        ringPrimaryInstanced,
        ringSecondaryInstanced,
        crownInstanced,
      ].forEach((im) => {
        im.frustumCulled = false;
        scene.add(im);
      });

      interface MonolithState {
        x: number;
        baseY: number;
        z: number;
        scaleX: number;
        scaleY: number;
        rotY: number;
        rotZ: number;
        side: number;
        rotSpeedY: number;
        ringTiltSpeed: number;
        ringPrimaryRotZ: number;
        ringSecondaryRotZ: number;
        crownRotY: number;
        bobPhase: number;
        zSpeed: number;
        edgeLines: THREE.LineSegments | null;
        haloSprite: THREE.Sprite;
      }

      const monoliths: MonolithState[] = [];

      for (let pairIdx = 0; pairIdx < MONOLITH_PAIRS; pairIdx++) {
        const depthNorm = pairIdx / (MONOLITH_PAIRS - 1);
        const laneZ = -84 + pairIdx * 12;
        const corridorHalfWidth = 7.4 + (1 - depthNorm) * 6.2 + (pairIdx % 2) * 1.4;
        const baseScale = 0.88 + (pairIdx % 3) * 0.14;
        const laneY = -5.4 + (pairIdx % 3) * 0.45;

        for (let s = 0; s < 2; s++) {
          const side = s === 0 ? -1 : 1;
          const idx = pairIdx * 2 + s;
          const xPos = side * (corridorHalfWidth + (s === 1 ? 0.25 : 0));
          const zJitter = s === 1 ? 2.2 : 0;

          // Subtle luminous bevel lines on desktop (instanced obsidian spires + gold rings + halos shine cleanly on touch too)
          let edgeLines: THREE.LineSegments | null = null;
          if (!isTouchDevice) {
            edgeLines = new THREE.LineSegments(spireEdgesGeo, runeEdgeMat);
            scene.add(edgeLines);
          }

          const haloSprite = new THREE.Sprite(crystalHaloMat);
          haloSprite.scale.set(4.6 * baseScale, 4.6 * baseScale, 1);
          scene.add(haloSprite);

          monoliths.push({
            x: xPos,
            baseY: laneY,
            z: laneZ + zJitter,
            scaleX: baseScale,
            scaleY: baseScale * 1.04,
            rotY: idx * 0.72,
            rotZ: side * -0.025,
            side,
            rotSpeedY: side * (0.06 + (pairIdx % 3) * 0.025),
            ringTiltSpeed: (0.38 + (pairIdx % 4) * 0.12) * side,
            ringPrimaryRotZ: 0.14 * side,
            ringSecondaryRotZ: -0.18 * side,
            crownRotY: idx * 0.5,
            bobPhase: idx * 0.85,
            zSpeed: 1.55,
            edgeLines,
            haloSprite,
          });
        }
      }

      // 9. ACT II — 4 MASSIVE ROTATING 3D RUNIC POLYHEDRA / ARTIFACTS
      const artifactRoot = new THREE.Group();
      artifactRoot.visible = false;
      scene.add(artifactRoot);

      const artifactCoreGeos = [
        new THREE.IcosahedronGeometry(2.15, 0),
        new THREE.OctahedronGeometry(2.3, 0),
        new THREE.DodecahedronGeometry(2.15, 0),
        new THREE.IcosahedronGeometry(2.05, 1),
      ];
      const artifactRingOuterGeo = new THREE.TorusGeometry(3.25, 0.085, 12, 48);
      const artifactRingInnerGeo = new THREE.TorusGeometry(2.72, 0.055, 10, 42);
      const artifactShardGeo = new THREE.OctahedronGeometry(0.36, 0);
      const artifactHitProxyGeo = new THREE.SphereGeometry(3.4, 12, 12);
      const artifactHitProxyMat = new THREE.MeshBasicMaterial({ visible: false });

      const artifactHaloTex = createRadialGlowTexture(
        "rgba(255,255,255,0.95)",
        "rgba(230,201,153,0.42)",
        128
      );

      interface ArtifactActor {
        index: number;
        accentColor: THREE.Color;
        group: THREE.Group;
        coreSpinGroup: THREE.Group;
        coreMat: THREE.MeshPhysicalMaterial;
        edgeMat: THREE.LineBasicMaterial;
        ringOuter: THREE.Mesh;
        ringOuterMat: THREE.MeshStandardMaterial;
        ringInner: THREE.Mesh;
        ringInnerMat: THREE.MeshStandardMaterial;
        haloSprite: THREE.Sprite;
        haloMat: THREE.SpriteMaterial;
        hitProxy: THREE.Mesh;
        disposables: Array<{ dispose: () => void }>;
      }

      const artifacts: ArtifactActor[] = [];
      const artifactHitProxies: THREE.Object3D[] = [];

      for (let i = 0; i < 4; i++) {
        const accentHex = ARTIFACT_COLORS[i];
        const accentColor = new THREE.Color(accentHex);

        const group = new THREE.Group();
        const coreSpinGroup = new THREE.Group();
        group.add(coreSpinGroup);

        const coreGeo = artifactCoreGeos[i];
        const coreMat = new THREE.MeshPhysicalMaterial({
          color: 0x0f1424,
          emissive: accentColor.clone(),
          emissiveIntensity: 0.14,
          roughness: 0.56,
          metalness: 0.42,
          clearcoat: 0.9,
          clearcoatRoughness: 0.14,
          flatShading: true,
        });
        coreSpinGroup.add(new THREE.Mesh(coreGeo, coreMat));

        const edgesGeo = new THREE.EdgesGeometry(coreGeo, 12);
        const edgeMat = new THREE.LineBasicMaterial({
          color: accentHex,
          transparent: true,
          opacity: 0.52,
        });
        const edgeLines = new THREE.LineSegments(edgesGeo, edgeMat);
        edgeLines.scale.setScalar(1.03);
        coreSpinGroup.add(edgeLines);

        const ringOuterMat = new THREE.MeshStandardMaterial({
          color: 0x2a2d3d,
          emissive: accentColor.clone(),
          emissiveIntensity: 0.12,
          roughness: 0.22,
          metalness: 0.92,
        });
        const ringOuter = new THREE.Mesh(artifactRingOuterGeo, ringOuterMat);
        ringOuter.rotation.x = Math.PI * 0.36;
        group.add(ringOuter);

        const ringInnerMat = new THREE.MeshStandardMaterial({
          color: 0x1d2336,
          emissive: accentColor.clone(),
          emissiveIntensity: 0.28,
          roughness: 0.26,
          metalness: 0.85,
        });
        const ringInner = new THREE.Mesh(artifactRingInnerGeo, ringInnerMat);
        ringInner.rotation.y = Math.PI * 0.25;
        group.add(ringInner);

        for (let s = 0; s < 4; s++) {
          const shard = new THREE.Mesh(artifactShardGeo, ringInnerMat);
          const ang = (s / 4) * Math.PI * 2;
          shard.position.set(Math.cos(ang) * 3.25, Math.sin(ang) * 3.25, 0);
          ringOuter.add(shard);
        }

        const haloMat = new THREE.SpriteMaterial({
          map: artifactHaloTex,
          color: accentHex,
          transparent: true,
          opacity: 0.2,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        const haloSprite = new THREE.Sprite(haloMat);
        haloSprite.scale.set(9.5, 9.5, 1);
        group.add(haloSprite);

        const hitProxy = new THREE.Mesh(artifactHitProxyGeo, artifactHitProxyMat);
        hitProxy.userData = { artifactIndex: i };
        group.add(hitProxy);
        artifactHitProxies.push(hitProxy);

        artifactRoot.add(group);

        artifacts.push({
          index: i,
          accentColor,
          group,
          coreSpinGroup,
          coreMat,
          edgeMat,
          ringOuter,
          ringOuterMat,
          ringInner,
          ringInnerMat,
          haloSprite,
          haloMat,
          hitProxy,
          disposables: [edgesGeo, coreMat, edgeMat, ringOuterMat, ringInnerMat, haloMat],
        });
      }

      // =======================================================================
      // 10. ACT III — 3D BOSS CONSTRUCT: "THE TITAN OF ENTROPY"
      // Massive fractured obsidian icosahedron core + 3 giant counter-rotating
      // crimson/gold rune rings + 8 orbiting stone armor blades that shatter off!
      // =======================================================================
      const bossRoot = new THREE.Group();
      bossRoot.visible = false;
      bossRoot.position.set(0, 2.3, 1.5);
      scene.add(bossRoot);

      const bossCoreGeo = new THREE.IcosahedronGeometry(2.55, 1);
      const bossCoreMat = new THREE.MeshPhysicalMaterial({
        color: 0x120a14,
        emissive: new THREE.Color(0xff3864),
        emissiveIntensity: 0.55,
        roughness: 0.42,
        metalness: 0.65,
        clearcoat: 0.75,
        flatShading: true,
      });
      const bossCoreMesh = new THREE.Mesh(bossCoreGeo, bossCoreMat);
      bossRoot.add(bossCoreMesh);

      const bossCoreEdgesGeo = new THREE.EdgesGeometry(bossCoreGeo, 10);
      const bossCoreEdgesMat = new THREE.LineBasicMaterial({
        color: 0xff6b8b,
        transparent: true,
        opacity: 0.88,
      });
      const bossCoreEdges = new THREE.LineSegments(bossCoreEdgesGeo, bossCoreEdgesMat);
      bossCoreEdges.scale.setScalar(1.03);
      bossCoreMesh.add(bossCoreEdges);

      // Molten Inner Heart Crystal visible between facets
      const bossHeartGeo = new THREE.OctahedronGeometry(1.55, 0);
      const bossHeartMat = new THREE.MeshBasicMaterial({
        color: 0xff9f5a,
        transparent: true,
        opacity: 0.9,
      });
      const bossHeartMesh = new THREE.Mesh(bossHeartGeo, bossHeartMat);
      bossRoot.add(bossHeartMesh);

      // 3 Giant Counter-Rotating Glowing Crimson/Gold 3D Rune Rings
      const bossRingGeos = [
        new THREE.TorusGeometry(3.85, 0.13, 12, 56),
        new THREE.TorusGeometry(4.65, 0.11, 12, 64),
        new THREE.TorusGeometry(5.35, 0.085, 12, 64),
      ];
      const bossRingMats = [
        new THREE.MeshStandardMaterial({
          color: 0x2a141c,
          emissive: new THREE.Color(0xff3864),
          emissiveIntensity: 1.05,
          roughness: 0.22,
          metalness: 0.88,
        }),
        new THREE.MeshStandardMaterial({
          color: 0x2c2214,
          emissive: new THREE.Color(0xe6c999),
          emissiveIntensity: 0.9,
          roughness: 0.2,
          metalness: 0.92,
        }),
        new THREE.MeshStandardMaterial({
          color: 0x211124,
          emissive: new THREE.Color(0xff6b4a),
          emissiveIntensity: 0.95,
          roughness: 0.28,
          metalness: 0.82,
        }),
      ];
      const bossRings = bossRingGeos.map((geo, idx) => {
        const mesh = new THREE.Mesh(geo, bossRingMats[idx]);
        mesh.rotation.set(idx * 0.65, idx * 0.85, idx * 0.35);
        bossRoot.add(mesh);
        return mesh;
      });

      // 8 Orbiting Stone Armor Blades that physically shatter off as HP drops!
      const bladeGeo = new THREE.ConeGeometry(0.55, 2.35, 5);
      const bladeEdgesGeo = new THREE.EdgesGeometry(bladeGeo, 14);
      const bladeMat = new THREE.MeshStandardMaterial({
        color: 0x16192a,
        emissive: new THREE.Color(0xff4c75),
        emissiveIntensity: 0.32,
        roughness: 0.52,
        metalness: 0.58,
        flatShading: true,
      });
      const bladeEdgeMat = new THREE.LineBasicMaterial({
        color: 0xe6c999,
        transparent: true,
        opacity: 0.72,
      });

      interface BossArmorBlade {
        mesh: THREE.Group;
        orbitIndex: number;
        shatterHpThreshold: number;
        shattered: boolean;
        vel: THREE.Vector3;
        spinVel: THREE.Vector3;
      }

      const bossBlades: BossArmorBlade[] = [];
      const BLADE_THRESHOLDS = [88, 76, 65, 53, 42, 31, 20, 11];
      for (let i = 0; i < 8; i++) {
        const g = new THREE.Group();
        const m = new THREE.Mesh(bladeGeo, bladeMat);
        g.add(m);
        const e = new THREE.LineSegments(bladeEdgesGeo, bladeEdgeMat);
        e.scale.setScalar(1.02);
        g.add(e);
        bossRoot.add(g);

        const ang = (i / 8) * Math.PI * 2;
        bossBlades.push({
          mesh: g,
          orbitIndex: i,
          shatterHpThreshold: BLADE_THRESHOLDS[i],
          shattered: false,
          vel: new THREE.Vector3(Math.cos(ang) * 9, (Math.random() - 0.3) * 6, 6 + Math.random() * 6),
          spinVel: new THREE.Vector3(
            (Math.random() - 0.5) * 9,
            (Math.random() - 0.5) * 9,
            (Math.random() - 0.5) * 9
          ),
        });
      }

      // Phase 3 Front Barrier Shield Mesh
      const barrierGeo = new THREE.CircleGeometry(4.1, 6);
      const barrierMat = new THREE.MeshBasicMaterial({
        color: 0xff6b8b,
        transparent: true,
        opacity: 0.24,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const barrierMesh = new THREE.Mesh(barrierGeo, barrierMat);
      barrierMesh.position.set(0, 0, 4.4);
      barrierMesh.visible = false;
      const barrierWireGeo = new THREE.EdgesGeometry(barrierGeo);
      const barrierWireMat = new THREE.LineBasicMaterial({
        color: 0xffe08a,
        transparent: true,
        opacity: 0.9,
      });
      barrierMesh.add(new THREE.LineSegments(barrierWireGeo, barrierWireMat));
      bossRoot.add(barrierMesh);

      // Boss Radiant Backlight Halo
      const bossHaloMat = new THREE.SpriteMaterial({
        map: artifactHaloTex,
        color: 0xff4c75,
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const bossHaloSprite = new THREE.Sprite(bossHaloMat);
      bossHaloSprite.scale.set(16, 16, 1);
      bossRoot.add(bossHaloSprite);

      // 16 Supernova Shatter Shards (dormant until Boss Supernova Finisher!)
      const supernovaShardGeo = new THREE.TetrahedronGeometry(0.75, 0);
      const supernovaShardMat = new THREE.MeshStandardMaterial({
        color: 0x1a1426,
        emissive: new THREE.Color(0xffe6a6),
        emissiveIntensity: 1.6,
        roughness: 0.25,
        metalness: 0.75,
        flatShading: true,
      });
      interface SupernovaShard {
        mesh: THREE.Mesh;
        dir: THREE.Vector3;
        speed: number;
        spin: THREE.Vector3;
      }
      const supernovaShards: SupernovaShard[] = [];
      for (let i = 0; i < 16; i++) {
        const mesh = new THREE.Mesh(supernovaShardGeo, supernovaShardMat);
        mesh.visible = false;
        bossRoot.add(mesh);
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        supernovaShards.push({
          mesh,
          dir: new THREE.Vector3(
            Math.sin(phi) * Math.cos(theta),
            Math.sin(phi) * Math.sin(theta),
            Math.cos(phi) * 0.75 + 0.35
          ).normalize(),
          speed: 7 + Math.random() * 14,
          spin: new THREE.Vector3(
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10
          ),
        });
      }

      // 3D Expanding Detonation / Supernova Shockwave Ring Mesh
      const shockwaveGeo = new THREE.TorusGeometry(2.4, 0.16, 14, 64);
      const shockwaveMat = new THREE.MeshBasicMaterial({
        color: 0xe6c999,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const shockwaveMesh = new THREE.Mesh(shockwaveGeo, shockwaveMat);
      shockwaveMesh.visible = false;
      scene.add(shockwaveMesh);

      if (!isSoftwareGl) {
        renderer.compile(scene, camera);
      }

      // Pointer & Gyroscope Parallax + Act II Direct 3D Artifact Click Raycasting
      const onPointerMove = (e: PointerEvent) => {
        ctrlRef.current.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
        ctrlRef.current.pointerY = (e.clientY / window.innerHeight) * 2 - 1;
      };

      const onDeviceOrientation = (e: DeviceOrientationEvent) => {
        if (typeof e.gamma === "number" && typeof e.beta === "number") {
          ctrlRef.current.pointerX = THREE.MathUtils.clamp(e.gamma / 28, -1, 1);
          ctrlRef.current.pointerY = THREE.MathUtils.clamp((e.beta - 42) / 28, -1, 1);
        }
      };

      const onPointerDown = (e: PointerEvent) => {
        if (ctrlRef.current.act !== 2 || !onSelectArtifactRef.current) return;
        const targetEl = e.target as HTMLElement | null;
        if (targetEl && targetEl.closest("button, a, input, [data-story-ui='true']")) {
          return;
        }
        _pointerNdc.x = (e.clientX / window.innerWidth) * 2 - 1;
        _pointerNdc.y = -(e.clientY / window.innerHeight) * 2 + 1;
        _raycaster.setFromCamera(_pointerNdc, camera);
        const hits = _raycaster.intersectObjects(artifactHitProxies, false);
        if (hits.length > 0) {
          const hitIdx = hits[0].object.userData?.artifactIndex;
          if (typeof hitIdx === "number") {
            onSelectArtifactRef.current(hitIdx);
          }
        }
      };

      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("deviceorientation", onDeviceOrientation, { passive: true });
      window.addEventListener("pointerdown", onPointerDown);

      const onResize = () => {
        if (!container) return;
        const w = container.clientWidth || window.innerWidth;
        const h = container.clientHeight || window.innerHeight;
        viewportAspect = w / Math.max(1, h);
        camera.aspect = viewportAspect;
        camera.updateProjectionMatrix();
        renderer.setPixelRatio(
          isTouchDevice || isSoftwareGl
            ? 1.0
            : Math.min(window.devicePixelRatio || 1, 1.5)
        );
        renderer.setSize(w, h);
      };

      const resizeObserver =
        typeof ResizeObserver !== "undefined"
          ? new ResizeObserver(() => onResize())
          : null;
      resizeObserver?.observe(container);
      window.addEventListener("resize", onResize);
      window.addEventListener("orientationchange", onResize);

      let disposed = false;
      let frameId = 0;
      let paused = document.hidden;
      const clock = new THREE.Clock();
      let elapsed = 0;

      const afterDraw = (cb: () => void) => {
        if (disposed || paused) return;
        const gl = renderer.getContext() as WebGL2RenderingContext;
        if (!gl || typeof gl.fenceSync !== "function") {
          frameId = window.setTimeout(cb, 80);
          return;
        }
        const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        gl.flush();
        const poll = () => {
          if (disposed || paused) {
            if (sync) gl.deleteSync(sync);
            return;
          }
          const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
          if (state === gl.UNSIGNALED) {
            frameId = window.setTimeout(poll, 5);
          } else {
            if (sync) gl.deleteSync(sync);
            frameId = window.setTimeout(cb, 80);
          }
        };
        frameId = window.setTimeout(poll, 5);
      };

      const resetBossConstruct = () => {
        bossCoreMesh.visible = true;
        bossHeartMesh.visible = true;
        bossCoreMesh.scale.setScalar(1);
        bossRings.forEach((r, idx) => {
          r.visible = true;
          r.position.set(0, 0, 0);
          r.scale.setScalar(1);
          r.rotation.set(idx * 0.65, idx * 0.85, idx * 0.35);
        });
        bossBlades.forEach((b) => {
          b.shattered = false;
          b.mesh.visible = true;
          b.mesh.scale.setScalar(1);
          const ang = (b.orbitIndex / 8) * Math.PI * 2;
          b.vel.set(Math.cos(ang) * 9, (Math.random() - 0.3) * 6, 6 + Math.random() * 6);
        });
        supernovaShards.forEach((s) => {
          s.mesh.visible = false;
          s.mesh.position.set(0, 0, 0);
        });
      };

      const tick = () => {
        if (disposed || paused) return;

        // Strictly clamped delta time so physics & visuals remain identical at 30/60/120Hz
        const rawDt = Math.min(clock.getDelta(), 0.05) || 0.016;

        const ctrl = ctrlRef.current;
        const isAct2 = ctrl.act === 2;
        const isAct3 = ctrl.act === 3;
        const isAct4 = ctrl.act === 4;
        const dt = isAct3 ? rawDt * ctrl.bossSlowMo : rawDt;
        elapsed += dt;

        const target = ACT_ATMOSPHERES[ctrl.act];

        // Warp Tunnel Acceleration Curve
        let warpFactor = 0;
        if (ctrl.warpTimer > 0) {
          ctrl.warpTimer = Math.max(0, ctrl.warpTimer - rawDt);
          const norm = 1 - ctrl.warpTimer / Math.max(0.1, ctrl.warpDuration);
          warpFactor = Math.sin(norm * Math.PI);
        }

        // Act II -> Act III Plot Twist Crimson Flicker Override
        let twistCrimsonMix = 0;
        if (ctrl.twistTimer > 0) {
          ctrl.twistTimer = Math.max(0, ctrl.twistTimer - rawDt);
          const flicker = Math.sin(elapsed * 46) > -0.25 ? 1 : 0.25;
          twistCrimsonMix = Math.min(1, (1.65 - ctrl.twistTimer) * 0.9) * flicker;
        }

        // Smooth Exponential Color-Grading & Fog Damping per Act
        const colorRate = 1 - Math.exp(-3.1 * rawDt);
        _targetFog.setHex(twistCrimsonMix > 0.35 ? 0x19050c : target.fogHex);
        _targetKey.setHex(twistCrimsonMix > 0.35 ? 0xff2f5b : target.keyHex);
        _targetRim.setHex(twistCrimsonMix > 0.35 ? 0xff6b3d : target.rimHex);
        _targetRune.setHex(twistCrimsonMix > 0.35 ? 0xff4c75 : target.runeHex);
        _targetAmbient.setHex(twistCrimsonMix > 0.35 ? 0x5c1124 : target.hemiSky);

        if (warpFactor > 0.15) {
          _tmpColor.setHex(ctrl.warpColorHex);
          _targetKey.lerp(_tmpColor, warpFactor * 0.75);
          _targetRune.lerp(_tmpColor, warpFactor * 0.8);
        }

        (scene.background as THREE.Color).lerp(_targetFog, colorRate);
        fog.color.lerp(_targetFog, colorRate);
        fog.density = THREE.MathUtils.damp(
          fog.density,
          target.fogDensity * (1 - warpFactor * 0.35),
          3.2,
          rawDt
        );

        // Impact flash modulates existing Directional + Ambient lights (zero extra PointLights!)
        let flashBoost = 0;
        if (ctrl.flashIntensity > 0.05) {
          flashBoost = Math.min(2.8, ctrl.flashIntensity * 0.055);
          _tmpColor.setHex(ctrl.flashColorHex);
          _targetKey.lerp(_tmpColor, Math.min(0.65, flashBoost * 0.35));
          ctrl.flashIntensity = THREE.MathUtils.damp(ctrl.flashIntensity, 0, 8.5, rawDt);
        } else {
          ctrl.flashIntensity = 0;
        }

        frostRimDirLight.color.lerp(_targetKey, colorRate * 0.7);
        frostRimDirLight.intensity = 2.85 + flashBoost * 1.1;
        backMoonLight.color.lerp(_targetRim, colorRate * 0.6);
        backMoonLight.intensity = 2.65 + flashBoost * 0.6;
        ambientLight.color.lerp(_targetAmbient, colorRate);
        ambientLight.intensity = 0.95 + flashBoost * 0.45;

        runeEdgeMat.color.lerp(_targetRune, colorRate);
        if (ctrl.act === 0) {
          _tmpColor.setHex(0x7ce8ff);
          crownCrystalMat.emissive.lerp(_tmpColor, colorRate);
          crystalHaloMat.color.lerp(_tmpColor, colorRate);
        } else {
          crownCrystalMat.emissive.lerp(_targetRune, colorRate);
          crystalHaloMat.color.lerp(_targetRune, colorRate);
        }
        coronaMat.color.lerp(_targetKey, colorRate * 0.4);
        eclipseBloomMat.color.lerp(_targetRim, colorRate * 0.45);

        if (ctrl.cameraKickZ > 0.01) {
          ctrl.cameraKickZ = THREE.MathUtils.damp(ctrl.cameraKickZ, 0, 8.5, rawDt);
        }

        const charge = isAct2 ? ctrl.act2Charge : 0;
        const focusedIgnited = isAct2 && ctrl.act2Ignited[ctrl.act2FocusedIndex];
        const isQteZoom = isAct3 && ctrl.bossHp <= 10 && !ctrl.bossSupernovaActive;
        const qteZoomDist = isQteZoom ? 6.4 + ctrl.bossQteCharge * 2.8 : 0;

        // Universal Aspect-Ratio Camera Framing (9:16 portrait, 4:3/16:10 tablet, 16:9 laptop, 21:9 ultrawide)
        const narrowFactor =
          viewportAspect < 1.1
            ? Math.max(0, Math.min(1, (1.1 - viewportAspect) / 0.55))
            : 0;
        const ultraWideAdj = viewportAspect > 2.0 ? -4 : 0;
        const baseFov = 56 + narrowFactor * 12 + ultraWideAdj;
        const aspectPullBackZ = isAct2
          ? narrowFactor * 6.2
          : isAct3
          ? narrowFactor * 6.8
          : narrowFactor * 7.5;

        const desiredFov =
          baseFov +
          warpFactor * 22 -
          charge * 10 -
          (isQteZoom ? 10 + ctrl.bossQteCharge * 6 : 0);
        if (Math.abs(camera.fov - desiredFov) > 0.05) {
          camera.fov = THREE.MathUtils.damp(camera.fov, desiredFov, 7, rawDt);
          camera.updateProjectionMatrix();
        }

        const parallaxX = ctrl.pointerX * (isAct2 || isAct3 ? 0.7 : 2.15);
        const parallaxY = -ctrl.pointerY * (isAct2 || isAct3 ? 0.45 : 1.05);
        const targetCamX = target.camX + parallaxX;
        const targetCamY =
          target.camY +
          parallaxY +
          Math.sin(elapsed * 0.42) * 0.2 +
          (isQteZoom ? 0.25 : 0);
        const targetCamZ =
          target.camZ +
          aspectPullBackZ -
          warpFactor * 7.0 +
          ctrl.cameraKickZ -
          charge * 3.5 -
          qteZoomDist;

        camera.position.x = THREE.MathUtils.damp(camera.position.x, targetCamX, 3.4, rawDt);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, targetCamY, 3.4, rawDt);
        camera.position.z = THREE.MathUtils.damp(camera.position.z, targetCamZ, 4.2, rawDt);

        const totalShake =
          ctrl.shakeIntensity +
          charge * charge * 0.28 +
          (isQteZoom ? 0.08 + ctrl.bossQteCharge * 0.42 : 0);
        if (totalShake > 0.008) {
          camera.position.x += (Math.random() - 0.5) * totalShake;
          camera.position.y += (Math.random() - 0.5) * totalShake;
          ctrl.shakeIntensity = THREE.MathUtils.damp(ctrl.shakeIntensity, 0, 10.5, rawDt);
        }

        _lookTarget.set(
          parallaxX * 0.24,
          (isAct3 ? 1.05 : target.lookY) + parallaxY * 0.14,
          isAct2 || isAct3 ? 1.0 : -35
        );
        camera.lookAt(_lookTarget);

        // Animate Giant Eclipsed Moon + Corona Bloom -> Golden Dawn Sun in Act IV
        const moonTargetY = isAct4 ? 8.5 : 13.5;
        moonGroup.position.y = THREE.MathUtils.damp(moonGroup.position.y, moonTargetY, 2.2, rawDt);
        eclipseDisc.visible = !isAct4;
        moonHaloSprite.scale.setScalar(
          (isAct4 ? 82 : 64) + Math.sin(elapsed * 0.9) * 2.6 + warpFactor * 18
        );
        eclipseBloomSprite.scale.setScalar(
          (isAct4 ? 116 : 92) + Math.cos(elapsed * 0.65) * 4.2 + warpFactor * 24
        );
        coronaRing.rotation.z = elapsed * 0.06;

        // Subtle Drift on Low-Lying Abyssal Mist & Floor Scroll
        abyssFloorTex.offset.y -= dt * (0.045 + warpFactor * 0.72);
        for (let i = 0; i < mistLayers.length; i++) {
          const ml = mistLayers[i];
          ml.mesh.position.x = ml.baseX + Math.sin(elapsed * ml.driftSpeed + ml.phase) * 7.5;
        }

        // =====================================================================
        // ACT II — 4 MASSIVE ROTATING 3D RUNIC POLYHEDRA / ARTIFACTS
        // Landscape (aspect >= 1.2): Left 45% | Portrait (aspect < 1.2): Upper 38%
        // =====================================================================
        artifactRoot.visible = isAct2;
        if (isAct2) {
          const isLandscapeLayout = viewportAspect >= 1.2;
          for (let i = 0; i < artifacts.length; i++) {
            const art = artifacts[i];
            const isFocused = i === ctrl.act2FocusedIndex;
            const isIgnited = ctrl.act2Ignited[i];

            let rel = i - ctrl.act2FocusedIndex;
            if (rel > 2) rel -= 4;
            if (rel < -1) rel += 4;

            let tx = 0;
            let ty = 0.7;
            let tz = 3.2;
            let tScale = isLandscapeLayout ? 1.04 : 0.9;

            if (isFocused) {
              if (focusedIgnited) {
                tx = isLandscapeLayout ? -4.35 : 0;
                ty = isLandscapeLayout ? 0.55 : 3.55 + narrowFactor * 1.15;
                tz = isLandscapeLayout ? 3.8 : 2.5;
                tScale = isLandscapeLayout ? 1.02 : 0.8;
              } else {
                tx = 0;
                ty = isLandscapeLayout ? 0.95 : 1.55;
                tz = 4.2;
                tScale = (isLandscapeLayout ? 1.08 : 0.92) + charge * 0.22;
              }
            } else if (rel === 1) {
              tx = isLandscapeLayout ? 9.2 : 6.4;
              ty = 1.6;
              tz = -7.8;
              tScale = isLandscapeLayout ? 0.76 : 0.62;
            } else if (rel === -1) {
              tx = isLandscapeLayout ? -9.2 : -6.4;
              ty = 1.4;
              tz = -7.8;
              tScale = isLandscapeLayout ? 0.76 : 0.62;
            } else {
              tx = 0;
              ty = 3.4;
              tz = -16.5;
              tScale = 0.58;
            }

            art.group.position.x = THREE.MathUtils.damp(art.group.position.x, tx, 4.2, rawDt);
            art.group.position.y = THREE.MathUtils.damp(
              art.group.position.y,
              ty + Math.sin(elapsed * 1.3 + i * 1.4) * 0.28,
              4.2,
              rawDt
            );
            art.group.position.z = THREE.MathUtils.damp(art.group.position.z, tz, 4.2, rawDt);
            const curS = THREE.MathUtils.damp(art.group.scale.x, tScale, 5.0, rawDt);
            art.group.scale.setScalar(curS);

            const spinMult = isFocused ? 1 + charge * charge * 15 : 0.65;
            art.coreSpinGroup.rotation.y += rawDt * 0.48 * spinMult;
            art.coreSpinGroup.rotation.x += rawDt * 0.24 * spinMult;
            art.ringOuter.rotation.z += rawDt * 0.55 * spinMult;
            art.ringOuter.rotation.y += rawDt * 0.3 * spinMult;
            art.ringInner.rotation.x -= rawDt * 0.72 * spinMult;
            art.ringInner.rotation.z -= rawDt * 0.42 * spinMult;

            const targetEmissive = isIgnited
              ? 1.55 + Math.sin(elapsed * 2.6 + i) * 0.18
              : isFocused
              ? 0.2 + charge * 2.4
              : 0.08;
            art.coreMat.emissiveIntensity = THREE.MathUtils.damp(
              art.coreMat.emissiveIntensity,
              targetEmissive,
              6,
              rawDt
            );
            art.coreMat.roughness = THREE.MathUtils.damp(
              art.coreMat.roughness,
              isIgnited ? 0.1 : 0.58 - charge * 0.4,
              5,
              rawDt
            );
            art.coreMat.color.lerp(
              isIgnited ? art.accentColor : _dormantObsidian,
              1 - Math.exp(-4.5 * rawDt)
            );

            art.edgeMat.opacity = THREE.MathUtils.damp(
              art.edgeMat.opacity,
              isIgnited ? 0.98 : isFocused ? 0.6 + charge * 0.4 : 0.32,
              6,
              rawDt
            );
            art.ringOuterMat.emissiveIntensity = THREE.MathUtils.damp(
              art.ringOuterMat.emissiveIntensity,
              isIgnited ? 0.85 : isFocused ? 0.18 + charge * 1.4 : 0.08,
              6,
              rawDt
            );
            art.ringInnerMat.emissiveIntensity = THREE.MathUtils.damp(
              art.ringInnerMat.emissiveIntensity,
              isIgnited ? 1.15 : isFocused ? 0.3 + charge * 1.8 : 0.14,
              6,
              rawDt
            );
            art.haloMat.opacity = THREE.MathUtils.damp(
              art.haloMat.opacity,
              isIgnited ? 0.72 : isFocused ? 0.24 + charge * 0.65 : 0.1,
              5,
              rawDt
            );
            const haloSize = isIgnited ? 11.5 : isFocused ? 8.8 + charge * 4.5 : 6.2;
            art.haloSprite.scale.setScalar(haloSize);

            if (isFocused) {
              _vortexTarget.copy(art.group.position);
            }
          }
        }

        // =====================================================================
        // ACT III — 3D BOSS CONSTRUCT: "THE TITAN OF ENTROPY"
        // Shifted slightly lower in Y so the pinned top Boss Health Bar NEVER overlaps it
        // =====================================================================
        if (ctrl.bossResetRequested) {
          ctrl.bossResetRequested = false;
          resetBossConstruct();
        }
        bossRoot.visible = isAct3;
        if (isAct3) {
          ctrl.bossRecoilZ = THREE.MathUtils.damp(ctrl.bossRecoilZ, 0, 7.5, rawDt);
          ctrl.bossHitFlash = THREE.MathUtils.damp(ctrl.bossHitFlash, 0, 9.5, rawDt);

          bossRoot.position.y = 1.05 + Math.sin(elapsed * 1.6) * 0.28;
          bossRoot.position.z = 1.2 + ctrl.bossRecoilZ;
          const bossResponsiveScale = viewportAspect < 1.0 ? 0.84 : 1.0;
          bossRoot.scale.setScalar(bossResponsiveScale);

          if (ctrl.bossSupernovaActive) {
            // SLOW-MOTION SUPERNOVA EXPLOSION: blow all 3D boss shards outward!
            ctrl.bossSupernovaTime += rawDt;
            const st = ctrl.bossSupernovaTime;
            bossCoreMesh.visible = false;
            bossHeartMesh.visible = false;
            barrierMesh.visible = false;

            // Expand rings wildly outward & fade
            bossRings.forEach((r, idx) => {
              const s = 1 + st * (4.2 + idx * 1.4);
              r.scale.setScalar(s);
              r.rotation.x += rawDt * 2.5;
              r.rotation.y -= rawDt * 2.1;
              bossRingMats[idx].emissiveIntensity = Math.max(0, 2.5 - st * 1.4);
            });

            // Blast all 16 obsidian supernova shards outward in dramatic slow motion
            const slowStep = rawDt * 0.55;
            for (const sh of supernovaShards) {
              sh.mesh.visible = true;
              sh.mesh.position.addScaledVector(sh.dir, sh.speed * slowStep);
              sh.mesh.rotation.x += sh.spin.x * slowStep;
              sh.mesh.rotation.y += sh.spin.y * slowStep;
              sh.mesh.rotation.z += sh.spin.z * slowStep;
            }
            for (const b of bossBlades) {
              b.mesh.position.addScaledVector(b.vel, slowStep * 1.4);
              b.mesh.rotation.x += b.spinVel.x * slowStep;
              b.mesh.rotation.y += b.spinVel.y * slowStep;
            }

            bossHaloSprite.scale.setScalar(16 + st * 48);
            bossHaloMat.color.setHex(0xfff4d4);
            bossHaloMat.opacity = Math.max(0, 1 - st * 0.55);

            // Huge white-gold 3D shockwave ring
            shockwaveMesh.visible = true;
            shockwaveMesh.position.copy(bossRoot.position);
            shockwaveMesh.lookAt(camera.position);
            shockwaveMesh.scale.setScalar(1 + st * 14);
            shockwaveMat.color.setHex(0xfff4d4);
            shockwaveMat.opacity = Math.max(0, 1 - st * 0.65);
          } else {
            const phaseMult = 1 + (ctrl.bossPhase - 1) * 0.45 + ctrl.bossQteCharge * 4.5;
            bossCoreMesh.rotation.y += dt * 0.55 * phaseMult;
            bossCoreMesh.rotation.x += dt * 0.32 * phaseMult;
            bossHeartMesh.rotation.y -= dt * 1.4 * phaseMult;
            const pulseS = 1 + Math.sin(elapsed * 4.5) * 0.05 + ctrl.bossQteCharge * 0.22;
            bossCoreMesh.scale.setScalar(pulseS);

            // Core emissive surges bright white-gold on hits and QTE charge
            bossCoreMat.emissive.setHex(
              ctrl.bossHitFlash > 0.25 || ctrl.bossQteCharge > 0.3
                ? 0xffe49e
                : ctrl.bossPhase === 3
                ? 0xff2f5b
                : 0xff4c75
            );
            bossCoreMat.emissiveIntensity =
              0.55 + ctrl.bossHitFlash * 2.4 + ctrl.bossQteCharge * 3.2;
            bossCoreEdgesMat.color.setHex(
              ctrl.bossQteCharge > 0.2 || ctrl.bossHitFlash > 0.2 ? 0xfff0c2 : 0xff6b8b
            );

            // 3 Giant Counter-Rotating Crimson/Gold 3D Rune Rings
            bossRings[0].rotation.z += dt * 0.9 * phaseMult;
            bossRings[0].rotation.x += dt * 0.35 * phaseMult;
            bossRings[1].rotation.y -= dt * 0.78 * phaseMult;
            bossRings[1].rotation.z -= dt * 0.42 * phaseMult;
            bossRings[2].rotation.x -= dt * 0.65 * phaseMult;
            bossRings[2].rotation.y += dt * 0.55 * phaseMult;

            // 8 Orbiting Stone Armor Blades — shatter off as HP crosses each threshold!
            for (const b of bossBlades) {
              if (!b.shattered && ctrl.bossHp <= b.shatterHpThreshold) {
                b.shattered = true;
              }
              if (b.shattered) {
                b.mesh.position.addScaledVector(b.vel, rawDt * 1.15);
                b.mesh.rotation.x += b.spinVel.x * rawDt;
                b.mesh.rotation.y += b.spinVel.y * rawDt;
                const sc = Math.max(0.01, b.mesh.scale.x - rawDt * 0.55);
                b.mesh.scale.setScalar(sc);
                if (sc <= 0.02) b.mesh.visible = false;
              } else {
                const ang = elapsed * (0.75 + ctrl.bossPhase * 0.25) + (b.orbitIndex / 8) * Math.PI * 2;
                const rad = 4.4 + Math.sin(elapsed * 2 + b.orbitIndex) * 0.3;
                b.mesh.position.set(
                  Math.cos(ang) * rad,
                  Math.sin(ang) * rad * 0.72,
                  Math.sin(ang * 2) * 1.1
                );
                b.mesh.rotation.set(0, 0, ang - Math.PI * 0.5);
              }
            }

            // Phase 3 Front Barrier Shield
            barrierMesh.visible = ctrl.bossBarrierActive;
            if (ctrl.bossBarrierActive) {
              barrierMesh.rotation.z = elapsed * 0.85;
              barrierMat.opacity = 0.22 + Math.sin(elapsed * 6) * 0.08;
            }

            bossHaloMat.color.setHex(ctrl.bossQteCharge > 0.2 ? 0xffe08a : 0xff4c75);
            bossHaloMat.opacity = 0.5 + ctrl.bossQteCharge * 0.45 + ctrl.bossHitFlash * 0.3;
            bossHaloSprite.scale.setScalar(15 + ctrl.bossQteCharge * 10);
          }
        }

        // Act II Detonation Shockwave Ring Animation (when not in Boss Supernova)
        if (!ctrl.bossSupernovaActive) {
          if (ctrl.detonationTimer > 0) {
            ctrl.detonationTimer = Math.max(0, ctrl.detonationTimer - rawDt * 1.35);
            const prog = 1 - ctrl.detonationTimer;
            const originArt = artifacts[ctrl.detonationIndex];
            shockwaveMesh.visible = true;
            if (originArt) {
              shockwaveMesh.position.copy(originArt.group.position);
            }
            shockwaveMesh.lookAt(camera.position);
            shockwaveMesh.scale.setScalar(0.6 + prog * 9.5);
            shockwaveMat.color.setHex(ctrl.detonationColorHex);
            shockwaveMat.opacity = Math.max(0, (1 - prog) * 0.95);
          } else {
            shockwaveMesh.visible = false;
          }
        }

        // Layer 1: Adaptive Star-Dust (Warp Streaks / Act II Vortex / Act III Ash / Act IV Dawn)
        const posAttr = particleGeo.attributes.position as THREE.BufferAttribute;
        const posArray = posAttr.array as Float32Array;
        const warpMult = 1 + warpFactor * 18.5;
        particleMat.size =
          (isTouchDevice ? 0.66 : 0.36) +
          warpFactor * 0.46 +
          charge * 0.22 +
          (isAct4 ? 0.12 : 0);
        particleMat.opacity = 0.78 + Math.sin(elapsed * 2.2) * 0.08;

        for (let i = 0; i < PARTICLE_COUNT; i++) {
          const i3 = i * 3;
          if (isAct2 && charge > 0.02) {
            const dx = _vortexTarget.x - posArray[i3];
            const dy = _vortexTarget.y - posArray[i3 + 1];
            const dz = _vortexTarget.z - posArray[i3 + 2];
            const distSq = dx * dx + dy * dy + dz * dz + 0.5;
            const pull = (10 + charge * 36) * rawDt;
            const invDist = 1 / Math.sqrt(distSq);
            const swirl = (4.5 + charge * 14) * rawDt;
            posArray[i3] += dx * invDist * pull - dy * invDist * swirl;
            posArray[i3 + 1] += dy * invDist * pull + dx * invDist * swirl;
            posArray[i3 + 2] += dz * invDist * pull;

            if (distSq < 3.4) {
              const ang = Math.random() * Math.PI * 2;
              const rad = 24 + Math.random() * 24;
              posArray[i3] = _vortexTarget.x + Math.cos(ang) * rad;
              posArray[i3 + 1] = _vortexTarget.y + Math.sin(ang) * rad * 0.7;
              posArray[i3 + 2] = _vortexTarget.z - 28 + Math.random() * 44;
            }
          } else {
            const pSpeed = isAct4 ? particleSpeeds[i] * 0.32 : particleSpeeds[i];
            posArray[i3 + 2] += pSpeed * warpMult * dt;
            posArray[i3 + 1] += (isAct3 ? 1.8 : isAct4 ? 0.55 : -0.14) * dt;
            if (posArray[i3 + 2] > 34 || posArray[i3 + 1] > 34) {
              posArray[i3 + 2] = -115 - Math.random() * 18;
              const ang = Math.random() * Math.PI * 2;
              const rad = 5.5 + Math.pow(Math.random(), 0.72) * 48;
              posArray[i3] = Math.cos(ang) * rad;
              posArray[i3 + 1] = isAct3 ? -12 + Math.random() * 18 : Math.sin(ang) * rad * 0.62 + 2.5;
            }
          }
        }
        posAttr.needsUpdate = true;

        // Layer 2: 120 Foreground Frost & Gold Embers (Desktop only)
        if (emberGeo && emberMat) {
          const emberAttr = emberGeo.attributes.position as THREE.BufferAttribute;
          const emberArr = emberAttr.array as Float32Array;
          emberMat.size = 1.55 + warpFactor * 0.55;
          for (let i = 0; i < EMBER_COUNT; i++) {
            const i3 = i * 3;
            const phase = emberDriftPhases[i];
            emberArr[i3] += Math.sin(elapsed * 0.7 + phase) * 0.32 * dt;
            emberArr[i3 + 1] += emberRiseSpeeds[i] * (isAct3 ? 2.1 : 1.0) * dt;
            emberArr[i3 + 2] += (0.55 + warpFactor * 16) * dt;

            if (emberArr[i3 + 1] > 14.5 || emberArr[i3 + 2] > 26.5) {
              emberArr[i3] = (Math.random() - 0.5) * 38;
              emberArr[i3 + 1] = -9.5 - Math.random() * 2.5;
              emberArr[i3 + 2] = -24 + Math.random() * 44;
            }
          }
          emberAttr.needsUpdate = true;
        }

        // Animate 18 Symmetric Cathedral-Corridor Monoliths via InstancedMesh (Zero per-frame GC!)
        const monoWarp = 1 + warpFactor * 18;
        crystalHaloMat.opacity = 0.76 + Math.sin(elapsed * 2.1) * 0.1;

        for (let i = 0; i < monoliths.length; i++) {
          const m = monoliths[i];
          m.rotY += m.rotSpeedY * dt;
          const curY = m.baseY + Math.sin(elapsed * 0.75 + m.bobPhase) * 0.38;
          m.z += m.zSpeed * monoWarp * dt;
          if (m.z > 20) {
            m.z -= 108;
          }

          m.ringPrimaryRotZ += m.ringTiltSpeed * dt;
          m.ringSecondaryRotZ -= m.ringTiltSpeed * 0.75 * dt;
          m.crownRotY -= dt * 1.15;

          // Parent monolith transform
          _parentDummy.position.set(m.x, curY, m.z);
          _parentDummy.rotation.set(0, m.rotY, m.rotZ);
          _parentDummy.scale.set(m.scaleX, m.scaleY, m.scaleX);
          _parentDummy.updateMatrix();
          spireInstanced.setMatrixAt(i, _parentDummy.matrix);

          if (m.edgeLines) {
            m.edgeLines.position.set(m.x, curY, m.z);
            m.edgeLines.rotation.set(0, m.rotY, m.rotZ);
            m.edgeLines.scale.set(m.scaleX * 1.008, m.scaleY * 1.008, m.scaleX * 1.008);
          }

          // Plinth base
          _childDummy.position.set(0, -4.2, 0);
          _childDummy.rotation.set(0, 0, 0);
          _childDummy.scale.set(1, 1, 1);
          _childDummy.updateMatrix();
          _worldMat.multiplyMatrices(_parentDummy.matrix, _childDummy.matrix);
          plinthInstanced.setMatrixAt(i, _worldMat);

          // Primary burnished-gold orbiting ring
          _childDummy.position.set(0, 1.65, 0);
          _childDummy.rotation.set(
            Math.PI * 0.46 + Math.sin(elapsed * 0.6 + m.bobPhase) * 0.22,
            0.25 * m.side,
            m.ringPrimaryRotZ
          );
          _childDummy.scale.set(1, 1, 1);
          _childDummy.updateMatrix();
          _worldMat.multiplyMatrices(_parentDummy.matrix, _childDummy.matrix);
          ringPrimaryInstanced.setMatrixAt(i, _worldMat);

          // Secondary burnished-gold orbiting ring
          _childDummy.position.set(0, 1.65, 0);
          _childDummy.rotation.set(
            Math.PI * 0.56,
            Math.cos(elapsed * 0.5 + m.bobPhase) * 0.34,
            m.ringSecondaryRotZ
          );
          _childDummy.scale.set(1, 1, 1);
          _childDummy.updateMatrix();
          _worldMat.multiplyMatrices(_parentDummy.matrix, _childDummy.matrix);
          ringSecondaryInstanced.setMatrixAt(i, _worldMat);

          // Levitating radiant emissive crystal + glow sprite
          const crownLocalY = 5.55 + Math.sin(elapsed * 1.65 + m.bobPhase) * 0.26;
          _childDummy.position.set(0, crownLocalY, 0);
          _childDummy.rotation.set(0, m.crownRotY, 0);
          _childDummy.scale.set(1, 1, 1);
          _childDummy.updateMatrix();
          _worldMat.multiplyMatrices(_parentDummy.matrix, _childDummy.matrix);
          crownInstanced.setMatrixAt(i, _worldMat);

          m.haloSprite.position.setFromMatrixPosition(_worldMat);
        }

        spireInstanced.instanceMatrix.needsUpdate = true;
        plinthInstanced.instanceMatrix.needsUpdate = true;
        ringPrimaryInstanced.instanceMatrix.needsUpdate = true;
        ringSecondaryInstanced.instanceMatrix.needsUpdate = true;
        crownInstanced.instanceMatrix.needsUpdate = true;

        renderer.render(scene, camera);

        if (isSoftwareGl) {
          afterDraw(tick);
        } else {
          frameId = window.requestAnimationFrame(tick);
        }
      };

      // Pause requestAnimationFrame when browser tab/app is hidden
      const onVisibilityChange = () => {
        if (document.hidden) {
          paused = true;
          window.cancelAnimationFrame(frameId);
          window.clearTimeout(frameId);
        } else if (!disposed) {
          paused = false;
          clock.getDelta();
          tick();
        }
      };
      document.addEventListener("visibilitychange", onVisibilityChange);

      if (!paused) {
        clock.getDelta();
        tick();
      }

      return () => {
        disposed = true;
        window.cancelAnimationFrame(frameId);
        window.clearTimeout(frameId);
        document.removeEventListener("visibilitychange", onVisibilityChange);
        resizeObserver?.disconnect();
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("deviceorientation", onDeviceOrientation);
        window.removeEventListener("pointerdown", onPointerDown);
        window.removeEventListener("resize", onResize);
        window.removeEventListener("orientationchange", onResize);

        // Full resource disposal on unmount (zero WebGL memory leaks)
        particleGeo.dispose();
        particleMat.dispose();
        particleTex.dispose();
        emberGeo?.dispose();
        emberMat?.dispose();
        emberTex?.dispose();
        abyssFloorGeo.dispose();
        abyssFloorMat.dispose();
        abyssFloorTex.dispose();
        mistGeo.dispose();
        mistTex.dispose();
        mistLayers.forEach((ml) => ml.mat.dispose());
        moonHaloTex.dispose();
        moonHaloMat.dispose();
        eclipseBloomTex.dispose();
        eclipseBloomMat.dispose();
        coronaGeo.dispose();
        coronaMat.dispose();
        eclipseDiscGeo.dispose();
        eclipseDiscMat.dispose();
        spireInstanced.dispose();
        plinthInstanced.dispose();
        ringPrimaryInstanced.dispose();
        ringSecondaryInstanced.dispose();
        crownInstanced.dispose();
        spireGeo.dispose();
        spireEdgesGeo.dispose();
        plinthGeo.dispose();
        collarGeo.dispose();
        collarSecondaryGeo.dispose();
        crownGeo.dispose();
        monolithStoneMat.dispose();
        monolithTrimMat.dispose();
        monolithCollarMat.dispose();
        runeEdgeMat.dispose();
        crownCrystalMat.dispose();
        crystalHaloTex.dispose();
        crystalHaloMat.dispose();
        artifactCoreGeos.forEach((g) => g.dispose());
        artifactRingOuterGeo.dispose();
        artifactRingInnerGeo.dispose();
        artifactShardGeo.dispose();
        artifactHitProxyGeo.dispose();
        artifactHitProxyMat.dispose();
        artifactHaloTex.dispose();
        artifacts.forEach((a) => a.disposables.forEach((d) => d.dispose()));
        bossCoreGeo.dispose();
        bossCoreMat.dispose();
        bossCoreEdgesGeo.dispose();
        bossCoreEdgesMat.dispose();
        bossHeartGeo.dispose();
        bossHeartMat.dispose();
        bossRingGeos.forEach((g) => g.dispose());
        bossRingMats.forEach((m) => m.dispose());
        bladeGeo.dispose();
        bladeEdgesGeo.dispose();
        bladeMat.dispose();
        bladeEdgeMat.dispose();
        barrierGeo.dispose();
        barrierMat.dispose();
        barrierWireGeo.dispose();
        barrierWireMat.dispose();
        bossHaloMat.dispose();
        supernovaShardGeo.dispose();
        supernovaShardMat.dispose();
        shockwaveGeo.dispose();
        shockwaveMat.dispose();
        envRT.dispose();
        renderer.dispose();
        if (renderer.domElement.parentNode === container) {
          container.removeChild(renderer.domElement);
        }
      };
    }, []);

    return (
      <div
        ref={mountRef}
        aria-hidden="true"
        className="fixed inset-0 z-0 w-full h-full pointer-events-none bg-[#05070D]"
      />
    );
  }
);

export default StoryWebGLCanvas;
