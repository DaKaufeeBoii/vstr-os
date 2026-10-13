"use client";

import React from "react";
import { DesktopWidgetShell } from "./DesktopWidgetShell";
import { useWidgetData } from "@/hooks/useWidgetData";
import { Activity } from "lucide-react";

export interface TelemetryWidgetProps {
  id: string;
  isMinimized: boolean;
  onToggleMinimize: () => void;
  onClose: () => void;
  position: { x: number; y: number };
  onPositionChange: (id: string, pos: { x: number; y: number }) => void;
  dragConstraintsRef?: React.RefObject<HTMLDivElement | null>;
}

export function TelemetryWidget({
  id,
  isMinimized,
  onToggleMinimize,
  onClose,
  position,
  onPositionChange,
  dragConstraintsRef,
}: TelemetryWidgetProps) {
  const { fps, memory } = useWidgetData();
  const fpsNum = parseInt(String(fps), 10) || 60;
  const isHealthy = fpsNum >= 50;

  return (
    <DesktopWidgetShell
      id={id}
      title="Telemetry"
      tag="SYSTEM TELEMETRY"
      icon={<Activity size={12} color="#a855f7" />}
      isMinimized={isMinimized}
      onToggleMinimize={onToggleMinimize}
      onClose={onClose}
      position={position}
      onPositionChange={onPositionChange}
      dragConstraintsRef={dragConstraintsRef}
      width={320}
    >
      <div style={{ display: "flex", gap: "10px" }}>
        {/* FPS Card */}
        <div
          style={{
            flex: 1,
            background: "rgba(0, 0, 0, 0.25)",
            padding: "9px 12px",
            borderRadius: "10px",
            border: "1px solid rgba(255, 255, 255, 0.05)",
            display: "flex",
            flexDirection: "column",
            gap: "2px",
          }}
        >
          <div
            style={{
              fontSize: "9px",
              fontFamily: "var(--font-mono)",
              color: "rgba(255, 255, 255, 0.4)",
              letterSpacing: "0.5px",
            }}
          >
            FRAMERATE
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
            <span
              style={{
                fontSize: "20px",
                fontWeight: 700,
                fontFamily: "var(--font-mono)",
                color: isHealthy ? "#4ade80" : "#f87171",
              }}
            >
              {fps}
            </span>
            <span style={{ fontSize: "10px", color: "rgba(255, 255, 255, 0.4)" }}>FPS</span>
          </div>
        </div>

        {/* Memory Card */}
        <div
          style={{
            flex: 1,
            background: "rgba(0, 0, 0, 0.25)",
            padding: "9px 12px",
            borderRadius: "10px",
            border: "1px solid rgba(255, 255, 255, 0.05)",
            display: "flex",
            flexDirection: "column",
            gap: "2px",
          }}
        >
          <div
            style={{
              fontSize: "9px",
              fontFamily: "var(--font-mono)",
              color: "rgba(255, 255, 255, 0.4)",
              letterSpacing: "0.5px",
            }}
          >
            JS HEAP
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
            <span
              style={{
                fontSize: "16px",
                fontWeight: 700,
                fontFamily: "var(--font-mono)",
                color: "#60a5fa",
              }}
            >
              {memory}
            </span>
          </div>
        </div>
      </div>
    </DesktopWidgetShell>
  );
}
