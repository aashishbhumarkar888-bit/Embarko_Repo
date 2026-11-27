import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Shield, ArrowRight, ExternalLink } from "lucide-react";
import { PORTFOLIO_DATA } from "../data/portfolioData";
import { retroAudio } from "../utils/retroAudio";
import type { StoryWebGLHandle } from "./StoryWebGLCanvas";

interface ActOneParryTrialProps {
  webglRef: React.RefObject<StoryWebGLHandle | null>;
  onPerfectParry?: () => void;
  onCompleteActOne: () => void;
}

interface MasteryMilestone {
  parriesRequired: number;
  title: string;
  handle: string;
  accent: string;
  url: string;
}

const MASTERY_MILESTONES: MasteryMilestone[] = [
  {
    parriesRequired: 2,
    title: "HACKERRANK · 40+ SOLVED",
    handle: "@aashishbhumarkar1",
    accent: "#A5E8FF",
    url:
      PORTFOLIO_DATA.codingProfiles.find((c) => c.id === "hackerrank")?.url ??
      "https://www.hackerrank.com/profile/aashishbhumarkar1",
  },
  {
    parriesRequired: 4,
    title: "GEEKSFORGEEKS · 70+ SOLVED",
    handle: "@aashishbhueb6p",
    accent: "#C8B6FF",
    url:
      PORTFOLIO_DATA.codingProfiles.find((c) => c.id === "gfg")?.url ??
      "https://www.geeksforgeeks.org/profile/aashishbhueb6p?tab=activity",
  },
  {
    parriesRequired: 6,
    title: "LEETCODE · 100+ SOLVED",
    handle: "@Aashish-11",
    accent: "#98F5E1",
    url:
      PORTFOLIO_DATA.codingProfiles.find((c) => c.id === "leetcode")?.url ??
      "https://leetcode.com/u/Aashish-11/",
  },
  {
    parriesRequired: 8,
    title: "CODECHEF · 150+ SOLVED — 360+ TOTAL CONQUERED",
    handle: "@aashish_9617",
    accent: "#E6C999",
    url:
      PORTFOLIO_DATA.codingProfiles.find((c) => c.id === "codechef")?.url ??
      "https://www.codechef.com/users/aashish_9617",
  },
];

const SPEAR_LABELS = ["TLE", "SEGFAULT", "O(N²)", "NULL PTR", "DEADLOCK"] as const;
const GRIT_LINES = [
  "Fall. Debug. Rise again.",
  "Wrong Answer is just data. Hold the line.",
  "Trace the stack. Strike on the gold ring.",
  "Discipline is refusing to break.",
] as const;

const TARGET_PARRIES = 8;

const detectTouchDevice = (): boolean =>
  typeof window !== "undefined" &&
  (window.matchMedia("(pointer: coarse)").matches ||
    (typeof navigator !== "undefined" && navigator.maxTouchPoints > 0));

interface LogicSpear {
  id: number;
  label: string;
  startX: number; // normalized 0..1
  startY: number; // normalized 0..1
  progress: number; // 0 = far depth, 1 = core impact, parry window ~0.72..0.99
  speed: number;
  color: string;
  resolved: boolean;
}

interface SparkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

interface ShockwaveRing {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  color: string;
}

interface FloatingCallout {
  x: number;
  y: number;
  text: string;
  color: string;
  life: number;
  maxLife: number;
}

