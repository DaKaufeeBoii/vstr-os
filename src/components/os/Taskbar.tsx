"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOS, WINDOW_CONFIGS } from "@/store/windowStore";
import StartMenu from "./StartMenu";

export default function Taskbar() {
  const { windows, openWindow, restoreWindow, focusWindow, minimizeWindow } = useOS();
  const [timeStr, setTimeStr] = useState("");
  const [dateStr, setDateStr] = useState("");
  const [showStart, setShowStart] = useState(false);

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

      <div className="os-taskbar" id="os-taskbar" style={{ display: "flex", justifyContent: "space-between" }}>
        {/* Left Side (Empty spacer to balance the clock on the right) */}
        <div style={{ flex: 1, display: "flex", alignItems: "center" }} />

        {/* Center Container (Windows 11 Centered Items) */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          height: "100%",
          zIndex: 9005,
        }}>
          {/* Windows 11 Grid Start Button */}
          <button
            id="taskbar-start-btn"
            onClick={() => setShowStart((v) => !v)}
            title="Start Menu"
            style={{
              width: 32,
              height: 32,
              borderRadius: 6,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              color: "var(--os-amber)",
              transition: "transform 0.15s, filter 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.15)";
              e.currentTarget.style.filter = "drop-shadow(0 0 8px var(--os-amber))";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.filter = "none";
            }}
          >
            ❖
          </button>

          {/* Search Pill */}
          <div
            id="taskbar-search-pill"
            onClick={() => setShowStart(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.05)",
              borderRadius: 16,
              padding: "4px 14px",
              height: 28,
              cursor: "pointer",
              color: "var(--os-text-muted)",
              fontSize: 12,
              transition: "background 0.15s",
              userSelect: "none",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.12)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)"}
          >
            <span>🔍</span>
            <span>Search</span>
          </div>

          <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.12)" }} />

          {/* Open/Pinned Apps Icons */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, height: "100%" }}>
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
                      if (win.isMinimized) {
                        restoreWindow(win.id);
                      } else if (isFocused) {
                        minimizeWindow(win.id);
                      } else {
                        focusWindow(win.id);
                      }
                    }}
                    style={{
                      width: 36,
                      height: "100%",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                      gap: 4,
                    }}
                    title={cfg.title}
                  >
                    {/* Hover backdrop */}
                    <div style={{
                      position: "absolute",
                      inset: "6px 2px",
                      borderRadius: 6,
                      background: isFocused ? "rgba(255,255,255,0.06)" : "transparent",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      if (!isFocused) e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)";
                    }}
                    onMouseLeave={(e) => {
                      if (!isFocused) e.currentTarget.style.background = "transparent";
                    }}
                    />

                    {/* App Emoji Icon */}
                    <span style={{ fontSize: 20, zIndex: 1, filter: isFocused ? "drop-shadow(0 0 6px var(--os-amber))" : "none" }}>
                      {cfg.icon}
                    </span>

                    {/* Dynamic line indicator at the bottom */}
                    <div style={{
                      position: "absolute",
                      bottom: 3,
                      height: 3,
                      borderRadius: 1.5,
                      background: isFocused ? "var(--os-amber)" : "var(--os-text-muted)",
                      width: isFocused ? 16 : win.isMinimized ? 4 : 8,
                      transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                      boxShadow: isFocused ? "0 0 8px var(--os-amber)" : "none",
                    }} />
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Side (System tray & Clock) */}
        <div style={{
          flex: 1,
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 16,
          height: "100%",
          paddingRight: 16,
          zIndex: 9010,
        }}>
          {/* Language & Network Icons */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            color: "var(--os-text-muted)",
            fontSize: 11,
            fontFamily: "'JetBrains Mono', monospace",
            userSelect: "none",
          }}>
            <span>ENG</span>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
              <span>📶</span>
              <span>🔊</span>
              <span title="Battery Charged">🔋100%</span>
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
