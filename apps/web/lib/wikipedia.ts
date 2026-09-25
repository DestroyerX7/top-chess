import axios from "axios";

export type WikiResponse = {
  query: {
    pages: Record<string, WikiPage>;
  };
};

export type WikiPage = {
  pageid: number;
  title: string;
  extract?: string;
  description?: string;
  thumbnail?: {
    source: string;
    width: number;
    height: number;
  };
  fullurl?: string;
  index: number;
};

export async function getWikiPages(search: string) {
  const params = new URLSearchParams({
    action: "query",
    generator: "search",
    gsrsearch: search,
    prop: "extracts|pageimages|description|info",
    exintro: "true",
    explaintext: "true",
    pithumbsize: "500",
    inprop: "url",
    gsrnamespace: "0",
    format: "json",
  });

  const { data } = await axios.get<WikiResponse>(
    `https://en.wikipedia.org/w/api.php?${params}`,
    {
      headers: { "User-Agent": "top-chess/1.0 (destroyerincdev@gmail.com)" },
    },
  );

  const pages = Object.values(data.query.pages).toSorted(
    (a, b) => a.index - b.index,
  );

  return pages;
}

export async function getTopChessPlayerWikiData(name: string) {
  try {
    const pages = await getWikiPages(name);
    const page = pages.find(
      (p) =>
        p.description?.toLowerCase().includes("chess") &&
        !p.description.includes("tournament"),
    );

    if (page === undefined) {
      return {
        imageUrl: null,
        bio: null,
        description: null,
        wikipediaUrl: null,
      };
    }

    return {
      imageUrl: page.thumbnail?.source ?? null,
      bio: page.extract?.trim() ?? null,
      description: page.description ?? null,
      wikipediaUrl: page.fullurl ?? null,
    };
  } catch (error) {
    console.error(
      "Failed to get chess player wikipedia data:",
      axios.isAxiosError(error) || error instanceof Error
        ? error.message
        : error,
    );

    return { imageUrl: null, bio: null, description: null, wikipediaUrl: null };
  }
}
