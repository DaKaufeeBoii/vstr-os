"use client";

import React, { useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOS } from "@/store/windowStore";
import type { WindowId } from "@/types";

interface WindowProps {
  id: WindowId;
  title: string;
  icon: string;
  defaultW?: number;
  defaultH?: number;
  noPadding?: boolean;
  children: React.ReactNode;
}

export default function Window({
  id,
  title,
  icon,
  defaultW = 500,
  defaultH = 420,
  noPadding = false,
  children,
}: WindowProps) {
  const { getWindow, closeWindow, minimizeWindow, focusWindow, moveWindow } = useOS();
  const win = getWindow(id);

  const dragOrigin = useRef<{ mx: number; my: number; wx: number; wy: number } | null>(null);
  const windowRef = useRef<HTMLDivElement>(null);

  /* ── Drag via titlebar ─────────────────────────────────────────── */
  const onTitleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest(".os-traffic-light")) return;
      e.preventDefault();
      focusWindow(id);
      dragOrigin.current = {
        mx: e.clientX,
        my: e.clientY,
        wx: win?.x ?? 80,
        wy: win?.y ?? 80,
      };

      const onMove = (ev: MouseEvent) => {
        if (!dragOrigin.current) return;
        const dx = ev.clientX - dragOrigin.current.mx;
        const dy = ev.clientY - dragOrigin.current.my;
        const newX = dragOrigin.current.wx + dx;
        const newY = dragOrigin.current.wy + dy;
        // Clamp to viewport (leave taskbar space at bottom)
        const maxX = window.innerWidth  - (windowRef.current?.offsetWidth  ?? defaultW);
        const maxY = window.innerHeight - (windowRef.current?.offsetHeight ?? defaultH) - 48;
        moveWindow(id, Math.max(0, Math.min(newX, maxX)), Math.max(0, Math.min(newY, maxY)));
      };

      const onUp = () => {
        dragOrigin.current = null;
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };

      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [id, win?.x, win?.y, focusWindow, moveWindow, defaultW, defaultH]
  );

  // Center on first open
  useEffect(() => {
    if (win?.isOpen && win.x === 0 && win.y === 0) {
      const x = Math.max(40, (window.innerWidth  - defaultW) / 2);
      const y = Math.max(40, (window.innerHeight - defaultH - 48) / 2);
      moveWindow(id, x, y);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [win?.isOpen]);

  if (!win || !win.isOpen) return null;

  return (
    <AnimatePresence>
      {!win.isMinimized && (
        <motion.div
          ref={windowRef}
          key={id}
          className={`os-window`}
          initial={{ opacity: 0, scale: 0.92, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 8 }}
          transition={{ type: "spring", stiffness: 340, damping: 28 }}
          style={{
            left: win.x,
            top: win.y,
            width: defaultW,
            height: defaultH,
            zIndex: win.zIndex,
            resize: "both",
            overflow: "hidden",
            minWidth: 300,
            minHeight: 200,
          }}
          onMouseDown={() => focusWindow(id)}
        >
          {/* Title Bar */}
          <div
            className="os-titlebar"
            onMouseDown={onTitleMouseDown}
          >
            <div className="os-traffic-lights">
              <button
                id={`${id}-close`}
                className="os-traffic-light close"
                onClick={() => closeWindow(id)}
                title="Close"
              >✕</button>
              <button
                id={`${id}-minimize`}
                className="os-traffic-light min"
                onClick={() => minimizeWindow(id)}
                title="Minimize"
              >−</button>
              <div className="os-traffic-light max" title="Maximized">+</div>
            </div>

            <div className="os-titlebar-icon">{icon}</div>
            <div className="os-titlebar-title">{title}</div>
            {/* spacer for symmetry */}
            <div style={{ width: 52 }} />
          </div>

          {/* Body */}
          <div
            className="os-window-body"
            style={noPadding ? { padding: 0, display: "flex", flexDirection: "column" } : undefined}
          >
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
