<?php

declare(strict_types=1);

// Horarios y citas virtuales:
// - hasta cuándo se pueden crear horarios lo decide el Admin (hoy, la semana, dos semanas, el mes o dos meses);
// - Secretaría los crea y los quita solo si el Admin lo habilitó;
// - el enlace de una cita virtual: quién lo pone, qué enlaces se aceptan y cuándo lo ve el paciente.
// Corre sin servidor, sobre SQLite en memoria:
//   cd aspy && DB_CONNECTION=sqlite DB_DATABASE=:memory: vendor/bin/pest tests/Feature/HorariosTest.php

use App\Models\Appointment;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed();
    // Miércoles 14 de octubre de 2026: la semana termina el domingo 18 y el mes, el sábado 31
    $this->travelTo(Carbon::parse('2026-10-14 10:00:00'));
});

// Los ayudantes (escenarioDeHorarios, crearHorario, citaDePrueba, citaComo) están en tests/Pest.php:
// también los usa AvisosTest.

test('el profesional crea horarios solo hasta donde le permite el Admin', function () {
    $e = escenarioDeHorarios($this);
    $hora = 7;
    // [alcance, último día permitido, primer día que ya no]
    $casos = [
        ['mes', '2026-10-31', '2026-11-01'], // por defecto: el mes en curso
        ['dia', '2026-10-14', '2026-10-15'],
        ['semana', '2026-10-18', '2026-10-19'],
        ['dos_semanas', '2026-10-25', '2026-10-26'],
        ['dos_meses', '2026-11-30', '2026-12-01'],
    ];

    foreach ($casos as $i => [$alcance, $ultimo, $fuera]) {
        if ($i > 0) {
            como($this, $e['admin'])->putJson('/api/ajustes', ['horario_alcance' => $alcance])->assertOk()->assertJson(['horario_alcance' => $alcance, 'horario_hasta' => $ultimo]);
        }
        como($this, $e['pro'])->getJson('/api/professional/horario-reglas')->assertOk()
            ->assertJson(['alcance' => $alcance, 'desde' => '2026-10-14', 'hasta' => $ultimo, 'puede_gestionar' => true]);

        $r = crearHorario($this, $e['pro'], $e['proId'], $fuera, sprintf('%02d:00', $hora))->assertStatus(422)->assertJsonValidationErrors('date');
        expect($r->json('errors.date.0'))->toContain('lo define la administración');
        crearHorario($this, $e['pro'], $e['proId'], $ultimo, sprintf('%02d:00', $hora++))->assertStatus(201);
    }

    // Ayer no, con cualquier alcance
    crearHorario($this, $e['pro'], $e['proId'], '2026-10-13', '20:00')->assertStatus(422)->assertJsonValidationErrors('date');
});

test('solo el Admin cambia el alcance de los horarios y solo acepta las opciones de la lista', function () {
    $e = escenarioDeHorarios($this);

    como($this, $e['sec'])->getJson('/api/ajustes')->assertOk()->assertJson(['horario_alcance' => 'mes', 'horario_secretaria' => false]);
    como($this, $e['sec'])->putJson('/api/ajustes', ['horario_alcance' => 'dos_meses'])->assertStatus(403);
    como($this, $e['sec'])->putJson('/api/ajustes', ['horario_secretaria' => true])->assertStatus(403);
    como($this, $e['pro'])->putJson('/api/ajustes', ['horario_alcance' => 'dos_meses'])->assertStatus(403);
    como($this, $e['pro'])->getJson('/api/ajustes')->assertStatus(403);
    como($this, $e['admin'])->putJson('/api/ajustes', ['horario_alcance' => 'anio'])->assertStatus(422)->assertJsonValidationErrors('horario_alcance');
    como($this, $e['admin'])->putJson('/api/ajustes', ['horario_secretaria' => 'quizas'])->assertStatus(422)->assertJsonValidationErrors('horario_secretaria');
    como($this, $e['admin'])->putJson('/api/ajustes', [])->assertStatus(422);

    // Cada ajuste se guarda por separado: cambiar uno no toca los demás
    como($this, $e['admin'])->putJson('/api/ajustes', ['comprobante_rechazado_dias' => 7])->assertOk();
    como($this, $e['admin'])->putJson('/api/ajustes', ['horario_alcance' => 'semana'])->assertOk()
        ->assertJson(['horario_alcance' => 'semana', 'comprobante_rechazado_dias' => 7, 'horario_secretaria' => false]);

    // Las reglas las consultan profesionales, Secretaría y Admin; un paciente no
    como($this, $e['ana'])->getJson('/api/professional/horario-reglas')->assertStatus(403);
    como($this, null)->getJson('/api/professional/horario-reglas')->assertStatus(401);
    // El Admin no tiene ese límite (sí el tope de un año)
    como($this, $e['admin'])->getJson('/api/professional/horario-reglas')->assertOk()->assertJson(['alcance' => null, 'hasta' => '2027-10-14', 'puede_gestionar' => true]);
    crearHorario($this, $e['admin'], $e['proId'], '2027-01-15')->assertStatus(201);
});

