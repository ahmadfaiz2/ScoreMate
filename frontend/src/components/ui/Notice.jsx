/**
 * Pesan status terpusat (loading / kosong / error) untuk seluruh halaman.
 * Satu komponen reusable agar tampilan & teks status konsisten (hindari duplikasi).
 * `className` opsional dipakai halaman berlebar terbatas (mis. mx-auto max-w-2xl).
 */
export default function Notice({ children, className = '' }) {
  return (
    <div className={`py-12 text-center text-sm text-gray-500 ${className}`}>{children}</div>
  )
}
