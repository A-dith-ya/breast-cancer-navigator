import {
  TouchableOpacity,
  type TouchableOpacityProps,
  StyleSheet,
  Dimensions,
} from "react-native";
import { ThemedText } from "./ThemedText";

import { useThemeColor } from "@/hooks/useThemeColor";

const { width } = Dimensions.get("window");

export type ThemedButtonProps = TouchableOpacityProps & {
  lightColor?: string;
  darkColor?: string;
  text?: string;
  onPress?: () => void;
};

export function ThemedButton({
  style,
  lightColor,
  darkColor,
  text,
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
      <ThemedText>{text}</ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: width * 0.03,
    borderRadius: (width * 0.03) / 2,
  },
});