test('Secretaría crea y quita horarios solo si el Admin lo habilita', function () {
    $e = escenarioDeHorarios($this);
    $turno = crearHorario($this, $e['pro'], $e['proId'], '2026-10-15')->assertStatus(201)->json('worker_schedule.worker_schedule_id');

    // Por defecto, no
    como($this, $e['sec'])->getJson('/api/professional/horario-reglas')->assertOk()->assertJson(['puede_gestionar' => false, 'secretaria_puede' => false]);
    $r = crearHorario($this, $e['sec'], $e['proId'], '2026-10-15', '11:00')->assertStatus(403);
    expect($r->json('message'))->toContain('administración');
    como($this, $e['sec'])->deleteJson('/api/worker-schedule/'.$turno)->assertStatus(403);
    como($this, $e['sec'])->putJson('/api/worker-schedule/'.$turno, ['is_available' => false])->assertStatus(403);

    // El Admin lo habilita: Secretaría crea para cualquier profesional, con el mismo límite de fechas
    como($this, $e['admin'])->putJson('/api/ajustes', ['horario_secretaria' => true])->assertOk()->assertJson(['horario_secretaria' => true]);
    como($this, $e['sec'])->getJson('/api/professional/horario-reglas')->assertOk()->assertJson(['puede_gestionar' => true, 'alcance' => 'mes', 'hasta' => '2026-10-31']);
    crearHorario($this, $e['sec'], $e['proId'], '2026-10-15', '11:00')->assertStatus(201);
    crearHorario($this, $e['sec'], $e['proId'], '2026-11-02', '11:00')->assertStatus(422)->assertJsonValidationErrors('date');
    como($this, $e['sec'])->deleteJson('/api/worker-schedule/'.$turno)->assertStatus(204);

    // Un profesional sigue sin poder tocar los horarios de otro, y un paciente, ninguno
    $otroTurno = crearHorario($this, $e['pro'], $e['proId'], '2026-10-15', '15:00')->assertStatus(201)->json('worker_schedule.worker_schedule_id');
    crearHorario($this, $e['otro'], $e['proId'], '2026-10-15', '17:00')->assertStatus(403);
    como($this, $e['otro'])->deleteJson('/api/worker-schedule/'.$otroTurno)->assertStatus(403);
    crearHorario($this, $e['ana'], $e['proId'], '2026-10-15', '17:00')->assertStatus(403);

    // El Admin lo vuelve a quitar
    como($this, $e['admin'])->putJson('/api/ajustes', ['horario_secretaria' => false])->assertOk();
    crearHorario($this, $e['sec'], $e['proId'], '2026-10-15', '18:00')->assertStatus(403);
    como($this, $e['sec'])->deleteJson('/api/worker-schedule/'.$otroTurno)->assertStatus(403);
});

