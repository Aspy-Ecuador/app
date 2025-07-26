<?php

namespace Database\Factories;

use App\Models\Professional;
use App\Models\Person;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProfessionalFactory extends Factory
{
    protected $model = Professional::class;

    public function definition(): array
    {
        return [
            'person_id' => Person::factory(),
            'specialty' => $this->faker->randomElement(['Cardiologia', 'Neurologia', 'Pediatria', 'Ginecologia']),
            'title' => $this->faker->randomElement(['Medico', 'Doctor', 'Especialista']),
            'about' => $this->faker->paragraph(),
            'created_by' => 'factory',
            'modified_by' => null,
            'creation_date' => now(),
            'modification_date' => null,
        ];
    }
} 