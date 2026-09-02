# Caregivers For Tomorrow

แพลตฟอร์มจับคู่ผู้ดูแล (caregiver) กับครอบครัวที่ต้องการการดูแลผู้สูงอายุ/ผู้ป่วยที่บ้าน
แบบ **เฉพาะกิจ รายชั่วโมง** — self-service model แบบ Grab/Lineman พร้อมระบบแบ่งระดับผู้ดูแล
(Caregiver / NA-PN / RN) การตรวจสอบประวัติ + ใบประกอบวิชาชีพ และระบบรีวิว

- **ทีม:** SK Outlier — โรงเรียนสวนกุหลาบวิทยาลัย
- **การแข่งขัน:** Samsung Solve for Tomorrow 2026 (ผ่านเข้ารอบ Semifinal)
- **รายได้:** ค่าคอมมิชชัน 5–20% ต่อการจับคู่ที่สำเร็จ

## สมาชิก

| บทบาท | ชื่อ |
|---|---|
| ผู้พัฒนา | ปุญชรัศมิ์ นุกูลวุฒิโอภาส (ม.6) |
| ผู้พัฒนา | วรกร วิรามวิทวัส (ม.6) |
| ผู้พัฒนา | ดรัณภพ วิริยาอนันต์กุล (ม.6) |
| ที่ปรึกษา | ภพณิพิฐ สิงห์ปรุ |

## โครงสร้าง repo

```
.
├── docs/          เอกสารโครงงาน — BMC, business proposal, judge feedback, action plan
├── app/           แอปพลิเคชัน (ยังไม่เลือก stack — ดู app/README.md)
├── CLAUDE.md      คู่มือ/กติกาการทำงานประจำโปรเจกต์ (อ่านก่อนเริ่ม)
└── README.md
```

## เริ่มงาน (สำหรับสมาชิกทีม)

```bash
git clone <repo-url>
cd Samsung_Solve_For_Tomorrow
git checkout -b feature/<ชื่อสั้นๆ-ของงานคุณ>
```

- commit บ่อย ๆ, `git pull --rebase` ก่อน push ทุกครั้ง
- เปิด Pull Request เข้าสู่ `main` — อย่า push ตรงเข้า `main`
- ตาราง ownership ว่าใครแตะไฟล์/ส่วนไหน อยู่ใน [CLAUDE.md](CLAUDE.md)

## สถานะปัจจุบัน

รอบ Semifinal ผ่านแล้ว — กำลังเตรียมงานสำหรับรอบถัดไปตาม judge feedback
ดู [docs/judge-feedback-and-action-plan.md](docs/judge-feedback-and-action-plan.md)
