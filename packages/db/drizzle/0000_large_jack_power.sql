CREATE TABLE "chess_player" (
	"fide_id" integer PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"rating" text NOT NULL,
	"live_pos" integer NOT NULL
);
