"use client";

import { useEffect, useCallback, useRef } from "react";

export interface HotkeyAction {
  /** A single chord like ["Alt", "w"] or multiple alternative chords like [["Alt", "w"], ["Meta", "w"]] */
  keys: string[] | string[][];
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

const MODIFIER_NAMES: Record<string, string> = {
  ctrl: "Control",
  control: "Control",
  alt: "Alt",
  shift: "Shift",
  meta: "Meta",
  os: "Meta",
  win: "Meta",
  cmd: "Meta",
  command: "Meta",
};

const MODIFIER_KEYS = new Set(["Control", "Alt", "Shift", "Meta"]);

function normalizeModifier(mod: string): string | null {
  const lower = mod.toLowerCase();
  return MODIFIER_NAMES[lower] ?? (MODIFIER_KEYS.has(mod) ? mod : null);
}

function normalizeKey(key: string): string {
  const lower = key.toLowerCase();
  if (lower === " " || lower === "spacebar") return "space";
  if (lower === "esc") return "escape";
  if (lower === "return") return "enter";
  if (lower.startsWith("key") && lower.length === 4) return lower.slice(3); // e.g. KeyW -> w
  if (lower.startsWith("digit") && lower.length === 6) return lower.slice(5); // e.g. Digit1 -> 1
  return lower;
}

function singleChordMatches(event: KeyboardEvent, chord: string[]): boolean {
  const requiredModifiers = new Set<string>();
  const requiredKeys = new Set<string>();

  for (const k of chord) {
    const mod = normalizeModifier(k);
    if (mod) {
      requiredModifiers.add(mod);
    } else {
      requiredKeys.add(normalizeKey(k));
    }
  }

  // Check event modifiers
  const eventModifiers = new Set<string>();
  if (event.ctrlKey) eventModifiers.add("Control");
  if (event.altKey) eventModifiers.add("Alt");
  if (event.shiftKey) eventModifiers.add("Shift");
  if (event.metaKey) eventModifiers.add("Meta");

  if (requiredModifiers.size !== eventModifiers.size) return false;
  for (const m of requiredModifiers) {
    if (!eventModifiers.has(m)) return false;
  }

  // Check event key / code against required keys
  const eventKeyNorm = normalizeKey(event.key);
  const eventCodeNorm = normalizeKey(event.code);

  for (const reqKey of requiredKeys) {
    const matches =
      eventKeyNorm === reqKey ||
      eventCodeNorm === reqKey ||
      (reqKey === "`" && (eventKeyNorm === "`" || eventCodeNorm === "backquote")) ||
      (reqKey === "tilde" && (eventKeyNorm === "~" || eventCodeNorm === "backquote"));

    if (!matches) return false;
  }

  return true;
}

function keysMatch(event: KeyboardEvent, keys: string[] | string[][]): boolean {
  if (keys.length === 0) return false;

  // If keys is array of arrays: [["Alt", "w"], ["Meta", "w"]]
  if (Array.isArray(keys[0])) {
    return (keys as string[][]).some((chord) => singleChordMatches(event, chord));
  }

  // Single chord: ["Alt", "w"]
  return singleChordMatches(event, keys as string[]);
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
    // Register actions
    const entries = actions.map((action, index) => ({
      action,
      id: `hotkey-${index}-${Math.random().toString(36).slice(2)}`,
    }));

    globalRegistry = entries;
    attachGlobalListener();

    return () => {
      detachGlobalListener();
    };
  }, [actions]);

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