import { Link } from "expo-router";
import { StyleSheet, Dimensions } from "react-native";
import { useRef } from "react";
import { WebView } from "react-native-webview";
import { SCROLL_TO_CONTACT } from "@/constants/InjectedJavascript";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import config from "@/config";

const { width, height } = Dimensions.get("window");

export default function CompleteScreen() {
  const webviewRef = useRef<WebView>(null);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="sectionTitle">
        You have completed the Breast Cancer Navigator
      </ThemedText>
      <ThemedText type="section">
        Please contact us if you have any questions or feedback.
      </ThemedText>
      <ThemedView style={styles.webview}>
        <WebView
          ref={webviewRef}
          source={{
            uri: `${config.WEBVIEW_URI}/contact-us/`,
          }}
          onLoad={() => webviewRef.current?.injectJavaScript(SCROLL_TO_CONTACT)}
        />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: width * 0.05,
  },
  webview: {
    flex: 1,
    width: width * 0.9,
    height: height * 1,
    marginBottom: height * 0.05,
  },
  link: {
    fontSize: width * 0.065,
  },
});
