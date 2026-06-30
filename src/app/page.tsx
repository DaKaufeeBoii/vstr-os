"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { OSProvider } from "@/store/windowStore";
import Desktop from "@/components/os/Desktop";

const BOOT_STEPS = [
  "Initializing VSTR-OS kernel v2.0.0...",
  "Loading user profile...",
  "Mounting filesystems...",
  "Starting window manager...",
  "System ready.",
];

export default function Home() {
  const [booting, setBooting] = useState(true);
  const [bootLine, setBootLine] = useState(0);

  useEffect(() => {
    // Cycle through boot messages
    let i = 0;
    const iv = setInterval(() => {
      i++;
      if (i < BOOT_STEPS.length) {
        setBootLine(i);
      } else {
        clearInterval(iv);
        // Short pause then dismiss boot screen
        setTimeout(() => setBooting(false), 400);
      }
    }, 320);
    return () => clearInterval(iv);
  }, []);

  return (
    <OSProvider>
      <AnimatePresence>
        {booting && (
          <motion.div
            className="boot-screen"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="boot-logo"
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              VSTR-OS
            </motion.div>

            <div className="boot-progress-track">
              <div className="boot-progress-bar" />
            </div>

            <motion.p
              key={bootLine}
              className="boot-text"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {BOOT_STEPS[bootLine]}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {!booting && (
        <motion.div
          style={{ width: "100%", height: "100%" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Desktop />
        </motion.div>
      )}
    </OSProvider>
  );
}
