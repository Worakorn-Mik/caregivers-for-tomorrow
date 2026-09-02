import { Pressable, StyleSheet } from "react-native";
import { color, radius, space } from "@/theme/tokens";
import { Txt } from "./Txt";

interface Props {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}

export function Chip({ label, selected, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        selected ? styles.selected : styles.unselected,
        pressed && { opacity: 0.85 },
      ]}
    >
      <Txt
        variant="smallMedium"
        color={selected ? color.white : color.body}
      >
        {label}
      </Txt>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingVertical: 8,
    paddingHorizontal: space.lg,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  selected: {
    backgroundColor: color.primary,
    borderColor: color.primary,
  },
  unselected: {
    backgroundColor: color.surface,
    borderColor: color.borderStrong,
  },
});
