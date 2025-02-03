import { ScrollView, FlatList, StyleSheet, Dimensions } from "react-native";
import React from "react";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { mealPlanData } from "@/data/mealPlanData";

const { width, height } = Dimensions.get("window");

export default function MealPlanScreen() {
  const { DietType, NutritionalFocus, Meals } = mealPlanData.MealPlan;

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="sectionTitle" style={styles.header}>
        {DietType}
      </ThemedText>
      <ThemedText type="section" style={styles.description}>
        {NutritionalFocus}
      </ThemedText>

      <ScrollView>
        {Object.keys(Meals).map((mealType, index) => (
          <ThemedView key={index} style={styles.mealSection}>
            <ThemedText type="sectionTitle" style={styles.mealTitle}>
              {mealType}
            </ThemedText>
            <FlatList
              data={Meals[mealType]}
              keyExtractor={(item, idx) => idx.toString()}
              renderItem={({ item }) => (
                <ThemedText
                  style={styles.mealItem}
                >{`\u2022 ${item}`}</ThemedText>
              )}
            />
          </ThemedView>
        ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: width * 0.05,
    alignItems: "center",
  },
  header: {
    fontWeight: "600",
    color: "#4CAF50",
    marginBottom: height * 0.01,
  },
  description: {
    fontSize: width * 0.04,
    textAlign: "center",
  },
  mealSection: {
    width: "100%",
    padding: width * 0.03,
    marginBottom: height * 0.02,
    borderWidth: 1,
    borderRadius: 10,
  },
  mealTitle: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    color: "#2196F3",
    marginBottom: height * 0.01,
  },
  mealItem: {
    marginBottom: height * 0.005,
  },
});
