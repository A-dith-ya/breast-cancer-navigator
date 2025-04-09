import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";

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
          <Ionicons name={iconName} color="#FFFFFF" size={24} />
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
    width: "90%",
    alignItems: "center",
  },
  heroSection: {
    alignItems: "center",
    marginBottom: 32,
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
    marginBottom: 24,
  },
  cardContainer: {
    width: "100%",
    marginBottom: 16,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
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
  },
  cardDescription: {
    color: "#FFD7E6",
    fontSize: 14,
  },
  disclaimerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 8,
    padding: 12,
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
