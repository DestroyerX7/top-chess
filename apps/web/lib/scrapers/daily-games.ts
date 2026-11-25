import { db } from "@top-chess/db";
import { browserbaseFetch } from "./browserbase";
import { geonodeFetch } from "./geonode";
import { dailyGames } from "@top-chess/db/schema";
import { sql } from "drizzle-orm";
import axios from "axios";
import { DailyGames } from "@top-chess/db/types";
import { ScraperType } from "./types";

const url = "https://2700chess.com/next/daily-games?gender=men";

export async function scrapeDailyGames(scraperType: ScraperType = "geonode") {
  let data: DailyGames | null = null;

  if (scraperType === "browserbase") {
    const content = await browserbaseFetch(url);
    data = JSON.parse(content);
  } else if (scraperType === "geonode") {
    data = await geonodeFetch<DailyGames>(url);
  } else if (scraperType === "none") {
    const response = await axios.get<DailyGames>(url);
    data = response.data;
  }

  if (data === null) {
    return { error: "Unable to scrape top daily games." };
  }

  await db
    .insert(dailyGames)
    .values({
      key: "men",
      data,
    })
    .onConflictDoUpdate({
      target: dailyGames.key,
      set: {
        data: sql`excluded.data`,
      },
    });

  console.log("Successfully scraped and saved daily games to database!");

  return data;
}
