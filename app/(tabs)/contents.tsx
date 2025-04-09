import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ThemedText } from "@/components/ThemedText";
import { client } from "@/services/sanityService";
import { CONTENT_QUERY } from "@/constants/Queries";

interface Question {
  question: string;
}

export default function ContentsScreen() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const content = await client.fetch(CONTENT_QUERY);
        const parsedQuestions = JSON.parse(content[0].question).questions;
        setQuestions(parsedQuestions);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching questions:", error);
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const renderQuestionItem = ({
    item,
    index,
  }: {
    item: Question;
    index: number;
  }) => (
    <TouchableOpacity
      style={styles.questionItem}
      onPress={() => {
        router.push({
          pathname: "/(tabs)/",
          params: { initialQuestionNumber: index },
        });
      }}
    >
      <View style={styles.itemContent}>
        <Ionicons
          name="help-circle-outline"
          size={20}
          color="#FF1493"
          style={styles.icon}
        />
        <ThemedText style={styles.questionText}>
          Q{index + 1}: {item.question}
        </ThemedText>
      </View>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={["#FF1493", "#B13D8D"]} style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#FFFFFF" />
      ) : (
        <View style={styles.content}>
          {/* Question List */}
          <FlatList
            data={questions}
            renderItem={renderQuestionItem}
            keyExtractor={(_, index) => `question_${index}`}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    width: "90%",
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    justifyContent: "center",
  },
  headerIcon: {
    marginRight: 12,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  listContainer: {
    paddingBottom: 40,
  },
  questionItem: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  itemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 12,
  },
  questionText: {
    fontSize: 16,
    color: "#FFFFFF",
    flex: 1,
    lineHeight: 20,
  },
});
