import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getTopChessPlayers } from "../api/chessPlayers";
import TopChessPlayers from "../components/TopChessPlayers";

const flagOverrides: Record<string, string> = {
  ff: "ru",
  en: "gb",
};

function flagStringToEmoji(flagString: string) {
  const code = flagOverrides[flagString.toLowerCase()] ?? flagString;
  return code
    .toUpperCase()
    .split("")
    .map((char) => String.fromCodePoint(0x1f1e6 - 65 + char.charCodeAt(0)))
    .join("");
}

export default function Index() {
  const {
    data: chessPlayers,
    isPending,
    error,
  } = useQuery({
    queryKey: ["chessPlayers"],
    queryFn: getTopChessPlayers,
    staleTime: 1000 * 60 * 10,
  });

  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    if (chessPlayers !== undefined) {
      const widgetChessPlayers = chessPlayers.map((chessPlayer) => ({
        name: chessPlayer.name,
        rating: chessPlayer.rating,
        livePos: chessPlayer.livePos,
        imageUrl: chessPlayer.imageUrl,
      }));

      TopChessPlayers.updateSnapshot({
        widgetChessPlayers,
      });
    }
  }, [chessPlayers]);

  if (chessPlayers === undefined) {
    return;
  }

  const shownChessPlayers =
    searchInput.length < 1
      ? chessPlayers
      : chessPlayers.filter((c) =>
          c.name.toLowerCase().includes(searchInput.toLowerCase()),
        );

  if (shownChessPlayers.length === 0) {
    return (
      <SafeAreaView edges={["top"]} style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            gap: 16,
            padding: 16,
            alignItems: "center",
          }}
        >
          <Image
            style={{ width: 48, height: 48, borderRadius: 8 }}
            source={require("@/assets/images/splash-screen-dark.png")}
            alt="Top Chess Icon"
          />

          <View style={{ position: "relative", flex: 1 }}>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: "white",
                borderRadius: 100,
                padding: 16,
                paddingRight: 48,
                color: "white",
              }}
              placeholder="Search"
              placeholderTextColor="white"
              onChangeText={(text) => setSearchInput(text)}
              value={searchInput}
            />

            <Ionicons
              name="search"
              size={20}
              color="white"
              style={{
                position: "absolute",
                right: 16,
                top: "50%",
                transform: [{ translateY: -10 }],
              }}
            />
          </View>
        </View>

        <View style={{ padding: 16 }}>
          <Text style={{ color: "white", fontSize: 16, fontWeight: "700" }}>
            No chess players found
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          gap: 16,
          padding: 16,
          alignItems: "center",
        }}
      >
        <Image
          style={{ width: 48, height: 48, borderRadius: 8 }}
          source={require("@/assets/images/splash-screen-dark.png")}
          alt="Top Chess Icon"
        />

        <View style={{ position: "relative", flex: 1 }}>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: "white",
              borderRadius: 100,
              padding: 16,
              paddingRight: 48,
              color: "white",
            }}
            placeholder="Search"
            placeholderTextColor="white"
            onChangeText={(text) => setSearchInput(text)}
            value={searchInput}
          />

          <Ionicons
            name="search"
            size={20}
            color="white"
            style={{
              position: "absolute",
              right: 16,
              top: "50%",
              transform: [{ translateY: -10 }],
            }}
          />
        </View>
      </View>

      <FlatList
        data={shownChessPlayers}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 8 }}
        renderItem={({ item: chessPlayer }) => (
          <Link
            href={{
              pathname: "/chess-player/[fideId]",
              params: { fideId: chessPlayer.fideId },
            }}
            style={{
              padding: 8,
              width: "50%",
              aspectRatio: 1,
            }}
          >
            <ImageBackground
              source={{
                uri: chessPlayer.imageUrl,
              }}
              style={{
                width: "100%",
                height: "100%",
              }}
              imageStyle={{ borderRadius: 16 }}
              key={chessPlayer.fideId}
            >
              <View
                style={{
                  borderRadius: 16,
                  padding: 8,
                  justifyContent: "space-between",
                  flex: 1,
                  overflow: "visible",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    overflow: "visible",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "column",
                      gap: 4,
                      overflow: "visible",
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontWeight: "700",
                        textShadowColor: "black",
                        textShadowOffset: { width: 0, height: 2 },
                        textShadowRadius: 2,
                        overflow: "visible",
                      }}
                    >
                      #{chessPlayer.livePos}
                    </Text>

                    {chessPlayer.yearAgoRankingChange !== 0 && (
                      <Text
                        style={{
                          color:
                            chessPlayer.yearAgoRankingChange > 0
                              ? "#c4ff10"
                              : "red",
                          textShadowColor: "black",
                          textShadowOffset: { width: 0, height: 2 },
                          textShadowRadius: 2,
                          overflow: "visible",
                        }}
                      >
                        {chessPlayer.yearAgoRankingChange > 0 ? "▲" : "▼"}
                        {Math.abs(chessPlayer.yearAgoRankingChange)}
                      </Text>
                    )}
                  </View>

                  <Text
                    style={{
                      fontSize: 32,
                      textShadowColor: "black",
                      textShadowOffset: { width: 0, height: 2 },
                      textShadowRadius: 2,
                      overflow: "visible",
                    }}
                  >
                    {flagStringToEmoji(chessPlayer.flag)}
                  </Text>
                </View>

                <View
                  style={{
                    justifyContent: "space-between",
                  }}
                >
                  {chessPlayer.live && (
                    <Text
                      style={{
                        color: "white",
                        fontWeight: "700",
                        textShadowColor: "black",
                        textShadowOffset: { width: 0, height: 2 },
                        textShadowRadius: 2,
                        lineHeight: 24,
                      }}
                    >
                      🔴Live
                    </Text>
                  )}

                  <View style={{ flexDirection: "row", gap: 4 }}>
                    <Text
                      style={{
                        color: "white",
                        fontWeight: "700",
                        textShadowColor: "black",
                        textShadowOffset: { width: 0, height: 2 },
                        textShadowRadius: 2,
                        overflow: "visible",
                      }}
                    >
                      {chessPlayer.rating}
                    </Text>

                    {chessPlayer.ratingDiff !== 0 && (
                      <Text
                        style={{
                          color: chessPlayer.ratingDiff > 0 ? "#c4ff10" : "red",
                          textShadowColor: "black",
                          textShadowOffset: { width: 0, height: 2 },
                          textShadowRadius: 2,
                          overflow: "visible",
                        }}
                      >
                        {chessPlayer.ratingDiff > 0 && "+"}
                        {chessPlayer.ratingDiff}
                      </Text>
                    )}
                  </View>

                  <Text
                    style={{
                      color: "white",
                      fontWeight: "700",
                      textShadowColor: "black",
                      textShadowOffset: { width: 0, height: 2 },
                      textShadowRadius: 2,
                      overflow: "visible",
                    }}
                  >
                    {chessPlayer.name}
                  </Text>
                </View>
              </View>
            </ImageBackground>
          </Link>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
