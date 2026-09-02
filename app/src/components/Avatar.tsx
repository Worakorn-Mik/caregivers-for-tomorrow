import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";
import { color } from "@/theme/tokens";

export function Avatar({
  uri,
  size = 48,
  ring,
}: {
  uri: string;
  size?: number;
  ring?: boolean;
}) {
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: ring ? 2 : StyleSheet.hairlineWidth,
          borderColor: ring ? color.surface : color.border,
        },
        ring && styles.ring,
      ]}
    >
      <Image
        source={{ uri }}
        style={{ width: "100%", height: "100%", borderRadius: size / 2 }}
        contentFit="cover"
        transition={200}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  ring: {
    shadowColor: "#0B2942",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
});
