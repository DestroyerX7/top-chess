import axios from "axios";

export type ChessPlayer = {
  fideId: number;
  name: string;
  age: number;
  flag: string;
  countryName: string;
  birthday: string | null;
  standardRating: number;
  rapidRating: number | null;
  blitzRating: number | null;
  rapidRatingInactive: boolean;
  blitzRatingInactive: boolean;
  standardRank: number;
  rapidRank: number | null;
  blitzRank: number | null;
  standardJuniorRank: number | null;
  rapidJuniorRank: number | null;
  blitzJuniorRank: number | null;
  standardU16Rank: number | null;
  rapidU16Rank: number | null;
  blitzU16Rank: number | null;
  standardBestRankTitle: string;
  standardBestRatingTitle: string;
  rapidBestRatingTitle: string | null;
  blitzBestRatingTitle: string | null;
  standardMonthRatingChange: number;
  standardMonthRankChange: number;
  standardYearRatingChange: number;
  standardYearRankChange: number;
  standardRatingHistory: number[];
  hasLiveStandardGame: boolean;
  hasLiveRapidGame: boolean;
  hasLiveBlitzGame: boolean;
  recentStandardGamesCount: number;
  recentRapidGamesCount: number;
  recentBlitzGamesCount: number;
  standardLastUpdate: string | null;
  rapidLastUpdate: string | null;
  blitzLastUpdate: string | null;
  wikipediaUrl: string | null;
  imageUrl: string | null;
  bio: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};

type Result = {
  text: string;
  url: string;
};

type Game = {
  player_1: string;
  player_2: string;
  result: Result;
  player_1_fide_id: number;
  player_2_fide_id: number;
  player_1_display: string;
  player_2_display: string;
  id?: number;
};

type Round = Record<string, Game[]>;

type Tournament = {
  web_url: string;
  rounds: Round;
};

type DaySchedule = Record<string, Tournament>;

type ChessSchedule = Record<string, DaySchedule>;

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

type WorldChampionCategories = {
  blitz: number[];
  girls: number[];
  rapid: number[];
  classic: number[];
  juniors: number[];
};

type WorldChampions = {
  men: WorldChampionCategories;
  women: WorldChampionCategories;
};

export async function getTopChessPlayers() {
  const response = await axios.get<ChessPlayer[]>(
    "https://top-chess.destroyerinc.workers.dev/get-top-chess-players-updated",
  );

  return response.data;
}

export async function getChessPlayer(fideId: number | string) {
  const response = await axios.get<ChessPlayer | null>(
    `https://top-chess.destroyerinc.workers.dev/get-chess-player-updated/${fideId}`,
  );

  return response.data;
}

export async function getDailyGames() {
  const response = await axios.get<ChessSchedule>(
    "https://top-chess.destroyerinc.workers.dev/get-daily-games",
  );

  return response.data;
}

export async function getWorldChampions() {
  const response = await axios.get<WorldChampions>(
    "https://top-chess.destroyerinc.workers.dev/get-world-champions",
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
