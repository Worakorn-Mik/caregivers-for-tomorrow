import { useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { color, space } from "@/theme/tokens";
import { useStore } from "@/data/store";
import { MOBILITY_HINT, MOBILITY_LABEL, TIER_LABEL } from "@/data/catalog";
import type { CaregiverTier } from "@/data/types";
import { Screen } from "@/components/Screen";
import { Txt } from "@/components/Txt";
import { Card } from "@/components/Card";
import { Chip } from "@/components/Chip";
import { Row } from "@/components/bits";
import { CaregiverCard } from "@/components/CaregiverCard";

type TierFilter = "all" | CaregiverTier;

const TIER_FILTERS: { key: TierFilter; label: string }[] = [
  { key: "all", label: "ทั้งหมด" },
  { key: "assistant", label: "ผู้ช่วยดูแล" },
  { key: "na_pn", label: "NA / PN" },
  { key: "rn", label: "RN" },
];

export default function Browse() {
  const router = useRouter();
  const { caregivers, patients } = useStore();
  const [patientId, setPatientId] = useState(patients[0]?.id ?? "");
  const [tier, setTier] = useState<TierFilter>("all");

  const patient = patients.find((p) => p.id === patientId);

  const list = useMemo(() => {
    let items = [...caregivers];
    if (tier !== "all") items = items.filter((c) => c.tier === tier);
    if (patient) {
      items.sort((a, b) => {
        const af = a.acceptsMobility.includes(patient.mobility) ? 0 : 1;
        const bf = b.acceptsMobility.includes(patient.mobility) ? 0 : 1;
        if (af !== bf) return af - bf;
        return b.ratingAvg - a.ratingAvg;
      });
    } else {
      items.sort((a, b) => b.ratingAvg - a.ratingAvg);
    }
    return items;
  }, [caregivers, tier, patient]);

  return (
    <Screen>
      <Txt variant="small" color={color.muted}>
        กำลังหาผู้ดูแลให้
      </Txt>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginTop: space.sm, marginHorizontal: -space.lg }}
        contentContainerStyle={{ paddingHorizontal: space.lg, gap: space.sm }}
      >
        {patients.map((p) => (
          <Chip
            key={p.id}
            label={`${p.relation} · ${p.name}`}
            selected={p.id === patientId}
            onPress={() => setPatientId(p.id)}
          />
        ))}
        <Chip label="+ เพิ่มผู้รับการดูแล" onPress={() => router.push("/(tabs)/profile")} />
      </ScrollView>

      {patient && (
        <Card flat style={{ marginTop: space.md, backgroundColor: color.primaryTint }}>
          <Row gap={space.sm} style={{ alignItems: "flex-start" }}>
            <Ionicons name="information-circle" size={18} color={color.primaryDark} />
            <View style={{ flex: 1 }}>
              <Txt variant="smallMedium" color={color.primaryDark}>
                {patient.name} · {MOBILITY_LABEL[patient.mobility]}
              </Txt>
              <Txt variant="small" color={color.body} style={{ marginTop: 2 }}>
                {MOBILITY_HINT[patient.mobility]}
              </Txt>
            </View>
          </Row>
        </Card>
      )}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginTop: space.lg, marginHorizontal: -space.lg }}
        contentContainerStyle={{ paddingHorizontal: space.lg, gap: space.sm }}
      >
        {TIER_FILTERS.map((f) => (
          <Chip
            key={f.key}
            label={f.label}
            selected={tier === f.key}
            onPress={() => setTier(f.key)}
          />
        ))}
      </ScrollView>

      <Row style={{ justifyContent: "space-between", marginTop: space.lg, marginBottom: space.sm }}>
        <Txt variant="h3" color={color.ink}>
          {tier === "all" ? "ผู้ดูแลที่พร้อมรับงาน" : TIER_LABEL[tier]}
        </Txt>
        <Txt variant="small" color={color.muted}>
          {list.length} คน
        </Txt>
      </Row>

      {list.map((c) => (
        <CaregiverCard
          key={c.id}
          caregiver={c}
          onPress={() =>
            router.push({
              pathname: "/caregiver/[id]",
              params: { id: c.id, patientId },
            })
          }
        />
      ))}
    </Screen>
  );
}
