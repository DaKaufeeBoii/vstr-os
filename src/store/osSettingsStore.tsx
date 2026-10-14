"use client";

/**
 * osSettingsStore.tsx
 *
 * A focused context for OS-wide personalisation state:
 *   - theme
 *   - wallpaper (static image path / base64)
 *   - videoWallpaper (live video wallpaper key)
 *   - performanceMode (pauses live video)
 *   - notifications
 *
 * Kept separate from windowStore so that changing wallpaper or opening a
 * context-menu does NOT trigger re-renders in every open Window component.
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from "react";
import type { OSNotification } from "@/types";
import { systemMissions } from "@/data/systemMissions";
import { setUiSoundVolume } from "@/utils/useSound";

/* ── Types ──────────────────────────────────────────────────────────── */
export type VideoWallpaperId = "none" | "dawn" | "lake" | "rayquaza" | "yuji-sleepy";

export interface WidgetConfig {
  id: string;
  name: string;
  visibleOnBoard: boolean;
  visibleOnDesktop: boolean;
}

interface OSSettingsState {
  wallpaper:        string;
  videoWallpaper:   VideoWallpaperId;
  performanceMode:  boolean;
  volume:           number;
  brightness:       number;
  theme:            string;
  highContrast:     boolean;
  notifications:    OSNotification[];
  unlockedMissions: string[];
  widgets:          WidgetConfig[];
}

type OSSettingsAction =
  | { type: "SET_WALLPAPER";       wallpaper: string }
  | { type: "SET_VIDEO_WALLPAPER"; videoWallpaper: VideoWallpaperId }
  | { type: "SET_PERF_MODE";       enabled: boolean }
  | { type: "SET_VOLUME";          volume: number }
  | { type: "SET_BRIGHTNESS";      brightness: number }
  | { type: "SET_THEME";           theme: string }
  | { type: "SET_HIGH_CONTRAST";   enabled: boolean }
  | { type: "ADD_NOTIFICATION";    notification: OSNotification }
  | { type: "DISMISS_NOTIFICATION"; notificationId: string }
  | { type: "CLEAR_NOTIFICATIONS" }
  | { type: "UNLOCK_MISSION";      missionId: string }
  | { type: "SET_MISSIONS";        missionIds: string[] }
  | { type: "TOGGLE_WIDGET_BOARD"; widgetId: string }
  | { type: "TOGGLE_WIDGET_DESKTOP"; widgetId: string }
  | { type: "SET_WIDGETS";         widgets: WidgetConfig[] };

/* ── Storage keys ───────────────────────────────────────────────────── */
const KEYS = {
  wallpaper:      "vstr_wallpaper",
  videoWallpaper: "vstr_video_wallpaper",
  missions:       "vstr_missions",
  notified:       "vstr_notified",
  perfMode:       "vstr_perf_mode",
  volume:         "vstr_volume",
  brightness:     "vstr_brightness",
  theme:          "vstr_theme",
  highContrast:   "vstr_high_contrast",
  widgets:        "vstr_widgets",
} as const;

const VALID_VIDEOS: VideoWallpaperId[] = ["dawn", "lake", "rayquaza", "yuji-sleepy", "none"];

/* ── Initial state ──────────────────────────────────────────────────── */
function buildInitial(): OSSettingsState {
  return {
    wallpaper:        "/wallpapers/static/os_wallpaper.png",
    videoWallpaper:   "none",
    performanceMode:  false,
    volume:           0.7,
    brightness:       0.8,
    theme:            "anime",
    highContrast:     false,
    notifications:    [],
    unlockedMissions: [],
    widgets: DEFAULT_WIDGETS,
  };
}

export const DEFAULT_WIDGETS: WidgetConfig[] = [
  { id: "spotify", name: "Spotify / Music", visibleOnBoard: true, visibleOnDesktop: true },
  { id: "github", name: "GitHub Activity", visibleOnBoard: true, visibleOnDesktop: true },
  { id: "social", name: "Dev Note / Status", visibleOnBoard: true, visibleOnDesktop: true },
  { id: "telemetry", name: "System Telemetry", visibleOnBoard: true, visibleOnDesktop: false },
  { id: "leetcode", name: "LeetCode Stats", visibleOnBoard: true, visibleOnDesktop: false },
  { id: "weather", name: "Weather", visibleOnBoard: true, visibleOnDesktop: false },
];

