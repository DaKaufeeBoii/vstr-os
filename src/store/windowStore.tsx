"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useReducer,
} from "react";
import type { WindowId, WindowConfig, SnapZone, Workspace, WindowState } from "@/types";

/* ── Window Configs ─────────────────────────────────────────────── */
export const WINDOW_CONFIGS: WindowConfig[] = [
  { id: "about",            title: "About.app",           icon: "👤", fluentIcon: "user",             defaultW: 520, defaultH: 460 },
  { id: "projects",         title: "Projects/",           icon: "📁", fluentIcon: "folder",           defaultW: 600, defaultH: 500 },
  { id: "skills",           title: "Skills.sys",          icon: "⚡", fluentIcon: "skills",           defaultW: 480, defaultH: 520 },
  { id: "experience",       title: "Experience.log",      icon: "📋", fluentIcon: "log",              defaultW: 500, defaultH: 480 },
  { id: "achievements",     title: "Achievements.txt",    icon: "🏆", fluentIcon: "trophy",           defaultW: 480, defaultH: 380 },
  { id: "terminal",         title: "Terminal",            icon: "⌨️", fluentIcon: "terminal",         defaultW: 580, defaultH: 420, allowMultipleInstances: true },
  { id: "notepad",          title: "Notepad.app",         icon: "📝", fluentIcon: "document",         defaultW: 540, defaultH: 450, allowMultipleInstances: true },
  { id: "guestbook",        title: "Guestbook.app",       icon: "💬", fluentIcon: "chat",             defaultW: 580, defaultH: 520 },
  { id: "contact",          title: "Contact.app",         icon: "📧", fluentIcon: "mail",             defaultW: 400, defaultH: 360 },
  { id: "flappy",           title: "Flappy.exe",          icon: "🐦", fluentIcon: "game",             defaultW: 450, defaultH: 550 },
  { id: "hintmaster",       title: "HintMaster.app",      icon: "🪙", fluentIcon: "info",             defaultW: 480, defaultH: 420 },
  { id: "settings",         title: "Settings.sys",        icon: "⚙️", fluentIcon: "settings",         defaultW: 420, defaultH: 580 },
  { id: "photo_viewer",     title: "real.png",            icon: "🖼️", fluentIcon: "photo",            defaultW: 360, defaultH: 480 },
  { id: "disk_cleanup",     title: "Disk Cleanup.app",    icon: "💾", fluentIcon: "disk",             defaultW: 560, defaultH: 520 },
  { id: "desktop_pet",      title: "Desktop Pet.app",     icon: "🐾", fluentIcon: "paw",              defaultW: 460, defaultH: 380 },
  { id: "password_cracker", title: "PwnTool 3.0.app",     icon: "🔓", fluentIcon: "shield",           defaultW: 600, defaultH: 540 },
];

/* ── Workspaces ──────────────────────────────────────────────────── */
export const DEFAULT_WORKSPACES: Workspace[] = [
  { id: 0, name: "Desktop 1" },
  { id: 1, name: "Desktop 2" },
];

/* ── Types ──────────────────────────────────────────────────────── */
export interface OSState {
  windows: WindowState[];
  topZ: number;
  stack: string[]; // Z-index stack of instanceIds
  workspaces: Workspace[];
  activeWorkspaceId: number;
  // UI state
  isExposéOpen: boolean;
  isCommandPaletteOpen: boolean;
  isTerminalDrawerOpen: boolean;
  isWidgetBoardOpen: boolean;
}

export type OpenWindowTarget =
  | WindowId
  | {
      id: WindowId;
      instanceId?: string;
      title?: string;
      desktopId?: number;
      customData?: Record<string, any>;
    };

export type OSAction =
  | { type: "OPEN"; target: OpenWindowTarget }
  | { type: "CLOSE"; instanceId: string }
  | { type: "MINIMIZE"; instanceId: string }
  | { type: "MAXIMIZE"; instanceId: string }
  | { type: "FOCUS"; instanceId: string }
  | { type: "RESTORE"; instanceId: string }
  | { type: "MOVE"; instanceId: string; x: number; y: number }
  | { type: "SNAP"; instanceId: string; zone: SnapZone }
  | { type: "RESIZE"; instanceId: string; width: number; height: number }
  | { type: "SET_TITLE"; instanceId: string; title: string }
  | { type: "SWITCH_WORKSPACE"; workspaceId: number }
  | { type: "ADD_WORKSPACE"; name?: string }
  | { type: "REMOVE_WORKSPACE"; workspaceId: number }
  | { type: "MOVE_TO_WORKSPACE"; instanceId: string; workspaceId: number }
  | { type: "TOGGLE_EXPOSE" }
  | { type: "OPEN_EXPOSE" }
  | { type: "CLOSE_EXPOSE" }
  | { type: "TOGGLE_COMMAND_PALETTE" }
  | { type: "OPEN_COMMAND_PALETTE" }
  | { type: "CLOSE_COMMAND_PALETTE" }
  | { type: "TOGGLE_TERMINAL_DRAWER" }
  | { type: "OPEN_TERMINAL_DRAWER" }
  | { type: "CLOSE_TERMINAL_DRAWER" }
  | { type: "TOGGLE_WIDGET_BOARD" }
  | { type: "OPEN_WIDGET_BOARD" }
  | { type: "CLOSE_WIDGET_BOARD" };

