import { NextResponse } from "next/server";

export interface GuestbookEntry {
  id: string;
  name: string;
  role: "Recruiter" | "Engineer" | "Designer" | "Visitor";
  message: string;
  timestamp: string;
  avatarColor: string;
}

// In-memory backing store (starts empty, capped to prevent unbounded memory growth)
const MAX_ENTRIES = 100;
let guestbookEntries: GuestbookEntry[] = [];

// Lightweight in-memory rate limiter (5 requests per IP per minute)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 5;

  // Evict expired entries if map grows to avoid memory leaks
  if (rateLimitMap.size > 200) {
    for (const [key, val] of rateLimitMap.entries()) {
      if (now > val.resetAt) rateLimitMap.delete(key);
    }
  }

  const record = rateLimitMap.get(ip);
  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (record.count >= maxRequests) {
    return false;
  }
  record.count += 1;
  return true;
}

export async function GET() {
  return NextResponse.json(guestbookEntries);
}

export async function POST(req: Request) {
  try {
    const forwardedFor = req.headers.get("x-forwarded-for");
    const clientIp = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

    if (!checkRateLimit(clientIp)) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a minute before posting again." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { name, role, message } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    if (!message || !message.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const sanitizedName = name.trim().slice(0, 40);
    const sanitizedMsg = message.trim().slice(0, 280);
    const validRoles: GuestbookEntry["role"][] = ["Recruiter", "Engineer", "Designer", "Visitor"];
    const validRole = validRoles.includes(role) ? role : "Visitor";

    const colors = ["#e94560", "#a855f7", "#06b6d4", "#22c55e", "#f59e0b"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newEntry: GuestbookEntry = {
      id: `gb-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: sanitizedName,
      role: validRole,
      message: sanitizedMsg,
      timestamp: "Just now",
      avatarColor: randomColor,
    };

    // Prepend to list and cap total entries
    guestbookEntries = [newEntry, ...guestbookEntries].slice(0, MAX_ENTRIES);

    return NextResponse.json({ success: true, entry: newEntry, entries: guestbookEntries });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to post message" }, { status: 500 });
  }
}
