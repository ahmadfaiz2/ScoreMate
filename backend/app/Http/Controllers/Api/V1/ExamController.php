<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\ExamSubmitRequest;
use App\Models\ExamAnswer;
use App\Models\ExamSession;
use App\Models\Question;
use App\Support\ScoreCalculator;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ExamController extends Controller
{
    use ApiResponse;

    private const CATEGORIES = ['reading', 'listening', 'writing'];

    private const DURATION_MINUTES = 60;

    /**
     * POST /exam/start
     * Mulai sesi simulasi ujian baru + kembalikan soal (pilihan ganda).
     */
    public function start(Request $request): JsonResponse
    {
        $questions = Question::where('type', 'multiple_choice')
            ->inRandomOrder()
            ->get(['id', 'category', 'question', 'options']);

        if ($questions->isEmpty()) {
            return $this->errorResponse('Gagal memulai simulasi ujian', 422);
        }

        $exam = ExamSession::create([
            'user_id'         => $request->user()->id,
            'status'          => 'ongoing',
            'total_questions' => $questions->count(),
            'started_at'      => now(),
        ]);

        return $this->successResponse([
            'exam_id'          => $exam->id,
            'duration_minutes' => self::DURATION_MINUTES,
            'questions'        => $questions,
        ]);
    }

    /**
     * POST /exam/submit
     * Terima jawaban, hitung skor total & per kategori, simpan hasil.
     */
    public function submit(ExamSubmitRequest $request): JsonResponse
    {
        $exam = ExamSession::where('id', $request->exam_id)
            ->where('user_id', $request->user()->id)
            ->where('status', 'ongoing')
            ->first();

        if (! $exam) {
            return $this->errorResponse('Sesi ujian tidak ditemukan atau sudah berakhir', 404);
        }

        // Kunci jawaban untuk soal yang dijawab.
        $questionIds = collect($request->answers)->pluck('question_id');
        $questions   = Question::whereIn('id', $questionIds)->get()->keyBy('id');

        $perCategory = array_fill_keys(self::CATEGORIES, ['correct' => 0, 'total' => 0]);
        $totalCorrect = 0;

        foreach ($request->answers as $item) {
            $question = $questions->get($item['question_id']);
            if (! $question) {
                continue;
            }

            $isCorrect = $question->correct_answer !== null
                && strcasecmp(trim($item['answer']), trim($question->correct_answer)) === 0;

            ExamAnswer::updateOrCreate(
                ['exam_session_id' => $exam->id, 'question_id' => $question->id],
                ['user_answer' => $item['answer'], 'is_correct' => $isCorrect]
            );

            $perCategory[$question->category]['total']++;
            if ($isCorrect) {
                $perCategory[$question->category]['correct']++;
                $totalCorrect++;
            }
        }

        $scoreByCategory = [];
        foreach (self::CATEGORIES as $cat) {
            $scoreByCategory[$cat] = ScoreCalculator::percentage(
                $perCategory[$cat]['correct'],
                $perCategory[$cat]['total']
            );
        }

        $totalQuestions = $exam->total_questions ?: count($request->answers);
        $totalScore     = ScoreCalculator::percentage($totalCorrect, $totalQuestions);

        $exam->update([
            'status'          => 'completed',
            'correct_answers' => $totalCorrect,
            'total_score'     => $totalScore,
            'reading_score'   => $scoreByCategory['reading'],
            'listening_score' => $scoreByCategory['listening'],
            'writing_score'   => $scoreByCategory['writing'],
            'completed_at'    => now(),
        ]);

        return $this->successResponse([
            'exam_id'          => $exam->id,
            'total_score'      => $totalScore,
            'score_by_category' => $scoreByCategory,
            'correct_answers'  => $totalCorrect,
            'total_questions'  => $totalQuestions,
        ]);
    }
}
