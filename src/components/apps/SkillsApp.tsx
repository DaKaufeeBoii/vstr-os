"use client";

import React from "react";
import { skills } from "@/data/skills";
import { OsIcon } from "@/components/icons/OsIcon";

export default function SkillsApp() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {skills.map((cat) => (
        <div key={cat.title}>
          <p className="section-heading" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <OsIcon name={cat.icon} size="sm" color="var(--os-amber)" />
            <span>{cat.title}</span>
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {cat.skills.map((skill) => (
              <div key={skill.name}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 12, color: "var(--os-text)", fontFamily: "var(--font-mono)" }}>
                    {skill.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