/* ── Reducer ────────────────────────────────────────────────────────── */
function reducer(state: OSSettingsState, action: OSSettingsAction): OSSettingsState {
  switch (action.type) {
    case "SET_WALLPAPER":
      return { ...state, wallpaper: action.wallpaper };

    case "SET_VIDEO_WALLPAPER":
      return { ...state, videoWallpaper: action.videoWallpaper };

    case "SET_PERF_MODE":
      if (typeof window !== "undefined") {
        localStorage.setItem(KEYS.perfMode, String(action.enabled));
      }
      return { ...state, performanceMode: action.enabled };

    case "SET_VOLUME": {
      const vol = Math.max(0, Math.min(1, action.volume));
      if (typeof window !== "undefined") {
        localStorage.setItem(KEYS.volume, String(vol));
      }
      return { ...state, volume: vol };
    }

    case "SET_BRIGHTNESS": {
      const bri = Math.max(0, Math.min(1, action.brightness));
      if (typeof window !== "undefined") {
        localStorage.setItem(KEYS.brightness, String(bri));
      }
      return { ...state, brightness: bri };
    }

    case "ADD_NOTIFICATION":
      return { ...state, notifications: [...state.notifications, action.notification] };

    case "DISMISS_NOTIFICATION":
      return {
        ...state,
        notifications: state.notifications.filter((n) => n.id !== action.notificationId),
      };

    case "CLEAR_NOTIFICATIONS":
      return { ...state, notifications: [] };

    case "UNLOCK_MISSION": {
      if (state.unlockedMissions.includes(action.missionId)) return state;
      const next = [...state.unlockedMissions, action.missionId];
      if (typeof window !== "undefined") {
        localStorage.setItem(KEYS.missions, JSON.stringify(next));
      }
      return { ...state, unlockedMissions: next };
    }

    case "SET_MISSIONS":
      return { ...state, unlockedMissions: Array.from(new Set(action.missionIds)) };

    case "SET_THEME":
      if (typeof window !== "undefined") {
        localStorage.setItem(KEYS.theme, action.theme);
        document.documentElement.dataset.theme = action.theme;
      }
      return { ...state, theme: action.theme, highContrast: action.theme === "high-contrast" };

    case "SET_HIGH_CONTRAST": {
      const theme = action.enabled ? "high-contrast" : "anime";
      if (typeof window !== "undefined") {
        localStorage.setItem(KEYS.highContrast, String(action.enabled));
        localStorage.setItem(KEYS.theme, theme);
        document.documentElement.dataset.theme = theme;
      }
      return { ...state, highContrast: action.enabled, theme };
    }

    case "TOGGLE_WIDGET_BOARD": {
      const nextWidgets = state.widgets.map(w => 
        w.id === action.widgetId ? { ...w, visibleOnBoard: !w.visibleOnBoard } : w
      );
      if (typeof window !== "undefined") {
        localStorage.setItem(KEYS.widgets, JSON.stringify(nextWidgets));
      }
      return { ...state, widgets: nextWidgets };
    }

    case "TOGGLE_WIDGET_DESKTOP": {
      const nextWidgets = state.widgets.map(w => 
        w.id === action.widgetId ? { ...w, visibleOnDesktop: !w.visibleOnDesktop } : w
      );
      if (typeof window !== "undefined") {
        localStorage.setItem(KEYS.widgets, JSON.stringify(nextWidgets));
      }
      return { ...state, widgets: nextWidgets };
    }

    case "SET_WIDGETS": {
      if (typeof window !== "undefined") {
        localStorage.setItem(KEYS.widgets, JSON.stringify(action.widgets));
      }
      return { ...state, widgets: action.widgets };
    }

    default:
      return state;
  }
}

