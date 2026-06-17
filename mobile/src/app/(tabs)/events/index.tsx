import { colors } from "@/constants/colors";
import { fontSizes } from "@/constants/fonts";
import { spacings } from "@/constants/spacings";
import { useDailyGames } from "@/hooks/chess";
import { Stack } from "expo-router";
import { View, Text, ScrollView, StyleSheet } from "react-native";

export default function Events() {
  const { data: dailyGames } = useDailyGames();

  if (dailyGames === undefined) {
    return;
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Events",
          headerLargeTitleEnabled: true,
        }}
      />

      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {Object.entries(dailyGames)
          .reverse()
          .map(([date, daySchedule]) => (
            <View key={date}>
              <Text style={styles.date}>{date}</Text>

              <View style={styles.dayScheduleContainer}>
                {Object.entries(daySchedule).map(
                  ([tournamentName, tournament]) => (
                    <View key={tournamentName} style={styles.tounamentCard}>
                      <Text style={styles.tounamentName}>{tournamentName}</Text>

                      {Object.entries(tournament.rounds).map(
                        ([roundName, games]) => (
                          <View key={roundName}>
                            <Text style={styles.roundName}>{roundName}</Text>

                            <View
                              style={{
                                height: 1,
                                backgroundColor: colors.border,
                                marginVertical: spacings.lg,
                              }}
                            />

                            <View style={styles.gameContainer}>
                              {games.map((game, index) => (
                                <View
                                  key={game.id ?? index}
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
                        ),
                      )}
                    </View>
                  ),
                )}
              </View>
            </View>
          ))}
      </ScrollView>
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
    fontSize: fontSizes.xl,
    fontWeight: "700",
  },
  dayScheduleContainer: {
    gap: spacings.lg,
  },
  tounamentCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: spacings.lg,
  },
  tounamentName: {
    color: colors.primary,
    fontSize: fontSizes.xl,
    fontWeight: "700",
    marginBottom: spacings.sm,
  },
  roundName: {
    color: colors.mutedForeground,
    fontStyle: "italic",
    fontSize: fontSizes.lg,
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
});
