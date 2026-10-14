"use client";
import { useState, useCallback, useEffect } from "react";

export interface ContextMenuPosition {
  x: number;
  y: number;
}

export interface ContextMenuState {
  isOpen: boolean;
  sessionId: number;
  position: ContextMenuPosition;
  contextData: unknown;
}

export interface ContextMenuTriggerEvent {
  clientX: number;
  clientY: number;
  shiftKey?: boolean;
  preventDefault?: () => void;
  stopPropagation?: () => void;
}

export function useContextMenu() {
  const [state, setState] = useState<ContextMenuState>({
    isOpen: false,
    sessionId: 0,
    position: { x: 0, y: 0 },
    contextData: null,
  });

  const openMenu = useCallback((e: ContextMenuTriggerEvent | React.MouseEvent, data?: unknown) => {
    e.preventDefault?.();
    e.stopPropagation?.();

    // Shift+RightClick → pass through to native browser menu
    if (e.shiftKey) return;

    setState({
      isOpen: true,
      sessionId: state.sessionId + 1,
      position: { x: e.clientX, y: e.clientY },
      contextData: data ?? null,
    });
  }, [state.sessionId]);

  const closeMenu = useCallback(() => {
    setState((s) => ({ ...s, isOpen: false, contextData: null }));
  }, []);

  // Close on any click or touch outside
  useEffect(() => {
    if (!state.isOpen) return;
    const handle = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target?.closest?.('[role="menu"]') ||
        target?.closest?.('[role="menuitem"]')
      ) {
        return;
      }
      closeMenu();
    };
    // Slight timeout so the triggering click/tap doesn't immediately close it
    const timer = setTimeout(() => {
      window.addEventListener("click", handle);
      window.addEventListener("touchstart", handle);
      window.addEventListener("contextmenu", handle);
    }, 20);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("click", handle);
      window.removeEventListener("touchstart", handle);
      window.removeEventListener("contextmenu", handle);
    };
  }, [state.isOpen, closeMenu]);

  return { ...state, openMenu, closeMenu };
}
