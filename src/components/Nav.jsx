import { NavLink } from 'react-router-dom'
import Icon from './Icons.jsx'
import { useStore } from '../store.jsx'

export default function Nav() {
  const { battles, goingLive, actions, showToast } = useStore()
  const toLog = battles.filter(b => !b.incoming && b.status === 'accepted').length
  const incoming = battles.filter(b => b.incoming && b.status === 'pending').length

  const item = (to, icon, label, count) => (
    <NavLink to={to} end>
      <Icon name={icon} />{label}{count > 0 && <span className="count">{count}</span>}
    </NavLink>
  )

  const toggleLive = () => {
    actions.toggleGoingLive()
    showToast(goingLive ? 'Going-live alert turned off.' : 'Your followers on Glowroom get a "going live in 15" ping.')
  }

  return (
    <nav className="bottom">
      <div className="in">
        {item('/', 'home', 'Board')}
        {item('/battles', 'swords', 'Battles', toLog)}
        <button className={`golive${goingLive ? ' on' : ''}`} onClick={toggleLive}
          aria-label={goingLive ? 'Stop going-live alert' : 'I am going live in 15 minutes'}>
          <Icon name="live" size={28} />
        </button>
        {item('/requests', 'inbox', 'Requests', incoming)}
        {item('/me', 'me', 'Me')}
      </div>
    </nav>
  )
}
