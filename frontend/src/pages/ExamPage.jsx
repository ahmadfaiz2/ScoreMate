import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/client'
import { CATEGORIES } from '../lib/categories'
import Card from '../components/ui/Card'
import Bubble from '../components/ui/Bubble'
import Button from '../components/ui/Button'
import ScoreBadge from '../components/ui/ScoreBadge'

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F']
const LOW_TIME = 5 * 60 // detik tersisa saat timer berubah merah

const formatTime = (sec) => {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

/**
 * Simulasi Ujian TOEFL (/exam) — bertekanan waktu, tanpa umpan balik per soal.
 * intro → exam (timer + navigator OMR) → result.
 */
export default function ExamPage() {
  const [phase, setPhase] = useState('intro') // intro | exam | result | expired
  const [exam, setExam] = useState(null) // { exam_id, duration_minutes, questions }
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState({}) // { [question_id]: optionText }
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [result, setResult] = useState(null)
  const [confirming, setConfirming] = useState(false)

  const [starting, setStarting] = useState(false)
  const [startError, setStartError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const answeredCount = Object.keys(answers).length

  // Batas waktu absolut (timestamp) agar countdown akurat meski tab di-throttle.
  const deadlineRef = useRef(0)

  // --- Mulai ujian ---
  const handleStart = async () => {
    if (starting) return
    setStarting(true)
    setStartError('')
    try {
      const { data } = await api.post('/exam/start')
      const totalSeconds = (data.data.duration_minutes ?? 60) * 60
      setExam(data.data)
      deadlineRef.current = Date.now() + totalSeconds * 1000
      setSecondsLeft(totalSeconds)
      setIndex(0)
      setAnswers({})
      setResult(null)
      setSubmitError('')
      setPhase('exam')
    } catch (err) {
      setStartError(err.response?.data?.message ?? 'Gagal memulai ujian. Coba lagi.')
    } finally {
      setStarting(false)
    }
  }

  // --- Kumpulkan ujian ---
  const submitExam = async (isAuto = false) => {
    if (submitting || result || !exam) return

    const payload = Object.entries(answers).map(([qid, ans]) => ({
      question_id: Number(qid),
      answer: ans,
    }))

    // Tanpa satu pun jawaban, server menolak (answers min:1).
    if (payload.length === 0) {
      if (isAuto) setPhase('expired')
      return
    }

    setSubmitting(true)
    setSubmitError('')
    try {
      const { data } = await api.post('/exam/submit', {
        exam_id: exam.exam_id,
        answers: payload,
      })
      setResult(data.data)
      setPhase('result')
    } catch (err) {
      setSubmitError(err.response?.data?.message ?? 'Gagal mengumpulkan ujian. Coba lagi.')
    } finally {
      setSubmitting(false)
      setConfirming(false)
    }
  }

  // Simpan submit versi terbaru di ref agar timer memanggil closure terkini
  // (lihat answers/exam saat ini) tanpa perlu re-subscribe interval.
  const submitRef = useRef(submitExam)
  useEffect(() => {
    submitRef.current = submitExam
  })

  // Hitung mundur dari deadline absolut (akurat walau interval di-throttle).
  useEffect(() => {
    if (phase !== 'exam') return
    const tick = () =>
      setSecondsLeft(Math.max(0, Math.round((deadlineRef.current - Date.now()) / 1000)))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [phase])

  // Waktu habis → kumpulkan otomatis (sekali).
  useEffect(() => {
    if (phase === 'exam' && secondsLeft === 0 && !result && !submitting) {
      submitRef.current(true)
    }
  }, [phase, secondsLeft, result, submitting])

  const handleRestart = () => {
    setPhase('intro')
    setExam(null)
    setIndex(0)
    setAnswers({})
    setSecondsLeft(0)
    setResult(null)
    setConfirming(false)
    setSubmitError('')
  }

  // ---------- INTRO ----------
  if (phase === 'intro') {
    return (
      <div className="mx-auto max-w-2xl">
        <Card>
          <p className="font-mono text-xs uppercase tracking-wider text-gray-400">Simulasi</p>
          <h1 className="mt-1 font-display text-2xl font-bold text-ink">Simulasi Ujian TOEFL</h1>
          <ul className="mt-4 space-y-2 text-sm text-gray-600">
            <li>• Soal pilihan ganda campuran reading & listening.</li>
            <li>• Waktu 60 menit, mulai berjalan begitu kamu menekan tombol.</li>
            <li>• Tidak ada umpan balik benar/salah sampai ujian dikumpulkan.</li>
            <li>• Skor total dan per kategori muncul di akhir.</li>
          </ul>

          {startError && (
            <p className="mt-4 rounded-xl bg-red-50 px-4 py-2 text-sm text-danger">{startError}</p>
          )}

          <div className="mt-6">
            <Button onClick={handleStart} disabled={starting}>
              {starting ? 'Menyiapkan…' : 'Mulai Ujian'}
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  // ---------- EXPIRED (waktu habis tanpa jawaban) ----------
  if (phase === 'expired') {
    return (
      <div className="mx-auto max-w-2xl">
        <Card className="text-center">
          <h1 className="font-display text-xl font-bold text-ink">Waktu habis</h1>
          <p className="mt-2 text-sm text-gray-600">
            Kamu belum menjawab satu soal pun, jadi ujian tidak dapat dinilai.
          </p>
          <div className="mt-6 flex justify-center">
            <Button onClick={handleRestart}>Coba Lagi</Button>
          </div>
        </Card>
      </div>
    )
  }

  // ---------- RESULT ----------
  if (phase === 'result' && result) {
    const tested = [...new Set((exam?.questions ?? []).map((q) => q.category))]
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <Card className="text-center">
          <p className="text-sm text-gray-500">Hasil Simulasi Ujian</p>
          <p className="mt-2 font-mono tabular text-6xl font-bold text-primary-deep">
            {result.total_score}
          </p>
          <div className="mt-3 flex justify-center">
            <ScoreBadge score={result.total_score} />
          </div>
          <p className="mt-3 text-sm text-gray-600">
            <span className="font-semibold text-ink">{result.correct_answers}</span> dari{' '}
            {result.total_questions} soal benar
          </p>
        </Card>

        <Card>
          <h2 className="font-display text-sm font-semibold text-ink">Skor per kategori</h2>
          <div className="mt-4 space-y-4">
            {tested.map((cat) => {
              const c = CATEGORIES[cat]
              const pct = result.score_by_category?.[cat] ?? 0
              return (
                <div key={cat}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${c.dot}`} />
                      <span className="text-ink">{c.label}</span>
                    </span>
                    <span className="font-mono tabular text-ink">{pct}%</span>
                  </div>
                  <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                    <div className={`h-full rounded-full ${c.dot}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={handleRestart}>
            Ulangi Ujian
          </Button>
          <Link to="/dashboard">
            <Button>Lihat Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  // ---------- EXAM ----------
  const questions = exam?.questions ?? []
  const question = questions[index]
  const selected = question ? answers[question.id] : undefined
  const cat = question ? CATEGORIES[question.category] : null
  const lowTime = secondsLeft <= LOW_TIME

  return (
    <div className="mx-auto max-w-2xl">
      {/* Header: timer + progres */}
      <div className="sticky top-16 z-10 mb-4 rounded-2xl bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Terjawab <span className="font-mono tabular text-ink">{answeredCount}</span>/
            {questions.length}
          </span>
          <span
            className={`font-mono tabular text-lg font-bold ${lowTime ? 'text-danger' : 'text-ink'}`}
            aria-label={`Sisa waktu ${formatTime(secondsLeft)}`}
          >
            {formatTime(secondsLeft)}
          </span>
        </div>

        {/* Navigator lembar jawaban OMR */}
        <div className="mt-3 flex flex-wrap gap-2">
          {questions.map((q, i) => {
            const isAnswered = answers[q.id] != null
            const isCurrent = i === index
            return (
              <button
                key={q.id}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Soal ${i + 1}${isAnswered ? ', terjawab' : ''}`}
                className={`flex h-8 w-8 items-center justify-center rounded-lg font-mono text-xs transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-soft ${
                  isAnswered
                    ? 'bg-primary text-white'
                    : 'border border-gray-300 text-gray-500 hover:border-primary'
                } ${isCurrent ? 'ring-2 ring-ink ring-offset-1' : ''}`}
              >
                {i + 1}
              </button>
            )
          })}
        </div>
      </div>

      {/* Soal aktif */}
      <Card>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-xs font-medium">
            <span className={`h-2 w-2 rounded-full ${cat?.dot}`} />
            <span className={cat?.accent}>{cat?.label}</span>
          </span>
          <span className="font-mono text-xs text-gray-400">
            Soal {index + 1}/{questions.length}
          </span>
        </div>

        <p className="mt-3 text-base font-medium text-ink">{question?.question}</p>

        <div className="mt-5 space-y-3">
          {question?.options?.map((opt, i) => (
            <Bubble
              key={i}
              letter={LETTERS[i]}
              state={selected === opt ? 'selected' : 'idle'}
              onClick={() => setAnswers((prev) => ({ ...prev, [question.id]: opt }))}
            >
              {opt}
            </Bubble>
          ))}
        </div>

        {submitError && (
          <p className="mt-5 rounded-xl bg-red-50 px-4 py-2 text-sm text-danger">{submitError}</p>
        )}

        {/* Navigasi & kumpulkan */}
        <div className="mt-6 flex items-center justify-between gap-3">
          <Button
            variant="outline"
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            disabled={index === 0}
          >
            Sebelumnya
          </Button>

          {index < questions.length - 1 ? (
            <Button onClick={() => setIndex((i) => Math.min(questions.length - 1, i + 1))}>
              Berikutnya
            </Button>
          ) : (
            <Button onClick={() => setConfirming(true)} disabled={submitting}>
              Selesai & Kumpulkan
            </Button>
          )}
        </div>
      </Card>

      {/* Tombol kumpulkan global (selalu tersedia) */}
      {index < questions.length - 1 && (
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setConfirming(true)}
            disabled={submitting}
            className="text-sm font-semibold text-primary-deep hover:underline disabled:opacity-50"
          >
            Selesai & kumpulkan sekarang
          </button>
        </div>
      )}

      {/* Konfirmasi kumpulkan */}
      {confirming && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-ink/40 p-4">
          <Card className="w-full max-w-sm">
            <h3 className="font-display text-lg font-semibold text-ink">Kumpulkan ujian?</h3>
            <p className="mt-2 text-sm text-gray-600">
              {answeredCount} dari {questions.length} soal terjawab.
              {answeredCount < questions.length && ' Soal yang kosong dihitung salah.'}
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setConfirming(false)} disabled={submitting}>
                Batal
              </Button>
              <Button onClick={() => submitExam(false)} disabled={submitting || answeredCount === 0}>
                {submitting ? 'Mengumpulkan…' : 'Kumpulkan'}
              </Button>
            </div>
            {answeredCount === 0 && (
              <p className="mt-3 text-xs text-danger">Jawab minimal satu soal untuk mengumpulkan.</p>
            )}
          </Card>
        </div>
      )}
    </div>
  )
}
