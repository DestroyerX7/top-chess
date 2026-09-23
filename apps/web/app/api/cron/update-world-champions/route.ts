import { scrapeWorldChampions } from "@/lib/scrapers/world-champions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await scrapeWorldChampions();

  return NextResponse.json({ ok: true });
}
