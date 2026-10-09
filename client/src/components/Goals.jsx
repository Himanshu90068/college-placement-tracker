import { useEffect, useState } from 'react'
import { upsertStudent } from '../lib/api'

export default function Goals({ student, onUpdated }) {
  const [goals, setGoals] = useState(student?.goals || [])
  const [title, setTitle] = useState('')
  const [targetDate, setTargetDate] = useState('')

  useEffect(() => {
    setGoals(student?.goals || [])
  }, [student])

  const addGoal = async (e) => {
    e.preventDefault()
    if (!student) return
    const next = [...goals, { title, targetDate, completed: false }]
    await upsertStudent({
      rollNo: student.rollNo,
      name: student.name,
      department: student.department,
      cgpa: student.cgpa,
      goals: next
    })
    setTitle(''); setTargetDate('')
    onUpdated?.()
  }

  const toggle = async (idx) => {
    if (!student) return
    const next = goals.map((g, i) => i===idx ? { ...g, completed: !g.completed } : g)
    await upsertStudent({
      rollNo: student.rollNo,
      name: student.name,
      department: student.department,
      cgpa: student.cgpa,
      goals: next
    })
    onUpdated?.()
  }

  return (
    <div className="card">
      <h3 className="font-medium mb-2">Placement Goals</h3>
      <ul className="space-y-2 mb-3">
        {(student?.goals||[]).map((g,i)=> (
          <li key={i} className="flex items-center justify-between">
            <div>
              <div className={`font-medium ${g.completed?'line-through text-gray-500':''}`}>{g.title}</div>
              {g.targetDate && <div className="text-xs text-gray-500">Target: {new Date(g.targetDate).toLocaleDateString()}</div>}
            </div>
            <button onClick={()=>toggle(i)} className={`px-2 py-1 rounded text-xs ${g.completed?'bg-gray-200':'bg-primary text-white'}`}>{g.completed?'Reopen':'Mark Done'}</button>
          </li>
        ))}
      </ul>
      <form onSubmit={addGoal} className="grid md:grid-cols-3 gap-2">
        <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Goal title" className="border rounded px-2 py-2" required />
        <input value={targetDate} onChange={(e)=>setTargetDate(e.target.value)} type="date" className="border rounded px-2 py-2" />
        <button className="bg-primary text-white px-3 rounded">Add Goal</button>
      </form>
    </div>
  )
}
