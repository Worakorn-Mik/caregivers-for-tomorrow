import { View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { color, space } from "@/theme/tokens";
import { useStore } from "@/data/store";
import { MOBILITY_LABEL, TASK_LABEL, TIER_BLURB, TIER_LABEL } from "@/data/catalog";
import { baht, thaiDate } from "@/data/format";
import { Screen } from "@/components/Screen";
import { Txt } from "@/components/Txt";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Avatar } from "@/components/Avatar";
import { RatingStars } from "@/components/RatingStars";
import { TierBadge, VerifiedBadge } from "@/components/badges";
import { Divider, InfoLine, Row, SectionTitle, Stat } from "@/components/bits";
import { EmptyState } from "@/components/bits";

export default function CaregiverDetail() {
  const { id, patientId } = useLocalSearchParams<{ id: string; patientId?: string }>();
  const router = useRouter();
  const { getCaregiver, reviewsForCaregiver } = useStore();
  const cg = getCaregiver(id);

  if (!cg) {
    return (
      <Screen>
        <EmptyState title="ไม่พบผู้ดูแล" />
      </Screen>
    );
  }

  const reviews = reviewsForCaregiver(cg.id);

  return (
    <Screen
      footer={
        <Button
          label={`จองผู้ดูแลคนนี้ · ${baht(cg.hourlyRate)}/ชม.`}
          icon="calendar"
          fullWidth
          onPress={() =>
            router.push({
              pathname: "/book/[caregiverId]",
              params: { caregiverId: cg.id, patientId: patientId ?? "" },
            })
          }
        />
      }
    >
      <Card>
        <Row gap={space.md} style={{ alignItems: "flex-start" }}>
          <Avatar uri={cg.photoUrl} size={72} />
          <View style={{ flex: 1 }}>
            <Txt variant="h1" color={color.ink}>
              {cg.name}
            </Txt>
            <Row gap={space.sm} style={{ marginTop: 6, flexWrap: "wrap" }}>
              <TierBadge tier={cg.tier} />
              <RatingStars value={cg.ratingAvg} count={cg.ratingCount} />
            </Row>
          </View>
        </Row>

        <View style={{ marginTop: space.md }}>
          <VerifiedBadge status={cg.verification} />
        </View>

        <Divider />
        <Row>
          <Stat label="ต่อชั่วโมง" value={baht(cg.hourlyRate)} />
          <Stat label="งานสำเร็จ" value={`${cg.jobsDone}`} />
          <Stat label="ประสบการณ์" value={`${cg.yearsExperience} ปี`} />
        </Row>
      </Card>

      <SectionTitle title="เกี่ยวกับผู้ดูแล" style={{ marginTop: space.xl }} />
      <Card>
        <Txt variant="body" color={color.body}>
          {cg.bio}
        </Txt>
        <Divider />
        <InfoLine icon="location-outline">พื้นที่ให้บริการ: {cg.serviceArea}</InfoLine>
        <InfoLine icon="people-outline">
          รับดูแลผู้ป่วยระดับ:{" "}
          {cg.acceptsMobility.map((m) => MOBILITY_LABEL[m]).join(" · ")}
        </InfoLine>
        {cg.licenseNo && (
          <InfoLine icon="ribbon-outline" tint={color.info}>
            เลขใบประกอบวิชาชีพ {cg.licenseNo} (ตรวจสอบกับสภาการพยาบาลแล้ว)
          </InfoLine>
        )}
      </Card>

      <SectionTitle
        title="งานที่รับดูแล"
        hint={TIER_LABEL[cg.tier] + " — " + TIER_BLURB[cg.tier]}
        style={{ marginTop: space.xl }}
      />
      <Card>
        {cg.services.map((s) => (
          <InfoLine key={s} icon="checkmark" tint={color.primary}>
            {TASK_LABEL[s] ?? s}
          </InfoLine>
        ))}
      </Card>

      <SectionTitle
        title={`รีวิวจากครอบครัวผู้ป่วย (${reviews.length})`}
        style={{ marginTop: space.xl }}
      />
      {reviews.length === 0 ? (
        <Card flat>
          <Txt variant="small" color={color.muted}>
            ยังไม่มีรีวิว
          </Txt>
        </Card>
      ) : (
        reviews.map((r) => (
          <Card key={r.id} style={{ marginBottom: space.sm }}>
            <Row style={{ justifyContent: "space-between" }}>
              <RatingStars value={r.stars} showNumber={false} size={13} />
              <Txt variant="tiny" color={color.faint}>
                {thaiDate(r.at)}
              </Txt>
            </Row>
            <Txt variant="small" color={color.body} style={{ marginTop: 6 }}>
              {r.comment}
            </Txt>
            <Txt variant="tiny" color={color.muted} style={{ marginTop: 6 }}>
              — {r.authorName}
            </Txt>
          </Card>
        ))
      )}
    </Screen>
  );
}
