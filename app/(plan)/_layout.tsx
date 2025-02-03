import { Tabs, useRouter } from "expo-router";
import { Dimensions } from "react-native";
import { useEffect } from "react";
import { ThemeProvider, useTheme } from "@/components/ThemedContext";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";

const { width } = Dimensions.get("window");

export default function TabLayout() {
  const { colors } = useTheme();
  const router = useRouter();
  const planData = null;

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
        <Tabs.Screen
          name="meal-plan"
          options={{
            title: "Meal Plan",
            tabBarStyle: { backgroundColor: colors.tabBackground },
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "nutrition" : "nutrition-outline"}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="fitness-plan"
          options={{
            title: "Fitness Plan",
            tabBarStyle: { backgroundColor: colors.tabBackground },
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "fitness" : "fitness-outline"}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="wellbeing-plan"
          options={{
            title: "Wellbeing Plan",
            tabBarStyle: { backgroundColor: colors.tabBackground },
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "happy" : "happy-outline"}
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    </ThemeProvider>
  );
}
