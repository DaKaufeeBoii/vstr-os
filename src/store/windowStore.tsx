"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useReducer,
} from "react";
import type { WindowId, WindowConfig, SnapZone } from "@/types";

/* ── Window Configs ─────────────────────────────────────────────── */
export const WINDOW_CONFIGS: WindowConfig[] = [
  { id: "about",            title: "About.app",           icon: "👤", fluentIcon: "user",             defaultW: 520, defaultH: 460 },
  { id: "projects",         title: "Projects/",           icon: "📁", fluentIcon: "folder",           defaultW: 600, defaultH: 500 },
  { id: "skills",           title: "Skills.sys",          icon: "⚡", fluentIcon: "skills",           defaultW: 480, defaultH: 520 },
  { id: "experience",       title: "Experience.log",      icon: "📋", fluentIcon: "log",              defaultW: 500, defaultH: 480 },
  { id: "achievements",     title: "Achievements.txt",    icon: "🏆", fluentIcon: "trophy",           defaultW: 480, defaultH: 380 },
  { id: "terminal",         title: "Terminal",            icon: "⌨️", fluentIcon: "terminal",         defaultW: 560, defaultH: 400 },
  { id: "contact",          title: "Contact.app",         icon: "📧", fluentIcon: "mail",             defaultW: 400, defaultH: 360 },
  { id: "flappy",           title: "Flappy.exe",          icon: "🐦", fluentIcon: "game",             defaultW: 450, defaultH: 550 },
  { id: "hintmaster",       title: "HintMaster.app",      icon: "🪙", fluentIcon: "info",             defaultW: 480, defaultH: 420 },
  { id: "settings",         title: "Settings.sys",        icon: "⚙️", fluentIcon: "settings",         defaultW: 420, defaultH: 580 },
  { id: "photo_viewer",     title: "real.png",            icon: "🖼️", fluentIcon: "photo",            defaultW: 360, defaultH: 480 },
  { id: "disk_cleanup",     title: "Disk Cleanup.app",    icon: "💾", fluentIcon: "disk",             defaultW: 560, defaultH: 520 },
  { id: "desktop_pet",      title: "Desktop Pet.app",     icon: "🐾", fluentIcon: "paw",              defaultW: 460, defaultH: 380 },
  { id: "password_cracker", title: "PwnTool 3.0.app",     icon: "🔓", fluentIcon: "shield",           defaultW: 600, defaultH: 540 },
];

/* ── Types ──────────────────────────────────────────────────────── */
interface WindowState {
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

interface OSState {
  windows: WindowState[];
  topZ: number;
  // UI state
  isExposéOpen: boolean;
  isCommandPaletteOpen: boolean;
  isTerminalDrawerOpen: boolean;
}

type OSAction =
  | { type: "OPEN";       id: WindowId }
  | { type: "CLOSE";      id: WindowId }
  | { type: "MINIMIZE";   id: WindowId }
  | { type: "MAXIMIZE";   id: WindowId }
  | { type: "FOCUS";      id: WindowId }
  | { type: "RESTORE";    id: WindowId }
  | { type: "MOVE";       id: WindowId; x: number; y: number }
  | { type: "SNAP";       id: WindowId; zone: SnapZone }
  | { type: "RESIZE";     id: WindowId; width: number; height: number }
  | { type: "TOGGLE_EXPOSE" }
  | { type: "OPEN_EXPOSE" }
  | { type: "CLOSE_EXPOSE" }
  | { type: "TOGGLE_COMMAND_PALETTE" }
  | { type: "OPEN_COMMAND_PALETTE" }
  | { type: "CLOSE_COMMAND_PALETTE" }
  | { type: "TOGGLE_TERMINAL_DRAWER" }
  | { type: "OPEN_TERMINAL_DRAWER" }
  | { type: "CLOSE_TERMINAL_DRAWER" };

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
      width: cfg.defaultW,
      height: cfg.defaultH,
      hasBeenOpened: false,
      snapZone: null,
    })),
    topZ: 10,
    isExposéOpen: false,
    isCommandPaletteOpen: false,
    isTerminalDrawerOpen: false,
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
    case "MAXIMIZE": {
      const win = state.windows.find((w) => w.id === action.id);
      if (!win) return state;
      const vw = window.innerWidth;
      const vh = window.innerHeight - 48; // account for taskbar
      const newZ = state.topZ + 1;
      return {
        ...state,
        topZ: newZ,
        windows: state.windows.map((w) =>
          w.id === action.id
            ? { ...w, isMinimized: false, x: 0, y: 0, width: vw, height: vh, zIndex: newZ, snapZone: "maximize" }
            : w
        ),
      };
    }
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
          w.id === action.id ? { ...w, x: action.x, y: action.y, snapZone: null } : w
        ),
      };
    case "SNAP": {
      const { id, zone } = action;
      const win = state.windows.find((w) => w.id === id);
      if (!win || !zone) return state;
      const vw = window.innerWidth;
      const vh = window.innerHeight - 48; // account for taskbar
      let x = 0, y = 0, width = 0, height = 0;
      switch (zone) {
        case "left":      x = 0; y = 0; width = vw / 2; height = vh; break;
        case "right":     x = vw / 2; y = 0; width = vw / 2; height = vh; break;
        case "top":       x = 0; y = 0; width = vw; height = vh / 2; break;
        case "bottom":    x = 0; y = vh / 2; width = vw; height = vh / 2; break;
        case "top-left":     x = 0; y = 0; width = vw / 2; height = vh / 2; break;
        case "top-right":    x = vw / 2; y = 0; width = vw / 2; height = vh / 2; break;
        case "bottom-left":  x = 0; y = vh / 2; width = vw / 2; height = vh / 2; break;
        case "bottom-right": x = vw / 2; y = vh / 2; width = vw / 2; height = vh / 2; break;
      }
      const newZ = state.topZ + 1;
      return {
        ...state,
        topZ: newZ,
        windows: state.windows.map((w) =>
          w.id === id ? { ...w, x, y, width, height, zIndex: newZ, snapZone: zone } : w
        ),
      };
    }
    case "RESIZE":
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.id ? { ...w, width: action.width, height: action.height, snapZone: null } : w
        ),
      };
    case "TOGGLE_EXPOSE":
      return { ...state, isExposéOpen: !state.isExposéOpen };
    case "OPEN_EXPOSE":
      return { ...state, isExposéOpen: true };
    case "CLOSE_EXPOSE":
      return { ...state, isExposéOpen: false };
    case "TOGGLE_COMMAND_PALETTE":
      return { ...state, isCommandPaletteOpen: !state.isCommandPaletteOpen };
    case "OPEN_COMMAND_PALETTE":
      return { ...state, isCommandPaletteOpen: true };
    case "CLOSE_COMMAND_PALETTE":
      return { ...state, isCommandPaletteOpen: false };
    case "TOGGLE_TERMINAL_DRAWER":
      return { ...state, isTerminalDrawerOpen: !state.isTerminalDrawerOpen };
    case "OPEN_TERMINAL_DRAWER":
      return { ...state, isTerminalDrawerOpen: true };
    case "CLOSE_TERMINAL_DRAWER":
      return { ...state, isTerminalDrawerOpen: false };
    default:
      return state;
  }
}

