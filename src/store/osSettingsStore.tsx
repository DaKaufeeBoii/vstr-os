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
} from "react";
import type { OSNotification } from "@/types";
import { systemMissions } from "@/data/systemMissions";

/* ── Types ──────────────────────────────────────────────────────────── */
export type VideoWallpaperId = "none" | "dawn" | "lake" | "rayquaza" | "yuji-sleepy";

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
  | { type: "UNLOCK_MISSION";      missionId: string }
  | { type: "SET_MISSIONS";        missionIds: string[] };

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
  };
}

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

    case "UNLOCK_MISSION": {
      if (state.unlockedMissions.includes(action.missionId)) return state;
      const next = [...state.unlockedMissions, action.missionId];
      if (typeof window !== "undefined") {
        localStorage.setItem(KEYS.missions, JSON.stringify(next));
      }
      return { ...state, unlockedMissions: next };
    }

    case "SET_MISSIONS":
      return { ...state, unlockedMissions: action.missionIds };

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

  // Actions
  setWallpaper:         (wallpaper: string) => void;
  setVideoWallpaper:    (videoWallpaper: VideoWallpaperId) => void;
  setPerformanceMode:   (enabled: boolean) => void;
  setVolume:            (volume: number) => void;
  setBrightness:        (brightness: number) => void;
  setTheme:             (theme: string) => void;
  setHighContrast:      (enabled: boolean) => void;
  addNotification:      (title: string, description: string, icon: string) => void;
  dismissNotification:  (id: string) => void;
  unlockMission:        (id: string) => void;
}

const OSSettingsContext = createContext<OSSettingsContextValue | null>(null);

/* ── Provider ───────────────────────────────────────────────────────── */
export function OSSettingsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, buildInitial);

  /* — Actions — */
  const addNotification = useCallback((title: string, description: string, icon: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    const notification: OSNotification = { id, title, description, icon };
    dispatch({ type: "ADD_NOTIFICATION", notification });
    setTimeout(() => dispatch({ type: "DISMISS_NOTIFICATION", notificationId: id }), 4500);
  }, []);

  const dismissNotification = useCallback((notificationId: string) => {
    dispatch({ type: "DISMISS_NOTIFICATION", notificationId });
  }, []);

  const unlockMission = useCallback((missionId: string) => {
    if (state.unlockedMissions.includes(missionId)) return;
    dispatch({ type: "UNLOCK_MISSION", missionId });

    const savedMissions = localStorage.getItem(KEYS.missions);
    let parsed: string[] = [];
    try { const p = JSON.parse(savedMissions ?? "[]"); if (Array.isArray(p)) parsed = p; } catch {}
    const nextMissions = parsed.includes(missionId) ? parsed : [...parsed, missionId];
    localStorage.setItem(KEYS.notified, JSON.stringify(nextMissions));

    const mission = systemMissions.find((m) => m.id === missionId);
    if (mission) addNotification(mission.title, mission.description, mission.icon);
  }, [state.unlockedMissions, addNotification]);

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

    // Performance mode
    const savedPerf = localStorage.getItem(KEYS.perfMode);
    if (savedPerf === "true") dispatch({ type: "SET_PERF_MODE", enabled: true });

    // Volume
    const savedVolume = localStorage.getItem(KEYS.volume);
    if (savedVolume) {
      const vol = parseFloat(savedVolume);
      if (!isNaN(vol)) dispatch({ type: "SET_VOLUME", volume: vol });
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

    // Missions
    try {
      const savedMissions = localStorage.getItem(KEYS.missions);
      if (savedMissions) {
        const parsed = JSON.parse(savedMissions);
        if (Array.isArray(parsed)) {
          dispatch({ type: "SET_MISSIONS", missionIds: parsed });

          // Fire notifications for missions not yet notified
          const notified = JSON.parse(localStorage.getItem(KEYS.notified) ?? "[]");
          const unnotified = (parsed as string[]).filter((id) => !notified.includes(id));
          unnotified.forEach((id, idx) => {
            setTimeout(() => {
              const mission = systemMissions.find((m) => m.id === id);
              if (mission) addNotification(mission.title, mission.description, mission.icon);
            }, 1200 + idx * 600);
          });
          if (unnotified.length > 0) localStorage.setItem(KEYS.notified, JSON.stringify(parsed));
        }
      } else {
        localStorage.setItem(KEYS.notified, "[]");
      }
    } catch (e) {
      console.error("Error parsing saved missions:", e);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      setWallpaper, setVideoWallpaper, setPerformanceMode, setVolume, setBrightness,
      setTheme, setHighContrast,
      addNotification, dismissNotification, unlockMission,
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