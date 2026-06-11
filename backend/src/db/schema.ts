import {
  pgTable,
  integer,
  text,
  real,
  boolean,
  timestamp,
  date,
} from "drizzle-orm/pg-core";

export const chessPlayers = pgTable("chess_player", {
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
