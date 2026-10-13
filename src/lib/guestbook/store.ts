/**
 * guestbook/store.ts
 *
 * Durable, dependency-free backing store for the public Guestbook.
 *
 * Persistence strategy:
 *  1. Primary: a JSON file at `<cwd>/.data/guestbook.json` (survives restarts
 *     on self-hosted / local dev / any host with a writable filesystem).
 *  2. Fallback: an in-process array when the filesystem is read-only or
 *     ephemeral (e.g. serverless), so the app degrades gracefully instead of
 *     failing the request.
 *
 * Kept server-only; never imported by client components.
 */

import { promises as fs } from "fs";
import path from "path";

export interface GuestbookEntry {
  id: string;
  name: string;
  role: "Recruiter" | "Engineer" | "Designer" | "Visitor";
  message: string;
  timestamp: string;
  avatarColor: string;
}

export const GUESTBOOK_ROLES: GuestbookEntry["role"][] = [
  "Recruiter",
  "Engineer",
  "Designer",
  "Visitor",
];

const MAX_ENTRIES = 100;
const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "guestbook.json");

/** Seeds shown on a brand-new deployment (newest first). */
const SEED_ENTRIES: GuestbookEntry[] = [
  {
    id: "gb-seed-welcome",
    name: "VSTR-OS",
    role: "Engineer",
    message:
      "Welcome to the visitor wall! Sign in with your name and leave a note — recruiters, engineers, and friends all welcome.",
    timestamp: "Welcome",
    avatarColor: "#06b6d4",
  },
];

let memory: GuestbookEntry[] | null = null;
let fileWritable = true;

async function readFromDisk(): Promise<GuestbookEntry[] | null> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter(isValidEntry).slice(0, MAX_ENTRIES);
    }
  } catch {
    // Missing file on first run, or unreadable FS — handled by caller.
  }
  return null;
}

async function writeToDisk(entries: GuestbookEntry[]): Promise<void> {
  if (!fileWritable) return;
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(entries, null, 2), "utf8");
  } catch {
    // Read-only / ephemeral filesystem: keep serving from memory.
    fileWritable = false;
  }
}

function isValidEntry(value: unknown): value is GuestbookEntry {
  if (!value || typeof value !== "object") return false;
  const e = value as Record<string, unknown>;
  return (
    typeof e.id === "string" &&
    typeof e.name === "string" &&
    typeof e.message === "string" &&
    typeof e.role === "string"
  );
}

async function load(): Promise<GuestbookEntry[]> {
  if (memory) return memory;
  const fromDisk = await readFromDisk();
  memory = fromDisk ?? [...SEED_ENTRIES];
  if (!fromDisk) {
    // Persist the seed so subsequent boots have a stable baseline.
    await writeToDisk(memory);
  }
  return memory;
}

/** All entries, newest first. */
export async function listEntries(): Promise<GuestbookEntry[]> {
  return load();
}

/** Prepend a new entry, enforcing the cap, and persist durably if possible. */
export async function addEntry(entry: GuestbookEntry): Promise<GuestbookEntry[]> {
  const current = await load();
  const next = [entry, ...current].slice(0, MAX_ENTRIES);
  memory = next;
  await writeToDisk(next);
  return next;
}
