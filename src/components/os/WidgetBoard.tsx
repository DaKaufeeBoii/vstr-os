"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOS } from "@/store/windowStore";
import { useOSSettings } from "@/store/osSettingsStore";
import { useSound } from "@/utils/useSound";
import { OsIcon } from "@/components/icons/OsIcon";
import { X, Settings, Activity, GitBranch, Code2 } from "lucide-react";
import { useWidgetData } from "@/hooks/useWidgetData";
import { ensureWidgetSync, refreshWidgetsNow } from "@/lib/widgets/widgetSync";

export default function WidgetBoard() {
  const { isWidgetBoardOpen, closeWidgetBoard, windows } = useOS();
  const { widgets, toggleWidgetBoard } = useOSSettings();
  const { playClick } = useSound();

  // Shared background sync (singleton): this board only *reads* payloads —
  // GitHub, LeetCode, and FPS telemetry are produced once for the whole OS.
  const { fps, memory, githubEvents, leetcode } = useWidgetData();

  useEffect(() => {
    ensureWidgetSync();
    if (isWidgetBoardOpen) refreshWidgetsNow();
  }, [isWidgetBoardOpen]);

  const gitEvents = githubEvents;
  const leetcodeStats = leetcode;
  const memoryMB = memory === "N/A" ? null : parseFloat(memory);

  if (!isWidgetBoardOpen) return null;

  const isVisible = (id: string) => widgets.find(w => w.id === id)?.visibleOnBoard ?? true;

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
            bottom: "48px",
            width: "390px",
            background: "rgba(18, 14, 40, 0.94)",
            backdropFilter: "blur(32px) saturate(180%)",
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
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "12px", borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <OsIcon name="widgets" size="md" />
              <div>
                <div style={{ fontSize: "15px", fontWeight: 600 }}>Widgets & Telemetry</div>
              </div>
            </div>
            <button onClick={() => { playClick(); closeWidgetBoard(); }} style={{ background: "rgba(255, 255, 255, 0.08)", border: "none", color: "#fff", borderRadius: "6px", width: "28px", height: "28px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={14} /></button>
          </div>

          {/* Widget Manager */}
          <div style={cardStyle}>
            <div style={cardHeaderStyle}><span style={{ fontWeight: 600, fontSize: "13px", display: "inline-flex", alignItems: "center", gap: 6 }}><Settings size={14} color="var(--os-amber)" /> Customize Widgets</span></div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {widgets.map(w => (
                <div key={w.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px" }}>
                  <span>{w.name}</span>
                  <button 
                    onClick={() => toggleWidgetBoard(w.id)}
                    style={{ background: w.visibleOnBoard ? "var(--os-amber)" : "rgba(255,255,255,0.1)", border: "none", borderRadius: "4px", padding: "2px 8px", cursor: "pointer", color: w.visibleOnBoard ? "black" : "white" }}
                  >
                    {w.visibleOnBoard ? "On" : "Off"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Card: Telemetry */}
          {isVisible("telemetry") && (
            <div style={cardStyle}>
              <div style={cardHeaderStyle}><span style={{ fontWeight: 600, fontSize: "13px", display: "inline-flex", alignItems: "center", gap: 6 }}><Activity size={14} color="var(--os-amber)" /> Tab Telemetry</span></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div style={statBoxStyle}><div style={statLabelStyle}>FPS</div><div style={{ fontSize: "16px", fontWeight: 700 }}>{fps}</div></div>
                <div style={statBoxStyle}><div style={statLabelStyle}>HEAP</div><div style={{ fontSize: "16px", fontWeight: 700 }}>{memoryMB !== null ? `${memoryMB} MB` : "N/A"}</div></div>
              </div>
            </div>
          )}

          {/* Card: GitHub */}
          {isVisible("github") && (
            <div style={cardStyle}>
              <div style={cardHeaderStyle}><span style={{ fontWeight: 600, fontSize: "13px", display: "inline-flex", alignItems: "center", gap: 6 }}><GitBranch size={14} color="var(--os-amber)" /> GitHub</span></div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {gitEvents.length > 0 ? gitEvents.map((evt, idx) => (
                  <div key={idx} style={{ fontSize: "11px", padding: "4px", background: "rgba(0,0,0,0.2)", borderRadius: "4px" }}>
                    {evt.repo.split("/")[1]} : {evt.message}
                  </div>
                )) : <div style={{ fontSize: "11px", color: "var(--os-text-muted)" }}>Loading events...</div>}
              </div>
            </div>
          )}

          {/* Card: LeetCode */}
          {isVisible("leetcode") && (
            <div style={cardStyle}>
              <div style={cardHeaderStyle}><span style={{ fontWeight: 600, fontSize: "13px", display: "inline-flex", alignItems: "center", gap: 6 }}><Code2 size={14} color="var(--os-amber)" /> LeetCode</span></div>
              <div style={{ fontSize: "14px" }}>{leetcodeStats ? `${leetcodeStats.totalSolved} Solved` : "Loading..."}</div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

const cardStyle: React.CSSProperties = { background: "rgba(255, 255, 255, 0.04)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "12px", padding: "14px", display: "flex", flexDirection: "column", gap: "10px" };
const cardHeaderStyle: React.CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "center" };
const statBoxStyle: React.CSSProperties = { background: "rgba(0, 0, 0, 0.2)", padding: "6px 8px", borderRadius: "6px" };
const statLabelStyle: React.CSSProperties = { fontSize: "9px", color: "var(--os-text-muted)" };
