<?php

declare(strict_types=1);

// Defensas contra quien quiera saturar el sistema o llenar la base de datos: topes de archivos, de
// citas por revisar, de intentos, de tamaño de las peticiones y limpieza de lo vencido.
// Corre sin servidor, sobre SQLite en memoria:
//   cd aspy && DB_CONNECTION=sqlite DB_DATABASE=:memory: vendor/bin/pest tests/Feature/ProteccionAbusoTest.php

use App\Http\Middleware\MantenimientoOportunista;
use App\Models\ArchivoPrivado;
use App\Models\UserAccount;
use App\Models\UserConsent;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Testing\TestResponse;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(); // catálogos y admin@aspy.com
    $this->travelTo(now()->setTime(10, 0)); // lejos de la medianoche: hay topes por día
});

const PDF_DE_PRUEBA = "%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[]/Count 0>>endobj\ntrailer<</Root 1 0 R>>\n%%EOF\n";

/** Sube un PDF de verdad (el servidor revisa el contenido) con la sesión indicada. */
function subirPdf($prueba, string $token, string $tipo = 'comprobante'): TestResponse
{
    return como($prueba, $token)->post('/api/archivos', [
        'tipo' => $tipo,
        'archivo' => UploadedFile::fake()->createWithContent('archivo.pdf', PDF_DE_PRUEBA),
    ], ['Accept' => 'application/json']);
}

/** Registra un paciente y devuelve su sesión. */
function pacienteConSesion($prueba, string $email): string
{
    $prueba->postJson('/api/user-account/registro', cuentaNueva($email, consentimiento()))->assertStatus(201);

    return entrar($prueba, $email)->json('access_token');
}

test('una cuenta guarda como máximo 5 archivos sin usar y el sistema le dice cuántos tiene', function () {
    $this->getJson('/api/archivos/resumen')->assertStatus(401);
    $token = pacienteConSesion($this, 'ana@prueba.test');

    como($this, $token)->getJson('/api/archivos/resumen')->assertOk()
        ->assertJson(['sin_usar' => 0, 'maximo_sin_usar' => 5, 'hoy' => 0, 'maximo_por_dia' => 30]);

    $referencias = [];
    for ($i = 1; $i <= 5; $i++) {
        $r = subirPdf($this, $token)->assertStatus(201)->assertJson(['sin_usar' => $i, 'hoy' => $i, 'reemplazados' => 0]);
        $referencias[] = $r->json('archivo');
    }

    // El sexto entra, pero se borra el más antiguo: nunca guarda más de 5
    subirPdf($this, $token)->assertStatus(201)->assertJson(['sin_usar' => 5, 'hoy' => 6, 'reemplazados' => 1]);
    $id = fn (string $referencia) => explode(':', $referencia)[1];
    como($this, $token)->get('/api/archivos/'.$id($referencias[0]))->assertStatus(404);
    como($this, $token)->get('/api/archivos/'.$id($referencias[1]))->assertOk();
    expect(ArchivoPrivado::count())->toBe(5);
});

test('hay un máximo de subidas por día y el aviso dice cuántas lleva', function () {
    $token = pacienteConSesion($this, 'ana@prueba.test');

    for ($i = 1; $i <= 30; $i++) {
        subirPdf($this, $token)->assertStatus(201);
        if ($i % 15 === 0) {
            $this->travel(61)->seconds(); // el límite por minuto es aparte
        }
    }

    $r = subirPdf($this, $token)->assertStatus(429)->assertJson(['hoy' => 30, 'maximo_por_dia' => 30]);
    expect($r->json('message'))->toContain('Hoy ya subiste 30 archivos');

    $this->travel(1)->days();
    subirPdf($this, $token)->assertStatus(201)->assertJson(['hoy' => 1]);
});

test('subir muchos archivos seguidos se frena y el aviso está en español', function () {
    $token = pacienteConSesion($this, 'ana@prueba.test');

    for ($i = 1; $i <= 20; $i++) {
        subirPdf($this, $token)->assertStatus(201);
    }
    $r = subirPdf($this, $token)->assertStatus(429);
    expect($r->json('message'))->toContain('Demasiadas solicitudes seguidas');
});

test('los archivos que nadie usó se borran al día siguiente', function () {
    $ana = pacienteConSesion($this, 'ana@prueba.test');
    subirPdf($this, $ana)->assertStatus(201);
    subirPdf($this, $ana)->assertStatus(201);
    expect(ArchivoPrivado::count())->toBe(2);

    $this->travel(25)->hours();
    $beto = pacienteConSesion($this, 'beto@prueba.test');
    subirPdf($this, $beto)->assertStatus(201); // cualquier subida limpia lo vencido de todas las cuentas

    expect(ArchivoPrivado::count())->toBe(1);
});

