import { getTopChessPlayers } from "@/api/chessPlayers";
import { useQuery } from "@tanstack/react-query";
import { Stack, useLocalSearchParams } from "expo-router";
import { Image, View } from "react-native";

export default function ChessPlayer() {
  const { fideId } = useLocalSearchParams<{ fideId: string }>();
  const {
    data: chessPlayers,
    isPending,
    error,
  } = useQuery({
    queryKey: ["chessPlayers"],
    queryFn: getTopChessPlayers,
    staleTime: 1000 * 60 * 10,
  });

  if (chessPlayers === undefined) {
    return;
  }

  const [chessPlayer] = chessPlayers.filter((c) => c.fideId === Number(fideId));

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: chessPlayer.name,
          headerStyle: { backgroundColor: "#c4ff10" },
          headerBackButtonDisplayMode: "minimal",
        }}
      />

      <View style={{ padding: 16 }}>
        <Image
          source={{ uri: chessPlayer.imageUrl }}
          style={{ width: "100%", aspectRatio: 1, borderRadius: 16 }}
        />
      </View>
    </>
  );
}
