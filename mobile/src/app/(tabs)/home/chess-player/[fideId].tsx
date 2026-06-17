import {
  ExternalPathString,
  Link,
  Stack,
  useLocalSearchParams,
} from "expo-router";
import { Text, ScrollView, View, StyleSheet } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { colors } from "@/constants/colors";
import { flagStringToEmoji } from "@/utils/flags";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Image } from "expo-image";
import { useChessPlayer, useWorldChampions } from "@/hooks/chess";
import { spacings } from "@/constants/spacings";
import { fontSizes } from "@/constants/fonts";

function StatRow({
  label,
  value,
  delta,
  deltaInvert = false,
  positiveSymbol = "+",
  negativeSymbol = "-",
}: {
  label: string;
  value: string | number;
  delta?: number;
  deltaInvert?: boolean; // for rankings: lower is better
  positiveSymbol?: string;
  negativeSymbol?: string;
}) {
  const positive = deltaInvert ? (delta ?? 0) < 0 : (delta ?? 0) > 0;

  return (
    <View style={styles.statRow}>
      <Text style={styles.statLabel}>{label}</Text>

      <View style={styles.statRight}>
        <Text style={styles.statValue}>{value}</Text>

        {delta !== undefined && delta !== 0 && (
          <Text
            style={[
              styles.statDelta,
              { color: positive ? colors.primary : colors.destructive },
            ]}
          >
            {positive ? positiveSymbol : negativeSymbol} {Math.abs(delta)}
          </Text>
        )}
      </View>
    </View>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>

      <View style={styles.cardDivider} />

      <View style={{ gap: 10 }}>{children}</View>
    </View>
  );
}

function RatingHistoryChart({ ratingHistory }: { ratingHistory: number[] }) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const currentMonth = new Date().getMonth();

  const minValOffset = 10;
  const min = Math.min(...ratingHistory) - minValOffset;
  const max = Math.max(...ratingHistory);
  const noOfSections = 5;
  const stepVal = Math.ceil((max - min) / noOfSections);

  const normalizedRatingHistory = ratingHistory.map((rating, i) => {
    const monthIndex =
      (((currentMonth - (ratingHistory.length - 1 - i)) % 12) + 12) % 12;
    return { value: rating - min, label: months[monthIndex] };
  });

  const yAxisLabelTexts = Array.from({ length: noOfSections + 1 }).map((_, i) =>
    String(min + i * stepVal),
  );

  return (
    <View style={styles.chartContainer}>
      <Text style={styles.cardTitle}>Rating History</Text>

      <View style={styles.cardDivider} />

      <LineChart
        data={normalizedRatingHistory}
        color={colors.primary}
        thickness={2}
        hideDataPoints
        dataPointsColor={colors.primary}
        areaChart
        startFillColor={colors.primary}
        endFillColor={colors.background}
        startOpacity={0.35}
        dashWidth={0}
        yAxisLabelTexts={yAxisLabelTexts}
        yAxisTextStyle={{ color: colors.mutedForeground, fontSize: 11 }}
        xAxisLabelTextStyle={{ color: colors.mutedForeground, fontSize: 11 }}
        isAnimated
        scrollToEnd
        adjustToWidth
        noOfSections={noOfSections}
        stepValue={stepVal}
        backgroundColor="transparent"
        yAxisColor={colors.border}
        xAxisColor={colors.border}
        rulesColor={colors.border}
      />
    </View>
  );
}

