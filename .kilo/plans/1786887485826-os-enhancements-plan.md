# OS Enhancements Implementation Plan

This plan outlines the implementation of interactive OS features for the VSTR-OS portfolio project to increase functional fidelity and user experience.

## Context
VSTR-OS is an interactive OS-themed portfolio. Currently, basic windowing and desktop navigation are in place. The goal is to elevate this to a functional "experience" by implementing OS-level behaviors (focus, dragging, PWA, etc.).

## Decisions
- **State Management:** Leverage the existing `osSettingsStore` and `windowStore` for global state.
- **Animations:** Use `framer-motion` consistently for window dragging and modal transitions.
- **PWA:** Implement as a installable web application with a `manifest.json` and basic service worker for offline asset caching.
- **Sound:** Use the existing `useSound.ts` for consistent UI interaction feedback.

## Risks
- **Performance:** Complex `framer-motion` drag operations combined with window state updates may impact frame rates on lower-end devices.
- **Z-Index Conflicts:** Overlapping windows and context menus require strict z-index management to ensure proper layering.

## Tasks

### 1. Window Management & Interaction
- [ ] **Z-Index Stack Manager:** Update `windowStore.tsx` to include a `stack` array. Maintain window order and update active `z-index` upon interaction.
- [ ] **Drag-and-Drop:** Integrate `framer-motion` `drag` controls into `src/components/os/Window.tsx` for window movement.

### 2. System Experience
- [ ] **Settings App:** Extend `SettingsApp.tsx` to update theme-related state in `osSettingsStore.tsx` (wallpaper, volume).
- [ ] **Notification Center:** Create `src/components/os/NotificationCenter.tsx` and hook it into system events.
- [ ] **System Sounds:** Integrate `useSound.ts` into taskbar buttons, window events, and menu clicks.

### 3. Polish & Easter Eggs
- [ ] **PWA Configuration:** Add `public/manifest.json` and a basic service worker to enable "Add to Home Screen".
- [ ] **BSOD Easter Egg:** Create `src/components/os/BsodScreen.tsx` and trigger logic (e.g., via a specific terminal command `blue-screen`).

## Validation
- **Functional:** Verify windows can be moved, brought to front, and settings apply globally.
- **Accessibility:** Ensure all new interactive elements are keyboard-navigable.
- **PWA:** Test "Installability" using Chrome Lighthouse audits.

## Open Questions
- None. This plan is ready for implementation by an agent.