test('el enlace de una cita virtual lo pone su profesional, Secretaría o el Admin, y solo de Zoom, Teams o Meet', function () {
    $e = escenarioDeHorarios($this);
    // La modalidad y el enlace son del horario de la cita: aquí, uno virtual que todavía no tiene enlace
    $cita = citaDePrueba($this, $e, '09:00', ['modalidad' => 'virtual']);
    $turno = Appointment::findOrFail($cita)->worker_schedule_id;
    $enlace = fn (string $token, ?string $valor, ?int $id = null) => como($this, $token)->putJson('/api/worker-schedule/'.($id ?? $turno).'/modalidad', ['enlace' => $valor]);

    // Quién no puede
    $enlace($e['ana'], 'https://meet.google.com/abc-defg-hij')->assertStatus(403);
    $enlace($e['otro'], 'https://meet.google.com/abc-defg-hij')->assertStatus(403); // el horario de otra profesional
    como($this, null)->putJson('/api/worker-schedule/'.$turno.'/modalidad', ['enlace' => 'https://meet.google.com/abc-defg-hij'])->assertStatus(401);
    $enlace($e['pro'], 'https://meet.google.com/abc-defg-hij', 999999)->assertStatus(404);

    // Qué enlaces no se aceptan
    $rechazados = [
        'http://meet.google.com/abc-defg-hij',            // sin https
        'https://ejemplo.com/reunion',                    // otro sitio
        'https://meet.google.com.ejemplo.com/abc',        // dominio que solo empieza igual
        'https://ejemplo.com/meet.google.com',            // el dominio va en la ruta
        'https://meet.google.com@ejemplo.com/abc',        // usuario@otro-sitio
        'https://meet.google.com\\@ejemplo.com/abc',      // barra invertida
        'https://zoom.us/j/1\\@ejemplo.com',              // barra invertida en la ruta
        'https://ejemplo.com#@zoom.us/j/1',
        'https://zoom.us:8443/j/123',                     // con puerto
        'javascript:alert(1)//https://zoom.us/j/1',
        'https://zoom.us/j/123 https://ejemplo.com',      // con espacios
        'https://zoom.us/j/1"><script>alert(1)</script>',
        'zoom.us/j/123456789',
        // No basta con que el dominio sea el correcto: tiene que ser el enlace de una reunión
        'https://meet.google.com/linkredirect?dest=https%3A%2F%2Fejemplo.com',
        'https://meet.google.com/',
        'https://zoom.us/',
        'https://zoom.us/signin',
        'https://otro.meet.google.com/abc-defg-hij',       // Meet y Teams no usan subdominios
        // El navegador resuelve "." y "..": con ellos el enlace abriría otra página del servicio
        'https://zoom.us/j/../signin',
        'https://zoom.us/j/%2e%2e/oauth/authorize',
        'https://zoom.us/j/.%2E/x',
        'https://meet.google.com/lookup/../linkredirect?dest=https://ejemplo.com',
        'https://teams.microsoft.com/v2/../l/file/x',
        'https://meet.google.com/./abc-defg-hij',
        'https://.zoom.us/j/1',                           // dominio mal formado
        'https://zoom.us/j/ñandú',                        // fuera de ASCII
        "https://zoom.us/j/1\x07",                         // carácter de control
        "https://zoom.us/j/1\xC2\xA0x",                    // espacio duro (no lo quita trim)
    ];
    foreach ($rechazados as $malo) {
        $enlace($e['pro'], $malo)->assertStatus(422)->assertJsonValidationErrors('enlace');
    }
    $enlace($e['pro'], 'https://zoom.us/j/'.str_repeat('1', 500))->assertStatus(422);
    expect(App\Models\WorkerSchedule::findOrFail($turno)->enlace_virtual)->toBeNull();

    // Si no llega ni la modalidad ni el enlace no se cambia nada (para quitar el enlace hay que mandarlo vacío a propósito)
    $enlace($e['pro'], 'https://zoom.us/j/777')->assertOk();
    como($this, $e['pro'])->putJson('/api/worker-schedule/'.$turno.'/modalidad', [])->assertStatus(422);
    expect(App\Models\WorkerSchedule::findOrFail($turno)->enlace_virtual)->toBe('https://zoom.us/j/777');

    // Los que sí
    foreach ([
        'https://us02web.zoom.us/j/81234567890?pwd=abcDEF123' => 'Zoom',
        'https://zoom.us/j/81234567890' => 'Zoom',
        'https://teams.microsoft.com/l/meetup-join/19%3ameeting_abc%40thread.v2/0?context=%7b%22Tid%22%7d' => 'Microsoft Teams',
        'https://teams.live.com/meet/9312345678901?p=AbCdEf' => 'Microsoft Teams',
        'https://meet.google.com/abc-defg-hij' => 'Google Meet',
        'https://meet.google.com/abc-defg-hij?authuser=0' => 'Google Meet',
        'https://zoom.us/my/sala.de.lucia' => 'Zoom',
        'https://teams.microsoft.com/meet/2223334445556?p=AbCdEfGh' => 'Microsoft Teams',
    ] as $bueno => $plataforma) {
        $enlace($e['pro'], '  '.$bueno.'  ')->assertOk()->assertJson(['es_virtual' => true, 'enlace_virtual' => $bueno, 'plataforma' => $plataforma]);
    }
    $enlace($e['sec'], 'https://meet.google.com/sec-reta-ria')->assertOk();
    $enlace($e['admin'], 'https://meet.google.com/adm-inis-tra')->assertOk();

    // Vacío = se quita el enlace, pero la cita sigue siendo virtual (queda pendiente de enlace)
    $enlace($e['pro'], '')->assertOk()->assertJson(['es_virtual' => true, 'enlace_virtual' => null]);
    expect(citaComo($this, $e['pro'], $cita))->toMatchArray(['modalidad' => 'virtual', 'es_virtual' => true, 'enlace_virtual' => null]);

    // Con la cita ya reservada, la modalidad la cambian Secretaría o el Admin, no la profesional
    $modalidad = fn (string $token, array $datos) => como($this, $token)->putJson('/api/worker-schedule/'.$turno.'/modalidad', $datos);
    $r = $modalidad($e['pro'], ['modalidad' => 'presencial'])->assertStatus(422);
    expect($r->json('message'))->toContain('Secretaría');
    $enlace($e['pro'], 'https://zoom.us/j/777')->assertOk();
    // Presencial = sin enlace (se borra el que tenía) y no se le puede poner uno
    $modalidad($e['sec'], ['modalidad' => 'presencial'])->assertOk()->assertJson(['modalidad' => 'presencial', 'es_virtual' => false, 'enlace_virtual' => null, 'aprobado' => true]);
    expect(citaComo($this, $e['ana'], $cita))->toMatchArray(['modalidad' => 'presencial', 'es_virtual' => false, 'enlace_virtual' => null]);
    $enlace($e['pro'], 'https://zoom.us/j/777')->assertStatus(422)->assertJsonValidationErrors('enlace');
    $modalidad($e['admin'], ['modalidad' => 'virtual', 'enlace' => 'https://zoom.us/j/888'])->assertOk()->assertJson(['es_virtual' => true, 'enlace_virtual' => 'https://zoom.us/j/888', 'plataforma' => 'Zoom']);
    $modalidad($e['admin'], ['modalidad' => 'por teléfono'])->assertStatus(422)->assertJsonValidationErrors('modalidad');
});

