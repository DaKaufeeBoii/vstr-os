import { NextResponse } from "next/server";

export async function GET() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch("https://alfa-leetcode-api.onrender.com/userProfile/DaKaufeeBoii", {
      signal: controller.signal,
      next: { revalidate: 3600 },
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && typeof data.totalSolved === "number") {
        return NextResponse.json({
          username: "DaKaufeeBoii",
          totalSolved: data.totalSolved,
          easySolved: data.easySolved ?? 0,
          mediumSolved: data.mediumSolved ?? 0,
          hardSolved: data.hardSolved ?? 0,
          acceptanceRate: typeof data.acceptanceRate === "number" ? data.acceptanceRate : 0,
          ranking: data.ranking ?? 0,
          contributionPoints: data.contributionPoint ?? 0,
          reputation: data.reputation ?? 0,
        });
      }
    }
  } catch {
    // API failed or timed out
  }

  // Graceful response so widget sync doesn't flood dev logs with 500s while preserving null check
  return NextResponse.json(null, { status: 200 });
}
