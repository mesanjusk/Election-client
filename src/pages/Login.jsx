import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const { data } = await api.post('/api/login', { username, password })
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      nav('/')
    } catch (e) {
      setError('Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-b from-brand-50 to-white">
      <form onSubmit={submit} className="w-[360px] bg-white shadow-xl rounded-2xl p-6 space-y-4">
        <h1 className="text-2xl font-semibold text-slate-800">Candidate Login</h1>
        <div className="space-y-1">
          <label className="block text-sm text-slate-600">Username</label>
          <input className="w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500" value={username} onChange={e=>setUsername(e.target.value)} />
        </div>
        <div className="space-y-1">
          <label className="block text-sm text-slate-600">Password</label>
          <input type="password" className="w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500" value={password} onChange={e=>setPassword(e.target.value)} />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button disabled={loading} className="w-full rounded-xl bg-brand-600 hover:bg-brand-700 text-white py-2 transition disabled:opacity-60">
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
        <p className="text-xs text-slate-500">Demo login accepts any username & password.</p>
      </form>
    </div>
  )
}
