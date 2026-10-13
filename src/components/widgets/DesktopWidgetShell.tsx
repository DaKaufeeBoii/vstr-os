"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface DesktopWidgetShellProps {
  id: string;
  title?: string;
  tag?: string;
  icon?: React.ReactNode;
  headerRight?: React.ReactNode;
  isMinimized: boolean;
  onToggleMinimize: () => void;
  onClose: () => void;
  position: { x: number; y: number };
  onPositionChange: (id: string, pos: { x: number; y: number }) => void;
  width?: number | string;
  children: React.ReactNode;
  dragConstraintsRef?: React.RefObject<HTMLDivElement | null>;
}

export function DesktopWidgetShell({
  id,
  title,
  tag,
  icon,
  headerRight,
  isMinimized,
  onToggleMinimize,
  onClose,
  position,
  onPositionChange,
  width = 330,
  children,
  dragConstraintsRef,
}: DesktopWidgetShellProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dotsHovered, setDotsHovered] = useState(false);

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.06}
      dragConstraints={dragConstraintsRef}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={(_, info) => {
        setIsDragging(false);
        onPositionChange(id, {
          x: position.x + info.offset.x,
          y: position.y + info.offset.y,
        });
      }}
      initial={false}
      animate={{
        x: position.x,
        y: position.y,
        scale: isDragging ? 1.02 : 1,
        boxShadow: isDragging
          ? "0 28px 50px -10px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(255, 255, 255, 0.18)"
          : "0 16px 36px -8px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.1)",
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 32,
      }}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width,
        zIndex: isDragging ? 60 : 15,
        cursor: isDragging ? "grabbing" : "grab",
        userSelect: "none",
        pointerEvents: "auto",
        borderRadius: "18px",
        background: "rgba(18, 16, 26, 0.72)",
        backdropFilter: "blur(28px) saturate(190%)",
        WebkitBackdropFilter: "blur(28px) saturate(190%)",
        border: "1px solid rgba(255, 255, 255, 0.12)",
        overflow: "hidden",
      }}
    >
      {/* Specular Top Border Highlight */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "15%",
          right: "15%",
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.28), transparent)",
          pointerEvents: "none",
        }}
      />

      {/* Widget Header with macOS Traffic Lights */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: isMinimized ? "10px 14px" : "11px 14px 9px",
          borderBottom: isMinimized ? "none" : "1px solid rgba(255, 255, 255, 0.06)",
          transition: "padding 0.2s ease",
        }}
      >
        {/* Left: macOS Window Traffic Light Dots */}
        <div
          onMouseEnter={() => setDotsHovered(true)}
          onMouseLeave={() => setDotsHovered(false)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "7px",
          }}
        >
          {/* Close (Red) */}
          <button
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            title="Close widget"
            aria-label="Close widget"
            style={{
              width: "11px",
              height: "11px",
              borderRadius: "50%",
              backgroundColor: "#ff5f56",
              border: "1px solid rgba(0, 0, 0, 0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              padding: 0,
              color: "#4a0002",
              fontSize: "8px",
              fontWeight: 800,
              lineHeight: 1,
              transition: "transform 0.12s ease",
            }}
          >
            {dotsHovered && "×"}
          </button>

          {/* Minimize / Collapse (Yellow) */}
          <button
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              onToggleMinimize();
            }}
            title={isMinimized ? "Expand widget" : "Minimize widget"}
            aria-label="Minimize widget"
            style={{
              width: "11px",
              height: "11px",
              borderRadius: "50%",
              backgroundColor: "#ffbd2e",
              border: "1px solid rgba(0, 0, 0, 0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              padding: 0,
              color: "#523700",
              fontSize: "9px",
              fontWeight: 800,
              lineHeight: 1,
              transition: "transform 0.12s ease",
            }}
          >
            {dotsHovered && "−"}
          </button>

          {/* Title when minimized */}
          {isMinimized && title && (
            <span
              style={{
                marginLeft: 6,
                fontSize: "11px",
                fontWeight: 600,
                color: "rgba(255, 255, 255, 0.8)",
                letterSpacing: "0.2px",
              }}
            >
              {title}
            </span>
          )}
        </div>

        {/* Right: Tag / Badge / Custom Header Right */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {headerRight}
          {tag && (
            <span
              style={{
                fontSize: "9px",
                fontWeight: 700,
                letterSpacing: "0.8px",
                textTransform: "uppercase",
                color: "rgba(255, 255, 255, 0.45)",
                fontFamily: "var(--font-mono)",
              }}
            >
              {tag}
            </span>
          )}
          {icon && (
            <span style={{ display: "flex", alignItems: "center", opacity: 0.5 }}>
              {icon}
            </span>
          )}
        </div>
      </div>

      {/* Widget Body (Collapsible) */}
      <AnimatePresence initial={false}>
        {!isMinimized && (
          <motion.div
            key="widget-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 450, damping: 32 }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ padding: "12px 14px 14px" }}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
