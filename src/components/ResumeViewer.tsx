import React, { useState, useEffect } from "react";
import {
  Download,
  Copy,
  Check,
  ExternalLink,
  X,
  Printer,
  FolderCheck,
} from "lucide-react";
import { PORTFOLIO_DATA } from "../data/portfolioData";

interface ResumeViewerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ResumeViewer({ isOpen, onClose }: ResumeViewerProps) {
  const [copied, setCopied] = useState(false);

  const {
    profile,
    codingProfiles,
    projects,
    skillGroups,
    experience,
    education,
    achievements,
    certifications,
  } = PORTFOLIO_DATA;

  const driveUrl = profile.links.resumeDriveUrl;

  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    const textResume = [
      profile.name.toUpperCase(),
      profile.roleTitle.toUpperCase(),
      `Email: ${profile.email} | Phone: ${profile.phone} | Location: ${profile.location}`,
      `GitHub: ${profile.links.github} | LinkedIn: ${profile.links.linkedin}`,
      `Google Drive Resume: ${driveUrl}`,
      "",
      "SUMMARY:",
      profile.bio,
      "",
      "EDUCATION:",
      ...education.map((e) => `• ${e.degree} — ${e.institution} (${e.duration}) | ${e.score}`),
      "",
      "COMPETITIVE CODING PROFILES:",
      ...codingProfiles.map((c) => `• ${c.name}: ${c.solved} Solved (${c.url})`),
      "",
      "SKILLS:",
      ...skillGroups.map((g) => `• ${g.title}: ${g.skills.map((s) => s.name).join(", ")}`),
      "",
      "PROJECTS:",
      ...projects.slice(0, 4).map(
        (p, idx) =>
          `${idx + 1}. ${p.name} (${p.stack.join(", ")})\n   • ${p.description}\n   • Live: ${p.liveLink} | GitHub: ${p.github}`
      ),
      "",
      "EXPERIENCE:",
      ...experience.map(
        (exp) => `• ${exp.company} — ${exp.role}\n  - ${exp.highlights.join("\n  - ")}`
      ),
      "",
      "ACHIEVEMENTS & CERTIFICATIONS:",
      ...achievements.slice(0, 4).map((a) => `• ${a.title} (${a.organization})`),
      ...certifications.slice(0, 4).map((c) => `• ${c.name} — ${c.issuer}`),
    ].join("\n");

