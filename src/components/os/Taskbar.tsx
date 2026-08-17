"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOS, WINDOW_CONFIGS } from "@/store/windowStore";
import { useOSSettings } from "@/store/osSettingsStore";
import { systemMissions } from "@/data/systemMissions";
import StartMenu from "./StartMenu";
import { OsIcon } from "@/components/icons/OsIcon";
import { VolumeIcon, WifiIcon, BatteryIcon, VstrIcon } from "@/components/icons";
import { useSound } from "@/utils/useSound";

export default function Taskbar() {

  const { windows, openWindow, restoreWindow, focusWindow, minimizeWindow } = useOS();
  const { playClick } = useSound();
  const { unlockedMissions } = useOSSettings();
  const [timeStr, setTimeStr] = useState("");
  const [dateStr, setDateStr] = useState("");
  const [showStart, setShowStart] = useState(false);
  const [showMissionsWidget, setShowMissionsWidget] = useState(false);

  // Live clock and date (stacked Windows 11 style)
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      );
      setDateStr(
        `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const openWindows = windows.filter((w) => w.isOpen);

  return (
    <>
      <AnimatePresence>
        {showStart && (
          <StartMenu
            onClose={() => setShowStart(false)}
            onOpen={(id) => { openWindow(id); setShowStart(false); }}
          />
        )}
      </AnimatePresence>

      {/* OS Missions Widget Popup */}
      <AnimatePresence>
        {showMissionsWidget && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            style={{
              position: "fixed",
              bottom: "60px",
              right: "16px",
              width: "320px",
              maxHeight: "420px",
              background: "rgba(15, 20, 28, 0.9)",
              backdropFilter: "blur(20px) saturate(140%)",
              WebkitBackdropFilter: "blur(20px) saturate(140%)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "12px",
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.5)",
              color: "#fff",
              padding: "16px",
              zIndex: 9999,
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              fontFamily: "var(--font-mono)",
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "12px", fontWeight: "bold", color: "var(--os-amber)" }}>// OS MISSIONS</span>
              <button
                onClick={() => setShowMissionsWidget(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--os-text-muted)",
                  cursor: "pointer",
                  fontSize: "14px",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  transition: "color 0.15s",
                }}
                onMouseOver={(e) => e.currentTarget.style.color = "#fff"}
                onMouseOut={(e) => e.currentTarget.style.color = "var(--os-text-muted)"}
              >
                ✕
              </button>
            </div>

            {/* Progress */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "var(--os-text-muted)" }}>
                <span>PROGRESS</span>
                <span style={{ color: "var(--os-jade)", fontWeight: "bold" }}>{unlockedMissions.length} / {systemMissions.length}</span>
              </div>
              <div style={{ height: "4px", background: "rgba(255,255,255,0.06)", borderRadius: "2px", overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    width: `${Math.round((unlockedMissions.length / systemMissions.length) * 100)}%`,
                    background: "var(--os-jade)",
                    borderRadius: "2px",
                    boxShadow: "0 0 6px var(--os-jade)",
                    transition: "width 0.3s ease",
                  }}
                />
              </div>
            </div>

            {/* List */}
            <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px", paddingRight: "4px" }}>
              {systemMissions.map((m) => {
                const completed = unlockedMissions.includes(m.id);
                return (
                  <div
                    key={m.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      background: completed ? "rgba(16, 185, 129, 0.05)" : "rgba(255,255,255,0.02)",
                      border: `1px solid ${completed ? "rgba(16, 185, 129, 0.15)" : "rgba(255,255,255,0.04)"}`,
                      borderRadius: "6px",
                      padding: "6px 10px",
                      fontSize: "11px",
                      opacity: completed ? 1 : 0.6,
                      transition: "all 0.2s",
                    }}
                  >
                    <span style={{ fontSize: "16px", lineHeight: 1, display: "flex", alignItems: "center", justifyContent: "center", width: "20px" }}>
                      {completed ? m.icon : "🔒"}
                    </span>
                    <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.title}</span>
                    <span style={{ color: completed ? "var(--os-jade)" : "var(--os-text-dim)" }}>
                      {completed ? "✓" : "—"}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="os-taskbar" id="os-taskbar">
        {/* Start Button */}
        <button
          id="taskbar-start-btn"
          className="taskbar-start-btn"
          onClick={() => { playClick(); setShowStart((v) => !v); }}
          title="Start Menu"
          aria-label="Start Menu"
          aria-expanded={showStart}
          aria-haspopup="true"
        >
          <VstrIcon size={24} color="currentColor" />

        </button>

        <div className="taskbar-divider" />

        {/* Search Pill */}
        <div
          id="taskbar-search-pill"
          onClick={() => { playClick(); setShowStart(true); }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(255, 255, 255, 0.06)",
            border: "1px solid rgba(255, 255, 255, 0.05)",
            borderRadius: 20,
            padding: "4px 16px",
            height: 36,
            cursor: "pointer",
            color: "var(--os-text-muted)",
            fontSize: 13,
            transition: "background 0.15s",
            userSelect: "none",
            fontFamily: "'Segoe UI Variable', 'Segoe UI', system-ui, sans-serif",
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)"}
        >
          <OsIcon name="search" size="sm" color="var(--os-text-muted)" />
          <span>Search</span>
        </div>

        <div className="taskbar-divider" />

        {/* Open/Pinned Apps */}
        <div className="taskbar-apps">
          <AnimatePresence>
            {openWindows.map((win) => {
              const cfg = WINDOW_CONFIGS.find((c) => c.id === win.id);
              if (!cfg) return null;
              const isFocused = !win.isMinimized && win.zIndex === Math.max(...windows.map(w => w.isOpen && !w.isMinimized ? w.zIndex : 0));
              
              return (
                <motion.button
                  key={win.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => {
                    playClick();
                    if (win.isMinimized) {
                      restoreWindow(win.id);
                    } else if (isFocused) {
                      minimizeWindow(win.id);
                    } else {
                      focusWindow(win.id);
                    }
                  }}
                  className={`taskbar-app-btn ${isFocused ? 'active' : ''} ${win.isMinimized ? 'minimized' : ''}`}
                  title={cfg.title}
                  aria-label={cfg.title}
                  aria-pressed={isFocused}
                  role="tab"
                >
                  {/* App Fluent SVG icon */}
                  <span style={{ fontSize: 20, zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {cfg.fluentIcon ? (
                      <OsIcon name={cfg.fluentIcon} size="md" />
                    ) : (
                      cfg.icon
                    )}
                  </span>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Right Side (System tray & Clock) */}
        <div style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 12,
          height: "100%",
          paddingRight: 8,
          flexShrink: 0,
        }}>
          {/* Missions Quick View Icon */}
          <button
            onClick={() => { playClick(); setShowMissionsWidget((v) => !v); }}
            title="Missions Progress"
            aria-label="Missions Progress"
            aria-expanded={showMissionsWidget}
            style={{
              background: showMissionsWidget ? "rgba(255,255,255,0.08)" : "transparent",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              color: showMissionsWidget ? "var(--os-amber)" : "var(--os-text-muted)",
              padding: "4px 8px",
              borderRadius: 6,
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              if (!showMissionsWidget) e.currentTarget.style.color = "var(--os-text)";
            }}
            onMouseLeave={(e) => {
              if (!showMissionsWidget) e.currentTarget.style.color = "var(--os-text-muted)";
            }}
          >
            💬
          </button>

          <div style={{ width: 1, height: 18, background: "rgba(255,255,255,0.08)" }} />

          {/* Language & Network Icons */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              color: "var(--os-text-muted)",
              fontSize: 11,
              fontFamily: "'JetBrains Mono', monospace",
              userSelect: "none",
              padding: "4px 8px",
              borderRadius: 6,
            }}
          >
            <span>ENG</span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <WifiIcon size="sm" color="var(--os-text-muted)" />
              <VolumeIcon size="sm" color="var(--os-text-muted)" />
              <BatteryIcon size="sm" color="var(--os-text-muted)" />
            </div>
          </div>

          <div style={{ width: 1, height: 18, background: "rgba(255,255,255,0.08)" }} />

          {/* Windows 11 Stacked Date/Time */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            justifyContent: "center",
            fontSize: 11,
            fontFamily: "'JetBrains Mono', monospace",
            color: "var(--os-text)",
            lineHeight: 1.25,
            userSelect: "none",
          }}>
            <span style={{ fontWeight: 500 }}>{timeStr}</span>
            <span style={{ color: "var(--os-text-muted)", fontSize: 10 }}>{dateStr}</span>
          </div>
        </div>
      </div>
    </>
  );
}
