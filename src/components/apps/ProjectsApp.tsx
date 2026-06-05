"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projects } from "@/data/projects";
import type { Project } from "@/types";

export default function ProjectsApp() {
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <p className="section-heading">// {projects.length} projects found</p>

      {/* File list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {projects.map((proj) => (
          <motion.div
            key={proj.title}
            id={`project-item-${proj.title.replace(/\s+/g, "-").toLowerCase()}`}
            className="glass-card"
            style={{
              cursor: "pointer",
              borderColor: selected?.title === proj.title
                ? "rgba(0,212,255,0.4)"
                : "var(--os-border)",
              background: selected?.title === proj.title
                ? "rgba(0,212,255,0.06)"
                : "rgba(22, 27, 34, 0.6)",
              transition: "all 0.2s",
            }}
            whileHover={{ scale: 1.01, borderColor: "rgba(0,212,255,0.25)" }}
            onClick={() => setSelected(selected?.title === proj.title ? null : proj)}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 24 }}>{proj.icon}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: "var(--os-text)" }}>
                  {proj.title}
                </p>
                <p style={{ fontSize: 12, color: "var(--os-text-muted)", marginTop: 2 }}>
                  {proj.subtitle}
                </p>
              </div>
              <span style={{ fontSize: 11, color: "var(--os-cyan)", fontFamily: "var(--font-mono)" }}>
                {selected?.title === proj.title ? "▲" : "▼"}
              </span>
            </div>

            <AnimatePresence>
              {selected?.title === proj.title && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{ overflow: "hidden" }}
                >
                  <div style={{ paddingTop: 14, borderTop: "1px solid var(--os-border)", marginTop: 12 }}>
                    <p style={{ fontSize: 12, color: "var(--os-text-muted)", lineHeight: 1.7, marginBottom: 12 }}>
                      {proj.description}
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
                      {proj.stack.map((tech) => (
                        <span key={tech} className="tag">{tech}</span>
                      ))}
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      {proj.github && (
                        <a
                          href={proj.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={btnStyle("border")}
                        >
                          🔗 GitHub
                        </a>
                      )}
                      {proj.demo && (
                        <a
                          href={proj.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={btnStyle("primary")}
                        >
                          🚀 Live Demo
                        </a>
                      )}
                      {!proj.github && !proj.demo && (
                        <span style={{ fontSize: 11, color: "var(--os-text-dim)", fontFamily: "var(--font-mono)" }}>
                          // links coming soon
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function btnStyle(variant: "primary" | "border"): React.CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "5px 12px",
    borderRadius: 6,
    fontSize: 12,
    fontFamily: "var(--font-mono)",
    textDecoration: "none",
    background: variant === "primary" ? "var(--os-cyan-dim)" : "transparent",
    border: variant === "primary"
      ? "1px solid rgba(0,212,255,0.3)"
      : "1px solid var(--os-border)",
    color: variant === "primary" ? "var(--os-cyan)" : "var(--os-text-muted)",
    cursor: "pointer",
    transition: "all 0.15s",
  };
}
