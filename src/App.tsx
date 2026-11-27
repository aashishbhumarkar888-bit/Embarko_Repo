import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { AnimatePresence } from "motion/react";
import {
  PORTFOLIO_DATA,
  ProjectLevel,
  PowerUpSkill,
  RuneSlotKey,
  SocketedLoadout,
  ForgeVisualProfile,
} from "./data/portfolioData";
import { retroAudio } from "./utils/retroAudio";
import CyberBackdrop from "./components/CyberBackdrop";
import MythicCompassHUD from "./components/MythicCompassHUD";
import HeroStartScreen from "./components/HeroStartScreen";
import SpeedrunView from "./components/SpeedrunView";
import LevelMap from "./components/LevelMap";
import MissionBriefingModal from "./components/MissionBriefingModal";
import PowerUpsSection from "./components/PowerUpsSection";
import TrophyRoom from "./components/TrophyRoom";
import ContactTerminal from "./components/ContactTerminal";
import BossTrialModal, {
  PlatinumRecord,
  PLATINUM_STORAGE_KEY,
} from "./components/BossTrialModal";
import MobileQuickNav from "./components/MobileQuickNav";
import ResumeViewer from "./components/ResumeViewer";
import BifrostRiftOverlay from "./components/BifrostRiftOverlay";
import StoryModeEngine from "./components/StoryModeEngine";

const ALL_SKILLS_MAP = new Map<string, PowerUpSkill>(
  PORTFOLIO_DATA.skillGroups.flatMap((g) => g.skills.map((s) => [s.id, s]))
);

function deriveForgeVisualProfile(loadout: SocketedLoadout): ForgeVisualProfile {
  const core = ALL_SKILLS_MAP.get(loadout.coreLanguage);
  const iface = ALL_SKILLS_MAP.get(loadout.interfaceRune);
  const engine = ALL_SKILLS_MAP.get(loadout.engineRune);
  const arcane = ALL_SKILLS_MAP.get(loadout.arcaneRune);

  const bladePrimary = core?.auraColor ?? "#A5E8FF";
  const bladeSecondary = iface?.auraColor ?? "#E6C999";
  const auraColor = arcane?.auraColor ?? engine?.auraColor ?? "#C7B8FF";

  let synergyTitle = "Full-Stack Valkyrie";
  let synergySubtitle =
    "Balanced frontend craft, resilient API systems, and production engineering discipline.";

  if (
    loadout.arcaneRune === "ai-workflows" &&
    (loadout.coreLanguage === "python" || loadout.coreLanguage === "typescript")
  ) {
    synergyTitle = "AI Systems Architect";
    synergySubtitle =
      "Type-safe intelligent workflows fused with real-time backend orchestration and agentic APIs.";
  } else if (loadout.coreLanguage === "cpp" && loadout.arcaneRune === "dsa") {
    synergyTitle = "Algorithmic Forgemaster";
    synergySubtitle =
      "C++ STL precision backed by 360+ solved algorithmic problems across four competitive arenas.";
  } else if (loadout.interfaceRune === "canvas-audio") {
    synergyTitle = "Canvas & Audio Artificer";
    synergySubtitle =
      "60 FPS real-time interactive rendering paired with zero-asset synthesized Web Audio.";
  } else if (loadout.engineRune === "firebase" || loadout.arcaneRune === "oci-cloud-ai") {
    synergyTitle = "Cloud & Realtime Warden";
    synergySubtitle =
      "Synchronized real-time Firestore state and Oracle/IBM certified cloud architecture.";
  } else if (loadout.interfaceRune === "nextjs" || loadout.interfaceRune === "react") {
    synergyTitle = "Full-Stack Valkyrie";
    synergySubtitle =
      "High-velocity React & TypeScript interfaces backed by production Node.js & MongoDB services.";
  } else if (loadout.arcaneRune === "oop-dbms") {
    synergyTitle = "Systems Core Sentinel";
    synergySubtitle =
      "Disciplined SOLID design, normalized schemas, and clean full-stack data integrity.";
  }

  return {
    bladePrimary,
    bladeSecondary,
    auraColor,
    synergyTitle,
    synergySubtitle,
  };
}

