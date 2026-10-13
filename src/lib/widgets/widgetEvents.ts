/**
 * widgetEvents.ts
 *
 * Cross-component event bus for background widget synchronization (§2.1).
 *
 * `OSSettings` remains the single source of truth for widget visibility
 * config; this bus carries live *payloads* (telemetry frames, external API
 * snapshots) so every consumer — the full WidgetBoard, the lightweight
 * always-on `DesktopWidgets`, or any future background service — receives
 * the same update exactly once per tick, with no duplicate fetchers or
 * divergent polling intervals.
 */

export interface WidgetTelemetryFrame {
  fps: number;
  memoryMB: number | null;
}

export interface WidgetGitHubSnapshot {
  events: { repo: string; message: string; date: string }[];
}

export interface WidgetLeetCodeSnapshot {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  acceptanceRate: number;
  ranking: number;
}

type WidgetEventMap = {
  telemetry: WidgetTelemetryFrame;
  github: WidgetGitHubSnapshot;
  leetcode: WidgetLeetCodeSnapshot;
};

type WidgetEventKey = keyof WidgetEventMap;
type Listener<T> = (payload: T) => void;

const registry = new Map<WidgetEventKey, Set<Listener<never>>>();
const latest = new Map<WidgetEventKey, unknown>();

function listenersFor<K extends WidgetEventKey>(key: K): Set<Listener<WidgetEventMap[K]>> {
  let set = registry.get(key) as Set<Listener<WidgetEventMap[K]>> | undefined;
  if (!set) {
    set = new Set();
    registry.set(key, set as Set<Listener<never>>);
  }
  return set;
}

/** Broadcast a new payload; caches it as the latest snapshot for late subscribers. */
export function emitWidgetEvent<K extends WidgetEventKey>(
  key: K,
  payload: WidgetEventMap[K]
): void {
  latest.set(key, payload);
  const set = registry.get(key);
  if (!set) return;
  for (const listener of Array.from(set)) {
    try {
      (listener as Listener<WidgetEventMap[K]>)(payload);
    } catch (e) {
      console.error(`widgetEvents: listener for "${key}" failed:`, e);
    }
  }
}

/**
 * Subscribe to a widget event. The latest cached payload (if any) is delivered
 * immediately so late subscribers never render a blank state.
 */
export function onWidgetEvent<K extends WidgetEventKey>(
  key: K,
  listener: Listener<WidgetEventMap[K]>
): () => void {
  const set = listenersFor(key);
  set.add(listener);
  const cached = latest.get(key) as WidgetEventMap[K] | undefined;
  if (cached !== undefined) {
    try {
      listener(cached);
    } catch (e) {
      console.error(`widgetEvents: listener for "${key}" failed on replay:`, e);
    }
  }
  return () => {
    set.delete(listener);
  };
}
