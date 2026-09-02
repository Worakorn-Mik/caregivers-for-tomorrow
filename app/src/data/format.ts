import type { Booking, PriceBreakdown } from "./types";

export function baht(n: number): string {
  return "฿" + Math.round(n).toLocaleString("en-US");
}

const TH_MONTHS = [
  "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
  "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค.",
];

export function thaiDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getDate()} ${TH_MONTHS[d.getMonth()]} ${(d.getFullYear() + 543) % 100}`;
}

export function thaiTime(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")} น.`;
}

export function thaiDateTime(iso: string): string {
  return `${thaiDate(iso)} · ${thaiTime(iso)}`;
}

export function endTime(startIso: string, hours: number): string {
  const d = new Date(startIso);
  d.setMinutes(d.getMinutes() + hours * 60);
  return thaiTime(d.toISOString());
}

export function relativeFromNow(iso: string): string {
  const diffMs = new Date(iso).getTime() - Date.now();
  const diffH = Math.round(diffMs / 3_600_000);
  if (Math.abs(diffH) < 1) return "อีกไม่ถึงชั่วโมง";
  if (diffH > 0 && diffH < 24) return `อีก ${diffH} ชม.`;
  const diffD = Math.round(diffH / 24);
  if (diffD === 1) return "พรุ่งนี้";
  if (diffD > 1) return `อีก ${diffD} วัน`;
  if (diffD === -1) return "เมื่อวาน";
  return `${Math.abs(diffD)} วันก่อน`;
}

export function computePrice(hourlyRate: number, hours: number, commissionRate: number): PriceBreakdown {
  const subtotal = hourlyRate * hours;
  const platformFee = Math.round(subtotal * commissionRate);
  return {
    hours,
    hourlyRate,
    subtotal,
    commissionRate,
    platformFee,
    caregiverPayout: subtotal - platformFee,
    total: subtotal,
  };
}

export function actualHours(b: Booking): number {
  if (b.checkedInAt && b.checkedOutAt) {
    const ms = new Date(b.checkedOutAt).getTime() - new Date(b.checkedInAt).getTime();
    return Math.max(0.5, Math.round((ms / 3_600_000) * 2) / 2);
  }
  return b.hours;
}
