import { colors } from "@/constants/colors";
import { fontSizes, lineHeights } from "@/constants/fonts";
import {
  Text as RNText,
  TextProps as RNTextProps,
  TextStyle,
} from "react-native";

type Props = RNTextProps & {
  size?: keyof typeof fontSizes;
  noLineHeight?: boolean;
};

export default function Text({
  size = "md",
  noLineHeight,
  style,
  ...rest
}: Props) {
  const computedStyle: TextStyle = {
    fontSize: fontSizes[size],
    ...(noLineHeight ? {} : { lineHeight: lineHeights[size] }),
    color: colors.foreground,
  };

  return <RNText style={[computedStyle, style]} {...rest} />;
}