/* ── Helpers ────────────────────────────────────────────────────── */
let instanceCounter = 0;
function generateInstanceId(appId: WindowId): string {
  instanceCounter += 1;
  return `${appId}-${instanceCounter}`;
}

function cascadeOffset(openCount: number) {
  const base = 80;
  const step = 30;
  return base + (openCount % 8) * step;
}

function buildInitial(): OSState {
  return {
    windows: WINDOW_CONFIGS.map((cfg) => ({
      instanceId: cfg.id,
      id: cfg.id,
      title: cfg.title,
      isOpen: false,
      isMinimized: false,
      zIndex: 10,
      x: 0,
      y: 0,
      width: cfg.defaultW,
      height: cfg.defaultH,
      hasBeenOpened: false,
      snapZone: null,
      desktopId: 0,
      isSticky: false,
    })),
    topZ: 10,
    stack: [],
    workspaces: DEFAULT_WORKSPACES,
    activeWorkspaceId: 0,
    isExposéOpen: false,
    isCommandPaletteOpen: false,
    isTerminalDrawerOpen: false,
    isWidgetBoardOpen: false,
  };
}

function bringToFront(stack: string[], instanceId: string): string[] {
  return [...stack.filter((w) => w !== instanceId), instanceId];
}

/* ── Reducer ────────────────────────────────────────────────────── */
function reducer(state: OSState, action: OSAction): OSState {
  switch (action.type) {
    case "OPEN": {
      const target = action.target;
      const appId: WindowId = typeof target === "string" ? target : target.id;
      const explicitInstanceId = typeof target === "object" ? target.instanceId : undefined;
      const customTitle = typeof target === "object" ? target.title : undefined;
      const customData = typeof target === "object" ? target.customData : undefined;
      const cfg = WINDOW_CONFIGS.find((c) => c.id === appId);
      const allowMultiple = cfg?.allowMultipleInstances ?? false;

      const newZ = state.topZ + 1;
      const openCount = state.windows.filter((w) => w.isOpen).length;
      const offset = cascadeOffset(openCount);
      const currentWorkspace =
        typeof target === "object" && target.desktopId !== undefined
          ? target.desktopId
          : state.activeWorkspaceId;

      // 1. If explicit instanceId provided, check if it already exists
      if (explicitInstanceId) {
        const existing = state.windows.find((w) => w.instanceId === explicitInstanceId);
        if (existing) {
          return {
            ...state,
            topZ: newZ,
            stack: bringToFront(state.stack, explicitInstanceId),
            windows: state.windows.map((w) =>
              w.instanceId === explicitInstanceId
                ? {
                    ...w,
                    isOpen: true,
                    isMinimized: false,
                    zIndex: newZ,
                    desktopId: currentWorkspace,
                    ...(customTitle ? { title: customTitle } : {}),
                    ...(customData ? { customData: { ...w.customData, ...customData } } : {}),
                  }
                : w
            ),
          };
        }
      }

      // 2. If single-instance app:
      if (!allowMultiple) {
        const existing = state.windows.find((w) => w.id === appId);
        const targetInstanceId = existing?.instanceId || appId;
        if (existing) {
          return {
            ...state,
            topZ: newZ,
            stack: bringToFront(state.stack, targetInstanceId),
            windows: state.windows.map((w) =>
              w.instanceId === targetInstanceId
                ? {
                    ...w,
                    isOpen: true,
                    isMinimized: false,
                    zIndex: newZ,
                    x: w.hasBeenOpened ? w.x : offset,
                    y: w.hasBeenOpened ? w.y : offset,
                    hasBeenOpened: true,
                    desktopId: currentWorkspace,
                    ...(customTitle ? { title: customTitle } : {}),
                    ...(customData ? { customData: { ...w.customData, ...customData } } : {}),
                  }
                : w
            ),
          };
        }
      }

      // 3. Multi-instance app OR newly created instance:
      const defaultSlot = state.windows.find((w) => w.instanceId === appId && !w.isOpen);
      let instanceId = explicitInstanceId;
      if (!instanceId) {
        if (defaultSlot) {
          instanceId = appId;
        } else {
          instanceId = generateInstanceId(appId);
        }
      }

      const existingSlot = state.windows.find((w) => w.instanceId === instanceId);
      if (existingSlot) {
        return {
          ...state,
          topZ: newZ,
          stack: bringToFront(state.stack, instanceId),
          windows: state.windows.map((w) =>
            w.instanceId === instanceId
              ? {
                  ...w,
                  isOpen: true,
                  isMinimized: false,
                  zIndex: newZ,
                  x: offset,
                  y: offset,
                  hasBeenOpened: true,
                  desktopId: currentWorkspace,
                  ...(customTitle ? { title: customTitle } : {}),
                  ...(customData ? { customData: { ...w.customData, ...customData } } : {}),
                }
              : w
          ),
        };
      }

      // Fresh instance
      const newWindow: WindowState = {
        instanceId,
        id: appId,
        title: customTitle || cfg?.title || appId,
        isOpen: true,
        isMinimized: false,
        zIndex: newZ,
        x: offset,
        y: offset,
        width: cfg?.defaultW ?? 500,
        height: cfg?.defaultH ?? 420,
        hasBeenOpened: true,
        snapZone: null,
        desktopId: currentWorkspace,
        isSticky: false,
        customData,
      };

      return {
        ...state,
        topZ: newZ,
        stack: bringToFront(state.stack, instanceId),
        windows: [...state.windows, newWindow],
      };
    }

    case "CLOSE": {
      const targetId = action.instanceId;
      return {
        ...state,
        stack: state.stack.filter((id) => id !== targetId),
        windows: state.windows.filter((w) => {
          if (w.instanceId === targetId || w.id === targetId) {
            if (w.instanceId !== w.id) {
              return false; // dynamic multi-instance is pruned
            }
            w.isOpen = false;
            w.isMinimized = false;
            return true;
          }
          return true;
        }),
      };
    }

    case "MINIMIZE":
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.instanceId === action.instanceId || w.id === action.instanceId
            ? { ...w, isMinimized: true }
            : w
        ),
      };

    case "MAXIMIZE": {
      const targetId = action.instanceId;
      const win = state.windows.find((w) => w.instanceId === targetId || w.id === targetId);
      if (!win) return state;
      const vw = typeof window !== "undefined" ? window.innerWidth : 1200;
      const vh = typeof window !== "undefined" ? window.innerHeight - 48 : 800;
      const newZ = state.topZ + 1;
      const actualInstanceId = win.instanceId;
      return {
        ...state,
        topZ: newZ,
        stack: bringToFront(state.stack, actualInstanceId),
        windows: state.windows.map((w) =>
          w.instanceId === actualInstanceId
            ? { ...w, isMinimized: false, x: 0, y: 0, width: vw, height: vh, zIndex: newZ, snapZone: "maximize" }
            : w
        ),
      };
    }

    case "RESTORE": {
      const targetId = action.instanceId;
      const win = state.windows.find((w) => w.instanceId === targetId || w.id === targetId);
      if (!win) return state;
      const newZ = state.topZ + 1;
      const actualInstanceId = win.instanceId;
      return {
        ...state,
        topZ: newZ,
        stack: bringToFront(state.stack, actualInstanceId),
        windows: state.windows.map((w) =>
          w.instanceId === actualInstanceId ? { ...w, isMinimized: false, zIndex: newZ } : w
        ),
      };
    }

    case "FOCUS": {
      const targetId = action.instanceId;
      const win = state.windows.find((w) => w.instanceId === targetId || w.id === targetId);
      if (!win) return state;
      const newZ = state.topZ + 1;
      const actualInstanceId = win.instanceId;
      return {
        ...state,
        topZ: newZ,
        stack: bringToFront(state.stack, actualInstanceId),
        windows: state.windows.map((w) =>
          w.instanceId === actualInstanceId ? { ...w, zIndex: newZ } : w
        ),
      };
    }

    case "MOVE":
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.instanceId === action.instanceId || w.id === action.instanceId
            ? { ...w, x: action.x, y: action.y, snapZone: null }
            : w
        ),
      };

    case "SNAP": {
      const { instanceId, zone } = action;
      const win = state.windows.find((w) => w.instanceId === instanceId || w.id === instanceId);
      if (!win || !zone) return state;
      const vw = typeof window !== "undefined" ? window.innerWidth : 1200;
      const vh = typeof window !== "undefined" ? window.innerHeight - 48 : 800;
      let x = 0, y = 0, width = 0, height = 0;
      switch (zone) {
        case "left":         x = 0; y = 0; width = vw / 2; height = vh; break;
        case "right":        x = vw / 2; y = 0; width = vw / 2; height = vh; break;
        case "top":          x = 0; y = 0; width = vw; height = vh / 2; break;
        case "bottom":       x = 0; y = vh / 2; width = vw; height = vh / 2; break;
        case "top-left":     x = 0; y = 0; width = vw / 2; height = vh / 2; break;
        case "top-right":    x = vw / 2; y = 0; width = vw / 2; height = vh / 2; break;
        case "bottom-left":  x = 0; y = vh / 2; width = vw / 2; height = vh / 2; break;
        case "bottom-right": x = vw / 2; y = vh / 2; width = vw / 2; height = vh / 2; break;
      }
      const newZ = state.topZ + 1;
      const actualInstanceId = win.instanceId;
      return {
        ...state,
        topZ: newZ,
        stack: bringToFront(state.stack, actualInstanceId),
        windows: state.windows.map((w) =>
          w.instanceId === actualInstanceId
            ? { ...w, x, y, width, height, zIndex: newZ, snapZone: zone }
            : w
        ),
      };
    }

    case "RESIZE":
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.instanceId === action.instanceId || w.id === action.instanceId
            ? { ...w, width: action.width, height: action.height, snapZone: null }
            : w
        ),
      };

    case "SET_TITLE":
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.instanceId === action.instanceId || w.id === action.instanceId
            ? { ...w, title: action.title }
            : w
        ),
      };

    case "SWITCH_WORKSPACE":
      return { ...state, activeWorkspaceId: action.workspaceId };

    case "ADD_WORKSPACE": {
      const newId = state.workspaces.length > 0 ? Math.max(...state.workspaces.map((w) => w.id)) + 1 : 0;
      const name = action.name || `Desktop ${newId + 1}`;
      return {
        ...state,
        workspaces: [...state.workspaces, { id: newId, name }],
        activeWorkspaceId: newId,
      };
    }

    case "REMOVE_WORKSPACE": {
      if (state.workspaces.length <= 1) return state;
      const remaining = state.workspaces.filter((w) => w.id !== action.workspaceId);
      const fallbackId = remaining[0].id;
      return {
        ...state,
        workspaces: remaining,
        activeWorkspaceId:
          state.activeWorkspaceId === action.workspaceId ? fallbackId : state.activeWorkspaceId,
        windows: state.windows.map((w) =>
          w.desktopId === action.workspaceId ? { ...w, desktopId: fallbackId } : w
        ),
      };
    }

    case "MOVE_TO_WORKSPACE":
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.instanceId === action.instanceId || w.id === action.instanceId
            ? { ...w, desktopId: action.workspaceId }
            : w
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

    case "TOGGLE_WIDGET_BOARD":
      return { ...state, isWidgetBoardOpen: !state.isWidgetBoardOpen };
    case "OPEN_WIDGET_BOARD":
      return { ...state, isWidgetBoardOpen: true };
    case "CLOSE_WIDGET_BOARD":
      return { ...state, isWidgetBoardOpen: false };

    default:
      return state;
  }
}

