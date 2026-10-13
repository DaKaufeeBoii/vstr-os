# VSTR-OS User Guide

Welcome to VSTR-OS, an interactive desktop environment portal based on a persistent Virtual File System (VFS).

## 🌅 Getting Started
1. **Boot**: On initial load, you will see a BIOS-style memory check and kernel initialization screen.
2. **Desktop**: Use the desktop icons to launch primary apps.
3. **Start Menu**: Click the Start icon on the taskbar, or press `Alt + S` / `Alt + M` to search and launch applications.
4. **Shortcuts**: Use `Alt + /` or `?` at any time to open the complete interactive Keyboard Shortcuts Guide.
5. **Resume**: Click the Taskbar **Resume (PDF)** button for quick access to your CV.

## 🖥️ System UI Environment

*   **Taskbar**: The central hub for navigation.
    *   **Start Button**: Launch apps (`Alt + S`).
    *   **Task View Button**: Opens window overview and virtual desktops (`Alt + V`).
    *   **Widgets Button**: Toggles the Widgets Board side-panel (`Alt + W`).
    *   **Search Pill**: Click to toggle the Command Palette (`Alt + K`).
    *   **Resume (PDF)**: One-click button that opens the actual resume PDF in a new tab.
    *   **Keyboard Icon (⌨)**: Click to open the Keyboard Shortcuts Guide (`Alt + /`).
    *   **Missions Icon (🏆)**: Shows mission progress widget.
    *   **Taskbar Apps**: Manage active windows.
    *   **System Tray (Right side)**: Quick access to system status and settings.
*   **Quick Settings (`Alt + Q`)**: Click the network/volume tray icon or use the hotkey to access volume and brightness sliders, night mode, and high-contrast accessibility toggles.
*   **Notification & Action Center (`Alt + N`)**: Click the time/date tray pill or use the hotkey to view transient toast history, mission completion logs, and pull up a monthly calendar widget.
*   **Widget Board (`Alt + W`)**: Side-panel for system telemetry (FPS, memory), GitHub activity, and LeetCode stats.
*   **Context Menus**: Right-click most areas to access system context, display settings, personalization, or terminal management. Includes a **Keyboard Shortcuts** shortcut.

## 📁 System Management
*   **Desktop Icons**: Right-click any icon to manipulate its instance state (Minimize/Maximize, Close, Pin to Taskbar) or get app properties.
*   **File Management**: You can create and manage custom `.txt` documents and shortcuts directly on the Desktop.
*   **Desktop Widgets**: Pinned widgets display live system telemetry (FPS, memory, developer stats) synced with background processes.
*   **Window Management**: Windows are fully draggable and resizable. Fixed window spawning logic: maximizing or opening an already running app now correctly brings the existing instance to the foreground instead of spawning a new, resized window.

## 📟 Command Line & Power User
*   **Terminal (Terminal.app)**: A fully functional virtual terminal supporting `ls`, `cd`, `cat`, `rm`, `touch`, and sudo operations on the sandboxed VFS.
*   **Hotkeys** (conflict-free — safe on Windows and all browsers):
    *   `Alt + S` / `Alt + M` — Start Menu
    *   `Alt + K` — Command Palette / Search
    *   `Alt + V` / `Alt + O` — Task View / Window Overview
    *   `Alt + [` / `Alt + ]` — Switch between open windows
    *   `Alt + W` — Widgets Board
    *   `Alt + Q` — Quick Settings
    *   `Alt + N` — Notification Center
    *   `Alt + 1` / `Alt + 2` — Switch Virtual Desktops
    *   `Ctrl + \`` / `Alt + \`` — Terminal Drawer
    *   `Alt + /` or `?` — Keyboard Shortcuts Guide (recallable anytime)
    *   `Esc` — Close modals, menus, and overlays

## 🎮 Gamification, Secrets & Easter Eggs

Explore these hidden system interactions and mini-games to unlock achievements and secrets!

| Secret / Easter Egg | Trigger Command / Action | Detailed Steps |
| :--- | :--- | :--- |
| **BSOD Simulation** | `blue-screen` | Open **Terminal.app**, type `blue-screen` (or `bsod`), and press Enter. |
| **Flappy Bird** | `play flappy` | Open **Terminal.app**, type `play flappy`, and play using the spacebar or clicking the canvas. |
| **Desktop Pet** | `start desktop_pet` | Open **Terminal.app**, type `start desktop_pet`. Interactively interact: Hover and click the pet to pet it, triggering reactions and mood changes. |
| **Hacker Mode** | `crack password` | Open **Terminal.app**, type `crack password`. Follow on-screen prompts to match falling words. |
| **Hint Master** | `ask hintmaster` | Open **Terminal.app**, type `ask hintmaster`. Play the coin toss game to unlock hints. |
| **Disk Repair** | `open disk_cleanup` | Open **Terminal.app**, type `open disk_cleanup`. |
| **Avatar Secret** | Photo Reveal | Open **AboutApp** from the Start Menu, click the pixelated avatar image to reveal the full-resolution photo. |
| **Secret Route** | Browser URL | Navigate to `[your-portfolio-url]/games/secret` directly in your browser. |

*   **Missions**: Interactive app actions (e.g., installing the desktop pet, achieving a score of 10+ in Flappy Bird, completing successful system operations) automatically unlock achievements once per session. These appear as Win11-style system toasts and are logged in your **Notification Center** (`Alt + N`).
