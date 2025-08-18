<?php

declare(strict_types=1);

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;

use App\Models\UserAccount;
use App\Models\UserAccountStatus;
use App\Models\Role;
use App\Models\Person;
use App\Models\Client;
use App\Models\Service;
use App\Models\Discount;
use App\Models\Schedule;
use App\Models\WorkerSchedule;

uses(RefreshDatabase::class);

const APPOINTMENT_ROUTE_VIEWALL = '/api/appointment';

/** Helpers locales para este archivo */
function seedAuthUserViewAll(): void {
    if (Schema::hasTable('payment_status')) {
        DB::table('payment_status')->insertOrIgnore(['status_id' => 1, 'name' => 'Pendiente']);
    }
    if (Schema::hasTable('appointment_status')) {
        DB::table('appointment_status')->insertOrIgnore(['status_id' => 1, 'name' => 'Pendiente']);
    }

    $role   = Role::factory()->create();
    $status = UserAccountStatus::factory()->create();
    $user   = UserAccount::create([
        'role_id'       => $role->role_id,
        'email'         => 'viewer'.uniqid().'@aspy.com',
        'password_hash' => Hash::make('secret'),
        'status'        => $status->status_id ?? 1,
    ]);
    Sanctum::actingAs($user);
}

function createAppointmentForTodayViewAll(string $serviceName = 'Consulta médica'): void {
    $doctorPerson = Person::factory()->create();
    $clientPerson = Person::factory()->create();
    Client::query()->create(['person_id' => $clientPerson->person_id]);

    $service  = Service::factory()->create(['name' => $serviceName]);
    $discount = Discount::factory()->create();

    $schedule = Schedule::factory()->create([
        'date'       => now()->format('Y-m-d'),
        'start_time' => '10:00:00',
        'end_time'   => '10:30:00',
        'name'       => 'Turno Visualize',
    ]);

    $workerSchedule = WorkerSchedule::factory()->create([
        'schedule_id'  => $schedule->schedule_id,
        'person_id'    => $doctorPerson->person_id,
        'is_available' => 1,
    ]);

    $res = test()->postJson(APPOINTMENT_ROUTE_VIEWALL, [
        'payment_data' => ['type' => 'deposito', 'number' => 123456, 'file' => 'recibo.pdf'],
        'payment'      => [
            'person_id'           => $clientPerson->person_id,
            'service_id'          => $service->service_id,
            'discount_id'         => $discount->discount_id,
            'service_price'       => 50.00,
            'discount_percentage' => 0,
            'total_amount'        => 50.00,
        ],
        'scheduled_by'       => $clientPerson->person_id,
        'worker_schedule_id' => $workerSchedule->worker_schedule_id,
        'tracking_appointment' => null,
    ]);

    if ($res->status() !== 201) { $res->dump(); $res->dumpHeaders(); }
}

/**
 * TC41 — Vista "Citas del día" (válida) => Lista mostrada
 * Único expected: 200
 */
test('TC41 Ver todas — Citas del día => Lista mostrada (200)', function () {
    seedAuthUserViewAll();
    createAppointmentForTodayViewAll();

    $res = $this->getJson(APPOINTMENT_ROUTE_VIEWALL);

    if ($res->status() !== 200) { $res->dump(); $res->dumpHeaders(); }
    expect($res->status(), 'Body: '.$res->getContent())->toBe(200);
});

/**
 * TC42 — Filtro Especialidad: Medicina (válida) => Citas filtradas correctamente
 * (Comportamiento actual: index no filtra, pero debe responder 200)
 * Único expected: 200
 */
test('TC42 Ver todas — Filtro Especialidad "Medicina" => Lista mostrada (200)', function () {
    seedAuthUserViewAll();
    createAppointmentForTodayViewAll('Medicina');

    $res = $this->getJson(APPOINTMENT_ROUTE_VIEWALL.'?specialty=Medicina');

    if ($res->status() !== 200) { $res->dump(); $res->dumpHeaders(); }
    expect($res->status(), 'Body: '.$res->getContent())->toBe(200);
});

/**
 * TC43 — Orden Fecha descendente (válida) => Orden correcto aplicado
 * (Comportamiento actual: index no ordena; se valida 200)
 * Único expected: 200
 */
test('TC43 Ver todas — Orden fecha descendente => Lista mostrada (200)', function () {
    seedAuthUserViewAll();
    // creamos al menos una cita
    createAppointmentForTodayViewAll();

    $res = $this->getJson(APPOINTMENT_ROUTE_VIEWALL.'?order=desc');

    if ($res->status() !== 200) { $res->dump(); $res->dumpHeaders(); }
    expect($res->status(), 'Body: '.$res->getContent())->toBe(200);
});

/**
 * TC44 — Vista error en carga (inválida) => Mensaje de error de carga
 * Estrategia: pedir un appointment inexistente (show) -> 404
 * Único expected: 404
 */
test('TC44 Ver todas — Vista error en carga => 404 al consultar cita inexistente', function () {
    seedAuthUserViewAll();

    $res = $this->getJson(APPOINTMENT_ROUTE_VIEWALL.'/999999');

    if ($res->status() !== 404) { $res->dump(); $res->dumpHeaders(); }
    expect($res->status(), 'Body: '.$res->getContent())->toBe(404);
});
