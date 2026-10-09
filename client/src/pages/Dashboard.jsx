import { useEffect, useMemo, useState } from 'react'
import { getStudent, upsertStudent, addAptitude, uploadResume } from '../lib/api'
import ProgressCard from '../components/ProgressCard'
import AptitudeChart from '../components/AptitudeChart'
import StudentProfileForm from '../components/StudentProfileForm'
import CertificationsList from '../components/CertificationsList'
import InterviewChecklist from '../components/InterviewChecklist'
import Goals from '../components/Goals'

export default function Dashboard() {
  const [studentId, setStudentId] = useState(localStorage.getItem('studentId') || '')
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const statusFrom = (value) => {
    if (value >= 75) return 'Good'
    if (value >= 50) return 'Average'
    return 'Needs Improvement'
  }

  const fetchStudent = async (id) => {
    try {
      setLoading(true)
      const data = await getStudent(id)
      setStudent(data)
      setError('')
    } catch (e) {
      setError(e?.response?.data?.message || e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (studentId) fetchStudent(studentId)
  }, [studentId])

  const onCreateOrUpdate = async (payload) => {
    const created = await upsertStudent(payload)
    localStorage.setItem('studentId', created._id)
    setStudentId(created._id)
  }

  const onAddAptitude = async (score, percentile) => {
    if (!studentId) return
    await addAptitude(studentId, { score, percentile })
    await fetchStudent(studentId)
  }

  const onUploadResume = async (file) => {
    if (!studentId) return
    await uploadResume(studentId, file)
    await fetchStudent(studentId)
  }

  const overall = student?.overallReadiness || 0
  const resumeScore = student?.resumeScore || 0
  const topPercentile = useMemo(() => {
    return student?.aptitudeTests?.length ? Math.max(...student.aptitudeTests.map(a => a.percentile)) : 0
  }, [student])
  const interviewPct = student?.interviewReadiness?.rating ? (student.interviewReadiness.rating/5)*100 : 0
  const cgpaPct = student?.cgpa ? Math.min(10, student.cgpa) * 10 : 0

  return (
    <div className="grid gap-6">
      <section className="card">
        <h2 className="text-xl font-semibold mb-2">Student Profile</h2>
        <StudentProfileForm initial={student} onSubmit={onCreateOrUpdate} />
      </section>

      {error && <div className="card border-danger text-danger">{error}</div>}

      <section className="grid md:grid-cols-4 gap-4">
        <div className="md:col-span-4 card">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Overall Readiness</h2>
            <span className={`text-sm ${statusFrom(overall)==='Good'?'text-success':statusFrom(overall)==='Average'?'text-warning':'text-danger'}`}>{statusFrom(overall)}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 my-3">
            <div className={`${overall>=75?'bg-success':overall>=50?'bg-warning':'bg-danger'} h-3 rounded-full`} style={{ width: `${overall}%` }}></div>
          </div>
          <div className="text-sm text-gray-600">{Math.round(overall)}%</div>
        </div>
        <ProgressCard title="Resume Quality" value={resumeScore} status={statusFrom(resumeScore)}>
          <ResumeUploader onUpload={onUploadResume} resumeUrl={student?.resumeUrl} suggestions={student?.resumeSuggestions||[]} />
        </ProgressCard>
        <ProgressCard title="Aptitude Percentile" value={topPercentile} status={statusFrom(topPercentile)}>
          <AptitudeAdder onAdd={onAddAptitude} />
        </ProgressCard>
        <ProgressCard title="Interview Readiness" value={interviewPct} status={statusFrom(interviewPct)}>
          <InterviewChecklist student={student} onUpdated={() => fetchStudent(studentId)} />
        </ProgressCard>
        <ProgressCard title="CGPA" value={cgpaPct} status={statusFrom(cgpaPct)}>
          <div className="text-sm text-gray-600">CGPA: {student?.cgpa ?? '-'} / 10</div>
        </ProgressCard>
      </section>

      <section className="grid md:grid-cols-2 gap-4">
        <AptitudeChart data={student?.aptitudeTests || []} />
        <CertificationsList student={student} onUpdated={() => fetchStudent(studentId)} />
      </section>

      <section>
        <Goals student={student} onUpdated={() => fetchStudent(studentId)} />
      </section>
    </div>
  )
}

function AptitudeAdder({ onAdd }) {
  const [score, setScore] = useState('')
  const [percentile, setPercentile] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    await onAdd(Number(score), Number(percentile))
    setScore('')
    setPercentile('')
    setBusy(false)
  }

  return (
    <form onSubmit={submit} className="flex items-end gap-2">
      <div>
        <label className="block text-sm">Score</label>
        <input value={score} onChange={e=>setScore(e.target.value)} type="number" min="0" max="100" className="border rounded px-2 py-1 w-24" required />
      </div>
      <div>
        <label className="block text-sm">Percentile</label>
        <input value={percentile} onChange={e=>setPercentile(e.target.value)} type="number" min="0" max="100" className="border rounded px-2 py-1 w-28" required />
      </div>
      <button disabled={busy} className="bg-primary text-white px-3 py-2 rounded">{busy?'Adding...':'Add'}</button>
    </form>
  )
}

function ResumeUploader({ onUpload, resumeUrl, suggestions }) {
  const [file, setFile] = useState(null)
  const [busy, setBusy] = useState(false)

  const handle = async (e) => {
    e.preventDefault()
    if (!file) return
    setBusy(true)
    await onUpload(file)
    setBusy(false)
    setFile(null)
  }

  return (
    <div>
      <form onSubmit={handle} className="flex items-center gap-2 mb-2">
        <input type="file" accept="application/pdf" onChange={(e)=>setFile(e.target.files?.[0]||null)} />
        <button disabled={busy || !file} className="bg-primary text-white px-3 py-2 rounded">{busy?'Uploading...':'Upload'}</button>
      </form>
      {resumeUrl && <a href={resumeUrl} target="_blank" rel="noreferrer" className="text-primary text-sm">View last uploaded resume</a>}
      {suggestions?.length ? (
        <ul className="list-disc ml-5 mt-2 text-sm text-gray-700">
          {suggestions.map((s,i)=>(<li key={i}>{s}</li>))}
        </ul>
      ) : null}
    </div>
  )
}
