import React, { useState } from "react";
import { 
  Code2, 
  Layers, 
  Server, 
  Database, 
  Cpu, 
  GitBranch, 
  CheckCircle2, 
  Sparkles, 
  Terminal, 
  ExternalLink,
  Flame,
  Search,
  BookOpen
} from "lucide-react";

interface SkillItem {
  name: string;
  category: "Frontend" | "Backend" | "Languages & DSA" | "Workflow";
  badge: "Daily / Primary" | "Frequent" | "Active Practice" | "Coursework";
  badgeColor: string;
  role: string;
  description: string;
  built: string;
  projectLink?: string;
  isCoreStack: boolean;
}

export default function SkillConstellation() {
  const [activeFilter, setActiveFilter] = useState<string>("All Stack");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Primary 9-technology stack specified by candidate brief + clean CS fundamentals
  const skills: SkillItem[] = [
    // 1. Frontend Architecture
    {
      name: "React.js",
      category: "Frontend",
      badge: "Daily / Primary",
      badgeColor: "border-cyan-500/30 text-cyan-400 bg-cyan-500/10",
      role: "Component UI Engine",
      description: "Functional components, custom hooks, reactive state, context providers, and client routing.",
      built: "SPO farmer trade platform, VoltPath EV locator, and interactive portfolio interface",
      projectLink: "#projects",
      isCoreStack: true
    },
    {
      name: "TypeScript",
      category: "Frontend",
      badge: "Daily / Primary",
      badgeColor: "border-blue-500/30 text-blue-400 bg-blue-500/10",
      role: "Strict Type Safety",
      description: "Interface modeling, strict type checking, props contracts, and compile-time error elimination.",
      built: "SPO trade platform type contracts and Secure-Fill input validation models",
      projectLink: "#projects",
      isCoreStack: true
    },
    {
      name: "Tailwind CSS",
      category: "Frontend",
      badge: "Daily / Primary",
      badgeColor: "border-teal-500/30 text-teal-400 bg-teal-500/10",
      role: "Utility Design System",
      description: "Responsive layouts, flexbox, CSS grid, dark mode design tokens, and HUD interface elements.",
      built: "Full UI design systems for SPO, VoltPath, and cyberpunk terminal dashboard",
      projectLink: "#projects",
      isCoreStack: true
    },

    // 2. Backend & Cloud Infrastructure
    {
      name: "Node.js",
      category: "Backend",
      badge: "Daily / Primary",
      badgeColor: "border-emerald-500/30 text-emerald-400 bg-emerald-500/10",
      role: "Asynchronous Runtime",
      description: "Event-driven server runtime, filesystem streams, npm package ecosystem, and backend scripts.",
      built: "SPO trade calculation backend services and local development servers",
      projectLink: "#projects",
      isCoreStack: true
    },
    {
      name: "Express.js",
      category: "Backend",
      badge: "Frequent",
      badgeColor: "border-orange-500/30 text-orange-400 bg-orange-500/10",
      role: "REST API Framework",
      description: "Modular route controllers, middleware error handlers, JSON request sanitization, and CORS headers.",
      built: "Secure-Fill verification microservice and REST endpoints",
      projectLink: "#projects",
      isCoreStack: true
    },
    {
      name: "Firebase Firestore",
      category: "Backend",
      badge: "Frequent",
      badgeColor: "border-amber-500/30 text-amber-400 bg-amber-500/10",
      role: "Document Store & Realtime",
      description: "NoSQL document collections, real-time sync listeners, client SDK integration, and security rules.",
      built: "VoltPath EV station real-time slot state synchronization",
      projectLink: "#projects",
      isCoreStack: true
    },
    {
      name: "PostgreSQL & SQL",
      category: "Backend",
      badge: "Frequent",
      badgeColor: "border-sky-500/30 text-sky-400 bg-sky-500/10",
      role: "Relational Database",
      description: "Relational modeling, primary/foreign key integrity, multi-table joins, indexing, and 1NF–3NF normalization.",
      built: "Relational trade schemas and academic database query optimization benchmarks",
      isCoreStack: true
    },

    // 3. Languages & Core Problem Solving
    {
      name: "C++",
      category: "Languages & DSA",
      badge: "Daily / Primary",
      badgeColor: "border-blue-500/30 text-blue-400 bg-blue-500/10",
      role: "DSA & Algorithmic Problem Solving",
      description: "Standard Template Library (vector, map, set), pointer mechanics, time-complexity analysis, and memory efficiency.",
      built: "Solved 100+ LeetCode DSA problems and collegiate competitive programming submissions",
      projectLink: "#coding-profiles",
      isCoreStack: true
    },
    {
      name: "Data Structures & Algorithms",
      category: "Languages & DSA",
      badge: "Active Practice",
      badgeColor: "border-purple-500/30 text-purple-400 bg-purple-500/10",
      role: "Core Problem Solving",
      description: "Arrays, two pointers, sliding window, binary search, trees, graphs, sorting, and dynamic programming fundamentals.",
      built: "100+ verified DSA solutions on LeetCode across Easy and Medium challenges",
      projectLink: "#coding-profiles",
      isCoreStack: false
    },
    {
      name: "JavaScript (ES6+)",
      category: "Languages & DSA",
      badge: "Daily / Primary",
      badgeColor: "border-yellow-500/30 text-yellow-400 bg-yellow-500/10",
      role: "Full-Stack Scripting",
      description: "Async/await, promises, closures, destructuring, DOM events, and modern array manipulation methods.",
      built: "Client applications, async API consumers, and event pipelines",
      isCoreStack: false
    },

    // 4. Developer Tools & Workflow
    {
      name: "Git & GitHub",
      category: "Workflow",
      badge: "Daily / Primary",
      badgeColor: "border-orange-500/30 text-orange-400 bg-orange-500/10",
      role: "Version Control & Collaboration",
      description: "Branching strategies, atomic commits, pull requests, merge conflict resolution, and open source repository hosting.",
      built: "Maintains all project repositories, commits, and peer code reviews",
      projectLink: "https://github.com/aashishbhumarkar888-bit",
      isCoreStack: true
    },
    {
      name: "Vite & Tooling",
      category: "Workflow",
      badge: "Frequent",
      badgeColor: "border-indigo-500/30 text-indigo-400 bg-indigo-500/10",
      role: "Build & Bundling Engine",
      description: "Fast ESM development server, hot module reloading, optimized production builds, and environment configuration.",
      built: "Development pipeline and production bundling for web apps",
      isCoreStack: false
    }
  ];

  const categories = [
    { label: "All Stack", count: skills.length },
    { label: "Frontend", count: skills.filter(s => s.category === "Frontend").length },
    { label: "Backend", count: skills.filter(s => s.category === "Backend").length },
    { label: "Languages & DSA", count: skills.filter(s => s.category === "Languages & DSA").length },
    { label: "Workflow", count: skills.filter(s => s.category === "Workflow").length }
  ];

  const filteredSkills = skills.filter(skill => {
    const matchesCategory = activeFilter === "All Stack" || skill.category === activeFilter;
    const matchesSearch = 
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.built.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full space-y-8 text-left">
      {/* 1. TOP SPOTLIGHT: The Verified Core 9 Stack Rack */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#101018] to-[#07070c] border border-white/10 shadow-2xl overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-1/4 w-96 h-32 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-28 bg-[#8b5cf6]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 font-mono text-[10px] uppercase font-bold tracking-wider mb-2">
                <Sparkles className="w-3 h-3 text-orange-400" />
                Primary Core Stack
              </div>
              <h3 className="font-space font-black text-xl sm:text-2xl text-white tracking-tight">
                9 Primary Technologies
              </h3>
              <p className="text-zinc-400 text-xs sm:text-sm font-jakarta mt-1">
                The exact production stack used across hackathons, personal prototypes, and coursework.
              </p>
            </div>

            {/* Quick Metrics Pillar */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 self-start sm:self-auto font-mono text-xs">
              <a href="#coding-profiles" className="px-2.5 py-1.5 rounded-xl bg-zinc-900 border border-amber-500/30 text-center hover:border-amber-500 transition-colors">
                <p className="text-[8px] uppercase tracking-wider text-zinc-500">CodeChef</p>
                <p className="font-bold text-amber-400">150+ Solved</p>
              </a>
              <a href="#coding-profiles" className="px-2.5 py-1.5 rounded-xl bg-zinc-900 border border-orange-500/30 text-center hover:border-orange-500 transition-colors">
                <p className="text-[8px] uppercase tracking-wider text-zinc-500">LeetCode</p>
                <p className="font-bold text-orange-400">100+ Solved</p>
              </a>
              <a href="#coding-profiles" className="px-2.5 py-1.5 rounded-xl bg-zinc-900 border border-emerald-500/30 text-center hover:border-emerald-500 transition-colors">
                <p className="text-[8px] uppercase tracking-wider text-zinc-500">GeeksforGeeks</p>
                <p className="font-bold text-emerald-400">70+ Solved</p>
              </a>
              <a href="#coding-profiles" className="px-2.5 py-1.5 rounded-xl bg-zinc-900 border border-cyan-500/30 text-center hover:border-cyan-500 transition-colors">
                <p className="text-[8px] uppercase tracking-wider text-zinc-500">HackerRank</p>
                <p className="font-bold text-cyan-400">40+ Solved</p>
              </a>
              <div className="px-2.5 py-1.5 rounded-xl bg-zinc-900 border border-white/10 text-center">
                <p className="text-[8px] uppercase tracking-wider text-zinc-500">CGPA</p>
                <p className="font-bold text-white">8.21 / 10</p>
              </div>
            </div>
          </div>

          {/* Core Tech Stack Badges Row (Easy to scan, beautiful to look at) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2.5">
            {[
              { name: "React", domain: "Frontend", color: "from-cyan-500/20 to-blue-500/10 text-cyan-300 border-cyan-500/40" },
              { name: "TypeScript", domain: "Contracts", color: "from-blue-500/20 to-indigo-500/10 text-blue-300 border-blue-500/40" },
              { name: "Node.js", domain: "Runtime", color: "from-emerald-500/20 to-teal-500/10 text-emerald-300 border-emerald-500/40" },
              { name: "Express", domain: "REST APIs", color: "from-orange-500/20 to-amber-500/10 text-orange-300 border-orange-500/40" },
              { name: "Tailwind", domain: "Styling", color: "from-teal-500/20 to-cyan-500/10 text-teal-300 border-teal-500/40" },
              { name: "Firebase", domain: "Realtime", color: "from-amber-500/20 to-orange-500/10 text-amber-300 border-amber-500/40" },
              { name: "PostgreSQL", domain: "Relational", color: "from-sky-500/20 to-blue-500/10 text-sky-300 border-sky-500/40" },
              { name: "C++", domain: "DSA / STL", color: "from-indigo-500/20 to-purple-500/10 text-indigo-300 border-indigo-500/40" },
              { name: "Git", domain: "VCS", color: "from-red-500/20 to-orange-500/10 text-red-300 border-red-500/40" }
            ].map((t) => (
              <div
                key={t.name}
                className={`p-3 rounded-2xl bg-gradient-to-b ${t.color} border transition-all duration-200 hover:scale-105 hover:shadow-lg flex flex-col justify-center items-center text-center`}
              >
                <span className="font-space font-bold text-sm text-white tracking-tight">
                  {t.name}
                </span>
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider mt-0.5">
                  {t.domain}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. FILTER & SEARCH CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        {/* Domain Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map(cat => {
            const isActive = activeFilter === cat.label;
            return (
              <button
                key={cat.label}
                type="button"
                onClick={() => setActiveFilter(cat.label)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? "bg-orange-500 text-black font-bold shadow-md shadow-orange-500/25 scale-[1.02]"
                    : "bg-zinc-900/80 text-zinc-300 border border-white/10 hover:border-white/20 hover:text-white"
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                  isActive ? "bg-black/20 text-black font-extrabold" : "bg-white/5 text-zinc-400"
                }`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Quick Search Input */}
        <div className="relative w-full sm:w-60">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tech or project..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-zinc-900/90 border border-white/10 text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500/50 transition-colors"
          />
        </div>
      </div>

      {/* 3. STRUCTURED CARDS GRID (Polished, spacious, with verifiable "Built" statements) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSkills.map(skill => (
          <div
            key={skill.name}
            className="group relative p-6 rounded-2xl bg-[#09090e] border border-white/10 hover:border-orange-500/40 transition-all duration-300 flex flex-col justify-between space-y-4 hover:shadow-xl hover:shadow-orange-500/5 hover:-translate-y-0.5"
          >
            {/* Top Row: Tech Title & Badge */}
            <div className="space-y-2.5">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <h4 className="font-space font-bold text-white text-lg tracking-tight group-hover:text-orange-400 transition-colors">
                    {skill.name}
                  </h4>
                  <p className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                    {skill.role}
                  </p>
                </div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-semibold shrink-0 ${skill.badgeColor}`}>
                  {skill.badge}
                </span>
              </div>

              {/* Description (Crisp, zero filler) */}
              <p className="text-zinc-300 text-xs leading-relaxed font-jakarta">
                {skill.description}
              </p>
            </div>

            {/* Bottom Row: Concrete "Built" Evidence Pill */}
            <div className="pt-3 border-t border-white/5 flex items-start gap-2 text-xs font-mono">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-zinc-300 text-[11px] leading-relaxed">
                <span className="text-orange-400 font-bold uppercase tracking-wider text-[10px] block">
                  Practical Application
                </span>
                <span>{skill.built}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredSkills.length === 0 && (
        <div className="py-12 text-center text-zinc-500 font-mono text-xs">
          No technologies found matching "{searchQuery}". Try selecting another category or resetting the search.
        </div>
      )}
    </div>
  );
}
