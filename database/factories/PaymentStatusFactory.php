<?php

namespace Database\Factories;

use App\Models\PaymentStatus;
use Illuminate\Database\Eloquent\Factories\Factory;

class PaymentStatusFactory extends Factory
{
    protected $model = PaymentStatus::class;

    public function definition(): array
    {
        return [
            // this is auto increment status id
            'name' => $this->faker->randomElement(['Pending', 'Paid', 'Failed']),
        ];
    }
} 