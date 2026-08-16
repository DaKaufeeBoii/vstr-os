"use client";
import React, { useRef, useEffect } from "react";
import { OsIcon } from "@/components/icons/OsIcon";

export interface ContextMenuAction {
  label?: string;
  icon?: string;
  disabled?: boolean;
  danger?: boolean;
  items?: ContextMenuAction[]; // For submenus
  onClick?: () => void;
}

interface ContextMenuItemProps extends ContextMenuAction {
  onClose: () => void;
  /** True when this item is keyboard-focused */
  isFocused?: boolean;
}

export function ContextMenuItem({
  label,
  icon,
  disabled = false,
  danger = false,
  items,
  onClick,
  onClose,
  isFocused = false,
}: ContextMenuItemProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [showSubMenu, setShowSubMenu] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  const [submenuSide, setSubmenuSide] = React.useState<"right" | "left">("right");
  const [submenuAlign, setSubmenuAlign] = React.useState<"top" | "bottom">("top");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Scroll into view when keyboard-focused
  useEffect(() => {
    if (isFocused) {
      ref.current?.scrollIntoView({ block: "nearest" });
    }
  }, [isFocused]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled || items) return; // Items (submenus) shouldn't click-to-close
    onClick?.();
    onClose();
  };

  const hoveredBg = danger ? "rgba(239,68,68,0.12)" : "rgba(255,255,255,0.08)";
  const hasSubMenu = items && items.length > 0;

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (hasSubMenu && ref.current) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        const rect = ref.current!.getBoundingClientRect();
        const SUBMENU_WIDTH = 200;
        const SUBMENU_HEIGHT = (items?.length || 1) * 38 + 12;
        setSubmenuSide(rect.right + SUBMENU_WIDTH > window.innerWidth - 8 ? "left" : "right");
        setSubmenuAlign(rect.top + SUBMENU_HEIGHT > window.innerHeight - 8 ? "bottom" : "top");
        setShowSubMenu(true);
      }, 150); // 150ms delay
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setShowSubMenu(false);
    }, 200); // 200ms delay to allow moving to submenu
  };

  return (
    <div 
      style={{ position: "relative" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        ref={ref}
        role="menuitem"
        aria-disabled={disabled}
        aria-haspopup={hasSubMenu ? "true" : undefined}
        tabIndex={-1}
        onClick={handleClick}
        disabled={disabled}
        className={isFocused ? "ctx-item-focused" : undefined}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "8px 12px",
          height: 38,
          background: isFocused || isHovered || showSubMenu ? hoveredBg : "transparent",
          border: "none",
          cursor: disabled ? "default" : "pointer",
          textAlign: "left",
          fontFamily: "'Segoe UI Variable', 'Segoe UI', system-ui, sans-serif",
          fontSize: 14,
          color: disabled
            ? "rgba(255,255,255,0.3)"
            : danger
            ? "#ff6b6b"
            : "rgba(255,255,255,0.95)",
          borderRadius: 4,
          margin: "0 4px",
          width: "calc(100% - 8px)",
          transition: "background 0.1s",
          opacity: disabled ? 0.5 : 1,
          whiteSpace: "nowrap",
        }}
      >
        <span
          style={{
            width: 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {icon && (
            <OsIcon
              name={icon}
              size="sm"
              color={danger ? "#ff6b6b" : "rgba(255,255,255,0.7)"}
            />
          )}
        </span>
        <span style={{ flex: 1 }}>{label}</span>
        {hasSubMenu && (
          <span style={{
            fontSize: 10,
            opacity: 0.5,
            marginLeft: 8,
            transform: submenuSide === "left" ? "scaleX(-1)" : undefined,
            display: "inline-flex",
          }}>
            <OsIcon name="chevronRight" size="sm" color="rgba(255,255,255,0.5)" />
          </span>
        )}
      </button>

      {hasSubMenu && showSubMenu && (
        <div style={{
          position: "absolute",
          ...(submenuAlign === "bottom" ? { bottom: -4 } : { top: -4 }),
          ...(submenuSide === "left"
            ? { right: "100%", paddingRight: 4 }
            : { left: "100%", paddingLeft: 4 }),
          zIndex: 100,
        }}>
          <SubMenu items={items} onClose={onClose} />
        </div>
      )}
    </div>
  );
}

/**
 * SubMenu internal component for cascading logic
 */
function SubMenu({ items, onClose }: { items: ContextMenuAction[]; onClose: () => void }) {
  return (
    <div style={{
      minWidth: 180,
      background: "rgba(22, 32, 28, 0.95)", // Win11 Dark Green Acrylic
      backdropFilter: "blur(24px) saturate(140%)",
      border: "1px solid rgba(255, 255, 255, 0.08)",
      borderRadius: 12,
      boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
      padding: "4px 0",
    }}>
      {items.map((item, i) => (
        <ContextMenuItem key={i} {...item} onClose={onClose} />
      ))}
    </div>
  );
}
