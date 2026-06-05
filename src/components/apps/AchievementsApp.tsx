"use client";

import React from "react";
import { motion } from "framer-motion";
import { achievements } from "@/data/achievements";

export default function AchievementsApp() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <p className="section-heading">// Achievements &amp; Awards</p>

      {achievements.map((ach, i) => (
        <motion.div
          key={ach.title}
          className="glass-card"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.12, duration: 0.35 }}
          style={{
            borderColor: "rgba(245, 158, 11, 0.25)",
            background: "rgba(245, 158, 11, 0.05)",
          }}
        >
          <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
            <div
              style={{
                fontSize: 36,
                lineHeight: 1,
                filter: "drop-shadow(0 2px 12px rgba(245,158,11,0.4))",
                flexShrink: 0,
              }}
            >
              {ach.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 6 }}>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 700, color: "var(--os-text)" }}>
                    {ach.title}
                  </p>
                  <p style={{ fontSize: 12, color: "var(--os-yellow)", fontFamily: "var(--font-mono)", marginTop: 2 }}>
                    {ach.subtitle}
                  </p>
                </div>
                <span
                  style={{
                    fontSize: 12,
                    fontFamily: "var(--font-mono)",
                    color: "var(--os-yellow)",
                    padding: "2px 10px",
                    background: "rgba(245,158,11,0.1)",
                    border: "1px solid rgba(245,158,11,0.25)",
                    borderRadius: 4,
                    whiteSpace: "nowrap",
                  }}
                >
                  {ach.year}
                </span>
              </div>
              <p style={{ fontSize: 12, color: "var(--os-text-muted)", lineHeight: 1.7, marginTop: 8 }}>
                {ach.description}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
