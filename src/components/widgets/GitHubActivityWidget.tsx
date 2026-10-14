"use client";

import React, { useState } from "react";
import Image from "next/image";
import { DesktopWidgetShell } from "./DesktopWidgetShell";
import { useWidgetData } from "@/hooks/useWidgetData";
import { GitBranch, ExternalLink, RefreshCw } from "lucide-react";

export interface GitHubActivityWidgetProps {
  id: string;
  isMinimized: boolean;
  onToggleMinimize: () => void;
  onClose: () => void;
  position: { x: number; y: number };
  onPositionChange: (id: string, pos: { x: number; y: number }) => void;
  dragConstraintsRef?: React.RefObject<HTMLDivElement | null>;
}

const GITHUB_USERNAME = "DaKaufeeBoii";
const GITHUB_PROFILE_URL = `https://github.com/${GITHUB_USERNAME}`;
// Real GitHub contribution graph rendered via ghchart
const GH_CHART_URL = `https://ghchart.rshah.org/39d353/${GITHUB_USERNAME}`;

export function GitHubActivityWidget({
  id,
  isMinimized,
  onToggleMinimize,
  onClose,
  position,
  onPositionChange,
  dragConstraintsRef,
}: GitHubActivityWidgetProps) {
  const { githubEvents } = useWidgetData();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const latestEvent = githubEvents.length > 0 ? githubEvents[0] : null;

  return (
    <DesktopWidgetShell
      id={id}
      title="GitHub"
      isMinimized={isMinimized}
      onToggleMinimize={onToggleMinimize}
      onClose={onClose}
      position={position}
      onPositionChange={onPositionChange}
      dragConstraintsRef={dragConstraintsRef}
      width={340}
      headerRight={
        <a
          href={GITHUB_PROFILE_URL}
          target="_blank"
          rel="noreferrer"
          onPointerDown={(e) => e.stopPropagation()}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            fontSize: "10px",
            fontFamily: "var(--font-mono)",
            color: "rgba(255, 255, 255, 0.5)",
            textDecoration: "none",
            transition: "color 0.15s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#39d353")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255, 255, 255, 0.5)")}
        >
          <span>@{GITHUB_USERNAME}</span>
          <ExternalLink size={9} />
        </a>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
        {/* Header title */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <h3
            style={{
              margin: 0,
              fontSize: "15px",
              fontWeight: 600,
              fontFamily: "var(--font-inter), serif",
              color: "#ffffff",
              letterSpacing: "-0.2px",
            }}
          >
            GitHub Activity
          </h3>
          <span
            style={{
              fontSize: "9px",
              color: "rgba(255, 255, 255, 0.4)",
              fontFamily: "var(--font-mono)",
            }}
          >
            Live Contributions
          </span>
        </div>

        {/* Real GitHub Contribution Chart */}
        <a
          href={GITHUB_PROFILE_URL}
          target="_blank"
          rel="noreferrer"
          onPointerDown={(e) => e.stopPropagation()}
          title={`View ${GITHUB_USERNAME}'s GitHub Profile & Contributions`}
          style={{
            display: "block",
            background: "rgba(0, 0, 0, 0.35)",
            padding: "8px 10px",
            borderRadius: "10px",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            textDecoration: "none",
            position: "relative",
            minHeight: "84px",
            overflow: "hidden",
          }}
        >
          {!imageLoaded && !hasError && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                color: "rgba(255, 255, 255, 0.4)",
                fontSize: "11px",
                fontFamily: "var(--font-mono)",
              }}
            >
              <RefreshCw size={12} className="animate-spin" />
              <span>Loading contributions...</span>
            </div>
          )}

          {hasError ? (
            <div
              style={{
                padding: "16px 0",
                textAlign: "center",
                fontSize: "11px",
                color: "rgba(255, 255, 255, 0.6)",
                fontFamily: "var(--font-mono)",
              }}
            >
              View contributions on github.com/{GITHUB_USERNAME} ↗
            </div>
          ) : (
            /* Real SVG graph fetched from ghchart directly */
            <Image
              src={GH_CHART_URL}
              alt={`${GITHUB_USERNAME} GitHub contributions`}
              width={720}
              height={200}
              unoptimized
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              onError={() => setHasError(true)}
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.4))",
                opacity: imageLoaded ? 1 : 0,
                transition: "opacity 0.25s ease",
              }}
            />
          )}
        </a>

        {/* Real Live Activity / Commit Feed */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "7px",
            fontSize: "11px",
            color: "rgba(255, 255, 255, 0.75)",
            padding: "2px 2px 0",
          }}
        >
          <GitBranch size={12} color="#39d353" style={{ flexShrink: 0 }} />
          <div
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              flex: 1,
            }}
          >
            {latestEvent ? (
              <>
                <a
                  href={`https://github.com/${latestEvent.repo}`}
                  target="_blank"
                  rel="noreferrer"
                  onPointerDown={(e) => e.stopPropagation()}
                  style={{
                    fontWeight: 600,
                    color: "#ffffff",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
                  onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
                >
                  {latestEvent.repo.split("/")[1] ?? latestEvent.repo}:
                </a>{" "}
                <span style={{ color: "rgba(255, 255, 255, 0.65)" }}>
                  {latestEvent.message}
                </span>
              </>
            ) : (
              <span style={{ color: "rgba(255, 255, 255, 0.55)" }}>
                Fetching live commits for {GITHUB_USERNAME}...
              </span>
            )}
          </div>
          {latestEvent?.date && (
            <span
              style={{
                fontSize: "9px",
                fontFamily: "var(--font-mono)",
                color: "rgba(255, 255, 255, 0.4)",
                flexShrink: 0,
              }}
            >
              {latestEvent.date}
            </span>
          )}
        </div>
      </div>
    </DesktopWidgetShell>
  );
}
