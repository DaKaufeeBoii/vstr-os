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
    fluentIcon: "chat",
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
