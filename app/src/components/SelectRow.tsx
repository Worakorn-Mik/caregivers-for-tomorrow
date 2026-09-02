import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { color, radius, space } from "@/theme/tokens";
import { Txt } from "./Txt";

interface Props {
  title: string;
  subtitle?: string;
  selected: boolean;
  onPress: () => void;
  mode?: "check" | "radio";
  disabled?: boolean;
  disabledHint?: string;
}

export function SelectRow({
  title,
  subtitle,
  selected,
  onPress,
  mode = "check",
  disabled,
  disabledHint,
}: Props) {
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      style={({ pressed }) => [
        styles.row,
        {
          borderColor: selected ? color.primary : color.border,
          backgroundColor: selected ? color.primaryTint : color.surface,
          opacity: disabled ? 0.5 : pressed ? 0.9 : 1,
        },
      ]}
    >
      <View
        style={[
          styles.marker,
          {
            borderRadius: mode === "radio" ? radius.pill : 7,
            borderColor: selected ? color.primary : color.borderStrong,
            backgroundColor: selected ? color.primary : "transparent",
          },
        ]}
      >
        {selected && <Ionicons name="checkmark" size={14} color={color.white} />}
      </View>
      <View style={{ flex: 1 }}>
        <Txt variant="bodyMedium" color={color.ink}>
          {title}
        </Txt>
        {(subtitle || (disabled && disabledHint)) && (
          <Txt variant="small" color={color.muted} style={{ marginTop: 2 }}>
            {disabled && disabledHint ? disabledHint : subtitle}
          </Txt>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: space.md,
    marginBottom: space.sm,
  },
  marker: {
    width: 24,
    height: 24,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
});
