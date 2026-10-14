"use client";

import { useCallback } from "react";

let sharedAudioCtx: AudioContext | null = null;
let listenerAttached = false;
let uiSoundVolume = 0.7;

export function setUiSoundVolume(volume: number) {
  uiSoundVolume = Math.max(0, Math.min(1, volume));
}

function initSharedAudio() {
  if (typeof window === "undefined") return;
  if (!sharedAudioCtx) {
    try {
      const AudioCtxClass = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        sharedAudioCtx = new AudioCtxClass();
      }
    } catch {}
  }
  if (sharedAudioCtx && sharedAudioCtx.state === "suspended") {
    sharedAudioCtx.resume().catch(() => {});
  }
  if (listenerAttached) {
    window.removeEventListener("mousedown", initSharedAudio);
    window.removeEventListener("keydown", initSharedAudio);
    listenerAttached = false;
  }
}

function ensureAudioListener() {
  if (typeof window === "undefined" || listenerAttached || sharedAudioCtx) return;
  listenerAttached = true;
  window.addEventListener("mousedown", initSharedAudio, { once: true });
  window.addEventListener("keydown", initSharedAudio, { once: true });
}

export function useSound() {
  if (typeof window !== "undefined") {
    ensureAudioListener();
  }

  const playClick = useCallback(() => {
    initSharedAudio();
    if (!sharedAudioCtx) return;
    const ctx = sharedAudioCtx;
    if (ctx.state === "suspended") ctx.resume().catch(() => {});

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.05 * uiSoundVolume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch {}
  }, []);

  const playError = useCallback(() => {
    initSharedAudio();
    if (!sharedAudioCtx) return;
    const ctx = sharedAudioCtx;
    if (ctx.state === "suspended") ctx.resume().catch(() => {});

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.2);

      gain.gain.setValueAtTime(0.1 * uiSoundVolume, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch {}
  }, []);

  return { playClick, playError };
}
