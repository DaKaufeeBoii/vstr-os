"use client";

import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Phase = "select" | "scan" | "game" | "win" | "lose";
type ScanMode = "quick" | "deep" | "full";
type CellState = "hidden" | "revealed" | "flagged";

interface Cell {
  isMine: boolean;
  neighborCount: number;
  state: CellState;
}

const MODES: Record<ScanMode, { label: string; desc: string; rows: number; cols: number; mines: number }> = {
  quick: { label: "Quick Scan",  desc: "64 sectors · 8 corrupted",  rows: 8,  cols: 8,  mines: 8  },
  deep:  { label: "Deep Scan",   desc: "144 sectors · 20 corrupted", rows: 12, cols: 12, mines: 20 },
  full:  { label: "Full Scan",   desc: "256 sectors · 40 corrupted", rows: 16, cols: 16, mines: 40 },
};

function buildBoard(rows: number, cols: number, mines: number, safeR: number, safeC: number): Cell[][] {
  const board: Cell[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({ isMine: false, neighborCount: 0, state: "hidden" as CellState }))
  );

  // Place mines avoiding the safe cell and its neighbors
  const forbidden = new Set<string>();
  for (let dr = -1; dr <= 1; dr++)
    for (let dc = -1; dc <= 1; dc++) {
      const nr = safeR + dr, nc = safeC + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) forbidden.add(`${nr},${nc}`);
    }

  let placed = 0;
  while (placed < mines) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    const key = `${r},${c}`;
    if (!board[r][c].isMine && !forbidden.has(key)) {
      board[r][c].isMine = true;
      placed++;
    }
  }

  // Count neighbors
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      if (board[r][c].isMine) continue;
      let count = 0;
      for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc].isMine) count++;
        }
      board[r][c].neighborCount = count;
    }

  return board;
}

function floodReveal(board: Cell[][], r: number, c: number): Cell[][] {
  const rows = board.length, cols = board[0].length;
  const next = board.map(row => row.map(cell => ({ ...cell })));
  const queue = [[r, c]];
  while (queue.length) {
    const [cr, cc] = queue.shift()!;
    if (cr < 0 || cr >= rows || cc < 0 || cc >= cols) continue;
    const cell = next[cr][cc];
    if (cell.state !== "hidden") continue;
    cell.state = "revealed";
    if (cell.neighborCount === 0 && !cell.isMine) {
      for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++)
          if (!(dr === 0 && dc === 0)) queue.push([cr + dr, cc + dc]);
    }
  }
  return next;
}

const NEIGHBOR_COLORS: Record<number, string> = {
  1: "#60a5fa", 2: "#10b981", 3: "#f87171", 4: "#818cf8",
  5: "#f59e0b", 6: "#06b6d4", 7: "#a78bfa", 8: "#e5e7eb",
};

