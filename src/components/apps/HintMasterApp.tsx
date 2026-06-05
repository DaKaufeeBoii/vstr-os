"use client";

import React, { useState } from "react";

const HINTS = [
  "Try typing 'play flappy' in the terminal for a quick game.",
  "Looking for a fight? Run 'play victory.fight' in the terminal.",
  "Check out the /games/secret URL if you want to find me.",
  "There might be some secret commands hidden in the README.",
];

export default function HintMasterApp() {
  const [guess, setGuess] = useState<"heads" | "tails" | null>(null);
  const [result, setResult] = useState<"heads" | "tails" | null>(null);
  const [message, setMessage] = useState("I am the HintMaster. Beat me in a coin toss, and I shall grant you a hint.");
  const [flipping, setFlipping] = useState(false);

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
        const randomHint = HINTS[Math.floor(Math.random() * HINTS.length)];
        setMessage(`You win! The coin landed on ${outcome}. Here is your hint:\n\n"${randomHint}"`);
      } else {
        setMessage(`You lose! The coin landed on ${outcome}. Better luck next time.`);
      }
    }, 1500);
  };

  return (
    <div style={{ padding: 20, height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-mono)", color: "var(--os-text)" }}>
      <div style={{ fontSize: "4rem", marginBottom: 20, animation: flipping ? "spin 0.5s linear infinite" : "none" }}>
        🪙
      </div>
      
      <p style={{ textAlign: "center", marginBottom: 30, minHeight: 60, whiteSpace: "pre-wrap" }}>
        {message}
      </p>

      <div style={{ display: "flex", gap: 16 }}>
        <button
          onClick={() => flipCoin("heads")}
          disabled={flipping}
          style={{
            padding: "10px 24px",
            background: "var(--os-cyan)",
            color: "black",
            border: "none",
            borderRadius: 6,
            fontWeight: "bold",
            cursor: flipping ? "not-allowed" : "pointer",
            opacity: flipping ? 0.5 : 1
          }}
        >
          Heads
        </button>
        <button
          onClick={() => flipCoin("tails")}
          disabled={flipping}
          style={{
            padding: "10px 24px",
            background: "var(--os-purple)",
            color: "white",
            border: "none",
            borderRadius: 6,
            fontWeight: "bold",
            cursor: flipping ? "not-allowed" : "pointer",
            opacity: flipping ? 0.5 : 1
          }}
        >
          Tails
        </button>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }
      `}</style>
    </div>
  );
}
