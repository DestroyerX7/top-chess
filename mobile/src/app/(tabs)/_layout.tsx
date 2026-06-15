import { colors } from "@/constants/colors";
import { NativeTabs } from "expo-router/unstable-native-tabs";
import { DynamicColorIOS } from "react-native";

export default function RootLayout() {
  return (
    <NativeTabs
      backgroundColor="transparent"
      labelStyle={{
        // For the text color
        color: DynamicColorIOS({
          dark: colors.primary,
          light: "black",
        }),
      }}
      // For the selected icon color
      tintColor={DynamicColorIOS({
        dark: colors.primary,
        light: "black",
      })}
    >
      <NativeTabs.Trigger name="home">
        <NativeTabs.Trigger.Icon
          sf={{ default: "house", selected: "house.fill" }}
          md={{ default: "home", selected: "home_filled" }}
        />
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="live">
        <NativeTabs.Trigger.Icon
          sf={{
            default: "dot.radiowaves.left.and.right",
            selected: "dot.radiowaves.left.and.right",
          }}
          md={{ default: "podcasts", selected: "podcasts" }}
        />
        <NativeTabs.Trigger.Label>Live</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
