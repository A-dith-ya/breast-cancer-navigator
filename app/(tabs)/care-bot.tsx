import React, { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
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
  "When can I return to daily activities, and what should I keep in mind?",
  "What nutrients are important to include in my diet?",
  "How can I prevent and detect lymphedema?",
  "What should I expect during follow-up care?",
  "How can I lower my risk of breast cancer coming back?",
  "What are some ways to cope with the emotional effects of breast cancer?",
  "How does breast cancer affect fertility, body image, and sexuality?",
  "Where can I find support groups for breast cancer?",
  "What does a healthy wellness plan look like?",
  "Where can I find financial assistance?",
  "How can I handle relationship challenges during treatment?",
  "What should I consider when making an advance care plan?",
  "What is palliative care?",
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
            {/* <Text style={styles.subtitle}>
              Ask Questions, Get Personalized Guidance
            </Text> */}
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
              <Ionicons name="send" color="#FFFFFF" size={20} />
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
    width: "90%",
    alignSelf: "center",
  },
  heroSection: {
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#FFD7E6",
    textAlign: "center",
  },
  exampleQuestionsContainer: {
    marginBottom: 16,
  },
  exampleQuestionContainer: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginHorizontal: 4,
    maxWidth: 280,
  },
  exampleQuestionText: {
    fontSize: 14,
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
    padding: 12,
    marginVertical: 8,
    borderRadius: 12,
    minHeight: 40,
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
    fontSize: 16,
    color: "#FFFFFF",
  },
  urlLinkText: {
    fontSize: 12,
    color: "#FFD7E6",
    marginTop: 5,
  },
  webview: {
    width: "90%",
    height: 280,
    alignSelf: "center",
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  input: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 16,
    padding: 12,
    color: "#FFFFFF",
    marginRight: 12,
  },
  sendButton: {
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 24,
    padding: 10,
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
