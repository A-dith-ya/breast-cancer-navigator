import { StyleSheet, Dimensions } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ThemedButton } from "@/components/ThemedButton";

const { width, height } = Dimensions.get("window");

export default function DashboardScreen() {
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      <ThemedButton
        text="Nutrition & Meal Plan"
        style={styles.button}
        type="buttonTitle"
        onPress={() => router.push("/(plan)/meal-plan")}
      />
      <ThemedButton
        text="Exercise & Mobility"
        style={styles.button}
        type="buttonTitle"
        onPress={() => router.push("/(plan)/fitness-plan")}
      />
      <ThemedButton
        text="Mind & Wellness"
        style={styles.button}
        type="buttonTitle"
        onPress={() => router.push("/(plan)/wellbeing-plan")}
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
  button: {
    width: width * 0.8,
    marginBottom: height * 0.1,
    borderRadius: 0,
  },
});
