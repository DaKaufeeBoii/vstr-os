"use client";

import React from "react";
import { DesktopWidgetShell } from "./DesktopWidgetShell";
import { useWidgetData } from "@/hooks/useWidgetData";
import { Code2, ExternalLink } from "lucide-react";

export interface LeetCodeWidgetProps {
  id: string;
  isMinimized: boolean;
  onToggleMinimize: () => void;
  onClose: () => void;
  position: { x: number; y: number };
  onPositionChange: (id: string, pos: { x: number; y: number }) => void;
  dragConstraintsRef?: React.RefObject<HTMLDivElement | null>;
}

export function LeetCodeWidget({
  id,
  isMinimized,
  onToggleMinimize,
  onClose,
  position,
  onPositionChange,
  dragConstraintsRef,
}: LeetCodeWidgetProps) {
  const { leetcode } = useWidgetData();

  const total = leetcode?.totalSolved ?? 150;
  const easy = leetcode?.easySolved ?? 70;
  const medium = leetcode?.mediumSolved ?? 65;
  const hard = leetcode?.hardSolved ?? 15;

  return (
    <DesktopWidgetShell
      id={id}
      title="LeetCode"
      tag="LEETCODE STATS"
      icon={<Code2 size={12} color="#fbbf24" />}
      isMinimized={isMinimized}
      onToggleMinimize={onToggleMinimize}
      onClose={onClose}
      position={position}
      onPositionChange={onPositionChange}
      dragConstraintsRef={dragConstraintsRef}
      width={320}
      headerRight={
        <a
          href="https://leetcode.com/u/DaKaufeeBoii"
          target="_blank"
          rel="noreferrer"
          onPointerDown={(e) => e.stopPropagation()}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "3px",
            fontSize: "10px",
            fontFamily: "var(--font-mono)",
            color: "rgba(255, 255, 255, 0.4)",
            textDecoration: "none",
          }}
        >
          <span>@DaKaufeeBoii</span>
          <ExternalLink size={9} />
        </a>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.6)" }}>
            Problems Solved
          </span>
          <span
            style={{
              fontSize: "18px",
              fontWeight: 700,
              fontFamily: "var(--font-mono)",
              color: "#fbbf24",
            }}
          >
            {total}
          </span>
        </div>

        {/* Breakdown bars */}
        <div style={{ display: "flex", gap: "6px" }}>
          <div
            style={{
              flex: 1,
              background: "rgba(0, 184, 163, 0.12)",
              border: "1px solid rgba(0, 184, 163, 0.25)",
              padding: "5px 6px",
              borderRadius: "6px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "9px", color: "#00b8a3" }}>Easy</div>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "#fff", fontFamily: "var(--font-mono)" }}>
              {easy}
            </div>
          </div>

          <div
            style={{
              flex: 1,
              background: "rgba(255, 192, 30, 0.12)",
              border: "1px solid rgba(255, 192, 30, 0.25)",
              padding: "5px 6px",
              borderRadius: "6px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "9px", color: "#ffc01e" }}>Medium</div>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "#fff", fontFamily: "var(--font-mono)" }}>
              {medium}
            </div>
          </div>

          <div
            style={{
              flex: 1,
              background: "rgba(255, 55, 95, 0.12)",
              border: "1px solid rgba(255, 55, 95, 0.25)",
              padding: "5px 6px",
              borderRadius: "6px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "9px", color: "#ff375f" }}>Hard</div>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "#fff", fontFamily: "var(--font-mono)" }}>
              {hard}
            </div>
          </div>
        </div>
      </div>
    </DesktopWidgetShell>
  );
}
