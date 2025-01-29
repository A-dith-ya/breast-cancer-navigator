import { Tabs, useRouter } from "expo-router";
import { Dimensions } from "react-native";
import { useEffect } from "react";
import { ThemeProvider, useTheme } from "@/components/ThemedContext";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";

const { width } = Dimensions.get("window");

export default function TabLayout() {
  const { colors } = useTheme();
  const router = useRouter();
  const planData = 1;

  useEffect(() => {
    if (planData === null) {
      router.replace("/(plan)/settings");
    }
  }, [planData, router]);

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
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            tabBarStyle: { display: "none" },
            href: null,
          }}
        />
      </Tabs>
    </ThemeProvider>
  );
}
