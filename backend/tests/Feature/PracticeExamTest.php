<?php

namespace Tests\Feature;

use App\Models\Question;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PracticeExamTest extends TestCase
{
    use RefreshDatabase;

    private function authUser(): User
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        return $user;
    }

    public function test_ambil_soal_butuh_autentikasi(): void
    {
        $this->getJson('/api/v1/questions?category=reading')
            ->assertStatus(401);
    }

    public function test_user_dapat_mengambil_soal_per_kategori(): void
    {
        $this->authUser();
        Question::factory()->count(3)->create(['category' => 'reading', 'type' => 'multiple_choice']);

        $this->getJson('/api/v1/questions?category=reading')
            ->assertOk()
            ->assertJsonPath('data.category', 'reading')
            ->assertJsonCount(3, 'data.questions');
    }

    public function test_kategori_tidak_valid_mengembalikan_404(): void
    {
        $this->authUser();

        $this->getJson('/api/v1/questions?category=matematika')
            ->assertStatus(404)
            ->assertJson(['status' => 'error']);
    }

    public function test_submit_jawaban_benar_mendapat_skor(): void
    {
        $this->authUser();
        $q = Question::factory()->create([
            'category' => 'reading',
            'type' => 'multiple_choice',
            'correct_answer' => 'Delayed',
        ]);

        $this->postJson('/api/v1/questions/answer', [
            'question_id' => $q->id,
            'answer' => 'Delayed',
        ])->assertOk()
            ->assertJsonPath('data.is_correct', true)
            ->assertJsonPath('data.score', 10);
    }

    public function test_alur_simulasi_ujian_start_dan_submit(): void
    {
        $this->authUser();
        $q1 = Question::factory()->create(['category' => 'reading', 'type' => 'multiple_choice', 'correct_answer' => 'A']);
        $q2 = Question::factory()->create(['category' => 'listening', 'type' => 'multiple_choice', 'correct_answer' => 'B']);

        $start = $this->postJson('/api/v1/exam/start')->assertOk();
        $examId = $start->json('data.exam_id');

        $this->postJson('/api/v1/exam/submit', [
            'exam_id' => $examId,
            'answers' => [
                ['question_id' => $q1->id, 'answer' => 'A'], // benar
                ['question_id' => $q2->id, 'answer' => 'X'], // salah
            ],
        ])->assertOk()
            ->assertJsonPath('data.correct_answers', 1)
            ->assertJsonPath('data.total_score', 50);
    }
}
