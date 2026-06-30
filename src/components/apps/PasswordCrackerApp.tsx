"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOS } from "@/store/windowStore";

type Phase = "connect" | "crack" | "granted" | "locked";

const WORD_POOL = [
  "kernel", "cipher", "socket", "buffer", "malloc", "printf", "struct", "vector",
  "thread", "mutex", "signal", "daemon", "packet", "header", "router", "subnet",
  "bypass", "inject", "exploit", "payload", "session", "cookie", "token", "grant",
  "access", "breach", "tunnel", "proxy", "shield", "crypto", "encode", "decode",
  "rootkit", "firewall", "sandbox", "exploit", "overflow", "syscall", "process",
];

interface FallingWord {
  id: number;
  word: string;
  x: number; // %
  y: number; // px from top
  speed: number;
}

const FIELD_H = 300;
const BASE_SPEED = 0.4;

export default function PasswordCrackerApp() {
  const { openWindow } = useOS();
  const [phase, setPhase] = useState<Phase>("connect");
  const [connectLog, setConnectLog] = useState<string[]>([]);
  const [access, setAccess] = useState(0);
  const [words, setWords] = useState<FallingWord[]>([]);
  const [typed, setTyped] = useState("");
  const [lastWord, setLastWord] = useState<{ word: string; ok: boolean } | null>(null);
  const [missed, setMissed] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const rafRef = useRef<number>(0);
  const wordIdRef = useRef(0);
  const accessRef = useRef(0);
  const wordsRef = useRef<FallingWord[]>([]);

  // Restore persisted state from localStorage (client only)
  useEffect(() => {
    const granted = localStorage.getItem("vstr_cracker_granted") === "true";
    const savedAccess = parseInt(localStorage.getItem("vstr_cracker_access") ?? "0", 10);
    if (granted) {
      setPhase("granted");
    }
    setAccess(savedAccess);
    accessRef.current = savedAccess;
  }, []);

  useEffect(() => { accessRef.current = access; }, [access]);
  useEffect(() => { wordsRef.current = words; }, [words]);

  // Fake connection sequence
  useEffect(() => {
    if (phase !== "connect") return;
    const steps = [
      "Initializing PwnTool 3.0...",
      "Scanning target: 192.168.0.1",
      "Port 22 open · Port 443 open · Port 8080 open",
      "Attempting handshake via TLS 1.3...",
      "Handshake complete. Session: 3f9a2b1c",
      "Target system detected: VSTR-OS v2.0.0",
      "Authentication required.",
      "Launching keyboard cracking interface...",
    ];
    let i = 0;
    const iv = setInterval(() => {
      if (i < steps.length) {
        const currentStep = steps[i];
        setConnectLog(l => [...l, currentStep]);
        i++;
      }
      else { clearInterval(iv); setTimeout(() => setPhase("crack"), 500); }
    }, 380);
    return () => clearInterval(iv);
  }, [phase]);

  // Spawn words
  useEffect(() => {
    if (phase !== "crack") return;
    const spawnInterval = setInterval(() => {
      const diffMult = 1 + accessRef.current / 80; // gets faster
      wordIdRef.current++;
      const newWord: FallingWord = {
        id: wordIdRef.current,
        word: WORD_POOL[Math.floor(Math.random() * WORD_POOL.length)],
        x: 5 + Math.random() * 85,
        y: 0,
        speed: (BASE_SPEED + Math.random() * 0.3) * diffMult,
      };
      setWords(prev => [...prev, newWord]);
    }, Math.max(600, 1800 - accessRef.current * 12));
    return () => clearInterval(spawnInterval);
  }, [phase]);

  // Animation loop
  useEffect(() => {
    if (phase !== "crack") return;
    const loop = () => {
      setWords(prev => {
        const next: FallingWord[] = [];
        let missedCount = 0;
        for (const w of prev) {
          const ny = w.y + w.speed;
          if (ny > FIELD_H) { missedCount++; }
          else next.push({ ...w, y: ny });
        }
        if (missedCount > 0) setMissed(m => m + missedCount);
        return next;
      });
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [phase]);

  const handleTyping = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTyped(val);
    const match = words.find(w => w.word === val.trim().toLowerCase());
    if (match) {
      setWords(prev => prev.filter(w => w.id !== match.id));
      setTyped("");
      setLastWord({ word: match.word, ok: true });
      const newAccess = Math.min(100, accessRef.current + Math.ceil(100 / 35));
      setAccess(newAccess);
      accessRef.current = newAccess;
      localStorage.setItem("vstr_cracker_access", String(newAccess));
      if (newAccess >= 100) {
        localStorage.setItem("vstr_cracker_granted", "true");
        cancelAnimationFrame(rafRef.current);
        setTimeout(() => setPhase("granted"), 400);
      }
    }
  }, [words]);

  const resetProgress = () => {
    localStorage.removeItem("vstr_cracker_granted");
    localStorage.removeItem("vstr_cracker_access");
    setAccess(0);
    accessRef.current = 0;
    setMissed(0);
    setWords([]);
    setTyped("");
    setConnectLog([]);
    setPhase("connect");
  };

  return (
    <div style={{
      height: "100%",
      display: "flex",
      flexDirection: "column",
      fontFamily: "'JetBrains Mono', monospace",
      color: "var(--os-jade)",
      background: "rgba(0,0,0,0.4)",
      overflow: "hidden",
    }}>
      <AnimatePresence mode="wait">
        {/* CONNECT PHASE */}
        {phase === "connect" && (
          <motion.div key="connect"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ padding: 24, flex: 1, display: "flex", flexDirection: "column", gap: 6 }}
          >
            <div style={{ fontSize: 11, color: "var(--os-amber)", marginBottom: 12, letterSpacing: "0.12em" }}>
              PWNTOOL 3.0 — CONNECTING
            </div>
            {connectLog.map((line, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                style={{ fontSize: 12, color: line.includes("ERROR") ? "var(--os-red)" : line.includes("complete") || line.includes("open") ? "var(--os-jade)" : "var(--os-text-muted)" }}>
                <span style={{ color: "var(--os-amber)", marginRight: 8 }}>›</span>{line}
              </motion.div>
            ))}
            {connectLog.length > 0 && (
              <motion.div animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 0.7 }}
                style={{ width: 8, height: 14, background: "var(--os-jade)", marginTop: 8 }} />
            )}
          </motion.div>
        )}

        {/* CRACK PHASE */}
        {phase === "crack" && (
          <motion.div key="crack"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ flex: 1, display: "flex", flexDirection: "column", padding: 16, gap: 10, overflow: "hidden" }}
          >
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 10, color: "var(--os-amber)", letterSpacing: "0.1em" }}>PWNTOOL 3.0 — TYPE WORDS TO CRACK</div>
              <div style={{ fontSize: 10, color: missed > 5 ? "var(--os-red)" : "var(--os-text-muted)" }}>
                {missed} missed
              </div>
            </div>

            {/* Access progress bar */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 10, color: "var(--os-text-muted)" }}>ACCESS PROGRESS</span>
                <span style={{ fontSize: 10, color: access >= 80 ? "var(--os-jade)" : "var(--os-amber)" }}>{access}%</span>
              </div>
              <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
                <motion.div
                  style={{ height: "100%", background: `linear-gradient(90deg, var(--os-amber), var(--os-jade))`, borderRadius: 3 }}
                  animate={{ width: `${access}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Falling words field */}
            <div style={{
              flex: 1,
              position: "relative",
              background: "rgba(0,0,0,0.3)",
              border: "1px solid var(--os-border)",
              borderRadius: 8,
              overflow: "hidden",
              minHeight: FIELD_H,
            }}>
              {words.map(w => (
                <div
                  key={w.id}
                  style={{
                    position: "absolute",
                    left: `${w.x}%`,
                    top: w.y,
                    fontSize: 13,
                    fontWeight: 600,
                    color: typed && w.word.startsWith(typed.toLowerCase()) ? "var(--os-amber)" : "var(--os-jade)",
                    transition: "color 0.1s",
                    textShadow: typed && w.word.startsWith(typed.toLowerCase())
                      ? "0 0 8px var(--os-amber)"
                      : "0 0 6px rgba(16,185,129,0.4)",
                    whiteSpace: "nowrap",
                    userSelect: "none",
                  }}
                >
                  {typed && w.word.startsWith(typed.toLowerCase()) ? (
                    <>
                      <span style={{ color: "var(--os-amber)" }}>{typed}</span>
                      <span>{w.word.slice(typed.length)}</span>
                    </>
                  ) : w.word}
                </div>
              ))}

              {/* Last word feedback */}
              <AnimatePresence>
                {lastWord && (
                  <motion.div
                    key={lastWord.word}
                    initial={{ opacity: 1, y: 0, scale: 1 }}
                    animate={{ opacity: 0, y: -20, scale: 0.85 }}
                    transition={{ duration: 0.8 }}
                    style={{
                      position: "absolute",
                      top: "40%",
                      left: "50%",
                      transform: "translateX(-50%)",
                      fontSize: 16,
                      fontWeight: 700,
                      color: "var(--os-jade)",
                      textShadow: "0 0 12px var(--os-jade)",
                      pointerEvents: "none",
                    }}
                    onAnimationComplete={() => setLastWord(null)}
                  >
                    +{Math.ceil(100 / 35)}%
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Input */}
            <input
              ref={inputRef}
              autoFocus
              value={typed}
              onChange={handleTyping}
              placeholder="type a falling word..."
              style={{
                background: "rgba(0,0,0,0.4)",
                border: "1px solid var(--os-border)",
                borderRadius: 6,
                padding: "8px 12px",
                color: "var(--os-jade)",
                fontSize: 14,
                fontFamily: "'JetBrains Mono', monospace",
                outline: "none",
                caretColor: "var(--os-amber)",
              }}
              onFocus={(e) => e.target.style.borderColor = "rgba(245,158,11,0.4)"}
              onBlur={(e) => e.target.style.borderColor = "var(--os-border)"}
            />
          </motion.div>
        )}

        {/* GRANTED */}
        {phase === "granted" && (
          <motion.div key="granted"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 24 }}
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              style={{ fontSize: 48 }}
            >
              🔓
            </motion.div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "var(--os-jade)", letterSpacing: "0.08em" }}>
              ACCESS GRANTED
            </div>
            <div style={{
              fontSize: 11,
              color: "var(--os-text-muted)",
              textAlign: "center",
              lineHeight: 1.7,
              maxWidth: 280,
            }}>
              Authentication successful.<br />
              A hidden sector has been unlocked.<br />
              Proceed with caution.
            </div>
            <button
              className="btn-jade"
              onClick={() => window.open("/games/secret", "_blank")}
            >
              Access Hidden Files
            </button>
            <button
              onClick={resetProgress}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--os-text-dim)",
                fontSize: 11,
                cursor: "pointer",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              Reset access
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
