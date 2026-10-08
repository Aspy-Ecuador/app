<?php

use Tests\TestCase;

/*
|--------------------------------------------------------------------------
| Test Case
|--------------------------------------------------------------------------
|
| The closure you provide to your test functions is always bound to a specific PHPUnit test
| case class. By default, that class is "PHPUnit\Framework\TestCase". Of course, you may
| need to change it using the "pest()" function to bind a different classes or traits.
|
*/

pest()->extend(TestCase::class)
 // ->use(Illuminate\Foundation\Testing\RefreshDatabase::class)
    ->in('Feature');

/*
|--------------------------------------------------------------------------
| Expectations
|--------------------------------------------------------------------------
|
| When you're writing tests, you often need to check that values meet certain conditions. The
| "expect()" function gives you access to a set of "expectations" methods that you can use
| to assert different things. Of course, you may extend the Expectation API at any time.
|
*/

expect()->extend('toBeOne', function () {
    return $this->toBe(1);
});

/*
|--------------------------------------------------------------------------
| Functions
|--------------------------------------------------------------------------
|
| While Pest is very powerful out-of-the-box, you may have some testing code specific to your
| project that you don't want to repeat in every file. Here you can also expose helpers as
| global functions to help you to reduce the number of lines of code in your test files.
|
*/

// Ayudantes de las pruebas actuales (ConsentimientoTest y ProteccionAbusoTest).
// Corren sin servidor, sobre SQLite en memoria:  cd aspy && DB_CONNECTION=sqlite DB_DATABASE=:memory: vendor/bin/pest tests/Feature/<Archivo>.php

const CASILLAS_PACIENTE = ['tratamiento', 'datos_sensibles', 'transferencia'];
const CASILLAS_PERSONAL = ['tratamiento', 'confidencialidad', 'transferencia'];

/** Datos de una cuenta nueva; `$extra` cambia o agrega campos. */
function cuentaNueva(string $email, array $extra = []): array
{
    return array_merge([
        'email' => $email,
        'password' => 'Secreta123',
        'password_confirmation' => 'Secreta123',
        'role_id' => 3,
        'gender_id' => 1,
        'occupation_id' => 1,
        'marital_status_id' => 1,
        'education_id' => 1,
        'first_name' => 'Prueba',
        'last_name' => 'Consentimiento',
        'birthdate' => '1990-01-01',
        'phone' => ['number' => '0999999999', 'type' => 'movil'],
        'address' => ['type' => 'casa', 'country_id' => 1, 'state_id' => 1, 'city_id' => 1, 'primary_address' => 'Calle 1', 'secondary_address' => 'Calle 2'],
        'identification' => ['type' => 'cedula', 'number' => '09'.str_pad((string) random_int(0, 99999999), 8, '0', STR_PAD_LEFT)],
    ], $extra);
}

/** Lo que manda la web cuando la persona marcó sus casillas. */
function consentimiento(array $casillas = CASILLAS_PACIENTE, ?array $representante = null): array
{
    return [
        'accepted_privacy_policy' => true,
        'policy_version' => \App\Http\Controllers\ConsentimientoController::VERSION,
        'consentimiento' => ['declaraciones' => $casillas, 'representante' => $representante],
    ];
}

/** Petición con la sesión de otra cuenta (el guard recuerda al usuario anterior si no se limpia). */
function como($prueba, ?string $token)
{
    app('auth')->forgetGuards();

    return $token ? $prueba->withToken($token) : $prueba->withHeaders(['Authorization' => '']);
}

function entrar($prueba, string $email, string $clave = 'Secreta123'): \Illuminate\Testing\TestResponse
{
    app('auth')->forgetGuards();

    return $prueba->postJson('/api/login', ['email' => $email, 'password' => $clave]);
}
