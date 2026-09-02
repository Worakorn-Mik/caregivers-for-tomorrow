import { StyleSheet, View, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { color, radius, space } from "@/theme/tokens";
import { Txt } from "./Txt";

export function Divider({ style }: { style?: ViewStyle }) {
  return <View style={[styles.divider, style]} />;
}

export function Row({
  children,
  gap = space.sm,
  style,
}: {
  children: React.ReactNode;
  gap?: number;
  style?: ViewStyle;
}) {
  return (
    <View style={[{ flexDirection: "row", alignItems: "center", gap }, style]}>
      {children}
    </View>
  );
}

export function SectionTitle({
  title,
  hint,
  style,
}: {
  title: string;
  hint?: string;
  style?: ViewStyle;
}) {
  return (
    <View style={[{ marginBottom: space.md }, style]}>
      <Txt variant="h2" color={color.ink}>
        {title}
      </Txt>
      {hint && (
        <Txt variant="small" color={color.muted} style={{ marginTop: 2 }}>
          {hint}
        </Txt>
      )}
    </View>
  );
}

export function InfoLine({
  icon,
  children,
  tint = color.muted,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  children: React.ReactNode;
  tint?: string;
}) {
  return (
    <View style={styles.infoLine}>
      <Ionicons name={icon} size={16} color={tint} style={{ marginTop: 2 }} />
      <Txt variant="small" color={color.body} style={{ flex: 1 }}>
        {children}
      </Txt>
    </View>
  );
}

export function EmptyState({
  icon = "file-tray",
  title,
  subtitle,
}: {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
}) {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyIcon}>
        <Ionicons name={icon} size={26} color={color.faint} />
      </View>
      <Txt variant="h3" color={color.body} center>
        {title}
      </Txt>
      {subtitle && (
        <Txt variant="small" color={color.muted} center style={{ marginTop: 4 }}>
          {subtitle}
        </Txt>
      )}
    </View>
  );
}

export function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ alignItems: "center", flex: 1 }}>
      <Txt variant="h3" color={color.ink}>
        {value}
      </Txt>
      <Txt variant="tiny" color={color.muted} style={{ marginTop: 2 }}>
        {label}
      </Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: color.border,
    marginVertical: space.md,
  },
  infoLine: {
    flexDirection: "row",
    gap: space.sm,
    alignItems: "flex-start",
    marginBottom: space.sm,
  },
  empty: {
    alignItems: "center",
    paddingVertical: space.huge,
    paddingHorizontal: space.xl,
  },
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    backgroundColor: color.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: space.md,
  },
});
