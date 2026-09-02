import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { color, radius, space } from "@/theme/tokens";
import { useStore } from "@/data/store";
import { Txt } from "@/components/Txt";
import { Button } from "@/components/Button";
import { Row } from "@/components/bits";

const POINTS: { icon: keyof typeof Ionicons.glyphMap; text: string }[] = [
  { icon: "shield-checkmark", text: "ตรวจสอบประวัติ + ใบประกอบวิชาชีพทุกคน" },
  { icon: "layers", text: "เลือกระดับผู้ดูแลให้ตรงกับอาการผู้ป่วย" },
  { icon: "time", text: "จ้างเป็นรายชั่วโมง จ่ายเท่าที่ใช้จริง" },
];

export default function Welcome() {
  const router = useRouter();
  const { setRole } = useStore();
  const insets = useSafeAreaInsets();

  const enter = (role: "seeker" | "caregiver") => {
    setRole(role);
    router.replace("/(tabs)");
  };

  return (
    <View style={{ flex: 1, backgroundColor: color.primary }}>
      <LinearGradient
        colors={[color.primary, "#0C8A8A", color.primaryDark]}
        style={[styles.hero, { paddingTop: insets.top + space.huge }]}
      >
        <View style={styles.logo}>
          <Ionicons name="heart-circle" size={40} color={color.white} />
        </View>
        <Txt variant="display" color={color.white} style={{ marginTop: space.lg }}>
          Caregivers{"\n"}For Tomorrow
        </Txt>
        <Txt variant="body" color="rgba(255,255,255,0.9)" style={{ marginTop: space.sm }}>
          จับคู่ผู้ดูแลผู้สูงอายุและผู้ป่วยที่บ้าน{"\n"}แบบเฉพาะกิจ รายชั่วโมง
        </Txt>
      </LinearGradient>

      <View style={[styles.sheet, { paddingBottom: insets.bottom + space.xl }]}>
        <View style={{ gap: space.md, marginBottom: space.xl }}>
          {POINTS.map((p) => (
            <Row key={p.text} gap={space.md}>
              <View style={styles.pointIcon}>
                <Ionicons name={p.icon} size={18} color={color.primaryDark} />
              </View>
              <Txt variant="small" color={color.body} style={{ flex: 1 }}>
                {p.text}
              </Txt>
            </Row>
          ))}
        </View>

        <Button
          label="ฉันต้องการหาผู้ดูแล"
          icon="search"
          fullWidth
          onPress={() => enter("seeker")}
        />
        <View style={{ height: space.sm }} />
        <Button
          label="ฉันเป็นผู้ดูแล รับงาน"
          icon="briefcase-outline"
          variant="secondary"
          fullWidth
          onPress={() => enter("caregiver")}
        />
        <Txt variant="tiny" color={color.faint} center style={{ marginTop: space.lg }}>
          เดโมสำหรับ Samsung Solve for Tomorrow 2026 · ทีม SK Outlier
        </Txt>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingHorizontal: space.xl,
    paddingBottom: space.huge,
  },
  logo: {
    width: 68,
    height: 68,
    borderRadius: radius.pill,
    backgroundColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    justifyContent: "center",
  },
  sheet: {
    flex: 1,
    backgroundColor: color.bg,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    marginTop: -space.xl,
    paddingHorizontal: space.xl,
    paddingTop: space.xl,
  },
  pointIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    backgroundColor: color.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
});
