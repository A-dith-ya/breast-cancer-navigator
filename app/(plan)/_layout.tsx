import { Tabs } from "expo-router";
import { Dimensions } from "react-native";
import { ThemeProvider, useTheme } from "@/components/ThemedContext";

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
            title: "Personalized Wellness Hub",
            tabBarStyle: { backgroundColor: colors.tabBackground },
            href: null, // Hide tab from navigation
          }}
        />
      </Tabs>
    </ThemeProvider>
  );
}
