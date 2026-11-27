import { Project, SkillCategory, Achievement, Certification, AcademicRecord } from "./types";

export const PROFILE_INFO = {
  name: "Aashish Bhumarkar",
  title: "Full-Stack Developer",
  subTitle: "3rd-Year B.Tech IT (2024–2028) | Bansal Institute of Science and Technology",
  location: "Bhopal, Madhya Pradesh, India",
  email: "aashishbhumarkar888@gmail.com",
  github: "https://github.com/aashishbhumarkar888-bit",
  linkedin: "https://www.linkedin.com/in/aashish-bhumarkar-866337330/",
  instagram: "https://www.instagram.com/aashish_bhumarkar_/?hl=en-in",
  avatarUrl: "/Cyberpunk Developer Profile HUD.png",
  fallbackAvatarUrl: "/profile_avatar.png",
  contact: "+91 9617385985",
  contactDisplay: "+91 9617385985",
  moto: "Clean code, measured impact, and working software.",
  bio: "Full-stack developer based in Bhopal. I build web applications with React, Node.js, and TypeScript. 3rd-year Information Technology student at Bansal Institute of Science and Technology (8.21 CGPA). Runner-up at the BGI Collegiate Hackathon, Global Nominee at NASA Space Apps Challenge Bhopal, and 3rd place at Azure Developer Day.",
  certificateVaultUrl: "https://drive.google.com/drive/folders/1O6ZGBZJMawASa5mvnP8QgX9lp-dx77MM",
  resumePdfUrl: "/Aashish_Bhumarkar_Resume.pdf",
  resumeDriveUrl: "https://drive.google.com/drive/folders/1O6ZGBZJMawASa5mvnP8QgX9lp-dx77MM",
  codingProfiles: {
    codechef: {
      name: "CodeChef",
      url: "https://www.codechef.com/users/aashish_9617",
      solved: "150+",
      handle: "aashish_9617"
    },
    leetcode: {
      name: "LeetCode",
      url: "https://leetcode.com/u/Aashish-11/",
      solved: "100+",
      handle: "Aashish-11"
    },
    gfg: {
      name: "GeeksforGeeks",
      url: "https://www.geeksforgeeks.org/profile/aashishbhueb6p?tab=activity",
      solved: "70+",
      handle: "aashishbhueb6p"
    },
    hackerrank: {
      name: "HackerRank",
      url: "https://www.hackerrank.com/profile/aashishbhumarkar1",
      solved: "40+",
      handle: "aashishbhumarkar1"
    }
  }
};

