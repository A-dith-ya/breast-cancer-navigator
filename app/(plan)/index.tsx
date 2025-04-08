import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";

const { width, height } = Dimensions.get("window");

export default function DashboardScreen() {
  const NavigationCard = ({
    title,
    description,
    href,
    iconName,
  }: {
    title: string;
    description: string;
    href: string;
    iconName: string;
  }) => (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() => router.push(href)}
    >
      <View style={styles.card}>
        <View style={styles.cardIconContainer}>
          <Ionicons name={iconName} color="#FFFFFF" size={width * 0.08} />
        </View>
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardDescription}>{description}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={["#FF1493", "#B13D8D"]} style={styles.container}>
      <View style={styles.content}>
        <NavigationCard
          title="Nutrition & Meal Plan"
          description="Tailored Dietary Guidance"
          href="/(plan)/meal-plan"
          iconName="nutrition-outline"
        />

        <NavigationCard
          title="Exercise & Mobility"
          description="Adaptive Fitness Strategies"
          href="/(plan)/fitness-plan"
          iconName="fitness-outline"
        />

        <NavigationCard
          title="Mind & Wellness"
          description="Emotional Health Support"
          href="/(plan)/wellbeing-plan"
          iconName="heart-outline"
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    width: width * 0.9,
    alignItems: "center",
  },
  heroSection: {
    alignItems: "center",
    marginBottom: height * 0.04,
  },
  title: {
    fontSize: width * 0.07,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: height * 0.01,
  },
  subtitle: {
    fontSize: width * 0.04,
    color: "#FFD7E6",
    textAlign: "center",
    marginBottom: height * 0.03,
  },
  cardContainer: {
    width: "100%",
    marginBottom: height * 0.02,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 15,
    padding: width * 0.04,
    alignItems: "center",
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
  },
  cardDescription: {
    color: "#FFD7E6",
    fontSize: width * 0.035,
  },
  disclaimerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: height * 0.03,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 10,
    padding: width * 0.03,
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
