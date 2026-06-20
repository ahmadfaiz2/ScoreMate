<?php

namespace App\Support;

/**
 * Logika perhitungan skor terpusat agar konsisten & mudah diuji.
 */
class ScoreCalculator
{
    /**
     * Persentase jawaban benar (0-100, dibulatkan).
     */
    public static function percentage(int $correct, int $total): int
    {
        if ($total <= 0) {
            return 0;
        }

        return (int) round($correct / $total * 100);
    }
}
