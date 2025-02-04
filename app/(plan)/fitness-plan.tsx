import { ScrollView, FlatList, StyleSheet, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import config from "@/config";

const { width, height } = Dimensions.get("window");

interface ExercisePlan {
  MobilityLevel: string;
  Focus: string;
  Routine: {
    [key: string]: string[];
  };
  Tips: string[];
}

export default function FitnessPlanScreen() {
  const [mobilityLevel, setMobilityLevel] = useState("");
  const [focus, setFocus] = useState("");
  const [routine, setRoutine] = useState<ExercisePlan["Routine"]>({});
  const [tips, setTips] = useState<ExercisePlan["Tips"]>([]);

  useEffect(() => {
    const getPlanData = async () => {
      const storedData = await AsyncStorage.getItem(config.RECOMMENDATION_KEY);

      if (storedData) {
        const planData: ExercisePlan = JSON.parse(storedData).ExercisePlan;
        setMobilityLevel(planData.MobilityLevel);
        setFocus(planData.Focus);
        setRoutine(planData.Routine);
        setTips(planData.Tips);
      }
    };

    getPlanData();
  }, []);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="sectionTitle" style={styles.header}>
        Mobility Level: {mobilityLevel}
      </ThemedText>
      <ThemedText type="section" style={styles.description}>
        {focus}
      </ThemedText>

      <ScrollView>
        {Object.keys(routine).map((category, index) => (
          <ThemedView key={index} style={styles.section}>
            <ThemedText type="sectionTitle" style={styles.sectionTitle}>
              {category}
            </ThemedText>
            <FlatList
              data={routine[category]}
              keyExtractor={(item, idx) => idx.toString()}
              renderItem={({ item }) => (
                <ThemedText
                  style={styles.listItem}
                >{`\u2022 ${item}`}</ThemedText>
              )}
            />
          </ThemedView>
        ))}

        <ThemedView style={styles.section}>
          <ThemedText type="sectionTitle" style={styles.sectionTitle}>
            Tips
          </ThemedText>
          <FlatList
            data={tips}
            keyExtractor={(item, idx) => idx.toString()}
            renderItem={({ item }) => (
              <ThemedText
                style={styles.listItem}
              >{`\u2022 ${item}`}</ThemedText>
            )}
          />
        </ThemedView>
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
