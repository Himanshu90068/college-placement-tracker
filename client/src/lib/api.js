import axios from 'axios'

const baseURL = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api'

export const api = axios.create({ baseURL })

export async function upsertStudent(payload) {
  const { data } = await api.post('/students', payload)
  return data
}

export async function getStudent(id) {
  const { data } = await api.get(`/students/${id}`)
  return data
}

export async function addAptitude(id, body) {
  const { data } = await api.post(`/students/${id}/aptitude`, body)
  return data
}

export async function uploadResume(id, file) {
  const fd = new FormData()
  fd.append('resume', file)
  const { data } = await api.post(`/students/${id}/resume`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
  return data
}

export async function listStudents(params = {}) {
  const { data } = await api.get('/admin/students', { params })
  return data
}
