import { Tabs } from "expo-router";
import { ThemeProvider, useTheme } from "@/components/ThemedContext";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";

export default function InfoLayout() {
  const { colors } = useTheme();

  return (
    <ThemeProvider>
      <Tabs
        screenOptions={{
          tabBarStyle: { backgroundColor: colors.background },
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Welcome",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "home" : "home-outline"}
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    </ThemeProvider>
  );
}
