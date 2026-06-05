"use client";

import React from "react";
import { motion } from "framer-motion";

const CONTACTS = [
  {
    icon: "📧",
    label: "Email",
    value: "saitarunrdy@gmail.com",
    href: "mailto:saitarunrdy@gmail.com",
    color: "var(--os-cyan)",
    bg: "var(--os-cyan-dim)",
    border: "rgba(0,212,255,0.25)",
  },
  {
    icon: "📞",
    label: "Phone",
    value: "+91 7043692980",
    href: "tel:+917043692980",
    color: "var(--os-green)",
    bg: "var(--os-green-dim)",
    border: "rgba(16,185,129,0.25)",
  },
  {
    icon: "🔗",
    label: "LinkedIn",
    value: "linkedin.com/in/sai-tarun-reddy",
    href: "https://linkedin.com/in/sai-tarun-reddy",
    color: "#a78bfa",
    bg: "var(--os-purple-dim)",
    border: "rgba(124,58,237,0.3)",
  },
  {
    icon: "🐙",
    label: "GitHub",
    value: "github.com/saitarun",
    href: "https://github.com/saitarun",
    color: "var(--os-text-muted)",
    bg: "rgba(255,255,255,0.04)",
    border: "var(--os-border)",
  },
];

export default function ContactApp() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div className="glass-card" style={{ textAlign: "center", background: "linear-gradient(135deg, rgba(124,58,237,0.1), rgba(0,212,255,0.08))" }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>👋</div>
        <p style={{ fontSize: 15, fontWeight: 600, color: "var(--os-text)" }}>
          Let&apos;s Connect
        </p>
        <p style={{ fontSize: 12, color: "var(--os-text-muted)", marginTop: 6, lineHeight: 1.6 }}>
          Open to collaborations, internships, and interesting conversations.
        </p>
      </div>

      {/* Contact items */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {CONTACTS.map((c, i) => (
          <motion.a
            key={c.label}
            id={`contact-${c.label.toLowerCase()}`}
            href={c.href}
            target={c.href.startsWith("http") ? "_blank" : undefined}
            rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ scale: 1.02, x: 4 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "12px 16px",
              borderRadius: 10,
              background: c.bg,
              border: `1px solid ${c.border}`,
              textDecoration: "none",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            <span style={{ fontSize: 22 }}>{c.icon}</span>
            <div>
              <p style={{ fontSize: 10, color: "var(--os-text-dim)", fontFamily: "var(--font-mono)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                {c.label}
              </p>
              <p style={{ fontSize: 13, color: c.color, fontFamily: "var(--font-mono)", marginTop: 2 }}>
                {c.value}
              </p>
            </div>
            <span style={{ marginLeft: "auto", fontSize: 14, color: c.color, opacity: 0.6 }}>→</span>
          </motion.a>
        ))}
      </div>

      {/* Download resume */}
      <motion.a
        href="/resume.pdf"
        target="_blank"
        rel="noopener noreferrer"
        id="contact-resume-download"
        whileHover={{ scale: 1.02 }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          padding: "12px",
          borderRadius: 10,
          background: "linear-gradient(135deg, rgba(0,212,255,0.15), rgba(124,58,237,0.15))",
          border: "1px solid rgba(0,212,255,0.3)",
          textDecoration: "none",
          color: "var(--os-cyan)",
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        <span>📄</span> Download Resume (PDF)
      </motion.a>
    </div>
  );
}
