"use client";
import { useState, useCallback, useEffect } from "react";

export interface ContextMenuPosition {
  x: number;
  y: number;
}

export interface ContextMenuState {
  isOpen: boolean;
  position: ContextMenuPosition;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  contextData: any;
}

export function useContextMenu() {
  const [state, setState] = useState<ContextMenuState>({
    isOpen: false,
    position: { x: 0, y: 0 },
    contextData: null,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const openMenu = useCallback((e: React.MouseEvent, data?: any) => {
    e.preventDefault();
    e.stopPropagation();

    // Shift+RightClick → pass through to native browser menu
    if (e.shiftKey) return;

    setState({ isOpen: true, position: { x: e.clientX, y: e.clientY }, contextData: data ?? null });
  }, []);

  const closeMenu = useCallback(() => {
    setState((s) => ({ ...s, isOpen: false, contextData: null }));
  }, []);

  // Close on any left click outside
  useEffect(() => {
    if (!state.isOpen) return;
    const handle = () => closeMenu();
    window.addEventListener("click", handle);
    window.addEventListener("contextmenu", handle);
    return () => {
      window.removeEventListener("click", handle);
      window.removeEventListener("contextmenu", handle);
    };
  }, [state.isOpen, closeMenu]);

  return { ...state, openMenu, closeMenu };
}
