"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";

interface TerminalLine {
  type: "input" | "output" | "error" | "success" | "dim";
  text: string;
}

const HELP_TEXT = `
Available commands:
  whoami          — about Sai Tarun
  ls              — list all sections
  ls projects/    — list projects
  cat skills      — print skill stack
  contact         — show contact info
  clear           — clear terminal
`.trim();

const WHOAMI = `
> Sai Tarun Reddy Velagala
> CS Undergrad & AI Developer — Hyderabad, Telangana
> KG Reddy College of Engg & Technology (Expected: 2027)
> CGPA: 8.41 | B.Tech CSE (AI & ML)
>
> Building: intelligent software, web apps, AI tools.
> Hackathons won: 1 (IKARUS 2024 - First Prize)
> Currently: Secretary, Student Council Editorial Board
`.trim();

const LS_ROOT = [
  "drwxr-xr-x  about/",
  "drwxr-xr-x  projects/",
  "drwxr-xr-x  skills/",
  "drwxr-xr-x  experience/",
  "drwxr-xr-x  achievements/",
  "-rw-r--r--   contact.txt",
  "-rw-r--r--   resume.pdf",
  "-rwx------   [hidden easter eggs — explore to find them]",
].join("\n");

const LS_PROJECTS = [
  "-rw-r--r--   EventOS        (Event Management Platform)",
  "-rw-r--r--   MailGenius     (AI Email Automation Tool)",
  "-rw-r--r--   EchoLens       (Real-Time Sentiment Dashboard)",
].join("\n");

const CAT_SKILLS = `
Languages:    Python · JavaScript · HTML · CSS · TypeScript
Frontend:     React.js · Next.js · Tailwind CSS
Backend:      Firebase · REST APIs · DBMS
AI & Tools:   NLP · Prompt Engineering · WatsonX · Chatbot Dev
Workflow:     Git · GitHub · Vercel · UI/UX Design
`.trim();

const CONTACT = `
📧  saitarunrdy@gmail.com
📞  +91 7043692980
📍  Hyderabad, Telangana, India
🔗  LinkedIn  →  linkedin.com/in/sai-tarun-reddy
🐙  GitHub    →  github.com/DaKaufeeBoii
`.trim();

const BOOT_LINES: TerminalLine[] = [
  { type: "success", text: "VSTR-OS Terminal v2.0.0" },
  { type: "dim", text: "Copyright © 2025 Sai Tarun Reddy Velagala" },
  { type: "dim", text: '─'.repeat(46) },
  { type: "dim", text: 'Type "help" to see available commands.' },
  { type: "dim", text: "" },
];

import { useOS } from "@/store/windowStore";

export default function TerminalApp() {
  const { openWindow } = useOS();
  const [lines, setLines] = useState<TerminalLine[]>(BOOT_LINES);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  const push = useCallback((...newLines: TerminalLine[]) => {
    setLines((prev) => [...prev, ...newLines]);
  }, []);

  const runCommand = useCallback((raw: string) => {
    const cmd = raw.trim().toLowerCase();
    push({ type: "input", text: `$ ${raw.trim()}` });

    if (!cmd) return;

    setHistory((h) => [raw.trim(), ...h]);
    setHistIdx(-1);

    switch (cmd) {
      case "help":
        push({ type: "output", text: HELP_TEXT });
        break;
      case "whoami":
        push({ type: "output", text: WHOAMI });
        break;
      case "ls":
      case "ls .":
        push({ type: "success", text: LS_ROOT });
        break;
      case "ls projects":
      case "ls projects/":
        push({ type: "success", text: LS_PROJECTS });
        break;
      case "cat skills":
      case "cat skills.txt":
        push({ type: "output", text: CAT_SKILLS });
        break;
      case "contact":
      case "cat contact.txt":
        push({ type: "output", text: CONTACT });
        break;
      case "clear":
        setLines([]);
        break;
      case "pwd":
        push({ type: "output", text: "/home/saitarun/portfolio" });
        break;
      case "date":
        push({ type: "output", text: new Date().toLocaleString("en-IN") });
        break;
      case "echo hello":
        push({ type: "output", text: "Hello, World!" });
        break;
      case "sudo rm -rf /":
        push({ type: "error", text: "Nice try 😄  Permission denied." });
        break;
      case "play flappy":
        push({ type: "success", text: "Launching Flappy.exe... good luck 🐦" });
        openWindow("flappy");
        break;
      case "ask hintmaster":
        push({ type: "success", text: "Summoning the HintMaster..." });
        openWindow("hintmaster");
        break;
      case "open disk_cleanup":
      case "disk_cleanup":
        push({ type: "success", text: "Launching Disk Cleanup.app — scanning for corrupted sectors..." });
        openWindow("disk_cleanup");
        break;
      case "start desktop_pet":
      case "desktop_pet":
        push({ type: "success", text: "Installing Desktop Pet companion..." });
        openWindow("desktop_pet");
        break;
      case "crack password":
      case "pwntool":
        push({ type: "success", text: "Initializing PwnTool 3.0... connecting to target..." });
        openWindow("password_cracker");
        break;
      default:
        push({
          type: "error",
          text: `bash: ${cmd}: command not found\nType "help" to see available commands.`,
        });
    }
    push({ type: "dim", text: "" });
  }, [push, openWindow]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      runCommand(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const idx = Math.min(histIdx + 1, history.length - 1);
      setHistIdx(idx);
      setInput(history[idx] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const idx = Math.max(histIdx - 1, -1);
      setHistIdx(idx);
      setInput(idx === -1 ? "" : history[idx]);
    }
  };

  return (
    <div
      className="terminal-body"
      style={{ flex: 1, minHeight: 0, cursor: "text" }}
      onClick={() => inputRef.current?.focus()}
    >
      {lines.map((line, i) => (
        <div
          key={i}
          className={
            line.type === "input"   ? "terminal-prompt"
            : line.type === "error"   ? "terminal-error"
            : line.type === "success" ? "terminal-success"
            : line.type === "dim"     ? "terminal-dim"
            : "terminal-output"
          }
          style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
        >
          {line.text}
        </div>
      ))}

      {/* Input row */}
      <div className="terminal-input-row">
        <span className="terminal-prompt">saitarun@vstr-os:~$</span>
        <input
          ref={inputRef}
          id="terminal-input"
          className="terminal-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          autoFocus
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          aria-label="Terminal input"
        />
      </div>
      <div ref={bottomRef} />
    </div>
  );
}
