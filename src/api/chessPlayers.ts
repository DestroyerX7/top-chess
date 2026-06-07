import axios from "axios";

type ChessToolsChessPlayer = {
  rank: string;
  name: string;
  fide_id: string;
  country: string;
  rating: string;
};

export type ChessPlayer = {
  imageUrl: string;
} & ChessToolsChessPlayer;

const cloudinaryCloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;

export async function getTopChessToolsChessPlayers(
  limit: number = 100,
  history: boolean = false,
) {
  const { data: chessToolsChessPlayers } = await axios.get<
    ChessToolsChessPlayer[]
  >(
    `https://api.chesstools.org/fide/top_active/?limit=${limit}&history=${history}`,
  );

  return chessToolsChessPlayers;
}

export async function getTopChessPlayers() {
  const chessToolsChessPlayers = await getTopChessToolsChessPlayers();

  const chessPlayers: ChessPlayer[] = chessToolsChessPlayers.map(
    (chessToolsChessPlayer) => {
      return {
        ...chessToolsChessPlayer,
        imageUrl: `https://res.cloudinary.com/${cloudinaryCloudName}/image/upload/top-chess-uploads/${chessToolsChessPlayer.fide_id}.jpg`,
      };
    },
  );

  return chessPlayers;
}
