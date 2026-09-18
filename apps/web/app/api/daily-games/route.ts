import { db } from "@top-chess/db";
import { dailyGames as dbDailyGames } from "@top-chess/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get("key") ?? "men";

  if (key !== "men" && key !== "women") {
    return NextResponse.json(
      { error: "Key must be either men or women" },
      { status: 400 },
    );
  }

  const [dailyGames] = await db
    .select()
    .from(dbDailyGames)
    .where(eq(dbDailyGames.key, key));

  if (dailyGames === undefined) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }

  return NextResponse.json(dailyGames.data);
}
