"use client";

import React from "react";
import { useOS, Theme } from "@/store/windowStore";

export default function SettingsApp() {
  const { theme, setTheme } = useOS();

  const themes: { id: Theme; name: string; desc: string }[] = [
    { id: "cyberpunk", name: "Cyberpunk", desc: "The default dark neon experience." },
    { id: "retro", name: "Retro 95", desc: "A nostalgic gray aesthetic." },
    { id: "light", name: "Light Mode", desc: "For those who prefer brightness." },
  ];

  return (
    <div style={{ padding: 20, height: "100%", fontFamily: "var(--font-mono)", color: "var(--os-text)", display: "flex", flexDirection: "column" }}>
      <h2 style={{ color: "var(--os-cyan)", marginBottom: 20 }}>System Settings</h2>
      
      <div style={{ marginBottom: 10, fontSize: 14, fontWeight: "bold" }}>Theme Selection</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {themes.map(t => (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            style={{
              padding: "12px 16px",
              textAlign: "left",
              background: theme === t.id ? "rgba(0,212,255,0.1)" : "rgba(255,255,255,0.05)",
              border: `1px solid ${theme === t.id ? "var(--os-cyan)" : "var(--os-border)"}`,
              borderRadius: 6,
              color: "var(--os-text)",
              cursor: "pointer",
            }}
          >
            <div style={{ fontWeight: "bold", marginBottom: 4, color: theme === t.id ? "var(--os-cyan)" : "inherit" }}>
              {t.name}
            </div>
            <div style={{ fontSize: 12, color: "var(--os-text-muted)" }}>{t.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