/* ── Context value ──────────────────────────────────────────────────── */
interface OSSettingsContextValue {
  // State
  wallpaper:        string;
  videoWallpaper:   VideoWallpaperId;
  performanceMode:  boolean;
  volume:           number;
  brightness:       number;
  theme:            string;
  highContrast:     boolean;
  notifications:    OSNotification[];
  unlockedMissions: string[];
  widgets:          WidgetConfig[];

  // Actions
  setWallpaper:         (wallpaper: string) => void;
  setVideoWallpaper:    (videoWallpaper: VideoWallpaperId) => void;
  setPerformanceMode:   (enabled: boolean) => void;
  setVolume:            (volume: number) => void;
  setBrightness:        (brightness: number) => void;
  setTheme:             (theme: string) => void;
  setHighContrast:      (enabled: boolean) => void;
  addNotification:      (title: string, description: string, icon: string, type?: "mission" | "system") => void;
  dismissNotification:  (id: string) => void;
  clearNotifications:   () => void;
  unlockMission:        (id: string) => void;
  toggleWidgetBoard:    (widgetId: string) => void;
  toggleWidgetDesktop:  (widgetId: string) => void;
  setWidgets:           (widgets: WidgetConfig[]) => void;
}

const OSSettingsContext = createContext<OSSettingsContextValue | null>(null);

