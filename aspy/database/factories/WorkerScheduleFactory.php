<?php

namespace Database\Factories;

use App\Models\WorkerSchedule;
use App\Models\Schedule;
use App\Models\Person;
use Illuminate\Database\Eloquent\Factories\Factory;

class WorkerScheduleFactory extends Factory
{
    protected $model = WorkerSchedule::class;

    public function definition(): array
    {
        return [
            // this is auto increment worker schedule id
            'schedule_id' => Schedule::factory(),
            'person_id' => Person::factory(),
            'is_available' => $this->faker->boolean(80),
            'created_by' => 'factory',
            'modified_by' => null,
            'creation_date' => now(),
            'modification_date' => null,
        ];
    }
} 