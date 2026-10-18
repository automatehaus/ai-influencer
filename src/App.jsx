import { Navigate, Route, Routes } from 'react-router-dom'
import { useStore, DEMO_MODE } from './store.jsx'
import { SheetProvider } from './sheets.jsx'
import Nav from './components/Nav.jsx'
import Toast from './components/Toast.jsx'
import Login from './pages/Login.jsx'
import Board from './pages/Board.jsx'
import Profile from './pages/Profile.jsx'
import Battles from './pages/Battles.jsx'
import Requests from './pages/Requests.jsx'
import Me from './pages/Me.jsx'

export default function App() {
  const { me } = useStore()

  return (
    <SheetProvider>
      <div className="app">
        {!me ? <Login /> : <>
          {DEMO_MODE && <div className="proto"><b>Demo</b> · sample creators · nothing is sent to TikTok</div>}
          <Routes>
            <Route path="/" element={<Board />} />
            <Route path="/u/:handle" element={<Profile />} />
            <Route path="/battles" element={<Battles />} />
            <Route path="/requests" element={<Requests />} />
            <Route path="/me" element={<Me />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Nav />
        </>}
      </div>
      <Toast />
    </SheetProvider>
  )
}
