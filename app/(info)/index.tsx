import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";

import UpdateModal from "@/components/UpdateModal";
import { useAppStoreVersionCheck } from "@/hooks/useAppStoreVersionCheck";

export default function WelcomeScreen() {
  const router = useRouter();

  const { versionInfo, openStoreUpdate, dismissUpdate } =
    useAppStoreVersionCheck();

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
            <Ionicons name={props.icon} color="#FFFFFF" size={24} />
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
          <Text style={styles.title}>Supportive Care{"\n"}& Survivorship</Text>
          <Text style={styles.subtitle}>
            Empowering lives for a better quality of life
          </Text>
        </View>

        {/* Navigation Cards */}
        <NavigationCard
          title="Compassionate Support"
          description="Ask Questions, Get Personalized Support"
          route="/(tabs)/care-bot"
          icon="chatbubble-outline"
        />

        <NavigationCard
          title="Personalized Wellness"
          description="AI-Powered Guidance Plan"
          route="/(plan)"
          icon="heart-outline"
        />

        <NavigationCard
          title="Tailored Learning"
          description="Discover Comprehensive Educational Resources"
          route="/(info)/info"
          icon="book-outline"
        />

        {/* Privacy Disclaimer */}
        <View style={styles.disclaimerContainer}>
          <Ionicons
            name="shield-outline"
            color="#FFFFFF"
            size={20}
            style={styles.disclaimerIcon}
          />
          <Text style={styles.disclaimerText}>
            Your privacy matters. We do not collect, store, or use any personal
            data.
          </Text>
        </View>
      </Animated.View>

      {/* App Store Update Modal */}
      {versionInfo?.needsUpdate && (
        <UpdateModal
          visible={true}
          currentVersion={versionInfo.currentVersion}
          storeVersion={versionInfo.storeVersion}
          releaseNotes={versionInfo.releaseNotes}
          onUpdate={openStoreUpdate}
          onNotNow={dismissUpdate}
        />
      )}
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
    width: "90%",
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
    justifyContent: "center",
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
