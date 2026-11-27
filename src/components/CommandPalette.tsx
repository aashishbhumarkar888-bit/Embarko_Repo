import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, Terminal, ShieldAlert, Zap, Compass, 
  Github, Cpu, MessageSquare, Briefcase, Award,
  X, FileText, Code2, Sparkles, Download,
  Linkedin, Globe, Activity, Flame
} from "lucide-react";
import { PROFILE_INFO } from "../data";

interface CommandItem {
  id: string;
  name: string;
  category: string;
  icon: React.ComponentType<any>;
  shortcut?: string;
  action: () => void;
}

interface CommandPaletteProps {
  onOpenResume: () => void;
  onFocusCopilot: () => void;
}

export default function CommandPalette({ onOpenResume, onFocusCopilot }: CommandPaletteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setSearch("");
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  const items: CommandItem[] = [
    {
      id: "projects",
      name: "View Projects Dashboard",
      category: "Navigation",
      icon: Code2,
      shortcut: "G P",
      action: () => {
        document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
        setIsOpen(false);
      }
    },
    {
      id: "resume",
      name: "Open Resume & Credentials",
      category: "Documents",
      icon: FileText,
      shortcut: "O R",
      action: () => {
        onOpenResume();
        setIsOpen(false);
      }
    },
    {
      id: "download-resume",
      name: "Download Resume (Google Drive Document)",
      category: "Documents",
      icon: Download,
      shortcut: "D L",
      action: () => {
        // Redirect directly to Google Drive link of the resume
        window.open(PROFILE_INFO.resumeDriveUrl, "_blank", "noopener,noreferrer");
        setIsOpen(false);
      }
    },
    {
      id: "skills",
      name: "Explore Skills Constellation",
      category: "Profile",
      icon: Cpu,
      shortcut: "G S",
      action: () => {
        document.getElementById("skills")?.scrollIntoView({ behavior: "smooth" });
        setIsOpen(false);
      }
    },
    {
      id: "github",
      name: "GitHub Profile",
      category: "External Links",
      icon: Github,
      action: () => {
        window.open("https://github.com/aashishbhumarkar888-bit", "_blank");
        setIsOpen(false);
      }
    },
    {
      id: "linkedin",
      name: "LinkedIn Network Profile",
      category: "External Links",
      icon: Linkedin,
      action: () => {
        window.open("https://www.linkedin.com/in/aashish-bhumarkar-866337330/", "_blank");
        setIsOpen(false);
      }
    },
    {
      id: "leetcode",
      name: "LeetCode Competitive Profile",
      category: "External Links",
      icon: Terminal,
      action: () => {
        window.open("https://leetcode.com/u/aashishbhumarkar888-bit/", "_blank");
        setIsOpen(false);
      }
    },
    {
      id: "tech-cpp",
      name: "Search Tech: C++ (Competitive & DSA)",
      category: "Technologies",
      icon: Code2,
      action: () => {
        document.getElementById("skills")?.scrollIntoView({ behavior: "smooth" });
        alert("Filtering skill database for C++ structures...");
        setIsOpen(false);
      }
    },
    {
      id: "tech-react",
      name: "Search Tech: React & TypeScript Applications",
      category: "Technologies",
      icon: Globe,
      action: () => {
        document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
        alert("Filtering projects built with React + TypeScript...");
        setIsOpen(false);
      }
    },
    {
      id: "tech-node",
      name: "Search Tech: Node.js & Express Backends",
      category: "Technologies",
      icon: Cpu,
      action: () => {
        document.getElementById("skills")?.scrollIntoView({ behavior: "smooth" });
        alert("Querying Node.js, Express & Database sync engines...");
        setIsOpen(false);
      }
    },
    {
      id: "animations",
      name: "Toggle System Animations (Performance mode)",
      category: "Preferences",
      icon: Activity,
      shortcut: "T A",
      action: () => {
        window.dispatchEvent(new CustomEvent("toggle-animations"));
        setIsOpen(false);
      }
    },
    {
      id: "hire-me",
      name: "Hire Me & Collaboration Offers",
      category: "Hiring",
      icon: Briefcase,
      shortcut: "H M",
      action: () => {
        document.getElementById("hire-me")?.scrollIntoView({ behavior: "smooth" });
        setIsOpen(false);
      }
    },
    {
      id: "contact",
      name: "Secure Contact Gateway",
      category: "Communication",
      icon: ShieldAlert,
      shortcut: "G C",
      action: () => {
        document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
        setIsOpen(false);
      }
    },
    {
      id: "timeline",
      name: "Origin Story & Education",
      category: "Profile",
      icon: Compass,
      shortcut: "G T",
      action: () => {
        document.getElementById("origin")?.scrollIntoView({ behavior: "smooth" });
        setIsOpen(false);
      }
    },
    {
      id: "copilot",
      name: "AI Copilot Terminal",
      category: "AI Engine",
      icon: MessageSquare,
      shortcut: "A I",
      action: () => {
        onFocusCopilot();
        setIsOpen(false);
      }
    }
  ];

  const filteredItems = items.filter(item => 
    item && typeof item.name === "string" && typeof item.category === "string" && (
      item.name.toLowerCase().includes((search || "").toLowerCase()) ||
      item.category.toLowerCase().includes((search || "").toLowerCase())
    )
  );

  const handleArrowKeys = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filteredItems.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
      }
    }
  };

  return (
    <>
      {/* Floating command palette status badge */}
      <div className="fixed bottom-4 left-4 z-50 hidden md:block">
        <button 
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-slate-100 dark:bg-black/80 dark:hover:bg-zinc-900 border border-slate-300 dark:border-white/10 rounded-lg text-[10px] font-mono uppercase text-slate-700 dark:text-zinc-400 tracking-wider transition-all duration-300 shadow-lg cursor-pointer"
        >
          <Terminal className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
          <span>OS Console</span>
          <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded text-[9px] text-slate-600 dark:text-zinc-400 font-sans">Ctrl + K</kbd>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[99999] flex items-start justify-center pt-[15vh] px-4">
            {/* Backdrop */}
            <motion.div 
              className="absolute inset-0 bg-black/60 dark:bg-black/75 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              ref={containerRef}
              className="relative w-full max-w-xl bg-white dark:bg-zinc-950/90 border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[60vh]"
              initial={{ scale: 0.95, opacity: 0, y: -20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: -20 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              onKeyDown={handleArrowKeys}
            >
              {/* Grid backdrop aesthetic */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:1rem_1rem] pointer-events-none" />

              {/* Input Area */}
              <div className="relative border-b border-slate-200 dark:border-white/5 p-4 flex items-center gap-3 bg-slate-50/50 dark:bg-transparent">
                <Search className="w-5 h-5 text-slate-400 dark:text-zinc-500 flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Type a command or search profile..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setSelectedIndex(0);
                  }}
                  className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 outline-none border-none font-sans"
                />
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-slate-200 dark:hover:bg-zinc-900 rounded-lg text-slate-400 dark:text-zinc-500 hover:text-slate-800 dark:hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Items Area */}
              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {filteredItems.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 dark:text-zinc-500 font-mono text-xs">
                    No results found for "{search}"
                  </div>
                ) : (
                  filteredItems.map((item, index) => {
                    const Icon = item.icon;
                    const isSelected = index === selectedIndex;
                    return (
                      <button
                        key={item.id}
                        onClick={item.action}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between transition-all duration-150 relative cursor-pointer ${
                          isSelected 
                            ? "bg-purple-50 dark:bg-[#8b5cf6]/10 border-l-2 border-[#8b5cf6] text-purple-900 dark:text-white pl-5" 
                            : "text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-900/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-1.5 rounded-lg ${
                            isSelected ? "bg-[#8b5cf6]/20 text-[#8b5cf6]" : "bg-slate-100 dark:bg-zinc-900 text-slate-500 dark:text-zinc-500"
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-mono font-medium">{item.name}</p>
                            <p className="text-[9px] font-mono text-slate-500 dark:text-zinc-600 uppercase tracking-widest">{item.category}</p>
                          </div>
                        </div>
                        {item.shortcut && (
                          <span className="text-[9px] font-mono text-slate-500 dark:text-zinc-600 border border-slate-300 dark:border-zinc-800 bg-slate-100 dark:bg-zinc-900 px-1.5 py-0.5 rounded uppercase">
                            {item.shortcut}
                          </span>
                        )}
                      </button>
                    );
                  })
                )}
              </div>

              {/* Footer status bar */}
              <div className="border-t border-slate-200 dark:border-white/5 px-4 py-3 bg-slate-50 dark:bg-black/40 flex justify-between items-center text-[10px] font-mono text-slate-500 dark:text-zinc-500">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
                  <span>Interactive Command Palette Terminal</span>
                </div>
                <div className="flex items-center gap-3">
                  <span><kbd className="border border-slate-300 dark:border-zinc-800 px-1 rounded">↑↓</kbd> Navigate</span>
                  <span><kbd className="border border-slate-300 dark:border-zinc-800 px-1 rounded">Enter</kbd> Action</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