/* ── Context ────────────────────────────────────────────────────── */
export interface OSContextValue {
  windows: WindowState[];
  stack: string[];
  workspaces: Workspace[];
  activeWorkspaceId: number;
  openWindow: (target: OpenWindowTarget) => void;
  closeWindow: (instanceId: string) => void;
  minimizeWindow: (instanceId: string) => void;
  maximizeWindow: (instanceId: string) => void;
  restoreWindow: (instanceId: string) => void;
  focusWindow: (instanceId: string) => void;
  moveWindow: (instanceId: string, x: number, y: number) => void;
  snapWindow: (instanceId: string, zone: SnapZone) => void;
  resizeWindow: (instanceId: string, width: number, height: number) => void;
  setWindowTitle: (instanceId: string, title: string) => void;
  getWindow: (idOrInstanceId: string) => WindowState | undefined;
  getWindowsByApp: (appId: WindowId) => WindowState[];
  // Workspaces
  switchWorkspace: (workspaceId: number) => void;
  addWorkspace: (name?: string) => void;
  removeWorkspace: (workspaceId: number) => void;
  moveWindowToWorkspace: (instanceId: string, workspaceId: number) => void;
  // UI state
  isExposéOpen: boolean;
  isCommandPaletteOpen: boolean;
  isTerminalDrawerOpen: boolean;
  isWidgetBoardOpen: boolean;
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
  toggleWidgetBoard: () => void;
  openWidgetBoard: () => void;
  closeWidgetBoard: () => void;
}

