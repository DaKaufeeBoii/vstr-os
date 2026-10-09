"use client";

// Simple singleton-like manager for the HTMLAudioElement
let audio: HTMLAudioElement | null = typeof window !== "undefined" ? new Audio() : null;

export const audioManager = {
  play: (url: string, volume: number) => {
    if (!audio) return;
    if (audio.src !== url) {
      audio.src = url;
    }
    audio.volume = volume;
    audio.play().catch(console.error);
  },
  
  pause: () => {
    audio?.pause();
  },
  
  setVolume: (volume: number) => {
    if (audio) audio.volume = volume;
  },
  
  getCurrentTime: () => audio?.currentTime || 0,
};
