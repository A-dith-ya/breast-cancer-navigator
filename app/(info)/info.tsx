import React, { useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { WebView } from "react-native-webview";
import Ionicons from "@expo/vector-icons/Ionicons";
import { EXAMPLE_USER_SCROLL } from "@/constants/InjectedJavascript";
import config from "@/config";

export default function InfoScreen() {
  const webviewRef = useRef<WebView>(null);

  return (
    <LinearGradient colors={["#FF1493", "#B13D8D"]} style={styles.container}>
      <View style={styles.content}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.title}>Navigator Instructions</Text>
          <Text style={styles.subtitle}>
            Discover Comprehensive Educational Resources
          </Text>
        </View>

        {/* Instruction Card */}
        <View style={styles.instructionCard}>
          <View style={styles.cardIconContainer}>
            <Ionicons
              name="information-circle-outline"
              color="#FFFFFF"
              size={24}
            />
          </View>
          <Text style={styles.instructionText}>
            Tap the 'Start Navigator' button to access educational resources.
            The web content may take a moment to load. Once loaded, you can
            navigate through the information and explore additional details.
          </Text>
        </View>

        {/* WebView Container */}
        <View style={styles.webviewContainer}>
          <WebView
            ref={webviewRef}
            source={{
              uri: `${config.WEBVIEW_URI}/educational-resources`,
            }}
            onLoad={() =>
              webviewRef.current?.injectJavaScript(EXAMPLE_USER_SCROLL)
            }
            style={styles.webview}
          />
        </View>

        {/* Navigation Button */}
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => router.push("/(tabs)/contents")}
        >
          <View style={styles.button}>
            <Ionicons
              name="arrow-forward"
              color="#FF1493"
              size={20}
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>Start Navigator</Text>
          </View>
        </TouchableOpacity>
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
  instructionCard: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 24,
  },
  cardIconContainer: {
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 8,
    padding: 12,
    marginRight: 16,
  },
  instructionText: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 14,
    lineHeight: 20,
  },
  webviewContainer: {
    width: "90%",
    height: 280,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 24,
  },
  webview: {
    width: "100%",
    height: "100%",
  },
  buttonContainer: {
    width: "100%",
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonIcon: {
    marginRight: 12,
  },
  buttonText: {
    color: "#FF1493",
    fontSize: 18,
    fontWeight: "600",
  },
});
