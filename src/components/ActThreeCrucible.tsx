import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronLeft,
  ChevronRight,
  Zap,
  Wind,
  RotateCcw,
  Swords,
  ArrowRight,
} from "lucide-react";
import { retroAudio } from "../utils/retroAudio";
import type { StoryWebGLHandle } from "./StoryWebGLCanvas";

interface ActThreeCrucibleProps {
  webglRef: React.RefObject<StoryWebGLHandle | null>;
  onPerfectDodge: () => void;
  onBossDefeated: (clearTimeSeconds: number) => void;
}

const detectTouchDevice = (): boolean =>
  typeof window !== "undefined" &&
  (window.matchMedia("(pointer: coarse)").matches ||
    (typeof navigator !== "undefined" && navigator.maxTouchPoints > 0));

const QTE_RING_CIRCUMFERENCE = 2 * Math.PI * 52;

type BossPhaseNum = 1 | 2 | 3;

interface GroundFissure {
  x: number; // normalized 0..1
  vx: number;
  width: number;
  hitPlayer: boolean;
}

interface SkyBeam {
  x: number; // normalized 0..1
  width: number;
  timer: number; // counts down warning -> active
  warnDuration: number;
  activeDuration: number;
  hitPlayer: boolean;
}

interface GhostAfterimage {
  x: number;
  facing: number;
  alpha: number;
}

interface CombatSpark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

interface LightningBolt {
  points: Array<{ x: number; y: number }>;
  life: number;
  maxLife: number;
  color: string;
}

interface FloatingText {
  x: number;
  y: number;
  text: string;
  color: string;
  life: number;
  maxLife: number;
}

const PHASE_SUBTITLES: Record<BossPhaseNum, { code: string; line: string }> = {
  1: {
    code: "PHASE I // MERGE CONFLICT",
    line: "Sweeping energy fissures tear the floor — DASH through them for REALM SHIFT.",
  },
  2: {
    code: "PHASE II // DEADLINE COLLAPSE",
    line: "Floor runes ignite before crimson sky-beams strike — dodge at the last instant.",
  },
  3: {
    code: "PHASE III // THE FINAL WALL",
    line: "Front barrier raised — THROW past the Titan, then RECALL from behind to shatter it!",
  },
};

