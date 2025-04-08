import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";

const { width, height } = Dimensions.get("window");

export default function WelcomeScreen() {
  const router = useRouter();
  // Animated value for welcome animation
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
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

  // Navigation handler
  const handleNavigation = (route) => {
    router.push(route);
  };

  // Render navigation card component
  const NavigationCard = (props) => {
    return (
      <TouchableOpacity
        style={styles.cardContainer}
        onPress={() => handleNavigation(props.route)}
        activeOpacity={0.8}
      >
        <View style={styles.card}>
          <View style={styles.cardIconContainer}>
            <Ionicons name={props.icon} color="#FFFFFF" size={width * 0.08} />
          </View>
          <View style={styles.cardTextContainer}>
            <Text
              style={styles.cardTitle}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {props.title}
            </Text>
            <Text
              style={styles.cardDescription}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {props.description}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

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
          <Text style={styles.title}>Navigator and{"\n"}Supportive Care</Text>
          <Text style={styles.subtitle}>Empowering Breast Cancer Support</Text>
        </View>

        {/* Navigation Cards */}
        <NavigationCard
          title="Care Path AI"
          description="Compassionate AI Support"
          route="/(tabs)/care-bot"
          icon="chatbubble-outline"
        />

        <NavigationCard
          title="Personalized Care Path"
          description="AI-Powered Support Plan"
          route="/(plan)"
          icon="heart-outline"
        />

        <NavigationCard
          title="Navigator"
          description="Tailored Educational Resources"
          route="/(info)/info"
          icon="book-outline"
        />

        {/* Privacy Disclaimer */}
        <View style={styles.disclaimerContainer}>
          <Ionicons
            name="shield-outline"
            color="#FFFFFF"
            size={width * 0.06}
            style={styles.disclaimerIcon}
          />
          <Text style={styles.disclaimerText}>
            Your privacy matters. We do not collect, store, or use any personal
            data.
          </Text>
        </View>
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
    width: width * 0.9,
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
    justifyContent: "center",
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
