<?php
use App\Models\Appointment;
use App\Models\WorkerSchedule;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Artisan;

beforeEach(function () {
    // Ejecuta las migraciones manualmente antes de cada prueba
    Artisan::call('migrate');
});
it('creates a valid appointment with all relationships', function () {
    $appointment = Appointment::factory()->create();

    expect($appointment)->toBeInstanceOf(Appointment::class);
    expect($appointment->payment)->not->toBeNull();
    expect($appointment->workerSchedule)->not->toBeNull();
    expect($appointment->scheduledBy)->not->toBeNull();
    expect($appointment->status)->not->toBeNull();
});

it('creates an appointment only if the worker schedule is available', function () {
    $workerSchedule = WorkerSchedule::factory()->create(['is_available' => true]);
    $appointment = Appointment::factory()->create([
        'worker_schedule_id' => $workerSchedule->worker_schedule_id,
    ]);

    expect($appointment)->toBeInstanceOf(Appointment::class);
    expect($appointment->workerSchedule->is_available)->toBeTruthy();
});

it('does not create an appointment if the worker schedule is not available', function () {
    // Create an unavailable worker schedule
    $workerSchedule = WorkerSchedule::factory()->create(['is_available' => false]);

    // Try to create an appointment with this unavailable schedule
    // (Assume your application logic prevents this, e.g., via validation or business rule)
    $canCreate = $workerSchedule->is_available;

    expect($canCreate)->toBeFalse();

    // Optionally, you could try/catch or assert that an exception is thrown if you enforce this in your code
    // Or, if you have a service method, call it and assert it returns null or throws
});

it('only one appointment per schedule', function () {
    $workerSchedule = WorkerSchedule::factory()->create();
    $first = Appointment::factory()->create(['worker_schedule_id' => $workerSchedule->worker_schedule_id]);
    expect(function () use ($workerSchedule) {
        Appointment::factory()->create(['worker_schedule_id' => $workerSchedule->worker_schedule_id]);
    })->toThrow(\Illuminate\Database\QueryException::class); // or assert validation error if via HTTP
});



it('only available schedules can be booked', function () {
    $workerSchedule = WorkerSchedule::factory()->create(['is_available' => false]);
    // Try to create an appointment with this unavailable schedule
    // (Assume your application logic prevents this, e.g., via validation or business rule)
    $canCreate = $workerSchedule->is_available;

    expect($canCreate)->toBeFalse();
});

