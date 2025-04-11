import { Tabs, useRouter } from "expo-router";
import { useEffect } from "react";
import { ThemeProvider, useTheme } from "@/components/ThemedContext";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";

import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "@/config";
import logger from "@/utils/logger";

export default function TabLayout() {
  const { colors } = useTheme();
  const router = useRouter();

  useEffect(() => {
    const getPlanData = async () => {
      const storedData = await AsyncStorage.getItem(config.RECOMMENDATION_KEY);

      if (!storedData) {
        logger.log("No plan data found, redirecting to settings");
        router.replace("/(plan)/settings");
      }
    };

    getPlanData();
  }, [router]);

  return (
    <ThemeProvider>
      <Tabs
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.headerBackground,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontSize: 18,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Personalized Wellness Hub",
            tabBarStyle: { backgroundColor: colors.tabBackground },
            href: null, // Hide tab from navigation
            headerLeft: () => (
              <TabBarIcon
                name="chevron-back"
                color={colors.text}
                onPress={() => router.replace("/(info)")}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            tabBarStyle: { display: "none" },
            href: null,
            headerLeft: () => (
              <TabBarIcon
                name="chevron-back"
                color={colors.text}
                onPress={() => router.replace("/(info)")}
              />
            ),
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
            headerLeft: () => (
              <TabBarIcon
                name="chevron-back"
                color={colors.text}
                onPress={() => router.replace("/(plan)")}
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
            headerLeft: () => (
              <TabBarIcon
                name="chevron-back"
                color={colors.text}
                onPress={() => router.replace("/(plan)")}
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
            headerLeft: () => (
              <TabBarIcon
                name="chevron-back"
                color={colors.text}
                onPress={() => router.replace("/(plan)")}
              />
            ),
          }}
        />
      </Tabs>
    </ThemeProvider>
  );
}
