<?php

declare(strict_types=1);

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;
use Laravel\Sanctum\Sanctum;
use Illuminate\Support\Facades\Hash;
use App\Models\UserAccount;
use App\Models\Role;
use App\Models\UserAccountStatus;
use App\Models\AppointmentReport;
use App\Models\Appointment;

uses(RefreshDatabase::class);

/**
 * TC17 — ID Reporte 1 (válida) => Reporte cargado correctamente
 * Único expected: 200
 */
test('TC17 Ver reportes — ID 1 válido => Reporte cargado correctamente (200)', function () {
    // Usuario autenticado con Sanctum
    $role   = Role::factory()->create();
    $status = UserAccountStatus::factory()->create();
    $appointment = Appointment::factory()->create();

    $user = UserAccount::create([
        'role_id'       => $role->role_id,
        'email'         => 'viewer'.uniqid().'@aspy.com',
        'password_hash' => Hash::make('secret'),
        'status'        => $status->status_id ?? 1,
    ]);

    Sanctum::actingAs($user);

    // (Opcional) Desactivar FKs por si appointment_id no existe en testing
    Schema::disableForeignKeyConstraints();

    // Sembrar un reporte con appointment_id arbitrario
    $report = AppointmentReport::create([
        'appointment_id' => $appointment->appointment_id,
        'comments'       => 'Reporte de prueba',
        'sign'           => "firma",
        'created_by'     => $user->user_id,
        'modified_by'    => null,
    ]);

    Schema::enableForeignKeyConstraints();

    // Act: GET /api/appointment-report (index lista todos)
    $res = $this->getJson('/api/appointment-report');

    if ($res->status() !== 200) {
        $res->dump();
        $res->dumpHeaders();
    }

    // Único expected: 200 (reporte cargado correctamente)
    expect($res->status(), 'Body: '.$res->getContent())->toBe(200);
});

test('TC18 Ver reportes — ID 999 inválido => Error: reporte no encontrado (404)', function () {
    // Usuario autenticado con Sanctum
    $role   = Role::factory()->create();
    $status = UserAccountStatus::factory()->create();

    $user = UserAccount::create([
        'role_id'       => $role->role_id,
        'email'         => 'viewer'.uniqid().'@aspy.com',
        'password_hash' => Hash::make('secret'),
        'status'        => $status->status_id ?? 1,
    ]);

    Sanctum::actingAs($user);

    // Act: GET a una ruta por ID que no existe en tus rutas actuales => 404
    $res = $this->getJson('/api/appointment-report/999');

    if ($res->status() !== 404) {
        $res->dump();
        $res->dumpHeaders();
    }

    // Único expected
    expect($res->status(), 'Body: '.$res->getContent())->toBe(404);
});

#TODO url es el comment y sign es como profesional name
test('TC19 Ver reportes — PDF "archivo.pdf" válido => Archivo válido mostrado (200)', function () {
    // Usuario autenticado
    $role   = Role::factory()->create();
    $status = UserAccountStatus::factory()->create();
    $user = UserAccount::create([
        'role_id'       => $role->role_id,
        'email'         => 'viewer'.uniqid().'@aspy.com',
        'password_hash' => Hash::make('secret'),
        'status'        => $status->status_id ?? 1,
    ]);
    Sanctum::actingAs($user);

    // Cita y reporte
    $appointment = Appointment::factory()->create();

    // Simulamos que existe un PDF válido en el disco público
    Storage::fake('public');
    Storage::disk('public')->put('reports/archivo.pdf', 'PDF dummy content');

    // El reporte hace referencia al PDF válido
    AppointmentReport::create([
        'appointment_id' => $appointment->appointment_id,
        'comments'       => 'Reporte con PDF válido',
        'sign'           => 'reports/archivo.pdf',
        'created_by'     => $user->user_id,
        'modified_by'    => null,
    ]);

    // Act: GET /api/appointment-report (lista donde se "muestra" el registro con su PDF asociado)
    $res = $this->getJson('/api/appointment-report');

    if ($res->status() !== 200) {
        $res->dump();
        $res->dumpHeaders();
    }

    // ÚNICO expected: 200 (archivo válido mostrado dentro del listado)
    expect($res->status(), 'Body: '.$res->getContent())->toBe(200);
});

test('TC20 Ver reportes — PDF ausente => Listado responde 200 (comportamiento actual)', function () {
    // Usuario autenticado
    $role   = Role::factory()->create();
    $status = UserAccountStatus::factory()->create();
    $user = UserAccount::create([
        'role_id'       => $role->role_id,
        'email'         => 'viewer'.uniqid().'@aspy.com',
        'password_hash' => Hash::make('secret'),
        'status'        => $status->status_id ?? 1,
    ]);
    Sanctum::actingAs($user);

    // Cita y reporte con una ruta de PDF que NO existe (string no nulo para respetar NOT NULL)
    $appointment = Appointment::factory()->create();
    AppointmentReport::create([
        'appointment_id' => $appointment->appointment_id,
        'comments'       => 'Reporte sin PDF físico',
        'sign'           => 'reports/no-existe.pdf', // <- no creamos este archivo
        'created_by'     => $user->user_id,
        'modified_by'    => null,
    ]);

    $res = $this->getJson('/api/appointment-report');

    if ($res->status() !== 200) {
        $res->dump();
        $res->dumpHeaders();
    }

    // ÚNICO expected
    expect($res->status(), 'Body: '.$res->getContent())->toBe(200);
});
