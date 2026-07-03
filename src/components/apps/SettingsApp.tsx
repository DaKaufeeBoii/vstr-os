"use client";

import React, { useRef, useState } from "react";
import { useOS, Theme } from "@/store/windowStore";

export default function SettingsApp() {
  const { theme, setTheme, wallpaper, setWallpaper } = useOS();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const themes: { id: Theme; name: string; desc: string }[] = [
    { id: "cyberpunk", name: "Cyberpunk", desc: "The default dark neon experience." },
    { id: "retro", name: "Retro 95", desc: "A nostalgic green terminal aesthetic." },
    { id: "light", name: "Light Mode", desc: "For those who prefer brightness." },
  ];

  const presets = [
    { path: "/os_wallpaper.png", name: "VSTR-OS Neon" },
    { path: "/wallpaper_aurora.png", name: "Midnight Aurora" },
    { path: "/wallpaper_cyber_grid.png", name: "Cyber Grid" },
    { path: "/wallpaper_nebula.png", name: "Nebula Space" },
  ];

  const isCustomWallpaper = wallpaper.startsWith("data:image/");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (limit to 2.5MB for localStorage storage safety)
    if (file.size > 2.5 * 1024 * 1024) {
      setErrorMsg("File too large. Max size is 2.5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        setWallpaper(base64);
      }
    };
    reader.onerror = () => {
      setErrorMsg("Error reading file.");
    };
    reader.readAsDataURL(file);
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div style={{ padding: 20, height: "100%", fontFamily: "var(--font-mono)", color: "var(--os-text)", display: "flex", flexDirection: "column", gap: 24, overflowY: "auto" }}>
      <div>
        <h2 style={{ color: "var(--os-amber)", marginBottom: 16, fontFamily: "'JetBrains Mono', monospace", fontSize: 18 }}>System Settings</h2>
      </div>
      
      {/* Theme selection section */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ fontSize: 13, fontWeight: "bold", color: "var(--os-text-muted)", letterSpacing: "0.05em", textTransform: "uppercase" }}>Theme Selection</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {themes.map(t => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              style={{
                padding: "10px 14px",
                textAlign: "left",
                background: theme === t.id ? "rgba(245,158,11,0.06)" : "rgba(255,255,255,0.02)",
                border: `1px solid ${theme === t.id ? "var(--os-amber)" : "var(--os-border)"}`,
                borderRadius: 8,
                color: "var(--os-text)",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              <div style={{ fontWeight: "bold", fontSize: 13, marginBottom: 2, color: theme === t.id ? "var(--os-amber)" : "inherit" }}>
                {t.name}
              </div>
              <div style={{ fontSize: 11, color: "var(--os-text-muted)" }}>{t.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <hr style={{ border: "none", borderTop: "1px solid var(--os-border)" }} />

      {/* Wallpaper customization section */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ fontSize: 13, fontWeight: "bold", color: "var(--os-text-muted)", letterSpacing: "0.05em", textTransform: "uppercase" }}>Desktop Wallpaper</div>
        
        {/* Preset grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
          {presets.map(p => {
            const isActive = wallpaper === p.path;
            return (
              <button
                key={p.path}
                onClick={() => setWallpaper(p.path)}
                style={{
                  padding: "8px",
                  background: isActive ? "rgba(245,158,11,0.06)" : "rgba(255,255,255,0.02)",
                  border: `1px solid ${isActive ? "var(--os-amber)" : "var(--os-border)"}`,
                  borderRadius: 8,
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                  transition: "all 0.15s",
                }}
              >
                {/* Mini preview thumbnail */}
                <div style={{
                  width: "100%",
                  height: "55px",
                  borderRadius: "4px",
                  backgroundImage: `url(${p.path})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  border: "1px solid rgba(255,255,255,0.05)"
                }} />
                <span style={{ fontSize: 11, fontWeight: isActive ? "bold" : "normal", color: isActive ? "var(--os-amber)" : "var(--os-text)" }}>{p.name}</span>
              </button>
            );
          })}
        </div>

        {/* Custom upload area */}
        <div style={{ marginTop: 6 }}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            style={{ display: "none" }}
            aria-label="Upload wallpaper"
          />
          
          <button
            onClick={triggerUpload}
            style={{
              width: "100%",
              padding: "12px",
              background: isCustomWallpaper ? "rgba(16, 185, 129, 0.05)" : "rgba(255,255,255,0.01)",
              border: `1px dashed ${isCustomWallpaper ? "var(--os-jade)" : "var(--os-border)"}`,
              borderRadius: 8,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              color: isCustomWallpaper ? "var(--os-jade)" : "var(--os-text-muted)",
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              transition: "all 0.15s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = isCustomWallpaper ? "var(--os-jade)" : "var(--os-amber)";
              e.currentTarget.style.color = isCustomWallpaper ? "var(--os-jade)" : "var(--os-text)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = isCustomWallpaper ? "var(--os-jade)" : "var(--os-border)";
              e.currentTarget.style.color = isCustomWallpaper ? "var(--os-jade)" : "var(--os-text-muted)";
            }}
          >
            {isCustomWallpaper ? (
              <>
                <div style={{
                  width: 32,
                  height: 20,
                  borderRadius: 3,
                  backgroundImage: `url(${wallpaper})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  border: "1px solid rgba(16, 185, 129, 0.3)"
                }} />
                <span style={{ fontWeight: "bold" }}>Custom Wallpaper Active (Change)</span>
              </>
            ) : (
              <>
                <span>🖼️</span>
                <span>Upload Custom Picture (Max 2.5MB)</span>
              </>
            )}
          </button>
          
          {errorMsg && (
            <div style={{ color: "var(--os-red)", fontSize: 11, marginTop: 6, textAlign: "center" }}>
              {errorMsg}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
