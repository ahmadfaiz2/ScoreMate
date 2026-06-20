<?php

namespace Database\Factories;

use App\Models\Question;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Question>
 */
class QuestionFactory extends Factory
{
    protected $model = Question::class;

    public function definition(): array
    {
        return [
            'category' => fake()->randomElement(['reading', 'listening', 'writing']),
            'type' => 'multiple_choice',
            'question' => fake()->sentence().'?',
            'options' => ['A', 'B', 'C', 'D'],
            'correct_answer' => 'A',
        ];
    }
}
