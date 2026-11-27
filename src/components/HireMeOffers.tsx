import React from "react";
import { Sparkles, Code, Layers, Clock, ShieldCheck } from "lucide-react";

export default function HireMeOffers() {
  const offerings = [
    {
      title: "AI & LLM Integration",
      icon: <Sparkles className="w-5 h-5 text-purple-400" />,
      description: "Secure LLM integration (Gemini, Claude), structured prompt engineering, and intelligent agents.",
      tech: ["Gemini API", "Python", "Prompt Engineering", "AI Agents"]
    },
    {
      title: "Full-Stack Web Engineering",
      icon: <Code className="w-5 h-5 text-orange-400" />,
      description: "End-to-end web applications with performant Express/Node APIs and responsive React/Next.js interfaces.",
      tech: ["React.js", "TypeScript", "Node.js", "Express", "Tailwind CSS"]
    },
    {
      title: "Modern UI/UX & Systems",
      icon: <Layers className="w-5 h-5 text-emerald-400" />,
      description: "Accessible design systems, high-contrast typography, interactive components, and fluid animations.",
      tech: ["Tailwind CSS", "Figma", "Design Systems", "Motion"]
    }
  ];

  return (
    <div className="w-full space-y-8">
      {/* Availability Status Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-2xl flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <div>
            <p className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-extrabold">Status</p>
            <p className="text-white text-xs font-bold font-jakarta">Open for Opportunities</p>
          </div>
        </div>

        <div className="p-4 bg-orange-950/20 border border-orange-500/20 rounded-2xl flex items-center gap-3">
          <Clock className="w-5 h-5 text-orange-400 animate-pulse" />
          <div>
            <p className="text-[10px] font-mono text-orange-400 uppercase tracking-widest font-extrabold">Response Time</p>
            <p className="text-white text-xs font-bold font-jakarta">Within 12 Hours</p>
          </div>
        </div>

        <div className="p-4 bg-zinc-900/40 border border-white/5 rounded-2xl flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-zinc-400" />
          <div>
            <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-extrabold">Terms</p>
            <p className="text-white text-xs font-bold font-jakarta">Milestone Based & Transparent</p>
          </div>
        </div>
      </div>

      {/* Services List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {offerings.map(item => (
          <div
            key={item.title}
            className="p-6 bg-zinc-950/60 border border-white/5 rounded-2xl flex flex-col justify-between hover:border-orange-500/30 transition-all duration-300 relative overflow-hidden group shadow-sm"
          >
            <div className="space-y-3">
              <span className="p-2 bg-zinc-900 border border-white/5 rounded-xl inline-block group-hover:border-orange-500/20 transition-colors duration-300">
                {item.icon}
              </span>
              <h4 className="font-space font-black text-white text-base group-hover:text-orange-400 transition-colors duration-300">{item.title}</h4>
              <p className="text-zinc-400 text-xs leading-relaxed font-jakarta">
                {item.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-4 mt-4 border-t border-white/5">
              {item.tech.map(t => (
                <span key={t} className="text-[9px] font-mono bg-zinc-900 border border-white/5 px-2 py-0.5 rounded text-zinc-400">
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Instant Action CTA bar */}
      <div className="p-6 bg-zinc-950 border border-white/5 rounded-3xl flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="font-space font-black text-white text-base sm:text-lg">Have a project or internship opening?</h4>
          <p className="text-zinc-400 text-xs font-jakarta max-w-lg leading-relaxed">
            Reach out directly for full-stack, AI, or software development discussions.
          </p>
        </div>

        <button
          onClick={() => {
            const formElement = document.getElementById("contact");
            if (formElement) {
              formElement.scrollIntoView({ behavior: "smooth" });
              const subField = document.getElementById("subject") as HTMLInputElement;
              if (subField) {
                subField.value = "Software Engineering Opportunity";
              }
            }
          }}
          className="px-6 py-3 bg-white hover:bg-orange-500 text-zinc-950 hover:text-black font-bold font-space text-xs uppercase tracking-wider rounded-xl transition-all duration-300 shadow-md whitespace-nowrap"
          data-cursor-text="INQUIRE"
        >
          Get in Touch
        </button>
      </div>
    </div>
  );
}
