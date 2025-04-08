import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  FlatList,
  StyleSheet,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
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
                  size={width * 0.06}
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
                      size={width * 0.04}
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
                size={width * 0.06}
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
                    size={width * 0.04}
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
    width: width * 0.9,
    alignSelf: "center",
    paddingTop: height * 0.025,
  },
  heroSection: {
    alignItems: "center",
    marginBottom: height * 0.03,
  },
  title: {
    fontSize: width * 0.07,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: height * 0.005,
  },
  subtitle: {
    fontSize: width * 0.045,
    fontWeight: "600",
    color: "#FFD7E6",
    textAlign: "center",
    marginBottom: height * 0.005,
  },
  description: {
    fontSize: width * 0.04,
    color: "#FFEAF4",
    textAlign: "center",
    marginBottom: height * 0.02,
  },
  section: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 15,
    padding: width * 0.04,
    marginBottom: height * 0.025,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: height * 0.015,
  },
  icon: {
    marginRight: width * 0.03,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: width * 0.05,
    fontWeight: "600",
  },
  listItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: height * 0.01,
  },
  bulletIcon: {
    marginRight: width * 0.03,
  },
  listItem: {
    color: "#FFEAF4",
    fontSize: width * 0.035,
    lineHeight: width * 0.05,
    flex: 1,
  },
});
