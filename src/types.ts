export interface Project {
  id: string;
  name: string;
  title?: string; // Supports title from Firestore
  stack: string[];
  description: string;
  problemSolved: string;
  keyFeatures: string[];
  impactMetric?: string;
  starFramework?: {
    situation: string;
    task: string;
    action: string;
    result: string;
    metrics: string[];
  };
  github?: string;
  liveLink?: string;
  category?: string;
  featured?: boolean;
  image?: string | null;
  visualEmphasis?: {
    gradient: string;
    glowColor: string;
    icon: string;
  };
}

export interface SkillCategory {
  title: string;
  chakraStyle: "Core" | "Frontend" | "Backend" | "Database" | "Cloud" | "Tools";
  colorHex: string;
  colorClass: string;
  proficiencyLevel?: string;
  skills: { name: string; level: number; description: string; proficiencyTier?: string }[];
}

export interface Achievement {
  id: string;
  title: string;
  organization: string;
  date: string;
  role: string;
  description: string;
  badgeEmoji: string;
  chakraLevelHex: string;
  credentialUrl?: string;
  metrics?: string;
  tags?: string[];
  highlight?: boolean;
}

export interface Certification {
  name: string;
  issuer: string;
  year: string;
  credentialUrl?: string;
  badgeColor: string;
  previewImage?: string;
  driveFileId?: string;
  category?: string;
  credentialId?: string;
}

export interface AcademicRecord {
  title: string;
  institution: string;
  duration: string;
  score: string;
  details: string;
}