export default function ChessPlayerPage() {
  const localSearchParams = useLocalSearchParams<{ fideId: string }>();
  const fideId = Number(localSearchParams.fideId);

  const { data: chessPlayer, isPending, error } = useChessPlayer(fideId);

  const { data: worldChampions } = useWorldChampions();

  const classicWorldChampion = worldChampions?.men.classic[0];

  if (chessPlayer === null) {
    return;
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerLargeTitle: true,
          title: chessPlayer.name,
          headerBackButtonDisplayMode: "minimal",
        }}
      />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
      >
        {/* Hero image */}
        <View style={styles.heroContainer}>
          <Image
            source={{
              uri:
                chessPlayer.imageUrl ??
                "https://www.fide.com/wp-content/uploads/FIDE-Logo-16x9-1.jpg",
            }}
            contentFit="contain"
            style={styles.heroImage}
          />

          {/* Gradient overlay name badge */}
          <View style={styles.heroBadge}>
            <Text style={styles.heroName}>{chessPlayer.name}</Text>

            <Text style={styles.heroCountry}>
              {chessPlayer.countryName} {flagStringToEmoji(chessPlayer.flag)}
            </Text>

            {classicWorldChampion !== undefined &&
              classicWorldChampion === chessPlayer.fideId && (
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
                >
                  <Text style={styles.worldChampionText}>
                    Current World Champion
                  </Text>

                  <MaterialCommunityIcons
                    name="crown"
                    size={24}
                    color="gold"
                    style={styles.textShadow}
                  />
                </View>
              )}

            {chessPlayer.live && <Text style={styles.liveText}>🔴 Live</Text>}
          </View>
        </View>

        {/* Description */}
        {chessPlayer.description !== null && (
          <Text style={styles.description}>{chessPlayer.description}</Text>
        )}

        {/* Chess stats */}
        <SectionCard title="Chess Rating">
          <StatRow
            label="Live Rating"
            value={chessPlayer.rating}
            delta={chessPlayer.ratingDiff}
          />

          <StatRow
            label="Year Rating Change"
            value={`${chessPlayer.yearAgoRatingChange > 0 ? "+" : ""}${chessPlayer.yearAgoRatingChange}`}
          />

          <StatRow
            label="World Rank"
            value={`#${chessPlayer.livePos}`}
            delta={chessPlayer.posChangeValue}
            positiveSymbol="▲"
            negativeSymbol="▼"
          />

          <StatRow
            label="Year Ranking Change"
            value={Math.abs(chessPlayer.yearAgoRankingChange)}
            delta={chessPlayer.yearAgoRankingChange}
            positiveSymbol="▲"
            negativeSymbol="▼"
          />

          <StatRow label="Recent Games" value={chessPlayer.gamesCount} />

          <StatRow label="FIDE ID" value={chessPlayer.fideId} />
        </SectionCard>

        {/* About */}
        <SectionCard title="About">
          <StatRow
            label="Country"
            value={`${chessPlayer.countryName} ${flagStringToEmoji(chessPlayer.flag)}`}
          />

          {chessPlayer.birthday !== null && (
            <StatRow label="Birthday" value={chessPlayer.birthday} />
          )}

          <StatRow label="Age" value={chessPlayer.age} />
        </SectionCard>

        {/* Achievements */}
        <SectionCard title="Achievements">
          <Text style={styles.achievementText}>
            {chessPlayer.bestRatingTitle}
          </Text>

          <Text style={styles.achievementText}>{chessPlayer.bestPosTitle}</Text>
        </SectionCard>

        {/* Chart */}
        {chessPlayer.ratingHistory !== null && (
          <RatingHistoryChart
            ratingHistory={[
              ...chessPlayer.ratingHistory,
              Math.round(chessPlayer.rating),
            ]}
          />
        )}

        {/* Bio */}
        {chessPlayer.bio !== null && (
          <SectionCard title="Biography">
            {chessPlayer.bio.split("\n").map((text, index) => (
              <Text key={index} style={styles.bioText}>
                {text}
              </Text>
            ))}
          </SectionCard>
        )}

        {/* Wikipedia link */}
        {chessPlayer.wikipediaUrl !== null && (
          <Link
            href={chessPlayer.wikipediaUrl as ExternalPathString}
            target="_blank"
            style={styles.wikiLink}
          >
            Read on Wikipedia →
          </Link>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: spacings.lg,
    gap: spacings.lg,
  },

  // Hero
  heroContainer: {
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: colors.card,
  },
  heroImage: {
    aspectRatio: 1,
  },
  heroBadge: {
    padding: spacings.lg,
    gap: spacings.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  heroName: {
    color: colors.cardForeground,
    fontSize: fontSizes["5xl"],
    fontWeight: "700",
  },
  heroCountry: {
    color: colors.mutedForeground,
    fontSize: fontSizes.lg,
  },
  liveText: {
    color: colors.cardForeground,
    fontWeight: "700",
    lineHeight: 39,
    fontSize: fontSizes["5xl"],
  },
  textShadow: {
    textShadowColor: colors.background,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 2,
  },
  worldChampionText: {
    color: colors.mutedForeground,
    fontWeight: "700",
    fontStyle: "italic",
  },

  // Description
  description: {
    color: colors.mutedForeground,
    fontSize: fontSizes.lg,
    lineHeight: 24,
    fontStyle: "italic",
  },

  // Cards
  card: {
    backgroundColor: colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacings.lg,
    gap: 12,
  },
  cardTitle: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  cardDivider: {
    height: 1,
    backgroundColor: colors.border,
  },

  // Stat rows
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statLabel: {
    color: colors.mutedForeground,
    flex: 1,
  },
  statRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacings.md,
  },
  statValue: {
    color: colors.cardForeground,
    fontWeight: "600",
  },
  statDelta: {
    fontSize: fontSizes.sm,
    fontWeight: "600",
  },

  // Achievements
  achievementText: {
    color: colors.mutedForeground,
    lineHeight: 20,
  },

  // Chart
  chartContainer: {
    backgroundColor: colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacings.lg,
    gap: 12,
    overflow: "hidden",
  },

  // Bio
  bioText: {
    color: colors.foreground,
    fontSize: fontSizes.lg,
    lineHeight: 24, // This is causing text in the bio to get cutoff, idk why
  },

  // Wikipedia
  wikiLink: {
    color: colors.primary,
    fontSize: fontSizes.lg,
    fontWeight: "600",
  },
});
