import { db } from "@top-chess/db";
// import { browserbaseFetch } from "./browserbase";
import { dailyGames } from "@top-chess/db/schema";
import { sql } from "drizzle-orm";
import axios from "axios";
import { DailyGames } from "@top-chess/db/types";

export async function scrapeDailyGames() {
  // const content = await browserbaseFetch(
  //   "https://2700chess.com/next/daily-games?gender=men",
  // );
  // const data = JSON.parse(content);

  const response = await axios.get<DailyGames>(
    `https://2700chess.com/next/daily-games?gender=men`,
  );

  await db
    .insert(dailyGames)
    .values({
      key: "men",
      data: response.data,
    })
    .onConflictDoUpdate({
      target: dailyGames.key,
      set: {
        data: sql`excluded.data`,
      },
    });

  console.log("Successfully scraped and saved daily games to database!");
}
