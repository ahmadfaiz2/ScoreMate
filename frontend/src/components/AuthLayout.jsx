/**
 * Kerangka halaman auth: panel "score band specimen" (kiri) + area form (kanan).
 * Panel kiri = artefak produk: skor besar mono + band chip, menegaskan identitas.
 * Disembunyikan di layar kecil agar form tetap fokus (Hick's Law).
 */
export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="grid min-h-screen md:grid-cols-2">
      {/* Score band specimen (kiri) */}
      <div className="hidden flex-col justify-between bg-primary-deep p-12 text-white md:flex">
        <div>
          <p className="font-display text-2xl font-bold">ScoreMate</p>
          <p className="mt-1 text-sm text-primary-soft">Latih. Ukur. Naik.</p>
        </div>

        <div>
          <p className="font-mono text-8xl font-bold leading-none tabular">92</p>
          <span className="mt-3 inline-flex items-center gap-2 rounded-full bg-bubble px-3 py-1 text-sm font-semibold text-ink">
            <span className="font-mono">B2</span> Advanced
          </span>
          <p className="mt-6 max-w-xs text-sm text-primary-soft">
            Latihan & simulasi TOEFL dengan feedback AI untuk mencapai skor impianmu.
          </p>
        </div>

        <p className="font-mono text-xs text-primary-soft/70">
          Reading · Listening · Writing
        </p>
      </div>

      {/* Form (kanan) */}
      <div className="flex items-center justify-center bg-paper p-6">
        <div className="w-full max-w-sm">
          <h2 className="font-display text-3xl font-bold text-ink">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </div>
  )
}
