"use client";

import React from "react";
import { motion } from "framer-motion";
import { useOS } from "@/store/windowStore";
import type { WindowId } from "@/types";
import { useSound } from "@/utils/useSound";
import { OsIcon } from "@/components/icons/OsIcon";

interface DesktopIconProps {
  id: WindowId;
  /** Legacy emoji fallback */
  icon: string;
  /** Fluent SVG icon registry key */
  fluentIcon?: string;
  label: string;
}

export default function DesktopIcon({ id, icon, fluentIcon, label }: DesktopIconProps) {
  const { openWindow, getWindow } = useOS();
  const { playClick } = useSound();
  const win = getWindow(id);
  const isOpen = win?.isOpen ?? false;

  const handleOpen = () => {
    playClick();
    openWindow(id);
  };

  return (
    <motion.div
      className={`desktop-icon${isOpen ? " selected" : ""}`}
      id={`desktop-icon-${id}`}
      onDoubleClick={handleOpen}
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
      drag
      dragMomentum={false}
      dragElastic={0.1}
      whileHover={{ scale: 1.07 }}
      whileDrag={{ scale: 1.1, zIndex: 50 }}
      whileTap={{ scale: 0.93 }}
      title={`Double-click or press Enter to open ${label}`}
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
        style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        {fluentIcon ? (
          <OsIcon
            name={fluentIcon}
            size="lg"
          />
        ) : (
          <span style={{ fontSize: 28 }}>{icon}</span>
        )}
      </motion.div>
      <span className="desktop-icon-label">{label}</span>
    </motion.div>
  );
}
