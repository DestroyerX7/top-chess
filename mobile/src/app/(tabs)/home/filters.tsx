import { ScrollView, Pressable, StyleSheet, View } from "react-native";
import Ionicons from "@react-native-vector-icons/ionicons";
import Text from "@/components/Text";
import { spacings } from "@/constants/spacings";
import { colors } from "@/constants/colors";
import { SortOption, useFilterStore } from "@/hooks/useFilterStore";
import { borderRadius } from "@/constants/borders";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";

const filterOptions = [
  { value: "all", label: "All" },
  { value: "live", label: "Live" },
  { value: "rated-above-2700", label: "Rated Above 2700" },
  { value: "top-100", label: "Top 100" },
] as const;

const sortOptions: (
  | {
      title: string;
      default: "asc";
      asc: SortOption;
      desc: SortOption | null;
    }
  | {
      title: string;
      default: "desc";
      asc: SortOption | null;
      desc: SortOption;
    }
)[] = [
  {
    title: "World Rank",
    default: "asc",
    asc: "world-rank-ascending",
    desc: "world-rank-descending",
  },
  {
    title: "Rating Change",
    default: "desc",
    asc: "rating-change-ascending",
    desc: "rating-change-descending",
  },
  {
    title: "Ranking Change",
    default: "desc",
    asc: "ranking-change-ascending",
    desc: "ranking-change-descending",
  },
  {
    title: "Age",
    default: "asc",
    asc: "age-ascending",
    desc: "age-descending",
  },
  {
    title: "Country",
    default: "asc",
    asc: "country",
    desc: null,
  },
  {
    title: "Name",
    default: "asc",
    asc: "name",
    desc: null,
  },
];

export default function FiltersModal() {
  const { filterOption, setFilterOption, sortOption, setSortOption } =
    useFilterStore();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Text size="sm" style={styles.sectionTitle}>
        FILTER
      </Text>

      <View style={styles.card}>
        {filterOptions.map(({ value, label }, index) => (
          <Pressable
            key={value}
            onPress={() => setFilterOption(value)}
            style={[
              styles.row,
              index < filterOptions.length - 1 && styles.rowDivider,
            ]}
          >
            <Text size="md">{label}</Text>
            {filterOption === value && (
              <Ionicons name="checkmark" size={20} color={colors.primary} />
            )}
          </Pressable>
        ))}
      </View>

      <Text size="sm" style={styles.sectionTitle}>
        SORT
      </Text>

      <View style={styles.card}>
        {sortOptions.map((option, index) => (
          <Pressable
            key={option.title}
            onPress={() => {
              const freshPress =
                sortOption !== option.asc && sortOption !== option.desc;

              if (freshPress && option.default === "asc") {
                setSortOption(option.asc);
              } else if (freshPress && option.default === "desc") {
                setSortOption(option.desc);
              } else if (sortOption === option.asc && option.desc !== null) {
                setSortOption(option.desc);
              } else if (sortOption === option.desc && option.asc !== null) {
                setSortOption(option.asc);
              }
            }}
            style={[
              styles.row,
              index < sortOptions.length - 1 && styles.rowDivider,
            ]}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: spacings.md,
              }}
            >
              <Text size="md" style={{ color: colors.cardForeground }}>
                {option.title}
              </Text>

              {option.desc !== null && sortOption === option.asc && (
                <MaterialDesignIcons
                  name="sort-ascending"
                  size={16}
                  color={colors.mutedForeground}
                />
              )}

              {option.asc !== null && sortOption === option.desc && (
                <MaterialDesignIcons
                  name="sort-descending"
                  size={16}
                  color={colors.mutedForeground}
                />
              )}
            </View>

            {(sortOption === option.asc || sortOption === option.desc) && (
              <Ionicons name="checkmark" size={20} color={colors.primary} />
            )}
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: spacings.lg,
    gap: spacings.lg,
  },
  sectionTitle: {
    color: colors.mutedForeground,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacings.lg,
    minHeight: 48,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
});
