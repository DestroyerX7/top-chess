import { borderRadius } from "@/constants/borders";
import { colors } from "@/constants/colors";
import { useEffect } from "react";
import { ViewProps, StyleSheet } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

export default function Skeleton({ style, ...props }: ViewProps) {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.75, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[styles.skeletonBase, animatedStyle, style]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  skeletonBase: {
    backgroundColor: colors.secondary,
    borderRadius: borderRadius.sm,
  },
});
