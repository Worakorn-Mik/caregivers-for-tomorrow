import { Text, TextProps, StyleSheet } from "react-native";
import { color, type as typeToken } from "@/theme/tokens";

type Variant = keyof typeof typeToken;

interface Props extends TextProps {
  variant?: Variant;
  color?: string;
  center?: boolean;
}

export function Txt({
  variant = "body",
  color: c = color.body,
  center,
  style,
  ...rest
}: Props) {
  return (
    <Text
      {...rest}
      style={[
        typeToken[variant],
        { color: c },
        center && styles.center,
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  center: { textAlign: "center" },
});
