import {
  ChessPlayer,
  getChessPlayer,
  getDailyGames,
  getTopChessPlayers,
  getWorldChampions,
} from "@/api/chess";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export function useChessPlayers() {
  return useQuery({
    queryKey: ["chessPlayers"],
    queryFn: getTopChessPlayers,
    staleTime: 1000 * 60 * 10,
  });
}

export function useChessPlayer(fideId: number) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["chessPlayer", fideId],
    queryFn: () => getChessPlayer(fideId),
    staleTime: 1000 * 60 * 10,
    initialData: () =>
      queryClient
        .getQueryData<ChessPlayer[]>(["chessPlayers"])
        ?.find((c) => c.fideId === fideId) ?? null,
    initialDataUpdatedAt: () =>
      queryClient.getQueryState(["chessPlayers"])?.dataUpdatedAt,
  });
}

export function useDailyGames() {
  return useQuery({
    queryKey: ["dailyGames"],
    queryFn: getDailyGames,
    staleTime: 1000 * 60 * 10,
  });
}

export function useWorldChampions() {
  return useQuery({
    queryKey: ["worldChampions"],
    queryFn: getWorldChampions,
    staleTime: Infinity,
  });
}