test('el paciente ve el enlace de su cita virtual solo cuando el pago ya está aprobado', function () {
    $e = escenarioDeHorarios($this);
    $meet = 'https://meet.google.com/abc-defg-hij';
    // La profesional crea el horario virtual con su enlace de una vez
    $cita = citaDePrueba($this, $e, '09:00', ['modalidad' => 'virtual', 'enlace' => $meet]);
    $turno = Appointment::findOrFail($cita)->worker_schedule_id;

    // Guardada (pago por revisar): la paciente sabe que es virtual, pero todavía no recibe el enlace
    expect(citaComo($this, $e['ana'], $cita))->toMatchArray(['es_virtual' => true, 'enlace_virtual' => null]);
    expect(como($this, $e['ana'])->getJson('/api/appointment')->getContent())->not->toContain('abc-defg-hij');
    // Tampoco lo recibe en la lista de horarios (ni ella, ni otro paciente, ni otra profesional)
    expect(como($this, $e['ana'])->getJson('/api/worker-schedule')->assertOk()->getContent())->not->toContain('abc-defg-hij');
    expect(como($this, $e['otro'])->getJson('/api/worker-schedule')->assertOk()->getContent())->not->toContain('abc-defg-hij');
    expect(como($this, $e['ana'])->getJson('/api/worker-schedule/'.$turno)->assertOk()->getContent())->not->toContain('abc-defg-hij');
    foreach (['pro', 'sec', 'admin'] as $quien) {
        expect(collect(como($this, $e[$quien])->getJson('/api/worker-schedule')->json())->firstWhere('worker_schedule_id', $turno)['enlace_virtual'])->toBe($meet);
    }
    // Su profesional, Secretaría y el Admin sí lo ven
    foreach (['pro', 'sec', 'admin'] as $quien) {
        expect(citaComo($this, $e[$quien], $cita))->toMatchArray(['es_virtual' => true, 'enlace_virtual' => $meet]);
    }
    // Otra profesional y otro paciente no ven esa cita
    expect(citaComo($this, $e['otro'], $cita))->toBeNull();
    $beto = pacienteConSesion($this, 'beto@prueba.test');
    expect(citaComo($this, $beto, $cita))->toBeNull();

    // Aprobado el pago, la paciente recibe el enlace
    como($this, $e['sec'])->putJson('/api/appointment/appointment-approve', ['appointmentId' => $cita])->assertOk();
    expect(citaComo($this, $e['ana'], $cita))->toMatchArray(['es_virtual' => true, 'enlace_virtual' => $meet]);

    // Si la cita se cancela, deja de recibirlo; la respuesta de cancelar tampoco lo trae
    $r = como($this, $e['ana'])->putJson('/api/appointment/appointment-cancel', ['appointmentId' => $cita])->assertOk();
    expect($r->getContent())->not->toContain('abc-defg-hij');
    expect(citaComo($this, $e['ana'], $cita))->toMatchArray(['es_virtual' => true, 'enlace_virtual' => null]);
    // El horario quedó libre otra vez, con su modalidad y su enlace: la profesional lo sigue administrando
    como($this, $e['pro'])->putJson('/api/worker-schedule/'.$turno.'/modalidad', ['enlace' => 'https://zoom.us/j/1'])->assertOk();
});

