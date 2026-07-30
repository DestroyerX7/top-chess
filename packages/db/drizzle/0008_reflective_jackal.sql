CREATE TABLE "daily_games" (
	"key" text PRIMARY KEY NOT NULL,
	"data" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "world_champions" (
	"key" text PRIMARY KEY NOT NULL,
	"data" jsonb NOT NULL
);
--> statement-breakpoint
ALTER TABLE "chess_player" RENAME TO "chess_players";