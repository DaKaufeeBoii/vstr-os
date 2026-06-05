export interface Project {
  title: string;
  subtitle: string;
  description: string;
  stack: string[];
  github?: string;
  demo?: string;
  icon: string;
}

export interface SkillCategory {
  title: string;
  icon: string;
  skills: { name: string; level: number }[];
}

export interface Experience {
  title: string;
  organization: string;
  period: string;
  points: string[];
  type: "leadership" | "internship";
}

export interface Achievement {
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  year: string;
}

export type WindowId =
  | "about"
  | "projects"
  | "skills"
  | "experience"
  | "achievements"
  | "terminal"
  | "contact";

export interface WindowConfig {
  id: WindowId;
  title: string;
  icon: string;
  defaultW: number;
  defaultH: number;
}