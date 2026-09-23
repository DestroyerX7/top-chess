import { db } from "@top-chess/db";
import { worldChampions as dbWorldChampions } from "@top-chess/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function GET() {
  const [worldChampions] = await db
    .select()
    .from(dbWorldChampions)
    .where(eq(dbWorldChampions.key, "current"));

  if (worldChampions === undefined) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }

  return NextResponse.json(worldChampions.data);
}
