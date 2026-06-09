import { HStack, Image, Spacer, Text, VStack, ZStack } from "@expo/ui/swift-ui";
import {
  cornerRadius,
  font,
  frame,
  padding,
  resizable,
  shadow,
} from "@expo/ui/swift-ui/modifiers";
import { createWidget, type WidgetEnvironment } from "expo-widgets";

type WidgetChessPlayer = {
  name: string;
  rating: number;
  livePos: number;
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
                modifiers={[frame({ width: 64, height: 64 }), cornerRadius(8)]}
              >
                <Image
                  uiImage={chessPlayer.imageUrl}
                  modifiers={[resizable()]}
                />

                <VStack modifiers={[padding({ all: 8 })]}>
                  <Text
                    modifiers={[
                      font({ size: 12, weight: "bold" }),
                      frame({ maxWidth: Infinity, alignment: "leading" }),
                      shadow({ color: "#000000", radius: 2 }),
                    ]}
                  >
                    #{chessPlayer.livePos}
                  </Text>

                  <Spacer />

                  <Text
                    modifiers={[
                      font({ size: 12, weight: "bold" }),
                      frame({ maxWidth: Infinity, alignment: "leading" }),
                      shadow({ color: "#000000", radius: 2 }),
                    ]}
                  >
                    {chessPlayer.rating}
                  </Text>

                  <Text
                    modifiers={[
                      font({ size: 12, weight: "bold" }),
                      frame({ maxWidth: Infinity, alignment: "leading" }),
                      shadow({ color: "#000000", radius: 2 }),
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
