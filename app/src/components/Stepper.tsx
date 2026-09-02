import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { color, radius, space } from "@/theme/tokens";
import { Txt } from "./Txt";

export function Stepper({
  value,
  onChange,
  min = 1,
  max = 12,
  suffix = "ชม.",
}: {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  suffix?: string;
}) {
  const dec = () => onChange(Math.max(min, value - 1));
  const inc = () => onChange(Math.min(max, value + 1));
  return (
    <View style={styles.wrap}>
      <Btn icon="remove" onPress={dec} disabled={value <= min} />
      <View style={styles.valueBox}>
        <Txt variant="h3" color={color.ink}>
          {value} {suffix}
        </Txt>
      </View>
      <Btn icon="add" onPress={inc} disabled={value >= max} />
    </View>
  );
}

function Btn({
  icon,
  onPress,
  disabled,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.btn,
        { opacity: disabled ? 0.35 : pressed ? 0.7 : 1 },
      ]}
    >
      <Ionicons name={icon} size={20} color={color.primaryDark} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: color.surface,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: color.borderStrong,
    padding: 4,
    gap: space.xs,
  },
  btn: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: color.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  valueBox: { minWidth: 84, alignItems: "center" },
});
