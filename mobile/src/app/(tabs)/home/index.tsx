import { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { colors } from "@/constants/colors";
import TopChessPlayers from "@/components/TopChessPlayers";
import { ChessPlayer } from "@/api/chess";
import { router, Stack } from "expo-router";
import ChessPlayerCard, {
  ChessPlayerCardSkeleton,
} from "@/components/ChessPlayerCard";
import { useChessPlayers, useWorldChampions } from "@/hooks/chess";
import { spacings } from "@/constants/spacings";
import Text from "@/components/Text";

const fideLogoUrl =
  "https://www.fide.com/wp-content/uploads/FIDE-Logo-16x9-1.jpg";

const skeletonData = Array(10).fill(null);

export default function Home() {
  const {
    data: chessPlayers,
    isPending,
    error,
    isFetching,
    refetch,
    isStale,
  } = useChessPlayers();

  const { data: worldChampions } = useWorldChampions();
  const classicWorldChampion = worldChampions?.men.classic[0];

  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    if (chessPlayers === undefined) {
      return;
    }

    const widgetChessPlayers = chessPlayers.slice(0, 25).map((chessPlayer) => ({
      name: chessPlayer.name,
      rating: chessPlayer.rating,
      livePos: chessPlayer.livePos,
      imageUrl:
        chessPlayer.imageUrl !== null
          ? `https://wsrv.nl/?url=${chessPlayer.imageUrl}`
          : fideLogoUrl,
    }));

    TopChessPlayers.updateSnapshot({
      widgetChessPlayers,
    });
  }, [chessPlayers]);

  const handlePress = useCallback((fideId: number) => {
    router.push({
      pathname: "/home/chess-player/[fideId]",
      params: { fideId },
    });
  }, []);

  const renderItem = useCallback(
    ({ item: chessPlayer }: { item: ChessPlayer }) => (
      <ChessPlayerCard
        style={styles.chessPlayerCardContainer}
        chessPlayer={chessPlayer}
        isWorldChampion={
          classicWorldChampion !== undefined &&
          classicWorldChampion === chessPlayer.fideId
        }
        onPress={handlePress}
      />
    ),
    [handlePress, classicWorldChampion],
  );

  const renderSkeleton = useCallback(
    () => <ChessPlayerCardSkeleton style={styles.chessPlayerCardContainer} />,
    [],
  );

  const shownChessPlayers = useMemo(() => {
    if (!chessPlayers) {
      return [];
    }

    const trimmedSearchInput = searchInput.trim().toLowerCase();

    if (trimmedSearchInput.length < 1) {
      return chessPlayers;
    }

    return chessPlayers.filter((c) =>
      c.name.toLowerCase().includes(trimmedSearchInput),
    );
  }, [chessPlayers, searchInput]);

  const listEmptyComponent = useMemo(
    () =>
      error === null ? (
        <View style={styles.container}>
          <Text size="lg" style={styles.emptyListText}>
            No chess players found
          </Text>
        </View>
      ) : (
        <View style={styles.container}>
          <Text size="lg" style={styles.emptyListText}>
            Something went wrong, please refresh to try again
          </Text>
        </View>
      ),
    [error],
  );

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
        data={isPending ? skeletonData : shownChessPlayers}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
        keyExtractor={(item, index) =>
          isPending ? String(index) : String(item.fideId)
        }
        renderItem={isPending ? renderSkeleton : renderItem}
        refreshing={!isPending && isFetching}
        onRefresh={() => {
          if (!isStale) {
            return;
          }

          refetch();
        }}
        ListEmptyComponent={listEmptyComponent}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacings.md,
  },
  emptyListText: {
    color: colors.foreground,
    fontWeight: "700",
  },
  chessPlayerCardContainer: {
    flex: 1,
    aspectRatio: 1,
    padding: spacings.md,
    maxWidth: "50%",
  },
});
