# supabase/

Backend schema for Caregivers For Tomorrow. **Not wired into the app yet** — the
MVP demo runs entirely on in-memory mock data (`app/src/data/`). This folder is
the drop-in backend for when the team is ready.

## Contents

| File | What |
|---|---|
| `migrations/0001_init.sql` | tables, enums, RLS policies, rating triggers |
| `seed.sql` | demo rows that match `app/src/data/mock.ts` (needs real `auth.users` ids — see notes in the file) |

## Bring it online

1. Create a project at https://supabase.com (free tier).
2. SQL editor → paste `migrations/0001_init.sql` → run.
   (or install the Supabase CLI and `supabase db push`)
3. In the app: `cd app && npx expo install @supabase/supabase-js @react-native-async-storage/async-storage react-native-url-polyfill`
4. `cp app/.env.example app/.env` and fill `EXPO_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_ANON_KEY`.
5. Uncomment the client block in `app/src/lib/supabase.ts`.
6. Replace the seed arrays in `app/src/data/store.tsx` with Supabase queries
   (keep the same `StoreValue` shape so screens don't change).

## Design notes

- **Relational on purpose.** Bookings ↔ caregivers ↔ patients ↔ reviews are join-heavy;
  Postgres handles the queries the demo needs (filter by tier, sort by rating,
  "bookings where I am the seeker OR the caregiver") that would be awkward in Firestore.
- **RLS = the security model.** A caregiver can only read bookings they are on; a
  seeker only their own patients. No hand-written auth layer in the app.
- **`booking_events` is append-only** — the GPS check-in/out trail and the raw data
  for spotting adjacent services (the judge-feedback "expansion from data" point).
- **`mobility_level` on `patients`** is the segmentation axis the judges asked us to
  make explicit (independent / semi / bedridden).
