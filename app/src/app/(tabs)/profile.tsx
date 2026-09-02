import { View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { color, radius, space } from "@/theme/tokens";
import { useStore } from "@/data/store";
import { MOBILITY_LABEL, TIER_BLURB, TIER_LABEL } from "@/data/catalog";
import type { CaregiverTier } from "@/data/types";
import { Screen } from "@/components/Screen";
import { Txt } from "@/components/Txt";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Divider, InfoLine, Row, SectionTitle } from "@/components/bits";

const TIERS: CaregiverTier[] = ["assistant", "na_pn", "rn"];

const SAFETY = [
  "ยืนยันบัตรประชาชนและใบหน้า (liveness) ก่อนรับงานครั้งแรก",
  "ตรวจสอบใบประกอบวิชาชีพกับสภาการพยาบาลสำหรับระดับ NA/PN และ RN",
  "ขอผลตรวจประวัติอาชญากรรมจาก สตช. ประกอบการอนุมัติ",
  "เช็คอิน/เช็คเอาท์ด้วยพิกัด GPS ทุกครั้งที่ทำงาน",
  "ให้คะแนนสองทาง และมีช่องทางแจ้งเหตุ + นโยบายระงับบัญชี",
];

export default function Profile() {
  const router = useRouter();
  const { role, setRole, patients } = useStore();

  return (
    <Screen>
      <Card>
        <Row gap={space.md}>
          <View style={styles_avatar}>
            <Ionicons name="person" size={26} color={color.primaryDark} />
          </View>
          <View style={{ flex: 1 }}>
            <Txt variant="h3" color={color.ink}>
              ผู้ใช้เดโม
            </Txt>
            <Txt variant="small" color={color.muted}>
              กำลังใช้งานในบทบาท:{" "}
              {role === "seeker" ? "ผู้หาผู้ดูแล" : "ผู้ดูแล (รับงาน)"}
            </Txt>
          </View>
        </Row>
        <Divider />
        <Button
          label={
            role === "seeker" ? "สลับเป็นมุมมองผู้ดูแล" : "สลับเป็นมุมมองผู้หาผู้ดูแล"
          }
          variant="ghost"
          size="md"
          icon="swap-horizontal"
          fullWidth
          onPress={() => setRole(role === "seeker" ? "caregiver" : "seeker")}
        />
      </Card>

      <SectionTitle
        title="ผู้รับการดูแล"
        hint="ระดับการช่วยเหลือตัวเองใช้จับคู่กับระดับผู้ดูแลที่เหมาะสม"
        style={{ marginTop: space.xl }}
      />
      {patients.map((p) => (
        <Card key={p.id} style={{ marginBottom: space.sm }}>
          <Row style={{ justifyContent: "space-between" }}>
            <Txt variant="bodyMedium" color={color.ink}>
              {p.relation} · {p.name}
            </Txt>
            <Txt variant="smallMedium" color={color.primaryDark}>
              {MOBILITY_LABEL[p.mobility]}
            </Txt>
          </Row>
          <Txt variant="small" color={color.muted} style={{ marginTop: 4 }}>
            {p.conditions}
          </Txt>
        </Card>
      ))}

      <SectionTitle title="ระดับผู้ดูแล 3 ระดับ" style={{ marginTop: space.xl }} />
      {TIERS.map((t) => (
        <Card key={t} flat style={{ marginBottom: space.sm }}>
          <Txt variant="smallMedium" color={color.ink}>
            {TIER_LABEL[t]}
          </Txt>
          <Txt variant="small" color={color.muted} style={{ marginTop: 2 }}>
            {TIER_BLURB[t]}
          </Txt>
        </Card>
      ))}

      <SectionTitle
        title="เราคัดกรองความปลอดภัยอย่างไร"
        style={{ marginTop: space.xl }}
      />
      <Card>
        {SAFETY.map((s) => (
          <InfoLine key={s} icon="checkmark-circle" tint={color.success}>
            {s}
          </InfoLine>
        ))}
      </Card>

      <Card flat style={{ marginTop: space.lg, backgroundColor: color.primaryTint }}>
        <Txt variant="smallMedium" color={color.primaryDark}>
          เกี่ยวกับโครงงาน
        </Txt>
        <Txt variant="small" color={color.body} style={{ marginTop: 4 }}>
          Caregivers For Tomorrow — Samsung Solve for Tomorrow 2026 · ทีม SK Outlier
          โรงเรียนสวนกุหลาบวิทยาลัย เดโมนี้ใช้ข้อมูลจำลองทั้งหมด
        </Txt>
      </Card>
    </Screen>
  );
}

const styles_avatar = {
  width: 52,
  height: 52,
  borderRadius: radius.pill,
  backgroundColor: color.primarySoft,
  alignItems: "center" as const,
  justifyContent: "center" as const,
};
