import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TopChessPlayer } from "@top-chess/db/types";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const params = await searchParams;
  const response = await axios.get<TopChessPlayer[]>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/top-chess-players`,
  );

  const topChessPlayers =
    params.search !== undefined
      ? response.data.filter((t) =>
          t.name.toLowerCase().includes(params.search!.toLowerCase()),
        )
      : response.data;

  const search = async (formData: FormData) => {
    "use server";

    const search = formData.get("search")?.toString();

    const params = new URLSearchParams();

    if (search !== undefined && search !== "") {
      params.set("search", search);
    }

    redirect(`/admin/dashboard?${params.toString()}`);
  };

  return (
    <>
      <Header className="sticky top-0" isAdmin />

      <div className="p-4 mx-64">
        <form className="flex mb-4 gap-2" action={search}>
          <Input
            placeholder="Search"
            name="search"
            defaultValue={params.search ?? ""}
          />

          <Button type="submit">Search</Button>
        </form>

        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>

            <TabsTrigger value="no-image">No Image</TabsTrigger>

            <TabsTrigger value="no-wikipedia">No Wikipedia</TabsTrigger>

            <TabsTrigger value="suspicious">Suspicious</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <ItemGroup>
              {topChessPlayers.map((topChessPlayer) => (
                <Item
                  key={topChessPlayer.fideId}
                  variant="outline"
                  role="listitem"
                  render={
                    <Link
                      href={`/admin/top-chess-player/${topChessPlayer.fideId}`}
                    >
                      <ItemMedia variant="image">
                        {topChessPlayer.imageUrl !== null ? (
                          <Image
                            src={topChessPlayer.imageUrl}
                            alt={topChessPlayer.name}
                            width={32}
                            height={32}
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <Image
                            src="https://avatar.vercel.sh/Midnight%20City%20Lights"
                            alt="Midnight City Lights"
                            width={32}
                            height={32}
                            className="object-cover grayscale"
                          />
                        )}
                      </ItemMedia>

                      <ItemContent>
                        <ItemTitle>
                          #{topChessPlayer.standardRank} {topChessPlayer.name}
                        </ItemTitle>

                        {topChessPlayer.description !== null && (
                          <ItemDescription>
                            {topChessPlayer.description}
                          </ItemDescription>
                        )}
                      </ItemContent>
                    </Link>
                  }
                />
              ))}
            </ItemGroup>
          </TabsContent>

          <TabsContent value="no-image">
            <ItemGroup>
              {topChessPlayers
                .filter((t) => t.imageUrl === null)
                .map((topChessPlayer) => (
                  <Item
                    key={topChessPlayer.fideId}
                    variant="outline"
                    role="listitem"
                    render={
                      <Link
                        href={`/admin/top-chess-player/${topChessPlayer.fideId}`}
                      >
                        <ItemMedia variant="image">
                          {topChessPlayer.imageUrl !== null ? (
                            <Image
                              src={topChessPlayer.imageUrl}
                              alt={topChessPlayer.name}
                              width={32}
                              height={32}
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <Image
                              src="https://avatar.vercel.sh/Midnight%20City%20Lights"
                              alt="Midnight City Lights"
                              width={32}
                              height={32}
                              className="object-cover grayscale"
                            />
                          )}
                        </ItemMedia>

                        <ItemContent>
                          <ItemTitle>{topChessPlayer.name}</ItemTitle>

                          {topChessPlayer.description !== null && (
                            <ItemDescription>
                              {topChessPlayer.description}
                            </ItemDescription>
                          )}
                        </ItemContent>
                      </Link>
                    }
                  />
                ))}
            </ItemGroup>
          </TabsContent>

          <TabsContent value="no-wikipedia">
            <ItemGroup>
              {topChessPlayers
                .filter((t) => t.wikipediaUrl === null)
                .map((topChessPlayer) => (
                  <Item
                    key={topChessPlayer.fideId}
                    variant="outline"
                    role="listitem"
                    render={
                      <Link
                        href={`/admin/top-chess-player/${topChessPlayer.fideId}`}
                      >
                        <ItemMedia variant="image">
                          {topChessPlayer.imageUrl !== null ? (
                            <Image
                              src={topChessPlayer.imageUrl}
                              alt={topChessPlayer.name}
                              width={32}
                              height={32}
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <Image
                              src="https://avatar.vercel.sh/Midnight%20City%20Lights"
                              alt="Midnight City Lights"
                              width={32}
                              height={32}
                              className="object-cover grayscale"
                            />
                          )}
                        </ItemMedia>

                        <ItemContent>
                          <ItemTitle>{topChessPlayer.name}</ItemTitle>

                          {topChessPlayer.description !== null && (
                            <ItemDescription>
                              {topChessPlayer.description}
                            </ItemDescription>
                          )}
                        </ItemContent>
                      </Link>
                    }
                  />
                ))}
            </ItemGroup>
          </TabsContent>

          <TabsContent value="suspicious">
            <ItemGroup>
              {topChessPlayers
                .filter(
                  (t) =>
                    t.description === null ||
                    !t.description.includes("born") ||
                    t.description.includes("tournament"),
                )
                .map((topChessPlayer) => (
                  <Item
                    key={topChessPlayer.fideId}
                    variant="outline"
                    role="listitem"
                    render={
                      <Link
                        href={`/admin/top-chess-player/${topChessPlayer.fideId}`}
                      >
                        <ItemMedia variant="image">
                          {topChessPlayer.imageUrl !== null ? (
                            <Image
                              src={topChessPlayer.imageUrl}
                              alt={topChessPlayer.name}
                              width={32}
                              height={32}
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <Image
                              src="https://avatar.vercel.sh/Midnight%20City%20Lights"
                              alt="Midnight City Lights"
                              width={32}
                              height={32}
                              className="object-cover grayscale"
                            />
                          )}
                        </ItemMedia>

                        <ItemContent>
                          <ItemTitle>{topChessPlayer.name}</ItemTitle>

                          {topChessPlayer.description !== null && (
                            <ItemDescription>
                              {topChessPlayer.description}
                            </ItemDescription>
                          )}
                        </ItemContent>
                      </Link>
                    }
                  />
                ))}
            </ItemGroup>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
