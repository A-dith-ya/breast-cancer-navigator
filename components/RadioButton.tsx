import { View, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { ThemedText } from "./ThemedText";
import { useTheme } from "./ThemedContext";

const { width, height } = Dimensions.get("window");

interface RadioButtonProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export function RadioButton({ label, selected, onPress }: RadioButtonProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={[styles.radio, { borderColor: colors.text }]}>
        {selected && (
          <View style={[styles.selected, { backgroundColor: colors.text }]} />
        )}
      </View>
      <ThemedText style={styles.label}>{label}</ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: height * 0.012,
    paddingHorizontal: width * 0.02,
    flexWrap: "wrap",
  },
  radio: {
    width: width * 0.05,
    height: width * 0.05,
    borderRadius: (width * 0.05) / 2,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: width * 0.02,
  },
  selected: {
    width: width * 0.0254,
    height: width * 0.0254,
    borderRadius: (width * 0.025) / 2,
    backgroundColor: "#000",
  },
  label: {
    fontSize: width * 0.046,
  },
});
