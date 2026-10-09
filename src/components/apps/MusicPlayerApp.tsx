"use client";

import React, { useEffect, useState } from "react";
import { useMusic } from "@/store/musicStore";
import { audioManager } from "@/lib/audioManager";

export default function MusicPlayerApp() {
  const { state, dispatch } = useMusic();
  const { playlist, currentTrackIndex, isPlaying, volume } = state;
  const [newTrackUrl, setNewTrackUrl] = useState("");

  const currentTrack = playlist[currentTrackIndex];

  useEffect(() => {
    if (isPlaying && currentTrack) {
      audioManager.play(currentTrack.url, volume);
    } else {
      audioManager.pause();
    }
  }, [isPlaying, currentTrack, volume]);

  const handleAddTrack = () => {
    if (!newTrackUrl) return;
    dispatch({ type: "ADD_TRACK", track: {
      id: Math.random().toString(36),
      title: "Custom Track",
      artist: "Unknown",
      url: newTrackUrl
    }});
    setNewTrackUrl("");
  };

  return (
    <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
      <h2 style={{ color: "var(--os-amber)" }}>🎵 Music Player</h2>
      
      {currentTrack ? (
        <div style={{ background: "rgba(255,255,255,0.05)", padding: "10px", borderRadius: "8px" }}>
          <div style={{ fontWeight: 600 }}>{currentTrack.title}</div>
          <div style={{ fontSize: "12px", color: "var(--os-text-muted)" }}>{currentTrack.artist}</div>
        </div>
      ) : (
        <div style={{ fontSize: "12px", color: "var(--os-text-muted)" }}>No track selected</div>
      )}

      <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
        <button onClick={() => dispatch({ type: "PREV" })}>Prev</button>
        <button onClick={() => dispatch({ type: isPlaying ? "PAUSE" : "PLAY" })}>{isPlaying ? "Pause" : "Play"}</button>
        <button onClick={() => dispatch({ type: "NEXT" })}>Next</button>
      </div>

      <input 
        type="text" 
        value={newTrackUrl} 
        onChange={(e) => setNewTrackUrl(e.target.value)} 
        placeholder="Enter direct MP3/Audio URL"
      />
      <button onClick={handleAddTrack}>Add Track</button>
    </div>
  );
}
