"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useOS, WINDOW_CONFIGS } from "@/store/windowStore";
import { useOSSettings } from "@/store/osSettingsStore";
import * as vfs from "@/lib/vfs/vfsEngine";

interface TerminalLine {
  type: "input" | "output" | "error" | "success" | "dim";
  text: string;
}

/* ── Static text blobs ─────────────────────────────────────────────── */
const HELP_TEXT = `
Available commands:
  whoami            — view user & developer identity
  ls / dir [path]   — list directory contents (VFS backed)
  cd <dir>          — change current working directory
  pwd               — print current working directory
  cat <file>        — print file contents
  notepad [file]    — open GUI editor (alias: nano)
  mkdir <name>      — create new directory
  touch <file>      — create empty file
  rm [-r] <file>    — delete file or directory
  tree              — display ASCII hierarchy of current path
  echo <txt> > <f>  — redirect text to file (> overwrite, >> append)
  sudo <cmd> / su   — elevate privileges to root
  chmod <mode> <f>  — change file permissions (octal)
  grep <pattern>    — search portfolio corpus
  neofetch          — display system information
  systeminfo        — detailed OS system report
  ipconfig          — network adapter configuration
  tasklist          — list running processes (windows)
  taskkill /im <app>— close a running app
  ping <host>       — simulate ICMP ping
  ver               — Windows version string
  wmic              — WMI hardware overview
  matrix            — toggle Matrix rain mode
  color <code>      — change terminal accent color
  play flappy       — launch Flappy.exe
  ask hintmaster    — summon the HintMaster
  open disk_cleanup — disk cleanup utility
  start desktop_pet — desktop pet companion
  crack password    — PwnTool 3.0 hacking sim
  blue-screen       — trigger BSOD crash debugger (alias: bsod)
  clear / cls       — clear the screen
  help              — show this help
`.trim();

const WHOAMI_BIO = `
> Sai Tarun Reddy Velagala
> CS Undergrad & AI Developer — Hyderabad, Telangana
> KG Reddy College of Engg & Technology (Expected: 2027)
> CGPA: 8.41 | B.Tech CSE (AI & ML)
>
> Building: intelligent software, web apps, AI tools.
> Hackathons won: 1 (IKARUS 2024 - First Prize)
> Currently: Secretary, Student Council Editorial Board
`.trim();

const VER_STRING = `Microsoft Windows [Version 10.0.22631.3880]
(c) Microsoft Corporation. All rights reserved. [VSTR-OS Shell v2.0.0]`;

const WMIC_OUTPUT = `
Processor  : Virtual AI Engine, 2 Cores, 3.20 GHz
RAM        : 16384 MB
Disk       : 512 GB IndexedDB VFS (VSTR-STORAGE-0)
GPU        : Virtual Render Engine (WebGL 2.0)
BIOS       : VSTR-BIOS v2.0 (2026-10-07)
Board      : Portfolio Systems MainBoard v2
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
Storage Engine:            IndexedDB Persistent VFS Driver
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
`.trim();

const TASKLIST_HEADER = `
Image Name                     PID Session Name        Session#    Mem Usage
========================= ======== ================ =========== ============`;

const BOOT_LINES: TerminalLine[] = [
  { type: "success", text: "VSTR-OS Terminal v2.0.0 [IndexedDB VFS Enabled]" },
  { type: "dim", text: "Copyright © 2026 Sai Tarun Reddy Velagala" },
  { type: "dim", text: "─".repeat(48) },
  { type: "dim", text: 'Type "help" to see available commands. Try "ls", "cat README.md", or "notepad".' },
  { type: "dim", text: "" },
];

interface TerminalAppProps {
  instanceId?: string;
  initialCwd?: string;
}

