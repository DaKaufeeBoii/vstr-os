"use client";

import React, { useEffect, useRef, useState } from "react";
import { useOSSettings } from "@/store/osSettingsStore";
import type { VideoWallpaperId } from "@/store/osSettingsStore";
import { appRegistry } from "@/lib/sdk/appRegistry";
import type { AppManifest } from "@/lib/sdk/appManifest";
import { OsIcon } from "@/components/icons/OsIcon";

interface LiveWallpaperOption {
  id: Exclude<VideoWallpaperId, "none">;
  name: string;
  category: string;
  desc: string;
  videoSrc: string;
}

const LIVE_WALLPAPER_OPTIONS: LiveWallpaperOption[] = [
  {
    id: "dawn",
    name: "Dawn Cycling",
    category: "Anime • Pixel Art • Lofi",
    desc: "Serene cycling at dawn with peaceful morning ambience.",
    videoSrc: "/wallpapers/video/Dawn-cycling.mp4",
  },
  {
    id: "lake",
    name: "Lake of Rage",
    category: "Pokémon • Dark Fantasy • Rain",
    desc: "Mystical Gyarados lake scene with stormy atmospheric rain.",
    videoSrc: "/wallpapers/video/Lake-of-Rage.mp4",
  },
  {
    id: "rayquaza",
    name: "Rayquaza",
    category: "Pokémon • Cinematic • Skies",
    desc: "Legendary Sky High Pokémon soaring through the ozone layer.",
    videoSrc: "/wallpapers/video/Rayquaza.mp4",
  },
  {
    id: "yuji-sleepy",
    name: "Yuji Sleepy",
    category: "Anime • Jujutsu Kaisen • Cozy",
    desc: "Peaceful Itadori Yuji resting in a cozy, warm atmosphere.",
    videoSrc: "/wallpapers/video/yuji-sleepy.mp4",
  },
];

interface SettingsAppProps {
  initialSection?: string;
}

