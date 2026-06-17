import { ChessPlayer } from "@/api/chess";
import { colors } from "@/constants/colors";
import { flagStringToEmoji } from "@/utils/flags";
import React, { useCallback } from "react";
import {
  Pressable,
  View,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from "react-native";
import * as Haptics from "expo-haptics";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Image } from "expo-image";
import { spacings } from "@/constants/spacings";

type Props = {
  style?: StyleProp<ViewStyle>;
  chessPlayer: ChessPlayer;
  isWorldChampion?: boolean;
  onPress: (fideId: number) => void;
};

const fideLogoUrl =
  "https://www.fide.com/wp-content/uploads/FIDE-Logo-16x9-1.jpg";

const ChessPlayerCard = React.memo(
  ({ style, chessPlayer, isWorldChampion = false, onPress }: Props) => {
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
      <Animated.View style={[style, animatedStyle]}>
        <Pressable
          onPress={handleCardPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={styles.pressable}
        >
          <Image
            source={{ uri: chessPlayer.imageUrl ?? fideLogoUrl }}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            // contentPosition="top center"
            placeholder={{ blurhash: "LGF5?xYk^6#M@-5c,1J5@[or[Q6." }} // optional
            transition={300} // crossfade duration in ms when real image loads
          />

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
            {isWorldChampion && (
              <MaterialCommunityIcons
                name="crown"
                size={32}
                color="gold"
                style={{
                  textShadowColor: colors.background,
                  textShadowOffset: { width: 0, height: 2 },
                  textShadowRadius: 2,
                }}
              />
            )}

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

            <View style={styles.ratingRow}>
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
        </Pressable>
      </Animated.View>
    );
  },
);

export function ChessPlayerCardSkeleton({
  style,
}: {
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={style}>
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
  pressable: {
    flex: 1,
    overflow: "hidden",
    borderRadius: 16,
    padding: spacings.md,
    justifyContent: "space-between",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  column: {
    flexDirection: "column",
    gap: spacings.sm,
  },
  ratingRow: {
    flexDirection: "row",
    gap: spacings.sm,
  },
  bottom: {
    justifyContent: "space-between",
  },
});

export default ChessPlayerCard;
