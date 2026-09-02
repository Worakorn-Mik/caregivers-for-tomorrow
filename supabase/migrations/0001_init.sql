-- Caregivers For Tomorrow — initial schema
-- Postgres / Supabase. Mirrors app/src/data/types.ts
-- Run in the Supabase SQL editor, or with the Supabase CLI: `supabase db push`.

-- ─────────────────────────────  enums  ─────────────────────────────
create type role              as enum ('seeker', 'caregiver');
create type caregiver_tier    as enum ('assistant', 'na_pn', 'rn');
create type mobility_level     as enum ('independent', 'semi', 'bedridden');
create type verification_status as enum ('verified', 'pending', 'unverified');
create type booking_status     as enum ('requested', 'accepted', 'in_progress', 'completed', 'cancelled');
create type booking_event_type as enum ('requested', 'accepted', 'checked_in', 'checked_out', 'cancelled');
create type review_direction   as enum ('seeker_to_caregiver', 'caregiver_to_seeker');

-- ────────────────────────────  helpers  ────────────────────────────
create or replace function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ───────────────────────────  profiles  ────────────────────────────
-- One row per auth user. `role` picks which side of the marketplace they are on.
create table profiles (
  id          uuid primary key references auth.users on delete cascade,
  role        role not null default 'seeker',
  full_name   text not null,
  phone       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- extra fields for users who provide care
create table caregiver_profiles (
  profile_id       uuid primary key references profiles on delete cascade,
  tier             caregiver_tier not null default 'assistant',
  photo_url        text,
  hourly_rate      integer not null check (hourly_rate >= 0),   -- THB / hour
  service_area     text not null,
  years_experience integer not null default 0,
  bio              text default '',
  verification     verification_status not null default 'pending',
  license_no       text,                                        -- สภาการพยาบาล (na_pn / rn)
  license_verified_at timestamptz,
  bg_check_status  verification_status not null default 'pending',
  accepts_mobility mobility_level[] not null default '{independent}',
  rating_avg       numeric(2,1) not null default 0,
  rating_count     integer not null default 0,
  jobs_done        integer not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- tasks a caregiver offers — keys come from app/src/data/catalog.ts (ALLOWED_TASKS)
create table caregiver_services (
  caregiver_id uuid not null references caregiver_profiles on delete cascade,
  task_key     text not null,
  primary key (caregiver_id, task_key)
);

-- care recipients owned by a seeker
create table patients (
  id           uuid primary key default gen_random_uuid(),
  owner_id     uuid not null references profiles on delete cascade,
  name         text not null,
  relation     text not null,
  mobility     mobility_level not null,
  conditions   text default '',
  area         text not null,
  address_line text not null,
  created_at   timestamptz not null default now()
);

-- ───────────────────────────  bookings  ────────────────────────────
create table bookings (
  id               uuid primary key default gen_random_uuid(),
  seeker_id        uuid not null references profiles on delete restrict,
  caregiver_id     uuid not null references caregiver_profiles on delete restrict,
  patient_id       uuid not null references patients on delete restrict,
  status           booking_status not null default 'requested',
  scheduled_start  timestamptz not null,
  hours            numeric(4,1) not null check (hours > 0),
  hourly_rate      integer not null,                 -- snapshot at booking time
  commission_rate  numeric(4,3) not null default 0.150,
  tasks            text[] not null default '{}',
  note             text,
  checked_in_at    timestamptz,
  checked_out_at   timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index on bookings (seeker_id);
create index on bookings (caregiver_id);
create index on bookings (status);

-- append-only audit trail + GPS check-in/out; also the raw material for the
-- "expansion opportunities from data" point in the judge feedback
create table booking_events (
  id         uuid primary key default gen_random_uuid(),
  booking_id uuid not null references bookings on delete cascade,
  type       booking_event_type not null,
  at         timestamptz not null default now(),
  lat        double precision,
  lng        double precision,
  note       text
);
create index on booking_events (booking_id, at);

create table reviews (
  id           uuid primary key default gen_random_uuid(),
  booking_id   uuid not null references bookings on delete cascade,
  caregiver_id uuid not null references caregiver_profiles on delete cascade,
  author_id    uuid not null references profiles on delete cascade,
  direction    review_direction not null,
  stars        integer not null check (stars between 1 and 5),
  comment      text default '',
  created_at   timestamptz not null default now(),
  unique (booking_id, direction)
);
create index on reviews (caregiver_id);

create trigger t_profiles_updated  before update on profiles           for each row execute function set_updated_at();
create trigger t_cg_updated        before update on caregiver_profiles for each row execute function set_updated_at();
create trigger t_bookings_updated  before update on bookings           for each row execute function set_updated_at();

-- keep caregiver_profiles.rating_avg / rating_count in sync with reviews
create or replace function recalc_caregiver_rating() returns trigger as $$
declare cid uuid;
begin
  cid := coalesce(new.caregiver_id, old.caregiver_id);
  update caregiver_profiles cp set
    rating_count = sub.cnt,
    rating_avg   = coalesce(sub.avg_stars, 0)
  from (
    select count(*) cnt, round(avg(stars)::numeric, 1) avg_stars
    from reviews
    where caregiver_id = cid and direction = 'seeker_to_caregiver'
  ) sub
  where cp.profile_id = cid;
  return null;
end;
$$ language plpgsql;

create trigger t_reviews_recalc
  after insert or update or delete on reviews
  for each row execute function recalc_caregiver_rating();

-- ─────────────────────────  row-level security  ────────────────────
alter table profiles            enable row level security;
alter table caregiver_profiles  enable row level security;
alter table caregiver_services  enable row level security;
alter table patients            enable row level security;
alter table bookings            enable row level security;
alter table booking_events      enable row level security;
alter table reviews             enable row level security;

-- profiles: readable by any signed-in user (needed to show caregiver names);
-- writable only by the owner
create policy "profiles readable"        on profiles for select to authenticated using (true);
create policy "profiles self-write"      on profiles for update to authenticated using (id = auth.uid());
create policy "profiles self-insert"     on profiles for insert to authenticated with check (id = auth.uid());

-- caregiver profiles + services: public read, self write
create policy "cg read"                  on caregiver_profiles for select to authenticated using (true);
create policy "cg self-write"            on caregiver_profiles for all    to authenticated using (profile_id = auth.uid()) with check (profile_id = auth.uid());
create policy "cg services read"         on caregiver_services for select to authenticated using (true);
create policy "cg services self-write"   on caregiver_services for all    to authenticated using (caregiver_id = auth.uid()) with check (caregiver_id = auth.uid());

-- patients: only the owning seeker
create policy "patients owner"           on patients for all to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());

-- bookings: visible to the seeker or the caregiver on the booking
create policy "bookings party read"      on bookings for select to authenticated
  using (seeker_id = auth.uid() or caregiver_id = auth.uid());
create policy "bookings seeker create"   on bookings for insert to authenticated
  with check (seeker_id = auth.uid());
create policy "bookings party update"    on bookings for update to authenticated
  using (seeker_id = auth.uid() or caregiver_id = auth.uid());

-- booking events: visible to either party; insert by either party on their booking
create policy "events party read"        on booking_events for select to authenticated using (
  exists (select 1 from bookings b where b.id = booking_id and (b.seeker_id = auth.uid() or b.caregiver_id = auth.uid()))
);
create policy "events party insert"      on booking_events for insert to authenticated with check (
  exists (select 1 from bookings b where b.id = booking_id and (b.seeker_id = auth.uid() or b.caregiver_id = auth.uid()))
);

-- reviews: anyone signed in can read; author can write their own for a booking they were on
create policy "reviews read"             on reviews for select to authenticated using (true);
create policy "reviews author insert"    on reviews for insert to authenticated with check (
  author_id = auth.uid()
  and exists (select 1 from bookings b where b.id = booking_id and (b.seeker_id = auth.uid() or b.caregiver_id = auth.uid()))
);
