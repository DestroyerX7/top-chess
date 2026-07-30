ALTER TABLE "chess_player" ALTER COLUMN "image_url" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "chess_player" ADD COLUMN "bio" text;--> statement-breakpoint
ALTER TABLE "chess_player" ADD COLUMN "description" text;