import { Tabs, useRouter } from "expo-router";
import { Dimensions } from "react-native";
import { ThemeProvider, useTheme } from "@/components/ThemedContext";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { ThemedText } from "@/components/ThemedText";

const { width } = Dimensions.get("window");

export default function TabLayout() {
  const { colors } = useTheme();
  const router = useRouter();

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
          name="contents"
          options={{
            title: "Navigator Contents",
            tabBarStyle: { display: "none" },
            headerLeft: () => (
              <TabBarIcon
                name="chevron-back"
                color={colors.text}
                onPress={() => router.replace("/(info)/info")}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="index"
          options={{
            title: "Navigator",
            tabBarStyle: { display: "none" },
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={
                  focused ? "arrow-back-circle" : "arrow-back-circle-outline"
                }
                color={color}
              />
            ),
            headerLeft: () => (
              <>
                <TabBarIcon
                  name="chevron-back"
                  color={colors.text}
                  onPress={() => router.replace("/(tabs)/contents")}
                />
                <ThemedText>Contents</ThemedText>
              </>
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
            headerLeft: () => (
              <>
                <TabBarIcon
                  name="chevron-back"
                  color={colors.text}
                  onPress={() => router.replace("/(info)")}
                />
                <ThemedText>Home</ThemedText>
              </>
            ),
          }}
        />
      </Tabs>
    </ThemeProvider>
  );
}
