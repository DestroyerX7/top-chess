import { ChessPlayer } from "@/lib/api";
import { colors } from "@/constants/colors";
import { flagStringToEmoji } from "@/lib/flags";
import { Pressable, View, StyleSheet, ViewProps } from "react-native";
import * as Haptics from "expo-haptics";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { Image } from "expo-image";
import { spacings } from "@/constants/spacings";
import Text from "@/components/Text";
import { lineHeights } from "@/constants/fonts";
import { borderRadius } from "@/constants/borders";
import Skeleton from "./Skeleton";

type Props = {
  chessPlayer: ChessPlayer;
  isWorldChampion?: boolean;
  onPress: (fideId: number) => void;
} & ViewProps;

const fideLogoUrl =
  "https://www.fide.com/wp-content/uploads/FIDE-Logo-16x9-1.jpg";

export default function ChessPlayerCard({
  style,
  chessPlayer,
  isWorldChampion = false,
  onPress,
  ...props
}: Props) {
  const handleCardPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress(chessPlayer.fideId);
  };

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
    <Animated.View style={[style, animatedStyle]} {...props}>
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
            <MaterialDesignIcons
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
}

export function ChessPlayerCardSkeleton({ style }: ViewProps) {
  return (
    <View style={style}>
      <View style={styles.skeletonContainer}>
        <View style={styles.row}>
          <Skeleton
            style={{
              height: 64,
              width: 64,
            }}
          />

          <Skeleton
            style={{
              height: 32,
              width: 32,
            }}
          />
        </View>

        <View style={{ gap: spacings.md }}>
          <Skeleton
            style={{
              height: 32,
              width: "75%",
            }}
          />

          <Skeleton
            style={{
              height: 32,
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
});
