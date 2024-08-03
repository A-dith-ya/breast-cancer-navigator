import { View, TouchableOpacity, StyleSheet } from "react-native";
import { ThemedText } from "./ThemedText";
import { useTheme } from "./ThemedContext";

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
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  selected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#000",
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
});
