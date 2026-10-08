<?php

declare(strict_types=1);

// Consentimiento para tratar datos personales (LOPDP): casillas por separado, representante legal en
// menores de 15 años, constancia de lo aceptado y retiro. Corre sin servidor, sobre SQLite en memoria:
//   cd aspy && DB_CONNECTION=sqlite DB_DATABASE=:memory: vendor/bin/pest tests/Feature/ConsentimientoTest.php

use App\Http\Controllers\ConsentimientoController;
use App\Models\Person;
use App\Models\UserAccount;
use App\Models\UserConsent;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(); // catálogos y admin@aspy.com
});

test('el registro público exige cada casilla del consentimiento y la versión vigente', function () {
    $sinCasillas = cuentaNueva('a@prueba.test', ['accepted_privacy_policy' => true, 'policy_version' => ConsentimientoController::VERSION]);
    $this->postJson('/api/user-account/registro', $sinCasillas)->assertStatus(422)->assertJsonValidationErrors('consentimiento');

    $faltaSalud = cuentaNueva('a@prueba.test', consentimiento(['tratamiento', 'transferencia']));
    $this->postJson('/api/user-account/registro', $faltaSalud)->assertStatus(422)->assertJsonValidationErrors('consentimiento.declaraciones');

    $versionVieja = cuentaNueva('a@prueba.test', ['policy_version' => '1.0'] + consentimiento());
    $this->postJson('/api/user-account/registro', $versionVieja)->assertStatus(422)->assertJsonValidationErrors('policy_version');

    expect(UserAccount::where('email', 'a@prueba.test')->exists())->toBeFalse();
});

test('una persona adulta consiente por sí misma y queda la constancia completa', function () {
    $this->withHeaders(['User-Agent' => 'Navegador de prueba'])
        ->postJson('/api/user-account/registro', cuentaNueva('adulta@prueba.test', consentimiento()))
        ->assertStatus(201);

    $constancia = UserConsent::where('user_id', UserAccount::where('email', 'adulta@prueba.test')->value('user_account_id'))->sole();

    expect($constancia->policy_version)->toBe(ConsentimientoController::VERSION)
        ->and($constancia->declaraciones)->toBe(CASILLAS_PACIENTE)
        ->and($constancia->calidad)->toBe('titular')
        ->and($constancia->representante_nombre)->toBeNull()
        ->and($constancia->user_agent)->toBe('Navegador de prueba')
        ->and($constancia->ip_address)->not->toBeNull()
        ->and($constancia->accepted_at)->not->toBeNull()
        ->and($constancia->revoked_at)->toBeNull();
});

test('si la cuenta es de una persona menor de 15 años, consiente su representante legal', function () {
    $nacimiento = now()->subYears(10)->toDateString();

    $this->postJson('/api/user-account/registro', cuentaNueva('nina@prueba.test', ['birthdate' => $nacimiento] + consentimiento()))
        ->assertStatus(422)
        ->assertJsonValidationErrors(['consentimiento.representante.nombre', 'consentimiento.representante.identificacion']);

    $representante = ['nombre' => 'María Pérez Loor', 'identificacion' => '0912345678'];
    $this->postJson('/api/user-account/registro', cuentaNueva('nina@prueba.test', ['birthdate' => $nacimiento] + consentimiento(CASILLAS_PACIENTE, $representante)))
        ->assertStatus(201);

    $constancia = UserConsent::where('user_id', UserAccount::where('email', 'nina@prueba.test')->value('user_account_id'))->sole();
    expect($constancia->calidad)->toBe('representante')
        ->and($constancia->representante_nombre)->toBe('María Pérez Loor')
        ->and($constancia->representante_identificacion)->toBe('0912345678');

    // De 15 a 17 años puede consentir por sí misma: no se exige representante
    $this->postJson('/api/user-account/registro', cuentaNueva('joven@prueba.test', ['birthdate' => now()->subYears(16)->toDateString()] + consentimiento()))
        ->assertStatus(201);
    $token = entrar($this, 'joven@prueba.test')->json('access_token');
    como($this, $token)->getJson('/api/consentimiento')->assertOk()->assertJson(['pendiente' => false, 'representante' => 'opcional']);
});