/* ── Provider ───────────────────────────────────────────────────────── */
export function OSSettingsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, buildInitial);

  /* — Deduplication & Mission Guards — */
  const recentNotificationsRef = useRef<Map<string, number>>(new Map());
  const unlockedMissionsRef = useRef<Set<string>>(new Set());
  const notifiedRef = useRef<Set<string>>(new Set());

  // Synchronize state.unlockedMissions into the ref set
  useEffect(() => {
    state.unlockedMissions.forEach((id) => unlockedMissionsRef.current.add(id));
  }, [state.unlockedMissions]);

  /* — Actions — */
  const addNotification = useCallback((
    title: string,
    description: string,
    icon: string,
    type: "mission" | "system" = "system"
  ) => {
    const key = `${title}::${description}`;
    const now = Date.now();
    const lastTime = recentNotificationsRef.current.get(key);
    // Deduplicate: If an identical notification was triggered in the last 3 seconds, ignore
    if (lastTime && now - lastTime < 3000) {
      return;
    }
    recentNotificationsRef.current.set(key, now);

    const id = Math.random().toString(36).substring(2, 9);
    const notification: OSNotification = { id, title, description, icon, type };
    dispatch({ type: "ADD_NOTIFICATION", notification });
    setTimeout(() => dispatch({ type: "DISMISS_NOTIFICATION", notificationId: id }), 4500);
  }, []);

  const dismissNotification = useCallback((notificationId: string) => {
    dispatch({ type: "DISMISS_NOTIFICATION", notificationId });
  }, []);

  const clearNotifications = useCallback(() => {
    dispatch({ type: "CLEAR_NOTIFICATIONS" });
  }, []);

  const unlockMission = useCallback((missionId: string) => {
    // 1. Immediate in-memory check to prevent duplicates in current session / racing calls
    if (unlockedMissionsRef.current.has(missionId) || notifiedRef.current.has(missionId)) {
      return;
    }

    // 2. Check localStorage to prevent unlocking already-completed missions across reloads
    try {
      const saved = JSON.parse(localStorage.getItem(KEYS.missions) ?? "[]");
      if (Array.isArray(saved) && saved.includes(missionId)) {
        unlockedMissionsRef.current.add(missionId);
        notifiedRef.current.add(missionId);
        return;
      }
    } catch {}

    // Mark immediately to synchronously block subsequent calls in this tick
    unlockedMissionsRef.current.add(missionId);
    notifiedRef.current.add(missionId);

    dispatch({ type: "UNLOCK_MISSION", missionId });

    try {
      const savedMissions = localStorage.getItem(KEYS.missions);
      let parsed: string[] = [];
      try { const p = JSON.parse(savedMissions ?? "[]"); if (Array.isArray(p)) parsed = p; } catch {}
      const nextMissions = parsed.includes(missionId) ? parsed : [...parsed, missionId];
      localStorage.setItem(KEYS.missions, JSON.stringify(nextMissions));
      localStorage.setItem(KEYS.notified, JSON.stringify(nextMissions));
    } catch {}

    const mission = systemMissions.find((m) => m.id === missionId);
    if (mission) {
      addNotification(mission.title, mission.description, mission.icon, "mission");
    }
  }, [addNotification]);

  const setWallpaper = useCallback((wallpaper: string) => {
    dispatch({ type: "SET_WALLPAPER", wallpaper });
    localStorage.setItem(KEYS.wallpaper, wallpaper);
    unlockMission("wallpaper-artisan");
  }, [unlockMission]);

  const setVideoWallpaper = useCallback((videoWallpaper: VideoWallpaperId) => {
    dispatch({ type: "SET_VIDEO_WALLPAPER", videoWallpaper });
    localStorage.setItem(KEYS.videoWallpaper, videoWallpaper);
    unlockMission("wallpaper-artisan");
  }, [unlockMission]);

  const setPerformanceMode = useCallback((enabled: boolean) => {
    dispatch({ type: "SET_PERF_MODE", enabled });
  }, []);

  const setVolume = useCallback((volume: number) => {
    dispatch({ type: "SET_VOLUME", volume });
    setUiSoundVolume(volume);
  }, []);

  const setBrightness = useCallback((brightness: number) => {
    dispatch({ type: "SET_BRIGHTNESS", brightness });
  }, []);

  const setTheme = useCallback((theme: string) => {
    dispatch({ type: "SET_THEME", theme });
  }, []);

  const setHighContrast = useCallback((enabled: boolean) => {
    dispatch({ type: "SET_HIGH_CONTRAST", enabled });
  }, []);

  const toggleWidgetBoard = useCallback((widgetId: string) => {
    dispatch({ type: "TOGGLE_WIDGET_BOARD", widgetId });
  }, []);

  const toggleWidgetDesktop = useCallback((widgetId: string) => {
    dispatch({ type: "TOGGLE_WIDGET_DESKTOP", widgetId });
  }, []);

  const setWidgets = useCallback((widgets: WidgetConfig[]) => {
    dispatch({ type: "SET_WIDGETS", widgets });
  }, []);

  /* — Hydrate from localStorage on mount — */
  useEffect(() => {
    // Wallpaper
    const savedWallpaper = localStorage.getItem(KEYS.wallpaper);
    if (savedWallpaper) dispatch({ type: "SET_WALLPAPER", wallpaper: savedWallpaper });

    // Video Wallpaper
    const savedVideo = localStorage.getItem(KEYS.videoWallpaper) as VideoWallpaperId | null;
    if (savedVideo && VALID_VIDEOS.includes(savedVideo)) {
      dispatch({ type: "SET_VIDEO_WALLPAPER", videoWallpaper: savedVideo });
    }

    // Widgets
    const savedWidgets = localStorage.getItem(KEYS.widgets);
    const MIGRATION_KEY = "vstr_widgets_v2_migrated";
    const hasMigrated = localStorage.getItem(MIGRATION_KEY);

    if (savedWidgets) {
      try {
        const parsed = JSON.parse(savedWidgets);
        if (Array.isArray(parsed)) {
          const merged = DEFAULT_WIDGETS.map((def) => {
            const existing = parsed.find((p: WidgetConfig) => p.id === def.id);
            if (!existing) return def;
            // If user hasn't undergone v2 migration yet, force-enable core widgets (spotify, github, social)
            if (!hasMigrated && (def.id === "spotify" || def.id === "github" || def.id === "social")) {
              return { ...def, ...existing, visibleOnDesktop: true };
            }
            return { ...def, ...existing };
          });

          // Fallback: if no widget is visible on desktop, enable the 3 core ones
          const hasAnyDesktop = merged.some((w) => w.visibleOnDesktop);
          if (!hasAnyDesktop) {
            merged.forEach((w) => {
              if (w.id === "spotify" || w.id === "github" || w.id === "social") {
                w.visibleOnDesktop = true;
              }
            });
          }

          if (!hasMigrated) {
            localStorage.setItem(MIGRATION_KEY, "true");
            localStorage.setItem(KEYS.widgets, JSON.stringify(merged));
          }

          dispatch({ type: "SET_WIDGETS", widgets: merged });
        }
      } catch {}
    } else {
      localStorage.setItem(MIGRATION_KEY, "true");
      localStorage.setItem(KEYS.widgets, JSON.stringify(DEFAULT_WIDGETS));
      dispatch({ type: "SET_WIDGETS", widgets: DEFAULT_WIDGETS });
    }

    // Performance mode
    const savedPerf = localStorage.getItem(KEYS.perfMode);
    if (savedPerf === "true") dispatch({ type: "SET_PERF_MODE", enabled: true });

    // Volume
    const savedVolume = localStorage.getItem(KEYS.volume);
    if (savedVolume) {
      const vol = parseFloat(savedVolume);
      if (!isNaN(vol)) {
        dispatch({ type: "SET_VOLUME", volume: vol });
        setUiSoundVolume(vol);
      }
    }

    // Brightness
    const savedBrightness = localStorage.getItem(KEYS.brightness);
    if (savedBrightness) {
      const bri = parseFloat(savedBrightness);
      if (!isNaN(bri)) dispatch({ type: "SET_BRIGHTNESS", brightness: bri });
    }

    // Theme & High Contrast
    const savedTheme = localStorage.getItem(KEYS.theme);
    const savedHighContrast = localStorage.getItem(KEYS.highContrast);
    if (savedHighContrast === "true" || savedTheme === "high-contrast") {
      dispatch({ type: "SET_HIGH_CONTRAST", enabled: true });
      if (typeof document !== "undefined") {
        document.documentElement.dataset.theme = "high-contrast";
      }
    } else if (savedTheme) {
      dispatch({ type: "SET_THEME", theme: savedTheme });
      if (typeof document !== "undefined") {
        document.documentElement.dataset.theme = savedTheme;
      }
    }

    // Missions: Hydrate unlocked missions into state and refs quietly (do not replay toasts on page reload)
    try {
      const savedMissions = localStorage.getItem(KEYS.missions);
      if (savedMissions) {
        const parsed = JSON.parse(savedMissions);
        if (Array.isArray(parsed)) {
          const completedIds = Array.from(new Set(parsed.filter((id): id is string =>
            typeof id === "string" && systemMissions.some((mission) => mission.id === id)
          )));
          dispatch({ type: "SET_MISSIONS", missionIds: completedIds });
          completedIds.forEach((id) => {
            unlockedMissionsRef.current.add(id);
            notifiedRef.current.add(id);
          });
          localStorage.setItem(KEYS.notified, JSON.stringify(completedIds));
        }
      }
    } catch (e) {
      console.error("Error parsing saved missions:", e);
    }
  }, []);

  return (
    <OSSettingsContext.Provider value={{
      wallpaper:         state.wallpaper,
      videoWallpaper:    state.videoWallpaper,
      performanceMode:   state.performanceMode,
      volume:            state.volume,
      brightness:        state.brightness,
      theme:             state.theme,
      highContrast:      state.highContrast,
      notifications:     state.notifications,
      unlockedMissions:  state.unlockedMissions,
      widgets:           state.widgets,
      setWallpaper, setVideoWallpaper, setPerformanceMode, setVolume, setBrightness,
      setTheme, setHighContrast,
      addNotification, dismissNotification, clearNotifications, unlockMission,
      toggleWidgetBoard, toggleWidgetDesktop, setWidgets,
    }}>
      {children}
    </OSSettingsContext.Provider>
  );
}

export function useOSSettings() {
  const ctx = useContext(OSSettingsContext);
  if (!ctx) throw new Error("useOSSettings must be used within OSSettingsProvider");
  return ctx;
}

/* ── Default export for convenience ─────────────────────────────────── */
export default useOSSettings;
