"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { skills } from "@/data/skills";

export default function SkillsApp() {
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setMounted(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  // Also trigger when window opens
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div ref={ref} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {skills.map((cat, ci) => (
        <div key={cat.title}>
          <p className="section-heading">
            {cat.icon} {cat.title}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {cat.skills.map((skill, si) => (
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
