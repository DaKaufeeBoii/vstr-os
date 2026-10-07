"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOS, WINDOW_CONFIGS } from "@/store/windowStore";
import { OsIcon } from "@/components/icons/OsIcon";
import { useSound } from "@/utils/useSound";

export default function TaskView() {
  const {
    isExposéOpen,
    closeExposé,
    workspaces,
    activeWorkspaceId,
    switchWorkspace,
    addWorkspace,
    removeWorkspace,
    moveWindowToWorkspace,
    windows,
    focusWindow,
    restoreWindow,
    closeWindow,
  } = useOS();

  const { playClick } = useSound();

  if (!isExposéOpen) return null;

  const currentWorkspaceWindows = windows.filter(
    (w) =>
      w.isOpen &&
      (w.desktopId === undefined || w.desktopId === activeWorkspaceId || w.isSticky)
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={closeExposé}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 90000,
          background: "rgba(10, 8, 28, 0.75)",
          backdropFilter: "blur(28px) saturate(160%)",
          WebkitBackdropFilter: "blur(28px) saturate(160%)",
          display: "flex",
          flexDirection: "column",
          padding: "28px 40px",
          color: "#fff",
          userSelect: "none",
        }}
      >
        {/* Top: Header & Desktops Bar */}
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "14px",
            marginBottom: "32px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "18px", fontWeight: 600, letterSpacing: "-0.01em" }}>
                Task View / Desktops
              </span>
              <span
                style={{
                  fontSize: "12px",
                  color: "var(--os-amber)",
                  fontFamily: "var(--font-mono)",
                  background: "rgba(233, 69, 96, 0.15)",
                  padding: "2px 8px",
                  borderRadius: "4px",
                }}
              >
                Win + Tab
              </span>
            </div>
            <button
              onClick={closeExposé}
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                border: "none",
                color: "#fff",
                borderRadius: "6px",
                padding: "6px 12px",
                cursor: "pointer",
                fontSize: "13px",
              }}
            >
              Done (Esc)
            </button>
          </div>

          {/* Desktop Thumbnails Strip */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              overflowX: "auto",
              paddingBottom: "8px",
            }}
          >
            {workspaces.map((ws) => {
              const isActive = ws.id === activeWorkspaceId;
              const count = windows.filter(
                (w) => w.isOpen && (w.desktopId === ws.id || w.isSticky)
              ).length;

              return (
                <div
                  key={ws.id}
                  onClick={() => {
                    playClick();
                    switchWorkspace(ws.id);
                  }}
                  style={{
                    minWidth: "160px",
                    height: "96px",
                    background: isActive
                      ? "rgba(168, 85, 247, 0.25)"
                      : "rgba(255, 255, 255, 0.05)",
                    border: isActive
                      ? "2px solid var(--os-amber)"
                      : "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "10px",
                    padding: "10px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    position: "relative",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "13px", fontWeight: isActive ? 600 : 400 }}>
                      {ws.name}
                    </span>
                    {workspaces.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          playClick();
                          removeWorkspace(ws.id);
                        }}
                        title="Close Desktop"
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "rgba(255,255,255,0.6)",
                          cursor: "pointer",
                          fontSize: "12px",
                          padding: "2px 4px",
                          borderRadius: "4px",
                        }}
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <div style={{ fontSize: "11px", color: "var(--os-text-muted)" }}>
                    {count} open {count === 1 ? "window" : "windows"}
                  </div>
                </div>
              );
            })}

            {/* New Desktop Button */}
            <button
              onClick={() => {
                playClick();
                addWorkspace();
              }}
              style={{
                minWidth: "130px",
                height: "96px",
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px dashed rgba(255, 255, 255, 0.2)",
                borderRadius: "10px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                color: "var(--os-text-muted)",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--os-amber)";
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
                e.currentTarget.style.color = "var(--os-text-muted)";
              }}
            >
              <span style={{ fontSize: "20px" }}>+</span>
              <span style={{ fontSize: "12px" }}>New Desktop</span>
            </button>
          </div>
        </div>

        {/* Center: Open Windows Overview for Selected Desktop */}
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            flex: 1,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {currentWorkspaceWindows.length === 0 ? (
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                color: "var(--os-text-muted)",
              }}
            >
              <span style={{ fontSize: "40px" }}>🪟</span>
              <span style={{ fontSize: "15px" }}>No open windows on this desktop</span>
              <span style={{ fontSize: "12px" }}>Open apps from the taskbar or desktop shortcuts</span>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "20px",
                padding: "8px 0",
              }}
            >
              {currentWorkspaceWindows.map((win) => {
                const cfg = WINDOW_CONFIGS.find((c) => c.id === win.id);
                return (
                  <motion.div
                    key={win.instanceId}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => {
                      playClick();
                      if (win.isMinimized) restoreWindow(win.instanceId);
                      focusWindow(win.instanceId);
                      closeExposé();
                    }}
                    style={{
                      background: "rgba(20, 16, 45, 0.85)",
                      border: "1px solid rgba(168, 85, 247, 0.3)",
                      borderRadius: "10px",
                      overflow: "hidden",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      boxShadow: "0 8px 30px rgba(0, 0, 0, 0.4)",
                      position: "relative",
                    }}
                  >
                    {/* Card Titlebar */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "8px 12px",
                        background: "rgba(255, 255, 255, 0.05)",
                        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        {cfg?.fluentIcon ? (
                          <OsIcon name={cfg.fluentIcon} size="sm" />
                        ) : (
                          <span>{cfg?.icon}</span>
                        )}
                        <span
                          style={{
                            fontSize: "12px",
                            fontWeight: 500,
                            maxWidth: "160px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {win.title || cfg?.title}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          playClick();
                          closeWindow(win.instanceId);
                        }}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "rgba(255, 255, 255, 0.6)",
                          cursor: "pointer",
                          fontSize: "12px",
                          padding: "2px 6px",
                          borderRadius: "4px",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#ff4d4f")}
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.color = "rgba(255, 255, 255, 0.6)")
                        }
                      >
                        ✕
                      </button>
                    </div>

                    {/* Card Preview Body */}
                    <div
                      style={{
                        height: "140px",
                        background: "rgba(0, 0, 0, 0.3)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    >
                      <span style={{ fontSize: "32px", opacity: 0.75 }}>
                        {cfg?.fluentIcon ? (
                          <OsIcon name={cfg.fluentIcon} size="lg" />
                        ) : (
                          cfg?.icon || "🪟"
                        )}
                      </span>
                      <span style={{ fontSize: "11px", color: "var(--os-text-muted)" }}>
                        {win.width} × {win.height} px
                      </span>
                    </div>

                    {/* Footer with Move Workspace controls */}
                    <div
                      style={{
                        padding: "6px 12px",
                        background: "rgba(0, 0, 0, 0.2)",
                        borderTop: "1px solid rgba(255, 255, 255, 0.05)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: "11px",
                      }}
                    >
                      <span style={{ color: "var(--os-text-muted)" }}>
                        {win.isMinimized ? "Minimized" : "Active"}
                      </span>
                      {workspaces.length > 1 && (
                        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                          <span style={{ color: "var(--os-text-muted)" }}>Move:</span>
                          {workspaces
                            .filter((w) => w.id !== activeWorkspaceId)
                            .map((targetWs) => (
                              <button
                                key={targetWs.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  playClick();
                                  moveWindowToWorkspace(win.instanceId, targetWs.id);
                                }}
                                style={{
                                  background: "rgba(255, 255, 255, 0.08)",
                                  border: "none",
                                  color: "var(--os-amber)",
                                  borderRadius: "4px",
                                  padding: "2px 6px",
                                  fontSize: "10px",
                                  cursor: "pointer",
                                }}
                              >
                                {targetWs.name}
                              </button>
                            ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
