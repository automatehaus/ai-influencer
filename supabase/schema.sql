-- Glowroom core schema (Postgres / Supabase). Not wired up yet; the app runs
-- on sample data in src/store.jsx until these tables exist.

create table profiles (
  id            uuid primary key default gen_random_uuid(),
  tiktok_open_id text unique not null,          -- from TikTok Login Kit, never changes
  handle        text unique not null,           -- TikTok username, refreshed on each login
  display_name  text,
  avatar_url    text,
  bio           text,
  usual_live    text,                           -- self-reported, e.g. "Tue · Thu · Sat, 9–11 PM"
  avg_viewers   int,                            -- self-reported; TikTok doesn't expose LIVE stats
  is_flame      boolean not null default false,
  is_adult      boolean not null default false, -- 18+ attestation at signup
  created_at    timestamptz not null default now()
);

-- What the creator is up for right now. One row per creator, upserted.
create table presence (
  profile_id  uuid primary key references profiles on delete cascade,
  status      text not null check (status in ('battle', 'talk', 'collab', 'dnd')),
  note        text,
  is_live     boolean not null default false,
  going_live_at timestamptz,                    -- "I'm going live in 15"
  updated_at  timestamptz not null default now()
);

create table requests (
  id          uuid primary key default gen_random_uuid(),
  from_id     uuid not null references profiles on delete cascade,
  to_id       uuid not null references profiles on delete cascade,
  kind        text not null check (kind in ('battle', 'talk', 'collab')),
  proposed_for text not null,                   -- "Right now", "Tonight 9 PM", ...
  message     text check (char_length(message) <= 80),
  status      text not null default 'pending' check (status in ('pending', 'accepted', 'declined', 'expired')),
  created_at  timestamptz not null default now(),
  check (from_id <> to_id)
);

-- A battle counts only when both sides have logged it with happened = true.
create table battle_logs (
  id          uuid primary key default gen_random_uuid(),
  request_id  uuid not null references requests on delete cascade,
  author_id   uuid not null references profiles on delete cascade,
  subject_id  uuid not null references profiles on delete cascade,  -- the opponent being rated
  happened    boolean not null,
  vouch       boolean,                          -- null = skipped, never counts against anyone
  styles      text[] not null default '{}',
  created_at  timestamptz not null default now(),
  unique (request_id, author_id)
);

-- Confirmed battles: both sides logged the same request and both said it happened.
create view confirmed_battles as
select a.request_id, a.author_id, a.subject_id, a.vouch, a.styles
from battle_logs a
join battle_logs b on b.request_id = a.request_id and b.author_id = a.subject_id
where a.happened and b.happened;

-- "Vouched 14/15": vouches received over confirmed battles.
create view vouch_scores as
select subject_id as profile_id,
       count(*) filter (where vouch) as vouches,
       count(*) as battles
from confirmed_battles
group by subject_id;
