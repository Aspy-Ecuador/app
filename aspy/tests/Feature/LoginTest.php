<?php

declare(strict_types=1);

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use App\Models\Role;
use App\Models\UserAccount;
use App\Models\UserAccountStatus;

uses(RefreshDatabase::class);

// Ajusta esta ruta si tu login es otro (p.ej. '/api/login' o '/login')
const LOGIN_ROUTE = '/api/login';

/**
 * TC13 — Login con email válido (doc1@aspy.com) y password válida => Ingreso exitoso (200)
 * Único expected: 200
 */
test('TC13 Login — Email válido "doc1@aspy.com" => Ingreso exitoso (200)', function () {
    $this->withoutExceptionHandling();

    // Prep: crear rol/estado si tu esquema tiene FKs y un usuario con password 'doc1'
    $role   = Role::factory()->create();
    $status = UserAccountStatus::factory()->create(); // por si tu tabla user_account.status referencia esta tabla

    UserAccount::create([
        'role_id'       => $role->role_id,
        'email'         => 'doc1@aspy.com',
        'password_hash' => Hash::make('doc1'),
        'status'        => $status->status_id ?? 1,
    ]);

    // Act
    $res = $this->postJson(LOGIN_ROUTE, [
        'email'    => 'doc1@aspy.com',
        'password' => 'doc1',
    ]);

    // Debug opcional si no es 200
    if ($res->status() !== 200) {
        $res->dump();
        $res->dumpHeaders();
    }

    // ÚNICO expected
    expect($res->status(), 'Body: '.$res->getContent())->toBe(200);
});

test('TC14 Login — Email inválido "doc1aspy.com" => Error de formato (422)', function () {

    $res = $this->postJson(LOGIN_ROUTE, [
        'email'    => 'doc1aspy.com', // sin '@'
        'password' => 'cualquier',
    ]);

    if ($res->status() !== 422) {
        $res->dump();
        $res->dumpHeaders();
    }

    expect($res->status(), 'Body: '.$res->getContent())->toBe(422);
});

test('TC15 Login — Password válida "doc1" => Ingreso exitoso (200)', function () {
    $this->withoutExceptionHandling();

    $role   = Role::factory()->create();
    $status = UserAccountStatus::factory()->create();

    UserAccount::create([
        'role_id'       => $role->role_id,
        'email'         => 'usuario@aspy.com',
        'password_hash' => Hash::make('doc1'),
        'status'        => $status->status_id ?? 1,
    ]);

    $res = $this->postJson(LOGIN_ROUTE, [
        'email'    => 'usuario@aspy.com',
        'password' => 'doc1',
    ]);

    if ($res->status() !== 200) {
        $res->dump();
        $res->dumpHeaders();
    }

    expect($res->status(), 'Body: '.$res->getContent())->toBe(200);
});

test('TC16 Login — Password vacía => Error por campo vacío (422)', function () {
    // No usamos withoutExceptionHandling para que la ValidationException se convierta en 422

    $res = $this->postJson(LOGIN_ROUTE, [
        'email'    => 'doc1@aspy.com',
        'password' => '', // vacía
    ]);

    if ($res->status() !== 422) {
        $res->dump();
        $res->dumpHeaders();
    }

    expect($res->status(), 'Body: '.$res->getContent())->toBe(422);
});