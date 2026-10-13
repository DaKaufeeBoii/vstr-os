"use client";

import React, { useState } from "react";
import { DesktopWidgetShell } from "./DesktopWidgetShell";
import { Play, Pause, ExternalLink, Music2, Disc3 } from "lucide-react";
import { useOS } from "@/store/windowStore";

const PLAYLIST_ID = "2k0uLgndnQEJ440RTFFJ0F";
const PLAYLIST_URL = "https://open.spotify.com/playlist/2k0uLgndnQEJ440RTFFJ0F";
const PLAYLIST_EMBED_URL = `https://open.spotify.com/embed/playlist/${PLAYLIST_ID}?utm_source=generator&theme=0`;
const PLAYLIST_TITLE = "DAMN GOOD.";
const PLAYLIST_COVER =
  "https://mosaic.scdn.co/300/ab67616d00001e021633c43b5695735f7de36487ab67616d00001e02b1c4b76e23414c9f20242268ab67616d00001e02de79f330bc297af3fae736daab67616d00001e02ffbe25fb3b119bda9a2ba0ee";

export interface SpotifyWidgetProps {
  id: string;
  isMinimized: boolean;
  onToggleMinimize: () => void;
  onClose: () => void;
  position: { x: number; y: number };
  onPositionChange: (id: string, pos: { x: number; y: number }) => void;
  dragConstraintsRef?: React.RefObject<HTMLDivElement | null>;
}

export function SpotifyWidget({
  id,
  isMinimized,
  onToggleMinimize,
  onClose,
  position,
  onPositionChange,
  dragConstraintsRef,
}: SpotifyWidgetProps) {
  const { openWindow } = useOS();
  const [showEmbed, setShowEmbed] = useState(false);
  const [isPlayingPreview, setIsPlayingPreview] = useState(true);

  const handleOpenApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    openWindow("music_player");
  };

  const handleToggleEmbed = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowEmbed((prev) => !prev);
  };

  return (
    <DesktopWidgetShell
      id={id}
      title="Spotify"
      tag="MY PLAYLIST"
      isMinimized={isMinimized}
      onToggleMinimize={onToggleMinimize}
      onClose={onClose}
      position={position}
      onPositionChange={onPositionChange}
      dragConstraintsRef={dragConstraintsRef}
      width={showEmbed ? 350 : 330}
      headerRight={
        <a
          href={PLAYLIST_URL}
          target="_blank"
          rel="noreferrer"
          onPointerDown={(e) => e.stopPropagation()}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "3px",
            fontSize: "10px",
            fontFamily: "var(--font-mono)",
            color: "rgba(255, 255, 255, 0.45)",
            textDecoration: "none",
            transition: "color 0.15s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#1db954")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255, 255, 255, 0.45)")}
        >
          <span>Spotify</span>
          <ExternalLink size={9} />
        </a>
      }
    >
      {showEmbed ? (
        /* Real Interactive Spotify Embed Player */
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <iframe
            style={{ borderRadius: "12px", border: "none" }}
            src={PLAYLIST_EMBED_URL}
            width="100%"
            height="152"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            title="Spotify Playlist: DAMN GOOD."
          />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={handleToggleEmbed}
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                border: "none",
                borderRadius: "6px",
                padding: "3px 8px",
                color: "rgba(255, 255, 255, 0.7)",
                fontSize: "10px",
                cursor: "pointer",
                fontFamily: "var(--font-mono)",
              }}
            >
              ← Back to Compact
            </button>
            <button
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={handleOpenApp}
              style={{
                background: "#1db954",
                border: "none",
                borderRadius: "6px",
                padding: "3px 10px",
                color: "#000",
                fontSize: "10px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Open in VSTR OS
            </button>
          </div>
        </div>
      ) : (
        /* Real Playlist Compact Card with Album Art */
        <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
          {/* Mosaic Cover Art from Real Spotify Playlist */}
          <div
            onClick={handleOpenApp}
            title="Click to open playlist in VSTR Music Player"
            style={{
              position: "relative",
              width: "68px",
              height: "68px",
              borderRadius: "12px",
              boxShadow: "0 8px 18px rgba(0, 0, 0, 0.45)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              cursor: "pointer",
              overflow: "hidden",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              backgroundColor: "#121212",
            }}
          >
            <img
              src={PLAYLIST_COVER}
              alt="DAMN GOOD. playlist cover"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            {isPlayingPreview && (
              <div
                style={{
                  position: "absolute",
                  bottom: 4,
                  right: 4,
                  display: "flex",
                  gap: "2px",
                  alignItems: "flex-end",
                  height: "10px",
                  background: "rgba(0, 0, 0, 0.65)",
                  padding: "2px 3px",
                  borderRadius: "3px",
                }}
              >
                <span className="eq-bar eq-bar-1" />
                <span className="eq-bar eq-bar-2" />
                <span className="eq-bar eq-bar-3" />
              </div>
            )}
          </div>

          {/* Real Playlist Details */}
          <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
            <div
              onClick={handleOpenApp}
              title="DAMN GOOD."
              style={{
                fontSize: "14px",
                fontWeight: 700,
                color: "#ffffff",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                cursor: "pointer",
                letterSpacing: "0.2px",
              }}
            >
              {PLAYLIST_TITLE}
            </div>

            <div
              style={{
                fontSize: "12px",
                color: "rgba(255, 255, 255, 0.72)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                marginTop: "2px",
              }}
            >
              Daily Listening Rotation
            </div>

            <div
              style={{
                fontSize: "10px",
                color: "rgba(255, 255, 255, 0.4)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                marginTop: "2px",
              }}
            >
              Curated by @DaKaufeeBoii
            </div>

            {/* Controls */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "6px",
              }}
            >
              <button
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={handleToggleEmbed}
                title="Expand Spotify Player"
                style={{
                  background: "rgba(29, 185, 84, 0.2)",
                  border: "1px solid rgba(29, 185, 84, 0.35)",
                  borderRadius: "6px",
                  padding: "2px 7px",
                  fontSize: "9px",
                  fontFamily: "var(--font-mono)",
                  color: "#1db954",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <Play size={8} fill="#1db954" />
                <span>Player</span>
              </button>

              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <button
                  type="button"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={handleOpenApp}
                  title="Open in VSTR Music Player"
                  style={{
                    background: "rgba(255, 255, 255, 0.1)",
                    border: "none",
                    borderRadius: "50%",
                    width: "22px",
                    height: "22px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "#fff",
                    transition: "background 0.15s ease",
                  }}
                >
                  <Music2 size={11} />
                </button>

                <a
                  href={PLAYLIST_URL}
                  target="_blank"
                  rel="noreferrer"
                  onPointerDown={(e) => e.stopPropagation()}
                  title="Open on Spotify Web"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "rgba(255, 255, 255, 0.45)",
                    padding: "0 2px",
                    textDecoration: "none",
                  }}
                >
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .eq-bar {
          width: 2px;
          background-color: #1db954;
          border-radius: 1px;
        }
        .eq-bar-1 {
          height: 8px;
          animation: bounce 0.8s ease-in-out infinite alternate;
        }
        .eq-bar-2 {
          height: 5px;
          animation: bounce 0.6s ease-in-out infinite alternate-reverse;
        }
        .eq-bar-3 {
          height: 10px;
          animation: bounce 0.9s ease-in-out infinite alternate;
        }
        @keyframes bounce {
          0% {
            height: 3px;
          }
          100% {
            height: 9px;
          }
        }
      `}</style>
    </DesktopWidgetShell>
  );
}
