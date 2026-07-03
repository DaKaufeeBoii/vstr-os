"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";
import type { WindowId, WindowConfig, OSNotification } from "@/types";
import { systemMissions } from "@/data/systemMissions";

/* ── Window Configs ─────────────────────────────────────────────── */
export const WINDOW_CONFIGS: WindowConfig[] = [
  { id: "about",            title: "About.app",           icon: "👤", defaultW: 520, defaultH: 460 },
  { id: "projects",         title: "Projects/",           icon: "📁", defaultW: 600, defaultH: 500 },
  { id: "skills",           title: "Skills.sys",          icon: "⚡", defaultW: 480, defaultH: 520 },
  { id: "experience",       title: "Experience.log",      icon: "📋", defaultW: 500, defaultH: 480 },
  { id: "achievements",     title: "Achievements.txt",    icon: "🏆", defaultW: 480, defaultH: 380 },
  { id: "terminal",         title: "Terminal",            icon: "⌨️", defaultW: 560, defaultH: 400 },
  { id: "contact",          title: "Contact.app",         icon: "📧", defaultW: 400, defaultH: 360 },
  { id: "flappy",           title: "Flappy.exe",          icon: "🐦", defaultW: 450, defaultH: 550 },
  { id: "hintmaster",       title: "HintMaster.app",      icon: "🪙", defaultW: 480, defaultH: 420 },
  { id: "settings",         title: "Settings.sys",        icon: "⚙️", defaultW: 400, defaultH: 340 },
  { id: "photo_viewer",     title: "real.png",            icon: "🖼️", defaultW: 360, defaultH: 480 },
  { id: "disk_cleanup",     title: "Disk Cleanup.app",    icon: "💾", defaultW: 560, defaultH: 520 },
  { id: "desktop_pet",      title: "Desktop Pet.app",     icon: "🐾", defaultW: 460, defaultH: 380 },
  { id: "password_cracker", title: "PwnTool 3.0.app",     icon: "🔓", defaultW: 600, defaultH: 540 },
];

/* ── Types ──────────────────────────────────────────────────────── */
export type Theme = "cyberpunk" | "retro" | "light";

const THEME_STORAGE_KEY = "vstr_theme";
const VALID_THEMES: Theme[] = ["cyberpunk", "retro", "light"];

function readStoredTheme(): Theme | null {
  if (typeof window === "undefined") return null;
  const saved = localStorage.getItem(THEME_STORAGE_KEY);
  return VALID_THEMES.includes(saved as Theme) ? (saved as Theme) : null;
}

interface WindowState {
  id: WindowId;
  isOpen: boolean;
  isMinimized: boolean;
  zIndex: number;
  x: number;
  y: number;
  hasBeenOpened?: boolean;
}

interface OSState {
  windows: WindowState[];
  topZ: number;
  theme: Theme;
  unlockedMissions: string[];
  notifications: OSNotification[];
  wallpaper: string;
}

type OSAction =
  | { type: "OPEN";     id: WindowId }
  | { type: "CLOSE";    id: WindowId }
  | { type: "MINIMIZE"; id: WindowId }
  | { type: "FOCUS";    id: WindowId }
  | { type: "RESTORE";  id: WindowId }
  | { type: "MOVE";     id: WindowId; x: number; y: number }
  | { type: "SET_THEME"; theme: Theme }
  | { type: "UNLOCK_MISSION"; missionId: string }
  | { type: "SET_MISSIONS"; missionIds: string[] }
  | { type: "SET_WALLPAPER"; wallpaper: string }
  | { type: "ADD_NOTIFICATION"; notification: OSNotification }
  | { type: "DISMISS_NOTIFICATION"; notificationId: string };

/* ── Helpers ────────────────────────────────────────────────────── */
function cascadeOffset(openCount: number) {
  const base = 80;
  const step = 30;
  return base + (openCount % 8) * step;
}

function buildInitial(): OSState {
  return {
    windows: WINDOW_CONFIGS.map((cfg) => ({
      id: cfg.id,
      isOpen: false,
      isMinimized: false,
      zIndex: 10,
      x: 0,
      y: 0,
      hasBeenOpened: false,
    })),
    topZ: 10,
    theme: "cyberpunk",
    unlockedMissions: [],
    notifications: [],
    wallpaper: "/os_wallpaper.png",
  };
}

