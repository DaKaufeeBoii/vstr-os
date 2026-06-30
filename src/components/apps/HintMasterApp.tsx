"use client";

import React, { useState } from "react";

const HINTS = [
  "Try typing 'play flappy' in the terminal. Your highscore awaits.",
  "Something is scanning your disk. Run 'open disk_cleanup' and investigate.",
  "The terminal hides more than just commands. Try 'start desktop_pet'.",
  "A locked door reveals itself. Type 'crack password' if you dare.",
  "Check out the /games/secret URL if you're feeling curious.",
  "The HintMaster knows all. But knowledge has its price.",
];

export default function HintMasterApp() {
  const [guess, setGuess] = useState<"heads" | "tails" | null>(null);
  const [result, setResult] = useState<"heads" | "tails" | null>(null);
  const [message, setMessage] = useState("I am the HintMaster. Beat me in a coin toss, and I shall reveal a secret.");
  const [flipping, setFlipping] = useState(false);
  const [wins, setWins] = useState(0);

  const flipCoin = (playerGuess: "heads" | "tails") => {
    if (flipping) return;
    setGuess(playerGuess);
    setFlipping(true);
    setMessage("Flipping...");
    setResult(null);

    setTimeout(() => {
      const outcome = Math.random() > 0.5 ? "heads" : "tails";
      setResult(outcome);
      setFlipping(false);

      if (playerGuess === outcome) {
        const newWins = wins + 1;
        setWins(newWins);
        const hint = HINTS[(newWins - 1) % HINTS.length];
        setMessage(`You win! Coin: ${outcome}.\n\n🔍 Hint #${newWins}:\n"${hint}"`);
      } else {
        setMessage(`You lose. Coin: ${outcome}. The secrets remain hidden.`);
      }
    }, 1400);
  };

  return (
    <div style={{
      padding: "24px 20px",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'JetBrains Mono', monospace",
      color: "var(--os-text)",
      gap: 20,
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

      {/* Wins counter */}
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
