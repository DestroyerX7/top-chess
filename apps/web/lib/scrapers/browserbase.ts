import axios from "axios";

export async function browserbaseFetch(url: string): Promise<string> {
  const response = await axios.post<{ content: string }>(
    "https://api.browserbase.com/v1/fetch",
    { url },
    {
      headers: {
        "Content-Type": "application/json",
        "X-BB-API-Key": process.env.BROWSERBASE_API_KEY!,
      },
    },
  );

  return response.data.content;
}
