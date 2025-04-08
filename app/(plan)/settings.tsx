import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Dimensions,
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

const { width, height } = Dimensions.get("window");

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
            <Ionicons
              name="person-circle-outline"
              size={width * 0.12}
              color="#FFFFFF"
            />
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
                size={width * 0.06}
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
    width: width * 0.9,
    alignSelf: "center",
    justifyContent: "center",
    paddingTop: height * 0.05,
  },
  header: {
    alignItems: "center",
    marginBottom: height * 0.04,
  },
  title: {
    color: "#FFFFFF",
    fontSize: width * 0.06,
    fontWeight: "700",
    marginTop: height * 0.01,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 15,
    padding: width * 0.03,
    marginBottom: height * 0.02,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputIcon: {
    marginRight: width * 0.03,
  },
  input: {
    flex: 1,
    fontSize: width * 0.04,
    color: "#FFFFFF",
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.03,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  loading: {
    marginTop: height * 0.03,
  },
});
