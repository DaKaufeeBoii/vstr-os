"use client";

import { useEffect, useState } from "react";
import {
  onWidgetEvent,
  type WidgetTelemetryFrame,
  type WidgetGitHubSnapshot,
  type WidgetLeetCodeSnapshot,
} from "@/lib/widgets/widgetEvents";
import { ensureWidgetSync } from "@/lib/widgets/widgetSync";

/**
 * Single reader for the background widget sync (§2.1). Ensures the
 * singleton producer is running, replays the latest cached snapshot on
 * mount, and stays updated via the shared event bus. No per-component
 * fetching or polling intervals.
 */
export function useWidgetData() {
  const [telemetry, setTelemetry] = useState<WidgetTelemetryFrame>({ fps: 60, memoryMB: null });
  const [github, setGithub] = useState<WidgetGitHubSnapshot>({ events: [] });
  const [leetcode, setLeetcode] = useState<WidgetLeetCodeSnapshot | null>(null);

  useEffect(() => {
    ensureWidgetSync();
    const offTelemetry = onWidgetEvent("telemetry", setTelemetry);
    const offGithub = onWidgetEvent("github", setGithub);
    const offLeetcode = onWidgetEvent("leetcode", setLeetcode);
    return () => {
      offTelemetry();
      offGithub();
      offLeetcode();
    };
  }, []);

  return {
    fps: telemetry.fps,
    memory: telemetry.memoryMB !== null ? `${telemetry.memoryMB} MB` : "N/A",
    githubEvents: github.events,
    // Back-compat for older placeholder counters.
    githubCommits: github.events.length,
    leetcodeSolved: leetcode?.totalSolved ?? 0,
    leetcode,
  };
}
