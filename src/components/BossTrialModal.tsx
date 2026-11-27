import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  X,
  Swords,
  Shield,
  ChevronLeft,
  ChevronRight,
  Zap,
  Snowflake,
  RotateCcw,
  Download,
  Copy,
  Check,
  Github,
  Trophy,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { PORTFOLIO_DATA, ForgeVisualProfile } from "../data/portfolioData";
import { retroAudio } from "../utils/retroAudio";
import {
  CapeNode,
  createInitialCape,
  updateNaturalCloakNodes,
  drawCyberNordicHero,
  drawLeviathanWarAxe,
} from "../utils/mythicHeroCanvas";

interface BossTrialModalProps {
  isOpen: boolean;
  onClose: () => void;
  forgeProfile: ForgeVisualProfile;
  onTrialVictory: (clearTimeSeconds: number) => void;
  platinumRecord: PlatinumRecord | null;
}

export interface PlatinumRecord {
  badge: string;
  bestTime: number;
  achievedAt: string;
}

export const PLATINUM_STORAGE_KEY = "aashish_platinum_architect_v1";

type TrialPhase = "BRIEFING" | "FIGHTING" | "SHATTERING" | "VICTORY" | "DEFEAT";
type BladeMode = "HAND" | "FLYING_OUT" | "EMBEDDED" | "RECALLING";

interface GroundFissureWave {
  x: number;
  vx: number;
  dir: 1 | -1;
  width: number;
  height: number;
  age: number;
  seed: number;
  hitPlayer: boolean;
  dodged: boolean;
}

interface RuneSkyBeam {
  x: number;
  telegraph: number; // counts down from 0.85 to 0
  maxTelegraph: number;
  activeTimer: number; // counts down from 0.36 to 0
  radius: number;
  hitPlayer: boolean;
  dodged: boolean;
  rotation: number;
}

interface PlasmaOrb {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  age: number;
  hitPlayer: boolean;
  dodged: boolean;
  trail: Array<{ x: number; y: number }>;
}

interface ArenaParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  rotation?: number;
  vRot?: number;
  kind: "spark" | "shard" | "hexShard" | "smoke";
}

interface FloatingText {
  x: number;
  y: number;
  vy: number;
  text: string;
  color: string;
  size: number;
  life: number;
  maxLife: number;
}

interface ShockwaveRing {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  color: string;
  life: number;
  maxLife: number;
  lineWidth: number;
}

interface DashGhost {
  x: number;
  facing: 1 | -1;
  stride: number;
  cape: CapeNode[];
  life: number;
  maxLife: number;
  golden: boolean;
}

interface AmbientAsh {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  phase: number;
  isFrost: boolean;
}

const ARENA_W = 860;
const ARENA_H = 440;
const GROUND_Y = 368;
const BOSS_MAX_HP = 1000;
const PLAYER_MAX_HP = 100;
const MAX_AXE_TRAIL = 14;
const HALO_RUNES = ["ᛟ", "ᚦ", "ᚱ", "ᛏ", "ᛉ", "ᛊ", "ᚨ", "ᛈ"];

const PHASE_COLORS: Record<number, { main: string; glow: string; name: string; numeral: string }> = {
  1: {
    main: "#C8B6FF",
    glow: "rgba(200, 182, 255, 0.34)",
    name: "THE RACE CONDITION",
    numeral: "PHASE I",
  },
  2: {
    main: "#FFB870",
    glow: "rgba(255, 184, 112, 0.36)",
    name: "O(N²) OVERLOAD",
    numeral: "PHASE II",
  },
  3: {
    main: "#FF7597",
    glow: "rgba(255, 117, 151, 0.38)",
    name: "PRODUCTION OUTAGE",
    numeral: "PHASE III",
  },
};