export default function SettingsApp({ initialSection }: SettingsAppProps = {}) {
  const {
    wallpaper, setWallpaper,
    videoWallpaper, setVideoWallpaper,
    performanceMode, setPerformanceMode,
    volume, setVolume,
    brightness, setBrightness,
    highContrast, setHighContrast,
    addNotification,
  } = useOSSettings();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (initialSection) {
      const sectionId = initialSection === "display" ? "settings-section-display" : "settings-section-personalize";
      const el = document.getElementById(sectionId);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 150);
      }
    }
  }, [initialSection]);

  // App SDK / Registry state
  const [apps, setApps] = useState<AppManifest[]>(() => appRegistry.listApps());
  const [appFilter, setAppFilter] = useState<string>("all");
  const [pluginJson, setPluginJson] = useState<string>(`{
  "id": "matrix-screensaver",
  "name": "Matrix Rain",
  "version": "1.0.0",
  "description": "Digital green rain animation simulator with falling glyph speed controls.",
  "author": "Community Contributor",
  "category": "utilities",
  "icon": "🟢",
  "permissions": ["system:telemetry", "notifications"],
  "defaultConfig": {
    "width": 640,
    "height": 480
  }
}`);
  const [pluginStatus, setPluginStatus] = useState<string | null>(null);

  useEffect(() => {
    return appRegistry.subscribe(() => {
      setApps(appRegistry.listApps());
    });
  }, []);

  const handleInstallPlugin = () => {
    try {
      const parsed = JSON.parse(pluginJson);
      if (!parsed.id || !parsed.name || !parsed.version) {
        setPluginStatus("Error: Manifest must contain 'id', 'name', and 'version'.");
        return;
      }
      appRegistry.registerApp(parsed);
      setPluginStatus(`Successfully registered "${parsed.name}" v${parsed.version}!`);
      addNotification?.("Plugin Registered", `Loaded "${parsed.name}" manifest successfully`, "📦");
    } catch (e: any) {
      setPluginStatus(`JSON Error: ${e.message}`);
    }
  };

  const presets = [
    { path: "/wallpapers/static/os_wallpaper.png", name: "VSTR-OS Default" },
    { path: "/wallpapers/static/wallpaper_aurora.png", name: "Midnight Aurora" },
    { path: "/wallpapers/static/wallpaper_cyber_grid.png", name: "Cyber Grid" },
    { path: "/wallpapers/static/wallpaper_nebula.png", name: "Nebula Space" },
    { path: "/wallpapers/static/batman.jpg", name: "Dark Knight" },
    { path: "/wallpapers/static/guts.jpg", name: "Berserker" },
    { path: "/wallpapers/static/gear-5.jpg", name: "Gear 5" },
    { path: "/wallpapers/static/Madara-Uchiha.jpg", name: "Infinite Tsukuyomi" },
    { path: "/wallpapers/static/ui-goku.jpg", name: "Ultra Instinct" },
  ];

  const isCustomWallpaper = wallpaper.startsWith("data:image/");
  const isStaticActive = videoWallpaper === "none";

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2.5 * 1024 * 1024) {
      setErrorMsg("File too large. Max size is 2.5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        setWallpaper(base64);
        setVideoWallpaper("none");
      }
    };
    reader.onerror = () => setErrorMsg("Error reading file.");
    reader.readAsDataURL(file);
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) {
      setErrorMsg("File too large. Max size is 50MB.");
      return;
    }
    if (!file.type.startsWith("video/")) {
      setErrorMsg("Please select a video file (MP4/WebM).");
      return;
    }
    const url = URL.createObjectURL(file);
    setVideoWallpaper(url as VideoWallpaperId);
  };

  const sectionLabel = (text: string) => (
    <div style={{
      fontSize: 12,
      fontWeight: 700,
      color: "var(--os-amber)",
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      marginBottom: 8,
      fontFamily: "'JetBrains Mono', monospace",
      display: "flex",
      alignItems: "center",
      gap: 6,
    }}>
      {text}
    </div>
  );

  return (
    <div style={{
      padding: "20px 20px 36px",
      height: "100%",
      fontFamily: "var(--font-mono)",
      color: "var(--os-text)",
      display: "flex",
      flexDirection: "column",
      gap: 24,
      overflowY: "auto",
    }}>
      <div>
        <h2 style={{
          color: "var(--os-amber)",
          margin: "0 0 4px",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 18,
        }}>
          ⚙️ System Settings
        </h2>
        <p style={{ margin: 0, fontSize: 12, color: "var(--os-text-muted)" }}>
          Personalise your VSTR-OS experience.
        </p>
      </div>

      <hr style={{ border: "none", borderTop: "1px solid var(--os-border)", margin: 0 }} />

      {/* ── a. Display and Audio ───────────────────────────────────── */}
      <div id="settings-section-display" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div>
          {sectionLabel("🖥️ Display & 🔊 Audio")}
          <p style={{ margin: "0 0 14px", fontSize: 11, color: "var(--os-text-muted)", lineHeight: 1.5 }}>
            Adjust display brightness and system audio output levels.
          </p>
        </div>

        {/* Display Brightness */}
        <div style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid var(--os-border)",
          borderRadius: 8,
          padding: "14px 16px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontSize: 24 }}>🔆</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "var(--os-text)" }}>Brightness</span>
                <span style={{ fontSize: 12, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: "var(--os-amber)" }}>
                  {Math.round(brightness * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.01"
                value={brightness}
                onChange={(e) => setBrightness(parseFloat(e.target.value))}
                style={{ width: "100%", accentColor: "var(--os-amber)", cursor: "pointer" }}
                aria-label="Display Brightness"
              />
            </div>
          </div>
        </div>

        {/* Audio Volume */}
        <div style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid var(--os-border)",
          borderRadius: 8,
          padding: "14px 16px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontSize: 24 }}>🔊</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "var(--os-text)" }}>Volume</span>
                <span style={{ fontSize: 12, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: "var(--os-amber)" }}>
                  {Math.round(volume * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                style={{ width: "100%", accentColor: "var(--os-amber)", cursor: "pointer" }}
                aria-label="Audio Volume"
              />
            </div>
          </div>
        </div>
      </div>

      <hr style={{ border: "none", borderTop: "1px solid var(--os-border)", margin: 0 }} />

      {/* ── Accessibility & Contrast ──────────────────────────────── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          {sectionLabel("♿ Accessibility & Contrast")}
          <p style={{ margin: "0 0 14px", fontSize: 11, color: "var(--os-text-muted)", lineHeight: 1.5 }}>
            Configure high-contrast themes conforming to WCAG 2.1 AAA contrast guidelines (≥ 7:1 ratio) with enhanced keyboard focus indicators.
          </p>
        </div>

        <div style={{
          background: "rgba(255,255,255,0.02)",
          border: `1px solid ${highContrast ? "#ffff00" : "var(--os-border)"}`,
          borderRadius: 8,
          padding: "14px 16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
        }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: highContrast ? "#ffff00" : "var(--os-text)", marginBottom: 4 }}>
              High-Contrast Mode (WCAG AAA)
            </div>
            <div style={{ fontSize: 11, color: "var(--os-text-muted)", lineHeight: 1.4 }}>
              Stark black background, pure neon yellow active focus states, and high visibility borders for low-vision navigation.
            </div>
          </div>

          <button
            onClick={() => setHighContrast(!highContrast)}
            style={{
              padding: "8px 16px",
              background: highContrast ? "#ffff00" : "rgba(255,255,255,0.08)",
              color: highContrast ? "#000000" : "var(--os-text)",
              border: `1px solid ${highContrast ? "#ffff00" : "var(--os-border)"}`,
              borderRadius: 6,
              fontWeight: 700,
              fontSize: 12,
              fontFamily: "'JetBrains Mono', monospace",
              cursor: "pointer",
              transition: "all 0.15s ease",
              whiteSpace: "nowrap",
            }}
          >
            {highContrast ? "ENABLED" : "ENABLE"}
          </button>
        </div>
      </div>

      <hr style={{ border: "none", borderTop: "1px solid var(--os-border)", margin: 0 }} />

      {/* ── b. Static Wallpaper ────────────────────────────────────── */}
      <div id="settings-section-personalize">
        {sectionLabel("🖼️ Static Wallpaper")}
        <p style={{ margin: "0 0 12px", fontSize: 11, color: "var(--os-text-muted)", lineHeight: 1.5 }}>
          Choose a desktop background image or upload your own high-resolution image.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10, marginBottom: 12 }}>
          {presets.map((p) => {
            const isActive = wallpaper === p.path && isStaticActive;
            return (
              <button
                key={p.path}
                onClick={() => {
                  setWallpaper(p.path);
                  setVideoWallpaper("none");
                }}
                style={{
                  padding: "8px",
                  background: isActive ? "rgba(245,158,11,0.08)" : "rgba(255,255,255,0.02)",
                  border: `1px solid ${isActive ? "var(--os-amber)" : "var(--os-border)"}`,
                  borderRadius: 8,
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                  transition: "all 0.15s",
                  boxShadow: isActive ? "0 0 12px rgba(245,158,11,0.25)" : "none",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "55px",
                    borderRadius: "4px",
                    backgroundImage: `url(${p.path})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                />
                <span style={{
                  fontSize: 11,
                  fontWeight: isActive ? "bold" : "normal",
                  color: isActive ? "var(--os-amber)" : "var(--os-text)",
                  fontFamily: "'JetBrains Mono', monospace",
                }}>
                  {p.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Custom static upload */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/*"
          style={{ display: "none" }}
          aria-label="Upload wallpaper"
        />
        <button
          onClick={() => {
            fileInputRef.current?.click();
          }}
          style={{
            width: "100%",
            padding: "12px",
            background: isCustomWallpaper && isStaticActive ? "rgba(16, 185, 129, 0.08)" : "rgba(255,255,255,0.02)",
            border: `1px dashed ${isCustomWallpaper && isStaticActive ? "var(--os-jade)" : "var(--os-border)"}`,
            borderRadius: 8,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            color: isCustomWallpaper && isStaticActive ? "var(--os-jade)" : "var(--os-text-muted)",
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            transition: "all 0.15s",
          }}
        >
          {isCustomWallpaper && isStaticActive ? (
            <>
              <div
                style={{
                  width: 32,
                  height: 20,
                  borderRadius: 3,
                  backgroundImage: `url(${wallpaper})`,
                  backgroundSize: "cover",
                  border: "1px solid rgba(16, 185, 129, 0.4)",
                }}
              />
              <span style={{ fontWeight: "bold" }}>Custom Picture Active (Click to Change)</span>
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

      <hr style={{ border: "none", borderTop: "1px solid var(--os-border)", margin: 0 }} />

      {/* ── c. Live Wallpaper ──────────────────────────────────────── */}
      <div>
        {sectionLabel("🎬 Live Video Wallpapers")}
        <p style={{ margin: "0 0 12px", fontSize: 11, color: "var(--os-text-muted)", lineHeight: 1.5 }}>
          Looping high-definition video wallpapers rendered seamlessly across the desktop.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {LIVE_WALLPAPER_OPTIONS.map((v) => {
            const isActive = videoWallpaper === v.id;
            return (
              <button
                key={v.id}
                onClick={() => {
                  setVideoWallpaper(v.id);
                }}
                style={{
                  padding: 0,
                  background: "rgba(255,255,255,0.02)",
                  border: `2px solid ${isActive ? "var(--os-amber)" : "rgba(255,255,255,0.08)"}`,
                  borderRadius: 10,
                  cursor: "pointer",
                  overflow: "hidden",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                  boxShadow: isActive ? "0 0 16px rgba(245,158,11,0.35)" : "none",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Live Video Preview Frame */}
                <div
                  style={{
                    height: 72,
                    position: "relative",
                    overflow: "hidden",
                    background: "#0a0e17",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <video
                    src={v.videoSrc}
                    muted
                    loop
                    autoPlay
                    playsInline
                    preload="metadata"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      pointerEvents: "none",
                    }}
                  />
                  {/* Subtle vignette gradient */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%)",
                      pointerEvents: "none",
                    }}
                  />
                  {/* Category Pill Tag */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: 5,
                      left: 6,
                      fontSize: 8.5,
                      fontWeight: 600,
                      background: "rgba(0,0,0,0.7)",
                      color: "#e2e8f0",
                      backdropFilter: "blur(4px)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      borderRadius: 4,
                      padding: "1px 5px",
                      fontFamily: "'JetBrains Mono', monospace",
                      letterSpacing: "0.02em",
                    }}
                  >
                    {v.category}
                  </div>
                  {isActive && (
                    <div
                      style={{
                        position: "absolute",
                        top: 5,
                        right: 6,
                        fontSize: 9.5,
                        background: "var(--os-amber)",
                        color: "#000",
                        borderRadius: 4,
                        padding: "1px 6px",
                        fontWeight: 800,
                        fontFamily: "'JetBrains Mono', monospace",
                        boxShadow: "0 2px 6px rgba(245,158,11,0.5)",
                      }}
                    >
                      ACTIVE
                    </div>
                  )}
                </div>

                {/* Details / Description */}
                <div
                  style={{
                    padding: "8px 10px",
                    textAlign: "left",
                    background: isActive ? "rgba(245,158,11,0.06)" : "transparent",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: isActive ? "var(--os-amber)" : "var(--os-text)",
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    {v.name}
                  </div>
                  <div style={{ fontSize: 10, color: "var(--os-text-muted)", marginTop: 3, lineHeight: 1.4 }}>
                    {v.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Custom video upload */}
        <input
          type="file"
          ref={videoInputRef}
          onChange={handleVideoUpload}
          accept="video/mp4,video/webm,video/*"
          style={{ display: "none" }}
          aria-label="Upload video wallpaper"
        />
        <button
          onClick={() => {
            videoInputRef.current?.click();
          }}
          style={{
            width: "100%",
            marginTop: 10,
            padding: "12px",
            background: "rgba(245,158,11,0.05)",
            border: "1px dashed var(--os-amber)",
            borderRadius: 8,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            color: "var(--os-amber)",
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            transition: "all 0.15s",
          }}
        >
          <span>🎞️</span>
          <span>Upload Custom Video (Max 50MB, MP4/WebM)</span>
        </button>

        {/* Performance mode toggle */}
        <button
          onClick={() => setPerformanceMode(!performanceMode)}
          style={{
            width: "100%",
            marginTop: 10,
            padding: "9px 12px",
            background: performanceMode ? "rgba(239,68,68,0.08)" : "rgba(255,255,255,0.02)",
            border: `1px solid ${performanceMode ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.08)"}`,
            borderRadius: 8,
            cursor: "pointer",
            color: performanceMode ? "#ef4444" : "var(--os-text-muted)",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            textAlign: "center",
            transition: "all 0.15s",
          }}
        >
          {performanceMode ? "⏸ Video Paused (Performance Mode ON)" : "▶ Pause Video (Performance Mode)"}
        </button>
      </div>

      <hr style={{ border: "none", borderTop: "1px solid var(--os-border)", margin: 0 }} />

      {/* ── d. Application SDK & Plugins ───────────────────────────── */}
      <div>
        {sectionLabel("📦 Application SDK & Plugin Registry")}
        <p style={{ margin: "0 0 12px", fontSize: 11, color: "var(--os-text-muted)", lineHeight: 1.5 }}>
          View installed system applications, inspect capability permissions (VFS, Windowing, Notifications), or register external dynamic plugins.
        </p>

        {/* Filter pills */}
        <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
          {["all", "developer", "productivity", "system", "network", "utilities"].map((cat) => (
            <button
              key={cat}
              onClick={() => setAppFilter(cat)}
              style={{
                padding: "4px 10px",
                fontSize: 11,
                borderRadius: 4,
                cursor: "pointer",
                background: appFilter === cat ? "var(--os-amber)" : "rgba(255,255,255,0.05)",
                color: appFilter === cat ? "#000" : "var(--os-text-muted)",
                fontWeight: appFilter === cat ? 700 : 500,
                border: "1px solid rgba(255,255,255,0.1)",
                fontFamily: "'JetBrains Mono', monospace",
                textTransform: "capitalize",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Installed Applications List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
          {apps
            .filter((a) => appFilter === "all" || a.category === appFilter)
            .map((app) => (
              <div
                key={app.id}
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid var(--os-border)",
                  borderRadius: 8,
                  padding: "10px 14px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {app.fluentIcon ? (
                      <OsIcon name={app.fluentIcon} size="sm" />
                    ) : (
                      <span style={{ fontSize: 18 }}>{app.icon}</span>
                    )}
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "var(--os-text)" }}>
                        {app.name} <span style={{ fontSize: 10, color: "var(--os-text-muted)", fontWeight: 400 }}>v{app.version}</span>
                      </div>
                      <div style={{ fontSize: 10, color: "var(--os-text-muted)" }}>
                        By {app.author} • {app.category}
                      </div>
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: 9,
                      padding: "2px 6px",
                      borderRadius: 4,
                      background: "rgba(245,158,11,0.1)",
                      color: "var(--os-amber)",
                      border: "1px solid rgba(245,158,11,0.3)",
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    READY
                  </span>
                </div>

                <div style={{ fontSize: 11, color: "var(--os-text-muted)", lineHeight: 1.4 }}>
                  {app.description}
                </div>

                {/* Permissions Granted Chips */}
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap", alignItems: "center" }}>
                  <span style={{ fontSize: 9, color: "var(--os-text-muted)", marginRight: 4 }}>PERMISSIONS:</span>
                  {app.permissions.length === 0 ? (
                    <span style={{ fontSize: 9, color: "var(--os-text-muted)" }}>None (Sandboxed)</span>
                  ) : (
                    app.permissions.map((p) => (
                      <span
                        key={p}
                        style={{
                          fontSize: 9,
                          padding: "1px 6px",
                          borderRadius: 3,
                          background: "rgba(255,255,255,0.06)",
                          color: "var(--os-cyan)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          fontFamily: "'JetBrains Mono', monospace",
                        }}
                      >
                        {p}
                      </span>
                    ))
                  )}
                </div>
              </div>
            ))}
        </div>

        {/* Plugin Manifest Loader */}
        <div style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid var(--os-border)",
          borderRadius: 8,
          padding: "12px",
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--os-text)", marginBottom: 6 }}>
            ⚙️ Register Dynamic Plugin Manifest (JSON)
          </div>
          <p style={{ margin: "0 0 8px", fontSize: 10, color: "var(--os-text-muted)" }}>
            Extend VSTR-OS at runtime by registering a sandboxed Application SDK manifest.
          </p>
          <textarea
            value={pluginJson}
            onChange={(e) => setPluginJson(e.target.value)}
            rows={7}
            style={{
              width: "100%",
              background: "#080c14",
              border: "1px solid var(--os-border)",
              borderRadius: 6,
              color: "#38bdf8",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10.5,
              padding: "8px",
              boxSizing: "border-box",
              resize: "vertical",
            }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
            {pluginStatus && (
              <span style={{
                fontSize: 10,
                color: pluginStatus.startsWith("Error") || pluginStatus.startsWith("JSON") ? "#ef4444" : "#22c55e",
                fontFamily: "'JetBrains Mono', monospace",
              }}>
                {pluginStatus}
              </span>
            )}
            <button
              onClick={handleInstallPlugin}
              style={{
                marginLeft: "auto",
                padding: "6px 14px",
                background: "var(--os-amber)",
                color: "#000",
                border: "none",
                borderRadius: 4,
                fontWeight: 700,
                fontSize: 11,
                cursor: "pointer",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              + Install Manifest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}