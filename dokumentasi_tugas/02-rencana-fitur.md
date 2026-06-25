# Rencana Fitur

> Dokumentasikan minimal **5 fitur utama** proyek Anda.
> Salin dan ulangi blok di bawah untuk setiap fitur tambahan.

---

## Fitur 1 — Autentikasi (Register & Login)

**Role Penanggung Jawab:** `Backend, Frontend`

**Sumber Data:** `Internal System`

**Deskripsi & Ekspektasi:**
`User dapat melakukan registrasi dan login menggunakan email & password. Backend Laravel menggunakan Laravel Sanctum untuk autentikasi berbasis token. Setelah login berhasil, frontend menyimpan token dan menyertakannya di setiap request ke API. Ekspektasi: user hanya bisa mengakses fitur latihan, dashboard, dan simulasi setelah berhasil login.`

---

## Fitur 2 — Latihan Soal TOEFL

**Role Penanggung Jawab:** `Frontend, Backend`

**Sumber Data:** `Internal System`

**Deskripsi & Ekspektasi:**
`User dapat berlatih soal TOEFL berdasarkan kategori: Reading, Listening, dan Writing. Soal disimpan di database Supabase dan diambil melalui REST API Laravel. Frontend menampilkan soal satu per satu beserta pilihan jawaban. Ekspektasi: user bisa memilih kategori latihan, menjawab soal, dan langsung mendapatkan hasil benar/salah setelah menjawab.`

---

## Fitur 3 — AI Feedback & Koreksi Jawaban

**Role Penanggung Jawab:** `Backend, Frontend`

**Sumber Data:** `Third-Party API — OpenAI (ChatGPT)`

**Deskripsi & Ekspektasi:**
`Setelah user menjawab soal Writing, backend mengirim jawaban user ke OpenAI API (ChatGPT) dan mengembalikan feedback berupa koreksi grammar, skor estimasi, dan saran perbaikan. Frontend menampilkan feedback dalam format yang mudah dibaca. Ekspektasi: user mendapatkan umpan balik AI yang detail dan personal untuk meningkatkan kemampuan writing mereka.`

---

## Fitur 4 — Dashboard Progress & Skor

**Role Penanggung Jawab:** `Frontend, Backend`

**Sumber Data:** `Internal System`

**Deskripsi & Ekspektasi:**
`User dapat melihat ringkasan progress belajar mereka secara visual, termasuk grafik skor dari waktu ke waktu, persentase jawaban benar per kategori (Reading, Listening, Writing), dan total soal yang sudah dikerjakan. Ekspektasi: user mendapatkan gambaran jelas tentang perkembangan belajar mereka dan area yang perlu ditingkatkan.`

---

## Fitur 5 — Simulasi Ujian TOEFL (Timer & Scoring)

**Role Penanggung Jawab:** `Frontend, Backend`

**Sumber Data:** `Internal System`

**Deskripsi & Ekspektasi:**
`User dapat mengikuti simulasi ujian TOEFL lengkap dengan timer countdown yang berjalan otomatis. Setelah waktu habis atau semua soal dijawab, sistem menghitung skor akhir secara otomatis dan menampilkan hasil beserta pembahasan. Ekspektasi: user mendapatkan pengalaman ujian yang mendekati kondisi nyata untuk mempersiapkan diri menghadapi TOEFL sesungguhnya.`

---

## Fitur 6 — Riwayat Latihan

**Role Penanggung Jawab:** `Frontend, Backend`

**Sumber Data:** `Internal System`

**Deskripsi & Ekspektasi:**
`User dapat melihat seluruh riwayat sesi latihan dan simulasi yang pernah dilakukan, termasuk tanggal, kategori soal, jumlah soal, dan skor yang diperoleh. Ekspektasi: user bisa memantau konsistensi belajar mereka dan mengidentifikasi kapan performa terbaik dan terburuk mereka terjadi.`

---

## Fitur 7 — Leaderboard

**Role Penanggung Jawab:** `Frontend, Backend`

**Sumber Data:** `Internal System`

**Deskripsi & Ekspektasi:**
`Menampilkan peringkat seluruh pengguna ScoreMate berdasarkan skor tertinggi dari simulasi ujian. User dapat melihat posisi mereka di antara pengguna lain sebagai motivasi untuk terus belajar. Ekspektasi: leaderboard diperbarui secara otomatis setiap kali ada simulasi yang diselesaikan, dan user dapat melihat nama, skor, dan peringkat masing-masing.`

---

*(Salin blok di atas untuk fitur selanjutnya)*
