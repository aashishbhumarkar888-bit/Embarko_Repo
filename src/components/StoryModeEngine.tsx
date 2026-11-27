import React, { useEffect, useRef, useState, useCallback } from "react";
import { Volume2, VolumeX, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { retroAudio } from "../utils/retroAudio";
import StoryWebGLCanvas, {
  StoryWebGLHandle,
  StoryActId,
} from "./StoryWebGLCanvas";
import ActOneParryTrial from "./ActOneParryTrial";
import ActTwoArtifactForge from "./ActTwoArtifactForge";
import ActThreeCrucible from "./ActThreeCrucible";
import ActFourSummit from "./ActFourSummit";

type StoryStage = "TITLE" | "ACT_1" | "ACT_2" | "ACT_3" | "ACT_4";

interface StoryModeEngineProps {
  isOpen: boolean;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onExit: () => void;
  onOpenResume: () => void;
  onOpenBossArena: () => void;
  platinumBestTime?: number | null;
}

const STAGE_META: Record<
  StoryStage,
  {
    actId: StoryActId;
    padMood: "storm" | "forge" | "crucible" | "dawn";
    hudLabel: string;
    subtitle: string;
    accent: string;
  }
> = {
  TITLE: {
    actId: 0,
    padMood: "storm",
    hudLabel: "PROLOGUE // FORGED IN SILENCE",
    subtitle:
      "Before the shipped systems and hackathon podiums, there was only disciplined craft in the dark.",
    accent: "#E6C999",
  },
  ACT_1: {
    actId: 1,
    padMood: "storm",
    hudLabel: "ACT I // THE SILENT GRIND",
    subtitle:
      "Parry corrupted Logic Spears (SPACE or Tap) to forge all 4 real DSA milestones — 360+ problems solved.",
    accent: "#A5E8FF",
  },
  ACT_2: {
    actId: 2,
    padMood: "forge",
    hudLabel: "ACT II // THE FORGE OF REALMS",
    subtitle:
      "Orbit the 4 3D Flagship Artifacts (Click or A / D) and HOLD to ignite each build into radiant crystal.",
    accent: "#E6C999",
  },
  ACT_3: {
    actId: 3,
    padMood: "crucible",
    hudLabel: "ACT III // THE 3:00 AM CRUCIBLE",
    subtitle:
      "Dodge with SPACE/SHIFT for Realm Shift · Throw & Recall Leviathan Axe (Click / F) · Shatter the Titan of Entropy.",
    accent: "#FF7597",
  },
  ACT_4: {
    actId: 4,
    padMood: "dawn",
    hudLabel: "ACT IV // THE SUMMIT",
    subtitle:
      "Every late night left a mark. Every setback built an engineer. — Aashish Bhumarkar · BIST Bhopal.",
    accent: "#F7D894",
  },
};

const CHAPTER_BUTTONS: Array<{ stage: StoryStage; roman: string; title: string }> = [
  { stage: "ACT_1", roman: "I", title: "Act I: The Silent Grind" },
  { stage: "ACT_2", roman: "II", title: "Act II: The Forge of Realms" },
  { stage: "ACT_3", roman: "III", title: "Act III: The 3:00 AM Crucible" },
  { stage: "ACT_4", roman: "IV", title: "Act IV: The Summit" },
];

export default function StoryModeEngine({
  isOpen,
  soundEnabled,
  onToggleSound,
  onExit,
  onOpenResume,
}: StoryModeEngineProps) {
  const webglRef = useRef<StoryWebGLHandle | null>(null);
  const [stage, setStage] = useState<StoryStage>("TITLE");
  const [runKey, setRunKey] = useState<number>(0);
  const [act2FocusedIndex, setAct2FocusedIndex] = useState<number>(0);

  // Journey Telemetry for Act IV Player Summary
  const storyStartRef = useRef<number>(Date.now());
  const [perfectParries, setPerfectParries] = useState<number>(0);
  const [perfectDodges, setPerfectDodges] = useState<number>(0);
  const [clearTimeSeconds, setClearTimeSeconds] = useState<number>(48);

  const transitionToStage = useCallback(
    (nextStage: StoryStage, withWarp = true, warpColorHex = 0xe6c999) => {
      retroAudio.stopIgniteCharge();
      const meta = STAGE_META[nextStage];
      setStage(nextStage);
      retroAudio.startAmbientPad(meta.padMood);
      if (withWarp) {
        retroAudio.playActWarp();
      }
      webglRef.current?.setAct(meta.actId, withWarp, warpColorHex);
    },
    []
  );

  // Reset to opening title sequence whenever Story Mode opens or replays & lock page scroll
  useEffect(() => {
    if (!isOpen) return;
    storyStartRef.current = Date.now();
    setStage("TITLE");
    setAct2FocusedIndex(0);
    setPerfectParries(0);
    setPerfectDodges(0);
    retroAudio.startAmbientPad("storm");
    webglRef.current?.setAct(0, false);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Auto-advance from opening title sequence smoothly into Act I after 4.2s
    const titleTimer = window.setTimeout(() => {
      setStage((current) => {
        if (current !== "TITLE") return current;
        retroAudio.playActWarp();
        retroAudio.startAmbientPad("storm");
        webglRef.current?.setAct(1, true, 0xa5e8ff);
        return "ACT_1";
      });
    }, 4200);

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        retroAudio.stopIgniteCharge();
        retroAudio.stopAmbientPad(true);
        onExit();
      }
    };
    window.addEventListener("keydown", handleKey);

    return () => {
      window.clearTimeout(titleTimer);
      window.removeEventListener("keydown", handleKey);
      retroAudio.stopIgniteCharge();
      retroAudio.stopAmbientPad(true);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, runKey, onExit]);

  // Direct 3D Artifact raycast click callback from Three.js scene
  const handleRaycastArtifactSelect = useCallback((idx: number) => {
    retroAudio.playClick();
    setAct2FocusedIndex(idx);
  }, []);

  const handleBossDefeated = useCallback(
    (act3Sec: number) => {
      const totalSec = Math.max(
        act3Sec,
        (Date.now() - storyStartRef.current) / 1000
      );
      setClearTimeSeconds(totalSec);
      transitionToStage("ACT_4", false, 0xf7d894);
    },
    [transitionToStage]
  );

  const handleReplayStory = useCallback(() => {
    retroAudio.playBifrostRift();
    setRunKey((k) => k + 1);
  }, []);

  if (!isOpen) return null;

  const meta = STAGE_META[stage];
  const isFullPlayableCanvasStage =
    stage === "ACT_1" || stage === "ACT_2" || stage === "ACT_3";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Interactive 3D Story Mode Chronicle"
      className="fixed inset-0 z-50 h-[100dvh] w-[100vw] flex flex-col justify-between bg-[#05070D] text-[#F2F4FB] overflow-hidden select-none"
      style={{
        paddingTop: "env(safe-area-inset-top)",
        paddingRight: "env(safe-area-inset-right)",
        paddingBottom: "env(safe-area-inset-bottom)",
        paddingLeft: "env(safe-area-inset-left)",
      }}
    >
      {/* REAL 60FPS FULL-SCREEN 3D WEBGL BACKGROUND ENGINE (THREE.JS) */}
      <StoryWebGLCanvas
        ref={webglRef}
        initialAct={0}
        onSelectArtifact={handleRaycastArtifactSelect}
      />

      {/* Subtle Vignette For Text Readability Over 3D Scene (Zero backdrop-filter!) */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(circle at 50% 48%, rgba(5,7,13,0.06) 0%, rgba(5,7,13,0.52) 80%, rgba(5,7,13,0.88) 100%)",
        }}
      />

      {/* TOP 2.39:1 CINEMA LETTERBOX BAR + SUPER MINIMAL STORY HUD */}
      <header className="relative z-20 h-13 sm:h-14 px-2.5 sm:px-6 lg:px-10 bg-[#05070D] border-b border-white/[0.08] flex items-center justify-between gap-2 shrink-0">
        {/* Top-Left: Sound ON/OFF Toggle + Current Act Indicator */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            type="button"
            onClick={onToggleSound}
            aria-label={soundEnabled ? "Mute story audio" : "Unmute story audio"}
            className="h-9 w-9 rounded-lg border border-white/[0.12] bg-[#0D1120] hover:border-[#A5E8FF]/55 flex items-center justify-center text-[#A5E8FF] transition-colors shrink-0 cursor-pointer touch-manipulation"
            title={soundEnabled ? "Sound ON" : "Sound OFF"}
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-[#6E7896]" />
            )}
          </button>

          <div className="min-w-0 text-left">
            <p
              className="font-mythic text-[9.5px] sm:text-xs font-bold tracking-[0.14em] sm:tracking-[0.18em] truncate"
              style={{ color: meta.accent }}
            >
              {meta.hudLabel}
            </p>
          </div>
        </div>

        {/* Top-Right: Discrete CHAPTERS Switcher (I · II · III · IV) + EXIT */}
        <div className="flex items-center gap-1.5 sm:gap-3.5 shrink-0">
          <nav
            aria-label="Story chapters"
            className="flex items-center gap-0.5 sm:gap-1.5 px-1.5 sm:px-2 py-1 rounded-lg bg-[#0B0F1C] border border-white/[0.08]"
          >
            <span className="hidden md:inline font-mono text-[9.5px] uppercase tracking-[0.16em] text-[#6E7896] mr-1">
              CHAPTERS
            </span>
            {CHAPTER_BUTTONS.map((ch, idx) => {
              const isActive = stage === ch.stage;
              return (
                <React.Fragment key={ch.stage}>
                  <button
                    type="button"
                    onClick={() => transitionToStage(ch.stage, true)}
                    title={ch.title}
                    className={`min-w-[26px] sm:min-w-[28px] h-7 px-1 sm:px-1.5 rounded font-mythic text-[10px] sm:text-[10.5px] font-bold tracking-[0.08em] transition-colors cursor-pointer touch-manipulation ${
                      isActive
                        ? "bg-[#E6C999] text-[#05070D]"
                        : "text-[#9EA8C4] hover:text-[#F2F4FB] hover:bg-white/[0.06]"
                    }`}
                  >
                    {ch.roman}
                  </button>
                  {idx < CHAPTER_BUTTONS.length - 1 && (
                    <span aria-hidden="true" className="text-white/15 text-[9px]">
                      ·
                    </span>
                  )}
                </React.Fragment>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={() => {
              retroAudio.stopIgniteCharge();
              retroAudio.stopAmbientPad(true);
              retroAudio.playClick();
              onExit();
            }}
            className="h-9 px-2.5 sm:px-3.5 rounded-lg border border-white/[0.16] bg-[#0B0F1C] hover:bg-white/[0.08] hover:border-white/40 text-[#F2F4FB] font-mythic text-[9px] sm:text-[10px] font-semibold tracking-[0.14em] inline-flex items-center gap-1 sm:gap-1.5 transition-colors cursor-pointer whitespace-nowrap touch-manipulation"
          >
            <X className="w-3.5 h-3.5 text-[#9EA8C4]" />
            <span className="hidden sm:inline">EXIT TO PORTFOLIO</span>
            <span className="sm:hidden">EXIT</span>
          </button>
        </div>
      </header>

      {/* CENTRAL CINEMATIC STAGE (100% UNOBSTRUCTED 3D VIEWPORT + PLAYABLE ACTS) */}
      <main
        className={`relative z-10 flex-1 min-h-0 flex items-center justify-center ${
          isFullPlayableCanvasStage
            ? "p-0 overflow-hidden"
            : "px-3 sm:px-8 py-3 overflow-y-auto"
        }`}
      >
        <AnimatePresence mode="wait">
          {/* OPENING TITLE SEQUENCE */}
          {stage === "TITLE" && (
            <motion.div
              key={`title-${runKey}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.06 }}
              transition={{ duration: 0.65 }}
              className="max-w-3xl w-full text-center space-y-5 py-6 px-4"
            >
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.85, delay: 0.2 }}
                className="font-mono text-[10.5px] sm:text-xs uppercase tracking-[0.34em] text-[#A5E8FF]"
              >
                AASHISH BHUMARKAR PRESENTS
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, letterSpacing: "0.06em", scale: 0.96 }}
                animate={{ opacity: 1, letterSpacing: "0.22em", scale: 1 }}
                transition={{ duration: 2.1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="font-mythic text-2xl sm:text-5xl lg:text-6xl font-bold text-[#F2F4FB] leading-tight"
              >
                FORGED IN SILENCE
              </motion.h1>

              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 1.1, delay: 0.85 }}
                className="h-px w-48 sm:w-80 mx-auto"
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, #A5E8FF 30%, #E6C999 70%, transparent 100%)",
                }}
              />

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.85, delay: 1.15 }}
                className="font-space text-xs sm:text-base text-[#C4CDE4] max-w-xl mx-auto leading-relaxed"
              >
                A four-act interactive 3D chronicle of algorithmic discipline, shipped
                realms, and breaking through the 3:00 AM crucible.
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.5 }}
                className="pt-2"
              >
                <span className="prologue-cta-shell group">
                  <span aria-hidden="true" className="prologue-cta-ring" />
                  <button
                    type="button"
                    onClick={() => transitionToStage("ACT_1", true, 0xa5e8ff)}
                    className="prologue-cta-inner min-h-[46px] px-7 py-2.5 text-[#F2F4FB] font-mythic text-xs font-semibold tracking-[0.2em] inline-flex items-center gap-2.5 cursor-pointer touch-manipulation"
                  >
                    <span>BEGIN ACT I</span>
                    <ArrowRight className="w-4 h-4 text-[#E6C999] transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </span>
              </motion.div>
            </motion.div>
          )}

          {/* ACT I — THE SILENT GRIND (PLAYABLE RUNIC PARRY TRIAL) */}
          {stage === "ACT_1" && (
            <motion.div
              key={`act1-${runKey}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="w-full h-full min-h-0"
            >
              <ActOneParryTrial
                webglRef={webglRef}
                onPerfectParry={() => setPerfectParries((n) => n + 1)}
                onCompleteActOne={() => transitionToStage("ACT_2", false, 0xe6c999)}
              />
            </motion.div>
          )}

          {/* ACT II — THE FORGE OF REALMS (3D ARTIFACT AWAKENING) */}
          {stage === "ACT_2" && (
            <motion.div
              key={`act2-${runKey}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full h-full min-h-0"
            >
              <ActTwoArtifactForge
                webglRef={webglRef}
                focusedIndex={act2FocusedIndex}
                onSelectIndex={setAct2FocusedIndex}
                onAdvanceToActThree={() => transitionToStage("ACT_3", true, 0xff4c75)}
              />
            </motion.div>
          )}

          {/* ACT III — THE 3:00 AM CRUCIBLE (3D BOSS FIGHT + QTE FINISHER) */}
          {stage === "ACT_3" && (
            <motion.div
              key={`act3-${runKey}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full h-full min-h-0"
            >
              <ActThreeCrucible
                webglRef={webglRef}
                onPerfectDodge={() => setPerfectDodges((n) => n + 1)}
                onBossDefeated={handleBossDefeated}
              />
            </motion.div>
          )}

          {/* ACT IV — THE SUMMIT (GOLDEN DAWN + CHRONICLE COMPLETION MONUMENT) */}
          {stage === "ACT_4" && (
            <motion.div
              key={`act4-${runKey}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full my-auto"
            >
              <ActFourSummit
                stats={{
                  clearTimeSeconds,
                  perfectParries,
                  perfectDodges,
                }}
                onOpenResume={onOpenResume}
                onReplayStory={handleReplayStory}
                onReturnToPortfolio={() => {
                  retroAudio.stopAmbientPad(true);
                  onExit();
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* BOTTOM 2.39:1 CINEMA LETTERBOX BAR + SUBTITLE NARRATION */}
      <footer className="relative z-20 h-10 sm:h-12 px-3 sm:px-8 bg-[#05070D] border-t border-white/[0.08] flex items-center justify-center shrink-0">
        <p className="font-space text-[10px] sm:text-xs text-[#9EA8C4] text-center truncate max-w-4xl">
          {meta.subtitle}
        </p>
      </footer>
    </div>
  );
}
