<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class FeedbackRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Validasi permintaan AI feedback untuk jawaban writing.
     */
    public function rules(): array
    {
        return [
            'question_id' => ['required', 'integer', 'exists:questions,id'],
            'answer'      => ['required', 'string', 'min:10'],
        ];
    }

    public function messages(): array
    {
        return [
            'question_id.exists' => 'Soal tidak ditemukan',
            'answer.min'         => 'Jawaban terlalu pendek untuk dinilai',
        ];
    }
}
