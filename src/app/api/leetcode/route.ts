import { NextResponse } from "next/server";

export async function GET() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const res = await fetch("https://leetcode-stats-api.herokuapp.com/DaKaufeeBoii", {
      signal: controller.signal,
      next: { revalidate: 3600 },
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.status === "success") {
        return NextResponse.json({
          username: "DaKaufeeBoii",
          totalSolved: data.totalSolved,
          easySolved: data.easySolved,
          mediumSolved: data.mediumSolved,
          hardSolved: data.hardSolved,
          acceptanceRate: data.acceptanceRate,
          ranking: data.ranking,
          contributionPoints: data.contributionPoints,
          reputation: data.reputation,
        });
      }
    }
  } catch {
    // API failed, return null to reflect failure rather than mocked data
  }

  return NextResponse.json(null, { status: 500 });
}
