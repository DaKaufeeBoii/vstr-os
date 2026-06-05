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
    "VSTR-OS BIOS v1.0.0",
    "Initializing system memory...",
    "Checking peripherals: OK",
    "Mounting primary drive: /dev/sda1 ... OK",
    "Loading kernel modules...",
    "Starting display manager...",
    "Welcome to VSTR-OS."
  ];

  useEffect(() => {
    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < BOOT_SEQUENCE.length) {
        setBootLog(prev => [...prev, BOOT_SEQUENCE[currentStep]]);
        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setLoading(false);
          setTimeout(onComplete, 500); // fade out time
        }, 1000);
      }
    }, 400); // speed of boot text
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
            fontFamily: "var(--font-mono)",
            padding: 40,
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
        >
          <div style={{ flex: 1 }}>
            {bootLog.map((line, i) => (
              <div key={i} style={{ marginBottom: 8, color: i === BOOT_SEQUENCE.length - 1 ? "var(--os-cyan)" : "#fff" }}>
                {line}
              </div>
            ))}
            <motion.div
              animate={{ opacity: [1, 0, 1] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              style={{ display: "inline-block", width: 10, height: 18, background: "#fff", marginTop: 8 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