/* ── Context ────────────────────────────────────────────────────── */
interface OSContextValue {
  windows: WindowState[];
  openWindow:    (id: WindowId) => void;
  closeWindow:   (id: WindowId) => void;
  minimizeWindow:(id: WindowId) => void;
  maximizeWindow: (id: WindowId) => void;
  restoreWindow: (id: WindowId) => void;
  focusWindow:   (id: WindowId) => void;
  moveWindow:    (id: WindowId, x: number, y: number) => void;
  snapWindow:    (id: WindowId, zone: SnapZone) => void;
  resizeWindow:  (id: WindowId, width: number, height: number) => void;
  getWindow:     (id: WindowId) => WindowState | undefined;
  // UI state
  isExposéOpen: boolean;
  isCommandPaletteOpen: boolean;
  isTerminalDrawerOpen: boolean;
  // UI actions
  toggleExposé: () => void;
  openExposé: () => void;
  closeExposé: () => void;
  toggleCommandPalette: () => void;
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
  toggleTerminalDrawer: () => void;
  openTerminalDrawer: () => void;
  closeTerminalDrawer: () => void;
}

const OSContext = createContext<OSContextValue | null>(null);

export function OSProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, buildInitial);

  const openWindow    = useCallback((id: WindowId) => dispatch({ type: "OPEN",     id }), []);
  const closeWindow   = useCallback((id: WindowId) => dispatch({ type: "CLOSE",    id }), []);
  const minimizeWindow= useCallback((id: WindowId) => dispatch({ type: "MINIMIZE", id }), []);
  const maximizeWindow= useCallback((id: WindowId) => dispatch({ type: "MAXIMIZE", id }), []);
  const restoreWindow = useCallback((id: WindowId) => dispatch({ type: "RESTORE",  id }), []);
  const focusWindow   = useCallback((id: WindowId) => dispatch({ type: "FOCUS",    id }), []);
  const moveWindow    = useCallback(
    (id: WindowId, x: number, y: number) => dispatch({ type: "MOVE", id, x, y }),
    []
  );
  const snapWindow    = useCallback(
    (id: WindowId, zone: SnapZone) => dispatch({ type: "SNAP", id, zone }),
    []
  );
  const resizeWindow  = useCallback(
    (id: WindowId, width: number, height: number) => dispatch({ type: "RESIZE", id, width, height }),
    []
  );
  const toggleExposé = useCallback(() => dispatch({ type: "TOGGLE_EXPOSE" }), []);
  const openExposé = useCallback(() => dispatch({ type: "OPEN_EXPOSE" }), []);
  const closeExposé = useCallback(() => dispatch({ type: "CLOSE_EXPOSE" }), []);
  const toggleCommandPalette = useCallback(() => dispatch({ type: "TOGGLE_COMMAND_PALETTE" }), []);
  const openCommandPalette = useCallback(() => dispatch({ type: "OPEN_COMMAND_PALETTE" }), []);
  const closeCommandPalette = useCallback(() => dispatch({ type: "CLOSE_COMMAND_PALETTE" }), []);
  const toggleTerminalDrawer = useCallback(() => dispatch({ type: "TOGGLE_TERMINAL_DRAWER" }), []);
  const openTerminalDrawer = useCallback(() => dispatch({ type: "OPEN_TERMINAL_DRAWER" }), []);
  const closeTerminalDrawer = useCallback(() => dispatch({ type: "CLOSE_TERMINAL_DRAWER" }), []);
  const getWindow = useCallback(
    (id: WindowId) => state.windows.find((w) => w.id === id),
    [state.windows]
  );

  return (
    <OSContext.Provider value={{
      windows: state.windows,
      openWindow, closeWindow, minimizeWindow, maximizeWindow, restoreWindow, focusWindow, moveWindow, snapWindow, resizeWindow, getWindow,
      isExposéOpen: state.isExposéOpen,
      isCommandPaletteOpen: state.isCommandPaletteOpen,
      isTerminalDrawerOpen: state.isTerminalDrawerOpen,
      toggleExposé, openExposé, closeExposé,
      toggleCommandPalette, openCommandPalette, closeCommandPalette,
      toggleTerminalDrawer, openTerminalDrawer, closeTerminalDrawer,
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
