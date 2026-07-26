import { HStack, Image, Spacer, Text, VStack } from "@expo/ui/swift-ui";
import {
  aspectRatio,
  clipShape,
  containerBackground,
  font,
  foregroundStyle,
  frame,
  lineLimit,
  resizable,
} from "@expo/ui/swift-ui/modifiers";
import { createWidget, type WidgetEnvironment } from "expo-widgets";

type WidgetChessPlayer = {
  name: string;
  countryName: string;
  standardRating: number;
  standardRank: number;
  standardMonthRatingChange: number;
  imageUrl: string;
};

type Props = {
  widgetChessPlayers: WidgetChessPlayer[];
};

const TopChessPlayers = (
  { widgetChessPlayers }: Props,
  environment: WidgetEnvironment,
) => {
  "widget";

  const colors = {
    background: "#000000",
    foreground: "#ffffff",
    primary: "#c4ff10",
    primaryForeground: "#000000",
    secondary: "#282828",
    secondaryForeground: "#e0e0e0",
    muted: "#202020",
    mutedForeground: "#888888",
    accent: "#405500",
    accentForeground: "#e4ffa0",
    card: "#101010",
    cardForeground: "#ffffff",
    border: "#404040",
    input: "#404040",
    destructive: "#ff2020",
    destructiveForeground: "#ffffff",
  } as const;

  const fontSizes = {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    "2xl": 20,
    "3xl": 22,
    "4xl": 24,
    "5xl": 26,
    "6xl": 28,
    "7xl": 30,
    "8xl": 32,
  } as const;

  if (environment.widgetFamily === "systemSmall") {
    const widgetChessPlayer = widgetChessPlayers[0];

    return (
      <VStack
        alignment="leading"
        modifiers={[containerBackground(colors.background, "widget")]}
        spacing={8}
      >
        <HStack spacing={8}>
          <Image systemName="crown.fill" color="#ef9f27" size={fontSizes.md} />

          <Spacer />

          <Text
            modifiers={[
              foregroundStyle(colors.mutedForeground),
              font({ size: fontSizes.sm }),
            ]}
          >
            #1
          </Text>
        </HStack>

        <VStack alignment="leading" spacing={8}>
          <HStack spacing={8} modifiers={[frame({ alignment: "leading" })]}>
            <Image
              uiImage={widgetChessPlayer.imageUrl}
              modifiers={[
                resizable(),
                aspectRatio({ contentMode: "fill" }),
                frame({ width: 48, height: 48 }),
                clipShape("circle"),
              ]}
            />

            <VStack alignment="leading">
              <Text
                modifiers={[
                  foregroundStyle(colors.foreground),
                  font({ size: fontSizes.md, weight: "medium" }),
                ]}
              >
                {widgetChessPlayer.name}
              </Text>

              <Text
                modifiers={[
                  foregroundStyle(colors.mutedForeground),
                  font({ size: fontSizes.sm }),
                  lineLimit(1),
                ]}
              >
                {widgetChessPlayer.countryName}
              </Text>
            </VStack>
          </HStack>

          <Spacer />

          <VStack alignment="leading">
            <HStack spacing={8}>
              <Text
                modifiers={[
                  foregroundStyle(colors.foreground),
                  font({ size: fontSizes["4xl"], weight: "bold" }),
                ]}
              >
                {widgetChessPlayer.standardRating}
              </Text>

              {widgetChessPlayer.standardMonthRatingChange !== 0 && (
                <Text
                  modifiers={[
                    foregroundStyle(
                      widgetChessPlayer.standardMonthRatingChange > 0
                        ? colors.primary
                        : colors.destructive,
                    ),
                    font({ size: fontSizes.md }),
                  ]}
                >
                  {widgetChessPlayer.standardMonthRatingChange > 0
                    ? `+${widgetChessPlayer.standardMonthRatingChange}`
                    : widgetChessPlayer.standardMonthRatingChange}
                </Text>
              )}
            </HStack>

            <Text
              modifiers={[
                foregroundStyle(colors.mutedForeground),
                font({ size: fontSizes.xs }),
              ]}
            >
              RATING
            </Text>
          </VStack>
        </VStack>
      </VStack>
    );
  } else if (environment.widgetFamily === "systemMedium") {
    return (
      <VStack
        modifiers={[containerBackground(colors.background, "widget")]}
        spacing={8}
      >
        <HStack>
          <Text
            modifiers={[
              foregroundStyle(colors.foreground),
              font({ size: fontSizes.md, weight: "medium" }),
            ]}
          >
            Top chess players
          </Text>

          <Spacer />

          <Text
            modifiers={[
              foregroundStyle(colors.mutedForeground),
              font({ size: fontSizes.sm }),
            ]}
          >
            {new Date().toLocaleString(undefined, {
              day: "numeric",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </HStack>

        <VStack>
          {widgetChessPlayers.slice(0, 3).map((c) => (
            <HStack
              key={c.standardRank}
              modifiers={[frame({ maxHeight: Infinity })]}
              spacing={8}
            >
              <Text
                modifiers={[
                  frame({ width: 16 }),
                  foregroundStyle(
                    c.standardRank === 1 ? "#ef9f27" : colors.mutedForeground,
                  ),
                  font({ size: fontSizes.md }),
                ]}
              >
                {c.standardRank}
              </Text>

              <Image
                uiImage={c.imageUrl}
                modifiers={[
                  resizable(),
                  aspectRatio({ contentMode: "fill" }),
                  frame({ width: 32, height: 32 }),
                  clipShape("circle"),
                ]}
              />

              <VStack alignment="leading">
                <Text
                  modifiers={[
                    foregroundStyle(colors.foreground),
                    font({ size: fontSizes.md }),
                  ]}
                >
                  {c.name}
                </Text>

                <Text
                  modifiers={[
                    foregroundStyle(colors.mutedForeground),
                    font({ size: fontSizes.sm }),
                  ]}
                >
                  {c.countryName}
                </Text>
              </VStack>

              <Spacer />

              <Text
                modifiers={[
                  foregroundStyle(
                    c.standardMonthRatingChange > 0
                      ? colors.primary
                      : c.standardMonthRatingChange < 0
                        ? colors.destructive
                        : colors.mutedForeground,
                  ),
                  font({ size: fontSizes.sm }),
                ]}
              >
                {c.standardMonthRatingChange > 0
                  ? `+${c.standardMonthRatingChange}`
                  : c.standardMonthRatingChange < 0
                    ? c.standardMonthRatingChange
                    : "—"}
              </Text>

              <Text
                modifiers={[
                  foregroundStyle(colors.foreground),
                  font({ size: fontSizes.md, weight: "medium" }),
                ]}
              >
                {c.standardRating}
              </Text>
            </HStack>
          ))}
        </VStack>
      </VStack>
    );
  }

  return (
    <VStack
      modifiers={[containerBackground(colors.background, "widget")]}
      spacing={8}
    >
      <HStack>
        <Text
          modifiers={[
            foregroundStyle(colors.foreground),
            font({ size: fontSizes.md, weight: "medium" }),
          ]}
        >
          Top chess players
        </Text>

        <Spacer />

        <Text
          modifiers={[
            foregroundStyle(colors.mutedForeground),
            font({ size: fontSizes.sm }),
          ]}
        >
          {new Date().toLocaleString(undefined, {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </HStack>

      <VStack>
        {widgetChessPlayers.slice(0, 8).map((c) => (
          <HStack
            key={c.standardRank}
            modifiers={[frame({ maxHeight: Infinity })]}
            spacing={8}
          >
            <Text
              modifiers={[
                frame({ width: 16 }),
                foregroundStyle(
                  c.standardRank === 1 ? "#ef9f27" : colors.mutedForeground,
                ),
                font({ size: fontSizes.md }),
              ]}
            >
              {c.standardRank}
            </Text>

            <Image
              uiImage={c.imageUrl}
              modifiers={[
                resizable(),
                aspectRatio({ contentMode: "fill" }),
                frame({ width: 32, height: 32 }),
                clipShape("circle"),
              ]}
            />

            <VStack alignment="leading">
              <Text
                modifiers={[
                  foregroundStyle(colors.foreground),
                  font({ size: fontSizes.md }),
                ]}
              >
                {c.name}
              </Text>

              <Text
                modifiers={[
                  foregroundStyle(colors.mutedForeground),
                  font({ size: fontSizes.sm }),
                ]}
              >
                {c.countryName}
              </Text>
            </VStack>

            <Spacer />

            <Text
              modifiers={[
                foregroundStyle(
                  c.standardMonthRatingChange > 0
                    ? colors.primary
                    : c.standardMonthRatingChange < 0
                      ? colors.destructive
                      : colors.mutedForeground,
                ),
                font({ size: fontSizes.sm }),
              ]}
            >
              {c.standardMonthRatingChange > 0
                ? `+${c.standardMonthRatingChange}`
                : c.standardMonthRatingChange < 0
                  ? c.standardMonthRatingChange
                  : "—"}
            </Text>

            <Text
              modifiers={[
                foregroundStyle(colors.foreground),
                font({ size: fontSizes.md, weight: "medium" }),
              ]}
            >
              {c.standardRating}
            </Text>
          </HStack>
        ))}
      </VStack>
    </VStack>
  );
};

export default createWidget("TopChessPlayers", TopChessPlayers);
