"use client";

import { useEffect, useRef, useCallback } from "react";

interface FocusTrapOptions {
  enabled?: boolean;
  onEscape?: () => void;
  clickOutsideToClose?: boolean;
  initialFocusRef?: React.RefObject<HTMLElement | null>;
  returnFocusRef?: React.RefObject<HTMLElement | null>;
}

export function useFocusTrap({
  enabled = true,
  onEscape,
  clickOutsideToClose,
  initialFocusRef,
  returnFocusRef,
}: FocusTrapOptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled) return;
      if (!containerRef.current) return;

      if (e.key === "Escape") {
        e.preventDefault();
        onEscape?.();
        return;
      }

      if (e.key === "Tab") {
        const focusableElements = getFocusableElements(containerRef.current);
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    },
    [enabled, onEscape]
  );

  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      if (!enabled || !clickOutsideToClose) return;
      if (!containerRef.current) return;

      const target = e.target as HTMLElement;
      if (!containerRef.current.contains(target)) {
        onEscape?.();
      }
    },
    [enabled, clickOutsideToClose, onEscape]
  );

  useEffect(() => {
    if (!enabled) return;

    // Store previously focused element
    previouslyFocusedRef.current = document.activeElement as HTMLElement;

    // Set initial focus
    const container = containerRef.current;
    if (container) {
      if (initialFocusRef?.current) {
        initialFocusRef.current.focus();
      } else {
        const focusable = getFocusableElements(container);
        focusable[0]?.focus();
      }

      document.addEventListener("keydown", handleKeyDown, true);
      if (clickOutsideToClose) {
        document.addEventListener("mousedown", handleClickOutside, true);
      }
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
      document.removeEventListener("mousedown", handleClickOutside, true);

      // Return focus to previously focused element
      if (returnFocusRef?.current) {
        returnFocusRef.current.focus();
      } else if (previouslyFocusedRef.current) {
        previouslyFocusedRef.current.focus();
      }
    };
  }, [enabled, handleKeyDown, handleClickOutside, initialFocusRef, returnFocusRef, clickOutsideToClose]);

  return containerRef;
}

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const focusableSelectors = [
    'button:not([disabled]):not([aria-hidden="true"])',
    'a[href]:not([aria-hidden="true"])',
    'input:not([disabled]):not([aria-hidden="true"])',
    'select:not([disabled]):not([aria-hidden="true"])',
    'textarea:not([disabled]):not([aria-hidden="true"])',
    '[tabindex]:not([tabindex="-1"]):not([aria-hidden="true"])',
    '[contenteditable="true"]:not([aria-hidden="true"])',
  ].join(", ");

  return Array.from(container.querySelectorAll<HTMLElement>(focusableSelectors)).filter(
    (el) => el.offsetWidth > 0 || el.offsetHeight > 0 || el.getClientRects().length > 0
  );
}

// Focus management utilities
export const focusManager = {
  // Store reference to element that should receive focus when modal closes
  returnFocusRef: null as HTMLElement | null,

  setReturnFocus(element: HTMLElement | null) {
    this.returnFocusRef = element;
  },

  getReturnFocus() {
    return this.returnFocusRef;
  },

  // Trap focus within an element
  trapFocus(element: HTMLElement) {
    const focusableElements = getFocusableElements(element);
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    element.addEventListener("keydown", handleTab);
    firstElement.focus();

    return () => {
      element.removeEventListener("keydown", handleTab);
    };
  },

  // Focus first focusable element in container
  focusFirst(container: HTMLElement) {
    const focusable = getFocusableElements(container);
    focusable[0]?.focus();
  },

  // Announce to screen readers
  announce(message: string, priority: "polite" | "assertive" = "polite") {
    const announcer = document.getElementById("vstr-announcer");
    if (announcer) {
      announcer.setAttribute("aria-live", priority);
      announcer.textContent = message;
    }
  },
};

// Screen reader announcer component
export function Announcer() {
  return (
    <div
      id="vstr-announcer"
      role="status"
      aria-live="polite"
      aria-atomic="true"
      style={{
        position: "absolute",
        width: "1px",
        height: "1px",
        padding: "0",
        margin: "-1px",
        overflow: "hidden",
        clip: "rect(0, 0, 0, 0)",
        whiteSpace: "nowrap",
        border: "0",
      }}
    />
  );
}