"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { WINDOW_CONFIGS } from "@/store/windowStore";
import type { WindowId } from "@/types";

interface StartMenuProps {
  onClose: () => void;
  onOpen: (id: WindowId) => void;
}

export default function StartMenu({ onClose, onOpen }: StartMenuProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState("");

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    setTimeout(() => document.addEventListener("mousedown", handler), 0);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  // Only show non-hidden apps in the start menu grid
  const visibleApps = WINDOW_CONFIGS.filter(
    (c) => !["flappy", "hintmaster", "photo_viewer", "disk_cleanup", "desktop_pet", "password_cracker"].includes(c.id)
  );
  const filteredApps = search
    ? WINDOW_CONFIGS.filter(cfg => cfg.title.toLowerCase().includes(search.toLowerCase()))
    : visibleApps;

  const recommendedApps = [
    { title: "GitHub", subtitle: "View my repositories", img: "/resume_res/icons/logo-GitHub.png", id: "contact" as WindowId },
    { title: "LinkedIn", subtitle: "Connect professionally", img: "/resume_res/icons/logo-Lin.jpg", id: "contact" as WindowId },
    { title: "Gmail", subtitle: "Send me an email", img: "/resume_res/icons/logo-Gmail.svg", id: "contact" as WindowId },
    { title: "Terminal", subtitle: "Type 'help' to explore", img: null, id: "terminal" as WindowId },
  ];

  return (
    <motion.div
      ref={ref}
      id="start-menu"
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 380, damping: 30 }}
      style={{
        position: "fixed",
        bottom: "calc(var(--taskbar-h) + 12px)",
        left: "50%",
        transform: "translateX(-50%)",
        width: "min(640px, 95vw)",
        height: "720px",
        maxHeight: "85vh",
        background: "rgba(10, 14, 20, 0.97)",
        backdropFilter: "blur(40px)",
        WebkitBackdropFilter: "blur(40px)",
        border: "1px solid rgba(40, 48, 58, 0.85)",
        borderRadius: 16,
        zIndex: 9500,
        boxShadow: "0 12px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(245,158,11,0.06)",
        display: "flex",
        flexDirection: "column",
        color: "var(--os-text)",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Search Bar */}
      <div style={{ padding: "32px 32px 16px" }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          background: "rgba(0, 0, 0, 0.5)",
          border: "1px solid rgba(245, 158, 11, 0.15)",
          borderRadius: 24,
          padding: "8px 16px",
          gap: 12,
          boxShadow: "inset 0 1px 3px rgba(0,0,0,0.5)",
          transition: "border-color 0.2s",
        }}>
          <span style={{ fontSize: 16, color: "var(--os-amber)" }}>⌕</span>
          <input
            type="text"
            placeholder="Search apps…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "var(--os-text)",
              fontSize: 14,
              fontFamily: "'Inter', sans-serif",
            }}
          />
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "0 32px" }}>
        {/* Pinned Section */}
        <div style={{ marginTop: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--os-text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>
              {search ? "Results" : "Pinned"}
            </span>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(84px, 1fr))",
            gap: "16px 4px",
            justifyItems: "center",
          }}>
            {filteredApps.map((cfg) => (
              <div
                key={cfg.id}
                onClick={() => { onOpen(cfg.id); onClose(); }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                  padding: "12px 8px",
                  borderRadius: 10,
                  cursor: "pointer",
                  width: 84,
                  transition: "background 0.15s, transform 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(245,158,11,0.08)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div style={{
                  width: 36,
                  height: 36,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 26,
                  filter: "drop-shadow(0 2px 6px rgba(245,158,11,0.2))",
                }}>
                  {cfg.icon}
                </div>
                <span style={{
                  fontSize: 11,
                  color: "var(--os-text)",
                  textAlign: "center",
                  width: "100%",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  fontFamily: "'Inter', sans-serif",
                }}>
                  {cfg.title.replace(".app", "").replace(".sys", "").replace(".exe", "").replace(".txt", "").replace(".log", "").replace("/", "")}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Section */}
        {!search && (
          <div style={{ marginTop: 36, marginBottom: 20 }}>
            <div style={{ marginBottom: 16 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--os-text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>
                Quick Links
              </span>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}>
              {recommendedApps.map((app, idx) => (
                <div
                  key={idx}
                  onClick={() => { onOpen(app.id); onClose(); }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "10px 12px",
                    borderRadius: 10,
                    cursor: "pointer",
                    border: "1px solid transparent",
                    transition: "background 0.15s, border-color 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(245,158,11,0.06)";
                    e.currentTarget.style.borderColor = "rgba(245,158,11,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.borderColor = "transparent";
                  }}
                >
                  <div style={{ width: 28, height: 28, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {app.img
                      ? <img src={app.img} alt={app.title} style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: 4 }} />
                      : <span style={{ fontSize: 22 }}>⌨️</span>
                    }
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
                    <span style={{ fontSize: 13, color: "var(--os-text)", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{app.title}</span>
                    <span style={{ fontSize: 11, color: "var(--os-text-muted)", marginTop: 1 }}>{app.subtitle}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{
        padding: "14px 32px",
        background: "rgba(0,0,0,0.2)",
        borderTop: "1px solid rgba(40,48,58,0.85)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
      }}>
        <div
          onClick={() => { onOpen("about"); onClose(); }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            cursor: "pointer",
            padding: "6px 10px 6px 6px",
            borderRadius: 8,
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(245,158,11,0.08)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
        >
          <div style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            overflow: "hidden",
            border: "1px solid rgba(245,158,11,0.2)",
            background: "#1a1f2e",
          }}>
            <img src="/pix_image.png" alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover", imageRendering: "pixelated" }} />
          </div>
          <span style={{ fontSize: 12, fontWeight: 500, color: "var(--os-text)" }}>Sai Tarun Reddy Velagala</span>
        </div>

        <button
          title="Shut Down"
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "transparent",
            border: "none",
            color: "var(--os-text-muted)",
            fontSize: 18,
            cursor: "pointer",
            transition: "background 0.15s, color 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(239, 68, 68, 0.15)";
            e.currentTarget.style.color = "#ef4444";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--os-text-muted)";
          }}
          onClick={() => window.location.reload()}
        >
          ⏻
        </button>
      </div>
    </motion.div>
  );
}
