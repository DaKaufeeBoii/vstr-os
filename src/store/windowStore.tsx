"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useReducer,
} from "react";
import type { WindowId, WindowConfig } from "@/types";

/* ── Window Configs ─────────────────────────────────────────────── */
export const WINDOW_CONFIGS: WindowConfig[] = [
  { id: "about",        title: "About.exe",        icon: "👤", defaultW: 520, defaultH: 460 },
  { id: "projects",     title: "Projects/",        icon: "📁", defaultW: 600, defaultH: 500 },
  { id: "skills",       title: "Skills.sys",       icon: "⚡", defaultW: 480, defaultH: 520 },
  { id: "experience",   title: "Experience.log",   icon: "📋", defaultW: 500, defaultH: 480 },
  { id: "achievements", title: "Achievements.txt", icon: "🏆", defaultW: 480, defaultH: 380 },
  { id: "terminal",     title: "Terminal",         icon: "⌨️", defaultW: 560, defaultH: 400 },
  { id: "contact",      title: "Contact.app",      icon: "📧", defaultW: 400, defaultH: 360 },
  { id: "flappy",       title: "Flappy.exe",       icon: "🎮", defaultW: 400, defaultH: 500 },
  { id: "hintmaster",   title: "HintMaster.exe",   icon: "🪙", defaultW: 400, defaultH: 360 },
  { id: "settings",     title: "Settings.sys",     icon: "⚙️", defaultW: 400, defaultH: 300 },
  { id: "photo_viewer", title: "real.png",         icon: "🖼️", defaultW: 360, defaultH: 480 },
];

/* ── Types ──────────────────────────────────────────────────────── */
export type Theme = "cyberpunk" | "retro" | "light";

interface WindowState {
  id: WindowId;
  isOpen: boolean;
  isMinimized: boolean;
  zIndex: number;
  x: number;
  y: number;
}

interface OSState {
  windows: WindowState[];
  topZ: number;
  theme: Theme;
}

type OSAction =
  | { type: "OPEN";     id: WindowId }
  | { type: "CLOSE";    id: WindowId }
  | { type: "MINIMIZE"; id: WindowId }
  | { type: "FOCUS";    id: WindowId }
  | { type: "RESTORE";  id: WindowId }
  | { type: "MOVE";     id: WindowId; x: number; y: number }
  | { type: "SET_THEME"; theme: Theme };

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
    })),
    topZ: 10,
    theme: "cyberpunk",
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
            ? { ...w, isOpen: true, isMinimized: false, zIndex: newZ, x: offset, y: offset }
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
    default:
      return state;
  }
}

/* ── Context ────────────────────────────────────────────────────── */
interface OSContextValue {
  windows: WindowState[];
  theme: Theme;
  openWindow:    (id: WindowId) => void;
  closeWindow:   (id: WindowId) => void;
  minimizeWindow:(id: WindowId) => void;
  restoreWindow: (id: WindowId) => void;
  focusWindow:   (id: WindowId) => void;
  moveWindow:    (id: WindowId, x: number, y: number) => void;
  getWindow:     (id: WindowId) => WindowState | undefined;
  setTheme:      (theme: Theme) => void;
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
  const setTheme = useCallback((theme: Theme) => dispatch({ type: "SET_THEME", theme }), []);

  return (
    <OSContext.Provider value={{
      windows: state.windows,
      theme: state.theme,
      openWindow, closeWindow, minimizeWindow, restoreWindow, focusWindow, moveWindow, getWindow,
      setTheme,
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
