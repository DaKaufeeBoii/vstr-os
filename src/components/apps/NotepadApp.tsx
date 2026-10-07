"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useVFS } from "@/lib/vfs/useVFS";
import { useOSSettings } from "@/store/osSettingsStore";
import { useOS } from "@/store/windowStore";

interface NotepadAppProps {
  instanceId?: string;
  initialFilePath?: string;
}

export default function NotepadApp({
  instanceId,
  initialFilePath = "/home/saitarun/portfolio/README.md",
}: NotepadAppProps) {
  const { readFile, writeFile, readDir, normalizePath, exists, isReady } = useVFS();
  const { setWindowTitle } = useOS();
  const { addNotification } = useOSSettings();

  const [currentPath, setCurrentPath] = useState<string>(initialFilePath);
  const [content, setContent] = useState<string>("");
  const [savedContent, setSavedContent] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [showOpenDialog, setShowOpenDialog] = useState(false);
  const [dialogDir, setDialogDir] = useState("/home/saitarun/portfolio");
  const [dialogItems, setDialogItems] = useState<{ name: string; path: string; type: "file" | "dir" }[]>([]);
  const [saveAsInput, setSaveAsInput] = useState("");
  const [showSaveAsDialog, setShowSaveAsDialog] = useState(false);
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isDirty = content !== savedContent;

  // Load initial file when VFS is ready
  useEffect(() => {
    if (!isReady) return;
    let isCancelled = false;

    readFile(currentPath)
      .then((text) => {
        if (!isCancelled) {
          setContent(text);
          setSavedContent(text);
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          setContent(`# New File\n\n`);
          setSavedContent("");
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [currentPath, isReady, readFile]);

  // Update window title based on file path and dirty state
  useEffect(() => {
    if (!instanceId) return;
    const fileName = currentPath.split("/").pop() || "Untitled";
    const title = `${isDirty ? "*" : ""}${fileName} - Notepad`;
    setWindowTitle(instanceId, title);
  }, [currentPath, isDirty, instanceId, setWindowTitle]);

  // Load directory items for the Open File dialog
  const loadDialogDir = useCallback(
    async (dirPath: string) => {
      try {
        const items = await readDir(dirPath);
        setDialogDir(dirPath);
        setDialogItems(
          items.map((i) => ({
            name: i.name,
            path: i.path,
            type: i.type,
          }))
        );
      } catch (err) {
        console.error("Failed to read dialog directory:", err);
      }
    },
    [readDir]
  );

  useEffect(() => {
    if (showOpenDialog && isReady) {
      loadDialogDir(dialogDir);
    }
  }, [showOpenDialog, dialogDir, isReady, loadDialogDir]);

  // Handle Save
  const handleSave = async () => {
    if (!currentPath) {
      setShowSaveAsDialog(true);
      return;
    }
    setIsSaving(true);
    try {
      await writeFile(currentPath, content);
      setSavedContent(content);
      addNotification("File Saved", `Successfully saved to ${currentPath}`, "💾");
    } catch (err: any) {
      addNotification("Save Failed", err.message || "Failed to save file", "⚠️");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Save As
  const handleSaveAsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!saveAsInput.trim()) return;
    const fullPath = normalizePath(
      saveAsInput.startsWith("/")
        ? saveAsInput
        : `/home/saitarun/portfolio/${saveAsInput.trim()}`
    );
    try {
      await writeFile(fullPath, content);
      setCurrentPath(fullPath);
      setSavedContent(content);
      setShowSaveAsDialog(false);
      addNotification("File Created", `Created and saved ${fullPath}`, "💾");
    } catch (err: any) {
      addNotification("Save Failed", err.message || "Failed to save file", "⚠️");
    }
  };

  const handleCursorMove = () => {
    if (!textareaRef.current) return;
    const text = textareaRef.current.value;
    const selStart = textareaRef.current.selectionStart;
    const lines = text.substring(0, selStart).split("\n");
    const currentLine = lines.length;
    const currentCol = lines[lines.length - 1].length + 1;
    setCursorPos({ line: currentLine, col: currentCol });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        background: "rgba(18, 16, 38, 0.95)",
        color: "#e2e8f0",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        fontSize: "13px",
      }}
    >
      {/* Menu Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "6px 12px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          background: "rgba(255, 255, 255, 0.02)",
        }}
      >
        <button
          onClick={() => {
            setContent("");
            setSavedContent("");
            setCurrentPath("/home/saitarun/portfolio/Untitled.txt");
          }}
          style={menuBtnStyle}
        >
          New
        </button>
        <button
          onClick={() => {
            setShowOpenDialog(true);
            loadDialogDir("/home/saitarun/portfolio");
          }}
          style={menuBtnStyle}
        >
          Open...
        </button>
        <button onClick={handleSave} style={{ ...menuBtnStyle, fontWeight: isDirty ? 600 : 400 }}>
          {isSaving ? "Saving..." : "Save"}
        </button>
        <button
          onClick={() => {
            setSaveAsInput(currentPath);
            setShowSaveAsDialog(true);
          }}
          style={menuBtnStyle}
        >
          Save As...
        </button>
        <div style={{ flex: 1 }} />
        <span
          style={{
            fontSize: "11px",
            color: "var(--os-text-muted)",
            fontFamily: "var(--font-mono)",
            maxWidth: "260px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          title={currentPath}
        >
          {currentPath} {isDirty && "•"}
        </span>
      </div>

      {/* Editor Body */}
      <div style={{ flex: 1, position: "relative" }}>
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            handleCursorMove();
          }}
          onKeyUp={handleCursorMove}
          onClick={handleCursorMove}
          spellCheck={false}
          placeholder="Type here..."
          style={{
            width: "100%",
            height: "100%",
            background: "transparent",
            color: "#f8fafc",
            border: "none",
            outline: "none",
            resize: "none",
            padding: "12px 16px",
            fontFamily: "'JetBrains Mono', 'Consolas', monospace",
            fontSize: "13px",
            lineHeight: "1.6",
            tabSize: 2,
          }}
        />
      </div>

      {/* Status Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "4px 12px",
          background: "rgba(10, 8, 24, 0.7)",
          borderTop: "1px solid rgba(255, 255, 255, 0.06)",
          fontSize: "11px",
          fontFamily: "var(--font-mono)",
          color: "var(--os-text-muted)",
        }}
      >
        <div style={{ display: "flex", gap: "16px" }}>
          <span>
            Ln {cursorPos.line}, Col {cursorPos.col}
          </span>
          <span>{new Blob([content]).size} bytes</span>
        </div>
        <div style={{ display: "flex", gap: "16px" }}>
          <span>100%</span>
          <span>Windows (CRLF)</span>
          <span>UTF-8</span>
        </div>
      </div>

      {/* Open File Dialog Modal */}
      {showOpenDialog && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: "20px",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "420px",
              background: "rgba(24, 20, 50, 0.98)",
              border: "1px solid rgba(168, 85, 247, 0.3)",
              borderRadius: "8px",
              padding: "16px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 600 }}>Open File from VFS</span>
              <button
                onClick={() => setShowOpenDialog(false)}
                style={{ background: "transparent", border: "none", color: "#fff", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            <div style={{ fontSize: "11px", color: "var(--os-text-muted)", fontFamily: "var(--font-mono)" }}>
              Path: {dialogDir}
            </div>

            <div
              style={{
                maxHeight: "220px",
                overflowY: "auto",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "4px",
                padding: "4px",
                background: "rgba(0,0,0,0.2)",
              }}
            >
              {dialogDir !== "/" && (
                <div
                  onClick={() => {
                    const parent = dialogDir.substring(0, dialogDir.lastIndexOf("/")) || "/";
                    loadDialogDir(parent);
                  }}
                  style={fileItemStyle}
                >
                  📁 .. (Up one level)
                </div>
              )}
              {dialogItems.map((item) => (
                <div
                  key={item.path}
                  onClick={() => {
                    if (item.type === "dir") {
                      loadDialogDir(item.path);
                    } else {
                      setCurrentPath(item.path);
                      setShowOpenDialog(false);
                    }
                  }}
                  style={fileItemStyle}
                >
                  {item.type === "dir" ? "📁" : "📄"} {item.name}
                </div>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={() => setShowOpenDialog(false)}
                style={{
                  padding: "6px 14px",
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "none",
                  borderRadius: "4px",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save As Dialog Modal */}
      {showSaveAsDialog && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: "20px",
          }}
        >
          <form
            onSubmit={handleSaveAsSubmit}
            style={{
              width: "100%",
              maxWidth: "400px",
              background: "rgba(24, 20, 50, 0.98)",
              border: "1px solid rgba(168, 85, 247, 0.3)",
              borderRadius: "8px",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <span style={{ fontWeight: 600 }}>Save As</span>
            <input
              type="text"
              value={saveAsInput}
              onChange={(e) => setSaveAsInput(e.target.value)}
              placeholder="e.g. /home/saitarun/portfolio/my_note.txt"
              style={{
                background: "rgba(0, 0, 0, 0.4)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "4px",
                padding: "8px 12px",
                color: "#fff",
                fontFamily: "var(--font-mono)",
                fontSize: "12px",
                outline: "none",
              }}
              autoFocus
            />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
              <button
                type="button"
                onClick={() => setShowSaveAsDialog(false)}
                style={{
                  padding: "6px 12px",
                  background: "transparent",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  borderRadius: "4px",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  padding: "6px 14px",
                  background: "var(--os-amber)",
                  border: "none",
                  borderRadius: "4px",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

const menuBtnStyle: React.CSSProperties = {
  background: "transparent",
  border: "none",
  color: "var(--os-text)",
  cursor: "pointer",
  fontSize: "12px",
  padding: "3px 8px",
  borderRadius: "4px",
  transition: "background 0.15s",
};

const fileItemStyle: React.CSSProperties = {
  padding: "6px 8px",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "12px",
  fontFamily: "var(--font-mono)",
  transition: "background 0.15s",
  userSelect: "none",
};