export default function ActThreeCrucible({
  webglRef,
  onPerfectDodge,
  onBossDefeated,
}: ActThreeCrucibleProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const bossBarFillRef = useRef<HTMLDivElement | null>(null);
  const delayedBarFillRef = useRef<HTMLDivElement | null>(null);
  const bossHpTextRef = useRef<HTMLParagraphElement | null>(null);
  const qteCircleRef = useRef<SVGCircleElement | null>(null);
  const qtePercentRef = useRef<HTMLSpanElement | null>(null);

  const [isTouchDevice] = useState<boolean>(detectTouchDevice);
  const [stage, setStage] = useState<"INTRO" | "FIGHT" | "QTE" | "SUPERNOVA">("INTRO");
  const [bossPhase, setBossPhase] = useState<BossPhaseNum>(1);
  const [playerVitality, setPlayerVitality] = useState<number>(100);
  const [axeStateUi, setAxeStateUi] = useState<"HAND" | "FLYING" | "EMBEDDED" | "RECALLING">(
    "HAND"
  );
  const [empoweredUi, setEmpoweredUi] = useState<boolean>(false);
  const [barrierUi, setBarrierUi] = useState<boolean>(false);
  const [realmShiftBanner, setRealmShiftBanner] = useState<boolean>(false);
  const [phaseBanner, setPhaseBanner] = useState<string | null>(null);
  const [secondWindBanner, setSecondWindBanner] = useState<boolean>(false);
  const [supernovaFlash, setSupernovaFlash] = useState<boolean>(false);

  const stageRef = useRef(stage);
  stageRef.current = stage;

  const bossHpRef = useRef(100);
  const delayedHpRef = useRef(100);
  const qteChargeRef = useRef(0);
  const fightStartTimeRef = useRef<number>(performance.now());
  const keysRef = useRef({ left: false, right: false });
  const touchMoveRef = useRef({ left: false, right: false });

  const timersRef = useRef<number[]>([]);
  const addTimer = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timersRef.current.push(id);
    return id;
  }, []);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((t) => window.clearTimeout(t));
      timersRef.current = [];
    };
  }, []);

  // Mutable 60fps combat state (zero React per-frame overhead)
  const simRef = useRef({
    elapsed: 0,
    hitStopTimer: 0,
    realmShiftTimer: 0,
    playerX: 0.5, // normalized 0.1..0.9
    playerVx: 0,
    facing: 1,
    dashTimer: 0,
    dashCooldown: 0,
    dashDir: 1,
    invulnTimer: 0,
    empoweredThrow: false,
    capePoints: Array.from({ length: 6 }, () => ({ x: 0, y: 0 })),
    capeInited: false,
    // Leviathan Axe state
    axeState: "HAND" as "HAND" | "FLYING" | "EMBEDDED" | "RECALLING",
    axeX: 0.5,
    axeY: 0.82,
    axeStartX: 0.5,
    axeStartY: 0.82,
    axeTargetX: 0.5,
    axeTargetY: 0.34,
    axeT: 0,
    axeSpin: 0,
    axeEmpowered: false,
    axeTrail: [] as Array<{ x: number; y: number }>,
    // Boss attacks & barrier
    phase: 1 as BossPhaseNum,
    barrierActive: false,
    attackTimer: 1.5,
    fissures: [] as GroundFissure[],
    beams: [] as SkyBeam[],
    // FX
    afterimages: [] as GhostAfterimage[],
    sparks: [] as CombatSpark[],
    bolts: [] as LightningBolt[],
    callouts: [] as FloatingText[],
  });

  // Dramatic 2.7s Plot Opening (Skippable)
  useEffect(() => {
    if (stage !== "INTRO") return;
    webglRef.current?.triggerCameraKickBack(4.2);
    const id = addTimer(() => {
      fightStartTimeRef.current = performance.now();
      setStage("FIGHT");
      setPhaseBanner("PHASE I // MERGE CONFLICT");
      addTimer(() => setPhaseBanner(null), 2200);
    }, 2750);
    return () => window.clearTimeout(id);
  }, [stage, addTimer, webglRef]);

  // Sync DOM HUD bars & QTE ring directly (zero React re-renders per frame)
  const syncHudDom = useCallback(() => {
    const hpFrac = Math.max(0, Math.min(1, bossHpRef.current / 100));
    const delayFrac = Math.max(0, Math.min(1, delayedHpRef.current / 100));

    if (bossBarFillRef.current) {
      bossBarFillRef.current.style.transform = `scaleX(${hpFrac})`;
      bossBarFillRef.current.style.background =
        bossHpRef.current <= 10
          ? "linear-gradient(90deg, #FFE08A 0%, #FFFFFF 100%)"
          : "linear-gradient(90deg, #B81D4E 0%, #FF4778 65%, #FF9F5A 100%)";
    }
    if (delayedBarFillRef.current) {
      delayedBarFillRef.current.style.transform = `scaleX(${delayFrac})`;
    }
    if (bossHpTextRef.current) {
      bossHpTextRef.current.textContent = `${Math.round(bossHpRef.current)}%`;
    }
    if (qteCircleRef.current) {
      qteCircleRef.current.style.strokeDashoffset = String(
        QTE_RING_CIRCUMFERENCE * (1 - qteChargeRef.current)
      );
    }
    if (qtePercentRef.current) {
      qtePercentRef.current.textContent = `${Math.round(qteChargeRef.current * 100)}%`;
    }
  }, []);

  // Re-sync DOM bars whenever stage transitions mount/unmount HUD elements
  useEffect(() => {
    syncHudDom();
  }, [stage, syncHudDom]);

  // Safety reset for touch & keyboard movement inputs so pads never stick on Android tablets
  useEffect(() => {
    const resetMovement = () => {
      touchMoveRef.current.left = false;
      touchMoveRef.current.right = false;
      keysRef.current.left = false;
      keysRef.current.right = false;
    };
    const resetTouchOnly = () => {
      touchMoveRef.current.left = false;
      touchMoveRef.current.right = false;
    };
    window.addEventListener("blur", resetMovement);
    window.addEventListener("pointerup", resetTouchOnly);
    window.addEventListener("pointercancel", resetTouchOnly);
    return () => {
      window.removeEventListener("blur", resetMovement);
      window.removeEventListener("pointerup", resetTouchOnly);
      window.removeEventListener("pointercancel", resetTouchOnly);
    };
  }, []);

  const spawnBurst = useCallback(
    (x: number, y: number, count: number, palette: string[], speedMult = 1) => {
      const sim = simRef.current;
      const effectiveCount = isTouchDevice ? Math.max(8, Math.round(count * 0.5)) : count;
      for (let i = 0; i < effectiveCount; i++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = (110 + Math.random() * 380) * speedMult;
        sim.sparks.push({
          x,
          y,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd - 45,
          life: 0,
          maxLife: 0.32 + Math.random() * 0.42,
          size: 2 + Math.random() * 3.4,
          color: palette[i % palette.length],
        });
      }
    },
    [isTouchDevice]
  );

  const spawnLightningBolt = useCallback((x1: number, y1: number, x2: number, y2: number, color: string) => {
    const pts: Array<{ x: number; y: number }> = [];
    const steps = 9;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const jitter = i === 0 || i === steps ? 0 : (Math.random() - 0.5) * 44;
      pts.push({
        x: x1 + (x2 - x1) * t + jitter,
        y: y1 + (y2 - y1) * t + (i === 0 || i === steps ? 0 : (Math.random() - 0.5) * 20),
      });
    }
    simRef.current.bolts.push({
      points: pts,
      life: 0,
      maxLife: 0.24,
      color,
    });
  }, []);

  const triggerSupernovaFinisher = useCallback(() => {
    if (stageRef.current === "SUPERNOVA") return;
    setStage("SUPERNOVA");
    bossHpRef.current = 0;
    delayedHpRef.current = 0;
    qteChargeRef.current = 1;
    syncHudDom();
    setSupernovaFlash(true);

    retroAudio.playSupernovaExplosion();
    webglRef.current?.triggerBossSupernova();

    const canvas = canvasRef.current;
    const w = canvas ? canvas.clientWidth : window.innerWidth;
    const h = canvas ? canvas.clientHeight : window.innerHeight;
    spawnBurst(w * 0.5, h * 0.44, 90, ["#FFFFFF", "#FFF2C2", "#E6C999", "#A5E8FF"], 1.8);

    const clearSec = Math.max(8, (performance.now() - fightStartTimeRef.current) / 1000);
    addTimer(() => {
      onBossDefeated(clearSec);
    }, 1850);
  }, [addTimer, onBossDefeated, spawnBurst, syncHudDom, webglRef]);

  const applyBossDamage = useCallback(
    (rawDamage: number, isBackstab: boolean, impactX: number, impactY: number) => {
      if (stageRef.current !== "FIGHT") return;
      const sim = simRef.current;

      // Phase 3 Front Barrier blocks frontal hits, guides player to RECALL from behind!
      if (sim.barrierActive && !isBackstab) {
        retroAudio.playBossHit(false, true);
        sim.callouts.push({
          x: impactX,
          y: impactY - 24,
          text: "BARRIER! RECALL FROM BEHIND",
          color: "#FFE08A",
          life: 0,
          maxLife: 1.05,
        });
        spawnBurst(impactX, impactY, 18, ["#FFE08A", "#FF6B8B"], 0.8);
        return;
      }

      let dmg = rawDamage;
      let brokeBarrier = false;
      if (sim.barrierActive && isBackstab) {
        sim.barrierActive = false;
        setBarrierUi(false);
        brokeBarrier = true;
        dmg = Math.round(dmg * 1.45);
      }

      sim.hitStopTimer = 0.045; // Crisp 45ms hit-stop freeze!
      retroAudio.playBossHit(brokeBarrier || isBackstab, false);
      webglRef.current?.triggerBossHit3D(isBackstab || brokeBarrier);

      spawnBurst(
        impactX,
        impactY,
        isBackstab || brokeBarrier ? 44 : 28,
        isBackstab || brokeBarrier
          ? ["#FFFFFF", "#FFE49E", "#98F5E1", "#E6C999"]
          : ["#FFFFFF", "#A5E8FF", "#E6C999"],
        isBackstab ? 1.3 : 1.0
      );

      sim.callouts.push({
        x: impactX,
        y: impactY - 26,
        text: brokeBarrier
          ? `BARRIER SHATTERED! -${dmg}%`
          : isBackstab
          ? `REAR SHATTER! -${dmg}%`
          : `-${dmg}%`,
        color: brokeBarrier || isBackstab ? "#FFE49E" : "#A5E8FF",
        life: 0,
        maxLife: 0.9,
      });

      const prevHp = bossHpRef.current;
      // Floor at 10% so the unforgettable God of War QTE Finisher always triggers!
      const nextHp = Math.max(10, prevHp - dmg);
      bossHpRef.current = nextHp;
      syncHudDom();

      // Phase Transitions
      if (prevHp > 65 && nextHp <= 65 && sim.phase < 2) {
        sim.phase = 2;
        setBossPhase(2);
        setPhaseBanner(PHASE_SUBTITLES[2].code);
        retroAudio.playChapterHum();
        addTimer(() => setPhaseBanner(null), 2200);
      } else if (prevHp > 30 && nextHp <= 30 && sim.phase < 3) {
        sim.phase = 3;
        sim.barrierActive = true;
        setBossPhase(3);
        setBarrierUi(true);
        setPhaseBanner(PHASE_SUBTITLES[3].code);
        retroAudio.playChapterHum();
        addTimer(() => setPhaseBanner(null), 2400);
      }

      // Trigger QTE Finisher at 10% HP!
      if (nextHp <= 10) {
        sim.fissures = [];
        sim.beams = [];
        sim.barrierActive = false;
        setBarrierUi(false);
        sim.axeState = "HAND";
        setAxeStateUi("HAND");
        qteChargeRef.current = 0.08;
        setStage("QTE");
        syncHudDom();
        retroAudio.playChapterHum();
        webglRef.current?.setAct3BossState(10, 3, 0.08, false, 0.16);
      }
    },
    [addTimer, spawnBurst, syncHudDom, webglRef]
  );

  // QTE Rapid Tap / Mash Space Handler
  const handleQteMash = useCallback(() => {
    if (stageRef.current !== "QTE") return;
    const next = Math.min(1, qteChargeRef.current + 0.115);
    qteChargeRef.current = next;
    syncHudDom();

    retroAudio.playQteLightningSlam(next);
    webglRef.current?.triggerQteLightning3D(next);

    const canvas = canvasRef.current;
    const w = canvas ? canvas.clientWidth : window.innerWidth;
    const h = canvas ? canvas.clientHeight : window.innerHeight;
    const bossX = w * 0.5;
    const bossY = h * 0.44;
    const side = Math.random() > 0.5 ? 0.15 : 0.85;
    spawnLightningBolt(
      w * (side + (Math.random() - 0.5) * 0.25),
      h * 0.05,
      bossX + (Math.random() - 0.5) * 40,
      bossY + (Math.random() - 0.5) * 35,
      next > 0.65 ? "#FFF0B5" : "#A5E8FF"
    );
    spawnBurst(bossX, bossY, 16, ["#FFFFFF", "#FFE08A", "#A5E8FF"], 1.15);

    if (next >= 1) {
      triggerSupernovaFinisher();
    }
  }, [spawnBurst, spawnLightningBolt, syncHudDom, triggerSupernovaFinisher, webglRef]);

  // Dodge Dash Action (with PERFECT DODGE — REALM SHIFT detection!)
  const triggerDodgeDash = useCallback(() => {
    if (stageRef.current === "INTRO") {
      fightStartTimeRef.current = performance.now();
      setStage("FIGHT");
      return;
    }
    if (stageRef.current === "QTE") {
      handleQteMash();
      return;
    }
    if (stageRef.current !== "FIGHT") return;

    const sim = simRef.current;
    if (sim.dashCooldown > 0) return;

    const dir =
      keysRef.current.left || touchMoveRef.current.left
        ? -1
        : keysRef.current.right || touchMoveRef.current.right
        ? 1
        : sim.facing;

    sim.dashDir = dir;
    sim.facing = dir;
    sim.dashTimer = 0.22;
    sim.invulnTimer = 0.34;
    sim.dashCooldown = 0.52;

    // Check if an incoming fissure or imminent sky-beam is within Perfect Dodge proximity!
    let nearHazard = false;
    for (const f of sim.fissures) {
      if (Math.abs(f.x - sim.playerX) < 0.13) {
        nearHazard = true;
        break;
      }
    }
    if (!nearHazard) {
      for (const b of sim.beams) {
        if (Math.abs(b.x - sim.playerX) < b.width * 0.95 && b.timer < 0.35 && b.timer > -b.activeDuration) {
          nearHazard = true;
          break;
        }
      }
    }

    if (nearHazard && sim.realmShiftTimer <= 0) {
      // PERFECT DODGE — REALM SHIFT (0.3x slow-mo for 0.8s + golden empowered throw!)
      sim.realmShiftTimer = 0.8;
      sim.empoweredThrow = true;
      setEmpoweredUi(true);
      setRealmShiftBanner(true);
      onPerfectDodge();
      retroAudio.playPerfectDodge();
      webglRef.current?.triggerImpactFlash(0xa5e8ff, 30);
      addTimer(() => setRealmShiftBanner(false), 950);
    } else {
      retroAudio.playDash();
    }
  }, [addTimer, handleQteMash, onPerfectDodge, webglRef]);

  // Leviathan Axe Throw / Recall Action
  const triggerAxeAction = useCallback((aimNormX?: number) => {
    if (stageRef.current === "INTRO") {
      fightStartTimeRef.current = performance.now();
      setStage("FIGHT");
      return;
    }
    if (stageRef.current === "QTE") {
      handleQteMash();
      return;
    }
    if (stageRef.current !== "FIGHT") return;

    const sim = simRef.current;
    if (sim.axeState === "HAND") {
      sim.axeState = "FLYING";
      setAxeStateUi("FLYING");
      sim.axeStartX = sim.playerX;
      sim.axeStartY = 0.81;
      // Aim deep into the 3D Boss center (aligned with lowered 3D Boss mesh)
      sim.axeTargetX = aimNormX !== undefined ? 0.5 + (aimNormX - 0.5) * 0.25 : 0.5;
      sim.axeTargetY = sim.barrierActive ? 0.30 : 0.42;
      sim.axeT = 0;
      sim.axeTrail = [];
      sim.axeEmpowered = sim.empoweredThrow;
      sim.empoweredThrow = false;
      setEmpoweredUi(false);
      retroAudio.playBladeThrow();
    } else if (sim.axeState === "EMBEDDED") {
      sim.axeState = "RECALLING";
      setAxeStateUi("RECALLING");
      sim.axeStartX = sim.axeX;
      sim.axeStartY = sim.axeY;
      sim.axeT = 0;
      sim.axeTrail = [];
      retroAudio.playBladeRecall();
    }
  }, [handleQteMash]);

  // Keyboard Controls (A/D, Arrows, Shift/Space Dodge or QTE Mash, F Throw/Recall)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === "a" || e.key === "ArrowLeft") keysRef.current.left = true;
      if (k === "d" || e.key === "ArrowRight") keysRef.current.right = true;
      if (e.code === "Space") {
        e.preventDefault();
        if (!e.repeat) {
          if (stageRef.current === "QTE") handleQteMash();
          else triggerDodgeDash();
        }
      }
      if (e.key === "Shift" && !e.repeat) {
        e.preventDefault();
        triggerDodgeDash();
      }
      if (k === "f" && !e.repeat) {
        e.preventDefault();
        triggerAxeAction();
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === "a" || e.key === "ArrowLeft") keysRef.current.left = false;
      if (k === "d" || e.key === "ArrowRight") keysRef.current.right = false;
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [handleQteMash, triggerAxeAction, triggerDodgeDash]);

  // 60FPS PRECISION COMBAT CANVAS LOOP
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const blur = (v: number) => (isTouchDevice ? 0 : v);
    let rafId = 0;
    let isPaused = document.hidden;
    let lastTime = performance.now();

    const resize = () => {
      const dpr = isTouchDevice ? 1.0 : Math.min(window.devicePixelRatio || 1, 1.5);
      const cw = canvas.clientWidth || window.innerWidth;
      const ch = canvas.clientHeight || window.innerHeight;
      canvas.width = Math.max(1, Math.floor(cw * dpr));
      canvas.height = Math.max(1, Math.floor(ch * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const resizeObserver =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null;
    if (resizeObserver && canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }
    window.addEventListener("resize", resize);
    window.addEventListener("orientationchange", resize);

    const damagePlayer = () => {
      const sim = simRef.current;
      if (sim.invulnTimer > 0) return;
      sim.invulnTimer = 0.85;
      retroAudio.playPlayerHit();
      webglRef.current?.triggerCameraShake(0.95);
      webglRef.current?.triggerImpactFlash(0xff3864, 24);

      setPlayerVitality((prev) => {
        const next = prev - 22;
        if (next <= 0) {
          // Empowering "Second Wind" grit surge — never breaks story flow!
          setSecondWindBanner(true);
          addTimer(() => setSecondWindBanner(false), 1800);
          return 65;
        }
        return next;
      });
    };

    const tick = (now: number) => {
      const rawDt = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
      lastTime = now;

      const sim = simRef.current;
      const w = canvas.clientWidth || window.innerWidth;
      const h = canvas.clientHeight || window.innerHeight;
      const floorY = h * 0.82;
      const bossScreenX = w * 0.5;
      const bossScreenY = h * 0.44;

      // Hit-stop freeze (45ms) & Realm Shift Slow-Motion (0.3x)
      let timeScale = 1.0;
      if (sim.hitStopTimer > 0) {
        sim.hitStopTimer = Math.max(0, sim.hitStopTimer - rawDt);
        timeScale = 0;
      } else if (stageRef.current === "QTE") {
        timeScale = 0.16;
      } else if (sim.realmShiftTimer > 0) {
        sim.realmShiftTimer = Math.max(0, sim.realmShiftTimer - rawDt);
        timeScale = 0.3;
      }

      const dt = rawDt * timeScale;
      sim.elapsed += rawDt;

      // Smooth God of War Delayed Gold Drain + QTE decay via direct DOM refs (zero React re-renders)
      let hudDirty = false;
      if (delayedHpRef.current > bossHpRef.current) {
        const diff = delayedHpRef.current - bossHpRef.current;
        delayedHpRef.current =
          diff <= 0.35
            ? bossHpRef.current
            : Math.max(bossHpRef.current, delayedHpRef.current - Math.max(16, diff * 5.2) * rawDt);
        hudDirty = true;
      }
      if (stageRef.current === "QTE" && qteChargeRef.current > 0.08) {
        qteChargeRef.current = Math.max(0.08, qteChargeRef.current - rawDt * 0.16);
        hudDirty = true;
      }
      if (hudDirty) {
        syncHudDom();
      }

      // Keep 3D Titan of Entropy synchronized every frame
      webglRef.current?.setAct3BossState(
        bossHpRef.current,
        sim.phase,
        stageRef.current === "QTE" ? qteChargeRef.current : 0,
        sim.barrierActive,
        timeScale === 0 ? 0.05 : timeScale
      );

      ctx.clearRect(0, 0, w, h);

      // -----------------------------------------------------------------
      // UPDATE PLAYER, AXE & BOSS ATTACKS DURING ACTIVE FIGHT
      // -----------------------------------------------------------------
      if (stageRef.current === "FIGHT") {
        sim.dashCooldown = Math.max(0, sim.dashCooldown - rawDt);
        sim.invulnTimer = Math.max(0, sim.invulnTimer - rawDt);

        const moveInput =
          (keysRef.current.right || touchMoveRef.current.right ? 1 : 0) -
          (keysRef.current.left || touchMoveRef.current.left ? 1 : 0);

        if (sim.dashTimer > 0) {
          sim.dashTimer = Math.max(0, sim.dashTimer - rawDt);
          sim.playerVx = sim.dashDir * 1.42;
          sim.afterimages.push({
            x: sim.playerX,
            facing: sim.facing,
            alpha: 0.58,
          });
        } else {
          if (moveInput !== 0) sim.facing = moveInput;
          sim.playerVx = moveInput * 0.52;
        }

        // Player stays responsive even during Realm Shift slow-motion!
        sim.playerX = Math.max(0.08, Math.min(0.92, sim.playerX + sim.playerVx * rawDt));

        // Update Leviathan Axe Arc Throw & Rear Recall
        if (sim.axeState === "FLYING") {
          sim.axeT += rawDt * 3.1;
          sim.axeSpin += rawDt * 24;
          const t = Math.min(1, sim.axeT);
          const curveX = Math.sin(t * Math.PI) * (sim.axeStartX < 0.5 ? -0.1 : 0.1);
          sim.axeX = sim.axeStartX + (sim.axeTargetX - sim.axeStartX) * t + curveX;
          sim.axeY = sim.axeStartY + (sim.axeTargetY - sim.axeStartY) * t - Math.sin(t * Math.PI) * 0.05;
          sim.axeTrail.push({ x: sim.axeX * w, y: sim.axeY * h });
          if (sim.axeTrail.length > 16) sim.axeTrail.shift();

          if (t >= 1) {
            sim.axeState = "EMBEDDED";
            setAxeStateUi("EMBEDDED");
            // In Phase 3 with barrier active, axe arcs behind the barrier ready for RECALL!
            const dmg = sim.axeEmpowered ? 16 : 10;
            applyBossDamage(dmg, false, sim.axeX * w, sim.axeY * h);
          }
        } else if (sim.axeState === "RECALLING") {
          sim.axeT += rawDt * 3.8;
          sim.axeSpin -= rawDt * 28;
          const t = Math.min(1, sim.axeT);
          const prevT = Math.max(0, t - rawDt * 3.8);
          sim.axeX = sim.axeStartX + (sim.playerX - sim.axeStartX) * t;
          sim.axeY = sim.axeStartY + (0.81 - sim.axeStartY) * t;
          sim.axeTrail.push({ x: sim.axeX * w, y: sim.axeY * h });
          if (sim.axeTrail.length > 18) sim.axeTrail.shift();

          // Rear-armor cleave right as axe rips back through Boss center (t crosses 0.34)
          if (prevT < 0.34 && t >= 0.34) {
            const rearDmg = sim.axeEmpowered ? 19 : 13;
            applyBossDamage(rearDmg, true, bossScreenX, bossScreenY + 10);
          }

          if (t >= 1) {
            sim.axeState = "HAND";
            setAxeStateUi("HAND");
            sim.axeTrail = [];
            retroAudio.playBladeCatch();
            spawnBurst(sim.playerX * w, floorY - 34, 14, ["#98F5E1", "#A5E8FF"], 0.6);
          }
        }

        // Boss Phase Attack Spawner
        if (dt > 0) {
          sim.attackTimer -= dt;
          if (sim.attackTimer <= 0) {
            if (sim.phase === 1) {
              // Phase 1: MERGE CONFLICT — Sweeping Ground Energy Fissures
              const fromLeft = Math.random() > 0.5;
              sim.fissures.push({
                x: fromLeft ? 0.04 : 0.96,
                vx: fromLeft ? 0.48 : -0.48,
                width: 0.075,
                hitPlayer: false,
              });
              sim.attackTimer = 1.95;
            } else if (sim.phase === 2) {
              // Phase 2: DEADLINE COLLAPSE — Glowing Floor Rune Warning -> Vertical Sky-Beams
              const count = 2;
              for (let i = 0; i < count; i++) {
                const targetX =
                  i === 0
                    ? Math.max(0.14, Math.min(0.86, sim.playerX + (Math.random() - 0.5) * 0.08))
                    : 0.2 + Math.random() * 0.6;
                sim.beams.push({
                  x: targetX,
                  width: 0.095,
                  timer: 0.92 + i * 0.28,
                  warnDuration: 0.92,
                  activeDuration: 0.36,
                  hitPlayer: false,
                });
              }
              sim.attackTimer = 2.15;
            } else {
              // Phase 3: THE FINAL WALL — Combined Sky-Beam + Ground Fissure pressure
              sim.beams.push({
                x: Math.max(0.14, Math.min(0.86, sim.playerX)),
                width: 0.095,
                timer: 0.88,
                warnDuration: 0.88,
                activeDuration: 0.35,
                hitPlayer: false,
              });
              const fromLeft = sim.playerX > 0.5;
              sim.fissures.push({
                x: fromLeft ? 0.04 : 0.96,
                vx: fromLeft ? 0.54 : -0.54,
                width: 0.075,
                hitPlayer: false,
              });
              sim.attackTimer = 2.2;
            }
          }

          // Advance Fissures
          for (let i = sim.fissures.length - 1; i >= 0; i--) {
            const f = sim.fissures[i];
            f.x += f.vx * dt;
            if (!f.hitPlayer && Math.abs(f.x - sim.playerX) < f.width * 0.65) {
              f.hitPlayer = true;
              damagePlayer();
            }
            if (f.x < -0.1 || f.x > 1.1) sim.fissures.splice(i, 1);
          }

          // Advance Sky-Beams
          for (let i = sim.beams.length - 1; i >= 0; i--) {
            const b = sim.beams[i];
            b.timer -= dt;
            if (b.timer <= 0 && b.timer > -b.activeDuration) {
              if (!b.hitPlayer && Math.abs(b.x - sim.playerX) < b.width * 0.56) {
                b.hitPlayer = true;
                damagePlayer();
              }
            }
            if (b.timer <= -b.activeDuration) sim.beams.splice(i, 1);
          }
        }
      }

      // -----------------------------------------------------------------
      // DRAW SANCTUARY FLOOR LINE & REFLECTION
      // -----------------------------------------------------------------
      ctx.save();
      const floorGrad = ctx.createLinearGradient(0, floorY - 6, 0, h);
      floorGrad.addColorStop(0, "rgba(255, 92, 130, 0.22)");
      floorGrad.addColorStop(0.12, "rgba(12, 8, 18, 0.86)");
      floorGrad.addColorStop(1, "rgba(5, 7, 13, 0.96)");
      ctx.fillStyle = floorGrad;
      ctx.fillRect(0, floorY, w, h - floorY);

      ctx.strokeStyle =
        sim.realmShiftTimer > 0
          ? "rgba(165, 232, 255, 0.85)"
          : "rgba(255, 117, 151, 0.42)";
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(0, floorY);
      ctx.lineTo(w, floorY);
      ctx.stroke();
      ctx.restore();

      // -----------------------------------------------------------------
      // DRAW PHASE 1 GROUND ENERGY FISSURES & PHASE 2 SKY-BEAMS
      // -----------------------------------------------------------------
      for (const f of sim.fissures) {
        const fx = f.x * w;
        const fw = f.width * w;
        ctx.save();
        const grad = ctx.createRadialGradient(fx, floorY, 4, fx, floorY - 22, fw * 1.1);
        grad.addColorStop(0, "#FFF0D6");
        grad.addColorStop(0.38, "#FF4778");
        grad.addColorStop(1, "rgba(255, 47, 91, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(fx, floorY - 12, fw * 0.95, Math.PI, Math.PI * 2);
        ctx.fill();

        // Jagged rising lava blade spikes
        ctx.fillStyle = "#FF5C82";
        ctx.shadowColor = "#FF3864";
        ctx.shadowBlur = blur(18);
        ctx.beginPath();
        ctx.moveTo(fx - fw * 0.45, floorY);
        ctx.lineTo(fx - fw * 0.14, floorY - 52);
        ctx.lineTo(fx, floorY - 22);
        ctx.lineTo(fx + fw * 0.18, floorY - 64);
        ctx.lineTo(fx + fw * 0.45, floorY);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      for (const b of sim.beams) {
        const bx = b.x * w;
        const bw = b.width * w;
        ctx.save();
        if (b.timer > 0) {
          // Glowing Floor Rune Warning Zone pulsing faster as strike approaches
          const urgency = 1 - Math.min(1, b.timer / b.warnDuration);
          ctx.strokeStyle = `rgba(255, 117, 151, ${0.45 + urgency * 0.55})`;
          ctx.fillStyle = `rgba(255, 56, 100, ${0.12 + urgency * 0.28})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.ellipse(bx, floorY, bw * 0.62, 12, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Vertical telegraph sightline
          ctx.strokeStyle = `rgba(255, 150, 175, ${0.15 + urgency * 0.45})`;
          ctx.setLineDash([6, 6]);
          ctx.beginPath();
          ctx.moveTo(bx, 0);
          ctx.lineTo(bx, floorY);
          ctx.stroke();
        } else {
          // Massive Vertical Crimson Sky-Beam crashing down!
          const beamGrad = ctx.createLinearGradient(bx - bw * 0.5, 0, bx + bw * 0.5, 0);
          beamGrad.addColorStop(0, "rgba(255, 47, 91, 0)");
          beamGrad.addColorStop(0.28, "rgba(255, 71, 120, 0.82)");
          beamGrad.addColorStop(0.5, "#FFF4DF");
          beamGrad.addColorStop(0.72, "rgba(255, 71, 120, 0.82)");
          beamGrad.addColorStop(1, "rgba(255, 47, 91, 0)");
          ctx.fillStyle = beamGrad;
          ctx.fillRect(bx - bw * 0.55, 0, bw * 1.1, floorY + 8);
        }
        ctx.restore();
      }

      // -----------------------------------------------------------------
      // DRAW CLOAKED ARCHITECT SILHOUETTE + PHYSICS CAPE + LEVIATHAN AXE
      // -----------------------------------------------------------------
      const px = sim.playerX * w;
      const py = floorY;

      // Update multi-segment flowing physics cape
      if (!sim.capeInited) {
        sim.capeInited = true;
        sim.capePoints.forEach((pt, idx) => {
          pt.x = px;
          pt.y = py - 54 + idx * 9;
        });
      } else {
        sim.capePoints[0].x = px - sim.facing * 4;
        sim.capePoints[0].y = py - 52;
        for (let i = 1; i < sim.capePoints.length; i++) {
          const prev = sim.capePoints[i - 1];
          const cur = sim.capePoints[i];
          const windX = -sim.playerVx * 26 - sim.facing * 5 + Math.sin(sim.elapsed * 5 + i * 0.8) * 3.5;
          cur.x += (prev.x + windX - cur.x) * Math.min(1, rawDt * 14);
          cur.y += (prev.y + 8.5 - cur.y) * Math.min(1, rawDt * 14);
        }
      }

      // Ghost Afterimages during Dodge Dash
      for (let i = sim.afterimages.length - 1; i >= 0; i--) {
        const g = sim.afterimages[i];
        g.alpha -= rawDt * 3.2;
        if (g.alpha <= 0.02) {
          sim.afterimages.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.globalAlpha = g.alpha;
        ctx.fillStyle = sim.realmShiftTimer > 0 ? "#FFE49E" : "#A5E8FF";
        ctx.beginPath();
        ctx.moveTo(g.x * w, floorY - 64);
        ctx.lineTo(g.x * w - 16, floorY);
        ctx.lineTo(g.x * w + 16, floorY);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      // Draw Hero Silhouette (Hidden only after Supernova fade)
      if (stageRef.current !== "SUPERNOVA") {
        ctx.save();
        // Flowing Physics Cape
        ctx.beginPath();
        ctx.moveTo(sim.capePoints[0].x - 7, sim.capePoints[0].y);
        for (let i = 1; i < sim.capePoints.length; i++) {
          ctx.lineTo(sim.capePoints[i].x - (6 + i * 2.4), sim.capePoints[i].y);
        }
        for (let i = sim.capePoints.length - 1; i >= 0; i--) {
          ctx.lineTo(sim.capePoints[i].x + (6 + i * 2.4), sim.capePoints[i].y);
        }
        ctx.closePath();
        ctx.fillStyle = "#0A1022";
        ctx.strokeStyle = sim.empoweredThrow
          ? "#FFE49E"
          : sim.invulnTimer > 0
          ? "#A5E8FF"
          : "rgba(152, 245, 225, 0.72)";
        ctx.lineWidth = 1.6;
        ctx.shadowColor = sim.empoweredThrow ? "#FFE08A" : "#98F5E1";
        ctx.shadowBlur = blur(sim.empoweredThrow ? 20 : 12);
        ctx.fill();
        ctx.stroke();

        // Armored Shoulders & Hooded Silhouette
        ctx.fillStyle = "#060913";
        ctx.beginPath();
        ctx.arc(px, py - 58, 9.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Glowing Frost-Mint Leviathan War-Axe in Hand (when not thrown)
        if (sim.axeState === "HAND") {
          const handX = px + sim.facing * 18;
          const handY = py - 34;
          ctx.strokeStyle = "#E6C999";
          ctx.lineWidth = 2.6;
          ctx.beginPath();
          ctx.moveTo(handX - sim.facing * 4, handY + 14);
          ctx.lineTo(handX + sim.facing * 10, handY - 18);
          ctx.stroke();

          ctx.fillStyle = sim.empoweredThrow ? "#FFE7AA" : "#98F5E1";
          ctx.shadowColor = sim.empoweredThrow ? "#FFE08A" : "#98F5E1";
          ctx.shadowBlur = blur(18);
          ctx.beginPath();
          ctx.moveTo(handX + sim.facing * 8, handY - 16);
          ctx.quadraticCurveTo(
            handX + sim.facing * 24,
            handY - 12,
            handX + sim.facing * 15,
            handY - 2
          );
          ctx.lineTo(handX + sim.facing * 6, handY - 6);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      }

      // -----------------------------------------------------------------
      // DRAW SPINNING LEVIATHAN AXE IN FLIGHT / EMBEDDED / RECALLING
      // -----------------------------------------------------------------
      if (sim.axeState !== "HAND" && stageRef.current === "FIGHT") {
        const ax = sim.axeX * w;
        const ay = sim.axeY * h;

        // Glowing Arc Trail
        if (sim.axeTrail.length > 1) {
          ctx.save();
          ctx.strokeStyle = sim.axeEmpowered ? "#FFE49E" : "#98F5E1";
          ctx.lineWidth = 4;
          ctx.lineCap = "round";
          ctx.shadowColor = sim.axeEmpowered ? "#FFE08A" : "#A5E8FF";
          ctx.shadowBlur = blur(16);
          ctx.beginPath();
          sim.axeTrail.forEach((pt, idx) => {
            if (idx === 0) ctx.moveTo(pt.x, pt.y);
            else ctx.lineTo(pt.x, pt.y);
          });
          ctx.stroke();
          ctx.restore();
        }

        // Frost Recall Tether Line while Embedded
        if (sim.axeState === "EMBEDDED") {
          ctx.save();
          ctx.strokeStyle = "rgba(152, 245, 225, 0.32)";
          ctx.setLineDash([5, 7]);
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(px, py - 38);
          ctx.lineTo(ax, ay);
          ctx.stroke();
          ctx.restore();
        }

        // Spinning Runic War-Axe
        ctx.save();
        ctx.translate(ax, ay);
        ctx.rotate(sim.axeState === "EMBEDDED" ? -0.45 : sim.axeSpin);
        ctx.shadowColor = sim.axeEmpowered ? "#FFE08A" : "#98F5E1";
        ctx.shadowBlur = blur(22);
        ctx.strokeStyle = "#E6C999";
        ctx.lineWidth = 3.2;
        ctx.beginPath();
        ctx.moveTo(0, -18);
        ctx.lineTo(0, 18);
        ctx.stroke();

        ctx.fillStyle = sim.axeEmpowered ? "#FFF0C2" : "#98F5E1";
        ctx.beginPath();
        ctx.moveTo(0, -16);
        ctx.quadraticCurveTo(22, -10, 12, 4);
        ctx.lineTo(0, -2);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      // -----------------------------------------------------------------
      // DRAW QTE LIGHTNING BOLTS, SPARKS & FLOATING DAMAGE CALLOUTS
      // -----------------------------------------------------------------
      for (let i = sim.bolts.length - 1; i >= 0; i--) {
        const bolt = sim.bolts[i];
        bolt.life += rawDt;
        if (bolt.life >= bolt.maxLife) {
          sim.bolts.splice(i, 1);
          continue;
        }
        const a = 1 - bolt.life / bolt.maxLife;
        ctx.save();
        ctx.globalAlpha = a;
        ctx.strokeStyle = bolt.color;
        ctx.lineWidth = 4.2 * a;
        ctx.shadowColor = bolt.color;
        ctx.shadowBlur = blur(22);
        ctx.beginPath();
        bolt.points.forEach((pt, idx) => {
          if (idx === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        });
        ctx.stroke();
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 1.6 * a;
        ctx.stroke();
        ctx.restore();
      }

      for (let i = sim.sparks.length - 1; i >= 0; i--) {
        const sp = sim.sparks[i];
        sp.life += rawDt;
        if (sp.life >= sp.maxLife) {
          sim.sparks.splice(i, 1);
          continue;
        }
        sp.x += sp.vx * rawDt;
        sp.y += sp.vy * rawDt;
        sp.vx *= 0.96;
        sp.vy = sp.vy * 0.96 + 260 * rawDt;
        const alpha = 1 - sp.life / sp.maxLife;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = sp.color;
        ctx.lineWidth = sp.size * alpha;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(sp.x, sp.y);
        ctx.lineTo(sp.x - sp.vx * 0.025, sp.y - sp.vy * 0.025);
        ctx.stroke();
        ctx.restore();
      }

      for (let i = sim.callouts.length - 1; i >= 0; i--) {
        const c = sim.callouts[i];
        c.life += rawDt;
        if (c.life >= c.maxLife) {
          sim.callouts.splice(i, 1);
          continue;
        }
        const t = c.life / c.maxLife;
        ctx.save();
        ctx.globalAlpha = 1 - t * t;
        ctx.font = `700 13px "Cinzel", Georgia, serif`;
        ctx.textAlign = "center";
        ctx.fillStyle = c.color;
        ctx.shadowColor = "rgba(5,7,13,0.95)";
        ctx.shadowBlur = blur(8);
        ctx.fillText(c.text, c.x, c.y - t * 34);
        ctx.restore();
      }

      if (!isPaused) {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        isPaused = true;
        touchMoveRef.current.left = false;
        touchMoveRef.current.right = false;
        keysRef.current.left = false;
        keysRef.current.right = false;
        if (rafId) {
          window.cancelAnimationFrame(rafId);
          rafId = 0;
        }
      } else {
        isPaused = false;
        lastTime = performance.now();
        if (!rafId) {
          rafId = window.requestAnimationFrame(tick);
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    if (!isPaused) {
      rafId = window.requestAnimationFrame(tick);
    }
    return () => {
      isPaused = true;
      window.cancelAnimationFrame(rafId);
      resizeObserver?.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("orientationchange", resize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [addTimer, applyBossDamage, isTouchDevice, spawnBurst, syncHudDom, webglRef]);

  return (
    <div
      onPointerDown={(e) => {
        const el = e.target as HTMLElement | null;
        if (el && el.closest("button, a")) return;
        if (stageRef.current === "QTE") {
          handleQteMash();
          return;
        }
        if (stageRef.current === "FIGHT") {
          const rect = e.currentTarget.getBoundingClientRect();
          const normX = (e.clientX - rect.left) / Math.max(1, rect.width);
          triggerAxeAction(normX);
        }
      }}
      className="relative w-full h-full overflow-hidden select-none touch-none"
    >
      {/* 60FPS PRECISION COMBAT CANVAS DIRECTLY OVER 3D TITAN OF ENTROPY */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none touch-none"
      />

      {/* PERFECT DODGE — REALM SHIFT FROST VIGNETTE FLASH (NO BOX-SHADOW FILTER) */}
      <AnimatePresence>
        {realmShiftBanner && (
          <motion.div
            key="realm-shift-fx"
            initial={{ opacity: 0.9 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.85 }}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-20"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, transparent 55%, rgba(165, 232, 255, 0.45) 100%)",
            }}
          />
        )}
      </AnimatePresence>

      {/* BLINDING WHITE-GOLD SUPERNOVA EXPLOSION DISSOLVE INTO ACT IV */}
      <AnimatePresence>
        {supernovaFlash && (
          <motion.div
            key="supernova-dissolve"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.96, 1] }}
            transition={{ duration: 1.75, times: [0, 0.42, 1], ease: "easeInOut" }}
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-40"
            style={{
              background:
                "radial-gradient(circle at 50% 42%, #FFFFFF 0%, #FFF3CE 42%, #E6C999 100%)",
            }}
          />
        )}
      </AnimatePresence>

      {/* ====================================================================
          COMPACT PINNED TOP BOSS BAR WITH GPU-DRIVEN DELAYED GOLD DRAIN
         ==================================================================== */}
      {stage !== "INTRO" && stage !== "SUPERNOVA" && (
        <div className="relative z-20 max-w-3xl mx-auto px-3 sm:px-5 pt-2 pointer-events-none">
          <div className="rounded-xl bg-[rgba(8,11,20,0.88)] border border-[#FF5C82]/35 px-4 py-2 space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0 text-left flex items-baseline gap-2.5 flex-wrap">
                <p className="font-mythic text-xs sm:text-sm font-bold tracking-[0.18em] text-[#FFE8EE] truncate">
                  THE TITAN OF ENTROPY
                </p>
                <p className="font-mono text-[9.5px] sm:text-[10px] text-[#FF8FA8] truncate">
                  {PHASE_SUBTITLES[bossPhase].code}
                </p>
              </div>
              <div className="text-right shrink-0 flex items-center gap-2">
                {barrierUi && (
                  <p className="font-mono text-[9px] text-[#FFE08A] tracking-wider px-1.5 py-0.5 rounded bg-[#23190B] border border-[#FFE08A]/40">
                    BARRIER UP
                  </p>
                )}
                <p
                  ref={bossHpTextRef}
                  className="font-mono text-[10.5px] sm:text-xs font-bold text-[#E6C999] tabular-nums"
                >
                  {Math.round(bossHpRef.current)}%
                </p>
              </div>
            </div>

            {/* Boss HP Track + Delayed Gold Drain + Phase Markers (scaleX GPU transforms) */}
            <div className="relative h-2.5 rounded-sm bg-[#1A0D18] border border-white/[0.1] overflow-hidden">
              <div
                ref={delayedBarFillRef}
                className="absolute inset-0 origin-left bg-[#FFE49E]"
                style={{ transform: `scaleX(${delayedHpRef.current / 100})` }}
              />
              <div
                ref={bossBarFillRef}
                className="absolute inset-0 origin-left"
                style={{
                  transform: `scaleX(${bossHpRef.current / 100})`,
                  background: "linear-gradient(90deg, #B81D4E 0%, #FF4778 65%, #FF9F5A 100%)",
                }}
              />
              <span className="absolute top-0 bottom-0 left-[65%] w-[2px] bg-[#05070D]" />
              <span className="absolute top-0 bottom-0 left-[30%] w-[2px] bg-[#05070D]" />
              <span className="absolute top-0 bottom-0 left-[10%] w-[2px] bg-[#FFE49E]" />
            </div>

            {/* Compact Mid-Fight 1-Line Subtitle + Player Vitality */}
            <div className="flex items-center justify-between gap-2 text-[9.5px] sm:text-[10px] font-mono">
              <p className="text-[#C8D1E6] truncate">
                {PHASE_SUBTITLES[bossPhase].line}
              </p>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[#98F5E1]">RESOLVE</span>
                <div className="w-16 sm:w-20 h-1.5 rounded-full bg-[#13192C] overflow-hidden">
                  <div
                    className="h-full origin-left bg-[#98F5E1] transition-transform duration-200"
                    style={{ transform: `scaleX(${Math.max(0, Math.min(1, playerVitality / 100))})` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MID-FIGHT BANNERS: REALM SHIFT / PHASE TRANSITION / SECOND WIND */}
      <div className="pointer-events-none absolute top-28 sm:top-32 inset-x-4 z-20 flex flex-col items-center gap-2">
        <AnimatePresence>
          {realmShiftBanner && (
            <motion.div
              key="rs-banner"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              className="px-4 py-1.5 rounded-lg bg-[#081526]/95 border border-[#A5E8FF]/75 text-[#A5E8FF] font-mythic text-xs sm:text-sm font-bold tracking-[0.18em]"
            >
              PERFECT DODGE — REALM SHIFT (EMPOWERED AXE)
            </motion.div>
          )}
          {phaseBanner && (
            <motion.div
              key={phaseBanner}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="px-4 py-1.5 rounded-lg bg-[#1A0810]/95 border border-[#FF5C82]/70 text-[#FFE4EC] font-mythic text-xs sm:text-sm font-bold tracking-[0.16em]"
            >
              {phaseBanner}
            </motion.div>
          )}
          {secondWindBanner && (
            <motion.div
              key="second-wind"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="px-4 py-1.5 rounded-lg bg-[#14110A]/95 border border-[#E6C999]/70 text-[#FFE49E] font-mythic text-xs font-bold tracking-[0.16em]"
            >
              SECOND WIND — REFUSING TO BREAK
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ====================================================================
          THE GOD OF WAR QTE FINISHER (AT 10% BOSS HP — REF-DRIVEN RING!)
         ==================================================================== */}
      <AnimatePresence>
        {stage === "QTE" && (
          <motion.div
            key="qte-finisher"
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.25 }}
            className="absolute inset-0 z-30 flex flex-col items-center justify-center px-4 text-center pointer-events-none"
          >
            <button
              type="button"
              onPointerDown={(e) => {
                e.stopPropagation();
                e.preventDefault();
                handleQteMash();
              }}
              className="pointer-events-auto relative w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-[rgba(18,10,8,0.92)] border-2 border-[#FFE08A] flex flex-col items-center justify-center cursor-pointer active:scale-90 transition-transform touch-manipulation"
            >
              <svg
                viewBox="0 0 120 120"
                className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
              >
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke="rgba(255,224,138,0.18)"
                  strokeWidth="6"
                />
                <circle
                  ref={qteCircleRef}
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke="#FFE49E"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeDasharray={QTE_RING_CIRCUMFERENCE}
                  strokeDashoffset={QTE_RING_CIRCUMFERENCE * (1 - qteChargeRef.current)}
                />
              </svg>

              <Zap className="w-8 h-8 sm:w-10 sm:h-10 text-[#FFE49E] mb-1" />
              <span
                ref={qtePercentRef}
                className="font-mythic text-xs sm:text-sm font-bold tracking-[0.14em] text-[#FFF6DC]"
              >
                {Math.round(qteChargeRef.current * 100)}%
              </span>
              <span className="font-mono text-[9.5px] text-[#FFE08A] mt-0.5">
                TAP / MASH SPACE
              </span>
            </button>

            <div className="mt-5 px-5 py-2.5 rounded-xl bg-[rgba(13,8,10,0.92)] border border-[#FFE08A]/65 max-w-md">
              <p className="font-mythic text-xs sm:text-sm font-bold tracking-[0.15em] text-[#FFE7AA]">
                [ ⚡ RAPIDLY TAP / MASH SPACE — SHATTER THE LIMIT ]
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====================================================================
          DRAMATIC PLOT OPENING (2.7s, SKIPPABLE)
         ==================================================================== */}
      <AnimatePresence>
        {stage === "INTRO" && (
          <motion.div
            key="act3-intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 0.45 }}
            className="absolute inset-0 z-30 flex flex-col items-center justify-center px-6 text-center bg-[#09040A]/72"
          >
            <div className="max-w-2xl space-y-5">
              <p className="font-mono text-[10.5px] uppercase tracking-[0.28em] text-[#FF7597]">
                ACT III · THE 3:00 AM CRUCIBLE
              </p>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.1 }}
                className="font-space text-base sm:text-xl md:text-2xl text-[#F2DCE3] leading-relaxed"
              >
                &ldquo;3:00 AM. Two hours before the hackathon deadline. Everything breaks
                at once.&rdquo;
              </motion.p>

              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.7, delay: 0.65 }}
                className="h-px w-48 mx-auto"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, #FF4778, #FFE08A, transparent)",
                }}
              />

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.95 }}
                className="font-mythic text-sm sm:text-lg md:text-xl font-bold tracking-[0.15em] text-[#FFE08A]"
              >
                &ldquo;This is the wall where most stop. Break through it.&rdquo;
              </motion.p>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    retroAudio.playClick();
                    fightStartTimeRef.current = performance.now();
                    setStage("FIGHT");
                  }}
                  className="px-5 py-2.5 rounded-lg bg-[#190910] hover:bg-[#290F1A] border border-[#FF5C82]/60 font-mono text-xs text-[#FFD6E1] tracking-[0.14em] cursor-pointer transition-colors touch-manipulation"
                >
                  CONFRONT THE TITAN (SPACE / TAP)
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====================================================================
          DECLUTTERED ERGONOMIC SPLIT THUMB CONTROLS (52px+ TOUCH TARGETS)
         ==================================================================== */}
      {stage === "FIGHT" && (
        <div className="absolute bottom-3 inset-x-3 sm:inset-x-5 z-20 flex items-center justify-between gap-2 max-w-5xl mx-auto">
          {/* Left Thumb Cluster: Move Left / Right (52px+ targets, never sticks) */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Move Left"
              onPointerDown={(e) => {
                e.stopPropagation();
                e.preventDefault();
                touchMoveRef.current.left = true;
              }}
              onPointerUp={(e) => {
                e.stopPropagation();
                touchMoveRef.current.left = false;
              }}
              onPointerLeave={() => {
                touchMoveRef.current.left = false;
              }}
              onPointerCancel={() => {
                touchMoveRef.current.left = false;
              }}
              className="min-w-[52px] min-h-[52px] rounded-xl bg-[rgba(8,11,20,0.88)] active:bg-[#1B2542] border border-white/[0.18] flex items-center justify-center text-[#F2F4FB] cursor-pointer touch-none"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              type="button"
              aria-label="Move Right"
              onPointerDown={(e) => {
                e.stopPropagation();
                e.preventDefault();
                touchMoveRef.current.right = true;
              }}
              onPointerUp={(e) => {
                e.stopPropagation();
                touchMoveRef.current.right = false;
              }}
              onPointerLeave={() => {
                touchMoveRef.current.right = false;
              }}
              onPointerCancel={() => {
                touchMoveRef.current.right = false;
              }}
              className="min-w-[52px] min-h-[52px] rounded-xl bg-[rgba(8,11,20,0.88)] active:bg-[#1B2542] border border-white/[0.18] flex items-center justify-center text-[#F2F4FB] cursor-pointer touch-none"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Desktop-only Keyboard Hint (Hidden on Touch/Tablets) */}
          {!isTouchDevice && (
            <div className="hidden lg:flex items-center gap-3 font-mono text-[10.5px] text-[#9EA8C4] bg-[rgba(8,11,20,0.88)] border border-white/[0.08] px-3.5 py-2 rounded-lg">
              <span>A / D Move</span>
              <span className="text-white/20">·</span>
              <span>SPACE / SHIFT Dodge</span>
              <span className="text-white/20">·</span>
              <span>CLICK / F Throw &amp; Recall</span>
            </div>
          )}

          {/* Right Thumb Cluster: DASH + THROW/RECALL + Discrete Summit Skip */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onPointerDown={(e) => {
                e.stopPropagation();
                e.preventDefault();
                triggerDodgeDash();
              }}
              className="min-h-[52px] px-4 rounded-xl bg-[rgba(11,20,38,0.9)] active:bg-[#182B4D] border border-[#A5E8FF]/55 text-[#A5E8FF] font-mythic text-[11px] sm:text-xs font-bold tracking-[0.12em] inline-flex items-center gap-1.5 cursor-pointer touch-manipulation whitespace-nowrap"
            >
              <Wind className="w-4 h-4" />
              <span>DASH</span>
            </button>

            <button
              type="button"
              onPointerDown={(e) => {
                e.stopPropagation();
                e.preventDefault();
                triggerAxeAction();
              }}
              className={`min-h-[52px] px-4 rounded-xl font-mythic text-[11px] sm:text-xs font-bold tracking-[0.12em] inline-flex items-center gap-1.5 cursor-pointer touch-manipulation whitespace-nowrap border ${
                axeStateUi === "EMBEDDED"
                  ? "bg-[#FFE08A] text-[#05070D] border-[#FFE08A]"
                  : empoweredUi
                  ? "bg-[#98F5E1] text-[#05070D] border-[#FFE49E]"
                  : "bg-[rgba(21,29,52,0.92)] text-[#98F5E1] border-[#98F5E1]/55"
              }`}
            >
              {axeStateUi === "EMBEDDED" ? (
                <>
                  <RotateCcw className="w-4 h-4" />
                  <span>RECALL</span>
                </>
              ) : (
                <>
                  <Swords className="w-4 h-4" />
                  <span>THROW</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                triggerSupernovaFinisher();
              }}
              title="Skip straight to Act IV: The Summit"
              className="min-h-[52px] px-3 rounded-xl bg-[rgba(8,11,20,0.88)] hover:bg-[#171E33] border border-white/[0.14] text-[#9EA8C4] hover:text-[#F2F4FB] font-mono text-[10px] inline-flex items-center gap-1 cursor-pointer touch-manipulation"
            >
              <span className="hidden sm:inline">SUMMIT</span>
              <ArrowRight className="w-4 h-4 text-[#E6C999]" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
