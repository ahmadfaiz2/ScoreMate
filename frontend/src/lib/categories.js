/**
 * Metadata kategori TOEFL — dipakai bersama oleh halaman Latihan, Dashboard, dll.
 * accent/dot memakai token warna dari index.css (reading/listening/writing).
 * kind: 'mcq' = pilihan ganda (dinilai otomatis), 'essay' = dinilai AI feedback.
 */
export const CATEGORIES = {
  reading: {
    label: 'Reading',
    blurb: 'Pemahaman bacaan & kosakata.',
    accent: 'text-reading',
    dot: 'bg-reading',
    kind: 'mcq',
  },
  listening: {
    label: 'Listening',
    blurb: 'Memahami percakapan & perkuliahan.',
    accent: 'text-listening',
    dot: 'bg-listening',
    kind: 'mcq',
  },
  writing: {
    label: 'Writing',
    blurb: 'Esai dinilai langsung oleh AI feedback.',
    accent: 'text-writing',
    dot: 'bg-writing',
    kind: 'essay',
  },
}
