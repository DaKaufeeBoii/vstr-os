/**
 * appRegistry.ts
 *
 * In-memory and extensible registry for all VSTR-OS Applications and Plugins.
 */

import type { AppManifest } from "./appManifest";

const BUILT_IN_APPS: AppManifest[] = [
  {
    id: "terminal",
    name: "Terminal",
    version: "2.4.0",
    description: "Multi-instance POSIX terminal with bash/zsh shell, real IndexedDB VFS, and sudo elevation.",
    author: "Sai Tarun",
    category: "developer",
    icon: "💻",
    fluentIcon: "terminal",
    permissions: ["vfs:read", "vfs:write", "window:manage", "system:telemetry"],
    defaultConfig: {
      width: 720,
      height: 480,
      minWidth: 500,
      minHeight: 350,
      allowMultipleInstances: true,
    },
  },
  {
    id: "notepad",
    name: "Notepad",
    version: "1.1.0",
    description: "Windows 11 inspired text editor with persistent VFS file I/O and auto-save capabilities.",
    author: "Sai Tarun",
    category: "productivity",
    icon: "📝",
    fluentIcon: "notepad",
    permissions: ["vfs:read", "vfs:write", "notifications"],
    defaultConfig: {
      width: 680,
      height: 520,
      minWidth: 420,
      minHeight: 320,
      allowMultipleInstances: true,
    },
  },
  {
    id: "guestbook",
    name: "Guestbook",
    version: "1.0.0",
    description: "Decentralised visitor bulletin board with real-time greetings and role tagging.",
    author: "Sai Tarun",
    category: "network",
    icon: "📖",
    fluentIcon: "guestbook",
    permissions: ["notifications", "window:manage"],
    defaultConfig: {
      width: 720,
      height: 560,
      minWidth: 480,
      minHeight: 400,
      allowMultipleInstances: false,
    },
  },
  {
    id: "projects",
    name: "Projects",
    version: "2.1.0",
    description: "Interactive portfolio showcase featuring full-stack, AI, and systems engineering projects.",
    author: "Sai Tarun",
    category: "productivity",
    icon: "🚀",
    fluentIcon: "folder",
    permissions: ["window:manage"],
    defaultConfig: {
      width: 860,
      height: 580,
      minWidth: 600,
      minHeight: 400,
      allowMultipleInstances: false,
    },
  },
  {
    id: "skills",
    name: "Skills Matrix",
    version: "1.8.0",
    description: "Categorised radar and directory of languages, frameworks, cloud, and systems skills.",
    author: "Sai Tarun",
    category: "productivity",
    icon: "⚡",
    fluentIcon: "skills",
    permissions: ["window:manage"],
    defaultConfig: {
      width: 740,
      height: 540,
      minWidth: 500,
      minHeight: 380,
      allowMultipleInstances: false,
    },
  },
  {
    id: "settings",
    name: "Settings",
    version: "2.0.0",
    description: "OS-wide configuration hub for wallpapers, themes, audio, accessibility, and plugins.",
    author: "Sai Tarun",
    category: "system",
    icon: "⚙️",
    fluentIcon: "settings",
    permissions: ["notifications", "window:manage", "system:telemetry"],
    defaultConfig: {
      width: 640,
      height: 560,
      minWidth: 480,
      minHeight: 400,
      allowMultipleInstances: false,
    },
  },
  {
    id: "about",
    name: "About Me",
    version: "1.5.0",
    description: "Developer profile, bio, engineering philosophy, and background summary.",
    author: "Sai Tarun",
    category: "system",
    icon: "👤",
    fluentIcon: "user",
    permissions: ["system:telemetry"],
    defaultConfig: {
      width: 600,
      height: 500,
      minWidth: 440,
      minHeight: 350,
      allowMultipleInstances: false,
    },
  },
  {
    id: "experience",
    name: "Experience",
    version: "1.4.0",
    description: "Chronological professional career roadmap, internships, and milestones.",
    author: "Sai Tarun",
    category: "productivity",
    icon: "💼",
    fluentIcon: "briefcase",
    permissions: ["window:manage"],
    defaultConfig: {
      width: 720,
      height: 540,
      minWidth: 500,
      minHeight: 380,
      allowMultipleInstances: false,
    },
  },
  {
    id: "contact",
    name: "Contact",
    version: "1.2.0",
    description: "Instant message transmitter, social handles, and PGP encryption credentials.",
    author: "Sai Tarun",
    category: "network",
    icon: "📫",
    fluentIcon: "mail",
    permissions: ["notifications"],
    defaultConfig: {
      width: 580,
      height: 480,
      minWidth: 420,
      minHeight: 350,
      allowMultipleInstances: false,
    },
  },
  {
    id: "achievements",
    name: "Achievements",
    version: "1.0.0",
    description: "Trophy showcase of hackathon championships, competitive programming rankings, and awards.",
    author: "Sai Tarun",
    category: "productivity",
    icon: "🏆",
    fluentIcon: "trophy",
    permissions: ["window:manage"],
    defaultConfig: {
      width: 480,
      height: 380,
      minWidth: 400,
      minHeight: 320,
      allowMultipleInstances: false,
    },
  },
  {
    id: "flappy",
    name: "Flappy.exe",
    version: "1.0.0",
    description: "Canvas physics mini-game with dynamic collision detection and score tracking.",
    author: "Sai Tarun",
    category: "utilities",
    icon: "🐦",
    fluentIcon: "game",
    permissions: ["notifications"],
    defaultConfig: {
      width: 450,
      height: 550,
      minWidth: 380,
      minHeight: 450,
      allowMultipleInstances: false,
    },
  },
  {
    id: "hintmaster",
    name: "HintMaster",
    version: "1.1.0",
    description: "Interactive coin toss mini-game tracking win/loss streaks and unlocking system secrets.",
    author: "Sai Tarun",
    category: "utilities",
    icon: "🪙",
    fluentIcon: "info",
    permissions: ["notifications", "system:telemetry"],
    defaultConfig: {
      width: 480,
      height: 420,
      minWidth: 400,
      minHeight: 340,
      allowMultipleInstances: false,
    },
  },
  {
    id: "photo_viewer",
    name: "Photo Viewer",
    version: "1.0.0",
    description: "High-resolution photograph inspection and image viewing utility.",
    author: "Sai Tarun",
    category: "utilities",
    icon: "🖼️",
    fluentIcon: "photo",
    permissions: ["vfs:read"],
    defaultConfig: {
      width: 360,
      height: 480,
      minWidth: 300,
      minHeight: 380,
      allowMultipleInstances: false,
    },
  },
  {
    id: "disk_cleanup",
    name: "Disk Cleanup",
    version: "2.0.0",
    description: "Multi-phase disk repair utility featuring Quick, Deep, and Full sector diagnostics.",
    author: "Sai Tarun",
    category: "system",
    icon: "💾",
    fluentIcon: "disk",
    permissions: ["vfs:read", "vfs:write", "system:telemetry"],
    defaultConfig: {
      width: 560,
      height: 520,
      minWidth: 480,
      minHeight: 400,
      allowMultipleInstances: false,
    },
  },
  {
    id: "desktop_pet",
    name: "Desktop Pet",
    version: "1.0.0",
    description: "Animated roaming desktop companion pet reacting to cursor movements and user actions.",
    author: "Sai Tarun",
    category: "utilities",
    icon: "🐾",
    fluentIcon: "paw",
    permissions: ["notifications", "window:manage"],
    defaultConfig: {
      width: 460,
      height: 380,
      minWidth: 380,
      minHeight: 300,
      allowMultipleInstances: false,
    },
  },
  {
    id: "password_cracker",
    name: "PwnTool 3.0",
    version: "3.0.0",
    description: "Cybersecurity speed-typing terminal simulation for penetrating defended network nodes.",
    author: "Sai Tarun",
    category: "developer",
    icon: "🔓",
    fluentIcon: "shield",
    permissions: ["notifications", "system:telemetry"],
    defaultConfig: {
      width: 600,
      height: 540,
      minWidth: 500,
      minHeight: 400,
      allowMultipleInstances: false,
    },
  },
  {
    id: "app_gallery",
    name: "App Gallery",
    version: "1.0.0",
    description: "Application marketplace and manifest installer for custom VSTR-OS apps and extensions.",
    author: "Sai Tarun",
    category: "system",
    icon: "📦",
    fluentIcon: "folder",
    permissions: ["window:manage"],
    defaultConfig: {
      width: 600,
      height: 500,
      minWidth: 480,
      minHeight: 380,
      allowMultipleInstances: false,
    },
  },
  {
    id: "music_player",
    name: "Music Player",
    version: "1.0.0",
    description: "Personal audio playback for custom playlists.",
    author: "Sai Tarun",
    category: "utilities",
    icon: "🎵",
    fluentIcon: "music",
    permissions: ["window:manage"],
    defaultConfig: {
      width: 400,
      height: 350,
      minWidth: 300,
      minHeight: 300,
      allowMultipleInstances: false,
    },
  },
];

class AppRegistryManager {
  private apps: Map<string, AppManifest> = new Map();
  private listeners: Set<() => void> = new Set();

  constructor() {
    // Seed with built-in applications
    BUILT_IN_APPS.forEach((app) => this.apps.set(app.id, app));
  }

  public registerApp(manifest: AppManifest): void {
    this.apps.set(manifest.id, manifest);
    this.notify();
  }

  public unregisterApp(appId: string): boolean {
    if (BUILT_IN_APPS.some((app) => app.id === appId)) {
      // Cannot unregister built-in core applications
      return false;
    }
    const deleted = this.apps.delete(appId);
    if (deleted) this.notify();
    return deleted;
  }

  public getApp(appId: string): AppManifest | undefined {
    return this.apps.get(appId);
  }

  public listApps(): AppManifest[] {
    return Array.from(this.apps.values());
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }
}

export const appRegistry = new AppRegistryManager();
