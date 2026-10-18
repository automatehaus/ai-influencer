import { useNavigate } from 'react-router-dom'
import { useStore } from '../store.jsx'
import { useSheets } from '../sheets.jsx'

export default function Toast() {
  const { toast, dismissToast } = useStore()
  const { openLog } = useSheets()
  const navigate = useNavigate()
  if (!toast) return null

  const run = () => {
    const a = toast.action
    dismissToast()
    if (a.type === 'log') openLog(a.id)
    if (a.type === 'me') navigate('/me')
  }

  return (
    <div className="toast" role="status">
      <span>{toast.text}</span>
      {toast.action && <button onClick={run}>{toast.action.label}</button>}
    </div>
  )
}
