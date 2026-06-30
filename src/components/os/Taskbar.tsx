"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOS, WINDOW_CONFIGS } from "@/store/windowStore";
import StartMenu from "./StartMenu";

export default function Taskbar() {
  const { windows, openWindow, restoreWindow, focusWindow, minimizeWindow } = useOS();
  const [time, setTime] = useState("");
  const [showStart, setShowStart] = useState(false);

  // Live clock
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const openWindows = windows.filter((w) => w.isOpen);

  return (
    <>
      <AnimatePresence>
        {showStart && (
          <StartMenu
            onClose={() => setShowStart(false)}
            onOpen={(id) => { openWindow(id); setShowStart(false); }}
          />
        )}
      </AnimatePresence>

      <div className="os-taskbar" id="os-taskbar">
        {/* Start Button — amber VSTR mark */}
        <button
          id="taskbar-start-btn"
          className="taskbar-start-btn"
          onClick={() => setShowStart((v) => !v)}
          title="Start Menu"
          style={{ fontSize: 14, letterSpacing: "-0.06em" }}
        >
          VS
        </button>

        <div className="taskbar-divider" />

        {/* Open app tabs */}
        <div className="taskbar-apps">
          <AnimatePresence>
            {openWindows.map((win) => {
              const cfg = WINDOW_CONFIGS.find((c) => c.id === win.id);
              if (!cfg) return null;
              return (
                <motion.button
                  key={win.id}
                  id={`taskbar-btn-${win.id}`}
                  className={`taskbar-app-btn${win.isMinimized ? " minimized" : " active"}`}
                  initial={{ opacity: 0, scale: 0.85, x: -8 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.85, x: -8 }}
                  transition={{ type: "spring", stiffness: 360, damping: 28 }}
                  onClick={() => {
                    if (win.isMinimized) {
                      restoreWindow(win.id);
                    } else {
                      minimizeWindow(win.id);
                    }
                    focusWindow(win.id);
                  }}
                  title={cfg.title}
                >
                  <span style={{ fontSize: 14 }}>{cfg.icon}</span>
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                    {cfg.title}
                  </span>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>

        {/* System tray */}
        <div className="taskbar-status">
          <div className="status-dot" title="System Online" />
        </div>

        <div className="taskbar-clock" id="taskbar-clock">{time}</div>
      </div>
    </>
  );
}
