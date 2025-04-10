import React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Colors } from "@/constants/Colors";

interface UpdateModalProps {
  visible: boolean;
  currentVersion: string;
  storeVersion: string;
  releaseNotes?: string;
  onUpdate: () => void;
  onNotNow: () => void;
}

export default function UpdateModal({
  visible,
  currentVersion,
  storeVersion,
  releaseNotes,
  onUpdate,
  onNotNow,
}: UpdateModalProps) {
  const platformText = Platform.OS === "ios" ? "App Store" : "Play Store";

  // Use themed colors
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const buttonColor = useThemeColor({}, "button");
  const buttonTextColor = useThemeColor({}, "buttonText");
  const iconColor = useThemeColor({}, "icon");

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor }]}>
          <View style={styles.header}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: buttonColor + "20" },
              ]}
            >
              <Ionicons name="download-outline" size={32} color={buttonColor} />
            </View>
            <Text style={[styles.title, { color: textColor }]}>
              App Update Available
            </Text>
          </View>

          <View style={styles.content}>
            <Text style={[styles.subtitle, { color: textColor }]}>
              Version {storeVersion} is now available in the {platformText}
            </Text>

            {releaseNotes && (
              <View
                style={[
                  styles.releaseNotesContainer,
                  {
                    backgroundColor:
                      backgroundColor === Colors.light.background
                        ? "#f5f5f5"
                        : "#2a2a2a",
                  },
                ]}
              >
                <Text style={[styles.releaseNotesTitle, { color: textColor }]}>
                  What's New:
                </Text>
                <Text style={[styles.releaseNotes, { color: iconColor }]}>
                  {releaseNotes}
                </Text>
              </View>
            )}

            <Text style={[styles.currentVersion, { color: iconColor }]}>
              Current version: {currentVersion}
            </Text>
          </View>

          <View style={styles.actions}>
            <Pressable
              style={[
                styles.notNowButton,
                {
                  backgroundColor:
                    backgroundColor === Colors.light.background
                      ? "#f0f0f0"
                      : "#3a3a3a",
                  borderColor: iconColor,
                },
              ]}
              onPress={onNotNow}
            >
              <Text style={[styles.notNowButtonText, { color: iconColor }]}>
                Not Now
              </Text>
            </Pressable>
            <Pressable
              style={[styles.updateButton, { backgroundColor: buttonColor }]}
              onPress={onUpdate}
            >
              <Text
                style={[styles.updateButtonText, { color: buttonTextColor }]}
              >
                Update Now
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modal: {
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  iconContainer: {
    padding: 16,
    borderRadius: 50,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },
  content: {
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 22,
  },
  releaseNotesContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  releaseNotesTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  releaseNotes: {
    fontSize: 14,
    lineHeight: 20,
  },
  currentVersion: {
    fontSize: 12,
    textAlign: "center",
    fontStyle: "italic",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  notNowButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
  },
  notNowButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  updateButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  updateButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
