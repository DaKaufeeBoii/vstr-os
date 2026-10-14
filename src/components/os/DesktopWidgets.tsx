"use client";

import React, { useState, useEffect, useRef, useCallback, useSyncExternalStore } from "react";
import { useOSSettings } from "@/store/osSettingsStore";
import { SpotifyWidget } from "@/components/widgets/SpotifyWidget";
import { GitHubActivityWidget } from "@/components/widgets/GitHubActivityWidget";
import { SocialPostWidget } from "@/components/widgets/SocialPostWidget";
import { TelemetryWidget } from "@/components/widgets/TelemetryWidget";
import { LeetCodeWidget } from "@/components/widgets/LeetCodeWidget";

const POSITIONS_STORAGE_KEY = "vstr_widget_positions";
const MINIMIZED_STORAGE_KEY = "vstr_widget_minimized";
const subscribeToClientMount = () => () => {};
const getClientMountSnapshot = () => true;
const getServerMountSnapshot = () => false;

interface Position {
  x: number;
  y: number;
}

export function DesktopWidgets() {
  const { widgets, toggleWidgetDesktop } = useOSSettings();
  const containerRef = useRef<HTMLDivElement>(null);

  // Default coordinate calculation: stacked on the top-right of the desktop
  const getDefaultPositions = useCallback((): Record<string, Position> => {
    if (typeof window === "undefined") return {};
    const winWidth = window.innerWidth;
    // Widget width is ~330px, leave 24px right margin
    const targetX = Math.max(20, winWidth - 354);

    return {
      spotify: { x: targetX, y: 24 },
      github: { x: targetX, y: 190 },
      social: { x: targetX, y: 382 },
      telemetry: { x: targetX, y: 530 },
      leetcode: { x: targetX, y: 640 },
      weather: { x: targetX, y: 750 },
    };
  }, []);

  // The component renders nothing until hydration completes, so loading saved
  // layout in state initializers avoids an effect-driven second render.
  const [positions, setPositions] = useState<Record<string, Position>>(() => {
    const defaults = getDefaultPositions();
    if (typeof window === "undefined") return defaults;
    try {
      const saved = localStorage.getItem(POSITIONS_STORAGE_KEY);
      return saved ? { ...defaults, ...JSON.parse(saved) as Record<string, Position> } : defaults;
    } catch {
      return defaults;
    }
  });
  const [minimizedMap, setMinimizedMap] = useState<Record<string, boolean>>(() => {
    if (typeof window === "undefined") return {};
    try {
      return JSON.parse(localStorage.getItem(MINIMIZED_STORAGE_KEY) ?? "{}") as Record<string, boolean>;
    } catch {
      return {};
    }
  });
  const isMounted = useSyncExternalStore(subscribeToClientMount, getClientMountSnapshot, getServerMountSnapshot);

  // Listen to custom reset layout event
  useEffect(() => {
    const handleReset = () => {
      const freshDefaults = getDefaultPositions();
      setPositions(freshDefaults);
      setMinimizedMap({});
      try {
        localStorage.removeItem(POSITIONS_STORAGE_KEY);
        localStorage.removeItem(MINIMIZED_STORAGE_KEY);
      } catch {}
    };

    window.addEventListener("reset-desktop-widgets", handleReset);
    return () => window.removeEventListener("reset-desktop-widgets", handleReset);
  }, [getDefaultPositions]);

  // Position change handler with debounce save to localStorage
  const handlePositionChange = useCallback((id: string, newPos: Position) => {
    setPositions((prev) => {
      const updated = { ...prev, [id]: newPos };
      try {
        localStorage.setItem(POSITIONS_STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  // Minimize toggle handler
  const handleToggleMinimize = useCallback((id: string) => {
    setMinimizedMap((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem(MINIMIZED_STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  // Close widget (hide from desktop)
  const handleClose = useCallback(
    (id: string) => {
      toggleWidgetDesktop(id);
    },
    [toggleWidgetDesktop]
  );

  if (!isMounted) return null;

  const activeWidgets = widgets.filter((w) => w.visibleOnDesktop);
  if (activeWidgets.length === 0) return null;

  return (
    <div
      ref={containerRef}
      id="desktop-widgets-layer"
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 3,
        overflow: "hidden",
      }}
    >
      {activeWidgets.map((w) => {
        const defaultPos = getDefaultPositions()[w.id] ?? { x: 20, y: 20 };
        const rawPos = positions[w.id] ?? defaultPos;
        const winW = typeof window !== "undefined" ? window.innerWidth : 1200;
        const winH = typeof window !== "undefined" ? window.innerHeight : 800;
        const pos = {
          x: Math.min(Math.max(10, rawPos.x), Math.max(10, winW - 350)),
          y: Math.min(Math.max(10, rawPos.y), Math.max(10, winH - 120)),
        };
        const isMinimized = !!minimizedMap[w.id];

        const commonProps = {
          id: w.id,
          isMinimized,
          onToggleMinimize: () => handleToggleMinimize(w.id),
          onClose: () => handleClose(w.id),
          position: pos,
          onPositionChange: handlePositionChange,
          dragConstraintsRef: containerRef,
        };

        switch (w.id) {
          case "spotify":
            return <SpotifyWidget key={w.id} {...commonProps} />;
          case "github":
            return <GitHubActivityWidget key={w.id} {...commonProps} />;
          case "social":
            return <SocialPostWidget key={w.id} {...commonProps} />;
          case "telemetry":
            return <TelemetryWidget key={w.id} {...commonProps} />;
          case "leetcode":
            return <LeetCodeWidget key={w.id} {...commonProps} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
