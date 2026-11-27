import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  Sparkles,
  Download,
  FileText,
  Copy,
  Check,
  RotateCcw,
  ExternalLink,
  Trophy,
  Award,
  ArrowUpRight,
} from "lucide-react";
import { PORTFOLIO_DATA } from "../data/portfolioData";
import { retroAudio } from "../utils/retroAudio";

export interface StoryJourneyStats {
  clearTimeSeconds: number;
  perfectParries: number;
  perfectDodges: number;
}

interface ActFourSummitProps {
  stats: StoryJourneyStats;
  onOpenResume: () => void;
  onReplayStory: () => void;
  onReturnToPortfolio: () => void;
}

function formatDuration(sec: number): string {
  const safe = Math.max(1, Math.round(sec));
  const mins = Math.floor(safe / 60);
  const rem = safe % 60;
  return `${mins}:${rem.toString().padStart(2, "0")}`;
}

export default function ActFourSummit({
  stats,
  onOpenResume,
  onReplayStory,
  onReturnToPortfolio,
}: ActFourSummitProps) {
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Trigger deep emotional triumphant Golden Dawn chord on arrival
  useEffect(() => {
    retroAudio.playDawnTriumphChord();
  }, []);

  const handleCopyEmail = () => {
    retroAudio.playClick();
    navigator.clipboard.writeText(PORTFOLIO_DATA.profile.email).catch(() => {});
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2200);
  };

  const nasaAch = PORTFOLIO_DATA.achievements.find((a) => a.id === "nasa-space-apps");
  const bgiAch = PORTFOLIO_DATA.achievements.find(
    (a) => a.id === "bgi-hackathon-runnerup"
  );
  const mlsaAch = PORTFOLIO_DATA.achievements.find((a) => a.id === "azure-dev-day");
  const featuredCerts = PORTFOLIO_DATA.certifications.slice(0, 3);

  const earnedTitle =
    stats.perfectParries >= 6 && stats.perfectDodges >= 2
      ? "SOVEREIGN ARCHITECT"
      : stats.perfectParries >= 4 || stats.perfectDodges >= 1
      ? "ARCHITECT OF REALMS"
      : "CHRONICLE WITNESS";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-6 my-auto space-y-5"
    >
      {/* Emotional Story Beat Header */}
      <div className="text-center space-y-2.5">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.28em] text-[#F7D894] inline-flex items-center gap-2"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>ACT IV // THE SUMMIT · GOLDEN DAWN</span>
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="font-mythic text-xl sm:text-3xl lg:text-4xl font-bold tracking-[0.1em] text-[#FFF8E8] leading-snug max-w-3xl mx-auto"
        >
          &ldquo;Every late night left a mark. Every setback built an engineer.&rdquo;
        </motion.h2>
      </div>

      {/* ====================================================================
          CHRONICLE COMPLETION MONUMENT (VERIFIED HONORS + PLAYER JOURNEY)
         ==================================================================== */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-2xl bg-[rgba(8,11,20,0.9)] border border-[#F7D894]/40 p-4 sm:p-6 space-y-5 text-left"
      >
        {/* Top Player Journey Summary Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 pb-4 border-b border-white/[0.08]">
          <div className="rounded-xl bg-[#111526] border border-[#F7D894]/30 p-3">
            <p className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-[#9EA8C4]">
              EARNED TITLE
            </p>
            <p className="font-mythic text-xs sm:text-sm font-bold text-[#F7D894] tracking-[0.08em] mt-1">
              {earnedTitle}
            </p>
          </div>
          <div className="rounded-xl bg-[#111526] border border-white/[0.08] p-3">
            <p className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-[#9EA8C4]">
              CLEAR TIME
            </p>
            <p className="font-mono text-base sm:text-lg font-bold text-[#F2F4FB] tabular-nums mt-0.5">
              {formatDuration(stats.clearTimeSeconds)}
            </p>
          </div>
          <div className="rounded-xl bg-[#111526] border border-white/[0.08] p-3">
            <p className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-[#9EA8C4]">
              PERFECT PARRIES
            </p>
            <p className="font-mono text-base sm:text-lg font-bold text-[#A5E8FF] tabular-nums mt-0.5">
              {stats.perfectParries}
            </p>
          </div>
          <div className="rounded-xl bg-[#111526] border border-white/[0.08] p-3">
            <p className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-[#9EA8C4]">
              PERFECT DODGES
            </p>
            <p className="font-mono text-base sm:text-lg font-bold text-[#98F5E1] tabular-nums mt-0.5">
              {stats.perfectDodges}
            </p>
          </div>
        </div>

        {/* Real Verified Honors Grid from portfolioData.ts */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-mythic text-[11px] font-bold tracking-[0.18em] text-[#F7D894] inline-flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5" />
              <span>VERIFIED ENGINEERING HONORS · {PORTFOLIO_DATA.profile.name.toUpperCase()}</span>
            </p>
            <span className="font-mono text-[10.5px] text-[#98F5E1]">
              8.21 CGPA · BIST Bhopal · 360+ DSA Solved
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 sm:gap-3">
            {[
              {
                label: "NASA SPACE APPS",
                title: "NASA Space Apps Global Nominee",
                sub: nasaAch?.metrics ?? "Global Nominee · Bhopal Local Event",
                url: nasaAch?.credentialUrl ?? PORTFOLIO_DATA.profile.links.certificateVaultUrl,
                accent: "#A5E8FF",
              },
              {
                label: "2ND PLACE MVP",
                title: "BGI National Hackathon Runner-Up",
                sub: bgiAch?.metrics ?? "2nd Place · 36h Sprint to Working MVP",
                url: bgiAch?.credentialUrl ?? PORTFOLIO_DATA.profile.links.certificateVaultUrl,
                accent: "#F7D894",
              },
              {
                label: "3RD POSITION",
                title: "MLSA Hackathon 3rd Place",
                sub: mlsaAch?.metrics ?? "Azure Developer Day · Microsoft Learn Student Ambassadors",
                url: mlsaAch?.credentialUrl ?? PORTFOLIO_DATA.profile.links.certificateVaultUrl,
                accent: "#98F5E1",
              },
            ].map((honor) => (
              <a
                key={honor.title}
                href={honor.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => retroAudio.playClick()}
                className="group rounded-xl bg-[#0E1324] hover:bg-[#141B33] border border-white/[0.1] hover:border-[#F7D894]/55 p-3.5 space-y-1 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className="font-mono text-[9.5px] font-bold uppercase tracking-[0.14em]"
                    style={{ color: honor.accent }}
                  >
                    {honor.label}
                  </span>
                  <ExternalLink className="w-3 h-3 text-[#7E89A6] group-hover:text-[#F7D894]" />
                </div>
                <p className="font-mythic text-xs sm:text-[13px] font-bold text-[#F2F4FB] tracking-[0.05em]">
                  {honor.title}
                </p>
                <p className="font-mono text-[10.5px] text-[#9EA8C4] leading-snug">
                  {honor.sub}
                </p>
              </a>
            ))}
          </div>

          {/* Verified Certification Direct Links */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7E89A6] inline-flex items-center gap-1">
              <Award className="w-3 h-3 text-[#F7D894]" />
              <span>Verified Certs:</span>
            </span>
            {featuredCerts.map((cert) => (
              <a
                key={cert.id}
                href={cert.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => retroAudio.playClick()}
                className="px-2.5 py-1 rounded-md bg-[#11172B] hover:bg-[#192340] border border-white/[0.1] font-mono text-[10px] text-[#C8D1E6] hover:text-[#F7D894] inline-flex items-center gap-1 transition-colors"
              >
                <span>{cert.issuer}</span>
                <ArrowUpRight className="w-2.5 h-2.5" />
              </a>
            ))}
            <a
              href={PORTFOLIO_DATA.profile.links.certificateVaultUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => retroAudio.playClick()}
              className="px-2.5 py-1 rounded-md bg-[#F7D894]/12 hover:bg-[#F7D894]/22 border border-[#F7D894]/40 font-mono text-[10px] text-[#F7D894] inline-flex items-center gap-1 transition-colors"
            >
              <span>All 12+ Drive Vault</span>
              <ArrowUpRight className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>

        {/* Clean Final Recruiter Action Bar */}
        <div className="pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-center sm:justify-between gap-2.5">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <a
              href={PORTFOLIO_DATA.profile.links.resumeDriveUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => retroAudio.playClick()}
              className="min-h-[42px] px-4 sm:px-5 py-2 rounded-xl bg-[#F7D894] hover:bg-[#ffe4a8] text-[#05070D] font-space font-bold text-xs sm:text-[13px] inline-flex items-center gap-1.5 transition-colors whitespace-nowrap"
            >
              <Download className="w-4 h-4" />
              <span>Download Resume</span>
            </a>

            <button
              type="button"
              onClick={() => {
                retroAudio.playClick();
                onOpenResume();
              }}
              className="min-h-[42px] px-4 py-2 rounded-xl bg-[#13192D] hover:bg-[#1C2542] border border-[#A5E8FF]/45 text-[#F2F4FB] font-space font-semibold text-xs sm:text-[13px] inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
            >
              <FileText className="w-4 h-4 text-[#A5E8FF]" />
              <span>Preview CV</span>
            </button>

            <button
              type="button"
              onClick={handleCopyEmail}
              className="min-h-[42px] px-3.5 py-2 rounded-xl bg-[#13192D] hover:bg-[#1C2542] border border-white/[0.15] text-[#F2F4FB] font-mono text-[11px] sm:text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
            >
              {copiedEmail ? (
                <Check className="w-3.5 h-3.5 text-[#98F5E1]" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-[#F7D894]" />
              )}
              <span>{copiedEmail ? "Email Copied" : "Copy Email"}</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => {
                retroAudio.playClick();
                onReplayStory();
              }}
              className="min-h-[42px] px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/[0.14] text-[#C8D1E6] hover:text-[#F2F4FB] font-mono text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Replay Story</span>
            </button>

            <button
              type="button"
              onClick={() => {
                retroAudio.playClick();
                onReturnToPortfolio();
              }}
              className="min-h-[42px] px-4 py-2 rounded-xl bg-[#98F5E1]/14 hover:bg-[#98F5E1]/24 border border-[#98F5E1]/50 text-[#98F5E1] font-mythic text-[10.5px] font-bold tracking-[0.12em] inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
            >
              <span>Return to Executive Portfolio</span>
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
