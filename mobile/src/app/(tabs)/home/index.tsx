import { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, View } from "react-native";
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
import { Ionicons } from "@expo/vector-icons";
import { useFilterStore } from "@/hooks/useFilterStore";

const fideLogoUrl =
  "https://www.fide.com/wp-content/uploads/FIDE-Logo-16x9-1.jpg";

const skeletonData = Array(10).fill(null);

export default function Home() {
  const {
    data: chessPlayers,
    isPending,
    error,
    refetch,
    isStale,
    isRefetching,
  } = useChessPlayers();

  const { data: worldChampions } = useWorldChampions();
  const classicWorldChampion = worldChampions?.men.classic[0];

  const [searchInput, setSearchInput] = useState("");

  const { filterOption, sortOption } = useFilterStore();

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
    if (chessPlayers === undefined) {
      return [];
    }

    let result = chessPlayers;

    const trimmedSearchInput = searchInput.trim().toLowerCase();
    if (trimmedSearchInput.length > 0) {
      result = result.filter((c) =>
        c.name.toLowerCase().includes(trimmedSearchInput),
      );
    }

    if (filterOption === "live") {
      result = result.filter((c) => c.live);
    } else if (filterOption === "rated-above-2700") {
      result = result.filter((c) => c.rating >= 2700);
    }

    if (sortOption === "rating-ascending") {
      result = [...result].sort((a, b) => a.rating - b.rating);
    } else if (sortOption === "rating-change-descending") {
      result = [...result].sort((a, b) => b.ratingDiff - a.ratingDiff);
    } else if (sortOption === "rating-change-ascending") {
      result = [...result].sort((a, b) => a.ratingDiff - b.ratingDiff);
    } else if (sortOption === "ranking-change-descending") {
      result = [...result].sort((a, b) => b.posChangeValue - a.posChangeValue);
    } else if (sortOption === "ranking-change-ascending") {
      result = [...result].sort((a, b) => a.posChangeValue - b.posChangeValue);
    } else if (sortOption === "country") {
      result = [...result].sort((a, b) =>
        a.countryName.localeCompare(b.countryName),
      );
    } else if (sortOption === "age-descending") {
      result = [...result].sort((a, b) => b.age - a.age);
    } else if (sortOption === "age-ascending") {
      result = [...result].sort((a, b) => a.age - b.age);
    } else if (sortOption === "name") {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [chessPlayers, searchInput, filterOption, sortOption]);

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
          headerRight: () => (
            <Pressable onPress={() => router.push("/home/filters")} hitSlop={8}>
              <Ionicons name="filter" size={24} color={colors.foreground} />
            </Pressable>
          ),
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
        refreshing={isRefetching}
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
