"use client";

import React from "react";
import { useOSSettings } from "@/store/osSettingsStore";

export function DesktopWidgets() {
  const { widgets } = useOSSettings();
  
  // For now, only render if toggled
  const activeWidgets = widgets.filter(w => w.visibleOnDesktop);

  return (
    <div style={{ position: "absolute", top: 20, right: 20, display: "flex", flexDirection: "column", gap: "10px", zIndex: 1, pointerEvents: "none" }}>
      {activeWidgets.map(w => (
        <div key={w.id} style={{ background: "rgba(0,0,0,0.3)", backdropFilter: "blur(10px)", color: "white", padding: "10px", borderRadius: "8px", pointerEvents: "auto" }}>
          {w.name} (Desktop Widget)
        </div>
      ))}
    </div>
  );
}
