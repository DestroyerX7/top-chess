export const queryKeys = {
  chessPlayers: ["chessPlayers"] as const,
  chessPlayer: (fideId: number) => ["chessPlayers", fideId] as const,
  dailyGames: ["dailyGames"] as const,
  worldChampions: ["worldChampions"] as const,
};
