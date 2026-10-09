"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import DesktopIcon from "./DesktopIcon";
import Taskbar from "./Taskbar";
import Window from "./Window";
import BootScreen from "./BootScreen";
import OnboardingTip from "./OnboardingTip";
import Win11ToastContainer from "./Win11ToastContainer";
import PropertiesModal, { type PropertiesItemInfo } from "./PropertiesModal";
import { WINDOW_CONFIGS, useOS } from "@/store/windowStore";
import { useOSSettings, type VideoWallpaperId } from "@/store/osSettingsStore";
import { useVFS } from "@/lib/vfs/useVFS";
import type { WindowConfig, WindowId } from "@/types";

import { useGlobalHotkeys } from "@/hooks/useGlobalHotkeys";
import { Announcer } from "@/hooks/useFocusTrap";

import { DynamicAppLoader } from "./DynamicAppLoader";
import { appRegistry } from "@/lib/sdk/appRegistry";
import AboutApp        from "@/components/apps/AboutApp";
import ProjectsApp     from "@/components/apps/ProjectsApp";
import SkillsApp       from "@/components/apps/SkillsApp";
import ExperienceApp   from "@/components/apps/ExperienceApp";
import AchievementsApp from "@/components/apps/AchievementsApp";
import TerminalApp     from "@/components/apps/TerminalApp";
import ContactApp      from "@/components/apps/ContactApp";
import SettingsApp     from "@/components/apps/SettingsApp";

import MusicPlayerApp      from "@/components/apps/MusicPlayerApp";
import FlappyGameApp      from "@/components/apps/FlappyGameApp";
import HintMasterApp      from "@/components/apps/HintMasterApp";
import PhotoViewerApp     from "@/components/apps/PhotoViewerApp";
import DiskCleanupApp     from "../apps/DiskCleanupApp";
import DesktopPetApp      from "../apps/DesktopPetApp";
import PasswordCrackerApp from "../apps/PasswordCrackerApp";
import NotepadApp         from "@/components/apps/NotepadApp";
import GuestbookApp       from "@/components/apps/GuestbookApp";
import AppGalleryApp      from "@/components/apps/AppGalleryApp";

import VideoWallpaper          from "./VideoWallpaper";
import BsodScreen              from "./BsodScreen";
import TaskView                from "./TaskView";
import WidgetBoard             from "./WidgetBoard";
import CommandPalette          from "./CommandPalette";
import QuickSettings           from "./QuickSettings";
import NotificationCenter      from "./NotificationCenter";
import { DesktopWidgets }      from "./DesktopWidgets";
import { useSound }            from "@/utils/useSound";
import { ContextMenu }         from "./ContextMenu/ContextMenu";
import { useContextMenu }      from "./ContextMenu/hooks/useContextMenu";
import { getDesktopMenuGroups } from "./ContextMenu/configs/desktopMenu";
import { getTaskbarMenuGroups } from "./ContextMenu/configs/taskbarMenu";
import { getIconMenuGroups }   from "./ContextMenu/configs/iconMenu";
import type { ContextMenuGroupDef } from "./ContextMenu/ContextMenuGroup";

const APP_CONTENT: Record<string, React.ReactNode> = {
  about:            <AboutApp />,
  projects:         <ProjectsApp />,
  skills:           <SkillsApp />,
  experience:       <ExperienceApp />,
  achievements:     <AchievementsApp />,
  contact:          <ContactApp />,
  flappy:           <FlappyGameApp />,
  hintmaster:       <HintMasterApp />,
  photo_viewer:     <PhotoViewerApp />,
  disk_cleanup:     <DiskCleanupApp />,
  desktop_pet:      <DesktopPetApp />,
  password_cracker: <PasswordCrackerApp />,
  app_gallery:      <AppGalleryApp />,
  music_player:     <MusicPlayerApp />,
};

const WALLPAPER_PRESETS = [
  { path: "/wallpapers/static/os_wallpaper.png", name: "VSTR-OS Default" },
  { path: "/wallpapers/static/wallpaper_aurora.png", name: "Midnight Aurora" },
  { path: "/wallpapers/static/wallpaper_cyber_grid.png", name: "Cyber Grid" },
  { path: "/wallpapers/static/wallpaper_nebula.png", name: "Nebula Space" },
  { path: "/wallpapers/static/batman.jpg", name: "Dark Knight" },
  { path: "/wallpapers/static/guts.jpg", name: "Berserker" },
  { path: "/wallpapers/static/gear-5.jpg", name: "Gear 5" },
  { path: "/wallpapers/static/Madara-Uchiha.jpg", name: "Infinite Tsukuyomi" },
  { path: "/wallpapers/static/ui-goku.jpg", name: "Ultra Instinct" },
];

