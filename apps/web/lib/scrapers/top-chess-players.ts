import { browserbaseFetch } from "./browserbase";
import { db } from "@top-chess/db";
import { topChessPlayers as dbTopChessPlayers } from "@top-chess/db/schema";
import { eq, notInArray, sql } from "drizzle-orm";
import pLimit from "p-limit";
import { getTopChessPlayerWikiData } from "../wikipedia";

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
  year_ago_ranking_change: number | null;
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

const chessPlayerScrapeAmount = 250;

export async function syncTopChessPlayers() {
  const content = await browserbaseFetch(
    `https://2700chess.com/next/main-table-men?sort=standard&per-page=${chessPlayerScrapeAmount}`,
  );

  const data: { items: ScrapedChessPlayer[] } = JSON.parse(content);

  const flagOverrides: Record<string, string> = {
    ff: "ru",
    en: "gb",
  };

  const countryNameOverrides: Record<string, string> = {
    "FIDE (Not a National Fed.)": "Russia",
  };

  const topChessPlayers = data.items.map((c) => ({
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
    standardYearRankChange: c.year_ago_ranking_change ?? 0,

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

  const fideIds = topChessPlayers.map((c) => c.fideId);

  const [updatedTopChessPlayers] = await db.batch([
    db
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
      .returning(),
    db
      .delete(dbTopChessPlayers)
      .where(notInArray(dbTopChessPlayers.fideId, fideIds)),
  ]);

  console.log("Successfully scraped and saved top chess players to database!");

  const topChessPlayersToGetWikiData = updatedTopChessPlayers.filter(
    (c) => c.wikipediaUrl === null,
  );

  if (topChessPlayersToGetWikiData.length > 0) {
    console.log(
      `Getting wikipedia data for ${topChessPlayersToGetWikiData.length} chess player(s)...`,
    );

    const limit = pLimit(10);

    const results = await Promise.allSettled(
      topChessPlayersToGetWikiData.map((player) =>
        limit(async () => {
          const wikiData = await getTopChessPlayerWikiData(player.name);

          await db
            .update(dbTopChessPlayers)
            .set(wikiData)
            .where(eq(dbTopChessPlayers.fideId, player.fideId));
        }),
      ),
    );

    const failed = results.filter((r) => r.status === "rejected").length;
    if (failed > 0)
      console.error(`${failed} wiki lookups failed in this batch`);
  } else {
    console.log("No top chess players to get wikipedia data");
  }

  return {
    topsChessPlayersUpdated: updatedTopChessPlayers.length,
    wikiDataEnriched: topChessPlayersToGetWikiData.length,
  };
}
