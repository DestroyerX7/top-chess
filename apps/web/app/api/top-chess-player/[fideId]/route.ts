import { db } from "@top-chess/db";
import { topChessPlayers } from "@top-chess/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/jwt";

const updateTopChessPlayerSchema = z.object({
  wikipediaUrl: z.httpUrl().nullable().optional(),
  imageUrl: z.httpUrl().nullable().optional(),
  description: z.string().min(1).nullable().optional(),
  bio: z.string().min(1).nullable().optional(),
});

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ fideId: string }> },
) {
  const { fideId: fideIdParam } = await params;
  const paramsResult = z.coerce.number().int().safeParse(fideIdParam);

  if (!paramsResult.success) {
    return NextResponse.json(
      {
        error: z.treeifyError(paramsResult.error),
      },
      { status: 400 },
    );
  }

  const fideId = paramsResult.data;

  const [topChessPlayer] = await db
    .select()
    .from(topChessPlayers)
    .where(eq(topChessPlayers.fideId, fideId));

  if (topChessPlayer === undefined) {
    return NextResponse.json(
      { error: "Top chess player not found" },
      { status: 404 },
    );
  }

  return NextResponse.json(topChessPlayer);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ fideId: string }> },
) {
  const cookieStore = await cookies();
  const jwt = cookieStore.get("jwt")?.value;

  if (jwt === undefined) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await verifyJwt<{ admin: boolean }>(jwt);

  if (payload === null) {
    return NextResponse.json({ error: "Invalid jwt" }, { status: 401 });
  }

  if (!payload.admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { fideId: fideIdParam } = await params;
  const paramsResult = z.coerce.number().int().safeParse(fideIdParam);

  if (!paramsResult.success) {
    return NextResponse.json(
      {
        error: z.treeifyError(paramsResult.error),
      },
      { status: 400 },
    );
  }

  const body = await request.json();
  const bodyResult = updateTopChessPlayerSchema.safeParse(body);

  if (!bodyResult.success) {
    return NextResponse.json(
      {
        error: z.treeifyError(bodyResult.error),
      },
      { status: 400 },
    );
  }

  const fideId = paramsResult.data;

  const [topChessPlayer] = await db
    .update(topChessPlayers)
    .set(bodyResult.data)
    .where(eq(topChessPlayers.fideId, fideId))
    .returning();

  if (topChessPlayer === undefined) {
    return NextResponse.json(
      { error: "Top chess player not found" },
      { status: 404 },
    );
  }

  return NextResponse.json(topChessPlayer);
}
