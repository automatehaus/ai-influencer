# Glowroom

A companion app for TikTok LIVE creators: see who's on tonight, request a
battle or cohost, and build a reputation through battles that **both sides
confirm** and opponents **vouch** for.

Battles still happen inside TikTok LIVE. Glowroom handles the matching and
the trust layer TikTok doesn't have.

## Status

MVP front end, running on sample data in **demo mode** (`DEMO_MODE` in
`src/store.jsx`): the other creator's replies are simulated so the full loop
can be clicked through.

| Flow | State |
|---|---|
| Sign in with TikTok | UI done · Login Kit functions in `api/auth/tiktok/` waiting on an approved TikTok app |
| Live board, status, Battle / Talk / Collab tabs, filters | Done (sample data) |
| Creator profile, vouch score, battle styles | Done (sample data) |
| Request → accept | Done (simulated reply) |
| Log a battle → both confirm → vouch | Done (simulated confirm) |
| "Going live in 15" alert | UI only |
| Database (`supabase/schema.sql`), realtime presence, push notifications | Next |

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build
```

## TikTok sign-in setup

1. Create an app at https://developers.tiktok.com and add **Login Kit** with
   the `user.info.basic` and `user.info.profile` scopes.
2. Register the redirect URI, e.g. `https://<your-domain>/api/auth/tiktok/callback`.
3. Copy `.env.example` to `.env` (and into Vercel project settings) and fill it in.

TikTok's API does **not** expose LIVE data (viewer counts, stream times,
battle results). Those numbers are self-reported and backed by vouches.

## Roadmap

1. Supabase: profiles, presence, requests, battle logs (`supabase/schema.sql`)
2. Real TikTok login replacing the handle field
3. Realtime board + push notifications for requests and "going live"
4. Agency dashboard (first paid tier), Creator Pro, Flame Battler applications
