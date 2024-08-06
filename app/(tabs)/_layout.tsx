import { Tabs } from "expo-router";
import { Dimensions } from "react-native";
import { ThemeProvider, useTheme } from "@/components/ThemedContext";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";

const { width } = Dimensions.get("window");

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <ThemeProvider>
      <Tabs
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.headerBackground,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontSize: width * 0.045,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Breast Cancer Navigator",
            tabBarStyle: { display: "none" },
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={
                  focused ? "arrow-back-circle" : "arrow-back-circle-outline"
                }
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="complete"
          options={{
            title: "Navigator Completion",
            tabBarStyle: { backgroundColor: colors.tabBackground },
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={
                  focused
                    ? "checkmark-done-circle"
                    : "checkmark-done-circle-outline"
                }
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    </ThemeProvider>
  );
}