const APP_SIZES: Record<string, { size: string; kb: number }> = {
  projects:         { size: "4.8 MB", kb: 4800 },
  music_player:     { size: "3.2 MB", kb: 3200 },
  password_cracker: { size: "2.8 MB", kb: 2800 },
  photo_viewer:     { size: "2.6 MB", kb: 2600 },
  terminal:         { size: "2.4 MB", kb: 2400 },
  app_gallery:      { size: "2.1 MB", kb: 2100 },
  settings:         { size: "1.8 MB", kb: 1800 },
  desktop_pet:      { size: "1.7 MB", kb: 1700 },
  disk_cleanup:     { size: "1.4 MB", kb: 1400 },
  about:            { size: "1.2 MB", kb: 1200 },
  flappy:           { size: "1.1 MB", kb: 1100 },
  skills:           { size: "950 KB", kb: 950 },
  experience:       { size: "820 KB", kb: 820 },
  hintmaster:       { size: "780 KB", kb: 780 },
  achievements:     { size: "750 KB", kb: 750 },
  guestbook:        { size: "620 KB", kb: 620 },
  notepad:          { size: "450 KB", kb: 450 },
  contact:          { size: "340 KB", kb: 340 },
};

interface CustomDesktopItem {
  id: string;
  title: string;
  type: "folder" | "text" | "shortcut";
  icon: string;
  fluentIcon: string;
  filePath?: string;
  url?: string;
  size?: string;
  kb?: number;
  createdAt: number;
}

