/**
 * Bounded task catalog — "งานดูแลทั่วไป" only.
 * Anything that counts as a medical procedure (หัตถการ) is explicitly OUT of scope
 * and must never appear as a bookable task. This is the product-side guard for the
 * legal question raised in the Semifinal judge feedback.
 */

import type { CaregiverTier, MobilityLevel } from "./types";

export interface TaskDef {
  key: string;
  label: string;
  /** lowest tier allowed to perform this task */
  minTier: CaregiverTier;
}

export const ALLOWED_TASKS: TaskDef[] = [
  { key: "companionship", label: "เป็นเพื่อน พูดคุย ดูแลใกล้ชิด", minTier: "assistant" },
  { key: "mobility_walk", label: "พยุงเดิน เปลี่ยนอิริยาบถ", minTier: "assistant" },
  { key: "bathing", label: "อาบน้ำ เช็ดตัว แต่งตัว", minTier: "assistant" },
  { key: "feeding", label: "ป้อนอาหาร ป้อนน้ำ", minTier: "assistant" },
  { key: "toileting", label: "พาเข้าห้องน้ำ เปลี่ยนผ้าอ้อม", minTier: "assistant" },
  { key: "light_housekeeping", label: "งานบ้านเบา ๆ ซักผ้าผู้ป่วย", minTier: "assistant" },
  { key: "meal_prep", label: "เตรียมอาหารตามที่ครอบครัวจัดไว้", minTier: "assistant" },
  { key: "escort_appointment", label: "พาไปตามนัดหมอ / รับส่ง", minTier: "assistant" },
  { key: "turning", label: "พลิกตะแคงตัวกันแผลกดทับ", minTier: "assistant" },
  { key: "vitals", label: "วัดความดัน / น้ำตาลปลายนิ้ว และจดบันทึก", minTier: "na_pn" },
  { key: "med_reminder", label: "จัดยาตามตารางที่แพทย์สั่ง และเตือนกินยา", minTier: "na_pn" },
  { key: "basic_exercise", label: "กายภาพเบื้องต้นตามที่นักกายภาพแนะนำ", minTier: "na_pn" },
  { key: "care_assessment", label: "ประเมินอาการเบื้องต้น ให้คำแนะนำครอบครัว", minTier: "rn" },
  { key: "wound_clean_care", label: "ดูแลแผลสะอาดที่ไม่ซับซ้อน", minTier: "rn" },
];

/** Shown as a disclaimer wherever a booking is created. */
export const EXCLUDED_TASKS: string[] = [
  "ทำแผลกดทับ / แผลเรื้อรังที่ซับซ้อน",
  "ฉีดยา / ให้น้ำเกลือ / เจาะเลือด",
  "ให้อาหารทางสายยาง (NG/PEG)",
  "ดูดเสมหะผ่านท่อ / ดูแลเครื่องช่วยหายใจ",
  "สวนปัสสาวะ / เปลี่ยนสายสวน",
];

export const TASK_LABEL: Record<string, string> = Object.fromEntries(
  ALLOWED_TASKS.map((t) => [t.key, t.label]),
);

const TIER_RANK: Record<CaregiverTier, number> = { assistant: 0, na_pn: 1, rn: 2 };

export function tierMeetsTask(tier: CaregiverTier, taskKey: string): boolean {
  const def = ALLOWED_TASKS.find((t) => t.key === taskKey);
  if (!def) return false;
  return TIER_RANK[tier] >= TIER_RANK[def.minTier];
}

export const TIER_LABEL: Record<CaregiverTier, string> = {
  assistant: "ผู้ช่วยดูแล",
  na_pn: "ผู้ช่วยพยาบาล (NA/PN)",
  rn: "พยาบาลวิชาชีพ (RN)",
};

export const TIER_SHORT: Record<CaregiverTier, string> = {
  assistant: "ผู้ช่วยดูแล",
  na_pn: "NA / PN",
  rn: "RN",
};

export const TIER_BLURB: Record<CaregiverTier, string> = {
  assistant: "ดูแลกิจวัตรประจำวัน เป็นเพื่อน พาเดิน งานบ้านเบา",
  na_pn: "ทำได้ทุกอย่างของผู้ช่วยดูแล + วัดสัญญาณชีพ จัดยา กายภาพเบื้องต้น",
  rn: "ทำได้ทุกอย่างของ NA/PN + ประเมินอาการ ดูแลแผลไม่ซับซ้อน ให้คำแนะนำครอบครัว",
};

export const MOBILITY_LABEL: Record<MobilityLevel, string> = {
  independent: "ช่วยเหลือตัวเองได้",
  semi: "ช่วยเหลือตัวเองได้บางส่วน",
  bedridden: "ติดเตียง",
};

export const MOBILITY_HINT: Record<MobilityLevel, string> = {
  independent: "ต้องการคนอยู่เป็นเพื่อนและช่วยงานเล็ก ๆ น้อย ๆ",
  semi: "ต้องมีคนช่วยพยุง อาบน้ำ ป้อนอาหาร และดูเรื่องยา",
  bedridden: "ต้องพลิกตัว ดูแลใกล้ชิดตลอด แนะนำผู้ดูแลระดับ NA/PN ขึ้นไป",
};
