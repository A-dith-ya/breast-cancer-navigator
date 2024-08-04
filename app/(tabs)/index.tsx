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
    subOptions: string[] | { subOption: string; filter: string }[];
    filter?: string;
    uri?: string;
  }[];
}

export default function QuestionScreen() {
  const [questionsData, setQuestionsData] = useState<Question[]>([]);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: number]: string[];
  }>({});
  const webviewRefs = useRef<WebView[]>([]);
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
    const currentSelectedOptions =
      selectedOptions[Math.floor(questionNumber)] || [];
    if (currentSelectedOptions.includes(option)) {
      setSelectedOptions({
        ...selectedOptions,
        [Math.floor(questionNumber)]: currentSelectedOptions.filter(
          (item) => item !== option
        ),
      });
    } else {
      setSelectedOptions({
        ...selectedOptions,
        [Math.floor(questionNumber)]: [...currentSelectedOptions, option],
      });
    }
  };

  const renderRadioButton = (option: string) => (
    <RadioButton
      label={option}
      selected={
        selectedOptions[Math.floor(questionNumber)]?.includes(option) || false
      }
      onPress={() => handleSelectOption(option)}
    />
  );
  const renderWebView = (
    filter: string,
    index: number,
    customWebViewUri?: string
  ) =>
    questionNumber % 1 === 0.5 ? (
      <WebView
        ref={(ref) => (webviewRefs.current[index] = ref!)}
        style={styles.webview}
        source={{
          uri: customWebViewUri || webViewUri,
        }}
        onLoad={() =>
          webviewRefs.current[index]?.injectJavaScript(scrollToSymptom(filter))
        }
      />
    ) : null;

  const renderSuboptionItem = ({
    item,
    index,
    customWebViewUri,
  }: {
    item: Question["options"][number]["subOptions"][number];
    index: number;
    customWebViewUri?: string;
  }) => (
    <>
      {typeof item === "object" ? (
        <>
          {renderRadioButton(item.subOption)}
          {selectedOptions[Math.floor(questionNumber)]?.includes(
            item.subOption
          ) &&
            item.filter &&
            renderWebView(item.filter, index, customWebViewUri)}
        </>
      ) : (
        renderRadioButton(item)
      )}
    </>
  );

  const renderOptionItem = ({
    item,
    index,
  }: {
    item: Question["options"][number];
    index: number;
  }) => (
    <>
      {item.subOptions && typeof item.subOptions[0] === "object" ? (
        <>
          <ThemedText style={styles.optionText}>{item.option}</ThemedText>
          <FlatList
            data={item.subOptions}
            renderItem={({ item: subItem, index: subIndex }) =>
              renderSuboptionItem({
                item: subItem,
                index: index * 10 + subIndex,
                customWebViewUri: item.uri,
              })
            }
            keyExtractor={(item) =>
              typeof item === "object" ? item.subOption : item
            }
            style={styles.flatListContainer}
          />
        </>
      ) : (
        <>
          {renderRadioButton(item.option)}
          {item.subOptions &&
            item.subOptions.map((subOption) => (
              <ThemedText style={styles.subOptionText}>{subOption}</ThemedText>
            ))}
          {selectedOptions[Math.floor(questionNumber)]?.includes(item.option) &&
            item.filter &&
            renderWebView(item.filter, index)}
        </>
      )}
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
  }, [local]);

  return (
    <GestureHandlerRootView>
      <ThemedView style={styles.container}>
        {questionsData.length === 0 ? (
          <ThemedText>Loading...</ThemedText>
        ) : (
          <>
            <ThemedText style={styles.questionText}>
              {questionsData[Math.floor(questionNumber)].question}
            </ThemedText>
            <FlatList
              data={questionsData[Math.floor(questionNumber)].options}
              renderItem={({ item, index }) =>
                renderOptionItem({ item, index })
              }
              keyExtractor={(item) => item.option}
              style={styles.flatListContainer}
            />
            <TouchableOpacity
              style={[
                styles.nextButton,
                { backgroundColor: colors.tabIconDefault },
              ]}
              onPress={() => {
                if (questionNumber < questionsData.length - 0.5) {
                  setQuestionNumber(questionNumber + 0.5);
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
  subOptionText: {
    fontSize: 14,
    paddingLeft: 16,
    marginBottom: 8,
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