test('el personal acepta en su primer ingreso, con su compromiso de confidencialidad', function () {
    $admin = entrar($this, 'admin@aspy.com', 'ADMIN')->json('access_token');
    como($this, $admin)->postJson('/api/user-account/crear', cuentaNueva('secretaria@prueba.test', ['role_id' => 4, 'role' => 'staff']))->assertStatus(201);
    expect(UserConsent::count())->toBe(0); // nadie acepta por otra persona

    $token = entrar($this, 'secretaria@prueba.test')->json('access_token');

    como($this, $token)->getJson('/api/consentimiento')->assertOk()->assertJson([
        'pendiente' => true,
        'version' => ConsentimientoController::VERSION,
        'declaraciones' => CASILLAS_PERSONAL,
        'representante' => 'no',
        'puede_retirar' => false,
    ]);

    // Las casillas del paciente no le sirven: le falta la de confidencialidad
    como($this, $token)->postJson('/api/consentimiento', consentimiento(CASILLAS_PACIENTE))->assertStatus(422);
    como($this, $token)->postJson('/api/consentimiento', consentimiento(CASILLAS_PERSONAL))->assertStatus(201);

    como($this, $token)->getJson('/api/consentimiento')->assertOk()->assertJson(['pendiente' => false, 'calidad' => 'titular', 'puede_retirar' => false]);
    expect(UserConsent::sole()->declaraciones)->toBe(CASILLAS_PERSONAL);

    // El retiro en línea es para pacientes y familias
    como($this, $token)->postJson('/api/consentimiento/retirar', ['confirmar' => true])->assertStatus(403);
});

test('retirar el consentimiento deshabilita la cuenta, cierra la sesión y avisa a la fundación', function () {
    $this->postJson('/api/user-account/registro', cuentaNueva('paciente@prueba.test', consentimiento()))->assertStatus(201);
    $cuenta = UserAccount::where('email', 'paciente@prueba.test')->sole();
    $token = entrar($this, 'paciente@prueba.test')->json('access_token');

    como($this, $token)->getJson('/api/consentimiento')->assertOk()->assertJson(['pendiente' => false, 'puede_retirar' => true]);
    como($this, $token)->postJson('/api/consentimiento/retirar', [])->assertStatus(422);
    como($this, $token)->postJson('/api/consentimiento/retirar', ['confirmar' => true])->assertOk()->assertJson(['retirado' => true]);

    $cuenta->refresh();
    expect((bool) $cuenta->is_available)->toBeFalse()
        ->and($cuenta->tokens()->count())->toBe(0)
        ->and(UserConsent::where('user_id', $cuenta->user_account_id)->sole()->revoked_at)->not->toBeNull();

    como($this, $token)->getJson('/api/user')->assertStatus(401);
    entrar($this, 'paciente@prueba.test')->assertStatus(403)->assertJson(['code' => 'cuenta_deshabilitada']);

    // La fundación lo ve en la lista de personas
    $admin = entrar($this, 'admin@aspy.com', 'ADMIN')->json('access_token');
    $persona = Person::where('user_id', $cuenta->user_account_id)->sole();
    $lista = collect(como($this, $admin)->getJson('/api/person')->assertOk()->json());
    expect($lista->firstWhere('person_id', $persona->person_id)['consentimiento_retirado_el'])->not->toBeNull()
        ->and($lista->firstWhere('user_id', '!=', $cuenta->user_account_id)['consentimiento_retirado_el'])->toBeNull();

    // Si la fundación rehabilita la cuenta, la persona tiene que volver a consentir
    como($this, $admin)->patchJson("/api/person/{$persona->person_id}/available", ['is_available' => true])->assertOk();
    $nuevo = entrar($this, 'paciente@prueba.test')->assertOk()->json('access_token');
    como($this, $nuevo)->getJson('/api/consentimiento')->assertOk()->assertJson(['pendiente' => true]);
    como($this, $nuevo)->postJson('/api/consentimiento', consentimiento())->assertStatus(201);
    como($this, $admin)->getJson('/api/person')->assertOk();
    expect(collect(como($this, $admin)->getJson('/api/person')->json())->firstWhere('person_id', $persona->person_id)['consentimiento_retirado_el'])->toBeNull();
});

test('sin sesión no se consulta, no se acepta ni se retira', function () {
    $this->getJson('/api/consentimiento')->assertStatus(401);
    $this->postJson('/api/consentimiento', consentimiento())->assertStatus(401);
    $this->postJson('/api/consentimiento/retirar', ['confirmar' => true])->assertStatus(401);
});
