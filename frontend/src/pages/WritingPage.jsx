import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import api from '../api/client'
import { CATEGORIES } from '../lib/categories'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import ScoreBadge from '../components/ui/ScoreBadge'
import Markdown from '../components/ui/Markdown'

const TARGET_WORDS = 150 // Independent writing TOEFL menyarankan ≥150 kata.
const MIN_WORDS = 10 // Cegah kirim esai kosong/terlalu pendek ke layanan AI.

const countWords = (text) => text.trim().split(/\s+/).filter(Boolean).length

// Lembar manuskrip: garis horizontal + margin merah ala buku tulis.
const RULE_HEIGHT = 32
const sheetStyle = {
  lineHeight: `${RULE_HEIGHT}px`,
  backgroundImage: [
    'linear-gradient(to right, transparent 31px, rgba(239,68,68,0.30) 31px, rgba(239,68,68,0.30) 32px, transparent 32px)',
    `repeating-linear-gradient(to bottom, transparent 0, transparent ${RULE_HEIGHT - 1}px, #e8efe9 ${RULE_HEIGHT - 1}px, #e8efe9 ${RULE_HEIGHT}px)`,
  ].join(', '),
  backgroundAttachment: 'local, local',
}

/**
 * Halaman Latihan Writing (/writing): tulis esai → dinilai AI (OpenAI) →
 * laporan pemeriksa (skor, grammar, saran, revisi) yang dirender markdown.
 */
export default function WritingPage() {
  const meta = CATEGORIES.writing
  const reduceMotion = useReducedMotion()

  const [status, setStatus] = useState('loading') // loading | ready | empty | error
  const [prompts, setPrompts] = useState([])
  const [promptIndex, setPromptIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [phase, setPhase] = useState('write') // write | report
  const [grading, setGrading] = useState(false)
  const [gradeError, setGradeError] = useState('')
  const [feedback, setFeedback] = useState(null)

  useEffect(() => {
    let active = true
    api
      .get('/questions', { params: { category: 'writing' } })
      .then(({ data }) => {
        if (!active) return
        const list = data.data.questions ?? []
        setPrompts(list)
        setStatus(list.length ? 'ready' : 'empty')
      })
      .catch(() => {
        if (active) setStatus('error')
      })
    return () => {
      active = false
    }
  }, [])

  const prompt = prompts[promptIndex]
  const words = countWords(answer)
  const canSubmit = words >= MIN_WORDS && !grading

  const handleSubmit = async () => {
    if (!canSubmit || !prompt) return
    setGrading(true)
    setGradeError('')
    try {
      const { data } = await api.post('/feedback', {
        question_id: prompt.id,
        answer: answer.trim(),
      })
      setFeedback(data.data)
      setPhase('report')
    } catch (err) {
      setGradeError(
        err.response?.data?.message ?? 'Gagal menilai esai. Coba lagi sebentar.'
      )
    } finally {
      setGrading(false)
    }
  }

  const handleRevise = () => setPhase('write')

  const handleNextPrompt = () => {
    setPromptIndex((i) => (i + 1) % prompts.length)
    setAnswer('')
    setFeedback(null)
    setGradeError('')
    setPhase('write')
  }

  // --- Status non-konten ---
  if (status === 'loading') return <Notice>Memuat prompt writing…</Notice>
  if (status === 'error') {
    return (
      <Notice>
        Gagal memuat soal writing.{' '}
        <Link to="/practice" className="font-semibold text-primary-deep">
          Kembali ke Latihan
        </Link>
      </Notice>
    )
  }
  if (status === 'empty') {
    return (
      <Notice>
        Belum ada prompt writing.{' '}
        <Link to="/practice" className="font-semibold text-primary-deep">
          Pilih kategori lain
        </Link>
      </Notice>
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <Link to="/practice" className="text-sm text-gray-500 hover:text-ink">
          ← Latihan
        </Link>
        <span className="flex items-center gap-2 text-sm font-medium">
          <span className={`h-2.5 w-2.5 rounded-full ${meta.dot}`} />
          <span className={meta.accent}>{meta.label}</span>
        </span>
      </div>

      {/* Prompt esai */}
      <Card className="mb-4">
        <p className="font-mono text-xs uppercase tracking-wider text-gray-400">Prompt</p>
        <p className="mt-2 text-base font-medium leading-relaxed text-ink">{prompt.question}</p>
      </Card>

      {phase === 'report' && feedback ? (
        <Report
          feedback={feedback}
          reduceMotion={reduceMotion}
          onRevise={handleRevise}
          onNext={handleNextPrompt}
          canNext={prompts.length > 1}
        />
      ) : (
        <Card>
          <label htmlFor="essay" className="font-mono text-xs uppercase tracking-wider text-gray-400">
            Jawabanmu
          </label>
          <textarea
            id="essay"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={grading}
            placeholder="Tulis esaimu di sini…"
            rows={10}
            style={sheetStyle}
            className="mt-2 block w-full resize-y rounded-xl border border-gray-200 py-2 pl-11 pr-4 text-sm text-ink placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-soft disabled:opacity-60"
          />

          {/* Pengukur kata */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>
                <span className="font-mono tabular text-ink">{words}</span> / {TARGET_WORDS} kata
              </span>
              {words >= TARGET_WORDS && (
                <span className="font-medium text-primary-deep">Target tercapai ✓</span>
              )}
            </div>
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${Math.min((words / TARGET_WORDS) * 100, 100)}%` }}
              />
            </div>
          </div>

          {gradeError && (
            <p className="mt-3 rounded-xl bg-red-50 px-4 py-2 text-sm text-danger">{gradeError}</p>
          )}

          <div className="mt-5 flex items-center justify-between gap-3">
            <p className="text-xs text-gray-400">
              {words < MIN_WORDS ? `Minimal ${MIN_WORDS} kata untuk dinilai.` : 'Dinilai oleh AI examiner.'}
            </p>
            <Button onClick={handleSubmit} disabled={!canSubmit}>
              {grading ? 'Menilai…' : 'Minta Penilaian'}
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}

/** Laporan pemeriksa: skor + grammar + saran + revisi (markdown). */
function Report({ feedback, reduceMotion, onRevise, onNext, canNext }) {
  const score = feedback.score_estimation ?? 0

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="space-y-4"
    >
      <Card className="text-center">
        <p className="text-sm text-gray-500">Laporan Pemeriksa</p>
        <p className="mt-2 font-mono tabular text-6xl font-bold text-primary-deep">{score}</p>
        <div className="mt-3 flex justify-center">
          <ScoreBadge score={score} />
        </div>
      </Card>

      <Card className="space-y-5">
        <Section label="Grammar & Mekanik" body={feedback.grammar_feedback} />
        <Section label="Saran Perbaikan" body={feedback.suggestions} />
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-gray-400">Revisi Pemeriksa</p>
          <div className="mt-2 rounded-xl bg-paper p-4">
            <Markdown>{feedback.corrected_answer}</Markdown>
          </div>
        </div>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onRevise}>
          Tulis Ulang
        </Button>
        {canNext && <Button onClick={onNext}>Prompt Lain</Button>}
      </div>
    </motion.div>
  )
}

/** Satu blok feedback dengan eyebrow mono + isi markdown. */
function Section({ label, body }) {
  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-wider text-gray-400">{label}</p>
      <Markdown className="mt-2">{body}</Markdown>
    </div>
  )
}

/** Pesan status terpusat (loading/kosong/error). */
function Notice({ children }) {
  return (
    <div className="mx-auto max-w-2xl py-12 text-center text-sm text-gray-500">{children}</div>
  )
}
