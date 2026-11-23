import { db } from "@top-chess/db";
// import { browserbaseFetch } from "./browserbase";
import { worldChampions } from "@top-chess/db/schema";
import { sql } from "drizzle-orm";
import axios from "axios";
import { WorldChampions } from "@top-chess/db/types";

export async function scrapeWorldChampions() {
  // const content = await browserbaseFetch(
  //   "https://2700chess.com/next/world-champions",
  // );
  // const data = JSON.parse(content);

  const response = await axios.get<WorldChampions>(
    `https://2700chess.com/next/world-champions`,
  );

  await db
    .insert(worldChampions)
    .values({ key: "current", data: response.data })
    .onConflictDoUpdate({
      target: worldChampions.key,
      set: {
        data: sql`excluded.data`,
      },
    });

  console.log("Successfully scraped and saved world champions to database!");
}
