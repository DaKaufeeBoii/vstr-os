"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOS } from "@/store/windowStore";
import { useOSSettings } from "@/store/osSettingsStore";

const HINTS = [
  "Try typing 'play flappy' in the terminal. Your highscore awaits.",
  "A locked door reveals itself. Type 'crack password' if you dare.",
  "Something is scanning your disk. Run 'open disk_cleanup' and investigate.",
  "The terminal hides more than just commands. Try 'start desktop_pet'.",
  "Fatal system error imminent. Type 'blue-screen' to simulate a crash.",
  "The HintMaster knows all. But knowledge has its price. You earned all the hints!",
];

export default function HintMasterApp() {
  const { unlockMission } = useOSSettings();
  const [guess, setGuess] = useState<"heads" | "tails" | null>(null);
  const [result, setResult] = useState<"heads" | "tails" | null>(null);
  const [message, setMessage] = useState("I am the HintMaster. Beat me in a coin toss, and I shall reveal a secret.");
  const [flipping, setFlipping] = useState(false);
  const [wins, setWins] = useState(0);
  const [winStreak, setWinStreak] = useState(0);
  const [loseStreak, setLoseStreak] = useState(0);
  const [showHintsWidget, setShowHintsWidget] = useState(false);

  // Load persisted stats on client mount
  useEffect(() => {
    const savedWins = parseInt(localStorage.getItem("vstr_hint_wins") ?? "0", 10);
    const savedWinStreak = parseInt(localStorage.getItem("vstr_hint_win_streak") ?? "0", 10);
    const savedLoseStreak = parseInt(localStorage.getItem("vstr_hint_lose_streak") ?? "0", 10);

    setWins(savedWins);
    setWinStreak(savedWinStreak);
    setLoseStreak(savedLoseStreak);

    // If they already unlocked all hints, show initial task fulfilled message
    if (savedWins >= 5) {
      setMessage("I am the HintMaster. My task here is fulfilled, but I am always down for a coin toss!");
    }
  }, []);

  const allHintsUnlocked = wins >= 5;

  const flipCoin = (playerGuess: "heads" | "tails") => {
    if (flipping) return;

    // Mission 1: Using the HintMaster for the first time
    unlockMission("hint-first");

    setGuess(playerGuess);
    setFlipping(true);
    setMessage("Flipping...");
    setResult(null);

    setTimeout(() => {
      const outcome = Math.random() > 0.5 ? "heads" : "tails";
      setResult(outcome);
      setFlipping(false);

      if (playerGuess === outcome) {
        const newWins = allHintsUnlocked ? wins : wins + 1;
        const newWinStreak = winStreak + 1;
        const newLoseStreak = 0;

        setWins(newWins);
        setWinStreak(newWinStreak);
        setLoseStreak(newLoseStreak);

        localStorage.setItem("vstr_hint_wins", String(newWins));
        localStorage.setItem("vstr_hint_win_streak", String(newWinStreak));
        localStorage.setItem("vstr_hint_lose_streak", String(newLoseStreak));

        // If they already had all hints unlocked, do not display new hints
        if (allHintsUnlocked) {
          setMessage(`You win! Coin: ${outcome}.\n\nMy task here is fulfilled, but you are still a worthy opponent!`);
        } else {
          const hint = HINTS[(newWins - 1) % HINTS.length];
          setMessage(`You win! Coin: ${outcome}.\n\n🔍 Hint #${newWins}:\n"${hint}"`);
        }

        // Mission 3: Winning from HintMaster 5 times in a row
        if (newWinStreak >= 5) {
          unlockMission("hint-win-streak");
        }

        // Mission 4: Unlocking all hints (5 hints total)
        if (newWins >= 5) {
          unlockMission("hint-all");
        }
      } else {
        const newWinStreak = 0;
        const newLoseStreak = loseStreak + 1;

        setWinStreak(newWinStreak);
        setLoseStreak(newLoseStreak);

        localStorage.setItem("vstr_hint_win_streak", String(newWinStreak));
        localStorage.setItem("vstr_hint_lose_streak", String(newLoseStreak));

        if (allHintsUnlocked) {
          setMessage(`You lose. Coin: ${outcome}.\n\nBetter luck next time!`);
        } else {
          setMessage(`You lose. Coin: ${outcome}. The secrets remain hidden.`);
        }

        // Mission 2: Losing to HintMaster 5 times in a row
        if (newLoseStreak >= 5) {
          unlockMission("hint-lose-streak");
        }
      }
    }, 1400);
  };

  return (
    <div style={{
      position: "relative",
      padding: "24px 20px",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'JetBrains Mono', monospace",
      color: "var(--os-text)",
      gap: 20,
      overflow: "hidden",
    }}>
      {/* Coin */}
      <div style={{
        fontSize: "4rem",
        lineHeight: 1,
        animation: flipping ? "coinFlip 0.3s linear infinite" : "none",
        filter: flipping ? "drop-shadow(0 0 12px var(--os-amber))" : "drop-shadow(0 4px 8px rgba(0,0,0,0.4))",
        transition: "filter 0.3s",
      }}>
        🪙
      </div>

      {/* Wins & Streaks Counter */}
      {(wins > 0 || winStreak > 0 || loseStreak > 0) && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
          {wins > 0 && (
            <div style={{
              fontSize: 11,
              color: "var(--os-amber)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              background: "var(--os-amber-dim)",
              padding: "3px 10px",
              borderRadius: 4,
              border: "1px solid rgba(245,158,11,0.2)",
            }}>
              {wins} hint{wins !== 1 ? "s" : ""} earned
            </div>
          )}
          {winStreak > 0 && (
            <div style={{
              fontSize: 11,
              color: "var(--os-jade)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              background: "rgba(16, 185, 129, 0.1)",
              padding: "3px 10px",
              borderRadius: 4,
              border: "1px solid rgba(16, 185, 129, 0.2)",
            }}>
              Streak: {winStreak}W
            </div>
          )}
          {loseStreak > 0 && (
            <div style={{
              fontSize: 11,
              color: "var(--os-red)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              background: "rgba(239, 68, 68, 0.1)",
              padding: "3px 10px",
              borderRadius: 4,
              border: "1px solid rgba(239, 68, 68, 0.2)",
            }}>
              Streak: {loseStreak}L
            </div>
          )}
        </div>
      )}

      {/* Message */}
      <p style={{
        textAlign: "center",
        maxWidth: 300,
        minHeight: 80,
        whiteSpace: "pre-wrap",
        lineHeight: 1.65,
        fontSize: 13,
        color: result && guess === result ? "var(--os-jade)" : result ? "var(--os-red)" : "var(--os-text-muted)",
      }}>
        {message}
      </p>

      {/* Buttons */}
      <div style={{ display: "flex", gap: 16 }}>
        <button
          onClick={() => flipCoin("heads")}
          disabled={flipping}
          className="btn-amber"
          style={{ minWidth: 100 }}
        >
          Heads
        </button>
        <button
          onClick={() => flipCoin("tails")}
          disabled={flipping}
          className="btn-jade"
          style={{ minWidth: 100 }}
        >
          Tails
        </button>
      </div>

      {/* Floating Hints List Widget */}
      <AnimatePresence>
        {allHintsUnlocked && showHintsWidget && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            style={{
              position: "absolute",
              bottom: "52px", // Directly above the toggle button
              right: "12px",
              width: "230px",
              maxHeight: "220px",
              background: "rgba(10, 14, 20, 0.92)",
              backdropFilter: "blur(12px) saturate(140%)",
              WebkitBackdropFilter: "blur(12px) saturate(140%)",
              border: "1px solid rgba(245, 158, 11, 0.3)",
              borderRadius: "8px",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
              color: "#fff",
              padding: "10px",
              zIndex: 15,
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              fontFamily: "var(--font-mono)",
            }}
          >
            {/* Header */}
            <div style={{
              fontSize: "9px",
              color: "var(--os-amber)",
              fontWeight: "bold",
              letterSpacing: "0.05em",
              borderBottom: "1px solid rgba(245,158,11,0.15)",
              paddingBottom: "4px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <span>📜 UNLOCKED HINTS</span>
              <span style={{ color: "var(--os-jade)" }}>5/5</span>
            </div>

            {/* List */}
            <div style={{
              flex: 1,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              paddingRight: "2px"
            }}>
              {HINTS.map((h, idx) => (
                <div
                  key={idx}
                  style={{
                    fontSize: "9px",
                    color: "var(--os-text-muted)",
                    lineHeight: 1.4,
                    borderBottom: idx < 4 ? "1px solid rgba(255,255,255,0.03)" : "none",
                    paddingBottom: "6px"
                  }}
                >
                  <div style={{ color: "var(--os-amber)", fontWeight: "bold", marginBottom: "1px" }}>Hint #{idx + 1}</div>
                  {h}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Right Toggle Button (Visible only after all hints are unlocked) */}
      {allHintsUnlocked && (
        <button
          onClick={() => setShowHintsWidget((v) => !v)}
          title="Toggle Unlocked Hints"
          style={{
            position: "absolute",
            bottom: "12px",
            right: "12px",
            background: showHintsWidget ? "rgba(245,158,11,0.15)" : "rgba(255,255,255,0.03)",
            border: `1px solid ${showHintsWidget ? "var(--os-amber)" : "var(--os-border)"}`,
            borderRadius: "6px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "15px",
            color: showHintsWidget ? "var(--os-amber)" : "var(--os-text-muted)",
            width: "30px",
            height: "30px",
            zIndex: 20,
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            if (!showHintsWidget) e.currentTarget.style.color = "var(--os-text)";
          }}
          onMouseLeave={(e) => {
            if (!showHintsWidget) e.currentTarget.style.color = "var(--os-text-muted)";
          }}
        >
          📜
        </button>
      )}

      <style>{`
        @keyframes coinFlip {
          0%   { transform: rotateY(0deg) scale(1); }
          50%  { transform: rotateY(90deg) scale(1.1); }
          100% { transform: rotateY(180deg) scale(1); }
        }
      `}</style>
    </div>
  );
}
