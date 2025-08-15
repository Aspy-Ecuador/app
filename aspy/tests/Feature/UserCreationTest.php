<?php

declare(strict_types=1);

use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\Role;
use App\Models\State;
use App\Models\UserAccountStatus;

uses(RefreshDatabase::class);

test('TC09 Registrar nuevo usuario — Cédula 0912345678 (válida) => Registro exitoso', function () {
    $this->withoutExceptionHandling();
    $role = Role::factory()->create();
    $status = UserAccountStatus::factory()->create();

    $payload = [
        'role_id'        => $role->role_id,
        'email'          => 'newuser'.uniqid().'@aspy.com',
        'password'       => 'Secret123!',
        'first_name'     => 'Ana',
        'last_name'      => 'Pérez',
        'birthdate'      => '2000-01-01',
        'gender'         => 1,
        'occupation'     => 1,
        'marital_status' => 1,
        'education'      => 1,
        'person_type'    => 'client',
        'cedula'         => '0912345678',
    ];

    $res = $this->postJson('/api/user-account/', $payload);

    if ($res->status() !== 201) {
        $res->dump();        
        $res->dumpHeaders();  
    }

    expect(
        $res->status(),
        'Body: '.$res->getContent()
    )->toBe(201);
});

test('TC10 Registrar nuevo usuario — Cédula vacía => Registro exitoso (comportamiento actual)', function () {
    $this->withoutExceptionHandling();

    $role = Role::factory()->create();
    $status = UserAccountStatus::factory()->create();

    $payload = [
        'role_id'        => $role->role_id,
        'email'          => 'newuser'.uniqid().'@aspy.com',
        'password'       => 'Secret123!',
        'first_name'     => 'Ana',
        'last_name'      => 'Pérez',
        'birthdate'      => '2000-01-01',
        'gender'         => 1,
        'occupation'     => 1,
        'marital_status' => 1,
        'education'      => 1,
        'person_type'    => 'client',
        // cedula omitida
    ];

    $res = $this->postJson('/api/user-account/', $payload);

    expect($res->status(), 'Body: '.$res->getContent())->toBe(201);
});

test('TC11 Registrar nuevo usuario — first_name "Ana Pérez" (válido) => Se registra sin errores', function () {
    $this->withoutExceptionHandling();

    $role = Role::factory()->create();
    $status = UserAccountStatus::factory()->create();

    $payload = [
        'role_id'        => $role->role_id,
        'email'          => 'newuser'.uniqid().'@aspy.com',
        'password'       => 'Secret123!',
        'first_name'     => 'Ana Pérez', // nombre válido
        'last_name'      => 'Pérez',
        'birthdate'      => '2000-01-01',
        'gender'         => 1,
        'occupation'     => 1,
        'marital_status' => 1,
        'education'      => 1,
        'person_type'    => 'client',
    ];

    $res = $this->postJson('/api/user-account/', $payload);

    // Único expected: registro exitoso
    expect($res->status(), 'Body: '.$res->getContent())->toBe(201);
});

test('TC12 Registrar nuevo usuario — first_name "@@@" (comportamiento actual) => Se registra sin errores (201)', function () {
    $this->withoutExceptionHandling();

    $role = Role::factory()->create();
    $status = UserAccountStatus::factory()->create();

    $payload = [
        'role_id'        => $role->role_id,
        'email'          => 'newuser'.uniqid().'@aspy.com',
        'password'       => 'Secret123!',
        'first_name'     => '@@@', // con las reglas actuales es válido (required|string)
        'last_name'      => 'Pérez',
        'birthdate'      => '2000-01-01',
        'gender'         => 1,
        'occupation'     => 1,
        'marital_status' => 1,
        'education'      => 1,
        'person_type'    => 'client',
    ];

    $res = $this->postJson('/api/user-account/', $payload);

    // Único expected: registro exitoso (201) con el comportamiento actual del validador
    expect($res->status(), 'Body: '.$res->getContent())->toBe(201);
});