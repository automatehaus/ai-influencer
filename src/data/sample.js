// Sample creators used until the backend exists. Shape matches the
// `profiles` table in supabase/schema.sql plus a few derived fields.
export const SAMPLE_CREATORS = [
  { h: 'nathalina', hue: 320, live: true, mode: 'battle', note: 'Looking to battle right now', v: [14, 15], tag: 'Hype', viewers: 180, peak: 410, usual: 'Tue · Thu · Sat', hours: '9–11 PM', avg: '1h 45m', flame: true, mutual: true, bio: 'Nathalina · late-night hype battles', styles: { Hype: 11, Strategic: 6, 'Good sport': 9 } },
  { h: 'fitz', hue: 200, online: true, mode: 'battle', note: 'Battle-ready after 9 PM CT', v: [31, 32], tag: 'Strategic', viewers: 400, peak: 1200, usual: 'Mon–Fri', hours: '9–11 PM', avg: '2h 10m', flame: true, mutual: false, bio: 'Fitz · strategy battles & music', styles: { Strategic: 22, Hype: 8, 'Good sport': 17 } },
  { h: 'rayna', hue: 20, live: true, busy: true, mode: 'battle', note: 'In a battle now · WIN ×3', v: [22, 24], tag: 'Comedy', viewers: 310, peak: 650, usual: 'Nightly', hours: '9–11 PM', avg: '1h 30m', flame: true, mutual: true, bio: 'Rayna · comedy battles & sunset lives', styles: { Comedy: 15, Hype: 9, 'Good sport': 12 } },
  { h: 'milly', hue: 180, live: true, mode: 'battle', note: 'Looking to battle', v: [18, 19], tag: 'Gift-heavy', viewers: 240, peak: 520, usual: 'Fri · Sat', hours: '11 PM–1 AM', avg: '2h', flame: true, mutual: false, bio: 'Milly · beach lives, big gift energy', styles: { 'Gift-heavy': 12, Hype: 10 } },
  { h: 'dina', hue: 40, live: true, mode: 'talk', note: 'Open to cohost', v: [3, 4], tag: 'Good sport', viewers: 60, peak: 140, usual: 'Weekends', hours: '2–5 PM', avg: '1h 10m', flame: false, mutual: true, bio: 'Dina · chill talks while working', styles: { 'Good sport': 3, Chill: 2 } },
  { h: 'chrii', hue: 140, online: true, mode: 'talk', note: 'Open to cohost a talk', v: [5, 5], tag: 'Chill', viewers: 120, peak: 260, usual: 'Sun', hours: '7–9 PM', avg: '1h 20m', flame: false, mutual: false, bio: 'Chrii · side-hustle talk shows', styles: { Chill: 4, 'Good sport': 5 } },
  { h: 'giogunna', hue: 280, live: true, mode: 'collab', note: 'Planning a theme night', v: [0, 0], tag: 'New battler', viewers: 45, peak: 90, usual: 'Thu', hours: '8–10 PM', avg: '55m', flame: false, mutual: false, bio: 'Gio · 90s night organizer', styles: {} },
]

export const PAST_OPPONENTS = ['milly', 'nathalina', 'fitz', 'rayna', 'chrii']

export const STYLES = ['Hype', 'Strategic', 'Comedy', 'Good sport', 'Gift-heavy', 'Chill']

export const STATUSES = {
  battle: 'Looking to battle',
  talk: 'Open to cohost a talk',
  collab: 'Planning collabs',
  dnd: 'Do not disturb',
}

// A battle needs this many confirmed, vouched battles before applying for Flame.
export const FLAME_THRESHOLD = 3
