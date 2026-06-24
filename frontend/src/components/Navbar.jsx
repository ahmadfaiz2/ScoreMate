import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import api from '../api/client'
import { useAuthStore } from '../store/authStore'
import Button from './ui/Button'

// Maksimal 5 item agar mudah dipindai (Miller's Law / Hick's Law).
const MENU = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/practice', label: 'Latihan' },
  { to: '/exam', label: 'Simulasi' },
  { to: '/history', label: 'Riwayat' },
  { to: '/leaderboard', label: 'Leaderboard' },
]

const linkClass = ({ isActive }) =>
  `text-sm font-medium transition ${
    isActive ? 'text-primary-deep' : 'text-gray-600 hover:text-primary-deep'
  }`

export default function Navbar() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const clearAuth = useAuthStore((state) => state.clearAuth)
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await api.post('/logout')
    } catch {
      // Token mungkin sudah tidak valid di server; tetap logout di sisi klien.
    }
    clearAuth()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-10 bg-white shadow-sm">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Logo kiri → ke beranda (Jakob's Law) */}
        <NavLink to="/dashboard" className="font-display text-xl font-bold text-primary-deep">
          ScoreMate
        </NavLink>

        {/* Menu tengah (desktop) */}
        <ul className="hidden gap-6 md:flex">
          {MENU.map((item) => (
            <li key={item.to}>
              <NavLink to={item.to} className={linkClass}>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Kanan: nama user + logout (desktop) */}
        <div className="hidden items-center gap-3 md:flex">
          <span className="text-sm text-gray-700">{user?.name ?? 'Pengguna'}</span>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        {/* Tombol hamburger (mobile) */}
        <button
          type="button"
          className="md:hidden text-gray-700"
          aria-label="Buka menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen ? (
              <path strokeLinecap="round" d="M6 6l12 12M6 18L18 6" />
            ) : (
              <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Panel menu (mobile) */}
      {menuOpen && (
        <div className="border-t border-gray-100 md:hidden">
          <ul className="flex flex-col gap-1 px-4 py-3">
            {MENU.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={linkClass}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
            <li className="mt-2 flex items-center justify-between border-t border-gray-100 pt-3">
              <span className="text-sm text-gray-700">{user?.name ?? 'Pengguna'}</span>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
