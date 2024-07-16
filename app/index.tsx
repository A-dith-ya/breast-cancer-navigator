import { Text, View, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import client from "../services/contentfulService";
import { RadioButton } from "../components/RadioButton";

interface Question {
  question: string;
  options: {
    option: string;
    subOptions: string[];
    filter?: string;
  }[];
}

export default function Index() {
  const [questionsData, setQuestionsData] = useState<Question[]>([]);
  const [questionNumber, setQuestionNumber] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const entry = await client.getEntry("3lRhUvpZ7NaUuPyVtarAZ");
        setQuestionsData(entry.fields.questions.questions);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      {questionsData.length === 0 ? (
        <Text>Loading...</Text>
      ) : (
        <>
          <Text>{questionsData[questionNumber].question}</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
