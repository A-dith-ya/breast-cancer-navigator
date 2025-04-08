import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { WebView } from "react-native-webview";
import Ionicons from "@expo/vector-icons/Ionicons";
import { EXAMPLE_USER_SCROLL } from "@/constants/InjectedJavascript";
import config from "@/config";

const { width, height } = Dimensions.get("window");

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
              size={width * 0.08}
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
              size={width * 0.06}
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
    width: width * 0.9,
    alignItems: "center",
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
    marginBottom: height * 0.01,
  },
  subtitle: {
    fontSize: width * 0.04,
    color: "#FFD7E6",
    textAlign: "center",
    marginBottom: height * 0.02,
  },
  instructionCard: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 15,
    padding: width * 0.04,
    alignItems: "center",
    marginBottom: height * 0.03,
  },
  cardIconContainer: {
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 10,
    padding: width * 0.03,
    marginRight: width * 0.04,
  },
  instructionText: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: width * 0.035,
    lineHeight: width * 0.05,
  },
  webviewContainer: {
    width: width * 0.9,
    height: height * 0.35,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: height * 0.03,
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
    borderRadius: 15,
    padding: width * 0.04,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonIcon: {
    marginRight: width * 0.03,
  },
  buttonText: {
    color: "#FF1493",
    fontSize: width * 0.045,
    fontWeight: "600",
  },
});
