# Project context for Claude Code

## What this app is

Glowroom: a mobile-first React + Vite web app for TikTok LIVE creators to find
battle / cohost / collab partners and log battles that both sides confirm.
It is a companion to TikTok, not a streaming platform. Separate from the
owner's Telegram project.

## Key files

| Path | What it does |
|---|---|
| `src/store.jsx` | All app state + actions (localStorage). `DEMO_MODE` simulates the other creator. Replace action bodies with backend calls. |
| `src/sheets.jsx` | Request-a-battle and Log-a-battle bottom sheets |
| `src/data/sample.js` | Sample creators, styles, statuses |
| `src/pages/*` | Board, Profile (`/u/:handle`), Battles, Requests, Me, Login |
| `api/auth/tiktok/*` | TikTok Login Kit (web) OAuth start + callback, Vercel functions |
| `supabase/schema.sql` | Planned database schema |

## Conventions

- Plain CSS in `src/styles.css` with tokens on `:root`; single dark theme.
- Users must be 18+ (TikTok LIVE gifting is adults only).
- Never scrape TikTok or use unofficial LIVE APIs; only Login Kit data.