export default function Desktop() {
  const {
    openWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    focusWindow,
    restoreWindow,
    windows,
    workspaces,
    activeWorkspaceId,
    switchWorkspace,
    addWorkspace,
    toggleExposé,
    closeExposé,
    toggleCommandPalette,
    closeCommandPalette,
    toggleTerminalDrawer,
    closeTerminalDrawer,
    isExposéOpen,
    isCommandPaletteOpen,
    isTerminalDrawerOpen,
    isWidgetBoardOpen,
    toggleWidgetBoard,
    closeWidgetBoard,
    isQuickSettingsOpen,
    toggleQuickSettings,
    closeQuickSettings,
    isNotificationCenterOpen,
    toggleNotificationCenter,
    closeNotificationCenter,
    pinApp,
    unpinApp,
    pinnedApps,
  } = useOS();

  const {
    wallpaper,
    setWallpaper,
    videoWallpaper,
    setVideoWallpaper,
    performanceMode,
    unlockMission,
    addNotification,
  } = useOSSettings();

  const vfs = useVFS();
  const { playClick } = useSound();

  const [booting, setBooting] = useState(true);
  const [showBsod, setShowBsod] = useState(false);

  // Desktop View and Options State
  const [iconSize, setIconSize] = useState<"small" | "medium" | "large">("medium");
  const [autoArrange, setAutoArrange] = useState(true);
  const [alignToGrid, setAlignToGrid] = useState(true);
  const [showDesktopIcons, setShowDesktopIcons] = useState(true);
  const [sortBy, setSortBy] = useState<"name" | "size" | "type" | "date" | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [customItems, setCustomItems] = useState<CustomDesktopItem[]>([]);
  const [propertiesModalItem, setPropertiesModalItem] = useState<PropertiesItemInfo | null>(null);

  // Load persisted desktop preferences from localStorage
  useEffect(() => {
    try {
      const savedPrefs = localStorage.getItem("vstr_desktop_prefs");
      if (savedPrefs) {
        const parsed = JSON.parse(savedPrefs);
        if (parsed.iconSize) setIconSize(parsed.iconSize);
        if (typeof parsed.autoArrange === "boolean") setAutoArrange(parsed.autoArrange);
        if (typeof parsed.alignToGrid === "boolean") setAlignToGrid(parsed.alignToGrid);
        if (typeof parsed.showDesktopIcons === "boolean") setShowDesktopIcons(parsed.showDesktopIcons);
      }
      const savedCustom = localStorage.getItem("vstr_desktop_custom_items");
      if (savedCustom) {
        setCustomItems(JSON.parse(savedCustom));
      }
    } catch {
      // Ignore JSON parse errors
    }
  }, []);

  // Save desktop preferences when updated
  const savePreferences = useCallback(
    (prefs: Partial<{ iconSize: "small" | "medium" | "large"; autoArrange: boolean; alignToGrid: boolean; showDesktopIcons: boolean }>) => {
      try {
        const current = {
          iconSize,
          autoArrange,
          alignToGrid,
          showDesktopIcons,
          ...prefs,
        };
        localStorage.setItem("vstr_desktop_prefs", JSON.stringify(current));
      } catch {
        // Ignore quota/private errors
      }
    },
    [iconSize, autoArrange, alignToGrid, showDesktopIcons]
  );

  const saveCustomItems = useCallback((items: CustomDesktopItem[]) => {
    setCustomItems(items);
    try {
      localStorage.setItem("vstr_desktop_custom_items", JSON.stringify(items));
    } catch {
      // Ignore
    }
  }, []);

  const {
    isOpen: isContextMenuOpen,
    position: contextMenuPos,
    openMenu: triggerContextMenu,
    closeMenu: closeContextMenu,
  } = useContextMenu();

  const [contextMenuGroups, setContextMenuGroups] = useState<ContextMenuGroupDef[]>([]);

  // Base ordered apps
  const baseConfigs = [
    WINDOW_CONFIGS.find((c: WindowConfig) => c.id === "about"),
    WINDOW_CONFIGS.find((c: WindowConfig) => c.id === "skills"),
    WINDOW_CONFIGS.find((c: WindowConfig) => c.id === "projects"),
    WINDOW_CONFIGS.find((c: WindowConfig) => c.id === "experience"),
    WINDOW_CONFIGS.find((c: WindowConfig) => c.id === "achievements"),
    WINDOW_CONFIGS.find((c: WindowConfig) => c.id === "notepad"),
    WINDOW_CONFIGS.find((c: WindowConfig) => c.id === "guestbook"),
    WINDOW_CONFIGS.find((c: WindowConfig) => c.id === "contact"),
    WINDOW_CONFIGS.find((c: WindowConfig) => c.id === "terminal"),
    WINDOW_CONFIGS.find((c: WindowConfig) => c.id === "settings"),
    WINDOW_CONFIGS.find((c: WindowConfig) => c.id === "app_gallery"),
    WINDOW_CONFIGS.find((c: WindowConfig) => c.id === "music_player"),
  ].filter(Boolean) as WindowConfig[];

  // ── Actions for Context Menu ───────────────────────────────────────
  const handleRefresh = useCallback(() => {
    playClick();
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 300);
    addNotification?.("Desktop Refreshed", "Icons and cache synchronized.", "🔄");
  }, [playClick, addNotification]);

  const handleNextWallpaper = useCallback(() => {
    playClick();
    const curIdx = WALLPAPER_PRESETS.findIndex((p) => p.path === wallpaper);
    const nextIdx = (curIdx + 1) % WALLPAPER_PRESETS.length;
    const next = WALLPAPER_PRESETS[nextIdx];
    setWallpaper(next.path);
    setVideoWallpaper("none");
    addNotification?.("Wallpaper Changed", `Active background: ${next.name}`, "🖼️");
  }, [wallpaper, setWallpaper, setVideoWallpaper, playClick, addNotification]);

  const handleNewFolder = useCallback(() => {
    playClick();
    const folderNum = customItems.filter((i) => i.type === "folder").length;
    const title = folderNum === 0 ? "New Folder" : `New Folder (${folderNum + 1})`;
    const id = `folder-${Date.now()}`;
    const newItem: CustomDesktopItem = {
      id,
      title,
      type: "folder",
      icon: "📁",
      fluentIcon: "folder",
      createdAt: Date.now(),
      size: "0 KB",
      kb: 0,
    };
    saveCustomItems([...customItems, newItem]);
    if (vfs.isReady) {
      vfs.mkdir(`/home/saitarun/Desktop/${title}`, "guest", true);
    }
    addNotification?.("Folder Created", `Created "${title}" on Desktop`, "📁");
  }, [customItems, saveCustomItems, playClick, vfs, addNotification]);

  const handleNewTextDocument = useCallback(() => {
    playClick();
    const docNum = customItems.filter((i) => i.type === "text").length;
    const title = docNum === 0 ? "New Text Document.txt" : `New Text Document (${docNum + 1}).txt`;
    const filePath = `/home/saitarun/Desktop/${title}`;
    const id = `doc-${Date.now()}`;
    const newItem: CustomDesktopItem = {
      id,
      title,
      type: "text",
      icon: "📝",
      fluentIcon: "notepad",
      filePath,
      createdAt: Date.now(),
      size: "1 KB",
      kb: 1,
    };
    saveCustomItems([...customItems, newItem]);
    if (vfs.isReady) {
      vfs.writeFile(filePath, `// ${title}\nCreated on VSTR-OS Desktop.\n`, "guest");
    }
    addNotification?.("Text Document Created", `Created "${title}" on Desktop`, "📝");
  }, [customItems, saveCustomItems, playClick, vfs, addNotification]);

  const handleNewShortcut = useCallback(() => {
    playClick();
    const title = "Sai Tarun GitHub";
    const id = `shortcut-${Date.now()}`;
    const newItem: CustomDesktopItem = {
      id,
      title,
      type: "shortcut",
      icon: "🔗",
      fluentIcon: "link",
      url: "https://github.com/DaKaufeeBoii",
      createdAt: Date.now(),
      size: "1 KB",
      kb: 1,
    };
    saveCustomItems([...customItems, newItem]);
    addNotification?.("Shortcut Created", `Added shortcut to GitHub`, "🔗");
  }, [customItems, saveCustomItems, playClick, addNotification]);

  const handleDeleteCustomItem = useCallback(
    (id: string) => {
      playClick();
      const itemToDelete = customItems.find((i) => i.id === id);
      if (itemToDelete) {
        if (itemToDelete.filePath && vfs.isReady) {
          vfs.remove(itemToDelete.filePath, "guest", true);
        }
        saveCustomItems(customItems.filter((i) => i.id !== id));
        addNotification?.("Item Deleted", `Moved "${itemToDelete.title}" to Recycle Bin`, "🗑️");
      }
    },
    [customItems, saveCustomItems, playClick, vfs, addNotification]
  );

  const handleOpenDesktopProperties = useCallback(() => {
    setPropertiesModalItem({
      id: "desktop",
      title: "VSTR-OS Desktop",
      type: "System Desktop Directory",
      fluentIcon: "display",
      location: "C:\\Users\\saitarun\\Desktop",
      size: "18.4 MB (19,293,760 bytes)",
      sizeOnDisk: "18.8 MB",
      isSystem: true,
      description: "Active Desktop Environment Shell",
    });
  }, []);

  const openDesktopMenuAt = useCallback(
    (x: number, y: number) => {
      setContextMenuGroups(
        getDesktopMenuGroups(
          {
            iconSize,
            autoArrange,
            alignToGrid,
            showDesktopIcons,
            sortBy,
            showMoreOptions,
          },
          {
            setIconSize: (size) => {
              setIconSize(size);
              savePreferences({ iconSize: size });
            },
            toggleAutoArrange: () => {
              setAutoArrange((prev) => {
                const next = !prev;
                savePreferences({ autoArrange: next });
                return next;
              });
            },
            toggleAlignToGrid: () => {
              setAlignToGrid((prev) => {
                const next = !prev;
                savePreferences({ alignToGrid: next });
                return next;
              });
            },
            toggleShowDesktopIcons: () => {
              setShowDesktopIcons((prev) => {
                const next = !prev;
                savePreferences({ showDesktopIcons: next });
                return next;
              });
            },
            setSortBy: (sort) => {
              setSortBy(sort);
            },
            refresh: handleRefresh,
            newFolder: handleNewFolder,
            newShortcut: handleNewShortcut,
            newTextDocument: handleNewTextDocument,
            openDisplaySettings: () => openWindow({ id: "settings", customData: { section: "display" } }),
            openPersonalizeSettings: () => openWindow({ id: "settings", customData: { section: "personalize" } }),
            openTerminal: () => openWindow({ id: "terminal", customData: { initialCwd: "/home/saitarun/Desktop" } }),
            toggleMoreOptions: () => setShowMoreOptions((prev) => !prev),
            nextWallpaper: handleNextWallpaper,
            openCommandPalette: toggleCommandPalette,
            openQuickSettings: toggleQuickSettings,
            openWidgetBoard: toggleWidgetBoard,
            openTaskView: toggleExposé,
            openProperties: handleOpenDesktopProperties,
            openAbout: () => openWindow("about"),
          }
        )
      );
      triggerContextMenu({ clientX: x, clientY: y });
    },
    [
      iconSize,
      autoArrange,
      alignToGrid,
      showDesktopIcons,
      sortBy,
      showMoreOptions,
      savePreferences,
      handleRefresh,
      handleNewFolder,
      handleNewShortcut,
      handleNewTextDocument,
      openWindow,
      handleNextWallpaper,
      toggleCommandPalette,
      toggleQuickSettings,
      toggleWidgetBoard,
      toggleExposé,
      handleOpenDesktopProperties,
      triggerContextMenu,
    ]
  );

  const handleDesktopContextMenu = useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest(".os-window") || target.closest(".os-taskbar") || target.closest(".desktop-icon")) {
        return;
      }
      e.preventDefault();
      openDesktopMenuAt(e.clientX, e.clientY);
    },
    [openDesktopMenuAt]
  );

  // Touch long press on desktop background for mobile & tablet
  const desktopTouchTimer = useRef<NodeJS.Timeout | null>(null);
  const desktopTouchStartPos = useRef<{ x: number; y: number } | null>(null);

  const handleDesktopTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest(".os-window") || target.closest(".os-taskbar") || target.closest(".desktop-icon")) {
        return;
      }
      const touch = e.touches[0];
      desktopTouchStartPos.current = { x: touch.clientX, y: touch.clientY };
      if (desktopTouchTimer.current) clearTimeout(desktopTouchTimer.current);
      desktopTouchTimer.current = setTimeout(() => {
        openDesktopMenuAt(touch.clientX, touch.clientY);
      }, 500);
    },
    [openDesktopMenuAt]
  );

  const handleDesktopTouchMove = useCallback((e: React.TouchEvent) => {
    if (!desktopTouchStartPos.current) return;
    const touch = e.touches[0];
    const diffX = Math.abs(touch.clientX - desktopTouchStartPos.current.x);
    const diffY = Math.abs(touch.clientY - desktopTouchStartPos.current.y);
    if (diffX > 10 || diffY > 10) {
      if (desktopTouchTimer.current) clearTimeout(desktopTouchTimer.current);
    }
  }, []);

  const handleDesktopTouchEnd = useCallback(() => {
    if (desktopTouchTimer.current) clearTimeout(desktopTouchTimer.current);
    desktopTouchStartPos.current = null;
  }, []);

  const handleIconContextMenu = useCallback(
    (
      e: React.MouseEvent | { clientX: number; clientY: number },
      id: WindowId | string,
      label: string,
      fluentIcon?: string,
      isCustom?: boolean
    ) => {
      const isRunning = windows.some((w) => w.id === id && w.isOpen);
      const isPinned = pinnedApps.includes(id as WindowId);

      setContextMenuGroups(
        getIconMenuGroups({
          id,
          label,
          fluentIcon,
          isOpenWindow: isRunning,
          isPinned,
          isCustom,
          onOpen: (appId) => {
            const custom = customItems.find((c) => c.id === appId);
            if (custom) {
              if (custom.type === "text") {
                openWindow({ id: "notepad", title: custom.title, customData: { filePath: custom.filePath } });
              } else if (custom.type === "folder") {
                openWindow({ id: "projects", title: custom.title });
              } else if (custom.url) {
                window.open(custom.url, "_blank");
              }
            } else {
              openWindow(appId as WindowId);
            }
          },
          onMinimize: (appId) => {
            const win = windows.find((w) => w.id === appId && w.isOpen);
            if (win) minimizeWindow(win.instanceId);
          },
          onMaximize: (appId) => {
            const win = windows.find((w) => w.id === appId && w.isOpen);
            if (win) maximizeWindow(win.instanceId);
          },
          onRestore: (appId) => {
            const win = windows.find((w) => w.id === appId && w.isOpen);
            if (win) restoreWindow(win.instanceId);
          },
          onCloseWindow: (appId) => {
            const win = windows.find((w) => w.id === appId && w.isOpen);
            if (win) closeWindow(win.instanceId);
          },
          onPin: (appId) => (pinnedApps.includes(appId as WindowId) ? unpinApp(appId as WindowId) : pinApp(appId as WindowId)),
          onDelete: handleDeleteCustomItem,
          onPropertyClick: (appId) => {
            const custom = customItems.find((c) => c.id === appId);
            if (custom) {
              setPropertiesModalItem({
                id: custom.id,
                title: custom.title,
                type: custom.type === "folder" ? "File Folder" : custom.type === "text" ? "Text Document (.txt)" : "Internet Shortcut",
                fluentIcon: custom.fluentIcon,
                location: `C:\\Users\\saitarun\\Desktop\\${custom.title}`,
                size: custom.size || "1 KB",
                sizeOnDisk: "4 KB",
                created: new Date(custom.createdAt).toLocaleString(),
                modified: new Date(custom.createdAt).toLocaleString(),
                description: custom.type === "folder" ? "Local Directory" : custom.type === "text" ? "Plain Text Document" : "Web Shortcut",
              });
            } else {
              const cfg = WINDOW_CONFIGS.find((c) => c.id === appId);
              setPropertiesModalItem({
                id: String(appId),
                title: label,
                type: cfg ? (cfg.title.endsWith(".sys") ? "System Component (.sys)" : cfg.title.endsWith(".txt") ? "Text Document (.txt)" : cfg.title.endsWith(".log") ? "Log File (.log)" : "Application (.app)") : "Application",
                fluentIcon,
                location: `C:\\VSTR-OS\\Applications\\${appId}`,
                size: APP_SIZES[appId]?.size || "1.84 MB",
                sizeOnDisk: "1.92 MB",
                isSystem: true,
                description: "VSTR-OS Native System Application",
              });
            }
          },
        })
      );
      triggerContextMenu(e as any);
    },
    [
      windows,
      pinnedApps,
      customItems,
      openWindow,
      minimizeWindow,
      maximizeWindow,
      restoreWindow,
      closeWindow,
      unpinApp,
      pinApp,
      handleDeleteCustomItem,
      triggerContextMenu,
    ]
  );

  const handleTaskbarContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setContextMenuGroups(
        getTaskbarMenuGroups({
          openSettings: () => openWindow("settings"),
          openTaskManager: () => openWindow("terminal"),
          showDesktop: () => {
            windows.forEach((w) => {
              if (w.isOpen && !w.isMinimized) minimizeWindow(w.instanceId);
            });
          },
        })
      );
      triggerContextMenu(e);
    },
    [windows, openWindow, minimizeWindow, triggerContextMenu]
  );

  // Listen for BSOD trigger events
  useEffect(() => {
    const handleBsodEvent = () => setShowBsod(true);
    window.addEventListener("trigger-bsod", handleBsodEvent);
    return () => window.removeEventListener("trigger-bsod", handleBsodEvent);
  }, []);

  // Global hotkeys
  useGlobalHotkeys([
    {
      keys: [["Control", "Space"], ["Alt", "s"], ["Meta"]],
      description: "Open Start Menu (Ctrl+Space / Alt+S)",
      handler: () => {
        const startBtn = document.getElementById("taskbar-start-btn") as HTMLButtonElement;
        startBtn?.click();
      },
      allowInInput: false,
    },
    {
      keys: [["Alt", "w"], ["Meta", "w"]],
      description: "Toggle Widgets Board (Alt+W)",
      handler: () => toggleWidgetBoard(),
      allowInInput: false,
    },
    {
      keys: [["Alt", "t"], ["Alt", "ArrowUp"], ["Meta", "Tab"]],
      description: "Open Task View / Window Overview (Alt+T)",
      handler: () => toggleExposé(),
      allowInInput: false,
    },
    {
      keys: [["Alt", "Tab"], ["Alt", "["], ["Alt", "]"], ["Control", "Alt", "Tab"]],
      description: "Switch windows (Alt+[ / Alt+])",
      handler: (e) => {
        const openWindows = windows.filter(
          (w) =>
            w.isOpen &&
            !w.isMinimized &&
            (w.desktopId === undefined || w.desktopId === activeWorkspaceId || w.isSticky)
        );
        if (openWindows.length < 2) return;

        const focused = openWindows.reduce((max, w) => (w.zIndex > max.zIndex ? w : max));
        const currentIndex = openWindows.findIndex((w) => w.instanceId === focused.instanceId);
        const nextIndex = e.shiftKey || e.key === "["
          ? (currentIndex - 1 + openWindows.length) % openWindows.length
          : (currentIndex + 1) % openWindows.length;

        focusWindow(openWindows[nextIndex].instanceId);
      },
      allowInInput: false,
    },
    {
      keys: [["Control", "k"], ["Alt", "k"], ["Meta", "s"]],
      description: "Open Command Palette / Search (Ctrl+K)",
      handler: () => toggleCommandPalette(),
      allowInInput: false,
    },
    {
      keys: [["Control", "`"], ["Alt", "`"], ["Meta", "`"]],
      description: "Toggle Terminal Drawer (Ctrl+`)",
      handler: () => toggleTerminalDrawer(),
      allowInInput: false,
    },
    {
      keys: [["Alt", "a"], ["Meta", "a"]],
      description: "Toggle Quick Settings (Alt+A)",
      handler: () => toggleQuickSettings(),
      allowInInput: false,
    },
    {
      keys: [["Alt", "n"], ["Meta", "n"]],
      description: "Toggle Notification Center (Alt+N)",
      handler: () => toggleNotificationCenter(),
      allowInInput: false,
    },
    {
      keys: ["Escape"],
      description: "Close modals / Cancel (Esc)",
      handler: () => {
        if (isContextMenuOpen) closeContextMenu();
        if (isExposéOpen) closeExposé();
        if (isCommandPaletteOpen) closeCommandPalette();
        if (isTerminalDrawerOpen) closeTerminalDrawer();
        if (isWidgetBoardOpen) closeWidgetBoard();
        if (isQuickSettingsOpen) closeQuickSettings();
        if (isNotificationCenterOpen) closeNotificationCenter();
        if (propertiesModalItem) setPropertiesModalItem(null);
      },
      allowInInput: false,
    },
    {
      keys: ["Alt", "1"],
      description: "Switch to Desktop 1 (Alt+1)",
      handler: () => switchWorkspace(0),
      allowInInput: false,
    },
    {
      keys: ["Alt", "2"],
      description: "Switch to Desktop 2 (Alt+2)",
      handler: () => {
        if (workspaces.length > 1) {
          switchWorkspace(1);
        } else {
          addWorkspace();
        }
      },
      allowInInput: false,
    },
  ]);

  // Trigger "First Boot" mission once boot finishes
  useEffect(() => {
    if (!booting) {
      unlockMission("first-boot");
    }
  }, [booting, unlockMission]);

  // Unified list of all desktop items (Base System Apps + Custom User Items)
  const allDesktopItems = [
    ...baseConfigs.map((cfg) => ({
      id: cfg.id,
      title: cfg.title,
      icon: cfg.icon,
      fluentIcon: cfg.fluentIcon,
      isCustom: false,
      type: cfg.title.endsWith(".sys") ? "sys" : cfg.title.endsWith(".txt") ? "txt" : cfg.title.endsWith(".log") ? "log" : "app",
      kb: APP_SIZES[cfg.id]?.kb || 1000,
      createdAt: 0,
      onCustomOpen: undefined as (() => void) | undefined,
    })),
    ...customItems.map((item) => ({
      id: item.id,
      title: item.title,
      icon: item.icon,
      fluentIcon: item.fluentIcon,
      isCustom: true,
      type: item.type,
      kb: item.kb || 1,
      createdAt: item.createdAt,
      onCustomOpen: () => {
        if (item.type === "text") {
          openWindow({ id: "notepad", title: item.title, customData: { filePath: item.filePath } });
        } else if (item.type === "folder") {
          openWindow({ id: "projects", title: item.title });
        } else if (item.url) {
          window.open(item.url, "_blank");
        }
      },
    })),
  ];

  // Apply sorting
  const sortedDesktopItems = [...allDesktopItems].sort((a, b) => {
    if (!sortBy) return 0;
    if (sortBy === "name") {
      return a.title.localeCompare(b.title);
    }
    if (sortBy === "size") {
      return b.kb - a.kb;
    }
    if (sortBy === "type") {
      return a.type.localeCompare(b.type);
    }
    if (sortBy === "date") {
      return b.createdAt - a.createdAt;
    }
    return 0;
  });

  return (
    <div
      id="os-desktop"
      onContextMenu={handleDesktopContextMenu}
      onTouchStart={handleDesktopTouchStart}
      onTouchMove={handleDesktopTouchMove}
      onTouchEnd={handleDesktopTouchEnd}
      style={{
        position: "relative",
        width: "100%",
        height: "100dvh",
        overflow: "hidden",
        background: "var(--os-bg)",
        color: "var(--os-text)",
      }}
    >
      {booting && <BootScreen onComplete={() => setBooting(false)} />}

      {!booting && (
        <>
          <div
            className="wallpaper"
            style={{
              backgroundImage: wallpaper && videoWallpaper === "none" ? `url(${wallpaper})` : undefined,
              opacity: videoWallpaper !== "none" ? 0 : 1,
              transition: "opacity 0.6s",
            }}
          />
          {/* Video Live Wallpaper */}
          <VideoWallpaper
            videoSrc={videoWallpaper}
            opacity={0.92}
            paused={performanceMode}
          />

          {/* Desktop Widgets */}
          <DesktopWidgets />

          {/* Desktop Icons Container */}
          <div
            id="desktop-icons"
            style={{
              position: "absolute",
              top: 20,
              left: 20,
              display: showDesktopIcons ? "grid" : "none",
              gridTemplateRows: "repeat(6, auto)",
              gridAutoFlow: "column",
              gap: iconSize === "large" ? "12px 28px" : iconSize === "small" ? "6px 18px" : "8px 24px",
              zIndex: 2,
              opacity: isRefreshing ? 0.35 : 1,
              transition: "opacity 0.2s ease",
            }}
          >
            {sortedDesktopItems.map((item) => (
              <DesktopIcon
                key={item.id}
                id={item.id}
                icon={item.icon}
                fluentIcon={item.fluentIcon}
                label={item.title}
                size={iconSize}
                isCustom={item.isCustom}
                onCustomOpen={item.onCustomOpen}
                onContextMenu={handleIconContextMenu}
              />
            ))}
          </div>

          {/* Windows Layer */}
          {windows.map((win) => {
            const cfg = WINDOW_CONFIGS.find((c: WindowConfig) => c.id === win.id) || appRegistry.getApp(win.id);
            if (!cfg) return null;
            if (
              win.desktopId !== undefined &&
              win.desktopId !== activeWorkspaceId &&
              !win.isSticky
            ) {
              return null;
            }

            const AppContent = (cfg as any).componentPath ? (
              <DynamicAppLoader appId={win.id} key={win.instanceId} instanceId={win.instanceId} />
            ) : win.id === "terminal" ? (
              <TerminalApp
                key={win.instanceId}
                instanceId={win.instanceId}
                initialCwd={win.customData?.initialCwd}
              />
            ) : win.id === "notepad" ? (
              <NotepadApp
                key={win.instanceId}
                instanceId={win.instanceId}
                initialFilePath={win.customData?.filePath || "/home/saitarun/portfolio/README.md"}
              />
            ) : win.id === "settings" ? (
              <SettingsApp
                key={win.instanceId}
                initialSection={win.customData?.section}
              />
            ) : (
              APP_CONTENT[win.id]
            );

            return (
              <Window
                key={win.instanceId}
                id={win.id}
                instanceId={win.instanceId}
                title={win.title || (cfg as any).title || (cfg as any).name}
                icon={cfg.icon}
                fluentIcon={cfg.fluentIcon}
                defaultW={(cfg as any).defaultConfig?.width ?? (cfg as any).defaultW}
                defaultH={(cfg as any).defaultConfig?.height ?? (cfg as any).defaultH}
                noPadding={win.id === "terminal" || win.id === "notepad"}
              >
                {AppContent}
              </Window>
            );
          })}

          <WidgetBoard />
          <CommandPalette />
          <TaskView />
          <Taskbar onContextMenu={handleTaskbarContextMenu} />
          <QuickSettings isOpen={isQuickSettingsOpen} onClose={closeQuickSettings} />
          <NotificationCenter />
          <ContextMenu
            isOpen={isContextMenuOpen}
            position={contextMenuPos}
            groups={contextMenuGroups}
            onClose={closeContextMenu}
          />
          <PropertiesModal
            item={propertiesModalItem}
            onClose={() => setPropertiesModalItem(null)}
          />
          <OnboardingTip />
          <Win11ToastContainer />
          <Announcer />
          {showBsod && <BsodScreen onClose={() => setShowBsod(false)} />}
        </>
      )}
    </div>
  );
}
