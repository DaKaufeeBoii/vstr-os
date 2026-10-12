"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Keyboard, X } from "lucide-react";
import { useSound } from "@/utils/useSound";

const STORAGE_KEY = "vstr_onboarding_dismissed";

const SHORTCUT_ITEMS = [
  { keys: ["Alt", "S"], altKeys: ["Alt", "M"], label: "Start Menu", desc: "Launch apps, power, and settings" },
  { keys: ["Alt", "K"], label: "Search / Palette", desc: "Command palette & quick finder" },
  { keys: ["Alt", "V"], altKeys: ["Alt", "O"], label: "Task View", desc: "Window overview & workspaces" },
  { keys: ["Alt", "["], altKeys: ["Alt", "]"], label: "Switch Windows", desc: "Cycle through open applications" },
  { keys: ["Ctrl", "`"], label: "Terminal Drawer", desc: "Quick drop-down terminal console" },
  { keys: ["Alt", "W"], label: "Widgets Board", desc: "Desktop widgets & system monitor" },
  { keys: ["Alt", "Q"], label: "Quick Settings", desc: "Theme, volume & display toggles" },
  { keys: ["Alt", "N"], label: "Notification Center", desc: "System notifications & calendar" },
  { keys: ["Alt", "1"], altKeys: ["Alt", "2"], label: "Workspaces", desc: "Switch virtual desktops" },
  { keys: ["Esc"], label: "Close / Cancel", desc: "Dismiss menus, popups, and overlays" },
];

