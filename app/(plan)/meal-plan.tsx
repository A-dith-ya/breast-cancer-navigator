import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "@expo/vector-icons/Ionicons";
import config from "@/config";

const { width, height } = Dimensions.get("window");

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
            <Text style={styles.subtitle}>{nutritionalFocus}</Text>
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
                    size={width * 0.05}
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
    justifyContent: "center", // Center vertically
    alignItems: "center", // Center horizontally
  },
  keyboardAvoidContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center", // Ensure central alignment
  },
  content: {
    width: width * 0.9,
    alignItems: "center", // Ensure content is centered
    flex: 1,
    paddingTop: height * 0.025,
  },
  heroSection: {
    alignItems: "center", // Center title and subtitle
    marginBottom: height * 0.03,
  },
  title: {
    fontSize: width * 0.07,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center", // Ensure text is centered
    marginBottom: height * 0.01,
  },
  subtitle: {
    fontSize: width * 0.04,
    color: "#FFD7E6",
    textAlign: "center", // Ensure text is centered
    marginBottom: height * 0.02,
  },
  infoCard: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 15,
    padding: width * 0.04,
    alignItems: "center",
    marginBottom: height * 0.03,
    width: "100%", // Ensure full width
  },
  cardIconContainer: {
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 10,
    padding: width * 0.03,
    marginRight: width * 0.04,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    color: "#FFFFFF",
    fontSize: width * 0.045,
    fontWeight: "600",
    marginBottom: height * 0.005,
    textAlign: "left", // Align text to the left within the card
  },
  cardDescription: {
    color: "#FFD7E6",
    fontSize: width * 0.035,
    textAlign: "left", // Align text to the left within the card
  },
  mealPlanContainer: {
    width: "100%",
    marginBottom: height * 0.02,
  },
  mealPlanContentContainer: {
    paddingBottom: height * 0.1, // Add extra padding at the bottom
    alignItems: "center", // Center meal sections
  },
  mealSection: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 15,
    padding: width * 0.04,
    marginBottom: height * 0.02,
    width: "100%", // Ensure full width
  },
  mealTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: height * 0.01,
    paddingLeft: width * 0.05, // Add some left padding to align icon and title
  },
  mealTypeIcon: {
    marginRight: width * 0.03,
  },
  mealTitle: {
    color: "#FFFFFF",
    fontSize: width * 0.045,
    fontWeight: "600",
  },
  mealItemContainer: {
    paddingLeft: width * 0.08, // Align meal items
    width: "100%", // Ensure full width
  },
  mealItem: {
    color: "#FFD7E6",
    fontSize: width * 0.035,
    marginBottom: height * 0.005,
    textAlign: "left", // Ensure text starts from the left
  },
  scrollPadding: {},
  disclaimerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: height * 0.02,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 10,
    padding: width * 0.03,
    width: "100%", // Ensure full width
  },
  disclaimerIcon: {
    marginRight: width * 0.03,
  },
  disclaimerText: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: width * 0.03,
    textAlign: "left",
  },
});
