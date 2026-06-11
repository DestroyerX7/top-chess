import axios from "axios";
import { Hono } from "hono";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { chessPlayers as dbChessPlayers } from "./db/schema";
import { eq, notInArray, sql } from "drizzle-orm";

type Bindings = {
  NEON_DATABASE_URL: string;
  SCRAPER_API_KEY: string;
  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
  CHESS_PLAYER_IMAGE_UPLOAD_QUEUE: Queue;
};

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

const app = new Hono<{ Bindings: Bindings }>();

app.get("/get-top-chess-players", async (c) => {
  try {
    const neonClient = neon(c.env.NEON_DATABASE_URL);
    const db = drizzle(neonClient);

    const chessPlayers = await db
      .select()
      .from(dbChessPlayers)
      .orderBy(dbChessPlayers.livePos)
      .limit(100);

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

// app.get("/test/:name", async (c) => {
//   const name = c.req.param("name");

//   const chessPlayerInfo = await getChessPlayerInfo(name);

//   return c.json(chessPlayerInfo);
// });

async function getChessPlayerWikiData(name: string) {
  try {
    const response = await axios.get<WikiResponse>(
      "https://en.wikipedia.org/w/api.php",
      {
        params: {
          action: "query",
          generator: "search",
          gsrsearch: name,
          prop: "extracts|pageimages|description|info",
          exintro: true, // only intro section
          explaintext: true, // removes html
          pithumbsize: 500, // thumbnail width in px
          inprop: "url", // adds fullurl and canonicalurl to response
          gsrnamespace: 0, // only search main articles, not talk pages etc
          format: "json",
        },
        headers: { "User-Agent": "top-chess-backend/1.0 (bojera22@gmail.com)" },
      },
    );

    const pages = Object.values(response.data.query.pages).toSorted(
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
      bio: page.extract ?? null,
      description: page.description ?? null,
      wikipediaUrl: page.fullurl ?? null,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error(
        "Failed to get chess player wikipedia data: ",
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

async function scrapeChessPlayers(env: Bindings) {
  try {
    console.log("Scraping chess players...");

    const response = await axios.get<ScrapedChessPlayer[]>(
      "https://api.scraperapi.com",
      {
        params: {
          api_key: env.SCRAPER_API_KEY,
          url: "https://2700chess.com/next/main-table-men?sort=standard&per-page=100",
        },
      },
    );

    const chessPlayers: (typeof dbChessPlayers.$inferInsert)[] =
      response.data.map((scrapedChessPlayer) => ({
        fideId: scrapedChessPlayer.fideid,
        name: scrapedChessPlayer.name,
        flag: scrapedChessPlayer.flag,
        countryName: scrapedChessPlayer.country_name,
        rating: Number(scrapedChessPlayer.rating),
        livePos: scrapedChessPlayer.live_pos,
        ratingDiff: scrapedChessPlayer.raitingDiff,
        posChangeValue: scrapedChessPlayer.pos_change_value,
        yearAgoRatingChange: scrapedChessPlayer.year_ago_rating_change,
        yearAgoRankingChange: scrapedChessPlayer.year_ago_ranking_change,
        gamesCount: scrapedChessPlayer.games_count,
        age: scrapedChessPlayer.age,
        birthday:
          scrapedChessPlayer.birthday.length > 0
            ? new Date(scrapedChessPlayer.birthday + " UTC")
                .toISOString()
                .split("T")[0]
            : null,
        bestPosTitle: scrapedChessPlayer.best_pos_title,
        bestRatingTitle: scrapedChessPlayer.best_rating_title,
        live: scrapedChessPlayer.live,
        lastUpdatedGmt: new Date(scrapedChessPlayer.last_updated_gmt + " UTC"),
      }));

    const neonClient = neon(env.NEON_DATABASE_URL);
    const db = drizzle(neonClient);

    await db
      .insert(dbChessPlayers)
      .values(chessPlayers)
      .onConflictDoUpdate({
        target: dbChessPlayers.fideId,
        set: {
          name: sql`excluded.name`,
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
        },
      });

    const fideIds = chessPlayers.map((chessPlayer) => chessPlayer.fideId);
    await db
      .delete(dbChessPlayers)
      .where(notInArray(dbChessPlayers.fideId, fideIds));

    console.log("Queueing consumers to save chess player images...");

    await env.CHESS_PLAYER_IMAGE_UPLOAD_QUEUE.sendBatch(
      response.data.map((scrapeChessPlayer) => ({
        body: {
          fideId: scrapeChessPlayer.fideid,
          name: scrapeChessPlayer.name,
        },
        contentType: "json",
      })),
    );

    console.log("Successfully scraped and saved chess players to database!");
  } catch (error) {
    if (error instanceof Error) {
      console.error("Cron job failed:", error.message);
    } else {
      console.error("Cron job failed");
    }
  }
}

// async function getChessPlayerBase64Image(fideId: number) {
//   try {
//     const { data: html } = await axios.get(
//       `https://ratings.fide.com/profile/${fideId}`,
//     );
//     const response = new Response(html);

//     let base64Image: string | null = null;

//     await new HTMLRewriter()
//       .on("img.profile-top__photo", {
//         element(el) {
//           base64Image = el.getAttribute("src");
//         },
//       })
//       .transform(response)
//       .text();

//     return base64Image as string | null;
//   } catch (error) {
//     if (error instanceof Error) {
//       console.error("Failed to find FIDE chess player image:", error.message);
//     } else {
//       console.error("Failed to find FIDE chess player image");
//     }

//     return null;
//   }
// }

// async function saveBase64ImageToCloudinary(
//   base64Image: string,
//   fideId: number,
//   cloudinaryCloudName: string,
//   cloudinaryApiKey: string,
//   cloudinaryApiSecret: string,
// ) {
//   try {
//     const response = await axios.post<{ secure_url: string }>(
//       `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`,
//       {
//         file: base64Image,
//         public_id: `top-chess-uploads/${fideId}`,
//         overwrite: true,
//       },
//       {
//         auth: {
//           username: cloudinaryApiKey,
//           password: cloudinaryApiSecret,
//         },
//       },
//     );

//     return response.data.secure_url;
//   } catch (error) {
//     if (error instanceof Error) {
//       console.error(`Failed to save image to cloudinary:`, error.message);
//     } else {
//       console.error(`Failed to save image to cloudinary`);
//     }

//     return `https://res.cloudinary.com/${cloudinaryCloudName}/image/upload/top-chess-uploads/chess-player.jpg`;
//   }
// }

export default {
  fetch: app.fetch,

  // Cloudflare limit of 50 async requests in a scheduled cron job
  // e.g await getData("https://url.com")
  async scheduled(
    controller: ScheduledController,
    env: Bindings,
    ctx: ExecutionContext,
  ) {
    // scrapeChessPlayers() uses 3 total requests
    ctx.waitUntil(scrapeChessPlayers(env));
  },

  // Cloudflare limit of 50 async requests per queue batch
  // e.g await getData("https://url.com")
  async queue(
    batch: MessageBatch<{ fideId: number; name: string }>,
    env: Bindings,
  ) {
    const neonClient = neon(env.NEON_DATABASE_URL);
    const db = drizzle(neonClient);

    const sleep = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    // Total of 20 request per batch because max_batch_size is set to 10 in wrangler.jsonc file
    for (const message of batch.messages) {
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
      } finally {
        // Pausing for 100ms before moving to next message so wikipedia does not block access for spamming their api
        await sleep(100);
      }
    }
  },
};
