import { View } from "react-native";
import { color, space } from "@/theme/tokens";
import { baht } from "@/data/format";
import type { PriceBreakdown as PB } from "@/data/types";
import { Txt } from "./Txt";
import { Divider, Row } from "./bits";

function Line({
  label,
  value,
  strong,
  muted,
}: {
  label: string;
  value: string;
  strong?: boolean;
  muted?: boolean;
}) {
  return (
    <Row style={{ justifyContent: "space-between", marginBottom: space.sm }}>
      <Txt
        variant={strong ? "bodyMedium" : "small"}
        color={strong ? color.ink : muted ? color.muted : color.body}
      >
        {label}
      </Txt>
      <Txt
        variant={strong ? "h3" : "smallMedium"}
        color={strong ? color.primaryDark : muted ? color.muted : color.body}
      >
        {value}
      </Txt>
    </Row>
  );
}

export function PriceBreakdown({ price, showPayout = true }: { price: PB; showPayout?: boolean }) {
  return (
    <View>
      <Line
        label={`ค่าบริการ ${baht(price.hourlyRate)} × ${price.hours} ชม.`}
        value={baht(price.subtotal)}
      />
      {showPayout && (
        <>
          <Line
            label={`ค่าแพลตฟอร์ม (${Math.round(price.commissionRate * 100)}%)`}
            value={`− ${baht(price.platformFee)}`}
            muted
          />
          <Line
            label="ผู้ดูแลได้รับ"
            value={baht(price.caregiverPayout)}
            muted
          />
        </>
      )}
      <Divider style={{ marginVertical: space.sm }} />
      <Line label="ยอดที่ต้องชำระ" value={baht(price.total)} strong />
    </View>
  );
}