export default function ActOneParryTrial({
  webglRef,
  onPerfectParry,
  onCompleteActOne,
}: ActOneParryTrialProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [phase, setPhase] = useState<"INTRO" | "PLAYING" | "VICTORY">("INTRO");
  const [parries, setParries] = useState<number>(0);
  const [activeBanner, setActiveBanner] = useState<MasteryMilestone | null>(null);
  const [missFlash, setMissFlash] = useState<boolean>(false);
  const [gritLine, setGritLine] = useState<string | null>(null);
  const [warpingOut, setWarpingOut] = useState<boolean>(false);

  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  const parriesRef = useRef(0);
  const bannerTimerRef = useRef<number | null>(null);
  const gritTimerRef = useRef<number | null>(null);
  const missTimerRef = useRef<number | null>(null);
  const victoryTimerRef = useRef<number | null>(null);
  const completedRef = useRef(false);

  // Mutable 60fps simulation refs (zero React re-renders per frame)
  const simRef = useRef({
    spears: [] as LogicSpear[],
    sparks: [] as SparkParticle[],
    rings: [] as ShockwaveRing[],
    callouts: [] as FloatingCallout[],
    nextSpearId: 1,
    spawnCooldown: 0.45,
    hitStopTimer: 0,
    aegisPulse: 0,
    aegisFlash: 0,
    aegisMissGlow: 0,
    parryInputCooldown: 0,
    missCount: 0,
    elapsed: 0,
  });

  // 2.5s Skippable God of War-Style Cinematic Intro
  useEffect(() => {
    if (phase !== "INTRO") return;
    const timer = window.setTimeout(() => {
      setPhase("PLAYING");
    }, 2650);
    return () => window.clearTimeout(timer);
  }, [phase]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (bannerTimerRef.current) window.clearTimeout(bannerTimerRef.current);
      if (gritTimerRef.current) window.clearTimeout(gritTimerRef.current);
      if (missTimerRef.current) window.clearTimeout(missTimerRef.current);
      if (victoryTimerRef.current) window.clearTimeout(victoryTimerRef.current);
    };
  }, []);

  const triggerFinishIntoActTwo = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    setWarpingOut(true);
    retroAudio.playGoldWarpFlythrough();
    webglRef.current?.triggerWarp(1.45, 0xe6c999);
    webglRef.current?.triggerImpactFlash(0xe6c999, 32);
    victoryTimerRef.current = window.setTimeout(() => {
      onCompleteActOne();
    }, 1150);
  }, [onCompleteActOne, webglRef]);

  const triggerParryAttempt = useCallback(() => {
    if (phaseRef.current === "INTRO") {
      retroAudio.playClick();
      setPhase("PLAYING");
      return;
    }
    if (phaseRef.current !== "PLAYING") return;

    const sim = simRef.current;
    const canvas = canvasRef.current;
    const w = canvas ? canvas.clientWidth : window.innerWidth;
    const h = canvas ? canvas.clientHeight : window.innerHeight;
    const coreX = w * 0.5;
    const coreY = h * 0.77;

    if (sim.parryInputCooldown > 0) return;
    sim.parryInputCooldown = 0.12;
    sim.aegisPulse = 1.0;

    // Find closest unresolved spear inside the generous Perfect Parry timing window
    let bestSpear: LogicSpear | null = null;
    let bestDist = Infinity;

    for (const spear of sim.spears) {
      if (spear.resolved) continue;
      // Parry ring window: progress between 0.68 and 1.04 (sweet spot centered near 0.88)
      if (spear.progress >= 0.66 && spear.progress <= 1.05) {
        const d = Math.abs(spear.progress - 0.88);
        if (d < bestDist) {
          bestDist = d;
          bestSpear = spear;
        }
      }
    }

    if (bestSpear) {
      bestSpear.resolved = true;
      const sx = bestSpear.startX * w + (coreX - bestSpear.startX * w) * bestSpear.progress;
      const sy = bestSpear.startY * h + (coreY - bestSpear.startY * h) * bestSpear.progress;

      // INSANE VISUAL JUICE: 50ms true hit-stop freeze + 3D camera slam back + shockwave + 48+ directional sparks!
      sim.hitStopTimer = 0.05;
      sim.aegisFlash = 1.0;

      const nextCount = Math.min(TARGET_PARRIES, parriesRef.current + 1);
      parriesRef.current = nextCount;
      setParries(nextCount);
      onPerfectParry?.();

      retroAudio.playParrySteelRing(nextCount);
      webglRef.current?.triggerCameraKickBack(3.4);
      webglRef.current?.triggerCameraShake(0.88);
      webglRef.current?.triggerImpactFlash(0xe6c999, 28);

      // Dual frost-gold shockwave rings
      sim.rings.push(
        {
          x: coreX,
          y: coreY,
          radius: 42,
          maxRadius: Math.min(w, h) * 0.44,
          alpha: 0.98,
          color: "#E6C999",
        },
        {
          x: sx,
          y: sy,
          radius: 14,
          maxRadius: 175,
          alpha: 0.92,
          color: "#A5E8FF",
        }
      );

      // Explode spear into directional glowing sparks (capped on touch GPUs)
      const isTouch = detectTouchDevice();
      const sparkCount = isTouch ? 24 : 48;
      const sparkPalette = ["#FFF5D6", "#E6C999", "#A5E8FF", "#98F5E1", "#FFFFFF"];
      const impactAngle = Math.atan2(sy - coreY, sx - coreX);
      for (let i = 0; i < sparkCount; i++) {
        const spread = impactAngle + (Math.random() - 0.5) * Math.PI * 1.45;
        const speed = 180 + Math.random() * 540;
        sim.sparks.push({
          x: sx,
          y: sy,
          vx: Math.cos(spread) * speed,
          vy: Math.sin(spread) * speed - 60,
          life: 0,
          maxLife: 0.38 + Math.random() * 0.45,
          size: 2 + Math.random() * 3.5,
          color: sparkPalette[i % sparkPalette.length],
        });
      }

      sim.callouts.push({
        x: sx,
        y: sy - 26,
        text: bestDist < 0.11 ? "PERFECT PARRY" : "PARRIED",
        color: bestDist < 0.11 ? "#FFE7AA" : "#A5E8FF",
        life: 0,
        maxLife: 0.72,
      });

      // Check 4-stage Mastery Milestone unlocks
      const unlocked = MASTERY_MILESTONES.find((m) => m.parriesRequired === nextCount);
      if (unlocked) {
        const stageIdx = MASTERY_MILESTONES.indexOf(unlocked) + 1;
        retroAudio.playMilestoneUnlock(stageIdx);
        setActiveBanner(unlocked);
        if (bannerTimerRef.current) window.clearTimeout(bannerTimerRef.current);
        bannerTimerRef.current = window.setTimeout(() => {
          setActiveBanner(null);
        }, nextCount >= TARGET_PARRIES ? 1600 : 2100);
      }

      // Complete Act I at 8 parries -> trigger 3D Gold Warp Flythrough into Act II!
      if (nextCount >= TARGET_PARRIES) {
        setPhase("VICTORY");
        sim.spears = [];
        victoryTimerRef.current = window.setTimeout(() => {
          triggerFinishIntoActTwo();
        }, 1250);
      }
    } else {
      // Early whiff shield shimmer (gentle metallic click, no penalty)
      retroAudio.playClick();
      sim.rings.push({
        x: coreX,
        y: coreY,
        radius: 36,
        maxRadius: 96,
        alpha: 0.4,
        color: "#A5E8FF",
      });
    }
  }, [onPerfectParry, triggerFinishIntoActTwo, webglRef]);

  // Global SPACE key listener for instant zero-latency parries
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        if (!e.repeat) {
          triggerParryAttempt();
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [triggerParryAttempt]);

  // 60fps Playable Runic Parry Trial Canvas Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isTouchDevice = detectTouchDevice();
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

    const triggerMiss = (coreX: number, coreY: number) => {
      const sim = simRef.current;
      sim.aegisMissGlow = 1.0;
      sim.missCount += 1;
      retroAudio.playParryMiss();
      webglRef.current?.triggerCameraShake(1.1);
      webglRef.current?.triggerImpactFlash(0xff3864, 24);

      const missSparks = isTouchDevice ? 12 : 20;
      for (let i = 0; i < missSparks; i++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = 120 + Math.random() * 260;
        sim.sparks.push({
          x: coreX,
          y: coreY,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          life: 0,
          maxLife: 0.4,
          size: 2.2 + Math.random() * 2.6,
          color: i % 2 === 0 ? "#FF4778" : "#C87CFF",
        });
      }

      setMissFlash(true);
      if (missTimerRef.current) window.clearTimeout(missTimerRef.current);
      missTimerRef.current = window.setTimeout(() => setMissFlash(false), 380);

      const line = GRIT_LINES[(sim.missCount - 1) % GRIT_LINES.length];
      setGritLine(line);
      if (gritTimerRef.current) window.clearTimeout(gritTimerRef.current);
      gritTimerRef.current = window.setTimeout(() => setGritLine(null), 1900);
    };

    const drawLoop = (now: number) => {
      const rawDt = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
      lastTime = now;

      const sim = simRef.current;
      const w = canvas.clientWidth || window.innerWidth;
      const h = canvas.clientHeight || window.innerHeight;
      const coreX = w * 0.5;
      const coreY = h * 0.77;
      const parryRingRadius = Math.min(w, h) < 600 ? 74 : 92;

      // 50ms true hit-stop freeze pauses spear motion while preserving the impact frame!
      let dt = rawDt;
      if (sim.hitStopTimer > 0) {
        sim.hitStopTimer = Math.max(0, sim.hitStopTimer - rawDt);
        dt = 0;
      }

      sim.elapsed += rawDt;
      sim.parryInputCooldown = Math.max(0, sim.parryInputCooldown - rawDt);
      sim.aegisPulse = Math.max(0, sim.aegisPulse - rawDt * 3.8);
      sim.aegisFlash = Math.max(0, sim.aegisFlash - rawDt * 3.2);
      sim.aegisMissGlow = Math.max(0, sim.aegisMissGlow - rawDt * 2.8);

      ctx.clearRect(0, 0, w, h);

      // Only spawn & advance corrupted spears while PLAYING
      if (phaseRef.current === "PLAYING" && dt > 0) {
        sim.spawnCooldown -= dt;
        const activeCount = sim.spears.filter((s) => !s.resolved).length;
        if (sim.spawnCooldown <= 0 && activeCount < 2) {
          const laneAngles = [-0.62, -0.32, 0, 0.32, 0.62];
          const chosen = laneAngles[Math.floor(Math.random() * laneAngles.length)];
          const startX = 0.5 + chosen * 0.62;
          const startY = 0.14 + Math.abs(chosen) * 0.14;
          const speedBase = 0.66 + parriesRef.current * 0.032;

          sim.spears.push({
            id: sim.nextSpearId++,
            label: SPEAR_LABELS[(sim.nextSpearId - 2) % SPEAR_LABELS.length],
            startX,
            startY,
            progress: 0,
            speed: speedBase,
            color: sim.nextSpearId % 2 === 0 ? "#FF4778" : "#B57BFF",
            resolved: false,
          });
          sim.spawnCooldown = Math.max(0.78, 1.38 - parriesRef.current * 0.055);
        }

        for (const spear of sim.spears) {
          if (spear.resolved) continue;
          // Slight perspective acceleration as spear rushes out of 3D depth
          const accel = 0.72 + spear.progress * 0.68;
          spear.progress += spear.speed * accel * dt;
          if (spear.progress >= 1.05) {
            spear.resolved = true;
            triggerMiss(coreX, coreY);
          }
        }
        sim.spears = sim.spears.filter((s) => !s.resolved);
      }

      // -------------------------------------------------------------------
      // 1. DRAW BACKLIT GLOWING RUNIC AEGIS CORE + GOLDEN PERFECT PARRY RING
      // -------------------------------------------------------------------
      const anyInWindow = sim.spears.some(
        (s) => !s.resolved && s.progress >= 0.68 && s.progress <= 1.02
      );

      // Ambient backlight beneath Aegis Core
      const auraGrad = ctx.createRadialGradient(
        coreX,
        coreY,
        8,
        coreX,
        coreY,
        parryRingRadius * 1.65
      );
      if (sim.aegisMissGlow > 0.05) {
        auraGrad.addColorStop(0, `rgba(255, 71, 120, ${0.42 * sim.aegisMissGlow + 0.15})`);
        auraGrad.addColorStop(0.55, `rgba(181, 123, 255, ${0.15 * sim.aegisMissGlow})`);
      } else {
        auraGrad.addColorStop(
          0,
          `rgba(230, 201, 153, ${0.32 + sim.aegisFlash * 0.55 + (anyInWindow ? 0.18 : 0)})`
        );
        auraGrad.addColorStop(0.45, `rgba(165, 232, 255, ${0.18 + sim.aegisFlash * 0.3})`);
      }
      auraGrad.addColorStop(1, "rgba(5, 7, 13, 0)");
      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.arc(coreX, coreY, parryRingRadius * 1.65, 0, Math.PI * 2);
      ctx.fill();

      // Expanding Golden Perfect Parry Ring (pulses outward subtly, flares bright gold when spear enters!)
      const pulseExpand = (sim.elapsed * 0.85) % 1;
      ctx.save();
      ctx.strokeStyle = anyInWindow
        ? "rgba(255, 232, 165, 0.95)"
        : "rgba(230, 201, 153, 0.58)";
      ctx.lineWidth = anyInWindow ? 3.4 : 2.1;
      ctx.shadowColor = anyInWindow ? "#FFE08A" : "#E6C999";
      ctx.shadowBlur = blur(anyInWindow ? 24 : 10);
      ctx.beginPath();
      ctx.arc(coreX, coreY, parryRingRadius + sim.aegisPulse * 8, 0, Math.PI * 2);
      ctx.stroke();

      // Subtle animated golden radar echo ring
      ctx.strokeStyle = `rgba(230, 201, 153, ${(1 - pulseExpand) * 0.28})`;
      ctx.lineWidth = 1.2;
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.arc(coreX, coreY, parryRingRadius * (0.65 + pulseExpand * 0.55), 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Carved Inner Runic Aegis Octagon & Rotating Seal
      ctx.save();
      ctx.translate(coreX, coreY);
      ctx.rotate(sim.elapsed * 0.45);
      const innerR = 36 + sim.aegisPulse * 5;
      ctx.strokeStyle = sim.aegisFlash > 0.1 ? "#FFFFFF" : "#A5E8FF";
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        const px = Math.cos(a) * innerR;
        const py = Math.sin(a) * innerR;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fillStyle = "rgba(8, 13, 28, 0.88)";
      ctx.fill();
      ctx.stroke();

      // Inner counter-rotating gold rune diamond
      ctx.rotate(-sim.elapsed * 1.15);
      ctx.strokeStyle = "#E6C999";
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(0, -21);
      ctx.lineTo(21, 0);
      ctx.lineTo(0, 21);
      ctx.lineTo(-21, 0);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();

      // Glowing center rune glyph
      ctx.save();
      ctx.font = "bold 20px Georgia, serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = anyInWindow ? "#FFF2C2" : "#A5E8FF";
      ctx.shadowColor = anyInWindow ? "#E6C999" : "#A5E8FF";
      ctx.shadowBlur = blur(14);
      ctx.fillText("ᛉ", coreX, coreY + 1);
      ctx.restore();

      // -------------------------------------------------------------------
      // 2. DRAW CORRUPTED CRIMSON/VIOLET LOGIC SPEARS WITH TRAILS & TIMING RINGS
      // -------------------------------------------------------------------
      for (const spear of sim.spears) {
        const sx0 = spear.startX * w;
        const sy0 = spear.startY * h;
        const x = sx0 + (coreX - sx0) * spear.progress;
        const y = sy0 + (coreY - sy0) * spear.progress;
        const angle = Math.atan2(coreY - sy0, coreX - sx0);
        const scale = 0.38 + spear.progress * 0.95;
        const inParryZone = spear.progress >= 0.68 && spear.progress <= 1.02;

        // Motion trail streak back toward vanishing origin
        const tailP = Math.max(0, spear.progress - 0.24);
        const tx = sx0 + (coreX - sx0) * tailP;
        const ty = sy0 + (coreY - sy0) * tailP;

        const trailGrad = ctx.createLinearGradient(tx, ty, x, y);
        trailGrad.addColorStop(0, "rgba(181, 123, 255, 0)");
        trailGrad.addColorStop(0.55, `${spear.color}66`);
        trailGrad.addColorStop(1, inParryZone ? "#FFE7AA" : spear.color);

        ctx.save();
        ctx.strokeStyle = trailGrad;
        ctx.lineWidth = 5 * scale;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(x, y);
        ctx.stroke();

        // Contracting Timing Ring around Spearhead (flares gold right inside Parry Ring!)
        const timingRadius = Math.max(12, (1 - spear.progress) * 58 + 14);
        ctx.strokeStyle = inParryZone ? "#FFE7AA" : `${spear.color}AA`;
        ctx.lineWidth = inParryZone ? 2.6 : 1.4;
        ctx.beginPath();
        ctx.arc(x, y, timingRadius, 0, Math.PI * 2);
        ctx.stroke();

        // Sculpted Crystalline Spearhead
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.shadowColor = inParryZone ? "#FFE08A" : spear.color;
        ctx.shadowBlur = blur(inParryZone ? 22 : 14);
        ctx.fillStyle = inParryZone ? "#FFF2C9" : spear.color;
        ctx.beginPath();
        ctx.moveTo(18 * scale, 0);
        ctx.lineTo(-10 * scale, -7.5 * scale);
        ctx.lineTo(-4 * scale, 0);
        ctx.lineTo(-10 * scale, 7.5 * scale);
        ctx.closePath();
        ctx.fill();

        // Inner white-hot spine
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.moveTo(13 * scale, 0);
        ctx.lineTo(-4 * scale, -2.5 * scale);
        ctx.lineTo(-4 * scale, 2.5 * scale);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Crisp subtle coder struggle tag (`TLE`, `SEGFAULT`, `O(N²)`, `NULL PTR`, `DEADLOCK`)
        ctx.save();
        ctx.font = `700 ${Math.round(10 + scale * 2.5)}px "JetBrains Mono", monospace`;
        ctx.textAlign = "center";
        ctx.fillStyle = inParryZone ? "#FFE7AA" : "#F6D5E1";
        ctx.shadowColor = "rgba(5,7,13,0.95)";
        ctx.shadowBlur = blur(6);
        ctx.fillText(spear.label, x, y - 22 * scale);
        ctx.restore();
      }

      // -------------------------------------------------------------------
      // 3. DRAW SHOCKWAVE RINGS, 48+ DIRECTIONAL SPARKS & KINETIC CALLOUTS
      // -------------------------------------------------------------------
      for (let i = sim.rings.length - 1; i >= 0; i--) {
        const r = sim.rings[i];
        r.radius += (r.maxRadius - r.radius) * Math.min(1, rawDt * 9.5);
        r.alpha -= rawDt * 2.3;
        if (r.alpha <= 0.01) {
          sim.rings.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.strokeStyle = r.color;
        ctx.globalAlpha = Math.max(0, r.alpha);
        ctx.lineWidth = 3.2 * r.alpha + 1;
        ctx.shadowColor = r.color;
        ctx.shadowBlur = blur(18);
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
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
        sp.vx *= 0.965;
        sp.vy = sp.vy * 0.965 + 290 * rawDt;
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
        ctx.shadowColor = c.color;
        ctx.shadowBlur = blur(14);
        ctx.fillText(c.text, c.x, c.y - t * 38);
        ctx.restore();
      }

      if (!isPaused) {
        rafId = window.requestAnimationFrame(drawLoop);
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        isPaused = true;
        if (rafId) {
          window.cancelAnimationFrame(rafId);
          rafId = 0;
        }
      } else {
        isPaused = false;
        lastTime = performance.now();
        if (!rafId) {
          rafId = window.requestAnimationFrame(drawLoop);
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    if (!isPaused) {
      rafId = window.requestAnimationFrame(drawLoop);
    }
    return () => {
      isPaused = true;
      window.cancelAnimationFrame(rafId);
      resizeObserver?.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("orientationchange", resize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [webglRef]);

  return (
    <div
      onPointerDown={(e) => {
        const el = e.target as HTMLElement | null;
        if (el && el.closest("button, a")) return;
        triggerParryAttempt();
      }}
      className="relative w-full h-full overflow-hidden select-none cursor-crosshair touch-none"
    >
      {/* 60FPS PLAYABLE RUNIC PARRY TRIAL CANVAS (DIRECTLY OVER LIVE 3D WEBGL REALM) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none touch-none"
      />

      {/* MISS RED VIGNETTE + CRACKED SCREEN EDGE OVERLAY */}
      <AnimatePresence>
        {missFlash && (
          <motion.div
            key="miss-crack"
            initial={{ opacity: 0.9 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.38 }}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-20"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, transparent 56%, rgba(255, 56, 100, 0.44) 100%)",
            }}
          >
            <svg
              viewBox="0 0 1000 600"
              preserveAspectRatio="none"
              className="w-full h-full opacity-75"
            >
              <path
                d="M0 120 L75 152 L118 130 L170 165 M1000 410 L910 385 L865 415 L810 390 M180 600 L215 535 L252 550 M840 0 L805 68 L765 55"
                fill="none"
                stroke="#FF5C82"
                strokeWidth="2.5"
              />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* GOLD WARP FLASH SURGE AT ACT I COMPLETION */}
      <AnimatePresence>
        {warpingOut && (
          <motion.div
            key="gold-warp"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.55, 0.92] }}
            transition={{ duration: 1.1 }}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-30"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(255,244,210,0.92) 0%, rgba(230,201,153,0.45) 45%, rgba(5,7,13,0.15) 100%)",
            }}
          />
        )}
      </AnimatePresence>

      {/* TOP 4-STAGE MASTERY METER HUD (VISIBLE DURING PLAYING & VICTORY) */}
      {phase !== "INTRO" && (
        <div className="relative z-10 max-w-3xl mx-auto px-4 pt-3 sm:pt-5 pointer-events-none">
          <div className="rounded-xl bg-[#070B16]/88 border border-white/[0.1] px-4 py-3 space-y-2.5">
            <div className="flex items-center justify-between gap-2 text-[10.5px] sm:text-xs font-mono">
              <span className="font-mythic tracking-[0.18em] text-[#A5E8FF] inline-flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-[#E6C999]" />
                <span>RUNIC PARRY TRIAL · 360+ DSA MASTERY</span>
              </span>
              <span className="text-[#E6C999] font-bold tabular-nums">
                {parries} / {TARGET_PARRIES} PARRIES
              </span>
            </div>

            {/* 4-Stage Segmented Milestone Progress Bar */}
            <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
              {MASTERY_MILESTONES.map((ms, idx) => {
                const segStart = idx * 2;
                const segFill = Math.max(0, Math.min(1, (parries - segStart) / 2));
                const unlocked = parries >= ms.parriesRequired;
                return (
                  <div key={ms.title} className="space-y-1">
                    <div className="h-2 rounded-sm bg-[#101628] border border-white/[0.08] overflow-hidden">
                      <div
                        className="h-full origin-left transition-transform duration-200"
                        style={{
                          transform: `scaleX(${segFill})`,
                          backgroundColor: ms.accent,
                        }}
                      />
                    </div>
                    <p
                      className="font-mono text-[9px] sm:text-[10px] truncate transition-colors"
                      style={{
                        color: unlocked ? ms.accent : "#66718F",
                      }}
                    >
                      {unlocked ? ms.title.split(" — ")[0] : `STAGE ${idx + 1}`}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* DRAMATIC GLOWING MILESTONE UNLOCK BANNER FLASH */}
      <AnimatePresence>
        {activeBanner && (
          <motion.div
            key={activeBanner.title}
            initial={{ opacity: 0, scale: 0.9, y: -14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.04, y: -12 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-none absolute top-28 sm:top-32 inset-x-4 z-20 flex justify-center"
          >
            <div
              className="px-6 py-3.5 rounded-xl bg-[rgba(8,11,20,0.92)] border text-center max-w-xl"
              style={{
                borderColor: `${activeBanner.accent}99`,
              }}
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-[#9EA8C4]">
                MILESTONE FORGED · {activeBanner.handle}
              </p>
              <p
                className="font-mythic text-sm sm:text-lg font-bold tracking-[0.14em] mt-1"
                style={{ color: activeBanner.accent }}
              >
                {activeBanner.title}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ENCOURAGING GRIT LINE ON MISS */}
      <AnimatePresence>
        {gritLine && phase === "PLAYING" && (
          <motion.div
            key={gritLine}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.28 }}
            className="pointer-events-none absolute bottom-[28%] inset-x-4 z-20 flex justify-center"
          >
            <p className="px-4 py-1.5 rounded-lg bg-[#190912]/90 border border-[#FF5C82]/45 font-space text-xs sm:text-sm text-[#FFD2DE] tracking-wide">
              &ldquo;{gritLine}&rdquo;
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CINEMATIC INTRO DIALOGUE (2.5 SECONDS, SKIPPABLE) */}
      <AnimatePresence>
        {phase === "INTRO" && (
          <motion.div
            key="act1-intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.03 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center bg-[#05070D]/62"
          >
            <div className="max-w-2xl space-y-5">
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.12 }}
                className="font-space text-base sm:text-xl md:text-2xl text-[#D5DDF2] leading-relaxed"
              >
                &ldquo;Every engineer starts in the dark. Wrong answers. Time Limit
                Exceeded. 2:00 AM silence.&rdquo;
              </motion.p>

              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.75, delay: 0.7 }}
                className="h-px w-48 mx-auto"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, #A5E8FF, #E6C999, transparent)",
                }}
              />

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 1.05 }}
                className="font-mythic text-sm sm:text-lg md:text-xl font-bold tracking-[0.14em] text-[#E6C999]"
              >
                &ldquo;Discipline is not talent. It is refusing to break.&rdquo;
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3 }}
                className="pt-3"
              >
                <button
                  type="button"
                  onClick={() => {
                    retroAudio.playClick();
                    setPhase("PLAYING");
                  }}
                  className="px-5 py-2.5 rounded-lg bg-[#0B1020] hover:bg-[#141D38] border border-[#A5E8FF]/45 font-mono text-xs text-[#A5E8FF] tracking-[0.14em] cursor-pointer transition-colors touch-manipulation"
                >
                  BEGIN TRIAL (SPACE / TAP)
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BOTTOM PROMPT + DISCRETE RECRUITER SKIP / VERIFY LINKS */}
      {phase === "PLAYING" && (
        <div className="absolute bottom-3 inset-x-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          <div className="flex items-center gap-2 pointer-events-auto">
            {MASTERY_MILESTONES.filter((m) => parries >= m.parriesRequired).map((m) => (
              <a
                key={m.handle}
                href={m.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.stopPropagation();
                  retroAudio.playClick();
                }}
                className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[rgba(8,11,20,0.9)] border border-white/[0.12] hover:border-[#A5E8FF]/55 font-mono text-[10px] text-[#C8D1E6] touch-manipulation"
              >
                <span>{m.handle}</span>
                <ExternalLink className="w-2.5 h-2.5 text-[#A5E8FF]" />
              </a>
            ))}
          </div>

          <p className="font-mono text-[10.5px] sm:text-xs text-[#E6C999] bg-[rgba(8,11,20,0.88)] border border-[#E6C999]/30 px-3.5 py-1.5 rounded-lg mx-auto sm:mx-0">
            PRESS <kbd className="font-bold text-white">SPACE</kbd> OR TAP WHEN SPEARS ENTER
            THE GOLD RING
          </p>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              triggerFinishIntoActTwo();
            }}
            className="pointer-events-auto px-3 py-1.5 rounded-lg bg-[rgba(8,11,20,0.9)] hover:bg-[#131C36] border border-white/[0.14] text-[#B2BCD6] hover:text-[#F2F4FB] font-mono text-[10.5px] inline-flex items-center gap-1 cursor-pointer transition-colors touch-manipulation"
          >
            <span>SKIP TO ACT II</span>
            <ArrowRight className="w-3 h-3 text-[#E6C999]" />
          </button>
        </div>
      )}
    </div>
  );
}
