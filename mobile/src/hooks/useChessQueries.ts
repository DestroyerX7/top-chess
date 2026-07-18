import { queryKeys } from "@/constants/queryKeys";
import {
  ChessPlayer,
  getChessPlayer,
  getDailyGames,
  getTopChessPlayers,
  getWorldChampions,
} from "@/lib/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export function useTopChessPlayers() {
  return useQuery({
    queryKey: queryKeys.topChessPlayers,
    queryFn: getTopChessPlayers,
    staleTime: 1000 * 60 * 10,
  });
}

export function useChessPlayer(fideId: number) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: queryKeys.chessPlayer(fideId),
    queryFn: () => getChessPlayer(fideId),
    staleTime: 1000 * 60 * 10,
    initialData: () =>
      queryClient
        .getQueryData<ChessPlayer[]>(queryKeys.topChessPlayers)
        ?.find((c) => c.fideId === fideId) ?? null,
    initialDataUpdatedAt: () =>
      queryClient.getQueryState(queryKeys.topChessPlayers)?.dataUpdatedAt,
  });
}

export function useDailyGames() {
  return useQuery({
    queryKey: queryKeys.dailyGames,
    queryFn: getDailyGames,
    staleTime: 1000 * 60 * 10,
  });
}

export function useWorldChampions() {
  return useQuery({
    queryKey: queryKeys.worldChampions,
    queryFn: getWorldChampions,
    staleTime: Infinity,
  });
}
