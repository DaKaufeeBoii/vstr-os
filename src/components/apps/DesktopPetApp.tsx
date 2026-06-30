"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

type PetMood = "walk" | "sleep" | "chase" | "idle";

const PET_SIZE = 32;
const MESSAGES = [
  "You found me! 🎉",
  "I left a hint in the terminal...",
  "Try 'crack password' sometime 👀",
  "I know where the secrets are hidden.",
  "Pet me! (just kidding, I'm pixels)",
  "Check /games/secret 🤫",
  "I've been watching you explore.",
  "*yawns* ...still here?",
  "The HintMaster and I are friends.",
  "404: friendship not found",
];

function PetOverlay() {
  const [pos, setPos] = useState({ x: 120, y: 300 });
  const [mood, setMood] = useState<PetMood>("walk");
  const [dir, setDir] = useState(1); // 1=right, -1=left
  const [message, setMessage] = useState<string | null>(null);
  const [visible, setVisible] = useState(true);
  const mouseRef = useRef({ x: 0, y: 0 });
  const posRef = useRef({ x: 120, y: 300 });
  const rafRef = useRef<number>(0);
  const moodRef = useRef<PetMood>("walk");
  const dirRef = useRef(1);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  // Mood cycle
  useEffect(() => {
    const cycle = setInterval(() => {
      const moods: PetMood[] = ["walk", "walk", "walk", "chase", "chase", "sleep", "idle"];
      const next = moods[Math.floor(Math.random() * moods.length)];
      moodRef.current = next;
      setMood(next);
    }, 5000);
    return () => clearInterval(cycle);
  }, []);

  // Random messages
  useEffect(() => {
    const drop = setInterval(() => {
      if (Math.random() > 0.6) {
        const msg = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
        setMessage(msg);
        setTimeout(() => setMessage(null), 3500);
      }
    }, 8000);
    return () => clearInterval(drop);
  }, []);

  // Animation loop
  useEffect(() => {
    const w = window.innerWidth;
    const h = window.innerHeight - 52; // above taskbar
    const speed = 1.5;
    const chaseSpeed = 2.2;

    const loop = () => {
      const current = posRef.current;
      const mouse = mouseRef.current;
      const currentMood = moodRef.current;

      let nx = current.x;
      let ny = current.y;

      if (currentMood === "chase") {
        const dx = mouse.x - current.x;
        const dy = mouse.y - current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 60) {
          nx = current.x + (dx / dist) * chaseSpeed;
          ny = current.y + (dy / dist) * chaseSpeed;
          dirRef.current = dx > 0 ? 1 : -1;
          setDir(dirRef.current);
        }
      } else if (currentMood === "walk") {
        nx = current.x + dirRef.current * speed;
        if (nx > w - PET_SIZE || nx < 0) {
          dirRef.current *= -1;
          setDir(dirRef.current);
          nx = Math.max(0, Math.min(w - PET_SIZE, nx));
        }
      }
      // sleep/idle: stay put

      nx = Math.max(0, Math.min(w - PET_SIZE, nx));
      ny = Math.max(0, Math.min(h - PET_SIZE, ny));

      if (nx !== current.x || ny !== current.y) {
        posRef.current = { x: nx, y: ny };
        setPos({ x: nx, y: ny });
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const petEmoji =
    mood === "sleep" ? "😴" :
    mood === "chase" ? "🐱" :
    mood === "idle"  ? "🐾" : "🐱";

  return createPortal(
    <div style={{ position: "fixed", inset: 0, zIndex: 8000, pointerEvents: "none" }}>
      <motion.div
        animate={{ x: pos.x, y: pos.y }}
        transition={{ type: "tween", ease: "linear", duration: 0.05 }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: PET_SIZE,
          height: PET_SIZE,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 26,
          transform: `scaleX(${dir})`,
          filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))",
          pointerEvents: "auto",
          cursor: "pointer",
        }}
        title="Desktop Pet"
      >
        {/* Speech bubble */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.8 }}
              style={{
                position: "absolute",
                bottom: "calc(100% + 8px)",
                left: "50%",
                transform: `translateX(-50%) scaleX(${dir})`,
                background: "rgba(10,14,20,0.95)",
                border: "1px solid rgba(245,158,11,0.3)",
                borderRadius: 8,
                padding: "6px 10px",
                fontSize: 10,
                color: "var(--os-text)",
                whiteSpace: "nowrap",
                fontFamily: "'JetBrains Mono', monospace",
                boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
                pointerEvents: "none",
              }}
            >
              {message}
              <div style={{
                position: "absolute",
                top: "100%",
                left: "50%",
                transform: "translateX(-50%)",
                borderLeft: "5px solid transparent",
                borderRight: "5px solid transparent",
                borderTop: "5px solid rgba(245,158,11,0.3)",
              }} />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.span
          animate={mood === "sleep" ? { rotate: [0, -5, 5, 0] } : mood === "walk" ? { y: [0, -2, 0] } : {}}
          transition={{ repeat: Infinity, duration: mood === "sleep" ? 3 : 0.4 }}
          style={{ display: "block" }}
        >
          {petEmoji}
        </motion.span>
      </motion.div>
    </div>,
    document.body
  );
}

