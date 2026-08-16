export interface Project {
  title: string;
  subtitle: string;
  description: string;
  highlights?: string[];
  stack: string[];
  github?: string;
  demo?: string;
  icon: string;
}

export interface SkillCategory {
  title: string;
  icon: string;
  skills: { name: string }[];
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

export interface SystemMission {
  id: string;
  title: string;
  description: string;
  icon: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

export interface OSNotification {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export type WindowId =
  | "about"
  | "projects"
  | "skills"
  | "experience"
  | "achievements"
  | "terminal"
  | "contact"
  | "flappy"
  | "hintmaster"
  | "settings"
  | "photo_viewer"
  | "disk_cleanup"
  | "desktop_pet"
  | "password_cracker";

export interface WindowConfig {
  id: WindowId;
  title: string;
  /** Legacy emoji icon — kept for backward compat */
  icon: string;
  /** Key used to look up Fluent SVG icon from the icon registry */
  fluentIcon?: string;
  defaultW: number;
  defaultH: number;
}

export type SnapZone = "left" | "right" | "top" | "bottom" | "top-left" | "top-right" | "bottom-left" | "bottom-right" | "maximize" | null;

export interface WindowState {
  id: WindowId;
  isOpen: boolean;
  isMinimized: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  hasBeenOpened: boolean;
  snapZone?: SnapZone;
}

export interface OSUIState {
  isExposéOpen: boolean;
  isCommandPaletteOpen: boolean;
  isTerminalDrawerOpen: boolean;
}