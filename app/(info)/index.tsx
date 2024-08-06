import { router } from "expo-router";
import { StyleSheet, Dimensions } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedButton } from "@/components/ThemedButton";

const { width, height } = Dimensions.get("window");

export default function WelcomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Welcome to Navigator
      </ThemedText>
      <ThemedText style={styles.welcomeText}>
        This is a simple, user-friendly digital application for navigation and
        tracking outcomes to improve your personal experience. This decision
        support tool can enhance your experience by empowering you with basic
        information, connecting with resources, and facilitating informed
        communication.
      </ThemedText>
      <ThemedButton
        text="Start navigator"
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
  title: {
    marginBottom: height * 0.05,
  },
  welcomeText: {
    marginBottom: height * 0.05,
    paddingHorizontal: width * 0.05,
  },
});
