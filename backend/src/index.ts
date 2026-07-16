import { Hono } from "hono";
import { neon, NeonQueryFunction } from "@neondatabase/serverless";
import { drizzle, NeonHttpDatabase } from "drizzle-orm/neon-http";
import {
  chessPlayers as dbChessPlayers,
  topChessPlayers as dbTopChessPlayers,
  dailyGames as dbDailyGames,
  worldChampions as dbWorldChampions,
} from "./db/schema";
import { eq, notInArray, sql } from "drizzle-orm";

type ScrapedChessPlayer = {
  fideid: number;
  name: string;
  age: number;
  raiting: string; // note: numeric value as string, e.g. "2574.0"
  raitingDiff: number;
  pos_change: string; // e.g. "↑2", "↓3", or "" if unchanged
  pos_change_value: number;

  // Live position rankings across different categories (null if not applicable)
  live_pos: number;
  live_standard_pos: number;
  live_rapid_pos: number | null;
  live_blitz_pos: number | null;
  live_juniors_pos: number | null;
  live_girls_pos: number | null;
  live_u16_pos: number | null;
  live_junior_standard_pos: number | null;
  live_junior_blitz_pos: number | null;
  live_junior_rapid_pos: number | null;
  live_u16_standard_pos: number | null;
  live_u16_blitz_pos: number | null;
  live_u16_rapid_pos: number | null;

  flag: string; // country code, e.g. "bg", "us"
  avatar: string; // path, e.g. "/file?id=1211" or "/img/avatar/noavatar.png"
  games_archive: string; // relative URL
  statistic: string; // relative URL
  profile: string; // relative URL
  games_count: number;

  country_name: string;
  birthday: string; // e.g. "25 Oct 1985", can be ""
  birthday_unix: number | null;

  sort_helper: string;
  sort_helper_inv: string;

  best_pos_title: string;
  best_rating_title: string;
  tooltip_text: string;

  live: boolean;
  has_live_standard: boolean;
  has_live_rapid: boolean;
  has_live_blitz: boolean;

  last_update: number | null; // unix timestamp
  type: string; // e.g. "standard"

  year_ago_rating_change: number;
  year_ago_ranking_change: number;
  rating_history_sparkline: number[]; // fixed-length array (13 in examples)
  last_updated_gmt: string;

  // Per time-control ratings — usually numeric strings, but can carry
  // suffixes like "i" (inactive) or be "unrat." for unrated
  standard_raiting: string;
  blitz_raiting: string;
  rapid_raiting: string;
  junior_raiting: string;

  standard_tooltip_text: string;
  blitz_tooltip_text: string;
  rapid_tooltip_text: string;
  junior_tooltip_text: string;

  standard_last_update: number | null;
  blitz_last_update: number | null;
  rapid_last_update: number | null;

  standard_games_count: number;
  blitz_games_count: number;
  rapid_games_count: number;

  standard_best_rating_title: string;
  blitz_best_rating_title: string;
  rapid_best_rating_title: string; // can be "" when no rapid history

  rating: string; // duplicate of `raiting`
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

const chessPlayerScrapeAmount = 250;

app.get("/get-top-chess-players-updated", async (c) => {
  try {
    const limitParam = c.req.query("limit");
    const limit =
      limitParam !== undefined ? Number(limitParam) : chessPlayerScrapeAmount;

    if (
      !Number.isInteger(limit) ||
      limit < 1 ||
      limit > chessPlayerScrapeAmount
    ) {
      return c.json(
        {
          error: `limit param must be an integer in the range [1,${chessPlayerScrapeAmount}]`,
        },
        400,
      );
    }

    const neonClient = neon(c.env.NEON_DATABASE_URL);
    const db = drizzle(neonClient);

    const chessPlayers = await db
      .select()
      .from(dbTopChessPlayers)
      .orderBy(dbTopChessPlayers.standardRank)
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

app.get("/get-top-chess-players", async (c) => {
  try {
    const limitParam = c.req.query("limit");
    const limit =
      limitParam !== undefined ? Number(limitParam) : chessPlayerScrapeAmount;

    if (
      !Number.isInteger(limit) ||
      limit < 1 ||
      limit > chessPlayerScrapeAmount
    ) {
      return c.json(
        {
          error: `limit param must be an integer in the range [1,${chessPlayerScrapeAmount}]`,
        },
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

// app.get("/image-proxy", async (c) => {
//   const url = c.req.query("url");

//   if (url === undefined) {
//     return c.json({ error: "url not provided" }, 400);
//   }

//   const response = await fetch(url, {
//     headers: {
//       "User-Agent": "top-chess/1.0 (destroyerincdev@gmail.com)",
//       Referer: "https://en.wikipedia.org/",
//     },
//   });

//   if (!response.ok) {
//     return c.json({ error: `Failed to fetch image: ${response.status}` }, 502);
//   }

//   return new Response(response.body, {
//     headers: {
//       "Content-Type": response.headers.get("Content-Type") ?? "image/jpeg",
//       "Cache-Control": "public, max-age=604800", // cache for 7 days
//     },
//   });
// });

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
      .from(dbTopChessPlayers)
      .where(eq(dbTopChessPlayers.fideId, fideId));

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

function chunk<T>(arr: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size),
  );
}

async function scrapeTopChessPlayers(
  browserBaseApiKey: string,
  chessPlayerWikiDataQueue: Queue,
  db: NeonHttpDatabase<Record<string, never>> & {
    $client: NeonQueryFunction<false, false>;
  },
) {
  try {
    console.log("Scraping top chess players...");

    const response = await fetch("https://api.browserbase.com/v1/fetch", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-BB-API-Key": browserBaseApiKey,
      },
      body: JSON.stringify({
        url: `https://2700chess.com/next/main-table-men?sort=standard&per-page=${chessPlayerScrapeAmount}`,
      }),
    });

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }

    const body: { content: string } = await response.json();
    const { items: scrapedTopChessPlayers }: { items: ScrapedChessPlayer[] } =
      JSON.parse(body.content);

    const flagOverrides: Record<string, string> = {
      ff: "ru",
      en: "gb",
    };

    const countryNameOverrides: Record<string, string> = {
      "FIDE (Not a National Fed.)": "Russia",
    };

    const topChessPlayers = scrapedTopChessPlayers.map((c) => ({
      fideId: c.fideid,
      name: c.name,
      age: c.age,
      flag: flagOverrides[c.flag] ?? c.flag,
      countryName: countryNameOverrides[c.country_name] ?? c.country_name,
      birthday:
        c.birthday_unix !== null
          ? new Date(c.birthday_unix * 1000).toISOString().split("T")[0]
          : null,

      standardRating: Number(c.rating),
      rapidRating:
        c.rapid_raiting === "unrat."
          ? null
          : c.rapid_raiting.includes("i")
            ? Number(c.rapid_raiting.split(" ")[0])
            : Number(c.rapid_raiting),
      blitzRating:
        c.blitz_raiting === "unrat."
          ? null
          : c.blitz_raiting.includes("i")
            ? Number(c.blitz_raiting.split(" ")[0])
            : Number(c.blitz_raiting),

      rapidRatingInactive: c.rapid_raiting.includes("i"),
      blitzRatingInactive: c.blitz_raiting.includes("i"),

      standardRank: c.live_standard_pos,
      rapidRank: c.live_rapid_pos,
      blitzRank: c.live_blitz_pos,

      standardJuniorRank: c.live_junior_standard_pos,
      rapidJuniorRank: c.live_junior_rapid_pos,
      blitzJuniorRank: c.live_junior_blitz_pos,

      standardU16Rank: c.live_u16_standard_pos,
      rapidU16Rank: c.live_u16_rapid_pos,
      blitzU16Rank: c.live_u16_blitz_pos,

      standardBestRankTitle: c.best_pos_title,
      standardBestRatingTitle: c.standard_best_rating_title,
      rapidBestRatingTitle:
        c.rapid_best_rating_title.length > 0 ? c.rapid_best_rating_title : null,
      blitzBestRatingTitle:
        c.blitz_best_rating_title.length > 0 ? c.blitz_best_rating_title : null,

      standardMonthRatingChange: c.raitingDiff,
      standardMonthRankChange: c.pos_change_value,

      standardYearRatingChange: c.year_ago_rating_change,
      standardYearRankChange: c.year_ago_ranking_change,

      standardRatingHistory: c.rating_history_sparkline,

      hasLiveStandardGame: c.has_live_standard,
      hasLiveRapidGame: c.has_live_rapid,
      hasLiveBlitzGame: c.has_live_blitz,

      recentStandardGamesCount: c.standard_games_count,
      recentRapidGamesCount: c.rapid_games_count,
      recentBlitzGamesCount: c.blitz_games_count,

      standardLastUpdate:
        c.standard_last_update !== null
          ? new Date(c.standard_last_update * 1000)
          : null,
      rapidLastUpdate:
        c.rapid_last_update !== null
          ? new Date(c.rapid_last_update * 1000)
          : null,
      blitzLastUpdate:
        c.blitz_last_update !== null
          ? new Date(c.blitz_last_update * 1000)
          : null,
    }));

    const updatedTopChessPlayers = await db
      .insert(dbTopChessPlayers)
      .values(topChessPlayers)
      .onConflictDoUpdate({
        target: dbTopChessPlayers.fideId,
        set: {
          name: sql`excluded.name`,
          age: sql`excluded.age`,
          flag: sql`excluded.flag`,
          countryName: sql`excluded.country_name`,
          birthday: sql`excluded.birthday`,

          standardRating: sql`excluded.standard_rating`,
          rapidRating: sql`excluded.rapid_rating`,
          blitzRating: sql`excluded.blitz_rating`,

          rapidRatingInactive: sql`excluded.rapid_rating_inactive`,
          blitzRatingInactive: sql`excluded.blitz_rating_inactive`,

          standardRank: sql`excluded.standard_rank`,
          rapidRank: sql`excluded.rapid_rank`,
          blitzRank: sql`excluded.blitz_rank`,

          standardJuniorRank: sql`excluded.standard_junior_rank`,
          rapidJuniorRank: sql`excluded.rapid_junior_rank`,
          blitzJuniorRank: sql`excluded.blitz_junior_rank`,

          standardU16Rank: sql`excluded.standard_u16_rank`,
          rapidU16Rank: sql`excluded.rapid_u16_rank`,
          blitzU16Rank: sql`excluded.blitz_u16_rank`,

          standardBestRankTitle: sql`excluded.standard_best_rank_title`,
          standardBestRatingTitle: sql`excluded.standard_best_rating_title`,
          rapidBestRatingTitle: sql`excluded.rapid_best_rating_title`,
          blitzBestRatingTitle: sql`excluded.blitz_best_rating_title`,

          standardMonthRatingChange: sql`excluded.standard_month_rating_change`,
          standardMonthRankChange: sql`excluded.standard_month_rank_change`,

          standardYearRatingChange: sql`excluded.standard_year_rating_change`,
          standardYearRankChange: sql`excluded.standard_year_rank_change`,

          standardRatingHistory: sql`excluded.standard_rating_history`,

          hasLiveStandardGame: sql`excluded.has_live_standard_game`,
          hasLiveRapidGame: sql`excluded.has_live_rapid_game`,
          hasLiveBlitzGame: sql`excluded.has_live_blitz_game`,

          recentStandardGamesCount: sql`excluded.recent_standard_games_count`,
          recentRapidGamesCount: sql`excluded.recent_rapid_games_count`,
          recentBlitzGamesCount: sql`excluded.recent_blitz_games_count`,

          standardLastUpdate: sql`excluded.standard_last_update`,
          rapidLastUpdate: sql`excluded.rapid_last_update`,
          blitzLastUpdate: sql`excluded.blitz_last_update`,
        },
      })
      .returning();

    const fideIds = topChessPlayers.map((c) => c.fideId);
    await db
      .delete(dbTopChessPlayers)
      .where(notInArray(dbTopChessPlayers.fideId, fideIds));

    console.log(
      "Successfully scraped and saved top chess players to database!",
    );

    const chessPlayersToQueue = updatedTopChessPlayers.filter(
      (c) => c.wikipediaUrl === null,
    );

    if (chessPlayersToQueue.length > 0) {
      console.log(
        `Queueing ${chessPlayersToQueue.length} chess player(s) for wikipedia data fetching...`,
      );

      const batches = chunk(chessPlayersToQueue, 100);

      await Promise.allSettled(
        batches.map((batch) =>
          chessPlayerWikiDataQueue.sendBatch(
            batch.map((chessPlayer) => ({
              body: { fideId: chessPlayer.fideId, name: chessPlayer.name },
              contentType: "json",
            })),
          ),
        ),
      );
    } else {
      console.log("No chess players to queue for wikipedia data fetching");
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(
        "Something went wrong scraping top chess players:",
        error.message,
      );
    } else {
      console.error("Something went wrong scraping top chess players");
    }
  }
}

async function scrapeDailyGames(
  browserBaseApiKey: string,
  db: NeonHttpDatabase<Record<string, never>> & {
    $client: NeonQueryFunction<false, false>;
  },
) {
  try {
    console.log("Scraping daily games...");

    const response = await fetch("https://api.browserbase.com/v1/fetch", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-BB-API-Key": browserBaseApiKey,
      },
      body: JSON.stringify({
        url: "https://2700chess.com/next/daily-games?gender=men",
      }),
    });

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }

    const body: { content: string } = await response.json();
    const data = JSON.parse(body.content);

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
  browserBaseApiKey: string,
  db: NeonHttpDatabase<Record<string, never>> & {
    $client: NeonQueryFunction<false, false>;
  },
) {
  try {
    console.log("Scraping world champions...");

    const response = await fetch("https://api.browserbase.com/v1/fetch", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-BB-API-Key": browserBaseApiKey,
      },
      body: JSON.stringify({
        url: "https://2700chess.com/next/world-champions",
      }),
    });

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }

    const body: { content: string } = await response.json();
    const data = JSON.parse(body.content);

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
  // Browserbase limit of 1000 credits per month
  // Currently uses 899 scraping credits per month
  async scheduled(
    controller: ScheduledController,
    env: CloudflareBindings,
    ctx: ExecutionContext,
  ) {
    const neonClient = neon(env.NEON_DATABASE_URL);
    const db = drizzle(neonClient);

    if (controller.cron === "0 * * * *") {
      // Uses 3 requests and 1 scraping credit
      await scrapeTopChessPlayers(
        env.BROWSERBASE_API_KEY,
        env.CHESS_PLAYER_WIKI_DATA_QUEUE,
        db,
      );
    } else if (controller.cron === "0 */6 * * *") {
      // Uses 2 requests and 1 scraping credit
      await scrapeDailyGames(env.BROWSERBASE_API_KEY, db);
    } else if (controller.cron === "0 0 * * *") {
      // Uses 2 requests and 1 scraping credit
      await scrapeWorldChampions(env.BROWSERBASE_API_KEY, db);
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
          .update(dbTopChessPlayers)
          .set(chessPlayerWikiData)
          .where(eq(dbTopChessPlayers.fideId, message.body.fideId));

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
