import { useEffect, useState } from 'react'
import { listStudents } from '../lib/api'

export default function AdminPanel() {
  const [students, setStudents] = useState([])
  const [department, setDepartment] = useState('')
  const [readiness, setReadiness] = useState('') // good | average | needs
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchList = async () => {
    try {
      setLoading(true)
      const data = await listStudents({ department: department || undefined, readiness: readiness || undefined })
      setStudents(data)
      setError('')
    } catch (e) {
      setError(e?.response?.data?.message || e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const exportUrl = `${(import.meta.env.VITE_API_URL || 'http://localhost:5000')}/api/admin/export`

  return (
    <div className="grid gap-4">
      <div className="card">
        <h2 className="text-xl font-semibold mb-3">Admin / Faculty Panel</h2>
        <div className="flex flex-wrap gap-2 items-end">
          <div>
            <label className="block text-sm mb-1">Department</label>
            <input value={department} onChange={(e)=>setDepartment(e.target.value)} placeholder="CSE / ECE / ..." className="border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm mb-1">Readiness</label>
            <select value={readiness} onChange={(e)=>setReadiness(e.target.value)} className="border rounded px-3 py-2">
              <option value="">All</option>
              <option value="good">Good (≥75%)</option>
              <option value="average">Average (50-74%)</option>
              <option value="needs">Needs Improvement (&lt;50%)</option>
            </select>
          </div>
          <button onClick={fetchList} className="bg-primary text-white px-4 py-2 rounded">Apply Filters</button>
          <a href={exportUrl} className="ml-auto bg-green-600 text-white px-4 py-2 rounded">Export Summary CSV</a>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">Students</h3>
          {loading && <span className="text-sm text-gray-500">Loading...</span>}
        </div>
        {error && <div className="text-danger">{error}</div>}
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Roll No</th>
                <th className="py-2 pr-4">Department</th>
                <th className="py-2 pr-4">CGPA</th>
                <th className="py-2 pr-4">Resume</th>
                <th className="py-2 pr-4">Top Aptitude %ile</th>
                <th className="py-2 pr-4">Interview Rating</th>
                <th className="py-2 pr-4">Overall %</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s)=> {
                const top = (s.aptitudeTests?.length ? Math.max(...s.aptitudeTests.map(t=>t.percentile)) : 0)
                const rClass = (s.overallReadiness>=75?'text-success':s.overallReadiness>=50?'text-warning':'text-danger')
                return (
                  <tr key={s._id} className="border-b">
                    <td className="py-2 pr-4">{s.name}</td>
                    <td className="py-2 pr-4">{s.rollNo}</td>
                    <td className="py-2 pr-4">{s.department}</td>
                    <td className="py-2 pr-4">{s.cgpa}</td>
                    <td className="py-2 pr-4">{s.resumeScore}</td>
                    <td className="py-2 pr-4">{top}</td>
                    <td className="py-2 pr-4">{s.interviewReadiness?.rating || 0}</td>
                    <td className={`py-2 pr-4 ${rClass}`}>{s.overallReadiness}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
