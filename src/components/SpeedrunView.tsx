import React, { useState } from "react";
import {
  ArrowLeft,
  Copy,
  Check,
  Github,
  Linkedin,
  ExternalLink,
  Download,
  FileText,
  Award,
  Briefcase,
  GraduationCap,
  Code2,
  FolderCheck,
} from "lucide-react";
import { motion } from "motion/react";
import { PORTFOLIO_DATA } from "../data/portfolioData";

interface SpeedrunViewProps {
  onExitSpeedrun: () => void;
  onOpenResume: () => void;
  onSoundClick: () => void;
}

export default function SpeedrunView({
  onExitSpeedrun,
  onOpenResume,
  onSoundClick,
}: SpeedrunViewProps) {
  const [copied, setCopied] = useState(false);
  const {
    profile,
    projects,
    skillGroups,
    achievements,
    certifications,
    codingProfiles,
    experience,
    education,
  } = PORTFOLIO_DATA;

  const handleCopyEmail = () => {
    onSoundClick();
    navigator.clipboard.writeText(profile.email).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const coreSkills = skillGroups.flatMap((g) => g.skills.map((s) => s.name));

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-20"
    >
      {/* Top Return Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <span className="font-mythic text-[11px] text-[#E6C999] tracking-[0.2em]">
          EXECUTIVE DOSSIER · SINGLE-PAGE BRIEF
        </span>

        <button
          type="button"
          onClick={onExitSpeedrun}
          className="min-h-[40px] px-4 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.12] text-[#F2F4FB] font-mythic text-[10px] tracking-[0.14em] flex items-center gap-2 transition-all cursor-pointer active:scale-[0.98]"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#A5E8FF]" />
          <span>RETURN TO REALM</span>
        </button>
      </div>

      {/* Minimalist Single-Page Executive Resume Dossier */}
      <div className="obsidian-panel rounded-2xl p-6 sm:p-9 space-y-7">
        {/* Identity & 1-Click Recruiter Actions */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5 pb-6 border-b border-white/[0.08]">
          <div className="space-y-2 max-w-2xl text-left">
            <h1 className="font-mythic text-2xl sm:text-3xl font-bold text-[#F2F4FB] tracking-[0.08em]">
              {profile.name.toUpperCase()}
            </h1>
            <p className="text-sm sm:text-base font-medium text-[#A5E8FF]">
              Full-Stack Systems &amp; AI Engineer · {profile.location}
            </p>
            <p className="text-xs sm:text-sm text-[#9EA8C4] leading-relaxed">
              {profile.bio}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 shrink-0">
            <button
              type="button"
              onClick={handleCopyEmail}
              className="min-h-[42px] px-4 py-2 rounded-lg bg-[#E6C999] hover:bg-[#f0dab4] text-[#06080E] font-mythic text-[10px] font-bold tracking-[0.14em] flex items-center gap-1.5 transition-all cursor-pointer active:scale-[0.98]"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "COPIED" : "COPY EMAIL"}</span>
            </button>

            <a
              href={profile.links.resumeDriveUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onSoundClick}
              className="min-h-[42px] px-3.5 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.12] text-[#F2F4FB] font-mono text-xs flex items-center gap-1.5 transition-all"
            >
              <Download className="w-3.5 h-3.5 text-[#A5E8FF]" />
              <span>Download Resume</span>
            </a>

            <button
              type="button"
              onClick={onOpenResume}
              className="min-h-[42px] px-3.5 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.12] text-[#F2F4FB] font-mono text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-[#C7B8FF]" />
              <span>Preview CV</span>
            </button>

            <a
              href={profile.links.github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onSoundClick}
              className="min-h-[42px] px-3.5 py-2 rounded-lg bg-transparent hover:bg-white/[0.05] border border-white/[0.1] text-[#9EA8C4] hover:text-[#F2F4FB] font-mono text-xs flex items-center gap-1.5 transition-all"
            >
              <Github className="w-3.5 h-3.5 text-[#98F5E1]" />
              <span>GitHub</span>
            </a>

            <a
              href={profile.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onSoundClick}
              className="min-h-[42px] px-3.5 py-2 rounded-lg bg-transparent hover:bg-white/[0.05] border border-white/[0.1] text-[#9EA8C4] hover:text-[#F2F4FB] font-mono text-xs flex items-center gap-1.5 transition-all"
            >
              <Linkedin className="w-3.5 h-3.5 text-[#A5E8FF]" />
              <span>LinkedIn</span>
            </a>
          </div>
        </div>

        {/* Two-Column Executive Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
          {/* Left 7 Columns: Selected Builds + Experience & Education */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <h2 className="font-mythic text-[11px] font-bold text-[#E6C999] tracking-[0.18em] mb-3">
                SELECTED SYSTEMS ({projects.length})
              </h2>
              <div className="space-y-2.5">
                {projects.slice(0, 5).map((proj) => (
                  <div
                    key={proj.id}
                    className="rounded-xl bg-[#070A13]/85 border border-white/[0.07] p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-space font-bold text-sm text-[#F2F4FB]">
                          {proj.name}
                        </span>
                        <span className="font-mono text-[10px] text-[#A5E8FF]">
                          {proj.stack.slice(0, 3).join(" · ")}
                        </span>
                      </div>
                      <p className="text-xs text-[#9EA8C4] leading-snug">
                        {proj.impactSummary}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 font-mono text-[11px]">
                      <a
                        href={proj.liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={onSoundClick}
                        className="px-2.5 py-1.5 rounded-lg bg-[#98F5E1]/10 border border-[#98F5E1]/35 text-[#98F5E1] hover:bg-[#98F5E1]/18 inline-flex items-center gap-1"
                      >
                        <span>Live</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <a
                        href={proj.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={onSoundClick}
                        className="px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.1] text-[#F2F4FB] hover:border-[#C7B8FF]/50 inline-flex items-center gap-1"
                      >
                        <span>Code</span>
                        <Github className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-xl bg-[#070A13]/85 border border-white/[0.07] p-4 space-y-2">
                <div className="flex items-center gap-2 text-[#E6C999] font-mythic text-[10px] tracking-[0.16em]">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>INTERNSHIP</span>
                </div>
                {experience.map((exp) => (
                  <div key={exp.company} className="space-y-1">
                    <p className="font-space font-bold text-sm text-[#F2F4FB]">
                      {exp.company} — {exp.role}
                    </p>
                    <p className="text-xs text-[#9EA8C4] leading-relaxed">
                      {exp.highlights[0]}
                    </p>
                  </div>
                ))}
              </div>

              <div className="rounded-xl bg-[#070A13]/85 border border-white/[0.07] p-4 space-y-2">
                <div className="flex items-center gap-2 text-[#C7B8FF] font-mythic text-[10px] tracking-[0.16em]">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>EDUCATION</span>
                </div>
                <p className="font-space font-bold text-sm text-[#F2F4FB]">
                  {education[0].degree}
                </p>
                <p className="font-mono text-xs text-[#98F5E1]">
                  {education[0].score} · {education[0].duration}
                </p>
                <p className="text-xs text-[#9EA8C4]">{education[0].institution}</p>
              </div>
            </div>
          </div>

          {/* Right 5 Columns: Stack, Competitive Coding, Honors & Certs */}
          <div className="lg:col-span-5 space-y-5">
            <div className="rounded-xl bg-[#070A13]/85 border border-white/[0.07] p-4 space-y-2.5">
              <h2 className="font-mythic text-[10px] font-bold text-[#A5E8FF] tracking-[0.18em]">
                CORE TECHNICAL STACK
              </h2>
              <p className="text-xs font-mono text-[#F2F4FB] leading-relaxed">
                {coreSkills.join(" · ")}
              </p>
            </div>

            <div className="rounded-xl bg-[#070A13]/85 border border-white/[0.07] p-4 space-y-2.5">
              <div className="flex items-center gap-2 font-mythic text-[10px] font-bold text-[#98F5E1] tracking-[0.16em]">
                <Code2 className="w-3.5 h-3.5" />
                <span>DSA PROFILES (360+ SOLVED)</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {codingProfiles.map((cp) => (
                  <a
                    key={cp.id}
                    href={cp.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={onSoundClick}
                    className="rounded-lg bg-[#0B0F1C] border border-white/[0.08] hover:border-[#98F5E1]/45 px-2.5 py-2 flex items-center justify-between text-xs font-mono transition-colors"
                  >
                    <span className="text-[#F2F4FB] truncate">{cp.name}</span>
                    <span className="text-[#98F5E1] font-bold shrink-0">{cp.solved}</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-[#070A13]/85 border border-white/[0.07] p-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 font-mythic text-[10px] font-bold text-[#E6C999] tracking-[0.16em]">
                  <Award className="w-3.5 h-3.5" />
                  <span>HONORS &amp; CREDENTIALS</span>
                </div>
                <a
                  href={profile.links.certificateVaultUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onSoundClick}
                  className="text-[11px] font-mono text-[#E6C999] hover:underline inline-flex items-center gap-1"
                >
                  <FolderCheck className="w-3 h-3" />
                  <span>Drive Vault</span>
                </a>
              </div>

              <ul className="space-y-1.5 text-xs text-[#9EA8C4]">
                {achievements.slice(0, 3).map((ach) => (
                  <li key={ach.id} className="flex items-start justify-between gap-2">
                    <span className="text-[#F2F4FB] font-medium">{ach.title}</span>
                    <a
                      href={ach.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#98F5E1] font-mono text-[10px] shrink-0 hover:underline"
                    >
                      Verify ↗
                    </a>
                  </li>
                ))}
                {certifications.slice(0, 3).map((cert) => (
                  <li key={cert.id} className="flex items-start justify-between gap-2">
                    <span>
                      {cert.name} ({cert.issuer})
                    </span>
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#A5E8FF] font-mono text-[10px] shrink-0 hover:underline"
                    >
                      Cert ↗
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
