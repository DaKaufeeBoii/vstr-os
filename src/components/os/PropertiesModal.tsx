"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { OsIcon } from "@/components/icons/OsIcon";
import { useSound } from "@/utils/useSound";

export interface PropertiesItemInfo {
  id: string;
  title: string;
  type?: string;
  icon?: string;
  fluentIcon?: string;
  location?: string;
  size?: string;
  sizeOnDisk?: string;
  created?: string;
  modified?: string;
  description?: string;
  isSystem?: boolean;
}

interface PropertiesModalProps {
  item: PropertiesItemInfo | null;
  onClose: () => void;
}

export default function PropertiesModal({ item, onClose }: PropertiesModalProps) {
  const [activeTab, setActiveTab] = useState<"general" | "details">("general");
  const { playClick } = useSound();

  if (!item) return null;

  const handleClose = () => {
    playClick();
    onClose();
  };

  const fileType = item.type || (item.title.endsWith(".sys") ? "System Component (.sys)" : item.title.endsWith(".txt") ? "Text Document (.txt)" : item.title.endsWith(".log") ? "Log File (.log)" : item.title.endsWith("/") ? "File Folder" : "Application (.app)");
  const location = item.location || (item.isSystem ? "C:\\VSTR-OS\\SystemApps" : "C:\\Users\\saitarun\\Desktop");
  const size = item.size || "1.84 MB (1,929,376 bytes)";
  const sizeOnDisk = item.sizeOnDisk || "1.88 MB (1,970,176 bytes)";
  const createdDate = item.created || "Tuesday, October 06, 2026, 10:00:00 AM";
  const modifiedDate = item.modified || "Today, Just now";

  return (
    <AnimatePresence>
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 999999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(0, 0, 0, 0.45)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
        }}
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 10 }}
          transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "min(380px, 94vw)",
            background: "rgba(24, 28, 36, 0.97)",
            backdropFilter: "blur(32px) saturate(180%)",
            WebkitBackdropFilter: "blur(32px) saturate(180%)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            borderRadius: 14,
            boxShadow: "0 16px 48px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(255, 255, 255, 0.05)",
            overflow: "hidden",
            color: "#f8fafc",
            fontFamily: "'Segoe UI Variable', 'Segoe UI', system-ui, sans-serif",
            display: "flex",
            flexDirection: "column",
          }}
          role="dialog"
          aria-labelledby="properties-title"
        >
          {/* Title Bar */}
          <div
            style={{
              padding: "10px 14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
              background: "rgba(255, 255, 255, 0.03)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600 }}>
              <span style={{ display: "inline-flex", width: 16, height: 16 }}>
                <OsIcon name={item.fluentIcon || "info"} size="sm" />
              </span>
              <span id="properties-title" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 280 }}>
                {item.title} Properties
              </span>
            </div>
            <button
              onClick={handleClose}
              style={{
                background: "transparent",
                border: "none",
                color: "rgba(255, 255, 255, 0.7)",
                fontSize: 14,
                cursor: "pointer",
                padding: "4px 8px",
                borderRadius: 4,
                lineHeight: 1,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#e81123";
                e.currentTarget.style.color = "#ffffff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)";
              }}
              title="Close"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {/* Tab Navigation */}
          <div
            style={{
              display: "flex",
              borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
              padding: "0 12px",
              gap: 4,
              background: "rgba(0, 0, 0, 0.15)",
            }}
          >
            {(["general", "details"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  playClick();
                  setActiveTab(tab);
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  borderBottom: activeTab === tab ? "2px solid var(--os-amber)" : "2px solid transparent",
                  color: activeTab === tab ? "#ffffff" : "rgba(255, 255, 255, 0.6)",
                  padding: "8px 14px",
                  fontSize: 12,
                  fontWeight: activeTab === tab ? 600 : 400,
                  cursor: "pointer",
                  textTransform: "capitalize",
                  transition: "all 0.15s",
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div style={{ padding: "16px", minHeight: 280, fontSize: 12, display: "flex", flexDirection: "column", gap: 14 }}>
            {activeTab === "general" ? (
              <>
                {/* Header Icon + Name */}
                <div style={{ display: "flex", alignItems: "center", gap: 14, paddingBottom: 12, borderBottom: "1px solid rgba(255, 255, 255, 0.06)" }}>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 8,
                      background: "rgba(255, 255, 255, 0.05)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    {item.fluentIcon ? (
                      <OsIcon name={item.fluentIcon} size="md" />
                    ) : (
                      <span style={{ fontSize: 24 }}>{item.icon || "📄"}</span>
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <input
                      type="text"
                      readOnly
                      value={item.title}
                      style={{
                        width: "100%",
                        background: "rgba(255, 255, 255, 0.04)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: 4,
                        padding: "4px 8px",
                        color: "#ffffff",
                        fontSize: 13,
                        fontWeight: 600,
                        outline: "none",
                      }}
                    />
                    <div style={{ fontSize: 11, color: "rgba(255, 255, 255, 0.5)", marginTop: 4 }}>
                      {item.description || "VSTR-OS Native System Object"}
                    </div>
                  </div>
                </div>

                {/* Properties Table */}
                <div style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: "8px 12px", alignItems: "baseline", lineHeight: 1.5 }}>
                  <span style={{ color: "rgba(255, 255, 255, 0.5)" }}>Type of file:</span>
                  <span style={{ fontWeight: 500 }}>{fileType}</span>

                  <span style={{ color: "rgba(255, 255, 255, 0.5)" }}>Opens with:</span>
                  <span style={{ color: "var(--os-amber)" }}>VSTR-OS Shell v2.0</span>

                  <div style={{ gridColumn: "1 / -1", height: 1, background: "rgba(255, 255, 255, 0.06)", margin: "4px 0" }} />

                  <span style={{ color: "rgba(255, 255, 255, 0.5)" }}>Location:</span>
                  <span style={{ wordBreak: "break-all", fontFamily: "var(--font-mono)", fontSize: 11 }}>{location}</span>

                  <span style={{ color: "rgba(255, 255, 255, 0.5)" }}>Size:</span>
                  <span>{size}</span>

                  <span style={{ color: "rgba(255, 255, 255, 0.5)" }}>Size on disk:</span>
                  <span>{sizeOnDisk}</span>

                  <div style={{ gridColumn: "1 / -1", height: 1, background: "rgba(255, 255, 255, 0.06)", margin: "4px 0" }} />

                  <span style={{ color: "rgba(255, 255, 255, 0.5)" }}>Created:</span>
                  <span style={{ fontSize: 11 }}>{createdDate}</span>

                  <span style={{ color: "rgba(255, 255, 255, 0.5)" }}>Modified:</span>
                  <span style={{ fontSize: 11 }}>{modifiedDate}</span>

                  <div style={{ gridColumn: "1 / -1", height: 1, background: "rgba(255, 255, 255, 0.06)", margin: "4px 0" }} />

                  <span style={{ color: "rgba(255, 255, 255, 0.5)" }}>Attributes:</span>
                  <div style={{ display: "flex", gap: 12 }}>
                    <label style={{ display: "flex", alignItems: "center", gap: 5, cursor: "default" }}>
                      <input type="checkbox" checked readOnly style={{ accentColor: "var(--os-amber)" }} />
                      <span>Read-only</span>
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: 5, cursor: "default" }}>
                      <input type="checkbox" checked={item.isSystem} readOnly style={{ accentColor: "var(--os-amber)" }} />
                      <span>System</span>
                    </label>
                  </div>
                </div>
              </>
            ) : (
              /* Details Tab */
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ padding: "8px 12px", background: "rgba(255, 255, 255, 0.03)", borderRadius: 6, border: "1px solid rgba(255, 255, 255, 0.06)" }}>
                  <div style={{ color: "var(--os-amber)", fontWeight: 600, marginBottom: 4 }}>Product Information</div>
                  <div style={{ display: "grid", gridTemplateColumns: "110px 1fr", gap: "6px 8px", fontSize: 11 }}>
                    <span style={{ color: "rgba(255, 255, 255, 0.5)" }}>Product Name:</span>
                    <span>VSTR-OS Operating System</span>
                    <span style={{ color: "rgba(255, 255, 255, 0.5)" }}>Product Version:</span>
                    <span>2.0.0 (Windows 11 Mica Edition)</span>
                    <span style={{ color: "rgba(255, 255, 255, 0.5)" }}>Author:</span>
                    <span>Sai Tarun Reddy Velagala</span>
                    <span style={{ color: "rgba(255, 255, 255, 0.5)" }}>Architecture:</span>
                    <span>TypeScript / React 19 / Next.js</span>
                    <span style={{ color: "rgba(255, 255, 255, 0.5)" }}>File System:</span>
                    <span>IndexedDB Persistent VFS</span>
                  </div>
                </div>

                <div style={{ padding: "8px 12px", background: "rgba(255, 255, 255, 0.03)", borderRadius: 6, border: "1px solid rgba(255, 255, 255, 0.06)" }}>
                  <div style={{ color: "var(--os-amber)", fontWeight: 600, marginBottom: 4 }}>Security & Permissions</div>
                  <div style={{ display: "grid", gridTemplateColumns: "110px 1fr", gap: "6px 8px", fontSize: 11 }}>
                    <span style={{ color: "rgba(255, 255, 255, 0.5)" }}>Owner:</span>
                    <span>saitarun (Developer / Admin)</span>
                    <span style={{ color: "rgba(255, 255, 255, 0.5)" }}>Permissions:</span>
                    <span>Full Control (rwxr-xr-x)</span>
                    <span style={{ color: "rgba(255, 255, 255, 0.5)" }}>Status:</span>
                    <span style={{ color: "var(--os-jade)" }}>Verified & Secure</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Buttons */}
          <div
            style={{
              padding: "10px 14px",
              borderTop: "1px solid rgba(255, 255, 255, 0.08)",
              background: "rgba(0, 0, 0, 0.2)",
              display: "flex",
              justifyContent: "flex-end",
              gap: 8,
            }}
          >
            <button
              onClick={handleClose}
              style={{
                padding: "6px 20px",
                borderRadius: 4,
                background: "var(--os-amber)",
                border: "none",
                color: "#080c10",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                transition: "opacity 0.15s",
              }}
            >
              OK
            </button>
            <button
              onClick={handleClose}
              style={{
                padding: "6px 16px",
                borderRadius: 4,
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                color: "#ffffff",
                fontSize: 12,
                cursor: "pointer",
                transition: "background 0.15s",
              }}
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
