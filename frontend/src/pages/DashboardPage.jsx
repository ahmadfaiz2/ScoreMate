import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useReducedMotion } from 'framer-motion'
import api from '../api/client'
import { useAuthStore } from '../store/authStore'
import { CATEGORIES } from '../lib/categories'
import { formatDateShort } from '../lib/format'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import ScoreBadge from '../components/ui/ScoreBadge'

// Band TOEFL sebagai skala penempatan 0–100 (selaras ScoreBadge).
const BANDS = [
  { key: 'beg', label: 'Beginner', min: 0, max: 55 },
  { key: 'int', label: 'Intermediate', min: 55, max: 70 },
  { key: 'upp', label: 'Upper-Int', min: 70, max: 85 },
  { key: 'adv', label: 'Advanced', min: 85, max: 100 },
]

const bandOf = (s) => BANDS.find((b) => s >= b.min && (s < b.max || b.max === 100))

export default function DashboardPage() {
  const name = useAuthStore((state) => state.user?.name) ?? 'Pengguna'
  const reduceMotion = useReducedMotion()

  const [status, setStatus] = useState('loading') // loading | ready | error
  const [data, setData] = useState(null)

  useEffect(() => {
    let active = true
    api
      .get('/dashboard')
      .then(({ data: res }) => {
        if (!active) return
        setData(res.data)
        setStatus('ready')
      })
      .catch(() => {
        if (active) setStatus('error')
      })
    return () => {
      active = false
    }
  }, [])

  if (status === 'loading') return <Notice>Memuat progres…</Notice>
  if (status === 'error') {
    return <Notice>Gagal memuat progres. Muat ulang halaman untuk mencoba lagi.</Notice>
  }

  const avg = data.average_score ?? 0
  const total = data.total_questions_answered ?? 0
  const history = data.score_history ?? []

  // Belum ada aktivitas → ajak mulai, bukan tampilkan nol kosong.
  if (total === 0) {
    return (
      <div className="space-y-6">
        <Header name={name} />
        <Card className="text-center">
          <p className="text-base font-medium text-ink">Belum ada progres untuk ditampilkan.</p>
          <p className="mt-1 text-sm text-gray-600">
            Selesaikan latihan pertamamu untuk melihat skor dan trennya di sini.
          </p>
          <div className="mt-5 flex justify-center">
            <Link to="/practice">
              <Button>Mulai Latihan</Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Header name={name} />

      {/* Hero: standing + band ladder */}
      <Card>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-gray-400">
              Skor rata-rata
            </p>
            <div className="mt-1 flex items-end gap-3">
              <span className="font-mono tabular text-6xl font-bold leading-none text-primary-deep">
                {avg}
              </span>
              <ScoreBadge score={avg} />
            </div>
            <p className="mt-2 text-sm text-gray-600">
              dari <span className="font-mono tabular text-ink">{total}</span> soal dijawab
            </p>
          </div>
          <div className="sm:w-1/2">
            <BandLadder score={avg} />
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Tren skor (Recharts) */}
        <Card className="lg:col-span-2">
          <h2 className="font-display text-sm font-semibold text-ink">Tren skor</h2>
          {history.length > 1 ? (
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={history} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
                  <defs>
                    <linearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22c55e" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="#e8efe9" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatDateShort}
                    tick={{ fontSize: 11, fill: '#6b7280' }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 11, fill: '#6b7280' }}
                    tickLine={false}
                    axisLine={false}
                    width={32}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#15803d"
                    strokeWidth={2}
                    fill="url(#scoreFill)"
                    dot={{ r: 3, fill: '#15803d' }}
                    isAnimationActive={!reduceMotion}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="mt-4 text-sm text-gray-500">
              Tren muncul setelah kamu menyelesaikan minimal dua sesi.
            </p>
          )}
        </Card>

        {/* Akurasi per kategori */}
        <Card>
          <h2 className="font-display text-sm font-semibold text-ink">Akurasi kategori</h2>
          <div className="mt-4 space-y-4">
            {Object.entries(CATEGORIES).map(([key, c]) => {
              const pct = data.score_by_category?.[key] ?? 0
              return (
                <div key={key}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${c.dot}`} />
                      <span className="text-ink">{c.label}</span>
                    </span>
                    <span className="font-mono tabular text-ink">{pct}%</span>
                  </div>
                  <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={`h-full rounded-full ${c.dot}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
          <p className="mt-4 text-xs text-gray-400">
            Akurasi soal pilihan ganda. Writing dinilai terpisah oleh AI feedback.
          </p>
        </Card>
      </div>
    </div>
  )
}

function Header({ name }) {
  return (
    <header>
      <h1 className="font-display text-2xl font-bold text-ink">Halo, {name}.</h1>
      <p className="mt-1 text-sm text-gray-600">Begini perkembangan latihanmu sejauh ini.</p>
    </header>
  )
}

/** Skala penempatan band TOEFL dengan penanda skor — elemen signature halaman. */
function BandLadder({ score }) {
  const pos = Math.min(Math.max(score, 0), 100)
  const current = bandOf(score)

  return (
    <div className="w-full">
      <div className="relative">
        <div className="flex h-3 overflow-hidden rounded-full">
          {BANDS.map((b) => (
            <div
              key={b.key}
              style={{ width: `${b.max - b.min}%` }}
              className={b.key === current?.key ? 'bg-primary' : 'bg-gray-100'}
            />
          ))}
        </div>
        <div
          className="absolute -top-1 h-5 w-0.5 -translate-x-1/2 rounded bg-ink"
          style={{ left: `${pos}%` }}
          aria-hidden="true"
        />
      </div>
      <div className="mt-2 flex text-[10px] uppercase tracking-wide">
        {BANDS.map((b) => (
          <span
            key={b.key}
            style={{ width: `${b.max - b.min}%` }}
            className={`font-mono ${b.key === current?.key ? 'font-semibold text-ink' : 'text-gray-400'}`}
          >
            {b.label}
          </span>
        ))}
      </div>
    </div>
  )
}

/** Tooltip chart bergaya design system. */
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-gray-100 bg-white px-3 py-2 shadow-md">
      <p className="text-xs text-gray-500">{formatDateShort(label)}</p>
      <p className="font-mono tabular text-sm font-semibold text-primary-deep">
        {payload[0].value}
      </p>
    </div>
  )
}

/** Pesan status terpusat (loading/error). */
function Notice({ children }) {
  return <div className="py-12 text-center text-sm text-gray-500">{children}</div>
}
