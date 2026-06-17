import axios from "axios";

export type ChessPlayer = {
  fideId: number;
  name: string;
  flag: string;
  countryName: string;
  rating: number;
  livePos: number;
  ratingDiff: number;
  posChangeValue: number;
  yearAgoRatingChange: number;
  yearAgoRankingChange: number;
  gamesCount: number;
  age: number;
  birthday: string | null;
  bestPosTitle: string;
  bestRatingTitle: string;
  live: boolean;
  lastUpdatedGmt: string;
  imageUrl: string | null;
  wikipediaUrl: string | null;
  bio: string | null;
  description: string | null;
  ratingHistory: number[] | null;
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
    "https://top-chess.destroyerinc.workers.dev/get-top-chess-players",
  );

  return response.data;
}

export async function getChessPlayer(fideId: number | string) {
  const response = await axios.get<ChessPlayer | null>(
    `https://top-chess.destroyerinc.workers.dev/get-chess-player/${fideId}`,
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
