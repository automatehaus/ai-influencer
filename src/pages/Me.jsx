import Header from '../components/Header.jsx'
import Avatar from '../components/Avatar.jsx'
import { useStore } from '../store.jsx'
import { FLAME_THRESHOLD, STATUSES } from '../data/sample.js'

export default function Me() {
  const { me, battles, status, goingLive, actions } = useStore()
  const confirmed = battles.filter(b => b.status === 'confirmed').length
  const toGo = FLAME_THRESHOLD - confirmed

  return (
    <>
      <Header />
      <div className="center" style={{ marginTop: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}><Avatar c={{ ...me, live: goingLive }} size="lg" /></div>
        <h1 style={{ fontSize: 24, marginTop: 22 }}>@{me.h}</h1>
        <div className="sub">{STATUSES[status]}</div>
        <div className="badges">
          <span className="badge v">✓ Vouched {me.vouches}/{confirmed}</span>
          <span className="badge">TikTok linked</span>
        </div>
      </div>
      <div className="grid2" style={{ marginTop: 18 }}>
        <div className="stat"><div className="k">Battles logged</div><div className="v">{confirmed}</div><div className="s">confirmed by both sides</div></div>
        <div className="stat"><div className="k">Flame Battler</div><div className="v">{toGo <= 0 ? 'Eligible' : `${toGo} to go`}</div><div className="s">needs {FLAME_THRESHOLD} vouched battles</div></div>
      </div>
      <label className="f" htmlFor="usual">When you usually go live</label>
      <input className="t" id="usual" value={me.usual} onChange={e => actions.updateMe({ usual: e.target.value })} />
      <label className="f" htmlFor="bio">Bio</label>
      <textarea className="t" id="bio" rows={2} value={me.bio} onChange={e => actions.updateMe({ bio: e.target.value })} />
      <div className="info" style={{ marginTop: 20 }}>
        <b>How vouching works.</b> After a battle, both creators log it. It only counts once both confirm, and each opponent can vouch for you and tag your style. That's what builds your score.
      </div>
      <button className="btn ghost block" onClick={actions.signOut}>Sign out</button>
    </>
  )
}
