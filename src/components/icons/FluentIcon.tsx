"use client";
import React from "react";

export type IconSize = "sm" | "md" | "lg";
export type IconBadge = "shortcut" | "lock" | "shared";

interface FluentIconProps {
  /** SVG path data (single string or array of path strings) */
  paths: string | string[];
  size?: IconSize;
  color?: string;
  className?: string;
  "aria-label"?: string;
  viewBox?: string;
  /** Optional Win11-style badge overlay rendered in the bottom-right corner */
  badge?: IconBadge;
}

const SIZE_MAP: Record<IconSize, number> = {
  sm: 16,
  md: 20,
  lg: 28,
};

/* Small badge SVG paths (rendered at 8×8 within a 20×20 viewBox corner) */
const BADGE_PATHS: Record<IconBadge, { path: string; fill: string; bg: string }> = {
  shortcut: {
    // Win11 shortcut arrow: small right-and-down arrow in bottom-left corner
    path: "M1 5.5L1 1h4.5L4 2.5H2.5V4L1 5.5zM1 5.5L5.5 1",
    fill: "#ffffff",
    bg:   "#2563eb",
  },
  lock: {
    // Padlock body
    path: "M2 3.5A1.5 1.5 0 0 1 3.5 2h1A1.5 1.5 0 0 1 6 3.5V4h.5a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5v-3A.5.5 0 0 1 1.5 4H2v-.5zm1-.5v1h2v-1a1 1 0 0 0-2 0z",
    fill: "#ffffff",
    bg:   "#6b7280",
  },
  shared: {
    // Two overlapping circles (share icon simplified)
    path: "M5 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM1 6.5A3.5 3.5 0 0 1 4.5 3H5a3 3 0 0 1 3 3v.5H1V6.5z",
    fill: "#ffffff",
    bg:   "#10b981",
  },
};

export function FluentIcon({
  paths,
  size = "md",
  color = "currentColor",
  className = "",
  "aria-label": ariaLabel,
  viewBox = "0 0 20 20",
  badge,
}: FluentIconProps) {
  const dim = SIZE_MAP[size];
  const pathArr = Array.isArray(paths) ? paths : [paths];
  const badgeDef = badge ? BADGE_PATHS[badge] : null;
  // Badge size: ~35% of icon size, always at least 8px
  const badgeDim = Math.max(8, Math.round(dim * 0.38));

  return (
    <div
      style={{
        display: "inline-flex",
        position: "relative",
        flexShrink: 0,
        width: dim,
        height: dim,
      }}
    >
      <svg
        width={dim}
        height={dim}
        viewBox={viewBox}
        fill={color}
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        role="img"
        aria-label={ariaLabel}
        style={{ display: "block" }}
      >
        {pathArr.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </svg>

      {/* Badge overlay — bottom-right corner */}
      {badgeDef && (
        <svg
          width={badgeDim}
          height={badgeDim}
          viewBox="0 0 8 8"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: -1,
            right: -1,
            borderRadius: "50%",
            overflow: "visible",
          }}
        >
          <circle cx="4" cy="4" r="4" fill={badgeDef.bg} />
          <path d={badgeDef.path} fill={badgeDef.fill} transform="scale(0.75) translate(0.7, 0.7)" />
        </svg>
      )}
    </div>
  );
}
