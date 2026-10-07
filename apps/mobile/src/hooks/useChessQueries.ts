import { queryKeys } from "@/constants/queryKeys";
import {
  getTopChessPlayer,
  getDailyGames,
  getTopChessPlayers,
  getWorldChampions,
} from "@/lib/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { TopChessPlayer } from "@top-chess/db/types";

export function useTopChessPlayers() {
  return useQuery({
    queryKey: queryKeys.topChessPlayers,
    queryFn: getTopChessPlayers,
    staleTime: 1000 * 60 * 10,
  });
}

export function useTopChessPlayer(fideId: number) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: queryKeys.topChessPlayer(fideId),
    queryFn: () => getTopChessPlayer(fideId),
    staleTime: 1000 * 60 * 10,
    initialData: () =>
      queryClient
        .getQueryData<TopChessPlayer[]>(queryKeys.topChessPlayers)
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
