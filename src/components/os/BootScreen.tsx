"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
            textAlign: "center",
            paddingBottom: 60,
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            <div style={{
              fontSize: 48,
              fontWeight: 700,
              color: "#f59e0b",
              letterSpacing: "-2px",
              textShadow: "0 0 40px rgba(245,158,11,0.5), 0 0 80px rgba(245,158,11,0.15)",
              marginBottom: 20,
            }}>
              VSTR-OS
            </div>
            <div style={{
              width: 200,
              height: 2,
              background: "rgba(245,158,11,0.12)",
              borderRadius: 1,
              margin: "0 auto",
              overflow: "hidden",
            }}>
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2.2, ease: [0.4, 0, 0.2, 1] }}
                style={{
                  height: "100%",
                  background: "#f59e0b",
                  borderRadius: 1,
                  boxShadow: "0 0 8px rgba(245,158,11,0.6)",
                }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
