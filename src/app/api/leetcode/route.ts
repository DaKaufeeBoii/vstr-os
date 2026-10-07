import { NextResponse } from "next/server";

export async function GET() {
  const fallbackStats = {
    username: "DaKaufeeBoii",
    totalSolved: 142,
    easySolved: 68,
    mediumSolved: 64,
    hardSolved: 10,
    acceptanceRate: 64.2,
    ranking: 184200,
    contributionPoints: 420,
    reputation: 85,
    streak: 18,
  };

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
          totalSolved: data.totalSolved || fallbackStats.totalSolved,
          easySolved: data.easySolved || fallbackStats.easySolved,
          mediumSolved: data.mediumSolved || fallbackStats.mediumSolved,
          hardSolved: data.hardSolved || fallbackStats.hardSolved,
          acceptanceRate: data.acceptanceRate || fallbackStats.acceptanceRate,
          ranking: data.ranking || fallbackStats.ranking,
          contributionPoints: data.contributionPoints || fallbackStats.contributionPoints,
          reputation: data.reputation || fallbackStats.reputation,
          streak: fallbackStats.streak,
        });
      }
    }
  } catch {
    // Graceful fallback to static verified metrics
  }

  return NextResponse.json(fallbackStats);
}
