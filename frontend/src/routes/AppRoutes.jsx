import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from '../components/ProtectedRoute'
import GuestRoute from '../components/GuestRoute'
import Layout from '../components/Layout'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import DashboardPage from '../pages/DashboardPage'
import PracticePage from '../pages/PracticePage'
import PracticeRunPage from '../pages/PracticeRunPage'
import WritingPage from '../pages/WritingPage'
import ExamPage from '../pages/ExamPage'
import HistoryPage from '../pages/HistoryPage'
import LeaderboardPage from '../pages/LeaderboardPage'

/**
 * Definisi semua rute aplikasi.
 * - Rute publik: /login, /register
 * - Rute terproteksi (butuh token): dibungkus <ProtectedRoute>
 */
export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Publik (khusus tamu — user login dilempar ke dashboard) */}
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Terproteksi (dibungkus Layout: Navbar + konten) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/practice" element={<PracticePage />} />
            <Route path="/practice/:category" element={<PracticeRunPage />} />
            <Route path="/writing" element={<WritingPage />} />
            <Route path="/exam" element={<ExamPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
          </Route>
        </Route>

        {/* Default: arahkan ke dashboard (→ login bila belum auth) */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
