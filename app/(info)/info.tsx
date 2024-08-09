import { router } from "expo-router";
import { StyleSheet, Dimensions } from "react-native";
import { useRef } from "react";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedButton } from "@/components/ThemedButton";
import { WebView } from "react-native-webview";
import { EXAMPLE_USER_SCROLL } from "@/constants/InjectedJavascript";
import config from "@/config";

const { width, height } = Dimensions.get("window");

export default function InfoScreen() {
  const webviewRef = useRef<WebView>(null);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Instructions</ThemedText>
      <ThemedText type="section">
        "Tap the 'Info' button to proceed to the information screen. The web
        content may take some time to load. Once loaded, you can navigate
        through the information and click 'Learn More' for additional details."
      </ThemedText>
      <ThemedView style={styles.webview}>
        <WebView
          ref={webviewRef}
          source={{
            uri: `${config.WEBVIEW_URI}/educational-resources`,
          }}
          onLoad={() =>
            webviewRef.current?.injectJavaScript(EXAMPLE_USER_SCROLL)
          }
        />
      </ThemedView>
      <ThemedButton
        text="Start Navigator"
        type="defaultSemiBold"
        onPress={() => router.push("/(tabs)/")}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: width * 0.05,
  },
  webview: {
    width: width * 0.75,
    height: height * 0.35,
    marginBottom: height * 0.05,
  },
});
