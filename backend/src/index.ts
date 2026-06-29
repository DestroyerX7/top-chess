import { Hono } from "hono";
import { neon, NeonQueryFunction } from "@neondatabase/serverless";
import { drizzle, NeonHttpDatabase } from "drizzle-orm/neon-http";
import {
  chessPlayers as dbChessPlayers,
  dailyGames as dbDailyGames,
  worldChampions as dbWorldChampions,
} from "./db/schema";
import { eq, notInArray, sql } from "drizzle-orm";

type ScrapedChessPlayer = {
  // Identity
  fideid: number;
  name: string;
  age: number;
  flag: string;
  country_name: string;
  birthday: string;
  birthday_unix: number | null;

  // Standard rating
  rating: string;
  raitingDiff: number;
  standard_raiting: string;
  standard_tooltip_text: string;
  standard_last_update: number | null;
  standard_games_count: number;
  standard_best_rating_title: string;

  // Blitz rating
  blitz_raiting: string;
  blitz_tooltip_text: string;
  blitz_last_update: number | null;
  blitz_games_count: number;
  blitz_best_rating_title: string;

  // Rapid rating
  rapid_raiting: string;
  rapid_tooltip_text: string;
  rapid_last_update: number | null;
  rapid_games_count: number;
  rapid_best_rating_title: string;

  // Junior rating
  junior_raiting: string;
  junior_tooltip_text: string;

  // Live positions
  live_pos: number;
  live_standard_pos: number;
  live_rapid_pos: number;
  live_blitz_pos: number;
  live_juniors_pos: number;
  live_girls_pos: number | null;

  // Position changes
  pos_change: string;
  pos_change_value: number;

  // Year ago changes
  year_ago_rating_change: number;
  year_ago_ranking_change: number;

  // Live status
  live: boolean;
  has_live_standard: boolean;
  has_live_rapid: boolean;
  has_live_blitz: boolean;
  has_unfinished_standard: boolean;
  has_unfinished_rapid: boolean;
  has_unfinished_blitz: boolean;

  // History & stats
  rating_history_sparkline: number[];
  games_count: number;
  last_update: number | null;
  last_updated_gmt: string;
  tooltip_text: string;
  type: string;

  // Records
  best_pos_title: string;
  best_rating_title: string;

  // Links
  games_archive: string;
  statistic: string;
  profile: string;

  // Sorting helpers
  sort_helper: string;
  sort_helper_inv: string;
};

type WikiResponse = {
  query: {
    pages: Record<string, WikiPage>;
  };
};

type WikiPage = {
  pageid: number;
  title: string;
  extract?: string;
  description?: string;
  thumbnail?: {
    source: string;
    width: number;
    height: number;
  };
  fullurl?: string;
  index: number;
};

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.get("/get-top-chess-players", async (c) => {
  try {
    const limitParam = c.req.query("limit");
    const limit = limitParam !== undefined ? Number(limitParam) : 100;

    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      return c.json(
        { error: "limit param must be an integer in the range [1,100]" },
        400,
      );
    }

    const neonClient = neon(c.env.NEON_DATABASE_URL);
    const db = drizzle(neonClient);

    const chessPlayers = await db
      .select()
      .from(dbChessPlayers)
      .orderBy(dbChessPlayers.livePos)
      .limit(limit);

    return c.json(chessPlayers);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Database fetch error:", error.message);
    } else {
      console.error("Database fetch error");
    }

    return c.json({ error: "Failed to get top chess players" }, 500);
  }
});

app.get("/image-proxy", async (c) => {
  const url = c.req.query("url");

  if (url === undefined) {
    return c.json({ error: "url not provided" }, 400);
  }

  const response = await fetch(url, {
    headers: {
      "User-Agent": "top-chess/1.0 (destroyerincdev@gmail.com)",
      Referer: "https://en.wikipedia.org/",
    },
  });

  if (!response.ok) {
    return c.json({ error: `Failed to fetch image: ${response.status}` }, 502);
  }

  return new Response(response.body, {
    headers: {
      "Content-Type": response.headers.get("Content-Type") ?? "image/jpeg",
      "Cache-Control": "public, max-age=604800", // cache for 7 days
    },
  });
});

