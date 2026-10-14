"use client";

import React, { useState } from "react";
import { Headphones, Zap, Sparkles, Gamepad2, Coffee, Link2, Star, Info, Flame } from "lucide-react";

interface PresetPlaylist {
  id: string;
  name: string;
  icon: React.ReactNode;
  embedUrl: string;
}

const PRESET_PLAYLISTS: PresetPlaylist[] = [
  {
    id: "damn-good",
    name: "DAMN GOOD. (Daily)",
    icon: <Flame size={13} />,
    embedUrl: "https://open.spotify.com/embed/playlist/2k0uLgndnQEJ440RTFFJ0F?utm_source=generator&theme=0",
  },
  {
    id: "lofi",
    name: "Lofi Beats",
    icon: <Headphones size={13} />,
    embedUrl: "https://open.spotify.com/embed/playlist/0vvXsWCC9xrXsKd4FyS8kM?utm_source=generator&theme=0",
  },
  {
    id: "synthwave",
    name: "Synthwave",
    icon: <Zap size={13} />,
    embedUrl: "https://open.spotify.com/embed/playlist/37i9dQZF1DXdLEN7aqioXM?utm_source=generator&theme=0",
  },
  {
    id: "deep-focus",
    name: "Deep Focus",
    icon: <Sparkles size={13} />,
    embedUrl: "https://open.spotify.com/embed/playlist/37i9dQZF1DWZeKCadgRdKQ?utm_source=generator&theme=0",
  },
  {
    id: "gaming",
    name: "Gaming Lounge",
    icon: <Gamepad2 size={13} />,
    embedUrl: "https://open.spotify.com/embed/playlist/37i9dQZF1DXdfO2leQ337Q?utm_source=generator&theme=0",
  },
  {
    id: "chill-instrumental",
    name: "Chill Flow",
    icon: <Coffee size={13} />,
    embedUrl: "https://open.spotify.com/embed/playlist/37i9dQZF1DX4t95PaoR1zy?utm_source=generator&theme=0",
  },
];

const STORAGE_KEY = "vstr_spotify_embed_url";
const STORAGE_PRESET_KEY = "vstr_spotify_preset_id";

/**
 * Parses user input (URL, URI, or iframe snippet) into a valid Spotify Embed URL.
 */
function parseSpotifyUrl(input: string): string | null {
  if (!input) return null;
  const trimmed = input.trim();

  // If user pasted an iframe tag
  const iframeSrcMatch = trimmed.match(/src=["']([^"']+)["']/i);
  if (iframeSrcMatch) {
    return iframeSrcMatch[1];
  }

  // Already an embed URL
  if (trimmed.includes("open.spotify.com/embed/")) {
    return trimmed.split("?")[0] + "?utm_source=generator&theme=0";
  }

  // Spotify URI (e.g. spotify:playlist:37i9dQZF1DXdLEN7aqioXM)
  const uriMatch = trimmed.match(
    /spotify:(playlist|track|album|artist|episode|show):([a-zA-Z0-9]+)/
  );
  if (uriMatch) {
    const [, type, id] = uriMatch;
    return `https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0`;
  }

  // Web URL (e.g. https://open.spotify.com/playlist/37i9dQZF1DXdLEN7aqioXM?si=...)
  const urlMatch = trimmed.match(
    /open\.spotify\.com\/(playlist|track|album|artist|episode|show)\/([a-zA-Z0-9]+)/
  );
  if (urlMatch) {
    const [, type, id] = urlMatch;
    return `https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0`;
  }

  return null;
}

