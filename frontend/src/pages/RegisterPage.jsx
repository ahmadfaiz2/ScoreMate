import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/client'
import { useAuthStore } from '../store/authStore'
import AuthLayout from '../components/AuthLayout'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Aturan validasi sisi klien (selaras dengan validasi backend).
function validate({ name, email, password, password_confirmation }) {
  return {
    name: name.trim().length === 0 ? 'Nama wajib diisi' : '',
    email: EMAIL_PATTERN.test(email.trim()) ? '' : 'Format email tidak valid',
    password: password.length >= 8 ? '' : 'Minimal 8 karakter',
    password_confirmation:
      password_confirmation === password && password_confirmation.length > 0
        ? ''
        : 'Konfirmasi password tidak cocok',
  }
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)

  const errors = useMemo(() => validate(form), [form])
  const hasErrors = Object.values(errors).some(Boolean)

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  // Tampilkan status field hanya setelah diisi atau setelah submit ditekan.
  const fieldState = (field) => {
    const shown = submitted || form[field].length > 0
    return {
      error: shown ? errors[field] : '',
      valid: shown && !errors[field],
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitted(true)
    if (hasErrors) return

    setApiError('')
    setLoading(true)
    try {
      const { data } = await api.post('/register', {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        password_confirmation: form.password_confirmation,
      })
      setAuth({ user: data.data.user, token: data.data.token })
      navigate('/dashboard')
    } catch (err) {
      setApiError(err.response?.data?.message ?? 'Registrasi gagal. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Daftar" subtitle="Buat akun untuk mulai berlatih TOEFL.">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {apiError && (
          <p className="rounded-xl bg-red-50 px-4 py-2 text-sm text-danger">{apiError}</p>
        )}
        <Input
          id="name"
          name="name"
          label="Nama Lengkap"
          value={form.name}
          onChange={handleChange}
          autoComplete="name"
          {...fieldState('name')}
        />
        <Input
          id="email"
          name="email"
          type="email"
          label="Email"
          value={form.email}
          onChange={handleChange}
          autoComplete="email"
          {...fieldState('email')}
        />
        <Input
          id="password"
          name="password"
          type="password"
          label="Password"
          value={form.password}
          onChange={handleChange}
          autoComplete="new-password"
          {...fieldState('password')}
        />
        <Input
          id="password_confirmation"
          name="password_confirmation"
          type="password"
          label="Konfirmasi Password"
          value={form.password_confirmation}
          onChange={handleChange}
          autoComplete="new-password"
          {...fieldState('password_confirmation')}
        />
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Memproses...' : 'Daftar'}
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        Sudah punya akun?{' '}
        <Link to="/login" className="font-semibold text-primary">
          Masuk
        </Link>
      </p>
    </AuthLayout>
  )
}
