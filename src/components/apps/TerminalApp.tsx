"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";

interface TerminalLine {
  type: "input" | "output" | "error" | "success" | "dim";
  text: string;
}

/* ── Static text blobs ─────────────────────────────────────────────── */
const HELP_TEXT = `
Available commands:
  whoami            — about Sai Tarun
  ls / dir          — list all sections
  ls projects/      — list projects
  cat skills        — print skill stack
  contact           — show contact info
  resume            — resume page info
  neofetch          — display system information
  systeminfo        — detailed OS system report
  ipconfig          — network adapter configuration
  tasklist          — list running processes (windows)
  taskkill /im <app>— close a running app
  ping <host>       — simulate ICMP ping
  ver               — Windows version string
  wmic              — WMI hardware overview
  get-process       — PowerShell process list
  tree              — ASCII directory tree
  mkdir <name>      — create virtual directory
  cd <dir>          — change directory
  grep <pattern>    — search portfolio content
  findstr <pattern> — Windows alias for grep
  find <pattern>    — find matching projects
  matrix            — toggle Matrix rain mode
  color <code>      — change terminal accent color
  play flappy       — launch Flappy.exe
  ask hintmaster    — summon the HintMaster
  open disk_cleanup — disk cleanup utility
  start desktop_pet — desktop pet companion
  crack password    — PwnTool 3.0 hacking sim
  clear / cls       — clear the screen
  help              — show this help
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
  "-rw-r--r--   resume         (open /resume in browser)",
  "-rwx------   [hidden easter eggs — explore to find them]",
].join("\n");

const DIR_ROOT = () => {
  const now = new Date();
  const date = `${now.getDate().toString().padStart(2, "0")}/${(now.getMonth() + 1).toString().padStart(2, "0")}/${now.getFullYear()}`;
  const time = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  return [
    ` Directory of C:\\Users\\saitarun\\portfolio`,
    ``,
    `${date}  ${time}    <DIR>          .`,
    `${date}  ${time}    <DIR>          ..`,
    `${date}  ${time}    <DIR>          about`,
    `${date}  ${time}    <DIR>          projects`,
    `${date}  ${time}    <DIR>          skills`,
    `${date}  ${time}    <DIR>          experience`,
    `${date}  ${time}    <DIR>          achievements`,
    `${date}  ${time}               842 contact.txt`,
    `${date}  ${time}             1,779 README.md`,
    `               2 File(s)          2,621 bytes`,
    `               5 Dir(s)   ∞ bytes free`,
  ].join("\n");
};

const LS_PROJECTS = [
  "-rw-r--r--   VSTR-OS        (Interactive OS Portfolio)",
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

const SYSTEMINFO = () => `
Host Name:                 VSTR-PC
OS Name:                   VSTR-OS v2.0.0 (Windows 11 shell)
OS Version:                10.0.22631 Build 22631
OS Manufacturer:           Microsoft Corporation
OS Configuration:          Standalone Workstation
System Manufacturer:       Portfolio Systems Inc.
System Model:              SaitarunDev-001
System Type:               x64-based PC
Processor:                 Virtual AI Engine @ 3.20GHz, 2 Core(s)
Total Physical Memory:     16,384 MB
Available Physical Memory: 12,742 MB
Page File Space:           32,768 MB
Boot Device:               \\Device\\HarddiskVolume3
System Locale:             en-in;English (India)
Time Zone:                 (UTC+05:30) Chennai, Kolkata, Mumbai
Uptime:                    ${Math.floor(performance.now() / 1000)}s
`.trim();

const IPCONFIG = `
Windows IP Configuration

Ethernet adapter vEthernet (Portfolio LAN):

   Connection-specific DNS Suffix  . :
   Link-local IPv6 Address . . . . . : fe80::1a2b:3c4d:5e6f::7890%12
   IPv4 Address. . . . . . . . . . . : 192.168.1.42
   Subnet Mask . . . . . . . . . . . : 255.255.255.0
   Default Gateway . . . . . . . . . : 192.168.1.1

Wireless LAN adapter Wi-Fi:

   Connection-specific DNS Suffix  . :
   IPv4 Address. . . . . . . . . . . : 10.0.0.77
   Subnet Mask . . . . . . . . . . . : 255.255.0.0
   Default Gateway . . . . . . . . . : 10.0.0.1
   DNS Servers . . . . . . . . . . . : 8.8.8.8
                                       1.1.1.1
