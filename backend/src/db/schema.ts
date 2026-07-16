import {
  pgTable,
  integer,
  text,
  real,
  boolean,
  timestamp,
  date,
  jsonb,
  varchar,
} from "drizzle-orm/pg-core";

export const chessPlayers = pgTable("chess_players", {
  fideId: integer("fide_id").primaryKey(),
  name: text("name").notNull(),
  flag: text("flag").notNull(),
  countryName: text("country_name").notNull(),
  rating: real("rating").notNull(),
  livePos: integer("live_pos").notNull(),
  ratingDiff: real("rating_diff").notNull(),
  posChangeValue: integer("pos_change_value").notNull(),
  yearAgoRatingChange: real("year_ago_rating_change").notNull(),
  yearAgoRankingChange: integer("year_ago_ranking_change").notNull(),
  gamesCount: integer("games_count").notNull(),
  age: integer("age").notNull(),
  birthday: date("birthday"),
  bestPosTitle: text("best_pos_title").notNull(),
  bestRatingTitle: text("best_rating_title").notNull(),
  live: boolean("live").notNull(),
  lastUpdatedGmt: timestamp("last_updated_gmt", {
    withTimezone: true,
  }).notNull(),
  imageUrl: text("image_url"),
  bio: text("bio"),
  description: text("description"),
  wikipediaUrl: text("wikipedia_url"),
  ratingHistory: integer("rating_history").array(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const topChessPlayers = pgTable("top_chess_players", {
  fideId: integer("fide_id").primaryKey().notNull(),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  flag: varchar("flag", { length: 2 }).notNull(),
  countryName: text("country_name").notNull(),
  birthday: date("birthday"),

  standardRating: real("standard_rating").notNull(),
  rapidRating: real("rapid_rating"),
  blitzRating: real("blitz_rating"),

  rapidRatingInactive: boolean("rapid_rating_inactive")
    .default(false)
    .notNull(),
  blitzRatingInactive: boolean("blitz_rating_inactive")
    .default(false)
    .notNull(),

  standardRank: integer("standard_rank").notNull(),
  rapidRank: integer("rapid_rank"),
  blitzRank: integer("blitz_rank"),

  standardJuniorRank: integer("standard_junior_rank"),
  rapidJuniorRank: integer("rapid_junior_rank"),
  blitzJuniorRank: integer("blitz_junior_rank"),

  standardU16Rank: integer("standard_u16_rank"),
  rapidU16Rank: integer("rapid_u16_rank"),
  blitzU16Rank: integer("blitz_u16_rank"),

  standardBestRankTitle: text("standard_best_rank_title").notNull(),
  standardBestRatingTitle: text("standard_best_rating_title").notNull(),
  rapidBestRatingTitle: text("rapid_best_rating_title"),
  blitzBestRatingTitle: text("blitz_best_rating_title"),

  standardMonthRatingChange: real("standard_month_rating_change").notNull(),
  standardMonthRankChange: integer("standard_month_rank_change").notNull(),

  standardYearRatingChange: real("standard_year_rating_change").notNull(),
  standardYearRankChange: integer("standard_year_rank_change").notNull(),

  standardRatingHistory: integer("standard_rating_history").array().notNull(),

  hasLiveStandardGame: boolean("has_live_standard_game").notNull(),
  hasLiveRapidGame: boolean("has_live_rapid_game").notNull(),
  hasLiveBlitzGame: boolean("has_live_blitz_game").notNull(),

  recentStandardGamesCount: integer("recent_standard_games_count").notNull(),
  recentRapidGamesCount: integer("recent_rapid_games_count").notNull(),
  recentBlitzGamesCount: integer("recent_blitz_games_count").notNull(),

  standardLastUpdate: timestamp("standard_last_update", { withTimezone: true }),
  rapidLastUpdate: timestamp("rapid_last_update", { withTimezone: true }),
  blitzLastUpdate: timestamp("blitz_last_update", { withTimezone: true }),

  wikipediaUrl: text("wikipedia_url"),
  imageUrl: text("image_url"),
  bio: text("bio"),
  description: text("description"),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const dailyGames = pgTable("daily_games", {
  key: text("key").primaryKey(),
  data: jsonb("data").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const worldChampions = pgTable("world_champions", {
  key: text("key").primaryKey(),
  data: jsonb("data").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
