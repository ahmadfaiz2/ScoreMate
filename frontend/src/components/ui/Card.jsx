/**
 * Kartu reusable sesuai design system (08-ui-design.md):
 * background putih, rounded-2xl, shadow-md, padding p-6.
 */
export default function Card({ className = '', ...props }) {
  return (
    <div
      className={`rounded-2xl bg-white p-6 shadow-md ${className}`}
      {...props}
    />
  )
}
