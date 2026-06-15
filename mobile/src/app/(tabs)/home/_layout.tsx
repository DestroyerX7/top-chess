import { Stack } from "expo-router";

export default function _layout() {
  return (
    <Stack>
      <Stack.Screen name="index" />

      <Stack.Screen name="chess-player/[fideId]" />
    </Stack>
  );
}
