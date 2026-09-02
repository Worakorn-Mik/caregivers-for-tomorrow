import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { color, radius, space } from "@/theme/tokens";
import { Txt } from "./Txt";
import { TIER_SHORT } from "@/data/catalog";
import type { BookingStatus, CaregiverTier, VerificationStatus } from "@/data/types";

const TIER_BG: Record<CaregiverTier, string> = {
  assistant: color.tierAssistantSoft,
  na_pn: color.tierNaPnSoft,
  rn: color.tierRnSoft,
};
const TIER_FG: Record<CaregiverTier, string> = {
  assistant: color.tierAssistant,
  na_pn: color.tierNaPn,
  rn: color.tierRn,
};

export function TierBadge({ tier, small }: { tier: CaregiverTier; small?: boolean }) {
  return (
    <View
      style={[
        styles.pill,
        { backgroundColor: TIER_BG[tier] },
        small && styles.pillSmall,
      ]}
    >
      <Ionicons
        name={tier === "rn" ? "medkit" : tier === "na_pn" ? "pulse" : "heart"}
        size={small ? 11 : 13}
        color={TIER_FG[tier]}
      />
      <Txt variant={small ? "tiny" : "smallMedium"} color={TIER_FG[tier]}>
        {TIER_SHORT[tier]}
      </Txt>
    </View>
  );
}

export function VerifiedBadge({ status }: { status: VerificationStatus }) {
  if (status === "verified") {
    return (
      <View style={[styles.pill, { backgroundColor: color.successSoft }]}>
        <Ionicons name="shield-checkmark" size={13} color={color.success} />
        <Txt variant="smallMedium" color={color.success}>
          ยืนยันตัวตนแล้ว
        </Txt>
      </View>
    );
  }
  if (status === "pending") {
    return (
      <View style={[styles.pill, { backgroundColor: color.warningSoft }]}>
        <Ionicons name="time" size={13} color={color.warning} />
        <Txt variant="smallMedium" color={color.warning}>
          กำลังตรวจสอบ
        </Txt>
      </View>
    );
  }
  return (
    <View style={[styles.pill, { backgroundColor: color.surfaceAlt }]}>
      <Ionicons name="help-circle" size={13} color={color.muted} />
      <Txt variant="smallMedium" color={color.muted}>
        ยังไม่ยืนยัน
      </Txt>
    </View>
  );
}

const STATUS_MAP: Record<
  BookingStatus,
  { label: string; bg: string; fg: string; icon: keyof typeof Ionicons.glyphMap }
> = {
  requested: { label: "รอผู้ดูแลตอบรับ", bg: color.warningSoft, fg: color.warning, icon: "hourglass" },
  accepted: { label: "ยืนยันแล้ว", bg: color.infoSoft, fg: color.info, icon: "checkmark-circle" },
  in_progress: { label: "กำลังดูแล", bg: color.primarySoft, fg: color.primaryDark, icon: "walk" },
  completed: { label: "เสร็จสิ้น", bg: color.successSoft, fg: color.success, icon: "checkmark-done" },
  cancelled: { label: "ยกเลิก", bg: color.dangerSoft, fg: color.danger, icon: "close-circle" },
};

export function StatusPill({ status }: { status: BookingStatus }) {
  const s = STATUS_MAP[status];
  return (
    <View style={[styles.pill, { backgroundColor: s.bg }]}>
      <Ionicons name={s.icon} size={13} color={s.fg} />
      <Txt variant="smallMedium" color={s.fg}>
        {s.label}
      </Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 4,
    paddingHorizontal: space.md,
    borderRadius: radius.pill,
    alignSelf: "flex-start",
  },
  pillSmall: { paddingVertical: 3, paddingHorizontal: space.sm },
});
