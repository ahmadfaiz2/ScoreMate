<?php

namespace App\Providers;

use App\Contracts\AiFeedbackContract;
use App\Services\OpenAiService;
use Illuminate\Support\ServiceProvider;

/**
 * Menyambungkan kontrak AI feedback ke implementasinya melalui Service Container.
 *
 * Saat ada yang meminta AiFeedbackContract, Container akan menyediakan OpenAiService.
 * Untuk mengganti penyedia AI (mis. Gemini), cukup ubah binding di sini.
 */
class AiServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(AiFeedbackContract::class, OpenAiService::class);
    }

    public function boot(): void
    {
        //
    }
}
