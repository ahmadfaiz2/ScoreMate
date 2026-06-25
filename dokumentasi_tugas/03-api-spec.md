# API Specification

> Dokumentasikan setiap endpoint yang dikembangkan maupun yang dikonsumsi dari layanan eksternal.
> Salin dan ulangi blok di bawah untuk setiap endpoint tambahan.

---

## Register

**Method:** `POST`

**URL:** `/api/v1/register`

**Deskripsi:** Mendaftarkan pengguna baru dengan email dan password.

**Autentikasi Diperlukan:** `Tidak`

**Sumber:** `Internal System`

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "password_confirmation": "string"
}
```

**Response Sukses (`201 Created`):**
```json
{
  "status": "success",
  "message": "Registrasi berhasil",
  "data": {
    "user": {
      "id": 1,
      "name": "Ahmad Faiz",
      "email": "faiz@email.com"
    },
    "token": "string"
  }
}
```

**Response Gagal:**
```json
{
  "status": "error",
  "message": "Email sudah terdaftar"
}
```

---

## Login

**Method:** `POST`

**URL:** `/api/v1/login`

**Deskripsi:** Login pengguna menggunakan email dan password, mengembalikan token autentikasi.

**Autentikasi Diperlukan:** `Tidak`

**Sumber:** `Internal System`

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response Sukses (`200 OK`):**
```json
{
  "status": "success",
  "message": "Login berhasil",
  "data": {
    "user": {
      "id": 1,
      "name": "Ahmad Faiz",
      "email": "faiz@email.com"
    },
    "token": "string"
  }
}
```

**Response Gagal:**
```json
{
  "status": "error",
  "message": "Email atau password salah"
}
```

---

## Logout

**Method:** `POST`

**URL:** `/api/v1/logout`

**Deskripsi:** Logout pengguna dan menghapus token autentikasi yang aktif.

**Autentikasi Diperlukan:** `Ya`

**Sumber:** `Internal System`

**Request Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:** `-`

**Response Sukses (`200 OK`):**
```json
{
  "status": "success",
  "message": "Logout berhasil"
}
```

**Response Gagal:**
```json
{
  "status": "error",
  "message": "Token tidak valid"
}
```

---

## Get Soal Latihan

**Method:** `GET`

**URL:** `/api/v1/questions?category={category}`

**Deskripsi:** Mengambil daftar soal TOEFL berdasarkan kategori (reading, listening, writing).

**Autentikasi Diperlukan:** `Ya`

**Sumber:** `Internal System`

**Request Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:** `-`

**Response Sukses (`200 OK`):**
```json
{
  "status": "success",
  "data": {
    "category": "reading",
    "questions": [
      {
        "id": 1,
        "question": "string",
        "options": ["A", "B", "C", "D"],
        "type": "multiple_choice"
      }
    ]
  }
}
```

**Response Gagal:**
```json
{
  "status": "error",
  "message": "Kategori tidak ditemukan"
}
```

---

## Submit Jawaban Latihan

**Method:** `POST`

**URL:** `/api/v1/questions/answer`

**Deskripsi:** Mengirim jawaban user untuk soal latihan dan mengembalikan hasil benar/salah beserta skor.

**Autentikasi Diperlukan:** `Ya`

**Sumber:** `Internal System`

**Request Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "question_id": "integer",
  "answer": "string"
}
```

**Response Sukses (`200 OK`):**
```json
{
  "status": "success",
  "data": {
    "is_correct": true,
    "correct_answer": "string",
    "score": 10
  }
}
```

**Response Gagal:**
```json
{
  "status": "error",
  "message": "Soal tidak ditemukan"
}
```

---

## AI Feedback Jawaban Writing

**Method:** `POST`

**URL:** `/api/v1/feedback`

**Deskripsi:** Mengirim jawaban writing user ke OpenAI API (ChatGPT) dan mengembalikan feedback berupa koreksi grammar, estimasi skor, dan saran perbaikan.

**Autentikasi Diperlukan:** `Ya`

**Sumber:** `Third-Party API — OpenAI (ChatGPT)`

