"use client";

import React from "react";
import DesktopIcon from "./DesktopIcon";
import Taskbar from "./Taskbar";
import Window from "./Window";
import { WINDOW_CONFIGS } from "@/store/windowStore";

// App components
import AboutApp      from "@/components/apps/AboutApp";
import ProjectsApp   from "@/components/apps/ProjectsApp";
import SkillsApp     from "@/components/apps/SkillsApp";
import ExperienceApp from "@/components/apps/ExperienceApp";
import AchievementsApp from "@/components/apps/AchievementsApp";
import TerminalApp   from "@/components/apps/TerminalApp";
import ContactApp    from "@/components/apps/ContactApp";

const APP_CONTENT: Record<string, React.ReactNode> = {
  about:        <AboutApp />,
  projects:     <ProjectsApp />,
  skills:       <SkillsApp />,
  experience:   <ExperienceApp />,
  achievements: <AchievementsApp />,
  terminal:     <TerminalApp />,
  contact:      <ContactApp />,
};

export default function Desktop() {
  return (
    <div
      id="os-desktop"
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* Aurora wallpaper */}
      <div className="wallpaper" />

      {/* Desktop hint */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          pointerEvents: "none",
          zIndex: 1,
          opacity: 0.18,
        }}
      >
        <p
          className="mono"
          style={{ fontSize: 13, color: "var(--os-cyan)", letterSpacing: "0.15em" }}
        >
          VSTR-OS v1.0.0
        </p>
        <p
          style={{ fontSize: 11, color: "var(--os-text-muted)", marginTop: 6, letterSpacing: "0.08em" }}
        >
          Double-click an icon to open
        </p>
      </div>

      {/* Desktop icons grid */}
      <div
        id="desktop-icons"
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          zIndex: 2,
        }}
      >
        {WINDOW_CONFIGS.map((cfg) => (
          <DesktopIcon
            key={cfg.id}
            id={cfg.id}
            icon={cfg.icon}
            label={cfg.title}
          />
        ))}
      </div>

      {/* Windows */}
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

      {/* Taskbar */}
      <Taskbar />
    </div>
  );
}
