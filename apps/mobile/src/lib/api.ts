import axios from "axios";
import {
  TopChessPlayer,
  DailyGames,
  WorldChampions,
} from "@top-chess/db/types";

export type LichessSearchResult = {
  name: string;
  id: number;
  federation: string;
  photo?: {
    small: string;
    medium: string;
    credit?: string;
  };
  standard?: number;
  rapid?: number;
  blitz?: number;
  title?: string;
  inactive?: boolean;
  year?: number;
};

export async function getTopChessPlayers() {
  const response = await axios.get<TopChessPlayer[]>(
    "https://top-chess-web-gray.vercel.app/api/top-chess-players",
  );

  return response.data;
}

export async function getChessPlayer(fideId: number | string) {
  // Maybe remove | null
  const response = await axios.get<TopChessPlayer | null>(
    `https://top-chess-web-gray.vercel.app/api/top-chess-player/${fideId}`,
  );

  return response.data;
}

export async function getDailyGames() {
  const response = await axios.get<DailyGames>(
    "https://top-chess-web-gray.vercel.app/api/daily-games",
  );

  return response.data;
}

export async function getWorldChampions() {
  const response = await axios.get<WorldChampions>(
    "https://top-chess-web-gray.vercel.app/api/world-champions",
  );

  return response.data;
}

export async function searchChessPlayer(searchInput: string) {
  const response = await axios.get<LichessSearchResult[]>(
    "https://lichess.org/api/fide/player",
    {
      params: {
        q: searchInput,
      },
    },
  );

  return response.data;
}
