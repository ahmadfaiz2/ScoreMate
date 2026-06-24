<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\ExamAnswer;
use App\Models\ExamSession;
use App\Models\PracticeAnswer;
use App\Models\PracticeSession;
use App\Models\Question;
use App\Support\ScoreCalculator;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;

class DashboardController extends Controller
{
    use ApiResponse;

    /**
     * GET /dashboard
     * Ringkasan progress belajar user (gabungan latihan + ujian).
     */
    public function index(Request $request): JsonResponse
    {
        $userId = $request->user()->id;

        // Semua jawaban user (latihan + ujian) beserta kategori soalnya.
        $practiceAnswers = PracticeAnswer::whereHas('session', fn ($q) => $q->where('user_id', $userId))
            ->with('question:id,category')
            ->get(['id', 'question_id', 'is_correct']);

        $examAnswers = ExamAnswer::whereHas('session', fn ($q) => $q->where('user_id', $userId))
            ->with('question:id,category')
            ->get(['id', 'question_id', 'is_correct']);

        $allAnswers = $practiceAnswers->concat($examAnswers);

        $total   = $allAnswers->count();
        $correct = $allAnswers->where('is_correct', true)->count();

        return $this->successResponse([
            'total_questions_answered' => $total,
            'average_score'            => ScoreCalculator::percentage($correct, $total),
            'score_by_category'        => $this->scoreByCategory($allAnswers),
            'score_history'            => $this->scoreHistory($userId),
        ]);
    }

    /**
     * Persentase jawaban benar per kategori.
     */
    private function scoreByCategory(Collection $answers): array
    {
        $result = [];

        foreach (Question::CATEGORIES as $category) {
            $inCategory = $answers->filter(fn ($a) => $a->question?->category === $category);
            $count      = $inCategory->count();
            $correct    = $inCategory->where('is_correct', true)->count();

            $result[$category] = ScoreCalculator::percentage($correct, $count);
        }

        return $result;
    }

    /**
     * Riwayat skor dari waktu ke waktu (latihan + ujian) untuk grafik.
     */
    private function scoreHistory(int $userId): array
    {
        $practice = PracticeSession::where('user_id', $userId)
            ->get(['score', 'created_at'])
            ->map(fn ($s) => [
                'date'  => $s->created_at->toDateString(),
                'score' => $s->score,
            ]);

        $exam = ExamSession::where('user_id', $userId)
            ->completed()
            ->get(['total_score', 'created_at'])
            ->map(fn ($s) => [
                'date'  => $s->created_at->toDateString(),
                'score' => $s->total_score,
            ]);

        return $practice->concat($exam)
            ->sortBy('date')
            ->values()
            ->all();
    }
}
