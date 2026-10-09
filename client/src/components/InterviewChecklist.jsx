import { useEffect, useState } from 'react'
import { upsertStudent } from '../lib/api'

export default function InterviewChecklist({ student, onUpdated }) {
  const [rating, setRating] = useState(student?.interviewReadiness?.rating || 0)
  const [list, setList] = useState(student?.interviewReadiness?.checklist || {
    communication: false,
    technical: false,
    hr: false,
    problemSolving: false
  })

  useEffect(() => {
    if (student) {
      setRating(student?.interviewReadiness?.rating || 0)
      setList(student?.interviewReadiness?.checklist || list)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [student])

  const toggle = (key) => setList((prev) => ({ ...prev, [key]: !prev[key] }))

  const save = async () => {
    if (!student) return
    await upsertStudent({
      rollNo: student.rollNo,
      name: student.name,
      department: student.department,
      cgpa: student.cgpa,
      interviewReadiness: { rating: Number(rating), checklist: list }
    })
    onUpdated?.()
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <label className="text-sm">Rating (0-5)</label>
        <input type="number" min="0" max="5" value={rating} onChange={(e)=>setRating(e.target.value)} className="border rounded px-2 py-1 w-20" />
        <button onClick={save} className="bg-primary text-white px-3 py-1 rounded">Save</button>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        {Object.entries(list).map(([k, v]) => (
          <label key={k} className="flex items-center gap-2">
            <input type="checkbox" checked={v} onChange={()=>toggle(k)} /> {labelFor(k)}
          </label>
        ))}
      </div>
    </div>
  )
}

function labelFor(key) {
  if (key === 'hr') return 'HR'
  if (key === 'problemSolving') return 'Problem Solving'
  return key.charAt(0).toUpperCase() + key.slice(1)
}
