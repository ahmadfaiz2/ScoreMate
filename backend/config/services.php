<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    | Kredensial layanan pihak ketiga. ScoreMate hanya memakai OpenAI
    | untuk fitur AI Feedback (lihat App\Services\OpenAiService).
    */

    'openai' => [
        'key'   => env('OPENAI_API_KEY'),
        'model' => env('OPENAI_MODEL', 'gpt-4o-mini'),
        'url'   => env('OPENAI_URL', 'https://api.openai.com/v1'),
    ],

];
