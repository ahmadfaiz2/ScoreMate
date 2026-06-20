<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\AnswerRequest;
use App\Models\PracticeAnswer;
use App\Models\PracticeSession;
use App\Models\Question;
use App\Support\ScoreCalculator;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class QuestionController extends Controller
{
    use ApiResponse;

    private const CATEGORIES = ['reading', 'listening', 'writing'];

    // Poin per jawaban benar (sesuai 03-api-spec.md).
    private const POINTS_PER_CORRECT = 10;

    /**
     * GET /questions?category=reading
     * Daftar soal per kategori (tanpa membocorkan correct_answer).
     */
    public function index(Request $request): JsonResponse
    {
        $category = $request->query('category');

        if (! in_array($category, self::CATEGORIES, true)) {
            return $this->errorResponse('Kategori tidak ditemukan', 404);
        }

        $questions = Question::where('category', $category)
            ->get(['id', 'question', 'options', 'type']);

        return $this->successResponse([
            'category'  => $category,
            'questions' => $questions,
        ]);
    }

    /**
     * POST /questions/answer
     * Cek jawaban satu soal, simpan ke sesi latihan harian, balikan hasilnya.
     */
    public function answer(AnswerRequest $request): JsonResponse
    {
        $question = Question::findOrFail($request->question_id);

        $isCorrect = $this->checkAnswer($question, $request->answer);

        $session = $this->currentPracticeSession($request->user()->id, $question->category);

        // updateOrCreate agar menjawab ulang soal yang sama tidak menggandakan baris.
        PracticeAnswer::updateOrCreate(
            [
                'practice_session_id' => $session->id,
                'question_id'         => $question->id,
            ],
            [
                'user_answer' => $request->answer,
                'is_correct'  => $isCorrect,
            ]
        );

        $this->recalculateSession($session);

        return $this->successResponse([
            'is_correct'     => $isCorrect,
            'correct_answer' => $question->correct_answer,
            'score'          => $isCorrect ? self::POINTS_PER_CORRECT : 0,
        ]);
    }

    /**
     * Bandingkan jawaban user dengan kunci (case-insensitive, abaikan spasi tepi).
     */
    private function checkAnswer(Question $question, string $answer): bool
    {
        if ($question->correct_answer === null) {
            return false; // soal essay/writing tidak dinilai di endpoint ini
        }

        return strcasecmp(trim($answer), trim($question->correct_answer)) === 0;
    }

    /**
     * Ambil (atau buat) sesi latihan user untuk kategori ini pada hari ini.
     */
    private function currentPracticeSession(int $userId, string $category): PracticeSession
    {
        return PracticeSession::whereDate('created_at', today())
            ->where('user_id', $userId)
            ->where('category', $category)
            ->first()
            ?? PracticeSession::create([
                'user_id'  => $userId,
                'category' => $category,
            ]);
    }

    /**
     * Hitung ulang ringkasan sesi dari daftar jawabannya.
     */
    private function recalculateSession(PracticeSession $session): void
    {
        $total   = $session->answers()->count();
        $correct = $session->answers()->where('is_correct', true)->count();

        $session->update([
            'total_questions' => $total,
            'correct_answers' => $correct,
            'score'           => ScoreCalculator::percentage($correct, $total),
        ]);
    }
}
