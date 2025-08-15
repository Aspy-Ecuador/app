<?php

namespace Database\Factories;

use App\Models\PaymentData;
use Illuminate\Database\Eloquent\Factories\Factory;

class PaymentDataFactory extends Factory
{
    protected $model = PaymentData::class;

    public function definition(): array
    {
        return [
            // this is auto increment payment data id
            'type' => $this->faker->randomElement(['credit_card', 'debit_card', 'cash', 'transfer']),
            'number' => $this->faker->creditCardNumber(),
            'file' => $this->faker->lexify('file_??????.pdf'),
            'created_by' => 'factory',
            'modified_by' => null,
            'creation_date' => now(),
            'modification_date' => null,
        ];
    }
} 