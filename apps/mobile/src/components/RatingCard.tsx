import { StyleSheet, View, ViewProps } from "react-native";
import { colors } from "@/constants/colors";
import { spacings } from "@/constants/spacings";
import { borderRadius } from "@/constants/borders";
import Text from "@/components/Text";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";

type Props = {
  format: "standard" | "rapid" | "blitz";
  rating?: number | null;
  inactive?: boolean;
} & ViewProps;

export default function RatingCard({
  format,
  rating,
  inactive = false,
  style,
  ...props
}: Props) {
  return (
    <View style={[styles.ratingCard, style]} {...props}>
      {format === "standard" ? (
        <MaterialDesignIcons
          name="chess-pawn"
          size={32}
          color={colors.primary}
        />
      ) : format === "rapid" ? (
        <MaterialDesignIcons
          name="timer"
          size={32}
          color={colors.accentForeground}
        />
      ) : (
        <MaterialDesignIcons name="lightning-bolt" size={32} color="#ffee00" />
      )}

      <Text size="md" style={{ color: colors.mutedForeground }}>
        {format[0].toUpperCase() + format.slice(1)}
      </Text>

      <Text
        size="2xl"
        style={{
          fontWeight: "700",
          color:
            rating === null || rating === undefined
              ? colors.mutedForeground
              : inactive
                ? colors.inactive
                : colors.foreground,
        }}
      >
        {rating ?? "Unrated"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  ratingCard: {
    backgroundColor: colors.muted,
    padding: spacings.lg,
    alignItems: "center",
    borderRadius: borderRadius.md,
  },
});