test('cuando la cita ya terminó, el paciente deja de recibir el enlace y nadie lo cambia', function () {
    $e = escenarioDeHorarios($this);
    $meet = 'https://meet.google.com/abc-defg-hij';
    $cita = citaDePrueba($this, $e, '09:00', ['modalidad' => 'virtual', 'enlace' => $meet]); // viernes 16, 09:00
    $turno = Appointment::findOrFail($cita)->worker_schedule_id;
    como($this, $e['sec'])->putJson('/api/appointment/appointment-approve', ['appointmentId' => $cita])->assertOk();
    expect(citaComo($this, $e['ana'], $cita)['enlace_virtual'])->toBe($meet);

    // Las respuestas de aprobar y de marcar asistencia no traen el enlace guardado
    $this->travelTo(Carbon::parse('2026-10-16 10:05:00'));
    $r = como($this, $e['pro'])->putJson('/api/appointment/appointment-complete', ['appointmentId' => $cita])->assertOk();
    expect($r->getContent())->not->toContain('abc-defg-hij');

    // Asistió: la paciente ya no lo recibe (tampoco en la lista de sus reportes) y no se puede cambiar
    expect(citaComo($this, $e['ana'], $cita))->toMatchArray(['es_virtual' => true, 'enlace_virtual' => null]);
    expect(como($this, $e['ana'])->getJson('/api/appointment-report')->assertOk()->getContent())->not->toContain('abc-defg-hij');
    como($this, $e['pro'])->putJson('/api/worker-schedule/'.$turno.'/modalidad', ['enlace' => 'https://zoom.us/j/1'])->assertStatus(422);
    como($this, $e['admin'])->putJson('/api/worker-schedule/'.$turno.'/modalidad', ['enlace' => ''])->assertStatus(422);
    como($this, $e['admin'])->putJson('/api/worker-schedule/'.$turno.'/modalidad', ['modalidad' => 'presencial'])->assertStatus(422);
    // La ruta anterior, que guardaba el enlace en la cita, ya no existe
    como($this, $e['admin'])->putJson('/api/appointment/appointment-enlace', ['appointmentId' => $cita, 'enlace' => ''])->assertStatus(404);
});

