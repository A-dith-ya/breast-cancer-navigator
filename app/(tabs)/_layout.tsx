import { Tabs } from "expo-router";
import { ThemeProvider, useTheme } from "../../components/ThemedContext";

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <ThemeProvider>
      <Tabs>
        <Tabs.Screen
          name="index"
          options={{
            title: "Breast Cancer Navigator",
            headerStyle: {
              backgroundColor: colors.background,
            },
            headerTintColor: colors.text,
            headerTitleStyle: {
              fontSize: 16,
            },
            tabBarStyle: { display: "none" },
          }}
        />
      </Tabs>
    </ThemeProvider>
  );
}
