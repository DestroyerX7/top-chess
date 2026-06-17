import { colors } from "@/constants/colors";
import { NativeTabs } from "expo-router/unstable-native-tabs";
import { DynamicColorIOS } from "react-native";

export default function TabsLayout() {
  return (
    <NativeTabs
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

      <NativeTabs.Trigger name="search">
        <NativeTabs.Trigger.Icon
          sf={{
            default: "magnifyingglass",
            selected: "magnifyingglass",
          }}
          md={{
            default: "magnification_large",
            selected: "magnification_large",
          }}
        />
        <NativeTabs.Trigger.Label>Search</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="events">
        <NativeTabs.Trigger.Icon
          sf={{
            default: "calendar",
            selected: "calendar",
          }}
          md={{ default: "event", selected: "event" }}
        />
        <NativeTabs.Trigger.Label>Events</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