**Request Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "question_id": "integer",
  "answer": "string"
}
```

**Response Sukses (`200 OK`):**
```json
{
  "status": "success",
  "data": {
    "score_estimation": 85,
    "grammar_feedback": "string",
    "suggestions": "string",
    "corrected_answer": "string"
  }
}
```

**Response Gagal:**
```json
{
  "status": "error",
  "message": "Gagal menghubungi layanan AI"
}
```

---

## Get Dashboard Progress

**Method:** `GET`

**URL:** `/api/v1/dashboard`

**Deskripsi:** Mengambil data progress dan statistik belajar pengguna yang sedang login, termasuk skor rata-rata dan grafik perkembangan.

**Autentikasi Diperlukan:** `Ya`

**Sumber:** `Internal System`

**Request Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:** `-`

**Response Sukses (`200 OK`):**
```json
{
  "status": "success",
  "data": {
    "total_questions_answered": 120,
    "average_score": 78,
    "score_by_category": {
      "reading": 80,
      "listening": 75,
      "writing": 70
    },
    "score_history": [
      {
        "date": "2026-06-01",
        "score": 75
      },
      {
        "date": "2026-06-10",
        "score": 80
      }
    ]
  }
}
```

**Response Gagal:**
```json
{
  "status": "error",
  "message": "Data tidak ditemukan"
}
```

---

## Mulai Simulasi Ujian

**Method:** `POST`

**URL:** `/api/v1/exam/start`

**Deskripsi:** Memulai sesi simulasi ujian TOEFL baru dan mengembalikan soal-soal ujian beserta durasi waktu.

**Autentikasi Diperlukan:** `Ya`

**Sumber:** `Internal System`

**Request Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:** `-`

**Response Sukses (`200 OK`):**
```json
{
  "status": "success",
  "data": {
    "exam_id": "integer",
    "duration_minutes": 60,
    "questions": [
      {
        "id": 1,
        "category": "reading",
        "question": "string",
        "options": ["A", "B", "C", "D"]
      }
    ]
  }
}
```

**Response Gagal:**
```json
{
  "status": "error",
  "message": "Gagal memulai simulasi ujian"
}
```

---

## Submit Simulasi Ujian

**Method:** `POST`

**URL:** `/api/v1/exam/submit`

**Deskripsi:** Mengirim semua jawaban simulasi ujian dan mengembalikan hasil akhir beserta skor total.

**Autentikasi Diperlukan:** `Ya`

**Sumber:** `Internal System`

**Request Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "exam_id": "integer",
  "answers": [
    {
      "question_id": 1,
      "answer": "string"
    }
  ]
}
```

**Response Sukses (`200 OK`):**
```json
{
  "status": "success",
  "data": {
    "exam_id": "integer",
    "total_score": 85,
    "score_by_category": {
      "reading": 90,
      "listening": 80,
      "writing": 75
    },
    "correct_answers": 34,
    "total_questions": 40
  }
}
```

**Response Gagal:**
```json
{
  "status": "error",
  "message": "Sesi ujian tidak ditemukan atau sudah berakhir"
}
```

---

## Get Riwayat Latihan

**Method:** `GET`

**URL:** `/api/v1/history`

**Deskripsi:** Mengambil seluruh riwayat sesi latihan dan simulasi ujian yang pernah dilakukan oleh pengguna yang sedang login.

**Autentikasi Diperlukan:** `Ya`

**Sumber:** `Internal System`

**Request Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:** `-`

**Response Sukses (`200 OK`):**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "type": "practice",
      "category": "reading",
      "score": 80,
      "total_questions": 10,
      "correct_answers": 8,
      "date": "2026-06-19"
    },
    {
      "id": 2,
      "type": "exam",
      "category": "all",
      "score": 85,
      "total_questions": 40,
      "correct_answers": 34,
      "date": "2026-06-18"
    }
  ]
}
```

**Response Gagal:**
```json
{
  "status": "error",
  "message": "Riwayat tidak ditemukan"
}
```

---

## Get Leaderboard

**Method:** `GET`

**URL:** `/api/v1/leaderboard`

**Deskripsi:** Mengambil daftar peringkat pengguna berdasarkan skor tertinggi dari simulasi ujian yang telah diselesaikan.

**Autentikasi Diperlukan:** `Ya`

**Sumber:** `Internal System`

**Request Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:** `-`

**Response Sukses (`200 OK`):**
```json
{
  "status": "success",
  "data": {
    "my_rank": 5,
    "leaderboard": [
      {
        "rank": 1,
        "name": "Ahmad Faiz",
        "score": 98
      },
      {
        "rank": 2,
        "name": "User Lain",
        "score": 95
      }
    ]
  }
}
```

**Response Gagal:**
```json
{
  "status": "error",
  "message": "Gagal mengambil data leaderboard"
}
```

---

*(Salin blok template di atas untuk setiap endpoint selanjutnya)*
