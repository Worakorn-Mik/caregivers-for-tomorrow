import { useMemo } from "react";
import { useRouter } from "expo-router";
import { useStore } from "@/data/store";
import { color, space } from "@/theme/tokens";
import type { Booking } from "@/data/types";
import { Screen } from "@/components/Screen";
import { Txt } from "@/components/Txt";
import { BookingCard } from "@/components/BookingCard";
import { EmptyState, SectionTitle } from "@/components/bits";

const ACTIVE: Booking["status"][] = ["requested", "accepted", "in_progress"];

export default function Bookings() {
  const router = useRouter();
  const { bookings, getCaregiver, getPatient } = useStore();

  const { active, past } = useMemo(() => {
    const sorted = [...bookings].sort(
      (a, b) => +new Date(b.scheduledStart) - +new Date(a.scheduledStart),
    );
    return {
      active: sorted
        .filter((b) => ACTIVE.includes(b.status))
        .sort((a, b) => +new Date(a.scheduledStart) - +new Date(b.scheduledStart)),
      past: sorted.filter((b) => !ACTIVE.includes(b.status)),
    };
  }, [bookings]);

  if (bookings.length === 0) {
    return (
      <Screen>
        <EmptyState
          icon="calendar-outline"
          title="ยังไม่มีการจอง"
          subtitle="ไปที่แท็บ ค้นหา เพื่อเลือกผู้ดูแลและจองครั้งแรก"
        />
      </Screen>
    );
  }

  const render = (b: Booking) => {
    const cg = getCaregiver(b.caregiverId);
    const pt = getPatient(b.patientId);
    if (!cg || !pt) return null;
    return (
      <BookingCard
        key={b.id}
        booking={b}
        caregiver={cg}
        patient={pt}
        onPress={() => router.push({ pathname: "/booking/[id]", params: { id: b.id } })}
      />
    );
  };

  return (
    <Screen>
      {active.length > 0 && (
        <>
          <SectionTitle title="กำลังจะถึง" />
          {active.map(render)}
        </>
      )}
      {past.length > 0 && (
        <>
          <SectionTitle
            title="ประวัติการจอง"
            style={{ marginTop: active.length ? space.lg : 0 }}
          />
          {past.map(render)}
        </>
      )}
      <Txt variant="tiny" color={color.faint} center style={{ marginTop: space.lg }}>
        ข้อมูลในเดโมนี้จะรีเซ็ตเมื่อปิดแอป
      </Txt>
    </Screen>
  );
}
