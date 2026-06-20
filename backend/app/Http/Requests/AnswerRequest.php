<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AnswerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Validasi submit jawaban latihan.
     */
    public function rules(): array
    {
        return [
            'question_id' => ['required', 'integer', 'exists:questions,id'],
            'answer'      => ['required', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'question_id.exists' => 'Soal tidak ditemukan',
        ];
    }
}
