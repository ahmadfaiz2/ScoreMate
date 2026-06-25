# Rencana Kerja & Struktur Folder — ScoreMate

> Acuan pengerjaan. Urutan wajib: **Backend → Frontend → DevOps**.
> Status dependency saat dokumen dibuat:
> - Backend: Laravel 13 fresh (belum ada Sanctum, masih sqlite, belum ada kode domain).
> - Frontend: React 19 + Vite + Tailwind 4 + axios + react-router-dom + recharts + zustand + framer-motion + react-markdown (sudah terpasang, `src/` masih template).

---

## FASE 1 — BACKEND (Laravel 13 API)

### 1.1 Setup & Konfigurasi
- [ ] Install Laravel Sanctum (`composer require laravel/sanctum`) + publish config + migration.
- [ ] Ubah `DB_CONNECTION` ke `pgsql`, isi kredensial Supabase di `.env` (host, port 5432/6543 pooler, database, username, password, sslmode).
- [ ] Tambah konfigurasi OpenAI di `config/services.php` + `OPENAI_API_KEY` & `OPENAI_MODEL` di `.env` / `.env.example`.
- [ ] Setup CORS (`config/cors.php`) agar mengizinkan origin frontend (Vite `http://localhost:5173`).
- [ ] Buat `routes/api.php` + daftarkan di `bootstrap/app.php` (Laravel 11/13 style) dengan prefix `/api/v1`.
- [ ] Force JSON response untuk semua error API (exception handler → struktur `{status, message}`).

### 1.2 Database — Migration, Model, Seeder
Tabel yang dibutuhkan:
- [ ] `users` (sudah ada, tambah kolom bila perlu: `total_score`/dihitung saja).
- [ ] `questions` — `id, category(enum: reading|listening|writing), question, options(json), correct_answer, type, audio_url(nullable), explanation(nullable)`.
- [ ] `practice_answers` — `id, user_id, question_id, answer, is_correct, score, created_at`.
- [ ] `exams` — `id, user_id, duration_minutes, status(ongoing|finished), total_score, started_at, finished_at`.
- [ ] `exam_answers` — `id, exam_id, question_id, answer, is_correct`.
- [ ] `feedbacks` — `id, user_id, question_id, answer, score_estimation, grammar_feedback, suggestions, corrected_answer, created_at`.
- [ ] Model + relasi Eloquent untuk masing-masing tabel.
- [ ] Seeder soal TOEFL (Reading/Listening/Writing) — minimal beberapa soal per kategori agar bisa diuji.

### 1.3 Autentikasi (Fitur 1)
- [ ] `AuthController`: `register`, `login`, `logout` (Sanctum token).
- [ ] FormRequest validasi: `RegisterRequest`, `LoginRequest`.
- [ ] Endpoint: `POST /register`, `POST /login`, `POST /logout`.

### 1.4 Latihan Soal (Fitur 2)
- [ ] `QuestionController@index` → `GET /questions?category=` (sembunyikan `correct_answer` di response).
- [ ] `QuestionController@answer` → `POST /questions/answer` (cek benar/salah, simpan ke `practice_answers`, return skor).

### 1.5 AI Feedback Writing (Fitur 3 — Third-party OpenAI)
- [ ] `OpenAiService` (app/Services) — bungkus panggilan ke OpenAI Chat API + error handling.
- [ ] `FeedbackController@store` → `POST /feedback` (kirim jawaban writing, simpan & return `score_estimation, grammar_feedback, suggestions, corrected_answer`).

### 1.6 Dashboard (Fitur 4)
- [ ] `DashboardController@index` → `GET /dashboard` (total dijawab, rata-rata skor, skor per kategori, history skor untuk grafik).

### 1.7 Simulasi Ujian (Fitur 5)
- [ ] `ExamController@start` → `POST /exam/start` (buat sesi, ambil campuran soal, set durasi).
- [ ] `ExamController@submit` → `POST /exam/submit` (hitung skor total + per kategori, simpan, return hasil).

### 1.8 Riwayat (Fitur 6)
- [ ] `HistoryController@index` → `GET /history` (gabungan practice + exam, urut tanggal).

### 1.9 Leaderboard (Fitur 7)
- [ ] `LeaderboardController@index` → `GET /leaderboard` (ranking skor exam tertinggi + `my_rank`).