export const PROJECTS_DATA: Project[] = [
  {
    id: "spo-procurement",
    name: "SPO - Smart Farmer Procurement",
    title: "SPO — Direct Farmer Trade Platform",
    stack: ["React 19", "TypeScript", "Node.js", "Tailwind CSS", "Vercel"],
    description: "Cloud marketplace connecting smallholder farmers directly with local buyers to reduce broker markups with real-time mandi rate benchmarking.",
    problemSolved: "Helps farmers bypass traditional 15-20% broker cuts and multi-day settlement delays with direct buyer matching and transparent mandi prices.",
    impactMetric: "Targeted 15-20% broker cost reduction • Modeled sub-100ms contract dispatch • Deployed on Vercel",
    starFramework: {
      situation: "Indian agricultural supply chains often involve 15-20% broker fee cuts and regional mandi price opacity, delaying payments to farmers.",
      task: "Build and deploy a web application enabling direct lot bidding between farmers and buyers with transparent mandi price references.",
      action: "Built a responsive web application using React, TypeScript, and Node.js with dynamic mandi rate calculations and instant digital trade receipt generation.",
      result: "Deployed on Vercel with direct farmer-to-buyer transactions, instant digital receipts, and zero intermediary fees.",
      metrics: [
        "15–20% target reduction in broker overhead",
        "Direct mandi price benchmarking and transparency",
        "Fast digital receipt and lot summary generation",
        "Deployed live on Vercel"
      ]
    },
    keyFeatures: [
      "Mandi market price calculator providing transparent rate benchmarks.",
      "Direct produce lot listing with quantity and moisture grade options.",
      "Instant printable digital trade receipt for both parties.",
      "Deployed and accessible on Vercel."
    ],
    github: "https://github.com/aashishbhumarkar888-bit/SPO",
    liveLink: "https://spo-snowy.vercel.app/",
    category: "AgriTech & Web Platform",
    featured: true,
    visualEmphasis: {
      gradient: "from-emerald-950 via-zinc-900 to-green-950",
      glowColor: "rgba(16, 185, 129, 0.4)",
      icon: "Wheat"
    }
  },
  {
    id: "voltpath-ai",
    name: "VoltPath AI",
    title: "VoltPath AI (EV Charging Locator & Slot Optimization)",
    stack: ["React.js", "Node.js", "Firebase Firestore", "Tailwind CSS"],
    description: "Interactive EV charging station locator that maps nearby chargers and simulates queue wait-time reductions across route nodes.",
    problemSolved: "Helps EV drivers find available charging stations and models optimal arrival times to prevent queue bottlenecks.",
    impactMetric: "45% reduction in simulated wait time • Real-time Firestore sync • 50+ mapped station nodes",
    starFramework: {
      situation: "Rapid EV adoption creates unpredictable charging station queues and long wait times without synchronized scheduling.",
      task: "Build a prototype charging station discovery and reservation interface to streamline vehicle charging.",
      action: "Integrated interactive map overlays with Firestore real-time listeners and simulated slot reservation scheduling.",
      result: "Reduced driver queuing time by 45% in simulated test routes while supporting multi-user slot status updates.",
      metrics: [
        "45% reduction in simulated queue wait time",
        "Real-time slot status synchronization via Firestore",
        "Route detour planning across 50+ station nodes"
      ]
    },
    keyFeatures: [
      "Slot reservation logic reducing simulated driver queue times by 45%.",
      "Real-time synchronized charging station status powered by Firestore.",
      "Filter by charger type (Fast DC, Type 2, Standard AC)."
    ],
    github: "https://github.com/aashishbhumarkar888-bit",
    liveLink: "https://voltpath-ai.base44.app/",
    category: "EV & Green Tech",
    featured: true,
    visualEmphasis: {
      gradient: "from-amber-950 via-zinc-900 to-orange-950",
      glowColor: "rgba(249, 115, 22, 0.4)",
      icon: "Zap"
    }
  },
  {
    id: "grave-vault",
    name: "Grave-Ambition-Vault",
    title: "Grave Ambition Vault — Interactive Portfolio Game",
    stack: ["React.js", "Tailwind CSS", "Canvas API", "Web Audio API"],
    description: "Interactive milestone explorer with custom canvas particle physics, sound design, and unlockable achievement doors.",
    problemSolved: "Replaces traditional static bullet lists with an engaging, interactive gamified milestone showcase.",
    impactMetric: "60 FPS canvas animations • Interactive milestone unlocks • Sound effects",
    starFramework: {
      situation: "Static resumes often result in quick, unmemorable visits that do not demonstrate creative frontend capabilities.",
      task: "Build an interactive, gamified showcase challenging visitors to explore technical achievements.",
      action: "Created a 2D particle canvas with reactive lighting, audio triggers, and door-unlock state transitions.",
      result: "Delivered a responsive 60 FPS animation experience across modern desktop and mobile browsers.",
      metrics: [
        "60 FPS smooth canvas animation rate",
        "Interactive milestone door unlocks",
        "Sound effects via Web Audio API"
      ]
    },
    keyFeatures: [
      "Smooth 60 FPS particle canvas backdrop with reactive lighting.",
      "Milestone-based vault unlock mechanism with interactive sound cues.",
      "Interactive thematic presentation of achievements."
    ],
    github: "https://github.com/aashishbhumarkar888-bit",
    liveLink: "https://grave-ambition-vault.base44.app/",
    category: "Interactive Web",
    featured: true,
    visualEmphasis: {
      gradient: "from-purple-950 via-slate-900 to-indigo-950",
      glowColor: "rgba(168, 85, 247, 0.4)",
      icon: "Ghost"
    }
  },
  {
    id: "secure-fill",
    name: "Secure-Fill",
    title: "Secure-Fill — Client Form Sanitizer",
    stack: ["TypeScript", "React.js", "Node.js", "Express", "Crypto API"],
    description: "Form input sanitizer and validator utility designed to strip malicious scripts and validate payloads before server submission.",
    problemSolved: "Prevents client-side script injection and invalid form submissions through upfront regex sanitization and SHA-256 payload hashing.",
    impactMetric: "Client-side XSS filtering • Payload hash validation • Deployed on Railway",
    starFramework: {
      situation: "Client-side form inputs and third-party scripts frequently introduce injection and data corruption risks.",
      task: "Develop a form processing utility ensuring data integrity before persistence.",
      action: "Built client-side sanitization routines paired with SHA-256 payload hashing and Express route validation.",
      result: "Successfully neutralizes common XSS injection patterns with fast client-side validation.",
      metrics: [
        "Client-side script tag and attribute stripping",
        "SHA-256 integrity checksum verification",
        "Deployed microservice on Railway"
      ]
    },
    keyFeatures: [
      "Client-side input sanitization stripping script tags and unsafe attributes.",
      "End-to-end checksum verification prior to backend ingestion.",
      "Deployed Express backend service on Railway."
    ],
    github: "https://github.com/aashishbhumarkar888-bit/Secure-fill",
    liveLink: "https://secure-fill-production.up.railway.app/",
    category: "Security & Systems",
    featured: false,
    visualEmphasis: {
      gradient: "from-red-950 via-zinc-900 to-rose-950",
      glowColor: "rgba(239, 68, 68, 0.4)",
      icon: "ShieldAlert"
    }
  },
  {
    id: "qr-generator",
    name: "QR Code Generator",
    title: "QR Code Generator — Matrix Studio",
    stack: ["TypeScript", "React.js", "Tailwind CSS", "Canvas API", "Vite"],
    description: "Client-side QR code generator with adjustable error correction (L/M/Q/H) and SVG/PNG vector downloads.",
    problemSolved: "Generates QR codes completely in the browser without third-party trackers, ad redirects, or rate limits.",
    impactMetric: "Sub-15ms generation • 100% client-side privacy • PNG & SVG export",
    starFramework: {
      situation: "Free online QR code tools often inject tracking pixels, ad redirects, or expired shortlinks.",
      task: "Develop a clean, offline-ready QR tool running entirely in the browser.",
      action: "Implemented in-browser matrix rendering using TypeScript and Canvas API with custom styling and export tools.",
      result: "Instant matrix generation with zero external network requests and high scan reliability.",
      metrics: [
        "Fast client-side canvas render execution",
        "100% offline execution with zero data tracking",
        "Configurable error correction up to Level H",
        "Dual format PNG and SVG export"
      ]
    },
    keyFeatures: [
      "Instant client-side matrix computation with zero external network requests.",
      "Configurable error correction matrices up to Level H.",
      "Export in crisp PNG raster and scalable SVG vector formats.",
      "Integrated color theming and margin controls."
    ],
    github: "https://github.com/aashishbhumarkar888-bit",
    liveLink: "https://spo-snowy.vercel.app/",
    category: "Utility & Web Systems",
    featured: true,
    visualEmphasis: {
      gradient: "from-blue-950 via-indigo-900 to-slate-950",
      glowColor: "rgba(59, 130, 246, 0.4)",
      icon: "QrCode"
    }
  },
  {
    id: "nema-store",
    name: "Nema Store",
    title: "Nema Store — Modern Retail Storefront",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Node.js", "Vercel"],
    description: "Responsive e-commerce storefront with product filtering, dynamic cart state, and fast page loads.",
    problemSolved: "Delivers a clean shopping experience with responsive layouts and instant cart state updates.",
    impactMetric: "Responsive layout • Fast client cart updates • Deployed on Vercel",
    starFramework: {
      situation: "Traditional e-commerce templates can feel sluggish on mobile devices with heavy client bundles.",
      task: "Build an ultra-responsive modern retail storefront featuring modular catalog browsing.",
      action: "Built modular React components with TypeScript contracts, responsive layouts, and client-side cart updates.",
      result: "Clean and responsive retail experience deployed live on Vercel.",
      metrics: [
        "Fast client-side cart state updates",
        "Responsive mobile and desktop layouts",
        "Deployed on Vercel"
      ]
    },
    keyFeatures: [
      "Responsive product catalog with filtering.",
      "Client-side cart drawer with quantity adjustments.",
      "Deployed on Vercel infrastructure."
    ],
    github: "https://github.com/aashishbhumarkar888-bit",
    liveLink: "https://nema-store.vercel.app",
    category: "Full-Stack E-Commerce",
    featured: false,
    visualEmphasis: {
      gradient: "from-teal-950 via-zinc-900 to-emerald-950",
      glowColor: "rgba(20, 184, 166, 0.4)",
      icon: "ShoppingCart"
    }
  },
  {
    id: "verbal-eight",
    name: "Verbal",
    title: "Verbal — Browser Speech Practice Tool",
    stack: ["React.js", "TypeScript", "Web Speech API", "Tailwind CSS", "Vercel"],
    description: "Browser-based pronunciation and speech practice app utilizing the native Web Speech API with real-time waveform feedback.",
    problemSolved: "Enables vocal articulation and speech practice directly in the browser without heavy third-party audio plugins.",
    impactMetric: "Sub-80ms audio feedback • Native Web Speech API • Deployed on Vercel",
    starFramework: {
      situation: "Browser-based speech apps often require heavy third-party plugins that lag on lower-end devices.",
      task: "Build a lightweight speech practice tool utilizing standard browser APIs.",
      action: "Integrated native Web Speech and Web Audio APIs with immediate UI waveform visualization.",
      result: "Deployed live on Vercel with responsive feedback across desktop and mobile browsers.",
      metrics: [
        "Native browser API integration without plugins",
        "Real-time visual articulation cues",
        "Deployed on Vercel"
      ]
    },
    keyFeatures: [
      "Native Web Speech and Web Audio API architecture.",
      "Real-time visual articulation cues and waveform feedback.",
      "Deployed on Vercel."
    ],
    github: "https://github.com/aashishbhumarkar888-bit",
    liveLink: "https://verbal-eight.vercel.app/",
    category: "Speech & Audio AI",
    featured: false,
    visualEmphasis: {
      gradient: "from-violet-950 via-zinc-900 to-indigo-950",
      glowColor: "rgba(139, 92, 246, 0.4)",
      icon: "Mic"
    }
  }
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: "Programming Languages",
    chakraStyle: "Core",
    colorHex: "#3b82f6",
    colorClass: "from-blue-500 to-cyan-500 shadow-blue-500/20",
    proficiencyLevel: "Core Languages",
    skills: [
      { name: "C++", level: 90, description: "Data structures, algorithms, STL, competitive programming practice", proficiencyTier: "Daily / Primary" },
      { name: "JavaScript (ES6+)", level: 88, description: "Async/await, closures, fetch API, and DOM manipulation across web apps", proficiencyTier: "Daily / Primary" },
      { name: "TypeScript", level: 85, description: "Type definitions, interfaces, props typing, and API response contracts", proficiencyTier: "Frequent" },
      { name: "Python", level: 75, description: "Automation scripts, data parsing, and testing AI API endpoints", proficiencyTier: "Occasional" },
      { name: "Java", level: 78, description: "Object-oriented programming concepts and academic lab coursework", proficiencyTier: "Academic" }
    ]
  },
  {
    title: "Frontend Development",
    chakraStyle: "Frontend",
    colorHex: "#10b981",
    colorClass: "from-emerald-500 to-teal-500 shadow-emerald-500/20",
    proficiencyLevel: "Core Stack",
    skills: [
      { name: "React.js", level: 90, description: "Functional components, custom hooks, context, state management & Vite", proficiencyTier: "Daily / Primary" },
      { name: "Tailwind CSS", level: 92, description: "Utility classes, responsive layouts, CSS grid, flexbox & design systems", proficiencyTier: "Daily / Primary" },
      { name: "HTML5 & CSS3", level: 90, description: "Semantic markup, accessible structure, responsive forms & layouts", proficiencyTier: "Daily / Primary" },
      { name: "Next.js", level: 78, description: "Basic SSR, App Router structure, and deploying static sites to Vercel", proficiencyTier: "Occasional" }
    ]
  },
  {
    title: "Backend & Databases",
    chakraStyle: "Backend",
    colorHex: "#f97316",
    colorClass: "from-orange-500 to-amber-500 shadow-orange-500/20",
    proficiencyLevel: "Active Projects",
    skills: [
      { name: "Node.js & Express", level: 84, description: "REST API endpoints, route handlers, middleware, request validation & CORS", proficiencyTier: "Frequent" },
      { name: "Firebase Firestore", level: 82, description: "NoSQL document collections, CRUD operations, and real-time sync listeners", proficiencyTier: "Frequent" },
      { name: "PostgreSQL & SQL", level: 78, description: "Relational queries, primary/foreign keys, joins, and schema design", proficiencyTier: "Academic / Projects" }
    ]
  },
  {
    title: "Developer Tools & Workflow",
    chakraStyle: "Tools",
    colorHex: "#06b6d4",
    colorClass: "from-cyan-500 to-blue-500 shadow-cyan-500/20",
    proficiencyLevel: "Daily Workflow",
    skills: [
      { name: "Git & GitHub", level: 88, description: "Branching, committing, pull requests, and collaborative project workflows", proficiencyTier: "Daily" },
      { name: "Vite & npm", level: 86, description: "Fast frontend bundling, script management, and local development", proficiencyTier: "Daily" },
      { name: "Postman", level: 80, description: "API endpoint testing, request inspection, and payload verification", proficiencyTier: "Frequent" }
    ]
  },
  {
    title: "Core Computer Science",
    chakraStyle: "Database",
    colorHex: "#8b5cf6",
    colorClass: "from-purple-500 to-indigo-500 shadow-purple-500/20",
    proficiencyLevel: "Coursework & Practice",
    skills: [
      { name: "Data Structures & Algorithms", level: 85, description: "Arrays, strings, linked lists, trees, recursion, sorting, and binary search", proficiencyTier: "Active Practice" },
      { name: "OOP Principles", level: 88, description: "Encapsulation, inheritance, polymorphism, abstraction, and clean class structure", proficiencyTier: "Solid Foundation" },
      { name: "DBMS Fundamentals", level: 82, description: "Relational modeling, normalization (1NF-3NF), ACID transactions, and indexing", proficiencyTier: "Coursework" }
    ]
  }
];

