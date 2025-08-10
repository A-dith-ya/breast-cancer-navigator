import { Link } from "expo-router";
import { StyleSheet, View } from "react-native";
import { useRef } from "react";
import { WebView } from "react-native-webview";
import { SCROLL_TO_CONTACT } from "@/constants/InjectedJavascript";
import { ThemedText } from "@/components/ThemedText";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import config from "@/config";

export default function CompleteScreen() {
  const webviewRef = useRef<WebView>(null);

  return (
    <LinearGradient colors={["#FF1493", "#B13D8D"]} style={styles.container}>
      <View style={styles.content}>
        <Ionicons
          name="checkmark-circle-outline"
          size={48}
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
    paddingTop: 16,
    paddingHorizontal: 24,
  },
  icon: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#FFD7E6",
    textAlign: "center",
    marginBottom: 28,
    paddingHorizontal: 8,
  },
  webviewCard: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 15,
    overflow: "hidden",
    width: "90%",
    height: 320,
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
