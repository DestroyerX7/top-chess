import TopChessPlayerEditForm from "@/components/TopChessPlayerEditForm";
import { buttonVariants } from "@/components/ui/button";
import Yo from "@/components/Yo";
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
    <div>
      <header className="p-4 border-b flex justify-between items-center">
        <Link href="/">Top Chess</Link>

        <Link
          href="/admin/dashboard"
          className={buttonVariants({ variant: "ghost" })}
        >
          Dashbaord
        </Link>
      </header>

      <div className="p-4 flex //flex-row gap-4">
        <div className="flex-1">
          <TopChessPlayerEditForm topChessPlayer={response.data} />
        </div>

        <div className="flex-1">
          <Yo topChessPlayer={response.data} />
        </div>
      </div>
    </div>
  );
}