/* ── Reducer ────────────────────────────────────────────────────── */
function reducer(state: OSState, action: OSAction): OSState {
  switch (action.type) {
    case "OPEN": {
      const newZ = state.topZ + 1;
      const openCount = state.windows.filter((w) => w.isOpen).length;
      const offset = cascadeOffset(openCount);
      return {
        ...state,
        topZ: newZ,
        windows: state.windows.map((w) =>
          w.id === action.id
            ? { ...w, isOpen: true, isMinimized: false, zIndex: newZ, x: offset, y: offset, hasBeenOpened: true }
            : w
        ),
      };
    }
    case "CLOSE":
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.id ? { ...w, isOpen: false, isMinimized: false } : w
        ),
      };
    case "MINIMIZE":
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.id ? { ...w, isMinimized: true } : w
        ),
      };
    case "RESTORE": {
      const newZ = state.topZ + 1;
      return {
        ...state,
        topZ: newZ,
        windows: state.windows.map((w) =>
          w.id === action.id ? { ...w, isMinimized: false, zIndex: newZ } : w
        ),
      };
    }
    case "FOCUS": {
      const newZ = state.topZ + 1;
      return {
        ...state,
        topZ: newZ,
        windows: state.windows.map((w) =>
          w.id === action.id ? { ...w, zIndex: newZ } : w
        ),
      };
    }
    case "MOVE":
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.id ? { ...w, x: action.x, y: action.y } : w
        ),
      };
    case "SET_THEME":
      return { ...state, theme: action.theme };
    case "UNLOCK_MISSION": {
      if (state.unlockedMissions.includes(action.missionId)) return state;
      const nextMissions = [...state.unlockedMissions, action.missionId];
      if (typeof window !== "undefined") {
        localStorage.setItem("vstr_missions", JSON.stringify(nextMissions));
      }
      return {
        ...state,
        unlockedMissions: nextMissions,
      };
    }
    case "SET_MISSIONS":
      return { ...state, unlockedMissions: action.missionIds };
    case "SET_WALLPAPER":
      if (typeof window !== "undefined") {
        localStorage.setItem("vstr_wallpaper", action.wallpaper);
      }
      return { ...state, wallpaper: action.wallpaper };
    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: [...state.notifications, action.notification],
      };
    case "DISMISS_NOTIFICATION":
      return {
        ...state,
        notifications: state.notifications.filter((n) => n.id !== action.notificationId),
      };
    default:
      return state;
  }
}

/* ── Context ────────────────────────────────────────────────────── */
interface OSContextValue {
  windows: WindowState[];
  theme: Theme;
  unlockedMissions: string[];
  notifications: OSNotification[];
  wallpaper: string;
  openWindow:    (id: WindowId) => void;
  closeWindow:   (id: WindowId) => void;
  minimizeWindow:(id: WindowId) => void;
  restoreWindow: (id: WindowId) => void;
  focusWindow:   (id: WindowId) => void;
  moveWindow:    (id: WindowId, x: number, y: number) => void;
  getWindow:     (id: WindowId) => WindowState | undefined;
  setTheme:      (theme: Theme) => void;
  unlockMission: (id: string) => void;
  setWallpaper:  (wallpaper: string) => void;
  addNotification: (title: string, description: string, icon: string) => void;
  dismissNotification: (id: string) => void;
}

const OSContext = createContext<OSContextValue | null>(null);

