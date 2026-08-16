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
- `src/utils/` — Utility hooks (`useSound.ts`).

---

## 3. Active Applications
- **AboutApp**: Standard profile details.
- **ProjectsApp**: Portfolio projects display.
- **SkillsApp**: Technical skill inventory.
- **ExperienceApp**: Work experience logs.
- **AchievementsApp**: Accomplishments list.
- **ContactApp**: Email and social link panel.
- **SettingsApp**: Interface personalization (theme, static/video wallpapers, performance mode).
- **TerminalApp**: Interactive shell with 30+ commands (`help`, `whoami`, `systeminfo`, `ipconfig`, `tasklist`, `taskkill`, `ping`, `ver`, `wmic`, `get-process`, `tree`, `mkdir`, `cd`, `grep`/`findstr`, `matrix`, `color`, `neofetch`, app launchers).
- **Easter Eggs / Games**:
  - `FlappyGameApp` (Flappy Bird clone)
  - `HintMasterApp` (Decision solver)
  - `DiskCleanupApp` (System cleaner simulation)
  - `DesktopPetApp` (Interactive companion pet)
  - `PasswordCrackerApp` (Hacking typing challenge)
  - `PhotoViewerApp` (Image viewer)

---

## 4. Implemented Features (Windows 11 Realism Upgrade)

### A. Windows 11 Fluent Icon System ��
- Replaced emojis with vector SVGs mapping to Microsoft Fluent design guidelines.
- **Files**: `src/components/icons/FluentIcon.tsx`, `OsIcon.tsx`, categories (`FileSystem`, `Application`, `Taskbar`, `Control`).
- Supports 3 sizes (16px, 20px, 28px), custom colors, and badge overlays (shortcut arrow, lock, shared).

### B. Global Right-Click Context Menu System ��
- Prevents default browser context menu on desktop, icons, taskbar.
- Win11-styled menus with keyboard navigation (ArrowUp/Down, Enter, Escape), viewport flip logic, Framer Motion entrance animation.
- **Configs**: Desktop (View, Sort, Refresh, New, Display settings, Personalize, Open in Terminal), Icon (Open, Pin, Delete, Properties), Taskbar (Task Manager, Show Desktop).

### C. Live Video Wallpaper System �� (replaces WebGL shaders)
- Full-screen HTML5 video wallpapers (MP4/WebM) with loop, mute, playsInline.
- 4 built-in videos: Matrix, Aurora, Synthwave, Starfield (in `public/wallpapers/`).
- Custom video upload support (max 50MB).
- Performance mode pauses video when tab is backgrounded or manually toggled.
- **Files**: `VideoWallpaper.tsx`, updated `SettingsApp.tsx`, `osSettingsStore.tsx`, `Desktop.tsx`.

### D. Expanded Windows Terminal & PowerShell Commands ��
- 30+ commands including system diagnostics, directory navigation, process management, network tools, and app launchers.
- Command history with ArrowUp/Down, Tab completion, ghost text autocomplete.
- Easter egg commands: `matrix`, `color`, `play flappy`, `ask hintmaster`, `crack password`, etc.

### E. Mica/Acrylic Styling & Desktop Polish ��
- Context menus use `backdrop-filter: blur(24px) saturate(160%)` with solid fallback.
- Taskbar, Start Menu, and context menus feature Win11 acrylic/mica aesthetics.
- Smooth Framer Motion animations throughout.

### F. System Tray & Quick Settings (Phase 5) �� **COMPLETED**
- **QuickSettings panel**: Volume slider, brightness slider, Wi-Fi toggle, Battery status (with charging simulation), Focus assist, Accessibility, Bluetooth, Rotation lock, Mobile hotspot, Nearby share, Cast, Night light.
- **Taskbar integration**: Click system tray area (Wi-Fi/Volume/Battery cluster) → opens QuickSettings panel anchored to bottom-right.
- **Keyboard shortcut**: `Win + A` opens QuickSettings.
- **Icons ready**: All required icons exported in `icons/index.ts` including `BluetoothIcon`, `NightLightIcon`, `RotationLockIcon`, `HotspotIcon`, `NearbyShareIcon`, `CastIcon`, `AccessibilityIcon`.

### G. Window Snap Assist �� **COMPLETED**
- Hover maximize button → show 6-zone layout grid (Win11 Snap Assist: left, right, top-left, top-right, bottom-left, bottom-right) → click to snap window to zone.
- `Window.tsx` has `resize: "both"` and `SnapOverlay` component.

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
- �� TypeScript compilation successful
- �� Next.js production build successful
- �� All TypeScript types valid
- ������ ESLint not installed (optional dev dependency)