    navigator.clipboard.writeText(textResume).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  return (
    <div
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Aashish Bhumarkar Official Resume"
      className="fixed inset-0 z-[75] flex items-center justify-center p-3 sm:p-6 bg-[#04060C]/85 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white print:static print:overflow-visible"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#111526] border border-[#C8B6FF]/35 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col print:border-0 print:bg-white print:shadow-none print:max-h-none print:rounded-none"
      >
        {/* Top Action Controls */}
        <div className="flex flex-wrap justify-between items-center px-4 sm:px-6 py-3.5 bg-[#070A13] border-b border-white/[0.08] print:hidden gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <FolderCheck className="w-4 h-4 text-[#E6C999] shrink-0" />
            <h3 className="font-mythic font-bold text-xs sm:text-sm tracking-[0.08em] text-[#F2F4FB] truncate">
              {profile.name} — Official CV
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href={driveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[38px] px-3.5 py-1.5 bg-[#E6C999] hover:bg-[#f0dab4] text-[#06080E] font-mythic font-bold text-[10px] tracking-[0.12em] rounded-lg transition-all flex items-center gap-1.5 active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>DOWNLOAD (DRIVE)</span>
            </a>

            <button
              type="button"
              onClick={handlePrint}
              className="min-h-[38px] px-3 py-1.5 bg-[#161B30] hover:bg-[#1E2542] text-[#EDF1FF] font-mono text-xs rounded-xl transition-all flex items-center gap-1.5 border border-white/10 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-[#C8B6FF]" />
              <span>Print / PDF</span>
            </button>

            <button
              type="button"
              onClick={handleCopyText}
              className="min-h-[38px] px-3 py-1.5 bg-[#161B30] hover:bg-[#1E2542] text-[#EDF1FF] font-mono text-xs rounded-xl transition-all flex items-center gap-1.5 border border-white/10 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#98F5E1]" />
                  <span className="text-[#98F5E1]">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#90DBF4]" />
                  <span>Copy ATS</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close resume preview"
              className="min-w-[38px] min-h-[38px] bg-[#161B30] hover:bg-[#1E2542] text-[#A6B0CF] hover:text-[#EDF1FF] rounded-xl transition-all border border-white/10 flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Resume Sheet */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#090B14] text-[#EDF1FF] print:bg-white print:text-black print:p-0">
          <div className="max-w-3xl mx-auto space-y-5 text-left bg-[#111526]/90 p-5 sm:p-8 rounded-2xl border border-white/10 print:bg-white print:border-0 print:p-0">
            {/* Header */}
            <div className="border-b border-white/15 pb-4 text-center space-y-1.5 print:border-zinc-300">
              <h1 className="text-2xl sm:text-3xl font-space font-bold tracking-tight text-[#EDF1FF] print:text-black">
                {profile.name.toUpperCase()}
              </h1>
              <p className="text-xs font-mono tracking-wider text-[#98F5E1] font-semibold uppercase print:text-zinc-800">
                {profile.roleTitle}
              </p>
              <p className="text-[11px] font-mono text-[#A6B0CF] print:text-zinc-700 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1">
                <a href={`mailto:${profile.email}`} className="hover:underline">
                  {profile.email}
                </a>
                <span>·</span>
                <span>{profile.phone}</span>
                <span>·</span>
                <a
                  href={profile.links.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#90DBF4] hover:underline print:text-black"
                >
                  LinkedIn
                </a>
                <span>·</span>
                <a
                  href={profile.links.github}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#C8B6FF] hover:underline print:text-black"
                >
                  GitHub
                </a>
              </p>
            </div>

            {/* Summary */}
            <div className="space-y-1.5">
              <h2 className="text-xs font-space font-bold uppercase tracking-wider text-[#C8B6FF] print:text-black border-b border-white/10 pb-1 print:border-zinc-300">
                Career Objective
              </h2>
              <p className="text-xs text-[#D6DDF5] print:text-zinc-800 leading-relaxed">
                {profile.bio}
              </p>
            </div>

            {/* Education */}
            <div className="space-y-2">
              <h2 className="text-xs font-space font-bold uppercase tracking-wider text-[#C8B6FF] print:text-black border-b border-white/10 pb-1 print:border-zinc-300">
                Education
              </h2>
              <div className="space-y-2 text-xs">
                {education.map((edu, i) => (
                  <div key={i} className="flex flex-wrap justify-between items-start gap-2">
                    <div>
                      <p className="font-bold text-[#EDF1FF] print:text-black">
                        {edu.institution}
                      </p>
                      <p className="text-[#A6B0CF] print:text-zinc-700 font-mono text-[11px]">
                        {edu.degree} · {edu.duration}
                      </p>
                    </div>
                    <p className="font-mono font-bold text-[#FFD6A5] print:text-black">
                      {edu.score}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Competitive Coding */}
            <div className="space-y-2">
              <h2 className="text-xs font-space font-bold uppercase tracking-wider text-[#C8B6FF] print:text-black border-b border-white/10 pb-1 print:border-zinc-300">
                Competitive Programming
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                {codingProfiles.map((cp) => (
                  <div
                    key={cp.id}
                    className="p-2 rounded-lg bg-[#090B14]/70 border border-white/8 flex justify-between items-center print:bg-transparent print:border-zinc-300"
                  >
                    <span>
                      <strong className="text-[#98F5E1] print:text-black">{cp.name}:</strong>{" "}
                      {cp.solved} Solved
                    </span>
                    <a
                      href={cp.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#90DBF4] hover:underline inline-flex items-center gap-1 print:text-black"
                    >
                      <span>@{cp.handle}</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-1.5">
              <h2 className="text-xs font-space font-bold uppercase tracking-wider text-[#C8B6FF] print:text-black border-b border-white/10 pb-1 print:border-zinc-300">
                Technical Skills
              </h2>
              <div className="space-y-1 text-xs font-mono">
                {skillGroups.map((group) => (
                  <p key={group.id}>
                    <span className="text-[#A6B0CF] print:text-zinc-700 font-semibold">
                      {group.title}:{" "}
                    </span>
                    <span className="text-[#EDF1FF] print:text-black">
                      {group.skills.map((s) => s.name).join(", ")}
                    </span>
                  </p>
                ))}
              </div>
            </div>

            {/* Top Projects */}
            <div className="space-y-2.5">
              <h2 className="text-xs font-space font-bold uppercase tracking-wider text-[#C8B6FF] print:text-black border-b border-white/10 pb-1 print:border-zinc-300">
                Featured Projects
              </h2>
              <div className="space-y-3 text-xs">
                {projects.slice(0, 4).map((p) => (
                  <div key={p.id} className="space-y-1">
                    <div className="flex flex-wrap justify-between items-baseline gap-1">
                      <h3 className="font-bold text-[#EDF1FF] print:text-black text-sm">
                        {p.name}{" "}
                        <span className="font-normal text-[#A6B0CF] print:text-zinc-600 font-mono text-[11px]">
                          | {p.stack.join(", ")}
                        </span>
                      </h3>
                      <div className="flex gap-2 font-mono text-[11px]">
                        <a
                          href={p.liveLink}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#98F5E1] hover:underline print:text-black"
                        >
                          [Live]
                        </a>
                        <a
                          href={p.github}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#C8B6FF] hover:underline print:text-black"
                        >
                          [GitHub]
                        </a>
                      </div>
                    </div>
                    <ul className="text-[#D6DDF5] print:text-zinc-800 space-y-0.5 list-disc pl-4 leading-relaxed">
                      {p.highlights.slice(0, 2).map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div className="space-y-2">
              <h2 className="text-xs font-space font-bold uppercase tracking-wider text-[#C8B6FF] print:text-black border-b border-white/10 pb-1 print:border-zinc-300">
                Internship Experience
              </h2>
              {experience.map((exp) => (
                <div key={exp.company} className="space-y-1 text-xs">
                  <p className="font-bold text-[#EDF1FF] print:text-black">
                    {exp.company}{" "}
                    <span className="font-normal text-[#A6B0CF] print:text-zinc-600">
                      | {exp.role}
                    </span>
                  </p>
                  <ul className="text-[#D6DDF5] print:text-zinc-800 space-y-0.5 list-disc pl-4 leading-relaxed">
                    {exp.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Achievements & Certifications */}
            <div className="space-y-1.5">
              <h2 className="text-xs font-space font-bold uppercase tracking-wider text-[#C8B6FF] print:text-black border-b border-white/10 pb-1 print:border-zinc-300">
                Achievements & Certifications
              </h2>
              <ul className="text-xs text-[#D6DDF5] print:text-zinc-800 space-y-1 list-disc pl-4">
                {achievements.slice(0, 4).map((a) => (
                  <li key={a.id}>
                    <strong>{a.title}</strong> — {a.organization}
                  </li>
                ))}
                {certifications.slice(0, 4).map((c) => (
                  <li key={c.id}>
                    <strong>{c.name}</strong> — {c.issuer}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
