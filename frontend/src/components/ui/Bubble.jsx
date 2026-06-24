/**
 * Opsi jawaban bergaya lembar jawaban ujian (OMR bubble) — elemen signature.
 * state: 'idle' | 'selected' | 'correct' | 'wrong'
 */
const STATES = {
  idle: 'border-gray-300 bg-white text-gray-700 hover:border-primary',
  selected: 'border-primary bg-primary-soft text-ink',
  correct: 'border-primary bg-primary text-white',
  wrong: 'border-danger bg-danger text-white',
}

export default function Bubble({ letter, children, state = 'idle', className = '', ...props }) {
  return (
    <button
      type="button"
      className={`flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3 text-left text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-soft disabled:cursor-default ${STATES[state]} ${className}`}
      {...props}
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-current font-mono text-xs">
        {letter}
      </span>
      <span>{children}</span>
    </button>
  )
}
