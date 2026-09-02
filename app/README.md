# app/ — Caregivers For Tomorrow (Expo)

MVP mobile app. **Runs with zero backend** — all data is in-memory mock data
(`src/data/`), so `npm start` shows the full flow immediately. Supabase is the
planned backend (`../supabase/`), wired later via `src/lib/supabase.ts`.

## Stack

| | |
|---|---|
| Framework | Expo SDK 57 · React Native · expo-router (file-based) |
| Language | TypeScript |
| UI | custom design system in `src/theme/tokens.ts` + `src/components/` |
| Fonts | Noto Sans Thai (`@expo-google-fonts`) |
| Backend (later) | Supabase — Postgres + Auth + RLS (`../supabase/migrations`) |

## Run it

```bash
cd app
npm install
npm start
```

Then press `a` for Android emulator, or scan the QR with **Expo Go** on your phone
(same Wi-Fi). Portraits load from the network.

Type check:

```bash
npm run typecheck
```

## Structure

```
src/
  app/                 expo-router routes
    _layout.tsx        fonts + providers + Stack
    index.tsx          welcome / role select
    (tabs)/            ค้นหา · การจอง · บัญชี
    caregiver/[id]     caregiver profile
    book/[caregiverId] booking flow (recipient → time → hours → tasks → price)
    booking/[id]       booking detail: timeline, GPS check-in/out, review
  components/           Button, Card, Chip, Avatar, badges, Timeline, ...
  theme/tokens.ts       colors, spacing, radius, typography
  data/
    types.ts            domain model (mirrors ../supabase migration)
    catalog.ts          bounded task list — "งานดูแลทั่วไป" only, หัตถการ excluded
    mock.ts             seed caregivers / patients / reviews / bookings
    store.tsx           in-memory state + actions (swap for Supabase later)
    format.ts           THB + Thai date/time + price math
  lib/supabase.ts        client wiring (commented until backend is live)
```

## What the demo covers

- Browse caregivers, filter by tier, sorted by fit to the recipient's mobility level
- Caregiver profile: verification, license, services, reviews
- Booking flow with live price breakdown (incl. platform commission split)
- Booking lifecycle: request → accept → **GPS check-in** → **check-out** → **review**
- "Safety / how we screen" and the 3-tier model surfaced in the บัญชี tab

## Not in the MVP (on purpose)

Real payments (needs a registered company — Omise/PromptPay later) · real
background-check API (สตช. has none — manual review) · maps SDK · persistence.
