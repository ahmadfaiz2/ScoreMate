import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../api/client'
import { CATEGORIES } from '../lib/categories'
import Card from '../components/ui/Card'
import Bubble from '../components/ui/Bubble'
import Button from '../components/ui/Button'
import ScoreBadge from '../components/ui/ScoreBadge'

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F']

// Bandingkan jawaban seperti backend: abaikan besar/kecil huruf & spasi tepi.
const same = (a, b) =>
  String(a ?? '').trim().toLowerCase() === String(b ?? '').trim().toLowerCase()

/**
 * Latihan satu-soal-per-layar untuk kategori pilihan ganda (/practice/:category).
 * key={category} memaksa remount saat kategori berganti → state mulai bersih.
 */
export default function PracticeRunPage() {
  const { category } = useParams()
  return <PracticeRun key={category} category={category} />
}

function PracticeRun({ category }) {
  const meta = CATEGORIES[category]
  const valid = meta?.kind === 'mcq'

  const [status, setStatus] = useState('loading') // loading | ready | empty | error
  const [questions, setQuestions] = useState([])
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState(null)
  const [responses, setResponses] = useState({}) // index → { selected, isCorrect, correctAnswer }
  const [checking, setChecking] = useState(false)
  const [checkError, setCheckError] = useState('')
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    // Writing (esai) memakai halaman AI Feedback; jangan fetch di sini.
    if (!valid) return

    let active = true
    api
      .get('/questions', { params: { category } })
      .then(({ data }) => {
        if (!active) return
        const list = data.data.questions ?? []
        setQuestions(list)
        setStatus(list.length ? 'ready' : 'empty')
      })
      .catch(() => {
        if (active) setStatus('error')
      })

    return () => {
      active = false
    }
  }, [category, valid])

  const question = questions[index]
  const response = responses[index]
  const isLast = index === questions.length - 1
  const correctCount = Object.values(responses).filter((r) => r.isCorrect).length
  const score = questions.length ? Math.round((correctCount / questions.length) * 100) : 0

  const stateFor = (option) => {
    if (!response) return same(option, picked) ? 'selected' : 'idle'
    if (same(option, response.correctAnswer)) return 'correct'
    if (same(option, response.selected)) return 'wrong'
    return 'idle'
  }

  const handleCheck = async () => {
    if (!picked || response || checking) return
    setChecking(true)
    setCheckError('')
    try {
      const { data } = await api.post('/questions/answer', {
        question_id: question.id,
        answer: picked,
      })
      setResponses((prev) => ({
        ...prev,
        [index]: {
          selected: picked,
          isCorrect: data.data.is_correct,
          correctAnswer: data.data.correct_answer,
        },
      }))
    } catch (err) {
      // Beri tahu user agar tidak terjebak; soal tidak dikunci, bisa dicoba lagi.
      setCheckError(err.response?.data?.message ?? 'Gagal memeriksa jawaban. Coba lagi.')
    } finally {
      setChecking(false)
    }
  }

  const handleNext = () => {
    if (isLast) {
      setFinished(true)
      return
    }
    setIndex((i) => i + 1)
    setPicked(null)
  }

  const handleRestart = () => {
    setIndex(0)
    setPicked(null)
    setResponses({})
    setFinished(false)
  }

  // --- Status non-soal ---
  if (!valid) {
    return (
      <Notice>
        Kategori ini belum tersedia untuk latihan pilihan ganda.{' '}
        <Link to="/practice" className="font-semibold text-primary-deep">
          Kembali ke Latihan
        </Link>
      </Notice>
    )
  }
  if (status === 'loading') {
    return <Notice>Memuat soal…</Notice>
  }
  if (status === 'error') {
    return (
      <Notice>
        Gagal memuat soal.{' '}
        <Link to="/practice" className="font-semibold text-primary-deep">
          Kembali ke Latihan
        </Link>
      </Notice>
    )
  }
  if (status === 'empty') {
    return (
      <Notice>
        Belum ada soal untuk kategori {meta.label}.{' '}
        <Link to="/practice" className="font-semibold text-primary-deep">
          Pilih kategori lain
        </Link>
      </Notice>
    )
  }

  // --- Layar hasil ---
  if (finished) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <Card className="text-center">
          <p className="text-sm text-gray-500">Hasil Latihan {meta.label}</p>
          <p className="mt-2 font-mono tabular text-6xl font-bold text-primary-deep">{score}</p>
          <div className="mt-3 flex justify-center">
            <ScoreBadge score={score} />
          </div>
          <p className="mt-3 text-sm text-gray-600">
            <span className="font-semibold text-ink">{correctCount}</span> dari{' '}
            {questions.length} soal benar
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button variant="outline" onClick={handleRestart}>
              Ulangi
            </Button>
            <Link to="/practice">
              <Button>Kategori Lain</Button>
            </Link>
          </div>
        </Card>

        <Card>
          <h3 className="font-display text-sm font-semibold text-ink">Rekap Jawaban</h3>
          <ul className="mt-3 divide-y divide-gray-100">
            {questions.map((q, i) => {
              const r = responses[i]
              return (
                <li key={q.id} className="flex items-start gap-3 py-3 text-sm">
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${
                      r?.isCorrect ? 'bg-primary' : 'bg-danger'
                    }`}
                  >
                    {r?.isCorrect ? '✓' : '✕'}
                  </span>
                  <div>
                    <p className="text-ink">{q.question}</p>
                    {r && !r.isCorrect && (
                      <p className="mt-0.5 text-xs text-gray-500">
                        Jawabanmu: {r.selected} · Kunci: {r.correctAnswer}
                      </p>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        </Card>
      </div>
    )
  }

  // --- Layar soal ---
  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <Link to="/practice" className="text-sm text-gray-500 hover:text-ink">
            ← Latihan
          </Link>
          <span className="flex items-center gap-2 text-sm font-medium">
            <span className={`h-2.5 w-2.5 rounded-full ${meta.dot}`} />
            <span className={meta.accent}>{meta.label}</span>
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
          <span>
            Soal <span className="font-mono tabular text-ink">{index + 1}</span> dari{' '}
            {questions.length}
          </span>
          <span>{correctCount} benar</span>
        </div>
        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${((index + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <Card>
        <p className="text-base font-medium text-ink">{question.question}</p>

        <div className="mt-5 space-y-3">
          {question.options.map((opt, i) => (
            <Bubble
              key={i}
              letter={LETTERS[i]}
              state={stateFor(opt)}
              disabled={!!response}
              onClick={() => {
                setPicked(opt)
                setCheckError('')
              }}
            >
              {opt}
            </Bubble>
          ))}
        </div>

        {response && (
          <div
            className={`mt-5 rounded-xl px-4 py-3 text-sm ${
              response.isCorrect
                ? 'bg-primary-soft text-primary-deep'
                : 'bg-red-50 text-danger'
            }`}
          >
            {response.isCorrect ? (
              <span className="font-semibold">Benar! +10 poin</span>
            ) : (
              <span>
                <span className="font-semibold">Belum tepat.</span> Kunci:{' '}
                {response.correctAnswer}
              </span>
            )}
          </div>
        )}

        {checkError && (
          <p className="mt-5 rounded-xl bg-red-50 px-4 py-2 text-sm text-danger">{checkError}</p>
        )}

        <div className="mt-5 flex justify-end">
          {response ? (
            <Button onClick={handleNext}>{isLast ? 'Lihat Hasil' : 'Soal Berikutnya'}</Button>
          ) : (
            <Button onClick={handleCheck} disabled={!picked || checking}>
              {checking ? 'Memeriksa…' : 'Periksa Jawaban'}
            </Button>
          )}
        </div>
      </Card>
    </div>
  )
}

/** Pesan status terpusat (loading/kosong/error). */
function Notice({ children }) {
  return (
    <div className="mx-auto max-w-2xl py-12 text-center text-sm text-gray-500">{children}</div>
  )
}
