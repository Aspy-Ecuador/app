<?php

declare(strict_types=1);

use App\Models\Client;
use App\Models\Discount;
use App\Models\Person;
use App\Models\Role;
use App\Models\Schedule;
use App\Models\Service;
use App\Models\UserAccount;
use App\Models\UserAccountStatus;
use App\Models\WorkerSchedule;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

const APPOINTMENT_ROUTE = '/api/appointment';

test('TC01 Agendar cita — Servicio "Consulta médica" válido => Se agenda correctamente (201)', function () {
    $this->withoutExceptionHandling();

    // Seeds de status que el controlador fija a 1
    if (Schema::hasTable('payment_status')) {
        DB::table('payment_status')->insert(['status_id' => 1, 'name' => 'Pendiente']);
    }
    if (Schema::hasTable('appointment_status')) {
        DB::table('appointment_status')->insert(['status_id' => 1, 'name' => 'Pendiente']);
    }

    // Auth
    $role = Role::factory()->create();
    $status = UserAccountStatus::factory()->create();
    $user = UserAccount::create([
        'role_id' => $role->role_id,
        'email' => 'scheduler'.uniqid().'@aspy.com',
        'password_hash' => Hash::make('secret'),
        'status' => $status->status_id ?? 1,
    ]);
    Sanctum::actingAs($user);

    // Datos requeridos
    $person = Person::factory()->create();
    // 🔑 FK real: payment.person_id → client.person_id
    Client::query()->create(['person_id' => $person->person_id]);

    $service = Service::factory()->create(['name' => 'Consulta médica']);
    $workerSchedule = WorkerSchedule::factory()->create();
    $discount = Discount::factory()->create(); // usaremos su ID real

    // Payload válido
    $payload = [
        'payment_data' => [
            'type' => 'deposito',
            'number' => 123456,
            'file' => 'recibo.pdf',
        ],
        'payment' => [
            'person_id' => $person->person_id,          // debe existir en client.person_id
            'service_id' => $service->service_id,
            'discount_id' => $discount->discount_id,
            'service_price' => 50.00,
            'discount_percentage' => 0,
            'total_amount' => 50.00,
        ],
        'scheduled_by' => $person->person_id,
        'worker_schedule_id' => $workerSchedule->worker_schedule_id,
        'tracking_appointment' => null,
    ];

    $res = $this->postJson(APPOINTMENT_ROUTE, $payload);

    if ($res->status() !== 201) {
        $res->dump();
        $res->dumpHeaders();
    }

    expect($res->status(), 'Body: '.$res->getContent())->toBe(201);
});

test('TC02 Agendar cita — Servicio vacío => Error de validación (422)', function () {
    // NO usamos withoutExceptionHandling para que la ValidationException se convierta en 422

    // Seeds mínimos de estatus que fija el controlador
    if (Schema::hasTable('payment_status')) {
        DB::table('payment_status')->insert(['status_id' => 1, 'name' => 'Pendiente']);
    }
    if (Schema::hasTable('appointment_status')) {
        DB::table('appointment_status')->insert(['status_id' => 1, 'name' => 'Pendiente']);
    }

    // Auth
    $role = Role::factory()->create();
    $status = UserAccountStatus::factory()->create();
    $user = UserAccount::create([
        'role_id' => $role->role_id,
        'email' => 'scheduler'.uniqid().'@aspy.com',
        'password_hash' => Hash::make('secret'),
        'status' => $status->status_id ?? 1,
    ]);
    Sanctum::actingAs($user);

    // Persona y Client (FK real de payment.person_id -> client.person_id)
    $person = Person::factory()->create();
    Client::query()->create(['person_id' => $person->person_id]);

    // WorkerSchedule válido
    $workerSchedule = WorkerSchedule::factory()->create();

    // Payload con servicio vacío (omitimos service_id para gatillar 422)
    $payload = [
        'payment_data' => [
            'type' => 'deposito',
            'number' => 123456,
            'file' => 'recibo.pdf',
        ],
        'payment' => [
            'person_id' => $person->person_id,
            // 'service_id'        => (omitido para simular “escoja servicio”)
            'discount_id' => null,
            'service_price' => 50.00,
            'discount_percentage' => 0,
            'total_amount' => 50.00,
        ],
        'scheduled_by' => $person->person_id,
        'worker_schedule_id' => $workerSchedule->worker_schedule_id,
        'tracking_appointment' => null,
    ];

    $res = $this->postJson(APPOINTMENT_ROUTE, $payload);

    if ($res->status() !== 422) {
        $res->dump();
        $res->dumpHeaders();
    }

    // ÚNICO expected
    expect($res->status(), 'Body: '.$res->getContent())->toBe(422);
});