app.get("/get-chess-player/:fideId", async (c) => {
  try {
    const fideIdParam = c.req.param("fideId");

    if (!fideIdParam) {
      return c.json({ error: "fideId param is required" }, 400);
    }

    const fideId = Number(fideIdParam);

    if (isNaN(fideId) || !Number.isInteger(fideId)) {
      return c.json({ error: "fideId must be an integer" }, 400);
    }

    if (!Number.isInteger(fideId)) {
      return c.json(
        { error: "fideId param must be provided as an integer" },
        400,
      );
    }

    const neonClient = neon(c.env.NEON_DATABASE_URL);
    const db = drizzle(neonClient);

    const [chessPlayer] = await db
      .select()
      .from(dbChessPlayers)
      .where(eq(dbChessPlayers.fideId, fideId));

    return c.json(chessPlayer ?? null);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Database fetch error:", error.message);
    } else {
      console.error("Database fetch error");
    }

    return c.json({ error: "Failed to get chess player" }, 500);
  }
});

app.get("/get-daily-games", async (c) => {
  try {
    const key = c.req.query("key") ?? "men";

    if (key !== "men" && key !== "women") {
      return c.json({ error: "Key must be either men or women" }, 400);
    }

    const neonClient = neon(c.env.NEON_DATABASE_URL);
    const db = drizzle(neonClient);

    const [dailyGames] = await db
      .select()
      .from(dbDailyGames)
      .where(eq(dbDailyGames.key, "men"));

    return c.json(dailyGames?.data);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Database fetch error:", error.message);
    } else {
      console.error("Database fetch error");
    }

    return c.json({ error: "Failed to get daily games" }, 500);
  }
});

app.get("/get-world-champions", async (c) => {
  try {
    const neonClient = neon(c.env.NEON_DATABASE_URL);
    const db = drizzle(neonClient);

    const [worldChampions] = await db
      .select()
      .from(dbWorldChampions)
      .where(eq(dbWorldChampions.key, "current"));

    return c.json(worldChampions?.data);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Database fetch error:", error.message);
    } else {
      console.error("Database fetch error");
    }

    return c.json({ error: "Failed to get world champions" }, 500);
  }
});

async function getChessPlayerWikiData(name: string) {
  try {
    const params = new URLSearchParams({
      action: "query",
      generator: "search",
      gsrsearch: name,
      prop: "extracts|pageimages|description|info",
      exintro: "true",
      explaintext: "true",
      pithumbsize: "500",
      inprop: "url",
      gsrnamespace: "0",
      format: "json",
    });

    const response = await fetch(
      `https://en.wikipedia.org/w/api.php?${params}`,
      {
        headers: { "User-Agent": "top-chess/1.0 (destroyerincdev@gmail.com)" },
      },
    );

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }

    const data: WikiResponse = await response.json();

    const pages = Object.values(data.query.pages).toSorted(
      (a, b) => a.index - b.index,
    );

    const page = pages.find((p) =>
      p.description?.toLowerCase().includes("chess"),
    );

    if (page === undefined) {
      return {
        imageUrl: null,
        bio: null,
        description: null,
        wikipediaUrl: null,
      };
    }

    return {
      imageUrl: page.thumbnail?.source ?? null,
      bio: page.extract?.trim() ?? null,
      description: page.description ?? null,
      wikipediaUrl: page.fullurl ?? null,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error(
        "Failed to get chess player wikipedia data:",
        error.message,
      );
    } else {
      console.error("Failed to get chess player wikipedia data");
    }

    return {
      imageUrl: null,
      bio: null,
      description: null,
      wikipediaUrl: null,
    };
  }
}