export default function DiskCleanupApp() {
  const [phase, setPhase] = useState<Phase>("select");
  const [mode, setMode] = useState<ScanMode>("quick");
  const [scanProgress, setScanProgress] = useState(0);
  const [board, setBoard] = useState<Cell[][]>([]);
  const [flagCount, setFlagCount] = useState(0);
  const [firstClick, setFirstClick] = useState(true);
  const [scanIssues, setScanIssues] = useState<string[]>([]);

  const cfg = MODES[mode];

  // Animate fake scan
  useEffect(() => {
    if (phase !== "scan") return;
    setScanProgress(0);
    setScanIssues([]);
    const issues = [
      "Reading sector map...",
      "Checking filesystem integrity...",
      `${Math.floor(Math.random() * 800 + 100)} orphaned blocks found`,
      "Cross-referencing allocation table...",
      `${cfg.mines} unstable sectors detected ⚠`,
      "Preparing repair interface...",
    ];
    let i = 0;
    const issueInterval = setInterval(() => {
      if (i < issues.length) {
        const currentIssue = issues[i];
        setScanIssues(prev => [...prev, currentIssue]);
        i++;
      }
    }, 320);
    const progressInterval = setInterval(() => {
      setScanProgress(p => {
        if (p >= 100) {
          clearInterval(progressInterval);
          clearInterval(issueInterval);
          setTimeout(() => setPhase("game"), 600);
          return 100;
        }
        return p + 2;
      });
    }, 40);
    return () => { clearInterval(progressInterval); clearInterval(issueInterval); };
  }, [phase, cfg.mines]);

  const startScan = () => {
    setFirstClick(true);
    setFlagCount(0);
    setBoard([]);
    setPhase("scan");
  };

  const handleCellClick = useCallback((r: number, c: number) => {
    setBoard(prev => {
      // On first click, always build fresh board regardless of prev state
      let b = prev;
      if (firstClick || prev.length === 0) {
        b = buildBoard(cfg.rows, cfg.cols, cfg.mines, r, c);
        setFirstClick(false);
        // Flood reveal the safe first cell
        const revealed = floodReveal(b, r, c);
        const hidden = revealed.flat().filter(cell => cell.state === "hidden" && !cell.isMine).length;
        if (hidden === 0) setPhase("win");
        return revealed;
      }

      const cell = b[r]?.[c];
      if (!cell || cell.state !== "hidden") return prev;

      if (cell.isMine) {
        const exploded = b.map(row => row.map(c2 =>
          c2.isMine ? { ...c2, state: "revealed" as CellState } : c2
        ));
        setPhase("lose");
        return exploded;
      }
      const revealed = floodReveal(b, r, c);
      const hidden = revealed.flat().filter(cell => cell.state === "hidden" && !cell.isMine).length;
      if (hidden === 0) setPhase("win");
      return revealed;
    });
  }, [firstClick, cfg]);

  const handleRightClick = useCallback((e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    setBoard(prev => {
      const next = prev.map(row => row.map(cell => ({ ...cell })));
      const cell = next[r]?.[c];
      if (!cell || cell.state === "revealed") return prev;
      if (cell.state === "hidden") { cell.state = "flagged"; setFlagCount(f => f + 1); }
      else { cell.state = "hidden"; setFlagCount(f => f - 1); }
      return next;
    });
  }, []);

  const cellSize = cfg.cols <= 8 ? 40 : cfg.cols <= 12 ? 30 : 22;

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", fontFamily: "'JetBrains Mono', monospace", color: "var(--os-text)" }}>
      <AnimatePresence mode="wait">
        {/* SELECT MODE */}
        {phase === "select" && (
          <motion.div
            key="select"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20, height: "100%" }}
          >
            <div>
              <div style={{ fontSize: 11, color: "var(--os-text-muted)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>
                Disk Cleanup — System Utility v4.2.1
              </div>
              <div style={{ fontSize: 13, color: "var(--os-text-muted)", lineHeight: 1.6 }}>
                Analyzes and repairs corrupted disk sectors. Select a scan mode to begin diagnostic.
              </div>
            </div>

            {/* Fake disk info */}
            <div style={{ background: "rgba(10,14,20,0.5)", border: "1px solid var(--os-border)", borderRadius: 8, padding: 16 }}>
              <div style={{ fontSize: 11, color: "var(--os-text-muted)", marginBottom: 10, letterSpacing: "0.08em", textTransform: "uppercase" }}>Drive: /dev/portfolio (SSD)</div>
              {[
                { label: "Capacity", val: "512 GB" },
                { label: "Used", val: "487 GB (95.1%)" },
                { label: "Filesystem", val: "APFS (Encrypted)" },
                { label: "S.M.A.R.T.", val: "⚠ Failing — Reallocated sectors detected" },
              ].map(r => (
                <div key={r.label} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6 }}>
                  <span style={{ color: "var(--os-text-muted)" }}>{r.label}</span>
                  <span style={{ color: r.label === "S.M.A.R.T." ? "var(--os-red)" : "var(--os-text)" }}>{r.val}</span>
                </div>
              ))}
            </div>

            {/* Scan mode selection */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ fontSize: 11, color: "var(--os-text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>Scan Mode</div>
              {(Object.entries(MODES) as [ScanMode, typeof MODES[ScanMode]][]).map(([key, m]) => (
                <button
                  key={key}
                  onClick={() => setMode(key)}
                  style={{
                    padding: "10px 14px",
                    textAlign: "left",
                    background: mode === key ? "var(--os-jade-dim)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${mode === key ? "var(--os-jade)" : "var(--os-border)"}`,
                    borderRadius: 8,
                    color: "var(--os-text)",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  <div style={{ fontWeight: 600, marginBottom: 2, color: mode === key ? "var(--os-jade)" : "var(--os-text)" }}>{m.label}</div>
                  <div style={{ fontSize: 11, color: "var(--os-text-muted)" }}>{m.desc}</div>
                </button>
              ))}
            </div>

            <button className="btn-jade" onClick={startScan} style={{ marginTop: "auto" }}>
              Run Diagnostic Scan
            </button>
          </motion.div>
        )}

        {/* SCAN PHASE */}
        {phase === "scan" && (
          <motion.div
            key="scan"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16, height: "100%" }}
          >
            <div style={{ fontSize: 11, color: "var(--os-jade)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
              Running {MODES[mode].label}...
            </div>
            <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
              <motion.div
                style={{ height: "100%", background: "var(--os-jade)", borderRadius: 2, boxShadow: "0 0 8px var(--os-jade)" }}
                initial={{ width: "0%" }}
                animate={{ width: `${scanProgress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
            <div style={{ fontSize: 11, color: "var(--os-text-muted)", textAlign: "right" }}>{scanProgress}%</div>
            <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 6 }}>
              {scanIssues.map((issue, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  style={{ fontSize: 12, color: issue.includes("⚠") ? "var(--os-red)" : "var(--os-text-muted)" }}
                >
                  <span style={{ color: "var(--os-jade)", marginRight: 8 }}>›</span>{issue}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* GAME PHASE */}
        {phase === "game" && (
          <motion.div
            key="game"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 10, height: "100%", overflow: "hidden" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 11, color: "var(--os-red)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                ⚠ {cfg.mines - flagCount} corrupted sectors remaining
              </div>
              <div style={{ fontSize: 11, color: "var(--os-text-muted)" }}>🔧 right-click = repair marker</div>
            </div>
            <div style={{
              overflowY: "auto",
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
              flex: 1,
            }}>
              <div style={{ display: "inline-grid", gridTemplateColumns: `repeat(${cfg.cols}, ${cellSize}px)`, gap: 1 }}>
                {(board.length ? board : Array.from({ length: cfg.rows }, () =>
                  Array.from({ length: cfg.cols }, () => ({ isMine: false, neighborCount: 0, state: "hidden" as CellState }))
                )).map((row, r) =>
                  row.map((cell, c) => (
                    <div
                      key={`${r}-${c}`}
                      onClick={() => handleCellClick(r, c)}
                      onContextMenu={(e) => handleRightClick(e, r, c)}
                      style={{
                        width: cellSize,
                        height: cellSize,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: cellSize <= 22 ? 9 : cellSize <= 30 ? 11 : 14,
                        fontWeight: 700,
                        borderRadius: 3,
                        cursor: cell.state === "revealed" ? "default" : "pointer",
                        background:
                          cell.state === "revealed"
                            ? cell.isMine ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.04)"
                            : "rgba(255,255,255,0.08)",
                        border: `1px solid ${
                          cell.state === "revealed"
                            ? cell.isMine ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.06)"
                            : "rgba(255,255,255,0.1)"
                        }`,
                        color: cell.state === "revealed" && cell.neighborCount > 0 && !cell.isMine
                          ? NEIGHBOR_COLORS[cell.neighborCount] ?? "#fff"
                          : "var(--os-text)",
                        transition: "background 0.1s",
                        userSelect: "none",
                      }}
                    >
                      {cell.state === "flagged" && "🔧"}
                      {cell.state === "revealed" && cell.isMine && "💥"}
                      {cell.state === "revealed" && !cell.isMine && cell.neighborCount > 0 && cell.neighborCount}
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* WIN */}
        {phase === "win" && (
          <motion.div
            key="win"
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 24 }}
          >
            <div style={{ fontSize: 48 }}>✅</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "var(--os-jade)" }}>Disk Repaired Successfully</div>
            <div style={{ fontSize: 12, color: "var(--os-text-muted)", textAlign: "center", lineHeight: 1.6 }}>
              All {cfg.mines} corrupted sectors have been flagged and repaired.<br />
              Drive health restored to 100%.
            </div>
            <button className="btn-jade" onClick={() => { setPhase("select"); setBoard([]); }}>
              Run Another Scan
            </button>
          </motion.div>
        )}

        {/* LOSE */}
        {phase === "lose" && (
          <motion.div
            key="lose"
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 24 }}
          >
            <div style={{ fontSize: 48 }}>💾</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "var(--os-red)" }}>Disk Corruption Detected</div>
            <div style={{ fontSize: 12, color: "var(--os-text-muted)", textAlign: "center", lineHeight: 1.6 }}>
              A corrupted sector triggered a cascade failure.<br />
              Sector data could not be recovered.
            </div>
            <button className="btn-amber" onClick={() => { setPhase("select"); setBoard([]); }}>
              Try Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
