import axios from "axios";
// import * as cheerio from "cheerio";

export async function geonodeFetch<T>(url: string): Promise<T> {
  const response = await axios.post<{ data: { html: string } }>(
    "https://scraper.geonode.io/v1/extract",
    {
      url,
      formats: ["html"], // "html" | "markdown"
      render_js: false, // true = headless browser (slower)
      processing_mode: "sync", // "sync" | "async"
      proxy: {
        type: "residential", // "residential" | "datacenter" | "mix"
      },
    },
    {
      headers: {
        "x-api-key": process.env.GEONODE_API_KEY!,
        "Content-Type": "application/json",
      },
    },
  );

  // When I first tried response.data.data.html, was real html
  // But now it is just the JSON object
  // Could possibly uninstall cheerio
  // JSON fields could have html entities in them, might need to fix in the future
  // const $ = cheerio.load(response.data.data.html);
  // const content = $("pre").text();

  // return JSON.parse(content);

  return JSON.parse(response.data.data.html);
}
