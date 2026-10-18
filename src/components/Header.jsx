import { useNavigate } from 'react-router-dom'
import Icon from './Icons.jsx'

export function Brand() {
  return <div className="brand"><i />GLOWROOM</div>
}

export default function Header({ back, children }) {
  const navigate = useNavigate()
  return (
    <header className="top">
      {back
        ? <button className="icon-btn" onClick={() => navigate(-1)} aria-label="Back"><Icon name="back" /></button>
        : <Brand />}
      <div className="row">{children}</div>
    </header>
  )
}
