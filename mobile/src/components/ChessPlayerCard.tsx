import { ChessPlayer } from "@/api/chessPlayers";
import { colors } from "@/constants/colors";
import { flagStringToEmoji } from "@/utils/flags";
import React, { useCallback } from "react";
import {
  ImageBackground,
  Pressable,
  View,
  Text,
  StyleSheet,
} from "react-native";
import * as Haptics from "expo-haptics";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

type Props = {
  chessPlayer: ChessPlayer;
  onPress: (fideId: number) => void;
};

const fideLogoUrl =
  "https://www.fide.com/wp-content/uploads/FIDE-Logo-16x9-1.jpg";

const ChessPlayerCard = React.memo(({ chessPlayer, onPress }: Props) => {
  const handleCardPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress(chessPlayer.fideId);
  }, [onPress, chessPlayer.fideId]);

  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Pressable
        onPress={handleCardPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={{ flex: 1 }}
      >
        <ImageBackground
          source={{
            uri: chessPlayer.imageUrl ?? fideLogoUrl,
          }}
          style={styles.imageBackground}
          imageStyle={styles.imageStyle}
          key={chessPlayer.fideId}
        >
          <View style={styles.row}>
            <View style={styles.column}>
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

              {chessPlayer.posChangeValue !== 0 && (
                <Text
                  style={{
                    color:
                      chessPlayer.posChangeValue > 0
                        ? colors.primary
                        : colors.destructive,
                    textShadowColor: colors.background,
                    textShadowOffset: { width: 0, height: 2 },
                    textShadowRadius: 2,
                  }}
                >
                  {chessPlayer.posChangeValue > 0 ? "▲" : "▼"}
                  {Math.abs(chessPlayer.posChangeValue)}
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

          <View style={styles.bottom}>
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

            <View style={styles.row}>
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
    </Animated.View>
  );
});

export function ChessPlayerCardSkeleton() {
  return (
    <View style={styles.container}>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    aspectRatio: 1,
    padding: 8,
    maxWidth: "50%",
  },
  imageBackground: {
    padding: 8,
    justifyContent: "space-between",
    flex: 1,
  },
  imageStyle: {
    borderRadius: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  column: {
    flexDirection: "column",
    gap: 4,
  },
  ratingRow: {
    flexDirection: "row",
    gap: 4,
  },
  bottom: {
    justifyContent: "space-between",
  },
});

export default ChessPlayerCard;
