import { Navigate, useParams } from 'react-router-dom'
import Header from '../components/Header.jsx'
import Avatar from '../components/Avatar.jsx'
import { byHandle, openBattleWith, useStore, vouchLabel } from '../store.jsx'
import { useSheets } from '../sheets.jsx'
import { PAST_OPPONENTS } from '../data/sample.js'

export default function Profile() {
  const { handle } = useParams()
  const { me, creators, battles } = useStore()
  const { openRequest, openLog } = useSheets()
  const c = byHandle(creators, handle)
  if (!c) return <Navigate to="/" replace />

  const styles = Object.entries(c.styles).sort((a, b) => b[1] - a[1])
  const b = openBattleWith(battles, c.h)
  const history = [
    ...battles.filter(x => x.opp === c.h && x.status === 'confirmed').map(() => ({ opp: me, d: 'Just now · both confirmed' })),
    ...PAST_OPPONENTS.filter(p => p !== c.h).slice(0, 3).map((p, i) => ({ opp: byHandle(creators, p), d: `${['Sat', 'Thu', 'Tue'][i]} · both confirmed` })),
  ]

  let cta = <button className="btn block" disabled={c.busy} onClick={() => openRequest(c.h)}>{c.busy ? 'In a battle now' : 'Request battle'}</button>
  if (b?.status === 'pending' || b?.status === 'awaiting') cta = <button className="btn block" disabled>{b.status === 'pending' ? 'Request sent' : 'Waiting on their confirm'}</button>
  if (b?.status === 'accepted') cta = <button className="btn teal block" onClick={() => openLog(b.id)}>Log this battle</button>

  return (
    <>
      <Header back />
      <div className="center" style={{ marginTop: 6 }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}><Avatar c={c} size="lg" /></div>
        <h1 style={{ fontSize: 26, marginTop: 22 }}>@{c.h}</h1>
        <div className="sub">{c.bio}</div>
        <div className="badges">
          {c.flame && <span className="badge f">🔥 Flame Battler</span>}
          <span className="badge v">✓ {vouchLabel(c)}</span>
          <span className="badge">TikTok linked</span>
        </div>
        {c.mutual && <div className="mutual">You follow each other on TikTok</div>}
      </div>

      <div className="row" style={{ marginTop: 18 }}>
        {cta}
        <a className="btn ghost" style={{ padding: '15px 18px', borderRadius: 16 }} href={`https://www.tiktok.com/@${c.h}`} target="_blank" rel="noopener noreferrer">TikTok ↗</a>
      </div>

      <div className="grid2" style={{ marginTop: 14 }}>
        <div className="stat"><div className="k">Usually live</div><div className="v">{c.usual}</div><div className="s">{c.hours} your time</div></div>
        <div className="stat"><div className="k">Avg stream</div><div className="v">{c.avg}</div><div className="s">self-reported</div></div>
        <div className="stat"><div className="k">Avg viewers</div><div className="v">~{c.viewers}</div><div className="s">peak {c.peak}</div></div>
        <div className="stat"><div className="k">Battles logged</div><div className="v">{c.v[1]}</div><div className="s">confirmed by both sides</div></div>
      </div>

      <div className="section-head"><h2>Battle style</h2><span className="sub">voted by opponents</span></div>
      <div className="pills">
        {styles.length
          ? styles.map(([k, n], i) => <span key={k} className={`pill${i === 0 ? ' v' : ''}`}>{k} ×{n}</span>)
          : <span className="sub">No battles logged yet. Be the first to vouch.</span>}
      </div>

      <div className="section-head"><h2>Recent battles</h2></div>
      <div className="stack">
        {history.map((x, i) => (
          <div className="hist" key={i}>
            <Avatar c={x.opp} size="sm" showTag={false} />
            <div className="body"><div className="t">vs @{x.opp.h}</div><div className="d">{x.d}</div></div>
            <span className="pill v">Vouched</span>
          </div>
        ))}
      </div>
    </>
  )
}
