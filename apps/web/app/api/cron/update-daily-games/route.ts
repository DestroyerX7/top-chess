import { scrapeDailyGames } from "@/lib/scrapers/daily-games";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await scrapeDailyGames();

  return NextResponse.json({ ok: true });
}
