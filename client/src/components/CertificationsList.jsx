import { useState } from 'react'
import { upsertStudent } from '../lib/api'

export default function CertificationsList({ student, onUpdated }) {
  const [items, setItems] = useState(student?.certifications || [])
  const [name, setName] = useState('')
  const [provider, setProvider] = useState('')
  const [link, setLink] = useState('')

  const add = async (e) => {
    e.preventDefault()
    if (!student) return
    const next = [...items, { name, provider, link, verified: false }]
    await upsertStudent({
      rollNo: student.rollNo,
      name: student.name,
      department: student.department,
      cgpa: student.cgpa,
      certifications: next
    })
    setItems(next)
    setName(''); setProvider(''); setLink('')
    onUpdated?.()
  }

  return (
    <div className="card">
      <h3 className="font-medium mb-2">Certifications</h3>
      <ul className="space-y-2 mb-3">
        {(student?.certifications||[]).map((c, i) => (
          <li key={i} className="flex items-center justify-between">
            <div>
              <div className="font-medium">{c.name} {c.provider ? <span className="text-sm text-gray-500">({c.provider})</span> : null}</div>
              {c.link && <a className="text-sm text-primary" href={c.link} target="_blank" rel="noreferrer">Verify</a>}
            </div>
            <span className={`text-xs px-2 py-1 rounded ${c.verified?'bg-green-100 text-green-700':'bg-gray-100 text-gray-700'}`}>{c.verified?'Verified':'Unverified'}</span>
          </li>
        ))}
      </ul>
      <form onSubmit={add} className="grid md:grid-cols-3 gap-2">
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Name" className="border rounded px-2 py-2" required />
        <input value={provider} onChange={e=>setProvider(e.target.value)} placeholder="Provider" className="border rounded px-2 py-2" />
        <div className="flex gap-2">
          <input value={link} onChange={e=>setLink(e.target.value)} placeholder="Verification Link" className="border rounded px-2 py-2 flex-1" />
          <button className="bg-primary text-white px-3 rounded">Add</button>
        </div>
      </form>
    </div>
  )
}