test('un paciente no puede acaparar la agenda: máximo 10 citas esperando la revisión del pago', function () {
    $admin = entrar($this, 'admin@aspy.com', 'ADMIN')->json('access_token');
    como($this, $admin)->postJson('/api/user-account/crear', cuentaNueva('pro@prueba.test', ['role_id' => 2, 'role' => 'professional', 'specialty' => 'Psicología']))->assertStatus(201);
    como($this, $admin)->postJson('/api/user-account/crear', cuentaNueva('sec@prueba.test', ['role_id' => 4, 'role' => 'staff']))->assertStatus(201);
    $servicio = como($this, $admin)->postJson('/api/service', ['name' => 'Terapia de prueba', 'price' => 25])->json('service_id');

    $pro = entrar($this, 'pro@prueba.test')->json('access_token');
    $proId = como($this, $pro)->getJson('/api/user')->json('person.person_id');
    como($this, $admin)->postJson('/api/professional-service', ['service_id' => $servicio, 'professional_id' => $proId])->assertSuccessful();

    $turnos = [];
    foreach (range(7, 18) as $hora) {
        $turnos[] = como($this, $pro)->postJson('/api/professional/create-horario', [
            'professional_id' => $proId,
            'date' => now()->addDays(3)->toDateString(),
            'start_time' => sprintf('%02d:00', $hora),
            'end_time' => sprintf('%02d:00', $hora + 1),
            'name' => 'Turno',
        ])->assertStatus(201)->json('worker_schedule.worker_schedule_id');
    }

    $ana = pacienteConSesion($this, 'ana@prueba.test');
    $anaId = como($this, $ana)->getJson('/api/user')->json('person.person_id');
    $reserva = fn (string $token, int $turno) => como($this, $token)->postJson('/api/appointment/appointment-create', [
        'client_id' => $anaId,
        'professional_id' => $proId,
        'service_id' => $servicio,
        'worker_schedule_id' => $turno,
        'payment_type' => 'Transferencia',
        'payment_file' => subirPdf($this, $token)->json('archivo'),
    ]);

    foreach (array_slice($turnos, 0, 10) as $turno) {
        $reserva($ana, $turno)->assertStatus(201);
    }
    $r = $reserva($ana, $turnos[10])->assertStatus(422);
    expect($r->json('message'))->toContain('Ya tienes 10 citas esperando la revisión del pago');

    // Secretaría sí puede registrarle otra (por ejemplo, alguien que paga en la fundación)
    $sec = entrar($this, 'sec@prueba.test')->json('access_token');
    $reserva($sec, $turnos[10])->assertStatus(201);
});

test('la IP de cada persona es la suya, no la del proxy, y no se puede falsear', function () {
    // Detrás del proxy de la plataforma (red interna): vale la IP que anotó el proxy, la última de la lista
    $this->withServerVariables(['REMOTE_ADDR' => '10.20.30.40'])
        ->withHeaders(['X-Forwarded-For' => '9.9.9.9, 203.0.113.7'])
        ->postJson('/api/user-account/registro', cuentaNueva('proxy@prueba.test', consentimiento()))->assertStatus(201);
    expect(UserConsent::where('user_id', UserAccount::where('email', 'proxy@prueba.test')->value('user_account_id'))->value('ip_address'))->toBe('203.0.113.7');

    // Si alguien llegara directo (sin el proxy), su encabezado no se cree: vale la conexión real
    $this->withServerVariables(['REMOTE_ADDR' => '198.51.100.5'])
        ->withHeaders(['X-Forwarded-For' => '9.9.9.9'])
        ->postJson('/api/user-account/registro', cuentaNueva('directo@prueba.test', consentimiento()))->assertStatus(201);
    expect(UserConsent::where('user_id', UserAccount::where('email', 'directo@prueba.test')->value('user_account_id'))->value('ip_address'))->toBe('198.51.100.5');
});

test('adivinar contraseñas a la fuerza se frena por correo y por IP', function () {
    for ($i = 1; $i <= 10; $i++) {
        entrar($this, 'admin@aspy.com', 'mala'.$i)->assertStatus(401);
    }
    $r = entrar($this, 'admin@aspy.com', 'ADMIN')->assertStatus(429);
    expect($r->json('message'))->toContain('Demasiados intentos seguidos');

    // Probar muchos correos distintos desde la misma IP también se frena (30 por minuto)
    for ($i = 1; $i <= 20; $i++) {
        entrar($this, "nadie{$i}@prueba.test", 'mala')->assertStatus(401);
    }
    entrar($this, 'otro@prueba.test', 'mala')->assertStatus(429);

    $this->travel(61)->seconds();
    entrar($this, 'admin@aspy.com', 'ADMIN')->assertOk();
});

