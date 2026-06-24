import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/client'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

/**
 * Papan Peringkat (/leaderboard) — skor simulasi ujian terbaik tiap peserta.
 */
export default function LeaderboardPage() {
  const [status, setStatus] = useState('loading') // loading | ready | error
  const [data, setData] = useState(null)

  useEffect(() => {
    let active = true
    api
      .get('/leaderboard')
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

  if (status === 'loading') return <Notice>Memuat papan peringkat…</Notice>
  if (status === 'error') {
    return <Notice>Gagal memuat papan peringkat. Muat ulang halaman untuk mencoba lagi.</Notice>
  }

  const myRank = data.my_rank
  const board = data.leaderboard ?? []

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-bold text-ink">Papan Peringkat</h1>
        <p className="mt-1 text-sm text-gray-600">Skor simulasi ujian terbaik tiap peserta.</p>
      </header>

      {/* Standing pribadi / ajakan ikut */}
      {myRank ? (
        <Card>
          <p className="font-mono text-xs uppercase tracking-wider text-gray-400">Peringkat kamu</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-mono tabular text-5xl font-bold text-primary-deep">#{myRank}</span>
            <span className="text-sm text-gray-600">dari {board.length} peserta</span>
          </div>
        </Card>
      ) : (
        <Card>
          <p className="text-base font-medium text-ink">Kamu belum masuk papan peringkat.</p>
          <p className="mt-1 text-sm text-gray-600">
            Selesaikan satu simulasi ujian untuk ikut bersaing.
          </p>
          <div className="mt-4">
            <Link to="/exam">
              <Button>Mulai Simulasi</Button>
            </Link>
          </div>
        </Card>
      )}

      {/* Daftar peringkat */}
      {board.length === 0 ? (
        <Card className="text-center">
          <p className="text-base font-medium text-ink">Belum ada yang menyelesaikan ujian.</p>
          <p className="mt-1 text-sm text-gray-600">Jadilah peserta pertama di papan ini.</p>
        </Card>
      ) : (
        <Card>
          <ul className="space-y-1">
            {board.map((row) => {
              const mine = row.rank === myRank
              return (
                <li
                  key={row.rank}
                  className={`flex items-center gap-4 rounded-xl px-4 py-3 ${
                    mine ? 'bg-primary-soft' : ''
                  }`}
                >
                  <span
                    className={`w-9 font-mono tabular text-sm font-bold ${
                      row.rank === 1 ? 'text-primary-deep' : 'text-gray-400'
                    }`}
                  >
                    #{row.rank}
                  </span>
                  <span className="flex min-w-0 flex-1 items-center gap-2 text-sm text-ink">
                    <span className="truncate">{row.name}</span>
                    {mine && (
                      <span className="shrink-0 rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-white">
                        kamu
                      </span>
                    )}
                  </span>
                  <span className="font-mono tabular text-sm font-semibold text-ink">
                    {row.score}
                  </span>
                </li>
              )
            })}
          </ul>
        </Card>
      )}
    </div>
  )
}

/** Pesan status terpusat (loading/error). */
function Notice({ children }) {
  return <div className="py-12 text-center text-sm text-gray-500">{children}</div>
}
