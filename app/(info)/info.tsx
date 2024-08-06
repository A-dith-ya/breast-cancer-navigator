import { StyleSheet, Dimensions } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

const { width } = Dimensions.get("window");

export default function InfoScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Instructions</ThemedText>
      <ThemedText type="sectionTitle">Overview</ThemedText>
      <ThemedText type="section">
        The QuestionScreen is designed for navigating through a series of
        questions and options, with the ability to view additional resources and
        images based on user selections.
      </ThemedText>
      <ThemedText type="sectionTitle">Buttons</ThemedText>
      <ThemedText type="section">
        "Info" button to proceed to the information screen, web content will
        take time to load.
      </ThemedText>
      <ThemedText type="section">
        "Next" button to proceed to the next question.
      </ThemedText>
      <ThemedText type="section">
        "Back" button to return to the previous screen.
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
});
