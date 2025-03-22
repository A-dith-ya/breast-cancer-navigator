import {
  View,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { generateRecommendation } from "@/services/recommendationService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getOrCreateUUID } from "@/utils/uuidUtil";
import config from "@/config";

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

  const router = useRouter();
  const [id, setId] = useState<string | null>(null);

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

  useEffect(() => {
    const getId = async () => {
      setId(await getOrCreateUUID());
    };

    getId();
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedView style={styles.container}>
        <ThemedText type="title">Personal Information</ThemedText>
        <View style={styles.inputContainer}>
          <ThemedText type="section" style={styles.inputLabel}>
            Age
          </ThemedText>
          <ThemedTextInput
            value={age ? age.toString() : ""}
            onChangeText={(text) => {
              if (/^[0-9]{0,2}$/.test(text)) {
                setAge(text);
              }
            }}
            placeholder="Enter your age"
            keyboardType="numeric"
            style={styles.input}
          />
        </View>
        <View style={styles.inputContainer}>
          <ThemedText type="section" style={styles.inputLabel}>
            Gender
          </ThemedText>
          <ThemedTextInput
            value={gender || ""}
            onChangeText={(text) => {
              if (/^[a-zA-Z, -]{0,15}$/.test(text)) {
                setGender(text);
              }
            }}
            placeholder="Enter your gender"
            keyboardType="ascii-capable"
            style={styles.input}
          />
        </View>
        <View style={styles.inputContainer}>
          <ThemedText type="section" style={styles.inputLabel}>
            Dietary Preferences
          </ThemedText>
          <ThemedTextInput
            value={dietaryPreferences || ""}
            onChangeText={(text) => {
              if (/^[a-zA-Z, -]{0,30}$/.test(text)) {
                setDietaryPreferences(text);
              }
            }}
            placeholder="None, Vegetarian, Gluten Free"
            keyboardType="ascii-capable"
            style={styles.input}
          />
        </View>
        <View style={styles.inputContainer}>
          <ThemedText type="section" style={styles.inputLabel}>
            Exercise Activity
          </ThemedText>
          <ThemedTextInput
            value={mobility || ""}
            onChangeText={(text) => {
              if (/^[a-zA-Z, -]{0,30}$/.test(text)) {
                setMobility(text);
              }
            }}
            placeholder="Limited Mobility, Moderate Activity"
            keyboardType="ascii-capable"
            style={styles.input}
          />
        </View>
        <View style={styles.inputContainer}>
          <ThemedText type="section" style={styles.inputLabel}>
            Cancer Type
          </ThemedText>
          <ThemedTextInput
            value="Breast Cancer"
            // placeholder="Breast Cancer"
            editable={false}
            keyboardType="ascii-capable"
            style={styles.input}
          />
        </View>
        <ThemedButton text="Generate Plan" onPress={handleGeneratePlan} />
        {loading && (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            style={{ marginTop: height * 0.05 }}
          />
        )}
        {error && <ThemedText type="error">{error}</ThemedText>}
      </ThemedView>
    </TouchableWithoutFeedback>
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
