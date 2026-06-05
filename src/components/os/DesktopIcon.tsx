"use client";

import React from "react";
import { motion } from "framer-motion";
import { useOS } from "@/store/windowStore";
import type { WindowId } from "@/types";
import { useSound } from "@/utils/useSound";

interface DesktopIconProps {
  id: WindowId;
  icon: string;
  label: string;
}

export default function DesktopIcon({ id, icon, label }: DesktopIconProps) {
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
      drag
      dragMomentum={false}
      dragElastic={0.1}
      whileHover={{ scale: 1.05 }}
      whileDrag={{ scale: 1.1, zIndex: 50 }}
      whileTap={{ scale: 0.95 }}
      title={`Double-click to open ${label}`}
    >
      <motion.div
        className="desktop-icon-emoji"
        animate={isOpen ? { filter: ["drop-shadow(0 0 8px rgba(0,212,255,0.6))", "drop-shadow(0 0 14px rgba(0,212,255,0.3))", "drop-shadow(0 0 8px rgba(0,212,255,0.6))"] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {icon}
      </motion.div>
      <span className="desktop-icon-label">{label}</span>
    </motion.div>
  );
}
