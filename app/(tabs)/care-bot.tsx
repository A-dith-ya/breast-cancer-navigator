import React, { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
  FlatList,
  TextInput,
} from "react-native";
import { WebView } from "react-native-webview";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Linking } from "react-native";
import { getWebResource } from "@/services/openAiService";
import { SCROLL_TO_CHAPTER } from "@/constants/InjectedJavascript";

const { width, height } = Dimensions.get("window");

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  url?: string;
  isLoading?: boolean;
}

// Example questions to guide users
const EXAMPLE_QUESTIONS = [
  "What questions can I ask about my breast cancer diagnosis?",
  "What are the treatments based on the stage of breast cancer?",
  "What does a personalized treatment plan include?",
  "What are the stages of healing after surgery?",
  "What are breast reconstruction surgery types?",
];

export default function CarebotScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const webviewRefs = useRef<WebView[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleExampleQuestion = (question: string) => {
    handleSendMessage(question);
  };

  const handleSendMessage = useCallback(
    async (predefinedQuestion?: string) => {
      const currentInput = predefinedQuestion || inputText;

      if (currentInput.trim() === "" || isProcessing) return;

      // Create user message
      const userMessage: Message = {
        id: Date.now(),
        text: currentInput,
        sender: "user",
      };

      // Create loading bot message
      const loadingBotMessage: Message = {
        id: Date.now() + 1,
        text: "Searching...",
        sender: "bot",
        isLoading: true,
      };

      // Set processing state to prevent multiple submissions
      setIsProcessing(true);

      // Update messages with user message and loading indicator
      setMessages((prevMessages) => [
        ...prevMessages,
        userMessage,
        loadingBotMessage,
      ]);

      // Clear input for non-predefined questions
      if (!predefinedQuestion) {
        setInputText("");
      }

      Keyboard.dismiss();

      // Determine bot response based on input
      try {
        const webResource = await getWebResource(currentInput);

        // Remove the loading message
        setMessages((prevMessages) =>
          prevMessages.filter((msg) => msg.id !== loadingBotMessage.id)
        );

        if (webResource.url && webResource.title) {
          const botResponse: Message = {
            id: Date.now() + 2,
            text: webResource.title,
            sender: "bot",
            url: webResource.url,
          };

          setMessages((prevMessages) => [...prevMessages, botResponse]);
        } else {
          const botResponse: Message = {
            id: Date.now() + 2,
            text: "I couldn't find relevant information. Please try again.",
            sender: "bot",
          };

          setMessages((prevMessages) => [...prevMessages, botResponse]);
        }
      } catch (error) {
        // Remove the loading message
        setMessages((prevMessages) =>
          prevMessages.filter((msg) => msg.id !== loadingBotMessage.id)
        );

        const errorMessage: Message = {
          id: Date.now() + 2,
          text: "Sorry, I encountered an error while processing your request.",
          sender: "bot",
        };

        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      } finally {
        // Reset processing state
        setIsProcessing(false);
      }
    },
    [inputText, isProcessing]
  );

  const renderExampleQuestion = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.exampleQuestionContainer}
      onPress={() => handleExampleQuestion(item)}
    >
      <Text style={styles.exampleQuestionText}>{item}</Text>
    </TouchableOpacity>
  );

  const renderMessage = (message: Message) => {
    return (
      <View key={message.id}>
        {message.url && (
          <WebView
            ref={(ref) => webviewRefs.current.push(ref!)}
            source={{ uri: message.url }}
            style={styles.webview}
            startInLoadingState={true}
            onLoad={() =>
              webviewRefs.current
                .pop()
                ?.injectJavaScript(SCROLL_TO_CHAPTER(message.text))
            }
          />
        )}
        <TouchableOpacity
          onPress={() => message.url && Linking.openURL(message.url)}
          style={[
            styles.messageContainer,
            message.sender === "user" ? styles.userMessage : styles.botMessage,
          ]}
        >
          {message.isLoading ? (
            <ActivityIndicator
              size="small"
              color="white"
              style={styles.loadingIndicator}
            />
          ) : (
            <>
              <Text style={styles.messageText}>{message.text}</Text>
              {message.url && (
                <Text style={styles.urlLinkText}>
                  Tap to open full resource
                </Text>
              )}
            </>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <LinearGradient colors={["#FF1493", "#B13D8D"]} style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        <View style={styles.content}>
          {/* Hero Section */}
          <View style={styles.heroSection}>
            {/* <Text style={styles.title}>Compassionate AI Support</Text> */}
            <Text style={styles.subtitle}>
              Ask Questions, Get Personalized Guidance
            </Text>
          </View>

          {/* Example Questions */}
          <View style={styles.exampleQuestionsContainer}>
            <FlatList
              horizontal
              data={EXAMPLE_QUESTIONS}
              renderItem={renderExampleQuestion}
              keyExtractor={(item, index) => index.toString()}
              showsHorizontalScrollIndicator={false}
            />
          </View>

          {/* Messages Scroll View */}
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesScrollView}
            contentContainerStyle={styles.messagesContainer}
            onContentSizeChange={() =>
              scrollViewRef.current?.scrollToEnd({ animated: true })
            }
          >
            {messages.map(renderMessage)}
          </ScrollView>

          {/* Input Container */}
          <View style={styles.inputContainer}>
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="Ask a question..."
              placeholderTextColor="#FFD7E6"
              style={styles.input}
              returnKeyType="send"
              onSubmitEditing={() => handleSendMessage()}
              editable={!isProcessing}
            />
            <TouchableOpacity
              onPress={() => handleSendMessage()}
              style={[
                styles.sendButton,
                (isProcessing || inputText.trim() === "") &&
                  styles.sendButtonDisabled,
              ]}
              disabled={isProcessing || inputText.trim() === ""}
            >
              <Ionicons name="send" color="#FFFFFF" size={width * 0.06} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    width: width * 0.9,
    alignSelf: "center",
  },
  heroSection: {
    alignItems: "center",
    marginBottom: height * 0.02,
  },
  title: {
    fontSize: width * 0.07,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: height * 0.01,
  },
  subtitle: {
    fontSize: width * 0.04,
    color: "#FFD7E6",
    textAlign: "center",
  },
  exampleQuestionsContainer: {
    marginBottom: height * 0.02,
  },
  exampleQuestionContainer: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 5,
    maxWidth: width * 0.7,
  },
  exampleQuestionText: {
    fontSize: width * 0.035,
    color: "#FFFFFF",
    textAlign: "center",
  },
  messagesScrollView: {
    flex: 1,
  },
  messagesContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  messageContainer: {
    maxWidth: "80%",
    padding: width * 0.04,
    marginVertical: height * 0.01,
    borderRadius: 15,
    minHeight: 50,
    justifyContent: "center",
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  botMessage: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  messageText: {
    fontSize: width * 0.04,
    color: "#FFFFFF",
  },
  urlLinkText: {
    fontSize: width * 0.03,
    color: "#FFD7E6",
    marginTop: 5,
  },
  webview: {
    width: width * 0.9,
    height: height * 0.4,
    alignSelf: "center",
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: height * 0.02,
  },
  input: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    padding: width * 0.04,
    color: "#FFFFFF",
    marginRight: width * 0.03,
  },
  sendButton: {
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 50,
    padding: width * 0.03,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  loadingIndicator: {
    alignSelf: "center",
  },
});
