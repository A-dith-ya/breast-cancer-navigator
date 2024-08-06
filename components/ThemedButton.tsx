import {
  TouchableOpacity,
  type TouchableOpacityProps,
  StyleSheet,
  Dimensions,
} from "react-native";
import { ThemedText, type ThemedTextProps } from "./ThemedText";

import { useThemeColor } from "@/hooks/useThemeColor";

const { width } = Dimensions.get("window");

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
    "tabIconDefault"
  );

  return (
    <TouchableOpacity
      style={[{ backgroundColor }, styles.button, style]}
      onPress={onPress}
      {...rest}
    >
      <ThemedText type={type}>{text}</ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: width * 0.03,
    borderRadius: (width * 0.03) / 2,
  },
});