async function scrapeChessPlayers(
  scraperApikey: string,
  chessPlayerWikiDataQueue: Queue,
  db: NeonHttpDatabase<Record<string, never>> & {
    $client: NeonQueryFunction<false, false>;
  },
) {
  try {
    console.log("Scraping chess players...");

    const params = new URLSearchParams({
      api_key: scraperApikey,
      url: "https://2700chess.com/next/main-table-men?sort=standard&per-page=100",
    });

    const response = await fetch(`https://api.scraperapi.com?${params}`);

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }

    const data: ScrapedChessPlayer[] = await response.json();

    const flagOverrides: Record<string, string> = {
      ff: "ru",
      en: "gb",
    };

    const countryNameOverrides: Record<string, string> = {
      "FIDE (Not a National Fed.)": "Russia",
    };

    const chessPlayers = data.map((scrapedChessPlayer) => ({
      fideId: scrapedChessPlayer.fideid,
      name: scrapedChessPlayer.name,
      flag: flagOverrides[scrapedChessPlayer.flag] ?? scrapedChessPlayer.flag,
      countryName:
        countryNameOverrides[scrapedChessPlayer.country_name] ??
        scrapedChessPlayer.country_name,
      rating: Number(scrapedChessPlayer.rating),
      livePos: scrapedChessPlayer.live_pos,
      ratingDiff: scrapedChessPlayer.raitingDiff,
      posChangeValue: scrapedChessPlayer.pos_change_value,
      yearAgoRatingChange: scrapedChessPlayer.year_ago_rating_change,
      yearAgoRankingChange: scrapedChessPlayer.year_ago_ranking_change,
      gamesCount: scrapedChessPlayer.games_count,
      age: scrapedChessPlayer.age,
      birthday:
        scrapedChessPlayer.birthday_unix !== null
          ? new Date(scrapedChessPlayer.birthday_unix * 1000)
              .toISOString()
              .split("T")[0]
          : null,
      bestPosTitle: scrapedChessPlayer.best_pos_title,
      bestRatingTitle: scrapedChessPlayer.best_rating_title,
      live: scrapedChessPlayer.live,
      lastUpdatedGmt: new Date(scrapedChessPlayer.last_updated_gmt + " UTC"),
      ratingHistory: scrapedChessPlayer.rating_history_sparkline,
    }));

    const updatedChessPlayers = await db
      .insert(dbChessPlayers)
      .values(chessPlayers)
      .onConflictDoUpdate({
        target: dbChessPlayers.fideId,
        set: {
          name: sql`excluded.name`,
          flag: sql`excluded.flag`,
          countryName: sql`excluded.country_name`,
          rating: sql`excluded.rating`,
          livePos: sql`excluded.live_pos`,
          ratingDiff: sql`excluded.rating_diff`,
          posChangeValue: sql`excluded.pos_change_value`,
          yearAgoRatingChange: sql`excluded.year_ago_rating_change`,
          yearAgoRankingChange: sql`excluded.year_ago_ranking_change`,
          gamesCount: sql`excluded.games_count`,
          age: sql`excluded.age`,
          birthday: sql`excluded.birthday`,
          bestPosTitle: sql`excluded.best_pos_title`,
          bestRatingTitle: sql`excluded.best_rating_title`,
          live: sql`excluded.live`,
          lastUpdatedGmt: sql`excluded.last_updated_gmt`,
          ratingHistory: sql`excluded.rating_history`,
        },
      })
      .returning();

    const fideIds = chessPlayers.map((chessPlayer) => chessPlayer.fideId);
    await db
      .delete(dbChessPlayers)
      .where(notInArray(dbChessPlayers.fideId, fideIds));

    console.log("Successfully scraped and saved chess players to database!");

    const chessPlayersToQueue = updatedChessPlayers.filter(
      (c) => c.wikipediaUrl === null,
    );

    if (chessPlayersToQueue.length > 0) {
      console.log(
        `Queueing ${chessPlayersToQueue.length} chess player(s) for wikipedia data fetching...`,
      );

      await chessPlayerWikiDataQueue.sendBatch(
        chessPlayersToQueue.map((chessPlayer) => ({
          body: {
            fideId: chessPlayer.fideId,
            name: chessPlayer.name,
          },
          contentType: "json",
        })),
      );
    } else {
      console.log("No chess players to queue for wikipedia data fetching");
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(
        "Something went wrong scraping chess players:",
        error.message,
      );
    } else {
      console.error("Something went wrong scraping chess players");
    }
  }
}

