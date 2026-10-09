export default function ProgressCard({ title, value, status, children }) {
  const statusColor = status === 'Good' ? 'text-success' : status === 'Average' ? 'text-warning' : 'text-danger'
  const progressColor = status === 'Good' ? 'bg-success' : status === 'Average' ? 'bg-warning' : 'bg-danger'

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium">{title}</h3>
        <span className={`text-sm font-medium ${statusColor}`}>{status}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div className={`${progressColor} h-2 rounded-full`} style={{ width: `${Math.min(100, Math.max(0, value))}%` }}></div>
      </div>
      <div className="text-sm text-gray-500 mb-2">{Math.round(value)}%</div>
      {children}
    </div>
  )
}
