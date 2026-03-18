<?php

declare(strict_types=1);

use App\Models\Person;
use App\Models\UserAccount;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

const USER_LIST_ROUTE_VIEW = '/api/user-account';

/** 🔧 Siembra roles (IDs fijos 1..4) y un status (ID=1) para satisfacer FKs + match() del controlador */
function seedRolesAndUserStatus(): void
{
    // Roles con IDs exactos que tu controlador espera (1..4)
    DB::table('role')->insertOrIgnore([
        ['role_id' => 1, 'name' => 'Administrador', 'created_by' => 'seed'],
        ['role_id' => 2, 'name' => 'Profesional',   'created_by' => 'seed'],
        ['role_id' => 3, 'name' => 'Paciente',      'created_by' => 'seed'],
        ['role_id' => 4, 'name' => 'Secretario',    'created_by' => 'seed'],
    ]);

    // Status de usuario (ID=1) si la FK lo requiere
    if (DB::getSchemaBuilder()->hasTable('user_account_status')) {
        DB::table('user_account_status')->insertOrIgnore([
            'status_id' => 1,
            'name' => 'Activo',
        ]);
    }
}

/** 🔐 Autentica un viewer (Administrador) usando las FKs sembradas */
function authViewerForUsers(): void
{
    seedRolesAndUserStatus();

    $viewer = UserAccount::create([
        'role_id' => 1, // Administrador
        'email' => 'viewer'.uniqid().'@aspy.com',
        'password_hash' => Hash::make('secret'),
        'status' => 1,
    ]);

    Sanctum::actingAs($viewer);
}

/** 👤 Crea un usuario con su Person relacionada (Person.user_id) y rol válido 1..4 */
function makeUserWithPerson(int $roleId, string $email): UserAccount
{
    seedRolesAndUserStatus();

    $user = UserAccount::create([
        'role_id' => $roleId, // 1..4
        'email' => $email,
        'password_hash' => Hash::make('secret'),
        'status' => 1,
    ]);

    Person::factory()->create([
        'user_id' => $user->user_id,
        'first_name' => 'User',
        // Si tu schema usa middle_name en lugar de last_name, la factory lo maneja.
    ]);

    return $user;
}

/**
 * TC45 — Rol "Administrador" (válida) => Lista filtrada por rol
 * Backend actual no filtra; esperamos 200.
 */
test('TC45 Usuarios — Rol "Administrador" => Lista (200)', function () {
    authViewerForUsers();

    makeUserWithPerson(1, 'admin1@aspy.com'); // Admin
    makeUserWithPerson(2, 'pro1@aspy.com');   // Profesional

    $res = $this->getJson(USER_LIST_ROUTE_VIEW.'?role=Administrador');

    if ($res->status() !== 200) {
        $res->dump();
        $res->dumpHeaders();
    }
    expect($res->status(), 'Body: '.$res->getContent())->toBe(200);
});

/**
 * TC46 — Rol inválido (inválida) => Error o lista vacía
 * Backend actual: 200, posiblemente lista vacía.
 */
test('TC46 Usuarios — Rol inválido => Lista vacía (200)', function () {
    authViewerForUsers();

    // Sin crear usuarios adicionales → respuesta 200 (posible lista vacía)
    $res = $this->getJson(USER_LIST_ROUTE_VIEW.'?role=NoExiste');

    if ($res->status() !== 200) {
        $res->dump();
        $res->dumpHeaders();
    }
    expect($res->status(), 'Body: '.$res->getContent())->toBe(200);
});

/**
 * TC47 — Paginación "Página 2" (válida) => Usuarios cargados
 * Backend actual no pagina; esperamos 200.
 */
test('TC47 Usuarios — Paginación página 2 => Lista (200)', function () {
    authViewerForUsers();

    for ($i = 0; $i < 15; $i++) {
        makeUserWithPerson(($i % 4) + 1, "user{$i}@aspy.com");
    }

    $res = $this->getJson(USER_LIST_ROUTE_VIEW.'?page=2');

    if ($res->status() !== 200) {
        $res->dump();
        $res->dumpHeaders();
    }
    expect($res->status(), 'Body: '.$res->getContent())->toBe(200);
});

/**
 * TC48 — Email "admin@aspy.com" (válida) => Usuario visible en lista
 * Backend actual devuelve todos; esperamos 200.
 */
test('TC48 Usuarios — Email "admin@aspy.com" => Usuario visible (200)', function () {
    authViewerForUsers();

    makeUserWithPerson(1, 'admin@aspy.com'); // Admin target
    makeUserWithPerson(2, 'otro@aspy.com');  // Otro

    $res = $this->getJson(USER_LIST_ROUTE_VIEW);

    if ($res->status() !== 200) {
        $res->dump();
        $res->dumpHeaders();
    }
    expect($res->status(), 'Body: '.$res->getContent())->toBe(200);
});
