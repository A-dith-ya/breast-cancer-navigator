import React from "react";
import { TextInput, type TextInputProps, StyleSheet } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedTextInputProps = TextInputProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "outlined" | "filled";
};

export function ThemedTextInput({
  style,
  lightColor,
  darkColor,
  type = "default",
  ...rest
}: ThemedTextInputProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  return (
    <TextInput
      style={[
        { color, backgroundColor },
        type === "default" ? styles.default : undefined,
        type === "outlined" ? styles.outlined : undefined,
        type === "filled" ? styles.filled : undefined,
        style,
      ]}
      placeholderTextColor={"#C7C7CD"}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
  },
  outlined: {
    fontSize: 16,
    padding: 12,
    borderWidth: 2,
    borderColor: "#000",
    borderRadius: 4,
  },
  filled: {
    fontSize: 16,
    padding: 12,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
  },
});
