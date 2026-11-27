import React from "react";
import {
  Download,
  FileText,
  Github,
  Linkedin,
  FolderCheck,
  ExternalLink,
  GraduationCap,
  Swords,
  ChevronRight,
} from "lucide-react";
import { PORTFOLIO_DATA } from "../data/portfolioData";
import ChapterDivider from "./ChapterDivider";
import ScrollReveal from "./ScrollReveal";

interface HeroStartScreenProps {
  onEnterStory: (origin?: { x: number; y: number }) => void;
  onOpenResume: () => void;
  onLinkClick: () => void;
  highlightedChapter?: string | null;
}

const ARENA_MONOLITH_ACCENT = {
  peach: { hex: "#E6C999", rune: "ᚦ" },
  mint: { hex: "#98F5E1", rune: "ᛉ" },
  lavender: { hex: "#C7B8FF", rune: "ᛏ" },
  sky: { hex: "#A5E8FF", rune: "ᛟ" },
} as const;

export default function HeroStartScreen({
  onEnterStory,
  onOpenResume,
  onLinkClick,
  highlightedChapter = null,
}: HeroStartScreenProps) {
  const { profile, codingProfiles, education } = PORTFOLIO_DATA;

  const handleStoryClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    onEnterStory({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });
  };

  return (
    <div id="start" className="w-full">
      {/* ====================================================================
       * THE SURFACE: ULTRA-CLEAN DARK-OBSIDIAN EXECUTIVE HERO
       * Calm, balanced typography + ONE unmistakable centerpiece Story CTA
       * ==================================================================== */}
      <section className="relative w-full pt-16 sm:pt-24 lg:pt-28 pb-16 sm:pb-24 px-4 sm:px-6 overflow-hidden">
        {/* Quiet Ambient Frost & Pale-Gold Horizon Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[min(920px,100%)] h-[420px] opacity-60"
          style={{
            background:
              "radial-gradient(ellipse at 50% 24%, rgba(165, 232, 255, 0.08) 0%, rgba(230, 201, 153, 0.05) 38%, transparent 72%)",
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
          {/* Monumental Cinzel Name */}
          <h1 className="font-mythic text-3xl sm:text-5xl lg:text-[56px] font-bold tracking-[0.12em] sm:tracking-[0.15em] text-[#F2F4FB] leading-[1.12]">
            {profile.name.toUpperCase()}
          </h1>

          {/* Crisp Role & Academic Pedigree */}
          <p className="mt-4 sm:mt-5 font-space text-sm sm:text-base md:text-[17px] text-[#9EA8C4] tracking-wide max-w-2xl leading-relaxed">
            Full-Stack Systems &amp; AI Engineer
            <span className="text-white/25 mx-2">·</span>
            B.Tech IT, BIST Bhopal
            <span className="text-white/25 mx-2">·</span>
            <span className="font-mono text-[#A5E8FF] font-semibold">8.21 CGPA</span>
          </p>

          {/* Concise Verified Proof Strip */}
          <div className="mt-6 sm:mt-7 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] sm:text-xs font-mono tracking-[0.06em] text-[#C8D1E6]">
            <span className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A5E8FF]" />
              <span>360+ DSA Solved</span>
            </span>
            <span aria-hidden="true" className="text-white/20">
              ·
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E6C999]" />
              <span>7+ Shipped Builds</span>
            </span>
            <span aria-hidden="true" className="text-white/20">
              ·
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#98F5E1]" />
              <span>NASA Space Apps Global Nominee</span>
            </span>
          </div>

          {/* ==============================================================
           * ONE UNMISTAKABLE CENTERPIECE CTA: ENTER MY STORY
           * Rotating frost-gold conic border + subtle ember shimmer
           * ============================================================== */}
          <div className="mt-10 sm:mt-12 flex flex-col items-center gap-3.5">
            <div className="story-cta-shell">
              <span aria-hidden="true" className="story-cta-ring" />
              <button
                type="button"
                onClick={handleStoryClick}
                className="sheen-surface relative z-10 min-h-[56px] sm:min-h-[62px] px-7 sm:px-10 py-3.5 sm:py-4 rounded-[12.5px] bg-[#070B15] hover:bg-[#0B1120] text-[#F5F7FC] font-mythic font-bold text-xs sm:text-sm md:text-[15px] tracking-[0.22em] inline-flex items-center justify-center gap-3 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E6C999]"
              >
                <Swords className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-[#E6C999] shrink-0" />
                <span>ENTER MY STORY</span>
                <ChevronRight className="w-4 h-4 text-[#A5E8FF] shrink-0" />
              </button>
            </div>

            <p className="font-mono text-[11px] sm:text-xs text-[#7E89A6] tracking-wide">
              Launch 4-Act Interactive 3D Chronicle · Sound On Recommended
            </p>
          </div>

          {/* Subtle Secondary Recruiter Actions */}
          <div className="mt-9 sm:mt-11 pt-7 border-t border-white/[0.07] w-full max-w-xl flex flex-col items-center gap-4">
            <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
              <a
                href={profile.links.resumeDriveUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onLinkClick}
                className="min-h-[42px] px-5 py-2.5 rounded-lg bg-[#E6C999] hover:bg-[#f0dab4] text-[#05070D] font-space font-bold text-xs sm:text-[13px] inline-flex items-center gap-2 transition-all active:scale-[0.98] whitespace-nowrap"
              >
                <Download className="w-4 h-4" />
                <span>Download Resume</span>
              </a>

              <button
                type="button"
                onClick={onOpenResume}
                className="min-h-[42px] px-5 py-2.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.14] hover:border-[#A5E8FF]/55 text-[#F2F4FB] font-space font-semibold text-xs sm:text-[13px] inline-flex items-center gap-2 transition-all active:scale-[0.98] cursor-pointer whitespace-nowrap"
              >
                <FileText className="w-4 h-4 text-[#A5E8FF]" />
                <span>Preview CV</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-mono text-[#7E89A6]">
              <a
                href={profile.links.github}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onLinkClick}
                className="inline-flex items-center gap-1.5 hover:text-[#F2F4FB] transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub</span>
              </a>
              <span aria-hidden="true" className="text-white/15">
                ·
              </span>
              <a
                href={profile.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onLinkClick}
                className="inline-flex items-center gap-1.5 hover:text-[#A5E8FF] transition-colors"
              >
                <Linkedin className="w-3.5 h-3.5" />
                <span>LinkedIn</span>
              </a>
              <span aria-hidden="true" className="text-white/15">
                ·
              </span>
              <a
                href={profile.links.certificateVaultUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onLinkClick}
                className="inline-flex items-center gap-1.5 hover:text-[#E6C999] transition-colors"
              >
                <FolderCheck className="w-3.5 h-3.5" />
                <span>Drive Vault</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
       * PROLOGUE: THE ORIGIN — ARCHITECT PROFILE & VERIFIED METRICS
       * ==================================================================== */}
      <section id="origin" className="py-12 sm:py-18 px-4 sm:px-6 max-w-6xl mx-auto">
        <ChapterDivider
          chapter="PROLOGUE"
          title="THE ORIGIN"
          subtitle="Disciplined systems engineering built across full-stack architecture, competitive algorithms, and applied AI."
          rune="ᛟ"
          accent="#E6C999"
          isHighlighted={highlightedChapter === "origin"}
        />

        <ScrollReveal>
          <div className="obsidian-panel rounded-2xl p-6 sm:p-9 text-left">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 space-y-4">
                <h2 className="font-mythic text-xl sm:text-2xl font-bold text-[#F2F4FB] tracking-[0.06em]">
                  Craft, Discipline &amp; Production Systems
                </h2>
                <p className="text-sm sm:text-[15px] text-[#9EA8C4] leading-relaxed">
                  {profile.bio}
                </p>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 pt-2 text-xs font-mono text-[#A5E8FF]">
                  <span className="inline-flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-[#E6C999]" />
                    {education[0].degree} · {education[0].institution}
                  </span>
                  <span className="text-white/20">·</span>
                  <span className="text-[#E6C999]">{education[0].duration}</span>
                  <span className="text-white/20">·</span>
                  <span className="text-[#98F5E1]">CodeAlpha SWE Intern</span>
                </div>
              </div>

              <div className="lg:col-span-5 grid grid-cols-2 gap-3">
                {profile.heroStats.map((stat, idx) => {
                  const accents = ["#E6C999", "#A5E8FF", "#98F5E1", "#C7B8FF"];
                  const color = accents[idx % accents.length];
                  return (
                    <div
                      key={stat.label}
                      className="rounded-xl bg-[#070A13]/85 border border-white/[0.07] p-4 space-y-1.5"
                    >
                      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#6E7896]">
                        {stat.label}
                      </p>
                      <p
                        className="font-mythic text-2xl sm:text-[26px] font-bold leading-none tabular-nums"
                        style={{ color }}
                      >
                        {stat.value}
                      </p>
                      <p className="font-mono text-[11px] text-[#9EA8C4]">{stat.detail}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ====================================================================
       * CHAPTER I: THE ARENA OF LOGIC — CARVED OBSIDIAN MONOLITH CARDS
       * ==================================================================== */}
      <section id="arena" className="py-12 sm:py-18 px-4 sm:px-6 max-w-6xl mx-auto">
        <ChapterDivider
          chapter="CHAPTER I"
          title="THE ARENA OF LOGIC"
          subtitle="360+ algorithmic problems solved across four competitive programming platforms—every obsidian monolith links directly to verified profiles."
          rune="ᚱ"
          accent="#A5E8FF"
          isHighlighted={highlightedChapter === "arena"}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {codingProfiles.map((cp, idx) => {
            const theme = ARENA_MONOLITH_ACCENT[cp.accent];
            return (
              <div key={cp.id}>
                <ScrollReveal delay={idx * 0.06} className="h-full">
                  <a
                    href={cp.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={onLinkClick}
                    className="monolith-card sheen-surface group rounded-2xl p-5 sm:p-6 h-full flex flex-col justify-between gap-7 text-left hover:-translate-y-1"
                  >
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute top-0 inset-x-5 h-px opacity-60 group-hover:opacity-100 transition-opacity"
                      style={{
                        background: `linear-gradient(90deg, transparent 0%, ${theme.hex} 50%, transparent 100%)`,
                      }}
                    />

                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className="font-serif text-base font-bold leading-none"
                            style={{ color: theme.hex }}
                          >
                            {theme.rune}
                          </span>
                          <h3 className="font-mythic text-sm sm:text-[15px] font-bold text-[#F2F4FB] tracking-[0.08em] truncate">
                            {cp.name}
                          </h3>
                        </div>
                        <p className="font-mono text-xs text-[#7E89A6] truncate">
                          @{cp.handle}
                        </p>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-[#6E7896] group-hover:text-[#F2F4FB] shrink-0 transition-colors" />
                    </div>

                    <div className="space-y-1.5 pt-3 border-t border-white/[0.07]">
                      <p
                        className="font-mythic text-3xl sm:text-4xl font-bold leading-none tabular-nums"
                        style={{ color: theme.hex }}
                      >
                        {cp.solved}
                      </p>
                      <div className="flex items-center justify-between gap-2 text-[11px] font-mono text-[#9EA8C4]">
                        <span className="truncate">{cp.badgeNote}</span>
                        <span className="text-[#F2F4FB]/60 group-hover:text-[#E6C999] shrink-0 transition-colors">
                          Profile ↗
                        </span>
                      </div>
                    </div>
                  </a>
                </ScrollReveal>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
