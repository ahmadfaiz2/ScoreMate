# UI Design

> Dokumentasi desain antarmuka ScoreMate — Light mode, Modern & Colorful, Primary Color Hijau, Navigasi Navbar.

---

## Design System

### Warna

| Nama | Hex | Kegunaan |
|------|-----|----------|
| `primary` | `#22C55E` | Tombol utama, aksen, highlight |
| `primary-dark` | `#16A34A` | Hover state tombol primary |
| `primary-light` | `#DCFCE7` | Background card, badge |
| `secondary` | `#3B82F6` | Aksen tambahan, info |
| `warning` | `#F59E0B` | Timer, peringatan |
| `danger` | `#EF4444` | Jawaban salah, error |
| `success` | `#22C55E` | Jawaban benar, notifikasi sukses |
| `background` | `#F9FAFB` | Background halaman utama |
| `white` | `#FFFFFF` | Background card |
| `text-primary` | `#111827` | Teks utama |
| `text-secondary` | `#6B7280` | Teks deskripsi, placeholder |

### Tipografi

| Elemen | Font | Ukuran | Weight |
|--------|------|--------|--------|
| Heading H1 | Inter | 32px | Bold (700) |
| Heading H2 | Inter | 24px | SemiBold (600) |
| Heading H3 | Inter | 20px | SemiBold (600) |
| Body | Inter | 16px | Regular (400) |
| Small | Inter | 14px | Regular (400) |
| Button | Inter | 14px | SemiBold (600) |

### Border Radius & Shadow

| Elemen | Nilai |
|--------|-------|
| Button | `rounded-full` (pill shape) |
| Card | `rounded-2xl` |
| Input | `rounded-xl` |
| Badge | `rounded-full` |
| Shadow Card | `shadow-md` |

---

## Komponen Global

### Navbar
- Background: `white` dengan `shadow-sm`
- Logo ScoreMate di kiri (ikon + teks hijau)
- Menu di tengah: `Dashboard`, `Latihan`, `Simulasi`, `Leaderboard`
- Di kanan: avatar user + tombol `Logout`
- Sticky di atas saat scroll

### Button

| Varian | Tampilan |
|--------|----------|
| Primary | Background hijau, teks putih |
| Outline | Border hijau, teks hijau, background transparan |
| Danger | Background merah, teks putih |
| Disabled | Background abu-abu, tidak bisa diklik |

### Card
- Background `white`
- Border radius `rounded-2xl`
- Shadow `shadow-md`
- Padding `p-6`

### Badge Kategori

| Kategori | Warna |
|----------|-------|
| Reading | Biru muda |
| Listening | Ungu muda |
| Writing | Hijau muda |

---

## Halaman 1 — Landing Page

**Route:** `/`

**Deskripsi:** Halaman pertama yang dilihat user sebelum login. Berisi hero section dengan ilustrasi, fitur unggulan, dan CTA.

**Komponen:**
- Navbar sederhana (Logo + tombol Login & Register)
- Hero section: judul besar, deskripsi singkat, ilustrasi belajar TOEFL, tombol `Mulai Sekarang`
- Section fitur: 3 card fitur unggulan (Latihan Soal, AI Feedback, Simulasi Ujian) dengan ikon warna-warni
- Section statistik: jumlah soal, pengguna aktif, rata-rata peningkatan skor
- Footer sederhana

---

## Halaman 2 — Register

**Route:** `/register`

**Deskripsi:** Halaman pendaftaran akun baru.

**Komponen:**
- Ilustrasi di sisi kiri
- Form di sisi kanan: input Nama, Email, Password, Konfirmasi Password
- Tombol `Daftar` (primary, full width)
- Link ke halaman Login
- Validasi real-time (merah jika salah, hijau jika benar)

---

## Halaman 3 — Login

**Route:** `/login`

**Deskripsi:** Halaman masuk akun.

**Komponen:**
- Ilustrasi di sisi kiri
- Form di sisi kanan: input Email, Password
- Tombol `Masuk` (primary, full width)
- Link ke halaman Register

---

## Halaman 4 — Dashboard

**Route:** `/dashboard`

**Deskripsi:** Halaman utama setelah login. Menampilkan ringkasan progress belajar user.

**Komponen:**
- Greeting card: "Halo, Ahmad Faiz 👋" dengan motivasi harian
- 3 stat card: Total Soal Dikerjakan, Rata-rata Skor, Sesi Latihan
- Grafik skor (Recharts LineChart): perkembangan skor dari waktu ke waktu
- Grafik per kategori (Recharts RadarChart atau BarChart): Reading vs Listening vs Writing
- Card shortcut: tombol cepat ke Latihan, Simulasi, Riwayat

