# VSTR-OS User Guide

Welcome to VSTR-OS, an interactive desktop environment portal based on a persistent Virtual File System (VFS).

## 🌅 Getting Started
1. **Boot**: On initial load, you will see a BIOS-style memory check and kernel initialization screen.
2. **Desktop**: Use the desktop icons to launch primary apps.
3. **Start Menu**: Click the Start icon on the taskbar, or press `Ctrl + Space` / `Alt + S` to search and launch applications.

## 🖥️ System UI Environment

*   **Taskbar**: The central hub for navigation.
    *   **Start Button**: Launch apps.
    *   **Taskbar Apps**: Manage active windows.
    *   **System Tray (Right side)**: Provides quick access to system status and settings.
*   **Quick Settings (Win + A)**: Click the network/volume tray icon or use the hotkey to access volume and brightness sliders, night mode, and high-contrast accessibility toggles.
*   **Notification & Action Center (Win + N)**: Click the time/date tray pill or use the hotkey to view transient toast history, mission completion logs, and pull up a monthly calendar widget.
*   **Widget Board (Alt + W)**: Side-panel for system telemetry (FPS, memory), GitHub activity, and LeetCode stats. Use the gear icon within to customize widget visibility on Board vs. Desktop.
*   **Context Menus**: Right-click most areas to access system context, display settings, personalization, or terminal management.

## 📁 System Management
*   **Desktop Icons**: Right-click any icon to manipulate its instance state (Minimize/Maximize, Close, Pin to Taskbar) or get app properties.
*   **Desktop Widgets**: If enabled in settings, widgets can be pinned directly to the desktop canvas for live metrics at a glance.
*   **Window Management**: Windows are fully draggable and resizable. Use the top bar to snap windows, maximize, or minimize.

## 📟 Command Line & Power User
*   **Terminal (Terminal.app)**: A fully functional virtual terminal supporting `ls`, `cd`, `cat`, `rm`, `touch`, `mkdir`, and sudo operations on the sandboxed VFS.
*   **Hotkeys**:
    *   `Win+A`: Quick Settings
    *   `Win+N`: Notification Center
    *   `Alt+A` / `Alt+N`: Alternatives to above
    *   `Alt+W`: Widgets
    *   `Ctrl+K` / `Alt+K`: Command Palette
    *   `Ctrl+` or `Alt+``: Terminal Drawer (for quick command entry without opening full window)

## 🎮 Gamification & Secrets
*   **Missions**: App actions (e.g., install desktop pet, high-score in games, clear disk sectors) unlock achievements that appear in your Notification Center and Win11-style toasts.
*   **Easter Eggs**: 
    *   **BSOD**: Trigger a blue screen in the terminal (`blue-screen` or `bsod`). 
    *   **Secret Route**: Visit `/games/secret`.
    *   **Hacker Mode**: PwnTool (`password_cracker`) typing challenge.
    *   **Desktop Companion**: Install the Desktop Pet (`desktop_pet`).
    *   **Disk Repair**: Disk Cleanup game (`disk_cleanup`).
    *   **Hint Master**: Use `hintmaster` to play a coin toss mini-game and unlock tips.
