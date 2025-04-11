import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { ThemedText } from "@/components/ThemedText";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { ThemedButton } from "@/components/ThemedButton";
import { generateRecommendation } from "@/services/recommendationService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getOrCreateUUID } from "@/utils/uuidUtil";
import config from "@/config";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function SettingsScreen() {
  const [age, setAge] = useState<string | null>(null);
  const [gender, setGender] = useState<string | null>(null);
  const [dietaryPreferences, setDietaryPreferences] = useState<string | null>(
    null
  );
  const [mobility, setMobility] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [id, setId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getId = async () => {
      setId(await getOrCreateUUID());
    };
    getId();
  }, []);

  const handleGeneratePlan = async () => {
    setLoading(true);
    if (!id || !age || !gender || !dietaryPreferences || !mobility) {
      setError("Please fill out all fields");
      setLoading(false);
      return;
    }

    try {
      const response = await generateRecommendation(
        id,
        age,
        gender,
        dietaryPreferences,
        mobility
      );
      if (response.error) {
        setError(response.error);
      } else {
        // Clear any existing plan data and save the new one
        await AsyncStorage.removeItem(config.RECOMMENDATION_KEY);
        await AsyncStorage.setItem(
          config.RECOMMENDATION_KEY,
          JSON.stringify(response)
        );
        router.replace("/(plan)/");
      }
    } catch (error) {
      setError("An error occurred while generating the recommendation.");
    }

    setLoading(false);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <LinearGradient colors={["#FF1493", "#B13D8D"]} style={styles.container}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Ionicons name="person-circle-outline" size={48} color="#FFFFFF" />
            <ThemedText style={styles.title}>Personal Info</ThemedText>
          </View>

          {/* Inputs */}
          {[
            {
              label: "Age",
              icon: "calendar-outline",
              value: age,
              setter: setAge,
              keyboardType: "numeric",
              placeholder: "Enter your age",
              validate: (text: string) => /^[0-9]{0,2}$/.test(text),
            },
            {
              label: "Gender",
              icon: "male-female-outline",
              value: gender,
              setter: setGender,
              placeholder: "Enter your gender",
              validate: (text: string) => /^[a-zA-Z, -]{0,15}$/.test(text),
            },
            {
              label: "Dietary Preferences",
              icon: "nutrition-outline",
              value: dietaryPreferences,
              setter: setDietaryPreferences,
              placeholder: "None, Vegetarian, Gluten Free",
              validate: (text: string) => /^[a-zA-Z, -]{0,30}$/.test(text),
            },
            {
              label: "Exercise Activity",
              icon: "walk-outline",
              value: mobility,
              setter: setMobility,
              placeholder: "Limited Mobility, Moderate Activity",
              validate: (text: string) => /^[a-zA-Z, -]{0,30}$/.test(text),
            },
            {
              label: "Cancer Type",
              icon: "medkit-outline",
              value: "Breast Cancer",
              setter: () => {},
              editable: false,
            },
          ].map((field, idx) => (
            <View key={idx} style={styles.inputContainer}>
              <Ionicons
                name={field.icon as any}
                size={20}
                color="#FFFFFF"
                style={styles.inputIcon}
              />
              <ThemedTextInput
                placeholder={field.placeholder}
                keyboardType={field.keyboardType || "ascii-capable"}
                editable={field.editable !== false}
                value={field.value || ""}
                onChangeText={(text) => {
                  if (field.setter && field.editable !== false) {
                    if (!field.validate || field.validate(text)) {
                      field.setter(text);
                    }
                  }
                }}
                style={styles.input}
              />
            </View>
          ))}

          <ThemedButton text="Generate Plan" onPress={handleGeneratePlan} />

          {loading && (
            <ActivityIndicator
              size="large"
              color="#FFFFFF"
              style={styles.loading}
            />
          )}
          {error && <ThemedText type="error">{error}</ThemedText>}
        </View>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    width: "90%",
    alignSelf: "center",
    justifyContent: "center",
    paddingTop: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
    marginTop: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#FFFFFF",
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  loading: {
    marginTop: 24,
  },
});