---

## Halaman 5 — Pilih Kategori Latihan

**Route:** `/practice`

**Deskripsi:** Halaman untuk memilih kategori latihan soal TOEFL.

**Komponen:**
- Judul halaman + deskripsi singkat
- 3 card kategori besar dengan ilustrasi:
  - 📖 Reading — biru
  - 🎧 Listening — ungu
  - ✍️ Writing — hijau
- Setiap card menampilkan jumlah soal tersedia dan rata-rata skor user di kategori tersebut
- Klik card → masuk ke halaman soal

---

## Halaman 6 — Latihan Soal

**Route:** `/practice/:category`

**Deskripsi:** Halaman menjawab soal latihan satu per satu.

**Komponen:**
- Progress bar atas: soal ke-X dari total
- Badge kategori (Reading/Listening/Writing)
- Card soal: teks pertanyaan besar
- 4 pilihan jawaban (tombol outline, berubah hijau jika benar / merah jika salah setelah submit)
- Tombol `Jawab` → muncul hasil benar/salah
- Tombol `Soal Berikutnya`
- Jika Writing: textarea untuk jawaban essay + tombol `Minta Feedback AI`

---

## Halaman 7 — AI Feedback

**Route:** `/feedback/:questionId`

**Deskripsi:** Halaman menampilkan hasil feedback dari ChatGPT untuk jawaban writing user.

**Komponen:**
- Card jawaban user (background abu-abu muda)
- Card hasil AI:
  - Estimasi skor (badge besar berwarna hijau/kuning/merah)
  - Feedback grammar (teks dengan highlight kesalahan)
  - Saran perbaikan
  - Contoh jawaban yang sudah dikoreksi
- Tombol `Kembali Latihan`

---

## Halaman 8 — Simulasi Ujian

**Route:** `/exam`

**Deskripsi:** Halaman simulasi ujian TOEFL lengkap dengan timer.

**Komponen:**
- Header sticky: Timer countdown (merah jika < 5 menit), progress soal
- Card soal + pilihan jawaban (sama seperti latihan)
- Navigasi soal: tombol nomor soal di bawah (hijau = sudah dijawab, abu = belum)
- Tombol `Selesai & Submit` (muncul konfirmasi sebelum submit)

---

## Halaman 9 — Hasil Simulasi

**Route:** `/exam/result/:examId`

**Deskripsi:** Halaman hasil akhir simulasi ujian.

**Komponen:**
- Ilustrasi selamat / semangat (tergantung skor)
- Skor besar di tengah dengan animasi angka naik
- 3 skor per kategori: Reading, Listening, Writing
- Tabel ringkasan: total soal, benar, salah
- Tombol `Lihat Pembahasan` dan `Kembali ke Dashboard`

---

## Halaman 10 — Riwayat Latihan

**Route:** `/history`

**Deskripsi:** Halaman daftar semua sesi latihan dan simulasi yang pernah dilakukan.

**Komponen:**
- Filter tab: Semua / Latihan / Simulasi
- Tabel atau list card riwayat:
  - Tanggal, tipe (latihan/simulasi), kategori, skor, jumlah soal
  - Badge warna sesuai kategori
- Pagination jika data banyak

---

## Halaman 11 — Leaderboard

**Route:** `/leaderboard`

**Deskripsi:** Halaman peringkat pengguna berdasarkan skor simulasi tertinggi.

**Komponen:**
- Podium 3 besar (rank 1, 2, 3) dengan ilustrasi trophy
- Tabel peringkat lengkap: rank, nama, skor tertinggi
- Highlight baris user yang sedang login (background hijau muda)
- Badge rank: 🥇 🥈 🥉 untuk top 3

---

## Ringkasan Halaman

| # | Halaman | Route | Auth |
|---|---------|-------|------|
| 1 | Landing Page | `/` | ❌ |
| 2 | Register | `/register` | ❌ |
| 3 | Login | `/login` | ❌ |
| 4 | Dashboard | `/dashboard` | ✅ |
| 5 | Pilih Kategori Latihan | `/practice` | ✅ |
| 6 | Latihan Soal | `/practice/:category` | ✅ |
| 7 | AI Feedback | `/feedback/:questionId` | ✅ |
| 8 | Simulasi Ujian | `/exam` | ✅ |
| 9 | Hasil Simulasi | `/exam/result/:examId` | ✅ |
| 10 | Riwayat Latihan | `/history` | ✅ |
| 11 | Leaderboard | `/leaderboard` | ✅ |
