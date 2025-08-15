<?php

namespace Database\Factories;

use App\Models\Person;
use App\Models\UserAccount;
use Illuminate\Database\Eloquent\Factories\Factory;

class PersonFactory extends Factory
{
    protected $model = Person::class;

    public function definition(): array
    {
        return [
            // this is auto increment person id
            'user_id' => UserAccount::factory(),
            'first_name' => $this->faker->firstName(),
            'middle_name' => $this->faker->optional()->firstName(),
            'birthdate' => $this->faker->date('Y-m-d', '-18 years'),
            'gender' => $this->faker->randomElement(['male', 'female', 'other']),
            'occupation' => $this->faker->jobTitle(),
            'marital_status' => $this->faker->randomElement(['single', 'married', 'divorced', 'widowed']),
            'education' => $this->faker->randomElement(['none', 'primary', 'secondary', 'tertiary']),
            'created_by' => 'factory',
            'modified_by' => null,
            'creation_date' => now(),
            'modification_date' => null,
        ];
    }
} 