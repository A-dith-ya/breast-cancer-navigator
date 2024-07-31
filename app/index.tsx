import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import { WebView } from "react-native-webview";
import { RadioButton } from "../components/RadioButton";
import { client } from "../services/sanityService";
import { scrollToSymptom } from "../constants/InjectedJavascript";
import config from "../config";
import { Colors } from "../constants/Colors";

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
  const [webViewUri, setWebViewUri] = useState("");
  const colors = Colors[useColorScheme() ?? "light"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const CONTENT_QUERY = `*[_type == "questions"]`;
        const content = await client.fetch(CONTENT_QUERY);
        setQuestionsData(JSON.parse(content[0].question).questions);
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
        uri: webViewUri,
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

  useEffect(() => {
    switch (questionNumber) {
      case 0:
      case 1:
        setWebViewUri(`${config.WEBVIEW_URI}/educational-resources`);
        break;
      case 2:
      case 3:
        setWebViewUri(`${config.WEBVIEW_URI}/managing-symptom-distress`);
        break;
    }
  }, [questionNumber]);

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
            <TouchableOpacity
              style={[
                styles.nextButton,
                { backgroundColor: colors.background },
              ]}
              onPress={() => {
                if (questionNumber < questionsData.length - 1) {
                  setQuestionNumber(questionNumber + 1);
                }
              }}
            >
              <Text style={[styles.nextText, { color: colors.text }]}>
                Next
              </Text>
            </TouchableOpacity>
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
  nextButton: {
    padding: 16,
    borderRadius: 8,
  },
  nextText: { fontSize: 12 },
});
