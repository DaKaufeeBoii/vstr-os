"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { useOS } from "@/store/windowStore";
import type { WindowId } from "@/types";
import { useSound } from "@/utils/useSound";
import { OsIcon } from "@/components/icons/OsIcon";

interface DesktopIconProps {
  id: WindowId | string;
  /** Legacy emoji fallback */
  icon: string;
  /** Fluent SVG icon registry key */
  fluentIcon?: string;
  label: string;
  size?: "small" | "medium" | "large";
  isCustom?: boolean;
  onCustomOpen?: () => void;
  onContextMenu?: (
    e: React.MouseEvent | { clientX: number; clientY: number },
    id: WindowId | string,
    label: string,
    fluentIcon?: string,
    isCustom?: boolean
  ) => void;
}

export default function DesktopIcon({
  id,
  icon,
  fluentIcon,
  label,
  size = "medium",
  isCustom = false,
  onCustomOpen,
  onContextMenu,
}: DesktopIconProps) {
  const { openWindow, getWindow } = useOS();
  const { playClick } = useSound();
  const win = !isCustom ? getWindow(id as WindowId) : undefined;
  const isOpen = win?.isOpen ?? false;

  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);
  const isLongPressed = useRef(false);

  const handleOpen = () => {
    playClick();
    if (onCustomOpen) {
      onCustomOpen();
    } else {
      openWindow(id as WindowId);
    }
  };

  const handleContextMenu = (
    e: React.MouseEvent | { clientX: number; clientY: number; preventDefault?: () => void; stopPropagation?: () => void }
  ) => {
    if (onContextMenu) {
      e.preventDefault?.();
      e.stopPropagation?.();
      onContextMenu(e, id, label, fluentIcon, isCustom);
    }
  };

  // Touch handlers for mobile & tablet (tap to open + long press for context menu)
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartPos.current = { x: touch.clientX, y: touch.clientY };
    isLongPressed.current = false;

    if (longPressTimer.current) clearTimeout(longPressTimer.current);
    longPressTimer.current = setTimeout(() => {
      isLongPressed.current = true;
      handleContextMenu({
        clientX: touch.clientX,
        clientY: touch.clientY,
      });
    }, 450); // 450ms long press threshold
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartPos.current) return;
    const touch = e.touches[0];
    const diffX = Math.abs(touch.clientX - touchStartPos.current.x);
    const diffY = Math.abs(touch.clientY - touchStartPos.current.y);
    // If finger moves more than 10px, cancel long press
    if (diffX > 10 || diffY > 10) {
      if (longPressTimer.current) clearTimeout(longPressTimer.current);
    }
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
    // If not long-pressed and finger didn't drag off, trigger open
    if (!isLongPressed.current && touchStartPos.current) {
      handleOpen();
    }
    touchStartPos.current = null;
    isLongPressed.current = false;
  };

  // Size specifications
  const iconPixelSize = size === "large" ? 44 : size === "small" ? 24 : 32;
  const osIconSize = size === "large" ? "lg" : size === "small" ? "sm" : "md";
  const iconBoxWidth = size === "large" ? 104 : size === "small" ? 72 : 88;
  const fontSize = size === "large" ? 13 : size === "small" ? 11 : 12;

  return (
    <motion.div
      layout
      className={`desktop-icon size-${size}${isOpen ? " selected" : ""}`}
      id={`desktop-icon-${id}`}
      onDoubleClick={handleOpen}
      onContextMenu={handleContextMenu}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleOpen();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Open ${label}`}
      aria-pressed={isOpen}
      whileHover={{ scale: 1.07 }}
      whileTap={{ scale: 0.94 }}
      title={`Tap or double-click to open ${label}`}
      style={{
        width: iconBoxWidth,
      }}
    >
      <motion.div
        className="desktop-icon-emoji"
        animate={
          isOpen
            ? {
                filter: [
                  "drop-shadow(0 0 8px rgba(245,158,11,0.7))",
                  "drop-shadow(0 0 16px rgba(245,158,11,0.3))",
                  "drop-shadow(0 0 8px rgba(245,158,11,0.7))",
                ],
              }
            : {}
        }
        transition={{ duration: 2, repeat: Infinity }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: iconPixelSize,
          height: iconPixelSize,
        }}
      >
        {fluentIcon ? (
          <OsIcon name={fluentIcon} size={osIconSize} />
        ) : (
          <span style={{ fontSize: iconPixelSize }}>{icon}</span>
        )}
      </motion.div>
      <span
        className="desktop-icon-label"
        style={{
          fontSize,
        }}
      >
        {label}
      </span>
    </motion.div>
  );
}