### 1.10 Konsistensi & Uji
- [ ] Helper/trait response standar `{status, message, data}` (mis. `ApiResponse`).
- [ ] Middleware `auth:sanctum` untuk semua endpoint kecuali register/login.
- [ ] Uji manual semua endpoint (Postman/Thunder Client) sesuai `03-api-spec.md`.

### Struktur folder backend (target)
```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/Api/V1/
│   │   │   ├── AuthController.php
│   │   │   ├── QuestionController.php
│   │   │   ├── FeedbackController.php
│   │   │   ├── DashboardController.php
│   │   │   ├── ExamController.php
│   │   │   ├── HistoryController.php
│   │   │   └── LeaderboardController.php
│   │   ├── Requests/            # RegisterRequest, LoginRequest, AnswerRequest, ...
│   │   └── Resources/           # (opsional) UserResource, QuestionResource, ...
│   ├── Models/
│   │   ├── User.php  Question.php  PracticeAnswer.php
│   │   ├── Exam.php  ExamAnswer.php  Feedback.php
│   ├── Services/
│   │   └── OpenAiService.php
│   └── Traits/ (atau Helpers/) ApiResponse.php
├── database/
│   ├── migrations/   # questions, practice_answers, exams, exam_answers, feedbacks
│   └── seeders/      # QuestionSeeder.php, DatabaseSeeder.php
├── routes/
│   └── api.php       # prefix v1, group auth:sanctum
└── config/ (services.php, cors.php, sanctum.php)
```

---

## FASE 2 — FRONTEND (React + Vite)

### 2.1 Fondasi
- [ ] Setup React Router (`BrowserRouter`, route public vs protected).
- [ ] Konfigurasi axios instance (`baseURL`, interceptor inject Bearer token, handle 401).
- [ ] Store auth pakai Zustand (token, user, persist ke localStorage).
- [ ] `ProtectedRoute` wrapper (redirect ke /login bila belum auth).
- [ ] Layout dasar + Tailwind (navbar, sidebar, container).

### 2.2 Halaman (sesuai fitur)
- [ ] **Auth**: `LoginPage`, `RegisterPage`.
- [ ] **Practice**: pilih kategori → kerjakan soal satu per satu → feedback benar/salah.
- [ ] **Writing + AI Feedback**: form jawaban writing → tampilkan feedback AI (render markdown).
- [ ] **Dashboard**: kartu statistik + grafik (Recharts: line skor, bar per kategori).
- [ ] **Exam Simulation**: timer countdown, navigasi soal, submit → halaman hasil.
- [ ] **History**: tabel riwayat practice & exam.
- [ ] **Leaderboard**: tabel ranking + highlight posisi sendiri.

### Struktur folder frontend (target)
```
frontend/src/
├── api/            # axios instance + modul: auth.js, questions.js, exam.js, ...
├── store/          # authStore.js (zustand)
├── components/     # Navbar, ProtectedRoute, QuestionCard, Timer, Chart, ...
├── pages/          # Login, Register, Practice, Writing, Dashboard, Exam, History, Leaderboard
├── routes/         # AppRoutes.jsx
├── hooks/          # useAuth, useTimer, ...
├── utils/          # helpers
├── App.jsx
└── main.jsx
```

---

## FASE 3 — DEVOPS

- [ ] `.gitignore` rapi untuk kedua app; `git init` (push GitHub menyusul — sesuai instruksi).
- [ ] GitHub Actions di `.github/workflows/`:
  - [ ] `backend-ci.yml` — composer install, jalankan test/lint.
  - [ ] `frontend-ci.yml` — npm install, build, lint.
- [ ] Deployment ke Render:
  - [ ] Backend Laravel (web service + env vars Supabase & OpenAI).
  - [ ] Frontend (static site / Render).
- [ ] Dokumentasi cara menjalankan (README masing-masing app + env example).

---

## Catatan Integrasi
- Base URL API: `http://localhost:8000/api/v1` (dev). Frontend pakai `VITE_API_BASE_URL`.
- Semua response konsisten `{status, message, data}` sesuai `03-api-spec.md`.
- OpenAI key sudah dimiliki user → simpan di `.env` backend (jangan commit).