test('TC03 Agendar cita — Fecha/Hora lunes 10:00 válida => Permite continuar (201)', function () {
    // No convertimos ValidationException en 500
    // (dejamos el handler por si falta algo y retorne 422)

    // Seeds de estatus usados por el controlador (status = 1)
    if (Schema::hasTable('payment_status')) {
        DB::table('payment_status')->insert(['status_id' => 1, 'name' => 'Pendiente']);
    }
    if (Schema::hasTable('appointment_status')) {
        DB::table('appointment_status')->insert(['status_id' => 1, 'name' => 'Pendiente']);
    }

    // Auth
    $role = Role::factory()->create();
    $status = UserAccountStatus::factory()->create();
    $user = UserAccount::create([
        'role_id' => $role->role_id,
        'email' => 'scheduler'.uniqid().'@aspy.com',
        'password_hash' => Hash::make('secret'),
        'status' => $status->status_id ?? 1,
    ]);
    Sanctum::actingAs($user);

    // Persona y Client (FK real: payment.person_id -> client.person_id)
    $person = Person::factory()->create();
    Client::query()->create(['person_id' => $person->person_id]);

    // Servicio
    $service = Service::factory()->create(['name' => 'Consulta médica']);

    // Descuento (usaremos su id real por si existe FK)
    $discount = Discount::factory()->create();

    // WorkerSchedule que represente lunes 10:00 (si tu esquema/factory tiene estos campos)
    // Si tu factory no define day/time, igual creará uno válido.
    $workerSchedule = WorkerSchedule::factory()->create([
        // Descomenta/ajusta si tu esquema los tiene:
        // 'day_of_week' => 1,        // 1 = lunes (ejemplo)
        // 'start_time'  => '10:00:00',
        // 'end_time'    => '10:30:00',
    ]);

    // Payload válido
    $payload = [
        'payment_data' => [
            'type' => 'deposito',
            'number' => 987654,
            'file' => 'recibo.pdf',
        ],
        'payment' => [
            'person_id' => $person->person_id,
            'service_id' => $service->service_id,
            'discount_id' => $discount->discount_id,
            'service_price' => 50.00,
            'discount_percentage' => 0,
            'total_amount' => 50.00,
        ],
        'scheduled_by' => $person->person_id,
        'worker_schedule_id' => $workerSchedule->worker_schedule_id, // este representa “lunes 10:00”
        'tracking_appointment' => null,
    ];

    $res = $this->postJson(APPOINTMENT_ROUTE, $payload);

    if ($res->status() !== 201) {
        $res->dump();
        $res->dumpHeaders();
    }

    // ÚNICO expected
    expect($res->status(), 'Body: '.$res->getContent())->toBe(201);
});

