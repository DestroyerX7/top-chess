import { getTopChessPlayers } from "@/api/chessPlayers";
import TopChessPlayers from "@/components/TopChessPlayers";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import {
  FlatList,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const { data: chessPlayers } = useQuery({
    queryKey: ["chessPlayers"],
    queryFn: getTopChessPlayers,
    staleTime: 1000 * 60 * 10,
  });

  useEffect(() => {
    if (chessPlayers !== undefined) {
      TopChessPlayers.updateSnapshot({ chessPlayers });
    }
  }, [chessPlayers]);

  if (chessPlayers === undefined) {
    return;
  }

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <FlatList
        data={chessPlayers}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 8 }}
        renderItem={({ item: chessPlayer }) => (
          <View style={{ padding: 8, width: "50%", aspectRatio: 1 }}>
            <ImageBackground
              source={{
                uri: chessPlayer.imageUrl,
              }}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 16,
                overflow: "hidden",
              }}
              key={chessPlayer.fide_id}
            >
              <View
                style={{
                  borderRadius: 16,
                  padding: 8,
                  justifyContent: "space-between",
                  flex: 1,
                }}
              >
                <Text style={{ color: "white", fontWeight: "700" }}>
                  #{chessPlayer.rank}
                </Text>

                <View
                  style={{
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ color: "white", fontWeight: "700" }}>
                    {chessPlayer.rating}
                  </Text>
                  <Text style={{ color: "white", fontWeight: "700" }}>
                    {chessPlayer.name}
                  </Text>
                </View>
              </View>
            </ImageBackground>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
