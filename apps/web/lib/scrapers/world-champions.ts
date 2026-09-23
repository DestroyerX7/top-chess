import { db } from "@top-chess/db";
import { browserbaseFetch } from "./browserbase";
import { worldChampions } from "@top-chess/db/schema";
import { sql } from "drizzle-orm";

export async function scrapeWorldChampions() {
  const content = await browserbaseFetch(
    "https://2700chess.com/next/world-champions",
  );
  const data = JSON.parse(content);

  await db
    .insert(worldChampions)
    .values({ key: "current", data })
    .onConflictDoUpdate({
      target: worldChampions.key,
      set: {
        data: sql`excluded.data`,
      },
    });

  console.log("Successfully scraped and saved world champions to database!");
}
