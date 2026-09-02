import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { color, radius, shadow, space } from "@/theme/tokens";

interface Props {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  padded?: boolean;
  flat?: boolean;
}

export function Card({ children, onPress, style, padded = true, flat }: Props) {
  const content = (
    <View
      style={[
        styles.card,
        padded && styles.padded,
        flat ? styles.flat : shadow.card,
        style,
      ]}
    >
      {children}
    </View>
  );
  if (!onPress) return content;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({ opacity: pressed ? 0.96 : 1, transform: [{ scale: pressed ? 0.992 : 1 }] })}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: color.surface,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: color.border,
  },
  padded: { padding: space.lg },
  flat: { backgroundColor: color.surfaceAlt },
});
