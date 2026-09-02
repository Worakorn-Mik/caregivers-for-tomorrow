import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { color, space } from "@/theme/tokens";
import { thaiDate, thaiTime, endTime } from "@/data/format";
import type { Booking, Caregiver, Patient } from "@/data/types";
import { Avatar } from "./Avatar";
import { Card } from "./Card";
import { Txt } from "./Txt";
import { Row } from "./bits";
import { StatusPill } from "./badges";

export function BookingCard({
  booking,
  caregiver,
  patient,
  onPress,
}: {
  booking: Booking;
  caregiver: Caregiver;
  patient: Patient;
  onPress: () => void;
}) {
  return (
    <Card onPress={onPress} style={{ marginBottom: space.md }}>
      <Row style={{ justifyContent: "space-between", marginBottom: space.md }}>
        <StatusPill status={booking.status} />
        <Txt variant="small" color={color.muted}>
          {thaiDate(booking.scheduledStart)}
        </Txt>
      </Row>

      <Row gap={space.md}>
        <Avatar uri={caregiver.photoUrl} size={44} />
        <View style={{ flex: 1 }}>
          <Txt variant="h3" color={color.ink}>
            {caregiver.name}
          </Txt>
          <Txt variant="small" color={color.muted} style={{ marginTop: 2 }}>
            ดูแล{patient.relation} · {patient.name}
          </Txt>
        </View>
      </Row>

      <Row gap={space.xs} style={{ marginTop: space.md }}>
        <Ionicons name="time-outline" size={15} color={color.primaryDark} />
        <Txt variant="small" color={color.body}>
          {thaiTime(booking.scheduledStart)} – {endTime(booking.scheduledStart, booking.hours)} ({booking.hours} ชม.)
        </Txt>
      </Row>
    </Card>
  );
}