export default function DesktopPetApp() {
  const [installed, setInstalled] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("vstr_desktop_pet") === "true";
    }
    return false;
  });
  const [installing, setInstalling] = useState(false);
  const [progress, setProgress] = useState(0);
  const [log, setLog] = useState<string[]>([]);

  const install = () => {
    setInstalling(true);
    setProgress(0);
    setLog([]);
    const steps = [
      "Downloading pet.dmg...",
      "Verifying package signature...",
      "Extracting companion data...",
      "Calibrating pixel personality...",
      "Installing to /System/Desktop...",
      "Companion ready! 🐾",
    ];
    let i = 0;
    const iv = setInterval(() => {
      if (i < steps.length) {
        setLog(l => [...l, steps[i]]);
        setProgress(Math.round(((i + 1) / steps.length) * 100));
        i++;
      } else {
        clearInterval(iv);
        setTimeout(() => {
          localStorage.setItem("vstr_desktop_pet", "true");
          setInstalled(true);
          setInstalling(false);
        }, 600);
      }
    }, 400);
  };

  const uninstall = () => {
    localStorage.removeItem("vstr_desktop_pet");
    setInstalled(false);
    setLog([]);
    setProgress(0);
  };

  return (
    <>
      {installed && <PetOverlay />}
      <div style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'JetBrains Mono', monospace",
        color: "var(--os-text)",
        padding: 24,
        gap: 16,
      }}>
        <div>
          <div style={{ fontSize: 11, color: "var(--os-text-muted)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>
            Desktop Pet — Companion Installer v1.0
          </div>
          <div style={{ fontSize: 12, color: "var(--os-text-muted)", lineHeight: 1.6 }}>
            Installs a persistent desktop companion that lives outside of any window.
          </div>
        </div>

        <div style={{ background: "rgba(10,14,20,0.5)", border: "1px solid var(--os-border)", borderRadius: 8, padding: 16, display: "flex", gap: 16, alignItems: "center" }}>
          <span style={{ fontSize: 36 }}>🐱</span>
          <div>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>Desktop Pet v1.0</div>
            <div style={{ fontSize: 11, color: "var(--os-text-muted)" }}>
              A pixel companion that chases your cursor, sleeps on windows, and occasionally reveals secrets.
            </div>
          </div>
        </div>

        {installing && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
              <motion.div
                style={{ height: "100%", background: "var(--os-amber)", borderRadius: 2 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {log.map((l, i) => (
                <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  style={{ fontSize: 11, color: i === log.length - 1 ? "var(--os-amber)" : "var(--os-text-muted)" }}>
                  <span style={{ color: "var(--os-jade)", marginRight: 6 }}>›</span>{l}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginTop: "auto", display: "flex", gap: 10 }}>
          {!installed && !installing && (
            <button className="btn-amber" onClick={install} style={{ flex: 1 }}>
              Install Companion
            </button>
          )}
          {installed && !installing && (
            <>
              <div style={{ flex: 1, fontSize: 12, color: "var(--os-jade)", display: "flex", alignItems: "center", gap: 8 }}>
                <span>●</span> Companion is active on your desktop
              </div>
              <button
                onClick={uninstall}
                style={{
                  padding: "8px 16px",
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.3)",
                  borderRadius: 6,
                  color: "var(--os-red)",
                  cursor: "pointer",
                  fontSize: 12,
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                Uninstall
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
