import React, { useState } from "react";
import {
  ExternalLink,
  FolderCheck,
  Award,
  Briefcase,
  GraduationCap,
  ChevronDown,
  ChevronUp,
  Download,
} from "lucide-react";
import { PORTFOLIO_DATA } from "../data/portfolioData";
import ChapterDivider from "./ChapterDivider";
import ScrollReveal from "./ScrollReveal";

interface TrophyRoomProps {
  onLinkClick: () => void;
  onOpenResume: () => void;
  isHighlighted?: boolean;
}

const HONOR_ACCENT = {
  peach: { hex: "#E6C999", textColor: "text-[#E6C999]" },
  pink: { hex: "#C7B8FF", textColor: "text-[#C7B8FF]" },
  mint: { hex: "#98F5E1", textColor: "text-[#98F5E1]" },
  lavender: { hex: "#C7B8FF", textColor: "text-[#C7B8FF]" },
  sky: { hex: "#A5E8FF", textColor: "text-[#A5E8FF]" },
} as const;

export default function TrophyRoom({
  onLinkClick,
  onOpenResume,
  isHighlighted = false,
}: TrophyRoomProps) {
  const [showAllCerts, setShowAllCerts] = useState(false);
  const { achievements, certifications, experience, education, profile } = PORTFOLIO_DATA;

  const visibleCerts = showAllCerts ? certifications : certifications.slice(0, 6);

  return (
    <section id="trophies" className="py-16 sm:py-22 px-4 sm:px-6 max-w-6xl mx-auto">
      <ChapterDivider
        chapter="CHAPTER IV"
        title="THE HALL OF HONOR"
        subtitle="Hackathon podium finishes, NASA Space Apps global nomination, campus leadership, and twelve verified credentials linked directly to Google Drive proof."
        rune="ᛏ"
        accent="#E6C999"
        isHighlighted={isHighlighted}
      />

      {/* Verified Credential Actions */}
      <ScrollReveal className="flex flex-wrap items-center justify-between gap-3 mb-7">
        <p className="font-mono text-xs text-[#9EA8C4]">
          {achievements.length} Honors &amp; Distinctions{" "}
          <span className="text-white/20 mx-1.5">·</span> {certifications.length} Accredited
          Credentials
        </p>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <a
            href={profile.links.certificateVaultUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onLinkClick}
            className="min-h-[42px] px-4 py-2 rounded-lg bg-[#E6C999]/12 hover:bg-[#E6C999]/20 border border-[#E6C999]/40 text-[#E6C999] font-mythic text-[10px] font-bold tracking-[0.14em] inline-flex items-center gap-2 transition-all active:scale-[0.98] whitespace-nowrap"
          >
            <FolderCheck className="w-3.5 h-3.5" />
            <span>DRIVE VAULT</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <button
            type="button"
            onClick={onOpenResume}
            className="min-h-[42px] px-4 py-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.1] text-[#F2F4FB] font-mythic text-[10px] font-semibold tracking-[0.14em] inline-flex items-center gap-2 transition-all active:scale-[0.98] cursor-pointer whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5 text-[#A5E8FF]" />
            <span>PREVIEW CV</span>
          </button>
        </div>
      </ScrollReveal>

      {/* Honor Chronicle Monoliths */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-10">
        {achievements.map((ach, idx) => {
          const style = HONOR_ACCENT[ach.accent];
          return (
            <div key={ach.id}>
              <ScrollReveal delay={idx * 0.05} className="h-full">
                <article className="monolith-card sheen-surface rounded-2xl p-5 sm:p-6 h-full flex flex-col justify-between text-left hover:-translate-y-0.5">
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute top-0 inset-x-6 h-px opacity-60"
                    style={{
                      background: `linear-gradient(90deg, transparent 0%, ${style.hex} 50%, transparent 100%)`,
                    }}
                  />

                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2 text-xs font-mono">
                      <span
                        className={`font-mythic text-[10.5px] font-semibold tracking-[0.16em] ${style.textColor}`}
                      >
                        {ach.rankLabel}
                      </span>
                      <span className="text-[#6E7896]">{ach.date}</span>
                    </div>

                    <div>
                      <h3 className="font-mythic text-base sm:text-lg font-bold text-[#F2F4FB] tracking-[0.04em] leading-snug">
                        {ach.title}
                      </h3>
                      <p className="font-mono text-[11px] text-[#9EA8C4] mt-1">
                        {ach.organization} · {ach.role}
                      </p>
                    </div>

                    <p className="text-xs sm:text-sm text-[#9EA8C4] leading-relaxed">
                      {ach.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-5 border-t border-white/[0.07] flex items-center justify-between gap-2">
                    <span className="font-mono text-[11px] text-[#98F5E1] truncate">
                      {ach.metrics}
                    </span>
                    <a
                      href={ach.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={onLinkClick}
                      className={`font-mono text-xs font-semibold inline-flex items-center gap-1 shrink-0 hover:underline ${style.textColor}`}
                    >
                      <span>Verify</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </article>
              </ScrollReveal>
            </div>
          );
        })}
      </div>

      {/* Verified Certificates Ledger */}
      <ScrollReveal className="obsidian-panel rounded-2xl p-5 sm:p-7 mb-10 text-left">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-white/[0.07]">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#E6C999]" />
            <h3 className="font-mythic text-xs font-bold text-[#F2F4FB] tracking-[0.16em]">
              VERIFIED CERTIFICATES ({certifications.length})
            </h3>
          </div>
          <button
            type="button"
            onClick={() => {
              onLinkClick();
              setShowAllCerts((prev) => !prev);
            }}
            className="min-h-[38px] px-3.5 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.1] text-[#E6C999] font-mono text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>{showAllCerts ? "Show Top 6" : `Show All ${certifications.length}`}</span>
            {showAllCerts ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {visibleCerts.map((cert) => (
            <a
              key={cert.id}
              href={cert.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onLinkClick}
              className="sheen-surface rounded-xl bg-[#070A13]/85 border border-white/[0.07] hover:border-[#E6C999]/40 p-4 flex flex-col justify-between gap-2.5 transition-all group"
            >
              <div className="space-y-1">
                <p className="font-mono text-[10px] text-[#A5E8FF]">
                  {cert.category} · {cert.year}
                </p>
                <h4 className="font-space font-semibold text-sm text-[#F2F4FB] group-hover:text-[#E6C999] transition-colors leading-snug">
                  {cert.name}
                </h4>
                <p className="text-xs text-[#6E7896]">{cert.issuer}</p>
              </div>
              <div className="flex items-center justify-end gap-1 font-mono text-[11px] text-[#9EA8C4] group-hover:text-[#E6C999]">
                <span>View Credential</span>
                <ExternalLink className="w-3 h-3" />
              </div>
            </a>
          ))}
        </div>
      </ScrollReveal>

      {/* Experience & Academic Record */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 text-left">
        <ScrollReveal className="lg:col-span-6 obsidian-panel rounded-2xl p-5 sm:p-7 space-y-4">
          <div className="flex items-center gap-2 text-[#98F5E1] pb-3 border-b border-white/[0.07]">
            <Briefcase className="w-4 h-4" />
            <h3 className="font-mythic text-xs font-bold tracking-[0.16em]">EXPERIENCE</h3>
          </div>
          {experience.map((exp) => (
            <div key={exp.company} className="space-y-2.5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h4 className="font-space font-bold text-base sm:text-lg text-[#F2F4FB]">
                  {exp.company} — {exp.role}
                </h4>
                <span className="font-mono text-xs text-[#98F5E1]">{exp.period}</span>
              </div>
              <ul className="space-y-1.5 text-xs sm:text-sm text-[#9EA8C4] leading-relaxed list-disc pl-4">
                {exp.highlights.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>
          ))}
        </ScrollReveal>

        <ScrollReveal
          delay={0.08}
          className="lg:col-span-6 obsidian-panel rounded-2xl p-5 sm:p-7 space-y-4"
        >
          <div className="flex items-center gap-2 text-[#C7B8FF] pb-3 border-b border-white/[0.07]">
            <GraduationCap className="w-4 h-4" />
            <h3 className="font-mythic text-xs font-bold tracking-[0.16em]">EDUCATION</h3>
          </div>
          <div className="space-y-3.5">
            {education.map((edu, i) => (
              <div
                key={i}
                className={i > 0 ? "pt-3 border-t border-white/[0.07] space-y-1" : "space-y-1"}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h4 className="font-space font-bold text-sm sm:text-base text-[#F2F4FB]">
                    {edu.degree}
                  </h4>
                  <span className="font-mono text-xs font-bold text-[#E6C999]">
                    {edu.score}
                  </span>
                </div>
                <p className="font-mono text-xs text-[#A5E8FF]">
                  {edu.institution} · {edu.duration}
                </p>
                <p className="text-xs text-[#9EA8C4] leading-relaxed">{edu.details}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
