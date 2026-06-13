import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getTopChessPlayers } from "../api/chessPlayers";
import TopChessPlayers from "../components/TopChessPlayers";
import { colors } from "@/constants/colors";
import ChessPlayerList, {
  ChessPlayerListRef,
} from "@/components/ChessPlayerList";

export default function Index() {
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

  const insets = useSafeAreaInsets();
  const fideLogoUrl =
    "https://www.fide.com/wp-content/uploads/FIDE-Logo-16x9-1.jpg";

  const chessPlayerListRef = useRef<ChessPlayerListRef>(null);

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

  if (isPending) {
    return (
      <View style={{ flex: 1, paddingTop: insets.top }}>
        <View
          style={{
            flexDirection: "row",
            gap: 16,
            padding: 16,
            alignItems: "center",
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          }}
        >
          <Image
            style={{ width: 48, height: 48, borderRadius: 8 }}
            source={require("@/assets/images/icon-dark.png")}
            alt="Top Chess Icon"
          />

          <View style={{ position: "relative", flex: 1 }}>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 100,
                padding: 16,
                paddingRight: 48,
                color: colors.foreground,
                backgroundColor: colors.muted,
              }}
              placeholder="Search"
              placeholderTextColor={colors.mutedForeground}
            />

            <Ionicons
              name="search"
              size={20}
              color={colors.mutedForeground}
              style={{
                position: "absolute",
                right: 16,
                top: "50%",
                transform: [{ translateY: -10 }],
              }}
            />
          </View>
        </View>

        <View style={[styles.grid]}>
          {Array.from({ length: 10 }).map((_, i) => (
            <View key={i} style={styles.chessPlayerGridItem}>
              <View
                style={{
                  flex: 1,
                  borderRadius: 16,
                  backgroundColor: colors.card,
                  padding: 16,
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <View
                    style={{
                      height: 64,
                      width: 64,
                      backgroundColor: colors.secondary,
                      borderRadius: 8,
                    }}
                  />

                  <View
                    style={{
                      height: 32,
                      width: 32,
                      backgroundColor: colors.secondary,
                      borderRadius: 8,
                    }}
                  />
                </View>

                <View style={{ gap: 8 }}>
                  <View
                    style={{
                      height: 32,
                      width: "75%",
                      backgroundColor: colors.secondary,
                      borderRadius: 8,
                    }}
                  />

                  <View
                    style={{
                      height: 32,
                      backgroundColor: colors.secondary,
                      borderRadius: 8,
                    }}
                  />
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  }

  if (error !== null) {
    return (
      <Text>
        Somthing went wrong getting the top chess players. Plaese reload to try
        again
      </Text>
    );
  }

  const shownChessPlayers =
    searchInput.length < 1
      ? chessPlayers
      : chessPlayers.filter((c) =>
          c.name.toLowerCase().includes(searchInput.toLowerCase()),
        );

  return (
    <View style={{ flex: 1, paddingTop: insets.top }}>
      <View
        style={{
          flexDirection: "row",
          gap: 16,
          padding: 16,
          alignItems: "center",
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <Pressable onPress={() => chessPlayerListRef.current?.scrollToTop()}>
          <Image
            style={{ width: 48, height: 48, borderRadius: 8 }}
            source={require("@/assets/images/icon-dark.png")}
            alt="Top Chess Icon"
          />
        </Pressable>

        <View style={{ position: "relative", flex: 1 }}>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 100,
              padding: 16,
              paddingRight: 48,
              color: colors.foreground,
              backgroundColor: colors.muted,
            }}
            placeholder="Search"
            placeholderTextColor={colors.mutedForeground}
            onChangeText={setSearchInput}
            value={searchInput}
            autoCorrect={false}
            spellCheck={false}
            returnKeyType="search"
          />

          {searchInput.length === 0 ? (
            <Ionicons
              name="search"
              size={20}
              color={colors.mutedForeground}
              style={{
                position: "absolute",
                right: 16,
                top: "50%",
                transform: [{ translateY: -10 }],
              }}
            />
          ) : (
            <Pressable
              style={{
                position: "absolute",
                right: 16,
                top: "50%",
                transform: [{ translateY: -10 }],
              }}
              onPress={() => setSearchInput("")}
            >
              <Ionicons
                name="close-circle"
                size={20}
                color={colors.mutedForeground}
              />
            </Pressable>
          )}
        </View>
      </View>

      {shownChessPlayers.length === 0 ? (
        <View style={{ padding: 16 }}>
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
        <ChessPlayerList
          ref={chessPlayerListRef}
          chessPlayers={shownChessPlayers}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: 8,
            paddingHorizontal: 8,
            paddingBottom: insets.bottom + 8,
          }}
          isFetching={isFetching}
          refresh={() => {
            if (!isStale) {
              return;
            }

            refetch();
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  grid: { padding: 8, flexDirection: "row", flexWrap: "wrap" },
  chessPlayerGridItem: {
    width: "50%",
    aspectRatio: 1,
    padding: 8,
  },
});
