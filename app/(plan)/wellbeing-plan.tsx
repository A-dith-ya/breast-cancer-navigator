import { ScrollView, FlatList, StyleSheet, Dimensions } from "react-native";
import React from "react";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { mentalWellbeingData } from "@/data/wellBeingData";

const { width, height } = Dimensions.get("window");

export default function MentalWellbeingScreen() {
  const wellbeing = mentalWellbeingData.MentalWellBeingSupport;

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="sectionTitle" style={styles.header}>
        Mental Well-being Support
      </ThemedText>

      <ScrollView>
        {Object.keys(wellbeing).map((category, index) => (
          <ThemedView key={index} style={styles.section}>
            <ThemedText type="sectionTitle" style={styles.sectionTitle}>
              {category.replace(/([A-Z])/g, " $1").trim()}
            </ThemedText>
            <FlatList
              data={wellbeing[category]}
              keyExtractor={(item, idx) => idx.toString()}
              renderItem={({ item }) => (
                <ThemedText
                  style={styles.listItem}
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
  section: {
    width: "100%",
    padding: width * 0.03,
    marginBottom: height * 0.02,
    borderWidth: 1,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    color: "#2196F3",
    marginBottom: height * 0.01,
  },
  listItem: {
    marginBottom: height * 0.005,
  },
});
