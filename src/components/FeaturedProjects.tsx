import React, { useState } from "react";
import { 
  ExternalLink, 
  Github, 
  Mail, 
  ChevronDown, 
  TrendingUp, 
  Layers, 
  CheckCircle2, 
  Cpu,
  ArrowUpRight
} from "lucide-react";
import { 
  SPOSimulator, 
  VoltPathSimulator, 
  NemaStoreSimulator, 
  GraveVaultConsole, 
  DSpaceSimulator,
  QRCodeSimulator 
} from "./ProjectSimulators";

export interface ProjectItem {
  id: string;
  name: string;
  subtitle: string;
  category: string;
  role: string;
  timeline: string;
  statusLabel: "Live Demo" | "Deployed Prototype" | "Deployed Microservice" | "Browser Utility";
  description: string;
  problemSolved: string;
  impactMetric: string;
  keyFeatures: string[];
  stack: string[];
  liveLink: string;
  displayUrl: string;
  github: string;
  icon: string;
  accentColor: string;
  glowClass: string;
  borderClass: string;
}

export const FEATURED_PROJECTS: ProjectItem[] = [
  {
    id: "spo",
    name: "SPO",
    subtitle: "Direct Farmer Trade Platform",
    category: "Web Application",
    role: "Full-Stack Developer",
    timeline: "Feb 2025 - Present",
    statusLabel: "Live Demo",
    description: "A web platform connecting smallholder farmers directly with local buyers at benchmarked mandi rates. Solves price opacity by calculating net trade estimates and generating digital receipts on the spot.",
    problemSolved: "Farmers frequently lose 15-20% margin to middlemen and wait days for payment. SPO provides transparent daily mandi rates and immediate digital receipts.",
    impactMetric: "Live demo on Vercel • Benchmark mandi price calculator • Mobile-first layout",
    keyFeatures: [
      "Produce lot listing with quantity and moisture grade options.",
      "Mandi benchmark price calculator with instant net estimates.",
      "Clean printable digital trade receipt for both parties."
    ],
    stack: ["React", "TypeScript", "Node.js", "Tailwind CSS", "Vercel"],
    liveLink: "https://spo-snowy.vercel.app",
    displayUrl: "spo-snowy.vercel.app",
    github: "https://github.com/aashishbhumarkar888-bit/SPO",
    icon: "🌾",
    accentColor: "text-emerald-400",
    glowClass: "from-emerald-500/15 via-emerald-500/5 to-transparent",
    borderClass: "border-emerald-500"
  },
  {
    id: "voltpath",
    name: "VoltPath AI",
    subtitle: "EV Charging Locator & Slot Booking",
    category: "Full-Stack / Maps",
    role: "Full-Stack Developer",
    timeline: "Oct 2024 - Nov 2024",
    statusLabel: "Deployed Prototype",
    description: "An EV charging station locator with simulated slot reservations. Built for electric vehicle drivers to locate stations and reserve charging slots before arriving.",
    problemSolved: "Simulated a 45% reduction in station wait times by balancing driver arrivals across nearby charging points using heuristic scheduling.",
    impactMetric: "45% reduction in simulated wait times • Real-time Firebase listeners • 50+ mock station nodes",
    keyFeatures: [
      "Simulated slot reservation to prevent multiple drivers booking the same plug.",
      "Live status indicator powered by Firebase Firestore listeners.",
      "Filter by charger type (Fast DC, Type 2, Standard AC)."
    ],
    stack: ["React", "Node.js", "Firebase Firestore", "Tailwind CSS"],
    liveLink: "https://voltpath-ai.base44.app",
    displayUrl: "voltpath-ai.base44.app",
    github: "https://github.com/aashishbhumarkar888-bit",
    icon: "⚡",
    accentColor: "text-amber-400",
    glowClass: "from-amber-500/15 via-orange-500/5 to-transparent",
    borderClass: "border-orange-500"
  },
  {
    id: "secure-fill",
    name: "Secure-Fill",
    subtitle: "Form Sanitization & Dispatcher Microservice",
    category: "Backend & Security",
    role: "Developer",
    timeline: "Jan 2025 - Feb 2025",
    statusLabel: "Deployed Microservice",
    description: "A secure form processing microservice that validates, sanitizes, and signs form submissions on the client before persisting to the backend.",
    problemSolved: "Catches malicious script payloads and malformed inputs in public contact forms using schema validation and SHA-256 integrity checksums.",
    impactMetric: "Live backend service deployed on Railway • Client-side schema validation • Zero external telemetry",
    keyFeatures: [
      "Client-side input sanitization stripping script tags and unsafe attributes.",
      "SHA-256 payload checksum verification on arrival.",
      "Express API route with basic rate limiting and structured error responses."
    ],
    stack: ["TypeScript", "React", "Node.js", "Express", "Crypto API"],
    liveLink: "https://secure-fill-production.up.railway.app",
    displayUrl: "secure-fill.up.railway.app",
    github: "https://github.com/aashishbhumarkar888-bit/Secure-fill",
    icon: "🛡️",
    accentColor: "text-rose-400",
    glowClass: "from-rose-500/15 via-rose-500/5 to-transparent",
    borderClass: "border-rose-500"
  },
  {
    id: "qr-generator",
    name: "QR Generator",
    subtitle: "Client-Side QR Code Studio",
    category: "Web Utility",
    role: "Frontend Developer",
    timeline: "Nov 2024",
    statusLabel: "Browser Utility",
    description: "An offline-first in-browser QR code generator for students and small businesses. Generates customizable high-resolution QR codes without third-party redirects.",
    problemSolved: "Most free online QR tools add watermarks, track redirects, or expire shortlinks. This runs 100% in-browser with zero tracking.",
    impactMetric: "Runs 100% offline in browser • PNG & SVG export • Error correction level H",
    keyFeatures: [
      "Customizable foreground and background colors with real-time preview.",
      "Configurable error correction levels (L, M, Q, H).",
      "One-click export to PNG and scalable SVG."
    ],
    stack: ["TypeScript", "React", "Canvas API", "Tailwind CSS"],
    liveLink: "https://spo-snowy.vercel.app",
    displayUrl: "spo-snowy.vercel.app",
    github: "https://github.com/aashishbhumarkar888-bit",
    icon: "🔳",
    accentColor: "text-blue-400",
    glowClass: "from-blue-500/15 via-blue-500/5 to-transparent",
    borderClass: "border-blue-500"
  }
];

