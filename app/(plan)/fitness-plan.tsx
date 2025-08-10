import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, FlatList, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import config from "@/config";

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
    <LinearGradient colors={["#FF1493", "#B13D8D"]} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.heroSection}>
          {/* <Text style={styles.title}>Personalized Fitness Plan</Text> */}
          <Text style={styles.subtitle}>Mobility Level: {mobilityLevel}</Text>
          <Text style={styles.description}>{focus}</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {Object.keys(routine).map((category, index) => (
            <View key={index} style={styles.section}>
              <View style={styles.sectionTitleContainer}>
                <Ionicons
                  name={
                    category.toLowerCase().includes("stretch")
                      ? "walk-outline"
                      : category.toLowerCase().includes("strength")
                      ? "barbell-outline"
                      : "body-outline"
                  }
                  size={20}
                  color="#FFFFFF"
                  style={styles.icon}
                />
                <Text style={styles.sectionTitle}>{category}</Text>
              </View>
              <FlatList
                data={routine[category]}
                keyExtractor={(item, idx) => idx.toString()}
                renderItem={({ item }) => (
                  <View style={styles.listItemContainer}>
                    <Ionicons
                      name="arrow-forward"
                      size={16}
                      color="#FFD7E6"
                      style={styles.bulletIcon}
                    />
                    <Text style={styles.listItem}>{item}</Text>
                  </View>
                )}
              />
            </View>
          ))}

          <View style={styles.section}>
            <View style={styles.sectionTitleContainer}>
              <Ionicons
                name="bulb-outline"
                size={20}
                color="#FFFFFF"
                style={styles.icon}
              />
              <Text style={styles.sectionTitle}>Tips</Text>
            </View>
            <FlatList
              data={tips}
              keyExtractor={(item, idx) => idx.toString()}
              renderItem={({ item }) => (
                <View style={styles.listItemContainer}>
                  <Ionicons
                    name="checkmark-done-outline"
                    size={16}
                    color="#FFD7E6"
                    style={styles.bulletIcon}
                  />
                  <Text style={styles.listItem}>{item}</Text>
                </View>
              )}
            />
          </View>
        </ScrollView>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    width: "90%",
    alignSelf: "center",
    paddingTop: 20,
  },
  heroSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFD7E6",
    textAlign: "center",
    marginBottom: 4,
  },
  description: {
    fontSize: 16,
    color: "#FFEAF4",
    textAlign: "center",
    marginBottom: 16,
  },
  section: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  icon: {
    marginRight: 12,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "600",
  },
  listItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  bulletIcon: {
    marginRight: 12,
  },
  listItem: {
    color: "#FFEAF4",
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
});
