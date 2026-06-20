<?php

namespace App\Facades;

use App\Contracts\AiFeedbackContract;
use Illuminate\Support\Facades\Facade;

/**
 * Facade untuk layanan AI feedback.
 *
 * Memungkinkan pemanggilan singkat: AiFeedback::review($question, $answer).
 * Di belakang layar, Container meneruskannya ke implementasi AiFeedbackContract.
 *
 * @method static array review(string $question, string $answer)
 *
 * @see \App\Contracts\AiFeedbackContract
 */
class AiFeedback extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return AiFeedbackContract::class;
    }
}