test('el horario que crea un profesional no se ofrece hasta que Secretaría o el Admin lo aprueban', function () {
    $e = escenarioDeHorarios($this);
    $beto = pacienteConSesion($this, 'beto@prueba.test');
    $losVe = fn (string $token) => collect(como($this, $token)->getJson('/api/worker-schedule')->assertOk()->json())->pluck('worker_schedule_id')->all();
    $aprobar = fn (string $token, int $turno, bool $valor = true) => como($this, $token)->putJson('/api/worker-schedule/'.$turno.'/aprobacion', ['aprobado' => $valor]);
    $reservar = fn (string $token, int $turno) => como($this, $token)->postJson('/api/appointment/appointment-create', [
        'client_id' => $e['anaId'], 'professional_id' => $e['proId'], 'service_id' => $e['servicio'], 'worker_schedule_id' => $turno,
        'payment_type' => 'Transferencia', 'payment_file' => subirPdf($this, $token)->json('archivo'),
    ]);

    // Lo crea la profesional: queda por aprobar y ella lo sabe
    $r = crearHorario($this, $e['pro'], $e['proId'], '2026-10-16', '09:00', ['modalidad' => 'presencial'])->assertStatus(201)->assertJsonPath('worker_schedule.aprobado', false);
    expect($r->json('message'))->toContain('Secretaría');
    $turno = $r->json('worker_schedule.worker_schedule_id');

    // Mientras tanto lo ven ella, Secretaría y el Admin; los pacientes y las demás profesionales, no
    foreach (['pro', 'sec', 'admin'] as $quien) {
        expect($losVe($e[$quien]))->toContain($turno);
    }
    foreach ([$e['ana'], $beto, $e['otro']] as $token) {
        expect($losVe($token))->not->toContain($turno);
        como($this, $token)->getJson('/api/worker-schedule/'.$turno)->assertStatus(404);
    }
    // Nadie lo reserva todavía: ni la paciente (aunque adivine su número) ni Secretaría
    expect($reservar($e['ana'], $turno)->assertStatus(422)->json('message'))->toContain('aprobado');
    expect($reservar($e['sec'], $turno)->assertStatus(422)->json('message'))->toContain('aprobado');
    expect(Appointment::count())->toBe(0);

    // Solo Secretaría y el Admin aprueban, y no depende del permiso para crear horarios (que está apagado)
    foreach (['pro', 'otro', 'ana'] as $quien) {
        $aprobar($e[$quien], $turno)->assertStatus(403);
    }
    como($this, null)->putJson('/api/worker-schedule/'.$turno.'/aprobacion', ['aprobado' => true])->assertStatus(401);
    $aprobar($e['sec'], $turno)->assertStatus(200)->assertJson(['aprobado' => true]);
    $aprobar($e['sec'], 999999)->assertStatus(404);
    como($this, $e['sec'])->putJson('/api/worker-schedule/'.$turno.'/aprobacion', [])->assertStatus(422)->assertJsonValidationErrors('aprobado');
    expect(App\Models\WorkerSchedule::findOrFail($turno)->aprobado_por)->not->toBeNull();

    // Aprobado: ya lo ven todos y la paciente lo reserva
    foreach ([$e['ana'], $beto, $e['otro']] as $token) {
        expect($losVe($token))->toContain($turno);
    }
    // Se le puede quitar la aprobación mientras esté libre (deja de ofrecerse)
    $aprobar($e['admin'], $turno, false)->assertOk()->assertJson(['aprobado' => false]);
    expect($losVe($e['ana']))->not->toContain($turno);
    $aprobar($e['admin'], $turno)->assertOk();
    $reservar($e['ana'], $turno)->assertStatus(201);
    // Con una cita encima ya no se le quita
    expect($aprobar($e['sec'], $turno, false)->assertStatus(422)->json('message'))->toContain('cita');

    // Los que crean Secretaría (con permiso) o el Admin nacen aprobados
    $delAdmin = crearHorario($this, $e['admin'], $e['proId'], '2026-10-17', '09:00')->assertStatus(201)->assertJsonPath('worker_schedule.aprobado', true)->json('worker_schedule.worker_schedule_id');
    como($this, $e['admin'])->putJson('/api/ajustes', ['horario_secretaria' => true])->assertOk();
    crearHorario($this, $e['sec'], $e['proId'], '2026-10-17', '11:00')->assertStatus(201)->assertJsonPath('worker_schedule.aprobado', true);
    expect($losVe($e['ana']))->toContain($delAdmin);
});

