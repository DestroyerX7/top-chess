import { db } from "@top-chess/db";
import { topChessPlayers } from "@top-chess/db/src/schema";
import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/jwt";

const updateTopChessPlayerSchema = z.object({
  wikipediaUrl: z.string().nullable().optional(),
  imageUrl: z.httpUrl().nullable().optional(),
  description: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
});

export async function GET(
  _: Request,
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
  request: Request,
  { params }: { params: Promise<{ fideId: string }> },
) {
  const cookieStore = await cookies();
  const jwt = cookieStore.get("jwt")?.value;

  if (jwt === undefined) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await verifyJwt<{ admin: boolean }>(jwt);

  if (payload === null) {
    return {
      error: NextResponse.json({ error: "Invalid jwt" }, { status: 401 }),
    };
  }

  if (!payload.admin) {
    return {
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
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

  const bodyResult = updateTopChessPlayerSchema.safeParse(request.body);

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
