import { NextRequest, NextResponse } from "next/server";
import { scrapeTopChessPlayers } from "@/lib/scrapers/top-chess-players";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const scraperType = request.headers.get("Scraper-Type") ?? "geonode";

  if (
    scraperType !== "geonode" &&
    scraperType !== "browserbase" &&
    scraperType !== "none"
  ) {
    return NextResponse.json(
      {
        error:
          'Invalid scraper type. Must be "geonode" | "browserbase" | "none"',
      },
      { status: 400 },
    );
  }

  const result = await scrapeTopChessPlayers(scraperType);

  return Response.json({ ok: true, ...result });
}
