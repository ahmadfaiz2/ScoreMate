import axios from 'axios'

/**
 * Penyimpanan token autentikasi (satu sumber kebenaran).
 * Auth store (Zustand) memakai helper ini agar token konsisten di seluruh app.
 */
const TOKEN_KEY = 'scoremate_token'

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
}

/**
 * Handler yang dipanggil saat token ditolak (401). Di-wire dari App ke
 * authStore.clearAuth() agar token + user dibersihkan bersamaan (hindari desync).
 */
let unauthorizedHandler = null

export const setUnauthorizedHandler = (handler) => {
  unauthorizedHandler = handler
}

/**
 * Instance axios terpusat untuk semua request ke API ScoreMate.
 * baseURL diambil dari VITE_API_BASE_URL (lihat .env).
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { Accept: 'application/json' },
})

// Lampirkan token Bearer ke setiap request bila user sudah login.
api.interceptors.request.use((config) => {
  const token = tokenStorage.get()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Tangani sesi kadaluarsa: jika token ditolak (401), bersihkan & arahkan ke login.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isUnauthorized = error.response?.status === 401
    const hadToken = Boolean(tokenStorage.get())

    // Token yang ada ditolak (sesi kadaluarsa) — bukan sekadar gagal login.
    if (isUnauthorized && hadToken) {
      if (unauthorizedHandler) {
        // clearAuth membersihkan token + user; ProtectedRoute akan redirect reaktif.
        unauthorizedHandler()
      } else {
        // Fallback bila handler belum di-wire.
        tokenStorage.clear()
        if (window.location.pathname !== '/login') {
          window.location.assign('/login')
        }
      }
    }

    return Promise.reject(error)
  },
)

export default api
