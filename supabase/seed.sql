-- Demo seed — mirrors app/src/data/mock.ts
--
-- NOTE: profiles.id references auth.users(id). Supabase Auth won't let you insert
-- arbitrary auth.users rows from SQL in hosted projects. Two options:
--   A) Create the demo accounts via the Auth dashboard / admin API, then replace
--      the UUIDs below with the real ones.
--   B) Run this only against a LOCAL `supabase start` stack, where the inserts
--      into auth.users below are allowed.
--
-- The structure is what matters for review; swap ids as needed.

-- fixed uuids for readability
-- seeker
insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-000000000001', 'seeker.demo@example.com')
on conflict do nothing;

-- caregivers
insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-0000000000a1', 'pimchanok@example.com'),
  ('00000000-0000-0000-0000-0000000000a2', 'thanawat@example.com'),
  ('00000000-0000-0000-0000-0000000000a3', 'ratchanikorn@example.com'),
  ('00000000-0000-0000-0000-0000000000a4', 'araya@example.com'),
  ('00000000-0000-0000-0000-0000000000a5', 'somchai@example.com'),
  ('00000000-0000-0000-0000-0000000000a6', 'kanya@example.com')
on conflict do nothing;

insert into profiles (id, role, full_name, phone) values
  ('00000000-0000-0000-0000-000000000001', 'seeker',    'ผู้ใช้เดโม',        '080-000-0001'),
  ('00000000-0000-0000-0000-0000000000a1', 'caregiver', 'พิมพ์ชนก ศรีสุข',   '081-000-0001'),
  ('00000000-0000-0000-0000-0000000000a2', 'caregiver', 'ธนวัฒน์ อินทร์พรหม', '081-000-0002'),
  ('00000000-0000-0000-0000-0000000000a3', 'caregiver', 'รัชนีกร แซ่ลิ้ม',   '081-000-0003'),
  ('00000000-0000-0000-0000-0000000000a4', 'caregiver', 'อารยา วงศ์เจริญ',   '081-000-0004'),
  ('00000000-0000-0000-0000-0000000000a5', 'caregiver', 'สมชาย ทองดี',       '081-000-0005'),
  ('00000000-0000-0000-0000-0000000000a6', 'caregiver', 'กัญญา เพ็ชรรัตน์',  '081-000-0006')
on conflict do nothing;

insert into caregiver_profiles
  (profile_id, tier, hourly_rate, service_area, years_experience, bio, verification, license_no, accepts_mobility) values
  ('00000000-0000-0000-0000-0000000000a1', 'na_pn',     180, 'เขตห้วยขวาง',    6, 'ผู้ช่วยพยาบาลประจำคลินิกผู้สูงอายุ ถนัดผู้ป่วยเบาหวาน/ความดัน', 'verified', 'PN-62-04812', '{independent,semi,bedridden}'),
  ('00000000-0000-0000-0000-0000000000a2', 'assistant', 120, 'เขตดินแดง',      3, 'ผ่านอบรมดูแลผู้สูงอายุ 420 ชม. แข็งแรง พยุงได้ดี',              'verified', null,          '{independent,semi}'),
  ('00000000-0000-0000-0000-0000000000a3', 'rn',        350, 'เขตพญาไท',       9, 'พยาบาลวิชาชีพ วอร์ดอายุรกรรม 9 ปี',                             'verified', 'RN-4510-2559', '{semi,bedridden}'),
  ('00000000-0000-0000-0000-0000000000a4', 'na_pn',     170, 'เขตวังทองหลาง',  5, 'ผู้ช่วยพยาบาล ดูแลผู้ป่วยติดเตียงหลังผ่าตัดหลายเคส',            'verified', 'PN-60-01199', '{semi,bedridden}'),
  ('00000000-0000-0000-0000-0000000000a5', 'assistant', 110, 'เขตบางกะปิ',     2, 'อดีต อสม. อยู่ระหว่างตรวจสอบประวัติ',                            'pending',  null,          '{independent}'),
  ('00000000-0000-0000-0000-0000000000a6', 'na_pn',     165, 'เขตห้วยขวาง',    4, 'ผู้ช่วยพยาบาล รับงานช่วงเย็น ถนัดอาหารผู้ป่วยเบาหวาน',          'verified', 'PN-61-03340', '{independent,semi}')
on conflict do nothing;

insert into caregiver_services (caregiver_id, task_key)
select '00000000-0000-0000-0000-0000000000a1', x from unnest(array[
  'companionship','mobility_walk','bathing','feeding','toileting','turning','vitals','med_reminder','basic_exercise','escort_appointment']) x
on conflict do nothing;

insert into patients (id, owner_id, name, relation, mobility, conditions, area, address_line) values
  ('00000000-0000-0000-0000-0000000000p1', '00000000-0000-0000-0000-000000000001',
   'คุณยายสมพร', 'ย่า', 'semi', 'เบาหวาน + ความดัน เดินด้วยไม้เท้า', 'เขตห้วยขวาง', 'ซอยประชาราษฎร์บำเพ็ญ 12 เขตห้วยขวาง กทม.'),
  ('00000000-0000-0000-0000-0000000000p2', '00000000-0000-0000-0000-000000000001',
   'คุณตาบุญมี', 'ตา', 'bedridden', 'หลังผ่าตัดสะโพก ติดเตียง พลิกตัวทุก 2 ชม.', 'เขตดินแดง', 'แฟลตดินแดง อาคาร 5 เขตดินแดง กทม.')
on conflict do nothing;

insert into bookings
  (id, seeker_id, caregiver_id, patient_id, status, scheduled_start, hours, hourly_rate, commission_rate, tasks, note) values
  ('00000000-0000-0000-0000-0000000000b1', '00000000-0000-0000-0000-000000000001',
   '00000000-0000-0000-0000-0000000000a1', '00000000-0000-0000-0000-0000000000p1',
   'accepted', now() + interval '1 day', 4, 180, 0.15,
   array['companionship','bathing','feeding','vitals','med_reminder'],
   'ย่าชอบกินข้าวต้มตอนเช้า ยาอยู่ในกล่องสีฟ้าที่โต๊ะหัวเตียง')
on conflict do nothing;

insert into booking_events (booking_id, type, at) values
  ('00000000-0000-0000-0000-0000000000b1', 'requested', now() - interval '20 hours'),
  ('00000000-0000-0000-0000-0000000000b1', 'accepted',  now() - interval '19 hours')
on conflict do nothing;
