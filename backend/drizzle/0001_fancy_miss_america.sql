ALTER TABLE "chess_player" ALTER COLUMN "rating" SET DATA TYPE real;--> statement-breakpoint
ALTER TABLE "chess_player" ADD COLUMN "flag" text NOT NULL;--> statement-breakpoint
ALTER TABLE "chess_player" ADD COLUMN "country_name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "chess_player" ADD COLUMN "rating_diff" real NOT NULL;--> statement-breakpoint
ALTER TABLE "chess_player" ADD COLUMN "pos_change_value" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "chess_player" ADD COLUMN "year_ago_rating_change" real NOT NULL;--> statement-breakpoint
ALTER TABLE "chess_player" ADD COLUMN "year_ago_ranking_change" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "chess_player" ADD COLUMN "games_count" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "chess_player" ADD COLUMN "age" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "chess_player" ADD COLUMN "birthday" date NOT NULL;--> statement-breakpoint
ALTER TABLE "chess_player" ADD COLUMN "best_pos_title" text NOT NULL;--> statement-breakpoint
ALTER TABLE "chess_player" ADD COLUMN "best_rating_title" text NOT NULL;--> statement-breakpoint
ALTER TABLE "chess_player" ADD COLUMN "live" boolean NOT NULL;--> statement-breakpoint
ALTER TABLE "chess_player" ADD COLUMN "last_updated_gmt" timestamp with time zone NOT NULL;--> statement-breakpoint
ALTER TABLE "chess_player" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "chess_player" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;