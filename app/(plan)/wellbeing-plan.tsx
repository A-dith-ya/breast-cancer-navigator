import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  FlatList,
  StyleSheet,
  Animated,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import config from "@/config";

export default function MentalWellbeingScreen() {
  const [wellbeing, setWellbeing] = useState({});
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    const getWellbeingData = async () => {
      const storedData = await AsyncStorage.getItem(config.RECOMMENDATION_KEY);
      if (storedData) {
        const planData = JSON.parse(storedData).MentalWellBeingSupport;
        setWellbeing(planData);
      }
    };
    getWellbeingData();

    // Animate entrance with fade and scale
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const renderSection = (category, items) => (
    <Animated.View
      key={category}
      style={[
        styles.section,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <View style={styles.sectionTitleContainer}>
        <Ionicons
          name="heart-outline"
          color="#FFFFFF"
          size={20}
          style={styles.sectionIcon}
        />
        <Text style={styles.sectionTitle}>
          {category.replace(/([A-Z])/g, " $1").trim()}
        </Text>
      </View>
      <FlatList
        data={items}
        keyExtractor={(item, idx) => idx.toString()}
        renderItem={({ item }) => (
          <View style={styles.listItemContainer}>
            <Ionicons
              name="arrow-forward"
              color="#FFFFFF"
              size={16}
              style={styles.bulletIcon}
            />
            <Text style={styles.listItem}>{item}</Text>
          </View>
        )}
      />
    </Animated.View>
  );

  return (
    <LinearGradient colors={["#FF1493", "#B13D8D"]} style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.subtitle}>Support for Your Journey</Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContent}
        >
          {Object.entries(wellbeing).map(([category, items]) =>
            renderSection(category, items)
          )}
        </ScrollView>
      </Animated.View>
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
    flex: 1,
    paddingTop: 20,
  },
  heroSection: {
    alignItems: "center",
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
  scrollViewContent: {
    paddingBottom: 16,
  },
  section: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionIcon: {
    marginRight: 12,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 18,
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
    color: "#FFD7E6",
    fontSize: 14,
    flex: 1,
  },
  disclaimerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
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
