"use client";

import React from "react";
import DesktopIcon from "./DesktopIcon";
import Taskbar from "./Taskbar";
import Window from "./Window";
import BootScreen from "./BootScreen";
import OnboardingTip from "./OnboardingTip";
import Win11ToastContainer from "./Win11ToastContainer";
import { WINDOW_CONFIGS, useOS } from "@/store/windowStore";
import { useOSSettings, type VideoWallpaperId } from "@/store/osSettingsStore";
import type { WindowConfig } from "@/types";

import { useGlobalHotkeys } from "@/hooks/useGlobalHotkeys";
import { Announcer, focusManager } from "@/hooks/useFocusTrap";

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
import type { WindowId }       from "@/types";


const APP_CONTENT: Record<string, React.ReactNode> = {
  about:            <AboutApp />,
  projects:         <ProjectsApp />,
  skills:           <SkillsApp />,
  experience:       <ExperienceApp />,
  achievements:     <AchievementsApp />,
  terminal:         <TerminalApp />,
  notepad:          <NotepadApp />,
  guestbook:        <GuestbookApp />,
  contact:          <ContactApp />,
  flappy:           <FlappyGameApp />,
  hintmaster:       <HintMasterApp />,
  settings:         <SettingsApp />,
  photo_viewer:     <PhotoViewerApp />,
  disk_cleanup:     <DiskCleanupApp />,
  desktop_pet:      <DesktopPetApp />,
  password_cracker: <PasswordCrackerApp />,
  app_gallery:      <AppGalleryApp />,
};

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
    openExposé,
    closeExposé,
    toggleCommandPalette,
    openCommandPalette,
    closeCommandPalette,
    toggleTerminalDrawer,
    openTerminalDrawer,
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
  } = useOS();
  const { wallpaper, videoWallpaper, performanceMode, unlockMission } = useOSSettings();
  const [booting, setBooting] = React.useState(true);
  const [showBsod, setShowBsod] = React.useState(false);
  const { playClick } = useSound();

  const {
    isOpen: isContextMenuOpen,
    position: contextMenuPos,
    openMenu: triggerContextMenu,
    closeMenu: closeContextMenu,
  } = useContextMenu();
  const [contextMenuGroups, setContextMenuGroups] = React.useState<ContextMenuGroupDef[]>([]);

  const handleDesktopContextMenu = React.useCallback(
    (e: React.MouseEvent) => {
      // Don't intercept right clicks if target is a window or interactive control
      const target = e.target as HTMLElement;
      if (target.closest(".os-window") || target.closest(".os-taskbar") || target.closest(".desktop-icon")) {
        return;
      }
      e.preventDefault();
      setContextMenuGroups(
        getDesktopMenuGroups({
          refresh: () => {
            playClick();
          },
          openTerminal: () => openWindow("terminal"),
          openSettings: () => openWindow("settings"),
        })
      );
      triggerContextMenu(e);
    },
    [playClick, openWindow, triggerContextMenu]
  );

  const handleIconContextMenu = React.useCallback(
    (e: React.MouseEvent, id: WindowId, label: string, fluentIcon?: string) => {
      e.preventDefault();
      e.stopPropagation();
      setContextMenuGroups(
        getIconMenuGroups({
          id,
          label,
          fluentIcon,
          onOpen: (appId) => openWindow(appId),
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
        })
      );
      triggerContextMenu(e);
    },
    [windows, openWindow, minimizeWindow, maximizeWindow, restoreWindow, closeWindow, triggerContextMenu]
  );

  const handleTaskbarContextMenu = React.useCallback(
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
  React.useEffect(() => {
    const handleBsodEvent = () => setShowBsod(true);
    window.addEventListener("trigger-bsod", handleBsodEvent);
    return () => window.removeEventListener("trigger-bsod", handleBsodEvent);
  }, []);


  // Global hotkeys (Conflict-free browser chords with OS fallbacks)
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
      },
      allowInInput: false,
    },
    // Instant workspace jumps (Alt + 1, Alt + 2, Alt + 3, Alt + 4)
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
    {
      keys: ["Alt", "3"],
      description: "Switch to Desktop 3 (Alt+3)",
      handler: () => {
        if (workspaces.length > 2) switchWorkspace(2);
      },
      allowInInput: false,
    },
    {
      keys: ["Alt", "4"],
      description: "Switch to Desktop 4 (Alt+4)",
      handler: () => {
        if (workspaces.length > 3) switchWorkspace(3);
      },
      allowInInput: false,
    },
    {
      keys: [["Alt", "ArrowLeft"], ["Control", "Meta", "ArrowLeft"], ["Control", "Alt", "ArrowLeft"]],
      description: "Switch to previous desktop (Alt+Left)",
      handler: () => {
        const prevId = (activeWorkspaceId - 1 + workspaces.length) % workspaces.length;
        switchWorkspace(prevId);
      },
      allowInInput: false,
    },
    {
      keys: [["Alt", "ArrowRight"], ["Control", "Meta", "ArrowRight"], ["Control", "Alt", "ArrowRight"]],
      description: "Switch to next desktop (Alt+Right)",
      handler: () => {
        const nextId = (activeWorkspaceId + 1) % workspaces.length;
        switchWorkspace(nextId);
      },
      allowInInput: false,
    },
    {
      keys: [["Alt", "Shift", "d"], ["Alt", "d"], ["Control", "Meta", "d"]],
      description: "New virtual desktop (Alt+Shift+D)",
      handler: () => addWorkspace(),
      allowInInput: false,
    },
    {
      keys: [["ArrowLeft", "Meta"], ["ArrowLeft", "Alt", "Shift"]],
      description: "Snap window left",
      handler: () => {
        const focused = windows.find(
          (w) =>
            w.isOpen &&
            !w.isMinimized &&
            w.zIndex === Math.max(...windows.filter((win) => win.isOpen && !win.isMinimized).map((win) => win.zIndex))
        );
        if (focused) {
          // Window snapping handler
        }
      },
      allowInInput: false,
    },
    {
      keys: [["ArrowRight", "Meta"], ["ArrowRight", "Alt", "Shift"]],
      description: "Snap window right",
      handler: () => {
        const focused = windows.find(
          (w) =>
            w.isOpen &&
            !w.isMinimized &&
            w.zIndex === Math.max(...windows.filter((win) => win.isOpen && !win.isMinimized).map((win) => win.zIndex))
        );
        if (focused) {
          // Window snapping handler
        }
      },
      allowInInput: false,
    },
  ]);

  // Trigger "First Boot" mission once boot finishes
  React.useEffect(() => {
    if (!booting) {
      unlockMission("first-boot");
    }
  }, [booting, unlockMission]);

  const orderedConfigs = [
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
  ].filter(Boolean) as typeof WINDOW_CONFIGS;



  return (
    <div
      id="os-desktop"
      onContextMenu={handleDesktopContextMenu}
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
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
              backgroundImage: (wallpaper && videoWallpaper === "none") ? `url(${wallpaper})` : undefined,
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

          <div
            id="desktop-icons"
            style={{
              position: "absolute",
              top: 20,
              left: 20,
              display: "grid",
              gridTemplateRows: "repeat(6, auto)",
              gridAutoFlow: "column",
              gap: "8px 24px",
              zIndex: 2,
            }}
          >
            {orderedConfigs.map((cfg: WindowConfig) => (
              <DesktopIcon
                key={cfg.id}
                id={cfg.id}
                icon={cfg.icon}
                fluentIcon={cfg.fluentIcon}
                label={cfg.title}
                onContextMenu={handleIconContextMenu}
              />

            ))}
          </div>

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
            
            const AppContent = (cfg as any).componentPath 
              ? <DynamicAppLoader appId={win.id} key={win.instanceId} instanceId={win.instanceId} />
              : win.id === "terminal" ? (
                  <TerminalApp key={win.instanceId} instanceId={win.instanceId} />
                ) : win.id === "notepad" ? (
                  <NotepadApp
                    key={win.instanceId}
                    instanceId={win.instanceId}
                    initialFilePath={
                      win.customData?.filePath || "/home/saitarun/portfolio/README.md"
                    }
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
          <OnboardingTip />
          <Win11ToastContainer />
          <Announcer />
          {showBsod && <BsodScreen onClose={() => setShowBsod(false)} />}


        </>
      )}
    </div>
  );
}