test('quien crea el horario elige si es presencial o virtual, y cambiarlo después tiene reglas', function () {
    $e = escenarioDeHorarios($this);
    $meet = 'https://meet.google.com/abc-defg-hij';
    $modalidad = fn (string $token, int $turno, array $datos) => como($this, $token)->putJson('/api/worker-schedule/'.$turno.'/modalidad', $datos);
    $enBase = fn (int $turno) => App\Models\WorkerSchedule::findOrFail($turno)->only(['modalidad', 'enlace_virtual', 'aprobado']);

    // Al crearlo: presencial (lo que vale si no se indica) o virtual, con el enlace o sin él
    $presencial = crearHorario($this, $e['pro'], $e['proId'], '2026-10-16', '08:00')->assertStatus(201)->assertJsonPath('worker_schedule.modalidad', 'presencial')->json('worker_schedule.worker_schedule_id');
    $virtual = crearHorario($this, $e['pro'], $e['proId'], '2026-10-16', '10:00', ['modalidad' => 'virtual', 'enlace' => $meet])->assertStatus(201)
        ->assertJsonPath('worker_schedule.modalidad', 'virtual')->assertJsonPath('worker_schedule.enlace_virtual', $meet)->json('worker_schedule.worker_schedule_id');
    $sinEnlace = crearHorario($this, $e['pro'], $e['proId'], '2026-10-16', '12:00', ['modalidad' => 'virtual'])->assertStatus(201)->json('worker_schedule.worker_schedule_id');
    expect($enBase($sinEnlace))->toBe(['modalidad' => 'virtual', 'enlace_virtual' => null, 'aprobado' => false]);
    // Lo que no se acepta al crear
    crearHorario($this, $e['pro'], $e['proId'], '2026-10-16', '14:00', ['modalidad' => 'mixta'])->assertStatus(422)->assertJsonValidationErrors('modalidad');
    crearHorario($this, $e['pro'], $e['proId'], '2026-10-16', '14:00', ['modalidad' => 'presencial', 'enlace' => $meet])->assertStatus(422)->assertJsonValidationErrors('enlace');
    crearHorario($this, $e['pro'], $e['proId'], '2026-10-16', '14:00', ['modalidad' => 'virtual', 'enlace' => 'https://ejemplo.com/reunion'])->assertStatus(422)->assertJsonValidationErrors('enlace');
    expect(App\Models\WorkerSchedule::count())->toBe(3);

    // La otra profesional y los pacientes no cambian nada de un horario ajeno
    $modalidad($e['otro'], $presencial, ['modalidad' => 'virtual'])->assertStatus(403);
    $modalidad($e['ana'], $presencial, ['modalidad' => 'virtual'])->assertStatus(403);

    // Secretaría aprueba el presencial. Si la profesional le cambia la modalidad, vuelve a quedar por aprobar
    como($this, $e['sec'])->putJson('/api/worker-schedule/'.$presencial.'/aprobacion', ['aprobado' => true])->assertOk();
    $r = $modalidad($e['pro'], $presencial, ['modalidad' => 'virtual', 'enlace' => $meet])->assertOk()->assertJson(['modalidad' => 'virtual', 'enlace_virtual' => $meet, 'aprobado' => false]);
    expect($r->json('message'))->toContain('aprobar');
    // Cambiar solo el enlace no toca la aprobación
    como($this, $e['sec'])->putJson('/api/worker-schedule/'.$presencial.'/aprobacion', ['aprobado' => true])->assertOk();
    $modalidad($e['pro'], $presencial, ['enlace' => 'https://zoom.us/j/123'])->assertOk()->assertJson(['aprobado' => true, 'enlace_virtual' => 'https://zoom.us/j/123']);
    // Repetir la misma modalidad tampoco
    $modalidad($e['pro'], $presencial, ['modalidad' => 'virtual'])->assertOk()->assertJson(['aprobado' => true, 'enlace_virtual' => 'https://zoom.us/j/123']);

    // Secretaría y el Admin cambian la modalidad de cualquiera sin quitarle la aprobación
    $modalidad($e['sec'], $presencial, ['modalidad' => 'presencial'])->assertOk()->assertJson(['modalidad' => 'presencial', 'enlace_virtual' => null, 'aprobado' => true]);
    $modalidad($e['admin'], $virtual, ['modalidad' => 'presencial'])->assertOk()->assertJson(['modalidad' => 'presencial', 'aprobado' => false]); // seguía por aprobar
    expect($enBase($virtual))->toBe(['modalidad' => 'presencial', 'enlace_virtual' => null, 'aprobado' => false]);
});

