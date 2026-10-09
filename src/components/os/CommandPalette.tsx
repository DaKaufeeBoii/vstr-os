"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOS } from "@/store/windowStore";
import { WINDOW_CONFIGS } from "@/store/windowStore";

export default function CommandPalette() {
  const { isCommandPaletteOpen, closeCommandPalette, openWindow } = useOS();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Command definitions
  const commands = useMemo(() => [
    ...WINDOW_CONFIGS.map(cfg => ({
      name: `Open ${cfg.title}`,
      action: () => openWindow(cfg.id),
      icon: cfg.icon
    })),
    { name: "Toggle Terminal", action: () => openWindow("terminal"), icon: "⌨️" },
  ], [openWindow]);

  const filteredCommands = useMemo(() => {
    return commands.filter(cmd => 
      cmd.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [commands, query]);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      inputRef.current?.focus();
    } else {
      setQuery("");
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(4px)",
          zIndex: 1000,
          display: "flex",
          justifyContent: "center",
          paddingTop: "10vh",
        }}
        onClick={closeCommandPalette}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "600px",
            background: "var(--os-bg)",
            border: "1px solid var(--os-border)",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)",
          }}
        >
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command..."
            style={{
              width: "100%",
              padding: "16px",
              background: "transparent",
              border: "none",
              borderBottom: "1px solid var(--os-border)",
              color: "var(--os-text)",
              fontSize: "18px",
              outline: "none",
            }}
          />
          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
            {filteredCommands.map((cmd, idx) => (
              <div
                key={idx}
                onClick={() => {
                  cmd.action();
                  closeCommandPalette();
                }}
                style={{
                  padding: "12px 16px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  color: "var(--os-text-muted)",
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "var(--os-border)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              >
                <span>{cmd.icon}</span>
                {cmd.name}
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
