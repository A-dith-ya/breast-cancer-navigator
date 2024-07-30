import { Text, View, StyleSheet } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import { WebView } from "react-native-webview";
import client from "../services/contentfulService";
import { RadioButton } from "../components/RadioButton";
import { scrollToSymptom } from "../constants/InjectedJavascript";
import config from "../config";

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
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const webviewRef = useRef<WebView>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const entry = await client.getEntry(config.QUESTIONS_ENTRY_ID);
        setQuestionsData(entry.fields.questions.questions);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const handleSelectOption = (option: string) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((item) => item !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const renderRadioButton = (option: string) => (
    <RadioButton
      label={option}
      selected={selectedOptions.includes(option)}
      onPress={() => handleSelectOption(option)}
    />
  );

  const renderWebView = (filter: string) => (
    <WebView
      ref={webviewRef}
      style={styles.webview}
      source={{
        uri: config.WEBVIEW_URI,
      }}
      onLoad={() =>
        webviewRef.current?.injectJavaScript(scrollToSymptom(filter))
      }
    />
  );

  const renderSuboptionItem = ({
    item,
    filter,
  }: {
    item: string;
    filter?: string;
  }) => (
    <>
      {renderRadioButton(item)}
      {selectedOptions.includes(item) && filter && renderWebView(filter)}
    </>
  );

  const renderOptionItem = ({
    item,
  }: {
    item: Question["options"][number];
  }) => (
    <>
      <Text style={styles.optionText}>{item.option}</Text>
      {!item.subOptions ? (
        renderRadioButton(item.option)
      ) : (
        <FlatList
          data={item.subOptions}
          renderItem={({ item: subOptionItem }) =>
            renderSuboptionItem({ item: subOptionItem, filter: item.filter })
          }
          keyExtractor={(item) => item}
        />
      )}
      {selectedOptions.includes(item.option) &&
        item.filter &&
        renderWebView(item.filter)}
    </>
  );

  return (
    <GestureHandlerRootView>
      <View style={styles.container}>
        {questionsData.length === 0 ? (
          <Text>Loading...</Text>
        ) : (
          <>
            <Text style={styles.questionText}>
              {questionsData[questionNumber].question}
            </Text>
            <FlatList
              data={questionsData[questionNumber].options}
              renderItem={renderOptionItem}
              keyExtractor={(item) => item.option}
            />
          </>
        )}
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  questionText: {
    fontSize: 20,
    marginBottom: 16,
  },
  optionText: {
    fontSize: 16,
    marginBottom: 8,
  },
  webview: {
    width: 300,
    height: 300,
  },
});
