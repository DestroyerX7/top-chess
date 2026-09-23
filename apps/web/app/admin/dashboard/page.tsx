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

export default async function AdminDashboard() {
  const response = await axios.get<TopChessPlayer[]>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/top-chess-players`,
  );

  return (
    <div className="p-4">
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>

          <TabsTrigger value="no-image">No Image</TabsTrigger>

          <TabsTrigger value="no-wikipedia">No Wikipedia</TabsTrigger>

          <TabsTrigger value="suspicious">Suspicious</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <ItemGroup>
            {response.data.map((topChessPlayer) => (
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
            {response.data
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
            {response.data
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
            {response.data
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
  );
}
