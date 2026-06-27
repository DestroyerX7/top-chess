import { colors } from "@/constants/colors";
import { spacings } from "@/constants/spacings";
import { useDailyGames } from "@/hooks/chess";
import { Stack } from "expo-router";
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Animated,
  Pressable,
  StyleProp,
  ViewStyle,
} from "react-native";
import Text from "@/components/Text";
import { borderRadius } from "@/constants/borders";
import { useEffect, useRef } from "react";

function Skeleton({ style }: { style?: StyleProp<ViewStyle> }) {
  const opacity = useRef(new Animated.Value(0.75)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.75,
          duration: 750,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return <Animated.View style={[styles.skeletonBase, style, { opacity }]} />;
}

function RoundCardSkeleton({ numGames = 3 }: { numGames?: number }) {
  return (
    <View style={styles.roundCard}>
      <Skeleton style={styles.tournamentNameSkeleton} />
      <Skeleton style={styles.roundNameSkeleton} />

      <View style={styles.divider} />

      <View style={styles.gameContainer}>
        {Array.from({ length: numGames }).map((_, i) => (
          <View key={i} style={styles.game}>
            <Skeleton style={styles.gamePlayerSkeleton} />

            <Skeleton style={styles.gameResultSkeleton} />

            <Skeleton
              style={[
                styles.gamePlayerSkeleton,
                styles.gamePlayerSkeletonRight,
              ]}
            />
          </View>
        ))}
      </View>
    </View>
  );
}

function EventsSkeleton() {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
      scrollEnabled={false}
      contentContainerStyle={styles.container}
    >
      {[0, 1].map((dateIndex) => (
        <View key={dateIndex}>
          <Skeleton style={styles.dateSkeleton} />

          <View style={styles.dayScheduleContainer}>
            <RoundCardSkeleton numGames={4} />

            <RoundCardSkeleton numGames={2} />
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

export default function Events() {
  const {
    data: dailyGames,
    isPending,
    error,
    refetch,
    isFetching,
    isStale,
  } = useDailyGames();

  return (
    <>
      <Stack.Screen
        options={{
          title: "Events",
          headerLargeTitleEnabled: true,
        }}
      />

      {isPending ? (
        <EventsSkeleton />
      ) : error !== null ? (
        <View style={styles.errorContainer}>
          <Text size="xl" style={styles.errorTitle}>
            Couldn't load events
          </Text>

          <Text style={styles.errorMessage}>
            {error.message.length > 0
              ? error.message
              : "Something went wrong. Please try again."}
          </Text>

          <Pressable onPress={() => refetch()} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>
              {isFetching ? "Retrying..." : "Try again"}
            </Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.container}
          refreshControl={
            <RefreshControl
              onRefresh={() => {
                if (!isStale) {
                  return;
                }

                refetch();
              }}
              refreshing={isFetching}
            />
          }
        >
          {Object.entries(dailyGames)
            .sort(([aDateString], [bDateString]) =>
              bDateString.localeCompare(aDateString),
            )
            .map(([dateString, daySchedule]) => {
              const [year, month, day] = dateString.split("-").map(Number);
              const localeDateString = new Date(
                year,
                month - 1,
                day,
              ).toLocaleDateString();

              return (
                <View key={dateString}>
                  <Text size="xl" style={styles.date}>
                    {localeDateString}
                  </Text>

                  <View style={styles.dayScheduleContainer}>
                    {Object.entries(daySchedule).map(
                      ([tournamentName, tournament], i) => (
                        <View key={i} style={styles.tounamentContainer}>
                          {Object.entries(tournament.rounds).map(
                            ([roundName, games]) => (
                              <View key={roundName} style={styles.roundCard}>
                                <View>
                                  <Text size="xl" style={styles.tounamentName}>
                                    {tournamentName}
                                  </Text>

                                  <Text size="lg" style={styles.roundName}>
                                    {roundName}
                                  </Text>

                                  <View style={styles.divider} />

                                  <View style={styles.gameContainer}>
                                    {games.map((game, j) => (
                                      <View
                                        key={game.id ?? j}
                                        style={styles.game}
                                      >
                                        <Text style={styles.gamePlayerText}>
                                          {game.player_1_display}
                                        </Text>

                                        <Text style={styles.gameResultText}>
                                          {game.result.text.length > 0
                                            ? game.result.text
                                            : "vs"}
                                        </Text>

                                        <Text
                                          style={[
                                            styles.gamePlayerText,
                                            styles.textAlignRight,
                                          ]}
                                        >
                                          {game.player_2_display}
                                        </Text>
                                      </View>
                                    ))}
                                  </View>
                                </View>
                              </View>
                            ),
                          )}
                        </View>
                      ),
                    )}
                  </View>
                </View>
              );
            })}
        </ScrollView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacings.lg,
    padding: spacings.lg,
  },
  date: {
    color: colors.foreground,
    marginBottom: spacings.lg,
    fontWeight: "700",
  },
  dayScheduleContainer: {
    gap: spacings.lg,
  },
  tounamentContainer: {
    gap: spacings.lg,
  },
  roundCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    padding: spacings.lg,
  },
  tounamentName: {
    color: colors.primary,
    fontWeight: "700",
    marginBottom: spacings.sm,
  },
  roundName: {
    color: colors.mutedForeground,
    fontStyle: "italic",
    fontWeight: "600",
  },
  gameContainer: { gap: spacings.lg },
  game: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  gamePlayerText: {
    color: colors.cardForeground,
    flex: 2,
  },
  textAlignRight: {
    textAlign: "right",
  },
  gameResultText: {
    color: colors.primary,
    flex: 1,
    textAlign: "center",
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacings.lg,
  },

  // Skeleton styles
  skeletonBase: {
    backgroundColor: colors.secondary,
    borderRadius: borderRadius.sm,
  },
  dateSkeleton: {
    width: 128,
    height: 32,
    marginBottom: spacings.lg,
  },
  tournamentNameSkeleton: {
    width: "75%",
    height: 32,
    marginBottom: spacings.sm,
  },
  roundNameSkeleton: {
    width: "50%",
    height: 24,
  },
  gamePlayerSkeleton: {
    flex: 2,
    height: 24,
  },
  gamePlayerSkeletonRight: {
    alignSelf: "flex-end",
  },
  gameResultSkeleton: {
    flex: 1,
    height: 24,
    marginHorizontal: spacings.sm,
  },

  // Error styles
  errorContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacings.lg,
    gap: spacings.sm,
  },
  errorTitle: {
    color: colors.foreground,
    fontWeight: "700",
    textAlign: "center",
  },
  errorMessage: {
    color: colors.mutedForeground,
    textAlign: "center",
    marginBottom: spacings.lg,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacings.sm,
    paddingHorizontal: spacings.lg,
    borderRadius: borderRadius.lg,
  },
  retryButtonText: {
    color: colors.primaryForeground,
    fontWeight: "600",
  },
});