export default function TerminalApp({ instanceId = "terminal", initialCwd }: TerminalAppProps = {}) {
  const { openWindow, windows } = useOS();
  const { unlockMission, unlockedMissions } = useOSSettings();

  const [lines, setLines] = useState<TerminalLine[]>(BOOT_LINES);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [cwd, setCwd] = useState(initialCwd || "/home/saitarun/portfolio");
  const [currentUser, setCurrentUser] = useState<"guest" | "root">("guest");
  const [awaitingSudoPass, setAwaitingSudoPass] = useState<{ pendingCmd?: string } | null>(null);
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
    async (raw: string) => {
      const rawTrimmed = raw.trim();

      // Handle password entry for sudo
      if (awaitingSudoPass) {
        push({ type: "input", text: `[sudo] password for ${currentUser}: ********` });
        if (rawTrimmed.toLowerCase() === "ikarus" || rawTrimmed.toLowerCase() === "ikarus2024") {
          setCurrentUser("root");
          push({ type: "success", text: "Access granted. Session elevated to root (Ring 0)." });
          unlockMission("terminal-hacker");
          unlockMission("root-access");
          if (awaitingSudoPass.pendingCmd) {
            const pending = awaitingSudoPass.pendingCmd;
            setAwaitingSudoPass(null);
            await runCommand(pending);
            return;
          }
        } else {
          push({ type: "error", text: "sudo: 1 incorrect password attempt. Access denied." });
        }
        setAwaitingSudoPass(null);
        push({ type: "dim", text: "" });
        return;
      }

      const promptLabel = currentUser === "root" ? `PS [ADMIN] ${cwd}> ` : `PS ${cwd}> `;
      push({ type: "input", text: `${promptLabel}${rawTrimmed}` });

      if (!rawTrimmed) return;

      setHistory((h) => [rawTrimmed, ...h]);
      setHistIdx(-1);

      const cmdLower = rawTrimmed.toLowerCase();
      const parts = rawTrimmed.split(/\s+/);
      const mainCmd = parts[0].toLowerCase();
      const args = parts.slice(1);

      // ── Output Redirection (echo "..." > file / >> file) ────────────
      if (rawTrimmed.includes(">")) {
        const isAppend = rawTrimmed.includes(">>");
        const delimiter = isAppend ? ">>" : ">";
        const [cmdPart, filePart] = rawTrimmed.split(delimiter);
        if (filePart && filePart.trim()) {
          const targetPath = vfs.resolvePath(cwd, filePart.trim());
          let textToWrite = cmdPart.replace(/^echo\s*/i, "").trim();
          if (
            (textToWrite.startsWith('"') && textToWrite.endsWith('"')) ||
            (textToWrite.startsWith("'") && textToWrite.endsWith("'"))
          ) {
            textToWrite = textToWrite.slice(1, -1);
          }
          try {
            let finalContent = textToWrite;
            if (isAppend) {
              try {
                const existing = await vfs.readFile(targetPath, currentUser);
                finalContent = existing + (existing.endsWith("\n") ? "" : "\n") + textToWrite;
              } catch {
                finalContent = textToWrite;
              }
            }
            await vfs.writeFile(targetPath, finalContent, currentUser);
            push({ type: "success", text: `Wrote output to ${targetPath}` });
            push({ type: "dim", text: "" });
            return;
          } catch (err: any) {
            push({ type: "error", text: err.message });
            push({ type: "dim", text: "" });
            return;
          }
        }
      }

      // ── Sudo / Su Elevation ─────────────────────────────────────────
      if (mainCmd === "sudo" || mainCmd === "su") {
        if (currentUser === "root") {
          push({ type: "dim", text: "Already running as root superuser." });
          if (args.length > 0) {
            await runCommand(args.join(" "));
            return;
          }
        } else {
          push({ type: "output", text: `[sudo] password for ${currentUser}: ` });
          setAwaitingSudoPass({ pendingCmd: args.length > 0 ? args.join(" ") : undefined });
          return;
        }

      // ── Help ────────────────────────────────────────────────────────
      } else if (mainCmd === "help") {
        push({ type: "output", text: HELP_TEXT });

      // ── Whoami ──────────────────────────────────────────────────────
      } else if (mainCmd === "whoami") {
        push({
          type: "output",
          text: `Current Session: ${currentUser}@vstr-pc [${currentUser === "root" ? "Superuser" : "Standard User"}]\n\n${WHOAMI_BIO}`,
        });

      // ── PWD ─────────────────────────────────────────────────────────
      } else if (mainCmd === "pwd") {
        push({ type: "output", text: cwd });

      // ── LS / DIR ────────────────────────────────────────────────────
      } else if (mainCmd === "ls" || mainCmd === "dir") {
        const targetPath = args[0] ? vfs.resolvePath(cwd, args[0]) : cwd;
        try {
          const items = await vfs.readDir(targetPath, currentUser);
          if (items.length === 0) {
            push({ type: "dim", text: "(directory is empty)" });
          } else if (mainCmd === "dir") {
            const rows = items.map((item) => {
              const d = new Date(item.updatedAt);
              const dateStr =
                d.toLocaleDateString("en-GB") +
                "  " +
                d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
              const typeStr = item.type === "dir" ? "<DIR>          " : `${item.size.toString().padStart(8)} bytes`;
              return `${dateStr}    ${typeStr} ${item.name}`;
            });
            push({
              type: "success",
              text: ` Directory of ${targetPath}\n\n` + rows.join("\n"),
            });
          } else {
            const rows = items.map((item) => {
              const perm = item.type === "dir" ? "d" : "-";
              const rwx =
                (item.permissions & 0o400 ? "r" : "-") +
                (item.permissions & 0o200 ? "w" : "-") +
                (item.permissions & 0o100 ? "x" : "-") +
                (item.permissions & 0o040 ? "r" : "-") +
                (item.permissions & 0o020 ? "w" : "-") +
                (item.permissions & 0o010 ? "x" : "-") +
                (item.permissions & 0o004 ? "r" : "-") +
                (item.permissions & 0o002 ? "w" : "-") +
                (item.permissions & 0o001 ? "x" : "-");
              const size = item.size.toString().padStart(6);
              const owner = item.owner.padEnd(5);
              return `${perm}${rwx}  ${owner}  ${size}  ${item.name}${item.type === "dir" ? "/" : ""}`;
            });
            push({ type: "success", text: rows.join("\n") });
          }
        } catch (err: any) {
          push({ type: "error", text: err.message });
        }

      // ── CD ──────────────────────────────────────────────────────────
      } else if (mainCmd === "cd") {
        const target = args[0] || "/home/saitarun/portfolio";
        const resolved = vfs.resolvePath(cwd, target);
        try {
          const node = await vfs.stat(resolved);
          if (!node) {
            push({ type: "error", text: `cd: no such file or directory: ${target}` });
          } else if (node.type !== "dir") {
            push({ type: "error", text: `cd: not a directory: ${target}` });
          } else if (!vfs.checkPermission(node, "x", currentUser)) {
            push({ type: "error", text: `cd: permission denied: ${target}` });
          } else {
            setCwd(resolved);
          }
        } catch (err: any) {
          push({ type: "error", text: err.message });
        }

      // ── CAT ─────────────────────────────────────────────────────────
      } else if (mainCmd === "cat") {
        if (!args[0]) {
          push({ type: "error", text: "Usage: cat <filename>" });
        } else {
          const resolved = vfs.resolvePath(cwd, args[0]);
          try {
            const content = await vfs.readFile(resolved, currentUser);
            push({ type: "output", text: content });
            if (resolved.includes("flag.txt") && currentUser === "root") {
              unlockMission("root-access");
            }
          } catch (err: any) {
            push({ type: "error", text: err.message });
          }
        }

      // ── MKDIR ───────────────────────────────────────────────────────
      } else if (mainCmd === "mkdir") {
        if (!args[0]) {
          push({ type: "error", text: "Usage: mkdir <directory_name>" });
        } else {
          const resolved = vfs.resolvePath(cwd, args[0]);
          try {
            await vfs.mkdir(resolved, currentUser);
            push({ type: "success", text: `Directory created: ${resolved}` });
          } catch (err: any) {
            push({ type: "error", text: err.message });
          }
        }

      // ── TOUCH ───────────────────────────────────────────────────────
      } else if (mainCmd === "touch") {
        if (!args[0]) {
          push({ type: "error", text: "Usage: touch <filename>" });
        } else {
          const resolved = vfs.resolvePath(cwd, args[0]);
          try {
            const existing = await vfs.stat(resolved);
            if (!existing) {
              await vfs.writeFile(resolved, "", currentUser);
              push({ type: "success", text: `Created file: ${resolved}` });
            } else {
              push({ type: "dim", text: `Updated timestamp for ${resolved}` });
            }
          } catch (err: any) {
            push({ type: "error", text: err.message });
          }
        }

      // ── RM / DEL ────────────────────────────────────────────────────
      } else if (mainCmd === "rm" || mainCmd === "del") {
        const isRec = args.includes("-r") || args.includes("-rf");
        const targetArg = args.find((a) => !a.startsWith("-"));
        if (!targetArg) {
          push({ type: "error", text: "Usage: rm [-r] <file_or_dir>" });
        } else {
          const resolved = vfs.resolvePath(cwd, targetArg);
          try {
            await vfs.remove(resolved, currentUser, isRec);
            push({ type: "success", text: `Removed: ${resolved}` });
          } catch (err: any) {
            push({ type: "error", text: err.message });
          }
        }

      // ── TREE ────────────────────────────────────────────────────────
      } else if (mainCmd === "tree") {
        const target = args[0] ? vfs.resolvePath(cwd, args[0]) : cwd;
        try {
          const treeStr = await vfs.generateTree(target, currentUser);
          push({ type: "success", text: treeStr });
        } catch (err: any) {
          push({ type: "error", text: err.message });
        }

      // ── NOTEPAD / NANO ──────────────────────────────────────────────
      } else if (mainCmd === "notepad" || mainCmd === "nano") {
        const filePath = args[0]
          ? vfs.resolvePath(cwd, args[0])
          : `${cwd}/Untitled.txt`;
        push({ type: "success", text: `Opening Notepad with '${filePath}'...` });
        openWindow({
          id: "notepad",
          customData: { filePath },
        });

      // ── CHMOD ───────────────────────────────────────────────────────
      } else if (mainCmd === "chmod") {
        if (args.length < 2) {
          push({ type: "error", text: "Usage: chmod <octal_mode> <file>" });
        } else {
          const mode = parseInt(args[0], 8);
          const resolved = vfs.resolvePath(cwd, args[1]);
          try {
            await vfs.chmod(resolved, mode, currentUser);
            push({ type: "success", text: `Updated permissions on ${resolved}` });
          } catch (err: any) {
            push({ type: "error", text: err.message });
          }
        }

      // ── CHOWN ───────────────────────────────────────────────────────
      } else if (mainCmd === "chown") {
        if (args.length < 2) {
          push({ type: "error", text: "Usage: chown <owner> <file>" });
        } else {
          const owner = args[0] as "guest" | "root";
          const resolved = vfs.resolvePath(cwd, args[1]);
          try {
            await vfs.chown(resolved, owner, currentUser);
            push({ type: "success", text: `Changed owner of ${resolved} to ${owner}` });
          } catch (err: any) {
            push({ type: "error", text: err.message });
          }
        }

      // ── CLEAR / CLS ─────────────────────────────────────────────────
      } else if (mainCmd === "clear" || mainCmd === "cls") {
        setLines([]);
        return;

      // ── DATE / VER ──────────────────────────────────────────────────
      } else if (mainCmd === "date") {
        push({ type: "output", text: new Date().toLocaleString("en-IN") });
      } else if (mainCmd === "ver") {
        push({ type: "output", text: VER_STRING });

      // ── SYSTEMINFO ──────────────────────────────────────────────────
      } else if (mainCmd === "systeminfo") {
        push({ type: "success", text: SYSTEMINFO() });
        unlockMission("terminal-hacker");

      // ── IPCONFIG ────────────────────────────────────────────────────
      } else if (mainCmd === "ipconfig") {
        push({ type: "output", text: IPCONFIG });

      // ── TASKLIST ────────────────────────────────────────────────────
      } else if (mainCmd === "tasklist") {
        const openWindowNames = windows
          .filter((w) => w.isOpen)
          .map((w) => WINDOW_CONFIGS.find((c) => c.id === w.id)?.title ?? w.id);
        const rows = [
          ["System Idle Process", "0"],
          ["System", "4"],
          ["vstr-os.exe", "1024"],
          ["next-server.exe", "2048"],
          ...openWindowNames.map((name, i) => [
            name.replace(/[^a-z0-9]/gi, "") + ".exe",
            String(3000 + i * 128),
          ]),
        ];
        const body = rows
          .map(
            ([n, pid]) =>
              `${n.padEnd(30)}${pid.padStart(6)}   Console                    1    ${Math.floor(
                Math.random() * 50000
              ).toLocaleString()} K`
          )
          .join("\n");
        push({ type: "success", text: TASKLIST_HEADER + "\n" + body });

      // ── TASKKILL ────────────────────────────────────────────────────
      } else if (mainCmd === "taskkill") {
        const flagIdx = args.findIndex((p) => p.toLowerCase() === "/im");
        if (flagIdx !== -1 && args[flagIdx + 1]) {
          push({
            type: "success",
            text: `SUCCESS: Sent termination signal to process "${args[flagIdx + 1]}".`,
          });
        } else {
          push({ type: "error", text: "Usage: taskkill /im <process.exe>" });
        }

      // ── PING ────────────────────────────────────────────────────────
      } else if (mainCmd === "ping") {
        const host = args[0] || "localhost";
        push(
          { type: "output", text: `\nPinging ${host} with 32 bytes of data:` },
          {
            type: "success",
            text: `Reply from 142.250.77.46: bytes=32 time=${Math.floor(Math.random() * 20 + 5)}ms TTL=117`,
          },
          {
            type: "success",
            text: `Reply from 142.250.77.46: bytes=32 time=${Math.floor(Math.random() * 20 + 5)}ms TTL=117`,
          },
          {
            type: "output",
            text: `Ping statistics for ${host}:\n    Packets: Sent = 2, Received = 2, Lost = 0 (0% loss)`,
          }
        );

      // ── WMIC ────────────────────────────────────────────────────────
      } else if (mainCmd === "wmic") {
        push({ type: "output", text: WMIC_OUTPUT });

      // ── MATRIX ──────────────────────────────────────────────────────
      } else if (mainCmd === "matrix") {
        setMatrixMode((v) => !v);
        push({
          type: "success",
          text: matrixMode ? "Matrix rain disabled." : "Matrix rain enabled. 🟩 Wake up, Neo...",
        });

      // ── COLOR ───────────────────────────────────────────────────────
      } else if (mainCmd === "color") {
        const code = args[0] || "0a";
        const colorMap: Record<string, string> = {
          "0a": "#00ff00",
          "0b": "#00ffff",
          "0c": "#ff0000",
          "0e": "#ffff00",
          "0f": "#ffffff",
        };
        const resolved = colorMap[code] ?? code;
        setAccentColor(resolved);
        push({ type: "success", text: `Terminal accent color changed.` });

      // ── NEOFETCH ────────────────────────────────────────────────────
      } else if (mainCmd === "neofetch") {
        const logo = `
   /\\_/\\      ${currentUser}@vstr-os
  ( o.o )     ----------------
   > ^ <      OS: VSTR-OS v2.0.0
  /     \\     Kernel: Next.js 15.3.3 / IndexedDB POSIX VFS
  |  |  |     Shell: PowerShell & Hybrid Bash
  \\__/__/     Uptime: ${Math.floor(performance.now() / 1000)}s
              Storage: IndexedDB Persistent Mount
              User Ring: ${currentUser === "root" ? "Ring 0 (Root)" : "Ring 3 (Guest)"}
              Missions: ${unlockedMissions.length} unlocked 🏆
        `.trim();
        push({ type: "success", text: logo });
        unlockMission("terminal-hacker");

      // ── APP SHORTCUTS ───────────────────────────────────────────────
      } else if (cmdLower === "play flappy") {
        push({ type: "success", text: "Launching Flappy.exe..." });
        openWindow("flappy");
      } else if (cmdLower === "ask hintmaster") {
        push({ type: "success", text: "Summoning HintMaster..." });
        openWindow("hintmaster");
      } else if (cmdLower === "open disk_cleanup" || cmdLower === "disk_cleanup") {
        push({ type: "success", text: "Launching Disk Cleanup.app..." });
        openWindow("disk_cleanup");
      } else if (cmdLower === "start desktop_pet" || cmdLower === "desktop_pet") {
        push({ type: "success", text: "Starting Desktop Pet..." });
        openWindow("desktop_pet");
      } else if (cmdLower === "crack password" || cmdLower === "pwntool") {
        push({ type: "success", text: "Launching PwnTool 3.0..." });
        openWindow("password_cracker");

      // ── BSOD CRASH TRIGGER ──────────────────────────────────────────
      } else if (mainCmd === "blue-screen" || mainCmd === "bsod" || mainCmd === "crash") {
        push({ type: "error", text: "*** STOP: 0x0000007F (UNEXPECTED_KERNEL_MODE_TRAP)" });
        push({ type: "error", text: "*** Routing to interactive kernel debugger..." });
        window.dispatchEvent(new Event("trigger-bsod"));

      // ── GREP / FIND ─────────────────────────────────────────────────
      } else if (mainCmd === "grep" || mainCmd === "findstr" || mainCmd === "find") {
        const pattern = args[0]?.toLowerCase();
        if (!pattern) {
          push({ type: "error", text: "Usage: grep <pattern>" });
        } else {
          try {
            const allFiles = await vfs.readDir(cwd, currentUser);
            const matches: string[] = [];
            for (const file of allFiles) {
              if (file.type === "file") {
                const text = await vfs.readFile(file.path, currentUser);
                if (text.toLowerCase().includes(pattern)) {
                  matches.push(`${file.name}: contains '${pattern}'`);
                }
              }
            }
            if (matches.length === 0) {
              push({ type: "dim", text: `grep: no matches found for '${pattern}' in ${cwd}` });
            } else {
              push({ type: "success", text: matches.join("\n") });
            }
          } catch (err: any) {
            push({ type: "error", text: err.message });
          }
        }

      } else {
        push({
          type: "error",
          text: `'${rawTrimmed}' is not recognized as an internal or external command.\nType "help" to see available commands.`,
        });
      }

      push({ type: "dim", text: "" });
    },
    [
      push,
      openWindow,
      unlockMission,
      unlockedMissions,
      windows,
      cwd,
      currentUser,
      awaitingSudoPass,
      matrixMode,
    ]
  );

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
      const cmds = [
        "help",
        "whoami",
        "ls",
        "dir",
        "cat",
        "cd",
        "pwd",
        "notepad",
        "mkdir",
        "touch",
        "rm",
        "tree",
        "sudo",
        "neofetch",
        "systeminfo",
        "ipconfig",
        "tasklist",
        "ping",
        "ver",
        "wmic",
        "matrix",
        "clear",
        "cls",
        "blue-screen",
      ];
      const match = cmds.find((c) => c.startsWith(input.toLowerCase()));
      if (match) setInput(match);
    }
  };

  const promptPrefix =
    currentUser === "root" ? `PS [ADMIN] ${cwd}>` : `PS ${cwd}>`;

  return (
    <div
      className="terminal-body"
      style={{
        flex: 1,
        minHeight: 0,
        cursor: "text",
        position: "relative",
      }}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Matrix rain overlay */}
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
              background:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,70,0.06) 2px, rgba(0,255,70,0.06) 4px)",
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

      {/* Input row */}
      <div className="terminal-input-row">
        <span className="terminal-prompt" style={{ color: accentColor }}>
          {awaitingSudoPass ? `[sudo] password for ${currentUser}: ` : promptPrefix}
        </span>
        <input
          ref={inputRef}
          id={`terminal-input-${instanceId}`}
          className="terminal-input"
          type={awaitingSudoPass ? "password" : "text"}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
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
