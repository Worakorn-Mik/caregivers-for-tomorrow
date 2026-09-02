import { Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { color, space } from "@/theme/tokens";
import { Txt } from "./Txt";

export function RatingStars({
  value,
  count,
  size = 14,
  showNumber = true,
}: {
  value: number;
  count?: number;
  size?: number;
  showNumber?: boolean;
}) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
      <Ionicons name="star" size={size} color="#F5A623" />
      {showNumber && (
        <Txt variant="smallMedium" color={color.ink}>
          {value.toFixed(1)}
        </Txt>
      )}
      {count != null && (
        <Txt variant="small" color={color.muted}>
          ({count})
        </Txt>
      )}
    </View>
  );
}

export function StarInput({
  value,
  onChange,
  size = 34,
}: {
  value: number;
  onChange: (n: number) => void;
  size?: number;
}) {
  return (
    <View style={{ flexDirection: "row", gap: space.sm }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Pressable key={n} onPress={() => onChange(n)} hitSlop={6}>
          <Ionicons
            name={n <= value ? "star" : "star-outline"}
            size={size}
            color={n <= value ? "#F5A623" : color.borderStrong}
          />
        </Pressable>
      ))}
    </View>
  );
}
