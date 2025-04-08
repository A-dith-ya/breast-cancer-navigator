import { Link } from "expo-router";
import { StyleSheet, Dimensions, View } from "react-native";
import { useRef } from "react";
import { WebView } from "react-native-webview";
import { SCROLL_TO_CONTACT } from "@/constants/InjectedJavascript";
import { ThemedText } from "@/components/ThemedText";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import config from "@/config";

const { width, height } = Dimensions.get("window");

export default function CompleteScreen() {
  const webviewRef = useRef<WebView>(null);

  return (
    <LinearGradient colors={["#FF1493", "#B13D8D"]} style={styles.container}>
      <View style={styles.content}>
        <Ionicons
          name="checkmark-circle-outline"
          size={width * 0.15}
          color="#FFFFFF"
          style={styles.icon}
        />

        <ThemedText style={styles.title}>
          You’ve completed the Breast Cancer Navigator
        </ThemedText>

        <ThemedText style={styles.subtitle}>
          Thank you for taking this step. If you have questions or feedback,
          we’re here for you.
        </ThemedText>

        <View style={styles.webviewCard}>
          <WebView
            ref={webviewRef}
            source={{ uri: `${config.WEBVIEW_URI}/contact-us/` }}
            onLoad={() =>
              webviewRef.current?.injectJavaScript(SCROLL_TO_CONTACT)
            }
            style={styles.webview}
          />
        </View>
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
    alignItems: "center",
    paddingTop: height * 0.02,
    paddingHorizontal: width * 0.06,
  },
  icon: {
    marginBottom: height * 0.03,
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: height * 0.015,
  },
  subtitle: {
    fontSize: width * 0.04,
    color: "#FFD7E6",
    textAlign: "center",
    marginBottom: height * 0.035,
    paddingHorizontal: width * 0.02,
  },
  webviewCard: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 15,
    overflow: "hidden",
    width: width * 0.9,
    height: height * 0.4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  webview: {
    width: "100%",
    height: "100%",
  },
});
