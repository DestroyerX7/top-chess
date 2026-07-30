import { colors } from "@/constants/colors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DarkTheme, Stack, ThemeProvider } from "expo-router";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <ThemeProvider value={DarkTheme}>
      <QueryClientProvider client={queryClient}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
          }}
        >
          <Stack.Screen name="(tabs)" />
        </Stack>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
