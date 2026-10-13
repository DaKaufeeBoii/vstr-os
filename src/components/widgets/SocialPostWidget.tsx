"use client";

import React from "react";
import { DesktopWidgetShell } from "./DesktopWidgetShell";
import { ExternalLink } from "lucide-react";

export interface SocialPostWidgetProps {
  id: string;
  isMinimized: boolean;
  onToggleMinimize: () => void;
  onClose: () => void;
  position: { x: number; y: number };
  onPositionChange: (id: string, pos: { x: number; y: number }) => void;
  dragConstraintsRef?: React.RefObject<HTMLDivElement | null>;
}

const TWITTER_HANDLE = "@DaKaufeeBoii";
const TWITTER_URL = "https://x.com/DaKaufeeBoii";

export function SocialPostWidget({
  id,
  isMinimized,
  onToggleMinimize,
  onClose,
  position,
  onPositionChange,
  dragConstraintsRef,
}: SocialPostWidgetProps) {
  return (
    <DesktopWidgetShell
      id={id}
      title="X"
      tag="X POST"
      isMinimized={isMinimized}
      onToggleMinimize={onToggleMinimize}
      onClose={onClose}
      position={position}
      onPositionChange={onPositionChange}
      dragConstraintsRef={dragConstraintsRef}
      width={330}
      headerRight={
        <a
          href={TWITTER_URL}
          target="_blank"
          rel="noreferrer"
          onPointerDown={(e) => e.stopPropagation()}
          style={{
            fontSize: "10px",
            fontFamily: "var(--font-mono)",
            color: "rgba(255, 255, 255, 0.5)",
            textDecoration: "none",
            transition: "color 0.15s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#38bdf8")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255, 255, 255, 0.5)")}
        >
          {TWITTER_HANDLE}
        </a>
      }
    >
      <a
        href={TWITTER_URL}
        target="_blank"
        rel="noreferrer"
        onPointerDown={(e) => e.stopPropagation()}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          textDecoration: "none",
          color: "inherit",
          cursor: "pointer",
        }}
      >
        {/* Post Content */}
        <p
          style={{
            margin: 0,
            fontSize: "12.5px",
            lineHeight: 1.5,
            color: "rgba(255, 255, 255, 0.88)",
            letterSpacing: "-0.1px",
          }}
        >
          POV: you came to a Web3 meetup “just to see what it’s about” and left wanting MORE. Currently at @draper_u Hyderabad. A great experience meeting the coolest people from @hyderabaddao, @ETHGlobal, and @EFDevcon!
        </p>

        {/* Footer meta info */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "2px",
            paddingTop: "6px",
            borderTop: "1px solid rgba(255, 255, 255, 0.06)",
          }}
        >
          <span
            style={{
              fontSize: "10px",
              color: "rgba(255, 255, 255, 0.42)",
              fontFamily: "var(--font-mono)",
            }}
          >
            Sai Tarun Reddy | Tap to view on X
          </span>

          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: "3px",
              fontSize: "10px",
              color: "#38bdf8",
              fontWeight: 500,
            }}
          >
            <span>Open</span>
            <ExternalLink size={10} />
          </span>
        </div>
      </a>
    </DesktopWidgetShell>
  );
}
