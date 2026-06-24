import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/client'
import { useAuthStore } from '../store/authStore'
import AuthLayout from '../components/AuthLayout'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

export default function LoginPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await api.post('/login', {
        email: form.email.trim().toLowerCase(), // Postel's Law: normalisasi input
        password: form.password,
      })
      setAuth({ user: data.data.user, token: data.data.token })
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message ?? 'Gagal masuk. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Masuk" subtitle="Selamat datang kembali di ScoreMate.">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-2 text-sm text-danger">{error}</p>
        )}
        <Input
          id="email"
          name="email"
          type="email"
          label="Email"
          value={form.email}
          onChange={handleChange}
          autoComplete="email"
          required
        />
        <Input
          id="password"
          name="password"
          type="password"
          label="Password"
          value={form.password}
          onChange={handleChange}
          autoComplete="current-password"
          required
        />
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Memproses...' : 'Masuk'}
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        Belum punya akun?{' '}
        <Link to="/register" className="font-semibold text-primary">
          Daftar
        </Link>
      </p>
    </AuthLayout>
  )
}
