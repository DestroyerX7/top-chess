import { getWikiPages } from "@/lib/wikipedia";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const search = request.nextUrl.searchParams.get("search");

  if (search === null) {
    return NextResponse.json(
      { error: "Search must me included" },
      { status: 400 },
    );
  }

  const wikiPages = await getWikiPages(search);
  return NextResponse.json(wikiPages);
}
