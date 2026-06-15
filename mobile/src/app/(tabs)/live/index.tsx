import { ChessSchedule, getDailyGames } from "@/api/chessPlayers";
import { colors } from "@/constants/colors";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";

export default function Live() {
  const [chessSchedule, setChessSchedule] = useState<ChessSchedule | null>(
    null,
  );

  useEffect(() => {
    const yo = async () => {
      const hi = await getDailyGames();
      setChessSchedule(hi);
    };

    yo();
  }, []);

  if (chessSchedule === null) {
    return;
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Live",
          headerLargeTitleEnabled: true,
        }}
      />

      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          gap: 16,
          padding: 16,
        }}
      >
        {Object.entries(chessSchedule)
          .reverse()
          .map(([date, daySchedule]) => (
            <View key={date}>
              <Text
                style={{
                  color: colors.foreground,
                  marginBottom: 16,
                  fontSize: 18,
                  fontWeight: "700",
                }}
              >
                {date}
              </Text>

              <View style={{ gap: 16 }}>
                {Object.entries(daySchedule).map(
                  ([tournamentName, tournament]) => (
                    <View
                      key={tournamentName}
                      style={{
                        backgroundColor: colors.card,
                        borderWidth: 1,
                        borderColor: colors.border,
                        borderRadius: 8,
                        padding: 16,
                      }}
                    >
                      <Text
                        style={{
                          color: colors.primary,
                          fontSize: 18,
                          fontWeight: "700",
                          marginBottom: 4,
                        }}
                      >
                        {tournamentName}
                      </Text>

                      {Object.entries(tournament.rounds).map(
                        ([roundName, games]) => (
                          <View key={roundName}>
                            <Text
                              style={{
                                color: colors.mutedForeground,
                                fontStyle: "italic",
                                fontSize: 16,
                                fontWeight: "600",
                              }}
                            >
                              {roundName}
                            </Text>

                            <View
                              style={{
                                height: 1,
                                backgroundColor: colors.border,
                                marginVertical: 16,
                              }}
                            />

                            <View style={{ gap: 16 }}>
                              {games.map((game, index) => (
                                <View
                                  key={game.id ?? index}
                                  style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <Text
                                    style={{
                                      color: colors.cardForeground,
                                      flex: 2,
                                    }}
                                  >
                                    {game.player_1_display}
                                  </Text>

                                  <Text
                                    style={{
                                      color: colors.primary,
                                      flex: 1,
                                      textAlign: "center",
                                    }}
                                  >
                                    {game.result.text.length > 0
                                      ? game.result.text
                                      : "vs"}
                                  </Text>

                                  <Text
                                    style={{
                                      color: colors.cardForeground,
                                      flex: 2,
                                      textAlign: "right",
                                    }}
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
