import { ScrollView, Text, View, Image } from "react-native";
import { Stack } from "expo-router";
import { colors } from "@/constants/colors";
import { useState } from "react";
import { searchChessPlayer, SearchResult } from "@/api/chessPlayers";
import { flagStringToEmoji, getCountryInfo } from "@/utils/flags";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

type Segment = {
  text: string;
  highlight?: boolean;
};

type Quote = {
  segments: Segment[];
  author: string;
};

export default function Search() {
  const [searchResults, setSearchResults] = useState<SearchResult[] | null>(
    null,
  );
  const [loading, setLoading] = useState(false);

  const search = async (searchInput: string) => {
    try {
      const trimmedSearchInput = searchInput.trim();

      if (trimmedSearchInput.length < 1) {
        return;
      }

      setLoading(true);

      const searchResult = await searchChessPlayer(trimmedSearchInput);

      setSearchResults(searchResult);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const quotes: Quote[] = [
    {
      segments: [
        {
          text: "People who want to improve should take their defeats as lessons, and endeavor to learn what to avoid in the future. You must also have the courage of your convictions. ",
        },
        { text: "If you think your move is good, make it.", highlight: true },
      ],
      author: "Jose Raul Capablanca",
    },
    {
      segments: [
        {
          text: "Chess is a struggle between my desire not to think and my desire not to lose.",
        },
      ],
      author: "Jan Gustafsson",
    },
    {
      segments: [
        {
          text: "Tactics ",
          highlight: true,
        },
        {
          text: "is knowing what to do when there is something to do. ",
        },
        {
          text: "Strategy ",
          highlight: true,
        },
        {
          text: "is knowing what to do when there is nothing to do.",
        },
      ],
      author: "Savielly Tartakower",
    },
    {
      segments: [
        {
          text: "The blunders are all there on the board, waiting to be made.",
        },
      ],
      author: "Savielly Tartakower",
    },
    {
      segments: [
        {
          text: "You must take your opponent into a deep, dark forest where 2+2 is 5 and the path leading out is only wide enough for one.",
        },
      ],
      author: "Mikhail Tal",
    },
    {
      segments: [
        {
          text: "e4 is the move you play when you're young, naive, and believe the world owes you something. Open positions, infinite horizons - what's not to love? Well, I've got news for you, buddy: it's a cruel chess board out there.",
        },
      ],
      author: "John Bartholomew",
    },
    {
      segments: [
        {
          text: "The ability to play chess is the sign of a gentleman. The ability to play chess well is the sign of a wasted life.",
        },
      ],
      author: "Paul Morphy",
    },
    {
      segments: [
        {
          text: "The winner of the game is whoever makes the next to last mistake.",
        },
      ],
      author: "Savielly Tartakower",
    },
    {
      segments: [
        {
          text: "When you see a good move, look for a better one.",
        },
      ],
      author: "Emanuel Lasker",
    },
    {
      segments: [
        {
          text: "Why must I lose to this idiot?!",
        },
      ],
      author: "Aron Nimzowitsch",
    },
    {
      segments: [
        {
          text: "Take take take and that should be winning.",
        },
      ],
      author: "Hikaru Nakamura",
    },
    {
      segments: [
        {
          text: "Strategy without tactics is the slowest route to victory. Tactics without strategy is the noise before defeat.",
        },
      ],
      author: "Sun Tzu",
    },
  ];

  const quote = quotes[Math.floor(Math.random() * quotes.length)];

  return (
    <>
      <Stack.Screen
        options={{
          headerLargeTitleEnabled: true,
          title: "Search",
          headerSearchBarOptions: {
            placeholder: "Search by name or FIDE ID",
            onSearchButtonPress: (e) => search(e.nativeEvent.text),
            onCancelButtonPress: () => setSearchResults(null),
            hideWhenScrolling: false,
          },
        }}
      />

      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ padding: 16, gap: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {!loading && searchResults === null && (
          <Text
            style={{
              color: colors.foreground,
              fontSize: 16,
              fontWeight: "700",
            }}
          >
            Search for a chess player to get info about them
          </Text>
        )}

        {!loading &&
          searchResults?.map((searchResult) => {
            const countryInfo = getCountryInfo(searchResult.federation);
            const isRated =
              searchResult.standard !== undefined ||
              searchResult.rapid !== undefined ||
              searchResult.blitz !== undefined;

            return (
              <View
                key={searchResult.id}
                style={{
                  gap: 16,
                  backgroundColor: colors.card,
                  padding: 16,
                  borderRadius: 16,
                }}
              >
                <View style={{ flexDirection: "row", gap: 16 }}>
                  {searchResult.photo !== undefined && (
                    <Image
                      source={{ uri: searchResult.photo.medium }}
                      style={{ width: 96, height: 96, borderRadius: 48 }}
                    />
                  )}

                  <View style={{ gap: 4 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        gap: 8,
                        alignItems: "center",
                      }}
                    >
                      {searchResult.title !== undefined && (
                        <View
                          style={{
                            backgroundColor: "#e00000",
                            padding: 4,
                            borderRadius: 4,
                          }}
                        >
                          <Text
                            style={{
                              color: colors.cardForeground,
                              fontWeight: "700",
                            }}
                          >
                            {searchResult.title}
                          </Text>
                        </View>
                      )}

                      <Text
                        style={{
                          color: colors.cardForeground,
                          fontSize: 18,
                          fontWeight: "700",
                        }}
                      >
                        {searchResult.name}
                      </Text>
                    </View>

                    {countryInfo !== null && (
                      <Text style={{ color: colors.foreground, fontSize: 16 }}>
                        {countryInfo.name}{" "}
                        {flagStringToEmoji(countryInfo.alpha2)}
                      </Text>
                    )}

                    {searchResult.year !== undefined && (
                      <Text style={{ color: colors.cardForeground }}>
                        Born in {searchResult.year}
                      </Text>
                    )}

                    <Text style={{ color: colors.cardForeground }}>
                      FIDE ID: {searchResult.id}
                    </Text>

                    {searchResult.inactive !== undefined &&
                      searchResult.inactive && (
                        <Text style={{ color: "#e00000" }}>Inactive</Text>
                      )}
                  </View>
                </View>

                {searchResult.photo?.credit !== undefined && (
                  <View>
                    <Text
                      style={{
                        color: colors.mutedForeground,
                        fontStyle: "italic",
                      }}
                    >
                      Photo credit:
                    </Text>

                    <Text
                      style={{
                        color: colors.mutedForeground,
                        fontStyle: "italic",
                      }}
                    >
                      {searchResult.photo.credit}
                    </Text>
                  </View>
                )}

                {isRated ? (
                  <View style={{ flexDirection: "row" }}>
                    {searchResult.standard !== undefined && (
                      <View
                        style={{
                          flex: 1,
                          aspectRatio: 1,
                          padding: 4,
                          maxWidth: "33.33%",
                        }}
                      >
                        <View
                          style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: colors.secondary,
                            borderRadius: 16,
                          }}
                        >
                          <MaterialCommunityIcons
                            name="chess-pawn"
                            size={32}
                            color={colors.primary}
                          />

                          <Text
                            style={{
                              color: colors.secondaryForeground,
                              fontWeight: "700",
                            }}
                          >
                            Standard
                          </Text>

                          <Text
                            style={{
                              color: colors.cardForeground,
                              fontSize: 18,
                              fontWeight: "700",
                            }}
                          >
                            {searchResult.standard}
                          </Text>
                        </View>
                      </View>
                    )}

                    {searchResult.rapid !== undefined && (
                      <View
                        style={{
                          flex: 1,
                          aspectRatio: 1,
                          padding: 4,
                          maxWidth: "33.33%",
                        }}
                      >
                        <View
                          style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: colors.secondary,
                            borderRadius: 16,
                          }}
                        >
                          <MaterialCommunityIcons
                            name="timer"
                            size={32}
                            color={colors.accentForeground}
                          />

                          <Text
                            style={{
                              color: colors.secondaryForeground,
                              fontWeight: "700",
                            }}
                          >
                            Rapid
                          </Text>

                          <Text
                            style={{
                              color: colors.cardForeground,
                              fontSize: 18,
                              fontWeight: "700",
                            }}
                          >
                            {searchResult.rapid}
                          </Text>
                        </View>
                      </View>
                    )}

                    {searchResult.blitz !== undefined && (
                      <View
                        style={{
                          flex: 1,
                          aspectRatio: 1,
                          padding: 4,
                          maxWidth: "33.33%",
                        }}
                      >
                        <View
                          style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: colors.secondary,
                            borderRadius: 16,
                          }}
                        >
                          <MaterialCommunityIcons
                            name="lightning-bolt"
                            size={32}
                            color="#ffee00"
                          />

                          <Text
                            style={{
                              color: colors.secondaryForeground,
                              fontWeight: "700",
                            }}
                          >
                            Blitz
                          </Text>

                          <Text
                            style={{
                              color: colors.cardForeground,
                              fontSize: 18,
                              fontWeight: "700",
                            }}
                          >
                            {searchResult.blitz}
                          </Text>
                        </View>
                      </View>
                    )}
                  </View>
                ) : (
                  <Text
                    style={{
                      color: colors.cardForeground,
                      fontSize: 18,
                      fontWeight: "700",
                    }}
                  >
                    Unrated
                  </Text>
                )}
              </View>
            );
          })}

        {!loading && searchResults !== null && searchResults.length === 0 && (
          <Text
            style={{
              color: colors.foreground,
              fontSize: 16,
              fontWeight: "700",
            }}
          >
            No results found
          </Text>
        )}

        {loading && (
          <Text
            style={{
              color: colors.foreground,
              fontSize: 16,
              fontWeight: "700",
            }}
          >
            Loading...
          </Text>
        )}

        {(searchResults === null || searchResults.length === 0) && (
          <View
            style={{
              borderLeftWidth: 4,
              borderLeftColor: colors.mutedForeground,
              paddingLeft: 16,
              gap: 4,
            }}
          >
            <Text
              style={{ color: colors.mutedForeground, fontStyle: "italic" }}
            >
              "
              {quote.segments.map((segment, i) => (
                <Text
                  key={i}
                  style={[
                    segment.highlight && {
                      color: colors.secondaryForeground,
                    },
                  ]}
                >
                  {segment.text}
                </Text>
              ))}
              "
            </Text>

            <Text style={{ color: colors.mutedForeground, fontSize: 12 }}>
              — {quote.author}
            </Text>
          </View>
        )}
      </ScrollView>
    </>
  );
}
