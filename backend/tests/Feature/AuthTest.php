<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_dapat_registrasi(): void
    {
        $response = $this->postJson('/api/v1/register', [
            'name' => 'Ahmad Faiz',
            'email' => 'faiz@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertCreated()
            ->assertJson(['status' => 'success', 'message' => 'Registrasi berhasil'])
            ->assertJsonStructure(['data' => ['user' => ['id', 'name', 'email'], 'token']]);

        $this->assertDatabaseHas('users', ['email' => 'faiz@example.com']);
    }

    public function test_registrasi_gagal_jika_email_sudah_ada(): void
    {
        User::factory()->create(['email' => 'dup@example.com']);

        $response = $this->postJson('/api/v1/register', [
            'name' => 'Dup',
            'email' => 'dup@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(422)->assertJson(['status' => 'error']);
    }

    public function test_user_dapat_login(): void
    {
        User::factory()->create([
            'email' => 'login@example.com',
            'password' => Hash::make('password123'),
        ]);

        $response = $this->postJson('/api/v1/login', [
            'email' => 'login@example.com',
            'password' => 'password123',
        ]);

        $response->assertOk()
            ->assertJson(['status' => 'success', 'message' => 'Login berhasil'])
            ->assertJsonStructure(['data' => ['user', 'token']]);
    }

    public function test_login_gagal_dengan_password_salah(): void
    {
        User::factory()->create([
            'email' => 'wrong@example.com',
            'password' => Hash::make('password123'),
        ]);

        $response = $this->postJson('/api/v1/login', [
            'email' => 'wrong@example.com',
            'password' => 'salah-password',
        ]);

        $response->assertStatus(401)
            ->assertJson(['status' => 'error', 'message' => 'Email atau password salah']);
    }
}
