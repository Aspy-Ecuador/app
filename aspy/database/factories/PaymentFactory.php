<?php

namespace Database\Factories;

use App\Models\Payment;
use App\Models\Client;
use App\Models\Service;
use App\Models\Discount;
use App\Models\PaymentData;
use App\Models\PaymentStatus;
use Illuminate\Database\Eloquent\Factories\Factory;

class PaymentFactory extends Factory
{
    protected $model = Payment::class;

    public function definition(): array
    {
        return [
            // this is auto increment payment id
            'person_id' => Client::factory(),
            'service_id' => Service::factory(),
            'discount_id' => Discount::factory(),
            'payment_data_id' => PaymentData::factory(),
            'service_price' => $this->faker->randomFloat(2, 50, 500),
            'discount_percentage' => $this->faker->randomFloat(2, 0, 50),
            'total_amount' => $this->faker->randomFloat(2, 50, 500),
            'status' => PaymentStatus::factory(),
            'created_by' => 'factory',
            'modified_by' => null,
            'creation_date' => now(),
            'modification_date' => null,
        ];
    }
} 