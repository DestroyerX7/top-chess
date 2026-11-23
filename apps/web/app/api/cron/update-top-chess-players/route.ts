import { NextRequest, NextResponse } from "next/server";
import { scrapeTopChessPlayers } from "@/lib/scrapers/top-chess-players";

export async function POST(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await scrapeTopChessPlayers();

  return Response.json({ ok: true, ...result });
}
