import { db } from "@top-chess/db";
import { asc } from "drizzle-orm";
import { topChessPlayers } from "@top-chess/db/src/schema";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET(request: NextRequest) {
  const limitParam = request.nextUrl.searchParams.get("limit") ?? 250;
  const result = z.coerce
    .number()
    .int()
    .min(1)
    .max(250)
    .default(250)
    .safeParse(limitParam);

  if (!result.success) {
    return NextResponse.json(
      { error: z.treeifyError(result.error) },
      { status: 400 },
    );
  }

  const limit = result.data;

  const chessPlayers = await db
    .select()
    .from(topChessPlayers)
    .orderBy(asc(topChessPlayers.standardRank))
    .limit(limit);

  return NextResponse.json(chessPlayers);
}