test('un horario se crea con fecha y horas bien formadas, y dura al menos 10 minutos', function () {
    $e = escenarioDeHorarios($this);
    $horario = fn (array $cambios) => como($this, $e['pro'])->postJson('/api/professional/create-horario', array_merge([
        'professional_id' => $e['proId'], 'date' => '2026-10-20', 'start_time' => '09:00', 'end_time' => '10:00', 'name' => 'Turno',
    ], $cambios));

    // Fechas que antes pasaban la validación y se guardaban como otro día (o fuera del límite)
    foreach (['20261020', '202610201200', '20261020120000', '2026-11-01T00:00:00+19:00', '2026-10-13T23:00:00-06:00', 'October 20, 2026', '2026-10-20 00:00:00', 'tomorrow', 20261020] as $fecha) {
        $horario(['date' => $fecha])->assertStatus(422)->assertJsonValidationErrors('date');
    }
    expect(App\Models\Schedule::count())->toBe(0);

    // Horas: el fin tiene que ser posterior al inicio, vengan como vengan escritas
    $horario(['start_time' => '10:00', 'end_time' => '09:00:00'])->assertStatus(422)->assertJsonValidationErrors('end_time');
    $horario(['start_time' => '10:00', 'end_time' => '10:00:00'])->assertStatus(422)->assertJsonValidationErrors('end_time');
    $horario(['start_time' => '10:00:00', 'end_time' => '09:59'])->assertStatus(422)->assertJsonValidationErrors('end_time');
    $horario(['start_time' => '25:00', 'end_time' => '26:00'])->assertStatus(422)->assertJsonValidationErrors('start_time');
    $r = $horario(['start_time' => '09:00', 'end_time' => '09:05'])->assertStatus(422)->assertJsonValidationErrors('end_time');
    expect($r->json('errors.end_time.0'))->toContain('10 minutos');
    expect(App\Models\Schedule::count())->toBe(0);

    // Bien formado: se guarda siempre con el mismo formato, y un turno pegado al anterior no se cruza
    $horario([])->assertStatus(201)->assertJsonPath('schedule.start_time', '09:00:00')->assertJsonPath('schedule.end_time', '10:00:00');
    $horario(['start_time' => '10:00:00', 'end_time' => '10:10'])->assertStatus(201);
    $horario(['start_time' => '08:00', 'end_time' => '09:00'])->assertStatus(201);
    $horario(['start_time' => '09:30', 'end_time' => '10:30'])->assertStatus(422); // se cruza
});

test('ya no existe la ruta antigua para crear horarios y un turno ocupado no se vuelve a ofrecer', function () {
    $e = escenarioDeHorarios($this);
    como($this, $e['admin'])->putJson('/api/ajustes', ['horario_secretaria' => true])->assertOk();

    // La ruta vieja creaba horarios sin permiso, sin límite de fechas y sin profesional
    foreach (['sec', 'admin', 'pro'] as $quien) {
        como($this, $e[$quien])->postJson('/api/worker-schedule', ['date' => '2031-01-01', 'start_time' => '09:00:00', 'end_time' => '10:00:00', 'person_id' => $e['proId']])->assertStatus(405);
    }
    expect(App\Models\WorkerSchedule::count())->toBe(0);

    // Un turno con una cita no se reabre: otra persona lo reservaría encima
    $cita = citaDePrueba($this, $e);
    $turno = Appointment::findOrFail($cita)->worker_schedule_id;
    foreach (['pro', 'sec', 'admin'] as $quien) {
        $r = como($this, $e[$quien])->putJson('/api/worker-schedule/'.$turno, ['is_available' => true])->assertStatus(422);
        expect($r->json('message'))->toContain('cancelar la cita');
    }
    expect((bool) App\Models\WorkerSchedule::findOrFail($turno)->is_available)->toBeFalse();

    // Al cancelar la cita, el propio sistema lo libera
    como($this, $e['sec'])->putJson('/api/appointment/appointment-cancel', ['appointmentId' => $cita])->assertOk();
    expect((bool) App\Models\WorkerSchedule::findOrFail($turno)->is_available)->toBeTrue();
});
