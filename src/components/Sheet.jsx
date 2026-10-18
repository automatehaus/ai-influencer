import { useEffect } from 'react'
import Icon from './Icons.jsx'

export default function Sheet({ title, onClose, children }) {
  useEffect(() => {
    const onKey = e => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="scrim" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="sheet" role="dialog" aria-modal="true" aria-label={title}>
        <div className="row">
          <button className="icon-btn" onClick={onClose} aria-label="Close"><Icon name="x" /></button>
          <h3>{title}</h3>
          <span style={{ width: 40 }} />
        </div>
        {children}
      </div>
    </div>
  )
}

export function Versus({ me, opp }) {
  return (
    <div className="vs">
      <div className="who">{me}You</div>
      <b>VS</b>
      <div className="who">{opp}</div>
    </div>
  )
}

// Two-or-more option toggle group used by the request and log sheets.
export function Options({ value, onChange, options, teal }) {
  return (
    <div className="opts">
      {options.map(([v, label]) => (
        <button key={v} className={`opt${teal ? ' t' : ''}`} aria-pressed={value === v} onClick={() => onChange(v)}>
          {label}
        </button>
      ))}
    </div>
  )
}
