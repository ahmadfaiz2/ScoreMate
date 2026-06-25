# Database Schema

> Dokumentasi struktur tabel database ScoreMate menggunakan Supabase (PostgreSQL).

---

## Tabel 1 — users

**Deskripsi:** Menyimpan data akun pengguna yang terdaftar di ScoreMate.

| Kolom | Tipe Data | Keterangan |
|-------|-----------|------------|
| `id` | `bigint` | Primary key, auto increment |
| `name` | `varchar(255)` | Nama lengkap pengguna |
| `email` | `varchar(255)` | Email unik pengguna |
| `password` | `varchar(255)` | Password yang sudah di-hash |
| `created_at` | `timestamp` | Waktu registrasi |
| `updated_at` | `timestamp` | Waktu update terakhir |

**Relasi:**
- `users.id` → `practice_sessions.user_id`
- `users.id` → `exam_sessions.user_id`
- `users.id` → `ai_feedbacks.user_id`

---

## Tabel 2 — questions

**Deskripsi:** Menyimpan bank soal TOEFL berdasarkan kategori.

| Kolom | Tipe Data | Keterangan |
|-------|-----------|------------|
| `id` | `bigint` | Primary key, auto increment |
| `category` | `enum('reading', 'listening', 'writing')` | Kategori soal |
| `type` | `enum('multiple_choice', 'essay')` | Jenis soal |
| `question` | `text` | Isi pertanyaan |
| `options` | `json` | Pilihan jawaban (untuk multiple choice) |
| `correct_answer` | `varchar(255)` | Jawaban benar |
| `created_at` | `timestamp` | Waktu dibuat |
| `updated_at` | `timestamp` | Waktu update terakhir |

**Relasi:**
- `questions.id` → `practice_answers.question_id`
- `questions.id` → `exam_answers.question_id`
- `questions.id` → `ai_feedbacks.question_id`

---

## Tabel 3 — practice_sessions

**Deskripsi:** Menyimpan data sesi latihan soal yang dilakukan pengguna.

| Kolom | Tipe Data | Keterangan |
|-------|-----------|------------|
| `id` | `bigint` | Primary key, auto increment |
| `user_id` | `bigint` | Foreign key ke tabel users |
| `category` | `enum('reading', 'listening', 'writing')` | Kategori latihan |
| `total_questions` | `integer` | Jumlah soal dalam sesi |
| `correct_answers` | `integer` | Jumlah jawaban benar |
| `score` | `integer` | Skor akhir (0-100) |
| `created_at` | `timestamp` | Waktu sesi latihan |
| `updated_at` | `timestamp` | Waktu update terakhir |

**Relasi:**
- `practice_sessions.user_id` → `users.id`
- `practice_sessions.id` → `practice_answers.practice_session_id`

---

## Tabel 4 — practice_answers

**Deskripsi:** Menyimpan detail jawaban per soal dalam sesi latihan.

| Kolom | Tipe Data | Keterangan |
|-------|-----------|------------|
| `id` | `bigint` | Primary key, auto increment |
| `practice_session_id` | `bigint` | Foreign key ke tabel practice_sessions |
| `question_id` | `bigint` | Foreign key ke tabel questions |
| `user_answer` | `text` | Jawaban yang dipilih/ditulis user |
| `is_correct` | `boolean` | Benar atau salah |
| `created_at` | `timestamp` | Waktu menjawab |
| `updated_at` | `timestamp` | Waktu update terakhir |

**Relasi:**
- `practice_answers.practice_session_id` → `practice_sessions.id`
- `practice_answers.question_id` → `questions.id`

---

## Tabel 5 — exam_sessions

**Deskripsi:** Menyimpan data sesi simulasi ujian TOEFL lengkap.

| Kolom | Tipe Data | Keterangan |
|-------|-----------|------------|
| `id` | `bigint` | Primary key, auto increment |
| `user_id` | `bigint` | Foreign key ke tabel users |
| `status` | `enum('ongoing', 'completed')` | Status ujian |
| `total_questions` | `integer` | Total soal dalam simulasi |
| `correct_answers` | `integer` | Total jawaban benar |
| `total_score` | `integer` | Skor total (0-100) |
| `reading_score` | `integer` | Skor kategori reading |
| `listening_score` | `integer` | Skor kategori listening |
| `writing_score` | `integer` | Skor kategori writing |
| `started_at` | `timestamp` | Waktu mulai ujian |
| `completed_at` | `timestamp` | Waktu selesai ujian |
| `created_at` | `timestamp` | Waktu dibuat |
| `updated_at` | `timestamp` | Waktu update terakhir |

**Relasi:**
- `exam_sessions.user_id` → `users.id`
- `exam_sessions.id` → `exam_answers.exam_session_id`

---

## Tabel 6 — exam_answers

**Deskripsi:** Menyimpan detail jawaban per soal dalam sesi simulasi ujian.

| Kolom | Tipe Data | Keterangan |
|-------|-----------|------------|
| `id` | `bigint` | Primary key, auto increment |
| `exam_session_id` | `bigint` | Foreign key ke tabel exam_sessions |
| `question_id` | `bigint` | Foreign key ke tabel questions |
| `user_answer` | `text` | Jawaban yang dipilih/ditulis user |
| `is_correct` | `boolean` | Benar atau salah |
| `created_at` | `timestamp` | Waktu menjawab |
| `updated_at` | `timestamp` | Waktu update terakhir |

**Relasi:**
- `exam_answers.exam_session_id` → `exam_sessions.id`
- `exam_answers.question_id` → `questions.id`

---

## Tabel 7 — ai_feedbacks

**Deskripsi:** Menyimpan hasil feedback dari OpenAI (ChatGPT) untuk jawaban writing pengguna.

| Kolom | Tipe Data | Keterangan |
|-------|-----------|------------|
| `id` | `bigint` | Primary key, auto increment |
| `user_id` | `bigint` | Foreign key ke tabel users |
| `question_id` | `bigint` | Foreign key ke tabel questions |
| `user_answer` | `text` | Jawaban writing yang dikirim user |
| `score_estimation` | `integer` | Estimasi skor dari AI (0-100) |
| `grammar_feedback` | `text` | Feedback grammar dari AI |
| `suggestions` | `text` | Saran perbaikan dari AI |
| `corrected_answer` | `text` | Contoh jawaban yang sudah dikoreksi AI |
| `created_at` | `timestamp` | Waktu feedback dibuat |
| `updated_at` | `timestamp` | Waktu update terakhir |

**Relasi:**
- `ai_feedbacks.user_id` → `users.id`
- `ai_feedbacks.question_id` → `questions.id`

---

## Ringkasan Relasi Antar Tabel

```
users
 ├── practice_sessions (user_id)
 │    └── practice_answers (practice_session_id)
 │         └── questions (question_id)
 ├── exam_sessions (user_id)
 │    └── exam_answers (exam_session_id)
 │         └── questions (question_id)
 └── ai_feedbacks (user_id)
      └── questions (question_id)
```

---

## Catatan

- **Leaderboard** tidak membutuhkan tabel tersendiri — data diambil dari tabel `exam_sessions` dengan query pengurutan `total_score` tertinggi per user.
- Semua tabel menggunakan `created_at` dan `updated_at` yang dikelola otomatis oleh Laravel (Eloquent timestamps).
- Password di tabel `users` di-hash menggunakan `bcrypt` oleh Laravel sebelum disimpan.
