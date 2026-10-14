"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useOS } from "@/store/windowStore";
import { Eye, GraduationCap, Award, Mail, FileText } from "lucide-react";

export default function AboutApp() {
  const { openWindow } = useOS();

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
              border: "2px solid rgba(245, 158, 11, 0.3)",
              cursor: "pointer",
              boxShadow: "0 0 20px rgba(245,158,11,0.12)",
            }}
            whileHover={{ scale: 1.04, boxShadow: "0 0 28px rgba(0,212,255,0.35)" }}
            onClick={() => openWindow("photo_viewer")}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openWindow("photo_viewer");
              }
            }}
            role="button"
            tabIndex={0}
            aria-label="Click to reveal real photo"
            title="Click to reveal real photo"
          >
            <Image
              src="/assets/images/pix_image.png"
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
              <Eye size={22} color="var(--os-amber)" />
              <span style={{ fontSize: 10, color: "var(--os-amber)", fontFamily: "var(--font-mono)", letterSpacing: "0.06em" }}>
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
          <p style={{ marginTop: 4, fontSize: 13, color: "var(--os-amber)", fontFamily: "var(--font-mono)" }}>
            Computer Science Undergraduate · AI/ML
          </p>

          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { icon: <GraduationCap size={14} color="var(--os-amber)" />, text: "KG Reddy College of Engineering and Technology · Moinabad, Telangana" },
              { icon: <GraduationCap size={14} color="var(--os-amber)" />, text: "Bachelor of Computer Science and Engineering, AI/ML Specialization · Sep 2023 – Present" },
              { icon: <Award size={14} color="var(--os-amber)" />, text: "CGPA: 8.49" },
            ].map((item) => (
              <div key={item.text} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 16 }}>{item.icon}</span>
                <span style={{ fontSize: 12, color: "var(--os-text-muted)" }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="glass-card">
        <p className="section-heading">{"// Professional Summary"}</p>
        <p style={{ fontSize: 13, color: "var(--os-text-muted)", lineHeight: 1.7 }}>
          Computer Science undergraduate with a foundation in software development,
          programming, databases, and problem solving. Experienced in building practical
          projects with modern technologies across software and application development.
        </p>
      </div>

      {/* Links */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <a
          href="mailto:saitarunrdy@gmail.com"
          id="about-email-link"
          style={linkStyle}
        >
          <Mail size={16} color="var(--os-amber)" /> saitarunrdy@gmail.com
        </a>
        <a
          href="https://linkedin.com/in/vstr"
          id="about-linkedin-link"
          style={linkStyle}
        >
          <span><Image src="/assets/resume/icons/logo-Lin.jpg" alt="" width={24} height={24} style={{ width: 24, height: 24, objectFit: "contain", borderRadius: 4 }} /></span> LinkedIn
        </a>
        <a
          href="https://github.com/DaKaufeeBoii"
          id="about-github-link"
          style={linkStyle}
        >
          <span><Image src="/assets/resume/icons/logo-GitHub.png" alt="" width={24} height={24} style={{ width: 24, height: 24, objectFit: "contain", borderRadius: 4 }} /></span> GitHub
        </a>
        <a
          href="/assets/resume/Sai_Tarun_Reddy_Velagala_Resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          id="about-resume-link"
          style={{ ...linkStyle, background: "var(--os-amber-dim)", borderColor: "rgba(245,158,11,0.3)", color: "var(--os-amber)" }}
        >
          <FileText size={16} color="var(--os-amber)" /> View Resume (PDF)
        </a>
      </div>
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
