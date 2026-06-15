import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { colors } from "@/constants/colors";
import TopChessPlayers from "@/components/TopChessPlayers";
import { ChessPlayer, getTopChessPlayers } from "@/api/chessPlayers";
import { router, Stack } from "expo-router";
import ChessPlayerCard, {
  ChessPlayerCardSkeleton,
} from "@/components/ChessPlayerCard";

export default function Home() {
  const {
    data: chessPlayers,
    isPending,
    error,
    isFetching,
    refetch,
    isStale,
  } = useQuery({
    queryKey: ["chessPlayers"],
    queryFn: getTopChessPlayers,
    staleTime: 1000 * 60 * 10,
  });

  const [searchInput, setSearchInput] = useState("");

  const fideLogoUrl =
    "https://www.fide.com/wp-content/uploads/FIDE-Logo-16x9-1.jpg";

  useEffect(() => {
    if (chessPlayers !== undefined) {
      const widgetChessPlayers = chessPlayers
        .slice(0, 25)
        .map((chessPlayer) => ({
          name: chessPlayer.name,
          rating: chessPlayer.rating,
          livePos: chessPlayer.livePos,
          imageUrl: chessPlayer.imageUrl
            ? `https://wsrv.nl/?url=${chessPlayer.imageUrl}` /*`https://top-chess.destroyerinc.workers.dev/image-proxy?url=${chessPlayer.imageUrl}`*/
            : fideLogoUrl,
        }));

      TopChessPlayers.updateSnapshot({
        widgetChessPlayers,
      });
    }
  }, [chessPlayers]);

  const handlePress = useCallback(
    (fideId: number) => {
      router.push({
        pathname: "/home/chess-player/[fideId]",
        params: { fideId },
      });
    },
    [router],
  );

  const renderItem = useCallback(
    ({ item: chessPlayer }: { item: ChessPlayer }) => (
      <ChessPlayerCard chessPlayer={chessPlayer} onPress={handlePress} />
    ),
    [handlePress],
  );

  const shownChessPlayers =
    searchInput.length < 1
      ? (chessPlayers ?? [])
      : (chessPlayers?.filter((c) =>
          c.name.toLowerCase().includes(searchInput.toLowerCase()),
        ) ?? []);

  return (
    <>
      <Stack.Screen
        options={{
          title: "Top Chess",
          headerLargeTitle: true,
          headerSearchBarOptions: {
            placeholder: "Search...",
            onChangeText: (e) => setSearchInput(e.nativeEvent.text),
            onCancelButtonPress: () => setSearchInput(""),
            hideWhenScrolling: false,
          },
        }}
      />

      <FlatList
        contentInsetAdjustmentBehavior="automatic"
        data={isPending ? Array(15).fill(null) : shownChessPlayers}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 8 }}
        keyExtractor={(item, index) =>
          isPending ? String(index) : String(item.fideId)
        }
        renderItem={isPending ? () => <ChessPlayerCardSkeleton /> : renderItem}
        refreshing={isFetching}
        onRefresh={() => {
          if (!isStale) {
            return;
          }

          refetch();
        }}
        ListEmptyComponent={
          error === null ? (
            <View style={{ padding: 8 }}>
              <Text
                style={{
                  color: colors.foreground,
                  fontSize: 16,
                  fontWeight: "700",
                }}
              >
                No chess players found
              </Text>
            </View>
          ) : (
            <View style={{ padding: 8 }}>
              <Text
                style={{
                  color: colors.foreground,
                  fontSize: 16,
                  fontWeight: "700",
                }}
              >
                Something went wrong, plaese rerfesh to try again
              </Text>
            </View>
          )
        }
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
