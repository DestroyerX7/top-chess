import { ChessPlayer } from "@/api/chess";
import { colors } from "@/constants/colors";
import { flagStringToEmoji } from "@/utils/flags";
import React, { useCallback } from "react";
import {
  Pressable,
  View,
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
import Text from "@/components/Text";
import { lineHeights } from "@/constants/fonts";
import { borderRadius } from "@/constants/borders";

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
              size="8xl"
              noLineHeight
              style={{
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
                  fontWeight: "700",
                  textShadowColor: colors.background,
                  textShadowOffset: { width: 0, height: 2 },
                  textShadowRadius: 2,
                  lineHeight: lineHeights.xl,
                }}
              >
                🔴 Live
              </Text>
            )}

            <View style={styles.ratingRow}>
              <Text
                style={{
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
          borderRadius: borderRadius.lg,
          backgroundColor: colors.card,
          padding: spacings.lg,
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
              borderRadius: borderRadius.sm,
            }}
          />

          <View
            style={{
              height: 32,
              width: 32,
              backgroundColor: colors.secondary,
              borderRadius: borderRadius.sm,
            }}
          />
        </View>

        <View style={{ gap: spacings.md }}>
          <View
            style={{
              height: 32,
              width: "75%",
              backgroundColor: colors.secondary,
              borderRadius: borderRadius.sm,
            }}
          />

          <View
            style={{
              height: 32,
              backgroundColor: colors.secondary,
              borderRadius: borderRadius.sm,
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
    borderRadius: borderRadius.lg,
    padding: spacings.md,
    justifyContent: "space-between",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  column: {
    flexDirection: "column",
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
