import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

/**
 * Kebalikan ProtectedRoute: halaman khusus tamu (login/register).
 * User yang sudah punya token diarahkan ke dashboard.
 */
export default function GuestRoute() {
  const token = useAuthStore((state) => state.token)

  if (token) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
