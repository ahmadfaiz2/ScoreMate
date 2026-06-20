<?php

namespace Database\Seeders;

use App\Models\Question;
use Illuminate\Database\Seeder;

class QuestionSeeder extends Seeder
{
    /**
     * Mengisi bank soal TOEFL contoh untuk setiap kategori.
     */
    public function run(): void
    {
        $questions = [
            // ---------------- READING (multiple_choice) ----------------
            [
                'category' => 'reading',
                'type' => 'multiple_choice',
                'question' => 'Read the sentence: "The committee postponed the meeting because several key members were unavailable." What does "postponed" most nearly mean?',
                'options' => ['Cancelled', 'Delayed', 'Attended', 'Shortened'],
                'correct_answer' => 'Delayed',
            ],
            [
                'category' => 'reading',
                'type' => 'multiple_choice',
                'question' => 'Choose the word closest in meaning to "abundant": "The region has abundant natural resources."',
                'options' => ['Scarce', 'Plentiful', 'Hidden', 'Costly'],
                'correct_answer' => 'Plentiful',
            ],
            [
                'category' => 'reading',
                'type' => 'multiple_choice',
                'question' => 'In the passage, the author primarily aims to ______ the reader.',
                'options' => ['Persuade', 'Confuse', 'Insult', 'Ignore'],
                'correct_answer' => 'Persuade',
            ],
            [
                'category' => 'reading',
                'type' => 'multiple_choice',
                'question' => 'What is the antonym of "expand"?',
                'options' => ['Grow', 'Stretch', 'Contract', 'Enlarge'],
                'correct_answer' => 'Contract',
            ],

            // ---------------- LISTENING (multiple_choice) ----------------
            [
                'category' => 'listening',
                'type' => 'multiple_choice',
                'question' => '(Audio) The professor says the assignment is due on Friday. When is the assignment due?',
                'options' => ['Monday', 'Wednesday', 'Friday', 'Sunday'],
                'correct_answer' => 'Friday',
            ],
            [
                'category' => 'listening',
                'type' => 'multiple_choice',
                'question' => '(Audio) Two students discuss where to study. Where do they decide to go?',
                'options' => ['The library', 'The cafeteria', 'The dormitory', 'The park'],
                'correct_answer' => 'The library',
            ],
            [
                'category' => 'listening',
                'type' => 'multiple_choice',
                'question' => '(Audio) What is the main topic of the lecture?',
                'options' => ['Climate change', 'Ancient history', 'Cell biology', 'Modern art'],
                'correct_answer' => 'Cell biology',
            ],
            [
                'category' => 'listening',
                'type' => 'multiple_choice',
                'question' => '(Audio) Why is the student visiting the professor?',
                'options' => ['To request an extension', 'To return a book', 'To pay a fee', 'To join a club'],
                'correct_answer' => 'To request an extension',
            ],

            // ---------------- WRITING (essay) ----------------
            [
                'category' => 'writing',
                'type' => 'essay',
                'question' => 'Some people prefer to study alone, while others prefer to study in groups. Which do you prefer? Use specific reasons and examples to support your answer. (Write at least 150 words)',
                'options' => null,
                'correct_answer' => null,
            ],
            [
                'category' => 'writing',
                'type' => 'essay',
                'question' => 'Do you agree or disagree with the following statement? "Technology has made people less social." Use specific reasons and examples to support your opinion. (Write at least 150 words)',
                'options' => null,
                'correct_answer' => null,
            ],
        ];

        foreach ($questions as $q) {
            Question::create($q);
        }
    }
}
