"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { VstrIcon } from "@/components/icons";

interface BootScreenProps {
  onComplete: () => void;
}

export default function BootScreen({ onComplete }: BootScreenProps) {
  const [bootLog, setBootLog] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const BOOT_SEQUENCE = [
    "VSTR-OS v2.0.0 — BIOS initializing...",
    "Memory check: 16384 MB OK",
    "Loading secure kernel modules...",
    "Mounting /dev/portfolio... OK",
    "Starting window compositor...",
    "Loading user environment...",
    "Welcome to VSTR-OS.",
  ];

  useEffect(() => {
    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < BOOT_SEQUENCE.length) {
        const nextLine = BOOT_SEQUENCE[currentStep];
        setBootLog(prev => [...prev, nextLine]);
        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setLoading(false);
          setTimeout(onComplete, 500);
        }, 800);
      }
    }, 360);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            position: "fixed",
            inset: 0,
            background: "#000",
            color: "#fff",
            fontFamily: "'JetBrains Mono', monospace",
            padding: 40,
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
        >
          <div style={{ flex: 1 }}>
            {bootLog.map((line, i) => (
              <div
                key={i}
                style={{
                  marginBottom: 8,
                  fontSize: 13,
                  color: i === BOOT_SEQUENCE.length - 1
                    ? "#f59e0b"
                    : i === bootLog.length - 1
                    ? "rgba(245,158,11,0.7)"
                    : "#4a5568",
                  transition: "color 0.3s",
                }}
              >
                <span style={{ color: "#f59e0b", marginRight: 8 }}>›</span>
                {line}
              </div>
            ))}
            <motion.div
              animate={{ opacity: [1, 0, 1] }}
              transition={{ repeat: Infinity, duration: 0.7 }}
              style={{
                display: "inline-block",
                width: 8,
                height: 16,
                background: "#f59e0b",
                marginTop: 8,
                boxShadow: "0 0 8px rgba(245,158,11,0.6)",
              }}
            />
          </div>
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            paddingBottom: 60,
          }}>
            {/* Animated Brand Logo */}
            <motion.div
              initial={{ scale: 0.92, opacity: 0.8 }}
              animate={{ scale: [0.96, 1.02, 0.96], opacity: [0.85, 1, 0.85] }}
              transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 18,
                marginBottom: 32,
                filter: "drop-shadow(0 0 30px rgba(245,158,11,0.45))",
                userSelect: "none",
              }}
            >
              <VstrIcon size={64} color="#f59e0b" />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  lineHeight: 1.05,
                  fontFamily: "'Segoe UI Variable', system-ui, -apple-system, sans-serif",
                  fontWeight: 800,
                  color: "#f59e0b",
                  textAlign: "left",
                }}
              >
                <span style={{ fontSize: 38, letterSpacing: "-0.03em" }}>vstr</span>
                <span style={{ fontSize: 26, letterSpacing: "-0.01em", opacity: 0.9 }}>os</span>
              </div>
            </motion.div>

            {/* Loading Bar */}
            <div style={{
              width: 220,
              height: 3,
              background: "rgba(245,158,11,0.15)",
              borderRadius: 2,
              overflow: "hidden",
            }}>
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2.2, ease: [0.4, 0, 0.2, 1] }}
                style={{
                  height: "100%",
                  background: "linear-gradient(90deg, #f59e0b, #fbbf24)",
                  borderRadius: 2,
                  boxShadow: "0 0 10px rgba(245,158,11,0.7)",
                }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
