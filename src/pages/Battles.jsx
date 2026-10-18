import { Link } from 'react-router-dom'
import Header from '../components/Header.jsx'
import Avatar from '../components/Avatar.jsx'
import StatusPill from '../components/StatusPill.jsx'
import { byHandle, useStore } from '../store.jsx'
import { useSheets } from '../sheets.jsx'

export default function Battles() {
  const { creators, battles } = useStore()
  const { openLog } = useSheets()
  const mine = battles.filter(b => !b.incoming)
  const all = battles.filter(b => b.status === 'confirmed' || b.status === 'accepted')

  return (
    <>
      <Header />
      <h1>My battles</h1>
      <div className="sub">Requests you sent and battles to log. A battle counts once both of you confirm it.</div>
      <div className="grid2" style={{ marginTop: 14 }}>
        <div className="stat"><div className="k">Logged</div><div className="v">{all.filter(b => b.status === 'confirmed').length}</div><div className="s">confirmed by both</div></div>
        <div className="stat"><div className="k">To log</div><div className="v">{all.filter(b => b.status === 'accepted').length}</div><div className="s">after you battle</div></div>
      </div>
      <div className="section-head"><h2>Activity</h2></div>
      <div className="stack">
        {mine.length === 0 && <div className="empty">No battles yet. Pick someone on the <Link to="/" style={{ color: 'var(--pink)' }}>board</Link> and tap <b>Battle</b>.</div>}
        {mine.slice().reverse().map(b => {
          const c = byHandle(creators, b.opp)
          return (
            <div className="hist" key={b.id}>
              <Avatar c={c} size="sm" showTag={false} />
              <div className="body"><div className="t">vs @{c.h}</div><div className="d">{b.when}{b.msg && ` · “${b.msg}”`}</div></div>
              {b.status === 'accepted' ? <button className="btn teal" onClick={() => openLog(b.id)}>Log it</button> : <StatusPill status={b.status} />}
            </div>
          )
        })}
      </div>
    </>
  )
}
