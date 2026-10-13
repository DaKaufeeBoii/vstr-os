"use client";

/**
 * widgetSync.ts
 *
 * Singleton background synchronizer for all widget data sources (§2.1).
 *
 * Guarantees exactly one active producer per data source, no matter how many
 * components mount — `ensureWidgetSync()` is idempotent. Telemetry streams
 * continuously via `requestAnimationFrame` (paused when the tab is hidden);
 * external APIs (GitHub activity, LeetCode stats) are fetched on a cooldown
 * and additionally refetched whenever the WidgetBoard opens.
 *
 * OSSettings remains the single source of truth for widget *config*
 * (visibility); this module is the single source of *payloads*.
 */

import {
  emitWidgetEvent,
  type WidgetGitHubSnapshot,
  type WidgetLeetCodeSnapshot,
  type WidgetTelemetryFrame,
} from "./widgetEvents";

const GITHUB_URL = "https://api.github.com/users/DaKaufeeBoii/events?per_page=5";
const GITHUB_COOLDOWN_MS = 10 * 60 * 1000; // 10 minutes
const LEETCODE_COOLDOWN_MS = 60 * 60 * 1000; // 1 hour (server revalidates hourly)

let syncStarted = false;

interface GitHubEvent {
  id: string;
  type: string;
  repo: { name: string };
  created_at: string;
  payload?: {
    commits?: { message: string; sha: string }[];
  };
}

function formatGitHubDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-IN", { month: "short", day: "numeric" });
  } catch {
    return iso;
  }
}

async function fetchGitHub(): Promise<WidgetGitHubSnapshot | null> {
  try {
    const res = await fetch(GITHUB_URL, { headers: { Accept: "application/vnd.github+json" } });
    if (!res.ok) return null;
    const data = (await res.json()) as GitHubEvent[];
    if (!Array.isArray(data) || data.length === 0) return null;
    const events = data
      .filter((e) => e.type === "PushEvent" && e.payload?.commits?.length)
      .slice(0, 3)
      .map((e) => {
        const commit = e.payload?.commits?.[0];
        return {
          repo: e.repo.name,
          message: commit?.message || "Updated repository",
          date: formatGitHubDate(e.created_at),
        };
      });
    return events.length > 0 ? { events } : null;
  } catch {
    return null;
  }
}

async function fetchLeetCode(): Promise<WidgetLeetCodeSnapshot | null> {
  try {
    const res = await fetch("/api/leetcode");
    if (!res.ok) return null;
    const data = await res.json();
    if (!data || typeof data.totalSolved !== "number") return null;
    return data as WidgetLeetCodeSnapshot;
  } catch {
    return null;
  }
}

function startTelemetryLoop(signal: AbortSignal): void {
  let rafId = 0;
  let frames = 0;
  let lastTick = performance.now();

  const tick = (now: number) => {
    if (signal.aborted) return;
    // Skip work entirely while the tab is backgrounded.
    if (document.hidden) {
      lastTick = now;
      rafId = requestAnimationFrame(tick);
      return;
    }
    frames += 1;
    if (now - lastTick >= 1000) {
      const heap =
        typeof window !== "undefined" && (performance as unknown as { memory?: { usedJSHeapSize: number } }).memory
          ? (performance as unknown as { memory: { usedJSHeapSize: number } }).memory.usedJSHeapSize
          : null;
      const frame: WidgetTelemetryFrame = {
        fps: frames,
        memoryMB: heap !== null ? parseFloat((heap / (1024 * 1024)).toFixed(1)) : null,
      };
      emitWidgetEvent("telemetry", frame);
      frames = 0;
      lastTick = now;
    }
    rafId = requestAnimationFrame(tick);
  };

  rafId = requestAnimationFrame(tick);
  signal.addEventListener("abort", () => cancelAnimationFrame(rafId), { once: true });
  document.addEventListener(
    "visibilitychange",
    () => {
      // Reset baseline so the hidden interval doesn't skew the next FPS frame.
      lastTick = performance.now();
      frames = 0;
    },
    { signal }
  );
}

let lastGitHubFetch = 0;
let lastLeetCodeFetch = 0;
let externalTimer: ReturnType<typeof setInterval> | null = null;
let abortController: AbortController | null = null;

/** Fetch each source only when its cooldown has elapsed (or when forced). */
async function refreshExternal(force = false): Promise<void> {
  const now = Date.now();
  const wantGitHub = force || now - lastGitHubFetch >= GITHUB_COOLDOWN_MS;
  const wantLeetCode = force || now - lastLeetCodeFetch >= LEETCODE_COOLDOWN_MS;

  const [github, leetcode] = await Promise.all([
    wantGitHub ? fetchGitHub() : Promise.resolve(null),
    wantLeetCode ? fetchLeetCode() : Promise.resolve(null),
  ]);

  if (github) {
    lastGitHubFetch = Date.now();
    emitWidgetEvent("github", github);
  }
  if (leetcode) {
    lastLeetCodeFetch = Date.now();
    emitWidgetEvent("leetcode", leetcode);
  }
}

/**
 * Start the singleton background sync. Safe to call from any component —
 * subsequent calls are no-ops while a sync is already running.
 */
export function ensureWidgetSync(): () => void {
  if (typeof window === "undefined") return () => {};
  if (syncStarted) return () => {};

  syncStarted = true;
  abortController = new AbortController();
  const { signal } = abortController;

  startTelemetryLoop(signal);

  // Prime external snapshots immediately, then keep them warm on a cooldown.
  void refreshExternal();
  externalTimer = setInterval(() => {
    if (document.hidden) return; // don't burn API budget in background tabs
    void refreshExternal();
  }, GITHUB_COOLDOWN_MS);

  return () => {
    // Only torn down in tests; the OS keeps the sync alive for the session.
    abortController?.abort();
    if (externalTimer) clearInterval(externalTimer);
    syncStarted = false;
    lastGitHubFetch = 0;
    lastLeetCodeFetch = 0;
  };
}

/**
 * Ask the background sync to refresh external API snapshots immediately
 * (e.g. when the WidgetBoard opens), respecting per-source cooldowns.
 */
export function refreshWidgetsNow(): void {
  if (!syncStarted) {
    ensureWidgetSync();
    return;
  }
  void refreshExternal(true);
}
