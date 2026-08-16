# VSTR-OS UX Excellence Roadmap

## Strategic Decisions (Resolved)
| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Target Device** | Responsive (Mobile + Desktop) | Touch-first responsive patterns required alongside mouse/keyboard |
| **Window Paradigm** | Hybrid (Windows snapping + Exposé overview) | Best of both: snap layouts + keyboard-driven workspace switcher |
| **Core Purpose** | Content Delivery First | Portfolio content reachable in ≤2 clicks; OS is a delivery shell |
| **Terminal** | Persistent Drawer | Always available for quick access; state persists across reloads |

## Strategic Goal
Evolve VSTR-OS into a seamless, accessible, content-first interactive experience that works flawlessly across touch and desktop, using a hybrid window paradigm and persistent Terminal drawer to serve portfolio content efficiently.

## Phased Implementation Plan

### Phase 1: Foundation & Accessibility (WCAG 2.1 AA)
- [ ] Implement system-wide focus management (focus traps in modals, visible focus indicators).
- [ ] Add robust keyboard navigation (Tab order, Esc to close, global shortcuts: `Win`→Start, `Alt+Tab`→Switcher, `Win+Tab`→Exposé).
- [ ] Ensure all semantic elements conform to ARIA standards (roles, labels, live regions for toasts).
- [ ] Touch-target sizing (≥48px) and gesture alternatives for all drag operations.

### Phase 2: Content-First Navigation & Terminal
- [ ] **Terminal Drawer**: Implement as a persistent, global UI component, state preserved across navigation/reloads.
- [ ] **Command Palette / Spotlight Search** (`Win+S` or `Cmd+K`): Fuzzy-search apps, projects, skills, terminal commands.
- [ ] **Exposé-style Window Overview** (`Win+Tab`): Grid view of all open windows + virtual desktops.
- [ ] **Start Menu Redesign**: Prioritize content categories (Projects, Skills, Experience) over app launching.
- [ ] **Quick Actions Bar** (mobile): Persistent bottom bar with Search, Home, Window Overview, Theme toggle.

### Phase 3: Interaction Paradigm Refinement
- [ ] Implement multi-selection on desktop (drag-to-select marquee, `Shift/Cmd`+click).
- [ ] Revise drag-and-drop: support dropping files onto app icons, windows onto snap zones.
- [ ] Context menus: right-click, long-press (touch), `Shift+F10` / `Menu` key.
- [ ] Window snapping: visual preview overlay, `Win+Arrow` keys, drag-to-edge zones.

### Phase 4: Mobile-First Responsive Shell
- [ ] **Collapsible Taskbar**: Auto-hide on scroll, swipe-up for Start/QuickSettings.
- [ ] **Sheet-based Windows**: On mobile, windows become full-screen sheets with grabber; swipe-down to minimize.
- [ ] **Gesture Navigation**: Swipe from left/right edge for back/forward in app history; 3-finger swipe for Exposé.

### Phase 5: User Journey & Onboarding
- [ ] Interactive first-run onboarding (coach marks for Command Palette, Exposé, Theme switcher).
- [ ] Persistent user preferences (theme, reduced motion, animation speed, density) synced to localStorage.
- [ ] "Kiosk Mode" URL params for direct deep-linking to projects (`?open=projects&project=flappy`).

## Validation Strategy
- **Accessibility**: axe-core in CI + manual keyboard-only + screen reader (NVDA/VoiceOver) testing.
- **Responsive**: Device toolbar testing at 375px, 768px, 1440px; touch event simulation.
- **Interaction**: Playwright E2E for Command Palette, Exposé, snap layouts, drag-drop.
- **Performance**: 60fps animation budget; Lighthouse CI for mobile/desktop.

---
*Plan created: 2026-08-14*
*Status: Implementation Ready*
