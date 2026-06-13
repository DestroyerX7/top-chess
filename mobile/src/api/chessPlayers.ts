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

export async function getTopChessPlayers() {
  const response = await axios.get<ChessPlayer[]>(
    "https://top-chess.destroyerinc.workers.dev/get-top-chess-players",
  );

  return response.data;
}
