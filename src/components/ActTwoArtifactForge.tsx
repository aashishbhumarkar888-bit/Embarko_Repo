import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronLeft,
  ChevronRight,
  Flame,
  Sparkles,
  ExternalLink,
  Github,
  ArrowRight,
  Check,
  AlertTriangle,
} from "lucide-react";
import { PORTFOLIO_DATA } from "../data/portfolioData";
import { retroAudio } from "../utils/retroAudio";
import type { StoryWebGLHandle } from "./StoryWebGLCanvas";

export interface ArtifactLoreEntry {
  id: string;
  index: number;
  shortName: string;
  title: string;
  badge: string;
  rune: string;
  accentHex: string;
  accentNum: number;
  crisis: string;
  architecture: string[];
  legacy: string;
  liveLink: string;
  github: string;
}

interface ActTwoArtifactForgeProps {
  webglRef: React.RefObject<StoryWebGLHandle | null>;
  focusedIndex: number;
  onSelectIndex: (index: number) => void;
  onAdvanceToActThree: () => void;
}

const HOLD_DURATION_MS = 1200;

export default function ActTwoArtifactForge({
  webglRef,
  focusedIndex,
  onSelectIndex,
  onAdvanceToActThree,
}: ActTwoArtifactForgeProps) {
  // Build the 4 Flagship 3D Artifacts directly from real PORTFOLIO_DATA entries
  const artifacts = useMemo<ArtifactLoreEntry[]>(() => {
    const nasaAch = PORTFOLIO_DATA.achievements.find(
      (a) => a.id === "nasa-space-apps"
    );
    const spo = PORTFOLIO_DATA.projects.find((p) => p.id === "spo-procurement");
    const voltpath = PORTFOLIO_DATA.projects.find((p) => p.id === "voltpath-ai");
    const secureFill = PORTFOLIO_DATA.projects.find((p) => p.id === "secure-fill");

    return [
      {
        id: "dspace-nasa",
        index: 0,
        shortName: "DSpace",
        title: "DSpace — NASA Space Apps Global Nominee",
        badge: "GLOBAL NOMINEE · NASA SPACE APPS",
        rune: "ᛟ",
        accentHex: "#E6C999",
        accentNum: 0xe6c999,
        crisis:
          "Raw deep-space telemetry datasets overwhelm non-specialists, burying real orbital patterns behind inaccessible numeric logs.",
        architecture: [
          "React.js",
          "TypeScript",
          "Interactive Telemetry Viz",
          "WebGL / Canvas",
          "NASA Open Data",
        ],
        legacy:
          nasaAch?.description ??
          "Selected as Global Nominee at the NASA Space Apps Bhopal local event for shipping an interactive space telemetry visualization platform in a 48-hour sprint.",
        liveLink:
          nasaAch?.credentialUrl ??
          PORTFOLIO_DATA.profile.links.certificateVaultUrl,
        github: PORTFOLIO_DATA.profile.links.github,
      },
      {
        id: "spo-procurement",
        index: 1,
        shortName: "SPO Off-Grid",
        title: spo?.title ?? "SPO — Smart Farmer Procurement",
        badge: "2ND PLACE MVP · BGI HACKATHON",
        rune: "ᚠ",
        accentHex: "#98F5E1",
        accentNum: 0x98f5e1,
        crisis:
          spo?.codex.crisis ??
          "Smallholder farmers routinely lose 15–20% of crop earnings to opaque middlemen and multi-day paper settlement delays.",
        architecture: spo?.stack ?? [
          "React 19",
          "TypeScript",
          "Node.js",
          "Tailwind CSS",
          "Vercel",
        ],
        legacy:
          spo?.codex.legacy ??
          "Won Runner-Up (2nd Place) MVP in a 36-hour hackathon sprint with sub-100ms digital settlement receipts deployed live on Vercel.",
        liveLink: spo?.liveLink ?? "https://spo-snowy.vercel.app/",
        github: spo?.github ?? "https://github.com/aashishbhumarkar888-bit/SPO",
      },
      {
        id: "voltpath-ai",
        index: 2,
        shortName: "VoltPath AI",
        title: voltpath?.title ?? "VoltPath AI — EV Charging Locator",
        badge: "45% WAIT REDUCTION · 50+ NODES",
        rune: "ᚢ",
        accentHex: "#90DBF4",
        accentNum: 0x90dbf4,
        crisis:
          voltpath?.codex.crisis ??
          "Explosive EV adoption has outpaced charging visibility, stranding drivers in unpredictable queues with incompatible connector types.",
        architecture: voltpath?.stack ?? [
          "React.js",
          "Node.js",
          "Firebase Firestore",
          "REST APIs",
          "Tailwind CSS",
        ],
        legacy:
          voltpath?.codex.legacy ??
          "Mapped 50+ station nodes and cut modeled driver charging queue wait times by 45% with live Firestore availability sync.",
        liveLink: voltpath?.liveLink ?? "https://voltpath-ai.base44.app/",
        github:
          voltpath?.github ??
          "https://github.com/aashishbhumarkar888-bit/Voltpath-ai",
      },
      {
        id: "secure-fill",
        index: 3,
        shortName: "Secure Fill",
        title: secureFill?.title ?? "Secure-Fill — Form Sanitizer & SHA-256",
        badge: "CRYPTOGRAPHIC INTEGRITY · RAILWAY",
        rune: "ᚦ",
        accentHex: "#C8B6FF",
        accentNum: 0xc8b6ff,
        crisis:
          secureFill?.codex.crisis ??
          "Unvalidated web forms expose production databases to silent XSS injection, corrupted payloads, and tampered submissions.",
        architecture: secureFill?.stack ?? [
          "TypeScript",
          "React.js",
          "Node.js",
          "Express",
          "MongoDB",
          "Crypto API",
        ],
        legacy:
          secureFill?.codex.legacy ??
          "Shipped as a hardened full-stack microservice live on Railway with upfront XSS stripping and end-to-end SHA-256 verification.",
        liveLink:
          secureFill?.liveLink ??
          "https://secure-fill-production.up.railway.app/",
        github:
          secureFill?.github ??
          "https://github.com/aashishbhumarkar888-bit/Secure-fill",
      },
    ];
  }, []);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const chargeCircleRef = useRef<SVGCircleElement | null>(null);
  const flameIconRef = useRef<SVGSVGElement | null>(null);
  const chargeLabelRef = useRef<HTMLSpanElement | null>(null);
  const chargeProgressRef = useRef<number>(0);

  const [ignited, setIgnited] = useState<[boolean, boolean, boolean, boolean]>([
    false,
    false,
    false,
    false,
  ]);
  const [isHolding, setIsHolding] = useState<boolean>(false);
  const [detonationFlash, setDetonationFlash] = useState<string | null>(null);
  const [plotTwistActive, setPlotTwistActive] = useState<boolean>(false);
  const [isLandscape, setIsLandscape] = useState<boolean>(() =>
    typeof window !== "undefined"
      ? window.innerWidth / Math.max(1, window.innerHeight) >= 1.2
      : true
  );

  const ignitedRef = useRef(ignited);
  ignitedRef.current = ignited;

  const focusedRef = useRef(focusedIndex);
  focusedRef.current = focusedIndex;

  const holdRafRef = useRef<number>(0);
  const holdStartRef = useRef<number>(0);
  const holdingRef = useRef<boolean>(false);
  const detonateTimerRef = useRef<number | null>(null);
  const twistTimerRef = useRef<number | null>(null);

  const activeArtifact = artifacts[focusedIndex] ?? artifacts[0];
  const isFocusedIgnited = ignited[focusedIndex];
  const ignitedCount = ignited.filter(Boolean).length;
  const ringCircumference = 2 * Math.PI * 44;

  // Direct DOM updater for Hold-to-Ignite ring & flame (zero React re-renders per frame)
  const applyChargeDom = useCallback(
    (p: number, holding: boolean) => {
      if (chargeCircleRef.current) {
        chargeCircleRef.current.style.strokeDashoffset = String(
          ringCircumference * (1 - p)
        );
      }
      if (flameIconRef.current) {
        flameIconRef.current.style.transform = `scale(${1 + p * 0.35})`;
      }
      if (chargeLabelRef.current) {
        chargeLabelRef.current.textContent = holding
          ? `${Math.round(p * 100)}%`
          : "HOLD TO IGNITE";
      }
    },
    [ringCircumference]
  );

  // Track aspect ratio via ResizeObserver + orientationchange for exact 45/55 landscape vs 38/62 portrait split
  useEffect(() => {
    const updateLayoutMode = () => {
      const el = rootRef.current;
      const w = el ? el.clientWidth : window.innerWidth;
      const h = el ? el.clientHeight : window.innerHeight;
      setIsLandscape(w / Math.max(1, h) >= 1.2);
    };
    updateLayoutMode();
    const ro =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(updateLayoutMode) : null;
    if (ro && rootRef.current) ro.observe(rootRef.current);
    window.addEventListener("resize", updateLayoutMode);
    window.addEventListener("orientationchange", updateLayoutMode);
    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", updateLayoutMode);
      window.removeEventListener("orientationchange", updateLayoutMode);
    };
  }, []);

  // Keep Three.js 3D Artifact carousel synced on discrete focus / ignition changes
  useEffect(() => {
    webglRef.current?.setAct2State(focusedIndex, ignited, chargeProgressRef.current);
  }, [focusedIndex, ignited, webglRef]);

  const stopCharge = useCallback(() => {
    if (!holdingRef.current) return;
    holdingRef.current = false;
    chargeProgressRef.current = 0;
    setIsHolding(false);
    window.cancelAnimationFrame(holdRafRef.current);
    holdRafRef.current = 0;
    retroAudio.stopIgniteCharge();
    applyChargeDom(0, false);
    webglRef.current?.setAct2State(focusedRef.current, ignitedRef.current, 0);
  }, [applyChargeDom, webglRef]);

  // Cleanup charge audio, visibility pause & timers on unmount
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden && holdingRef.current) {
        stopCharge();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.cancelAnimationFrame(holdRafRef.current);
      retroAudio.stopIgniteCharge();
      if (detonateTimerRef.current) window.clearTimeout(detonateTimerRef.current);
      if (twistTimerRef.current) window.clearTimeout(twistTimerRef.current);
    };
  }, [stopCharge]);

  const completeIgnition = useCallback(
    (idx: number) => {
      holdingRef.current = false;
      chargeProgressRef.current = 0;
      setIsHolding(false);
      window.cancelAnimationFrame(holdRafRef.current);
      holdRafRef.current = 0;
      applyChargeDom(0, false);

      const art = artifacts[idx];
      if (!art) return;

      retroAudio.playArtifactDetonate();
      webglRef.current?.triggerArtifactDetonation(idx, art.accentNum);

      setIgnited((prev) => {
        const next = [...prev] as [boolean, boolean, boolean, boolean];
        next[idx] = true;
        return next;
      });

      setDetonationFlash(art.accentHex);
      if (detonateTimerRef.current) window.clearTimeout(detonateTimerRef.current);
      detonateTimerRef.current = window.setTimeout(() => {
        setDetonationFlash(null);
      }, 650);
    },
    [applyChargeDom, artifacts, webglRef]
  );

  const startCharge = useCallback(() => {
    if (plotTwistActive || document.hidden) return;
    const idx = focusedRef.current;
    if (ignitedRef.current[idx] || holdingRef.current) return;

    holdingRef.current = true;
    chargeProgressRef.current = 0;
    setIsHolding(true);
    holdStartRef.current = performance.now();
    retroAudio.startIgniteCharge();
    applyChargeDom(0, true);

    const step = (now: number) => {
      if (!holdingRef.current || document.hidden) return;
      const elapsed = now - holdStartRef.current;
      const p = Math.min(1, elapsed / HOLD_DURATION_MS);
      chargeProgressRef.current = p;
      applyChargeDom(p, true);
      retroAudio.updateIgniteCharge(p);
      webglRef.current?.setAct2State(focusedRef.current, ignitedRef.current, p);

      if (p >= 1) {
        completeIgnition(focusedRef.current);
        return;
      }
      holdRafRef.current = window.requestAnimationFrame(step);
    };
    holdRafRef.current = window.requestAnimationFrame(step);
  }, [applyChargeDom, completeIgnition, plotTwistActive, webglRef]);

  const cycleArtifact = useCallback(
    (delta: number) => {
      if (plotTwistActive) return;
      stopCharge();
      retroAudio.playClick();
      const next = (focusedRef.current + delta + 4) % 4;
      onSelectIndex(next);
    },
    [onSelectIndex, plotTwistActive, stopCharge]
  );

  // Keyboard navigation (A/D or Left/Right) + Hold SPACE to ignite!
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (plotTwistActive) return;
      if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") {
        e.preventDefault();
        cycleArtifact(-1);
      } else if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") {
        e.preventDefault();
        cycleArtifact(1);
      } else if (e.code === "Space" && !e.repeat) {
        e.preventDefault();
        startCharge();
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        stopCharge();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [cycleArtifact, plotTwistActive, startCharge, stopCharge]);

  // DRAMATIC PLOT TWIST TRANSITION INTO ACT III (Sky flickers -> crimson lights -> HUD cracks!)
  const handleTriggerPlotTwist = useCallback(() => {
    if (plotTwistActive) return;
    stopCharge();
    setPlotTwistActive(true);
    retroAudio.playPlotTwistRumble();
    webglRef.current?.triggerPlotTwistCrimson();

    twistTimerRef.current = window.setTimeout(() => {
      onAdvanceToActThree();
    }, 1650);
  }, [onAdvanceToActThree, plotTwistActive, stopCharge, webglRef]);

  return (
    <div
      ref={rootRef}
      className="relative w-full h-full min-h-0 flex flex-col justify-between overflow-hidden select-none"
    >
      {/* BLINDING PASTEL DETONATION SHOCKWAVE FLASH AT 100% IGNITION */}
      <AnimatePresence>
        {detonationFlash && (
          <motion.div
            key={`det-${detonationFlash}`}
            initial={{ opacity: 0.92, scale: 0.45 }}
            animate={{ opacity: 0, scale: 2.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-30"
            style={{
              background: `radial-gradient(circle at 50% 48%, #FFFFFF 0%, ${detonationFlash}CC 32%, transparent 72%)`,
            }}
          />
        )}
      </AnimatePresence>

      {/* PLOT TWIST TRANSITION OVERLAY: SKY FLICKER + CRIMSON HUD FRACTURE CRACKS */}
      <AnimatePresence>
        {plotTwistActive && (
          <motion.div
            key="plot-twist-fracture"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 pointer-events-none flex items-center justify-center animate-rift-shake"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(255,47,91,0.12) 0%, rgba(26,5,14,0.78) 85%, rgba(10,2,6,0.95) 100%)",
            }}
          >
            {/* Expanding Glowing Volcanic Crimson Fracture Cracks */}
            <svg
              viewBox="0 0 1200 700"
              preserveAspectRatio="none"
              className="absolute inset-0 w-full h-full"
            >
              <motion.path
                d="M0 110 L185 170 L275 138 L440 245 L580 220 L650 315 M1200 580 L980 480 L860 515 L710 405 L615 430 M960 0 L870 155 L915 240 L765 325 M160 700 L290 540 L260 455 L425 365"
                fill="none"
                stroke="#FF3B6B"
                strokeWidth="3.2"
                initial={{ pathLength: 0, opacity: 0.2 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
              />
              <motion.path
                d="M440 245 L410 340 L485 415 M710 405 L770 310 L690 245"
                fill="none"
                stroke="#FF9F5A"
                strokeWidth="2"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.9 }}
                transition={{ duration: 0.75, delay: 0.35 }}
              />
            </svg>

            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: [0, 1, 0.7, 1], scale: 1 }}
              transition={{ duration: 0.85 }}
              className="relative z-10 px-6 py-4 rounded-xl bg-[rgba(22,5,12,0.94)] border border-[#FF4778]/75 text-center max-w-lg mx-4"
            >
              <p className="font-mono text-[10.5px] uppercase tracking-[0.28em] text-[#FF8FA8] inline-flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-[#FF4778]" />
                <span>SYSTEM ANOMALY // REALM FRACTURE</span>
              </p>
              <h3 className="font-mythic text-lg sm:text-2xl font-bold tracking-[0.16em] text-[#FFE8EE] mt-1.5">
                THE LEGACY MONOLITH AWAKENS
              </h3>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ZONE 1: TOP NARRATIVE HEADER (COMPACT, NEVER GROWS) */}
      <div className="relative z-10 shrink-0 max-w-4xl mx-auto px-4 pt-2 sm:pt-3 pb-1 text-center pointer-events-none">
        <p className="font-mono text-[10px] sm:text-[10.5px] uppercase tracking-[0.26em] text-[#E6C999]">
          ACT II · 3D ARTIFACT AWAKENING ({ignitedCount}/4 IGNITED)
        </p>
        <p className="font-space text-xs sm:text-sm text-[#C8D1E6] mt-0.5 max-w-xl mx-auto line-clamp-2">
          &ldquo;Solving problems on paper was never enough. Ideas mean nothing until they
          ship.&rdquo;
        </p>
      </div>

      {/* ZONE 2: MIDDLE STAGE (flex-1 min-h-0) — STRICT LANDSCAPE 45/55 vs PORTRAIT 38/62 SPLIT */}
      <div className="relative z-10 flex-1 min-h-0 w-full overflow-hidden pointer-events-none">
        <AnimatePresence mode="wait">
          {isFocusedIgnited ? (
            <div
              key={`lore-stage-${activeArtifact.id}`}
              className={
                isLandscape
                  ? "w-full h-full min-h-0 flex flex-row items-center"
                  : "w-full h-full min-h-0 flex flex-col"
              }
            >
              {/* Unobstructed 3D Artifact Viewport Window (Left 45% in Landscape, Upper 38% in Portrait) */}
              <div
                aria-hidden="true"
                className={
                  isLandscape
                    ? "w-[45%] h-full shrink-0 pointer-events-none"
                    : "h-[38%] w-full shrink-0 pointer-events-none"
                }
              />

              {/* Scrollable Lore Card Pane (Right 55% in Landscape, Lower 62% in Portrait) */}
              <div
                className={
                  isLandscape
                    ? "w-[55%] h-full min-h-0 flex items-center justify-center px-4 sm:px-6 lg:px-10 py-2"
                    : "h-[62%] w-full min-h-0 flex items-start justify-center px-3 sm:px-6 pb-2"
                }
              >
                <motion.div
                  data-story-ui="true"
                  initial={{ opacity: 0, x: isLandscape ? 28 : 0, y: isLandscape ? 0 : 18 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  exit={{ opacity: 0, x: isLandscape ? 20 : 0, y: isLandscape ? 0 : 12 }}
                  transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
                  className="pointer-events-auto w-full max-w-xl max-h-full overflow-y-auto overscroll-contain rounded-2xl bg-[rgba(8,11,20,0.9)] border p-4 sm:p-5 text-left space-y-3.5"
                  style={{
                    borderColor: `${activeArtifact.accentHex}66`,
                  }}
                >
              <div className="flex items-start justify-between gap-3 border-b border-white/[0.08] pb-3.5">
                <div className="space-y-1 min-w-0">
                  <p
                    className="font-mono text-[10px] uppercase tracking-[0.18em] inline-flex items-center gap-1.5"
                    style={{ color: activeArtifact.accentHex }}
                  >
                    <Sparkles className="w-3 h-3 shrink-0" />
                    <span>{activeArtifact.badge}</span>
                  </p>
                  <h3 className="font-mythic text-base sm:text-xl font-bold text-[#F2F4FB] tracking-[0.06em] leading-snug">
                    {activeArtifact.title}
                  </h3>
                </div>
                <span
                  className="w-9 h-9 rounded-lg border flex items-center justify-center font-serif text-lg font-bold shrink-0 bg-[#0B1122]"
                  style={{
                    borderColor: `${activeArtifact.accentHex}66`,
                    color: activeArtifact.accentHex,
                  }}
                >
                  {activeArtifact.rune}
                </span>
              </div>

              {/* 3 Concise AAA Lore Beats */}
              <div className="space-y-3">
                <div className="rounded-xl bg-[#0C1223] border border-white/[0.07] p-3.5 space-y-1">
                  <p className="font-mythic text-[10px] tracking-[0.18em] text-[#FF7597]">
                    I. THE CRISIS
                  </p>
                  <p className="text-xs sm:text-[13px] text-[#D0D8EC] leading-relaxed">
                    {activeArtifact.crisis}
                  </p>
                </div>

                <div className="rounded-xl bg-[#0C1223] border border-white/[0.07] p-3.5 space-y-2">
                  <p className="font-mythic text-[10px] tracking-[0.18em] text-[#A5E8FF]">
                    II. THE ARCHITECTURE
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {activeArtifact.architecture.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 rounded-md bg-[#121B33] border border-white/[0.1] font-mono text-[10.5px] text-[#E6C999]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl bg-[#0C1223] border border-white/[0.07] p-3.5 space-y-1">
                  <p className="font-mythic text-[10px] tracking-[0.18em] text-[#98F5E1]">
                    III. THE LEGACY
                  </p>
                  <p className="text-xs sm:text-[13px] text-[#D0D8EC] leading-relaxed">
                    {activeArtifact.legacy}
                  </p>
                </div>
              </div>

              {/* Direct Clickable Judge/Recruiter Links */}
              <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={activeArtifact.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => retroAudio.playClick()}
                    className="min-h-[40px] px-3.5 py-1.5 rounded-lg bg-[#121B33] hover:bg-[#1A2748] border border-[#98F5E1]/45 text-[#98F5E1] font-mono text-xs inline-flex items-center gap-1.5 transition-colors touch-manipulation"
                  >
                    <span>Live / Proof</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={activeArtifact.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => retroAudio.playClick()}
                    className="min-h-[40px] px-3.5 py-1.5 rounded-lg bg-[#121B33] hover:bg-[#1A2748] border border-white/[0.15] text-[#F2F4FB] font-mono text-xs inline-flex items-center gap-1.5 transition-colors touch-manipulation"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>GitHub</span>
                  </a>
                </div>

                <button
                  type="button"
                  onClick={() => cycleArtifact(1)}
                  className="min-h-[40px] px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.14] text-[#E6C999] font-mono text-[11px] inline-flex items-center gap-1 cursor-pointer transition-colors touch-manipulation"
                >
                  <span>Next Artifact</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
                </motion.div>
              </div>
            </div>
          ) : (
            <motion.div
              key={`dormant-${activeArtifact.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full flex flex-col items-center justify-end pb-3 px-4"
            >
              <div className="text-center mb-2.5">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#8E98B5]">
                  DORMANT MONOLITH · TAP ARTIFACTS OR USE A / D
                </p>
                <h3
                  className="font-mythic text-lg sm:text-2xl font-bold tracking-[0.12em] mt-0.5"
                  style={{ color: activeArtifact.accentHex }}
                >
                  {activeArtifact.shortName.toUpperCase()}
                </h3>
              </div>

              {/* CENTRAL HOLD-TO-IGNITE FORGE BUTTON (1.2 SECONDS, ZERO PER-FRAME REACT RE-RENDER) */}
              <button
                type="button"
                data-story-ui="true"
                onPointerDown={(e) => {
                  e.preventDefault();
                  startCharge();
                }}
                onPointerUp={stopCharge}
                onPointerLeave={stopCharge}
                onPointerCancel={stopCharge}
                className="pointer-events-auto relative group w-24 h-24 sm:w-28 sm:h-28 rounded-full flex flex-col items-center justify-center bg-[rgba(8,11,20,0.9)] border cursor-pointer active:scale-95 transition-transform touch-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E6C999]"
                style={{
                  borderColor: isHolding
                    ? activeArtifact.accentHex
                    : `${activeArtifact.accentHex}66`,
                }}
              >
                {/* SVG Radial Hold Progress Ring (Driven directly via ref) */}
                <svg
                  viewBox="0 0 100 100"
                  className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="44"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="3.5"
                  />
                  <circle
                    ref={chargeCircleRef}
                    cx="50"
                    cy="50"
                    r="44"
                    fill="none"
                    stroke={activeArtifact.accentHex}
                    strokeWidth="4.2"
                    strokeLinecap="round"
                    strokeDasharray={ringCircumference}
                    strokeDashoffset={ringCircumference}
                  />
                </svg>

                <Flame
                  ref={flameIconRef}
                  className="w-5 h-5 sm:w-6 sm:h-6 mb-1"
                  style={{
                    color: activeArtifact.accentHex,
                  }}
                />
                <span
                  ref={chargeLabelRef}
                  className="font-mythic text-[9px] sm:text-[10px] font-bold tracking-[0.14em] text-[#F2F4FB] leading-tight px-3 text-center"
                >
                  HOLD TO IGNITE
                </span>
                <span className="font-mono text-[8px] text-[#8E98B5] mt-0.5">
                  SPACE / HOLD
                </span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ZONE 3: UNIFIED BOTTOM ARTIFACT DOCK (shrink-0, NEVER CLIPPED) */}
      <div
        data-story-ui="true"
        className="relative z-20 shrink-0 px-3 sm:px-4 pb-2.5 pt-1.5 flex flex-wrap items-center justify-between gap-2 max-w-5xl w-full mx-auto"
      >
        {/* Left/Right Orbit Controls + 4 Artifact Selector Medallions */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => cycleArtifact(-1)}
            aria-label="Previous 3D Artifact"
            className="h-10 w-10 rounded-lg bg-[rgba(8,11,20,0.9)] hover:bg-[#131D38] border border-white/[0.14] flex items-center justify-center text-[#C8D1E6] hover:text-white cursor-pointer transition-colors touch-manipulation"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {artifacts.map((art) => {
            const isSelected = art.index === focusedIndex;
            const isLit = ignited[art.index];
            return (
              <button
                key={art.id}
                type="button"
                onClick={() => {
                  stopCharge();
                  retroAudio.playClick();
                  onSelectIndex(art.index);
                }}
                className={`h-10 px-2.5 sm:px-3.5 rounded-lg border font-mono text-[10.5px] sm:text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer touch-manipulation ${
                  isSelected
                    ? "bg-[#121A32] text-[#F2F4FB] font-bold"
                    : "bg-[rgba(8,11,20,0.88)] border-white/[0.1] text-[#8E98B5] hover:text-[#F2F4FB]"
                }`}
                style={
                  isSelected
                    ? { borderColor: art.accentHex }
                    : isLit
                    ? { borderColor: `${art.accentHex}55` }
                    : undefined
                }
              >
                <span style={{ color: art.accentHex }}>
                  {isLit ? <Check className="w-3 h-3" /> : art.rune}
                </span>
                <span>{art.shortName}</span>
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => cycleArtifact(1)}
            aria-label="Next 3D Artifact"
            className="h-10 w-10 rounded-lg bg-[rgba(8,11,20,0.9)] hover:bg-[#131D38] border border-white/[0.14] flex items-center justify-center text-[#C8D1E6] hover:text-white cursor-pointer transition-colors touch-manipulation"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* ADVANCE TO THE CRUCIBLE CTA (Triggers Plot Twist Transition into Act III!) */}
        <button
          type="button"
          onClick={handleTriggerPlotTwist}
          className={`h-10 px-4 sm:px-5 rounded-lg font-mythic text-[10.5px] sm:text-xs font-bold tracking-[0.15em] inline-flex items-center gap-2 transition-colors cursor-pointer touch-manipulation ${
            ignitedCount >= 2
              ? "bg-[#E6C999] hover:bg-[#f2dbb3] text-[#05070D] border border-[#FFF2CE]"
              : "bg-[rgba(8,11,20,0.9)] hover:bg-[#151E3A] border border-white/[0.16] text-[#C8D1E6] hover:text-[#F2F4FB]"
          }`}
        >
          <span>
            {ignitedCount >= 2
              ? "ADVANCE TO THE CRUCIBLE"
              : `ADVANCE TO CRUCIBLE (${ignitedCount}/2 IGNITED)`}
          </span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