`.trim();

const IPCONFIG_ALL = `
${IPCONFIG}

   DHCP Enabled. . . . . . . . . . . : Yes
   Lease Obtained. . . . . . . . . . : ${new Date().toLocaleDateString("en-IN")} 09:14:22 AM
   Lease Expires . . . . . . . . . . : ${new Date(Date.now() + 86400000).toLocaleDateString("en-IN")} 09:14:22 AM
   Physical Address. . . . . . . . . : 3C-52-82-1A-B7-D9
`.trim();

const TASKLIST_HEADER = `
Image Name                     PID Session Name        Session#    Mem Usage
========================= ======== ================ =========== ============`;

const VER_STRING = `Microsoft Windows [Version 10.0.22631.3880]
(c) Microsoft Corporation. All rights reserved. [VSTR-OS Shell v2.0.0]`;

const TREE_OUTPUT = `
C:\\Users\\saitarun\\portfolio
├── about\\
│   └── profile.json
├── projects\\
│   ├── VSTR-OS.json
│   ├── EventOS.json
│   ├── MailGenius.json
│   └── EchoLens.json
├── skills\\
│   └── stack.json
├── experience\\
│   └── timeline.log
├── achievements\\
│   └── awards.txt
├── contact.txt
└── README.md
`.trim();

const WMIC_OUTPUT = `
Processor  : Virtual AI Engine, 2 Cores, 3.20 GHz
RAM        : 16384 MB
Disk       : 512 GB SSD (VSTR-DISK-0)
GPU        : Virtual Render Engine (WebGL 2.0)
BIOS       : VSTR-BIOS v1.0 (2025-01-01)
Board      : Portfolio Systems MainBoard v2
`.trim();

const GET_PROCESS = (openWindows: string[]) => {
  const rows = [
    ["System", "4", "0.0", "0.1"],
    ["vstr-os.exe", "1024", "1.2", "48.3"],
    ["next-server.exe", "2048", "3.4", "92.1"],
    ...openWindows.map((name, i) => [
      `${name}.exe`,
      String(3000 + i * 128),
      (Math.random() * 2).toFixed(1),
      (Math.random() * 40 + 10).toFixed(1),
    ]),
  ];
  const header = `Handles  NPM(K)    PM(K)      WS(K) CPU(s)     Id  SI ProcessName\n-------  ------    -----      ----- ------     --  -- -----------`;
  const rowStr = rows
    .map(([name, pid, cpu, mem]) =>
      `    ${Math.floor(Math.random() * 500)}      ${Math.floor(Math.random() * 50)}   ${Math.floor(Math.random() * 20000)}     ${Math.floor(Math.random() * 80000)} ${cpu.padStart(6)}  ${pid.padStart(5)}   0 ${name}`
    )
    .join("\n");
  return `${header}\n${rowStr}`;
};

const BOOT_LINES: TerminalLine[] = [
  { type: "success", text: "VSTR-OS Terminal v2.0.0" },
  { type: "dim", text: "Copyright © 2025 Sai Tarun Reddy Velagala" },
  { type: "dim", text: "─".repeat(46) },
  { type: "dim", text: 'Type "help" to see available commands.' },
  { type: "dim", text: "" },
];

import { useOS, WINDOW_CONFIGS } from "@/store/windowStore";
import { useOSSettings } from "@/store/osSettingsStore";

export default function TerminalApp() {
  const { openWindow, windows } = useOS();
  const { unlockMission, unlockedMissions } = useOSSettings();
  const [lines, setLines] = useState<TerminalLine[]>(BOOT_LINES);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [cwd, setCwd] = useState("C:\\Users\\saitarun\\portfolio");
  const [matrixMode, setMatrixMode] = useState(false);
  const [accentColor, setAccentColor] = useState("var(--os-amber)");
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  const push = useCallback((...newLines: TerminalLine[]) => {
    setLines((prev) => [...prev, ...newLines]);
  }, []);

  const runCommand = useCallback(
    (raw: string) => {
      const cmd = raw.trim().toLowerCase();
      const rawTrimmed = raw.trim();
      push({ type: "input", text: `PS ${cwd}> ${rawTrimmed}` });

      if (!cmd) return;

      setHistory((h) => [rawTrimmed, ...h]);
      setHistIdx(-1);

      // ── Navigation helpers ──────────────────────────────────────────
      if (cmd === "help") {
        push({ type: "output", text: HELP_TEXT });

      } else if (cmd === "whoami") {
        push({ type: "output", text: WHOAMI });

      } else if (cmd === "ls" || cmd === "ls ." || cmd === "ls /" || cmd === "dir") {
        if (cmd === "dir") {
          push({ type: "success", text: DIR_ROOT() });
        } else {
          push({ type: "success", text: LS_ROOT });
        }

      } else if (cmd === "ls projects" || cmd === "ls projects/") {
        push({ type: "success", text: LS_PROJECTS });

      } else if (cmd === "cat skills" || cmd === "cat skills.txt") {
        push({ type: "output", text: CAT_SKILLS });

      } else if (cmd === "contact" || cmd === "cat contact.txt") {
        push({ type: "output", text: CONTACT });

      } else if (cmd === "clear" || cmd === "cls") {
        setLines([]);
        return;

      } else if (cmd === "resume" || cmd === "cat resume.pdf") {
        push({ type: "output", text: "Open /resume in your browser to view or print to PDF." });

      } else if (cmd === "pwd") {
        push({ type: "output", text: cwd });

      } else if (cmd === "date") {
        push({ type: "output", text: new Date().toLocaleString("en-IN") });

      } else if (cmd === "ver") {
        push({ type: "output", text: VER_STRING });

      // ── System Commands ─────────────────────────────────────────────
      } else if (cmd === "systeminfo") {
        push({ type: "success", text: SYSTEMINFO() });
        unlockMission("terminal-hacker");

      } else if (cmd === "ipconfig") {
        push({ type: "output", text: IPCONFIG });

      } else if (cmd === "ipconfig /all") {
        push({ type: "output", text: IPCONFIG_ALL });

      } else if (cmd === "tasklist") {
        const openWindowNames = windows
          .filter((w) => w.isOpen)
          .map((w) => WINDOW_CONFIGS.find((c) => c.id === w.id)?.title ?? w.id);
        const rows = [
          ["System Idle Process", "0"],
          ["System", "4"],
          ["vstr-os.exe", "1024"],
          ["next-server.exe", "2048"],
          ...openWindowNames.map((name, i) => [name.replace(/[^a-z0-9]/gi, "") + ".exe", String(3000 + i * 128)]),
        ];
        const body = rows.map(([n, pid]) =>
          `${n.padEnd(30)}${pid.padStart(6)}   Console                    1    ${Math.floor(Math.random() * 50000).toLocaleString()} K`
        ).join("\n");
        push({ type: "success", text: TASKLIST_HEADER + "\n" + body });

      } else if (cmd.startsWith("taskkill")) {
        const parts = rawTrimmed.split(" ");
        const flagIdx = parts.findIndex((p) => p.toLowerCase() === "/im");
        if (flagIdx !== -1 && parts[flagIdx + 1]) {
          push({ type: "success", text: `SUCCESS: Sent termination signal to the process "${parts[flagIdx + 1]}".` });
        } else {
          push({ type: "error", text: "Usage: taskkill /im <process.exe>\nUsage: taskkill /pid <PID>" });
        }

      } else if (cmd.startsWith("ping")) {
        const host = rawTrimmed.split(" ").slice(1).join(" ") || "localhost";
        const lines: TerminalLine[] = [
          { type: "output", text: `\nPinging ${host} with 32 bytes of data:` },
          { type: "success", text: `Reply from 142.250.77.46: bytes=32 time=${Math.floor(Math.random() * 30 + 5)}ms TTL=117` },
          { type: "success", text: `Reply from 142.250.77.46: bytes=32 time=${Math.floor(Math.random() * 30 + 5)}ms TTL=117` },
          { type: "success", text: `Reply from 142.250.77.46: bytes=32 time=${Math.floor(Math.random() * 30 + 5)}ms TTL=117` },
          { type: "success", text: `Reply from 142.250.77.46: bytes=32 time=${Math.floor(Math.random() * 30 + 5)}ms TTL=117` },
          { type: "output", text: `\nPing statistics for ${host}:\n    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)\nApproximate round trip times in milli-seconds:\n    Minimum = 5ms, Maximum = 35ms, Average = ${Math.floor(Math.random() * 20 + 8)}ms` },
        ];
        push(...lines);

      } else if (cmd === "wmic") {
        push({ type: "output", text: WMIC_OUTPUT });

      } else if (cmd === "get-process") {
        const openWindowNames = windows
          .filter((w) => w.isOpen)
          .map((w) => WINDOW_CONFIGS.find((c) => c.id === w.id)?.title ?? w.id);
        push({ type: "output", text: GET_PROCESS(openWindowNames) });

      // ── Directory Navigation ────────────────────────────────────────
      } else if (cmd === "tree") {
        push({ type: "success", text: TREE_OUTPUT });

      } else if (cmd.startsWith("mkdir ")) {
        const dir = rawTrimmed.slice(6).trim();
        push({ type: "success", text: `Directory created: ${cwd}\\${dir}` });

      } else if (cmd.startsWith("cd ")) {
        const target = rawTrimmed.slice(3).trim();
        if (target === ".." || target === "..\\") {
          const parts = cwd.split("\\");
          if (parts.length > 1) {
            setCwd(parts.slice(0, -1).join("\\"));
            push({ type: "dim", text: "" });
            return;
          }
        } else {
          setCwd(`${cwd}\\${target}`);
          push({ type: "dim", text: "" });
          return;
        }

      // ── Fun / Visual ────────────────────────────────────────────────
      } else if (cmd === "matrix") {
        setMatrixMode((v) => !v);
        push({
          type: "success",
          text: matrixMode ? "Matrix rain disabled." : "Matrix rain enabled. 🟩 Wake up, Neo...",
        });

      } else if (cmd.startsWith("color ")) {
        const code = rawTrimmed.split(" ")[1];
        const colorMap: Record<string, string> = {
          "0a": "#00ff00",
          "0b": "#00ffff",
          "0c": "#ff0000",
          "0e": "#ffff00",
          "0f": "#ffffff",
          "f0": "#000000",
        };
        const resolved = colorMap[code] ?? code;
        setAccentColor(resolved);
        push({ type: "success", text: `Terminal color changed to: ${resolved}` });

      } else if (cmd === "neofetch") {
        const logo = `
   /\\_/\\      saitarun@vstr-os
  ( o.o )     ----------------
   > ^ <      OS: VSTR-OS v2.0.0
  /     \\     Host: Portfolio-Website-PC
  |  |  |     Kernel: Next.js 15.3.3
  \\__/__/     Uptime: ${Math.floor(performance.now() / 1000)}s
              Shell: PowerShell 7.4
              CPU: Virtual AI Engine (Dual-Core)
              RAM: 16 GB (Allocated)
              GPU: WebGL 2.0 Virtual Engine
              Missions: ${unlockedMissions.length} / 12 unlocked 🏆
        `.trim();
        push({ type: "success", text: logo });
        unlockMission("terminal-hacker");

      } else if (cmd === "echo hello") {
        push({ type: "output", text: "Hello, World!" });

      } else if (cmd === "sudo rm -rf /" || cmd === "rm -rf /") {
        push({ type: "error", text: "Nice try 😄  Permission denied. Access is denied." });

      // ── App Launchers ───────────────────────────────────────────────
      } else if (cmd === "play flappy") {
        push({ type: "success", text: "Launching Flappy.exe... good luck 🐦" });
        openWindow("flappy");

      } else if (cmd === "ask hintmaster") {
        push({ type: "success", text: "Summoning the HintMaster..." });
        openWindow("hintmaster");

      } else if (cmd === "open disk_cleanup" || cmd === "disk_cleanup") {
        push({ type: "success", text: "Launching Disk Cleanup.app — scanning for corrupted sectors..." });
        openWindow("disk_cleanup");

      } else if (cmd === "start desktop_pet" || cmd === "desktop_pet") {
        push({ type: "success", text: "Installing Desktop Pet companion..." });
        openWindow("desktop_pet");

      } else if (cmd === "crack password" || cmd === "pwntool") {
        push({ type: "success", text: "Initializing PwnTool 3.0... connecting to target..." });
        openWindow("password_cracker");

      // ── Grep / Findstr ────────────────────────────────────────────
      } else if (cmd.startsWith("grep ") || cmd.startsWith("findstr ") || cmd.startsWith("find ")) {
        const spaceIdx = rawTrimmed.indexOf(" ");
        const pattern = rawTrimmed.slice(spaceIdx + 1).trim().toLowerCase();
        if (!pattern) {
          push({ type: "error", text: "Usage: grep <pattern>\nSearches through all portfolio content for a matching keyword." });
        } else {
          // Portfolio search corpus
          const CORPUS = [
            { file: "about.txt",       text: "CS Undergrad AI Developer Hyderabad CGPA 8.41 B.Tech CSE AI ML KGRCET hackathon Secretary" },
            { file: "skills.txt",      text: "Python JavaScript TypeScript React Next.js Node.js TailwindCSS PyTorch TensorFlow Flask FastAPI SQL PostgreSQL MongoDB Docker AWS Git C++ Java" },
            { file: "projects/klyf",   text: "KLYF AI-powered social media analysis sentiment NLP Twitter Flask Python" },
            { file: "projects/solveit",text: "SolveIt HackerRank LeetCode problem tracker dashboard React TypeScript" },
            { file: "projects/aurora", text: "Aurora 3D portfolio WebGL Three.js interactive generative art shader" },
            { file: "projects/questly",text: "Questly gamification learning platform React quizzes achievements" },
            { file: "experience.log",  text: "internship student council secretary editorial board leadership communication" },
            { file: "achievements.txt",text: "IKARUS 2024 First Prize hackathon Dean list top 10% batch" },
            { file: "contact.txt",     text: "email kaufeeblaster@gmail.com GitHub LinkedIn Twitter" },
            { file: "terminal.tsx",    text: "grep findstr matrix neofetch systeminfo powerShell commands" },
          ];
          const matches = CORPUS.filter((c) => c.text.toLowerCase().includes(pattern));
          if (matches.length === 0) {
            push({ type: "dim", text: `grep: no matches found for '${pattern}'` });
          } else {
            const output = matches
              .map((m) => {
                const words = m.text.split(" ");
                const matchWords = words.filter((w) => w.toLowerCase().includes(pattern));
                return `${m.file}: ${matchWords.slice(0, 5).join(", ")}...`;
              })
              .join("\n");
            push({ type: "success", text: `Matches for '${pattern}' in ${matches.length} file(s):\n${output}` });
          }
          unlockMission("terminal-hacker");
        }

      } else {
        push({
          type: "error",
          text: `'${rawTrimmed}' is not recognized as an internal or external command,\noperable program or batch file.\nType "help" to see available commands.`,
        });
      }

      push({ type: "dim", text: "" });
    },
    [push, openWindow, unlockMission, unlockedMissions, windows, cwd, matrixMode]
  );

  // ── Ghost text autocomplete (history-based) ──────────────────────────
  const ghostSuggestion = React.useMemo(() => {
    if (!input || input.length < 2) return "";
    const match = history.find(
      (h) => h.toLowerCase().startsWith(input.toLowerCase()) && h !== input
    );
    return match ? match.slice(input.length) : "";
  }, [input, history]);

  // Accept ghost text with Tab or ArrowRight at end of input
  const onAcceptGhost = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      ghostSuggestion &&
      (e.key === "Tab" || (e.key === "ArrowRight" && (e.target as HTMLInputElement).selectionStart === input.length))
    ) {
      e.preventDefault();
      setInput(input + ghostSuggestion);
    }
  };

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
    } else if (e.key === "Tab") {
      e.preventDefault();
      // Tab completion for known commands
      const cmds = ["help", "whoami", "ls", "dir", "cat skills", "contact", "neofetch", "systeminfo", "ipconfig", "tasklist", "ping", "ver", "wmic", "get-process", "tree", "matrix", "clear", "cls", "play flappy", "ask hintmaster", "crack password", "resume"];
      const match = cmds.find((c) => c.startsWith(input.toLowerCase()));
      if (match) setInput(match);
    }
  };

  return (
    <div
      className="terminal-body"
      style={{
        flex: 1,
        minHeight: 0,
        cursor: "text",
        position: "relative",
        /* overflow-y: auto is provided by .terminal-body CSS class */
      }}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Matrix rain overlay — sits on top of scrolling content, doesn't scroll */}
      {matrixMode && (
        <div
          style={{
            position: "sticky",
            top: 0,
            left: 0,
            right: 0,
            height: 0,
            pointerEvents: "none",
            zIndex: 2,
            overflow: "visible",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "100vh",
              opacity: 0.12,
              background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,70,0.06) 2px, rgba(0,255,70,0.06) 4px)",
              animation: "matrixScroll 3s linear infinite",
            }}
          />
        </div>
      )}

      {lines.map((line, i) => (
        <div
          key={i}
          className={
            line.type === "input"
              ? "terminal-prompt"
              : line.type === "error"
              ? "terminal-error"
              : line.type === "success"
              ? "terminal-success"
              : line.type === "dim"
              ? "terminal-dim"
              : "terminal-output"
          }
          style={{
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            ...(line.type === "success" ? { color: accentColor } : {}),
          }}
        >
          {line.text}
        </div>
      ))}

      {/* Input row — native terminal style */}
      <div className="terminal-input-row">
        <span className="terminal-prompt" style={{ color: accentColor }}>
          PS {cwd}{'>'}
        </span>
        <input
          ref={inputRef}
          id="terminal-input"
          className="terminal-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => onKeyDown(e)}
          autoFocus
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          aria-label="Terminal input"
          style={{
            background: "transparent",
            border: "none",
            outline: "none",
            color: "var(--os-text)",
            font: "inherit",
            flex: 1,
          }}
        />
      </div>
      <div ref={bottomRef} />
    </div>
  );
}
