import {
  ExternalPathString,
  Link,
  Redirect,
  router,
  Stack,
  useLocalSearchParams,
} from "expo-router";
import {
  ScrollView,
  View,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { colors } from "@/constants/colors";
import { flagStringToEmoji } from "@/lib/flags";
import { Image } from "expo-image";
import { useTopChessPlayer, useWorldChampions } from "@/hooks/useChessQueries";
import { spacings } from "@/constants/spacings";
import { fontSizes, lineHeights } from "@/constants/fonts";
import Text from "@/components/Text";
import { borderRadius } from "@/constants/borders";
import { useEffect, useState } from "react";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import RatingCard from "@/components/RatingCard";

function StatRow({
  label,
  value,
  delta,
  positiveSymbol = "+",
  negativeSymbol = "-",
}: {
  label: string;
  value: string | number;
  delta?: number;
  positiveSymbol?: string;
  negativeSymbol?: string;
}) {
  return (
    <View style={styles.statRow}>
      <Text style={styles.statLabel}>{label}</Text>

      <View style={styles.statRight}>
        <Text style={styles.statValue}>{value}</Text>

        {delta !== undefined && delta !== 0 && (
          <Text
            style={[
              styles.statDelta,
              { color: delta > 0 ? colors.primary : colors.destructive },
            ]}
          >
            {delta > 0 ? positiveSymbol : negativeSymbol}
            {Math.abs(delta)}
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
      <Text size="sm" style={styles.cardTitle}>
        {title}
      </Text>

      <View style={styles.cardDivider} />

      {children}
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
      <Text size="sm" style={styles.cardTitle}>
        Standard Rating History
      </Text>

      <View style={styles.cardDivider} />

      <LineChart
        data={normalizedRatingHistory}
        color={colors.primary}
        thickness={2}
        hideDataPoints
        areaChart
        startFillColor={colors.primary}
        endFillColor={colors.background}
        startOpacity={0.5}
        dashWidth={0}
        yAxisLabelTexts={yAxisLabelTexts}
        yAxisTextStyle={{
          color: colors.mutedForeground,
          fontSize: fontSizes.sm,
          lineHeight: lineHeights.sm,
        }}
        xAxisLabelTextStyle={{
          color: colors.mutedForeground,
          fontSize: fontSizes.sm,
          lineHeight: lineHeights.sm,
        }}
        yAxisColor={colors.border}
        xAxisColor={colors.border}
        scrollToEnd
        adjustToWidth
        noOfSections={noOfSections}
        stepValue={stepVal}
      />
    </View>
  );
}

export default function TopChessPlayerPage() {
  const localSearchParams = useLocalSearchParams<{ fideId: string }>();
  const fideId = Number(localSearchParams.fideId);

  const { data: topChessPlayer, isPending } = useTopChessPlayer(fideId);

  const { data: worldChampions } = useWorldChampions();

  const classicWorldChampion = worldChampions?.men.classic[0];

  const [selectedTimeControl, setSelectedTimeControl] = useState<
    "standard" | "rapid" | "blitz"
  >("standard");

  useEffect(() => {
    if (topChessPlayer === null && !isPending) {
      router.dismissTo("/(tabs)/home");
    }
  }, [topChessPlayer, isPending]);

  if (topChessPlayer === null) {
    return (
      <>
        <Stack.Screen
          options={{
            headerLargeTitle: true,
            title: "",
            headerBackButtonDisplayMode: "minimal",
          }}
        />

        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            gap: spacings.lg,
          }}
        >
          <ActivityIndicator size="large" color={colors.foreground} />

          <Text>Loading...</Text>
        </View>
      </>
    );
  }

  const hasLiveGame =
    topChessPlayer.hasLiveStandardGame ||
    topChessPlayer.hasLiveRapidGame ||
    topChessPlayer.hasLiveBlitzGame;

  return (
    <>
      <Stack.Screen
        options={{
          headerLargeTitle: true,
          title: topChessPlayer.name,
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
                topChessPlayer.imageUrl ??
                "https://www.fide.com/wp-content/uploads/FIDE-Logo-16x9-1.jpg",
            }}
            contentFit="contain"
            style={styles.heroImage}
          />

          {/* Gradient overlay name badge */}
          <View style={styles.heroBadge}>
            <Text size="4xl" style={styles.heroName}>
              {topChessPlayer.name}
            </Text>

            <Text size="lg" style={styles.heroCountry}>
              {topChessPlayer.countryName}{" "}
              {flagStringToEmoji(topChessPlayer.flag)}
            </Text>

            {classicWorldChampion !== undefined &&
              classicWorldChampion === topChessPlayer.fideId && (
                <View style={styles.worldChampionContainer}>
                  <Text size="lg" style={styles.worldChampionText}>
                    Current World Champion
                  </Text>

                  <MaterialDesignIcons
                    name="crown"
                    size={24}
                    color={colors.gold}
                    style={styles.textShadow}
                  />
                </View>
              )}

            {hasLiveGame && (
              <Text size="4xl" style={styles.liveText}>
                🔴 Playing Live
              </Text>
            )}
          </View>
        </View>

        {/* Description */}
        {topChessPlayer.description !== null && (
          <Text size="lg" style={styles.description}>
            {topChessPlayer.description}
          </Text>
        )}

        {/* Chess ratings */}
        <SectionCard title="Chess Ratings">
          <View style={{ flexDirection: "row", gap: spacings.md }}>
            <Pressable
              style={({ pressed }) => [
                { flex: 1 },
                pressed && { opacity: 0.8 },
              ]}
              onPress={() => setSelectedTimeControl("standard")}
            >
              <RatingCard
                style={{
                  borderWidth: 1,
                  borderColor:
                    selectedTimeControl === "standard"
                      ? colors.border
                      : "transparent",
                }}
                format="standard"
                rating={topChessPlayer.standardRating}
              />
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                { flex: 1 },
                pressed && { opacity: 0.8 },
              ]}
              onPress={() => setSelectedTimeControl("rapid")}
            >
              <RatingCard
                style={{
                  borderWidth: 1,
                  borderColor:
                    selectedTimeControl === "rapid"
                      ? colors.border
                      : "transparent",
                }}
                format="rapid"
                rating={topChessPlayer.rapidRating}
                inactive={topChessPlayer.rapidRatingInactive}
              />
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                { flex: 1 },
                pressed && { opacity: 0.8 },
              ]}
              onPress={() => setSelectedTimeControl("blitz")}
            >
              <RatingCard
                style={{
                  borderWidth: 1,
                  borderColor:
                    selectedTimeControl === "blitz"
                      ? colors.border
                      : "transparent",
                }}
                format="blitz"
                rating={topChessPlayer.blitzRating}
                inactive={topChessPlayer.blitzRatingInactive}
              />
            </Pressable>
          </View>

          {selectedTimeControl === "standard" ? (
            <>
              <StatRow
                label="Standard Rating"
                value={topChessPlayer.standardRating}
                delta={topChessPlayer.standardMonthRatingChange}
              />

              <StatRow
                label="Year Rating Change"
                value={
                  topChessPlayer.standardYearRatingChange === 0
                    ? topChessPlayer.standardYearRatingChange
                    : ""
                }
                delta={topChessPlayer.standardYearRatingChange}
              />

              <StatRow
                label="World Rank"
                value={`#${topChessPlayer.standardRank}`}
                delta={topChessPlayer.standardMonthRankChange}
                positiveSymbol="▲"
                negativeSymbol="▼"
              />

              <StatRow
                label="Year Ranking Change"
                value={
                  topChessPlayer.standardYearRankChange === 0
                    ? topChessPlayer.standardYearRankChange
                    : ""
                }
                delta={topChessPlayer.standardYearRankChange}
                positiveSymbol="▲"
                negativeSymbol="▼"
              />

              <StatRow
                label="Recent Games"
                value={topChessPlayer.recentStandardGamesCount}
              />
            </>
          ) : selectedTimeControl === "rapid" ? (
            <>
              <StatRow
                label="Rapid Rating"
                value={topChessPlayer.rapidRating ?? "Unrated"}
              />

              <StatRow
                label="World Rank"
                value={
                  topChessPlayer.rapidRank !== null
                    ? `#${topChessPlayer.rapidRank}`
                    : "Unranked"
                }
              />

              <StatRow
                label="Recent Games"
                value={topChessPlayer.recentRapidGamesCount}
              />

              {topChessPlayer.rapidRatingInactive && (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: colors.mutedForeground }}>Status</Text>

                  <Text style={{ fontWeight: "600", color: colors.inactive }}>
                    Inactive
                  </Text>
                </View>
              )}
            </>
          ) : (
            <>
              <StatRow
                label="Blitz Rating"
                value={topChessPlayer.blitzRating ?? "Unrated"}
              />

              <StatRow
                label="World Rank"
                value={
                  topChessPlayer.blitzRank !== null
                    ? `#${topChessPlayer.blitzRank}`
                    : "Unranked"
                }
              />

              <StatRow
                label="Recent Games"
                value={topChessPlayer.recentBlitzGamesCount}
              />

              {topChessPlayer.blitzRatingInactive && (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: colors.mutedForeground }}>Status</Text>

                  <Text style={{ fontWeight: "600", color: colors.inactive }}>
                    Inactive
                  </Text>
                </View>
              )}
            </>
          )}
        </SectionCard>

        {/* About */}
        <SectionCard title="About">
          <StatRow
            label="Country"
            value={`${topChessPlayer.countryName} ${flagStringToEmoji(topChessPlayer.flag)}`}
          />

          {topChessPlayer.birthday !== null && (
            <StatRow
              label="Birthday"
              value={new Date(
                `${topChessPlayer.birthday}T00:00:00`,
              ).toLocaleDateString()}
            />
          )}

          <StatRow label="Age" value={topChessPlayer.age} />

          <StatRow label="FIDE ID" value={topChessPlayer.fideId} />
        </SectionCard>

        {/* Achievements */}
        <SectionCard title="Achievements">
          <Text style={styles.achievementText}>
            {topChessPlayer.standardBestRankTitle}
          </Text>

          <Text style={styles.achievementText}>
            {topChessPlayer.standardBestRatingTitle}
          </Text>

          {topChessPlayer.rapidBestRatingTitle !== null && (
            <Text style={styles.achievementText}>
              {topChessPlayer.rapidBestRatingTitle}
            </Text>
          )}

          {topChessPlayer.blitzBestRatingTitle !== null && (
            <Text style={styles.achievementText}>
              {topChessPlayer.blitzBestRatingTitle}
            </Text>
          )}
        </SectionCard>

        {/* Chart */}
        <RatingHistoryChart
          ratingHistory={[
            ...topChessPlayer.standardRatingHistory,
            Math.round(topChessPlayer.standardRating),
          ]}
        />

        {/* Bio */}
        {topChessPlayer.bio !== null && (
          <SectionCard title="Biography">
            {topChessPlayer.bio
              .split("\n")
              .filter((s) => s.length > 0)
              .map((text, index) => (
                <Text size="lg" key={index} style={styles.bioText}>
                  {text}
                </Text>
              ))}
          </SectionCard>
        )}

        {/* Wikipedia link */}
        {topChessPlayer.wikipediaUrl !== null && (
          <Link
            href={topChessPlayer.wikipediaUrl as ExternalPathString}
            target="_blank"
            style={styles.wikiLink}
          >
            Read on Wikipedia →
          </Link>
        )}

        {/* FIDE link */}
        <Link
          href={`https://ratings.fide.com/profile/${topChessPlayer.fideId}`}
          target="_blank"
          style={styles.fideLink}
        >
          View FIDE profile →
        </Link>
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
    borderRadius: borderRadius.lg,
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
    fontWeight: "700",
  },
  heroCountry: {
    color: colors.mutedForeground,
  },
  liveText: {
    color: colors.cardForeground,
    fontWeight: "700",
  },
  textShadow: {
    textShadowColor: colors.background,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 2,
  },
  worldChampionContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacings.sm,
  },
  worldChampionText: {
    color: colors.mutedForeground,
    fontWeight: "700",
    fontStyle: "italic",
  },

  // Description
  description: {
    color: colors.mutedForeground,
    fontStyle: "italic",
  },

  // Cards
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacings.lg,
    gap: spacings.md,
  },
  cardTitle: {
    color: colors.primary,
    textTransform: "uppercase",
    fontWeight: "700",
    letterSpacing: 1.5,
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
    fontWeight: "600",
  },

  // Achievements
  achievementText: {
    color: colors.mutedForeground,
  },

  // Chart
  chartContainer: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacings.lg,
    gap: spacings.md,
    overflow: "hidden",
  },

  // Bio
  bioText: {
    color: colors.foreground,
  },

  // Wikipedia
  wikiLink: {
    color: colors.primary,
    fontWeight: "600",
  },

  // FIDE
  fideLink: {
    color: colors.mutedForeground,
    fontWeight: "600",
  },
});