export function OSProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, buildInitial);

  const openWindow    = useCallback((id: WindowId) => dispatch({ type: "OPEN",     id }), []);
  const closeWindow   = useCallback((id: WindowId) => dispatch({ type: "CLOSE",    id }), []);
  const minimizeWindow= useCallback((id: WindowId) => dispatch({ type: "MINIMIZE", id }), []);
  const restoreWindow = useCallback((id: WindowId) => dispatch({ type: "RESTORE",  id }), []);
  const focusWindow   = useCallback((id: WindowId) => dispatch({ type: "FOCUS",    id }), []);
  const moveWindow    = useCallback(
    (id: WindowId, x: number, y: number) => dispatch({ type: "MOVE", id, x, y }),
    []
  );
  const getWindow = useCallback(
    (id: WindowId) => state.windows.find((w) => w.id === id),
    [state.windows]
  );

  const addNotification = useCallback((title: string, description: string, icon: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    const notification: OSNotification = { id, title, description, icon };
    dispatch({ type: "ADD_NOTIFICATION", notification });

    // Dismiss automatically after 4.5 seconds
    setTimeout(() => {
      dispatch({ type: "DISMISS_NOTIFICATION", notificationId: id });
    }, 4500);
  }, []);

  const dismissNotification = useCallback((notificationId: string) => {
    dispatch({ type: "DISMISS_NOTIFICATION", notificationId });
  }, []);

  const unlockMission = useCallback((missionId: string) => {
    if (state.unlockedMissions.includes(missionId)) return;
    dispatch({ type: "UNLOCK_MISSION", missionId });

    // Mark as notified in localStorage to prevent duplicate toast on boot
    const savedMissions = localStorage.getItem("vstr_missions");
    let parsed: string[] = [];
    if (savedMissions) {
      try {
        const p = JSON.parse(savedMissions);
        if (Array.isArray(p)) parsed = p;
      } catch (e) {}
    }
    const nextMissions = parsed.includes(missionId) ? parsed : [...parsed, missionId];
    localStorage.setItem("vstr_notified", JSON.stringify(nextMissions));

    const mission = systemMissions.find((m) => m.id === missionId);
    if (mission) {
      addNotification(mission.title, mission.description, mission.icon);
    }
  }, [state.unlockedMissions, addNotification]);

  const setTheme = useCallback((theme: Theme) => {
    dispatch({ type: "SET_THEME", theme });
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    unlockMission("theme-shifter");
  }, [unlockMission]);

  const setWallpaper = useCallback((wallpaper: string) => {
    dispatch({ type: "SET_WALLPAPER", wallpaper });
    unlockMission("wallpaper-artisan");
  }, [unlockMission]);

  // Sync state from localStorage on client-side mount (using callbacks defined above)
  useEffect(() => {
    const savedTheme = readStoredTheme();
    if (savedTheme) dispatch({ type: "SET_THEME", theme: savedTheme });

    const savedWallpaper = localStorage.getItem("vstr_wallpaper");
    if (savedWallpaper) dispatch({ type: "SET_WALLPAPER", wallpaper: savedWallpaper });

    const savedMissions = localStorage.getItem("vstr_missions");
    if (savedMissions) {
      try {
        const parsed = JSON.parse(savedMissions);
        if (Array.isArray(parsed)) {
          dispatch({ type: "SET_MISSIONS", missionIds: parsed });

          // Trigger visual notifications for any missions that were unlocked but not yet notified
          const notified = JSON.parse(localStorage.getItem("vstr_notified") ?? "[]");
          const unnotified = parsed.filter((id) => !notified.includes(id));
          if (unnotified.length > 0) {
            unnotified.forEach((id, idx) => {
              setTimeout(() => {
                const mission = systemMissions.find((m) => m.id === id);
                if (mission) {
                  addNotification(mission.title, mission.description, mission.icon);
                }
              }, 1200 + idx * 600);
            });
            localStorage.setItem("vstr_notified", JSON.stringify(parsed));
          }
        }
      } catch (e) {
        console.error("Error parsing saved missions:", e);
      }
    } else {
      localStorage.setItem("vstr_notified", "[]");
    }
  }, [addNotification]);

  return (
    <OSContext.Provider value={{
      windows: state.windows,
      theme: state.theme,
      unlockedMissions: state.unlockedMissions,
      notifications: state.notifications,
      wallpaper: state.wallpaper,
      openWindow, closeWindow, minimizeWindow, restoreWindow, focusWindow, moveWindow, getWindow,
      setTheme, unlockMission, setWallpaper, addNotification, dismissNotification,
    }}>
      {children}
    </OSContext.Provider>
  );
}

export function useOS() {
  const ctx = useContext(OSContext);
  if (!ctx) throw new Error("useOS must be used within OSProvider");
  return ctx;
}
