import React, { useState } from "react";
import { BookOpen, Award, Rocket, Cpu, Flag, Presentation, Code2 } from "lucide-react";

interface TimelineItem {
  id: string;
  category: "education" | "hackathon" | "project" | "achievement" | "milestone" | "goal";
  title: string;
  subtitle: string;
  date: string;
  role: string;
  description: string;
  icon: React.ReactNode;
}

export default function InteractiveTimeline() {
  const [filter, setFilter] = useState<"all" | "education" | "hackathon" | "achievement" | "goal">("all");

  const timelineItems: TimelineItem[] = [
    {
      id: "btech-it",
      category: "education",
      title: "B.Tech in Information Technology",
      subtitle: "Bansal Institute of Science and Technology, Bhopal",
      date: "2024 – 2028 (3rd Year)",
      role: "Academic Standing: 8.21 / 10 CGPA",
      description: "Foundational coursework in Data Structures & Algorithms, Object-Oriented Programming, Database Management Systems, and Web Technologies.",
      icon: <BookOpen className="w-4 h-4 text-blue-400" />
    },
    {
      id: "bgi-state-hackathon",
      category: "hackathon",
      title: "Runner-Up (2nd Place) — BGI Collegiate Hackathon",
      subtitle: "Bansal Group of Institutes (Host Institution)",
      date: "Collegiate Hackathon (36 Hours)",
      role: "Full-Stack Developer & Team Lead",
      description: "Secured 2nd place in the collegiate hackathon hosted on campus. Built and pitched a working web MVP addressing rural direct trade.",
      icon: <Award className="w-4 h-4 text-orange-400" />
    },
    {
      id: "nasa-challenge",
      category: "hackathon",
      title: "Global Nominee — NASA Space Apps Challenge",
      subtitle: "NASA Space Apps Bhopal Local Event",
      date: "48-Hour Hackathon",
      role: "Team Developer",
      description: "Selected as Global Nominee at the Bhopal local event for developing an interactive space telemetry visualization project.",
      icon: <Award className="w-4 h-4 text-cyan-400" />
    },
    {
      id: "ms-hackathon-podium",
      category: "hackathon",
      title: "3rd Position Award — Azure Developer Day",
      subtitle: "Microsoft Learn Student Ambassadors & BIST",
      date: "Campus Technical Sprint",
      role: "Participant & Prototyper",
      description: "Built a cloud-backed prototype during the Azure Developer Day workshop and hackathon sprint organized by Microsoft Learn Student Ambassadors.",
      icon: <Award className="w-4 h-4 text-emerald-400" />
    },
    {
      id: "college-workshops",
      category: "achievement",
      title: "Peer Technical Mentorship & Sessions",
      subtitle: "Student Activity, BIST Bhopal",
      date: "Academic Year 2024-25",
      role: "Student Mentor",
      description: "Conducted introductory practical sessions for junior peers on Git, GitHub workflows, and foundational web development.",
      icon: <Presentation className="w-4 h-4 text-purple-400" />
    },
    {
      id: "spo-platform-launch",
      category: "project",
      title: "SPO — Direct Farmer Trade Platform",
      subtitle: "Direct-to-Buyer Web Prototype",
      date: "Deployed Demo",
      role: "Full-Stack Developer",
      description: "Built a web tool connecting farmers directly with local buyers at benchmark mandi rates with instant printable receipts. Deployed on Vercel.",
      icon: <Rocket className="w-4 h-4 text-emerald-400" />
    },
    {
      id: "voltpath-launch",
      category: "project",
      title: "VoltPath AI — EV Station Locator",
      subtitle: "EV Charging Slot Reservation Prototype",
      date: "Interactive Demo",
      role: "Full-Stack Developer",
      description: "Built a prototype charging station locator with simulated slot reservations, reducing simulated driver queue times by 45%.",
      icon: <Cpu className="w-4 h-4 text-cyan-400" />
    },
    {
      id: "engineering-objective",
      category: "goal",
      title: "Software Engineering Internship Target",
      subtitle: "Web Development & Problem Solving",
      date: "Active Goal",
      role: "Candidate for SWE Internships",
      description: "Seeking practical software engineering internship opportunities to contribute in frontend (React/TypeScript) and backend (Node/Express) teams.",
      icon: <Code2 className="w-4 h-4 text-amber-400" />
    }
  ];

  const filteredItems = filter === "all"
    ? timelineItems
    : timelineItems.filter(item => {
        if (filter === "hackathon") return item.category === "hackathon" || item.category === "project";
        return item.category === filter;
      });

  return (
    <div className="w-full space-y-8 relative text-left">
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-mono tracking-wider transition-all cursor-pointer ${
            filter === "all"
              ? "bg-orange-500 text-zinc-950 font-bold"
              : "bg-zinc-950/70 text-zinc-300 border border-white/10 hover:text-white"
          }`}
        >
          All Timeline ({timelineItems.length})
        </button>

        <button
          type="button"
          onClick={() => setFilter("hackathon")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-mono tracking-wider transition-all cursor-pointer ${
            filter === "hackathon"
              ? "bg-orange-500 text-zinc-950 font-bold"
              : "bg-zinc-950/70 text-zinc-300 border border-white/10 hover:text-white"
          }`}
        >
          Hackathons & Projects
        </button>

        <button
          type="button"
          onClick={() => setFilter("education")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-mono tracking-wider transition-all cursor-pointer ${
            filter === "education"
              ? "bg-orange-500 text-zinc-950 font-bold"
              : "bg-zinc-950/70 text-zinc-300 border border-white/10 hover:text-white"
          }`}
        >
          Education
        </button>

        <button
          type="button"
          onClick={() => setFilter("goal")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-mono tracking-wider transition-all cursor-pointer ${
            filter === "goal"
              ? "bg-orange-500 text-zinc-950 font-bold"
              : "bg-zinc-950/70 text-zinc-300 border border-white/10 hover:text-white"
          }`}
        >
          Career Goals
        </button>
      </div>

      {/* Timeline Stream */}
      <div className="relative pl-6 sm:pl-8 border-l border-white/10 space-y-8">
        {filteredItems.map((item) => (
          <div key={item.id} className="relative group">
            {/* Timeline node icon */}
            <div className="absolute -left-[35px] sm:-left-[43px] top-1 p-2 bg-zinc-950 border border-white/15 rounded-full flex items-center justify-center group-hover:border-orange-500 transition-colors">
              {item.icon}
            </div>

            {/* Card Content */}
            <div className="p-5 sm:p-6 bg-zinc-950/80 border border-white/10 rounded-2xl space-y-2 hover:border-orange-500/30 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-xs font-mono uppercase tracking-wider text-orange-400 font-semibold">
                  {item.subtitle}
                </span>
                <span className="text-xs font-mono text-zinc-400">
                  {item.date}
                </span>
              </div>

              <h3 className="font-space font-bold text-lg text-white">
                {item.title}
              </h3>

              <p className="text-xs font-mono text-zinc-300">
                {item.role}
              </p>

              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-jakarta pt-1">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
