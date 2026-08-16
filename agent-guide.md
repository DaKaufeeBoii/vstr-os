# VSTR-OS Agent Guide

**Version:** 0.1.0  
**Last Updated:** 2026-08-15  
**Maintainer:** Sai Tarun Reddy Velagala

---

## 1. Project Overview

**VSTR-OS** is an interactive, single-page portfolio website that simulates a desktop operating system environment. It serves as both a **showcase of full-stack UI engineering skills** and a **functional portfolio** presenting projects, skills, experience, and contact information.

### Core Purpose
- Demonstrate advanced React/Next.js capabilities: custom window manager, state management, animations, theming, accessibility
- Present portfolio content (projects, skills, experience, achievements) through a unique OS metaphor
- Provide an engaging, memorable experience that differentiates from standard portfolio templates

### Problems Solved
- **Differentiation:** Standard portfolio sites are forgettable; an OS metaphor creates immediate engagement
- **Technical demonstration:** Shows proficiency in complex frontend patterns (drag/resize, focus management, virtualization, persistence)
- **Content organization:** Maps portfolio sections to "apps" — intuitive navigation for technical audiences

---

## 2. Context and Origin

### Background
Created as a personal portfolio for **Sai Tarun Reddy Velagala**, a CS Undergrad & AI Developer. The project evolved from a traditional Next.js portfolio into a full desktop simulation to better represent the developer's interest in systems, developer tools, and interactive UI.

### Motivation
- **Portfolio as product:** Treat the portfolio itself as a project worth showcasing
- **OS metaphor:** Familiar mental model (windows, taskbar, terminal) lowers cognitive load for visitors
- **Easter eggs & depth:** Hidden games (Flappy.exe, Password Cracker) and terminal commands reward exploration
- **Theme as identity:** Three distinct visual themes (Neon Dark, Sunset Amber, Monochrome) reflect design range

### Initial Problem Statement
> "Build a portfolio that doesn't look like a portfolio — make it an experience that demonstrates the engineering skills listed within it."

---

## 3. Functional Scope

### Inputs
| Source | Type | Description |
|--------|------|-------------|
| User interactions | Mouse, keyboard, touch | Drag, click, hotkeys (Win, Alt+Tab, Win+Tab, Win+`, Win+S), gestures |
| localStorage | Persisted state | Theme, wallpaper, terminal history, window positions, unlocked missions |
| Data files | TypeScript modules | Projects, skills, experience, achievements, missions (static at build) |

### Data Domains
- **Window state:** Position, size, z-index, minimized, snap zone, focus
- **OS settings:** Theme (neon/sunset/mono), wallpaper (static/video), performance mode, missions
- **Terminal:** Command history, cwd, accent color, matrix mode, scrollback (1000 lines)
- **Apps:** 14 windowed applications (About, Projects, Skills, Experience, Achievements, Terminal, Contact, Settings, Flappy, HintMaster, Photo Viewer, Disk Cleanup, Desktop Pet, Password Cracker)

### Outputs / End Goals
- **Rendered desktop:** Interactive OS shell with taskbar, start menu, quick settings, wallpaper
- **Windowed apps:** Each portfolio section loads as a draggable, resizable, minimizable window
- **Terminal drawer:** Persistent command-line interface with portfolio-specific commands
- **Mission system:** Gamified progression unlocking achievements via exploration
- **Responsive behavior:** Mobile → fullscreen windows, sheet-style drawers, collapsible taskbar

---

## 4. Architecture and Workflow

### High-Level Component Tree
```
app/
  layout.tsx          → Root HTML, fonts, mounts TerminalDrawer
  page.tsx            → Providers (OSSettingsProvider → OSProvider) → Desktop
  globals.css         → Design tokens, theme overrides, base styles
components/
  os/
    Desktop.tsx       → Root shell, window list, z-index, global hotkeys, theme sync
    Window.tsx        → Window chrome, drag/resize/snap, focus trap, traffic lights
    Taskbar.tsx       → Start button, app buttons, clock, missions widget, quick settings
    StartMenu.tsx     → App launcher, search, recommended links, shutdown confirm
    QuickSettings.tsx → Theme picker, wallpaper, performance, volume/wifi/battery
    ContextMenu/      → Right-click menus (desktop, icons, titlebar)
    VideoWallpaper.tsx→ <video> element for live wallpapers
  apps/
    *App.tsx          → 14 window content components (portfolio sections + games)
hooks/
  useGlobalHotkeys.ts → Centralized hotkey registry (Win, Alt+Tab, Win+Tab, etc.)
  useFocusTrap.ts     → Focus management, announcer, click-outside, escape
store/
  windowStore.tsx     → Window state (reducer + context) — 14 windows + UI modals
  osSettingsStore.tsx → Theme, wallpaper, video, perf mode, missions (reducer + context)
data/
  projects.ts, skills.ts, experience.ts, achievements.ts, systemMissions.ts
types/
  index.ts            → WindowId, WindowConfig, SnapZone, OSNotification, Theme
```

### State Management
- **Two independent Context+Reducer stores** (no external library):
  1. `windowStore` — High-frequency updates (drag, focus, z-index); isolated to avoid re-renders on settings changes
  2. `osSettingsStore` — Low-frequency persistence (theme, wallpaper, missions); hydrates from localStorage
- **No global event bus** — Direct context consumption via `useOS()` / `useOSSettings()`

### Rendering Workflow
1. `app/page.tsx` mounts providers
2. `Desktop` reads `windows` from `windowStore`, renders each open `Window` with its app content
3. `Window` components consume `useOS()` for drag/focus/snap actions
4. `Taskbar`/`StartMenu`/`QuickSettings` consume both stores
5. Theme changes → `useEffect` in `Desktop` sets `document.documentElement.dataset.theme` → CSS variables update globally

### Key Interactions
| Interaction | Flow |
|-------------|------|
| Open app | Taskbar/StartMenu → `openWindow(id)` → reducer sets `isOpen=true`, assigns z-index, cascades position |
| Drag window | `Window` titlebar `onMouseDown` → `moveWindow` via `window.addEventListener('mousemove')` |
| Snap | Hover maximize → `SnapOverlay` click → `snapWindow(id, zone)` → reducer calculates geometry |
| Theme switch | SettingsApp → `setTheme('sunset')` → localStorage + reducer → `Desktop` useEffect → `html[data-theme]` |
| Hotkey (Win+`) | `useGlobalHotkeys` in `Desktop` → `toggleTerminalDrawer()` → TerminalDrawer animates from bottom |