test('crear cuentas en masa desde una misma conexión se frena', function () {
    for ($i = 1; $i <= 5; $i++) {
        $this->postJson('/api/user-account/registro', cuentaNueva("masa{$i}@prueba.test", consentimiento()))->assertStatus(201);
    }
    $r = $this->postJson('/api/user-account/registro', cuentaNueva('masa6@prueba.test', consentimiento()))->assertStatus(429);
    expect($r->json('message'))->toContain('Demasiados intentos seguidos');

    // Otra conexión (otra IP detrás del proxy) no queda bloqueada por la primera
    $this->withServerVariables(['REMOTE_ADDR' => '10.20.30.40'])
        ->withHeaders(['X-Forwarded-For' => '203.0.113.50'])
        ->postJson('/api/user-account/registro', cuentaNueva('otra-conexion@prueba.test', consentimiento()))->assertStatus(201);
});

test('hay un límite general de peticiones por conexión', function () {
    for ($i = 1; $i <= 600; $i++) {
        $this->getJson('/api/login')->assertOk();
    }
    $r = $this->getJson('/api/login')->assertStatus(429);
    expect($r->json('message'))->toContain('Demasiadas solicitudes seguidas');

    $this->travel(61)->seconds();
    $this->getJson('/api/login')->assertOk();
});

test('una petición con un cuerpo exagerado se rechaza antes de procesarla', function () {
    $this->postJson('/api/login', ['email' => 'admin@aspy.com', 'password' => 'ADMIN', 'relleno' => str_repeat('a', 300 * 1024)])
        ->assertStatus(413);
    $this->postJson('/api/login', ['email' => 'admin@aspy.com', 'password' => 'ADMIN'])->assertOk();
});

test('al ingresar muchas veces no se acumulan sesiones', function () {
    $cuenta = UserAccount::where('email', 'admin@aspy.com')->sole();

    for ($i = 1; $i <= 14; $i++) {
        entrar($this, 'admin@aspy.com', 'ADMIN')->assertOk();
        if ($i % 7 === 0) {
            $this->travel(61)->seconds();
        }
    }
    expect($cuenta->tokens()->count())->toBe(10);

    // Las sesiones vencidas (más de 7 días) se borran al volver a entrar
    $this->travel(8)->days();
    entrar($this, 'admin@aspy.com', 'ADMIN')->assertOk();
    expect($cuenta->tokens()->count())->toBe(1);
});

test('no se crean horarios a más de un año ni servicios con precios absurdos', function () {
    $admin = entrar($this, 'admin@aspy.com', 'ADMIN')->json('access_token');
    como($this, $admin)->postJson('/api/user-account/crear', cuentaNueva('pro@prueba.test', ['role_id' => 2, 'role' => 'professional', 'specialty' => 'Psicología']))->assertStatus(201);
    $pro = entrar($this, 'pro@prueba.test')->json('access_token');
    $proId = como($this, $pro)->getJson('/api/user')->json('person.person_id');

    $horario = fn (string $fecha) => como($this, $pro)->postJson('/api/professional/create-horario', [
        'professional_id' => $proId, 'date' => $fecha, 'start_time' => '09:00', 'end_time' => '10:00', 'name' => 'Turno',
    ]);
    $horario(now()->addYears(2)->toDateString())->assertStatus(422)->assertJsonValidationErrors('date');
    $horario(now()->addMonths(2)->toDateString())->assertStatus(201);

    como($this, $admin)->postJson('/api/service', ['name' => 'Carísimo', 'price' => 1000000000])->assertStatus(422)->assertJsonValidationErrors('price');
});

test('abrir el mismo archivo varias veces deja una sola constancia', function () {
    $token = pacienteConSesion($this, 'ana@prueba.test');
    $id = explode(':', subirPdf($this, $token)->json('archivo'))[1];

    for ($i = 1; $i <= 4; $i++) {
        como($this, $token)->get('/api/archivos/'.$id)->assertOk();
    }
    $vistas = fn () => DB::table('archivo_privado_acceso')->where('archivo_privado_id', $id)->where('accion', 'ver')->count();
    expect($vistas())->toBe(1);

    $this->travel(11)->minutes();
    como($this, $token)->get('/api/archivos/'.$id)->assertOk();
    expect($vistas())->toBe(2);
});

test('la limpieza borra sesiones vencidas y archivos que nadie usó', function () {
    $token = pacienteConSesion($this, 'ana@prueba.test');
    subirPdf($this, $token)->assertStatus(201);
    $cuenta = UserAccount::where('email', 'ana@prueba.test')->sole();
    expect($cuenta->tokens()->count())->toBe(1)->and(ArchivoPrivado::count())->toBe(1);

    $this->travel(8)->days();
    MantenimientoOportunista::limpiar();

    expect($cuenta->tokens()->count())->toBe(0)->and(ArchivoPrivado::count())->toBe(0);
});

test('visitar la dirección del servidor no abre sesiones ni deja cookies', function () {
    $r = $this->get('/')->assertOk()->assertJson(['estado' => 'ok']);
    expect($r->headers->getCookies())->toBe([]);
    $this->get('/test')->assertStatus(404);
});