async function scrapeDailyGames(
  scraperApikey: string,
  db: NeonHttpDatabase<Record<string, never>> & {
    $client: NeonQueryFunction<false, false>;
  },
) {
  try {
    console.log("Scraping daily games...");

    const params = new URLSearchParams({
      api_key: scraperApikey,
      url: "https://2700chess.com/next/daily-games?gender=men",
    });

    const response = await fetch(`https://api.scraperapi.com?${params}`);

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    await db
      .insert(dbDailyGames)
      .values({
        key: "men",
        data,
      })
      .onConflictDoUpdate({
        target: dbDailyGames.key,
        set: {
          data: sql`excluded.data`,
        },
      });

    console.log("Successfully scraped and saved daily games to database!");
  } catch (error) {
    if (error instanceof Error) {
      console.error(
        "Something went wrong scraping daily games:",
        error.message,
      );
    } else {
      console.error("Something went wrong scraping daily games");
    }
  }
}

async function scrapeWorldChampions(
  scraperApikey: string,
  db: NeonHttpDatabase<Record<string, never>> & {
    $client: NeonQueryFunction<false, false>;
  },
) {
  try {
    console.log("Scraping world champions...");

    const params = new URLSearchParams({
      api_key: scraperApikey,
      url: "https://2700chess.com/next/world-champions",
    });

    const response = await fetch(`https://api.scraperapi.com?${params}`);

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    await db
      .insert(dbWorldChampions)
      .values({ key: "current", data })
      .onConflictDoUpdate({
        target: dbWorldChampions.key,
        set: {
          data: sql`excluded.data`,
        },
      });

    console.log("Successfully scraped and saved world champions to database!");
  } catch (error) {
    if (error instanceof Error) {
      console.error(
        "Something went wrong scraping world champions:",
        error.message,
      );
    } else {
      console.error("Something went wrong scraping world champions");
    }
  }
}

// Urls that could be used in the future
// "https://2700chess.com/next/events?gender=men&type=current"
// "https://2700chess.com/next/events?gender=men&type=future"
// "https://2700chess.com/next/events?gender=men&type=finished"

export default {
  fetch: app.fetch,

  // Cloudflare limit of 50 async requests in a scheduled cron job
  // e.g await getData("https://url.com")
  // ScraperAPI limit of 1000 credits per month
  // Currently uses 899 scraper api credits per month
  async scheduled(
    controller: ScheduledController,
    env: CloudflareBindings,
    ctx: ExecutionContext,
  ) {
    const neonClient = neon(env.NEON_DATABASE_URL);
    const db = drizzle(neonClient);

    if (controller.cron === "0 * * * *") {
    } else if (controller.cron === "0 */6 * * *") {
    } else if (controller.cron === "0 0 * * *") {
      // Uses 3 requests and 1 scraper api credit
      await scrapeChessPlayers(
        env.SCRAPER_API_KEY,
        env.CHESS_PLAYER_WIKI_DATA_QUEUE,
        db,
      );
      // Uses 2 requests and 1 scraper api credit
      await scrapeDailyGames(env.SCRAPER_API_KEY, db);
      // Uses 2 requests and 1 scraper api credit
      await scrapeWorldChampions(env.SCRAPER_API_KEY, db);
    }

    console.log("Cron job finished");
  },

  // Cloudflare limit of 50 async requests per queue batch
  // e.g await getData("https://url.com")
  async queue(
    batch: MessageBatch<{ fideId: number; name: string }>,
    env: CloudflareBindings,
  ) {
    const neonClient = neon(env.NEON_DATABASE_URL);
    const db = drizzle(neonClient);

    // Uses 2 requests total per message
    const processMessage = async (
      message: Message<{
        fideId: number;
        name: string;
      }>,
    ) => {
      try {
        // Uses 1 request per message
        const chessPlayerWikiData = await getChessPlayerWikiData(
          message.body.name,
        );

        // Uses 1 request per message
        await db
          .update(dbChessPlayers)
          .set(chessPlayerWikiData)
          .where(eq(dbChessPlayers.fideId, message.body.fideId));

        message.ack();
      } catch (error) {
        if (error instanceof Error) {
          console.error(
            "Failed to process FIDE ID: " + message.body.fideId,
            error.message,
          );
        } else {
          console.error("Failed to process FIDE ID: " + message.body.fideId);
        }
      }
    };

    // Total of 20 requests per batch because max_batch_size is set to 10 in wrangler.jsonc file
    const promises = batch.messages.map(processMessage);
    await Promise.allSettled(promises);
  },
};
