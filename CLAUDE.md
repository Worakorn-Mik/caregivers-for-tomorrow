# โปรเจกต์: Caregivers For Tomorrow — คู่มือการทำงาน

> ไฟล์นี้ผูกกับโปรเจกต์นี้เท่านั้น อ่านก่อนเริ่มงานทุกครั้ง (ทั้งคนและ agent)

## 1. เป้าหมาย / ทีม

- **การแข่งขัน:** Samsung Solve for Tomorrow 2026 — ทีม SK Outlier (สวนกุหลาบวิทยาลัย)
- **สถานะ:** ผ่านรอบ Semifinal แล้ว กำลังเตรียมรอบถัดไป
- **โครงงาน:** แพลตฟอร์มจับคู่ผู้ดูแลผู้สูงอายุ/ผู้ป่วยที่บ้านแบบเฉพาะกิจรายชั่วโมง

## 2. Hard dates

ที่มา: `docs/SFT2026-project-overview.pdf` — เอกสารทางการให้ช่วงเดือน ยังไม่ให้วันที่เป๊ะ
**ต้อง confirm วันส่งจริงกับ Samsung / mentor**

| ช่วงเวลา (พ.ศ. 2569) | อะไร |
|---|---|
| ก.ย. | **รอบรองชนะเลิศ** — อบรม onsite กรุงเทพฯ + **ส่งแผนพัฒนานวัตกรรมและไอเดียธุรกิจ รอบที่ 2** |
| ต.ค. | **นำเสนอ online (Online Pitching)** + ประกาศ 10 ทีมเข้าชิงชนะเลิศ + Coaching & Mentoring |
| พ.ย. | **รอบชิงชนะเลิศ** — 10 ทีมนำเสนอ + ประกาศผล (โครงการสิ้นสุด 13 พ.ย. 2569) |
| _ยังไม่ระบุ_ | วันส่งแผนรอบ 2 (เป๊ะ) — **ต้องเติมทันทีที่รู้** |
| _ยังไม่ระบุ_ | วัน Online Pitching (เป๊ะ) — **ต้องเติมทันทีที่รู้** |

- แนวทางการประกวด 4 ทาง — โครงงานนี้อยู่ทาง **"Innovation for All"** (นวัตกรรมเพื่อคุณภาพชีวิตของคนในสังคม)
- ธีมปีนี้: MAKE YOUR IMPACT — "คิดแก้ปัญหา พัฒนานวัตกรรม ลงมือทำให้ยั่งยืน"
- รางวัล: ชนะเลิศ 60,000 + ดูงานเกาหลี / รองชนะเลิศ 3 ทีม ทีมละ 45,000

> deadline ที่ได้ยินในแชท/ปากเปล่า → เขียนลงตารางนี้ทันที อย่าปล่อยไว้แค่ในบทสนทนา

## 3. Source of truth

| เรื่อง | อยู่ที่ไหน |
|---|---|
| ภาพรวมโครงการ + timeline ทางการ | `docs/SFT2026-project-overview.pdf` |
| **เกณฑ์ให้คะแนน (แบบมีน้ำหนัก %)** | **ยังไม่มี — เอกสารทางการมีแค่ภาพรวม ต้องขอ rubric จาก Samsung / mentor ก่อนออกแบบสไลด์รอบ 2** |
| Business proposal (ฉบับส่ง Semifinal) | `docs/Bussiness_proposal.pdf` |
| Business Model Canvas | `docs/BMC.pdf` |
| Judge feedback รอบ Semifinal | `docs/SFT 2026 Judge Feedback (Semifinal) - SK Outlier.pdf` |
| แผนแก้ตาม feedback | `docs/judge-feedback-and-action-plan.md` |
| ตัวเลข/งบประมาณ | ตาราง Phase-1 (4,000) / Phase-2 (8,000) ใน business proposal ข้อ 10 |

> ตัวเลข/ข้อมูลอ้างอิงทุกตัว re-derive จากไฟล์ใน `docs/` เสมอ ไม่ใช้จากความจำ

## 4. Tech stack — เลือกแล้ว

| Layer | เลือก |
|---|---|
| Mobile | Expo SDK 57 + React Native + expo-router + TypeScript |
| UI | design system เองใน `app/src/theme/tokens.ts` + `app/src/components/` (Noto Sans Thai) |
| Backend (แผน) | Supabase — Postgres + Auth + RLS (`supabase/migrations/0001_init.sql`) |
| Build → Play Store | EAS Build (cloud, ไม่ต้องมี Mac / Android Studio) |

- MVP ปัจจุบัน**รันได้โดยไม่ต้องมี backend** — ใช้ mock data ใน `app/src/data/`
- Supabase ยังไม่ต่อ ต่อทีหลังผ่าน `app/src/lib/supabase.ts` (ดู `supabase/README.md`)
- ยังไม่ทำ: payment จริง, background-check API, maps SDK, persistence (ตั้งใจตัด scope)
- รันแอป: `cd app && npm install && npm start`

## 5. Ownership (กันแก้ชนกัน)

| ส่วน | คนรับผิดชอบ |
|---|---|
| Frontend / แอป | _ยังไม่ระบุ_ |
| Backend / API | _ยังไม่ระบุ_ |
| เอกสาร / สไลด์ / research | _ยังไม่ระบุ_ |

## 6. กติกา git

- ห้าม push ตรงเข้า `main` — เปิด Pull Request เสมอ
- commit บ่อย ๆ, `git pull --rebase` ก่อน push ทุกครั้ง
- งานที่ค้างแค่ในเครื่อง (ไม่ commit) = เสี่ยงหาย

## 7. งานที่ไม่ใช่โค้ด — track เท่ากับ code TODO

research, สไลด์, บท pitch, ผล survey, การบ้านกฎหมาย — ใส่ไว้ใน issue/`docs/` ให้เห็นชัด
ไม่ปล่อยให้ดองเพราะไม่บล็อกงานวันต่อวัน

## 8. สไตล์การทำงานที่ทีมต้องการ

- ตอบตรง เห็นแผนพัง/มีปัญหา บอกพร้อมทางออก
- แก้เฉพาะสิ่งที่ถูกสั่ง เจอปัญหานอกสโคป → flag ไว้ ไม่แก้เงียบ ๆ
- ลองวิธีง่าย/ของสำเร็จรูปก่อนสร้างระบบใหม่เอง
