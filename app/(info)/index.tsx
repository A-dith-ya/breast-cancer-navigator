import { Link } from "expo-router";
import { StyleSheet, Dimensions } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

const { width, height } = Dimensions.get("window");

export default function WelcomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Welcome to Navigator</ThemedText>
      <ThemedText type="section">
        AI-powered personalized recommendations for meal plans, exercise
        routines, and well-being.
      </ThemedText>
      <Link href={{ pathname: "/(plan)" }}>
        <ThemedText type="link" style={styles.link}>
          Recommendation Dashboard
        </ThemedText>
      </Link>
      <ThemedText type="section">
        This is a simple, user-friendly digital application for navigation and
        tracking outcomes to improve your personal experience. This decision
        support tool can enhance your experience by empowering you with basic
        information, connecting with resources, and facilitating informed
        communication.
      </ThemedText>
      <ThemedText type="section">
        Please note: This app does not collect, store, or use any personal data.
      </ThemedText>
      <Link href={{ pathname: "/(info)/info" }}>
        <ThemedText type="link" style={styles.link}>
          Instructions
        </ThemedText>
      </Link>
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
  link: {
    fontSize: width * 0.065,
  },
});
