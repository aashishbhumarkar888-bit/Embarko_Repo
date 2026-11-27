import React from "react";
import { X, Github, ExternalLink, Shield, Zap, Layers, Cpu, CheckCircle2, TrendingUp } from "lucide-react";
import { Project } from "../types";

interface ProjectDetailsPopupProps {
  isOpen: boolean;
  project: Project | null;
  onClose: () => void;
}

export default function ProjectDetailsPopup({ isOpen, project, onClose }: ProjectDetailsPopupProps) {
  if (!isOpen || !project) return null;

  const isVoltPath = project.id === "voltpath-ai";
  const isSecureFill = project.id === "secure-fill";
  const isGraveVault = project.id === "grave-vault";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="bg-[#0a0a0e] border-2 border-orange-500/40 rounded-3xl w-full max-w-2xl shadow-2xl relative overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Animated Background Gradients */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Close Floating Cross */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-zinc-950/80 border border-white/5 hover:border-white/20 text-zinc-400 hover:text-white rounded-xl transition-all cursor-pointer"
          aria-label="Close project modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Scrollable Container */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* Header section */}
          <div className="text-left space-y-2 mt-2">
            <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-orange-400 font-black">
              {isVoltPath && <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-500/20" />}
              {isSecureFill && <Shield className="w-3.5 h-3.5 text-red-400 fill-red-500/20" />}
              {isGraveVault && <Layers className="w-3.5 h-3.5 text-purple-400 fill-purple-500/20" />}
              Blueprint Unlocked // Project Details
            </div>
            <h3 className="text-2xl sm:text-3xl font-space font-black text-white">
              {project.name}
            </h3>
            <p className="text-orange-400/90 font-mono text-[10px] tracking-wider uppercase font-extrabold">
              {project.category || "Advanced Enterprise Project"}
            </p>
          </div>

          {/* Impact Metric Banner */}
          {project.impactMetric && (
            <div className="p-3 bg-orange-950/30 border border-orange-500/30 rounded-xl flex items-center gap-2.5 text-left">
              <TrendingUp className="w-4 h-4 text-orange-400 shrink-0" />
              <p className="text-xs font-mono text-amber-200 font-bold">
                {project.impactMetric}
              </p>
            </div>
          )}

          {/* Strict STAR Framework Card if present */}
          {project.starFramework && (
            <div className="bg-zinc-950/90 border border-orange-500/20 rounded-2xl p-4 text-left space-y-3">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-[10px] font-mono text-orange-400 font-black uppercase tracking-widest flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  STAR Framework (Situation, Task, Action, Result)
                </span>
                <span className="text-[9px] font-mono text-zinc-500 uppercase">Recruiter Format</span>
              </div>

              <div className="space-y-2 text-xs font-jakarta">
                <p className="text-zinc-300 leading-relaxed">
                  <strong className="text-orange-400 font-mono">[Situation]:</strong> {project.starFramework.situation}
                </p>
                <p className="text-zinc-300 leading-relaxed">
                  <strong className="text-amber-400 font-mono">[Task]:</strong> {project.starFramework.task}
                </p>
                <p className="text-zinc-300 leading-relaxed">
                  <strong className="text-blue-400 font-mono">[Action]:</strong> {project.starFramework.action}
                </p>
                <p className="text-emerald-300 leading-relaxed font-semibold">
                  <strong className="text-emerald-400 font-mono">[Result]:</strong> {project.starFramework.result}
                </p>
              </div>

              {project.starFramework.metrics && project.starFramework.metrics.length > 0 && (
                <div className="pt-2 border-t border-white/5 flex flex-wrap gap-1.5">
                  {project.starFramework.metrics.map((metric, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-black/60 border border-emerald-500/20 text-emerald-300 font-mono text-[9px] rounded-md">
                      ✓ {metric}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Description Panel */}
          <div className="bg-[#0d0d12] border border-white/5 p-4 rounded-2xl text-left space-y-2 break-words hyphens-auto">
            <h4 className="text-[10px] font-mono uppercase text-zinc-500 tracking-widest">PROJECT ABSTRACT:</h4>
            <p className="text-zinc-200 text-xs sm:text-sm leading-relaxed font-jakarta break-words hyphens-auto">
              {project.description}
            </p>
          </div>

          {/* Detailed Specifications of "How it was made" */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="bg-zinc-950 p-4 rounded-xl border border-white/5 space-y-1.5 break-words hyphens-auto">
              <h5 className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-1">
                <Cpu className="w-3 h-3 text-orange-400" /> The Problem Solved
              </h5>
              <p className="text-[11px] text-[#A1A1AA] leading-relaxed font-jakarta break-words hyphens-auto">
                {project.problemSolved}
              </p>
            </div>

            <div className="bg-zinc-950 p-4 rounded-xl border border-white/5 space-y-1.5 break-words hyphens-auto">
              <h5 className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-1">
                <Layers className="w-3 h-3 text-orange-400" /> Key Features & Capabilities
              </h5>
              <ul className="text-[11px] text-[#A1A1AA] space-y-1 pl-1 break-words hyphens-auto">
                {project.keyFeatures.map((kf, idx) => (
                  <li key={idx} className="flex items-start gap-1">
                    <span className="text-orange-500 font-bold">•</span>
                    <span>{kf}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Full Technical Stack Badge collection */}
          <div className="space-y-2 text-left">
            <h4 className="text-[10px] font-mono uppercase text-zinc-500 tracking-widest">TECHNOLOGY ARSENAL:</h4>
            <div className="flex flex-wrap gap-2">
              {project.stack.map((item) => (
                <span
                  key={item}
                  className="px-3 py-1 bg-zinc-900 border border-white/5 hover:border-orange-500/20 text-xs text-zinc-300 font-mono rounded-lg transition-all"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Hyperlinks row */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2 border-t border-white/5">
            <a
              href={project.github || "https://github.com/aashishbhumarkar888-bit"}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-zinc-900 hover:bg-zinc-850 border border-white/10 text-zinc-200 text-xs font-mono rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:border-orange-500/30"
            >
              <Github className="w-4 h-4 text-zinc-400" /> View GitHub Repository
            </a>
            {project.liveLink && (
              <a
                href={project.liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-500 text-black text-xs font-space font-extrabold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(249,115,22,0.25)] hover:brightness-110 active:scale-95 cursor-pointer"
              >
                Launch Live Deployment <ExternalLink className="w-4 h-4 text-black" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
