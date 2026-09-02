import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { color, space } from "@/theme/tokens";
import { thaiDateTime } from "@/data/format";
import type { BookingEvent, BookingEventType } from "@/data/types";
import { Txt } from "./Txt";

const LABEL: Record<BookingEventType, string> = {
  requested: "ส่งคำขอจอง",
  accepted: "ผู้ดูแลยืนยัน",
  checked_in: "เช็คอินที่บ้าน",
  checked_out: "เช็คเอาท์ · จบงาน",
  cancelled: "ยกเลิกการจอง",
};

const ICON: Record<BookingEventType, keyof typeof Ionicons.glyphMap> = {
  requested: "paper-plane",
  accepted: "checkmark-circle",
  checked_in: "log-in",
  checked_out: "log-out",
  cancelled: "close-circle",
};

export function Timeline({ events }: { events: BookingEvent[] }) {
  return (
    <View>
      {events.map((e, i) => {
        const last = i === events.length - 1;
        const danger = e.type === "cancelled";
        const tint = danger ? color.danger : last ? color.primary : color.success;
        return (
          <View key={i} style={{ flexDirection: "row", gap: space.md }}>
            <View style={{ alignItems: "center" }}>
              <View
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  backgroundColor: danger ? color.dangerSoft : color.primarySoft,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name={ICON[e.type]} size={16} color={tint} />
              </View>
              {!last && (
                <View
                  style={{
                    width: 2,
                    flex: 1,
                    minHeight: 22,
                    backgroundColor: color.border,
                    marginVertical: 2,
                  }}
                />
              )}
            </View>
            <View style={{ flex: 1, paddingBottom: last ? 0 : space.md }}>
              <Txt variant="bodyMedium" color={color.ink}>
                {LABEL[e.type]}
              </Txt>
              <Txt variant="small" color={color.muted} style={{ marginTop: 1 }}>
                {thaiDateTime(e.at)}
              </Txt>
              {e.lat != null && e.lng != null && (
                <Txt variant="tiny" color={color.faint} style={{ marginTop: 2 }}>
                  พิกัด {e.lat.toFixed(4)}, {e.lng.toFixed(4)}
                </Txt>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}
