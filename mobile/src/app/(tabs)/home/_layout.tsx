import { Stack } from "expo-router";
import { colors } from "@/constants/colors";

export default function _layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Home" }} />

      <Stack.Screen
        name="chess-player/[fideId]"
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: colors.primary },
          headerTitleStyle: { color: colors.primaryForeground },
          headerBackButtonDisplayMode: "minimal",
        }}
      />
    </Stack>
  );
}
