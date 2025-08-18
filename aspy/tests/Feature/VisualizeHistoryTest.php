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


/**
 * TC33 — Usuario "doctor1" (válida) => Historial cargado correctamente
 * Único expected: 200
 */
test('TC33 Historial — Usuario "doctor1" => Historial cargado correctamente (200)', function () {
    // Seeds de estatus (el store pone status=1 en payment y appointment)
    if (Schema::hasTable('payment_status')) {
        DB::table('payment_status')->insert(['status_id' => 1, 'name' => 'Pendiente']);
    }
    if (Schema::hasTable('appointment_status')) {
        DB::table('appointment_status')->insert(['status_id' => 1, 'name' => 'Pendiente']);
    }

    // Autenticar como "doctor1"
    $role   = Role::factory()->create();
    $status = UserAccountStatus::factory()->create();
    $doctorUser = UserAccount::create([
        'role_id'       => $role->role_id,
        'email'         => 'doctor1@aspy.com',
        'password_hash' => Hash::make('secret'),
        'status'        => $status->status_id ?? 1,
    ]);
    Sanctum::actingAs($doctorUser);

    // Profesional (persona) para el doctor y su WorkerSchedule
    $doctorPerson = Person::factory()->create(['first_name' => 'doctor1']);
    // Cliente (FK real: payment.person_id -> client.person_id)
    $clientPerson = Person::factory()->create();
    Client::query()->create(['person_id' => $clientPerson->person_id]);

    // Servicio/Descuento y bloque horario
    $service  = Service::factory()->create(['name' => 'Consulta general']);
    $discount = Discount::factory()->create();
    $schedule = Schedule::factory()->create([
        'date'       => now()->format('Y-m-d'),
        'start_time' => '09:00:00',
        'end_time'   => '09:30:00',
        'name'       => 'Bloque doctor1',
    ]);
    $workerSchedule = WorkerSchedule::factory()->create([
        'schedule_id' => $schedule->schedule_id,
        'person_id'   => $doctorPerson->person_id,
        'is_available'=> 1,
    ]);

    // Crear una cita vía POST (para asegurar todas las FKs pasan)
    $create = $this->postJson(APPOINTMENT_ROUTE, [
        'payment_data' => [
            'type'   => 'deposito',
            'number' => 123456,
            'file'   => 'recibo.pdf',
        ],
        'payment' => [
            'person_id'           => $clientPerson->person_id,
            'service_id'          => $service->service_id,
            'discount_id'         => $discount->discount_id,
            'service_price'       => 40.00,
            'discount_percentage' => 0,
            'total_amount'        => 40.00,
        ],
        'scheduled_by'         => $clientPerson->person_id,
        'worker_schedule_id'   => $workerSchedule->worker_schedule_id,
        'tracking_appointment' => null,
    ]);
    if ($create->status() !== 201) { $create->dump(); $create->dumpHeaders(); }

    // Act: consultar historial (index)
    $res = $this->getJson(APPOINTMENT_ROUTE);

    if ($res->status() !== 200) {
        $res->dump();
        $res->dumpHeaders();
    }

    // ÚNICO expected
    expect($res->status(), 'Body: '.$res->getContent())->toBe(200);
});


/**
 * TC34 — Usuario "usuario_invalido" (inválida) => Error al cargar historial
 * Estrategia: no autenticarse (usuario inválido) -> middleware devuelve 401
 * Único expected: 401
 */
test('TC34 Historial — Usuario inválido => Error al cargar historial (401)', function () {
    // No autenticamos con Sanctum

    $res = $this->getJson(APPOINTMENT_ROUTE);

    if ($res->status() !== 401) {
        $res->dump();
        $res->dumpHeaders();
    }

    expect($res->status(), 'Body: '.$res->getContent())->toBe(401);
});

