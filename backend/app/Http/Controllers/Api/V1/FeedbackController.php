<?php

namespace App\Http\Controllers\Api\V1;

use App\Facades\AiFeedback;
use App\Http\Controllers\Controller;
use App\Http\Requests\FeedbackRequest;
use App\Models\AiFeedback as AiFeedbackModel;
use App\Models\Question;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Throwable;

class FeedbackController extends Controller
{
    use ApiResponse;

    /**
     * POST /feedback
     * Kirim jawaban writing ke OpenAI (via facade AiFeedback), simpan, kembalikan feedback.
     */
    public function store(FeedbackRequest $request): JsonResponse
    {
        $question = Question::findOrFail($request->question_id);

        try {
            $feedback = AiFeedback::review($question->question, $request->answer);
        } catch (Throwable $e) {
            report($e);

            return $this->errorResponse('Gagal menghubungi layanan AI', 502);
        }

        AiFeedbackModel::create([
            'user_id'          => $request->user()->id,
            'question_id'      => $question->id,
            'user_answer'      => $request->answer,
            'score_estimation' => $feedback['score_estimation'],
            'grammar_feedback' => $feedback['grammar_feedback'],
            'suggestions'      => $feedback['suggestions'],
            'corrected_answer' => $feedback['corrected_answer'],
        ]);

        return $this->successResponse($feedback);
    }
}