const OSContext = createContext<OSContextValue | null>(null);

export function OSProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, buildInitial);

  const openWindow = useCallback(
    (target: OpenWindowTarget) => dispatch({ type: "OPEN", target }),
    []
  );
  const closeWindow = useCallback(
    (instanceId: string) => dispatch({ type: "CLOSE", instanceId }),
    []
  );
  const minimizeWindow = useCallback(
    (instanceId: string) => dispatch({ type: "MINIMIZE", instanceId }),
    []
  );
  const maximizeWindow = useCallback(
    (instanceId: string) => dispatch({ type: "MAXIMIZE", instanceId }),
    []
  );
  const restoreWindow = useCallback(
    (instanceId: string) => dispatch({ type: "RESTORE", instanceId }),
    []
  );
  const focusWindow = useCallback(
    (instanceId: string) => dispatch({ type: "FOCUS", instanceId }),
    []
  );
  const moveWindow = useCallback(
    (instanceId: string, x: number, y: number) =>
      dispatch({ type: "MOVE", instanceId, x, y }),
    []
  );
  const snapWindow = useCallback(
    (instanceId: string, zone: SnapZone) =>
      dispatch({ type: "SNAP", instanceId, zone }),
    []
  );
  const resizeWindow = useCallback(
    (instanceId: string, width: number, height: number) =>
      dispatch({ type: "RESIZE", instanceId, width, height }),
    []
  );
  const setWindowTitle = useCallback(
    (instanceId: string, title: string) =>
      dispatch({ type: "SET_TITLE", instanceId, title }),
    []
  );
  const switchWorkspace = useCallback(
    (workspaceId: number) => dispatch({ type: "SWITCH_WORKSPACE", workspaceId }),
    []
  );
  const addWorkspace = useCallback(
    (name?: string) => dispatch({ type: "ADD_WORKSPACE", name }),
    []
  );
  const removeWorkspace = useCallback(
    (workspaceId: number) => dispatch({ type: "REMOVE_WORKSPACE", workspaceId }),
    []
  );
  const moveWindowToWorkspace = useCallback(
    (instanceId: string, workspaceId: number) =>
      dispatch({ type: "MOVE_TO_WORKSPACE", instanceId, workspaceId }),
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

  const toggleWidgetBoard = useCallback(() => dispatch({ type: "TOGGLE_WIDGET_BOARD" }), []);
  const openWidgetBoard = useCallback(() => dispatch({ type: "OPEN_WIDGET_BOARD" }), []);
  const closeWidgetBoard = useCallback(() => dispatch({ type: "CLOSE_WIDGET_BOARD" }), []);

  const getWindow = useCallback(
    (idOrInstanceId: string) =>
      state.windows.find(
        (w) => w.instanceId === idOrInstanceId || w.id === idOrInstanceId
      ),
    [state.windows]
  );

  const getWindowsByApp = useCallback(
    (appId: WindowId) => state.windows.filter((w) => w.id === appId),
    [state.windows]
  );

  return (
    <OSContext.Provider
      value={{
        windows: state.windows,
        stack: state.stack,
        workspaces: state.workspaces,
        activeWorkspaceId: state.activeWorkspaceId,
        openWindow,
        closeWindow,
        minimizeWindow,
        maximizeWindow,
        restoreWindow,
        focusWindow,
        moveWindow,
        snapWindow,
        resizeWindow,
        setWindowTitle,
        getWindow,
        getWindowsByApp,
        switchWorkspace,
        addWorkspace,
        removeWorkspace,
        moveWindowToWorkspace,
        isExposéOpen: state.isExposéOpen,
        isCommandPaletteOpen: state.isCommandPaletteOpen,
        isTerminalDrawerOpen: state.isTerminalDrawerOpen,
        isWidgetBoardOpen: state.isWidgetBoardOpen,
        toggleExposé,
        openExposé,
        closeExposé,
        toggleCommandPalette,
        openCommandPalette,
        closeCommandPalette,
        toggleTerminalDrawer,
        openTerminalDrawer,
        closeTerminalDrawer,
        toggleWidgetBoard,
        openWidgetBoard,
        closeWidgetBoard,
      }}
    >
      {children}
    </OSContext.Provider>
  );
}

export function useOS() {
  const ctx = useContext(OSContext);
  if (!ctx) throw new Error("useOS must be used within OSProvider");
  return ctx;
}
