import type { topChessPlayers, dailyGames, worldChampions } from "./schema";

type TopChessPlayer = typeof topChessPlayers.$inferSelect;
type DailyGames = typeof dailyGames.$inferSelect.data;
type WorldChampions = typeof worldChampions.$inferSelect.data;

export type { TopChessPlayer, DailyGames, WorldChampions };
