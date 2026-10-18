import crypto from 'node:crypto'

// Minimal signed-cookie session: base64url(JSON).hmac. Swap for Supabase Auth
// (custom OIDC provider) once the database is in place.
const COOKIE = 'gr_session'

const sign = data => crypto.createHmac('sha256', process.env.SESSION_SECRET).update(data).digest('base64url')

export function setSession(res, payload) {
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  res.setHeader('Set-Cookie', `${COOKIE}=${data}.${sign(data)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000${secure}`)
}

export function getSession(req) {
  const raw = (req.headers.cookie || '').split('; ').find(c => c.startsWith(COOKIE + '='))
  if (!raw) return null
  const [data, mac] = raw.slice(COOKIE.length + 1).split('.')
  const expected = Buffer.from(sign(data || ''))
  if (!mac || Buffer.from(mac).length !== expected.length || !crypto.timingSafeEqual(Buffer.from(mac), expected)) return null
  try { return JSON.parse(Buffer.from(data, 'base64url').toString()) } catch { return null }
}

export function readCookie(req, name) {
  const raw = (req.headers.cookie || '').split('; ').find(c => c.startsWith(name + '='))
  return raw ? decodeURIComponent(raw.slice(name.length + 1)) : null
}
