/**
 * Input berlabel sesuai design system (rounded-xl).
 * Border: merah jika `error`, hijau jika `valid`, abu-abu default
 * (validasi real-time — 08-ui-design.md).
 */
export default function Input({ label, error, valid, id, className = '', ...props }) {
  const borderColor = error
    ? 'border-danger focus:ring-red-100'
    : valid
      ? 'border-primary focus:ring-primary-soft'
      : 'border-gray-300 focus:ring-primary-soft'

  return (
    <div>
      {label && (
        <label htmlFor={id} className="mb-1 block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full rounded-xl border px-4 py-2 text-sm text-gray-900 outline-none transition focus:ring-2 ${borderColor} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  )
}
