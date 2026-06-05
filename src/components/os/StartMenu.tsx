"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { WINDOW_CONFIGS } from "@/store/windowStore";
import type { WindowId } from "@/types";

interface StartMenuProps {
  onClose: () => void;
  onOpen: (id: WindowId) => void;
}

export default function StartMenu({ onClose, onOpen }: StartMenuProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    setTimeout(() => document.addEventListener("mousedown", handler), 0);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <motion.div
      ref={ref}
      className="start-menu"
      id="start-menu"
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 380, damping: 30 }}
    >
      {/* Header */}
      <div className="start-menu-header">
        <p style={{ fontSize: 13, fontWeight: 600, color: "var(--os-text)" }}>
          Sai Tarun Reddy Velagala
        </p>
        <p className="muted-text" style={{ fontSize: 11, marginTop: 2 }}>
          CS Undergrad &amp; AI Developer
        </p>
      </div>

      {/* Apps */}
      <div style={{ padding: "8px 0" }}>
        <p style={{ fontSize: 10, padding: "6px 16px", color: "var(--os-text-dim)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          Applications
        </p>
        {WINDOW_CONFIGS.map((cfg) => (
          <div
            key={cfg.id}
            id={`start-menu-item-${cfg.id}`}
            className="start-menu-item"
            onClick={() => onOpen(cfg.id)}
          >
            <span className="start-menu-item-icon">{cfg.icon}</span>
            <span>{cfg.title}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ borderTop: "1px solid var(--os-border)", padding: "8px 16px" }}>
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="start-menu-item"
          style={{ padding: 0, gap: 12 }}
        >
          <span className="start-menu-item-icon">📄</span>
          <span style={{ fontSize: 13 }}>Download Resume</span>
        </a>
      </div>
    </motion.div>
  );
}
