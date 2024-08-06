import {
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import { WebView } from "react-native-webview";
import { useLocalSearchParams, router } from "expo-router";
import { RadioButton } from "../../components/RadioButton";
import { ThemedView } from "../../components/ThemedView";
import { ThemedText } from "../../components/ThemedText";
import { useTheme } from "../../components/ThemedContext";
import { client } from "../../services/sanityService";
import { SCROLL_TO_SYMPTOM } from "../../constants/InjectedJavascript";
import config from "../../config";
import { CONTENT_QUERY } from "../../constants/Queries";

interface Question {
  question: string;
  options: {
    option: string;
    subOptions: string[] | { subOption: string; filter: string }[];
    filter?: string;
    uri?: string;
  }[];
}

interface Image {
  questionIndex: number;
  optionIndex: number;
  imageUrl: string;
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
  let optionImages = useRef<Image[]>([]);
  const flatListRef = useRef<FlatList>(null);

  const handleSelectOption = (option: string) => {
    // Handle selection of options and suboptions in each question separately
    const currentSelectedOptions =
      selectedOptions[Math.floor(questionNumber)] || [];
    // If the option is already selected, remove it from the selected options
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

  // Scroll to the top when navigating between questions
  const scrollToTop = () => {
    flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
  };

  const renderImage = (questionIndex: number, optionIndex: number) => {
    // Find the image for the current question and option
    const image = optionImages.current.find(
      (image) =>
        image.questionIndex === questionIndex &&
        image.optionIndex === optionIndex
    );

    return image ? (
      <Image source={{ uri: image.imageUrl }} style={styles.webview} />
    ) : null;
  };

  const renderWebView = (
    filter: string,
    index: number,
    customWebViewUri?: string
  ) =>
    // Render webview only after the user navigates completely through the question screen
    questionNumber % 1 === 0.5 ? (
      <WebView
        ref={(ref) => (webviewRefs.current[index] = ref!)}
        style={styles.webview}
        source={{
          // Use the suboption webview uri otherwise use the default webview uri
          uri: customWebViewUri || webViewUri,
        }}
        // Inject the javascript to scroll to the element in the webview
        onLoad={() =>
          webviewRefs.current[index]?.injectJavaScript(
            SCROLL_TO_SYMPTOM(filter)
          )
        }
      />
    ) : null;

  const renderRadioButton = (option: string) => (
    <RadioButton
      label={option}
      selected={
        selectedOptions[Math.floor(questionNumber)]?.includes(option) || false
      }
      onPress={() => handleSelectOption(option)}
    />
  );

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
          {item.filter &&
            selectedOptions[Math.floor(questionNumber)]?.includes(
              item.subOption
            ) &&
            renderWebView(item.filter, index, customWebViewUri)}
        </>
      ) : (
        renderRadioButton(item)
      )}
    </>
  );

  // Render suboptions if they have their own web urls otherwise render the main option as a radio button
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
                // Add a unique index to each suboption webview ref
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
              <ThemedText key={subOption} style={styles.subOptionText}>
                {subOption}
              </ThemedText>
            ))}
          {item.filter &&
            selectedOptions[Math.floor(questionNumber)]?.includes(
              item.option
            ) &&
            renderWebView(item.filter, index)}
        </>
      )}
      {questionNumber % 1 === 0 &&
        renderImage(Math.floor(questionNumber), index)}
    </>
  );

  useEffect(() => {
    // Update the webview uri based on the current question number
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
      // Reset the screen state when the user retakes the assessment
      setQuestionNumber(0);
      setSelectedOptions({});
      router.push("/", { reset: false });
    }
  }, [local]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch questions data from Sanity
        const content = await client.fetch(CONTENT_QUERY);
        optionImages.current = content[0].images;
        setQuestionsData(JSON.parse(content[0].question).questions);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <GestureHandlerRootView>
      <ThemedView style={styles.container}>
        {questionsData.length === 0 ? (
          <ActivityIndicator size="large" />
        ) : (
          <>
            <ThemedText style={styles.questionText}>
              {questionsData[Math.floor(questionNumber)].question}
            </ThemedText>
            <FlatList
              ref={flatListRef}
              data={questionsData[Math.floor(questionNumber)].options}
              renderItem={({ item, index }) =>
                renderOptionItem({ item, index })
              }
              keyExtractor={(item) => item.option}
              style={styles.flatListContainer}
            />
            <ThemedView style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  styles.nextButton,
                  { backgroundColor: colors.tabIconDefault },
                ]}
                onPress={() => {
                  if (questionNumber < questionsData.length - 0.5) {
                    setQuestionNumber(questionNumber + 0.5);
                    scrollToTop();
                  } else {
                    router.push("complete");
                  }
                }}
              >
                <ThemedText>Next</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.nextButton,
                  { backgroundColor: colors.tabIconDefault },
                ]}
                onPress={() => {
                  if (questionNumber > 0) {
                    setQuestionNumber(questionNumber - 0.5);
                    scrollToTop();
                  }
                }}
              >
                <ThemedText>Back</ThemedText>
              </TouchableOpacity>
            </ThemedView>
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
  buttonContainer: {
    width: 320,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  nextButton: {
    padding: 8,
    borderRadius: 4,
  },
});