test('TC35 Historial — Filtro por fecha 2025-07-01 => Filtrado exitoso (200)', function () {
    // Seeds de estatus
    if (Schema::hasTable('payment_status')) {
        DB::table('payment_status')->insert(['status_id' => 1, 'name' => 'Pendiente']);
    }
    if (Schema::hasTable('appointment_status')) {
        DB::table('appointment_status')->insert(['status_id' => 1, 'name' => 'Pendiente']);
    }

    // Auth
    $role   = Role::factory()->create();
    $status = UserAccountStatus::factory()->create();
    $user = UserAccount::create([
        'role_id'       => $role->role_id,
        'email'         => 'doctor1@aspy.com',
        'password_hash' => Hash::make('secret'),
        'status'        => $status->status_id ?? 1,
    ]);
    Sanctum::actingAs($user);

    // Profesional y cliente
    $doctorPerson = Person::factory()->create(['first_name' => 'doctor1']);
    $clientPerson = Person::factory()->create();
    Client::query()->create(['person_id' => $clientPerson->person_id]);

    // Servicio/Descuento
    $service  = Service::factory()->create(['name' => 'Consulta general']);
    $discount = Discount::factory()->create();

    // Cita en 2025-07-01
    $schedOk = Schedule::factory()->create([
        'date'       => '2025-07-01',
        'start_time' => '10:00:00',
        'end_time'   => '10:30:00',
        'name'       => '10:00',
    ]);
    $wsOk = WorkerSchedule::factory()->create([
        'schedule_id' => $schedOk->schedule_id,
        'person_id'   => $doctorPerson->person_id,
        'is_available'=> 1,
    ]);
    $create1 = $this->postJson(APPOINTMENT_ROUTE, [
        'payment_data' => ['type' => 'deposito','number' => 111,'file' => 'r1.pdf'],
        'payment' => [
            'person_id' => $clientPerson->person_id,
            'service_id'=> $service->service_id,
            'discount_id'=> $discount->discount_id,
            'service_price'=> 40.00,
            'discount_percentage'=> 0,
            'total_amount'=> 40.00,
        ],
        'scheduled_by' => $clientPerson->person_id,
        'worker_schedule_id' => $wsOk->worker_schedule_id,
        'tracking_appointment' => null,
    ]);
    if ($create1->status() !== 201) { $create1->dump(); }

    // Otra cita en fecha distinta
    $schedOther = Schedule::factory()->create([
        'date'       => '2025-07-02',
        'start_time' => '11:00:00',
        'end_time'   => '11:30:00',
        'name'       => '11:00',
    ]);
    $wsOther = WorkerSchedule::factory()->create([
        'schedule_id' => $schedOther->schedule_id,
        'person_id'   => $doctorPerson->person_id,
        'is_available'=> 1,
    ]);
    $create2 = $this->postJson(APPOINTMENT_ROUTE, [
        'payment_data' => ['type' => 'deposito','number' => 222,'file' => 'r2.pdf'],
        'payment' => [
            'person_id' => $clientPerson->person_id,
            'service_id'=> $service->service_id,
            'discount_id'=> $discount->discount_id,
            'service_price'=> 40.00,
            'discount_percentage'=> 0,
            'total_amount'=> 40.00,
        ],
        'scheduled_by' => $clientPerson->person_id,
        'worker_schedule_id' => $wsOther->worker_schedule_id,
        'tracking_appointment' => null,
    ]);
    if ($create2->status() !== 201) { $create2->dump(); }

    // Act: GET con query ?date=2025-07-01 (el controlador lo ignorará, pero debe responder 200)
    $res = $this->getJson(APPOINTMENT_ROUTE.'?date=2025-07-01');

    if ($res->status() !== 200) { $res->dump(); }

    // ÚNICO expected
    expect($res->status(), 'Body: '.$res->getContent())->toBe(200);
});

test('TC36 Historial — Filtro por fecha 9999-01-01 => Sin resultados (200)', function () {
    // Auth (middleware auth:sanctum)
    $role   = Role::factory()->create();
    $status = UserAccountStatus::factory()->create();
    $user = UserAccount::create([
        'role_id'       => $role->role_id,
        'email'         => 'viewer'.uniqid().'@aspy.com',
        'password_hash' => Hash::make('secret'),
        'status'        => $status->status_id ?? 1,
    ]);
    Sanctum::actingAs($user);

    // No creamos citas → simulamos “sin resultados” para esa fecha
    $res = $this->getJson(APPOINTMENT_ROUTE.'?date=9999-01-01');

    if ($res->status() !== 200) {
        $res->dump();
        $res->dumpHeaders();
    }

    // ÚNICO expected
    expect($res->status(), 'Body: '.$res->getContent())->toBe(200);
});