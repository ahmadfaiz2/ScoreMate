<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\ExamSession;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LeaderboardController extends Controller
{
    use ApiResponse;

    /**
     * GET /leaderboard
     * Peringkat user berdasarkan skor ujian tertinggi masing-masing.
     */
    public function index(Request $request): JsonResponse
    {
        // Skor terbaik per user dari ujian yang selesai.
        $bestScores = ExamSession::where('status', 'completed')
            ->selectRaw('user_id, MAX(total_score) as score')
            ->groupBy('user_id')
            ->orderByDesc('score')
            ->get();

        $names = User::whereIn('id', $bestScores->pluck('user_id'))
            ->pluck('name', 'id');

        $leaderboard = $bestScores->values()->map(fn ($row, $i) => [
            'rank'  => $i + 1,
            'name'  => $names[$row->user_id] ?? 'Unknown',
            'score' => (int) $row->score,
        ]);

        // Posisi user yang sedang login (null jika belum pernah ikut ujian).
        $myIndex = $bestScores->search(
            fn ($row) => (int) $row->user_id === $request->user()->id
        );

        return $this->successResponse([
            'my_rank'     => $myIndex === false ? null : $myIndex + 1,
            'leaderboard' => $leaderboard,
        ]);
    }
}
