import React, { useEffect } from "react";
import { X, ExternalLink, Github, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ProjectLevel } from "../data/portfolioData";

interface MissionBriefingModalProps {
  project: ProjectLevel | null;
  onClose: () => void;
  onLinkClick: () => void;
}

export default function MissionBriefingModal({
  project,
  onClose,
  onLinkClick,
}: MissionBriefingModalProps) {
  useEffect(() => {
    if (!project) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="codex-dossier-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#03050A]/86 backdrop-blur-md overflow-y-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl bg-[#0B0F1C] border border-white/[0.12] shadow-[0_30px_90px_rgba(0,0,0,0.9)] overflow-hidden"
          >
            {/* Dossier Header */}
            <div className="px-5 sm:px-7 py-5 bg-[#070A13] border-b border-white/[0.08] flex items-start justify-between gap-4">
              <div className="space-y-1.5 min-w-0 text-left">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-mono text-[#9EA8C4]">
                  <span
                    className="font-serif text-sm font-bold"
                    style={{ color: project.accentColor }}
                  >
                    {project.rune}
                  </span>
                  <span
                    className="font-mythic tracking-[0.18em]"
                    style={{ color: project.accentColor }}
                  >
                    {project.realmCode} · CHRONICLE DOSSIER
                  </span>
                  <span aria-hidden="true" className="text-white/20">
                    ·
                  </span>
                  <span>{project.category}</span>
                </div>
                <h2
                  id="codex-dossier-title"
                  className="font-mythic text-xl sm:text-2xl font-bold text-[#F2F4FB] tracking-[0.05em] leading-tight"
                >
                  {project.title}
                </h2>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close chronicle dossier"
                className="min-w-[40px] min-h-[40px] rounded-lg bg-white/[0.04] hover:bg-white/[0.09] border border-white/[0.1] text-[#9EA8C4] hover:text-[#F2F4FB] flex items-center justify-center transition-colors shrink-0 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable 3-Beat Authoritative Chronicle */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 text-left">
              {/* BEAT I: THE CRISIS */}
              <div className="space-y-2">
                <h3 className="font-mythic text-[11px] font-semibold tracking-[0.2em] text-[#E6C999]">
                  I. THE CRISIS
                </h3>
                <p className="text-sm sm:text-[15px] text-[#F2F4FB] leading-relaxed">
                  {project.codex.crisis}
                </p>
                <p className="text-xs sm:text-sm text-[#9EA8C4] leading-relaxed">
                  {project.problemSolved}
                </p>
              </div>

              <div className="h-px bg-white/[0.07]" />

              {/* BEAT II: THE ARCHITECTURE */}
              <div className="space-y-3">
                <h3 className="font-mythic text-[11px] font-semibold tracking-[0.2em] text-[#A5E8FF]">
                  II. THE ARCHITECTURE
                </h3>
                <p className="text-sm sm:text-[15px] text-[#C8D1E8] leading-relaxed">
                  {project.codex.forge}
                </p>

                <ul className="space-y-2 pt-1">
                  {project.highlights.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-xs sm:text-sm text-[#C8D1E8] leading-relaxed"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#98F5E1] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <p className="font-mono text-xs text-[#A5E8FF] pt-1">
                  <span className="text-[#6E7896] mr-2">Tech Specs:</span>
                  {project.stack.join(" · ")}
                </p>
              </div>

              <div className="h-px bg-white/[0.07]" />

              {/* BEAT III: THE IMPACT */}
              <div className="space-y-3">
                <h3 className="font-mythic text-[11px] font-semibold tracking-[0.2em] text-[#98F5E1]">
                  III. THE IMPACT
                </h3>
                <p className="text-sm sm:text-[15px] text-[#F2F4FB] leading-relaxed">
                  {project.codex.legacy}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {project.metrics.map((metric, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl bg-[#070A13]/90 border border-white/[0.08] px-3 py-2.5 text-xs font-mono text-[#E6C999] leading-snug tabular-nums"
                    >
                      {metric}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Action Buttons */}
            <div className="px-5 sm:px-7 py-4 bg-[#070A13] border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2.5">
                <a
                  href={project.liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onLinkClick}
                  className="min-h-[44px] px-5 py-2.5 rounded-lg bg-[#E6C999] hover:bg-[#f0dab4] text-[#06080E] font-mythic text-[10.5px] font-bold tracking-[0.14em] inline-flex items-center gap-2 transition-all active:scale-[0.98]"
                >
                  <span>OPEN LIVE DEMO</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onLinkClick}
                  className="min-h-[44px] px-4 py-2.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.12] text-[#F2F4FB] font-mono text-xs inline-flex items-center gap-2 transition-all active:scale-[0.98]"
                >
                  <Github className="w-4 h-4 text-[#C7B8FF]" />
                  <span>Source on GitHub</span>
                </a>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="min-h-[40px] px-4 py-2 rounded-lg border border-white/[0.09] hover:bg-white/[0.05] text-xs font-mono text-[#9EA8C4] hover:text-[#F2F4FB] cursor-pointer"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
