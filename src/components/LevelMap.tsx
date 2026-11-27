import React, { useState, useRef, useEffect } from "react";
import {
  BookOpen,
  CheckCircle2,
  ExternalLink,
  Github,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { PORTFOLIO_DATA, ProjectLevel } from "../data/portfolioData";
import ChapterDivider from "./ChapterDivider";
import ScrollReveal from "./ScrollReveal";

interface LevelMapProps {
  inspectedLevels: Set<string>;
  selectedProjectIndex?: number;
  onSelectProjectIndex?: (idx: number) => void;
  onSelectLevel: (project: ProjectLevel) => void;
  onLinkClick: () => void;
  isHighlighted?: boolean;
}

export default function LevelMap({
  inspectedLevels,
  selectedProjectIndex,
  onSelectProjectIndex,
  onSelectLevel,
  onLinkClick,
  isHighlighted = false,
}: LevelMapProps) {
  const { projects } = PORTFOLIO_DATA;
  const [internalIndex, setInternalIndex] = useState<number>(0);
  const [spotlight, setSpotlight] = useState<{ x: number; y: number; active: boolean }>({
    x: 50,
    y: 25,
    active: false,
  });
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (
      typeof selectedProjectIndex === "number" &&
      selectedProjectIndex >= 0 &&
      selectedProjectIndex < projects.length
    ) {
      setInternalIndex(selectedProjectIndex);
    }
  }, [selectedProjectIndex, projects.length]);

  const selectedIndex = internalIndex;
  const activeProject = projects[selectedIndex] ?? projects[0];
  const isInspected = inspectedLevels.has(activeProject.id);

  // Angle for Tyr's Temple Realm Travel Wheel needle (0deg = top)
  const wheelAngle = (selectedIndex / projects.length) * 360;

  const updateIndex = (idx: number) => {
    setInternalIndex(idx);
    onSelectProjectIndex?.(idx);
  };

  const handleSelectRealm = (idx: number) => {
    onLinkClick();
    updateIndex(idx);
  };

  const handlePrev = () => {
    onLinkClick();
    updateIndex((selectedIndex - 1 + projects.length) % projects.length);
  };

  const handleNext = () => {
    onLinkClick();
    updateIndex((selectedIndex + 1) % projects.length);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setSpotlight({ x, y, active: true });
  };

  return (
    <section id="levels" className="py-16 sm:py-22 px-4 sm:px-6 max-w-6xl mx-auto">
      <ChapterDivider
        chapter="CHAPTER II"
        title="CONSTRUCTED REALMS"
        subtitle="Authoritative engineering chronicles across seven shipped systems—select any realm to inspect the crisis, the architecture, and the measured impact."
        rune="ᛉ"
        accent="#C7B8FF"
        isHighlighted={isHighlighted}
      />

      {/* Mobile Horizontal Realm Selector Strip */}
      <div className="lg:hidden mb-5 overflow-x-auto pb-2 -mx-1 px-1">
        <div className="flex items-center gap-2 min-w-max">
          {projects.map((proj, idx) => {
            const active = idx === selectedIndex;
            return (
              <button
                key={proj.id}
                type="button"
                onClick={() => handleSelectRealm(idx)}
                className={`min-h-[44px] px-3.5 py-2 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap shrink-0 ${
                  active
                    ? "bg-[#111629] text-[#F2F4FB] border-[#E6C999]/45"
                    : "bg-[#0A0E19]/80 border-white/[0.08] text-[#9EA8C4]"
                }`}
              >
                <span
                  className="font-serif text-sm font-bold"
                  style={{ color: proj.accentColor }}
                >
                  {proj.rune}
                </span>
                <span className="font-space text-xs font-medium">
                  {proj.name.split("—")[0].trim()}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Journey Codex Split Layout: Realm Travel Dial (Left) + Chronicle Dossier (Right) */}
      <ScrollReveal>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT 4 COLUMNS: Interactive Realm Travel Dial & Index */}
          <aside className="hidden lg:flex lg:col-span-4 flex-col obsidian-panel rounded-2xl p-5 space-y-5">
            {/* Rotating Runic Realm Dial */}
            <div className="flex flex-col items-center pt-1 pb-3 border-b border-white/[0.07]">
              <div className="relative w-44 h-44 flex items-center justify-center">
                <svg
                  viewBox="0 0 200 200"
                  className="w-full h-full overflow-visible"
                  aria-hidden="true"
                >
                  <circle
                    cx="100"
                    cy="100"
                    r="86"
                    fill="none"
                    stroke="rgba(255,255,255,0.09)"
                    strokeWidth="1"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="66"
                    fill="none"
                    stroke="rgba(230,201,153,0.22)"
                    strokeWidth="1"
                    strokeDasharray="2 5"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="34"
                    fill="#070A13"
                    stroke="rgba(255,255,255,0.12)"
                    strokeWidth="1"
                  />

                  <g
                    style={{
                      transformOrigin: "100px 100px",
                      transform: `rotate(${wheelAngle}deg)`,
                      transition: "transform 460ms cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  >
                    <line
                      x1="100"
                      y1="66"
                      x2="100"
                      y2="24"
                      stroke="#E6C999"
                      strokeWidth="1.4"
                    />
                    <polygon points="100,18 96,27 104,27" fill="#E6C999" />
                  </g>
                </svg>

                {/* Center Active Rune Medallion */}
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span
                    className="font-serif text-2xl font-bold leading-none transition-colors duration-300"
                    style={{ color: activeProject.accentColor }}
                  >
                    {activeProject.rune}
                  </span>
                  <span className="font-mythic text-[8.5px] tracking-[0.18em] text-[#9EA8C4] mt-1">
                    {activeProject.realmCode}
                  </span>
                </div>

                {/* Clickable Realm Nodes Around the Ring */}
                {projects.map((proj, idx) => {
                  const rad = ((idx / projects.length) * 360 - 90) * (Math.PI / 180);
                  const x = 50 + Math.cos(rad) * 42;
                  const y = 50 + Math.sin(rad) * 42;
                  const active = idx === selectedIndex;
                  return (
                    <button
                      key={proj.id}
                      type="button"
                      onClick={() => handleSelectRealm(idx)}
                      title={`${proj.realmCode}: ${proj.name}`}
                      aria-label={`Select ${proj.realmCode}: ${proj.name}`}
                      style={{
                        left: `${x}%`,
                        top: `${y}%`,
                        borderColor: active ? proj.accentColor : "rgba(255,255,255,0.12)",
                        color: active ? proj.accentColor : "#8B95B2",
                        boxShadow: active ? `0 0 14px -2px ${proj.accentColor}88` : "none",
                      }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border bg-[#070A13] flex items-center justify-center font-serif text-xs font-bold transition-all duration-200 cursor-pointer hover:scale-110 ${
                        active ? "scale-110 z-10" : "hover:text-[#F2F4FB]"
                      }`}
                    >
                      {proj.rune}
                    </button>
                  );
                })}
              </div>
              <p className="font-mono text-[10.5px] text-[#6E7896] mt-1">
                Chronicle Index · {selectedIndex + 1} of {projects.length}
              </p>
            </div>

            {/* Clean Vertical Chronicle Index */}
            <nav aria-label="Constructed realms selector" className="space-y-1">
              {projects.map((proj, idx) => {
                const active = idx === selectedIndex;
                const cleared = inspectedLevels.has(proj.id);
                return (
                  <button
                    key={proj.id}
                    type="button"
                    onClick={() => handleSelectRealm(idx)}
                    className={`w-full min-h-[48px] px-3 py-2.5 rounded-xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between gap-2.5 ${
                      active
                        ? "bg-white/[0.05] border-white/[0.14] text-[#F2F4FB]"
                        : "bg-transparent border-transparent text-[#8B95B2] hover:bg-white/[0.025] hover:text-[#F2F4FB]"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className="w-7 h-7 rounded-lg bg-[#070A13] border border-white/[0.08] flex items-center justify-center font-serif text-sm shrink-0"
                        style={{ color: active ? proj.accentColor : "#6E7896" }}
                      >
                        {proj.rune}
                      </span>
                      <div className="min-w-0">
                        <p className="font-space text-xs sm:text-[13px] font-medium truncate">
                          {proj.name}
                        </p>
                        <p className="font-mono text-[10px] text-[#6E7896] truncate">
                          {proj.realmCode} · {proj.category}
                        </p>
                      </div>
                    </div>

                    {cleared && (
                      <CheckCircle2
                        className="w-3.5 h-3.5 shrink-0 text-[#98F5E1]/80"
                        aria-label="Chronicle reviewed"
                      />
                    )}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* RIGHT 8 COLUMNS: Authoritative Chronicle Dossier */}
          <div className="lg:col-span-8">
            <div
              ref={cardRef}
              onPointerMove={handlePointerMove}
              onPointerLeave={() => setSpotlight((s) => ({ ...s, active: false }))}
              className="relative obsidian-panel rounded-2xl overflow-hidden"
            >
              {/* Subtle Specular Top Hairline */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-0 inset-x-10 h-px opacity-70"
                style={{
                  background: `linear-gradient(90deg, transparent 0%, ${activeProject.accentColor} 50%, transparent 100%)`,
                }}
              />

              {/* Subtle Mouse-Tracked Inner Luminance */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 transition-opacity duration-300"
                style={{
                  opacity: spotlight.active ? 1 : 0.25,
                  background: `radial-gradient(520px circle at ${spotlight.x}% ${spotlight.y}%, ${activeProject.accentColor}12, transparent 62%)`,
                }}
              />

              <AnimatePresence mode="wait">
                <motion.article
                  key={activeProject.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                  className="relative z-10 p-6 sm:p-9 text-left space-y-6"
                >
                  {/* Dossier Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-white/[0.08]">
                    <div className="space-y-2 min-w-0">
                      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-mono text-[#9EA8C4]">
                        <span
                          className="font-mythic font-semibold tracking-[0.18em]"
                          style={{ color: activeProject.accentColor }}
                        >
                          {activeProject.realmCode}
                        </span>
                        <span aria-hidden="true" className="text-white/20">
                          ·
                        </span>
                        <span>{activeProject.category}</span>
                        {isInspected && (
                          <>
                            <span aria-hidden="true" className="text-white/20">
                              ·
                            </span>
                            <span className="inline-flex items-center gap-1 text-[#98F5E1]">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Reviewed</span>
                            </span>
                          </>
                        )}
                      </div>

                      <h3 className="font-mythic text-2xl sm:text-[28px] font-bold text-[#F2F4FB] tracking-[0.05em] leading-snug text-balance">
                        {activeProject.title}
                      </h3>
                    </div>

                    <div
                      className="hidden sm:flex w-12 h-12 rounded-xl bg-[#070A13] border border-white/[0.1] items-center justify-center font-serif text-xl font-bold shrink-0"
                      style={{ color: activeProject.accentColor }}
                      aria-hidden="true"
                    >
                      {activeProject.rune}
                    </div>
                  </div>

                  {/* Three Crisp Authoritative Engineering Beats */}
                  <div className="space-y-5">
                    {/* BEAT I: THE CRISIS */}
                    <div className="space-y-1.5">
                      <p className="font-mythic text-[10.5px] font-semibold tracking-[0.2em] text-[#E6C999]">
                        I. THE CRISIS
                      </p>
                      <p className="text-sm sm:text-[15px] text-[#F2F4FB] leading-relaxed">
                        {activeProject.codex.crisis}
                      </p>
                    </div>

                    <div className="h-px bg-white/[0.07]" />

                    {/* BEAT II: THE ARCHITECTURE */}
                    <div className="space-y-2.5">
                      <p className="font-mythic text-[10.5px] font-semibold tracking-[0.2em] text-[#A5E8FF]">
                        II. THE ARCHITECTURE
                      </p>
                      <p className="text-sm sm:text-[15px] text-[#C8D1E8] leading-relaxed">
                        {activeProject.codex.forge}
                      </p>
                      <p className="font-mono text-xs text-[#A5E8FF] pt-0.5">
                        <span className="text-[#6E7896] mr-2">Tech Specs:</span>
                        {activeProject.stack.join(" · ")}
                      </p>
                    </div>

                    <div className="h-px bg-white/[0.07]" />

                    {/* BEAT III: THE IMPACT */}
                    <div className="space-y-3">
                      <p className="font-mythic text-[10.5px] font-semibold tracking-[0.2em] text-[#98F5E1]">
                        III. THE IMPACT
                      </p>
                      <p className="text-sm sm:text-[15px] text-[#F2F4FB] leading-relaxed">
                        {activeProject.codex.legacy}
                      </p>

                      {/* Crisp Quantitative Evidence Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                        {activeProject.metrics.map((metric, mIdx) => (
                          <div
                            key={mIdx}
                            className="rounded-xl bg-[#070A13]/90 border border-white/[0.07] px-3.5 py-2.5 font-mono text-xs text-[#E6C999] leading-snug tabular-nums"
                          >
                            {metric}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Chronicle Action Footer */}
                  <div className="pt-5 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => onSelectLevel(activeProject)}
                        className="min-h-[44px] px-4 py-2 rounded-lg bg-[#E6C999] hover:bg-[#f0dab4] text-[#06080E] font-mythic text-[10.5px] font-bold tracking-[0.14em] inline-flex items-center gap-2 transition-all active:scale-[0.98] cursor-pointer whitespace-nowrap"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>FULL DOSSIER</span>
                      </button>

                      <a
                        href={activeProject.liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={onLinkClick}
                        className="min-h-[44px] px-4 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.12] hover:border-[#A5E8FF]/55 text-[#F2F4FB] font-mono text-xs inline-flex items-center gap-1.5 transition-colors whitespace-nowrap"
                      >
                        <span>Live Demo</span>
                        <ExternalLink className="w-3.5 h-3.5 text-[#A5E8FF]" />
                      </a>

                      <a
                        href={activeProject.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={onLinkClick}
                        className="min-h-[44px] px-4 py-2 rounded-lg bg-transparent hover:bg-white/[0.05] border border-white/[0.1] hover:border-[#C7B8FF]/50 text-[#9EA8C4] hover:text-[#F2F4FB] font-mono text-xs inline-flex items-center gap-1.5 transition-colors whitespace-nowrap"
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>GitHub</span>
                      </a>
                    </div>

                    {/* Chronicle Page Controls */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={handlePrev}
                        aria-label="Previous chronicle"
                        className="min-w-[40px] min-h-[40px] rounded-lg bg-[#090D18] hover:bg-white/[0.06] border border-white/[0.09] text-[#9EA8C4] hover:text-[#F2F4FB] flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="font-mono text-xs text-[#6E7896] px-1.5 tabular-nums">
                        {selectedIndex + 1}/{projects.length}
                      </span>
                      <button
                        type="button"
                        onClick={handleNext}
                        aria-label="Next chronicle"
                        className="min-w-[40px] min-h-[40px] rounded-lg bg-[#090D18] hover:bg-white/[0.06] border border-white/[0.09] text-[#9EA8C4] hover:text-[#F2F4FB] flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.article>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
