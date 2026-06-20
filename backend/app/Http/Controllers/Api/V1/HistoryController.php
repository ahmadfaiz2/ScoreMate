<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\ExamSession;
use App\Models\PracticeSession;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class HistoryController extends Controller
{
    use ApiResponse;

    /**
     * GET /history
     * Gabungan riwayat sesi latihan + simulasi ujian milik user (terbaru dulu).
     */
    public function index(Request $request): JsonResponse
    {
        $userId = $request->user()->id;

        $practice = PracticeSession::where('user_id', $userId)
            ->get()
            ->map(fn ($s) => [
                'id'              => $s->id,
                'type'            => 'practice',
                'category'        => $s->category,
                'score'           => $s->score,
                'total_questions' => $s->total_questions,
                'correct_answers' => $s->correct_answers,
                'date'            => $s->created_at->toDateString(),
                'sorted_at'       => $s->created_at,
            ]);

        $exam = ExamSession::where('user_id', $userId)
            ->where('status', 'completed')
            ->get()
            ->map(fn ($s) => [
                'id'              => $s->id,
                'type'            => 'exam',
                'category'        => 'all',
                'score'           => $s->total_score,
                'total_questions' => $s->total_questions,
                'correct_answers' => $s->correct_answers,
                'date'            => $s->created_at->toDateString(),
                'sorted_at'       => $s->created_at,
            ]);

        $history = $practice->concat($exam)
            ->sortByDesc('sorted_at')
            ->map(fn ($item) => collect($item)->except('sorted_at'))
            ->values();

        return $this->successResponse($history);
    }
}
