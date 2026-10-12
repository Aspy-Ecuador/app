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

const PDF_DE_PRUEBA = "%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[]/Count 0>>endobj\ntrailer<</Root 1 0 R>>\n%%EOF\n";

/** Sube un PDF de verdad (el servidor revisa el contenido) con la sesión indicada. */
function subirPdf($prueba, string $token, string $tipo = 'comprobante'): \Illuminate\Testing\TestResponse
{
    return como($prueba, $token)->post('/api/archivos', [
        'tipo' => $tipo,
        'archivo' => \Illuminate\Http\UploadedFile::fake()->createWithContent('archivo.pdf', PDF_DE_PRUEBA),
    ], ['Accept' => 'application/json']);
}

/**
 * Hasta cuándo se pueden crear horarios (lo decide el Admin; por defecto, el mes en curso). Las pruebas
 * que crean turnos a pocos días usan "dos_meses" para no depender del día del mes en que se corren.
 */
function alcanceDeHorarios(string $alcance = 'dos_meses'): void
{
    \App\Models\Ajuste::updateOrCreate(['clave' => \App\Models\Ajuste::HORARIO_ALCANCE], ['valor' => $alcance]);
}

/**
 * Aprueba los horarios por aprobar, como lo haría Secretaría: los que crea un profesional no se ofrecen
 * (ni se pueden reservar) hasta entonces. Las pruebas que no tratan de la aprobación la dan por hecha.
 */
function aprobarHorarios(): void
{
    \App\Models\WorkerSchedule::where('aprobado', false)->update(['aprobado' => true]);
}

/** Registra un paciente y devuelve su sesión. */
function pacienteConSesion($prueba, string $email): string
{
    $prueba->postJson('/api/user-account/registro', cuentaNueva($email, consentimiento()))->assertStatus(201);

    return entrar($prueba, $email)->json('access_token');
}

// ── Horarios, citas y avisos (HorariosTest y AvisosTest; fechas pensadas para el 14 de octubre de 2026) ──

/** Admin, dos profesionales (la primera ofrece un servicio), Secretaría y una paciente. */
function escenarioDeHorarios($prueba): array
{
    $admin = entrar($prueba, 'admin@aspy.com', 'ADMIN')->json('access_token');
    foreach ([['pro@prueba.test', 2, 'professional'], ['otro@prueba.test', 2, 'professional'], ['sec@prueba.test', 4, 'staff']] as [$email, $rol, $nombre]) {
        como($prueba, $admin)->postJson('/api/user-account/crear', cuentaNueva($email, ['role_id' => $rol, 'role' => $nombre, 'specialty' => 'Psicología']))->assertStatus(201);
    }
    $servicio = como($prueba, $admin)->postJson('/api/service', ['name' => 'Terapia de prueba', 'price' => 25])->json('service_id');
    $pro = entrar($prueba, 'pro@prueba.test')->json('access_token');
    $proId = como($prueba, $pro)->getJson('/api/user')->json('person.person_id');
    como($prueba, $admin)->postJson('/api/professional-service', ['service_id' => $servicio, 'professional_id' => $proId])->assertSuccessful();
    $ana = pacienteConSesion($prueba, 'ana@prueba.test');

    return [
        'admin' => $admin, 'pro' => $pro, 'proId' => $proId, 'servicio' => $servicio,
        'otro' => entrar($prueba, 'otro@prueba.test')->json('access_token'),
        'sec' => entrar($prueba, 'sec@prueba.test')->json('access_token'),
        'ana' => $ana, 'anaId' => como($prueba, $ana)->getJson('/api/user')->json('person.person_id'),
    ];
}

function crearHorario($prueba, string $token, int $proId, string $fecha, string $inicio = '09:00', array $extra = [])
{
    return como($prueba, $token)->postJson('/api/professional/create-horario', [
        'professional_id' => $proId, 'date' => $fecha, 'start_time' => $inicio,
        'end_time' => sprintf('%02d:00', (int) substr($inicio, 0, 2) + 1), 'name' => 'Turno',
    ] + $extra);
}

/**
 * Una cita de la paciente con la profesional, pendiente de revisión, en un turno de mañana que crea la
 * profesional (`$horario`: su modalidad y su enlace) y aprueba Secretaría.
 */
function citaDePrueba($prueba, array $e, string $inicio = '09:00', array $horario = []): int
{
    $turno = crearHorario($prueba, $e['pro'], $e['proId'], '2026-10-16', $inicio, $horario)->assertStatus(201)->json('worker_schedule.worker_schedule_id');
    como($prueba, $e['sec'])->putJson('/api/worker-schedule/'.$turno.'/aprobacion', ['aprobado' => true])->assertOk();

    return como($prueba, $e['ana'])->postJson('/api/appointment/appointment-create', [
        'client_id' => $e['anaId'], 'professional_id' => $e['proId'], 'service_id' => $e['servicio'], 'worker_schedule_id' => $turno,
        'payment_type' => 'Transferencia', 'payment_file' => subirPdf($prueba, $e['ana'])->json('archivo'),
    ])->assertStatus(201)->json('appointment.appointment_id');
}

function citaComo($prueba, string $token, int $cita): ?array
{
    return collect(como($prueba, $token)->getJson('/api/appointment')->assertOk()->json())->firstWhere('appointment_id', $cita);
}
