"use server";

import { WikiPage } from "@/lib/wikipedia";
import { db } from "@top-chess/db";
import { topChessPlayers } from "@top-chess/db/schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

export async function yo(fideId: number, p: WikiPage) {
  await db
    .update(topChessPlayers)
    .set({
      wikipediaUrl: p.fullurl,
      imageUrl: p.thumbnail?.source,
      bio: p.extract,
      description: p.description,
    })
    .where(eq(topChessPlayers.fideId, fideId));

  revalidatePath("/admin/dashboard");
  redirect("/admin/dashboard");
}
