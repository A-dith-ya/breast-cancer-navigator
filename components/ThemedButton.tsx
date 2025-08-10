import {
  TouchableOpacity,
  type TouchableOpacityProps,
  StyleSheet,
} from "react-native";
import { ThemedText, type ThemedTextProps } from "./ThemedText";

import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedButtonProps = TouchableOpacityProps & {
  lightColor?: string;
  darkColor?: string;
  text?: string;
  type?: ThemedTextProps["type"];
  onPress?: () => void;
};

export function ThemedButton({
  style,
  lightColor,
  darkColor,
  text,
  type = "default",
  onPress,
  ...rest
}: ThemedButtonProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "button"
  );
  const buttonTextColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "buttonText"
  );

  return (
    <TouchableOpacity
      style={[{ backgroundColor }, styles.button, style]}
      onPress={onPress}
      {...rest}
    >
      <ThemedText type={type} style={{ color: buttonTextColor }}>
        {text}
      </ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
});
