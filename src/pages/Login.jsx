import { useState } from 'react'
import Icon from '../components/Icons.jsx'
import { Brand } from '../components/Header.jsx'
import { useStore } from '../store.jsx'

// TODO(tiktok-login): replace the handle field with a redirect to /api/auth/tiktok/start
// once the TikTok app is approved. The callback returns the verified username.
export default function Login() {
  const { actions, showToast } = useStore()
  const [handle, setHandle] = useState('')
  const [adult, setAdult] = useState(false)

  const submit = e => {
    e.preventDefault()
    if (!adult) return showToast('Glowroom is 18+ only, same as TikTok LIVE gifting.')
    const h = handle.trim().replace(/^@/, '')
    if (!h) return showToast('Enter your TikTok username to continue.')
    actions.signIn(h)
  }

  return (
    <form className="login" onSubmit={submit}>
      <Brand />
      <div className="big">Find your next <em>battle</em> before you go live.</div>
      <p className="sub">See which TikTok LIVE creators are on tonight, request a battle or cohost, and build a reputation that opponents vouch for.</p>
      <label className="f" htmlFor="handle">Your TikTok username</label>
      <input className="t" id="handle" placeholder="@yourname" autoComplete="off" value={handle} onChange={e => setHandle(e.target.value)} />
      <label className="check">
        <input type="checkbox" id="adult" checked={adult} onChange={e => setAdult(e.target.checked)} />
        I'm 18 or older. TikTok LIVE gifting is adults only.
      </label>
      <button className="btn block tt" type="submit"><Icon name="tiktok" />Continue with TikTok</button>
      <p className="fine">We'll confirm you own the account through TikTok's sign-in and only read your public profile.</p>
    </form>
  )
}
