"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function BsodScreen({ onClose }: { onClose: () => void }) {
  // Simple automatic close after 10 seconds for user experience
  useEffect(() => {
    const timer = setTimeout(onClose, 10000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999999,
        background: "#0078d4",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <div style={{ fontSize: "120px", marginBottom: "20px" }}>:(</div>
      <h1 style={{ fontSize: "24px", fontWeight: 400, marginBottom: "20px" }}>
        Your PC ran into a problem and needs to restart. We're just collecting some error info, and then we'll restart for you.
      </h1>
      <div style={{ fontSize: "16px" }}>0% complete</div>
      <div style={{ marginTop: "40px", fontSize: "14px" }}>
        For more information about this issue and possible fixes, visit https://www.windows.com/stopcode
      </div>
      <div style={{ marginTop: "10px", fontSize: "14px" }}>
        If you call a support person, give them this info: Stop code: CRITICAL_PROCESS_DIED
      </div>
    </div>
  );
}
