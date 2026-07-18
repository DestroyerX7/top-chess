import { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { colors } from "@/constants/colors";
import TopChessPlayers from "@/components/TopChessPlayers";
import { ChessPlayer } from "@/lib/api";
import { router, Stack } from "expo-router";
import ChessPlayerCard, {
  ChessPlayerCardSkeleton,
} from "@/components/ChessPlayerCard";
import { useTopChessPlayers, useWorldChampions } from "@/hooks/useChessQueries";
import { spacings } from "@/constants/spacings";
import Text from "@/components/Text";
import { useFilterStore } from "@/hooks/useFilterStore";
import Ionicons from "@react-native-vector-icons/ionicons";

const fideLogoUrl =
  "https://www.fide.com/wp-content/uploads/FIDE-Logo-16x9-1.jpg";

const skeletonData = Array(10).fill(null);

export default function Home() {
  const {
    data: topChessPlayers,
    isPending,
    error,
    refetch,
    isStale,
    isRefetching,
  } = useTopChessPlayers();

  const { data: worldChampions } = useWorldChampions();
  const classicWorldChampion = worldChampions?.men.classic[0];

  const [searchInput, setSearchInput] = useState("");

  const { filterOption, sortOption } = useFilterStore();

  useEffect(() => {
    if (topChessPlayers === undefined) {
      return;
    }

    const widgetChessPlayers = topChessPlayers
      .slice(0, 25)
      .map((chessPlayer) => ({
        name: chessPlayer.name,
        standardRating: chessPlayer.standardRating,
        standardRank: chessPlayer.standardRank,
        imageUrl:
          chessPlayer.imageUrl !== null
            ? `https://wsrv.nl/?url=${chessPlayer.imageUrl}`
            : fideLogoUrl,
      }));

    TopChessPlayers.updateSnapshot({
      widgetChessPlayers,
    });
  }, [topChessPlayers]);

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
    if (topChessPlayers === undefined) {
      return [];
    }

    let result = topChessPlayers;

    const trimmedSearchInput = searchInput.trim().toLowerCase();
    if (trimmedSearchInput.length > 0) {
      result = result.filter((c) =>
        c.name.toLowerCase().includes(trimmedSearchInput),
      );
    }

    if (filterOption === "live") {
      result = result.filter(
        (c) =>
          c.hasLiveStandardGame || c.hasLiveRapidGame || c.hasLiveBlitzGame,
      );
    } else if (filterOption === "rated-above-2700") {
      result = result.filter((c) => c.standardRating >= 2700);
    } else if (filterOption === "top-100") {
      result = result.filter((c) => c.standardRank <= 100);
    }

    if (sortOption === "world-rank-descending") {
      result = [...result].sort((a, b) => b.standardRank - a.standardRank);
    } else if (sortOption === "rating-change-descending") {
      result = [...result].sort(
        (a, b) => b.standardMonthRatingChange - a.standardMonthRatingChange,
      );
    } else if (sortOption === "rating-change-ascending") {
      result = [...result].sort(
        (a, b) => a.standardMonthRatingChange - b.standardMonthRatingChange,
      );
    } else if (sortOption === "ranking-change-descending") {
      result = [...result].sort(
        (a, b) => b.standardMonthRankChange - a.standardMonthRankChange,
      );
    } else if (sortOption === "ranking-change-ascending") {
      result = [...result].sort(
        (a, b) => a.standardMonthRankChange - b.standardMonthRankChange,
      );
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
  }, [topChessPlayers, searchInput, filterOption, sortOption]);

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
