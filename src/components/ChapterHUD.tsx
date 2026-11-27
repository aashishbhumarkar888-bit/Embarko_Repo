import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Compass, Shield, Terminal, Cpu, Layers, Bookmark, Award, MessageSquare, Briefcase, Mail } from "lucide-react";

interface Chapter {
  id: string;
  number: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
}

interface ChapterHUDProps {
  activeSection: string;
}

export default function ChapterHUD({ activeSection }: ChapterHUDProps) {
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
  const [showNotification, setShowNotification] = useState(false);

  const chapters: Chapter[] = [
    {
      id: "hero",
      number: "01",
      title: "Identity",
      description: "Aashish Bhumarkar Core System",
      icon: Terminal,
    },
    {
      id: "origin",
      number: "02",
      title: "Vision",
      description: "Interactive Development Journey",
      icon: Compass,
    },
    {
      id: "skills",
      number: "03",
      title: "Engineering",
      description: "Cognitive Skill Constellation",
      icon: Cpu,
    },
    {
      id: "projects",
      number: "04",
      title: "Projects",
      description: "Distributed Software Solutions",
      icon: Layers,
    },
    {
      id: "credentials",
      number: "05",
      title: "Experience",
      description: "Academic & Professional Proofs",
      icon: Bookmark,
    },
    {
      id: "coding-profiles",
      number: "06",
      title: "Achievements",
      description: "Competitive Coding Footprint",
      icon: Award,
    },
    {
      id: "mentor",
      number: "07",
      title: "AI Copilot",
      description: "Virtual Career Assistant Orb",
      icon: MessageSquare,
    },
    {
      id: "hire-me",
      number: "08",
      title: "Hire Me",
      description: "Intelligent Collaboration Hub",
      icon: Briefcase,
    },
    {
      id: "contact",
      number: "09",
      title: "Contact",
      description: "Secure Signal Bridge",
      icon: Mail,
    },
  ];

  // Whenever active section changes, find the chapter and trigger a beautiful brief HUD alert
  useEffect(() => {
    const chapter = chapters.find((ch) => ch.id === activeSection);
    if (chapter) {
      setCurrentChapter(chapter);
      setShowNotification(true);
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [activeSection]);

  if (!currentChapter) return null;

  return (
    <>
      {/* 1. Left-Side Desktop Fixed Chapter HUD Dock */}
      <div className="fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-center gap-4 bg-black/40 border border-white/5 p-4 rounded-full backdrop-blur-md shadow-2xl">
        <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-[0.2em] [writing-mode:vertical-lr] rotate-185 mb-2 select-none">
          OS Sequence
        </div>
        
        {/* Dynamic active chapter list indicator */}
        <div className="flex flex-col items-center gap-3 relative">
          {chapters.map((ch, idx) => {
            const isActive = ch.id === activeSection;
            const Icon = ch.icon;

            return (
              <button
                key={ch.id}
                onClick={() => {
                  document.getElementById(ch.id)?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`relative group p-2 rounded-full transition-all duration-300 cursor-pointer ${
                  isActive 
                    ? "bg-[#f97316]/20 border border-[#f97316] text-[#f97316] scale-110 shadow-[0_0_12px_rgba(249,115,22,0.3)]" 
                    : "bg-zinc-950/60 border border-white/5 text-zinc-500 hover:text-white"
                }`}
                title={`Chapter ${ch.number}: ${ch.title}`}
              >
                <Icon className="w-3.5 h-3.5" />
                
                {/* Floating tooltip */}
                <div className="absolute left-10 top-1/2 -translate-y-1/2 ml-2 px-3 py-1.5 bg-zinc-950/95 border border-white/10 rounded-lg text-[10px] font-mono uppercase tracking-wider text-white opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-xl z-50">
                  <span className="text-[#f97316] font-bold mr-1.5">CH {ch.number}</span>
                  {ch.title}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Beautiful Floating Brief HUD Chapter Notification Alert */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, x: -50, y: 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -30, filter: "blur(4px)" }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="fixed bottom-20 left-4 md:left-8 z-[9999] max-w-sm pointer-events-none"
          >
            <div className="bg-zinc-950/95 border-l-4 border-[#f97316] border-t border-r border-b border-white/10 p-4 rounded-xl shadow-2xl backdrop-blur-md flex items-center gap-4 relative overflow-hidden">
              {/* Circuit backdrop accent */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:1rem] opacity-30 pointer-events-none" />
              
              <div className="p-2.5 bg-[#f97316]/10 rounded-xl border border-[#f97316]/20 text-[#f97316]">
                <currentChapter.icon className="w-5 h-5 animate-pulse" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">CHAPTER {currentChapter.number}</span>
                  <span className="w-1 h-1 rounded-full bg-[#f97316]" />
                  <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest animate-pulse">Core Loaded</span>
                </div>
                <h4 className="text-sm font-space font-black text-white uppercase tracking-tight">
                  {currentChapter.title}
                </h4>
                <p className="text-[10px] font-mono text-zinc-400">
                  {currentChapter.description}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
