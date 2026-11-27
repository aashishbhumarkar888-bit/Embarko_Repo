import React from "react";
import { Volume2, VolumeX, Swords } from "lucide-react";

export interface CompassWaypoint {
  id: string;
  label: string;
}

export const COMPASS_WAYPOINTS: CompassWaypoint[] = [
  { id: "origin", label: "ORIGIN" },
  { id: "arena", label: "ARENA" },
  { id: "levels", label: "PROJECTS" },
  { id: "powerups", label: "SKILLS" },
  { id: "trophies", label: "HONOR" },
];

interface MythicCompassHUDProps {
  activeSection: string;
  soundEnabled: boolean;
  onToggleSound: () => void;
  isExecutiveMode: boolean;
  onToggleExecutive: () => void;
  onEnterStory: (origin?: { x: number; y: number }) => void;
  onNavigate: (sectionId: string) => void;
  onLogoClick: () => void;
}

export default function MythicCompassHUD({
  activeSection,
  soundEnabled,
  onToggleSound,
  isExecutiveMode,
  onToggleExecutive,
  onEnterStory,
  onNavigate,
  onLogoClick,
}: MythicCompassHUDProps) {
  const handleStoryTrigger = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    onEnterStory({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });
  };

  return (
    <header className="sticky top-0 left-0 right-0 z-40 w-full h-16 bg-[#05070D]/88 backdrop-blur-md border-b border-white/[0.07]">
      <div className="max-w-7xl mx-auto h-full px-3 sm:px-6 lg:px-10 flex items-center justify-between gap-3 sm:gap-5">
        {/* LEFT: Minimal Carved Monogram AB + Subtle Mute/Unmute Icon */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onLogoClick}
            className="h-9 px-2.5 rounded-lg border border-white/[0.12] hover:border-[#E6C999]/55 bg-white/[0.02] hover:bg-white/[0.05] flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A5E8FF]"
            title="Return to top"
            aria-label="Aashish Bhumarkar — Return to top"
          >
            <span className="font-mythic text-xs font-bold tracking-[0.24em] text-[#E6C999]">
              AB
            </span>
          </button>

          <button
            type="button"
            onClick={onToggleSound}
            aria-label={soundEnabled ? "Mute audio" : "Unmute audio"}
            aria-pressed={soundEnabled}
            className={`h-9 w-9 rounded-lg border flex items-center justify-center transition-colors shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A5E8FF] ${
              soundEnabled
                ? "border-white/[0.09] bg-transparent text-[#A5E8FF] hover:border-[#A5E8FF]/45"
                : "border-white/[0.06] bg-transparent text-[#6E7896] hover:text-[#F2F4FB]"
            }`}
            title={soundEnabled ? "Mute audio" : "Unmute audio"}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* CENTER: Clean Horizontal Section Links with Active Scroll Underline */}
        {!isExecutiveMode ? (
          <nav
            aria-label="Portfolio section navigation"
            className="hidden md:flex items-center justify-center gap-3 lg:gap-5"
          >
            {COMPASS_WAYPOINTS.map((wp, idx) => {
              const isActive =
                activeSection === wp.id ||
                (wp.id === "origin" && activeSection === "start") ||
                (wp.id === "trophies" && activeSection === "contact");

              return (
                <React.Fragment key={wp.id}>
                  <button
                    type="button"
                    onClick={() => onNavigate(wp.id)}
                    className={`relative h-16 px-1.5 inline-flex items-center font-mythic text-[11px] font-semibold tracking-[0.2em] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:text-[#F2F4FB] ${
                      isActive
                        ? "text-[#F2F4FB]"
                        : "text-[#8B95B2] hover:text-[#F2F4FB]"
                    }`}
                  >
                    <span>{wp.label}</span>
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none absolute bottom-0 inset-x-0 h-[2px] transition-all duration-300 ${
                        isActive
                          ? "opacity-100 scale-x-100"
                          : "opacity-0 scale-x-50"
                      }`}
                      style={{
                        background:
                          "linear-gradient(90deg, transparent 0%, #E6C999 25%, #A5E8FF 75%, transparent 100%)",
                      }}
                    />
                  </button>

                  {idx < COMPASS_WAYPOINTS.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="text-white/20 text-xs select-none"
                    >
                      ·
                    </span>
                  )}
                </React.Fragment>
              );
            })}
          </nav>
        ) : (
          <span className="hidden md:inline font-mythic text-[11px] tracking-[0.22em] text-[#E6C999]">
            EXECUTIVE DOSSIER
          </span>
        )}

        {/* RIGHT: ONLY TWO BUTTONS — ENTER STORY + EXECUTIVE VIEW */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleStoryTrigger}
            className="h-9 px-3 sm:px-4 rounded-lg border border-[#E6C999]/45 bg-[#E6C999]/[0.09] hover:bg-[#E6C999]/[0.18] hover:border-[#E6C999]/80 text-[#F5E7C8] font-mythic text-[10px] sm:text-[10.5px] font-semibold tracking-[0.16em] inline-flex items-center gap-1.5 transition-all whitespace-nowrap shrink-0 cursor-pointer active:scale-[0.98] shadow-[0_0_22px_-8px_rgba(230,201,153,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E6C999]"
            title="Launch 4-Act Interactive 3D Story Mode"
          >
            <Swords className="w-3.5 h-3.5 text-[#E6C999] shrink-0" />
            <span className="hidden sm:inline">STORY MODE</span>
            <span className="sm:hidden">STORY</span>
          </button>

          <button
            type="button"
            onClick={onToggleExecutive}
            aria-pressed={isExecutiveMode}
            className={`h-9 px-3 sm:px-4 rounded-lg border font-mythic text-[10px] sm:text-[10.5px] font-semibold tracking-[0.15em] inline-flex items-center transition-all whitespace-nowrap shrink-0 cursor-pointer active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${
              isExecutiveMode
                ? "border-white bg-[#F2F4FB] text-[#05070D]"
                : "border-white/25 bg-[#05070D]/60 text-[#F2F4FB] hover:bg-white/[0.08] hover:border-white/55"
            }`}
            title="Toggle single-page printable recruiter summary"
          >
            <span className="hidden sm:inline">
              {isExecutiveMode ? "FULL PORTFOLIO" : "EXECUTIVE VIEW"}
            </span>
            <span className="sm:hidden">
              {isExecutiveMode ? "FULL" : "SUMMARY"}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
