import { useEffect, useState } from 'react'
import Dashboard from './pages/Dashboard.jsx'
import AdminPanel from './pages/AdminPanel.jsx'
import Navbar from './components/Navbar.jsx'

export default function App() {
  const [view, setView] = useState('dashboard') // 'dashboard' | 'admin'

  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    if (hash === 'admin') setView('admin')
  }, [])

  useEffect(() => {
    window.location.hash = view === 'admin' ? 'admin' : ''
  }, [view])

  return (
    <div className="min-h-screen">
      <Navbar view={view} setView={setView} />
      <main className="max-w-7xl mx-auto px-4 py-6">
        {view === 'dashboard' ? <Dashboard /> : <AdminPanel />}
      </main>
    </div>
  )
}
