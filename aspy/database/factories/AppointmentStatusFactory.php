<?php

namespace Database\Factories;

use App\Models\AppointmentStatus;
use Illuminate\Database\Eloquent\Factories\Factory;

class AppointmentStatusFactory extends Factory
{
    protected $model = AppointmentStatus::class;

    public function definition(): array
    {
        return [
            // this is auto increment status id
            'name' => $this->faker->randomElement(['confirmed', 'pending', 'cancelled', 'completed']),
        ];
    }
} 