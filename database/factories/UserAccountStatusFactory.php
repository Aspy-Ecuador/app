<?php

namespace Database\Factories;

use App\Models\UserAccountStatus;
use Illuminate\Database\Eloquent\Factories\Factory;

class UserAccountStatusFactory extends Factory
{
    protected $model = UserAccountStatus::class;

    public function definition(): array
    {
        return [
            // this is auto increment status id
            'name' => $this->faker->randomElement(['active', 'inactive', 'pending']),
        ];
    }
} 