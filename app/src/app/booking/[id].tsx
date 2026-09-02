import { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { color, radius, space } from "@/theme/tokens";
import { useStore } from "@/data/store";
import { MOBILITY_LABEL, TASK_LABEL } from "@/data/catalog";
import {
  actualHours,
  computePrice,
  endTime,
  thaiDate,
  thaiTime,
} from "@/data/format";
import { Screen } from "@/components/Screen";
import { Txt } from "@/components/Txt";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Avatar } from "@/components/Avatar";
import { Timeline } from "@/components/Timeline";
import { PriceBreakdown } from "@/components/PriceBreakdown";
import { StarInput, RatingStars } from "@/components/RatingStars";
import { StatusPill } from "@/components/badges";
import { Divider, EmptyState, InfoLine, Row, SectionTitle } from "@/components/bits";

async function getCoords(): Promise<{ lat: number; lng: number }> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === "granted") {
      const pos = await Location.getCurrentPositionAsync({});
      return { lat: pos.coords.latitude, lng: pos.coords.longitude };
    }
  } catch {
    // fall through to mock
  }
  return {
    lat: 13.7563 + (Math.random() - 0.5) * 0.05,
    lng: 100.5018 + (Math.random() - 0.5) * 0.05,
  };
}

export default function BookingDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    getBooking,
    getCaregiver,
    getPatient,
    reviews,
    checkIn,
    checkOut,
    cancelBooking,
    addReview,
  } = useStore();

  const [busy, setBusy] = useState(false);
  const [stars, setStars] = useState(5);
  const [comment, setComment] = useState("");

  const booking = getBooking(id);
  if (!booking) {
    return (
      <Screen>
        <EmptyState title="ไม่พบการจองนี้" />
      </Screen>
    );
  }
  const cg = getCaregiver(booking.caregiverId);
  const pt = getPatient(booking.patientId);
  if (!cg || !pt) {
    return (
      <Screen>
        <EmptyState title="ข้อมูลการจองไม่สมบูรณ์" />
      </Screen>
    );
  }

  const hasReview = reviews.some((r) => r.bookingId === booking.id && r.direction === "seeker_to_caregiver");
  const billedHours = booking.status === "completed" ? actualHours(booking) : booking.hours;
  const price = computePrice(booking.hourlyRate, billedHours, booking.commissionRate);

  const doCheckIn = async () => {
    setBusy(true);
    checkIn(booking.id, await getCoords());
    setBusy(false);
  };
  const doCheckOut = async () => {
    setBusy(true);
    checkOut(booking.id, await getCoords());
    setBusy(false);
  };

  return (
    <Screen>
      <Card>
        <Row style={{ justifyContent: "space-between", marginBottom: space.md }}>
          <StatusPill status={booking.status} />
          <Txt variant="small" color={color.muted}>
            #{booking.id}
          </Txt>
        </Row>
        <Row gap={space.md}>
          <Avatar uri={cg.photoUrl} size={52} />
          <View style={{ flex: 1 }}>
            <Txt variant="h3" color={color.ink}>
              {cg.name}
            </Txt>
            <Txt variant="small" color={color.muted}>
              ดูแล{pt.relation} · {pt.name} ({MOBILITY_LABEL[pt.mobility]})
            </Txt>
          </View>
        </Row>
        <Divider />
        <InfoLine icon="calendar-outline">
          {thaiDate(booking.scheduledStart)} · {thaiTime(booking.scheduledStart)} –{" "}
          {endTime(booking.scheduledStart, booking.hours)} ({booking.hours} ชม.)
        </InfoLine>
        <InfoLine icon="location-outline">{pt.addressLine}</InfoLine>
        {booking.note ? (
          <InfoLine icon="document-text-outline">{booking.note}</InfoLine>
        ) : null}
      </Card>

      <SectionTitle title="งานที่จอง" style={{ marginTop: space.xl }} />
      <Card>
        {booking.tasks.map((t) => (
          <InfoLine key={t} icon="checkmark" tint={color.primary}>
            {TASK_LABEL[t] ?? t}
          </InfoLine>
        ))}
      </Card>

      {(booking.status === "accepted" || booking.status === "requested") && (
        <Card flat style={{ marginTop: space.lg }}>
          <Txt variant="smallMedium" color={color.ink}>
            เมื่อผู้ดูแลถึงบ้าน
          </Txt>
          <Txt variant="small" color={color.muted} style={{ marginTop: 2 }}>
            กดเช็คอินเพื่อบันทึกเวลาเริ่มงานพร้อมพิกัด GPS
          </Txt>
          <View style={{ height: space.md }} />
          <Button
            label="เช็คอิน (จำลองผู้ดูแลถึงบ้าน)"
            icon="log-in"
            fullWidth
            loading={busy}
            disabled={booking.status === "requested"}
            onPress={doCheckIn}
          />
          {booking.status === "requested" && (
            <Txt variant="tiny" color={color.muted} center style={{ marginTop: space.sm }}>
              รอผู้ดูแลยืนยันก่อน (จำลองอัตโนมัติในไม่กี่วินาที)
            </Txt>
          )}
          <View style={{ height: space.sm }} />
          <Button
            label="ยกเลิกการจอง"
            variant="ghost"
            size="md"
            fullWidth
            onPress={() => cancelBooking(booking.id)}
          />
        </Card>
      )}

      {booking.status === "in_progress" && (
        <Card flat style={{ marginTop: space.lg, backgroundColor: color.primaryTint }}>
          <Txt variant="smallMedium" color={color.primaryDark}>
            ผู้ดูแลกำลังทำงานอยู่
          </Txt>
          <Txt variant="small" color={color.body} style={{ marginTop: 2 }}>
            เช็คอินเมื่อ {booking.checkedInAt ? thaiTime(booking.checkedInAt) : "-"}
          </Txt>
          <View style={{ height: space.md }} />
          <Button
            label="เช็คเอาท์ · จบงาน"
            icon="log-out"
            fullWidth
            loading={busy}
            onPress={doCheckOut}
          />
        </Card>
      )}

      <SectionTitle title="ไทม์ไลน์" style={{ marginTop: space.xl }} />
      <Card>
        <Timeline events={booking.events} />
      </Card>

      {booking.status === "completed" && !hasReview && (
        <>
          <SectionTitle title="ให้คะแนนผู้ดูแล" style={{ marginTop: space.xl }} />
          <Card>
            <StarInput value={stars} onChange={setStars} />
            <TextInput
              value={comment}
              onChangeText={setComment}
              placeholder="เล่าประสบการณ์ให้ครอบครัวอื่นฟัง"
              placeholderTextColor={color.faint}
              multiline
              style={styles.input}
            />
            <View style={{ height: space.md }} />
            <Button
              label="ส่งรีวิว"
              icon="send"
              fullWidth
              onPress={() => addReview(booking.id, stars, comment)}
            />
          </Card>
        </>
      )}

      {booking.status === "completed" && hasReview && (
        <Card flat style={{ marginTop: space.lg, backgroundColor: color.successSoft }}>
          <Row gap={space.sm}>
            <Ionicons name="checkmark-circle" size={18} color={color.success} />
            <Txt variant="smallMedium" color={color.success}>
              ขอบคุณสำหรับรีวิว
            </Txt>
          </Row>
        </Card>
      )}

      <SectionTitle title="ค่าใช้จ่าย" style={{ marginTop: space.xl }} />
      <Card>
        <PriceBreakdown price={price} />
        {booking.status === "completed" && billedHours !== booking.hours && (
          <Txt variant="tiny" color={color.muted} style={{ marginTop: space.sm }}>
            คิดตามเวลาทำงานจริง {billedHours} ชม. (จองไว้ {booking.hours} ชม.)
          </Txt>
        )}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  input: {
    marginTop: space.md,
    minHeight: 72,
    borderWidth: 1,
    borderColor: color.borderStrong,
    borderRadius: radius.md,
    padding: space.md,
    fontFamily: "NotoSansThai_400Regular",
    fontSize: 15,
    color: color.ink,
    textAlignVertical: "top",
    backgroundColor: color.surface,
  },
});
