"use client";

import React, { useRef, useCallback, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useDragControls,
  useMotionValue,
} from "framer-motion";
import { useOS } from "@/store/windowStore";
import { useSound } from "@/utils/useSound";
import type { WindowId } from "@/types";
import { OsIcon } from "@/components/icons/OsIcon";
import { useFocusTrap } from "@/hooks/useFocusTrap";

interface WindowProps {
  id: WindowId;
  instanceId?: string;
  title: string;
  /** Legacy emoji icon */
  icon: string;
  /** Fluent SVG icon registry key */
  fluentIcon?: string;
  defaultW?: number;
  defaultH?: number;
  noPadding?: boolean;
  children: React.ReactNode;
}

export default function Window({
  id,
  instanceId,
  title,
  icon,
  fluentIcon,
  defaultW = 500,
  defaultH = 420,
  noPadding = false,
  children,
}: WindowProps) {
  const {
    getWindow,
    closeWindow,
    minimizeWindow,
    focusWindow,
    moveWindow,
    maximizeWindow,
    resizeWindow,
    windows,
    stack,
  } = useOS();
  const { playClick } = useSound();
  const targetId = instanceId || id;
  const win = getWindow(targetId);

  const dragControls = useDragControls();
  const windowRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  // Position is driven entirely by transform (framer-motion motion values)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Focus trap for the window
  const focusTrapRef = useFocusTrap({
    enabled: win?.isOpen && !win?.isMinimized,
    onEscape: () => minimizeWindow(targetId),
    initialFocusRef: windowRef,
  });

  // A window is focused if it is the topmost entry in the z-index stack
  const isFocused = stack[stack.length - 1] === targetId;

  // Responsive detection
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ── Sync store -> motion values when changed externally ────────
     (snap, maximize, center-on-open). Skip while dragging or on mobile. */
  useEffect(() => {
    if (!win || isDragging.current) return;
    if (isMobile) {
      x.set(0);
      y.set(0);
      return;
    }
    x.set(win.x);
    y.set(win.y);
  }, [win?.x, win?.y, win?.isOpen, win?.isMinimized, x, y, isMobile]);

  /* ── Drag via titlebar (framer-motion drag controls) ──────────── */
  const onTitlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (isMobile) return; // Disable dragging on mobile
      if ((e.target as HTMLElement).closest(".os-traffic-light")) return;
      focusWindow(targetId);
      // Hand off pointer to framer-motion drag controls
      (dragControls as any).start(e.nativeEvent);
    },
    [targetId, focusWindow, dragControls]
  );

  const onDragEnd = useCallback(
    (_: any, info: any) => {
      isDragging.current = false;
      if (!win) return;
      // Calculate new position based on the delta from start
      const newX = win.x + info.offset.x;
      const newY = win.y + info.offset.y;
      
      // Clamp to viewport (leave taskbar space at bottom)
      const w = windowRef.current?.offsetWidth ?? defaultW;
      const h = windowRef.current?.offsetHeight ?? defaultH;
      const maxX = Math.max(0, window.innerWidth - w);
      const maxY = Math.max(0, window.innerHeight - h - 48);
      
      const finalX = Math.max(0, Math.min(newX, maxX));
      const finalY = Math.max(0, Math.min(newY, maxY));
      
      moveWindow(targetId, finalX, finalY);
    },
    [targetId, win, moveWindow, defaultW, defaultH]
  );

  // Center on first open
  useEffect(() => {
    if (win?.isOpen && win.x === 0 && win.y === 0) {
      const cx = Math.max(40, (window.innerWidth - defaultW) / 2);
      const cy = Math.max(40, (window.innerHeight - defaultH - 48) / 2);
      moveWindow(targetId, cx, cy);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [win?.isOpen]);

  // Handle native resize
  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === windowRef.current) {
          const { width, height } = entry.contentRect;
          if (width !== win?.width || height !== win?.height) {
            resizeWindow(targetId, width, height);
          }
        }
      }
    });
    if (windowRef.current) observer.observe(windowRef.current);
    return () => observer.disconnect();
  }, [targetId, win?.width, win?.height, resizeWindow]);

  if (!win || !win.isOpen) return null;

  return (
    <AnimatePresence>
      {!win.isMinimized && (
        <motion.div
          ref={(el) => {
            windowRef.current = el;
            if (focusTrapRef.current) focusTrapRef.current = el;
          }}
          key={targetId}
          className={`os-window${isFocused ? " focused" : ""}`}
          drag={!isMobile}
          dragControls={dragControls}
          dragListener={false}
          dragMomentum={false}
          dragElastic={0}
          onDragStart={() => {
            isDragging.current = true;
          }}
          onDragEnd={onDragEnd}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 340, damping: 28 }}
          style={{
            x: isMobile ? 0 : x,
            y: isMobile ? 0 : y,
            width: isMobile ? "100vw" : win.width,
            height: isMobile ? "calc(100dvh - var(--taskbar-h))" : win.height,
            maxWidth: "100vw",
            maxHeight: "calc(100dvh - var(--taskbar-h))",
            zIndex: win.zIndex,
            position: isMobile ? "fixed" : "absolute",
            left: 0,
            top: 0,
            resize: isMobile ? "none" : "both",
            overflow: "auto",
            minWidth: isMobile ? "100vw" : 280,
            minHeight: isMobile ? "auto" : 200,
          }}
          onMouseDown={() => focusWindow(targetId)}
          onPointerDown={() => focusWindow(targetId)}
          role="dialog"
          aria-modal="true"
          aria-label={title}
          tabIndex={-1}
        >
          {/* Title Bar - Traffic Lights Style */}
          <div className="os-titlebar" onPointerDown={onTitlePointerDown}>
            <div className="os-traffic-lights">
              <button
                id={`${targetId}-close`}
                className="os-traffic-light close"
                onClick={() => { playClick(); closeWindow(targetId); }}
                title="Close"
                aria-label="Close window"
              >
                ✕
              </button>
              <button
                id={`${targetId}-minimize`}
                className="os-traffic-light min"
                onClick={() => { playClick(); minimizeWindow(targetId); }}
                title="Minimize"
                aria-label="Minimize window"
              >
                −
              </button>
              <button
                id={`${targetId}-maximize`}
                className="os-traffic-light max"
                onClick={(e) => {
                  playClick();
                  e.stopPropagation();
                  maximizeWindow(targetId);
                }}
                title="Maximize"
                aria-label="Maximize window"
              />
            </div>

            <div className="os-titlebar-icon" aria-hidden="true">
              {fluentIcon ? (
                <OsIcon name={fluentIcon} size="sm" color="var(--os-text)" />
              ) : (
                icon
              )}
            </div>
            <div className="os-titlebar-title">{title}</div>
            {/* spacer for symmetry */}
            <div style={{ width: 52 }} />
          </div>

          {/* Body */}
          <div
            className="os-window-body"
            style={
              noPadding
                ? { padding: 0, display: "flex", flexDirection: "column" }
                : undefined
            }
          >
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
