import { readCookie, setSession } from '../../_session.js'

// Step 2: exchange the code for a token, read the verified profile, start a session.
export default async function handler(req, res) {
  const url = new URL(req.url, 'http://localhost')
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')
  if (!code || !state || state !== readCookie(req, 'gr_oauth_state')) {
    res.writeHead(302, { Location: '/?login_error=state' })
    return res.end()
  }

  const tokenRes = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_key: process.env.TIKTOK_CLIENT_KEY,
      client_secret: process.env.TIKTOK_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: process.env.TIKTOK_REDIRECT_URI,
    }),
  })
  const token = await tokenRes.json()
  if (!token.access_token) {
    res.writeHead(302, { Location: '/?login_error=token' })
    return res.end()
  }

  const fields = 'open_id,union_id,avatar_url,display_name,username'
  const userRes = await fetch(`https://open.tiktokapis.com/v2/user/info/?fields=${fields}`, {
    headers: { Authorization: `Bearer ${token.access_token}` },
  })
  const user = (await userRes.json())?.data?.user
  if (!user?.open_id) {
    res.writeHead(302, { Location: '/?login_error=profile' })
    return res.end()
  }

  // TODO(db): upsert into `profiles` keyed by open_id.
  setSession(res, { openId: user.open_id, handle: user.username, name: user.display_name, avatar: user.avatar_url })
  res.writeHead(302, { Location: '/' })
  res.end()
}
