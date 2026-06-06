import axios from "axios";
import * as cheerio from "cheerio";
import { v2 as cloudinary } from "cloudinary";
import pLimit from "p-limit";

type ChessPlayer = {
  rank: string;
  name: string;
  fide_id: string;
  counrty: string;
  rating: string;
};

cloudinary.config({
  cloud_name: process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function scrape() {
  const { data: chessPlayers } = await axios.get<ChessPlayer[]>(
    "https://api.chesstools.org/fide/top_active/?limit=100&history=false",
  );

  const limit = pLimit(10);

  const promises = chessPlayers.map((chessPlayer) =>
    limit(async () => {
      const fideUrl = `https://ratings.fide.com/profile/${chessPlayer.fide_id}`;
      const { data: html } = await axios.get(fideUrl);

      const $ = cheerio.load(html);
      const src = $("img.profile-top__photo").attr("src");

      if (src === undefined) {
        console.log(chessPlayer.name + " src not found.");
        return;
      }

      const base64 = src.split(",")[1];
      const buffer = Buffer.from(base64, "base64");

      return new Promise<string>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "top-chess-uploads",
            public_id: chessPlayer.fide_id,
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
