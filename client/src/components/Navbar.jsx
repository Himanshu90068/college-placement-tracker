export default function Navbar({ view, setView }) {
  return (
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="font-semibold text-lg">Placement Tracker</div>
        <nav className="flex gap-2">
          <button onClick={() => setView('dashboard')} className={`px-3 py-2 rounded ${view==='dashboard'?'bg-primary text-white':'hover:bg-gray-100'}`}>Dashboard</button>
          <button onClick={() => setView('admin')} className={`px-3 py-2 rounded ${view==='admin'?'bg-primary text-white':'hover:bg-gray-100'}`}>Admin Panel</button>
        </nav>
      </div>
    </header>
  )
}
