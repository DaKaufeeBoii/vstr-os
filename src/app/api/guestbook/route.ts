import { NextResponse } from "next/server";
import { createHmac, randomUUID } from "node:crypto";
import {
  addEntry,
  listEntries,
  GUESTBOOK_ROLES,
  consumePostRateLimit,
  type GuestbookEntry,
} from "@/lib/guestbook/store";

// Filesystem-backed store: never statically cache, always run on the Node runtime.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Re-export for existing consumers importing the type from this route.
export type { GuestbookEntry };

export async function GET() {
  try {
    const entries = await listEntries();
    return NextResponse.json(entries, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Guestbook is temporarily unavailable." }, { status: 503 });
  }
}

export async function POST(req: Request) {
  try {
    const contentLength = Number(req.headers.get("content-length") ?? 0);
    if (contentLength > 4096) {
      return NextResponse.json({ error: "Request is too large." }, { status: 413 });
    }

    let rawBody = "";
    try {
      const reader = req.body?.getReader();
      if (!reader) return NextResponse.json({ error: "Request body is required." }, { status: 400 });
      const chunks: Uint8Array[] = [];
      let totalBytes = 0;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        totalBytes += value.byteLength;
        if (totalBytes > 4096) {
          await reader.cancel();
          return NextResponse.json({ error: "Request is too large." }, { status: 413 });
        }
        chunks.push(value);
      }
      const bytes = new Uint8Array(totalBytes);
      let offset = 0;
      for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
      rawBody = new TextDecoder().decode(bytes);
    } catch {
      return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
    }
    let body: unknown;
    try { body = JSON.parse(rawBody); } catch {
      return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
    }
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }
    const { name, role, message } = body as Record<string, unknown>;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    if (name.trim().length > 40) {
      return NextResponse.json({ error: "Name must be 40 characters or fewer." }, { status: 400 });
    }
    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }
    if (message.trim().length > 280) {
      return NextResponse.json({ error: "Message must be 280 characters or fewer." }, { status: 400 });
    }
    if (role !== undefined && (typeof role !== "string" || !GUESTBOOK_ROLES.includes(role as GuestbookEntry["role"]))) {
      return NextResponse.json({ error: "Choose a valid visitor role." }, { status: 400 });
    }

    const secret = process.env.GUESTBOOK_RATE_LIMIT_SECRET;
    if (process.env.NODE_ENV === "production" && !secret) {
      return NextResponse.json({ error: "Guestbook is temporarily unavailable." }, { status: 503 });
    }
    const forwardedFor = req.headers.get("x-forwarded-for")?.split(",")[0].trim();
    const clientIp = forwardedFor || req.headers.get("x-real-ip") || "local";
    const ipHash = createHmac("sha256", secret || "local-development-only").update(clientIp).digest("hex");
    if (!(await consumePostRateLimit(ipHash))) {
      return NextResponse.json({ error: "Too many requests. Please wait a minute before posting again." }, { status: 429 });
    }

    const colors = ["#e94560", "#a855f7", "#06b6d4", "#22c55e", "#f59e0b"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newEntry: GuestbookEntry = {
      id: `gb-${randomUUID()}`,
      name: name.trim().replace(/[\u0000-\u001f\u007f]/g, ""),
      role: (role as GuestbookEntry["role"] | undefined) ?? "Visitor",
      message: message.trim().replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, ""),
      timestamp: "Just now",
      avatarColor: randomColor,
    };

    const entries = await addEntry(newEntry);

    return NextResponse.json({ success: true, entry: newEntry, entries });
  } catch (err: unknown) {
    console.error("[Guestbook] Request failed", err);
    return NextResponse.json({ error: "Guestbook is temporarily unavailable. Please try again later." }, { status: 503 });
  }
}
