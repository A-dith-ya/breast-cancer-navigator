import { Stack } from "expo-router";
import { ThemeProvider } from "@/components/ThemedContext";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack>
        <Stack.Screen name="(info)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(plan)" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}
