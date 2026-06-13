import { ChessPlayer } from "@/api/chessPlayers";
import { colors } from "@/constants/colors";
import { router } from "expo-router";
import {
  View,
  Text,
  ImageBackground,
  Pressable,
  FlatList,
  StyleProp,
  ViewStyle,
} from "react-native";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { flagStringToEmoji } from "@/utils/flags";

export type ChessPlayerListRef = {
  scrollToTop: () => void;
};

type Props = {
  chessPlayers: ChessPlayer[];
  numColumns?: number;
  contentContainerStyle?: StyleProp<ViewStyle>;
  showsVerticalScrollIndicator?: boolean;
  isFetching?: boolean;
  refresh?: () => void;
};

const ChessPlayerList = forwardRef<ChessPlayerListRef, Props>(
  (
    {
      chessPlayers,
      numColumns,
      contentContainerStyle,
      showsVerticalScrollIndicator,
      isFetching,
      refresh,
    },
    ref,
  ) => {
    const flatListRef = useRef<FlatList>(null);

    useImperativeHandle(ref, () => ({
      scrollToTop: () => {
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
      },
    }));

    const fideLogoUrl =
      "https://www.fide.com/wp-content/uploads/FIDE-Logo-16x9-1.jpg";

    return (
      <FlatList
        ref={flatListRef}
        data={chessPlayers}
        numColumns={numColumns}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        contentContainerStyle={contentContainerStyle}
        keyExtractor={(chessPlayer) => String(chessPlayer.fideId)}
        refreshing={isFetching}
        onRefresh={refresh}
        renderItem={({ item: chessPlayer }) => (
          <View
            style={{
              flex: 1,
              aspectRatio: 1,
              padding: 8,
              maxWidth: "50%",
            }}
          >
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/chess-player/[fideId]",
                  params: { fideId: chessPlayer.fideId },
                })
              }
              style={{ flex: 1 }}
            >
              <ImageBackground
                source={{
                  uri: chessPlayer.imageUrl ?? fideLogoUrl,
                }}
                style={{
                  padding: 8,
                  justifyContent: "space-between",
                  flex: 1,
                }}
                imageStyle={{ borderRadius: 16 }}
                key={chessPlayer.fideId}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "column",
                      gap: 4,
                    }}
                  >
                    <Text
                      style={{
                        color: colors.foreground,
                        fontWeight: "700",
                        textShadowColor: colors.background,
                        textShadowOffset: { width: 0, height: 2 },
                        textShadowRadius: 2,
                      }}
                    >
                      #{chessPlayer.livePos}
                    </Text>

                    {chessPlayer.yearAgoRankingChange !== 0 && (
                      <Text
                        style={{
                          color:
                            chessPlayer.yearAgoRankingChange > 0
                              ? colors.primary
                              : colors.destructive,
                          textShadowColor: colors.background,
                          textShadowOffset: { width: 0, height: 2 },
                          textShadowRadius: 2,
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
                      textShadowColor: colors.background,
                      textShadowOffset: { width: 0, height: 2 },
                      textShadowRadius: 2,
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
                        color: colors.foreground,
                        fontWeight: "700",
                        textShadowColor: colors.background,
                        textShadowOffset: { width: 0, height: 2 },
                        textShadowRadius: 2,
                        lineHeight: 24,
                      }}
                    >
                      🔴 Live
                    </Text>
                  )}

                  <View style={{ flexDirection: "row", gap: 4 }}>
                    <Text
                      style={{
                        color: colors.foreground,
                        fontWeight: "700",
                        textShadowColor: colors.background,
                        textShadowOffset: { width: 0, height: 2 },
                        textShadowRadius: 2,
                      }}
                    >
                      {chessPlayer.rating}
                    </Text>

                    {chessPlayer.ratingDiff !== 0 && (
                      <Text
                        style={{
                          color:
                            chessPlayer.ratingDiff > 0
                              ? colors.primary
                              : colors.destructive,
                          textShadowColor: colors.background,
                          textShadowOffset: { width: 0, height: 2 },
                          textShadowRadius: 2,
                        }}
                      >
                        {chessPlayer.ratingDiff > 0 && "+"}
                        {chessPlayer.ratingDiff}
                      </Text>
                    )}
                  </View>

                  <Text
                    style={{
                      color: colors.foreground,
                      fontWeight: "700",
                      textShadowColor: colors.background,
                      textShadowOffset: { width: 0, height: 2 },
                      textShadowRadius: 2,
                    }}
                  >
                    {chessPlayer.name}
                  </Text>
                </View>
              </ImageBackground>
            </Pressable>
          </View>
        )}
      />
    );
  },
);

export default ChessPlayerList;
