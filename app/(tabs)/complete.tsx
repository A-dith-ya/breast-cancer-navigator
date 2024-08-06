import { Link } from "expo-router";
import { StyleSheet, Dimensions } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

const { width, height } = Dimensions.get("window");

export default function CompleteScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        You have completed the Breast Cancer Navigator
      </ThemedText>
      <Link replace href={{ pathname: "/(tabs)/", params: { reset: true } }}>
        <ThemedText type="link" style={styles.link}>
          Retake the navigator
        </ThemedText>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: width * 0.05,
  },
  title: {
    marginBottom: height * 0.05,
  },
  link: {
    fontSize: width * 0.065,
  },
});