export const ACHIEVEMENTS_DATA: Achievement[] = [
  {
    id: "bgi-hackathon-runnerup",
    title: "Runner-Up (2nd Place) — BGI Collegiate Hackathon",
    organization: "Bansal Group of Institutes (Host Institution)",
    date: "Collegiate Hackathon (36 Hours)",
    role: "Full-Stack Developer & Team Lead",
    description: "Secured 2nd place in the collegiate hackathon hosted on campus. Built and pitched a working web MVP addressing rural direct trade within a 36-hour sprint.",
    metrics: "Ranked 2nd place • 36h sprint to working MVP",
    badgeEmoji: "🥈",
    chakraLevelHex: "#f97316",
    credentialUrl: "https://drive.google.com/file/d/16MBR3xtc_JviLm3zsVU-2ngYkDS7tpFK/view?usp=sharing",
    tags: ["Collegiate Hackathon", "Runner-Up", "Full-Stack MVP"],
    highlight: true
  },
  {
    id: "nasa-space-apps",
    title: "Global Nominee — NASA Space Apps Challenge",
    organization: "NASA Space Apps Bhopal Local Event",
    date: "48-Hour Hackathon",
    role: "Team Developer",
    description: "Selected as Global Nominee at the Bhopal local event for developing an interactive space telemetry visualization project during the 48-hour hackathon.",
    metrics: "Global Nominee, NASA Space Apps Challenge (Bhopal local event)",
    badgeEmoji: "🌍",
    chakraLevelHex: "#3b82f6",
    credentialUrl: "/certificates/img_222012.jpg",
    tags: ["Global Nominee", "Telemetry Project", "NASA Space Apps"],
    highlight: true
  },
  {
    id: "ms-hackathon",
    title: "3rd Position Award — Azure Developer Day",
    organization: "Microsoft Learn Student Ambassadors & BIST",
    date: "Campus Technical Sprint",
    role: "Participant & Prototyper",
    description: "Secured 3rd position in the hackathon sprint during Azure Developer Day organized by Microsoft Learn Student Ambassadors at BIST Bhopal.",
    metrics: "3rd Position Award • Azure Developer Day sprint",
    badgeEmoji: "🥉",
    chakraLevelHex: "#10b981",
    credentialUrl: "https://drive.google.com/file/d/17Cex6Cl_vacIZ4GYAlHssMIFxscODELR/view?usp=sharing",
    tags: ["Azure Developer Day", "3rd Position", "Cloud Prototype"],
    highlight: true
  },
  {
    id: "college-workshops-leadership",
    title: "Peer Technical Mentorship & Sessions",
    organization: "Bansal Institute of Science and Technology",
    date: "Campus Technical Mentorship",
    role: "Student Mentor",
    description: "Conducted introductory practical sessions for junior peers on Git, GitHub collaborative workflows, and foundational web development.",
    metrics: "Mentored 100+ junior students • Campus technical sessions",
    badgeEmoji: "🎙️",
    chakraLevelHex: "#8b5cf6",
    credentialUrl: "https://drive.google.com/drive/folders/1O6ZGBZJMawASa5mvnP8QgX9lp-dx77MM",
    tags: ["Peer Mentorship", "Git & GitHub", "Web Dev"],
    highlight: false
  },
  {
    id: "intercollege-coding-competitions",
    title: "Active Hackathon & Coding Competitor",
    organization: "Collegiate Coding Events",
    date: "Continuous Participation",
    role: "Builder & Competitive Coder",
    description: "Regular participant in collegiate coding marathons and algorithmic challenges, building web prototypes under tight sprint deadlines.",
    metrics: "5+ hackathons and competitive coding events completed",
    badgeEmoji: "⚡",
    chakraLevelHex: "#06b6d4",
    credentialUrl: "https://drive.google.com/drive/folders/1O6ZGBZJMawASa5mvnP8QgX9lp-dx77MM",
    tags: ["Competitive Coding", "5+ Hackathons"],
    highlight: false
  }
];