export default function OnboardingTip() {
  const [visible, setVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<"shortcuts" | "tips">("shortcuts");
  const { playClick } = useSound();

  useEffect(() => {
    // Show on initial visit
    if (localStorage.getItem(STORAGE_KEY) !== "true") {
      const timer = setTimeout(() => {
        setVisible(true);
        setActiveTab("shortcuts");
      }, 1400);
      return () => clearTimeout(timer);
    }
  }, []);

  // Listen for global shortcut guide toggle event (Alt+/ or tray button)
  useEffect(() => {
    const handleToggle = () => {
      setVisible((prev) => !prev);
      setActiveTab("shortcuts");
    };
    window.addEventListener("toggle-shortcuts-guide", handleToggle);
    return () => window.removeEventListener("toggle-shortcuts-guide", handleToggle);
  }, []);

  const dismiss = () => {
    playClick();
    localStorage.setItem(STORAGE_KEY, "true");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 15, scale: 0.95 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: "fixed",
            bottom: "calc(var(--taskbar-h, 48px) + 16px)",
            right: 16,
            zIndex: 9000,
            width: "min(380px, 92vw)",
            maxHeight: "80vh",
            padding: "16px",
            borderRadius: 12,
            background: "rgba(18, 24, 34, 0.96)",
            backdropFilter: "blur(24px) saturate(160%)",
            WebkitBackdropFilter: "blur(24px) saturate(160%)",
            border: "1px solid rgba(245, 158, 11, 0.25)",
            boxShadow: "0 12px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(245, 158, 11, 0.08)",
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            color: "var(--os-text-muted)",
            display: "flex",
            flexDirection: "column",
            gap: 12,
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ display: "flex", alignItems: "center", color: "var(--os-amber)" }}>
                <Keyboard size={16} />
              </span>
              <span style={{ color: "var(--os-text)", fontWeight: 700, fontSize: 13, letterSpacing: "0.02em" }}>
                Keyboard Shortcuts &amp; Tips
              </span>
            </div>
            <button
              onClick={dismiss}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--os-text-muted)",
                cursor: "pointer",
                padding: "2px 4px",
                borderRadius: 4,
                display: "flex",
                alignItems: "center",
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--os-text-muted)")}
              title="Close (Esc)"
              aria-label="Close"
            >
              <X size={14} />
            </button>
          </div>

          {/* Tab selector */}
          <div style={{ display: "flex", gap: 6, background: "rgba(255, 255, 255, 0.04)", padding: 3, borderRadius: 8 }}>
            <button
              type="button"
              onClick={() => { playClick(); setActiveTab("shortcuts"); }}
              style={{
                flex: 1,
                padding: "4px 8px",
                borderRadius: 6,
                border: "none",
                cursor: "pointer",
                fontSize: 11,
                fontWeight: activeTab === "shortcuts" ? 600 : 400,
                background: activeTab === "shortcuts" ? "rgba(245, 158, 11, 0.18)" : "transparent",
                color: activeTab === "shortcuts" ? "var(--os-amber)" : "var(--os-text-muted)",
                transition: "all 0.15s ease",
              }}
            >
              ⚡ Shortcuts (Alt+/)
            </button>
            <button
              type="button"
              onClick={() => { playClick(); setActiveTab("tips"); }}
              style={{
                flex: 1,
                padding: "4px 8px",
                borderRadius: 6,
                border: "none",
                cursor: "pointer",
                fontSize: 11,
                fontWeight: activeTab === "tips" ? 600 : 400,
                background: activeTab === "tips" ? "rgba(245, 158, 11, 0.18)" : "transparent",
                color: activeTab === "tips" ? "var(--os-amber)" : "var(--os-text-muted)",
                transition: "all 0.15s ease",
              }}
            >
              ✨ Navigation Tips
            </button>
          </div>

          {/* Content Area */}
          {activeTab === "shortcuts" ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                maxHeight: "320px",
                overflowY: "auto",
                paddingRight: 4,
              }}
            >
              <p style={{ fontSize: 11, color: "var(--os-amber)", opacity: 0.85, margin: "0 0 2px" }}>
                // Conflict-Free System Shortcuts
              </p>
              {SHORTCUT_ITEMS.map((item) => (
                <div
                  key={item.label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 8,
                    padding: "6px 8px",
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.04)",
                    borderRadius: 6,
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <span style={{ color: "var(--os-text)", fontSize: 11, fontWeight: 600 }}>{item.label}</span>
                    <span style={{ fontSize: 10, color: "var(--os-text-dim)" }}>{item.desc}</span>
                  </div>
                  <div style={{ display: "flex", gap: 3, alignItems: "center", flexShrink: 0 }}>
                    <kbd style={kbdStyle}>{item.keys.join(" + ")}</kbd>
                    {item.altKeys && (
                      <>
                        <span style={{ fontSize: 10, color: "var(--os-text-dim)" }}>/</span>
                        <kbd style={kbdStyle}>{item.altKeys.join(" + ")}</kbd>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 12, lineHeight: 1.6 }}>
              <p>
                • <strong style={{ color: "var(--os-text)" }}>Desktop Apps:</strong> Double-click any icon to launch its window.
              </p>
              <p>
                • <strong style={{ color: "var(--os-text)" }}>Interactive Terminal:</strong> Launch Terminal and type{" "}
                <code style={{ color: "var(--os-cyan)" }}>help</code> to unlock CTF flags, games, and commands.
              </p>
              <p>
                • <strong style={{ color: "var(--os-text)" }}>One-Click Resume:</strong> Click the{" "}
                <span style={{ color: "var(--os-amber)" }}>📄 Resume</span> button in the taskbar to inspect credentials without window navigation.
              </p>
              <p>
                • <strong style={{ color: "var(--os-text)" }}>Recall this dialog:</strong> Press{" "}
                <kbd style={kbdStyle}>Alt + /</kbd> or <kbd style={kbdStyle}>?</kbd> anytime.
              </p>
            </div>
          )}

          {/* Footer */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 4 }}>
            <span style={{ fontSize: 10, color: "var(--os-text-dim)" }}>
              Recall anytime: <kbd style={{ ...kbdStyle, padding: "1px 5px", fontSize: 9 }}>Alt + /</kbd>
            </span>
            <button
              type="button"
              onClick={dismiss}
              style={{
                padding: "5px 12px",
                borderRadius: 6,
                border: "1px solid rgba(245,158,11,0.35)",
                background: "var(--os-amber-dim)",
                color: "var(--os-amber)",
                fontFamily: "inherit",
                fontSize: 11,
                fontWeight: 600,
                cursor: "pointer",
                letterSpacing: "0.02em",
              }}
            >
              Got it
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const kbdStyle: React.CSSProperties = {
  background: "rgba(255, 255, 255, 0.08)",
  border: "1px solid rgba(255, 255, 255, 0.15)",
  borderRadius: 4,
  padding: "2px 6px",
  fontSize: 10,
  color: "var(--os-amber)",
  fontFamily: "var(--font-mono)",
  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.4)",
};
