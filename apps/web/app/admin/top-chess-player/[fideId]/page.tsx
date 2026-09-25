import Header from "@/components/Header";
import TopChessPlayerEditForm from "@/components/TopChessPlayerEditForm";
import { buttonVariants } from "@/components/ui/button";
import TopChessPlayerWikiSearch from "@/components/TopChessPlayerWikiSearch";
import { TopChessPlayer } from "@top-chess/db/types";
import axios from "axios";
import Link from "next/link";

export default async function TopChessPlayerPage({
  params,
}: {
  params: Promise<{ fideId: string }>;
}) {
  const { fideId } = await params;

  const response = await axios.get<TopChessPlayer>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/top-chess-player/${fideId}`,
  );

  return (
    <>
      <Header isAdmin />

      <div className="p-4 mx-64 flex gap-4">
        <div className="basis-0 flex-1 min-w-0">
          <TopChessPlayerEditForm topChessPlayer={response.data} />
        </div>

        <div className="basis-0 flex-1 min-w-0">
          <TopChessPlayerWikiSearch topChessPlayer={response.data} />
        </div>
      </div>
    </>
  );
}