export default function BossTrialModal({
  isOpen,
  onClose,
  forgeProfile,
  onTrialVictory,
  platinumRecord,
}: BossTrialModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [phase, setPhase] = useState<TrialPhase>("BRIEFING");
  const [hudState, setHudState] = useState({
    playerHp: PLAYER_MAX_HP,
    bossHp: BOSS_MAX_HP,
    bossTrailHp: BOSS_MAX_HP,
    bossPhase: 1,
    bossPhaseName: "THE RACE CONDITION",
    bladeMode: "HAND" as BladeMode,
    goldenCharged: false,
    shieldActive: false,
    shieldStunned: false,
    elapsed: 0,
    phaseBannerTitle: "",
    phaseBannerSub: "",
    phaseBannerColor: "#C8B6FF",
  });
  const [finalTime, setFinalTime] = useState<number>(0);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const forgeProfileRef = useRef(forgeProfile);
  const onTrialVictoryRef = useRef(onTrialVictory);
  useEffect(() => {
    forgeProfileRef.current = forgeProfile;
    onTrialVictoryRef.current = onTrialVictory;
  }, [forgeProfile, onTrialVictory]);

  // High-frequency 60fps combat simulation state
  const simRef = useRef({
    status: "BRIEFING" as TrialPhase,
    elapsed: 0,
    shatterTimer: 0,
    // Tactile Juice: 45ms hit-stop, directional micro screen-shake, slow-mo dodge dilation
    hitStopTimer: 0,
    slowMoTimer: 0,
    shakeX: 0,
    shakeY: 0,
    shakeMag: 0,
    screenEdgeFlash: 0,
    screenEdgeColor: "#FFB870",
    // Hero
    px: 185,
    vx: 0,
    facing: 1 as 1 | -1,
    stride: 0,
    breath: 0,
    hp: PLAYER_MAX_HP,
    iFrames: 0,
    damageFlash: 0,
    dashTimer: 0,
    dashCooldown: 0,
    dashGhostTick: 0,
    axeFlourish: 0,
    goldenCharge: false, // Armed by Perfect Dodge Slow-Motion!
    keys: { left: false, right: false },
    touch: { left: false, right: false },
    cape: createInitialCape(185) as CapeNode[],
    ghosts: [] as DashGhost[],
    // Sculpted Leviathan War-Axe
    bladeMode: "HAND" as BladeMode,
    bx: 185,
    by: GROUND_Y - 38,
    bvx: 0,
    bvy: 0,
    bRot: 0,
    bladeHitThisFlight: false,
    bladeIsGolden: false,
    bladeTrail: [] as Array<{ x: number; y: number }>,
    // Multi-Part Boss: THE LEGACY MONOLITH
    bossX: 655,
    bossY: GROUND_Y - 140,
    bossTargetX: 655,
    bossMoveTimer: 2.2,
    bossHp: BOSS_MAX_HP,
    bossTrailHp: BOSS_MAX_HP,
    bossTrailHold: 0,
    bossPhase: 1,
    bossHitFlash: 0,
    bossShardFlare: 0, // flares outward when taking heavy damage
    bossWindup: 0, // pulls armor shards inward before attacks
    bossEyeX: 0,
    bossEyeY: 0,
    attackTimer: 1.25,
    shieldActive: false,
    shieldStunTimer: 0,
    shieldSide: -1 as -1 | 1, // -1 = facing left, 1 = facing right
    // Hazards & VFX
    fissures: [] as GroundFissureWave[],
    beams: [] as RuneSkyBeam[],
    orbs: [] as PlasmaOrb[],
    particles: [] as ArenaParticle[],
    floats: [] as FloatingText[],
    rings: [] as ShockwaveRing[],
    ash: Array.from({ length: 42 }, (_, i) => ({
      x: ((i * 173.3) % ARENA_W),
      y: ((i * 97.7) % GROUND_Y),
      vx: -10 - (i % 5) * 4,
      vy: 9 + (i % 4) * 5,
      size: 1.0 + (i % 3) * 0.65,
      alpha: 0.14 + (i % 4) * 0.08,
      phase: i * 1.13,
      isFrost: i % 2 === 0,
    })) as AmbientAsh[],
    phaseBannerTitle: "",
    phaseBannerSub: "",
    phaseBannerColor: "#C8B6FF",
    phaseBannerTimer: 0,
    lastHudSync: 0,
  });

  const triggerShake = (dirX: number, dirY: number, mag: number) => {
    const s = simRef.current;
    const len = Math.hypot(dirX, dirY) || 1;
    s.shakeX = (dirX / len) * mag;
    s.shakeY = (dirY / len) * mag;
    s.shakeMag = Math.max(s.shakeMag, mag);
  };

  const spawnBurst = (
    x: number,
    y: number,
    count: number,
    color: string,
    speedMin = 70,
    speedMax = 210,
    kind: ArenaParticle["kind"] = "spark"
  ) => {
    const s = simRef.current;
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const spd = speedMin + Math.random() * (speedMax - speedMin);
      const isDebris = kind === "shard" || kind === "hexShard";
      s.particles.push({
        x,
        y,
        vx: Math.cos(a) * spd,
        vy: Math.sin(a) * spd - (isDebris ? 65 : 22),
        life: isDebris ? 0.95 + Math.random() * 0.75 : 0.28 + Math.random() * 0.34,
        maxLife: isDebris ? 1.7 : 0.62,
        size: isDebris ? 5 + Math.random() * 6.5 : kind === "smoke" ? 4 + Math.random() * 4 : 1.8 + Math.random() * 2.5,
        color,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 11,
        kind,
      });
    }
  };

  const spawnFloatingText = (
    x: number,
    y: number,
    text: string,
    color: string,
    size = 16
  ) => {
    simRef.current.floats.push({
      x,
      y,
      vy: -52,
      text,
      color,
      size,
      life: 0.95,
      maxLife: 0.95,
    });
  };

  const spawnShockRing = (
    x: number,
    y: number,
    maxRadius: number,
    color: string,
    maxLife = 0.55,
    lineWidth = 2.6
  ) => {
    simRef.current.rings.push({
      x,
      y,
      radius: 14,
      maxRadius,
      color,
      life: maxLife,
      maxLife,
      lineWidth,
    });
  };

  const resetArena = useCallback((startImmediately: boolean) => {
    const s = simRef.current;
    s.status = startImmediately ? "FIGHTING" : "BRIEFING";
    s.elapsed = 0;
    s.shatterTimer = 0;
    s.hitStopTimer = 0;
    s.slowMoTimer = 0;
    s.shakeX = 0;
    s.shakeY = 0;
    s.shakeMag = 0;
    s.screenEdgeFlash = 0;

    s.px = 185;
    s.vx = 0;
    s.facing = 1;
    s.stride = 0;
    s.breath = 0;
    s.hp = PLAYER_MAX_HP;
    s.iFrames = 0;
    s.damageFlash = 0;
    s.dashTimer = 0;
    s.dashCooldown = 0;
    s.dashGhostTick = 0;
    s.axeFlourish = 0;
    s.goldenCharge = false;
    s.keys = { left: false, right: false };
    s.touch = { left: false, right: false };
    s.cape = createInitialCape(185);
    s.ghosts = [];

    s.bladeMode = "HAND";
    s.bx = 185;
    s.by = GROUND_Y - 38;
    s.bvx = 0;
    s.bvy = 0;
    s.bRot = 0;
    s.bladeHitThisFlight = false;
    s.bladeIsGolden = false;
    s.bladeTrail = [];

    s.bossX = 655;
    s.bossY = GROUND_Y - 140;
    s.bossTargetX = 655;
    s.bossMoveTimer = 2.0;
    s.bossHp = BOSS_MAX_HP;
    s.bossTrailHp = BOSS_MAX_HP;
    s.bossTrailHold = 0;
    s.bossPhase = 1;
    s.bossHitFlash = 0;
    s.bossShardFlare = 0;
    s.bossWindup = 0;
    s.bossEyeX = -6;
    s.bossEyeY = 4;
    s.attackTimer = 1.25;
    s.shieldActive = false;
    s.shieldStunTimer = 0;
    s.shieldSide = -1;

    s.fissures = [];
    s.beams = [];
    s.orbs = [];
    s.particles = [];
    s.floats = [];
    s.rings = [];

    s.phaseBannerTitle = startImmediately ? "THE RACE CONDITION" : "";
    s.phaseBannerSub = startImmediately ? "PHASE I · CONCURRENT FISSURES" : "";
    s.phaseBannerColor = "#C8B6FF";
    s.phaseBannerTimer = startImmediately ? 2.2 : 0;

    setHudState({
      playerHp: PLAYER_MAX_HP,
      bossHp: BOSS_MAX_HP,
      bossTrailHp: BOSS_MAX_HP,
      bossPhase: 1,
      bossPhaseName: "THE RACE CONDITION",
      bladeMode: "HAND",
      goldenCharged: false,
      shieldActive: false,
      shieldStunned: false,
      elapsed: 0,
      phaseBannerTitle: s.phaseBannerTitle,
      phaseBannerSub: s.phaseBannerSub,
      phaseBannerColor: "#C8B6FF",
    });
    setPhase(startImmediately ? "FIGHTING" : "BRIEFING");
    if (startImmediately) {
      retroAudio.playChapterHum();
    }
  }, []);

  // Lock page scroll & handle Escape while modal is open
  useEffect(() => {
    if (!isOpen) return;
    resetArena(false);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose, resetArena]);

  // Trigger Perfect Dodge Slow-Motion when dashing right through an imminent threat
  const triggerPerfectDodge = () => {
    const s = simRef.current;
    if (s.slowMoTimer > 0.12) return;
    s.slowMoTimer = 0.44;
    s.goldenCharge = true;
    s.iFrames = Math.max(s.iFrames, 0.5);
    retroAudio.playPerfectDodge();
    spawnShockRing(s.px, GROUND_Y - 36, 94, "#A5E8FF", 0.48, 3);
    spawnShockRing(s.px, GROUND_Y - 36, 62, "#FFE08A", 0.36, 2);
    spawnBurst(s.px, GROUND_Y - 36, 18, "#FFE08A", 75, 195, "spark");
    spawnFloatingText(s.px, GROUND_Y - 88, "PERFECT DODGE", "#FFE08A", 14);
  };

  // Player Dodge Dash with Invulnerability Frames + 3 Frost Silhouette Afterimages
  const triggerDodgeDash = useCallback(() => {
    const s = simRef.current;
    if (s.status !== "FIGHTING" || s.dashCooldown > 0) return;

    const dir: 1 | -1 =
      s.keys.left || s.touch.left
        ? -1
        : s.keys.right || s.touch.right
        ? 1
        : s.facing;
    s.facing = dir;
    s.dashTimer = 0.24;
    s.iFrames = Math.max(s.iFrames, 0.34);
    s.dashCooldown = 0.52;
    s.dashGhostTick = 0;

    // Immediately spawn first crisp translucent frost hero silhouette
    s.ghosts.push({
      x: s.px,
      facing: s.facing,
      stride: s.stride,
      cape: s.cape.map((n) => ({ ...n })),
      life: 0.28,
      maxLife: 0.28,
      golden: s.goldenCharge,
    });
    if (s.ghosts.length > 3) s.ghosts.shift();

    // Check split-second Perfect Dodge proximity against active hazards
    let nearThreat = false;
    for (const f of s.fissures) {
      if (!f.hitPlayer && !f.dodged && Math.abs(f.x - s.px) < 92) {
        f.dodged = true;
        nearThreat = true;
      }
    }
    for (const b of s.beams) {
      if (!b.hitPlayer && !b.dodged && Math.abs(b.x - s.px) < b.radius + 36 && b.telegraph < 0.26) {
        b.dodged = true;
        nearThreat = true;
      }
    }
    for (const o of s.orbs) {
      if (!o.hitPlayer && !o.dodged && Math.hypot(o.x - s.px, o.y - (GROUND_Y - 38)) < 88) {
        o.dodged = true;
        nearThreat = true;
      }
    }

    if (nearThreat) {
      triggerPerfectDodge();
    } else {
      retroAudio.playDash();
      spawnBurst(s.px, GROUND_Y - 26, 10, "#A5E8FF", 55, 135, "spark");
    }
  }, []);

  // Sculpted Runic Leviathan War-Axe Throw & Recall
  const triggerThrowOrRecall = useCallback((aimX?: number, aimY?: number) => {
    const s = simRef.current;
    if (s.status !== "FIGHTING") return;

    if (s.bladeMode === "HAND") {
      const startX = s.px + s.facing * 14;
      const startY = GROUND_Y - 44;
      let tx = aimX;
      let ty = aimY;

      if (tx === undefined || ty === undefined) {
        // Smart-aim past the Boss so Throw-Past -> Recall-Through-Back works smoothly on F & mobile!
        const dirToBoss: 1 | -1 = s.bossX >= s.px ? 1 : -1;
        s.facing = dirToBoss;
        tx = s.bossX + dirToBoss * 145;
        ty = s.bossY + (s.shieldActive && s.shieldStunTimer <= 0 ? -52 : -4);
      } else {
        s.facing = tx >= s.px ? 1 : -1;
      }

      const dx = tx - startX;
      const dy = ty - startY;
      const dist = Math.hypot(dx, dy) || 1;
      const speed = s.goldenCharge ? 880 : 790;

      s.bladeMode = "FLYING_OUT";
      s.bx = startX;
      s.by = startY;
      s.bvx = (dx / dist) * speed;
      s.bvy = (dy / dist) * speed;
      s.bRot = 0;
      s.bladeHitThisFlight = false;
      s.bladeIsGolden = s.goldenCharge;
      s.goldenCharge = false;
      s.bladeTrail = [{ x: startX, y: startY }];
      s.axeFlourish = 0.35;

      retroAudio.playBladeThrow();
      spawnBurst(
        startX,
        startY,
        s.bladeIsGolden ? 16 : 9,
        s.bladeIsGolden ? "#FFE08A" : forgeProfileRef.current.bladePrimary,
        50,
        150,
        "spark"
      );
    } else if (s.bladeMode === "EMBEDDED" || s.bladeMode === "FLYING_OUT") {
      s.bladeMode = "RECALLING";
      s.bladeHitThisFlight = false;
      retroAudio.playBladeRecall();
      spawnShockRing(s.bx, s.by, 44, s.bladeIsGolden ? "#FFE08A" : "#98F5E1", 0.32, 2.2);
      spawnBurst(
        s.bx,
        s.by,
        14,
        s.bladeIsGolden ? "#FFE08A" : "#98F5E1",
        70,
        180,
        "spark"
      );
    }
  }, []);

  // Keyboard Controls
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const s = simRef.current;
      if (s.status !== "FIGHTING") return;

      const key = e.key.toLowerCase();
      if (key === "a" || e.key === "ArrowLeft") {
        e.preventDefault();
        s.keys.left = true;
      } else if (key === "d" || e.key === "ArrowRight") {
        e.preventDefault();
        s.keys.right = true;
      } else if (e.key === "Shift" || e.code === "Space") {
        e.preventDefault();
        triggerDodgeDash();
      } else if (key === "f") {
        e.preventDefault();
        triggerThrowOrRecall();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const s = simRef.current;
      const key = e.key.toLowerCase();
      if (key === "a" || e.key === "ArrowLeft") s.keys.left = false;
      if (key === "d" || e.key === "ArrowRight") s.keys.right = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isOpen, triggerDodgeDash, triggerThrowOrRecall]);

  const handleCanvasPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * ARENA_W;
    const y = ((e.clientY - rect.top) / rect.height) * ARENA_H;
    triggerThrowOrRecall(x, y);
  };

  // =========================================================================
  // 60FPS CINEMATIC BOSS COMBAT SIMULATION & RENDER ENGINE
  // =========================================================================
  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = ARENA_W * dpr;
    canvas.height = ARENA_H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    let rafId = 0;
    let lastTime = performance.now();

    const triggerPhaseBanner = (title: string, sub: string, color: string) => {
      const s = simRef.current;
      s.phaseBannerTitle = title;
      s.phaseBannerSub = sub;
      s.phaseBannerColor = color;
      s.phaseBannerTimer = 2.4;
      spawnShockRing(s.bossX, s.bossY, 240, color, 0.72, 3.2);
      spawnShockRing(s.bossX, s.bossY, 150, "#F2F4FB", 0.46, 1.8);
    };

    const damageBoss = (baseAmount: number, isRecallStrike: boolean) => {
      const s = simRef.current;
      const fp = forgeProfileRef.current;
      const hitFromLeft = s.bx < s.bossX;
      const playerOnLeft = s.px < s.bossX;
      // Front hexagonal Aegis shield faces the player; striking from opposite side = backstab!
      const isBackstab = hitFromLeft !== playerOnLeft;
      const impactDirX = s.bvx !== 0 ? Math.sign(s.bvx) : s.px < s.bossX ? 1 : -1;

      if (s.shieldActive && s.shieldStunTimer <= 0) {
        if (isRecallStrike && isBackstab) {
          // DRAMATIC GLASS-SHATTER AEGIS SHIELD BREAK!
          const dmg = Math.round(baseAmount * (s.bladeIsGolden ? 2.4 : 1.9));
          s.shieldActive = false;
          s.shieldStunTimer = 4.8;
          s.bossHp = Math.max(0, s.bossHp - dmg);
          s.bossTrailHold = 0.42;
          s.bossHitFlash = 0.34;
          s.bossShardFlare = 1.0;
          s.hitStopTimer = 0.055; // crisp impact freeze!
          triggerShake(impactDirX, -0.4, 8.5);
          retroAudio.playBossHit(true, false);

          // Flying hexagonal glass shield shards + radiant sparks!
          spawnBurst(s.bossX + s.shieldSide * 44, s.bossY, 22, "#98F5E1", 110, 310, "hexShard");
          spawnBurst(s.bossX, s.bossY, 24, "#FF7597", 90, 260, "spark");
          spawnShockRing(s.bossX, s.bossY, 165, "#98F5E1", 0.55, 3.4);
          spawnFloatingText(s.bossX, s.bossY - 76, `SHATTER -${dmg}!`, "#98F5E1", 20);
          triggerPhaseBanner("AEGIS SHATTERED", "MONOLITH EXPOSED — STRIKE THE CORE", "#98F5E1");
        } else {
          // Deflected off the Hexagonal Aegis Shield!
          triggerShake(-impactDirX, -0.3, 4.5);
          retroAudio.playBossHit(false, true);
          spawnBurst(s.bx, s.by, 14, "#A5E8FF", 80, 190, "spark");
          spawnShockRing(s.bx, s.by, 46, "#FF7597", 0.3, 2);
          spawnFloatingText(s.bx, s.by - 28, "AEGIS BLOCKED", "#FFB870", 13);
          return;
        }
      } else {
        const stunMult = s.shieldStunTimer > 0 ? 1.45 : 1;
        const critMult = s.bladeIsGolden ? 2.0 : 1;
        const dmg = Math.round(baseAmount * stunMult * critMult);
        const isCrit = s.bladeIsGolden || (isRecallStrike && s.shieldStunTimer > 0);

        s.bossHp = Math.max(0, s.bossHp - dmg);
        s.bossTrailHold = 0.35;
        s.bossHitFlash = isCrit ? 0.24 : 0.16;
        s.bossShardFlare = isCrit ? 0.92 : 0.58;
        s.hitStopTimer = 0.045; // Exact 45ms hit-stop impact freeze!
        triggerShake(impactDirX, isRecallStrike ? -0.3 : 0.25, isCrit ? 7.5 : 6.0);
        retroAudio.playBossHit(false, false);

        const sparkColor = isCrit
          ? "#FFE08A"
          : isRecallStrike
          ? "#98F5E1"
          : fp.bladePrimary;
        spawnBurst(s.bx, s.by, isCrit ? 26 : 19, sparkColor, 85, 250, "spark");
        spawnBurst(s.bx, s.by, 6, "#E6C999", 55, 160, "shard");
        spawnShockRing(s.bx, s.by, isCrit ? 78 : 52, sparkColor, 0.34, isCrit ? 2.8 : 2.0);
        spawnFloatingText(
          s.bossX + (Math.random() - 0.5) * 34,
          s.bossY - 56,
          isCrit ? `CRIT -${dmg}!` : `-${dmg}`,
          isCrit ? "#FFE08A" : isRecallStrike ? "#98F5E1" : "#F2F4FB",
          isCrit ? 21 : 17
        );
      }

      // Check Boss Defeat & Phase Transitions
      const hpPct = s.bossHp / BOSS_MAX_HP;
      if (s.bossHp <= 0 && s.status === "FIGHTING") {
        s.status = "SHATTERING";
        s.shatterTimer = 1.85;
        s.fissures = [];
        s.beams = [];
        s.orbs = [];
        s.hitStopTimer = 0.06;
        triggerShake(1, -0.5, 15);
        setPhase("SHATTERING");
        setFinalTime(Number(s.elapsed.toFixed(1)));
        retroAudio.playNordicHornFanfare();
        triggerPhaseBanner("MONOLITH SHATTERED", "TRIAL CONQUERED", "#98F5E1");
        spawnBurst(s.bossX, s.bossY, 44, "#98F5E1", 90, 340, "shard");
        spawnBurst(s.bossX, s.bossY, 32, "#C8B6FF", 80, 290, "hexShard");
        spawnBurst(s.bossX, s.bossY, 26, "#FFE08A", 60, 250, "spark");
        return;
      }

      if (hpPct <= 0.66 && s.bossPhase === 1) {
        s.bossPhase = 2;
        s.attackTimer = 1.05;
        s.bossShardFlare = 1.0;
        s.screenEdgeFlash = 0.65;
        s.screenEdgeColor = "#FFB870";
        retroAudio.playChapterHum();
        triggerPhaseBanner("O(N²) OVERLOAD", "PHASE II · RUNE SKY-BEAMS", "#FFB870");
        spawnBurst(s.bossX, s.bossY, 26, "#FFB870", 90, 240, "spark");
      } else if (hpPct <= 0.33 && s.bossPhase === 2) {
        s.bossPhase = 3;
        s.shieldActive = true;
        s.shieldStunTimer = 0;
        s.attackTimer = 1.25;
        s.bossShardFlare = 1.0;
        s.screenEdgeFlash = 0.72;
        s.screenEdgeColor = "#FF7597";
        retroAudio.playChapterHum();
        triggerPhaseBanner(
          "PRODUCTION OUTAGE",
          "PHASE III · THROW PAST & RECALL THROUGH BACK TO SHATTER AEGIS",
          "#FF7597"
        );
        spawnBurst(s.bossX, s.bossY, 30, "#FF7597", 95, 260, "spark");
      }
    };

    const damagePlayer = (amount: number, fromX: number) => {
      const s = simRef.current;
      if (s.iFrames > 0 || s.status !== "FIGHTING") return;
      s.hp = Math.max(0, s.hp - amount);
      s.iFrames = 0.78;
      s.damageFlash = 1.0;
      s.hitStopTimer = 0.04;
      s.screenEdgeFlash = 0.55;
      s.screenEdgeColor = "#FF7597";
      triggerShake(s.px >= fromX ? 1 : -1, 0.2, 8);
      retroAudio.playPlayerHit();
      spawnBurst(s.px, GROUND_Y - 38, 18, "#FF7597", 75, 200, "spark");
      spawnFloatingText(s.px, GROUND_Y - 78, `-${amount}`, "#FF7597", 15);

      if (s.hp <= 0) {
        s.status = "DEFEAT";
        setPhase("DEFEAT");
      }
    };

    // =========================================================================
    // HELPER RENDERERS (Used in BOTH Main Pass & Floor Reflection Pass)
    // =========================================================================

    // Multi-Part Animated Boss: THE LEGACY MONOLITH (~160px tall)
    const drawLegacyMonolith = (
      s: typeof simRef.current,
      time: number,
      isReflection: boolean
    ) => {
      if (s.status === "SHATTERING" || s.status === "VICTORY") return;

      const bx = s.bossX;
      const by = s.bossY;
      const pInfo = PHASE_COLORS[s.bossPhase] ?? PHASE_COLORS[1];
      const coreColor = s.shieldStunTimer > 0 ? "#98F5E1" : pInfo.main;
      const isFlashing = s.bossHitFlash > 0;

      ctx.save();

      // 1. Ambient Phase Aura behind Boss
      if (!isReflection) {
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        const auraR = 138 + Math.sin(time * 2.4) * 8 + s.bossShardFlare * 28;
        const aura = ctx.createRadialGradient(bx, by, 14, bx, by, auraR);
        aura.addColorStop(0, isFlashing ? "rgba(255,255,255,0.34)" : `${coreColor}38`);
        aura.addColorStop(0.5, `${coreColor}12`);
        aura.addColorStop(1, "rgba(6,8,14,0)");
        ctx.fillStyle = aura;
        ctx.beginPath();
        ctx.arc(bx, by, auraR, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 2. Counter-Rotating Runic Halo Rings Behind the Boss
      const drawRunicRing = (
        radius: number,
        angle: number,
        dash: number[],
        ringAlpha: number,
        showGlyphs: boolean
      ) => {
        ctx.save();
        ctx.translate(bx, by);
        ctx.rotate(angle);
        ctx.strokeStyle = coreColor;
        ctx.globalAlpha = ringAlpha;
        ctx.lineWidth = 1.3;
        ctx.setLineDash(dash);
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Geometric astrolabe ticks
        for (let k = 0; k < 12; k++) {
          const a = (k * Math.PI * 2) / 12;
          const inner = radius - (k % 3 === 0 ? 7 : 3.5);
          ctx.beginPath();
          ctx.moveTo(Math.cos(a) * inner, Math.sin(a) * inner);
          ctx.lineTo(Math.cos(a) * radius, Math.sin(a) * radius);
          ctx.stroke();
        }

        // Glowing etched runes orbiting along the magic ring
        if (showGlyphs && !isReflection) {
          ctx.font = "700 10px Georgia, serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = coreColor;
          for (let r = 0; r < HALO_RUNES.length; r++) {
            const a = (r * Math.PI * 2) / HALO_RUNES.length;
            const rx = Math.cos(a) * (radius + 9);
            const ry = Math.sin(a) * (radius + 9);
            ctx.save();
            ctx.translate(rx, ry);
            ctx.rotate(a + Math.PI * 0.5);
            ctx.fillText(HALO_RUNES[r], 0, 0);
            ctx.restore();
          }
        }
        ctx.restore();
      };

      const ringSpeed = s.bossPhase === 3 ? 0.85 : s.bossPhase === 2 ? 0.62 : 0.42;
      drawRunicRing(74, time * ringSpeed, [14, 7], 0.42, false);
      drawRunicRing(92, -time * ringSpeed * 0.72, [24, 10, 4, 10], 0.3, true);

      // 3. Fractured Inner Obsidian & Crystalline Core (~104px tall center)
      ctx.save();
      ctx.translate(bx, by);

      // Inner dark obsidian prism silhouette
      ctx.beginPath();
      ctx.moveTo(0, -56);
      ctx.lineTo(28, -22);
      ctx.lineTo(24, 34);
      ctx.lineTo(0, 58);
      ctx.lineTo(-24, 34);
      ctx.lineTo(-28, -22);
      ctx.closePath();

      const coreGrad = ctx.createLinearGradient(-28, -56, 28, 58);
      if (isFlashing) {
        coreGrad.addColorStop(0, "#FFFFFF");
        coreGrad.addColorStop(1, coreColor);
      } else {
        coreGrad.addColorStop(0, "#232B47");
        coreGrad.addColorStop(0.5, "#111629");
        coreGrad.addColorStop(1, "#080B16");
      }
      ctx.fillStyle = coreGrad;
      ctx.fill();
      ctx.strokeStyle = isFlashing ? "#FFFFFF" : `${coreColor}CC`;
      ctx.lineWidth = 1.6;
      ctx.stroke();

      // Faceted crystalline inner chamber
      ctx.beginPath();
      ctx.moveTo(0, -34);
      ctx.lineTo(17, -6);
      ctx.lineTo(13, 24);
      ctx.lineTo(0, 38);
      ctx.lineTo(-13, 24);
      ctx.lineTo(-17, -6);
      ctx.closePath();
      ctx.fillStyle = "#060811";
      ctx.fill();

      // Branching Glowing Energy Cracks (intensify with Phase 1 -> 2 -> 3!)
      ctx.save();
      ctx.strokeStyle = coreColor;
      ctx.shadowColor = coreColor;
      ctx.shadowBlur = 8 + s.bossPhase * 4;
      ctx.lineWidth = 1.2 + s.bossPhase * 0.35;
      ctx.beginPath();
      // Upper left & right fracture veins
      ctx.moveTo(0, -14);
      ctx.lineTo(-14, -26);
      ctx.lineTo(-22, -18);
      ctx.moveTo(0, -14);
      ctx.lineTo(15, -28);
      ctx.lineTo(23, -16);
      // Lower fissures
      ctx.moveTo(0, 18);
      ctx.lineTo(-16, 28);
      ctx.moveTo(0, 18);
      ctx.lineTo(17, 26);
      if (s.bossPhase >= 2) {
        ctx.moveTo(-14, -26);
        ctx.lineTo(-6, -46);
        ctx.moveTo(15, -28);
        ctx.lineTo(8, -44);
      }
      if (s.bossPhase >= 3) {
        ctx.moveTo(-16, 28);
        ctx.lineTo(-21, 10);
        ctx.moveTo(17, 26);
        ctx.lineTo(21, 8);
      }
      ctx.stroke();
      ctx.restore();

      // Radiant Core Eye smoothly tracking the Hero's X/Y position!
      ctx.save();
      const eyeGlow = ctx.createRadialGradient(
        s.bossEyeX,
        s.bossEyeY,
        2,
        s.bossEyeX,
        s.bossEyeY,
        19
      );
      eyeGlow.addColorStop(0, "#FFFFFF");
      eyeGlow.addColorStop(0.35, coreColor);
      eyeGlow.addColorStop(1, "rgba(6,8,14,0)");
      ctx.fillStyle = eyeGlow;
      ctx.beginPath();
      ctx.arc(s.bossEyeX, s.bossEyeY, 19, 0, Math.PI * 2);
      ctx.fill();

      // Sharp diamond iris + vertical glowing slit pupil
      ctx.fillStyle = "#F8FAFF";
      ctx.beginPath();
      ctx.moveTo(s.bossEyeX, s.bossEyeY - 10);
      ctx.lineTo(s.bossEyeX + 8.5, s.bossEyeY);
      ctx.lineTo(s.bossEyeX, s.bossEyeY + 10);
      ctx.lineTo(s.bossEyeX - 8.5, s.bossEyeY);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "#06080E";
      ctx.beginPath();
      ctx.ellipse(s.bossEyeX, s.bossEyeY, 2.3, 7.2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.restore(); // end inner core

      // 4. 6 Orbiting Beveled Obsidian Armor Shards (~160px total vertical/radial presence!)
      // Pull inward tightly during attack windup; flare outward violently when hit/stunned!
      const shardBaseConfigs = [
        { ang: -Math.PI * 0.5, rx: 0, ry: -72, w: 20, h: 32, tilt: 0 }, // Top crown spire
        { ang: -Math.PI * 0.16, rx: 52, ry: -34, w: 22, h: 36, tilt: 0.42 }, // Upper right pauldron plate
        { ang: Math.PI * 0.19, rx: 50, ry: 30, w: 20, h: 34, tilt: -0.35 }, // Lower right flank shard
        { ang: Math.PI * 0.5, rx: 0, ry: 72, w: 18, h: 28, tilt: Math.PI }, // Bottom keel spire
        { ang: Math.PI * 0.81, rx: -50, ry: 30, w: 20, h: 34, tilt: 0.35 }, // Lower left flank shard
        { ang: -Math.PI * 0.84, rx: -52, ry: -34, w: 22, h: 36, tilt: -0.42 }, // Upper left pauldron plate
      ];

      const breathe = Math.sin(time * 2.5) * 4.5;
      const windupPull = -s.bossWindup * 15;
      const flarePush = s.bossShardFlare * 24 + (s.shieldStunTimer > 0 ? 12 : 0);
      const radialDelta = breathe + windupPull + flarePush;

      shardBaseConfigs.forEach((cfg, idx) => {
        const hoverY = Math.sin(time * 2.8 + idx * 1.1) * 4.5;
        const unitX = Math.cos(cfg.ang);
        const unitY = Math.sin(cfg.ang);
        const sx = bx + cfg.rx + unitX * radialDelta;
        const sy = by + cfg.ry + unitY * radialDelta + hoverY;

        ctx.save();
        ctx.translate(sx, sy);
        ctx.rotate(cfg.tilt + Math.sin(time * 1.8 + idx) * 0.06);

        // Beveled dark-stone angular armor plate polygon
        ctx.beginPath();
        ctx.moveTo(0, -cfg.h * 0.56);
        ctx.lineTo(cfg.w * 0.54, -cfg.h * 0.12);
        ctx.lineTo(cfg.w * 0.38, cfg.h * 0.48);
        ctx.lineTo(0, cfg.h * 0.56);
        ctx.lineTo(-cfg.w * 0.38, cfg.h * 0.48);
        ctx.lineTo(-cfg.w * 0.54, -cfg.h * 0.12);
        ctx.closePath();

        const plateGrad = ctx.createLinearGradient(-cfg.w * 0.5, -cfg.h * 0.5, cfg.w * 0.5, cfg.h * 0.5);
        if (isFlashing) {
          plateGrad.addColorStop(0, "#F2F4FB");
          plateGrad.addColorStop(1, coreColor);
        } else {
          plateGrad.addColorStop(0, "#242D4B");
          plateGrad.addColorStop(0.55, "#141A2E");
          plateGrad.addColorStop(1, "#090C18");
        }
        ctx.fillStyle = plateGrad;
        ctx.fill();

        // Moonlit bevel rim + inner energy trim
        ctx.strokeStyle = isFlashing ? "#FFFFFF" : `${coreColor}99`;
        ctx.lineWidth = 1.25;
        ctx.stroke();

        // Carved glowing stone seam down the center of each armor shard
        if (!isReflection) {
          ctx.strokeStyle = `${coreColor}88`;
          ctx.lineWidth = 1.1;
          ctx.beginPath();
          ctx.moveTo(0, -cfg.h * 0.28);
          ctx.lineTo(0, cfg.h * 0.26);
          ctx.stroke();
        }
        ctx.restore();
      });

      // 5. Phase 3 Curved Shimmering Hexagonal Energy Aegis Shield (Projected strictly in front facing the hero!)
      if (s.shieldActive && s.shieldStunTimer <= 0) {
        const shieldAngleCenter = s.shieldSide === -1 ? Math.PI : 0;
        const arcSpan = 1.16;
        const shieldR = 82;

        ctx.save();
        // Luminous outer curved shield barrier
        ctx.shadowColor = "#FF7597";
        ctx.shadowBlur = 18;
        ctx.strokeStyle = "#FFB5CA";
        ctx.lineWidth = 4.2;
        ctx.beginPath();
        ctx.arc(bx, by, shieldR, shieldAngleCenter - arcSpan, shieldAngleCenter + arcSpan);
        ctx.stroke();

        // Translucent shimmering hexagonal shield mesh cells along the front curve
        ctx.shadowBlur = 0;
        const hexCells = 7;
        for (let h = 0; h < hexCells; h++) {
          const frac = (h / (hexCells - 1)) * 2 - 1; // -1..1
          const cellAngle = shieldAngleCenter + frac * (arcSpan * 0.86);
          const cx = bx + Math.cos(cellAngle) * (shieldR - 5);
          const cy = by + Math.sin(cellAngle) * (shieldR - 5);
          const hexR = 9.5;
          const pulse = 0.22 + 0.16 * Math.sin(time * 5 + h * 0.9);

          ctx.beginPath();
          for (let v = 0; v < 6; v++) {
            const va = cellAngle + (v * Math.PI) / 3;
            const vx = cx + Math.cos(va) * hexR;
            const vy = cy + Math.sin(va) * hexR;
            if (v === 0) ctx.moveTo(vx, vy);
            else ctx.lineTo(vx, vy);
          }
          ctx.closePath();
          ctx.fillStyle = `rgba(255, 117, 151, ${pulse})`;
          ctx.fill();
          ctx.strokeStyle = "rgba(255, 203, 242, 0.72)";
          ctx.lineWidth = 1.1;
          ctx.stroke();
        }

        // Subtle rear weak-flank reticle pulsing on the UNSHIELDED back side
        if (!isReflection) {
          const backX = bx - s.shieldSide * 74;
          const pulse = 0.55 + 0.45 * Math.sin(time * 6);
          ctx.strokeStyle = `rgba(152, 245, 225, ${pulse})`;
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.arc(backX, by, 10 + pulse * 3, 0, Math.PI * 2);
          ctx.stroke();

          ctx.font = "700 9px 'JetBrains Mono', monospace";
          ctx.textAlign = "center";
          ctx.fillStyle = "#98F5E1";
          ctx.fillText("RECALL BACK", backX, by - 18);
        }
        ctx.restore();
      }

      // Stunned label above Monolith when Aegis is shattered
      if (!isReflection && s.shieldStunTimer > 0) {
        ctx.font = "700 11px 'Cinzel', Georgia, serif";
        ctx.textAlign = "center";
        ctx.fillStyle = "#98F5E1";
        ctx.fillText("AEGIS SHATTERED · STRIKE!", bx, by - 96);
      }

      ctx.restore();
    };

    // Phase 1 & 3 Attack: Crackling Jagged Ground Shockwave Fissures (NO flat triangles!)
    const drawGroundFissure = (f: GroundFissureWave, time: number, isReflection: boolean) => {
      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      // Luminous ground energy scar racing along the stone floor
      const trailLen = 84;
      const tailX = f.x - f.dir * trailLen;
      const scarGrad = ctx.createLinearGradient(tailX, GROUND_Y, f.x + f.dir * 16, GROUND_Y);
      scarGrad.addColorStop(0, "rgba(200, 182, 255, 0)");
      scarGrad.addColorStop(0.5, "rgba(200, 182, 255, 0.55)");
      scarGrad.addColorStop(0.85, "rgba(255, 117, 151, 0.85)");
      scarGrad.addColorStop(1, "rgba(255, 240, 248, 0.95)");
      ctx.strokeStyle = scarGrad;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(tailX, GROUND_Y - 1);
      ctx.lineTo(f.x + f.dir * 14, GROUND_Y - 1);
      ctx.stroke();

      // Layered jagged crackling lightning-fissure crests erupting upward from the stone
      const layers = [
        { color: "#C8B6FF", width: 4.5, hScale: 1.0, xOff: -8 },
        { color: "#FF7597", width: 2.8, hScale: 0.88, xOff: 0 },
        { color: "#FFF2FA", width: 1.4, hScale: 0.72, xOff: 4 },
      ];

      for (const layer of layers) {
        ctx.strokeStyle = layer.color;
        ctx.shadowColor = layer.color;
        ctx.shadowBlur = isReflection ? 6 : 14;
        ctx.lineWidth = layer.width;
        ctx.lineJoin = "miter";
        ctx.beginPath();
        const baseStart = f.x - f.dir * 38 + layer.xOff;
        ctx.moveTo(baseStart, GROUND_Y);
        const segs = 6;
        for (let k = 1; k <= segs; k++) {
          const frac = k / segs;
          const jitter = Math.sin(time * 42 + f.seed + k * 2.7) * 8;
          const arch = Math.sin(frac * Math.PI);
          const px = baseStart + f.dir * (frac * 56) + jitter * 0.35;
          const py = GROUND_Y - arch * f.height * layer.hScale - Math.abs(jitter) * 0.6;
          ctx.lineTo(px, py);
        }
        ctx.lineTo(f.x + f.dir * 18, GROUND_Y);
        ctx.stroke();
      }

      // Radiant energy core at leading fissure crest
      const crestGrad = ctx.createRadialGradient(
        f.x,
        GROUND_Y - 14,
        2,
        f.x,
        GROUND_Y - 14,
        28
      );
      crestGrad.addColorStop(0, "rgba(255, 245, 252, 0.9)");
      crestGrad.addColorStop(0.45, "rgba(200, 182, 255, 0.45)");
      crestGrad.addColorStop(1, "rgba(200, 182, 255, 0)");
      ctx.fillStyle = crestGrad;
      ctx.beginPath();
      ctx.arc(f.x, GROUND_Y - 14, 28, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    // Phase 2 Attack: Intricate Glowing Floor Rune Seals -> Massive Vertical Sky-Beams
    const drawRuneSkyBeam = (b: RuneSkyBeam, time: number, isReflection: boolean) => {
      if (b.telegraph > 0) {
        if (isReflection) return;
        const progress = 1 - b.telegraph / b.maxTelegraph; // 0 -> 1 over 0.85s
        ctx.save();

        // Faint descending light guide thread
        ctx.strokeStyle = `rgba(255, 184, 112, ${(0.12 + progress * 0.36).toFixed(2)})`;
        ctx.lineWidth = 1.2;
        ctx.setLineDash([5, 7]);
        ctx.beginPath();
        ctx.moveTo(b.x, 0);
        ctx.lineTo(b.x, GROUND_Y);
        ctx.stroke();
        ctx.setLineDash([]);

        // Intricate glowing floor Rune Seal (foreshortened perspective circle on stone floor)
        ctx.translate(b.x, GROUND_Y + 2);
        ctx.scale(1, 0.26);

        // Outer seal ring
        ctx.strokeStyle = "#FFB870";
        ctx.shadowColor = "#FFB870";
        ctx.shadowBlur = 12;
        ctx.lineWidth = 2.6;
        ctx.beginPath();
        ctx.arc(0, 0, b.radius, 0, Math.PI * 2);
        ctx.stroke();

        // Filling radiant energy disc telegraphing exact detonation moment
        ctx.fillStyle = `rgba(255, 184, 112, ${(0.12 + progress * 0.42).toFixed(2)})`;
        ctx.beginPath();
        ctx.arc(0, 0, b.radius * progress, 0, Math.PI * 2);
        ctx.fill();

        // Rotating inner runic hexagram geometry
        ctx.rotate(b.rotation + time * 2.2);
        ctx.strokeStyle = "#FFF1D6";
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        for (let k = 0; k < 6; k++) {
          const a = (k * Math.PI * 2) / 6;
          const r = b.radius * 0.78;
          if (k === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
          else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
        }
        ctx.closePath();
        ctx.stroke();

        // Progress sweep ring around outer edge
        ctx.strokeStyle = "#FFF7E6";
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.arc(0, 0, b.radius + 4, -Math.PI * 0.5, -Math.PI * 0.5 + progress * Math.PI * 2);
        ctx.stroke();

        ctx.restore();
      } else {
        // MASSIVE BLAZING VERTICAL SKY-BEAM!
        const alpha = Math.min(1, b.activeTimer / 0.14);
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        ctx.globalAlpha = alpha;

        // Outer amber-rose atmospheric column
        const outerGrad = ctx.createLinearGradient(b.x - b.radius * 1.45, 0, b.x + b.radius * 1.45, 0);
        outerGrad.addColorStop(0, "rgba(255, 184, 112, 0)");
        outerGrad.addColorStop(0.22, "rgba(255, 130, 120, 0.45)");
        outerGrad.addColorStop(0.5, "rgba(255, 245, 224, 0.98)");
        outerGrad.addColorStop(0.78, "rgba(255, 130, 120, 0.45)");
        outerGrad.addColorStop(1, "rgba(255, 184, 112, 0)");
        ctx.fillStyle = outerGrad;
        ctx.fillRect(b.x - b.radius * 1.45, 0, b.radius * 2.9, GROUND_Y + 4);

        // Blazing white-gold inner core pillar
        ctx.fillStyle = "#FFFBF0";
        ctx.fillRect(b.x - b.radius * 0.28, 0, b.radius * 0.56, GROUND_Y + 4);

        // Ground impact bloom
        const impactBloom = ctx.createRadialGradient(
          b.x,
          GROUND_Y,
          4,
          b.x,
          GROUND_Y,
          b.radius * 1.8
        );
        impactBloom.addColorStop(0, "rgba(255, 250, 236, 0.95)");
        impactBloom.addColorStop(0.45, "rgba(255, 184, 112, 0.55)");
        impactBloom.addColorStop(1, "rgba(255, 184, 112, 0)");
        ctx.fillStyle = impactBloom;
        ctx.beginPath();
        ctx.ellipse(b.x, GROUND_Y, b.radius * 1.8, 22, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }
    };

    // Phase 3 Attack: Sweeping Plasma Orbs with Smoke & Spark Ribbon Tails
    const drawPlasmaOrb = (o: PlasmaOrb, isReflection: boolean) => {
      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      // Tapered luminous plasma tail
      if (o.trail.length > 1) {
        for (let i = 1; i < o.trail.length; i++) {
          const prev = o.trail[i - 1];
          const curr = o.trail[i];
          const frac = i / o.trail.length;
          ctx.strokeStyle = `rgba(255, 117, 151, ${(frac * 0.65).toFixed(2)})`;
          ctx.lineWidth = frac * o.radius * 1.1;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(prev.x, prev.y);
          ctx.lineTo(curr.x, curr.y);
          ctx.stroke();
        }
      }

      // Outer crimson-lavender halo
      const orbGrad = ctx.createRadialGradient(o.x, o.y, 2, o.x, o.y, o.radius * 2.1);
      orbGrad.addColorStop(0, "#FFFFFF");
      orbGrad.addColorStop(0.32, "#FF9EB8");
      orbGrad.addColorStop(0.65, "rgba(255, 117, 151, 0.45)");
      orbGrad.addColorStop(1, "rgba(255, 117, 151, 0)");
      ctx.fillStyle = orbGrad;
      ctx.beginPath();
      ctx.arc(o.x, o.y, o.radius * 2.1, 0, Math.PI * 2);
      ctx.fill();

      // Core orb crystal
      if (!isReflection) {
        ctx.fillStyle = "#FFF6F9";
        ctx.beginPath();
        ctx.arc(o.x, o.y, o.radius * 0.52, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    };

    // Main 60fps Frame Loop
    const frame = (now: number) => {
      const rawDt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;
      const s = simRef.current;
      const fp = forgeProfileRef.current;
      const time = now * 0.001;

      // 45ms Hit-Stop freeze & 0.35x Perfect Dodge Slow-Motion time dilation!
      if (s.hitStopTimer > 0) {
        s.hitStopTimer = Math.max(0, s.hitStopTimer - rawDt);
      }
      if (s.slowMoTimer > 0) {
        s.slowMoTimer = Math.max(0, s.slowMoTimer - rawDt);
      }

      const timeScale =
        s.hitStopTimer > 0
          ? 0.06
          : s.status === "SHATTERING"
          ? 0.26
          : s.slowMoTimer > 0
          ? 0.35
          : 1.0;

      const dt = rawDt * timeScale;

      // Update directional micro screen-shake & HUD delayed damage-drain bar (always smooth!)
      if (s.shakeMag > 0.1) {
        s.shakeMag = Math.max(0, s.shakeMag - rawDt * 34);
      }
      if (s.screenEdgeFlash > 0) {
        s.screenEdgeFlash = Math.max(0, s.screenEdgeFlash - rawDt * 1.45);
      }
      if (s.bossTrailHold > 0) {
        s.bossTrailHold = Math.max(0, s.bossTrailHold - rawDt);
      } else if (s.bossTrailHp > s.bossHp) {
        s.bossTrailHp = Math.max(s.bossHp, s.bossTrailHp - rawDt * 340);
      }

      if (s.status === "FIGHTING" || s.status === "SHATTERING") {
        if (s.status === "FIGHTING") {
          s.elapsed += rawDt;
        } else {
          s.shatterTimer -= rawDt;
          if (s.shatterTimer <= 0) {
            s.status = "VICTORY";
            const clearSec = Number(s.elapsed.toFixed(1));
            setFinalTime(clearSec);
            setPhase("VICTORY");
            onTrialVictoryRef.current(clearSec);
          }
        }

        if (s.phaseBannerTimer > 0) {
          s.phaseBannerTimer = Math.max(0, s.phaseBannerTimer - rawDt);
          if (s.phaseBannerTimer === 0) {
            s.phaseBannerTitle = "";
            s.phaseBannerSub = "";
          }
        }
        if (s.iFrames > 0) s.iFrames = Math.max(0, s.iFrames - dt);
        if (s.damageFlash > 0) s.damageFlash = Math.max(0, s.damageFlash - rawDt * 3.5);
        if (s.dashCooldown > 0) s.dashCooldown = Math.max(0, s.dashCooldown - dt);
        if (s.axeFlourish > 0) s.axeFlourish = Math.max(0, s.axeFlourish - dt);
        if (s.bossHitFlash > 0) s.bossHitFlash = Math.max(0, s.bossHitFlash - rawDt);
        if (s.bossShardFlare > 0) s.bossShardFlare = Math.max(0, s.bossShardFlare - rawDt * 2.4);
        if (s.bossWindup > 0) s.bossWindup = Math.max(0, s.bossWindup - dt * 2.1);

        // 1. Hero Movement, Dash Physics & Natural Cloak Update
        let moveFactor = 0;
        if (s.status === "FIGHTING") {
          let moveDir = 0;
          if (s.keys.left || s.touch.left) moveDir -= 1;
          if (s.keys.right || s.touch.right) moveDir += 1;
          if (moveDir !== 0 && s.dashTimer <= 0) s.facing = moveDir as 1 | -1;

          const baseSpd = 305;
          const dashSpd = 700;
          let targetVx = moveDir * baseSpd;

          if (s.dashTimer > 0) {
            s.dashTimer = Math.max(0, s.dashTimer - dt);
            targetVx = s.facing * dashSpd;
            s.dashGhostTick += dt;
            // Spawn 3 cleanly spaced translucent frost silhouettes during dash
            if (s.dashGhostTick >= 0.068) {
              s.dashGhostTick = 0;
              s.ghosts.push({
                x: s.px,
                facing: s.facing,
                stride: s.stride,
                cape: s.cape.map((n) => ({ ...n })),
                life: 0.28,
                maxLife: 0.28,
                golden: s.goldenCharge,
              });
              if (s.ghosts.length > 3) s.ghosts.shift();
            }
          }

          s.vx += (targetVx - s.vx) * Math.min(1, 17 * dt);
          s.px = Math.max(46, Math.min(ARENA_W - 46, s.px + s.vx * dt));
          moveFactor = Math.min(1, Math.abs(s.vx) / 240);
          if (Math.abs(s.vx) > 15) s.stride += dt * (Math.abs(s.vx) * 0.044);
        }

        s.breath += dt;
        updateNaturalCloakNodes(
          s.cape,
          s.px,
          s.facing,
          moveFactor,
          s.dashTimer > 0,
          s.breath,
          dt
        );

        // 2. Sculpted Spinning Leviathan War-Axe Physics (14-point tapered luminous trail!)
        const handX = s.px + s.facing * 16;
        const handY = GROUND_Y - 44;

        if (s.bladeMode === "HAND") {
          s.bx = handX;
          s.by = handY;
          s.bRot = 0;
          s.bladeTrail = [];
        } else if (s.bladeMode === "FLYING_OUT") {
          s.bx += s.bvx * dt;
          s.by += s.bvy * dt;
          s.bRot += dt * 26;
          s.bladeTrail.push({ x: s.bx, y: s.by });
          if (s.bladeTrail.length > MAX_AXE_TRAIL) s.bladeTrail.shift();

          if (!s.bladeHitThisFlight && s.status === "FIGHTING") {
            const distToBoss = Math.hypot(s.bx - s.bossX, s.by - s.bossY);
            if (distToBoss < 64) {
              s.bladeHitThisFlight = true;
              damageBoss(85, false);
              if (s.shieldActive && s.shieldStunTimer <= 0) {
                // Deflect upward & back slightly if hitting the front Aegis
                s.bvx *= -0.32;
                s.bvy = -135;
              }
            }
          }

          const hitWall =
            s.bx < 34 || s.bx > ARENA_W - 34 || s.by < 54 || s.by > GROUND_Y - 14;
          if (hitWall) {
            s.bx = Math.max(34, Math.min(ARENA_W - 34, s.bx));
            s.by = Math.max(54, Math.min(GROUND_Y - 14, s.by));
            s.bladeMode = "EMBEDDED";
            s.bvx = 0;
            s.bvy = 0;
            spawnShockRing(s.bx, s.by, 34, "#A5E8FF", 0.34, 1.8);
            spawnBurst(s.bx, s.by, 10, "#A5E8FF", 40, 115, "spark");
          }
        } else if (s.bladeMode === "EMBEDDED") {
          s.bRot += dt * 2.8;
          if (s.bladeTrail.length > 0 && Math.random() < 0.35) {
            s.bladeTrail.shift();
          }
        } else if (s.bladeMode === "RECALLING") {
          const dx = handX - s.bx;
          const dy = handY - s.by;
          const dist = Math.hypot(dx, dy);
          const pullSpeed = s.bladeIsGolden ? 1240 : 1100;

          if (dist < 30) {
            s.bladeMode = "HAND";
            s.bx = handX;
            s.by = handY;
            s.bladeIsGolden = false;
            s.axeFlourish = 0.28;
            triggerShake(-s.facing, 0, 3.8);
            retroAudio.playBladeCatch();
            spawnShockRing(handX, handY, 38, "#98F5E1", 0.28, 2.2);
            spawnBurst(handX, handY, 16, "#98F5E1", 65, 185, "spark");
            spawnBurst(handX, handY, 8, "#FFE08A", 45, 130, "spark");
          } else {
            s.bx += (dx / dist) * pullSpeed * dt;
            s.by += (dy / dist) * pullSpeed * dt;
            s.bRot -= dt * 34;
            s.bladeTrail.push({ x: s.bx, y: s.by });
            if (s.bladeTrail.length > MAX_AXE_TRAIL) s.bladeTrail.shift();

            if (!s.bladeHitThisFlight && s.status === "FIGHTING") {
              const distToBoss = Math.hypot(s.bx - s.bossX, s.by - s.bossY);
              if (distToBoss < 68) {
                s.bladeHitThisFlight = true;
                damageBoss(120, true);
              }
            }
          }
        }

        // 3. Boss AI, Tracking Eye & 3 High-Impact Phases
        if (s.status === "FIGHTING") {
          // Smooth eye tracking toward hero center
          const eyeDx = s.px - s.bossX;
          const eyeDy = GROUND_Y - 46 - s.bossY;
          const eyeLen = Math.hypot(eyeDx, eyeDy) || 1;
          const targetEyeX = (eyeDx / eyeLen) * 7.5;
          const targetEyeY = (eyeDy / eyeLen) * 6.5;
          s.bossEyeX += (targetEyeX - s.bossEyeX) * Math.min(1, dt * 8);
          s.bossEyeY += (targetEyeY - s.bossEyeY) * Math.min(1, dt * 8);

          // Front Aegis Shield faces player side
          s.shieldSide = s.px < s.bossX ? -1 : 1;

          if (s.shieldStunTimer > 0) {
            s.shieldStunTimer = Math.max(0, s.shieldStunTimer - dt);
            s.bossY = GROUND_Y - 122 + Math.sin(time * 9) * 3;
            if (s.shieldStunTimer === 0 && s.bossPhase === 3) {
              s.shieldActive = true;
              triggerPhaseBanner("AEGIS RESTORED", "FLANK WITH AXE RECALL", "#FF7597");
            }
          } else {
            s.bossMoveTimer -= dt;
            if (s.bossMoveTimer <= 0) {
              s.bossMoveTimer = 2.4 + Math.random() * 1.4;
              s.bossTargetX =
                s.bossPhase === 3
                  ? 280 + Math.random() * 300
                  : 230 + Math.random() * 460;
            }
            s.bossX += (s.bossTargetX - s.bossX) * Math.min(1, dt * 1.5);
            s.bossY = GROUND_Y - 142 + Math.sin(time * 2.1) * 9;

            // Pull shards inward subtly just before unleashing an attack
            if (s.attackTimer < 0.42 && s.attackTimer > 0) {
              s.bossWindup = Math.min(1, s.bossWindup + dt * 3.8);
            }

            s.attackTimer -= dt;
            if (s.attackTimer <= 0) {
              s.bossWindup = 0;
              if (s.bossPhase === 1) {
                // PHASE 1: THE RACE CONDITION — Crackling Jagged Ground Shockwave Fissures
                s.attackTimer = 1.62;
                const dir: 1 | -1 = s.px < s.bossX ? -1 : 1;
                s.fissures.push({
                  x: s.bossX + dir * 28,
                  vx: dir * 355,
                  dir,
                  width: 52,
                  height: 50,
                  age: 0,
                  seed: Math.random() * 50,
                  hitPlayer: false,
                  dodged: false,
                });
                spawnBurst(s.bossX + dir * 24, GROUND_Y - 8, 12, "#C8B6FF", 65, 165, "spark");
                triggerShake(0, 1, 3.2);
              } else if (s.bossPhase === 2) {
                // PHASE 2: O(N²) OVERLOAD — Intricate Floor Rune Seals (0.85s) -> Vertical Sky-Beams
                s.attackTimer = 2.1;
                const targets = [
                  Math.max(76, Math.min(ARENA_W - 76, s.px)),
                  Math.max(76, Math.min(ARENA_W - 76, s.px + (Math.random() > 0.5 ? 150 : -150))),
                  Math.max(76, Math.min(ARENA_W - 76, 130 + Math.random() * (ARENA_W - 260))),
                ];
                targets.forEach((bx) => {
                  s.beams.push({
                    x: bx,
                    telegraph: 0.85,
                    maxTelegraph: 0.85,
                    activeTimer: 0.36,
                    radius: 40,
                    hitPlayer: false,
                    dodged: false,
                    rotation: Math.random() * Math.PI * 2,
                  });
                });
              } else {
                // PHASE 3: PRODUCTION OUTAGE — Sweeping Plasma Orbs + Ground Pressure
                s.attackTimer = 1.85;
                const targetY = GROUND_Y - 38;
                const dx = s.px - s.bossX;
                const dy = targetY - s.bossY;
                const baseAng = Math.atan2(dy, dx);
                // Fan of 2 sweeping plasma orbs with slight arc spread
                [-0.14, 0.14].forEach((offset, idx) => {
                  const ang = baseAng + offset;
                  const spd = 330 + idx * 45;
                  s.orbs.push({
                    x: s.bossX + Math.cos(ang) * 38,
                    y: s.bossY + Math.sin(ang) * 38,
                    vx: Math.cos(ang) * spd,
                    vy: Math.sin(ang) * spd,
                    radius: 13,
                    age: 0,
                    hitPlayer: false,
                    dodged: false,
                    trail: [],
                  });
                });
                spawnBurst(s.bossX, s.bossY, 14, "#FF7597", 60, 165, "spark");
              }
            }
          }
        }

        // Update Phase 1 Ground Fissures
        for (let i = s.fissures.length - 1; i >= 0; i--) {
          const f = s.fissures[i];
          f.x += f.vx * dt;
          f.age += dt;
          if (Math.random() < 0.55) {
            s.particles.push({
              x: f.x + (Math.random() - 0.5) * 26,
              y: GROUND_Y - 2,
              vx: -f.dir * (30 + Math.random() * 55),
              vy: -(45 + Math.random() * 95),
              life: 0.32,
              maxLife: 0.32,
              size: 1.6 + Math.random() * 1.8,
              color: Math.random() > 0.4 ? "#C8B6FF" : "#FF7597",
              kind: "spark",
            });
          }
          if (
            !f.hitPlayer &&
            Math.abs(f.x - s.px) < f.width * 0.48 + 10 &&
            s.status === "FIGHTING"
          ) {
            if (s.dashTimer > 0 && !f.dodged) {
              f.dodged = true;
              triggerPerfectDodge();
            } else if (s.iFrames <= 0) {
              f.hitPlayer = true;
              damagePlayer(18, f.x);
            }
          }
          if (f.x < -90 || f.x > ARENA_W + 90) s.fissures.splice(i, 1);
        }

        // Update Phase 2 Rune Sky-Beams
        for (let i = s.beams.length - 1; i >= 0; i--) {
          const b = s.beams[i];
          if (b.telegraph > 0) {
            b.telegraph = Math.max(0, b.telegraph - dt);
            if (b.telegraph === 0) {
              s.screenEdgeFlash = 0.45;
              s.screenEdgeColor = "#FFB870";
              triggerShake(0, 1, 5.5);
              spawnShockRing(b.x, GROUND_Y, b.radius * 1.7, "#FFB870", 0.38, 2.4);
              spawnBurst(b.x, GROUND_Y - 4, 18, "#FFB870", 75, 220, "spark");
            }
          } else {
            b.activeTimer -= dt;
            // Rising embers along active beam
            if (Math.random() < 0.65) {
              s.particles.push({
                x: b.x + (Math.random() - 0.5) * b.radius,
                y: GROUND_Y - Math.random() * 60,
                vx: (Math.random() - 0.5) * 40,
                vy: -(120 + Math.random() * 160),
                life: 0.4,
                maxLife: 0.4,
                size: 2.0,
                color: "#FFE08A",
                kind: "spark",
              });
            }
            if (
              !b.hitPlayer &&
              Math.abs(b.x - s.px) < b.radius * 0.92 &&
              s.status === "FIGHTING"
            ) {
              if (s.dashTimer > 0 && !b.dodged) {
                b.dodged = true;
                triggerPerfectDodge();
              } else if (s.iFrames <= 0) {
                b.hitPlayer = true;
                damagePlayer(22, b.x);
              }
            }
            if (b.activeTimer <= 0) s.beams.splice(i, 1);
          }
        }

        // Update Phase 3 Sweeping Plasma Orbs
        for (let i = s.orbs.length - 1; i >= 0; i--) {
          const o = s.orbs[i];
          o.age += dt;
          // Gentle homing weave toward ground combat lane
          o.x += o.vx * dt;
          o.y += o.vy * dt + Math.sin(o.age * 7) * 28 * dt;
          o.trail.push({ x: o.x, y: o.y });
          if (o.trail.length > 10) o.trail.shift();

          if (Math.random() < 0.45) {
            s.particles.push({
              x: o.x,
              y: o.y,
              vx: -o.vx * 0.12 + (Math.random() - 0.5) * 25,
              vy: -o.vy * 0.12 - 12,
              life: 0.34,
              maxLife: 0.34,
              size: 3.2,
              color: "rgba(200, 182, 255, 0.35)",
              kind: "smoke",
            });
          }

          const distHero = Math.hypot(o.x - s.px, o.y - (GROUND_Y - 38));
          if (!o.hitPlayer && distHero < o.radius + 20 && s.status === "FIGHTING") {
            if (s.dashTimer > 0 && !o.dodged) {
              o.dodged = true;
              triggerPerfectDodge();
            } else if (s.iFrames <= 0) {
              o.hitPlayer = true;
              damagePlayer(17, o.x);
              spawnBurst(o.x, o.y, 14, "#FF7597", 60, 180, "spark");
              s.orbs.splice(i, 1);
              continue;
            }
          }

          if (o.y >= GROUND_Y - 4) {
            spawnBurst(o.x, GROUND_Y - 4, 12, "#FF7597", 55, 160, "spark");
            s.orbs.splice(i, 1);
            continue;
          }
          if (o.x < -60 || o.x > ARENA_W + 60 || o.y < -60) {
            s.orbs.splice(i, 1);
          }
        }

        // Update Ghosts, Particles, Rings, Floating Cinzel Damage Numbers
        for (let i = s.ghosts.length - 1; i >= 0; i--) {
          s.ghosts[i].life -= rawDt;
          if (s.ghosts[i].life <= 0) s.ghosts.splice(i, 1);
        }
        for (let i = s.rings.length - 1; i >= 0; i--) {
          const r = s.rings[i];
          r.life -= rawDt;
          const p = 1 - r.life / r.maxLife;
          r.radius = 14 + (r.maxRadius - 14) * (1 - Math.pow(1 - p, 2.4));
          if (r.life <= 0) s.rings.splice(i, 1);
        }
        for (let i = s.floats.length - 1; i >= 0; i--) {
          const fl = s.floats[i];
          fl.y += fl.vy * rawDt;
          fl.vy *= 0.94;
          fl.life -= rawDt;
          if (fl.life <= 0) s.floats.splice(i, 1);
        }
        for (let i = s.particles.length - 1; i >= 0; i--) {
          const p = s.particles[i];
          p.life -= dt;
          if (p.life <= 0) {
            s.particles.splice(i, 1);
            continue;
          }
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          if (p.kind !== "smoke") {
            p.vy += (p.kind === "shard" || p.kind === "hexShard" ? 290 : 150) * dt;
          }
          if (p.y > GROUND_Y && (p.kind === "shard" || p.kind === "hexShard")) {
            p.y = GROUND_Y;
            p.vy *= -0.38;
            p.vx *= 0.72;
          }
          if (p.rotation !== undefined && p.vRot !== undefined) {
            p.rotation += p.vRot * dt;
          }
        }

        // Sync HUD (~18Hz)
        if (now - s.lastHudSync > 55) {
          s.lastHudSync = now;
          const info = PHASE_COLORS[s.bossPhase] ?? PHASE_COLORS[1];
          setHudState({
            playerHp: s.hp,
            bossHp: s.bossHp,
            bossTrailHp: s.bossTrailHp,
            bossPhase: s.bossPhase,
            bossPhaseName: info.name,
            bladeMode: s.bladeMode,
            goldenCharged: s.goldenCharge,
            shieldActive: s.shieldActive && s.shieldStunTimer <= 0,
            shieldStunned: s.shieldStunTimer > 0,
            elapsed: s.elapsed,
            phaseBannerTitle: s.phaseBannerTitle,
            phaseBannerSub: s.phaseBannerSub,
            phaseBannerColor: s.phaseBannerColor,
          });
        }
      }

      // Always drift ambient sanctuary ash/frost
      for (const a of s.ash) {
        a.x += (a.vx + Math.sin(time * 0.9 + a.phase) * 8) * rawDt;
        a.y += a.vy * rawDt;
        if (a.y > GROUND_Y) {
          a.y = -6;
          a.x = Math.random() * ARENA_W;
        }
        if (a.x < -10) a.x = ARENA_W + 8;
      }

      // =====================================================================
      // RENDER CINEMATIC NORDIC SANCTUARY ARENA
      // =====================================================================
      ctx.save();
      if (s.shakeMag > 0.2) {
        const jitterX = (Math.random() - 0.5) * s.shakeMag * 0.65;
        const jitterY = (Math.random() - 0.5) * s.shakeMag * 0.65;
        ctx.translate(s.shakeX * (s.shakeMag / 8) + jitterX, s.shakeY * (s.shakeMag / 8) + jitterY);
      }

      // 1. Sanctuary Twilight Vault Backdrop
      const skyGrad = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
      skyGrad.addColorStop(0, "#04060D");
      skyGrad.addColorStop(0.55, "#0B1022");
      skyGrad.addColorStop(1, "#141B34");
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, ARENA_W, ARENA_H);

      // Slow-motion frost time-dilation tint
      if (s.slowMoTimer > 0) {
        ctx.fillStyle = `rgba(165, 232, 255, ${(s.slowMoTimer / 0.44) * 0.12})`;
        ctx.fillRect(0, 0, ARENA_W, ARENA_H);
      }

      // 2. Volumetric Moonlight Shafts Angled Downward ('lighter' blend)
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      const shafts = [
        { topX: 165, botX: 95, w: 96, alpha: 0.055 },
        { topX: 430, botX: 350, w: 135, alpha: 0.075 },
        { topX: 700, botX: 625, w: 112, alpha: 0.06 },
      ];
      for (const sh of shafts) {
        const sway = Math.sin(time * 0.4 + sh.topX) * 10;
        const grad = ctx.createLinearGradient(sh.topX, 0, sh.botX, GROUND_Y);
        grad.addColorStop(0, `rgba(165, 232, 255, ${sh.alpha})`);
        grad.addColorStop(0.55, `rgba(230, 201, 153, ${sh.alpha * 0.42})`);
        grad.addColorStop(1, "rgba(6, 8, 14, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(sh.topX - sh.w * 0.35 + sway, 0);
        ctx.lineTo(sh.topX + sh.w * 0.35 + sway, 0);
        ctx.lineTo(sh.botX + sh.w * 0.72 + sway, GROUND_Y);
        ctx.lineTo(sh.botX - sh.w * 0.72 + sway, GROUND_Y);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      // 3. Towering Weathered Obsidian Temple Pillars with Faint Glowing Vertical Rune Carvings
      const pillarXs = [72, 224, 382, 540, 696, 816];
      const phaseTint = (PHASE_COLORS[s.bossPhase] ?? PHASE_COLORS[1]).main;
      for (let i = 0; i < pillarXs.length; i++) {
        const px = pillarXs[i];
        const pw = i % 2 === 0 ? 44 : 34;
        const brokenTop = i === 1 || i === 4 ? 46 : 0;

        const pilGrad = ctx.createLinearGradient(px - pw / 2, 0, px + pw / 2, 0);
        pilGrad.addColorStop(0, "#090D1A");
        pilGrad.addColorStop(0.5, "#11172B");
        pilGrad.addColorStop(1, "#070A14");
        ctx.fillStyle = pilGrad;
        ctx.beginPath();
        ctx.moveTo(px - pw * 0.56, GROUND_Y);
        ctx.lineTo(px - pw * 0.46, brokenTop);
        ctx.lineTo(px + pw * 0.46, brokenTop + (brokenTop ? 12 : 0));
        ctx.lineTo(px + pw * 0.56, GROUND_Y);
        ctx.closePath();
        ctx.fill();

        // Moonlit vertical stone rim
        ctx.fillStyle = "rgba(165, 232, 255, 0.08)";
        ctx.fillRect(px - pw * 0.45, brokenTop, 1.5, GROUND_Y - brokenTop);

        // Faint glowing vertical carved runes down each pillar
        ctx.save();
        const runeAlpha = 0.14 + 0.09 * Math.sin(time * 1.8 + i * 1.2);
        ctx.fillStyle = phaseTint;
        ctx.globalAlpha = runeAlpha;
        ctx.font = "600 11px Georgia, serif";
        ctx.textAlign = "center";
        for (let r = 0; r < 5; r++) {
          const ry = 104 + r * 48;
          if (ry < brokenTop + 26) continue;
          ctx.fillText(HALO_RUNES[(i + r) % HALO_RUNES.length], px, ry);
        }
        ctx.restore();
      }

      // Atmospheric Low-Lying Sanctuary Mist Drifting Above Floor
      for (let m = 0; m < 3; m++) {
        const mx = ((time * (14 + m * 6) + m * 310) % (ARENA_W + 320)) - 160;
        const mistGrad = ctx.createRadialGradient(mx, GROUND_Y - 10, 12, mx, GROUND_Y - 10, 210);
        mistGrad.addColorStop(0, "rgba(165, 232, 255, 0.07)");
        mistGrad.addColorStop(1, "rgba(6, 8, 14, 0)");
        ctx.fillStyle = mistGrad;
        ctx.fillRect(0, GROUND_Y - 82, ARENA_W, 86);
      }

      // 4. Reflective Carved Obsidian Stone Floor + REAL-TIME SOFT REFLECTIONS
      const floorGrad = ctx.createLinearGradient(0, GROUND_Y, 0, ARENA_H);
      floorGrad.addColorStop(0, "#10162A");
      floorGrad.addColorStop(0.55, "#090D18");
      floorGrad.addColorStop(1, "#05070E");
      ctx.fillStyle = floorGrad;
      ctx.fillRect(0, GROUND_Y, ARENA_W, ARENA_H - GROUND_Y);

      // Clipped Real-Time Inverted Floor Reflection Pass
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, GROUND_Y, ARENA_W, ARENA_H - GROUND_Y);
      ctx.clip();

      ctx.save();
      ctx.translate(0, GROUND_Y + GROUND_Y * 0.45);
      ctx.scale(1, -0.45);
      ctx.globalAlpha = 0.28;

      drawLegacyMonolith(s, time, true);
      for (const f of s.fissures) drawGroundFissure(f, time, true);
      for (const b of s.beams) drawRuneSkyBeam(b, time, true);
      for (const o of s.orbs) drawPlasmaOrb(o, true);
      drawCyberNordicHero(ctx, {
        sx: s.px,
        groundY: GROUND_Y,
        facing: s.facing,
        stride: s.stride,
        moveFactor: Math.min(1, Math.abs(s.vx) / 240),
        breath: s.breath,
        axeFlourish: s.axeFlourish,
        capeNodes: s.cape,
        cameraX: 0,
        forgeProfile: fp,
        alpha: 0.34,
        isReflection: true,
        isDashing: s.dashTimer > 0,
        hideWeapon: s.bladeMode !== "HAND",
        isGoldenCharged: s.goldenCharge,
      });
      ctx.restore();

      // Subtle Perspective Stone Floor Lines
      ctx.strokeStyle = "rgba(165, 232, 255, 0.065)";
      ctx.lineWidth = 1;
      for (let tx = -40; tx <= ARENA_W + 40; tx += 74) {
        ctx.beginPath();
        ctx.moveTo(tx, GROUND_Y);
        ctx.lineTo(tx + (tx - ARENA_W * 0.5) * 0.34, ARENA_H);
        ctx.stroke();
      }
      // Horizontal floor stone seam
      ctx.beginPath();
      ctx.moveTo(0, GROUND_Y + 26);
      ctx.lineTo(ARENA_W, GROUND_Y + 26);
      ctx.stroke();

      // Reflection depth fade veil
      const reflFade = ctx.createLinearGradient(0, GROUND_Y, 0, ARENA_H);
      reflFade.addColorStop(0, "rgba(6, 8, 14, 0.14)");
      reflFade.addColorStop(1, "rgba(5, 7, 14, 0.92)");
      ctx.fillStyle = reflFade;
      ctx.fillRect(0, GROUND_Y, ARENA_W, ARENA_H - GROUND_Y);
      ctx.restore(); // end floor clip

      // Glowing Sanctuary Horizon Edge
      const floorEdgeGrad = ctx.createLinearGradient(0, GROUND_Y, ARENA_W, GROUND_Y);
      floorEdgeGrad.addColorStop(0, "rgba(165,232,255,0.12)");
      floorEdgeGrad.addColorStop(0.5, `${phaseTint}88`);
      floorEdgeGrad.addColorStop(1, "rgba(165,232,255,0.12)");
      ctx.strokeStyle = floorEdgeGrad;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(0, GROUND_Y + 0.5);
      ctx.lineTo(ARENA_W, GROUND_Y + 0.5);
      ctx.stroke();

      // 5. Render Boss Attacks (Rune Sky-Beams, Ground Fissures, Plasma Orbs)
      for (const b of s.beams) drawRuneSkyBeam(b, time, false);
      for (const f of s.fissures) drawGroundFissure(f, time, false);
      for (const o of s.orbs) drawPlasmaOrb(o, false);

      // 6. Render Multi-Part Animated Boss: THE LEGACY MONOLITH
      drawLegacyMonolith(s, time, false);

      // 7. Render 3 Translucent Glowing Frost Hero Dash Silhouettes (NEVER grey boxes!)
      for (const g of s.ghosts) {
        drawCyberNordicHero(ctx, {
          sx: g.x,
          groundY: GROUND_Y,
          facing: g.facing,
          stride: g.stride,
          moveFactor: 1,
          breath: s.breath,
          axeFlourish: 0,
          capeNodes: g.cape,
          cameraX: 0,
          forgeProfile: fp,
          alpha: (g.life / g.maxLife) * 0.42,
          isGhost: true,
          isDashing: true,
          hideWeapon: s.bladeMode !== "HAND",
          isGoldenCharged: g.golden,
        });
      }

      // 8. Render Crisp Articulated Cyber-Nordic Architect Hero (NEVER blinks invisible!)
      drawCyberNordicHero(ctx, {
        sx: s.px,
        groundY: GROUND_Y,
        facing: s.facing,
        stride: s.stride,
        moveFactor: Math.min(1, Math.abs(s.vx) / 240),
        breath: s.breath,
        axeFlourish: s.axeFlourish,
        capeNodes: s.cape,
        cameraX: 0,
        forgeProfile: fp,
        alpha: 1,
        isGhost: false,
        isDashing: s.dashTimer > 0,
        hideWeapon: s.bladeMode !== "HAND",
        isGoldenCharged: s.goldenCharge,
        damageFlash: s.damageFlash,
      });

      // 9. Tapered 14-Point Luminous Ribbon Trail & Sculpted Spinning Leviathan War-Axe (When Thrown / Recalling)
      if (s.bladeMode !== "HAND") {
        // Ethereal frost tether when embedded/hovering in mid-air
        if (s.bladeMode === "EMBEDDED") {
          ctx.save();
          const pulse = 0.28 + 0.25 * Math.sin(time * 7);
          ctx.strokeStyle = s.bladeIsGolden
            ? `rgba(255, 224, 138, ${pulse})`
            : `rgba(152, 245, 225, ${pulse})`;
          ctx.setLineDash([5, 6]);
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(s.px + s.facing * 18, GROUND_Y - 46);
          ctx.lineTo(s.bx, s.by);
          ctx.stroke();
          ctx.setLineDash([]);

          // Pulsing hover beacon ring
          ctx.strokeStyle = s.bladeIsGolden ? "#FFE08A" : "#98F5E1";
          ctx.globalAlpha = 0.45 + 0.4 * Math.sin(time * 8);
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.arc(s.bx, s.by, 26 + Math.sin(time * 8) * 3.5, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }

        // Tapered Luminous Ribbon Trail (tracking last 14 positions)
        if (s.bladeTrail.length > 1) {
          ctx.save();
          ctx.globalCompositeOperation = "lighter";
          const isRecall = s.bladeMode === "RECALLING";
          const trailColor = s.bladeIsGolden
            ? "#FFE08A"
            : isRecall
            ? "#98F5E1"
            : fp.bladePrimary;

          for (let i = 1; i < s.bladeTrail.length; i++) {
            const p0 = s.bladeTrail[i - 1];
            const p1 = s.bladeTrail[i];
            const frac = i / s.bladeTrail.length;
            ctx.strokeStyle = trailColor;
            ctx.globalAlpha = frac * (isRecall ? 0.85 : 0.62);
            ctx.lineWidth = frac * (isRecall ? 11 : 7.5);
            ctx.lineCap = "round";
            ctx.beginPath();
            ctx.moveTo(p0.x, p0.y);
            ctx.lineTo(p1.x, p1.y);
            ctx.stroke();
          }

          // White-gold blazing core streak on Recall!
          if (isRecall) {
            ctx.strokeStyle = "#FFF7E2";
            ctx.globalAlpha = 0.88;
            ctx.lineWidth = 2.4;
            ctx.beginPath();
            s.bladeTrail.forEach((pt, idx) => {
              if (idx === 0) ctx.moveTo(pt.x, pt.y);
              else ctx.lineTo(pt.x, pt.y);
            });
            ctx.stroke();
          }
          ctx.restore();
        }

        // Sculpted Single-Sided Leviathan War-Axe Spinning With Circular Frost-Arc Motion Blur
        ctx.save();
        ctx.translate(s.bx, s.by);
        ctx.rotate(s.bRot);
        drawLeviathanWarAxe(ctx, {
          bladePrimary: fp.bladePrimary,
          bladeSecondary: fp.bladeSecondary,
          auraColor: fp.auraColor,
          isGoldenCharged: s.bladeIsGolden,
          isRecalling: s.bladeMode === "RECALLING",
          spinMotionBlur: s.bladeMode === "EMBEDDED" ? 0.2 : 1.0,
          scale: 1.08,
        });
        ctx.restore();
      }

      // 10. Shockwave Rings (Phase Transitions, Perfect Dodge, Shield Shatter, Catch)
      for (const r of s.rings) {
        const a = Math.max(0, r.life / r.maxLife);
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        ctx.strokeStyle = r.color;
        ctx.globalAlpha = a * 0.85;
        ctx.lineWidth = r.lineWidth * a;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // 11. Physics Sparks, Stone Shards, Hex Shield Shards & Falling Sanctuary Ash
      for (const p of s.particles) {
        const a = Math.max(0, p.life / p.maxLife);
        ctx.save();
        ctx.globalAlpha = a;
        ctx.translate(p.x, p.y);
        if (p.rotation) ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;

        if (p.kind === "hexShard") {
          ctx.beginPath();
          for (let v = 0; v < 6; v++) {
            const va = (v * Math.PI) / 3;
            const px = Math.cos(va) * p.size;
            const py = Math.sin(va) * p.size;
            if (v === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = "#FFFFFF";
          ctx.lineWidth = 0.8;
          ctx.stroke();
        } else if (p.kind === "shard") {
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.lineTo(p.size * 0.65, p.size * 0.5);
          ctx.lineTo(-p.size * 0.65, p.size * 0.55);
          ctx.closePath();
          ctx.fill();
        } else if (p.kind === "smoke") {
          ctx.beginPath();
          ctx.arc(0, 0, p.size * (1.4 - a * 0.4), 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // Falling ash & frost embers across foreground
      for (const a of s.ash) {
        ctx.fillStyle = a.isFrost
          ? `rgba(165, 232, 255, ${a.alpha})`
          : `rgba(230, 201, 153, ${a.alpha * 0.85})`;
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // 12. Floating 'Cinzel' Damage Numbers & "PERFECT DODGE" Text
      for (const fl of s.floats) {
        const a = Math.min(1, (fl.life / fl.maxLife) * 1.5);
        ctx.save();
        ctx.globalAlpha = a;
        ctx.font = `700 ${fl.size}px 'Cinzel', Georgia, serif`;
        ctx.textAlign = "center";
        ctx.shadowColor = "rgba(4, 6, 14, 0.95)";
        ctx.shadowBlur = 10;
        ctx.fillStyle = fl.color;
        ctx.fillText(fl.text, fl.x, fl.y);
        ctx.restore();
      }

      // 13. Subtle Screen-Edge Vignette Glow on Heavy Beam / Phase / Damage
      if (s.screenEdgeFlash > 0.02) {
        ctx.save();
        const edgeGrad = ctx.createRadialGradient(
          ARENA_W * 0.5,
          ARENA_H * 0.5,
          ARENA_W * 0.28,
          ARENA_W * 0.5,
          ARENA_H * 0.5,
          ARENA_W * 0.62
        );
        edgeGrad.addColorStop(0, "rgba(0,0,0,0)");
        edgeGrad.addColorStop(1, s.screenEdgeColor);
        ctx.globalAlpha = s.screenEdgeFlash * 0.34;
        ctx.fillStyle = edgeGrad;
        ctx.fillRect(0, 0, ARENA_W, ARENA_H);
        ctx.restore();
      }

      ctx.restore();
      rafId = window.requestAnimationFrame(frame);
    };

    rafId = window.requestAnimationFrame(frame);
    return () => window.cancelAnimationFrame(rafId);
  }, [isOpen]);

  const handleCopyEmail = () => {
    retroAudio.playClick();
    navigator.clipboard.writeText(PORTFOLIO_DATA.profile.email).catch(() => {});
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2200);
  };

  const bossHpPct = Math.max(0, Math.min(100, (hudState.bossHp / BOSS_MAX_HP) * 100));
  const bossTrailPct = Math.max(
    bossHpPct,
    Math.min(100, (hudState.bossTrailHp / BOSS_MAX_HP) * 100)
  );
  const playerHpPct = Math.max(0, Math.min(100, (hudState.playerHp / PLAYER_MAX_HP) * 100));
  const isAxeOut = hudState.bladeMode !== "HAND";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="boss-trial-title"
          className="fixed inset-0 z-[60] flex items-center justify-center p-2 sm:p-5 bg-[#04060D]/90 backdrop-blur-md overflow-y-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl rounded-2xl sm:rounded-3xl bg-[#0A0E1B] border border-[#C8B6FF]/30 shadow-[0_24px_90px_rgba(0,0,0,0.92)] overflow-hidden"
          >
            {/* Top Modal Bar */}
            <div className="px-4 sm:px-6 py-3 bg-[#070A14] border-b border-white/10 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <Swords className="w-4 h-4 text-[#C8B6FF] shrink-0" />
                <div className="min-w-0 text-left">
                  <h2
                    id="boss-trial-title"
                    className="font-mythic text-xs sm:text-base font-bold text-[#F2F4FB] tracking-[0.14em] truncate"
                  >
                    TRIAL OF THE MONOLITH
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {platinumRecord && (
                  <span className="hidden sm:inline-flex items-center gap-1.5 font-mono text-[11px] text-[#E6C999]">
                    <Trophy className="w-3.5 h-3.5" />
                    <span>PLATINUM · {platinumRecord.bestTime.toFixed(1)}s</span>
                  </span>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close Boss Trial"
                  className="min-w-[38px] min-h-[38px] rounded-xl bg-[#13192C] hover:bg-[#1C2440] border border-white/10 text-[#A6B0CF] hover:text-[#F2F4FB] flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* God of War-Style Dramatic Dual Health Bars (Delayed White/Gold Damage-Drain Bar!) */}
            {(phase === "FIGHTING" || phase === "SHATTERING") && (
              <div className="px-3 sm:px-5 py-2.5 bg-[#070B16] border-b border-white/10 grid grid-cols-1 sm:grid-cols-12 gap-2.5 sm:gap-4 items-center">
                {/* Player Vitality */}
                <div className="sm:col-span-4 space-y-1 text-left">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span
                      className={`font-semibold tracking-wider ${
                        hudState.goldenCharged ? "text-[#FFE08A]" : "text-[#98F5E1]"
                      }`}
                    >
                      {hudState.goldenCharged
                        ? "⚡ CRIT CHARGE READY"
                        : isAxeOut
                        ? "❄️ AXE OUT · RECALL"
                        : "ARCHITECT · READY"}
                    </span>
                    <span className="text-[#F2F4FB] tabular-nums">
                      {hudState.playerHp}/{PLAYER_MAX_HP}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-[#12182C] border border-white/10 overflow-hidden">
                    <div
                      className="h-full origin-left transition-transform duration-150"
                      style={{
                        transform: `scaleX(${playerHpPct / 100})`,
                        background: hudState.goldenCharged
                          ? "linear-gradient(90deg, #FFE08A 0%, #98F5E1 100%)"
                          : "linear-gradient(90deg, #98F5E1 0%, #A5E8FF 100%)",
                      }}
                    />
                  </div>
                </div>

                {/* Boss Bar with Delayed White/Gold Damage-Drain Trail & Phase Threshold Notches */}
                <div className="sm:col-span-8 space-y-1 text-left">
                  <div className="flex items-center justify-between gap-2 text-[10px] font-mono">
                    <span
                      className="font-mythic tracking-[0.14em] font-semibold truncate"
                      style={{
                        color:
                          hudState.bossPhase === 1
                            ? "#C8B6FF"
                            : hudState.bossPhase === 2
                            ? "#FFB870"
                            : "#FF7597",
                      }}
                    >
                      THE LEGACY MONOLITH · {hudState.bossPhaseName}
                    </span>
                    <span className="text-[#E6C999] tabular-nums shrink-0">
                      {hudState.elapsed.toFixed(1)}s
                    </span>
                  </div>

                  <div className="relative h-3 rounded-sm bg-[#111629] border border-white/15 overflow-hidden shadow-inner">
                    {/* Delayed White/Gold Damage-Drain Bar */}
                    <div
                      className="absolute inset-0 origin-left transition-transform duration-75"
                      style={{
                        transform: `scaleX(${bossTrailPct / 100})`,
                        background: "linear-gradient(90deg, #FFF4D6 0%, #E6C999 100%)",
                      }}
                    />
                    {/* Actual Live Boss Health Bar */}
                    <div
                      className="relative h-full origin-left transition-transform duration-100"
                      style={{
                        transform: `scaleX(${bossHpPct / 100})`,
                        background:
                          hudState.bossPhase === 1
                            ? "linear-gradient(90deg, #9E88F5 0%, #C8B6FF 65%, #E7DCFF 100%)"
                            : hudState.bossPhase === 2
                            ? "linear-gradient(90deg, #E88B4D 0%, #FFB870 65%, #FFE2B8 100%)"
                            : "linear-gradient(90deg, #D94872 0%, #FF7597 65%, #FFC2D2 100%)",
                      }}
                    />
                    {/* 33% & 66% Phase Threshold Notches */}
                    <span
                      aria-hidden="true"
                      className="absolute top-0 bottom-0 left-[33.3%] w-[2px] bg-[#06080E]/90"
                    />
                    <span
                      aria-hidden="true"
                      className="absolute top-0 bottom-0 left-[66.6%] w-[2px] bg-[#06080E]/90"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Main Interactive Arena Viewport */}
            <div className="relative w-full bg-[#04060D]">
              <canvas
                ref={canvasRef}
                onPointerDown={handleCanvasPointerDown}
                className="block w-full aspect-[860/440] cursor-crosshair touch-none select-none"
                aria-label="Trial of the Monolith boss battle arena"
              />

              {/* Wide Cinematic Translucent 'Cinzel' Phase Transition Banner (Never Obscures Hero!) */}
              <AnimatePresence>
                {(phase === "FIGHTING" || phase === "SHATTERING") && hudState.phaseBannerTitle && (
                  <motion.div
                    key={hudState.phaseBannerTitle}
                    initial={{ opacity: 0, y: -8, scaleX: 0.94 }}
                    animate={{ opacity: 1, y: 0, scaleX: 1 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    className="pointer-events-none absolute top-4 inset-x-4 sm:inset-x-12 flex flex-col items-center text-center"
                  >
                    <div
                      className="w-full max-w-xl py-2 px-4 backdrop-blur-[2px]"
                      style={{
                        background:
                          "linear-gradient(90deg, transparent 0%, rgba(6,8,16,0.72) 22%, rgba(6,8,16,0.72) 78%, transparent 100%)",
                      }}
                    >
                      <div
                        className="h-px w-full mb-1.5 opacity-60"
                        style={{
                          background: `linear-gradient(90deg, transparent 0%, ${hudState.phaseBannerColor} 50%, transparent 100%)`,
                        }}
                      />
                      <p
                        className="font-mythic text-sm sm:text-lg font-bold tracking-[0.22em]"
                        style={{ color: hudState.phaseBannerColor }}
                      >
                        {hudState.phaseBannerTitle}
                      </p>
                      {hudState.phaseBannerSub && (
                        <p className="font-mono text-[9.5px] sm:text-[10.5px] tracking-[0.16em] text-[#D8E0F4]/85 mt-0.5">
                          {hudState.phaseBannerSub}
                        </p>
                      )}
                      <div
                        className="h-px w-full mt-1.5 opacity-60"
                        style={{
                          background: `linear-gradient(90deg, transparent 0%, ${hudState.phaseBannerColor} 50%, transparent 100%)`,
                        }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* BRIEFING OVERLAY */}
              {phase === "BRIEFING" && (
                <div className="absolute inset-0 bg-[#050812]/88 backdrop-blur-sm flex flex-col items-center justify-center p-4 sm:p-6 text-center overflow-y-auto">
                  <div className="max-w-lg space-y-4">
                    <p className="font-mythic text-[10.5px] tracking-[0.22em] text-[#C8B6FF]">
                      SANCTUARY BOSS ENCOUNTER · 3 PHASES
                    </p>
                    <h3 className="font-mythic text-xl sm:text-3xl font-bold text-[#F2F4FB] tracking-[0.08em]">
                      The Legacy Monolith
                    </h3>
                    <p className="text-xs sm:text-sm text-[#A6B0CF] leading-relaxed">
                      Wield your forged{" "}
                      <span className="text-[#98F5E1] font-medium">Leviathan War-Axe</span>: dash
                      through <span className="text-[#C8B6FF]">Race Condition</span> fissures for{" "}
                      <span className="text-[#FFE08A]">Perfect Dodge Crit Charge</span>, evade{" "}
                      <span className="text-[#FFB870]">O(N²) Overload</span> sky-beams, and shatter
                      Phase 3&apos;s <span className="text-[#FF7597]">Aegis Shield</span> by
                      throwing past the Monolith and recalling through its back.
                    </p>

                    <div className="grid grid-cols-3 gap-2 text-[11px] font-mono text-[#D2D9F0] pt-1">
                      <div className="rounded-xl bg-[#101528]/90 border border-white/10 p-2.5">
                        <span className="block text-[#A5E8FF] font-bold">A / D</span>
                        <span>Move</span>
                      </div>
                      <div className="rounded-xl bg-[#101528]/90 border border-white/10 p-2.5">
                        <span className="block text-[#FFE08A] font-bold">SHIFT / SPACE</span>
                        <span>Perfect Dash</span>
                      </div>
                      <div className="rounded-xl bg-[#101528]/90 border border-white/10 p-2.5">
                        <span className="block text-[#98F5E1] font-bold">CLICK / F</span>
                        <span>Throw &amp; Recall</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => resetArena(true)}
                        className="min-h-[46px] px-7 py-2.5 rounded-xl bg-[#98F5E1] hover:bg-[#b5faeb] text-[#06080E] font-space font-bold text-sm inline-flex items-center gap-2 transition-all active:scale-95 cursor-pointer shadow-[0_0_28px_-6px_rgba(152,245,225,0.75)]"
                      >
                        <Swords className="w-4 h-4" />
                        <span>Begin Boss Trial</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* VICTORY OVERLAY + RECRUITER BRIDGE */}
              {phase === "VICTORY" && (
                <div className="absolute inset-0 bg-[#050812]/92 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-6 text-center overflow-y-auto">
                  <div className="max-w-lg space-y-4">
                    <div className="inline-flex items-center gap-2 text-[#E6C999] font-mythic text-xs tracking-[0.2em]">
                      <Trophy className="w-4 h-4" />
                      <span>PLATINUM ARCHITECT UNLOCKED</span>
                    </div>

                    <h3 className="font-mythic text-xl sm:text-3xl font-bold text-[#F2F4FB] tracking-[0.04em] text-balance">
                      Trial Conquered in{" "}
                      <span className="text-[#98F5E1] tabular-nums">{finalTime.toFixed(1)}s</span>
                    </h3>

                    <p className="text-xs sm:text-sm text-[#A6B0CF] leading-relaxed">
                      Ready to build something legendary with Aashish? Your Platinum Architect
                      record is saved locally.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
                      <a
                        href={PORTFOLIO_DATA.profile.links.resumeDriveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => retroAudio.playClick()}
                        className="min-h-[44px] px-4 py-2 rounded-xl bg-[#98F5E1] hover:bg-[#b5faeb] text-[#06080E] font-space font-bold text-xs inline-flex items-center gap-1.5 transition-all active:scale-95"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Resume</span>
                      </a>

                      <button
                        type="button"
                        onClick={handleCopyEmail}
                        className="min-h-[44px] px-4 py-2 rounded-xl bg-[#13192D] hover:bg-[#1B2340] border border-[#C8B6FF]/45 text-[#F2F4FB] font-space font-semibold text-xs inline-flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        {copiedEmail ? (
                          <Check className="w-3.5 h-3.5 text-[#98F5E1]" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-[#C8B6FF]" />
                        )}
                        <span>{copiedEmail ? "COPIED!" : "Copy Email"}</span>
                      </button>

                      <a
                        href={PORTFOLIO_DATA.profile.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => retroAudio.playClick()}
                        className="min-h-[44px] px-4 py-2 rounded-xl bg-[#13192D] hover:bg-[#1B2340] border border-white/15 text-[#F2F4FB] font-mono text-xs inline-flex items-center gap-1.5 transition-colors"
                      >
                        <Github className="w-3.5 h-3.5 text-[#A5E8FF]" />
                        <span>GitHub</span>
                      </a>
                    </div>

                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => resetArena(true)}
                        className="min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-mono text-[#A6B0CF] hover:text-[#F2F4FB] inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Play Again for Faster Time</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* DEFEAT OVERLAY */}
              {phase === "DEFEAT" && (
                <div className="absolute inset-0 bg-[#050812]/90 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-6 text-center">
                  <div className="max-w-md space-y-4">
                    <p className="font-mythic text-xs tracking-[0.2em] text-[#FF7597]">
                      FALL OF THE ARCHITECT
                    </p>
                    <h3 className="font-mythic text-2xl sm:text-3xl font-bold text-[#F2F4FB]">
                      The Monolith Endures
                    </h3>
                    <p className="text-xs sm:text-sm text-[#A6B0CF]">
                      Reached <span className="text-[#FFB870]">{hudState.bossPhaseName}</span>.
                      Dash cleanly through fissures for Golden Crit Charge, and Recall your axe from
                      behind to shatter Phase 3&apos;s Aegis.
                    </p>
                    <button
                      type="button"
                      onClick={() => resetArena(true)}
                      className="min-h-[44px] px-6 py-2.5 rounded-xl bg-[#98F5E1] hover:bg-[#b5faeb] text-[#06080E] font-space font-bold text-sm inline-flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Retry Boss Trial</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Control Dock (Desktop + Mobile 375px Flawless Touch Targets) */}
            <div className="px-3 sm:px-5 py-3 bg-[#070A14] border-t border-white/10 flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex items-center justify-between w-full sm:w-auto gap-2">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button
                    type="button"
                    aria-label="Move left"
                    onPointerDown={(e) => {
                      e.preventDefault();
                      simRef.current.touch.left = true;
                    }}
                    onPointerUp={() => {
                      simRef.current.touch.left = false;
                    }}
                    onPointerLeave={() => {
                      simRef.current.touch.left = false;
                    }}
                    onPointerCancel={() => {
                      simRef.current.touch.left = false;
                    }}
                    className="min-w-[44px] min-h-[44px] rounded-xl bg-[#12182C] active:bg-[#A5E8FF]/25 border border-white/12 text-[#F2F4FB] flex items-center justify-center touch-none select-none cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    type="button"
                    aria-label="Move right"
                    onPointerDown={(e) => {
                      e.preventDefault();
                      simRef.current.touch.right = true;
                    }}
                    onPointerUp={() => {
                      simRef.current.touch.right = false;
                    }}
                    onPointerLeave={() => {
                      simRef.current.touch.right = false;
                    }}
                    onPointerCancel={() => {
                      simRef.current.touch.right = false;
                    }}
                    className="min-w-[44px] min-h-[44px] rounded-xl bg-[#12182C] active:bg-[#A5E8FF]/25 border border-white/12 text-[#F2F4FB] flex items-center justify-center touch-none select-none cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button
                    type="button"
                    onClick={triggerDodgeDash}
                    disabled={phase !== "FIGHTING"}
                    className="min-h-[44px] px-3 sm:px-3.5 rounded-xl bg-[#12182C] hover:bg-[#1B2340] active:scale-95 border border-[#E6C999]/45 text-[#E6C999] font-mythic text-[10px] sm:text-xs font-semibold tracking-[0.12em] inline-flex items-center gap-1.5 touch-none select-none cursor-pointer disabled:opacity-40 whitespace-nowrap"
                  >
                    <Shield className="w-3.5 h-3.5 shrink-0" />
                    <span>DASH</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => triggerThrowOrRecall()}
                    disabled={phase !== "FIGHTING"}
                    className={`min-h-[44px] px-3 sm:px-4 rounded-xl font-mythic text-[10px] sm:text-xs font-bold tracking-[0.12em] inline-flex items-center gap-1.5 touch-none select-none cursor-pointer active:scale-95 disabled:opacity-40 whitespace-nowrap transition-all ${
                      isAxeOut
                        ? "bg-[#98F5E1] text-[#06080E] shadow-[0_0_24px_-2px_rgba(152,245,225,0.85)] animate-pulse"
                        : hudState.goldenCharged
                        ? "bg-[#FFE08A] text-[#06080E] shadow-[0_0_24px_-2px_rgba(255,224,138,0.85)]"
                        : "bg-[#C8B6FF] hover:bg-[#d8caff] text-[#06080E]"
                    }`}
                  >
                    {isAxeOut ? (
                      <>
                        <Snowflake className="w-3.5 h-3.5 shrink-0" />
                        <span>RECALL AXE</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5 shrink-0" />
                        <span>{hudState.goldenCharged ? "CRIT THROW" : "THROW AXE"}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <p className="hidden md:block font-mono text-[11px] text-[#7E89A6]">
                A / D Move · Shift / Space Dash · Click Arena or F to Throw / Recall Axe
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
