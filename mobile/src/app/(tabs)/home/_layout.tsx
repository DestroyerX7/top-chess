import { router, Stack } from "expo-router";
import { Pressable, useColorScheme } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { colors } from "@/constants/colors";

export default function HomeLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack>
      <Stack.Screen name="index" />

      <Stack.Screen name="chess-player/[fideId]" />

      <Stack.Screen
        name="filters"
        options={{
          title: "Filter & Sort",
          presentation: "formSheet",
          sheetAllowedDetents: [0.5, 1],
          sheetGrabberVisible: true,
          sheetLargestUndimmedDetentIndex: 1,
          headerTitleStyle: {
            color: colorScheme === "dark" ? colors.foreground : "black",
          },
          headerRight: () => (
            <Pressable onPress={() => router.back()} hitSlop={8}>
              <Ionicons
                name="close"
                size={24}
                color={colorScheme === "dark" ? colors.foreground : "black"}
              />
            </Pressable>
          ),
        }}
      />
    </Stack>
  );
}
