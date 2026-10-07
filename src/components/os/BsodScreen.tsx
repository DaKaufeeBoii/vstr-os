"use client";

import React, { useState, useEffect, useRef } from "react";
import { useOSSettings } from "@/store/osSettingsStore";

interface BsodScreenProps {
  onClose: () => void;
  errorInfo?: string;
}

export default function BsodScreen({ onClose, errorInfo }: BsodScreenProps) {
  const { unlockMission, addNotification } = useOSSettings();
  const [progress, setProgress] = useState(0);
  const [input, setInput] = useState("");
  const [logs, setLogs] = useState<string[]>([
    "Kernel Debugger connected via WebAssembly Loopback.",
    "Symbol search path: srv*https://msdl.microsoft.com/download/symbols",
    'Type "help" or "!analyze -v" to inspect the crash dump.',
  ]);
  const [isPatched, setIsPatched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Animate error info dump collection percentage
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(timer);
          return 100;
        }
        return p + Math.floor(Math.random() * 20 + 10);
      });
    }, 400);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    const raw = input.trim();
    if (!raw) return;

    setInput("");
    const newLogs = [...logs, `kd> ${raw}`];

    if (cmd === "help") {
      newLogs.push(
        "Available Kernel Debugger Commands:",
        "  !analyze -v    — perform verbose bugcheck triage & fault analysis",
        "  r              — dump 64-bit general purpose registers",
        "  kv             — display stack backtrace with frame pointers",
        "  dmesg          — view recent kernel ring buffer messages",
        "  patch          — hotpatch corrupt memory sector (0xDEADBEEF)",
        "  reboot         — restart the operating system",
        "  reboot -safe   — restart in safe mode with minimal graphics",
        "  exit           — exit kernel debugger and restart shell"
      );
    } else if (cmd === "!analyze -v" || cmd === "analyze") {
      newLogs.push(
        "*******************************************************************************",
        "*                                                                             *",
        "*                        BUGCHECK_ANALYSIS                                    *",
        "*                                                                             *",
        "*******************************************************************************",
        "DEFAULT_BUCKET_ID:  WIN11_CRITICAL_CORRUPTION",
        "BUGCHECK_CODE:      0x00000109",
        "BUGCHECK_P1:        0xffffd00020003000 (Corrupt Inode Pointer)",
        "BUGCHECK_P2:        0x0000000000000000",
        "BUGCHECK_P3:        0x00000000deadbeef (Faulting physical offset)",
        "BUGCHECK_P4:        0x0000000000000001",
        "FAULTING_MODULE:    vstr_vfs_drv.sys",
        "PROCESS_NAME:       vstr-os.exe",
        "FAILURE_BUCKET_ID:  0x109_vstr_vfs_drv!VfsCommitTransaction",
        "",
        "PRIMARY_PROBLEM_CLASS: MEMORY_CORRUPTION_STRIDE",
        "RECOMMENDATION: Run 'patch' to restore corrupted memory at 0xDEADBEEF."
      );
    } else if (cmd === "r") {
      newLogs.push(
        "rax=0000000000000000 rbx=ffffd00020003000 rcx=00000000deadbeef",
        "rdx=0000000000000001 rsi=ffffd00020003880 rdi=0000000000000000",
        "rip=fffff80041203042 rsp=ffffd00020003fd0 rbp=ffffd00020004010",
        "r8 =0000000000000004 r9 =ffffd00020003800 r10=0000000000000000",
        "r11=0000000000000246 r12=0000000000000000 r13=ffffffffffffffff",
        "cs=0010  ss=0018  ds=002b  es=002b  fs=0053  gs=002b  efl=00000246"
      );
    } else if (cmd === "kv") {
      newLogs.push(
        " # Child-SP          RetAddr           Call Site",
        "00 ffffd000`20003fd0 fffff800`41203410 nt!KiSystemFatalException+0x12",
        "01 ffffd000`20004010 fffff800`41289120 vstr_vfs_drv!VfsCommitTransaction+0x9a",
        "02 ffffd000`200040a0 fffff800`41289940 vstr_kernel!TrapHandler+0x44",
        "03 ffffd000`20004120 fffff800`41201080 nt!KiInterruptDispatch+0x28"
      );
    } else if (cmd === "dmesg") {
      newLogs.push(
        "[    0.000000] Linux/NT hybrid kernel v2.0-vstr initialized",
        "[    0.002410] VFS: IndexedDB storage engine mounted at /",
        "[    0.142091] ACPI: Virtual Hardware abstraction verified",
        "[    1.420110] Memory fault trap at address 0xDEADBEEF in transaction buffer",
        "[    1.420120] Kernel panic - not syncing: Fatal system exception"
      );
    } else if (cmd === "patch") {
      setIsPatched(true);
      newLogs.push(
        "[HOTFIX] Applying live memory hotpatch to offset 0xDEADBEEF...",
        "[HOTFIX] Verifying kernel inode structures... OK",
        "[HOTFIX] CRC32 verification passed: 0x9B2A41C0",
        "SUCCESS: Faulting module vstr_vfs_drv.sys repaired! System can now reboot safely."
      );
      unlockMission("kernel-surgeon");
    } else if (cmd === "reboot" || cmd === "restart" || cmd === "exit") {
      newLogs.push("Restarting VSTR-OS...");
      addNotification("System Recovered", "Kernel debugger repaired crash state.", "🩺");
      setTimeout(onClose, 800);
    } else if (cmd === "reboot -safe") {
      newLogs.push("Restarting in Safe Mode (Minimal drivers)...");
      addNotification("Safe Mode Boot", "OS restarted with minimal diagnostics.", "🛡️");
      setTimeout(onClose, 800);
    } else {
      newLogs.push(
        `kd: '${raw}': unrecognized command. Type 'help' for command list or 'reboot' to restart.`
      );
    }

    setLogs(newLogs);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999999,
        background: "#0078d7",
        color: "#ffffff",
        display: "flex",
        flexDirection: "column",
        padding: "48px 64px",
        fontFamily: "'Segoe UI Variable', 'Segoe UI', system-ui, sans-serif",
        overflowY: "auto",
        userSelect: "none",
      }}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Blue Screen Header */}
      <div style={{ fontSize: "110px", lineHeight: 1, marginBottom: "20px" }}>:(</div>

      <h1
        style={{
          fontSize: "26px",
          fontWeight: 400,
          maxWidth: "840px",
          lineHeight: 1.4,
          marginBottom: "24px",
        }}
      >
        Your PC ran into a problem and needs to restart. We're just collecting some error info,
        and then you can inspect or reboot the kernel.
      </h1>

      <div style={{ fontSize: "18px", fontWeight: 500, marginBottom: "32px" }}>
        {progress}% complete
      </div>

      <div style={{ display: "flex", gap: "28px", alignItems: "center", marginBottom: "32px" }}>
        {/* Fake QR code representation */}
        <div
          style={{
            width: "90px",
            height: "90px",
            background: "#ffffff",
            padding: "8px",
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gap: "2px",
          }}
        >
          {Array.from({ length: 36 }).map((_, i) => (
            <div
              key={i}
              style={{
                background: (i * 17) % 3 === 0 ? "#0078d7" : "#000",
                borderRadius: "1px",
              }}
            />
          ))}
        </div>

        <div style={{ fontSize: "14px", lineHeight: 1.6, opacity: 0.95 }}>
          <div>
            For more information about this issue and possible fixes, visit{" "}
            <span style={{ textDecoration: "underline" }}>https://vstr-os.dev/stopcode</span>
          </div>
          <div style={{ marginTop: "6px" }}>
            Stop code:{" "}
            <span style={{ fontFamily: "monospace", fontWeight: 700 }}>
              CRITICAL_STRUCTURE_CORRUPTION
            </span>
          </div>
          <div>
            What failed:{" "}
            <span style={{ fontFamily: "monospace", fontWeight: 700 }}>
              vstr_vfs_drv.sys
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Kernel Debugger Console (WinDbg Style) */}
      <div
        style={{
          marginTop: "16px",
          maxWidth: "860px",
          background: "rgba(0, 20, 60, 0.92)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          borderRadius: "8px",
          boxShadow: "0 12px 40px rgba(0, 0, 0, 0.5)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
        onClick={(e) => {
          e.stopPropagation();
          inputRef.current?.focus();
        }}
      >
        {/* Console Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "8px 14px",
            background: "rgba(255, 255, 255, 0.08)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            fontSize: "12px",
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          <span>WinDbg (x64) • Kernel Debugger Console</span>
          <span style={{ color: isPatched ? "#4ade80" : "#facc15" }}>
            Status: {isPatched ? "PATCHED" : "FAULTED"}
          </span>
        </div>

        {/* Console Log Area */}
        <div
          style={{
            padding: "12px 14px",
            maxHeight: "260px",
            overflowY: "auto",
            fontFamily: "'JetBrains Mono', Consolas, monospace",
            fontSize: "12px",
            lineHeight: 1.5,
            color: "#e0f2fe",
            display: "flex",
            flexDirection: "column",
            gap: "2px",
          }}
        >
          {logs.map((log, i) => (
            <div
              key={i}
              style={{
                whiteSpace: "pre-wrap",
                color: log.startsWith("kd>")
                  ? "#38bdf8"
                  : log.startsWith("[HOTFIX]") || log.startsWith("SUCCESS")
                  ? "#4ade80"
                  : log.startsWith("BUGCHECK") || log.startsWith("FAULTING")
                  ? "#f87171"
                  : "#e0f2fe",
              }}
            >
              {log}
            </div>
          ))}
          <div ref={scrollRef} />
        </div>

        {/* Input Prompt */}
        <form
          onSubmit={handleCommand}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 14px",
            background: "rgba(0, 0, 0, 0.4)",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "12px",
              color: "#38bdf8",
              fontWeight: 700,
            }}
          >
            kd&gt;
          </span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type '!analyze -v', 'patch', 'reboot'..."
            autoFocus
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#ffffff",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "12px",
            }}
          />
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "rgba(255, 255, 255, 0.15)",
              border: "none",
              color: "#ffffff",
              padding: "3px 10px",
              borderRadius: "4px",
              fontSize: "11px",
              cursor: "pointer",
            }}
          >
            Force Reboot
          </button>
        </form>
      </div>
    </div>
  );
}
