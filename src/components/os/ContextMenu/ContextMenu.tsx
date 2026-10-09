"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ContextMenuGroup } from "./ContextMenuGroup";
import type { ContextMenuGroupDef } from "./ContextMenuGroup";
import type { ContextMenuAction } from "./ContextMenuItem";

interface ContextMenuProps {
  isOpen: boolean;
  position: { x: number; y: number };
  groups: ContextMenuGroupDef[];
  onClose: () => void;
}

const MENU_WIDTH = 220;
const ITEM_HEIGHT = 38;
const GROUP_HEADER = 24;
const MENU_PADDING = 8;

/** Flatten all items across groups into a single ordered list */
function flattenItems(groups: ContextMenuGroupDef[]): ContextMenuAction[] {
  return groups.flatMap((g) => g.items.filter((item) => !item.disabled));
}

export function ContextMenu({ isOpen, position, groups, onClose }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const allItems = flattenItems(groups);

  // Estimated dimensions for flip logic
  const estimatedHeight = groups.reduce(
    (acc, g) => acc + g.items.length * ITEM_HEIGHT + (g.label ? GROUP_HEADER : 0) + 9,
    MENU_PADDING
  );

  // ── Flip position to prevent viewport clipping ────────────────────────
  const viewportW = typeof window !== "undefined" ? window.innerWidth : 1024;
  const viewportH = typeof window !== "undefined" ? window.innerHeight : 768;

  const flippedX = position.x + MENU_WIDTH > viewportW - 8
    ? position.x - MENU_WIDTH
    : position.x;

  const flippedY = position.y + estimatedHeight > viewportH - 8
    ? Math.max(8, position.y - estimatedHeight)
    : position.y;

  const x = Math.max(8, Math.min(flippedX, viewportW - MENU_WIDTH - 8));
  const y = Math.max(8, Math.min(flippedY, viewportH - 60));

  // ── Keyboard navigation ───────────────────────────────────────────────
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
        return;
      }

      const total = allItems.length;
      if (total === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setFocusedIndex((prev) => (prev + 1) % total);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setFocusedIndex((prev) => (prev - 1 + total) % total);
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < total) {
          const item = allItems[focusedIndex];
          if (item.onClick) {
            item.onClick();
            onClose();
          }
        }
      } else if (e.key === "Tab") {
        // Tab moves focus forward like ArrowDown
        e.preventDefault();
        setFocusedIndex((prev) => (prev + 1) % total);
      }
    },
    [isOpen, onClose, allItems, focusedIndex]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Reset focused index when menu opens/closes
  useEffect(() => {
    if (!isOpen) setFocusedIndex(-1);
  }, [isOpen]);

  // Map group items to their flat index for the focused-item highlight
  let flatCounter = 0;
  const groupsWithIndex = groups.map((group) => {
    const startIdx = flatCounter;
    const enabledCount = group.items.filter((i) => !i.disabled).length;
    flatCounter += enabledCount;
    return { group, startIdx };
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          key="context-menu"
          role="menu"
          aria-label="Context menu"
          // Win11-accurate entrance: scale from 0.95 + tiny upward shift
          initial={{ opacity: 0, scale: 0.95, y: -6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -6 }}
          transition={{ duration: 0.12, ease: [0.2, 0, 0, 1] }}
          onClick={(e) => e.stopPropagation()}
          onContextMenu={(e) => e.preventDefault()}
          style={{
            position: "fixed",
            top: y,
            left: x,
            width: MENU_WIDTH,
            maxHeight: "calc(100vh - 16px)",
            overflowY: "auto",
            zIndex: 99999,
            // Win11 Acrylic Dark Green
            background: "rgba(22, 32, 28, 0.95)",
            backdropFilter: "blur(24px) saturate(140%)",
            WebkitBackdropFilter: "blur(24px) saturate(140%)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: 14,
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
            padding: "4px 0",
          }}
        >
          {groupsWithIndex.map(({ group, startIdx }, i) => (
            <ContextMenuGroup
              key={i}
              {...group}
              onClose={onClose}
              first={i === 0}
              focusedIndex={focusedIndex}
              groupStartIndex={startIdx}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
