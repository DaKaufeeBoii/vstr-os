"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOS } from "@/store/windowStore";
import { useSound } from "@/utils/useSound";

interface GitHubEvent {
  id: string;
  type: string;
  repo: { name: string };
  created_at: string;
  payload?: {
    commits?: { message: string; sha: string }[];
  };
}

export default function WidgetBoard() {
  const { isWidgetBoardOpen, closeWidgetBoard, windows } = useOS();
  const { playClick } = useSound();

  // ── GitHub Activity State ──────────────────────────────────────────
  const [gitEvents, setGitEvents] = useState<
    { repo: string; message: string; date: string }[]
  >([
    {
      repo: "DaKaufeeBoii/vstr-os",
      message: "feat(vfs): implement persistent indexeddb virtual file system",
      date: "Just now",
    },
    {
      repo: "DaKaufeeBoii/vstr-os",
      message: "feat(wm): add multi-instance window manager & workspaces",
      date: "1 hour ago",
    },
    {
      repo: "DaKaufeeBoii/EventOS",
      message: "refactor: optimize attendee check-in state synchronization",
      date: "Yesterday",
    },
  ]);
  const [gitLoading, setGitLoading] = useState(false);

  useEffect(() => {
    if (!isWidgetBoardOpen) return;
    let cancelled = false;
    setGitLoading(true);

    fetch("https://api.github.com/users/DaKaufeeBoii/events?per_page=5")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: GitHubEvent[]) => {
        if (cancelled || !Array.isArray(data) || data.length === 0) return;
        const pushEvents = data
          .filter((e) => e.type === "PushEvent" && e.payload?.commits?.length)
          .slice(0, 3)
          .map((e) => {
            const commit = e.payload?.commits?.[0];
            return {
              repo: e.repo.name,
              message: commit?.message || "Updated repository",
              date: new Date(e.created_at).toLocaleDateString("en-IN", {
                month: "short",
                day: "numeric",
              }),
            };
          });
        if (pushEvents.length > 0) {
          setGitEvents(pushEvents);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setGitLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isWidgetBoardOpen]);

  // ── LeetCode Stats State ───────────────────────────────────────────
  const [leetcodeStats, setLeetcodeStats] = useState({
    totalSolved: 142,
    easySolved: 68,
    mediumSolved: 64,
    hardSolved: 10,
    acceptanceRate: 64.2,
    ranking: 184200,
  });

  useEffect(() => {
    if (!isWidgetBoardOpen) return;
    fetch("/api/leetcode")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setLeetcodeStats(data);
      })
      .catch(() => {});
  }, [isWidgetBoardOpen]);

  // ── Real-Time Telemetry State ──────────────────────────────────────
  const [fps, setFps] = useState(60);
  const [memoryMB, setMemoryMB] = useState(48.5);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());

  useEffect(() => {
    if (!isWidgetBoardOpen) return;
    let animId: number;

    const measureFps = (now: number) => {
      frameCountRef.current += 1;
      if (now - lastTimeRef.current >= 1000) {
        setFps(frameCountRef.current);
        frameCountRef.current = 0;
        lastTimeRef.current = now;

        // Measure heap memory if supported
        if (typeof window !== "undefined" && (performance as any).memory) {
          const used = (performance as any).memory.usedJSHeapSize;
          setMemoryMB(parseFloat((used / (1024 * 1024)).toFixed(1)));
        } else {
          // Simulated smooth jitter between 45MB - 55MB
          setMemoryMB(parseFloat((45 + Math.random() * 8).toFixed(1)));
        }
      }
      animId = requestAnimationFrame(measureFps);
    };

    animId = requestAnimationFrame(measureFps);
    return () => cancelAnimationFrame(animId);
  }, [isWidgetBoardOpen]);

  if (!isWidgetBoardOpen) return null;

  const openCount = windows.filter((w) => w.isOpen).length;

  return (
    <AnimatePresence>
      <div
        onClick={closeWidgetBoard}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 85000,
          background: "rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(4px)",
        }}
      >
        <motion.div
          initial={{ x: -420, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -420, opacity: 0 }}
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: "48px", // taskbar height
            width: "390px",
            background: "rgba(18, 14, 40, 0.94)",
            backdropFilter: "blur(32px) saturate(180%)",
            WebkitBackdropFilter: "blur(32px) saturate(180%)",
            borderRight: "1px solid rgba(168, 85, 247, 0.3)",
            boxShadow: "10px 0 40px rgba(0, 0, 0, 0.6)",
            color: "#f8fafc",
            display: "flex",
            flexDirection: "column",
            padding: "20px",
            overflowY: "auto",
            gap: "18px",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingBottom: "12px",
              borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "20px" }}>🗂️</span>
              <div>
                <div style={{ fontSize: "15px", fontWeight: 600 }}>Widgets & Telemetry</div>
                <div style={{ fontSize: "11px", color: "var(--os-text-muted)" }}>
                  Live metrics • Alt + W
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                playClick();
                closeWidgetBoard();
              }}
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                border: "none",
                color: "#fff",
                borderRadius: "6px",
                width: "28px",
                height: "28px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontSize: "13px",
              }}
            >
              ✕
            </button>
          </div>

          {/* Weather & Location Banner */}
          <div
            style={{
              background: "linear-gradient(135deg, rgba(233, 69, 96, 0.15), rgba(168, 85, 247, 0.15))",
              border: "1px solid rgba(233, 69, 96, 0.3)",
              borderRadius: "12px",
              padding: "14px 16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontSize: "12px", color: "var(--os-text-muted)" }}>Hyderabad, India</div>
              <div style={{ fontSize: "24px", fontWeight: 700 }}>28°C</div>
              <div style={{ fontSize: "11px", color: "var(--os-text)" }}>Partly Cloudy • Humidity 58%</div>
            </div>
            <div style={{ fontSize: "36px" }}>⛅</div>
          </div>

          {/* Card 1: System Telemetry */}
          <div style={cardStyle}>
            <div style={cardHeaderStyle}>
              <span style={{ fontWeight: 600, fontSize: "13px" }}>⚡ Tab Telemetry</span>
              <span style={{ fontSize: "11px", color: "var(--os-amber)", fontFamily: "var(--font-mono)" }}>
                LIVE
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div style={statBoxStyle}>
                <div style={statLabelStyle}>FRAMES / SEC</div>
                <div style={{ fontSize: "18px", fontWeight: 700, color: fps >= 50 ? "#22c55e" : "#eab308" }}>
                  {fps} FPS
                </div>
              </div>

              <div style={statBoxStyle}>
                <div style={statLabelStyle}>TAB HEAP</div>
                <div style={{ fontSize: "18px", fontWeight: 700, color: "var(--os-cyan)" }}>
                  {memoryMB} MB
                </div>
              </div>

              <div style={statBoxStyle}>
                <div style={statLabelStyle}>ACTIVE APPS</div>
                <div style={{ fontSize: "18px", fontWeight: 700 }}>
                  {openCount} Windows
                </div>
              </div>

              <div style={statBoxStyle}>
                <div style={statLabelStyle}>VFS STORAGE</div>
                <div style={{ fontSize: "18px", fontWeight: 700, color: "var(--os-amber)" }}>
                  IndexedDB
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: GitHub Live Activity */}
          <div style={cardStyle}>
            <div style={cardHeaderStyle}>
              <span style={{ fontWeight: 600, fontSize: "13px" }}>🐙 GitHub Activity</span>
              <a
                href="https://github.com/DaKaufeeBoii"
                target="_blank"
                rel="noreferrer"
                style={{ fontSize: "11px", color: "var(--os-amber)", textDecoration: "none" }}
              >
                @DaKaufeeBoii ↗
              </a>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {gitEvents.map((evt, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "8px 10px",
                    background: "rgba(0, 0, 0, 0.25)",
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                    borderRadius: "8px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--os-cyan)" }}>
                      {evt.repo.split("/")[1] || evt.repo}
                    </span>
                    <span style={{ fontSize: "10px", color: "var(--os-text-muted)" }}>{evt.date}</span>
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#cbd5e1",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {evt.message}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: LeetCode Stats */}
          <div style={cardStyle}>
            <div style={cardHeaderStyle}>
              <span style={{ fontWeight: 600, fontSize: "13px" }}>🧩 LeetCode Stats</span>
              <span style={{ fontSize: "11px", color: "var(--os-text-muted)" }}>
                Rank #{leetcodeStats.ranking.toLocaleString()}
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginBottom: "8px" }}>
              <span style={{ fontSize: "28px", fontWeight: 700, color: "var(--os-amber)" }}>
                {leetcodeStats.totalSolved}
              </span>
              <span style={{ fontSize: "12px", color: "var(--os-text-muted)" }}>Problems Solved</span>
              <span style={{ marginLeft: "auto", fontSize: "12px", color: "#22c55e" }}>
                {leetcodeStats.acceptanceRate}% Rate
              </span>
            </div>

            {/* Breakdown Bars */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px" }}>
                <span style={{ color: "#22c55e" }}>Easy: {leetcodeStats.easySolved}</span>
                <span style={{ color: "#eab308" }}>Medium: {leetcodeStats.mediumSolved}</span>
                <span style={{ color: "#ef4444" }}>Hard: {leetcodeStats.hardSolved}</span>
              </div>
              <div
                style={{
                  height: "8px",
                  background: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "4px",
                  overflow: "hidden",
                  display: "flex",
                }}
              >
                <div
                  style={{
                    width: `${(leetcodeStats.easySolved / leetcodeStats.totalSolved) * 100}%`,
                    background: "#22c55e",
                  }}
                />
                <div
                  style={{
                    width: `${(leetcodeStats.mediumSolved / leetcodeStats.totalSolved) * 100}%`,
                    background: "#eab308",
                  }}
                />
                <div
                  style={{
                    width: `${(leetcodeStats.hardSolved / leetcodeStats.totalSolved) * 100}%`,
                    background: "#ef4444",
                  }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

const cardStyle: React.CSSProperties = {
  background: "rgba(255, 255, 255, 0.04)",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  borderRadius: "12px",
  padding: "14px",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

const cardHeaderStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const statBoxStyle: React.CSSProperties = {
  background: "rgba(0, 0, 0, 0.2)",
  padding: "8px 10px",
  borderRadius: "8px",
  border: "1px solid rgba(255, 255, 255, 0.04)",
};

const statLabelStyle: React.CSSProperties = {
  fontSize: "10px",
  color: "var(--os-text-muted)",
  fontFamily: "var(--font-mono)",
  marginBottom: "4px",
};
