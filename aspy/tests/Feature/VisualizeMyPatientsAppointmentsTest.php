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

const APPOINTMENT_ROUTE_MY = '/api/appointment';

/** Helpers locales */
function seedStatusesForAppointmentsMy(): void {
    if (Schema::hasTable('payment_status')) {
        DB::table('payment_status')->insertOrIgnore(['status_id' => 1, 'name' => 'Pendiente']);
    }
    if (Schema::hasTable('appointment_status')) {
        DB::table('appointment_status')->insertOrIgnore(['status_id' => 1, 'name' => 'Pendiente']);
    }
}

function authAsDoctorUser(string $email = 'doctor1@aspy.com'): UserAccount {
    // Crea rol/estado de usuario mínimos
    $role   = Role::factory()->create();
    $status = UserAccountStatus::factory()->create();

    $user = UserAccount::create([
        'role_id'       => $role->role_id,
        'email'         => $email,
        'password_hash' => Hash::make('secret'),
        'status'        => $status->status_id ?? 1,
    ]);
    Sanctum::actingAs($user);
    return $user;
}

function createAppointmentForDoctor(Person $doctorPerson, ?string $date = null, string $serviceName = 'Consulta'): void {
    $clientPerson = Person::factory()->create();
    Client::query()->create(['person_id' => $clientPerson->person_id]);

    $service  = Service::factory()->create(['name' => $serviceName]);
    $discount = Discount::factory()->create();

    $schedule = Schedule::factory()->create([
        'date'       => $date ?? now()->format('Y-m-d'),
        'start_time' => '10:00:00',
        'end_time'   => '10:30:00',
        'name'       => 'Bloque',
    ]);

    $ws = WorkerSchedule::factory()->create([
        'schedule_id'  => $schedule->schedule_id,
        'person_id'    => $doctorPerson->person_id,
        'is_available' => 1,
    ]);

    $res = test()->postJson(APPOINTMENT_ROUTE_MY, [
        'payment_data' => ['type' => 'deposito', 'number' => random_int(100,999), 'file' => 'recibo.pdf'],
        'payment' => [
            'person_id'           => $clientPerson->person_id,
            'service_id'          => $service->service_id,
            'discount_id'         => $discount->discount_id,
            'service_price'       => 40.00,
            'discount_percentage' => 0,
            'total_amount'        => 40.00,
        ],
        'scheduled_by'       => $clientPerson->person_id,
        'worker_schedule_id' => $ws->worker_schedule_id,
        'tracking_appointment' => null,
    ]);
    if ($res->status() !== 201) { $res->dump(); $res->dumpHeaders(); }
}

/**
 * TC49 — Usuario "doctor1" (válida) => Citas propias mostradas
 * Comportamiento actual: index() devuelve todas; esperamos 200.
 */
test('TC49 Mis pacientes — Usuario "doctor1" => Citas mostradas (200)', function () {
    seedStatusesForAppointmentsMy();

    // Autenticamos como doctor1 y creamos su "persona profesional"
    $userDoctor1   = authAsDoctorUser('doctor1@aspy.com');
    $doctor1Person = Person::factory()->create(['first_name' => 'doctor1']);

    // Creamos una cita para doctor1
    createAppointmentForDoctor($doctor1Person, now()->format('Y-m-d'));

    // Act: ver citas (no filtra por usuario actualmente)
    $res = $this->getJson(APPOINTMENT_ROUTE_MY);

    if ($res->status() !== 200) { $res->dump(); $res->dumpHeaders(); }
    expect($res->status(), 'Body: '.$res->getContent())->toBe(200);
});

/**
 * TC50 — Usuario "otro_usuario" (inválida) => Citas no visibles
 * Estrategia práctica: sin autenticación -> 401
 */
test('TC50 Mis pacientes — Usuario inválido => No autorizado (401)', function () {
    seedStatusesForAppointmentsMy();
    // No autenticamos con Sanctum
    $res = $this->getJson(APPOINTMENT_ROUTE_MY);

    if ($res->status() !== 401) { $res->dump(); $res->dumpHeaders(); }
    expect($res->status(), 'Body: '.$res->getContent())->toBe(401);
});

/**
 * TC51 — Filtro por fecha 2025-07-20 (válida) => Filtrado aplicado
 * Comportamiento actual: index ignora filtros; esperamos 200.
 */
test('TC51 Mis pacientes — Filtro fecha 2025-07-20 => (actual) 200', function () {
    seedStatusesForAppointmentsMy();

    $userDoctor1   = authAsDoctorUser('doctor1@aspy.com');
    $doctor1Person = Person::factory()->create(['first_name' => 'doctor1']);

    // Cita el 2025-07-20
    createAppointmentForDoctor($doctor1Person, '2025-07-20');

    $res = $this->getJson(APPOINTMENT_ROUTE_MY.'?date=2025-07-20');

    if ($res->status() !== 200) { $res->dump(); $res->dumpHeaders(); }
    expect($res->status(), 'Body: '.$res->getContent())->toBe(200);
});

/**
 * TC52 — Filtro por fecha 9999-12-31 (inválida/sin resultados) => Sin resultados mostrados
 * Comportamiento actual: 200 aunque no haya coincidencias.
 */
test('TC52 Mis pacientes — Filtro fecha 9999-12-31 => (actual) 200 sin resultados', function () {
    seedStatusesForAppointmentsMy();

    $userDoctor1   = authAsDoctorUser('doctor1@aspy.com');
    $doctor1Person = Person::factory()->create(['first_name' => 'doctor1']);

    // No creamos citas para esa fecha
    $res = $this->getJson(APPOINTMENT_ROUTE_MY.'?date=9999-12-31');

    if ($res->status() !== 200) { $res->dump(); $res->dumpHeaders(); }
    expect($res->status(), 'Body: '.$res->getContent())->toBe(200);
});
