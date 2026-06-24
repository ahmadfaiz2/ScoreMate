/**
 * Chip skor dengan band TOEFL (skor 0-100) — bahasa visual "score report".
 */
function toBand(score) {
  if (score >= 85) return { label: 'Advanced', cls: 'bg-primary text-white' }
  if (score >= 70) return { label: 'Upper-Int', cls: 'bg-bubble text-ink' }
  if (score >= 55) return { label: 'Intermediate', cls: 'bg-writing text-white' }
  return { label: 'Beginner', cls: 'bg-gray-200 text-ink' }
}

export default function ScoreBadge({ score = 0 }) {
  const { label, cls } = toBand(score)

  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${cls}`}>
      <span className="font-mono tabular">{score}</span> {label}
    </span>
  )
}
