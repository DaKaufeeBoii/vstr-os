"use client";

import React from "react";
import { motion } from "framer-motion";
import { experiences } from "@/data/experience";

const TYPE_COLORS = {
  leadership: { bg: "var(--os-cyan-dim)", border: "rgba(0,212,255,0.25)", text: "var(--os-cyan)", dot: "var(--os-cyan)" },
  internship: { bg: "var(--os-purple-dim)", border: "rgba(124,58,237,0.3)", text: "#a78bfa", dot: "#a78bfa" },
};

export default function ExperienceApp() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <p className="section-heading">// Experience &amp; Leadership</p>
      <div style={{ position: "relative", paddingLeft: 24 }}>
        {/* Timeline line */}
        <div
          style={{
            position: "absolute",
            left: 7,
            top: 8,
            bottom: 8,
            width: 2,
            background: "linear-gradient(to bottom, var(--os-cyan), var(--os-purple))",
            borderRadius: 1,
            opacity: 0.3,
          }}
        />

        {experiences.map((exp, i) => {
          const colors = TYPE_COLORS[exp.type];
          return (
            <motion.div
              key={exp.title}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1, duration: 0.35 }}
              style={{ position: "relative", marginBottom: i < experiences.length - 1 ? 20 : 0 }}
            >
              {/* Dot */}
              <div
                style={{
                  position: "absolute",
                  left: -20,
                  top: 14,
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: colors.dot,
                  boxShadow: `0 0 8px ${colors.dot}`,
                }}
              />

              <div
                className="glass-card"
                style={{
                  borderColor: colors.border,
                  background: colors.bg,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 6 }}>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "var(--os-text)" }}>
                      {exp.title}
                    </p>
                    <p style={{ fontSize: 12, color: colors.text, marginTop: 2, fontFamily: "var(--font-mono)" }}>
                      {exp.organization}
                    </p>
                  </div>
                  <span
                    style={{
                      fontSize: 10,
                      fontFamily: "var(--font-mono)",
                      color: "var(--os-text-dim)",
                      whiteSpace: "nowrap",
                      padding: "2px 8px",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid var(--os-border)",
                      borderRadius: 4,
                    }}
                  >
                    {exp.period}
                  </span>
                </div>
                <ul style={{ marginTop: 10, paddingLeft: 16, display: "flex", flexDirection: "column", gap: 4 }}>
                  {exp.points.map((pt) => (
                    <li
                      key={pt}
                      style={{ fontSize: 12, color: "var(--os-text-muted)", lineHeight: 1.6 }}
                    >
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
