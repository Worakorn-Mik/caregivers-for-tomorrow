import { ActivityIndicator, Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { color, radius, space } from "@/theme/tokens";
import { Txt } from "./Txt";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "lg" | "md" | "sm";

interface Props {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  icon?: keyof typeof Ionicons.glyphMap;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
}

const BG: Record<Variant, string> = {
  primary: color.primary,
  secondary: color.primarySoft,
  ghost: "transparent",
  danger: color.dangerSoft,
};
const FG: Record<Variant, string> = {
  primary: color.white,
  secondary: color.primaryDark,
  ghost: color.body,
  danger: color.danger,
};
const PAD: Record<Size, ViewStyle> = {
  lg: { paddingVertical: 15, paddingHorizontal: space.xl },
  md: { paddingVertical: 11, paddingHorizontal: space.lg },
  sm: { paddingVertical: 7, paddingHorizontal: space.md },
};

export function Button({
  label,
  onPress,
  variant = "primary",
  size = "lg",
  icon,
  loading,
  disabled,
  fullWidth,
  style,
}: Props) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        PAD[size],
        {
          backgroundColor: BG[variant],
          borderWidth: variant === "ghost" ? 1 : 0,
          borderColor: color.borderStrong,
          opacity: isDisabled ? 0.5 : pressed ? 0.9 : 1,
          transform: [{ scale: pressed && !isDisabled ? 0.985 : 1 }],
          alignSelf: fullWidth ? "stretch" : "flex-start",
        },
        style,
      ]}
    >
      <View style={styles.inner}>
        {loading ? (
          <ActivityIndicator color={FG[variant]} size="small" />
        ) : (
          <>
            {icon && (
              <Ionicons
                name={icon}
                size={size === "sm" ? 15 : 18}
                color={FG[variant]}
              />
            )}
            <Txt
              variant={size === "sm" ? "smallMedium" : "bodyMedium"}
              color={FG[variant]}
            >
              {label}
            </Txt>
          </>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
  },
});
