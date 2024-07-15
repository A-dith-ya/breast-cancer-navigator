import { Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import client from "../services/contentfulService";

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
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}
