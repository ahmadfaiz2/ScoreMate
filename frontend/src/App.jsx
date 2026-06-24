import { useEffect } from 'react'
import AppRoutes from './routes/AppRoutes'
import { setUnauthorizedHandler } from './api/client'
import { useAuthStore } from './store/authStore'

function App() {
  // Saat token ditolak (401), bersihkan sesi (token + user) lewat clearAuth.
  useEffect(() => {
    setUnauthorizedHandler(() => useAuthStore.getState().clearAuth())
  }, [])

  return <AppRoutes />
}

export default App
