import { NextResponse } from "next/server";

export interface GuestbookEntry {
  id: string;
  name: string;
  role: "Recruiter" | "Engineer" | "Designer" | "Visitor";
  message: string;
  timestamp: string;
  avatarColor: string;
}

// In-memory backing store (starts empty, real persistence needs a true database)
let guestbookEntries: GuestbookEntry[] = [];

export async function GET() {
  return NextResponse.json(guestbookEntries);
}

export async function POST(req: Request) {
  try {
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

    // Prepend to list
    guestbookEntries = [newEntry, ...guestbookEntries];

    return NextResponse.json({ success: true, entry: newEntry, entries: guestbookEntries });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to post message" }, { status: 500 });
  }
}
