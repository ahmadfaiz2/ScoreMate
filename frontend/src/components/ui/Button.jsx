/**
 * Tombol reusable sesuai design system (08-ui-design.md).
 * Bentuk pill (rounded-full). Varian: primary, outline, danger.
 * Default type="button" agar tidak men-submit form secara tak sengaja.
 */
const VARIANTS = {
  primary: 'bg-primary text-white hover:bg-primary-deep',
  outline: 'border border-primary text-primary-deep hover:bg-primary-soft',
  danger: 'bg-danger text-white hover:opacity-90',
}

export default function Button({
  variant = 'primary',
  type = 'button',
  className = '',
  ...props
}) {
  return (
    <button
      type={type}
      className={`rounded-full px-5 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 ${VARIANTS[variant]} ${className}`}
      {...props}
    />
  )
}