---

## 5. Development Lifecycle

### Recreating from Scratch

#### 1. Initialize Project
```bash
npx create-next-app@latest vstr-os --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd vstr-os
npm i framer-motion lucide-react
```

#### 2. Design Tokens (globals.css)
```css
:root {
  /* Primitives */
  --color-slate-950: #020617;
  --color-amber-500: #f59e0b;
  --color-emerald-500: #10b981;
  /* Semantic */
  --os-bg: var(--color-slate-950);
  --os-primary: var(--color-amber-500);
  --os-secondary: var(--color-emerald-500);
  --os-surface: rgba(15, 23, 42, 0.88);
  --os-border: rgba(51, 65, 85, 0.5);
  --os-text: #e8edf4;
  --os-text-muted: #8b929e;
}
[data-theme="sunset"] { --os-bg: #1a0e1a; --os-primary: #fb7185; ... }
[data-theme="mono"]   { --os-bg: #0a0a0a; --os-primary: #e2e8f0; ... }
```

#### 3. Store Pattern (windowStore.tsx)
```typescript
// 1. Define configs
export const WINDOW_CONFIGS: WindowConfig[] = [ ... ]

// 2. State + Action types
interface WindowState { ... }
interface OSState { windows: WindowState[]; topZ: number; ... }
type OSAction = | { type: 'OPEN'; id: WindowId } | ...

// 3. Reducer (pure, synchronous)
function reducer(state: OSState, action: OSAction): OSState { ... }

// 4. Context + Provider
const OSContext = createContext<OSContextValue | null>(null)
export function OSProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, buildInitial)
  // memoized callbacks...
  return <OSContext.Provider value={{...}}>{children}</OSContext.Provider>
}
export function useOS() { ... }
```

#### 4. Window Component (Window.tsx)
- `useOS()` for actions
- `framer-motion` for enter/exit animations
- Custom drag logic with `window.addEventListener('mousemove')`
- Snap overlay on maximize hover
- `useFocusTrap` for accessibility
- Traffic lights with semantic colors (close/min/max)

