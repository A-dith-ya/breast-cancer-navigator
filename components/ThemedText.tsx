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
    | "section";
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
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: width * 0.04,
    lineHeight: height * 0.03,
  },
  defaultSemiBold: {
    fontSize: width * 0.04,
    lineHeight: height * 0.03,
    fontWeight: "600",
  },
  title: {
    fontSize: width * 0.08,
    fontWeight: "bold",
    lineHeight: height * 0.05,
    marginBottom: height * 0.05,
  },
  sectionTitle: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    lineHeight: height * 0.035,
    marginBottom: height * 0.025,
  },
  section: {
    fontSize: width * 0.05,
    lineHeight: height * 0.03,
    marginBottom: height * 0.025,
    width: width * 0.9,
  },
  subtitle: {
    fontSize: width * 0.05,
    fontWeight: "bold",
  },
  link: {
    lineHeight: height * 0.0375,
    fontSize: width * 0.04,
    color: "#0a7ea4",
  },
});
