# VSTR-OS Context File (context-kaufee.md)

This file captures the current state, architecture, and planned enhancements for the **VSTR-OS Portfolio** project.

---

## 1. Project Overview
VSTR-OS is an interactive, Operating System-themed portfolio website for **Sai Tarun Reddy Velagala**. It simulates a fully functional desktop environment with a window manager, standard system utilities, personalization options, and interactive mini-apps/games.

- **Current Repository Root**: `d:\Kaufee\projects\personal\portfolio-website\ggs\vstr-os`
- **Tech Stack**:
  - Next.js 15 (App Router)
  - React 19 + TypeScript
  - Framer Motion (for window drags, transitions, and animations)
  - Tailwind CSS 4 (for styling and utility variables)
  - Custom React Context & `useReducer` for global OS state (`windowStore.tsx`, `osSettingsStore.tsx`)

---

## 2. Directory Structure & Key Files
- `src/app/` — Next.js routing, pages (`/`, `/resume`, `/games/secret`), and layout.
- `src/components/` — Modular components:
  - `os/` — Windows, taskbar, start menu, desktop icons, boot screen, toast manager, context menus, video wallpaper, quick settings.
  - `apps/` — Individual interactive applications loaded dynamically inside windows.
  - `icons/` — Fluent Design SVG icon system with badge support.
  - `resume/` — Resume-specific components.
- `src/store/` — State stores:
  - `windowStore.tsx` — Window manager state (open, minimize, focus, position, z-index).
  - `osSettingsStore.tsx` — OS-wide personalization (theme, wallpaper, video wallpaper, performance mode, notifications, missions).
- `src/data/` — Static data assets, portfolio projects, Easter egg mission list.
- `src/types/` — Shared TypeScript interfaces.
- `src/utils/` — Utility hooks (`useSound.ts`)
- `src/hooks/` — Reusable hooks (`useGlobalHotkeys.ts`, `useFocusTrap.tsx`)

---

## 3. Completed Features

### A. Fluent Design Icon System ✅
- SVG icons from `@fluentui/svg-icons` wrapped in `OsIcon.tsx`.
- Supports 3 sizes (16px, 20px, 28px), custom colors, and badge overlays (shortcut arrow, lock, shared).

### B. Global Right-Click Context Menu System ✅
- Prevents default browser context menu on desktop, icons, taskbar.
- Win11-styled menus with keyboard navigation (ArrowUp/Down, Enter, Escape), viewport flip logic, Framer Motion entrance animation.
- **Configs**: Desktop (View, Sort, Refresh, New, Display settings, Personalize, Open in Terminal), Icon (Open, Pin, Delete, Properties), Taskbar (Task Manager, Show Desktop).

### C. Live Video Wallpaper System ✅ (replaces WebGL shaders)
- Full-screen HTML5 video wallpapers (MP4/WebM) with loop, mute, playsInline.
- 4 built-in videos: Matrix, Aurora, Synthwave, Starfield (in `public/wallpapers/`).
- Custom video upload support (max 50MB).
- Performance mode pauses video when tab is backgrounded or manually toggled.
- **Files**: `VideoWallpaper.tsx`, updated `SettingsApp.tsx`, `osSettingsStore.tsx`, `Desktop.tsx`.

### D. Expanded Windows Terminal & PowerShell Commands ✅
- 30+ commands including system diagnostics, directory navigation, process management, network tools, and app launchers.
- Command history with ArrowUp/Down, Tab completion, ghost text autocomplete.
- Easter egg commands: `matrix`, `color`, `play flappy`, `ask hintmaster`, `crack password`, `blue-screen`/`bsod`, etc.

### E. Mica/Acrylic Styling & Desktop Polish ✅
- Context menus use `backdrop-filter: blur(24px) saturate(160%)` with solid fallback.
- Taskbar, Start Menu, and context menus feature Win11 acrylic/mica aesthetics.
- Smooth Framer Motion animations throughout.

### F. System Tray & Quick Settings ✅ **COMPLETED**
- **QuickSettings panel**: Volume slider, brightness slider, Wi-Fi toggle, Battery status (with charging simulation), Focus assist, Accessibility, Bluetooth, Rotation lock, Mobile hotspot, Nearby share, Cast, Night light.
- **Taskbar integration**: Click system tray area (Wi-Fi/Volume/Battery cluster) → opens QuickSettings panel anchored to bottom-right.
- **Keyboard shortcut**: `Win + A` opens QuickSettings.
- **Icons ready**: All required icons exported in `icons/index.ts` including `BluetoothIcon`, `NightLightIcon`, `RotationLockIcon`, `HotspotIcon`, `NearbyShareIcon`, `CastIcon`, `AccessibilityIcon`.
- **Win11-style toast notifications** in bottom-right (`Win11ToastContainer.tsx`).
- **Notification Center** slide-in panel (`NotificationCenter.tsx`) with dismiss/clear-all actions.
- **System sounds** (`useSound.ts`) integrated into Taskbar buttons, Window traffic lights, and QuickSettings sliders.

### G. Window Snap Assist ✅ **COMPLETED**
- Hover maximize button → show 6-zone layout grid (Win11 Snap Assist: left, right, top-left, top-right, bottom-left, bottom-right) → click to snap window to zone.
- `Window.tsx` has `resize: "both"` and `SnapOverlay` component.

### H. PWA Support ✅ **COMPLETED**
- **Web App Manifest** (`public/manifest.json`) with icons, shortcuts (About, Projects, Terminal), theme color.
- **Service Worker** (`public/sw.js`) with cache-first strategy for static assets, network-first for videos.
- **Installable** on desktop/mobile with offline asset caching.

### I. BSOD Easter Egg ✅ **COMPLETED**
- **Blue Screen of Death** component (`BsodScreen.tsx`) with animated progress bar, random stop codes, fake QR code.
- Triggered via `blue-screen` or `bsod` terminal command.
- Auto-dismisses on any key/click or after 8-10 seconds.
- HintMaster updated with clue about the BSOD command.

---

## 5. Next Planned Work

### Marquee Selection
- Drag on desktop → blue selection box → multi-select icons.
- `Desktop.tsx` already handles `onMouseDown`.

### Terminal History Persistence
- Save `history` array to `localStorage` so it survives reloads.

### GLSL Shader Studio (Future)
- If WebGL shaders are desired later: live code editor with syntax highlighting + compile diagnostics in Settings.

---

## 6. Build Status
- ✅ TypeScript compilation successful
- ✅ Next.js production build successful
- ✅ All TypeScript types valid
- ⚠️ ESLint not installed (optional dev dependency)