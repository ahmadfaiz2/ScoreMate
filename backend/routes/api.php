<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\DashboardController;
use App\Http\Controllers\Api\V1\ExamController;
use App\Http\Controllers\Api\V1\FeedbackController;
use App\Http\Controllers\Api\V1\HistoryController;
use App\Http\Controllers\Api\V1\LeaderboardController;
use App\Http\Controllers\Api\V1\QuestionController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes (prefix otomatis: /api)
|--------------------------------------------------------------------------
| Semua endpoint ScoreMate berada di bawah grup versi /v1 → /api/v1/...
| Sesuai dokumentasi 03-api-spec.md.
*/

Route::prefix('v1')->group(function () {

    // Health check sederhana untuk memastikan API hidup.
    Route::get('/ping', fn () => response()->json([
        'status'  => 'success',
        'message' => 'ScoreMate API aktif',
    ]));

    // --- Endpoint publik (tanpa autentikasi) ---
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    // --- Endpoint terproteksi (butuh token Sanctum) ---
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);

        // Fitur 2 - Latihan Soal
        Route::get('/questions', [QuestionController::class, 'index']);
        Route::post('/questions/answer', [QuestionController::class, 'answer']);

        // Fitur 3 - AI Feedback (OpenAI)
        Route::post('/feedback', [FeedbackController::class, 'store']);

        // Fitur 4 - Dashboard
        Route::get('/dashboard', [DashboardController::class, 'index']);

        // Fitur 5 - Simulasi Ujian
        Route::post('/exam/start', [ExamController::class, 'start']);
        Route::post('/exam/submit', [ExamController::class, 'submit']);

        // Fitur 6 - Riwayat
        Route::get('/history', [HistoryController::class, 'index']);

        // Fitur 7 - Leaderboard
        Route::get('/leaderboard', [LeaderboardController::class, 'index']);
    });
});
