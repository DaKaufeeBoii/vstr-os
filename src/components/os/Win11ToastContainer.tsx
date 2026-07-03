"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOS } from "@/store/windowStore";

export default function Win11ToastContainer() {
  const { notifications, dismissNotification } = useOS();

  return (
    <div
      style={{
        position: "absolute",
        bottom: "60px", // Just above the taskbar (48px + padding)
        right: "20px",
        zIndex: 99999,
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        pointerEvents: "none",
        width: "360px",
        maxWidth: "90vw",
      }}
    >
      <AnimatePresence>
        {notifications.map((notif) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            layout
            style={{
              pointerEvents: "auto",
              background: "rgba(15, 20, 28, 0.85)",
              backdropFilter: "blur(20px) saturate(140%)",
              WebkitBackdropFilter: "blur(20px) saturate(140%)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "8px",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.35)",
              color: "#fff",
              overflow: "hidden",
              fontFamily: "var(--font-inter), sans-serif",
            }}
          >
            {/* Header / Origin Bar */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 12px",
                background: "rgba(255, 255, 255, 0.03)",
                borderBottom: "1px solid rgba(255, 255, 255, 0.04)",
                fontSize: "11px",
                fontWeight: 500,
                color: "var(--os-text-muted)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "13px" }}>🏆</span>
                <span style={{ letterSpacing: "0.05em" }}>MISSION ACCOMPLISHED</span>
              </div>
              <button
                onClick={() => dismissNotification(notif.id)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--os-text-muted)",
                  cursor: "pointer",
                  fontSize: "14px",
                  lineHeight: 1,
                  padding: "2px 6px",
                  borderRadius: "4px",
                  transition: "background 0.2s, color 0.2s",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
                  e.currentTarget.style.color = "#fff";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--os-text-muted)";
                }}
              >
                ✕
              </button>
            </div>

            {/* Content Body */}
            <div style={{ display: "flex", gap: "14px", padding: "12px 14px" }}>
              <div
                style={{
                  fontSize: "34px",
                  lineHeight: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(245, 158, 11, 0.12)",
                  border: "1px solid rgba(245, 158, 11, 0.25)",
                  borderRadius: "8px",
                  width: "52px",
                  height: "52px",
                  flexShrink: 0,
                  filter: "drop-shadow(0 2px 8px rgba(245, 158, 11, 0.3))",
                }}
              >
                {notif.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <h4
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "var(--os-text)",
                    margin: 0,
                    lineHeight: 1.3,
                  }}
                >
                  {notif.title}
                </h4>
                <p
                  style={{
                    fontSize: "12px",
                    color: "var(--os-text-muted)",
                    margin: "4px 0 0 0",
                    lineHeight: 1.4,
                  }}
                >
                  {notif.description}
                </p>
              </div>
            </div>

            {/* Accent colored progress-bar decoration at bottom */}
            <div
              style={{
                height: "3px",
                background: "linear-gradient(90deg, var(--os-amber), var(--os-jade))",
                width: "100%",
              }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
