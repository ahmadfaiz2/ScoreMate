# Syarat Teknis Tambahan (Arahan Dosen)

> Dokumen ini menjelaskan syarat teknis tambahan dari dosen, maksudnya, dan **di mana** masing-masing diwujudkan di proyek ScoreMate. Dilengkapi checklist sebagai bukti pemenuhan.

---

## Daftar Syarat (Gabungan 2 Arahan Dosen)

Kedua arahan dosen saling tumpang tindih. Setelah digabung, ada **8 syarat**:

| # | Syarat | Kategori | Status |
|---|--------|----------|--------|
| 1 | Service Container | Konsep inti Laravel | ⬜ |
| 2 | Service Provider | Konsep inti Laravel | ⬜ |
| 3 | Contracts (Kontrak Laravel) | Konsep inti Laravel | ⬜ |
| 4 | Facades (package) | Konsep inti Laravel | ⬜ |
| 5 | Laravel HTTP (HTTP Client) | Fitur Laravel | ⬜ |
| 6 | Database Design | Dokumentasi | ✅ (lihat `05-database-schema.md`) |
| 7 | PHPUnit — Unit & Feature test (devops terminal) | Testing | ⬜ |
| 8 | GitHub Actions CI/CD | DevOps | ⬜ |

> **Strategi:** syarat 1–5 dan 7 dapat dipenuhi sekaligus melalui satu fitur: **AI Feedback (integrasi OpenAI)**.

---

## Penjelasan Konsep

### 1–4. Container, Provider, Contract, Facade — Satu Alur

Empat konsep ini adalah cara Laravel merapikan kode agar modular dan mudah diganti. Analogi colokan listrik: selama bentuk colokan (kontrak) sama, perangkat apa pun bisa dipakai.

**Contract (Kontrak)** — sebuah `interface`; daftar method yang WAJIB dipenuhi, tanpa peduli isinya.
```php
interface AiFeedbackContract {
    public function review(string $answer): array;
}
```

**Service** — kelas nyata yang menepati kontrak (benar-benar memanggil OpenAI).
```php
class OpenAiService implements AiFeedbackContract {
    public function review(string $answer): array { /* panggil OpenAI */ }
}
```
Karena memakai kontrak, ganti provider AI (mis. ke Gemini) cukup buat `GeminiService implements AiFeedbackContract` — controller tidak berubah.

**Service Container** — "pabrik otomatis" Laravel yang menyiapkan objek saat diminta. Kita cukup minta `AiFeedbackContract`, container menyediakan `OpenAiService` lengkap dengan dependency-nya (dependency injection).

**Service Provider** — tempat memberitahu container hubungan kontrak → service. Inilah yang dimaksud dosen "Service provider dengan service container (untuk menyambungkan)".
```php
// AppServiceProvider::register()  (atau provider khusus)
$this->app->bind(AiFeedbackContract::class, OpenAiService::class);
```

**Facade** — nama pendek untuk memanggil service: `NamaFacade::method()`. Contoh bawaan: `Auth::user()`, `DB::table()`, `Http::get()`. Untuk syarat ini dibuat **facade kustom** `AiFeedback::review($jawaban)`.

**Alur lengkap:**
```
Controller:  AiFeedback::review($jwb)            (FACADE)
                     │
                     ▼
        Service Container mencari implementasi    (CONTAINER)
                     │  (sudah didaftarkan oleh...)
                     ▼
        Service Provider: bind kontrak→OpenAiService  (PROVIDER + CONTRACT)
                     │
                     ▼
        OpenAiService->review() dieksekusi        (SERVICE)
```

### 5. Laravel HTTP (HTTP Client)
Facade `Http` untuk memanggil API eksternal. Dipakai di dalam `OpenAiService`:
```php
use Illuminate\Support\Facades\Http;

$res = Http::withToken(config('services.openai.key'))
    ->post('https://api.openai.com/v1/chat/completions', [ /* payload */ ]);
```
`Http` sekaligus contoh nyata penggunaan facade, jadi syarat 4 & 5 saling menguatkan.

### 6. Database Design ✅
Sudah didokumentasikan lengkap (7 tabel + relasi) di `05-database-schema.md`. Akan diwujudkan menjadi migration Laravel pada Fase 1 backend.

### 7. PHPUnit — Unit & Feature Test
- **Unit test**: menguji potongan kecil terisolasi (mis. rumus skor `benar/total*100`).
- **Feature test**: menguji fitur utuh via HTTP (mis. `POST /api/v1/register` → `201` + token).
- Dijalankan dari terminal (poin "fitur devops / terminal"):
```bash
php artisan test
```
Bukti pemenuhan: screenshot/log output terminal semua test PASS.

### 8. GitHub Actions CI/CD
- **CI** — setiap `git push`, otomatis jalankan `php artisan test` + build frontend. File workflow di `.github/workflows/`.
- **CD** — setelah CI lulus, deploy otomatis ke Render.

---

## Catatan Kolaborasi (Solo Developer)

Dosen menilai **kebiasaan kerja tim**, bukan jumlah orang. Disimulasikan dengan:
1. **Branching per fitur** — `feature/auth`, `feature/exam`, dst (jangan langsung di `main`).
2. **Commit kecil & bermakna** — mis. `feat: add login endpoint`.
3. **Pull Request** — buka PR ke `main`, biarkan **CI** mengecek, lalu merge. Meniru proses review tim.
4. **Dokumentasi** — folder `dokumentasi_tugas/` sebagai jejak peran Frontend/Backend/DevOps.

---

## Checklist Pemenuhan (Bukti untuk Dosen)

**Konsep Laravel (lewat fitur AI Feedback):**
- [ ] Buat `app/Contracts/AiFeedbackContract.php` (Contract)
- [ ] Buat `app/Services/OpenAiService.php implements AiFeedbackContract` (Service + Laravel HTTP)
- [ ] Bind kontrak→service di Service Provider (`AppServiceProvider` atau `AiServiceProvider` khusus) — Container
- [ ] Buat Facade kustom `AiFeedback` (`app/Facades/AiFeedback.php`)
- [ ] Pakai facade `Http` di dalam service (Laravel HTTP)

**Database:**
- [x] Rancangan skema database (`05-database-schema.md`)
- [ ] Implementasi migration sesuai skema

**Testing (terminal):**
- [ ] Minimal 1 Unit test (`tests/Unit/`)
- [ ] Minimal 1 Feature test (`tests/Feature/`)
- [ ] `php artisan test` semua PASS

**DevOps / Git:**
- [ ] `.github/workflows/` CI (run test + build)
- [ ] CD deploy ke Render
- [ ] Workflow Git: branch per fitur + commit bermakna + Pull Request

---

## Ringkasan
> Satu fitur **AI Feedback** memenuhi 7 syarat sekaligus:
> Contract → di-bind Service Provider ke Container → diakses via Facade `AiFeedback` → memakai Laravel HTTP untuk OpenAI → diuji dengan PHPUnit → dijalankan otomatis oleh GitHub Actions CI/CD.
> Database design sudah selesai di dokumen `05`.