export const ADDITIONAL_PROJECTS: ProjectItem[] = [
  {
    id: "nema-store",
    name: "Nema Store",
    subtitle: "Modern Retail Storefront Prototype",
    category: "Frontend E-Commerce",
    role: "Frontend Developer",
    timeline: "Jan 2025",
    statusLabel: "Live Demo",
    description: "A fast retail storefront prototype built with Next.js and Tailwind CSS featuring instant client-side cart updates and responsive catalog navigation.",
    problemSolved: "Explored component architecture, shopping cart state updates, and clean responsive product card grids.",
    impactMetric: "Responsive mobile catalog • Client-side cart updates • Deployed on Vercel",
    keyFeatures: [
      "Responsive product catalog with filtering.",
      "Client-side cart drawer with quantity adjustments.",
      "Deployed demo on Vercel at nema-store.vercel.app."
    ],
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Vercel"],
    liveLink: "https://nema-store.vercel.app",
    displayUrl: "nema-store.vercel.app",
    github: "https://github.com/aashishbhumarkar888-bit",
    icon: "🛍️",
    accentColor: "text-teal-400",
    glowClass: "from-teal-500/15 via-teal-500/5 to-transparent",
    borderClass: "border-teal-500"
  },
  {
    id: "grave-vault",
    name: "Grave Ambition Vault",
    subtitle: "Interactive Themed Showcase",
    category: "Creative Frontend",
    role: "Frontend Developer",
    timeline: "Dec 2024",
    statusLabel: "Deployed Prototype",
    description: "An interactive portfolio project exploring animated milestone unlock mechanics with particle effects and Web Audio sound design.",
    problemSolved: "Explored creative front-end animation techniques using Framer Motion and canvas dynamics.",
    impactMetric: "60 FPS canvas animations • Interactive unlock stages • Deployed demo",
    keyFeatures: [
      "Smooth Framer Motion state animations.",
      "Web Audio sound cues for interactive milestone cards.",
      "Custom responsive dark aesthetic."
    ],
    stack: ["React", "Tailwind CSS", "Motion", "Web Audio API"],
    liveLink: "https://grave-ambition-vault.base44.app",
    displayUrl: "grave-ambition-vault.base44.app",
    github: "https://github.com/aashishbhumarkar888-bit",
    icon: "🗝️",
    accentColor: "text-purple-400",
    glowClass: "from-purple-500/15 via-indigo-500/5 to-transparent",
    borderClass: "border-purple-500"
  }
];

