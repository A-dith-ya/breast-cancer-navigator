import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "@expo/vector-icons/Ionicons";
import config from "@/config";

interface MealPlan {
  DietType: string;
  NutritionalFocus: string;
  Meals: {
    [key: string]: string[];
  };
}

export default function MealPlanScreen() {
  const [dietType, setDietType] = useState("");
  const [nutritionalFocus, setNutritionalFocus] = useState("");
  const [meals, setMeals] = useState<MealPlan["Meals"]>({});
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    const getPlanData = async () => {
      try {
        const storedData = await AsyncStorage.getItem(
          config.RECOMMENDATION_KEY
        );
        if (storedData) {
          const planData: MealPlan = JSON.parse(storedData).MealPlan;
          setDietType(planData.DietType);
          setNutritionalFocus(planData.NutritionalFocus);
          setMeals(planData.Meals);
        }
      } catch (error) {
        console.error("Error retrieving meal plan data:", error);
      }
    };
    getPlanData();
  }, []);

  return (
    <LinearGradient colors={["#FF1493", "#B13D8D"]} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidContainer}
      >
        <View style={styles.content}>
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <Text style={styles.title}>{dietType}</Text>
            <Text style={styles.subtitle} numberOfLines={2}>
              {nutritionalFocus}
            </Text>
          </View>

          {/* Meal Plan Scroll View */}
          <ScrollView
            ref={scrollViewRef}
            style={styles.mealPlanContainer}
            contentContainerStyle={styles.mealPlanContentContainer}
            showsVerticalScrollIndicator={true}
            nestedScrollEnabled={true}
            keyboardShouldPersistTaps="handled"
          >
            {Object.keys(meals).map((mealType, index) => (
              <View key={index} style={styles.mealSection}>
                <View style={styles.mealTitleContainer}>
                  <Ionicons
                    name={
                      mealType.toLowerCase().includes("breakfast")
                        ? "sunny-outline"
                        : mealType.toLowerCase().includes("lunch")
                        ? "partly-sunny-outline"
                        : "moon-outline"
                    }
                    color="#FFFFFF"
                    size={20}
                    style={styles.mealTypeIcon}
                  />
                  <Text style={styles.mealTitle}>{mealType}</Text>
                </View>
                {meals[mealType].map((item, itemIndex) => (
                  <View key={itemIndex} style={styles.mealItemContainer}>
                    <Text style={styles.mealItem}>• {item}</Text>
                  </View>
                ))}
              </View>
            ))}

            {/* Add some extra space at the bottom to ensure full scrolling */}
            {/* <View style={styles.scrollPadding} /> */}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  keyboardAvoidContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
  content: {
    width: "90%",
    alignItems: "center",
    flex: 1,
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#FFD7E6",
    textAlign: "center",
    marginBottom: 16,
  },
  infoCard: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 24,
    width: "100%",
  },
  cardIconContainer: {
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 8,
    padding: 12,
    marginRight: 16,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
    textAlign: "left",
  },
  cardDescription: {
    color: "#FFD7E6",
    fontSize: 14,
    textAlign: "left",
  },
  mealPlanContainer: {
    width: "100%",
    marginBottom: 16,
  },
  mealPlanContentContainer: {
    paddingBottom: 80,
    alignItems: "center",
  },
  mealSection: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    width: "100%",
  },
  mealTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    paddingLeft: 20,
  },
  mealTypeIcon: {
    marginRight: 12,
  },
  mealTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  mealItemContainer: {
    paddingLeft: 32,
    width: "100%",
  },
  mealItem: {
    color: "#FFD7E6",
    fontSize: 14,
    marginBottom: 4,
    textAlign: "left",
  },
  scrollPadding: {},
  disclaimerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 8,
    padding: 12,
    width: "100%",
  },
  disclaimerIcon: {
    marginRight: 12,
  },
  disclaimerText: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 12,
    textAlign: "left",
  },
});
