import axios from "axios";
import { useEffect, useState } from "react";
import {
  FlatList,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MyWidget from "./MyWidget";

export type ChessPlayer = {
  rank: string;
  name: string;
  fide_id: string;
  counrty: string;
  rating: string;
  imageUrl: string;
};

const cloudinaryCloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;

export default function Index() {
  const [chessPlayers, setChessPlayers] = useState<ChessPlayer[]>([]);

  useEffect(() => {
    const getChessPlayers = async () => {
      const response = await axios.get<
        {
          rank: string;
          name: string;
          fide_id: string;
          counrty: string;
          rating: string;
        }[]
      >("https://api.chesstools.org/fide/top_active/?limit=100&history=false");

      const widgetChessPlayers = response.data.map((chessPlayer) => {
        return {
          imageUrl: `https://res.cloudinary.com/${cloudinaryCloudName}/image/upload/top-chess-uploads/${chessPlayer.fide_id}.jpg`,
          ...chessPlayer,
        };
      });

      setChessPlayers(widgetChessPlayers);

      MyWidget.updateSnapshot({
        chessPlayers: widgetChessPlayers,
      });
    };

    getChessPlayers();
  }, []);

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <FlatList
        data={chessPlayers}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 8 }}
        renderItem={({ item: chessPlayer }) => {
          const firstName = chessPlayer.name.includes(",")
            ? chessPlayer.name.split(", ")[1]
            : chessPlayer.name.split(" ")[0];

          return (
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
                      {firstName}
                    </Text>
                  </View>
                </View>
              </ImageBackground>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101010",
  },
});
