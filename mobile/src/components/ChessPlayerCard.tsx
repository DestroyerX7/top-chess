import { ChessPlayer } from "@/lib/api";
import { colors } from "@/constants/colors";
import { flagStringToEmoji } from "@/lib/flags";
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
      // eslint-disable-next-line react-hooks/immutability
      scale.value = withSpring(0.95);
    };

    const handlePressOut = () => {
      // eslint-disable-next-line react-hooks/immutability
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
          />

          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={[styles.bold, styles.textShadow]}>
                #{chessPlayer.standardRank}
              </Text>

              {chessPlayer.standardMonthRankChange !== 0 && (
                <Text
                  style={[
                    {
                      color:
                        chessPlayer.standardMonthRankChange > 0
                          ? colors.primary
                          : colors.destructive,
                    },
                    styles.textShadow,
                  ]}
                >
                  {chessPlayer.standardMonthRankChange > 0 ? "▲" : "▼"}
                  {Math.abs(chessPlayer.standardMonthRankChange)}
                </Text>
              )}
            </View>

            <Text size="8xl" noLineHeight style={styles.textShadow}>
              {flagStringToEmoji(chessPlayer.flag)}
            </Text>
          </View>

          <View style={styles.bottom}>
            {isWorldChampion && (
              <MaterialCommunityIcons
                name="crown"
                size={32}
                color="gold"
                style={styles.textShadow}
              />
            )}

            {(chessPlayer.hasLiveStandardGame ||
              chessPlayer.hasLiveRapidGame ||
              chessPlayer.hasLiveBlitzGame) && (
              <Text
                style={[
                  styles.bold,
                  {
                    lineHeight: lineHeights.xl,
                  },
                  styles.textShadow,
                ]}
              >
                🔴 Live
              </Text>
            )}

            <View style={styles.ratingRow}>
              <Text style={[styles.bold, styles.textShadow]}>
                {chessPlayer.standardRating}
              </Text>

              {chessPlayer.standardMonthRatingChange !== 0 && (
                <Text
                  style={[
                    {
                      color:
                        chessPlayer.standardMonthRatingChange > 0
                          ? colors.primary
                          : colors.destructive,
                    },
                    styles.textShadow,
                  ]}
                >
                  {chessPlayer.standardMonthRatingChange > 0 && "+"}
                  {chessPlayer.standardMonthRatingChange}
                </Text>
              )}
            </View>

            <Text style={[styles.bold, styles.textShadow]}>
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
      <View style={styles.skeletonContainer}>
        <View style={styles.row}>
          <View
            style={[
              {
                height: 64,
                width: 64,
              },
              styles.skeletonPlaceholder,
            ]}
          />

          <View
            style={[
              {
                height: 32,
                width: 32,
              },
              styles.skeletonPlaceholder,
            ]}
          />
        </View>

        <View style={{ gap: spacings.md }}>
          <View
            style={[
              {
                height: 32,
                width: "75%",
              },
              styles.skeletonPlaceholder,
            ]}
          />

          <View
            style={[
              {
                height: 32,
              },
              styles.skeletonPlaceholder,
            ]}
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
  textShadow: {
    textShadowColor: colors.background,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 2,
  },
  bold: {
    fontWeight: "700",
  },
  skeletonContainer: {
    flex: 1,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.card,
    padding: spacings.lg,
    justifyContent: "space-between",
  },
  skeletonPlaceholder: {
    backgroundColor: colors.secondary,
    borderRadius: borderRadius.sm,
  },
});

ChessPlayerCard.displayName = "ChessPlayerCard";
export default ChessPlayerCard;
