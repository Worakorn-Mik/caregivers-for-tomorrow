import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { color, space } from "@/theme/tokens";
import { baht } from "@/data/format";
import type { Caregiver } from "@/data/types";
import { Avatar } from "./Avatar";
import { Card } from "./Card";
import { Txt } from "./Txt";
import { Row } from "./bits";
import { RatingStars } from "./RatingStars";
import { TierBadge, VerifiedBadge } from "./badges";

export function CaregiverCard({
  caregiver,
  onPress,
}: {
  caregiver: Caregiver;
  onPress: () => void;
}) {
  return (
    <Card onPress={onPress} style={{ marginBottom: space.md }}>
      <Row gap={space.md} style={{ alignItems: "flex-start" }}>
        <Avatar uri={caregiver.photoUrl} size={60} />
        <View style={{ flex: 1 }}>
          <Row style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
            <Txt variant="h3" color={color.ink} style={{ flex: 1, paddingRight: space.sm }}>
              {caregiver.name}
            </Txt>
            <Txt variant="h3" color={color.primaryDark}>
              {baht(caregiver.hourlyRate)}
              <Txt variant="tiny" color={color.muted}>
                {" "}
                /ชม.
              </Txt>
            </Txt>
          </Row>

          <Row gap={space.sm} style={{ marginTop: 6, flexWrap: "wrap" }}>
            <TierBadge tier={caregiver.tier} small />
            <RatingStars value={caregiver.ratingAvg} count={caregiver.ratingCount} />
          </Row>

          <Row gap={space.xs} style={{ marginTop: 8 }}>
            <Ionicons name="location-outline" size={14} color={color.muted} />
            <Txt variant="small" color={color.muted}>
              {caregiver.serviceArea} · ประสบการณ์ {caregiver.yearsExperience} ปี
            </Txt>
          </Row>
        </View>
      </Row>

      <View style={{ marginTop: space.md }}>
        <VerifiedBadge status={caregiver.verification} />
      </View>
    </Card>
  );
}
