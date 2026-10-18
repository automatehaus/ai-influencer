import crypto from 'node:crypto'

// Step 1 of TikTok Login Kit (web): send the user to TikTok's consent screen.
// Docs: https://developers.tiktok.com/doc/login-kit-web
export default function handler(req, res) {
  const state = crypto.randomBytes(16).toString('hex')
  const params = new URLSearchParams({
    client_key: process.env.TIKTOK_CLIENT_KEY,
    scope: 'user.info.basic,user.info.profile',
    response_type: 'code',
    redirect_uri: process.env.TIKTOK_REDIRECT_URI,
    state,
  })
  res.setHeader('Set-Cookie', `gr_oauth_state=${state}; Path=/; HttpOnly; SameSite=Lax; Max-Age=600`)
  res.writeHead(302, { Location: `https://www.tiktok.com/v2/auth/authorize/?${params}` })
  res.end()
}
