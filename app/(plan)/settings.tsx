import { View, TextInput, StyleSheet, Dimensions } from "react-native";
import React from "react";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedButton } from "@/components/ThemedButton";

const { width, height } = Dimensions.get("window");

export default function SettingsScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Personal Information</ThemedText>
      <View style={styles.inputContainer}>
        <ThemedText type="section" style={styles.inputLabel}>
          Age
        </ThemedText>
        <TextInput
          placeholder="Enter your age"
          keyboardType="numeric"
          style={styles.input}
          placeholderTextColor={"#C7C7CD"}
        />
      </View>
      <View style={styles.inputContainer}>
        <ThemedText type="section" style={styles.inputLabel}>
          Gender
        </ThemedText>
        <TextInput
          placeholder="Enter your gender"
          keyboardType="ascii-capable"
          style={styles.input}
          placeholderTextColor={"#C7C7CD"}
        />
      </View>
      <View style={styles.inputContainer}>
        <ThemedText type="section" style={styles.inputLabel}>
          Cancer Type
        </ThemedText>
        <TextInput
          placeholder="Breast"
          keyboardType="ascii-capable"
          style={styles.input}
          placeholderTextColor={"#C7C7CD"}
        />
      </View>
      <View style={styles.inputContainer}>
        <ThemedText type="section" style={styles.inputLabel}>
          Dietary Preferences
        </ThemedText>
        <TextInput
          placeholder="None, Vegetarian, Gluten Free"
          keyboardType="ascii-capable"
          style={styles.input}
          placeholderTextColor={"#C7C7CD"}
        />
      </View>
      <View style={styles.inputContainer}>
        <ThemedText type="section" style={styles.inputLabel}>
          Exercise Activity
        </ThemedText>
        <TextInput
          placeholder="Limited Mobility, Moderate Activity"
          keyboardType="ascii-capable"
          style={styles.input}
          placeholderTextColor={"#C7C7CD"}
        />
      </View>
      <ThemedButton text="Generate Plan" />
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
  inputContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: height * 0.05,
  },
  inputLabel: {
    width: width * 0.3,
    textAlign: "center",
    marginBottom: 0,
  },
  input: {
    width: width * 0.6,
    padding: width * 0.03,
    fontSize: width * 0.04,
    borderWidth: 1,
  },
});
