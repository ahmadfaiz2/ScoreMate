import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

/**
 * Pembungkus rute terproteksi.
 * Jika belum punya token (belum login / sesi habis), arahkan ke /login.
 * Reaktif: saat token menjadi null (mis. clearAuth dari 401), otomatis redirect.
 */
export default function ProtectedRoute() {
  const token = useAuthStore((state) => state.token)

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
