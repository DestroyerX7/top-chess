import { Hono } from "hono";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { chessPlayers as dbChessPlayers } from "./db/schema";
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
        { error: "Limit param must be an integer between 1 and 100 inclusive" },
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
    return c.json({ error: "Url not provided" }, 400);
  }

  const response = await fetch(url, {
    headers: {
      "User-Agent": "top-chess/1.0 (bojera22@gmai.com)",
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

// app.get("/get-chess-player/:fideId", async (c) => {
//   try {
//     const fideId = Number(c.req.param("fideId"));

//     const neonClient = neon(c.env.NEON_DATABASE_URL);
//     const db = drizzle(neonClient);

//     const [chessPlayer] = await db
//       .select()
//       .from(dbChessPlayers)
//       .where(eq(dbChessPlayers.fideId, fideId));

//     return c.json(chessPlayer);
//   } catch (error) {
//     if (error instanceof Error) {
//       console.error("Database fetch error:", error.message);
//     } else {
//       console.error("Database fetch error");
//     }

//     return c.json({ error: "Failed to get chess player" }, 500);
//   }
// });

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
        headers: { "User-Agent": "top-chess/1.0 (bojera22@gmail.com)" },
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

async function scrapeChessPlayers(env: CloudflareBindings) {
  try {
    console.log("Scraping chess players...");

    const params = new URLSearchParams({
      api_key: env.SCRAPER_API_KEY,
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

    const chessPlayers = data.map((scrapedChessPlayer) => {
      const flag =
        flagOverrides[scrapedChessPlayer.flag] ?? scrapedChessPlayer.flag;
      const countryName =
        countryNameOverrides[scrapedChessPlayer.country_name] ??
        scrapedChessPlayer.country_name;
      const ratingHistory = scrapedChessPlayer.rating_history_sparkline;

      return {
        fideId: scrapedChessPlayer.fideid,
        name: scrapedChessPlayer.name,
        flag,
        countryName,
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
        ratingHistory,
      };
    });

    const neonClient = neon(env.NEON_DATABASE_URL);
    const db = drizzle(neonClient);

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

    const chessPlayersToQueue = updatedChessPlayers.filter(
      (c) => c.wikipediaUrl === null,
    );

    if (chessPlayersToQueue.length > 0) {
      console.log(
        `Queueing ${chessPlayersToQueue.length} chess player(s) for wikipedia data fetching...`,
      );

      await env.CHESS_PLAYER_WIKI_DATA_QUEUE.sendBatch(
        chessPlayersToQueue.map((chessPlayer) => ({
          body: {
            fideId: chessPlayer.fideId,
            name: chessPlayer.name,
          },
          contentType: "json",
        })),
      );
    } else {
      console.log("No chess players to queue");
    }

    console.log("Successfully scraped and saved chess players to database!");
  } catch (error) {
    if (error instanceof Error) {
      console.error("Cron job failed:", error.message);
    } else {
      console.error("Cron job failed");
    }
  }
}

export default {
  fetch: app.fetch,

  // Cloudflare limit of 50 async requests in a scheduled cron job
  // e.g await getData("https://url.com")
  async scheduled(
    controller: ScheduledController,
    env: CloudflareBindings,
    ctx: ExecutionContext,
  ) {
    // scrapeChessPlayers() uses 3 total requests
    ctx.waitUntil(scrapeChessPlayers(env));
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