#### 5. Desktop Shell (Desktop.tsx)
- Renders wallpaper (static + video)
- Maps `windows` → `<Window key={id} ...><AppContent /></Window>`
- `useGlobalHotkeys` for Win/Win+Tab/Alt+Tab/Win+`
- `useEffect` syncs `theme` to `document.documentElement.dataset.theme`

#### 6. Persistence (osSettingsStore.tsx)
- Hydrate from localStorage in `useEffect` (run once)
- Dispatch `SET_THEME`, `SET_WALLPAPER` on changes
- Persist to localStorage in action callbacks

### Structural Patterns
| Pattern | Usage |
|---------|-------|
| **Config-driven windows** | `WINDOW_CONFIGS` array → single source of truth for titles, icons, default sizes |
| **Reducer + Context** | Two stores, no prop drilling, memoized callbacks |
| **CSS variables for theming** | Semantic tokens (`--os-primary`) + `[data-theme]` overrides |
| **Portal modals** | StartMenu, QuickSettings, SnapOverlay render at fixed z-index via `position: fixed` |
| **Framer Motion AnimatePresence** | Enter/exit animations for windows, menus, toasts |
| **Lucide icons via wrapper** | `OsIcon` registry → swap icon sets without changing components |

### Implementation Best Practices
1. **Keep stores separate** — Window state changes 60fps during drag; settings change rarely
2. **Memoize context values** — `useCallback` for every action function
3. **Use CSS variables everywhere** — No hardcoded colors; enables instant theme switching
4. **Accessibility first** — `role="dialog"`, `aria-modal`, `aria-label`, focus trap, `Esc` to close
5. **Respect reduced motion** — `@media (prefers-reduced-motion)` disables spring animations
6. **Mobile-first breakpoints** — 768px: windows become fullscreen sheets; taskbar collapses
7. **TypeScript strict** — `WindowId` union type prevents typos; `WindowConfig` typed

---

## 6. Operational Guidelines

### Mental Model for Contributors

#### Think in "OS Primitives"
- **Windows** are the primary UI unit — not pages, not modals
- **Z-index stacking** = focus order — only one focused window at a time
- **Taskbar** = window list + system tray — mirrors open windows
- **StartMenu** = app launcher + search — not a dropdown, a full-screen dialog
- **Terminal** = persistent drawer — survives route changes, mounted in `layout.tsx`

#### When Adding a New App
1. Add entry to `WINDOW_CONFIGS` in `windowStore.tsx` (id, title, icon, fluentIcon, defaultW/H)
2. Create `src/components/apps/NewApp.tsx` — receives no props, reads data from `@/data/*`
3. Import in `Desktop.tsx` → add to `APP_CONTENT` record
4. App renders inside `<Window>` — use `noPadding` for full-bleed content (games, viewers)

#### When Adding a Hotkey
```typescript
// In Desktop.tsx useGlobalHotkeys call:
{ keys: ['Meta', 'KeyK'], description: 'Open Command Palette', handler: openCommandPalette }
```
- Use `Meta` for Win/⌘ key
- Set `allowInInput: true` for global shortcuts (Win, Escape)

#### When Modifying Themes
1. Update `Theme` type in `osSettingsStore.tsx`
2. Add `[data-theme="newtheme"]` block in `globals.css` with ALL semantic tokens
3. Add to `VALID_THEMES` and `THEME_PRESETS`
4. Update `SettingsApp.tsx` themes array
5. Test high-contrast overrides in `@media (prefers-contrast: high)`

#### When Changing Window Behavior
- Drag logic: `Window.tsx` lines 136-170
- Snap zones: `Window.tsx` lines 157-182 + `SnapOverlay` component
- Cascade offset: `windowStore.tsx` line 72 (`cascadeOffset`)
- Focus/raise: `FOCUS` action in reducer

### File Conventions
| File | Convention |
|------|------------|
| `*App.tsx` | Window content components — default export, no props |
| `*Store.tsx` | Context + Reducer — `useX` hook + `XProvider` |
| `use*.ts/tsx` | Custom hooks — single responsibility |
| `globals.css` | Design tokens only — no component styles |
| `types/index.ts` | Shared TypeScript interfaces |

### Testing Checklist (Manual)
- [ ] All 14 apps open, drag, resize, minimize, close, snap
- [ ] Theme switch (neon/sunset/mono) updates entire UI instantly
- [ ] Wallpaper change persists after reload
- [ ] Terminal drawer: history, commands, localStorage persistence
- [ ] Hotkeys: Win (Start), Win+Tab (Exposé), Alt+Tab, Win+`, Win+S, Escape
- [ ] Mobile: windows fullscreen, taskbar collapses, touch drag works
- [ ] Accessibility: Tab navigation, focus visible, screen reader labels
- [ ] Reduced motion: animations disabled
- [ ] High contrast: borders visible, colors pass WCAG AA

### Performance Notes
- **Window count:** 14 max — minimal re-render cost
- **Drag:** Uses raw `window.addEventListener` — no React state during drag
- **Animations:** Framer Motion spring (stiffness 340, damping 28) — 60fps on modern devices
- **Video wallpapers:** `<video preload="metadata" muted loop playsInline>` — paused in performance mode
- **Bundle:** ~400KB First Load JS — acceptable for portfolio

### Deployment
```bash
npm run build   # Static export (output: .next/server)
# Deploy to Vercel/Netlify — zero config
```

---

## Appendix: Key Files Quick Reference

| File | Responsibility |
|------|----------------|
| `src/store/windowStore.tsx` | Window state machine (open, close, move, snap, focus, z-index) |
| `src/store/osSettingsStore.tsx` | Theme, wallpaper, video, performance, missions persistence |
| `src/components/os/Desktop.tsx` | Root composition, global hotkeys, theme sync to `<html>` |
| `src/components/os/Window.tsx` | Window chrome, drag, resize, snap overlay, focus trap |
| `src/components/os/Taskbar.tsx` | Start button, app tabs, clock, missions widget, quick settings trigger |
| `src/components/os/StartMenu.tsx` | App grid, search, recommended links, shutdown confirm |
| `src/components/os/QuickSettings.tsx` | Theme picker, wallpaper grid, performance toggle, system sliders |
| `src/hooks/useGlobalHotkeys.ts` | Centralized keyboard shortcut registry |
| `src/hooks/useFocusTrap.ts` | Focus management, escape handling, live announcer |
| `src/app/globals.css` | Design tokens, theme overrides, base styles, accessibility |
| `src/data/*.ts` | Portfolio content (projects, skills, experience, achievements, missions) |

---

**End of Agent Guide**