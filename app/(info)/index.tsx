import { Link } from "expo-router";
import { StyleSheet, Dimensions } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

const { width, height } = Dimensions.get("window");

export default function WelcomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">
        Welcome to {"\n"} Navigator and Supportive Care
      </ThemedText>
      <ThemedText type="section" adjustsFontSizeToFit>
        Tailored breast cancer educational resources
      </ThemedText>
      <Link href={{ pathname: "/(info)/info" }} style={styles.linkContainer}>
        <ThemedText type="link" style={styles.link}>
          Navigator
        </ThemedText>
      </Link>
      <ThemedText type="section">
        AI-powered breast cancer support plan
      </ThemedText>
      <Link href={{ pathname: "/(plan)" }} style={styles.linkContainer}>
        <ThemedText type="link" style={styles.link}>
          Personalized Care Path
        </ThemedText>
      </Link>
      <ThemedText type="section">
        Please note: This app does not collect, store, or use any personal data.
      </ThemedText>
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
  linkContainer: {
    marginBottom: height * 0.05,
  },
  link: {
    fontSize: width * 0.065,
  },
});
