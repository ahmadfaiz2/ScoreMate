import { Link } from 'react-router-dom'
import { CATEGORIES } from '../lib/categories'
import Card from '../components/ui/Card'

/**
 * Halaman pilih kategori latihan (/practice).
 * Reading & Listening = pilihan ganda; Writing menyusul di halaman AI Feedback.
 */
export default function PracticePage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-bold text-ink">Latihan Soal</h1>
        <p className="mt-1 text-sm text-gray-600">
          Pilih kategori untuk berlatih. Setiap jawaban langsung dinilai per soal.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(CATEGORIES).map(([key, c]) => {
          // Writing memakai alur AI Feedback (/writing); lainnya pilihan ganda.
          const href = c.kind === 'essay' ? '/writing' : `/practice/${key}`

          return (
            <Link key={key} to={href} className="block">
              <Card className="flex h-full items-start gap-4 transition hover:-translate-y-0.5 hover:shadow-lg">
                <span className={`mt-1.5 h-3 w-3 shrink-0 rounded-full ${c.dot}`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="font-display text-lg font-semibold text-ink">{c.label}</h2>
                    <span className={`text-sm font-semibold ${c.accent}`}>Mulai →</span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{c.blurb}</p>
                </div>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
