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

import VideoWallpaper          from "./VideoWallpaper";
import BsodScreen              from "./BsodScreen";
import TaskView                from "./TaskView";
import WidgetBoard             from "./WidgetBoard";


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
  } = useOS();
  const { wallpaper, videoWallpaper, performanceMode, unlockMission } = useOSSettings();
  const [booting, setBooting] = React.useState(true);
  const [showBsod, setShowBsod] = React.useState(false);

  // Listen for BSOD trigger events
  React.useEffect(() => {
    const handleBsodEvent = () => setShowBsod(true);
    window.addEventListener("trigger-bsod", handleBsodEvent);
    return () => window.removeEventListener("trigger-bsod", handleBsodEvent);
  }, []);


  // Global hotkeys
  useGlobalHotkeys([
    {
      keys: ["Meta"], // Win key
      description: "Open Start Menu",
      handler: () => {
        // Start menu is handled by Taskbar
        const startBtn = document.getElementById("taskbar-start-btn") as HTMLButtonElement;
        startBtn?.click();
      },
      allowInInput: false,
    },
    {
      keys: ["Meta", "KeyW"], // Win+W
      description: "Toggle Widgets Board",
      handler: () => toggleWidgetBoard(),
      allowInInput: false,
    },
    {
      keys: ["Meta", "Tab"], // Win+Tab
      description: "Open Exposé / Window Overview",
      handler: () => toggleExposé(),
      allowInInput: false,
    },
    {
      keys: ["Alt", "Tab"], // Alt+Tab
      description: "Switch windows",
      handler: (e) => {
        e.preventDefault();
        const openWindows = windows.filter(
          (w) =>
            w.isOpen &&
            !w.isMinimized &&
            (w.desktopId === undefined || w.desktopId === activeWorkspaceId || w.isSticky)
        );
        if (openWindows.length < 2) return;
        
        // Find current focused window (highest zIndex)
        const focused = openWindows.reduce((max, w) => (w.zIndex > max.zIndex ? w : max));
        const currentIndex = openWindows.findIndex((w) => w.instanceId === focused.instanceId);
        const nextIndex = e.shiftKey 
          ? (currentIndex - 1 + openWindows.length) % openWindows.length
          : (currentIndex + 1) % openWindows.length;
        
        focusWindow(openWindows[nextIndex].instanceId);
      },
      allowInInput: false,
    },
    {
      keys: ["Meta", "KeyS"], // Win+S
      description: "Open Command Palette / Search",
      handler: () => toggleCommandPalette(),
      allowInInput: false,
    },
    {
      keys: ["Meta", "`"], // Win+`
      description: "Toggle Terminal Drawer",
      handler: () => toggleTerminalDrawer(),
      allowInInput: false,
    },
    {
      keys: ["Escape"],
      description: "Close modals / Cancel",
      handler: () => {
        if (isExposéOpen) closeExposé();
        if (isCommandPaletteOpen) closeCommandPalette();
        if (isTerminalDrawerOpen) closeTerminalDrawer();
        if (isWidgetBoardOpen) closeWidgetBoard();
      },
      allowInInput: true,
    },
    {
      keys: ["Control", "Meta", "ArrowLeft"], // Ctrl+Win+Left
      description: "Switch to previous desktop",
      handler: () => {
        const prevId = (activeWorkspaceId - 1 + workspaces.length) % workspaces.length;
        switchWorkspace(prevId);
      },
      allowInInput: false,
    },
    {
      keys: ["Control", "Meta", "ArrowRight"], // Ctrl+Win+Right
      description: "Switch to next desktop",
      handler: () => {
        const nextId = (activeWorkspaceId + 1) % workspaces.length;
        switchWorkspace(nextId);
      },
      allowInInput: false,
    },
    {
      keys: ["Control", "Meta", "KeyD"], // Ctrl+Win+D
      description: "New virtual desktop",
      handler: () => addWorkspace(),
      allowInInput: false,
    },
    {
      keys: ["ArrowLeft", "Meta"], // Win+Left
      description: "Snap window left",
      handler: () => {
        const focused = windows.find(w => w.isOpen && !w.isMinimized && w.zIndex === Math.max(...windows.filter(w => w.isOpen && !w.isMinimized).map(w => w.zIndex)));
        if (focused) {
          // Snap logic would be added here
        }
      },
      allowInInput: false,
    },
    {
      keys: ["ArrowRight", "Meta"], // Win+Right
      description: "Snap window right",
      handler: () => {
        const focused = windows.find(w => w.isOpen && !w.isMinimized && w.zIndex === Math.max(...windows.filter(w => w.isOpen && !w.isMinimized).map(w => w.zIndex)));
        if (focused) {
          // Snap logic would be added here
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
  ].filter(Boolean) as typeof WINDOW_CONFIGS;



  return (
    <div
      id="os-desktop"
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
              />

            ))}
          </div>

          {windows.map((win) => {
            const cfg = WINDOW_CONFIGS.find((c: WindowConfig) => c.id === win.id);
            if (!cfg) return null;
            if (
              win.desktopId !== undefined &&
              win.desktopId !== activeWorkspaceId &&
              !win.isSticky
            ) {
              return null;
            }
            return (
              <Window
                key={win.instanceId}
                id={win.id}
                instanceId={win.instanceId}
                title={win.title || cfg.title}
                icon={cfg.icon}
                fluentIcon={cfg.fluentIcon}
                defaultW={cfg.defaultW}
                defaultH={cfg.defaultH}
                noPadding={win.id === "terminal" || win.id === "notepad"}
              >
                {win.id === "terminal" ? (
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
                )}
              </Window>
            );
          })}

          <WidgetBoard />
          <TaskView />
          <Taskbar />
          <OnboardingTip />
          <Win11ToastContainer />
          <Announcer />
          {showBsod && <BsodScreen onClose={() => setShowBsod(false)} />}


        </>
      )}
    </div>
  );
}
