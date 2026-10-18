import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { SAMPLE_CREATORS } from './data/sample.js'

// localStorage-backed app state. Every mutation goes through the action
// functions below, so swapping in a real backend means replacing their bodies.
const KEY = 'glowroom-v1'

// Until there is a backend, the other creator's side (accepting, confirming)
// is simulated so the whole loop can be clicked through.
export const DEMO_MODE = true

const initial = () => ({
  me: null,
  status: 'battle',
  goingLive: false,
  creators: SAMPLE_CREATORS,
  battles: [],
})

function load() {
  try {
    const s = JSON.parse(localStorage.getItem(KEY))
    return s && s.creators ? s : initial()
  } catch {
    return initial()
  }
}

export const generateId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6)

const StoreContext = createContext(null)

export function StoreProvider({ children }) {
  const [state, setState] = useState(load)
  const [toast, setToast] = useState(null)
  const toastTimer = useRef()

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(state)) } catch {}
  }, [state])

  const showToast = useCallback((text, action) => {
    clearTimeout(toastTimer.current)
    setToast({ text, action })
    toastTimer.current = setTimeout(() => setToast(null), 5000)
  }, [])

  const patchBattle = (id, patch) =>
    setState(s => ({ ...s, battles: s.battles.map(b => (b.id === id ? { ...b, ...patch } : b)) }))

  const actions = {
    signIn(handle) {
      setState(s => ({
        ...s,
        me: { h: handle, vouches: 0, usual: 'Tue · Thu · Sat, 9–11 PM', bio: 'Comedy battles & late-night lives' },
        // One incoming request so the Requests tab has something to show.
        battles: DEMO_MODE ? [{ id: generateId(), opp: 'milly', incoming: true, status: 'pending', when: 'Tonight 11 PM' }] : [],
      }))
    },
    signOut() {
      try { localStorage.removeItem(KEY) } catch {}
      setState(initial())
    },
    updateMe(patch) { setState(s => ({ ...s, me: { ...s.me, ...patch } })) },
    setStatus(status) { setState(s => ({ ...s, status })) },
    toggleGoingLive() {
      setState(s => ({ ...s, goingLive: !s.goingLive }))
    },

    sendRequest(opp, when, msg) {
      const b = { id: generateId(), opp, status: 'pending', when, msg }
      setState(s => ({ ...s, battles: [...s.battles, b] }))
      if (DEMO_MODE) {
        setTimeout(() => {
          patchBattle(b.id, { status: 'accepted' })
          showToast(`@${opp} accepted. Go live and send the battle invite on TikTok.`, { type: 'log', id: b.id, label: 'Log after' })
        }, 2500)
      }
      return b
    },
    respond(id, accept) { patchBattle(id, { status: accept ? 'accepted' : 'declined' }) },

    // Logging only counts once both sides confirm; in DEMO_MODE the other side confirms after a delay.
    logBattle(id, { happened, vouched, styles }) {
      if (!happened) return patchBattle(id, { status: 'notyet' })
      patchBattle(id, { status: 'awaiting', vouched, styles })
      if (!DEMO_MODE) return
      setTimeout(() => {
        setState(s => {
          const b = s.battles.find(x => x.id === id)
          return {
            ...s,
            me: { ...s.me, vouches: s.me.vouches + 1 },
            battles: s.battles.map(x => (x.id === id ? { ...x, status: 'confirmed', confirmedAt: Date.now() } : x)),
            creators: s.creators.map(c => {
              if (c.h !== b.opp) return c
              const st = { ...c.styles }
              if (vouched) styles.forEach(k => (st[k] = (st[k] || 0) + 1))
              return { ...c, v: [c.v[0] + (vouched ? 1 : 0), c.v[1] + 1], styles: st }
            }),
          }
        })
        showToast('They confirmed and vouched for you. Your score went up.', { type: 'me', label: 'See profile' })
      }, 3000)
    },
  }

  return (
    <StoreContext.Provider value={{ ...state, actions, toast, showToast, dismissToast: () => setToast(null) }}>
      {children}
    </StoreContext.Provider>
  )
}

export const useStore = () => useContext(StoreContext)

export const byHandle = (creators, h) => creators.find(c => c.h === h)

// The newest open (not finished) battle you started with this creator.
export const openBattleWith = (battles, h) =>
  battles.filter(b => b.opp === h && !b.incoming && ['pending', 'accepted', 'awaiting'].includes(b.status)).pop()

export const vouchLabel = c => (c.v[1] ? `Vouched ${c.v[0]}/${c.v[1]}` : 'Vouched –')
