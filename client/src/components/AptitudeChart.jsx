import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export default function AptitudeChart({ data }) {
  const formatted = (data||[]).map(a => ({
    date: new Date(a.date).toLocaleDateString(),
    score: a.score,
    percentile: a.percentile
  }))
  return (
    <div className="card">
      <h3 className="font-medium mb-2">Aptitude Progress</h3>
      <div className="h-60">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formatted}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Line type="monotone" dataKey="percentile" stroke="#2563eb" strokeWidth={2} name="Percentile" />
            <Line type="monotone" dataKey="score" stroke="#16a34a" strokeWidth={2} name="Score" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