export default function FeaturedProjects() {
  const [activeProjectId, setActiveProjectId] = useState<string>("spo");
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const displayedProjects = isExpanded 
    ? [...FEATURED_PROJECTS, ...ADDITIONAL_PROJECTS] 
    : FEATURED_PROJECTS;

  const activeProject = displayedProjects.find((p) => p.id === activeProjectId) || FEATURED_PROJECTS[0];

  const mailSubject = `Inquiry regarding ${activeProject.name}`;
  const mailBody = `Hi Aashish, I saw your work on ${activeProject.name} and wanted to connect.`;
  const mailtoUrl = `mailto:aashishbhumarkar888@gmail.com?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;

  return (
    <section 
      id="projects" 
      className="py-24 border-t border-white/5 relative z-10 px-4 max-w-6xl mx-auto"
    >
      {/* Header */}
      <div className="text-left mb-12 space-y-2">
        <p className="text-xs font-mono uppercase tracking-widest text-orange-400 font-bold">
          04 // PROJECTS & SIMULATORS
        </p>
        <h2 className="text-3xl sm:text-4xl font-space font-bold tracking-tight text-white">
          Projects & Runnable Demos
        </h2>
        <p className="text-zinc-300 text-sm sm:text-base font-jakarta leading-relaxed max-w-2xl">
          Web applications and interactive prototypes built with React, Node.js, and TypeScript. Test them directly in the simulator panel or visit the live deployment.
        </p>
      </div>

      {/* Grid: 5 columns left (List) + 7 columns right (Details & Simulators) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT PANE: Project Selection Cards */}
        <div 
          className="lg:col-span-5 space-y-4"
          role="tablist"
          aria-label="Featured Projects selection list"
        >
          {displayedProjects.map((proj) => {
            const isSelected = activeProjectId === proj.id;

            return (
              <div
                key={proj.id}
                role="tab"
                aria-selected={isSelected}
                tabIndex={0}
                onClick={() => setActiveProjectId(proj.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActiveProjectId(proj.id);
                  }
                }}
                className={`relative w-full p-5 sm:p-6 rounded-2xl text-left cursor-pointer transition-all duration-200 select-none border ${
                  isSelected
                    ? "border-orange-500 bg-white/5 shadow-lg"
                    : "border-white/10 bg-zinc-950/80 hover:bg-zinc-900/60 hover:border-white/20 text-zinc-300"
                }`}
              >
                <div className="relative z-10 flex flex-col space-y-3">
                  {/* Top Bar: Icon, Category & Status */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-sm shrink-0">
                        {proj.icon}
                      </span>
                      <span className={`text-xs font-mono tracking-wide uppercase font-semibold truncate ${
                        isSelected ? "text-orange-400" : "text-zinc-400"
                      }`}>
                        {proj.category}
                      </span>
                    </div>

                    {/* Status Badge */}
                    <span className="px-2.5 py-1 rounded-md bg-zinc-900 border border-white/10 text-zinc-300 font-mono text-xs shrink-0 flex items-center gap-1.5 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      {proj.statusLabel}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <div>
                    <h3 className={`font-space font-bold text-lg sm:text-xl tracking-tight ${
                      isSelected ? "text-white" : "text-zinc-100"
                    }`}>
                      {proj.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-400 font-jakarta line-clamp-1 mt-0.5">
                      {proj.subtitle}
                    </p>
                  </div>

                  {/* Description Preview */}
                  <p className="text-xs sm:text-sm text-zinc-300 line-clamp-2 leading-relaxed font-jakarta">
                    {proj.description}
                  </p>

                  {/* Tech Stack Pills */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {proj.stack.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-0.5 rounded-md text-xs font-mono bg-white/5 border border-white/10 text-zinc-300"
                      >
                        {tech}
                      </span>
                    ))}
                    {proj.stack.length > 3 && (
                      <span className="px-2 py-0.5 rounded-md text-xs font-mono bg-white/5 text-zinc-400">
                        +{proj.stack.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Expand/Collapse Toggle */}
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/10 text-xs sm:text-sm font-mono tracking-wider uppercase transition-all cursor-pointer"
            >
              <span>{isExpanded ? "Show Top 4 Projects" : `View All Projects (${FEATURED_PROJECTS.length + ADDITIONAL_PROJECTS.length})`}</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
            </button>
          </div>
        </div>

        {/* RIGHT PANE: Selected Project Details & Simulator */}
        <div className="lg:col-span-7 bg-zinc-950/90 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 text-left shadow-xl">
          
          {/* Top header & live action bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">{activeProject.icon}</span>
                <h3 className="font-space font-bold text-2xl text-white">
                  {activeProject.name}
                </h3>
              </div>
              <p className="text-sm text-zinc-400 font-jakarta mt-1">
                {activeProject.subtitle}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href={activeProject.liveLink}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-orange-500 hover:bg-orange-400 text-zinc-950 font-space font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
              >
                <span>Live Demo</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>

              <a
                href={activeProject.github}
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-xl border border-white/10 transition-colors"
                title="View GitHub Repository"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Description & Problem Solved */}
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-orange-400 font-semibold mb-1">
                What it does
              </h4>
              <p className="text-sm sm:text-base text-zinc-200 font-jakarta leading-relaxed">
                {activeProject.description}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold mb-1">
                Problem Solved
              </h4>
              <p className="text-xs sm:text-sm text-zinc-300 font-jakarta leading-relaxed">
                {activeProject.problemSolved}
              </p>
            </div>
          </div>

          {/* Key Features List */}
          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
              Key Features
            </h4>
            <ul className="space-y-1.5 text-xs sm:text-sm text-zinc-300">
              {activeProject.keyFeatures.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech Stack Pills */}
          <div className="pt-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold mb-2">
              Technologies Used
            </h4>
            <div className="flex flex-wrap gap-2">
              {activeProject.stack.map((st) => (
                <span
                  key={st}
                  className="px-3 py-1 bg-zinc-900 border border-white/10 rounded-lg text-xs font-mono text-zinc-200"
                >
                  {st}
                </span>
              ))}
            </div>
          </div>

          {/* Interactive Project Simulator / Demo */}
          <div className="pt-4 border-t border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-orange-400 font-semibold flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" />
                Live Interactive Sandbox
              </span>
              <span className="text-xs font-mono text-zinc-400">
                Runs directly in your browser
              </span>
            </div>

            <div className="p-4 bg-black/60 border border-white/10 rounded-2xl overflow-hidden">
              {activeProject.id === "spo" && <SPOSimulator />}
              {activeProject.id === "voltpath" && <VoltPathSimulator />}
              {activeProject.id === "secure-fill" && <SPOSimulator />}
              {activeProject.id === "nema-store" && <NemaStoreSimulator />}
              {activeProject.id === "grave-vault" && <GraveVaultConsole />}
              {activeProject.id === "qr-generator" && <QRCodeSimulator />}
            </div>
          </div>

          {/* Contact Developer regarding project */}
          <div className="pt-2 flex justify-between items-center text-xs font-mono text-zinc-400">
            <span>Questions about this project?</span>
            <a
              href={mailtoUrl}
              className="text-orange-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Contact Aashish</span>
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}
