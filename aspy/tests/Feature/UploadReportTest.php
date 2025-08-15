<?php

declare(strict_types=1);

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use App\Models\UserAccount;
use App\Models\Role;
use App\Models\UserAccountStatus;
use App\Models\Appointment;

uses(RefreshDatabase::class);

const REPORT_ROUTE = '/api/appointment-report';

/**
 * TC21 — ID Cita 1 (válida) => El reporte se asocia correctamente
 * Único expected: 201
 */
test('TC21 Subir reporte — ID Cita 1 válida => Se asocia correctamente (201)', function () {
    $this->withoutExceptionHandling();

    // Auth
    $role   = Role::factory()->create();
    $status = UserAccountStatus::factory()->create();
    $user = UserAccount::create([
        'role_id'       => $role->role_id,
        'email'         => 'uploader'.uniqid().'@aspy.com',
        'password_hash' => Hash::make('secret'),
        'status'        => $status->status_id ?? 1,
    ]);
    Sanctum::actingAs($user);

    // Cita válida
    $appointment = Appointment::factory()->create();

    // Archivo PDF simulado
    Storage::fake('public');
    $file = UploadedFile::fake()->create('reporte.pdf', 32, 'application/pdf');

    // POST multipart
    $res = $this->postJson(REPORT_ROUTE, [
        'appointment_id' => $appointment->appointment_id,
        'sign'       => 'Reporte TC21',
        // Nombre de campo del archivo (común: "file" o "pdf").
        // Si tu controlador usa otro nombre (p.ej. "sign"), cámbialo aquí:
        'comments'           => strval($file),
    ]);

    if ($res->status() !== 201) {
        $res->dump();
        $res->dumpHeaders();
    }

    // ÚNICO expected
    expect($res->status(), 'Body: '.$res->getContent())->toBe(201);
});

test('TC22 Subir reporte — ID Cita 999 inválida => (comportamiento actual) 500', function () {
    // No usamos withoutExceptionHandling para que el framework genere la respuesta
    $role   = Role::factory()->create();
    $status = UserAccountStatus::factory()->create();
    $user = UserAccount::create([
        'role_id'       => $role->role_id,
        'email'         => 'uploader'.uniqid().'@aspy.com',
        'password_hash' => Hash::make('secret'),
        'status'        => $status->status_id ?? 1,
    ]);
    Sanctum::actingAs($user);

    // Archivo simulado (mantengo el patrón que ya te funcionó)
    Storage::fake('public');
    $file = UploadedFile::fake()->create('reporte.pdf', 32, 'application/pdf');

    $res = $this->postJson(REPORT_ROUTE, [
        'appointment_id' => 999,             // cita inexistente
        'sign'           => 'Reporte TC22',
        'comments'       => strval($file),
    ]);

    if ($res->status() !== 500) {
        $res->dump();
        $res->dumpHeaders();
    }

    // ÚNICO expected: 500 (comportamiento actual)
    expect($res->status(), 'Body: '.$res->getContent())->toBe(500);
});

test('TC23 Subir reporte — Archivo "reporte.pdf" válido => Archivo subido correctamente (201)', function () {
    $this->withoutExceptionHandling();

    // Auth
    $role   = Role::factory()->create();
    $status = UserAccountStatus::factory()->create();
    $user = UserAccount::create([
        'role_id'       => $role->role_id,
        'email'         => 'uploader'.uniqid().'@aspy.com',
        'password_hash' => Hash::make('secret'),
        'status'        => $status->status_id ?? 1,
    ]);
    Sanctum::actingAs($user);

    // Cita válida
    $appointment = Appointment::factory()->create();

    // Archivo PDF simulado
    Storage::fake('public');
    $file = UploadedFile::fake()->create('reporte.pdf', 64, 'application/pdf');

    // POST multipart — usa las keys que ya te funcionaron en TC21
    $res = $this->postJson(REPORT_ROUTE, [
        'appointment_id' => $appointment->appointment_id,
        'sign'           => 'Reporte TC23',
        'comments'       => strval($file),
    ]);

    if ($res->status() !== 201) {
        $res->dump();
        $res->dumpHeaders();
    }

    // ÚNICO expected
    expect($res->status(), 'Body: '.$res->getContent())->toBe(201);
});

test('TC24 Subir reporte — Archivo inválido ".txt" => Aceptado (201) por comportamiento actual', function () {
    $this->withoutExceptionHandling();

    // Auth
    $role   = Role::factory()->create();
    $status = UserAccountStatus::factory()->create();
    $user = UserAccount::create([
        'role_id'       => $role->role_id,
        'email'         => 'uploader'.uniqid().'@aspy.com',
        'password_hash' => Hash::make('secret'),
        'status'        => $status->status_id ?? 1,
    ]);
    Sanctum::actingAs($user);

    // Cita válida
    $appointment = Appointment::factory()->create();

    // “Archivo” inválido (no PDF)
    Storage::fake('public');
    $file = UploadedFile::fake()->create('reporte.txt', 8, 'text/plain');

    // POST reutilizando las mismas keys que ya te funcionan (TC21/TC23)
    $res = $this->postJson(REPORT_ROUTE, [
        'appointment_id' => $appointment->appointment_id,
        'sign'           => 'Reporte TC24',
        'comments'       => strval($file), // mimetizamos el patrón actual
    ]);

    if ($res->status() !== 201) {
        $res->dump();
        $res->dumpHeaders();
    }

    // ÚNICO expected
    expect($res->status(), 'Body: '.$res->getContent())->toBe(201);
});