"use client";

import React from "react";
import DesktopIcon from "./DesktopIcon";
import Taskbar from "./Taskbar";
import Window from "./Window";
import BootScreen from "./BootScreen";
import OnboardingTip from "./OnboardingTip";
import { WINDOW_CONFIGS, useOS } from "@/store/windowStore";

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

const APP_CONTENT: Record<string, React.ReactNode> = {
  about:            <AboutApp />,
  projects:         <ProjectsApp />,
  skills:           <SkillsApp />,
  experience:       <ExperienceApp />,
  achievements:     <AchievementsApp />,
  terminal:         <TerminalApp />,
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
  const { theme } = useOS();
  const [booting, setBooting] = React.useState(true);

  const orderedConfigs = [
    WINDOW_CONFIGS.find(c => c.id === "about"),
    WINDOW_CONFIGS.find(c => c.id === "skills"),
    WINDOW_CONFIGS.find(c => c.id === "projects"),
    WINDOW_CONFIGS.find(c => c.id === "experience"),
    WINDOW_CONFIGS.find(c => c.id === "achievements"),
    WINDOW_CONFIGS.find(c => c.id === "contact"),
    WINDOW_CONFIGS.find(c => c.id === "terminal"),
    WINDOW_CONFIGS.find(c => c.id === "settings"),
  ].filter(Boolean) as typeof WINDOW_CONFIGS;

  return (
    <div
      id="os-desktop"
      data-theme={theme}
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
          <div className="wallpaper" />

          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
              pointerEvents: "none",
              zIndex: 1,
              opacity: 0.12,
            }}
          >
            <p
              className="mono"
              style={{ fontSize: 13, color: "var(--os-amber)", letterSpacing: "0.18em" }}
            >
              VSTR-OS v2.0.0
            </p>
            <p
              style={{ fontSize: 11, color: "var(--os-text-muted)", marginTop: 6, letterSpacing: "0.08em" }}
            >
              double-click to open · explore to discover
            </p>
          </div>

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
            {orderedConfigs.map((cfg) => (
              <DesktopIcon
                key={cfg.id}
                id={cfg.id}
                icon={cfg.icon}
                label={cfg.title}
              />
            ))}
          </div>

          {WINDOW_CONFIGS.map((cfg) => (
            <Window
              key={cfg.id}
              id={cfg.id}
              title={cfg.title}
              icon={cfg.icon}
              defaultW={cfg.defaultW}
              defaultH={cfg.defaultH}
              noPadding={cfg.id === "terminal"}
            >
              {APP_CONTENT[cfg.id]}
            </Window>
          ))}

          <Taskbar />
          <OnboardingTip />
        </>
      )}
    </div>
  );
}
