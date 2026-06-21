import { ScrollView, StyleSheet, View } from "react-native";
import { router, Stack, useFocusEffect } from "expo-router";
import { colors } from "@/constants/colors";
import { useCallback, useState } from "react";
import {
  ChessPlayer,
  searchChessPlayer,
  LichessSearchResult,
} from "@/api/chess";
import { flagStringToEmoji, getCountryInfo } from "@/utils/flags";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Image } from "expo-image";
import ChessPlayerCard from "@/components/ChessPlayerCard";
import { useChessPlayers } from "@/hooks/chess";
import { spacings } from "@/constants/spacings";
import Text from "@/components/Text";
import { borderRadius } from "@/constants/borders";

type Segment = {
  text: string;
  highlighted?: boolean;
};

type Quote = {
  segments: Segment[];
  author: string;
};

const quotes: Quote[] = [
  {
    segments: [
      {
        text: "People who want to improve should take their defeats as lessons, and endeavor to learn what to avoid in the future. You must also have the courage of your convictions. ",
      },
      { text: "If you think your move is good, make it.", highlighted: true },
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
        highlighted: true,
      },
      {
        text: "is knowing what to do when there is something to do. ",
      },
      {
        text: "Strategy ",
        highlighted: true,
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
  {
    segments: [
      {
        text: "The chess-board is the world; the pieces are the phenomena of the universe; the rules of the game are what we call the laws of Nature. The player on the other side is hidden from us. We know that his play is always fair, and patient. But also we know, to our cost, that he never overlooks a mistake, or makes the smallest allowance for ignorance.",
      },
    ],
    author: "Thomas Henry Huxley",
  },
  {
    segments: [
      {
        text: "Chess is life.",
      },
    ],
    author: "Bobby Fischer",
  },
  {
    segments: [
      {
        text: "Every chess master was once a beginner.",
      },
    ],
    author: "Irving Chernev",
  },
  {
    segments: [
      {
        text: "Chess is the gymnasium of the mind.",
      },
    ],
    author: "Blaise Pascal",
  },
  {
    segments: [
      {
        text: "A bad plan is better than no plan at all.",
      },
    ],
    author: "Frank Marshall",
  },
  {
    segments: [
      {
        text: "Pawns are the soul of chess.",
      },
    ],
    author: "Francois-Andre Danican Philidor",
  },
  {
    segments: [
      { text: "Play the opening like a book, " },
      { text: "the middlegame like a magician, ", highlighted: true },
      { text: "and the endgame like a machine." },
    ],
    author: "Rudolf Spielmann",
  },
  {
    segments: [
      {
        text: "In life, as in chess, forethought wins.",
      },
    ],
    author: "Charles Buxton",
  },
  {
    segments: [
      {
        text: "Chess holds its master in its own bonds, shackling the mind and brain so that the inner freedom of the very strongest must suffer.",
      },
    ],
    author: "Albert Einstein",
  },
  {
    segments: [
      {
        text: "It is not a move, even the best move, that you must seek, but a realizable plan.",
      },
    ],
    author: "Eugene Znosko-Borovsky",
  },
  {
    segments: [
      {
        text: "I don't believe in psychology. I believe in good moves.",
      },
    ],
    author: "Bobby Fischer",
  },
];

export default function Search() {
  const [searchResults, setSearchResults] = useState<
    LichessSearchResult[] | null
  >(null);
  const [loading, setLoading] = useState(false);

  const [quote, setQuote] = useState<Quote | null>(null);
  const [selectedChessPlayers, setSelectedChessPlayers] = useState<
    ChessPlayer[]
  >([]);

  const { data: chessPlayers } = useChessPlayers();

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
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

      const randomChessPlayers =
        chessPlayers !== undefined
          ? [...chessPlayers].sort(() => Math.random() - 0.5).slice(0, 4)
          : [];

      setQuote(randomQuote);
      setSelectedChessPlayers(randomChessPlayers);
    }, [chessPlayers]),
  );

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
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {!loading && searchResults === null && (
          <Text size="lg" style={styles.emptySearchResultsText}>
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
              <View key={searchResult.id} style={styles.searchResultCard}>
                <View style={styles.searchResultCardHeader}>
                  {searchResult.photo !== undefined && (
                    <Image
                      source={{ uri: searchResult.photo.medium }}
                      style={styles.searchResultImage}
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
                        <View style={styles.searchResultFideTitleContainer}>
                          <Text style={styles.searchResultFideTitleText}>
                            {searchResult.title}
                          </Text>
                        </View>
                      )}

                      <Text size="xl" style={styles.searchResultName}>
                        {searchResult.name}
                      </Text>
                    </View>

                    {countryInfo !== null && (
                      <Text size="lg" style={styles.searchResultCountryText}>
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
                    <Text style={styles.photoCreditText}>Photo credit:</Text>

                    <Text style={styles.photoCreditText}>
                      {searchResult.photo.credit}
                    </Text>
                  </View>
                )}

                {isRated ? (
                  <View style={{ flexDirection: "row" }}>
                    {searchResult.standard !== undefined && (
                      <View style={styles.ratingCardContainer}>
                        <View style={styles.ratingCard}>
                          <MaterialCommunityIcons
                            name="chess-pawn"
                            size={32}
                            color={colors.primary}
                          />

                          <Text style={styles.ratingFormatText}>Standard</Text>

                          <Text size="xl" style={styles.ratingText}>
                            {searchResult.standard}
                          </Text>
                        </View>
                      </View>
                    )}

                    {searchResult.rapid !== undefined && (
                      <View style={styles.ratingCardContainer}>
                        <View style={styles.ratingCard}>
                          <MaterialCommunityIcons
                            name="timer"
                            size={32}
                            color={colors.accentForeground}
                          />

                          <Text style={styles.ratingFormatText}>Rapid</Text>

                          <Text size="xl" style={styles.ratingText}>
                            {searchResult.rapid}
                          </Text>
                        </View>
                      </View>
                    )}

                    {searchResult.blitz !== undefined && (
                      <View style={styles.ratingCardContainer}>
                        <View style={styles.ratingCard}>
                          <MaterialCommunityIcons
                            name="lightning-bolt"
                            size={32}
                            color="#ffee00"
                          />

                          <Text style={styles.ratingFormatText}>Blitz</Text>

                          <Text size="xl" style={styles.ratingText}>
                            {searchResult.blitz}
                          </Text>
                        </View>
                      </View>
                    )}
                  </View>
                ) : (
                  <Text size="xl" style={styles.ratingText}>
                    Unrated
                  </Text>
                )}
              </View>
            );
          })}

        {!loading && searchResults !== null && searchResults.length === 0 && (
          <Text size="lg" style={styles.emptySearchResultsText}>
            No results found
          </Text>
        )}

        {loading && (
          <Text size="lg" style={styles.emptySearchResultsText}>
            Loading...
          </Text>
        )}

        {(searchResults === null || searchResults.length === 0) && (
          <View style={{ gap: 16 }}>
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {selectedChessPlayers.map((chessPlayer) => (
                <ChessPlayerCard
                  key={chessPlayer.fideId}
                  style={styles.chessPlayerCardContainer}
                  chessPlayer={chessPlayer}
                  onPress={(fideId: number) =>
                    router.push({
                      pathname: "/home/chess-player/[fideId]",
                      params: { fideId },
                    })
                  }
                />
              ))}
            </View>

            {quote !== null && (
              <View style={styles.quoteContainer}>
                <Text style={styles.quoteSegmentText}>
                  "
                  {quote.segments.map((segment, i) => (
                    <Text
                      key={i}
                      style={{
                        color: segment.highlighted
                          ? colors.secondaryForeground
                          : colors.mutedForeground,
                      }}
                    >
                      {segment.text}
                    </Text>
                  ))}
                  "
                </Text>

                <Text size="sm" style={styles.quoteAuthorText}>
                  — {quote.author}
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { padding: spacings.lg, gap: spacings.lg },
  emptySearchResultsText: {
    color: colors.foreground,
    fontWeight: "700",
  },
  searchResultCard: {
    gap: spacings.lg,
    backgroundColor: colors.card,
    padding: spacings.lg,
    borderRadius: borderRadius.lg,
  },
  searchResultCardHeader: { flexDirection: "row", gap: spacings.lg },
  searchResultImage: { width: 96, height: 96, borderRadius: 48 },
  searchResultFideTitleContainer: {
    backgroundColor: "#e00000",
    padding: spacings.sm,
    borderRadius: borderRadius.xs,
  },
  searchResultFideTitleText: {
    color: colors.cardForeground,
    fontWeight: "700",
  },
  searchResultName: {
    color: colors.cardForeground,
    fontWeight: "700",
  },
  searchResultCountryText: {
    color: colors.foreground,
  },
  photoCreditText: {
    color: colors.mutedForeground,
    fontStyle: "italic",
  },
  ratingCardContainer: {
    flex: 1,
    aspectRatio: 1,
    padding: spacings.sm,
    maxWidth: "33.33%",
  },
  ratingCard: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.secondary,
    borderRadius: borderRadius.lg,
  },
  ratingFormatText: {
    color: colors.secondaryForeground,
    fontWeight: "700",
  },
  ratingText: {
    color: colors.cardForeground,
    fontWeight: "700",
  },
  chessPlayerCardContainer: {
    aspectRatio: 1,
    padding: spacings.md,
    width: "50%",
  },
  quoteContainer: {
    borderLeftWidth: 4,
    borderLeftColor: colors.mutedForeground,
    paddingLeft: spacings.lg,
    gap: spacings.sm,
  },
  quoteSegmentText: { color: colors.mutedForeground, fontStyle: "italic" },
  quoteAuthorText: {
    color: colors.mutedForeground,
  },
});
