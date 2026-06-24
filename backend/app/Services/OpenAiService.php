<?php

namespace App\Services;

use App\Contracts\AiFeedbackContract;
use Illuminate\Support\Facades\Http;
use RuntimeException;

/**
 * Implementasi AiFeedbackContract menggunakan OpenAI Chat Completions API.
 * Memakai Laravel HTTP Client (facade Http) untuk memanggil layanan eksternal.
 */
class OpenAiService implements AiFeedbackContract
{
    public function review(string $question, string $answer): array
    {
        $key = config('services.openai.key');

        if (empty($key)) {
            throw new RuntimeException('OPENAI_API_KEY belum dikonfigurasi.');
        }

        $response = Http::withToken($key)
            ->timeout(60)
            ->acceptJson()
            ->post(rtrim(config('services.openai.url'), '/').'/chat/completions', [
                'model' => config('services.openai.model'),
                'response_format' => ['type' => 'json_object'],
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => $this->systemPrompt(),
                    ],
                    [
                        'role' => 'user',
                        'content' => "TOEFL Writing Question:\n{$question}\n\nStudent's Answer:\n{$answer}",
                    ],
                ],
            ]);

        if ($response->failed()) {
            throw new RuntimeException('Permintaan ke OpenAI gagal: '.$response->status());
        }

        $content = $response->json('choices.0.message.content');
        $data = json_decode((string) $content, true);

        if (! is_array($data)) {
            throw new RuntimeException('Respons OpenAI tidak dapat diproses.');
        }

        return [
            'score_estimation' => (int) ($data['score_estimation'] ?? 0),
            'grammar_feedback' => $this->toText($data['grammar_feedback'] ?? ''),
            'suggestions'      => $this->toText($data['suggestions'] ?? ''),
            'corrected_answer' => $this->toText($data['corrected_answer'] ?? ''),
        ];
    }

    /**
     * Normalisasi nilai dari respons AI menjadi teks.
     * AI kadang mengembalikan array (mis. daftar saran) alih-alih string.
     */
    private function toText(mixed $value): string
    {
        if (! is_array($value)) {
            return (string) $value;
        }

        // Objek asosiatif (mis. {"grammar": "..."}) ditampilkan sebagai JSON rapi.
        if (! array_is_list($value)) {
            return (string) json_encode($value, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        }

        // Daftar (mis. beberapa saran) digabung baris per baris.
        return implode("\n", array_map(
            fn ($item) => is_array($item) ? json_encode($item, JSON_UNESCAPED_UNICODE) : (string) $item,
            $value,
        ));
    }

    /**
     * Instruksi untuk AI agar mengembalikan JSON terstruktur.
     */
    private function systemPrompt(): string
    {
        return <<<'PROMPT'
        You are an expert TOEFL writing examiner. Evaluate the student's answer
        and respond ONLY with a valid JSON object using exactly these keys:
        - "score_estimation": integer 0-100 estimating the TOEFL writing score
        - "grammar_feedback": concise feedback on grammar and mechanics
        - "suggestions": actionable suggestions to improve the writing
        - "corrected_answer": an improved version of the student's answer
        Keep each text field clear and helpful. Do not add any text outside the JSON.
        PROMPT;
    }
}
