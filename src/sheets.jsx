import { createContext, useCallback, useContext, useState } from 'react'
import Sheet, { Options, Versus } from './components/Sheet.jsx'
import Avatar from './components/Avatar.jsx'
import { byHandle, useStore } from './store.jsx'
import { STYLES } from './data/sample.js'

// Bottom sheets (request a battle, log a battle) can be opened from any screen or toast.
const SheetContext = createContext(null)

export function SheetProvider({ children }) {
  const [sheet, setSheet] = useState(null)
  const close = useCallback(() => setSheet(null), [])
  const value = {
    openRequest: (handle, mode) => setSheet({ type: 'request', handle, mode }),
    openLog: id => setSheet({ type: 'log', id }),
  }
  return (
    <SheetContext.Provider value={value}>
      {children}
      {sheet?.type === 'request' && <RequestSheet {...sheet} onClose={close} />}
      {sheet?.type === 'log' && <LogSheet id={sheet.id} onClose={close} />}
    </SheetContext.Provider>
  )
}

export const useSheets = () => useContext(SheetContext)

const WHEN = ['Right now', 'In 15 min', 'Tonight 9 PM', 'Tomorrow 9 PM']
const NOUN = { battle: 'battle', talk: 'cohost', collab: 'collab' }

function RequestSheet({ handle, mode = 'battle', onClose }) {
  const { me, creators, actions, showToast } = useStore()
  const c = byHandle(creators, handle)
  const [when, setWhen] = useState(WHEN[0])
  const [msg, setMsg] = useState('')

  const send = () => {
    actions.sendRequest(handle, when, msg.trim())
    onClose()
    showToast(`Request sent to @${handle}`)
  }

  return (
    <Sheet title={`Request a ${NOUN[mode]}`} onClose={onClose}>
      <Versus me={<Avatar c={me} />} opp={<><Avatar c={c} showTag={false} />@{c.h}</>} />
      <div className="q">When?</div>
      <Options value={when} onChange={setWhen} options={WHEN.map(w => [w, w])} />
      <label className="f" htmlFor="msg">Message (optional)</label>
      <input className="t" id="msg" placeholder="Run it back? Loser does a dare" maxLength={80}
        value={msg} onChange={e => setMsg(e.target.value)} />
      <div className="info">When they accept, you'll both get a ping. Then open TikTok LIVE and send the battle invite there as usual.</div>
      <button className="btn block" onClick={send}>Send request to @{c.h}</button>
    </Sheet>
  )
}

function LogSheet({ id, onClose }) {
  const { me, creators, battles, actions, showToast } = useStore()
  const b = battles.find(x => x.id === id)
  const c = b && byHandle(creators, b.opp)
  const [happened, setHappened] = useState('yes')
  const [vouch, setVouch] = useState('yes')
  const [styles, setStyles] = useState(c ? [c.tag] : [])
  if (!b) return null

  const toggleStyle = s => setStyles(xs => (xs.includes(s) ? xs.filter(x => x !== s) : [...xs, s]))
  const submit = () => {
    actions.logBattle(id, { happened: happened === 'yes', vouched: vouch === 'yes', styles })
    onClose()
    showToast(happened === 'yes' ? `Logged. Waiting on @${c.h} to confirm.` : 'Marked as not happened. Nothing counts toward anyone.')
  }

  return (
    <Sheet title="Log a battle" onClose={onClose}>
      <Versus me={<Avatar c={me} />} opp={<><Avatar c={c} showTag={false} />@{c.h}</>} />
      <div className="q">1. Did this battle happen?</div>
      <Options value={happened} onChange={setHappened} options={[['yes', 'Yes, we battled'], ['no', 'No']]} />
      {happened === 'yes' && <>
        <div className="q">2. Would you vouch for @{c.h} as a battler?</div>
        <Options teal value={vouch} onChange={setVouch} options={[['yes', 'Yes, vouch'], ['no', 'Not yet']]} />
        <div className="q">3. Their battle style <span>(pick any)</span></div>
        <div className="pills">
          {STYLES.map(s => (
            <button key={s} className="chip" aria-pressed={styles.includes(s)} onClick={() => toggleStyle(s)}>{s}</button>
          ))}
        </div>
      </>}
      <div className="info">This counts toward their <b>Vouched</b> score only after <b>both</b> of you confirm the battle. Skipping question 2 doesn't count against anyone.</div>
      <button className="btn block" onClick={submit}>
        {happened === 'yes' ? `Submit · waiting on @${c.h}` : 'Submit'}
      </button>
    </Sheet>
  )
}
