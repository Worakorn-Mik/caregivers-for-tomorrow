import { ReactNode } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { color, space } from "@/theme/tokens";

interface Props {
  children: ReactNode;
  scroll?: boolean;
  padded?: boolean;
  footer?: ReactNode;
  background?: string;
}

export function Screen({
  children,
  scroll = true,
  padded = true,
  footer,
  background = color.bg,
}: Props) {
  const insets = useSafeAreaInsets();
  const body = (
    <View style={[padded && styles.padded, { paddingBottom: space.xxxl }]}>
      {children}
    </View>
  );

  return (
    <View style={[styles.root, { backgroundColor: background }]}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={{ paddingBottom: footer ? 0 : insets.bottom + space.lg }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {body}
        </ScrollView>
      ) : (
        body
      )}
      {footer && (
        <View
          style={[
            styles.footer,
            { paddingBottom: insets.bottom + space.md },
          ]}
        >
          {footer}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  padded: { paddingHorizontal: space.lg, paddingTop: space.lg },
  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: color.border,
    backgroundColor: color.surface,
    paddingHorizontal: space.lg,
    paddingTop: space.md,
  },
});
