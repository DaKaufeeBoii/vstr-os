"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STORAGE_KEY = "vstr_onboarding_dismissed";

export default function OnboardingTip() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) !== "true") {
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.3 }}
          style={{
            position: "fixed",
            bottom: "calc(var(--taskbar-h) + 16px)",
            right: 16,
            zIndex: 9000,
            maxWidth: 320,
            padding: "14px 16px",
            borderRadius: 10,
            background: "var(--os-surface)",
            border: "1px solid var(--os-border)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.45)",
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            color: "var(--os-text-muted)",
            lineHeight: 1.6,
          }}
        >
          <p style={{ color: "var(--os-amber)", fontWeight: 600, marginBottom: 6 }}>
            Welcome to VSTR-OS
          </p>
          <p>
            Double-click desktop icons to open apps. Try the{" "}
            <span style={{ color: "var(--os-text)" }}>Terminal</span> and type{" "}
            <code style={{ color: "var(--os-cyan)" }}>help</code> to discover hidden features.
          </p>
          <button
            type="button"
            onClick={dismiss}
            style={{
              marginTop: 12,
              padding: "6px 14px",
              borderRadius: 6,
              border: "1px solid rgba(245,158,11,0.35)",
              background: "var(--os-amber-dim)",
              color: "var(--os-amber)",
              fontFamily: "inherit",
              fontSize: 11,
              cursor: "pointer",
              letterSpacing: "0.04em",
            }}
          >
            Got it
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
