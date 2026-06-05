"use client";

import React from "react";
import Image from "next/image";

export default function PhotoViewerApp() {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#000" }}>
      <div style={{ position: "relative", flex: 1, width: "100%", minHeight: 0 }}>
        <Image
          src="/real.png"
          alt="Real photo of Sai Tarun Reddy Velagala"
          fill
          style={{ objectFit: "contain" }}
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
          borderTop: "1px solid var(--os-border)",
        }}
      >
        <span style={{ fontSize: 12, color: "var(--os-text-muted)", fontFamily: "var(--font-mono)" }}>
          Sai Tarun Reddy Velagala
        </span>
        <span style={{ fontSize: 11, color: "var(--os-text-dim)", fontFamily: "var(--font-mono)" }}>
          real.png · 1.9 MB
        </span>
      </div>
    </div>
  );
}
