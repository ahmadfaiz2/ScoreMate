# Progress Pengerjaan ScoreMate (Backend)

> Daftar semua yang sudah dikerjakan beserta **kegunaannya**, ditulis sesederhana mungkin.
> Status saat ini: **Backend selesai 100% + GitHub Actions CI**. Frontend & deploy menyusul.

---

## A. Fondasi (Pondasi Sistem)

| # | Yang dibuat | Kegunaannya (untuk apa) |
|---|---|---|
| 1 | **Koneksi ke Supabase** (`.env`) | Menghubungkan aplikasi Laravel ke database PostgreSQL di cloud. Tanpa ini, tidak ada data yang bisa disimpan/diambil. |
| 2 | **Laravel Sanctum** | Sistem login berbasis **token**. Saat user login, dapat token; token itu jadi "tiket" untuk mengakses fitur. |
| 3 | **Routing `/api/v1`** (`routes/api.php`) | Daftar alamat (URL) semua fitur API. Misal `/api/v1/login`, `/api/v1/dashboard`. |
| 4 | **Trait `ApiResponse`** | Membuat semua jawaban API seragam formatnya: `{status, message, data}`. Biar frontend mudah membacanya. |
| 5 | **CORS** (`config/cors.php`) | Izin agar frontend (React) boleh memanggil API. Tanpa ini browser memblokir. |
| 6 | **Config OpenAI** (`config/services.php`) | Tempat menyimpan API key OpenAI untuk fitur AI. |
| 7 | **Error handler seragam** (`bootstrap/app.php`) | Saat terjadi error (validasi gagal, token salah, data tak ada), jawabannya tetap rapi & konsisten. |

---

## B. Database (Tempat Menyimpan Data)

| # | Yang dibuat | Kegunaannya |
|---|---|---|
| 8 | **6 Migration** (cetak biru tabel) | Membuat tabel di Supabase: `questions`, `practice_sessions`, `practice_answers`, `exam_sessions`, `exam_answers`, `ai_feedbacks`. |
| 9 | **6 Model + relasi** (Eloquent) | "Perwakilan" tabel dalam bentuk objek PHP. Memudahkan ambil/simpan data & menghubungkan antar tabel (mis. user → punya banyak sesi ujian). |
| 10 | **Seeder soal** (`QuestionSeeder`) | Mengisi 10 soal TOEFL contoh (4 Reading, 4 Listening, 2 Writing) supaya fitur bisa diuji. |

---

## C. Fitur Utama (7 Fitur / 13 Endpoint)

| Fitur | Endpoint | Kegunaannya |
|---|---|---|
| **1. Autentikasi** | `register`, `login`, `logout` | User bisa daftar akun, masuk, dan keluar. Hanya user login yang boleh akses fitur lain. |
| **2. Latihan Soal** | `GET /questions`, `POST /questions/answer` | Ambil soal per kategori, lalu jawab dan langsung tahu benar/salah + skor. |
| **3. AI Feedback** | `POST /feedback` | Kirim jawaban writing ke **OpenAI (ChatGPT)**, dapat koreksi grammar, estimasi skor, saran, & contoh jawaban yang diperbaiki. |
| **4. Dashboard** | `GET /dashboard` | Ringkasan progres: total soal dijawab, rata-rata skor, skor per kategori, grafik perkembangan. |
| **5. Simulasi Ujian** | `POST /exam/start`, `POST /exam/submit` | Ujian lengkap: mulai sesi (dapat soal + durasi), submit semua jawaban, dapat skor total & per kategori. |
| **6. Riwayat** | `GET /history` | Daftar semua sesi latihan & ujian yang pernah dilakukan, urut terbaru. |
| **7. Leaderboard** | `GET /leaderboard` | Peringkat semua user berdasarkan skor ujian tertinggi + posisi diri sendiri. |

---

## D. Konsep Khusus (Syarat Dosen) — semua ada di Fitur AI Feedback

| Konsep | File | Kegunaannya (analogi) |
|---|---|---|
| **Contract** | `app/Contracts/AiFeedbackContract.php` | "Janji/daftar kemampuan". Mendefinisikan fungsi `review()` tanpa peduli isinya — seperti bentuk colokan listrik. |
| **Service** | `app/Services/OpenAiService.php` | "Mesin" yang benar-benar memanggil OpenAI dan menepati janji kontrak. |
| **Service Provider** | `app/Providers/AiServiceProvider.php` | "Petugas" yang memberitahu Laravel: kalau ada yang minta kontrak ini, pakai OpenAiService. |
| **Service Container** | (bawaan Laravel) | "Pabrik otomatis" yang menyediakan objek saat dibutuhkan, berdasarkan info dari Provider. |
| **Facade** | `app/Facades/AiFeedback.php` | "Nama pendek" pemanggilan: `AiFeedback::review(...)`. |
| **Laravel HTTP** | di dalam `OpenAiService` | `Http::withToken()` untuk memanggil API OpenAI dari luar. |

> Intinya: satu fitur AI Feedback memakai **6 konsep ini sekaligus**, supaya kode rapi dan mudah diganti (mis. dari OpenAI ke Gemini cukup ubah 1 baris).

---

## E. Testing & Kualitas

| # | Yang dibuat | Kegunaannya |
|---|---|---|
| 11 | **Helper `ScoreCalculator`** | Logika hitung skor (benar/total × 100) di satu tempat, biar konsisten & mudah diuji. |
| 12 | **Unit Test** (`tests/Unit`) | Menguji rumus skor secara terisolasi (tanpa database). |
| 13 | **Feature Test** (`tests/Feature`) | Menguji fitur utuh lewat HTTP (register, login, latihan, ujian) — pakai database SQLite sementara. |
| — | **Hasil** | `php artisan test` → **14 test PASS, 41 assertion**. |

---

## F. DevOps

| # | Yang dibuat | Kegunaannya |
|---|---|---|
| 14 | **GitHub Actions CI** (`.github/workflows/backend-ci.yml`) | Tiap kali kode di-push/PR ke GitHub, test otomatis dijalankan. Lolos → centang hijau ✅, gagal → silang merah ❌. Tidak butuh Supabase/secret karena pakai SQLite. |

---

## Ringkasan Status

```
[✅] Fondasi sistem
[✅] Database (tabel + data soal)
[✅] 7 fitur / 13 endpoint  (semua teruji)
[✅] Konsep dosen (Contract/Service/Provider/Facade/HTTP)
[✅] Testing (14 test hijau)
[✅] GitHub Actions CI
[⏳] Frontend (React)        — berikutnya
[⏳] GitHub Actions CD       — deploy ke Render (tahap akhir)
```

**Akun test untuk uji coba:** `test@example.com` / `password`
**Reset data bersih kapan saja:** `php artisan migrate:fresh --seed`
