<?php

namespace Tests\Unit;

use App\Support\ScoreCalculator;
use PHPUnit\Framework\TestCase;

class ScoreCalculatorTest extends TestCase
{
    public function test_menghitung_persentase_dengan_benar(): void
    {
        $this->assertSame(100, ScoreCalculator::percentage(8, 8));
        $this->assertSame(75, ScoreCalculator::percentage(6, 8));
        $this->assertSame(50, ScoreCalculator::percentage(1, 2));
        $this->assertSame(0, ScoreCalculator::percentage(0, 10));
    }

    public function test_membulatkan_ke_bilangan_bulat_terdekat(): void
    {
        // 2/3 = 66.67 -> 67
        $this->assertSame(67, ScoreCalculator::percentage(2, 3));
        // 1/3 = 33.33 -> 33
        $this->assertSame(33, ScoreCalculator::percentage(1, 3));
    }

    public function test_total_nol_menghasilkan_nol_tanpa_error(): void
    {
        $this->assertSame(0, ScoreCalculator::percentage(0, 0));
        $this->assertSame(0, ScoreCalculator::percentage(5, 0));
    }
}
