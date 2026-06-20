<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;

/**
 * Trait untuk menstandarkan format respons API ScoreMate.
 * Semua respons mengikuti struktur { status, message, data } sesuai 03-api-spec.md.
 */
trait ApiResponse
{
    /**
     * Respons sukses.
     */
    protected function successResponse(mixed $data = null, ?string $message = null, int $code = 200): JsonResponse
    {
        $payload = ['status' => 'success'];

        if ($message !== null) {
            $payload['message'] = $message;
        }

        if ($data !== null) {
            $payload['data'] = $data;
        }

        return response()->json($payload, $code);
    }

    /**
     * Respons gagal / error.
     */
    protected function errorResponse(string $message, int $code = 400, mixed $errors = null): JsonResponse
    {
        $payload = [
            'status'  => 'error',
            'message' => $message,
        ];

        if ($errors !== null) {
            $payload['errors'] = $errors;
        }

        return response()->json($payload, $code);
    }
}
