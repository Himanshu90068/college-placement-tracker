import { useEffect, useState } from 'react'

export default function StudentProfileForm({ initial, onSubmit }) {
  const [form, setForm] = useState({ name: '', rollNo: '', department: '', cgpa: '' })
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (initial) {
      setForm({
        name: initial.name || '',
        rollNo: initial.rollNo || '',
        department: initial.department || '',
        cgpa: initial.cgpa ?? ''
      })
    }
  }, [initial])

  const handle = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    await onSubmit({ ...form, cgpa: Number(form.cgpa) })
    setBusy(false)
  }

  return (
    <form onSubmit={submit} className="grid md:grid-cols-4 gap-4">
      <div>
        <label className="block text-sm mb-1">Name</label>
        <input name="name" value={form.name} onChange={handle} className="border rounded px-3 py-2 w-full" required />
      </div>
      <div>
        <label className="block text-sm mb-1">Roll No</label>
        <input name="rollNo" value={form.rollNo} onChange={handle} className="border rounded px-3 py-2 w-full" required />
      </div>
      <div>
        <label className="block text-sm mb-1">Department</label>
        <input name="department" value={form.department} onChange={handle} className="border rounded px-3 py-2 w-full" required />
      </div>
      <div>
        <label className="block text-sm mb-1">CGPA</label>
        <input name="cgpa" type="number" step="0.01" min="0" max="10" value={form.cgpa} onChange={handle} className="border rounded px-3 py-2 w-full" required />
      </div>
      <div className="md:col-span-4">
        <button disabled={busy} className="bg-primary text-white px-4 py-2 rounded">{busy?'Saving...':'Save Profile'}</button>
      </div>
    </form>
  )
}
