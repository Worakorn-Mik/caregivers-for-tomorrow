import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, TextInput, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { color, radius, space } from "@/theme/tokens";
import { useStore } from "@/data/store";
import {
  EXCLUDED_TASKS,
  MOBILITY_LABEL,
  TASK_LABEL,
} from "@/data/catalog";
import { computePrice, thaiDate } from "@/data/format";
import { Screen } from "@/components/Screen";
import { Txt } from "@/components/Txt";
import { Card } from "@/components/Card";
import { Chip } from "@/components/Chip";
import { Button } from "@/components/Button";
import { Stepper } from "@/components/Stepper";
import { SelectRow } from "@/components/SelectRow";
import { PriceBreakdown } from "@/components/PriceBreakdown";
import { Divider, InfoLine, Row, SectionTitle } from "@/components/bits";
import { EmptyState } from "@/components/bits";

const COMMISSION = 0.15;
const DAY_OPTS = [0, 1, 2, 3];
const HOUR_OPTS = [7, 8, 12, 16, 18];

function isoFor(dayOffset: number, hour: number) {
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}

export default function BookFlow() {
  const { caregiverId, patientId } = useLocalSearchParams<{
    caregiverId: string;
    patientId?: string;
  }>();
  const router = useRouter();
  const { getCaregiver, patients, createBooking } = useStore();
  const cg = getCaregiver(caregiverId);

  const [selPatient, setSelPatient] = useState(
    patientId && patients.some((p) => p.id === patientId)
      ? patientId
      : patients[0]?.id ?? "",
  );
  const [day, setDay] = useState(1);
  const [hour, setHour] = useState(8);
  const [hours, setHours] = useState(4);
  const [tasks, setTasks] = useState<string[]>(
    () => (cg ? cg.services.slice(0, 4) : []),
  );
  const [note, setNote] = useState("");

  const price = useMemo(
    () => computePrice(cg?.hourlyRate ?? 0, hours, COMMISSION),
    [cg?.hourlyRate, hours],
  );

  if (!cg) {
    return (
      <Screen>
        <EmptyState title="ไม่พบผู้ดูแล" />
      </Screen>
    );
  }

  const toggleTask = (key: string) =>
    setTasks((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );

  const confirm = () => {
    const id = createBooking({
      caregiverId: cg.id,
      patientId: selPatient,
      scheduledStart: isoFor(day, hour),
      hours,
      hourlyRate: cg.hourlyRate,
      commissionRate: COMMISSION,
      tasks,
      note: note.trim() || undefined,
    });
    router.replace({ pathname: "/booking/[id]", params: { id } });
  };

  const dayLabel = (o: number) =>
    o === 0 ? "วันนี้" : o === 1 ? "พรุ่งนี้" : thaiDate(isoFor(o, 12));

  return (
    <Screen
      footer={
        <Button
          label={`ยืนยันการจอง · ${price.total.toLocaleString()} บาท`}
          icon="checkmark-circle"
          fullWidth
          disabled={!selPatient || tasks.length === 0}
          onPress={confirm}
        />
      }
    >
      <Card flat>
        <Row gap={space.md}>
          <View style={styles.badge}>
            <Ionicons name="person" size={18} color={color.primaryDark} />
          </View>
          <View style={{ flex: 1 }}>
            <Txt variant="bodyMedium" color={color.ink}>
              {cg.name}
            </Txt>
            <Txt variant="small" color={color.muted}>
              {cg.serviceArea} · ฿{cg.hourlyRate}/ชม.
            </Txt>
          </View>
        </Row>
      </Card>

      <SectionTitle title="ดูแลใคร" style={{ marginTop: space.xl }} />
      {patients.map((p) => (
        <SelectRow
          key={p.id}
          mode="radio"
          title={`${p.relation} · ${p.name}`}
          subtitle={`${MOBILITY_LABEL[p.mobility]} · ${p.area}`}
          selected={selPatient === p.id}
          onPress={() => setSelPatient(p.id)}
        />
      ))}

      <SectionTitle title="วันและเวลา" style={{ marginTop: space.xl }} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: space.sm }}
      >
        {DAY_OPTS.map((o) => (
          <Chip key={o} label={dayLabel(o)} selected={day === o} onPress={() => setDay(o)} />
        ))}
      </ScrollView>
      <Row gap={space.sm} style={{ marginTop: space.md, flexWrap: "wrap" }}>
        {HOUR_OPTS.map((h) => (
          <Chip
            key={h}
            label={`${String(h).padStart(2, "0")}:00`}
            selected={hour === h}
            onPress={() => setHour(h)}
          />
        ))}
      </Row>

      <SectionTitle title="กี่ชั่วโมง" style={{ marginTop: space.xl }} />
      <Stepper value={hours} onChange={setHours} min={1} max={12} />

      <SectionTitle
        title="งานที่ต้องการให้ดูแล"
        hint="เลือกได้เฉพาะงานดูแลทั่วไปที่ผู้ดูแลคนนี้รับ"
        style={{ marginTop: space.xl }}
      />
      {cg.services.map((s) => (
        <SelectRow
          key={s}
          title={TASK_LABEL[s] ?? s}
          selected={tasks.includes(s)}
          onPress={() => toggleTask(s)}
        />
      ))}

      <Card flat style={{ marginTop: space.sm, backgroundColor: color.warningSoft }}>
        <Row gap={space.sm} style={{ alignItems: "flex-start" }}>
          <Ionicons name="alert-circle" size={18} color={color.warning} />
          <View style={{ flex: 1 }}>
            <Txt variant="smallMedium" color={color.ink}>
              ผู้ดูแลไม่ทำหัตถการทางการแพทย์
            </Txt>
            <Txt variant="small" color={color.body} style={{ marginTop: 2 }}>
              {EXCLUDED_TASKS.join(" · ")} — ต้องใช้บุคลากรทางการแพทย์ในสถานพยาบาล
            </Txt>
          </View>
        </Row>
      </Card>

      <SectionTitle title="บันทึกถึงผู้ดูแล (ไม่บังคับ)" style={{ marginTop: space.xl }} />
      <TextInput
        value={note}
        onChangeText={setNote}
        placeholder="เช่น ยาอยู่ที่ไหน อาหารที่แพ้ นิสัยของผู้ป่วย"
        placeholderTextColor={color.faint}
        multiline
        style={styles.input}
      />

      <SectionTitle title="สรุปค่าใช้จ่าย" style={{ marginTop: space.xl }} />
      <Card>
        <PriceBreakdown price={price} />
        <Divider />
        <InfoLine icon="shield-checkmark" tint={color.success}>
          ชำระเงินหลังผู้ดูแลเช็คเอาท์และยืนยันงานเสร็จ (เดโม — ยังไม่ตัดเงินจริง)
        </InfoLine>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  badge: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: color.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    minHeight: 88,
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
