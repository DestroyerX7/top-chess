export const queryKeys = {
  topChessPlayers: ["topChessPlayers"] as const,
  chessPlayer: (fideId: number) => ["chessPlayer", fideId] as const,
  dailyGames: ["dailyGames"] as const,
  worldChampions: ["worldChampions"] as const,
};
