import { Link } from "expo-router";
import { StyleSheet } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

export default function CompleteScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">
        Thank you for completing the breast cancer navigator.
      </ThemedText>
      <Link href={{pathname:"/", params: { reset: true}}} >
        <ThemedText type="link" style={styles.link}>Retake the navigator!</ThemedText>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: "center",
  },
  link: {
    marginTop: 15,
    fontSize: 20,
  },
});
