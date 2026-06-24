import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/client'
import { CATEGORIES } from '../lib/categories'
import { formatDate } from '../lib/format'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

// Tampilan per entri: ujian = ink (semua kategori), latihan = warna kategori.
function entryMeta(item) {
  if (item.type === 'exam') {
    return { label: 'Simulasi Ujian', dot: 'bg-ink' }
  }
  const c = CATEGORIES[item.category]
  return { label: `Latihan ${c?.label ?? item.category}`, dot: c?.dot ?? 'bg-gray-400' }
}

/**
 * Riwayat (/history) — catatan kronologis latihan & ujian sebagai timeline.
 */
export default function HistoryPage() {
  const [status, setStatus] = useState('loading') // loading | ready | error
  const [items, setItems] = useState([])

  useEffect(() => {
    let active = true
    api
      .get('/history')
      .then(({ data }) => {
        if (!active) return
        setItems(data.data ?? [])
        setStatus('ready')
      })
      .catch(() => {
        if (active) setStatus('error')
      })
    return () => {
      active = false
    }
  }, [])

  if (status === 'loading') return <Notice>Memuat riwayat…</Notice>
  if (status === 'error') {
    return <Notice>Gagal memuat riwayat. Muat ulang halaman untuk mencoba lagi.</Notice>
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-bold text-ink">Riwayat</h1>
        <p className="mt-1 text-sm text-gray-600">Catatan latihan dan simulasi ujianmu.</p>
      </header>

      {items.length === 0 ? (
        <Card className="text-center">
          <p className="text-base font-medium text-ink">Belum ada riwayat.</p>
          <p className="mt-1 text-sm text-gray-600">
            Kerjakan latihan atau simulasi ujian untuk mulai mengisi catatan ini.
          </p>
          <div className="mt-5 flex justify-center gap-3">
            <Link to="/practice">
              <Button variant="outline">Latihan</Button>
            </Link>
            <Link to="/exam">
              <Button>Simulasi Ujian</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <ol>
          {items.map((item, i) => {
            const meta = entryMeta(item)
            const isLast = i === items.length - 1
            return (
              <li key={`${item.type}-${item.id}`} className="flex gap-4">
                {/* Rel timeline */}
                <div className="flex flex-col items-center">
                  <span className={`mt-4 h-3 w-3 shrink-0 rounded-full ring-4 ring-paper ${meta.dot}`} />
                  {!isLast && <span className="w-px flex-1 bg-gray-200" />}
                </div>

                {/* Konten entri */}
                <div className="mb-4 flex flex-1 items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-sm">
                  <div>
                    <p className="font-display text-sm font-semibold text-ink">{meta.label}</p>
                    <p className="font-mono text-xs text-gray-400">{formatDate(item.date)}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono tabular text-xl font-bold text-primary-deep">
                      {item.score}
                    </span>
                    <p className="text-xs text-gray-500">
                      {item.correct_answers}/{item.total_questions} benar
                    </p>
                  </div>
                </div>
              </li>
            )
          })}
        </ol>
      )}
    </div>
  )
}

/** Pesan status terpusat (loading/error). */
function Notice({ children }) {
  return <div className="py-12 text-center text-sm text-gray-500">{children}</div>
}
