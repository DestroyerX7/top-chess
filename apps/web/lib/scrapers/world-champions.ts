import { db } from "@top-chess/db";
import { browserbaseFetch } from "./browserbase";
import { worldChampions } from "@top-chess/db/schema";
import { sql } from "drizzle-orm";
import axios from "axios";
import { WorldChampions } from "@top-chess/db/types";
import { geonodeFetch } from "./geonode";
import { ScraperType } from "./types";

const url = "https://2700chess.com/next/world-champions";

export async function scrapeWorldChampions(
  scraperType: ScraperType = "geonode",
) {
  let data: WorldChampions | null = null;

  if (scraperType === "browserbase") {
    const content = await browserbaseFetch(url);
    data = JSON.parse(content);
  } else if (scraperType === "geonode") {
    data = await geonodeFetch<WorldChampions>(url);
  } else if (scraperType === "none") {
    const response = await axios.get<WorldChampions>(url);
    data = response.data;
  }

  if (data === null) {
    return { error: "Unable to scrape world champions." };
  }

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

  return data;
}
