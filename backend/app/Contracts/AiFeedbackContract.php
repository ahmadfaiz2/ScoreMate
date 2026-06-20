<?php

namespace App\Contracts;

/**
 * Kontrak layanan AI feedback.
 *
 * Mendefinisikan "janji" yang harus dipenuhi oleh service apa pun
 * (OpenAI, Gemini, dll). Controller hanya bergantung pada kontrak ini,
 * bukan pada implementasi konkretnya.
 */
interface AiFeedbackContract
{
    /**
     * Menilai jawaban writing dan mengembalikan feedback.
     *
     * @return array{
     *     score_estimation: int,
     *     grammar_feedback: string,
     *     suggestions: string,
     *     corrected_answer: string
     * }
     */
    public function review(string $question, string $answer): array;
}
