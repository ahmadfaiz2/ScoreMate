# Panduan Frontend ScoreMate — Cara Menjelaskan ke Dosen

Dokumen ini membantu kamu menjelaskan **frontend ScoreMate** dengan percaya diri:
mulai dari teknologi yang dipakai, konsep di baliknya, cara kerja, sampai
**alur presentasi** dan **antisipasi pertanyaan dosen**.

> Inti pesan yang ingin kamu sampaikan:
> *"Frontend ini adalah Single Page Application (SPA) React yang rapi dan
> modular. Setiap bagian punya satu tanggung jawab jelas, sehingga mudah dibaca,
> diuji, dan dikembangkan."*

---

## 1. Teknologi yang Dipakai (dan Alasannya)

| Teknologi | Untuk apa | Kenapa dipilih |
|-----------|-----------|----------------|
| **React 19** | Membangun UI berbasis komponen | Standar industri, UI dipecah jadi potongan kecil yang reusable |
| **Vite** | Build tool & dev server | Sangat cepat (hot reload), konfigurasi minimal |
| **React Router 7** | Navigasi antar halaman tanpa reload | Membuat aplikasi terasa seperti app, bukan website biasa |
| **Zustand** | State management global (data login) | Ringan & sederhana dibanding Redux |
| **Axios** | Komunikasi ke API backend (HTTP) | Mendukung *interceptor* untuk token & error otomatis |
| **Tailwind CSS 4** | Styling berbasis utility class | Cepat, konsisten, desain diatur lewat *design token* |
| **Recharts** | Grafik tren skor di Dashboard | Komponen chart siap pakai untuk React |
| **Framer Motion** | Animasi halus | Menghormati setelan *reduce motion* (aksesibilitas) |
| **React Markdown** | Menampilkan feedback AI (format teks) | AI mengembalikan markdown, ini merendernya jadi rapi |

**Kalimat pembuka untuk dosen:**
> "Saya pakai React dengan Vite. UI dipecah menjadi komponen-komponen kecil yang
> bisa dipakai ulang. Komunikasi ke backend lewat Axios yang sudah saya
> pusatkan dalam satu modul, dan status login disimpan global memakai Zustand."

---

## 2. Struktur Folder — "Setiap folder satu tanggung jawab"

```
src/
├── main.jsx              # Titik masuk aplikasi (mount React ke HTML)
├── App.jsx              # Komponen akar: menyambungkan handler 401 + routing
│
├── api/
│   └── client.js        # SATU instance Axios + penyimpanan token + interceptor
│
├── store/
│   └── authStore.js     # State global autentikasi (user & token) — Zustand
│
├── routes/
│   └── AppRoutes.jsx    # Daftar semua rute (publik vs terproteksi)
│
├── components/          # Komponen struktural
│   ├── ProtectedRoute.jsx  # Penjaga rute: harus login
│   ├── GuestRoute.jsx      # Penjaga rute: khusus tamu (belum login)
│   ├── Layout.jsx          # Kerangka halaman (Navbar + konten)
│   ├── Navbar.jsx          # Menu navigasi atas
│   ├── AuthLayout.jsx      # Kerangka halaman login/register
│   │
│   └── ui/              # DESIGN SYSTEM — komponen visual reusable
│       ├── Button.jsx      # Tombol (varian: primary/outline/danger)
│       ├── Card.jsx        # Kartu putih dengan shadow
│       ├── Input.jsx       # Input berlabel + status validasi
│       ├── Bubble.jsx      # Opsi jawaban gaya lembar ujian (OMR)
│       ├── ScoreBadge.jsx  # Chip skor + band TOEFL
│       ├── Markdown.jsx     # Render feedback AI
│       └── Notice.jsx      # Pesan status (loading/kosong/error)
│
├── lib/                 # Fungsi & data bantu (tanpa UI)
│   ├── categories.js    # Metadata kategori soal (reading/listening/writing)
│   └── format.js        # Format tanggal ke Bahasa Indonesia
│
└── pages/               # Satu file = satu halaman/layar
    ├── LoginPage.jsx
    ├── RegisterPage.jsx
    ├── DashboardPage.jsx
    ├── PracticePage.jsx
    ├── PracticeRunPage.jsx
    ├── WritingPage.jsx
    ├── ExamPage.jsx
    ├── HistoryPage.jsx
    └── LeaderboardPage.jsx
```

