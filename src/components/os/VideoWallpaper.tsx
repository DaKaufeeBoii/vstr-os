"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";

export type VideoWallpaperId = "none" | "dawn" | "lake" | "rayquaza" | "yuji-sleepy" | string; // string = custom video path

interface VideoWallpaperProps {
  videoSrc: VideoWallpaperId;
  /** 0.0 – 1.0, controls video opacity */
  opacity?: number;
  /** When true, video is paused (battery/performance saver) */
  paused?: boolean;
  /** Callback when video metadata loads (for debugging) */
  onLoad?: () => void;
  /** Callback on error */
  onError?: (err: Error) => void;
}

const BUILTIN_VIDEOS: Record<Exclude<VideoWallpaperId, "none">, string> = {
  dawn: "/wallpapers/video/Dawn-cycling.mp4",
  lake: "/wallpapers/video/Lake-of-Rage.mp4",
  rayquaza: "/wallpapers/video/Rayquaza.mp4",
  "yuji-sleepy": "/wallpapers/video/yuji-sleepy.mp4",
};

/**
 * Full-screen HTML5 video wallpaper with loop, mute, and performance controls.
 * Falls back gracefully if video fails to load.
 */
export default function VideoWallpaper({
  videoSrc,
  opacity = 1,
  paused = false,
  onLoad,
  onError,
}: VideoWallpaperProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasError, setHasError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const resolvedSrc = videoSrc === "none" ? null : BUILTIN_VIDEOS[videoSrc] ?? videoSrc;

  // Handle play/pause
  const play = useCallback(() => {
    const video = videoRef.current;
    if (video && !hasError) {
      video.play().catch(() => {
        // Autoplay blocked - user needs to interact first
        setIsPlaying(false);
      });
    }
  }, [hasError]);

  const pause = useCallback(() => {
    videoRef.current?.pause();
    setIsPlaying(false);
  }, []);

  // Effect: play/pause based on props
  useEffect(() => {
    if (paused) {
      pause();
    } else {
      play();
    }
  }, [paused, play, pause]);

  // Auto-pause when tab is backgrounded (battery saver)
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        pause();
      } else if (!paused) {
        play();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [paused, play, pause]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      videoRef.current?.pause();
      videoRef.current?.removeAttribute("src");
      videoRef.current?.load();
    };
  }, []);

  // Periodic loop integrity check - some browsers may stop looping under memory pressure
  useEffect(() => {
    if (hasError || paused) return;
    
    const interval = setInterval(() => {
      const video = videoRef.current;
      if (video && !video.paused && !video.ended) {
        // Video is playing normally
        return;
      }
      // Video stopped unexpectedly - attempt to restart
      if (video && !paused && !hasError && video.readyState >= 2) {
        video.currentTime = 0;
        video.play().catch(() => {
          setIsPlaying(false);
        });
      }
    }, 5000); // Check every 5 seconds
    
    return () => clearInterval(interval);
  }, [paused, hasError]);

  if (!resolvedSrc || hasError) return null;

  return (
    <video
      ref={videoRef}
      src={resolvedSrc}
      autoPlay
      loop
      muted
      playsInline
      disablePictureInPicture
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        display: "block",
        opacity,
        zIndex: 0,
        filter: paused ? "brightness(0.6) grayscale(0.4)" : "none",
        transition: "filter 0.5s ease, opacity 0.3s ease",
      }}
      onLoadedData={() => {
        setIsPlaying(true);
        onLoad?.();
      }}
      onError={(e) => {
        console.error("Video wallpaper failed to load:", resolvedSrc, e);
        setHasError(true);
        onError?.(new Error(`Failed to load video: ${resolvedSrc}`));
      }}
      onPause={() => setIsPlaying(false)}
      onPlay={() => setIsPlaying(true)}
      onEnded={() => {
        // Force loop restart - some browsers may stop looping under memory pressure
        const video = videoRef.current;
        if (video && !paused && !hasError) {
          video.currentTime = 0;
          video.play().catch(() => {
            setIsPlaying(false);
          });
        }
      }}
      aria-hidden="true"
    />
  );
}