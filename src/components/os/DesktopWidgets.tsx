"use client";

import React from "react";
import { useOSSettings } from "@/store/osSettingsStore";
import { useWidgetData } from "@/hooks/useWidgetData";

export function DesktopWidgets() {
  const { widgets } = useOSSettings();
  const data = useWidgetData();
  
  const activeWidgets = widgets.filter(w => w.visibleOnDesktop);

  return (
    <div style={{ position: "absolute", top: 20, right: 20, display: "flex", flexDirection: "column", gap: "10px", zIndex: 1, pointerEvents: "none" }}>
      {activeWidgets.map(w => (
        <div key={w.id} style={{ background: "rgba(0,0,0,0.3)", backdropFilter: "blur(10px)", color: "white", padding: "10px", borderRadius: "8px", pointerEvents: "auto", minWidth: "150px" }}>
          <div style={{ fontWeight: 600, fontSize: "11px", marginBottom: 4 }}>{w.name}</div>
          <div style={{ fontSize: "12px", fontFamily: "var(--font-mono)" }}>
            {w.id === "telemetry" && `FPS: ${data.fps} | Mem: ${data.memory}`}
            {w.id === "github" &&
              (data.githubEvents.length > 0
                ? `${data.githubEvents[0].repo.split("/")[1] ?? data.githubEvents[0].repo}: ${data.githubEvents.length} recent`
                : "No recent activity")}
            {w.id === "leetcode" && (data.leetcode ? `Solved: ${data.leetcode.totalSolved}` : "Loading…")}
          </div>
        </div>
      ))}
    </div>
  );
}
