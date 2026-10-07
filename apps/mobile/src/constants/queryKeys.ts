export const queryKeys = {
  topChessPlayers: ["topChessPlayers"] as const,
  topChessPlayer: (fideId: number) => ["topChessPlayer", fideId] as const,
  dailyGames: ["dailyGames"] as const,
  worldChampions: ["worldChampions"] as const,
};
