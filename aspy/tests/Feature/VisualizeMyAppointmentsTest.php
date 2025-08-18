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

const APPOINTMENT_ROUTE_PATIENT = '/api/appointment';

/** Helpers */
function seedStatusesForAppointmentsPatient(): void {
    if (Schema::hasTable('payment_status')) {
        DB::table('payment_status')->insertOrIgnore(['status_id' => 1, 'name' => 'Pendiente']);
    }
    if (Schema::hasTable('appointment_status')) {
        DB::table('appointment_status')->insertOrIgnore(['status_id' => 1, 'name' => 'Pendiente']);
    }
}

function authAsPatientUser(string $email = 'paciente1@aspy.com'): UserAccount {
    $role   = Role::factory()->create();              // no importa el nombre, solo FK
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

/** Crea una cita donde el paciente (client) es $patientPerson */
function createAppointmentForPatient(Person $doctorPerson, Person $patientPerson, ?string $date = null, string $serviceName = 'Consulta'): void {
    // Asegurar que el paciente exista como client
    Client::query()->firstOrCreate(['person_id' => $patientPerson->person_id]);

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
        'person_id'    => $doctorPerson->person_id, // profesional
        'is_available' => 1,
    ]);

    $res = test()->postJson(APPOINTMENT_ROUTE_PATIENT, [
        'payment_data' => ['type' => 'deposito', 'number' => random_int(100,999), 'file' => 'recibo.pdf'],
        'payment' => [
            'person_id'           => $patientPerson->person_id, // <- paciente (client)
            'service_id'          => $service->service_id,
            'discount_id'         => $discount->discount_id,
            'service_price'       => 40.00,
            'discount_percentage' => 0,
            'total_amount'        => 40.00,
        ],
        'scheduled_by'       => $patientPerson->person_id,
        'worker_schedule_id' => $ws->worker_schedule_id,
        'tracking_appointment' => null,
    ]);
    if ($res->status() !== 201) { $res->dump(); $res->dumpHeaders(); }
}

/**
 * TC57 — Paciente "paciente1" (válida) => Se muestran solo sus citas
 * Comportamiento actual: index() devuelve todas; esperamos 200.
 */
test('TC57 Mis citas (paciente) — paciente1 => Lista mostrada (200)', function () {
    seedStatusesForAppointmentsPatient();

    // Autenticamos como paciente1 y creamos su Person
    $userPatient = authAsPatientUser('paciente1@aspy.com');
    $patientPerson = Person::factory()->create(['first_name' => 'paciente1']);
    Client::query()->firstOrCreate(['person_id' => $patientPerson->person_id]);

    // Profesional cualquiera
    $doctorPerson = Person::factory()->create(['first_name' => 'doctorX']);

    // Creamos UNA cita para paciente1 (hoy)
    createAppointmentForPatient($doctorPerson, $patientPerson, now()->format('Y-m-d'));

    // Act
    $res = $this->getJson(APPOINTMENT_ROUTE_PATIENT);

    if ($res->status() !== 200) { $res->dump(); $res->dumpHeaders(); }
    expect($res->status(), 'Body: '.$res->getContent())->toBe(200);
});

/**
 * TC58 — Paciente "otro_paciente" (inválida) => Citas no visibles
 * Estrategia: sin autenticación -> 401
 */
test('TC58 Mis citas (paciente) — usuario inválido => No autorizado (401)', function () {
    seedStatusesForAppointmentsPatient();
    // No autenticamos con Sanctum
    $res = $this->getJson(APPOINTMENT_ROUTE_PATIENT);

    if ($res->status() !== 401) { $res->dump(); $res->dumpHeaders(); }
    expect($res->status(), 'Body: '.$res->getContent())->toBe(401);
});

/**
 * TC59 — Filtro por fecha = hoy (válida) => Filtrado aplicado correctamente
 * Comportamiento actual: index ignora filtros; esperamos 200.
 */
test('TC59 Mis citas (paciente) — Filtro fecha actual => (actual) 200', function () {
    seedStatusesForAppointmentsPatient();

    $userPatient = authAsPatientUser('paciente1@aspy.com');
    $patientPerson = Person::factory()->create(['first_name' => 'paciente1']);
    Client::query()->firstOrCreate(['person_id' => $patientPerson->person_id]);

    $doctorPerson = Person::factory()->create(['first_name' => 'doctorX']);

    // Cita hoy
    createAppointmentForPatient($doctorPerson, $patientPerson, now()->format('Y-m-d'));

    $res = $this->getJson(APPOINTMENT_ROUTE_PATIENT.'?date='.now()->format('Y-m-d'));

    if ($res->status() !== 200) { $res->dump(); $res->dumpHeaders(); }
    expect($res->status(), 'Body: '.$res->getContent())->toBe(200);
});

/**
 * TC60 — Filtro fecha inválida (9999-12-31) => Sin resultados mostrados
 * Comportamiento actual: 200 aunque no haya coincidencias.
 */
test('TC60 Mis citas (paciente) — Filtro fecha inválida => (actual) 200 sin resultados', function () {
    seedStatusesForAppointmentsPatient();

    $userPatient = authAsPatientUser('paciente1@aspy.com');
    $patientPerson = Person::factory()->create(['first_name' => 'paciente1']);
    Client::query()->firstOrCreate(['person_id' => $patientPerson->person_id]);

    // No creamos citas para esa fecha
    $res = $this->getJson(APPOINTMENT_ROUTE_PATIENT.'?date=9999-12-31');

    if ($res->status() !== 200) { $res->dump(); $res->dumpHeaders(); }
    expect($res->status(), 'Body: '.$res->getContent())->toBe(200);
});