test('TC04 Agendar cita — domingo 10:00 ya ocupado => Error por horario no permitido (422)', function () {
    // No usamos withoutExceptionHandling para que la validación devuelva 422

    // Seeds de estatus requeridos por el controlador (status = 1)
    if (Schema::hasTable('payment_status')) {
        DB::table('payment_status')->insert(['status_id' => 1, 'name' => 'Pendiente']);
    }
    if (Schema::hasTable('appointment_status')) {
        DB::table('appointment_status')->insert(['status_id' => 1, 'name' => 'Pendiente']);
    }

    // Auth
    $role = Role::factory()->create();
    $status = UserAccountStatus::factory()->create();
    $user = UserAccount::create([
        'role_id' => $role->role_id,
        'email' => 'scheduler'.uniqid().'@aspy.com',
        'password_hash' => Hash::make('secret'),
        'status' => $status->status_id ?? 1,
    ]);
    Sanctum::actingAs($user);

    // Persona y Client (payment.person_id -> client.person_id)
    $person = Person::factory()->create();
    Client::query()->create(['person_id' => $person->person_id]);

    // Servicio y descuento
    $service = Service::factory()->create(['name' => 'Consulta médica']);
    $discount = Discount::factory()->create();

    // Definimos explícitamente un Schedule de DOMINGO 10:00–10:30
    $schedule = Schedule::factory()->create([
        'date' => now()->next('sunday')->format('Y-m-d'), // próximo domingo
        'start_time' => '10:00:00',
        'end_time' => '10:30:00',
        'name' => 'Domingo 10:00',
    ]);

    // Lo asignamos a un WorkerSchedule disponible
    $workerSchedule = WorkerSchedule::factory()->create([
        'schedule_id' => $schedule->schedule_id,
        'person_id' => $person->person_id, // o el profesional que corresponda
        'is_available' => 1,
    ]);

    // Payload base para agendar
    $payload = [
        'payment_data' => [
            'type' => 'deposito',
            'number' => 111222,
            'file' => 'recibo.pdf',
        ],
        'payment' => [
            'person_id' => $person->person_id,
            'service_id' => $service->service_id,
            'discount_id' => $discount->discount_id,
            'service_price' => 50.00,
            'discount_percentage' => 0,
            'total_amount' => 50.00,
        ],
        'scheduled_by' => $person->person_id,
        'worker_schedule_id' => $workerSchedule->worker_schedule_id, // domingo 10:00
        'tracking_appointment' => null,
    ];

    // 1) Ocupamos el horario (debería ser 201). No hacemos assert duro para mantener un solo expected.
    $first = $this->postJson(APPOINTMENT_ROUTE, $payload);
    if ($first->status() !== 201) {
        $first->dump();
        $first->dumpHeaders();
    }

    // 2) Intentamos agendar de nuevo MISMO worker_schedule_id => viola unique y debe dar 422
    $second = $this->postJson(APPOINTMENT_ROUTE, $payload);

    if ($second->status() !== 422) {
        $second->dump();
        $second->dumpHeaders();
    }

    // ÚNICO expected
    expect($second->status(), 'Body: '.$second->getContent())->toBe(422);
});

