"use client";
import React from "react";
import type { ContextMenuAction } from "./ContextMenuItem";
import { ContextMenuItem } from "./ContextMenuItem";

export interface ContextMenuGroupDef {
  label?: string;
  items: ContextMenuAction[];
}

interface ContextMenuGroupProps extends ContextMenuGroupDef {
  onClose: () => void;
  first?: boolean;
  /** Global flat index of the first enabled item in this group */
  groupStartIndex?: number;
  /** Which flat index is currently keyboard-focused */
  focusedIndex?: number;
}

export function ContextMenuGroup({
  label,
  items,
  onClose,
  first = false,
  groupStartIndex = 0,
  focusedIndex = -1,
}: ContextMenuGroupProps) {
  return (
    <div role="group" aria-label={label}>
      {!first && (
        <div
          style={{
            margin: "4px 8px",
            height: 1,
            background: "rgba(255,255,255,0.06)",
          }}
        />
      )}
      {label && (
        <div
          style={{
            padding: "4px 12px 2px",
            fontSize: 11,
            fontWeight: 600,
            color: "rgba(255,255,255,0.6)",
            fontFamily: "'Segoe UI Variable', 'Segoe UI', system-ui, sans-serif",
          }}
        >
          {label}
        </div>
      )}
      {items.map((item, i) => {
        // Disabled items don't participate in keyboard nav
        const isEnabled = !item.disabled;
        const flatIndex = isEnabled ? groupStartIndex + i : -1;

        return (
          <ContextMenuItem
            key={i}
            {...item}
            onClose={onClose}
            isFocused={isEnabled && flatIndex === focusedIndex}
          />
        );
      })}
    </div>
  );
}
