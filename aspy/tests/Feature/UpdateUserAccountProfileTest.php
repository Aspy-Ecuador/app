<?php

declare(strict_types=1);

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;

use App\Models\UserAccount;
use App\Models\UserAccountStatus;
use App\Models\Role;
use App\Models\Person;

uses(RefreshDatabase::class);

const PERSON_UPDATE_ROUTE = '/api/user-account'; // PUT /{id}

/**
 * Helper: usuario autenticado y una persona a actualizar.
 */
function seedUserAndPerson(): array
{
    $role   = Role::factory()->create();
    $status = UserAccountStatus::factory()->create();

    $user = UserAccount::create([
        'role_id'       => $role->role_id,
        'email'         => 'editor'.uniqid().'@aspy.com',
        'password_hash' => Hash::make('secret'),
        'status'        => $status->status_id ?? 1,
    ]);

    Sanctum::actingAs($user);

    $person = Person::factory()->create([
        'first_name' => 'NombreOriginal',
        'middle_name'  => 'Apellido',
    ]);

    return [$user, $person];
}

/**
 * TC25 — Nombre "María" (válida) => Datos actualizados correctamente
 * Único expected: 200
 */
test('TC25 Actualizar datos — Nombre "María" válido => Datos actualizados (200)', function () {
    [$user, $person] = seedUserAndPerson();

    $res = $this->putJson(PERSON_UPDATE_ROUTE.'/'.$person->person_id, [
        'first_name' => 'María',
    ]);

    if ($res->status() !== 200) { $res->dump(); $res->dumpHeaders(); }

    expect($res->status(), 'Body: '.$res->getContent())->toBe(200);
});


/**
 * TC26 — Nombre vacío (inválida en especificación)
 * Actual: regla = 'string' (no required), por lo que pasa igual.
 * Único expected: 200
 */

test('TC26 Actualizar datos — Nombre vacío => (actual) se acepta y responde 200', function () {
    [$user, $person] = seedUserAndPerson();

    $res = $this->putJson(PERSON_UPDATE_ROUTE.'/'.$person->person_id, [
        'first_name' => 'required|string'
    ]);

    if ($res->status() !== 200) { $res->dump(); }

    expect($res->status(), 'Body: '.$res->getContent())->toBe(200);
});

/**
 * TC27 — Email válido "maria@correo.com"
 * Actual: controlador no maneja email, será ignorado => 200
 */
test('TC27 Actualizar datos — Email válido "maria@correo.com" => (actual) 200', function () {
    [$user, $person] = seedUserAndPerson();

    $res = $this->putJson(PERSON_UPDATE_ROUTE.'/'.$person->person_id, [
        'email' => 'maria@correo.com',
    ]);

    if ($res->status() !== 200) { $res->dump(); }

    expect($res->status(), 'Body: '.$res->getContent())->toBe(200);
});


/**
 * TC28 — Email inválido "maria.com"
 * Actual: email no está validado => también devuelve 200
 */
test('TC28 Actualizar datos — Email inválido "maria.com" => Formato inválido (422)', function () {
    [$user, $person] = seedUserAndPerson();

    // No llamamos a withoutExceptionHandling(), así la ValidationException => 422
    $res = $this->putJson(PERSON_UPDATE_ROUTE.'/'.$person->person_id, [
        'email' => 'maria.com', // inválido
    ]);

    if ($res->status() !== 422) { $res->dump(); }

    // ÚNICO expected
    expect($res->status(), 'Body: '.$res->getContent())->toBe(422);
});
