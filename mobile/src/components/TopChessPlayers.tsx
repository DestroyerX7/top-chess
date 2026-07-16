import { HStack, Image, Spacer, Text, VStack, ZStack } from "@expo/ui/swift-ui";
import {
  aspectRatio,
  cornerRadius,
  font,
  foregroundStyle,
  frame,
  padding,
  resizable,
  shadow,
} from "@expo/ui/swift-ui/modifiers";
import { createWidget, type WidgetEnvironment } from "expo-widgets";

type WidgetChessPlayer = {
  name: string;
  standardRating: number;
  standardRank: number;
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
  const rows = environment.widgetFamily === "systemLarge" ? 5 : 2;
  const cols = environment.widgetFamily === "systemSmall" ? 2 : 5;
  const width = 64;
  const height = 64;

  const textColor = "#ffffff";
  const shadowColor = "#000000";

  return (
    <VStack spacing={8}>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <HStack spacing={8} key={rowIndex}>
          {Array.from({ length: cols }).map((_, colIndex) => {
            const chessPlayerIndex = rowIndex * cols + colIndex;
            const chessPlayer = widgetChessPlayers[chessPlayerIndex];
            const firstName = chessPlayer.name.includes(",")
              ? chessPlayer.name.split(", ")[1]
              : chessPlayer.name.split(" ")[0];

            return (
              <ZStack
                key={rowIndex * rows + colIndex}
                modifiers={[frame({ width, height }), cornerRadius(8)]}
              >
                <Image
                  uiImage={chessPlayer.imageUrl}
                  modifiers={[
                    resizable(),
                    aspectRatio({ contentMode: "fill" }),
                    frame({ width, height }),
                  ]}
                />

                <VStack modifiers={[padding({ all: 8 })]}>
                  <Text
                    modifiers={[
                      font({ size: 12, weight: "bold" }),
                      frame({ maxWidth: Infinity, alignment: "leading" }),
                      shadow({ color: shadowColor, radius: 2 }),
                      foregroundStyle(textColor),
                    ]}
                  >
                    #{chessPlayer.standardRank}
                  </Text>

                  <Spacer />

                  <Text
                    modifiers={[
                      font({ size: 12, weight: "bold" }),
                      frame({ maxWidth: Infinity, alignment: "leading" }),
                      shadow({ color: shadowColor, radius: 2 }),
                      foregroundStyle(textColor),
                    ]}
                  >
                    {chessPlayer.standardRating}
                  </Text>

                  <Text
                    modifiers={[
                      font({ size: 12, weight: "bold" }),
                      frame({ maxWidth: Infinity, alignment: "leading" }),
                      shadow({ color: shadowColor, radius: 2 }),
                      foregroundStyle(textColor),
                    ]}
                  >
                    {firstName}
                  </Text>
                </VStack>
              </ZStack>
            );
          })}
        </HStack>
      ))}
    </VStack>
  );
};

export default createWidget("TopChessPlayers", TopChessPlayers);
