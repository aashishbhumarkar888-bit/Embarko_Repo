/**
 * ============================================================================
 *  AASHISH BHUMARKAR — CENTRALIZED PORTFOLIO CONFIGURATION
 * ============================================================================
 *  Edit ANY text, link, project, skill, achievement, certificate, or contact
 *  detail in this single file. Every section of the portfolio reads directly
 *  from here so updates take seconds.
 * ============================================================================
 */

export type DifficultyTier = "BOSS" | "HARD" | "MEDIUM" | "BONUS";
export type StatKey = "frontend" | "backend" | "aiAgents" | "algorithms";
export type RuneSlotKey = "coreLanguage" | "interfaceRune" | "engineRune" | "arcaneRune";
export type ForgeAttributeKey = "architecture" | "algorithms" | "systems" | "aiCraft";

export type SocketedLoadout = Record<RuneSlotKey, string>;

export interface ForgeVisualProfile {
  bladePrimary: string;
  bladeSecondary: string;
  auraColor: string;
  synergyTitle: string;
  synergySubtitle: string;
}

export interface CodingProfile {
  id: string;
  name: string;
  handle: string;
  solved: string;
  badgeNote: string;
  url: string;
  accent: "mint" | "lavender" | "peach" | "sky";
}

export interface ProjectCodexBeats {
  crisis: string;
  forge: string;
  legacy: string;
}

export interface ProjectLevel {
  id: string;
  levelNumber: string; // e.g., "LVL 01"
  realmCode: string; // e.g., "REALM I"
  rune: string;
  accentColor: string;
  name: string;
  title: string;
  difficulty: DifficultyTier;
  category: string;
  impactSummary: string;
  description: string;
  problemSolved: string;
  codex: ProjectCodexBeats;
  stack: string[];
  highlights: string[];
  metrics: string[];
  liveLink: string;
  github: string;
  featured: boolean;
}

export interface PowerUpSkill {
  id: string;
  name: string;
  shortDesc: string;
  tier: string;
  equippedByDefault: boolean;
  socketSlot: RuneSlotKey;
  runeSymbol: string;
  auraColor: string;
  statBoost: Partial<Record<StatKey, number>>;
  forgeBoost: Record<ForgeAttributeKey, number>;
}

export interface SkillGroup {
  id: string;
  title: string;
  subtitle: string;
  accent: "mint" | "lavender" | "sky";
  skills: PowerUpSkill[];
}

export interface ForgeSlotMeta {
  key: RuneSlotKey;
  label: string;
  shortLabel: string;
  defaultColor: string;
  description: string;
}

export interface TrophyAchievement {
  id: string;
  title: string;
  organization: string;
  date: string;
  role: string;
  rankLabel: string;
  description: string;
  metrics: string;
  credentialUrl: string;
  accent: "peach" | "pink" | "mint" | "lavender" | "sky";
  highlight: boolean;
}

export interface VerifiedCertificate {
  id: string;
  name: string;
  issuer: string;
  year: string;
  category: string;
  credentialUrl: string;
  featured?: boolean;
}

export interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  highlights: string[];
}

export interface EducationItem {
  degree: string;
  institution: string;
  duration: string;
  score: string;
  details: string;
}

export interface RealmGate {
  id: string;
  roman: string;
  code: string;
  title: string;
  shortLabel: string;
  targetSectionId: string;
  worldX: number; // Horizontal position in the 2D interactive canvas world (0..2200)
  accentColor: string;
  caption: string;
  ctaLabel: string;
}

/* ============================================================================
 * 1. PLAYER IDENTITY, HERO COPY & SOCIAL LINKS
 * ============================================================================ */
