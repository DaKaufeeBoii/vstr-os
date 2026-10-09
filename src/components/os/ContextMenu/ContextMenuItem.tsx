"use client";
import React, { useRef, useEffect, useState } from "react";
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
  const [showSubMenu, setShowSubMenu] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [submenuSide, setSubmenuSide] = useState<"right" | "left">("right");
  const [submenuAlign, setSubmenuAlign] = useState<"top" | "bottom">("top");
  const [isMobileScreen, setIsMobileScreen] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const checkScreen = () => {
      setIsMobileScreen(window.innerWidth < 640);
    };
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  // Scroll into view when keyboard-focused
  useEffect(() => {
    if (isFocused) {
      ref.current?.scrollIntoView({ block: "nearest" });
    }
  }, [isFocused]);

  const hasSubMenu = Boolean(items && items.length > 0);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    if (hasSubMenu) {
      setShowSubMenu((prev) => !prev);
      return;
    }
    onClick?.();
    onClose();
  };

  const hoveredBg = danger ? "rgba(239,68,68,0.12)" : "rgba(255,255,255,0.08)";

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (hasSubMenu && !isMobileScreen && ref.current) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        const rect = ref.current!.getBoundingClientRect();
        const SUBMENU_WIDTH = 200;
        const SUBMENU_HEIGHT = (items?.length || 1) * 38 + 12;
        setSubmenuSide(rect.right + SUBMENU_WIDTH > window.innerWidth - 8 ? "left" : "right");
        setSubmenuAlign(rect.top + SUBMENU_HEIGHT > window.innerHeight - 8 ? "bottom" : "top");
        setShowSubMenu(true);
      }, 150);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (!isMobileScreen) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setShowSubMenu(false);
      }, 200);
    }
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
        aria-expanded={hasSubMenu ? showSubMenu : undefined}
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
          <span
            style={{
              fontSize: 10,
              opacity: 0.5,
              marginLeft: 8,
              transform: isMobileScreen && showSubMenu ? "rotate(90deg)" : submenuSide === "left" ? "scaleX(-1)" : undefined,
              display: "inline-flex",
              transition: "transform 0.15s ease",
            }}
          >
            <OsIcon name="chevronRight" size="sm" color="rgba(255,255,255,0.5)" />
          </span>
        )}
      </button>

      {/* SubMenu Rendering: Accordion on mobile, Floating on Desktop */}
      {hasSubMenu && showSubMenu && items && (
        isMobileScreen ? (
          <div
            style={{
              paddingLeft: 24,
              borderLeft: "2px solid rgba(255, 255, 255, 0.1)",
              margin: "4px 8px 4px 16px",
              background: "rgba(0, 0, 0, 0.2)",
              borderRadius: 6,
            }}
          >
            {items.map((subItem, i) => (
              <ContextMenuItem key={i} {...subItem} onClose={onClose} />
            ))}
          </div>
        ) : (
          <div
            style={{
              position: "absolute",
              ...(submenuAlign === "bottom" ? { bottom: -4 } : { top: -4 }),
              ...(submenuSide === "left"
                ? { right: "100%", paddingRight: 4 }
                : { left: "100%", paddingLeft: 4 }),
              zIndex: 100,
            }}
          >
            <SubMenu items={items} onClose={onClose} />
          </div>
        )
      )}
    </div>
  );
}

/**
 * SubMenu internal component for cascading logic
 */
function SubMenu({ items, onClose }: { items: ContextMenuAction[]; onClose: () => void }) {
  return (
    <div
      style={{
        minWidth: 190,
        background: "rgba(22, 32, 28, 0.95)", // Win11 Dark Green Acrylic
        backdropFilter: "blur(24px) saturate(140%)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: 12,
        boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
        padding: "4px 0",
      }}
    >
      {items.map((item, i) => (
        <ContextMenuItem key={i} {...item} onClose={onClose} />
      ))}
    </div>
  );
}