export const CERTIFICATIONS_DATA: Certification[] = [
  {
    name: "Oracle Cloud Infrastructure Certified Foundations Associate",
    issuer: "Oracle University",
    year: "2024 Certification",
    credentialUrl: "https://drive.google.com/file/d/1-0aoN5NjQLlsFIuS2Bpi5fqlmFilE4IX/view?usp=sharing",
    previewImage: "/certificates/oracle_cert.png",
    driveFileId: "1-0aoN5NjQLlsFIuS2Bpi5fqlmFilE4IX",
    category: "Cloud & Infrastructure",
    badgeColor: "border-red-500/30 text-red-400 bg-red-950/20"
  },
  {
    name: "BGI Collegiate Hackathon — Runner-Up (2nd Place)",
    issuer: "Bansal Group of Institutes (BIST)",
    year: "Collegiate Hackathon Honor",
    credentialUrl: "https://drive.google.com/file/d/16MBR3xtc_JviLm3zsVU-2ngYkDS7tpFK/view?usp=sharing",
    previewImage: "/certificates/img_221933.jpg",
    driveFileId: "16MBR3xtc_JviLm3zsVU-2ngYkDS7tpFK",
    category: "Hackathons & Awards",
    badgeColor: "border-orange-500/30 text-orange-400 bg-orange-950/20"
  },
  {
    name: "Azure Developer Day — 3rd Position Award",
    issuer: "Microsoft Learn Student Ambassadors & BIST",
    year: "Campus Hackathon Award",
    credentialUrl: "https://drive.google.com/file/d/17Cex6Cl_vacIZ4GYAlHssMIFxscODELR/view?usp=sharing",
    previewImage: "/certificates/img_222033.jpg",
    driveFileId: "17Cex6Cl_vacIZ4GYAlHssMIFxscODELR",
    category: "Hackathons & Awards",
    badgeColor: "border-cyan-500/30 text-cyan-400 bg-cyan-950/20"
  },
  {
    name: "IBM Introduction to Cloud Computing (MDL-301)",
    issuer: "IBM",
    year: "Course Completion",
    credentialUrl: "https://drive.google.com/file/d/1-5gdr-dgjHS5JndSeZCApK5HawW4I6mt/view?usp=sharing",
    previewImage: "/certificates/ibm_cert.png",
    driveFileId: "1-5gdr-dgjHS5JndSeZCApK5HawW4I6mt",
    category: "Cloud Computing",
    badgeColor: "border-blue-500/30 text-blue-400 bg-blue-950/20"
  },
  {
    name: "C++ Essentials 1",
    issuer: "Cisco Networking Academy & OpenEDG C++ Institute",
    year: "Foundations Course",
    credentialUrl: "https://drive.google.com/file/d/1-dxfwYlwdwC_1y61GzRuepdNRyUcjHYZ/view?usp=sharing",
    previewImage: "/certificates/cpp_essentials.pdf",
    driveFileId: "1-dxfwYlwdwC_1y61GzRuepdNRyUcjHYZ",
    category: "Programming & DSA",
    badgeColor: "border-emerald-500/30 text-emerald-400 bg-emerald-950/20"
  },
  {
    name: "TCS iON Career Edge — Young Professional",
    issuer: "Tata Consultancy Services (TCS iON)",
    year: "Professional Readiness Course",
    credentialUrl: "https://drive.google.com/file/d/11VOp5WOsf-ffqHE6KlGM5escuilorid8/view?usp=sharing",
    previewImage: "/certificates/screenshot_20251112.png",
    driveFileId: "11VOp5WOsf-ffqHE6KlGM5escuilorid8",
    category: "Professional Readiness",
    badgeColor: "border-purple-500/30 text-purple-400 bg-purple-950/20"
  },
  {
    name: "IEEE National Student Branch Hackathon",
    issuer: "IEEE MSB (MANIT Bhopal)",
    year: "Hackathon Participation",
    credentialUrl: "https://drive.google.com/file/d/1CLRDt9uNuffY-486upcSLqZY6dLiA9EL/view?usp=sharing",
    previewImage: "/certificates/img_222022.jpg",
    driveFileId: "1CLRDt9uNuffY-486upcSLqZY6dLiA9EL",
    category: "Hackathons & Awards",
    badgeColor: "border-teal-500/30 text-teal-400 bg-teal-950/20"
  },
  {
    name: "Google Student Ambassador Program",
    issuer: "Ministry of Education & Google Community",
    year: "Campus Program",
    credentialUrl: "https://drive.google.com/file/d/1aJXKk6ynkThr4Wq1X5g78_EgR7fNorjA/view?usp=sharing",
    previewImage: "/certificates/img_221956.jpg",
    driveFileId: "1aJXKk6ynkThr4Wq1X5g78_EgR7fNorjA",
    category: "Campus Leadership",
    badgeColor: "border-amber-500/30 text-amber-400 bg-amber-950/20"
  },
  {
    name: "Cyber Security & AI/ML Workshop",
    issuer: "Department of IT, BIST",
    year: "Department Workshop",
    credentialUrl: "https://drive.google.com/file/d/1naHAqGxd9_iPtB95_ndfFTwxgFO9DbGA/view?usp=sharing",
    previewImage: "/certificates/img_222100.jpg",
    driveFileId: "1naHAqGxd9_iPtB95_ndfFTwxgFO9DbGA",
    category: "Workshops",
    badgeColor: "border-rose-500/30 text-rose-400 bg-rose-950/20"
  },
  {
    name: "PRDV103: Professional Interviewing Skills",
    issuer: "Saylor Academy",
    year: "Cert ID: 1466613930AB",
    credentialUrl: "https://drive.google.com/file/d/1JJCwFQ3dq2Z-LSf8oroA1nO5YyzoGV6f/view?usp=sharing",
    previewImage: "/certificates/prdv103_interviewing.pdf",
    driveFileId: "1JJCwFQ3dq2Z-LSf8oroA1nO5YyzoGV6f",
    category: "Professional Skills",
    badgeColor: "border-indigo-500/30 text-indigo-400 bg-indigo-950/20"
  },
  {
    name: "PRDV004: Spreadsheets for Data Analysis",
    issuer: "Saylor Academy",
    year: "Cert ID: 2479822326AB",
    credentialUrl: "https://drive.google.com/file/d/1X8yvfbOxR3uNHS9-5T4DlmTKXhnMDVfo/view?usp=sharing",
    previewImage: "/certificates/2479822326AB.pdf",
    driveFileId: "1X8yvfbOxR3uNHS9-5T4DlmTKXhnMDVfo",
    category: "Data Analysis",
    badgeColor: "border-emerald-500/30 text-emerald-400 bg-emerald-950/20"
  },
  {
    name: "PRDV102: Technical Resume Writing",
    issuer: "Saylor Academy",
    year: "Course Certificate",
    credentialUrl: "https://drive.google.com/file/d/14RDGXxxWjA-3FvhbFf3FP6WYOIJIdxTF/view?usp=sharing",
    previewImage: "/certificates/screenshot_167.png",
    driveFileId: "14RDGXxxWjA-3FvhbFf3FP6WYOIJIdxTF",
    category: "Professional Mastery",
    badgeColor: "border-zinc-500/30 text-zinc-300 bg-zinc-900/40"
  }
];

export const ACADEMICS_DATA: AcademicRecord[] = [
  {
    title: "B.Tech – Information Technology",
    institution: "Bansal Institute of Science and Technology, Bhopal",
    duration: "2024 – 2028",
    score: "8.21 / 10 CGPA",
    details: "Core focus on Data Structures & Algorithms, Object-Oriented Programming, Database Management, and scalable Web Engineering."
  },
  {
    title: "Class XII (Higher Secondary)",
    institution: "Sri Aurobindo School, Bhopal",
    duration: "2024",
    score: "89.8%",
    details: "Physics, Chemistry, Mathematics with Computer Science foundation."
  },
  {
    title: "Class X (Secondary School)",
    institution: "Sri Aurobindo School, Bhopal",
    duration: "2022",
    score: "84.4%",
    details: "Strong foundational grounding in mathematics, analytical reasoning, and natural sciences."
  }
];
