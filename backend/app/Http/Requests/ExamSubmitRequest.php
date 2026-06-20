<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ExamSubmitRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Validasi submit simulasi ujian.
     */
    public function rules(): array
    {
        return [
            'exam_id'              => ['required', 'integer'],
            'answers'             => ['required', 'array', 'min:1'],
            'answers.*.question_id' => ['required', 'integer', 'exists:questions,id'],
            'answers.*.answer'      => ['required', 'string'],
        ];
    }
}
