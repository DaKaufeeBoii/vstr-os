"use client";
import React, { useRef, useEffect, useState, useCallback, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { OsIcon } from "@/components/icons/OsIcon";
import { useContextMenuSubmenu, ContextMenuSubmenuContext } from "./ContextMenuContext";

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

const SUBMENU_WIDTH = 200;
const subscribeToMount = () => () => {};
const getClientMountSnapshot = () => true;
const getServerMountSnapshot = () => false;

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
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const { activeSubmenuId, setActiveSubmenuId } = useContextMenuSubmenu();
  const itemId = label || "";

  const [isHovered, setIsHovered] = useState(false);
  const mounted = useSyncExternalStore(subscribeToMount, getClientMountSnapshot, getServerMountSnapshot);
  const [menuPos, setMenuPos] = useState<{
    top: number;
    left: number;
    side: "right" | "left";
  }>({ top: 0, left: 0, side: "right" });

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const hasSubMenu = Boolean(items && items.length > 0);
  const isSubmenuOpen = hasSubMenu && activeSubmenuId === itemId;

  const calculatePosition = useCallback(() => {
    if (!ref.current || typeof window === "undefined") return;
    const rect = ref.current.getBoundingClientRect();

    const approxHeight = (items || []).reduce(
      (acc, it) => acc + (it.label?.toLowerCase() === "divider" ? 9 : 38),
      8
    );

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Horizontal placement
    let side: "right" | "left" = "right";
    let left = rect.right + 2;

    if (rect.right + 2 + SUBMENU_WIDTH > vw - 8) {
      if (rect.left - 2 - SUBMENU_WIDTH >= 8) {
        side = "left";
        left = rect.left - 2 - SUBMENU_WIDTH;
      } else {
        left = Math.max(8, vw - SUBMENU_WIDTH - 8);
      }
    }

    // Vertical placement
    let top = rect.top - 4;
    if (top + approxHeight > vh - 8) {
      top = Math.max(8, vh - approxHeight - 8);
    }
    top = Math.max(8, top);

    setMenuPos({ top, left, side });
  }, [items]);

  useEffect(() => {
    if (isSubmenuOpen) {
      calculatePosition();
    }
  }, [isSubmenuOpen, calculatePosition]);

  // Scroll into view when keyboard-focused
  useEffect(() => {
    if (isFocused) {
      ref.current?.scrollIntoView({ block: "nearest" });
    }
  }, [isFocused]);

  // Render horizontal separator line if item is a divider
  if (label?.toLowerCase() === "divider") {
    return (
      <div
        role="separator"
        style={{
          margin: "4px 8px",
          height: 1,
          background: "rgba(255, 255, 255, 0.08)",
        }}
      />
    );
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    if (hasSubMenu) {
      calculatePosition();
      setActiveSubmenuId(isSubmenuOpen ? null : itemId);
      return;
    }
    onClick?.();
    onClose();
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (timerRef.current) clearTimeout(timerRef.current);

    if (hasSubMenu) {
      calculatePosition();
      timerRef.current = setTimeout(() => {
        calculatePosition();
        setActiveSubmenuId(itemId);
      }, 70);
    } else {
      timerRef.current = setTimeout(() => {
        if (activeSubmenuId !== null) {
          setActiveSubmenuId(null);
        }
      }, 100);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (timerRef.current) clearTimeout(timerRef.current);

    if (hasSubMenu && isSubmenuOpen) {
      timerRef.current = setTimeout(() => {
        setActiveSubmenuId(null);
      }, 200);
    }
  };

  const handleSubMenuMouseEnter = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsHovered(true);
  };

  const handleSubMenuMouseLeave = () => {
    setIsHovered(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setActiveSubmenuId(null);
    }, 200);
  };

  const hoveredBg = danger ? "rgba(239,68,68,0.12)" : "rgba(255,255,255,0.08)";

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
        aria-expanded={hasSubMenu ? isSubmenuOpen : undefined}
        tabIndex={-1}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onPointerEnter={handleMouseEnter}
        disabled={disabled}
        className={isFocused ? "ctx-item-focused" : undefined}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "8px 12px",
          height: 38,
          background: isFocused || isHovered || isSubmenuOpen ? hoveredBg : "transparent",
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
          <span
            style={{
              fontSize: 10,
              opacity: 0.5,
              marginLeft: "auto",
              transform: menuPos.side === "left" ? "scaleX(-1)" : undefined,
              display: "inline-flex",
              alignItems: "center",
              transition: "transform 0.15s ease",
            }}
          >
            <OsIcon name="chevronRight" size="sm" color="rgba(255,255,255,0.5)" />
          </span>
        )}
      </button>

      {/* Pop-out floating submenu rendered via Portal */}
      {mounted && hasSubMenu && typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {isSubmenuOpen && items && (
            <motion.div
              key={`submenu-${itemId}`}
              initial={{ opacity: 0, scale: 0.96, x: menuPos.side === "right" ? -4 : 4 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.1, ease: [0.2, 0, 0, 1] }}
              style={{
                position: "fixed",
                top: menuPos.top,
                left: menuPos.side === "right" ? menuPos.left - 4 : menuPos.left,
                paddingLeft: menuPos.side === "right" ? 4 : 0,
                paddingRight: menuPos.side === "left" ? 4 : 0,
                zIndex: 100000,
                pointerEvents: "auto",
              }}
              onMouseEnter={handleSubMenuMouseEnter}
              onMouseLeave={handleSubMenuMouseLeave}
              onClick={(e) => e.stopPropagation()}
            >
              <SubMenu items={items} onClose={onClose} />
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}

/**
 * SubMenu internal component for cascading logic
 */
function SubMenu({ items, onClose }: { items: ContextMenuAction[]; onClose: () => void }) {
  const [nestedSubmenuId, setNestedSubmenuId] = useState<string | null>(null);

  return (
    <ContextMenuSubmenuContext.Provider
      value={{
        activeSubmenuId: nestedSubmenuId,
        setActiveSubmenuId: setNestedSubmenuId,
      }}
    >
      <div
        role="menu"
        aria-label="Submenu"
        style={{
          width: SUBMENU_WIDTH,
          background: "rgba(22, 32, 28, 0.95)", // Win11 Dark Green Acrylic
          backdropFilter: "blur(24px) saturate(140%)",
          WebkitBackdropFilter: "blur(24px) saturate(140%)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: 12,
          boxShadow: "0 10px 30px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)",
          padding: "4px 0",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {items.map((item, i) => (
          <ContextMenuItem key={i} {...item} onClose={onClose} />
        ))}
      </div>
    </ContextMenuSubmenuContext.Provider>
  );
}