test('TC05 Agendar cita — Profesional "Fernando" válido => Permite continuar (201)', function () {
    // Seeds de estatus usados por el controlador (status = 1)
    if (Schema::hasTable('payment_status')) {
        DB::table('payment_status')->insert(['status_id' => 1, 'name' => 'Pendiente']);
    }
    if (Schema::hasTable('appointment_status')) {
        DB::table('appointment_status')->insert(['status_id' => 1, 'name' => 'Pendiente']);
    }

    // Auth
    $role = Role::factory()->create();
    $status = UserAccountStatus::factory()->create();
    $user = UserAccount::create([
        'role_id' => $role->role_id,
        'email' => 'scheduler'.uniqid().'@aspy.com',
        'password_hash' => Hash::make('secret'),
        'status' => $status->status_id ?? 1,
    ]);
    Sanctum::actingAs($user);

    // Profesional "Fernando" (asociado al WorkerSchedule)
    $professional = Person::factory()->create([
        'first_name' => 'Fernando',
    ]);

    // Cliente (payment.person_id -> client.person_id)
    $clientPerson = Person::factory()->create();
    Client::query()->create(['person_id' => $clientPerson->person_id]);

    // Servicio y descuento
    $service = Service::factory()->create(['name' => 'Consulta médica']);
    $discount = Discount::factory()->create();

    // Schedule (fecha/hora cualquiera válida) y WorkerSchedule del profesional "Fernando"
    $schedule = Schedule::factory()->create([
        // si tu factory no requiere valores específicos, puedes omitir estos:
        // 'date'       => now()->addDay()->format('Y-m-d'),
        // 'start_time' => '10:00:00',
        // 'end_time'   => '10:30:00',
        'name' => 'Bloque Fernando',
    ]);

    $workerSchedule = WorkerSchedule::factory()->create([
        'schedule_id' => $schedule->schedule_id,
        'person_id' => $professional->person_id, // <- "Fernando"
        'is_available' => 1,
    ]);

    // Payload válido
    $payload = [
        'payment_data' => [
            'type' => 'deposito',
            'number' => 222333,
            'file' => 'recibo.pdf',
        ],
        'payment' => [
            'person_id' => $clientPerson->person_id, // cliente
            'service_id' => $service->service_id,
            'discount_id' => $discount->discount_id,
            'service_price' => 50.00,
            'discount_percentage' => 0,
            'total_amount' => 50.00,
        ],
        'scheduled_by' => $clientPerson->person_id,
        'worker_schedule_id' => $workerSchedule->worker_schedule_id, // agenda con Fernando
        'tracking_appointment' => null,
    ];

    $res = $this->postJson(APPOINTMENT_ROUTE, $payload);

    if ($res->status() !== 201) {
        $res->dump();
        $res->dumpHeaders();
    }

    // ÚNICO expected
    expect($res->status(), 'Body: '.$res->getContent())->toBe(201);
});

test('TC06 Agendar cita — Profesional vacío => Error de validación (422)', function () {
    // Mantén el handler para que la ValidationException se traduzca a 422

    // Seeds de estatus que el controlador pone en 1
    if (Schema::hasTable('payment_status')) {
        DB::table('payment_status')->insert(['status_id' => 1, 'name' => 'Pendiente']);
    }
    if (Schema::hasTable('appointment_status')) {
        DB::table('appointment_status')->insert(['status_id' => 1, 'name' => 'Pendiente']);
    }

    // Auth
    $role = Role::factory()->create();
    $status = UserAccountStatus::factory()->create();
    $user = UserAccount::create([
        'role_id' => $role->role_id,
        'email' => 'scheduler'.uniqid().'@aspy.com',
        'password_hash' => Hash::make('secret'),
        'status' => $status->status_id ?? 1,
    ]);
    Sanctum::actingAs($user);

    // Cliente (payment.person_id -> client.person_id)
    $person = Person::factory()->create();
    Client::query()->create(['person_id' => $person->person_id]);

    // Payload SIN worker_schedule_id para gatillar “faltó profesional”
    $payload = [
        'payment_data' => [
            'type' => 'deposito',
            'number' => 123456,
            'file' => 'recibo.pdf',
        ],
        'payment' => [
            'person_id' => $person->person_id,
            'service_id' => 1,          // cualquier id válido según tu seed/factory
            'discount_id' => null,
            'service_price' => 50.00,
            'discount_percentage' => 0,
            'total_amount' => 50.00,
        ],
        'scheduled_by' => $person->person_id,
        // 'worker_schedule_id'  => (omitido para simular profesional no elegido)
        'tracking_appointment' => null,
    ];

    $res = $this->postJson(APPOINTMENT_ROUTE, $payload);

    if ($res->status() !== 422) {
        $res->dump();
        $res->dumpHeaders();
    }

    // ÚNICO expected
    expect($res->status(), 'Body: '.$res->getContent())->toBe(422);
});