**Konsep yang ditunjukkan struktur ini: *Separation of Concerns* (pemisahan
tanggung jawab).** Tiap masalah ditangani di tempatnya sendiri:
- urusan jaringan → `api/`
- urusan state global → `store/`
- urusan tampilan reusable → `components/ui/`
- urusan logika bantu → `lib/`
- urusan halaman → `pages/`

---

## 3. Konsep-Konsep Inti (yang paling penting untuk dijelaskan)

### a. SPA + Client-Side Routing
Aplikasi dimuat **sekali**. Saat pindah halaman, React Router hanya mengganti
komponen yang tampil **tanpa reload** browser. Hasilnya cepat dan mulus.
→ Lihat `routes/AppRoutes.jsx`.

### b. Komponen & Reusability (Design System)
Daripada menulis ulang tombol/kartu di tiap halaman, dibuat sekali di
`components/ui/` lalu dipakai ulang. Contoh: `<Button>`, `<Card>`, `<ScoreBadge>`.
Keuntungan: konsisten + kalau mau ganti gaya, cukup ubah satu file.

> **Talking point:** "Ini contoh komponen `Notice` yang tadinya saya tulis
> berulang di 5 halaman, lalu saya satukan jadi satu komponen reusable agar
> tidak ada duplikasi (prinsip DRY — *Don't Repeat Yourself*)."

### c. Lapisan API Terpusat (`api/client.js`)
Semua request ke backend lewat **satu** instance Axios. Di dalamnya ada dua
*interceptor* (penyadap otomatis):
1. **Request interceptor** → menempelkan token `Authorization: Bearer <token>`
   ke setiap request bila user sudah login.
2. **Response interceptor** → kalau server membalas **401 (token kadaluarsa)**,
   sesi otomatis dibersihkan dan user diarahkan ke halaman login.

> **Kenapa penting:** halaman-halaman tidak perlu repot mengurus token. Mereka
> cukup memanggil `api.get(...)`/`api.post(...)`; urusan token & error 401
> ditangani satu tempat.

### d. State Management
Ada dua jenis state, dan pemilihannya disengaja:
- **State lokal** (`useState`) → data yang hanya dipakai satu halaman, mis. isi
  form, soal yang sedang dikerjakan, timer.
- **State global** (`Zustand` di `store/authStore.js`) → data login (`user` &
  `token`) yang dibutuhkan banyak komponen (Navbar, route guard, dll).

`user` di-*persist* ke `localStorage` agar tetap ada setelah refresh. `token`
disimpan terpisah lewat `tokenStorage` karena juga dipakai oleh Axios.

### e. Route Guards (Penjaga Rute)
- `ProtectedRoute` → kalau **tidak ada token**, lempar ke `/login`.
- `GuestRoute` → kalau **sudah ada token**, lempar ke `/dashboard`.

Keduanya pakai `<Outlet />` dari React Router — pola standar untuk membungkus
sekelompok rute. Bersifat **reaktif**: saat token jadi `null` (mis. logout atau
401), halaman terproteksi otomatis pindah ke login tanpa kode tambahan.

### f. Pola "Status State Machine" (konsisten di semua halaman data)
Setiap halaman yang mengambil data punya status:
`loading` → `ready` → (`empty` / `error`). Pola yang sama dipakai di Dashboard,
History, Leaderboard, Practice, Writing. Ini membuat pengalaman pengguna
**konsisten**: selalu ada indikator memuat, pesan kosong, dan pesan error.

### g. Derived State (state turunan)
Nilai yang bisa **dihitung** tidak disimpan terpisah, tapi dihitung dari state
yang ada. Contoh di PracticeRun: `score`, `correctCount`, `isLast` dihitung dari
`responses` & `questions`. Ini mencegah data jadi tidak sinkron.

---

## 4. Cara Kerja Tiap Fitur (alur data ringkas)

**Autentikasi (Login/Register)**
`Form` → `api.post('/login')` → backend balas `{ user, token }` →
`setAuth()` simpan ke store + localStorage → `navigate('/dashboard')`.

**Dashboard**
`GET /dashboard` → tampilkan skor rata-rata, **Band Ladder** (posisi level
TOEFL), grafik **tren skor** (Recharts), dan akurasi per kategori.

**Latihan (Practice)**
`/practice` pilih kategori → `/practice/:category` ambil `GET /questions` →
satu soal per layar → pilih jawaban → `POST /questions/answer` → tampilkan
benar/salah → soal berikutnya → **layar hasil** + rekap.

**Writing (AI Feedback)**
Ambil prompt → user mengetik esai (ada **penghitung kata**) → `POST /feedback`
→ AI mengembalikan skor + koreksi grammar + saran + revisi → dirender dengan
`Markdown`.

**Simulasi Ujian (Exam)**
`POST /exam/start` → tampil timer + **navigator soal gaya OMR** → user menjawab
→ `POST /exam/submit` → hasil + skor per kategori.
*Detail cerdas:* timer memakai **deadline absolut** (`Date.now() + durasi`),
bukan sekadar mengurangi angka tiap detik — jadi tetap akurat walau tab browser
di-*throttle*. Jika waktu habis, ujian **otomatis dikumpulkan**.

**Riwayat & Leaderboard**
`GET /history` → timeline kronologis; `GET /leaderboard` → peringkat skor ujian
terbaik tiap peserta, dengan baris milik sendiri ditandai.

---

## 5. ALUR PRESENTASI (urutan menjelaskan ke dosen)

Ikuti urutan ini supaya cerita mengalir dari gambaran besar ke detail:

**Langkah 1 — Gambaran besar (30 detik)**
> "ScoreMate adalah aplikasi latihan & simulasi TOEFL. Frontend-nya SPA React
> yang berkomunikasi dengan backend Laravel lewat REST API."

**Langkah 2 — Tunjukkan struktur folder**
Buka `src/`, jelaskan bahwa tiap folder punya satu tanggung jawab (Bagian 2).
Ini langsung menunjukkan kode tertata, bukan menumpuk di satu tempat.

**Langkah 3 — Telusuri SATU alur lengkap: dari Login sampai Dashboard**
Ini bagian terkuat untuk dijelaskan karena menyentuh banyak konsep sekaligus:
1. `LoginPage` kirim email/password lewat `api.post('/login')`.
2. `api/client.js` (interceptor) otomatis menempelkan token di request berikut.
3. `authStore` menyimpan `user` & `token`.
4. `ProtectedRoute` mengizinkan masuk karena token ada.
5. `DashboardPage` memanggil `GET /dashboard` dan menampilkan grafik.

> Dengan satu alur ini kamu sudah menyentuh: routing, API layer, interceptor,
> state global, route guard, dan data fetching.

**Langkah 4 — Tonjolkan reusability (design system)**
Buka `components/ui/`. Tunjukkan `Button`/`Card`/`ScoreBadge` dipakai di banyak
halaman. Sebut prinsip **DRY** dan **konsistensi desain**.

**Langkah 5 — Tunjukkan satu fitur "pintar"**
Pilih salah satu (yang paling kamu kuasai):
- **Interceptor 401 otomatis** di `api/client.js`, atau
- **Timer ujian berbasis deadline absolut** di `ExamPage.jsx`.

**Langkah 6 — Sebut perhatian pada UX & aksesibilitas**
- Pola loading/empty/error yang konsisten (`Notice`).
- Validasi form real-time di Register.
- `aria-label`, `aria-expanded` di Navbar; menghormati `reduce motion`.
- Normalisasi input (email di-*trim* & *lowercase*) sebelum dikirim.

**Penutup (1 kalimat):**
> "Singkatnya: tiap bagian punya satu tugas jelas, komponen dipakai ulang, dan
> urusan teknis seperti token ditangani terpusat — sehingga kode mudah dibaca
> dan dikembangkan."

---

## 6. Antisipasi Pertanyaan Dosen (+ jawaban singkat)

**T: Kenapa pakai React, bukan HTML/JS biasa?**
J: React memecah UI jadi komponen reusable dan otomatis memperbarui tampilan
saat data berubah, jadi tidak perlu memanipulasi DOM manual. Cocok untuk app
interaktif dengan banyak state (timer, form, hasil).

**T: Bagaimana data login disimpan? Apakah aman?**
J: Token disimpan di `localStorage` dan dikirim sebagai header `Bearer` di tiap
request. Saat token ditolak (401), sesi otomatis dibersihkan. (Catatan jujur:
`localStorage` praktis untuk skala tugas; untuk produksi, `httpOnly cookie`
lebih aman dari serangan XSS — ini bisa kamu sebut sebagai pengembangan lanjutan.)

**T: Apa beda state lokal dan global di sini?**
J: State lokal (`useState`) untuk data satu halaman (form, soal). State global
(Zustand) untuk data login yang dipakai banyak komponen. Saya tidak menaruh
semua di global agar tidak rumit.

**T: Apa itu interceptor dan kenapa dipakai?**
J: Fungsi yang berjalan otomatis di setiap request/response Axios. Saya pakai
untuk menempelkan token dan menangani error 401 di **satu tempat**, sehingga
tiap halaman tidak perlu menulis ulang logika itu.

**T: Bagaimana mencegah halaman terproteksi diakses tanpa login?**
J: Lewat `ProtectedRoute`. Kalau tidak ada token, langsung dialihkan ke `/login`.
Karena reaktif, begitu token hilang, redirect terjadi otomatis.

**T: Bagaimana timer ujian tetap akurat?**
J: Saya simpan **waktu deadline absolut**, lalu tiap detik menghitung selisih ke
sekarang. Jadi meski interval browser melambat (tab tidak aktif), sisa waktu
tetap benar.

**T: Kenapa nilai seperti skor tidak disimpan di state sendiri?**
J: Karena bisa dihitung dari data yang sudah ada (*derived state*). Menyimpannya
terpisah berisiko tidak sinkron. Saya hitung saat render.

**T: Bagaimana memastikan kode tidak error sebelum dikumpulkan?**
J: Ada `npm run lint` (ESLint) untuk cek kualitas kode dan `npm run build` untuk
memastikan aplikasi bisa di-build untuk produksi.

---

## 7. Perintah Penting (kalau diminta demo)

```bash
npm install      # pasang dependensi
npm run dev      # jalankan mode pengembangan (localhost)
npm run build    # build versi produksi
npm run lint     # cek kualitas kode
```

Konfigurasi alamat backend ada di file `.env`:
```
VITE_API_BASE_URL=<alamat-api-backend>
```

---

## 8. Ringkasan Satu Layar (contekan saat presentasi)

- **Apa:** SPA React untuk latihan & simulasi TOEFL.
- **Struktur:** tiap folder satu tanggung jawab (api/store/routes/components/lib/pages).
- **API:** satu Axios terpusat + interceptor token & 401.
- **Auth:** Zustand (global) + token di localStorage + route guard reaktif.
- **Pola UI:** komponen reusable (design system) + status loading/empty/error konsisten.
- **Fitur unggulan:** timer ujian berbasis deadline absolut, feedback AI untuk writing.
- **Kualitas:** lulus `lint` & `build`, logika dijaga tetap sama, tanpa duplikasi.
```
