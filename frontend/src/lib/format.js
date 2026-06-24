/**
 * Format tanggal "YYYY-MM-DD" → Indonesia, tanpa pergeseran zona waktu
 * (parse sebagai tengah malam lokal, bukan UTC).
 */
const localDate = (d) => new Date(`${d}T00:00:00`)

export const formatDateShort = (d) =>
  localDate(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })

export const formatDate = (d) =>
  localDate(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
