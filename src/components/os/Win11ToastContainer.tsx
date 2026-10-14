"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOSSettings } from "@/store/osSettingsStore";
import { OsIcon } from "@/components/icons/OsIcon";
import { Trophy, Bell, X } from "lucide-react";
import { systemMissions } from "@/data/systemMissions";

export default function Win11ToastContainer() {
  const { notifications, dismissNotification } = useOSSettings();

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
        {notifications.map((notif) => {
          const isMission =
            notif.type === "mission" ||
            systemMissions.some(
              (m) => m.title.trim().toLowerCase() === notif.title.trim().toLowerCase()
            );

          return (
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
                  background: isMission ? "rgba(245, 158, 11, 0.05)" : "rgba(255, 255, 255, 0.03)",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.04)",
                  fontSize: "11px",
                  fontWeight: 500,
                  color: "var(--os-text-muted)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  {isMission ? (
                    <>
                      <Trophy size={13} color="var(--os-amber)" />
                      <span style={{ letterSpacing: "0.05em", color: "var(--os-amber)", fontWeight: 600 }}>
                        MISSION ACCOMPLISHED
                      </span>
                    </>
                  ) : (
                    <>
                      <Bell size={13} color="var(--os-text-muted)" />
                      <span style={{ letterSpacing: "0.05em" }}>SYSTEM NOTIFICATION</span>
                    </>
                  )}
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
                  <X size={12} />
                </button>
              </div>

              {/* Content Body */}
              <div style={{ display: "flex", gap: "14px", padding: "12px 14px", alignItems: "center" }}>
                <div
                  style={{
                    fontSize: "26px",
                    lineHeight: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: isMission ? "rgba(245, 158, 11, 0.12)" : "rgba(255, 255, 255, 0.05)",
                    border: isMission ? "1px solid rgba(245, 158, 11, 0.25)" : "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "8px",
                    width: "48px",
                    height: "48px",
                    flexShrink: 0,
                    filter: isMission ? "drop-shadow(0 2px 8px rgba(245, 158, 11, 0.3))" : "none",
                    userSelect: "none",
                  }}
                >
                  <OsIcon
                    name={notif.icon || (isMission ? "trophy" : "notif")}
                    size="md"
                    color={isMission ? "var(--os-amber)" : undefined}
                  />
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
                  background: isMission
                    ? "linear-gradient(90deg, var(--os-amber), var(--os-jade))"
                    : "linear-gradient(90deg, #38bdf8, #818cf8)",
                  width: "100%",
                }}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
