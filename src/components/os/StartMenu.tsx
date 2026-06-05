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

  // Filter apps by search
  const filteredApps = WINDOW_CONFIGS.filter(cfg => 
    cfg.title.toLowerCase().includes(search.toLowerCase())
  );

  const pinnedApps = search ? filteredApps : WINDOW_CONFIGS.slice(0, 12);
  const recommendedApps = [
    { title: "logo-GitHub", subtitle: "43m ago", img: "/resume_res/icons/logo-GitHub.png", id: "contact" as WindowId },
    { title: "logo-GitHub", subtitle: "44m ago", img: "/resume_res/icons/logo-GitHub.png", id: "contact" as WindowId },
    { title: "logo-GitHub", subtitle: "45m ago", img: "/resume_res/icons/logo-GitHub.png", id: "contact" as WindowId },
    { title: "logo-Gmail", subtitle: "46m ago", img: "/resume_res/icons/logo-Gmail.svg", id: "contact" as WindowId },
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
        background: "var(--os-surface)",
        backdropFilter: "blur(40px)",
        WebkitBackdropFilter: "blur(40px)",
        border: "1px solid var(--os-border)",
        borderRadius: 16,
        zIndex: 9500,
        boxShadow: "0 12px 60px rgba(0,0,0,0.6)",
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
          background: "rgba(0, 0, 0, 0.4)",
          border: "1px solid rgba(255, 255, 255, 0.06)",
          borderRadius: 24,
          padding: "8px 16px",
          gap: 12,
          boxShadow: "inset 0 1px 2px rgba(0,0,0,0.5)",
        }}>
          <span style={{ fontSize: 18, color: "#00d4ff" }}>🔍</span>
          <input 
            type="text" 
            placeholder="Search for apps, settings, and documents" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "var(--os-text)",
              fontSize: 14,
            }}
          />
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "0 32px" }}>
        {/* Pinned Section */}
        <div style={{ marginTop: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <span style={{ fontSize: 15, fontWeight: 600 }}>Pinned</span>
            <button style={{ 
              background: "rgba(255,255,255,0.06)", 
              border: "1px solid rgba(255,255,255,0.04)", 
              padding: "4px 10px", 
              borderRadius: 6, 
              color: "#aaa", 
              fontSize: 12,
              cursor: "pointer"
            }}>
              All apps &rsaquo;
            </button>
          </div>
          
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(84px, 1fr))",
            gap: "20px 4px",
            justifyItems: "center"
          }}>
            {pinnedApps.map((cfg) => (
              <div
                key={cfg.id}
                onClick={() => onOpen(cfg.id)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                  padding: "12px 8px",
                  borderRadius: 8,
                  cursor: "pointer",
                  width: 84,
                  transition: "background 0.15s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              >
                <div style={{
                  width: 32,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                  filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.3))"
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
                  textOverflow: "ellipsis"
                }}>
                  {cfg.title.replace('.exe', '').replace('.sys', '').replace('/', '')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Section */}
        {!search && (
          <div style={{ marginTop: 40, marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <span style={{ fontSize: 15, fontWeight: 600 }}>Recommended</span>
              <button style={{ 
                background: "rgba(255,255,255,0.06)", 
                border: "1px solid rgba(255,255,255,0.04)", 
                padding: "4px 10px", 
                borderRadius: 6, 
                color: "#aaa", 
                fontSize: 12,
                cursor: "pointer"
              }}>
                More &rsaquo;
              </button>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16
            }}>
              {recommendedApps.map((app, idx) => (
                <div
                  key={idx}
                  onClick={() => onOpen(app.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    padding: "12px",
                    borderRadius: 8,
                    cursor: "pointer",
                    transition: "background 0.15s"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  <div style={{ width: 28, height: 28, flexShrink: 0 }}>
                    <img src={app.img} alt={app.title} style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: 4 }} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
                    <span style={{ fontSize: 13, color: "var(--os-text)", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{app.title}</span>
                    <span style={{ fontSize: 11, color: "var(--os-text-muted)", marginTop: 2 }}>{app.subtitle}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ 
        padding: "16px 32px", 
        background: "rgba(0,0,0,0.15)", 
        borderTop: "1px solid var(--os-border)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
      }}>
        <div 
          onClick={() => onOpen("about")}
          style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: 12,
          cursor: "pointer",
          padding: "6px 10px 6px 6px",
          borderRadius: 8,
          transition: "background 0.15s"
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
        >
          <div style={{ 
            width: 32, 
            height: 32, 
            borderRadius: "50%", 
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.1)",
            background: "#1c1c1e",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16
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
            color: "var(--os-text)",
            fontSize: 18,
            cursor: "pointer",
            transition: "background 0.15s"
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(239, 68, 68, 0.2)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
          onClick={() => window.location.reload()}
        >
          ⏻
        </button>
      </div>
    </motion.div>
  );
}
