<?php

namespace Database\Factories;

use App\Models\Staff;
use App\Models\Person;
use Illuminate\Database\Eloquent\Factories\Factory;

class StaffFactory extends Factory
{
    protected $model = Staff::class;

    public function definition(): array
    {
        return [
            'person_id' => Person::factory(),
            'created_by' => 'factory',
            'modified_by' => null,
            'creation_date' => now(),
            'modification_date' => null,
        ];
    }
} 