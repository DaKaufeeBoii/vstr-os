/** Server-only guestbook storage. Production uses Supabase Postgres; local
 * development uses an atomic JSON file. Production never falls back to memory. */
import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

export interface GuestbookEntry {
  id: string;
  name: string;
  role: "Recruiter" | "Engineer" | "Designer" | "Visitor";
  message: string;
  timestamp: string;
  avatarColor: string;
}

export const GUESTBOOK_ROLES: GuestbookEntry["role"][] = ["Recruiter", "Engineer", "Designer", "Visitor"];

const MAX_ENTRIES = 100;
const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "guestbook.json");
const SEED_ENTRIES: GuestbookEntry[] = [{
  id: "gb-seed-welcome",
  name: "VSTR-OS",
  role: "Engineer",
  message: "Welcome to the visitor wall! Leave a note for the portfolio owner.",
  timestamp: "Welcome",
  avatarColor: "#06b6d4",
}];

interface SupabaseRow {
  id: string;
  name: string;
  role: GuestbookEntry["role"];
  message: string;
  created_at: string;
  avatar_color: string;
}

function supabaseConfig() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Guestbook storage is not configured.");
    }
    return null;
  }
  return { url: url.replace(/\/$/, ""), key };
}

function dbHeaders(key: string) {
  return { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
}

function fromRow(row: SupabaseRow): GuestbookEntry {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    message: row.message,
    timestamp: new Date(row.created_at).toLocaleString(),
    avatarColor: row.avatar_color,
  };
}

async function readLocal(): Promise<GuestbookEntry[]> {
  try {
    const parsed: unknown = JSON.parse(await fs.readFile(DATA_FILE, "utf8"));
    if (!Array.isArray(parsed)) throw new Error("Guestbook data file has an invalid format.");
    return parsed.filter(isValidEntry).slice(0, MAX_ENTRIES);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    await writeLocal(SEED_ENTRIES);
    return [...SEED_ENTRIES];
  }
}

async function writeLocal(entries: GuestbookEntry[]) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const tempPath = `${DATA_FILE}.${randomUUID()}.tmp`;
  await fs.writeFile(tempPath, JSON.stringify(entries, null, 2), "utf8");
  await fs.rename(tempPath, DATA_FILE);
}

function isValidEntry(value: unknown): value is GuestbookEntry {
  if (!value || typeof value !== "object") return false;
  const e = value as Record<string, unknown>;
  return typeof e.id === "string" && typeof e.name === "string" && typeof e.message === "string" && GUESTBOOK_ROLES.includes(e.role as GuestbookEntry["role"]);
}

export async function listEntries(): Promise<GuestbookEntry[]> {
  const config = supabaseConfig();
  if (!config) return readLocal();

  const response = await fetch(`${config.url}/rest/v1/guestbook_entries?select=id,name,role,message,created_at,avatar_color&order=created_at.desc&limit=${MAX_ENTRIES - 1}`, {
    headers: dbHeaders(config.key),
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Could not load guestbook entries.");
  const rows = await response.json() as SupabaseRow[];
  return [...SEED_ENTRIES, ...rows.map(fromRow)];
}

export async function addEntry(entry: GuestbookEntry): Promise<GuestbookEntry[]> {
  const config = supabaseConfig();
  if (!config) {
    const entries = [entry, ...(await readLocal())].slice(0, MAX_ENTRIES);
    await writeLocal(entries);
    return entries;
  }

  const response = await fetch(`${config.url}/rest/v1/guestbook_entries`, {
    method: "POST",
    headers: { ...dbHeaders(config.key), Prefer: "return=minimal" },
    body: JSON.stringify({
      id: entry.id,
      name: entry.name,
      role: entry.role,
      message: entry.message,
      avatar_color: entry.avatarColor,
    }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Could not save your guestbook entry. Please try again later.");
  return listEntries();
}

/** Shared production limiter via a transactional Postgres RPC; local limits
 * are only a development convenience and never used on production deployments. */
const localRateLimit = new Map<string, { count: number; expiresAt: number }>();
export async function consumePostRateLimit(ipHash: string): Promise<boolean> {
  const config = supabaseConfig();
  if (!config) {
    const now = Date.now();
    const current = localRateLimit.get(ipHash);
    if (!current || current.expiresAt <= now) {
      localRateLimit.set(ipHash, { count: 1, expiresAt: now + 60_000 });
      return true;
    }
    if (current.count >= 5) return false;
    current.count += 1;
    return true;
  }

  const response = await fetch(`${config.url}/rest/v1/rpc/consume_guestbook_rate_limit`, {
    method: "POST",
    headers: dbHeaders(config.key),
    body: JSON.stringify({ p_ip_hash: ipHash, p_max_requests: 5, p_window_seconds: 60 }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Guestbook rate limiting is unavailable.");
  return response.json() as Promise<boolean>;
}
