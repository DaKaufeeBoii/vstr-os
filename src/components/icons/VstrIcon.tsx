"use client";

import React from "react";

interface VstrIconProps {
  size?: number | "sm" | "md" | "lg";
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

const SIZE_MAP: Record<string, number> = {
  sm: 18,
  md: 24,
  lg: 32,
};

/**
 * VSTR OS Brand Mark (Squircle with `>_` terminal prompt & stylized folder)
 * Handcrafted vector matching the official brand identity.
 */
export function VstrIcon({
  size = "md",
  color = "currentColor",
  className = "",
  style = {},
}: VstrIconProps) {
  const dim = typeof size === "number" ? size : SIZE_MAP[size] ?? 24;

  return (
    <svg
      width={dim}
      height={dim}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: "inline-block", flexShrink: 0, ...style }}
      aria-label="VSTR OS Logo"
      role="img"
    >
      {/* Outer Squircle Container */}
      <rect
        x="9"
        y="9"
        width="82"
        height="82"
        rx="22"
        ry="22"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Terminal Prompt Chevron `>` */}
      <path
        d="M 26 27 L 35 34.5 L 26 42"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Terminal Prompt Underscore `_` */}
      <path
        d="M 43 42 L 56 42"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
      />

      {/* Stylized System Architecture / Folder Blocks */}
      <path
        d="M 33 74 V 56 H 51 V 63 H 69 V 74 Z"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Folder Inner Divider */}
      <path
        d="M 51 63 V 74"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Full VSTR OS Logo (Icon + Typography `vstr` / `os`)
 */
export function VstrLogoFull({
  iconSize = 36,
  color = "currentColor",
  className = "",
  style = {},
}: {
  iconSize?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 14,
        userSelect: "none",
        ...style,
      }}
    >
      <VstrIcon size={iconSize} color={color} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          lineHeight: 1.05,
          fontFamily: "'Segoe UI Variable', system-ui, -apple-system, sans-serif",
          fontWeight: 800,
          color,
        }}
      >
        <span style={{ fontSize: iconSize * 0.58, letterSpacing: "-0.03em" }}>vstr</span>
        <span style={{ fontSize: iconSize * 0.42, letterSpacing: "-0.01em", opacity: 0.9 }}>os</span>
      </div>
    </div>
  );
}
