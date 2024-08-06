import { Tabs } from "expo-router";
import { ThemeProvider, useTheme } from "@/components/ThemedContext";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <ThemeProvider>
      <Tabs
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontSize: 16,
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
