"use client";

import React, { useState, useEffect } from "react";
import { useOSSettings } from "@/store/osSettingsStore";
import { useSound } from "@/utils/useSound";
import type { GuestbookEntry } from "@/app/api/guestbook/route";

export default function GuestbookApp() {
  const { addNotification } = useOSSettings();
  const { playClick } = useSound();

  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<GuestbookEntry | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [role, setRole] = useState<GuestbookEntry["role"]>("Visitor");
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/guestbook")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: GuestbookEntry[]) => {
        if (Array.isArray(data)) {
          setEntries(data);
          if (data.length > 0) setSelectedEntry(data[0]);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg("Please enter your name or handle.");
      return;
    }
    if (!message.trim()) {
      setErrorMsg("Please enter a message.");
      return;
    }

    setSubmitting(true);
    playClick();

    try {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          role,
          message: message.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to post message");
      }

      if (data.entries) {
        setEntries(data.entries);
        setSelectedEntry(data.entry);
      }

      setName("");
      setMessage("");
      addNotification(
        "Guestbook Note Posted",
        `Thanks ${data.entry.name}! Your message is live on VSTR-OS.`,
        "💬"
      );
    } catch (err: any) {
      setErrorMsg(err.message || "Network error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        width: "100%",
        background: "rgba(14, 11, 35, 0.95)",
        color: "#f8fafc",
        fontFamily: "'Segoe UI Variable', 'Segoe UI', system-ui, sans-serif",
        fontSize: "13px",
      }}
    >
      {/* Left Column: Message Feed */}
      <div
        style={{
          width: "280px",
          borderRight: "1px solid rgba(255, 255, 255, 0.08)",
          display: "flex",
          flexDirection: "column",
          background: "rgba(0, 0, 0, 0.2)",
        }}
      >
        <div
          style={{
            padding: "14px 16px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontWeight: 600, fontSize: "14px" }}>Visitor Wall</span>
          <span
            style={{
              fontSize: "11px",
              color: "var(--os-amber)",
              background: "rgba(233, 69, 96, 0.15)",
              padding: "2px 8px",
              borderRadius: "10px",
            }}
          >
            {entries.length} notes
          </span>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "8px" }}>
          {loading ? (
            <div style={{ padding: "20px", textAlign: "center", color: "var(--os-text-muted)" }}>
              Loading messages...
            </div>
          ) : entries.length === 0 ? (
            <div style={{ padding: "20px", textAlign: "center", color: "var(--os-text-muted)" }}>
              No messages yet. Be the first to leave one!
            </div>
          ) : (
            entries.map((item) => {
              const isSelected = selectedEntry?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    playClick();
                    setSelectedEntry(item);
                  }}
                  style={{
                    padding: "10px 12px",
                    borderRadius: "8px",
                    marginBottom: "6px",
                    cursor: "pointer",
                    background: isSelected
                      ? "rgba(168, 85, 247, 0.2)"
                      : "rgba(255, 255, 255, 0.03)",
                    border: isSelected
                      ? "1px solid var(--os-amber)"
                      : "1px solid transparent",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <div
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        background: item.avatarColor,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "11px",
                        fontWeight: 700,
                        color: "#fff",
                      }}
                    >
                      {item.name.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ fontWeight: 600, fontSize: "12px" }}>{item.name}</span>
                    <span
                      style={{
                        fontSize: "9px",
                        padding: "1px 5px",
                        borderRadius: "4px",
                        background: "rgba(255, 255, 255, 0.08)",
                        color: "var(--os-text-muted)",
                        marginLeft: "auto",
                      }}
                    >
                      {item.role}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#94a3b8",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.message}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right Column: Message Detail & Composition Form */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "transparent" }}>
        {/* Selected Message Preview */}
        <div
          style={{
            padding: "20px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            flex: 1,
            overflowY: "auto",
          }}
        >
          {selectedEntry ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: selectedEntry.avatarColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "16px",
                    fontWeight: 700,
                    color: "#fff",
                  }}
                >
                  {selectedEntry.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: "15px", fontWeight: 600 }}>{selectedEntry.name}</div>
                  <div style={{ fontSize: "11px", color: "var(--os-text-muted)" }}>
                    {selectedEntry.role} • {selectedEntry.timestamp}
                  </div>
                </div>
              </div>

              <div
                style={{
                  background: "rgba(0, 0, 0, 0.25)",
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                  borderRadius: "10px",
                  padding: "16px",
                  fontSize: "13px",
                  lineHeight: 1.6,
                  color: "#e2e8f0",
                }}
              >
                {selectedEntry.message}
              </div>
            </div>
          ) : (
            <div style={{ color: "var(--os-text-muted)", textAlign: "center", marginTop: "40px" }}>
              Select a message on the left or write a new one below.
            </div>
          )}
        </div>

        {/* Compose Form */}
        <form
          onSubmit={handleSubmit}
          style={{
            padding: "16px 20px",
            background: "rgba(0, 0, 0, 0.35)",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--os-amber)" }}>
            Leave a Message / Feedback
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name / Handle"
              maxLength={40}
              style={{
                flex: 1,
                background: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: "6px",
                padding: "8px 12px",
                color: "#fff",
                fontSize: "12px",
                outline: "none",
              }}
            />

            <select
              value={role}
              onChange={(e) => setRole(e.target.value as GuestbookEntry["role"])}
              style={{
                background: "rgba(25, 20, 50, 0.9)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: "6px",
                padding: "8px 10px",
                color: "#fff",
                fontSize: "12px",
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="Visitor">Visitor</option>
              <option value="Recruiter">Recruiter</option>
              <option value="Engineer">Engineer</option>
              <option value="Designer">Designer</option>
            </select>
          </div>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write a message, opportunity, or feedback (max 280 chars)..."
            maxLength={280}
            rows={3}
            style={{
              background: "rgba(255, 255, 255, 0.06)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: "6px",
              padding: "8px 12px",
              color: "#fff",
              fontSize: "12px",
              outline: "none",
              resize: "none",
              lineHeight: 1.5,
            }}
          />

          {errorMsg && (
            <div style={{ fontSize: "11px", color: "#ef4444" }}>{errorMsg}</div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "11px", color: "var(--os-text-muted)" }}>
              {280 - message.length} characters left
            </span>

            <button
              type="submit"
              disabled={submitting}
              style={{
                padding: "6px 16px",
                background: "var(--os-amber)",
                border: "none",
                borderRadius: "6px",
                color: "#fff",
                fontWeight: 600,
                fontSize: "12px",
                cursor: submitting ? "not-allowed" : "pointer",
                opacity: submitting ? 0.6 : 1,
                transition: "opacity 0.15s",
              }}
            >
              {submitting ? "Posting..." : "Post Message 🚀"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
