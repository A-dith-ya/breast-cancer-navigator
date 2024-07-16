import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

interface RadioButtonProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export function RadioButton({ label, selected, onPress }: RadioButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.radio}>
        {selected && <View style={styles.selected} />}
      </View>
      <Text style={styles.label}>{label}</Text>
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
    borderColor: "#000",
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
    marginTop: 2,
  },
});
