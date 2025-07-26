<?php

namespace Database\Factories;

use App\Models\Discount;
use Illuminate\Database\Eloquent\Factories\Factory;

class DiscountFactory extends Factory
{
    protected $model = Discount::class;

    public function definition(): array
    {
        return [
            // this is auto increment discount id
            'name' => $this->faker->words(2, true),
            'discount' => $this->faker->randomFloat(2, 1, 50),
            'created_by' => 'factory',
            'modified_by' => null,
            'creation_date' => now(),
            'modification_date' => null,
        ];
    }
} 