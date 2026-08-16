"use client";

import { useEffect, useCallback, useRef } from "react";

export interface HotkeyAction {
  keys: string[];
  description: string;
  handler: (e: KeyboardEvent) => void;
  preventDefault?: boolean;
  stopPropagation?: boolean;
  allowInInput?: boolean;
}

interface HotkeyEntry {
  action: HotkeyAction;
  id: string;
}

const MODIFIER_KEYS = new Set(["Control", "Alt", "Shift", "Meta", "OS"]);
const KEY_ALIASES: Record<string, string> = {
  " ": "Space",
  Escape: "Escape",
  Enter: "Enter",
  Tab: "Tab",
  ArrowUp: "ArrowUp",
  ArrowDown: "ArrowDown",
  ArrowLeft: "ArrowLeft",
  ArrowRight: "ArrowRight",
  Backspace: "Backspace",
  Delete: "Delete",
  Home: "Home",
  End: "End",
  PageUp: "PageUp",
  PageDown: "PageDown",
  F1: "F1",
  F2: "F2",
  F3: "F3",
  F4: "F4",
  F5: "F5",
  F6: "F6",
  F7: "F7",
  F8: "F8",
  F9: "F9",
  F10: "F10",
  F11: "F11",
  F12: "F12",
};

function normalizeKey(key: string): string {
  return KEY_ALIASES[key] ?? key;
}

function keysMatch(event: KeyboardEvent, keys: string[]): boolean {
  const requiredModifiers = new Set<string>();
  const requiredKeys = new Set<string>();

  for (const k of keys) {
    const normalized = normalizeKey(k);
    if (MODIFIER_KEYS.has(normalized)) {
      requiredModifiers.add(normalized);
    } else {
      requiredKeys.add(normalized);
    }
  }

  const eventModifiers = new Set<string>();
  if (event.ctrlKey) eventModifiers.add("Control");
  if (event.altKey) eventModifiers.add("Alt");
  if (event.shiftKey) eventModifiers.add("Shift");
  if (event.metaKey) eventModifiers.add("Meta");

  const eventKey = normalizeKey(event.key);

  return (
    requiredKeys.has(eventKey) &&
    requiredModifiers.size === eventModifiers.size &&
    [...requiredModifiers].every((m) => eventModifiers.has(m))
  );
}

function isTypingElement(element: HTMLElement | null): boolean {
  if (!element) return false;
  const tagName = element.tagName.toLowerCase();
  if (["input", "textarea", "select"].includes(tagName)) return true;
  if (element.isContentEditable) return true;
  return false;
}

let globalRegistry: HotkeyEntry[] = [];
let listenerAttached = false;

function attachGlobalListener() {
  if (listenerAttached || typeof window === "undefined") return;
  listenerAttached = true;

  const handler = (e: KeyboardEvent) => {
    if (!e.isTrusted) return;

    const target = e.target as HTMLElement;
    const isInput = isTypingElement(target);

    for (const entry of globalRegistry) {
      const { action } = entry;
      if (!action.allowInInput && isInput) continue;
      if (keysMatch(e, action.keys)) {
        if (action.preventDefault !== false) e.preventDefault();
        if (action.stopPropagation) e.stopPropagation();
        action.handler(e);
        break; // Only trigger first matching hotkey
      }
    }
  };

  window.addEventListener("keydown", handler, { passive: false });

  // Cleanup function reference for potential removal
  (window as any).__vstrHotkeyHandler = handler;
}

function detachGlobalListener() {
  if (!listenerAttached) return;
  const handler = (window as any).__vstrHotkeyHandler;
  if (handler) {
    window.removeEventListener("keydown", handler);
  }
  listenerAttached = false;
  globalRegistry = [];
}

export function useGlobalHotkeys(actions: HotkeyAction[]) {
  const actionsRef = useRef(actions);
  actionsRef.current = actions;

  useEffect(() => {
    // Register all actions
    globalRegistry = actions.map((action, index) => ({
      action,
      id: `hotkey-${index}-${Math.random().toString(36).slice(2)}`,
    }));

    attachGlobalListener();

    return () => {
      detachGlobalListener();
    };
  }, []);

  // Helper to register a single hotkey imperatively
  const register = useCallback((action: HotkeyAction) => {
    const id = `hotkey-${Math.random().toString(36).slice(2)}`;
    globalRegistry.push({ action, id });
    attachGlobalListener();
    return () => {
      globalRegistry = globalRegistry.filter((entry) => entry.id !== id);
      if (globalRegistry.length === 0) detachGlobalListener();
    };
  }, []);

  const unregisterAll = useCallback(() => {
    detachGlobalListener();
  }, []);

  return { register, unregisterAll };
}

// Export a singleton registry for cross-component access
export const hotkeyRegistry = {
  register: (action: HotkeyAction) => {
    const id = `hotkey-${Math.random().toString(36).slice(2)}`;
    globalRegistry.push({ action, id });
    attachGlobalListener();
    return () => {
      globalRegistry = globalRegistry.filter((entry) => entry.id !== id);
      if (globalRegistry.length === 0) detachGlobalListener();
    };
  },
  unregisterAll: detachGlobalListener,
  getRegistered: () => globalRegistry.map((e) => e.action),
};