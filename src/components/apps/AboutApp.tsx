"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function AboutApp() {
  const [showReal, setShowReal] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Profile row */}
      <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
        {/* Pixel avatar — clickable */}
        <div style={{ flexShrink: 0 }}>
          <motion.div
            style={{
              position: "relative",
              width: 120,
              height: 120,
              borderRadius: 12,
              overflow: "hidden",
              border: "2px solid rgba(0, 212, 255, 0.3)",
              cursor: "pointer",
              boxShadow: "0 0 20px rgba(0,212,255,0.15)",
            }}
            whileHover={{ scale: 1.04, boxShadow: "0 0 28px rgba(0,212,255,0.35)" }}
            onClick={() => setShowReal(true)}
            title="Click to reveal real photo"
          >
            <Image
              src="/pix_image.png"
              alt="Pixel avatar of Sai Tarun"
              fill
              className="pixel-photo"
              style={{ objectFit: "cover" }}
              priority
            />
            {/* Hint overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(0,0,0,0.55)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: 4,
              }}
            >
              <span style={{ fontSize: 22 }}>👁️</span>
              <span style={{ fontSize: 10, color: "var(--os-cyan)", fontFamily: "var(--font-mono)", letterSpacing: "0.06em" }}>
                REVEAL
              </span>
            </motion.div>
          </motion.div>
          <p style={{ fontSize: 10, color: "var(--os-text-dim)", textAlign: "center", marginTop: 6, fontFamily: "var(--font-mono)" }}>
            click to reveal
          </p>
        </div>

        {/* Info */}
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--os-text)", lineHeight: 1.2 }}>
            Sai Tarun Reddy Velagala
          </h2>
          <p style={{ marginTop: 4, fontSize: 13, color: "var(--os-cyan)", fontFamily: "var(--font-mono)" }}>
            CS Undergrad &amp; AI Developer
          </p>

          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { icon: "📍", text: "Hyderabad, Telangana" },
              { icon: "🎓", text: "KG Reddy College of Engineering & Technology" },
              { icon: "📅", text: "Expected Graduation: 2027" },
              { icon: "⭐", text: "CGPA: 8.41 · B.Tech CSE" },
            ].map((item) => (
              <div key={item.text} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 13 }}>{item.icon}</span>
                <span style={{ fontSize: 12, color: "var(--os-text-muted)" }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="glass-card">
        <p className="section-heading">// Professional Summary</p>
        <p style={{ fontSize: 13, color: "var(--os-text-muted)", lineHeight: 1.7 }}>
          Computer Science undergraduate specializing in AI and full-stack development
          with experience building web applications, AI-powered tools, and collaborative
          platforms. Strong background in hackathons, technical leadership, and rapid
          product prototyping. Skilled in developing scalable, user-focused applications
          using modern web technologies and AI integrations.
        </p>
      </div>

      {/* Links */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <a
          href="mailto:saitarunrdy@gmail.com"
          id="about-email-link"
          style={linkStyle}
        >
          <span>📧</span> saitarunrdy@gmail.com
        </a>
        <a
          href="tel:+917043692980"
          id="about-phone-link"
          style={linkStyle}
        >
          <span>📞</span> +91 70436 92980
        </a>
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          id="about-resume-link"
          style={{ ...linkStyle, background: "var(--os-cyan-dim)", borderColor: "rgba(0,212,255,0.3)", color: "var(--os-cyan)" }}
        >
          <span>📄</span> Download Resume
        </a>
      </div>

      {/* Real Photo reveal window */}
      <AnimatePresence>
        {showReal && (
          <motion.div
            className="photo-reveal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowReal(false)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.88, opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              style={{
                position: "relative",
                borderRadius: 16,
                overflow: "hidden",
                border: "2px solid rgba(0,212,255,0.4)",
                boxShadow: "0 0 60px rgba(0,212,255,0.2), 0 40px 100px rgba(0,0,0,0.8)",
                maxWidth: 360,
                width: "85vw",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Simulated window title bar */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 12px",
                  background: "rgba(22,27,34,0.98)",
                  borderBottom: "1px solid var(--os-border)",
                }}
              >
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    onClick={() => setShowReal(false)}
                    style={{ width: 12, height: 12, borderRadius: "50%", background: "var(--os-red)", border: "none", cursor: "pointer" }}
                  />
                  <div style={{ width: 12, height: 12, borderRadius: "50%", background: "var(--os-yellow)" }} />
                  <div style={{ width: 12, height: 12, borderRadius: "50%", background: "var(--os-green)" }} />
                </div>
                <span style={{ flex: 1, textAlign: "center", fontSize: 12, color: "var(--os-text-muted)", fontFamily: "var(--font-mono)" }}>
                  real.png — Photo Viewer
                </span>
                <div style={{ width: 52 }} />
              </div>

              <div style={{ position: "relative", width: "100%", aspectRatio: "3/4" }}>
                <Image
                  src="/real.png"
                  alt="Real photo of Sai Tarun Reddy Velagala"
                  fill
                  style={{ objectFit: "cover" }}
                  priority
                />
              </div>
              <div
                style={{
                  padding: "10px 14px",
                  background: "rgba(13,17,23,0.95)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: 12, color: "var(--os-text-muted)", fontFamily: "var(--font-mono)" }}>
                  Sai Tarun Reddy Velagala
                </span>
                <span style={{ fontSize: 11, color: "var(--os-text-dim)", fontFamily: "var(--font-mono)" }}>
                  real.png · 1.9 MB
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const linkStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "6px 12px",
  borderRadius: 8,
  fontSize: 12,
  fontFamily: "var(--font-mono)",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid var(--os-border)",
  color: "var(--os-text-muted)",
  textDecoration: "none",
  transition: "all 0.15s",
};
