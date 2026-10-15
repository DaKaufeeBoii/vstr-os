"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useOSSettings } from "@/store/osSettingsStore";
import { useSound } from "@/utils/useSound";
import { Send } from "lucide-react";
import type { GuestbookEntry } from "@/lib/guestbook/store";

export default function GuestbookApp() {
  const { addNotification } = useOSSettings();
  const { playClick } = useSound();

  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [postedMessage, setPostedMessage] = useState<string | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<GuestbookEntry | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [role, setRole] = useState<GuestbookEntry["role"]>("Visitor");
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadEntries = useCallback(async () => {
    try {
      const res = await fetch("/api/guestbook", { cache: "no-store" });
      if (!res.ok) throw new Error("The visitor wall could not be reached. Try again in a moment.");
      const data = await res.json() as GuestbookEntry[] | { entries?: GuestbookEntry[] };
      {
        const list = Array.isArray(data) ? data : data?.entries ?? [];
        setEntries(list);
        setSelectedEntry((current) => list.find((entry) => entry.id === current?.id) ?? list[0] ?? null);
      }
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "The visitor wall could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const request = window.setTimeout(() => { void loadEntries(); }, 0);
    return () => window.clearTimeout(request);
  }, [loadEntries]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setPostedMessage(null);

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
        throw new Error(data?.error || "Failed to post message");
      }

      if (Array.isArray(data?.entries)) {
        setEntries(data.entries);
        setSelectedEntry(data.entry ?? data.entries[0] ?? null);
      }

      setPostedMessage(`Your note is live. Thanks, ${data?.entry?.name ?? name.trim()}!`);
      setName("");
      setMessage("");
      addNotification(
        "Guestbook Note Posted",
        `Thanks ${data?.entry?.name ?? name.trim()}! Your message is live on VSTR-OS.`,
        "guestbook"
      );
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Network error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="guestbook-app-container"
    >
      {/* Left Column: Message Feed */}
      <div
        className="guestbook-app-sidebar"
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
              <span role="status">Loading the visitor wall…</span>
            </div>
          ) : loadError ? (
            <div style={{ padding: "20px", textAlign: "center", color: "var(--os-text-muted)" }}>
              <p role="alert" style={{ marginBottom: 12 }}>{loadError}</p>
              <button type="button" onClick={() => { setLoading(true); setLoadError(null); void loadEntries(); }} style={smallActionStyle}>Try again</button>
            </div>
          ) : entries.length === 0 ? (
            <div style={{ padding: "24px 18px", textAlign: "center", color: "var(--os-text-muted)" }}>
              <div aria-hidden="true" style={{ fontSize: 28, marginBottom: 10 }}>✳</div>
              <strong style={{ display: "block", color: "#f8fafc", marginBottom: 6 }}>A blank page, for now.</strong>
              <span>Leave the first note for the next person who visits.</span>
            </div>
          ) : (
            entries.map((item) => {
              const isSelected = selectedEntry?.id === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={isSelected}
                  aria-label={`Read message from ${item.name}, ${item.role}`}
                  onClick={() => {
                    playClick();
                    setSelectedEntry(item);
                  }}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    font: "inherit",
                    color: "inherit",
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
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Right Column: Message Detail & Composition Form */}
      <div className="guestbook-app-main">
        {/* Selected Message Preview */}
        <div
          style={{
            padding: "20px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            flex: 1,
            overflowY: "auto",
          }}
        >
          {postedMessage && <div role="status" style={{ padding: "9px 12px", marginBottom: 12, borderRadius: 8, border: "1px solid rgba(34,197,94,.25)", background: "rgba(34,197,94,.08)", color: "#86efac", fontSize: 12 }}>{postedMessage}</div>}
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
              {entries.length === 0 ? "Your note will start the conversation." : "Choose a note from the wall to read it here."}
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
          <div>
            <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--os-amber)" }}>
              Add a note to the wall
            </div>
            <div style={{ marginTop: 4, color: "var(--os-text-muted)", fontSize: 10 }}>A hello, a thought about the work, or an opportunity—all welcome.</div>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <input
              aria-label="Your name or handle"
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
              aria-label="Your role"
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
            aria-label="Your message"
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
            <div role="alert" style={{ fontSize: "11px", color: "#fca5a5" }}>{errorMsg}</div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "11px", color: "var(--os-text-muted)" }}>
              {message.length}/280
            </span>

            <button
              type="submit"
              disabled={submitting || loading || !!loadError}
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
              {submitting ? "Posting..." : (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <Send size={13} /> Post Message
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const smallActionStyle: React.CSSProperties = {
  minHeight: 34,
  padding: "0 12px",
  color: "var(--os-text)",
  background: "rgba(255,255,255,.06)",
  border: "1px solid rgba(255,255,255,.14)",
  borderRadius: 7,
  cursor: "pointer",
};