export const PORTFOLIO_DATA = {
  realmGates: [
    {
      id: "gate-origin",
      roman: "I",
      code: "GATE I",
      title: "THE ORIGIN",
      shortLabel: "Origin",
      targetSectionId: "origin",
      worldX: 250,
      accentColor: "#98F5E1",
      caption:
        "Aashish Bhumarkar · B.Tech IT (2024–2028) at BIST Bhopal · 8.21 CGPA · CodeAlpha SWE Intern.",
      ctaLabel: "Open Origin & Resume",
    },
    {
      id: "gate-arena",
      roman: "II",
      code: "GATE II",
      title: "ARENA OF LOGIC",
      shortLabel: "Arena",
      targetSectionId: "arena",
      worldX: 690,
      accentColor: "#90DBF4",
      caption:
        "360+ DSA Problems Solved — CodeChef (150+), LeetCode (100+), GeeksforGeeks (70+), HackerRank (40+).",
      ctaLabel: "Enter Arena of Logic",
    },
    {
      id: "gate-builds",
      roman: "III",
      code: "GATE III",
      title: "THE REALM BUILDS",
      shortLabel: "Builds",
      targetSectionId: "levels",
      worldX: 1150,
      accentColor: "#C8B6FF",
      caption:
        "7 Shipped Full-Stack Builds — SPO Farmer Exchange, VoltPath AI, Secure-Fill, Verbal & more.",
      ctaLabel: "Inspect Realm Builds",
    },
    {
      id: "gate-forge",
      roman: "IV",
      code: "GATE IV",
      title: "THE RUNIC FORGE",
      shortLabel: "Forge",
      targetSectionId: "powerups",
      worldX: 1610,
      accentColor: "#FFD6A5",
      caption:
        "Socket & equip interactive engineering runes — React, TypeScript, C++, Node.js, Cloud & AI.",
      ctaLabel: "Enter Runic Forge",
    },
    {
      id: "gate-honor",
      roman: "V",
      code: "GATE V",
      title: "HALL OF HONOR",
      shortLabel: "Honor",
      targetSectionId: "trophies",
      worldX: 2040,
      accentColor: "#FFCBF2",
      caption:
        "BGI Hackathon Runner-Up, NASA Space Apps Global Nominee, Azure 3rd Place, 12 Verified Certs & Contact.",
      ctaLabel: "Enter Hall of Honor",
    },
  ] as RealmGate[],

  profile: {
    name: "Aashish Bhumarkar",
    playerTag: "P1: AASHISH",
    statusPill: "SYSTEM READY // LEVEL 2026",
    roleTitle: "Full-Stack Developer & Problem Solver",
    subtitle: "3rd-Year B.Tech IT (2024–2028) · Bansal Institute of Science & Technology",
    location: "Bhopal, Madhya Pradesh, India",
    tagline:
      "I build fast, practical web apps with React, TypeScript, Node.js, and AI—turning real-world bottlenecks into shipped software.",
    bio: "Full-stack developer based in Bhopal and 3rd-year Information Technology student at Bansal Institute of Science and Technology (8.21 CGPA). I specialize in React, TypeScript, Node.js, C++ DSA (360+ problems solved), and rapid hackathon shipping—earning Runner-Up at the BGI Collegiate Hackathon, Global Nominee at NASA Space Apps Bhopal, and 3rd Place at Azure Developer Day.",
    moto: "Clean code, measured impact, and working software.",
    email: "aashishbhumarkar888@gmail.com",
    phone: "+91 9617385985",
    whatsappUrl: "https://wa.me/919617385985",
    links: {
      github: "https://github.com/aashishbhumarkar888-bit",
      linkedin: "https://www.linkedin.com/in/aashish-bhumarkar-866337330/",
      instagram: "https://www.instagram.com/aashish_bhumarkar_/?hl=en-in",
      // Optional YouTube link — update with your channel URL anytime
      youtube: "https://www.linkedin.com/posts/aashish-bhumarkar-866337330_fullstack-ai-engineering-activity-7201934981792419840-97qU",
      resumeDriveUrl: "https://drive.google.com/drive/folders/1O6ZGBZJMawASa5mvnP8QgX9lp-dx77MM",
      resumePdfUrl: "/Aashish_Bhumarkar_Resume.pdf",
      certificateVaultUrl: "https://drive.google.com/drive/folders/1O6ZGBZJMawASa5mvnP8QgX9lp-dx77MM",
    },
    heroStats: [
      { label: "CGPA (IT)", value: "8.21", detail: "BIST Bhopal" },
      { label: "DSA Solved", value: "360+", detail: "4 Platforms" },
      { label: "Live Builds", value: "7+", detail: "Shipped Apps" },
      { label: "Hackathons", value: "3x", detail: "Podium / Nominee" },
    ],
  },

  /* ==========================================================================
   * 2. COMPETITIVE CODING PROFILES (ALL HYPERLINKED)
   * ========================================================================== */
  codingProfiles: [
    {
      id: "codechef",
      name: "CodeChef",
      handle: "aashish_9617",
      solved: "150+",
      badgeNote: "Division 3 Contests",
      url: "https://www.codechef.com/users/aashish_9617",
      accent: "peach",
    },
    {
      id: "leetcode",
      name: "LeetCode",
      handle: "Aashish-11",
      solved: "100+",
      badgeNote: "C++ DSA & Trees",
      url: "https://leetcode.com/u/Aashish-11/",
      accent: "mint",
    },
    {
      id: "gfg",
      name: "GeeksforGeeks",
      handle: "aashishbhueb6p",
      solved: "70+",
      badgeNote: "Core DSA Practice",
      url: "https://www.geeksforgeeks.org/profile/aashishbhueb6p?tab=activity",
      accent: "lavender",
    },
    {
      id: "hackerrank",
      name: "HackerRank",
      handle: "aashishbhumarkar1",
      solved: "40+",
      badgeNote: "C++ & Problem Solving",
      url: "https://www.hackerrank.com/profile/aashishbhumarkar1",
      accent: "sky",
    },
  ] as CodingProfile[],

  /* ==========================================================================
   * 3. PROJECTS AS PLAYABLE ARCADE LEVELS ("SELECT YOUR LEVEL")
   * ========================================================================== */
  projects: [
    {
      id: "spo-procurement",
      levelNumber: "LVL 01",
      realmCode: "REALM I",
      rune: "ᚠ",
      accentColor: "#98F5E1",
      name: "SPO — Direct Farmer Trade Platform",
      title: "SPO — Smart Farmer Procurement",
      difficulty: "BOSS",
      category: "AgriTech & Web Platform",
      impactSummary:
        "Direct farmer-to-buyer marketplace targeting 15–20% broker fee reduction with live mandi benchmarking.",
      description:
        "Cloud marketplace connecting smallholder farmers directly with local buyers to cut out intermediary markups using transparent mandi rate benchmarking and instant printable digital trade receipts.",
      problemSolved:
        "Indian agricultural supply chains often subject smallholder farmers to 15–20% broker fee cuts and multi-day payment opacity. SPO provides clear rate benchmarks and direct lot settlement receipts.",
      codex: {
        crisis:
          "Smallholder farmers routinely lose 15–20% of crop earnings to opaque middlemen and multi-day paper settlement delays.",
        forge:
          "Built with React 19, TypeScript, Node.js, and Tailwind CSS featuring a live mandi rate benchmark calculator, moisture-grade lot controls, and sub-100ms printable digital settlement receipts.",
        legacy:
          "Won Runner-Up (2nd Place) MVP in a 36-hour BGI Collegiate Hackathon sprint and deployed live on Vercel for mobile-first rural access.",
      },
      stack: ["React 19", "TypeScript", "Node.js", "Tailwind CSS", "Vercel"],
      highlights: [
        "Mandi market price calculator providing transparent daily rate benchmarks.",
        "Direct produce lot listing with quantity and moisture grade controls.",
        "Instant printable digital trade receipts generated in under 100ms.",
        "Deployed live on Vercel with responsive mobile-first UI for rural access.",
      ],
      metrics: [
        "15–20% target reduction in broker overhead",
        "Sub-100ms digital trade receipt generation",
        "2nd Place MVP · BGI Collegiate Hackathon",
      ],
      github: "https://github.com/aashishbhumarkar888-bit/SPO",
      liveLink: "https://spo-snowy.vercel.app/",
      featured: true,
    },
    {
      id: "voltpath-ai",
      levelNumber: "LVL 02",
      realmCode: "REALM II",
      rune: "ᚢ",
      accentColor: "#90DBF4",
      name: "VoltPath AI",
      title: "VoltPath AI — EV Charging Locator & Slot Optimizer",
      difficulty: "HARD",
      category: "EV & Green Tech",
      impactSummary:
        "EV charger finder & smart slot reservation simulator cutting modeled driver wait times by 45%.",
      description:
        "Interactive EV charging station locator that maps 50+ nearby charger nodes and simulates queue wait-time reductions with real-time Firestore slot booking and AI-assisted station recommendations.",
      problemSolved:
        "Rapid EV adoption leads to unpredictable charging queues. VoltPath AI models optimal arrival slots and syncs charger availability in real time across users.",
      codex: {
        crisis:
          "Explosive EV adoption has outpaced charging visibility, stranding drivers in unpredictable queues with incompatible connector types.",
        forge:
          "Engineered in React.js, Node.js, and Firebase Firestore with real-time slot routing, multi-connector filtering (Fast DC, Type 2, AC), and live multi-user availability sync.",
        legacy:
          "Mapped 50+ station nodes and cut modeled driver charging queue wait times by 45% in live production deployment.",
      },
      stack: ["React.js", "Node.js", "Firebase Firestore", "REST APIs", "Tailwind CSS"],
      highlights: [
        "Slot reservation scheduler reducing simulated driver wait times by 45%.",
        "Real-time synchronized station availability powered by Firebase Firestore.",
        "Multi-connector filtering (Fast DC, Type 2, Standard AC) across 50+ station nodes.",
      ],
      metrics: [
        "45% reduction in simulated queue wait time",
        "50+ mapped charging station nodes",
        "Real-time multi-user Firestore sync",
      ],
      github: "https://github.com/aashishbhumarkar888-bit/Voltpath-ai",
      liveLink: "https://voltpath-ai.base44.app/",
      featured: true,
    },
    {
      id: "secure-fill",
      levelNumber: "LVL 03",
      realmCode: "REALM III",
      rune: "ᚦ",
      accentColor: "#C8B6FF",
      name: "Secure-Fill",
      title: "Secure-Fill — Client Form Sanitizer & Validator",
      difficulty: "HARD",
      category: "Security & Full-Stack Systems",
      impactSummary:
        "Automated form sanitization and SHA-256 payload integrity utility deployed on Railway.",
      description:
        "Full-stack form automation and input sanitization tool engineered to strip malicious XSS payloads, validate structured fields, and verify SHA-256 integrity checksums before database persistence.",
      problemSolved:
        "Protects web forms from client-side script injection and malformed submissions using upfront regex sanitization paired with Express route validation.",
      codex: {
        crisis:
          "Unvalidated web forms expose production databases to silent XSS injection, corrupted payloads, and tampered form submissions.",
        forge:
          "Architected with TypeScript, React.js, Express, MongoDB, and the Web Crypto API to strip script/event vectors upfront and sign every submission with SHA-256 integrity hashes.",
        legacy:
          "Shipped as a hardened full-stack microservice live on Railway with end-to-end cryptographic payload verification before ingestion.",
      },
      stack: ["TypeScript", "React.js", "Node.js", "Express", "MongoDB", "Crypto API"],
      highlights: [
        "Client-side input sanitization stripping script tags and unsafe event attributes.",
        "End-to-end SHA-256 payload integrity checksum verification before ingestion.",
        "Full-stack Express & MongoDB service deployed live on Railway.",
      ],
      metrics: [
        "Upfront client-side XSS pattern stripping",
        "SHA-256 integrity hash verification",
        "Deployed production microservice on Railway",
      ],
      github: "https://github.com/aashishbhumarkar888-bit/Secure-fill",
      liveLink: "https://secure-fill-production.up.railway.app/",
      featured: true,
    },
    {
      id: "grave-vault",
      levelNumber: "LVL 04",
      realmCode: "REALM IV",
      rune: "ᚨ",
      accentColor: "#FFD6A5",
      name: "Grave Ambition Vault",
      title: "Grave Ambition Vault — Interactive Portfolio Game",
      difficulty: "MEDIUM",
      category: "Interactive Web & Canvas",
      impactSummary:
        "60 FPS Canvas particle physics and Web Audio milestone vault turning resumes into an interactive experience.",
      description:
        "Gamified milestone explorer featuring custom 2D Canvas particle physics, reactive lighting, synthesized Web Audio cues, and unlockable achievement vault doors.",
      problemSolved:
        "Replaces passive bullet-point resumes with a memorable, tactile interactive showcase demonstrating creative frontend engineering.",
      codex: {
        crisis:
          "Static bullet-point portfolios blur together in recruiter pipelines and fail to prove real-time rendering or interaction craft.",
        forge:
          "Forged with React.js, Tailwind CSS, raw 2D Canvas API particle physics, and procedural Web Audio API synthesis with zero external media assets.",
        legacy:
          "Delivers locked 60 FPS responsive gameplay across desktop and touch devices, turning career milestones into an unlockable tactile vault.",
      },
      stack: ["React.js", "Tailwind CSS", "Canvas API", "Web Audio API"],
      highlights: [
        "Silky 60 FPS particle canvas backdrop with reactive lighting transitions.",
        "Milestone-based vault door unlock mechanics with Web Audio sound cues.",
        "Responsive touch and desktop gameplay loop with zero external assets.",
      ],
      metrics: [
        "60 FPS smooth canvas rendering",
        "Custom Web Audio API synth effects",
        "Interactive milestone unlock states",
      ],
      github: "https://github.com/aashishbhumarkar888-bit",
      liveLink: "https://grave-ambition-vault.base44.app/",
      featured: true,
    },
    {
      id: "verbal-eight",
      levelNumber: "LVL 05",
      realmCode: "REALM V",
      rune: "ᚱ",
      accentColor: "#FFCBF2",
      name: "Verbal",
      title: "Verbal — Browser Speech Practice Studio",
      difficulty: "MEDIUM",
      category: "Speech & Browser Audio",
      impactSummary:
        "Plugin-free browser pronunciation coach using native Web Speech API with sub-80ms waveform cues.",
      description:
        "Lightweight browser-based pronunciation and vocal articulation trainer built directly on native Web Speech and Web Audio APIs with instant visual waveform feedback.",
      problemSolved:
        "Eliminates heavy audio plugins so learners on any laptop or mobile device can practice speaking with near-instant visual articulation cues.",
      codex: {
        crisis:
          "Most pronunciation trainers lock learners behind bloated native downloads, paid subscriptions, or sluggish server-roundtrip audio processing.",
        forge:
          "Engineered in React.js and TypeScript directly atop native browser Web Speech and Web Audio analyser nodes for zero-plugin acoustic feedback.",
        legacy:
          "Achieves sub-80ms visual waveform articulation cues completely in-browser and runs live on Vercel with zero server latency.",
      },
      stack: ["React.js", "TypeScript", "Web Speech API", "Web Audio API", "Vercel"],
      highlights: [
        "Zero-plugin architecture built on standard browser Web Speech & Audio APIs.",
        "Real-time visual waveform and articulation cues under 80ms latency.",
        "Fast, lightweight static deployment live on Vercel.",
      ],
      metrics: [
        "Sub-80ms visual audio feedback",
        "100% native browser API execution",
        "Deployed live on Vercel",
      ],
      github: "https://github.com/aashishbhumarkar888-bit",
      liveLink: "https://verbal-eight.vercel.app/",
      featured: false,
    },
    {
      id: "nema-store",
      levelNumber: "LVL 06",
      realmCode: "REALM VI",
      rune: "ᚲ",
      accentColor: "#98F5E1",
      name: "Nema Store",
      title: "Nema Store — Modern Retail Storefront",
      difficulty: "MEDIUM",
      category: "Full-Stack E-Commerce",
      impactSummary:
        "Responsive Next.js e-commerce catalog with dynamic filtering and instant client cart state.",
      description:
        "Modern retail storefront built with modular React & TypeScript components, instant category filtering, dynamic cart quantity controls, and responsive mobile-first layouts.",
      problemSolved:
        "Solves sluggish mobile e-commerce browsing with lightweight component architecture and zero-lag client cart state updates.",
      codex: {
        crisis:
          "Mobile shoppers abandon slow retail catalogs plagued by full-page reloads whenever filtering categories or adjusting cart quantities.",
        forge:
          "Constructed with Next.js, TypeScript, Tailwind CSS, and modular client state architecture for instant category switching and live subtotal recomputation.",
        legacy:
          "Delivers lag-free mobile-first storefront navigation and zero-latency cart updates deployed live on Vercel.",
      },
      stack: ["Next.js", "TypeScript", "Tailwind CSS", "Node.js", "Vercel"],
      highlights: [
        "Modular product catalog with responsive grid and category filtering.",
        "Instant client-side cart drawer with live quantity & subtotal calculations.",
        "Clean mobile & desktop layouts deployed live on Vercel.",
      ],
      metrics: [
        "Instant client-side cart updates",
        "Responsive mobile-first storefront",
        "Live deployment on Vercel",
      ],
      github: "https://github.com/aashishbhumarkar888-bit",
      liveLink: "https://nema-store.vercel.app",
      featured: false,
    },
    {
      id: "qr-generator",
      levelNumber: "LVL 07",
      realmCode: "REALM VII",
      rune: "ᚷ",
      accentColor: "#90DBF4",
      name: "QR Matrix Studio",
      title: "QR Code Generator — Privacy-First Matrix Studio",
      difficulty: "BONUS",
      category: "Utility & Web Systems",
      impactSummary:
        "Sub-15ms offline QR generator with L/M/Q/H error correction and crisp PNG/SVG downloads.",
      description:
        "100% client-side QR code studio running completely in the browser with configurable error correction levels (L/M/Q/H), color theming, and instant vector SVG / raster PNG exports.",
      problemSolved:
        "Eliminates tracking pixels, ad redirects, and expiring shortlinks common in free online QR generators.",
      codex: {
        crisis:
          "Free online QR generators routinely inject ad redirects, tracking pixels, and expiring dynamic links that break printed materials.",
        forge:
          "Implemented in TypeScript, React.js, Canvas API, and Vite with offline matrix encoding supporting Level H (30% recovery) and vector SVG / PNG export.",
        legacy:
          "Computes clean, permanent QR matrices in under 15ms with 100% offline privacy and zero third-party network calls.",
      },
      stack: ["TypeScript", "React.js", "Canvas API", "Tailwind CSS", "Vite"],
      highlights: [
        "Instant client-side matrix computation with zero external network tracking.",
        "Configurable error correction matrices up to Level H (30% recovery).",
        "One-click export in crisp PNG raster and scalable SVG vector formats.",
      ],
      metrics: [
        "Sub-15ms client-side generation",
        "100% offline privacy — zero trackers",
        "PNG & SVG vector export support",
      ],
      github: "https://github.com/aashishbhumarkar888-bit",
      liveLink: "https://spo-snowy.vercel.app/",
      featured: false,
    },
  ] as ProjectLevel[],

  /* ==========================================================================
   * 4. THE RUNIC FORGE — 4 WEAPON SOCKETS, ATTRIBUTES & REAL SKILLS
   * ========================================================================== */
  statMeta: [
    { key: "frontend" as StatKey, label: "FRONTEND", base: 24, color: "#98F5E1" },
    { key: "backend" as StatKey, label: "BACKEND", base: 20, color: "#90DBF4" },
    { key: "aiAgents" as StatKey, label: "AI & AGENTS", base: 18, color: "#C8B6FF" },
    { key: "algorithms" as StatKey, label: "ALGORITHMS", base: 22, color: "#FFD6A5" },
  ],

  forgeAttributesMeta: [
    { key: "architecture" as ForgeAttributeKey, label: "ARCHITECTURE", base: 34, color: "#98F5E1" },
    { key: "algorithms" as ForgeAttributeKey, label: "ALGORITHMS", base: 36, color: "#FFD6A5" },
    { key: "systems" as ForgeAttributeKey, label: "SYSTEMS", base: 32, color: "#90DBF4" },
    { key: "aiCraft" as ForgeAttributeKey, label: "AI CRAFT", base: 28, color: "#C8B6FF" },
  ],

  forgeSlotsMeta: [
    {
      key: "coreLanguage" as RuneSlotKey,
      label: "CORE LANGUAGE",
      shortLabel: "Core Lang",
      defaultColor: "#98F5E1",
      description: "Governs blade core & algorithmic precision",
    },
    {
      key: "interfaceRune" as RuneSlotKey,
      label: "INTERFACE RUNE",
      shortLabel: "Interface",
      defaultColor: "#90DBF4",
      description: "Shapes edge shimmer & UI architecture",
    },
    {
      key: "engineRune" as RuneSlotKey,
      label: "ENGINE RUNE",
      shortLabel: "Engine",
      defaultColor: "#FFD6A5",
      description: "Powers backend throughput & runtime aura",
    },
    {
      key: "arcaneRune" as RuneSlotKey,
      label: "ARCANE RUNE",
      shortLabel: "Arcane",
      defaultColor: "#C8B6FF",
      description: "Channels AI craft, cloud & core CS mastery",
    },
  ] as ForgeSlotMeta[],

  initialSocketLoadout: {
    coreLanguage: "cpp",
    interfaceRune: "react",
    engineRune: "nodejs",
    arcaneRune: "dsa",
  } as SocketedLoadout,

  recommendedSocketLoadout: {
    coreLanguage: "typescript",
    interfaceRune: "react",
    engineRune: "nodejs",
    arcaneRune: "ai-workflows",
  } as SocketedLoadout,

  skillGroups: [
    {
      id: "languages",
      title: "Core Languages",
      subtitle: "Core syntax & systems fluency",
      accent: "mint",
      skills: [
        {
          id: "cpp",
          name: "C++",
          shortDesc: "STL, competitive programming & OOP",
          tier: "Daily",
          equippedByDefault: true,
          socketSlot: "coreLanguage",
          runeSymbol: "ᛏ",
          auraColor: "#98F5E1",
          statBoost: { algorithms: 26, backend: 6 },
          forgeBoost: { architecture: 14, algorithms: 34, systems: 20, aiCraft: 6 },
        },
        {
          id: "typescript",
          name: "TypeScript",
          shortDesc: "Strict interfaces & full-stack type safety",
          tier: "Daily",
          equippedByDefault: true,
          socketSlot: "coreLanguage",
          runeSymbol: "ᚱ",
          auraColor: "#90DBF4",
          statBoost: { frontend: 18, backend: 12 },
          forgeBoost: { architecture: 30, algorithms: 16, systems: 22, aiCraft: 16 },
        },
        {
          id: "javascript",
          name: "JavaScript (ES6+)",
          shortDesc: "Async/await, DOM & modern browser APIs",
          tier: "Daily",
          equippedByDefault: true,
          socketSlot: "coreLanguage",
          runeSymbol: "ᛋ",
          auraColor: "#FFD6A5",
          statBoost: { frontend: 16, backend: 10 },
          forgeBoost: { architecture: 24, algorithms: 14, systems: 18, aiCraft: 14 },
        },
        {
          id: "python",
          name: "Python",
          shortDesc: "Automation scripts & AI API workflows",
          tier: "Active",
          equippedByDefault: false,
          socketSlot: "coreLanguage",
          runeSymbol: "ᛉ",
          auraColor: "#C8B6FF",
          statBoost: { aiAgents: 22, algorithms: 10, backend: 8 },
          forgeBoost: { architecture: 16, algorithms: 20, systems: 16, aiCraft: 34 },
        },
        {
          id: "java",
          name: "Java",
          shortDesc: "Object-oriented design & academic labs",
          tier: "Solid",
          equippedByDefault: false,
          socketSlot: "coreLanguage",
          runeSymbol: "ᚦ",
          auraColor: "#FFCBF2",
          statBoost: { algorithms: 12, backend: 10 },
          forgeBoost: { architecture: 22, algorithms: 22, systems: 24, aiCraft: 8 },
        },
      ],
    },
    {
      id: "frameworks-cloud",
      title: "Interface & Engine Runes",
      subtitle: "Production UI, APIs & real-time data",
      accent: "sky",
      skills: [
        {
          id: "react",
          name: "React.js",
          shortDesc: "Hooks, state architecture & Vite apps",
          tier: "Daily",
          equippedByDefault: true,
          socketSlot: "interfaceRune",
          runeSymbol: "ᛟ",
          auraColor: "#90DBF4",
          statBoost: { frontend: 24 },
          forgeBoost: { architecture: 28, algorithms: 8, systems: 14, aiCraft: 12 },
        },
        {
          id: "nextjs",
          name: "Next.js",
          shortDesc: "App Router & Vercel deployments",
          tier: "Projects",
          equippedByDefault: false,
          socketSlot: "interfaceRune",
          runeSymbol: "ᛞ",
          auraColor: "#C8B6FF",
          statBoost: { frontend: 14, backend: 10 },
          forgeBoost: { architecture: 32, algorithms: 8, systems: 22, aiCraft: 14 },
        },
        {
          id: "tailwind",
          name: "Tailwind CSS",
          shortDesc: "Responsive design systems & micro-UI",
          tier: "Daily",
          equippedByDefault: true,
          socketSlot: "interfaceRune",
          runeSymbol: "ᚹ",
          auraColor: "#98F5E1",
          statBoost: { frontend: 18 },
          forgeBoost: { architecture: 24, algorithms: 4, systems: 10, aiCraft: 10 },
        },
        {
          id: "canvas-audio",
          name: "Canvas & Web Speech/Audio",
          shortDesc: "60 FPS rendering & browser synth audio",
          tier: "Creative",
          equippedByDefault: false,
          socketSlot: "interfaceRune",
          runeSymbol: "ᛇ",
          auraColor: "#FFCBF2",
          statBoost: { frontend: 14, aiAgents: 12 },
          forgeBoost: { architecture: 26, algorithms: 18, systems: 16, aiCraft: 18 },
        },
        {
          id: "nodejs",
          name: "Node.js & Express",
          shortDesc: "REST APIs, middleware & validation",
          tier: "Frequent",
          equippedByDefault: true,
          socketSlot: "engineRune",
          runeSymbol: "ᚢ",
          auraColor: "#98F5E1",
          statBoost: { backend: 24 },
          forgeBoost: { architecture: 20, algorithms: 10, systems: 32, aiCraft: 12 },
        },
        {
          id: "firebase",
          name: "Firebase Firestore",
          shortDesc: "Real-time NoSQL sync & auth",
          tier: "Frequent",
          equippedByDefault: false,
          socketSlot: "engineRune",
          runeSymbol: "ᚠ",
          auraColor: "#FFD6A5",
          statBoost: { backend: 18, aiAgents: 6 },
          forgeBoost: { architecture: 18, algorithms: 8, systems: 28, aiCraft: 16 },
        },
        {
          id: "mongodb-sql",
          name: "MongoDB & SQL",
          shortDesc: "Schema design, joins & ACID basics",
          tier: "Projects",
          equippedByDefault: false,
          socketSlot: "engineRune",
          runeSymbol: "ᛗ",
          auraColor: "#90DBF4",
          statBoost: { backend: 18, algorithms: 4 },
          forgeBoost: { architecture: 22, algorithms: 14, systems: 30, aiCraft: 10 },
        },
        {
          id: "git-tools",
          name: "Git, GitHub & Postman",
          shortDesc: "Version control, PRs & API testing",
          tier: "Daily",
          equippedByDefault: false,
          socketSlot: "engineRune",
          runeSymbol: "ᚷ",
          auraColor: "#C8B6FF",
          statBoost: { frontend: 6, backend: 10 },
          forgeBoost: { architecture: 18, algorithms: 8, systems: 24, aiCraft: 10 },
        },
      ],
    },
    {
      id: "ai-core-cs",
      title: "Arcane Runes (AI & Core CS)",
      subtitle: "Algorithms, AI tooling & cloud systems",
      accent: "lavender",
      skills: [
        {
          id: "ai-workflows",
          name: "AI-Assisted Apps & APIs",
          shortDesc: "Prompt systems, recommendations & agents",
          tier: "Active",
          equippedByDefault: false,
          socketSlot: "arcaneRune",
          runeSymbol: "ᛜ",
          auraColor: "#C8B6FF",
          statBoost: { aiAgents: 30, frontend: 6 },
          forgeBoost: { architecture: 18, algorithms: 12, systems: 14, aiCraft: 38 },
        },
        {
          id: "dsa",
          name: "Data Structures & Algorithms",
          shortDesc: "360+ solved across 4 coding platforms",
          tier: "Active",
          equippedByDefault: true,
          socketSlot: "arcaneRune",
          runeSymbol: "ᚲ",
          auraColor: "#FFD6A5",
          statBoost: { algorithms: 28 },
          forgeBoost: { architecture: 14, algorithms: 34, systems: 16, aiCraft: 12 },
        },
        {
          id: "oci-cloud-ai",
          name: "Cloud & AI Foundations",
          shortDesc: "Oracle OCI, IBM Cloud & AWS Academy",
          tier: "Certified",
          equippedByDefault: false,
          socketSlot: "arcaneRune",
          runeSymbol: "ᛈ",
          auraColor: "#90DBF4",
          statBoost: { aiAgents: 22, backend: 12 },
          forgeBoost: { architecture: 20, algorithms: 10, systems: 24, aiCraft: 30 },
        },
        {
          id: "oop-dbms",
          name: "OOP & DBMS Principles",
          shortDesc: "SOLID architecture & relational normalization",
          tier: "Core CS",
          equippedByDefault: false,
          socketSlot: "arcaneRune",
          runeSymbol: "ᚺ",
          auraColor: "#FFCBF2",
          statBoost: { algorithms: 16, backend: 10 },
          forgeBoost: { architecture: 28, algorithms: 22, systems: 22, aiCraft: 10 },
        },
      ],
    },
  ] as SkillGroup[],

  /* ==========================================================================
   * 5. EXPERIENCE & EDUCATION
   * ========================================================================== */
  experience: [
    {
      company: "CodeAlpha",
      role: "Software Development Intern",
      period: "Internship",
      highlights: [
        "Developed C++ applications including Bank Management System and Student Management System using OOP, file handling, and modular design.",
        "Built responsive frontend components using HTML, CSS, JavaScript, and React.js while collaborating on web development projects.",
        "Improved debugging, code optimization, and clean software engineering workflows through project-based delivery.",
      ],
    },
  ] as ExperienceItem[],

  education: [
    {
      degree: "B.Tech — Information Technology",
      institution: "Bansal Institute of Science & Technology, Bhopal",
      duration: "2024 – 2028",
      score: "8.21 / 10 CGPA",
      details: "Core focus on DSA, Object-Oriented Programming, DBMS, and Full-Stack Web Engineering.",
    },
    {
      degree: "Class XII (Higher Secondary, CBSE)",
      institution: "Sri Aurobindo School, Bhopal",
      duration: "2023 – 2024",
      score: "89.8%",
      details: "Science stream: Physics, Chemistry, Mathematics & Computer Science.",
    },
    {
      degree: "Class X (Secondary School, CBSE)",
      institution: "Sri Aurobindo School, Bhopal",
      duration: "2021 – 2022",
      score: "84.4%",
      details: "Strong foundation in mathematics, analytical reasoning, and sciences.",
    },
  ] as EducationItem[],

  /* ==========================================================================
   * 6. TROPHY ROOM — HACKATHON ACHIEVEMENTS & LEADERSHIP
   * ========================================================================== */
  achievements: [
    {
      id: "bgi-hackathon-runnerup",
      title: "Runner-Up (2nd Place) — BGI Collegiate Hackathon",
      organization: "Bansal Group of Institutes (BIST)",
      date: "36-Hour Sprint",
      role: "Full-Stack Developer & Team Lead",
      rankLabel: "2ND PLACE",
      description:
        "Secured 2nd place in the campus-hosted collegiate hackathon by building and pitching a working rural direct-trade web MVP within 36 hours.",
      metrics: "2nd Place · 36h Sprint to Working MVP",
      credentialUrl: "https://drive.google.com/file/d/16MBR3xtc_JviLm3zsVU-2ngYkDS7tpFK/view?usp=sharing",
      accent: "peach",
      highlight: true,
    },
    {
      id: "nasa-space-apps",
      title: "Global Nominee — NASA Space Apps Challenge",
      organization: "NASA Space Apps Bhopal Local Event",
      date: "48-Hour Hackathon",
      role: "Team Developer",
      rankLabel: "GLOBAL NOMINEE",
      description:
        "Selected as Global Nominee at the Bhopal local event for building an interactive space telemetry visualization project during the 48-hour sprint.",
      metrics: "Global Nominee · Bhopal Local Event",
      credentialUrl: "/certificates/img_222012.jpg",
      accent: "sky",
      highlight: true,
    },
    {
      id: "azure-dev-day",
      title: "3rd Position Award — Azure Developer Day",
      organization: "Microsoft Learn Student Ambassadors & BIST",
      date: "Campus Technical Sprint",
      role: "Participant & Prototyper",
      rankLabel: "3RD PLACE",
      description:
        "Secured 3rd position in the hackathon sprint during Azure Developer Day organized by Microsoft Learn Student Ambassadors at BIST Bhopal.",
      metrics: "3rd Position · Cloud Prototype Sprint",
      credentialUrl: "https://drive.google.com/file/d/17Cex6Cl_vacIZ4GYAlHssMIFxscODELR/view?usp=sharing",
      accent: "mint",
      highlight: true,
    },
    {
      id: "peer-mentorship",
      title: "Peer Technical Mentorship & Google Student Ambassador",
      organization: "Bansal Institute of Science & Technology",
      date: "Campus Leadership",
      role: "Student Mentor & Ambassador",
      rankLabel: "MENTOR 100+",
      description:
        "Mentored 100+ junior peers in Git, GitHub workflows, and foundational web development while promoting developer programs on campus.",
      metrics: "100+ Students Mentored · Campus Workshops",
      credentialUrl: "https://drive.google.com/file/d/1aJXKk6ynkThr4Wq1X5g78_EgR7fNorjA/view?usp=sharing",
      accent: "lavender",
      highlight: false,
    },
    {
      id: "competitive-builder",
      title: "Active Hackathon & Coding Competitor",
      organization: "Collegiate & National Events (IEEE MSB, BIST)",
      date: "Ongoing",
      role: "Builder & Competitive Coder",
      rankLabel: "5+ HACKATHONS",
      description:
        "Regular competitor across collegiate hackathons and coding contests—shipping full-stack prototypes and solving 360+ DSA problems.",
      metrics: "5+ Hackathons · 360+ Algorithmic Problems",
      credentialUrl: "https://drive.google.com/drive/folders/1O6ZGBZJMawASa5mvnP8QgX9lp-dx77MM",
      accent: "pink",
      highlight: false,
    },
  ] as TrophyAchievement[],

  /* ==========================================================================
   * 7. TROPHY ROOM — VERIFIED CERTIFICATES (ALL HYPERLINKED TO GOOGLE DRIVE)
   * ========================================================================== */
  certifications: [
    {
      id: "oracle-oci",
      name: "Oracle Cloud Infrastructure Foundations Associate",
      issuer: "Oracle University",
      year: "2024–2025",
      category: "Cloud & AI",
      credentialUrl: "https://drive.google.com/file/d/1-0aoN5NjQLlsFIuS2Bpi5fqlmFilE4IX/view?usp=sharing",
      featured: true,
    },
    {
      id: "ibm-cloud",
      name: "IBM Introduction to Cloud Computing (MDL-301)",
      issuer: "IBM",
      year: "Course Completion",
      category: "Cloud Computing",
      credentialUrl: "https://drive.google.com/file/d/1-5gdr-dgjHS5JndSeZCApK5HawW4I6mt/view?usp=sharing",
      featured: true,
    },
    {
      id: "cisco-cpp",
      name: "C++ Essentials 1",
      issuer: "Cisco Networking Academy & OpenEDG",
      year: "Foundations Course",
      category: "Programming & DSA",
      credentialUrl: "https://drive.google.com/file/d/1-dxfwYlwdwC_1y61GzRuepdNRyUcjHYZ/view?usp=sharing",
      featured: true,
    },
    {
      id: "bgi-runnerup-cert",
      name: "BGI Collegiate Hackathon — Runner-Up (2nd Place)",
      issuer: "Bansal Group of Institutes (BIST)",
      year: "Hackathon Award",
      category: "Hackathons",
      credentialUrl: "https://drive.google.com/file/d/16MBR3xtc_JviLm3zsVU-2ngYkDS7tpFK/view?usp=sharing",
      featured: true,
    },
    {
      id: "azure-3rd-cert",
      name: "Azure Developer Day — 3rd Position Award",
      issuer: "Microsoft Learn Student Ambassadors & BIST",
      year: "Hackathon Award",
      category: "Hackathons",
      credentialUrl: "https://drive.google.com/file/d/17Cex6Cl_vacIZ4GYAlHssMIFxscODELR/view?usp=sharing",
      featured: true,
    },
    {
      id: "tcs-ion",
      name: "TCS iON Career Edge — Young Professional",
      issuer: "Tata Consultancy Services (TCS iON)",
      year: "Professional Course",
      category: "Career Readiness",
      credentialUrl: "https://drive.google.com/file/d/11VOp5WOsf-ffqHE6KlGM5escuilorid8/view?usp=sharing",
      featured: true,
    },
    {
      id: "ieee-hackathon",
      name: "IEEE National Student Branch Hackathon",
      issuer: "IEEE MSB (MANIT Bhopal)",
      year: "Hackathon",
      category: "Hackathons",
      credentialUrl: "https://drive.google.com/file/d/1CLRDt9uNuffY-486upcSLqZY6dLiA9EL/view?usp=sharing",
    },
    {
      id: "google-ambassador",
      name: "Google Student Ambassador Program",
      issuer: "Ministry of Education & Google Community",
      year: "Campus Program",
      category: "Leadership",
      credentialUrl: "https://drive.google.com/file/d/1aJXKk6ynkThr4Wq1X5g78_EgR7fNorjA/view?usp=sharing",
    },
    {
      id: "cyber-aiml-workshop",
      name: "Cyber Security & AI/ML Workshop",
      issuer: "Department of IT, BIST",
      year: "Workshop",
      category: "AI & Security",
      credentialUrl: "https://drive.google.com/file/d/1naHAqGxd9_iPtB95_ndfFTwxgFO9DbGA/view?usp=sharing",
    },
    {
      id: "saylor-interview",
      name: "PRDV103: Professional Interviewing Skills",
      issuer: "Saylor Academy",
      year: "Cert ID: 1466613930AB",
      category: "Professional Skills",
      credentialUrl: "https://drive.google.com/file/d/1JJCwFQ3dq2Z-LSf8oroA1nO5YyzoGV6f/view?usp=sharing",
    },
    {
      id: "saylor-spreadsheets",
      name: "PRDV004: Spreadsheets for Data Analysis",
      issuer: "Saylor Academy",
      year: "Cert ID: 2479822326AB",
      category: "Data Analysis",
      credentialUrl: "https://drive.google.com/file/d/1X8yvfbOxR3uNHS9-5T4DlmTKXhnMDVfo/view?usp=sharing",
    },
    {
      id: "saylor-resume",
      name: "PRDV102: Technical Resume Writing",
      issuer: "Saylor Academy",
      year: "Course Certificate",
      category: "Professional Skills",
      credentialUrl: "https://drive.google.com/file/d/14RDGXxxWjA-3FvhbFf3FP6WYOIJIdxTF/view?usp=sharing",
    },
  ] as VerifiedCertificate[],

  /* ==========================================================================
   * 8. CONTACT TERMINAL SETTINGS
   * ========================================================================== */
  contact: {
    heading: "Final Boss: Send a Transmission",
    subtitle:
      "Open to Software Engineering internships, full-stack projects, and hackathon collaborations. Drop a quick message or copy my email in one tap.",
    subjectPresets: [
      "Internship Opportunity",
      "Full-Stack Project",
      "Hackathon / Collab",
      "Just Saying Hi",
    ],
  },
} as const;
