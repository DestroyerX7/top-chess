import type { topChessPlayers, dailyGames, worldChampions } from "./schema";

export type TopChessPlayer = typeof topChessPlayers.$inferSelect;
export type DailyGames = typeof dailyGames.$inferSelect.data;
export type WorldChampions = typeof worldChampions.$inferSelect.data;
