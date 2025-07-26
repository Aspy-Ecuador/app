<?php

namespace Database\Factories;

use App\Models\Appointment;
use App\Models\Payment;
use App\Models\Person;
use App\Models\WorkerSchedule;
use App\Models\AppointmentStatus;
use Illuminate\Database\Eloquent\Factories\Factory;

class AppointmentFactory extends Factory
{
    protected $model = Appointment::class;

    public function definition(): array
    {
        return [
            // this is auto increment appointment id
            'payment_id' => Payment::factory(),
            'scheduled_by' => Person::factory(),
            'worker_schedule_id' => WorkerSchedule::factory(),
            'tracking_appointment' => null,
            'status' => AppointmentStatus::factory(),
            'created_by' => 'factory',
            'modified_by' => null,
            'creation_date' => now(),
            'modification_date' => null,
        ];
    }
} 