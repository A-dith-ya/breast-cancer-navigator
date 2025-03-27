import React, { useState, useRef, useCallback } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { WebView } from "react-native-webview";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { ThemedButton } from "@/components/ThemedButton";
import { getWebResource } from "@/services/openAiService";
import { SCROLL_TO_CHAPTER } from "@/constants/InjectedJavascript";
import { Linking } from "react-native";

const { width, height } = Dimensions.get("window");

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  url?: string;
  isLoading?: boolean;
}

export default function CarebotScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const webviewRefs = useRef<WebView[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSendMessage = useCallback(async () => {
    if (inputText.trim() === "") return;

    // Create user message
    const userMessage: Message = {
      id: Date.now(),
      text: inputText,
      sender: "user",
    };

    // Create loading bot message
    const loadingBotMessage: Message = {
      id: Date.now() + 1,
      text: "Searching...",
      sender: "bot",
      isLoading: true,
    };

    // Update messages with user message and loading indicator
    setMessages((prevMessages) => [
      ...prevMessages,
      userMessage,
      loadingBotMessage,
    ]);
    setInputText("");
    Keyboard.dismiss();

    // Determine bot response based on input
    try {
      const webResource = await getWebResource(inputText);

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
    }
  }, [inputText]);

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
              <ThemedText
                style={[styles.messageText, message.url && styles.urlText]}
              >
                {message.text}
              </ThemedText>
              {message.url && (
                <ThemedText style={styles.urlLinkText}>
                  Tap to open full resource
                </ThemedText>
              )}
            </>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      <ThemedView style={styles.container}>
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.messagesContainer}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }
        >
          {messages.map(renderMessage)}
        </ScrollView>
        <ThemedView style={styles.inputContainer}>
          <ThemedTextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask a question..."
            style={styles.input}
            returnKeyType="send"
            onSubmitEditing={handleSendMessage}
          />
          <ThemedButton
            text="Send"
            onPress={handleSendMessage}
            style={styles.sendButton}
          />
        </ThemedView>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messagesContainer: {
    padding: 10,
    paddingBottom: 20,
  },
  webview: {
    width: width * 0.9,
    height: height * 0.4,
    alignSelf: "center",
    marginBottom: 10,
  },
  messageContainer: {
    maxWidth: "80%",
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    minHeight: 50,
    justifyContent: "center",
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#0d47a1",
  },
  botMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#121212",
  },
  messageText: {
    fontSize: 16,
    color: "white",
  },
  urlText: {
    color: "lightblue",
  },
  urlLinkText: {
    fontSize: 12,
    color: "lightgrey",
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
  },
  input: {
    flex: 1,
    marginRight: 10,
    padding: 10,
    borderWidth: 1,
    borderRadius: 20,
  },
  sendButton: {
    paddingHorizontal: 15,
  },
  loadingIndicator: {
    alignSelf: "center",
  },
});

export default CarebotScreen;
