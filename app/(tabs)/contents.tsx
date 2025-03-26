import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { client } from "@/services/sanityService";
import { CONTENT_QUERY } from "@/constants/Queries";
import { ActivityIndicator } from "react-native";

const { width, height } = Dimensions.get("window");

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
        // Navigate to QuestionScreen and set the initial question number
        router.push({
          pathname: "/(tabs)/",
          params: { initialQuestionNumber: index },
        });
      }}
    >
      <ThemedText style={styles.questionText}>
        Q{index + 1}: {item.question}
      </ThemedText>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={questions}
        renderItem={renderQuestionItem}
        keyExtractor={(_, index) => `question_${index}`}
        contentContainerStyle={styles.listContainer}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: width * 0.04,
  },
  headerText: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    marginBottom: height * 0.02,
  },
  listContainer: {
    width: width * 0.9,
  },
  questionItem: {
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: width * 0.04,
    marginVertical: height * 0.01,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  questionText: {
    fontSize: width * 0.04,
    color: "#666",
    marginBottom: height * 0.01,
  },
});