export default function MusicPlayerApp() {
  const [savedPreferences] = useState(() => {
    try {
      return {
        url: typeof window === "undefined" ? null : localStorage.getItem(STORAGE_KEY),
        preset: typeof window === "undefined" ? null : localStorage.getItem(STORAGE_PRESET_KEY),
      };
    } catch {
      return { url: null, preset: null };
    }
  });
  const [currentEmbedUrl, setCurrentEmbedUrl] = useState<string>(savedPreferences.url || PRESET_PLAYLISTS[0].embedUrl);
  const [activePresetId, setActivePresetId] = useState<string>(savedPreferences.url ? savedPreferences.preset || "custom" : "damn-good");
  const [customInput, setCustomInput] = useState<string>("");
  const [showCustomBar, setShowCustomBar] = useState<boolean>(false);
  const [inputError, setInputError] = useState<string | null>(null);

  const handleSelectPreset = (preset: PresetPlaylist) => {
    setCurrentEmbedUrl(preset.embedUrl);
    setActivePresetId(preset.id);
    setInputError(null);
    try {
      localStorage.setItem(STORAGE_KEY, preset.embedUrl);
      localStorage.setItem(STORAGE_PRESET_KEY, preset.id);
    } catch {
      // Ignore
    }
  };

  const handleApplyCustomUrl = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!customInput.trim()) return;

    const parsed = parseSpotifyUrl(customInput);
    if (!parsed) {
      setInputError("Invalid Spotify link. Paste a track, playlist, or album URL.");
      return;
    }

    setCurrentEmbedUrl(parsed);
    setActivePresetId("custom");
    setInputError(null);
    setShowCustomBar(false);
    setCustomInput("");

    try {
      localStorage.setItem(STORAGE_KEY, parsed);
      localStorage.setItem(STORAGE_PRESET_KEY, "custom");
    } catch {
      // Ignore
    }
  };

  // Convert embed URL to standard Spotify web link for opening in a new tab
  const getWebUrl = (embed: string) => {
    return embed.replace("/embed/", "/").split("?")[0];
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        background: "rgba(13, 17, 23, 0.95)",
        color: "var(--os-text, #f0f6fc)",
        overflow: "hidden",
        fontFamily: "var(--font-sans, system-ui, sans-serif)",
      }}
    >
      {/* Top Header Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 14px",
          background: "rgba(22, 27, 34, 0.85)",
          borderBottom: "1px solid var(--os-border, rgba(255, 255, 255, 0.1))",
          backdropFilter: "blur(12px)",
          gap: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "22px",
              height: "22px",
              borderRadius: "50%",
              background: "#1DB954",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#000",
              fontWeight: 800,
              fontSize: "12px",
              boxShadow: "0 0 10px rgba(29, 185, 84, 0.4)",
            }}
          >
            ●
          </div>
          <span style={{ fontWeight: 600, fontSize: "13px", letterSpacing: "0.2px" }}>
            Spotify Player
          </span>
        </div>

        <button
          onClick={() => setShowCustomBar((prev) => !prev)}
          style={{
            background: showCustomBar ? "#1DB954" : "rgba(255, 255, 255, 0.08)",
            color: showCustomBar ? "#000" : "var(--os-text, #fff)",
            border: "1px solid " + (showCustomBar ? "#1DB954" : "rgba(255, 255, 255, 0.12)"),
            padding: "4px 10px",
            borderRadius: "6px",
            fontSize: "11px",
            fontWeight: 500,
            cursor: "pointer",
            transition: "all 0.15s ease",
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
          title="Paste your custom playlist or track link"
        >
          <Link2 size={13} />
          <span>{showCustomBar ? "Close Link Bar" : "Custom Link"}</span>
        </button>
      </div>

      {/* Preset Playlist Selector Chips */}
      <div
        style={{
          display: "flex",
          gap: "6px",
          padding: "8px 12px",
          background: "rgba(18, 22, 28, 0.6)",
          borderBottom: "1px solid var(--os-border, rgba(255, 255, 255, 0.08))",
          overflowX: "auto",
          whiteSpace: "nowrap",
          scrollbarWidth: "none",
        }}
      >
        {PRESET_PLAYLISTS.map((preset) => {
          const isSelected = activePresetId === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset)}
              style={{
                background: isSelected ? "rgba(29, 185, 84, 0.18)" : "rgba(255, 255, 255, 0.04)",
                color: isSelected ? "#1DB954" : "var(--os-text-muted, #8b949e)",
                border: "1px solid " + (isSelected ? "#1DB954" : "rgba(255, 255, 255, 0.08)"),
                padding: "4px 10px",
                borderRadius: "14px",
                fontSize: "11px",
                fontWeight: isSelected ? 600 : 400,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                transition: "all 0.15s ease",
                flexShrink: 0,
              }}
            >
              <span>{preset.icon}</span>
              <span>{preset.name}</span>
            </button>
          );
        })}
        {activePresetId === "custom" && (
          <span
            style={{
              background: "rgba(29, 185, 84, 0.22)",
              color: "#1DB954",
              border: "1px solid #1DB954",
              padding: "4px 10px",
              borderRadius: "14px",
              fontSize: "11px",
              fontWeight: 600,
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              flexShrink: 0,
            }}
          >
            <Star size={13} fill="#1DB954" />
            <span>Custom Playlist</span>
          </span>
        )}
      </div>

      {/* Expandable Custom URL Input Drawer */}
      {showCustomBar && (
        <form
          onSubmit={handleApplyCustomUrl}
          style={{
            padding: "10px 14px",
            background: "rgba(24, 30, 39, 0.95)",
            borderBottom: "1px solid var(--os-border, rgba(255, 255, 255, 0.1))",
            display: "flex",
            flexDirection: "column",
            gap: "6px",
            animation: "fadeIn 0.2s ease-out",
          }}
        >
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              type="text"
              value={customInput}
              onChange={(e) => {
                setCustomInput(e.target.value);
                if (inputError) setInputError(null);
              }}
              placeholder="Paste Spotify track, album, or playlist link..."
              style={{
                flex: 1,
                background: "rgba(13, 17, 23, 0.8)",
                border: "1px solid " + (inputError ? "#f85149" : "var(--os-border, rgba(255,255,255,0.15))"),
                borderRadius: "6px",
                padding: "6px 10px",
                color: "#fff",
                fontSize: "12px",
                outline: "none",
              }}
            />
            <button
              type="submit"
              style={{
                background: "#1DB954",
                color: "#000",
                fontWeight: 600,
                fontSize: "12px",
                border: "none",
                borderRadius: "6px",
                padding: "6px 14px",
                cursor: "pointer",
              }}
            >
              Load
            </button>
          </div>
          {inputError && (
            <div style={{ color: "#f85149", fontSize: "11px" }}>{inputError}</div>
          )}
          <div style={{ color: "var(--os-text-dim, #6e7681)", fontSize: "10.5px" }}>
            Supports Spotify track, album, playlist links or iframe embed codes.
          </div>
        </form>
      )}

      {/* Embed Iframe Container */}
      <div
        style={{
          position: "relative",
          flex: 1,
          width: "100%",
          minHeight: 0,
          background: "#000",
        }}
      >
        {/* Load the player eagerly: its OS window may be hidden when mounted,
            and lazy loading can leave Spotify's iframe unloaded when opened. */}
        <iframe
          key={currentEmbedUrl}
          src={currentEmbedUrl}
          width="100%"
          height="100%"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="eager"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            border: "none",
          }}
          title="Spotify Embed Player"
        />
      </div>

      {/* Footer Info Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "6px 12px",
          background: "rgba(18, 22, 28, 0.9)",
          borderTop: "1px solid var(--os-border, rgba(255, 255, 255, 0.08))",
          fontSize: "10.5px",
          color: "var(--os-text-dim, #8b949e)",
        }}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
          <Info size={12} color="var(--os-amber, #e5a93c)" /> Log in to Spotify in your browser for full playback.
        </span>
        <a
          href={getWebUrl(currentEmbedUrl)}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "#1DB954",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "3px",
            fontWeight: 500,
          }}
        >
          Open Spotify ↗
        </a>
      </div>
    </div>
  );
}
