import Header from '../components/Header.jsx'
import Avatar from '../components/Avatar.jsx'
import StatusPill from '../components/StatusPill.jsx'
import { byHandle, useStore, vouchLabel } from '../store.jsx'
import { useSheets } from '../sheets.jsx'

export default function Requests() {
  const { creators, battles, actions, showToast } = useStore()
  const { openLog } = useSheets()
  const incoming = battles.filter(b => b.incoming)

  const respond = (b, accept) => {
    actions.respond(b.id, accept)
    showToast(accept ? `You accepted @${b.opp}. Open TikTok LIVE when it's time.` : "Passed. They won't see a reason.")
  }

  return (
    <>
      <Header />
      <h1>Requests</h1>
      <div className="sub">Creators who want to battle or cohost with you.</div>
      <div className="stack" style={{ marginTop: 16 }}>
        {incoming.length === 0 && <div className="empty">No requests yet. Set your status to <b>Looking to battle</b> and you'll show up on the board.</div>}
        {incoming.slice().reverse().map(b => {
          const c = byHandle(creators, b.opp)
          return (
            <div className="card" key={b.id}>
              <Avatar c={c} size="sm" showTag={false} />
              <div className="body">
                <div className="handle" style={{ fontSize: 15 }}>@{c.h}</div>
                <div className="note">{b.when} · {vouchLabel(c)}</div>
              </div>
              {b.status === 'pending' && <div className="row">
                <button className="btn ghost" onClick={() => respond(b, false)}>Pass</button>
                <button className="btn" onClick={() => respond(b, true)}>Accept</button>
              </div>}
              {b.status === 'accepted' && <button className="btn teal" onClick={() => openLog(b.id)}>Log it</button>}
              {b.status !== 'pending' && b.status !== 'accepted' && <StatusPill status={b.status} />}
            </div>
          )
        })}
      </div>
    </>
  )
}
