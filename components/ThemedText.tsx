import { Text, type TextProps, StyleSheet, Dimensions } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

const { width, height } = Dimensions.get("window");

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?:
    | "default"
    | "title"
    | "defaultSemiBold"
    | "subtitle"
    | "link"
    | "sectionTitle"
    | "section"
    | "buttonTitle";
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return (
    <Text
      style={[
        { color },
        type === "default" ? styles.default : undefined,
        type === "title" ? styles.title : undefined,
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type === "sectionTitle" ? styles.sectionTitle : undefined,
        type === "section" ? styles.section : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "link" ? styles.link : undefined,
        type === "buttonTitle" ? styles.buttonTitle : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: width * 0.04,
  },
  defaultSemiBold: {
    fontSize: width * 0.04,
    fontWeight: "600",
  },
  title: {
    fontSize: width * 0.08,
    fontWeight: "bold",
    marginBottom: height * 0.05,
  },
  sectionTitle: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    marginBottom: height * 0.025,
  },
  section: {
    fontSize: width * 0.05,
    marginBottom: height * 0.025,
    width: width * 0.9,
  },
  subtitle: {
    fontSize: width * 0.05,
    fontWeight: "bold",
  },
  link: {
    fontSize: width * 0.04,
    color: "#0a7ea4",
  },
  buttonTitle: {
    fontSize: width * 0.06,
    fontWeight: 500,
  },
});
