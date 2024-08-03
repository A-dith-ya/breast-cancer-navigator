import { TouchableOpacity, StyleSheet } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import { WebView } from "react-native-webview";
import { useLocalSearchParams, router } from "expo-router";
import { RadioButton } from "../../components/RadioButton";
import { ThemedView } from "../../components/ThemedView";
import { ThemedText } from "../../components/ThemedText";
import { useTheme } from "../../components/ThemedContext";
import { client } from "../../services/sanityService";
import { scrollToSymptom } from "../../constants/InjectedJavascript";
import config from "../../config";

interface Question {
  question: string;
  options: {
    option: string;
    subOptions: string[];
    filter?: string;
  }[];
}

export default function QuestionScreen() {
  const [questionsData, setQuestionsData] = useState<Question[]>([]);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const webviewRef = useRef<WebView>(null);
  const [webViewUri, setWebViewUri] = useState("");
  const { colors } = useTheme();
  const local = useLocalSearchParams();

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
      <ThemedText style={styles.optionText}>{item.option}</ThemedText>
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

  useEffect(() => {
    if (local.reset) {
      setQuestionNumber(0);
      router.push("/", { reset: false });
    }
  }
  , [local]);

  return (
    <GestureHandlerRootView>
      <ThemedView style={styles.container}>
        {questionsData.length === 0 ? (
          <ThemedText>Loading...</ThemedText>
        ) : (
          <>
            <ThemedText style={styles.questionText}>
              {questionsData[questionNumber].question}
            </ThemedText>
            <FlatList
              data={questionsData[questionNumber].options}
              renderItem={renderOptionItem}
              keyExtractor={(item) => item.option}
              style={styles.flatListContainer}
            />
            <TouchableOpacity
              style={[
                styles.nextButton,
                { backgroundColor: colors.tabIconDefault },
              ]}
              onPress={() => {
                if (questionNumber < questionsData.length - 1) {
                  setQuestionNumber(questionNumber + 1);
                } else {
                  router.push("complete");
                }
              }}
            >
              <ThemedText>Next</ThemedText>
            </TouchableOpacity>
          </>
        )}
      </ThemedView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: "center",
  },
  flatListContainer: {
    width: 320,
  },
  questionText: {
    fontSize: 20,
  },
  optionText: {
    fontSize: 16,
    marginVertical: 8,
  },
  webview: {
    width: 300,
    height: 300,
    marginBottom: 16,
  },
  nextButton: {
    padding: 8,
    borderRadius: 4,
  },
});
