<?php

declare(strict_types=1);

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;

use App\Models\UserAccount;
use App\Models\UserAccountStatus;
use App\Models\Role;

uses(RefreshDatabase::class);

const SERVICE_ROUTE = '/api/service';

/** Helper: autentica por Sanctum */
function authAsServiceAdmin(): void {
    $role   = Role::factory()->create();
    $status = UserAccountStatus::factory()->create();
    $user = UserAccount::create([
        'role_id'       => $role->role_id,
        'email'         => 'admin'.uniqid().'@aspy.com',
        'password_hash' => Hash::make('secret'),
        'status'        => $status->status_id ?? 1,
    ]);
    Sanctum::actingAs($user);
}

/**
 * TC29 — Nombre Servicio "Ecografía" (válida) => Servicio agregado correctamente
 * Único expected: 201
 */
test('TC29 Servicio — Nombre "Terapia Ansiedad" válido => Servicio agregado correctamente (201)', function () {
    authAsServiceAdmin();

    $res = $this->postJson(SERVICE_ROUTE, [
        'name'  => 'Terapia para la Ansiedad',
        'price' => 50.00,
    ]);

    if ($res->status() !== 201) { $res->dump(); }

    expect($res->status(), 'Body: '.$res->getContent())->toBe(201);
});

/**
 * TC30 — Nombre Servicio vacío (inválida) => Error: campo obligatorio
 * Único expected: 422
 */
test('TC30 Servicio — Nombre vacío => Error por campo obligatorio (422)', function () {
    authAsServiceAdmin();

    $res = $this->postJson(SERVICE_ROUTE, [
        'name'  => '',       // required|string => debe fallar
        'price' => 50.00,
    ]);

    if ($res->status() !== 422) { $res->dump(); }

    expect($res->status(), 'Body: '.$res->getContent())->toBe(422);
});


/**
 * TC31 — Precio 50.00 (válida) => Precio válido aceptado
 * Único expected: 201
 */
test('TC31 Servicio — Precio 50.00 válido => Aceptado (201)', function () {
    authAsServiceAdmin();

    $res = $this->postJson(SERVICE_ROUTE, [
        'name'  => 'Consulta general '.uniqid(), // para no chocar con unique:name
        'price' => 50.00,
    ]);

    if ($res->status() !== 201) { $res->dump(); }

    expect($res->status(), 'Body: '.$res->getContent())->toBe(201);
});
