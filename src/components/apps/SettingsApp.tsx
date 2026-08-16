"use client";

import React, { useRef, useState } from "react";
import { useOSSettings } from "@/store/osSettingsStore";
import type { VideoWallpaperId } from "@/store/osSettingsStore";

const VIDEO_WALLPAPER_OPTIONS: { id: VideoWallpaperId; name: string; desc: string; poster: string }[] = [
  {
    id: "none",
    name: "Static Image",
    desc: "Use a static wallpaper image.",
    poster: "/wallpapers/static/os_wallpaper.png",
  },
  {
    id: "dawn",
    name: "Dawn Cycling",
    desc: "Serene cycling at dawn - peaceful morning vibes.",
    poster: "/wallpapers/video/posters/dawn-cycling.jpg",
  },
  {
    id: "lake",
    name: "Lake of Rage",
    desc: "Mystical lake scene - dark fantasy ambience.",
    poster: "/wallpapers/video/posters/lake-of-rage.jpg",
  },
  {
    id: "rayquaza",
    name: "Rayquaza",
    desc: "Legendary Pokémon soaring through skies.",
    poster: "/wallpapers/video/posters/rayquaza.jpg",
  },
  {
    id: "yuji-sleepy",
    name: "Yuji Sleepy",
    desc: "Peaceful anime moment - cozy atmosphere.",
    poster: "/wallpapers/video/posters/yuji-sleepy.jpg",
  },
];

export default function SettingsApp() {
  const {
    wallpaper, setWallpaper,
    videoWallpaper, setVideoWallpaper,
    performanceMode, setPerformanceMode,
  } = useOSSettings();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);

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
      if (base64) setWallpaper(base64);
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
    setWallpaper(""); // Clear static wallpaper
  };

  const sectionLabel = (text: string) => (
    <div style={{
      fontSize: 11,
      fontWeight: 700,
      color: "var(--os-text-muted)",
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      marginBottom: 10,
      fontFamily: "'JetBrains Mono', monospace",
    }}>
      {text}
    </div>
  );

  return (
    <div style={{
      padding: "20px 20px 32px",
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

      {/* ── Live Video Wallpapers ───────────────────────────────────── */}
      <div>
        {sectionLabel("🎬 Live Video Wallpapers")}
        <p style={{ margin: "0 0 12px", fontSize: 11, color: "var(--os-text-muted)", lineHeight: 1.5 }}>
          Looping MP4/WebM videos rendered full-screen on the desktop. Select one to activate it as your live wallpaper.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {VIDEO_WALLPAPER_OPTIONS.map(v => {
            const isActive = videoWallpaper === v.id;
            return (
              <button
                key={v.id}
                onClick={() => {
                  setVideoWallpaper(v.id);
                  setWallpaper(""); // Clear static wallpaper
                }}
                style={{
                  padding: 0,
                  background: "transparent",
                  border: `2px solid ${isActive ? "var(--os-amber)" : "rgba(255,255,255,0.08)"}`,
                  borderRadius: 10,
                  cursor: "pointer",
                  overflow: "hidden",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                  boxShadow: isActive ? "0 0 16px rgba(245,158,11,0.3)" : "none",
                }}
              >
                {/* Video preview thumbnail - using first frame still */}
                <div style={{
                  height: 56,
                  background: v.poster ? `center/cover no-repeat url(${v.poster})` : "linear-gradient(135deg, #1a1a2e, #16213e)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                  position: "relative",
                }}>
                  {isActive && (
                    <div style={{
                      position: "absolute",
                      top: 4,
                      right: 6,
                      fontSize: 10,
                      background: "var(--os-amber)",
                      color: "#000",
                      borderRadius: 4,
                      padding: "1px 5px",
                      fontWeight: 700,
                      fontFamily: "'JetBrains Mono', monospace",
                    }}>
                      LIVE
                    </div>
                  )}
                </div>
                {/* Label */}
                <div style={{
                  padding: "6px 8px",
                  textAlign: "left",
                  background: isActive ? "rgba(245,158,11,0.06)" : "rgba(255,255,255,0.02)",
                }}>
                  <div style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: isActive ? "var(--os-amber)" : "var(--os-text)",
                    fontFamily: "'JetBrains Mono', monospace",
                  }}>
                    {v.name}
                  </div>
                  <div style={{ fontSize: 10, color: "var(--os-text-muted)", marginTop: 1 }}>
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
          ref={fileInputRef}
          onChange={handleVideoUpload}
          accept="video/mp4,video/webm,video/*"
          style={{ display: "none" }}
          aria-label="Upload video wallpaper"
        />
        <button
          onClick={() => { fileInputRef.current?.click(); }}
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
            marginTop: 14,
            padding: "8px 12px",
            background: performanceMode ? "rgba(239,68,68,0.08)" : "rgba(255,255,255,0.02)",
            border: `1px solid ${performanceMode ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.08)"}`,
            borderRadius: 8,
            cursor: "pointer",
            color: performanceMode ? "#ef4444" : "var(--os-text-muted)",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            textAlign: "left",
            transition: "all 0.15s",
          }}
        >
          {performanceMode ? "⏸ Video Paused (Performance Mode ON)" : "▶ Pause Video (Performance Mode)"}
        </button>
      </div>

      <hr style={{ border: "none", borderTop: "1px solid var(--os-border)", margin: 0 }} />

      {/* ── Static Wallpaper ───────────────────────────────────────── */}
      <div>
        {sectionLabel("Static Wallpaper")}
        <p style={{ margin: "0 0 10px", fontSize: 11, color: "var(--os-text-muted)" }}>
          Only visible when video wallpaper is set to "Static Image".
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10, marginBottom: 10 }}>
          {presets.map(p => {
            const isActive = wallpaper === p.path && videoWallpaper === "none";
            return (
              <button
                key={p.path}
                onClick={() => { setWallpaper(p.path); setVideoWallpaper("none"); }}
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
                <div style={{
                  width: "100%",
                  height: "55px",
                  borderRadius: "4px",
                  backgroundImage: `url(${p.path})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  border: "1px solid rgba(255,255,255,0.05)",
                }} />
                <span style={{ fontSize: 11, fontWeight: isActive ? "bold" : "normal", color: isActive ? "var(--os-amber)" : "var(--os-text)" }}>
                  {p.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Custom upload */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/*"
          style={{ display: "none" }}
          aria-label="Upload wallpaper"
        />
        <button
          onClick={() => { fileInputRef.current?.click(); setVideoWallpaper("none"); }}
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
        >
          {isCustomWallpaper ? (
            <>
              <div style={{
                width: 32, height: 20, borderRadius: 3,
                backgroundImage: `url(${wallpaper})`,
                backgroundSize: "cover",
                border: "1px solid rgba(16, 185, 129, 0.3)",
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
  );
}