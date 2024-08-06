import { router } from "expo-router";
import { StyleSheet, Dimensions } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedButton } from "@/components/ThemedButton";

const { width } = Dimensions.get("window");

export default function InfoScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Instructions</ThemedText>
      <ThemedText type="section">
        "Tap the 'Info' button to proceed to the information screen. The web
        content may take some time to load. Once loaded, you can navigate
        through the information and click 'Learn More' for additional details."
      </ThemedText>
      <ThemedButton
        text="Start Navigator"
        type="defaultSemiBold"
        onPress={() => router.push("/(tabs)/")}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: width * 0.05,
  },
});
