import axios from "axios";
import * as cheerio from "cheerio";
import { ScrapedChessPlayer } from "./types";

export async function geonodeFetch(
  url: string,
): Promise<{ items: ScrapedChessPlayer[] }> {
  const response = await axios.post<{ data: { html: string } }>(
    "https://scraper.geonode.io/v1/extract",
    {
      url,
      formats: ["html"], // "html" | "markdown"
      render_js: false, // true = headless browser (slower)
      processing_mode: "sync", // "sync" | "async"
      proxy: {
        country: "US",
        type: "residential", // "residential" | "datacenter" | "mix"
      },
      headers: {
        "Accept-Language": "en-US",
      },
    },
    {
      headers: {
        "x-api-key": process.env.GEONODE_API_KEY!,
        "Content-Type": "application/json",
      },
    },
  );

  const $ = cheerio.load(response.data.data.html);
  const content = $("pre").text();

  return JSON.parse(content);
}
