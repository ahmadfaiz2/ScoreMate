import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { tokenStorage } from '../api/client'

/**
 * Status autentikasi global.
 *
 * - token: sumber kebenaran ada di tokenStorage (localStorage), dipakai juga
 *   oleh axios interceptor. State `token` di sini cerminannya agar reaktif.
 * - user: dipersist oleh zustand supaya data user tetap ada setelah refresh.
 */
export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: tokenStorage.get(),

      // Simpan sesi setelah login / registrasi berhasil.
      setAuth: ({ user, token }) => {
        tokenStorage.set(token)
        set({ user, token })
      },

      // Hapus sesi saat logout atau token kadaluarsa.
      clearAuth: () => {
        tokenStorage.clear()
        set({ user: null, token: null })
      },
    }),
    {
      name: 'scoremate_auth',
      // Token tidak dipersist di sini karena sudah dikelola tokenStorage.
      partialize: (state) => ({ user: state.user }),
    },
  ),
)
