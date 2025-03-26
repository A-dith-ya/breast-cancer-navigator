import {
  Image,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  Linking,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import { WebView } from "react-native-webview";
import { useLocalSearchParams, router } from "expo-router";
import { RadioButton } from "@/components/RadioButton";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedButton } from "@/components/ThemedButton";
import { client } from "@/services/sanityService";
import { SCROLL_TO_SYMPTOM } from "@/constants/InjectedJavascript";
import config from "@/config";
import { CONTENT_QUERY } from "@/constants/Queries";

const { width, height } = Dimensions.get("window");

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
  const [webViewSources, setWebViewSources] = useState<{
    [key: number]: string[];
  }>({});
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

  const handleSelectSource = (source: string) => {
    const currentSources = webViewSources[Math.floor(questionNumber)] || [];

    const sourceDomain = new URL(source).hostname;
    // Check if there is already a source from the same domain
    const domainExists = currentSources.some(
      (existingSource) => new URL(existingSource).hostname === sourceDomain
    );

    // Add the source to the webview sources if it is not already added
    if (!currentSources.includes(source) && !domainExists) {
      setWebViewSources({
        ...webViewSources,
        [Math.floor(questionNumber)]: [...currentSources, source],
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
  ) => (
    // Render webview only after the user navigates completely through the question screen
    <WebView
      key={`webview_${index}`}
      ref={(ref) => (webviewRefs.current[index] = ref!)}
      style={[
        // Start rendering webview after user selects an option
        styles.webview,
        !(questionNumber % 1 === 0.5) && styles.hideWebView,
      ]}
      source={{
        // Use the suboption webview uri otherwise use the default webview uri
        uri: customWebViewUri || webViewUri,
      }}
      // Inject the javascript to scroll to the element in the webview
      onLoad={() =>
        webviewRefs.current[index]?.injectJavaScript(SCROLL_TO_SYMPTOM(filter))
      }
      // Listen for the webview navigation to update the webview sources
      onNavigationStateChange={(navState) => handleSelectSource(navState.url)}
    />
  );

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
  }) => {
    // Skip rendering the option if it does not have a filter or suboptions
    if (
      (!item.filter &&
        !(item.subOptions && typeof item.subOptions[0] === "object")) ||
      (item.subOptions &&
        typeof item.subOptions[0] === "object" &&
        !item.subOptions[0].filter)
    ) {
      return null;
    }

    return (
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
  };

  useEffect(() => {
    // Check if an initial question number is passed from the Contents screen
    if (local.initialQuestionNumber) {
      const initialQuestionNumber = parseFloat(
        local.initialQuestionNumber as string
      );
      setQuestionNumber(initialQuestionNumber);
    }
  }, [local.initialQuestionNumber]);

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
      setWebViewSources({});
      router.replace("/(tabs)/", { reset: false });
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
              ListFooterComponent={
                <>
                  {questionNumber % 1 === 0.5 && (
                    <>
                      <ThemedText style={{ marginTop: height * 0.05 }}>
                        Sources:
                      </ThemedText>
                      {
                        // Open the webview source in the browser when the user navigates to the source
                        webViewSources[Math.floor(questionNumber)]?.map(
                          (source) => (
                            <ThemedText
                              type="link"
                              key={source}
                              onPress={() => Linking.openURL(source)}
                            >
                              {source}
                            </ThemedText>
                          )
                        )
                      }
                    </>
                  )}
                </>
              }
            />
            <ThemedView style={styles.buttonContainer}>
              <ThemedButton
                text={questionNumber % 1 === 0.5 ? "Next" : "Info"}
                onPress={() => {
                  if (questionNumber < questionsData.length - 0.5) {
                    setQuestionNumber(questionNumber + 0.5);
                    scrollToTop();
                  } else {
                    router.push("complete");
                  }
                }}
              />
              <ThemedButton
                text="Back"
                onPress={() => {
                  if (questionNumber > 0) {
                    setQuestionNumber(questionNumber - 0.5);
                    scrollToTop();
                  }
                }}
              />
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
    alignItems: "center",
    justifyContent: "center",
    padding: width * 0.01,
  },
  flatListContainer: {
    padding: width * 0.01,
    width: width * 0.9,
  },
  questionText: {
    fontSize: width * 0.05,
    width: width * 0.9,
  },
  optionText: {
    fontSize: width * 0.046,
    marginLeft: width * 0.032,
  },
  subOptionText: {
    fontSize: width * 0.042,
    marginLeft: width * 0.11,
  },
  webview: {
    alignSelf: "center",
    width: width * 0.85,
    height: height * 0.45,
    marginVertical: height * 0.01,
    marginHorizontal: width * 0.05,
  },
  hideWebView: {
    position: "absolute",
    left: -1000,
    right: -1000,
  },
  buttonContainer: {
    width: width * 0.9,
    flexDirection: "row",
    justifyContent: "space-around",
  },
});
