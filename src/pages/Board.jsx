import { useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header.jsx'
import Avatar from '../components/Avatar.jsx'
import Icon from '../components/Icons.jsx'
import { openBattleWith, useStore, vouchLabel } from '../store.jsx'
import { useSheets } from '../sheets.jsx'
import { STATUSES } from '../data/sample.js'

const TABS = { battle: 'Battle', talk: 'Talk', collab: 'Collab' }
const ACTION = { battle: 'Battle', talk: 'Cohost', collab: 'Join' }
const FILTERS = [['live', 'Online now'], ['size', 'Similar size'], ['mutual', 'Mutuals'], ['flame', 'Flame only']]
// Until TikTok exposes LIVE stats we compare against the creator's self-reported average.
const MY_VIEWERS = 180

export default function Board() {
  const { creators, battles, status, actions, showToast } = useStore()
  const { openRequest, openLog } = useSheets()
  const [tab, setTab] = useState('battle')
  const [filters, setFilters] = useState({})

  const live = creators.filter(c => c.live)
  const ready = creators.filter(c => c.mode === 'battle' && !c.busy).length
  const incoming = battles.some(b => b.incoming && b.status === 'pending')
  const list = creators
    .filter(c => c.mode === tab)
    .filter(c => !filters.live || c.live || c.online)
    .filter(c => !filters.flame || c.flame)
    .filter(c => !filters.mutual || c.mutual)
    .filter(c => !filters.size || (c.viewers >= MY_VIEWERS / 2 && c.viewers <= MY_VIEWERS * 2))
    .sort((a, b) => (!!a.busy - !!b.busy) || b.v[0] - a.v[0])

  const changeStatus = e => {
    actions.setStatus(e.target.value)
    showToast(`Status: ${STATUSES[e.target.value]}`)
  }

  return (
    <>
      <Header>
        <Link className="icon-btn" to="/requests" aria-label="Requests"><Icon name="bell" />{incoming && <span className="dot" />}</Link>
      </Header>
      <h1>Who's on tonight?</h1>
      <div className="sub">{live.length} live · {creators.length + 16} online · {ready} battle-ready</div>

      <label className="status" htmlFor="status">
        <span className={`sdot ${status}`} />
        <span className="sub" style={{ color: 'var(--fg)' }}>Your status:</span>
        <select id="status" value={status} onChange={changeStatus}>
          {Object.entries(STATUSES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </label>

      <div className="seg" role="group" aria-label="Mode">
        {Object.entries(TABS).map(([k, v]) => <button key={k} aria-pressed={tab === k} onClick={() => setTab(k)}>{v}</button>)}
      </div>
      <div className="chips">
        {FILTERS.map(([k, label]) => (
          <button key={k} className="chip" aria-pressed={!!filters[k]} onClick={() => setFilters(f => ({ ...f, [k]: !f[k] }))}>{label}</button>
        ))}
      </div>

      <div className="section-head"><h2>Live right now</h2></div>
      <div className="strip">
        {live.map(c => (
          <Link key={c.h} to={`/u/${c.h}`}><Avatar c={c} /><span style={{ marginTop: 6 }}>@{c.h}</span></Link>
        ))}
      </div>

      <div className="section-head">
        <h2>{TABS[tab]} board</h2>
        <span className="sub">{list.length} match{list.length === 1 ? '' : 'es'}</span>
      </div>
      <div className="stack">
        {list.length === 0 && <div className="empty">Nobody matches these filters right now. Turn a filter off, or set your status so others can find you.</div>}
        {list.map(c => {
          const b = openBattleWith(battles, c.h)
          let btn = <button className="btn" disabled={c.busy} onClick={() => openRequest(c.h, tab)}>{c.busy ? 'Busy' : ACTION[tab]}</button>
          if (b?.status === 'pending' || b?.status === 'awaiting') btn = <span className="pill pend">{b.status === 'pending' ? 'Requested' : 'Confirming'}</span>
          if (b?.status === 'accepted') btn = <button className="btn teal" onClick={() => openLog(b.id)}>Log it</button>
          return (
            <div className="card" key={c.h}>
              <Link to={`/u/${c.h}`} aria-label={`Open @${c.h}`}><Avatar c={c} showTag={false} /></Link>
              <Link className="body" to={`/u/${c.h}`}>
                <div className="handle">@{c.h}{c.flame && <span className="flame" title="Flame Battler">🔥</span>}</div>
                <div className="note">{c.note}</div>
                <div className="pills">
                  <span className="pill v">{vouchLabel(c)}</span><span className="pill">{c.tag}</span><span className="pill">~{c.viewers} viewers</span>
                </div>
              </Link>
              {btn}
            </div>
          )
        })}
      </div>
    </>
  )
}
