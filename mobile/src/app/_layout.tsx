import { colors } from "@/constants/colors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
}
