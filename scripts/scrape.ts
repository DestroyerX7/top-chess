import axios from "axios";
import * as cheerio from "cheerio";
import { v2 as cloudinary } from "cloudinary";
import pLimit from "p-limit";

type ChessToolsChessPlayer = {
  rank: string;
  name: string;
  fide_id: string;
  country: string;
  rating: string;
};

cloudinary.config({
  cloud_name: process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function scrape() {
  const { data: chessToolsChessPlayers } = await axios.get<
    ChessToolsChessPlayer[]
  >("https://api.chesstools.org/fide/top_active/?limit=100&history=false");

  const limit = pLimit(10);

  const promises = chessToolsChessPlayers.map((chessToolsChessPlayer) =>
    limit(async () => {
      const { data: html } = await axios.get(
        `https://ratings.fide.com/profile/${chessToolsChessPlayer.fide_id}`,
      );

      const $ = cheerio.load(html);
      const src = $("img.profile-top__photo").attr("src");

      if (src === undefined) {
        console.log(chessToolsChessPlayer.name + " src not found.");
        return;
      }

      const base64 = src.split(",")[1];
      const buffer = Buffer.from(base64, "base64");

      return new Promise<string>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "top-chess-uploads",
            public_id: chessToolsChessPlayer.fide_id,
            overwrite: true,
          },
          (err, result) => {
            if (err) return reject(err);
            if (!result?.secure_url) {
              return reject(new Error("No secure_url returned"));
            }
            resolve(result.secure_url);
          },
        );

        stream.end(buffer);
      });
    }),
  );

  console.log("Scraping...");

  await Promise.all(promises);

  console.log("Scraped successfully!");
}

scrape();