export default function App() {
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isExecutiveMode, setIsExecutiveMode] = useState<boolean>(false);

  // Two-Mode Cinematic Story State + 1.4s Bifröst Rift Transition
  const [isStoryOpen, setIsStoryOpen] = useState<boolean>(false);
  const [riftState, setRiftState] = useState<{
    active: boolean;
    origin: { x: number; y: number };
  }>({
    active: false,
    origin: { x: 0, y: 0 },
  });

  // Navigation & Chronicle State
  const [activeSection, setActiveSection] = useState<string>("origin");
  const [selectedProjectIndex, setSelectedProjectIndex] = useState<number>(0);
  const [inspectedLevels, setInspectedLevels] = useState<Set<string>>(() => new Set());
  const [selectedLevel, setSelectedLevel] = useState<ProjectLevel | null>(null);
  const [highlightedChapter, setHighlightedChapter] = useState<string | null>(null);

  // Runic Forge Shared State (Synced with Boss Trial Runic Blade)
  const [socketedLoadout, setSocketedLoadout] = useState<SocketedLoadout>(() => ({
    ...PORTFOLIO_DATA.initialSocketLoadout,
  }));
  const [shockwaveState, setShockwaveState] = useState<{
    slot: RuneSlotKey | "all";
    key: number;
  } | null>(null);

  // Modal States
  const [isBossTrialOpen, setIsBossTrialOpen] = useState<boolean>(false);
  const [isResumeOpen, setIsResumeOpen] = useState<boolean>(false);
  const [platinumRecord, setPlatinumRecord] = useState<PlatinumRecord | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(PLATINUM_STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as PlatinumRecord;
      if (parsed && typeof parsed.bestTime === "number") return parsed;
      return null;
    } catch {
      return null;
    }
  });

  const forgeProfile = useMemo(
    () => deriveForgeVisualProfile(socketedLoadout),
    [socketedLoadout]
  );

  const highlightTimerRef = useRef<number | null>(null);
  const riftMountTimerRef = useRef<number | null>(null);
  const riftEndTimerRef = useRef<number | null>(null);

  // Scroll-spy keeping Top Nav and Mobile Quick Nav in sync
  useEffect(() => {
    if (isExecutiveMode || isStoryOpen) return;

    const sectionIds = ["start", "origin", "arena", "levels", "powerups", "trophies", "contact"];
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-25% 0px -55% 0px", threshold: 0.05 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [isExecutiveMode, isStoryOpen]);

  useEffect(() => {
    return () => {
      if (highlightTimerRef.current) window.clearTimeout(highlightTimerRef.current);
      if (riftMountTimerRef.current) window.clearTimeout(riftMountTimerRef.current);
      if (riftEndTimerRef.current) window.clearTimeout(riftEndTimerRef.current);
    };
  }, []);

  /**
   * "Shatter into the Realm" 1.4-second transition:
   * - Fires Nordic sub-bass Bifröst rift audio
   * - Expands blinding frost-gold radial rift from button's exact (x, y)
   * - Mounts full-viewport 3D StoryModeEngine seamlessly at peak flash (680ms)
   * - Clears overlay at 1420ms so Story Mode takes over cleanly
   */
  const handleEnterStory = useCallback((origin?: { x: number; y: number }) => {
    if (riftMountTimerRef.current) window.clearTimeout(riftMountTimerRef.current);
    if (riftEndTimerRef.current) window.clearTimeout(riftEndTimerRef.current);

    const resolvedOrigin = origin ?? {
      x: typeof window !== "undefined" ? window.innerWidth / 2 : 640,
      y: typeof window !== "undefined" ? window.innerHeight * 0.42 : 340,
    };

    retroAudio.playBifrostRift();
    setRiftState({ active: true, origin: resolvedOrigin });

    riftMountTimerRef.current = window.setTimeout(() => {
      setIsStoryOpen(true);
    }, 680);

    riftEndTimerRef.current = window.setTimeout(() => {
      setRiftState((prev) => ({ ...prev, active: false }));
    }, 1420);
  }, []);

  const handleExitStory = useCallback(() => {
    retroAudio.playClick();
    setIsStoryOpen(false);
  }, []);

  const scrollToSection = useCallback((sectionId: string) => {
    retroAudio.playChapterHum();
    setIsExecutiveMode(false);
    setHighlightedChapter(sectionId);
    if (highlightTimerRef.current) window.clearTimeout(highlightTimerRef.current);
    highlightTimerRef.current = window.setTimeout(() => {
      setHighlightedChapter(null);
    }, 2400);

    window.requestAnimationFrame(() => {
      const target = document.getElementById(sectionId);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }, []);

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    retroAudio.setEnabled(next);
  };

  const handleToggleExecutive = () => {
    retroAudio.playClick();
    setIsExecutiveMode((prev) => {
      const next = !prev;
      window.scrollTo({ top: 0, behavior: "smooth" });
      return next;
    });
  };

  const handleSelectLevel = (project: ProjectLevel) => {
    retroAudio.playLevelChime();
    setSelectedLevel(project);
    setInspectedLevels((prev) => {
      if (prev.has(project.id)) return prev;
      const next = new Set(prev);
      next.add(project.id);
      return next;
    });
  };

  const handleSocketRune = (skill: PowerUpSkill) => {
    retroAudio.playEquip(true);
    setSocketedLoadout((prev) => ({
      ...prev,
      [skill.socketSlot]: skill.id,
    }));
    setShockwaveState({ slot: skill.socketSlot, key: Date.now() });
  };

  const handleEquipRecommended = () => {
    retroAudio.playBladeSwing();
    setSocketedLoadout({ ...PORTFOLIO_DATA.recommendedSocketLoadout });
    setShockwaveState({ slot: "all", key: Date.now() });
  };

  const handleResetLoadout = () => {
    retroAudio.playEquip(false);
    setSocketedLoadout({ ...PORTFOLIO_DATA.initialSocketLoadout });
    setShockwaveState({ slot: "all", key: Date.now() });
  };

  const handleTrialVictory = useCallback((clearTimeSeconds: number) => {
    setPlatinumRecord((prev) => {
      const bestTime = prev ? Math.min(prev.bestTime, clearTimeSeconds) : clearTimeSeconds;
      const nextRecord: PlatinumRecord = {
        badge: "PLATINUM ARCHITECT",
        bestTime,
        achievedAt: new Date().toISOString(),
      };
      try {
        localStorage.setItem(PLATINUM_STORAGE_KEY, JSON.stringify(nextRecord));
      } catch {
        // Ignore private storage errors
      }
      return nextRecord;
    });
  }, []);

  return (
    <div className="min-h-screen relative flex flex-col text-[#F2F4FB] bg-[#05070D] overflow-x-clip">
      {/* Subtle Volumetric Obsidian Mist Backdrop */}
      <CyberBackdrop auraColor={forgeProfile.auraColor} />

      {/* Ultra-Clean Top Navigation Bar (Hidden automatically under Full-Viewport Story Mode) */}
      <MythicCompassHUD
        activeSection={activeSection}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        isExecutiveMode={isExecutiveMode}
        onToggleExecutive={handleToggleExecutive}
        onEnterStory={handleEnterStory}
        onNavigate={scrollToSection}
        onLogoClick={() => scrollToSection("start")}
      />

      {/* Mode 1 — The Surface: Ultra-Clean Executive Portfolio */}
      <main className="flex-1 w-full">
        <AnimatePresence mode="wait">
          {isExecutiveMode ? (
            <div key="executive">
              <SpeedrunView
                onExitSpeedrun={() => {
                  retroAudio.playClick();
                  setIsExecutiveMode(false);
                }}
                onOpenResume={() => {
                  retroAudio.playClick();
                  setIsResumeOpen(true);
                }}
                onSoundClick={() => retroAudio.playClick()}
              />
            </div>
          ) : (
            <div key="surface" className="pb-20 md:pb-8">
              <HeroStartScreen
                onEnterStory={handleEnterStory}
                onOpenResume={() => {
                  retroAudio.playClick();
                  setIsResumeOpen(true);
                }}
                onLinkClick={() => retroAudio.playClick()}
                highlightedChapter={highlightedChapter}
              />

              <LevelMap
                inspectedLevels={inspectedLevels}
                selectedProjectIndex={selectedProjectIndex}
                onSelectProjectIndex={setSelectedProjectIndex}
                onSelectLevel={handleSelectLevel}
                onLinkClick={() => retroAudio.playClick()}
                isHighlighted={highlightedChapter === "levels"}
              />

              <PowerUpsSection
                socketedLoadout={socketedLoadout}
                forgeProfile={forgeProfile}
                shockwaveState={shockwaveState}
                onSocketRune={handleSocketRune}
                onEquipRecommended={handleEquipRecommended}
                onResetLoadout={handleResetLoadout}
                onJumpToRealm={() => handleEnterStory()}
                isHighlighted={highlightedChapter === "powerups"}
              />

              <TrophyRoom
                onLinkClick={() => retroAudio.playClick()}
                onOpenResume={() => {
                  retroAudio.playClick();
                  setIsResumeOpen(true);
                }}
                isHighlighted={highlightedChapter === "trophies"}
              />

              <ContactTerminal
                onTransmissionSent={() => retroAudio.playTransmission()}
                onSoundClick={() => retroAudio.playClick()}
              />
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* Quiet Editorial Footer */}
      <footer className="border-t border-white/[0.07] bg-[#05070D]/90 backdrop-blur-md pb-24 md:pb-7 pt-7 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#6E7896]">
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} {PORTFOLIO_DATA.profile.name} · Bhopal, India
          </p>

          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={() => handleEnterStory()}
              className="hover:text-[#E6C999] transition-colors cursor-pointer"
            >
              Story Mode
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("contact")}
              className="hover:text-[#E6C999] transition-colors cursor-pointer"
            >
              Contact
            </button>
            <button
              type="button"
              onClick={() => {
                retroAudio.playClick();
                setIsResumeOpen(true);
              }}
              className="hover:text-[#A5E8FF] transition-colors cursor-pointer"
            >
              Preview CV
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("start")}
              className="hover:text-[#F2F4FB] transition-colors cursor-pointer"
            >
              Top ↑
            </button>
          </div>
        </div>
      </footer>

      {/* Mobile-Only Floating Quick Nav */}
      {!isExecutiveMode && !isStoryOpen && (
        <MobileQuickNav activeSection={activeSection} onJump={scrollToSection} />
      )}

      {/* Mode 2 — Full-Viewport 3D Interactive Story Mode Experience */}
      <StoryModeEngine
        isOpen={isStoryOpen}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onExit={handleExitStory}
        onOpenResume={() => {
          retroAudio.playClick();
          setIsResumeOpen(true);
        }}
        onOpenBossArena={() => {
          retroAudio.playChapterHum();
          setIsBossTrialOpen(true);
        }}
        platinumBestTime={platinumRecord?.bestTime ?? null}
      />

      {/* 1.4-Second Cinematic Bifröst Rift Transition Overlay */}
      <BifrostRiftOverlay active={riftState.active} origin={riftState.origin} />

      {/* Authoritative Chronicle Dossier Modal */}
      <MissionBriefingModal
        project={selectedLevel}
        onClose={() => {
          retroAudio.playClick();
          setSelectedLevel(null);
        }}
        onLinkClick={() => retroAudio.playClick()}
      />

      {/* Playable 60fps Boss Encounter: Trial of the Monolith (z-[60], opens cleanly over Story Mode) */}
      <BossTrialModal
        isOpen={isBossTrialOpen}
        onClose={() => {
          retroAudio.playClick();
          setIsBossTrialOpen(false);
        }}
        forgeProfile={forgeProfile}
        onTrialVictory={handleTrialVictory}
        platinumRecord={platinumRecord}
      />

      {/* Accessible CV Preview Modal (z-[75], opens cleanly over Story Mode) */}
      <ResumeViewer
        isOpen={isResumeOpen}
        onClose={() => {
          retroAudio.playClick();
          setIsResumeOpen(false);
        }}
      />
    </div>
  );
}
