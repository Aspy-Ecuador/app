<?php

declare(strict_types=1);

// Avisos: a quién se le avisa de qué, que cada cuenta lea solo los suyos y lo que cada rol tiene por revisar.
// Corre sin servidor, sobre SQLite en memoria:
//   cd aspy && DB_CONNECTION=sqlite DB_DATABASE=:memory: vendor/bin/pest tests/Feature/AvisosTest.php

use App\Models\Aviso;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed();
    // Miércoles 14 de octubre de 2026 (ver los ayudantes de horarios en tests/Pest.php)
    $this->travelTo(Carbon::parse('2026-10-14 10:00:00'));
});

function avisosDe($prueba, string $token): array
{
    return como($prueba, $token)->getJson('/api/avisos')->assertOk()->json();
}

/** Cuántos tiene por revisar esa cuenta de una clave (0 si no sale en la lista). */
function porRevisar($prueba, string $token, string $clave): int
{
    return (int) (collect(avisosDe($prueba, $token)['pendientes'])->firstWhere('clave', $clave)['cantidad'] ?? 0);
}

test('quien reserva no recibe aviso: se entera su profesional, y Secretaría lo ve por revisar', function () {
    $e = escenarioDeHorarios($this);
    como($this, null)->getJson('/api/avisos')->assertStatus(401);
    expect(avisosDe($this, $e['pro'])['avisos'])->toBe([]);
    expect(porRevisar($this, $e['sec'], 'pagos_por_revisar'))->toBe(0);

    $cita = citaDePrueba($this, $e, '09:00', ['modalidad' => 'virtual']);

    $pro = avisosDe($this, $e['pro']);
    // El primero fue "Tu horario fue aprobado" (lo aprobó Secretaría); el más reciente, la reserva
    expect($pro['sin_leer'])->toBe(2);
    expect($pro['avisos'][0])->toMatchArray(['tipo' => Aviso::CITA_RESERVADA, 'titulo' => 'Nueva cita reservada', 'enlace' => '/citas?cita='.$cita, 'leido' => false]);
    expect($pro['avisos'][0]['texto'])->toContain('Prueba Consentimiento')->toContain('viernes 16 de octubre a las 09:00')->toContain('virtual');
    expect($pro['avisos'][1]['tipo'])->toBe(Aviso::HORARIO_APROBADO);

    // La paciente no recibe aviso de lo que ella misma hizo; sí ve que su cita está por confirmar
    $ana = avisosDe($this, $e['ana']);
    expect($ana['avisos'])->toBe([]);
    expect($ana['pendientes'][0])->toMatchArray(['clave' => 'citas_por_confirmar', 'cantidad' => 1, 'accion' => false]);

    // Secretaría y el Admin: un pago por revisar; la otra profesional, nada
    expect(porRevisar($this, $e['sec'], 'pagos_por_revisar'))->toBe(1);
    expect(porRevisar($this, $e['admin'], 'pagos_por_revisar'))->toBe(1);
    expect(avisosDe($this, $e['otro']))->toMatchArray(['avisos' => [], 'sin_leer' => 0, 'pendientes' => []]);
});

test('al aprobar o rechazar el pago se le avisa al paciente (con el motivo) y a su profesional', function () {
    $e = escenarioDeHorarios($this);
    $aprobada = citaDePrueba($this, $e, '09:00');
    $rechazada = citaDePrueba($this, $e, '11:00');

    como($this, $e['sec'])->putJson('/api/appointment/appointment-approve', ['appointmentId' => $aprobada])->assertOk();
    $ana = avisosDe($this, $e['ana']);
    expect($ana['sin_leer'])->toBe(1);
    expect($ana['avisos'][0])->toMatchArray(['tipo' => Aviso::PAGO_APROBADO, 'titulo' => 'Tu comprobante fue aprobado', 'enlace' => '/dashboard?cita='.$aprobada]);
    expect($ana['avisos'][0]['texto'])->toContain('quedó agendada para el viernes 16 de octubre a las 09:00')->toContain('calendario');
    expect(avisosDe($this, $e['pro'])['avisos'][0])->toMatchArray(['tipo' => Aviso::CITA_CONFIRMADA, 'enlace' => '/citas?cita='.$aprobada]);

    como($this, $e['sec'])->putJson('/api/appointment/appointment-reject', ['appointmentId' => $rechazada, 'motivo' => 'El monto no coincide con el precio.'])->assertOk();
    $ana = avisosDe($this, $e['ana']);
    expect($ana['sin_leer'])->toBe(2);
    expect($ana['avisos'][0])->toMatchArray(['tipo' => Aviso::PAGO_RECHAZADO, 'titulo' => 'Tu comprobante no fue aprobado', 'enlace' => '/recibos']);
    expect($ana['avisos'][0]['texto'])->toContain('a las 11:00')->toContain('Motivo: El monto no coincide con el precio.');
    expect(avisosDe($this, $e['pro'])['avisos'][0]['tipo'])->toBe(Aviso::CITA_ELIMINADA);

    // Secretaría hizo las dos cosas: no recibe avisos de eso, y ya no le queda nada por revisar
    $sec = avisosDe($this, $e['sec']);
    expect($sec['avisos'])->toBe([]);
    expect(porRevisar($this, $e['sec'], 'pagos_por_revisar'))->toBe(0);
    expect(porRevisar($this, $e['ana'], 'citas_por_confirmar'))->toBe(0);
});

test('cada cuenta lee y marca solo sus avisos', function () {
    $e = escenarioDeHorarios($this);
    $cita = citaDePrueba($this, $e, '09:00');
    como($this, $e['sec'])->putJson('/api/appointment/appointment-approve', ['appointmentId' => $cita])->assertOk();

    $deAna = avisosDe($this, $e['ana'])['avisos'][0]['aviso_id'];
    $dePro = collect(avisosDe($this, $e['pro'])['avisos'])->pluck('aviso_id')->all();
    expect($dePro)->toHaveCount(3)->not->toContain($deAna);

    // La otra profesional intenta marcar avisos ajenos (con sus ids, y "todos"): no cambia nada
    como($this, $e['otro'])->putJson('/api/avisos/leidos', ['ids' => array_merge($dePro, [$deAna])])->assertOk()->assertJson(['marcados' => 0]);
    como($this, $e['otro'])->putJson('/api/avisos/leidos')->assertOk()->assertJson(['marcados' => 0]);
    expect(avisosDe($this, $e['ana'])['sin_leer'])->toBe(1);
    expect(avisosDe($this, $e['pro'])['sin_leer'])->toBe(3);

    // La profesional marca uno y después todos
    como($this, $e['pro'])->putJson('/api/avisos/leidos', ['ids' => [$dePro[0]]])->assertOk()->assertJson(['marcados' => 1, 'sin_leer' => 2]);
    expect(collect(avisosDe($this, $e['pro'])['avisos'])->firstWhere('aviso_id', $dePro[0])['leido'])->toBeTrue();
    como($this, $e['pro'])->putJson('/api/avisos/leidos')->assertOk()->assertJson(['marcados' => 2, 'sin_leer' => 0]);
    expect(avisosDe($this, $e['ana'])['sin_leer'])->toBe(1);

    como($this, $e['pro'])->putJson('/api/avisos/leidos', ['ids' => 'todos'])->assertStatus(422);
    como($this, null)->putJson('/api/avisos/leidos')->assertStatus(401);
});

test('los horarios por aprobar: Secretaría los ve por revisar y el profesional se entera cuando los aprueban', function () {
    $e = escenarioDeHorarios($this);
    $turno = crearHorario($this, $e['pro'], $e['proId'], '2026-10-16', '09:00', ['modalidad' => 'virtual'])->assertStatus(201)->json('worker_schedule.worker_schedule_id');

    expect(porRevisar($this, $e['sec'], 'horarios_por_aprobar'))->toBe(1);
    expect(porRevisar($this, $e['admin'], 'horarios_por_aprobar'))->toBe(1);
    // A su profesional le sale como dato, no como algo que le toque resolver; a la otra, nada
    expect(collect(avisosDe($this, $e['pro'])['pendientes'])->firstWhere('clave', 'horarios_por_aprobar'))->toMatchArray(['cantidad' => 1, 'accion' => false]);
    expect(avisosDe($this, $e['otro'])['pendientes'])->toBe([]);

    como($this, $e['sec'])->putJson('/api/worker-schedule/'.$turno.'/aprobacion', ['aprobado' => true])->assertOk();
    // Aprobarlo otra vez no repite el aviso
    como($this, $e['sec'])->putJson('/api/worker-schedule/'.$turno.'/aprobacion', ['aprobado' => true])->assertOk();
    $pro = avisosDe($this, $e['pro']);
    expect($pro['sin_leer'])->toBe(1);
    expect($pro['avisos'][0])->toMatchArray(['tipo' => Aviso::HORARIO_APROBADO, 'enlace' => '/seleccionar-horario']);
    expect($pro['avisos'][0]['texto'])->toContain('viernes 16 de octubre, de 09:00 a 10:00')->toContain('virtual');
    expect(porRevisar($this, $e['sec'], 'horarios_por_aprobar'))->toBe(0);

    como($this, $e['admin'])->putJson('/api/worker-schedule/'.$turno.'/aprobacion', ['aprobado' => false])->assertOk();
    expect(avisosDe($this, $e['pro'])['avisos'][0]['tipo'])->toBe(Aviso::HORARIO_POR_APROBAR);
    expect(porRevisar($this, $e['sec'], 'horarios_por_aprobar'))->toBe(1);

    // Aprobar varios seguidos no llena la lista: mientras no lo lea, es un solo aviso que va sumando
    foreach (['11:00', '12:00'] as $inicio) {
        $otro = crearHorario($this, $e['pro'], $e['proId'], '2026-10-16', $inicio)->assertStatus(201)->json('worker_schedule.worker_schedule_id');
        como($this, $e['sec'])->putJson('/api/worker-schedule/'.$otro.'/aprobacion', ['aprobado' => true])->assertOk();
    }
    $pro = avisosDe($this, $e['pro']);
    expect($pro['sin_leer'])->toBe(2);
    expect($pro['avisos'][0])->toMatchArray(['tipo' => Aviso::HORARIO_APROBADO, 'titulo' => 'Aprobaron 3 horarios tuyos']);
    expect($pro['avisos'][0]['texto'])->toContain('de 12:00 a 13:00');
    // Una vez leído, el siguiente empieza la cuenta otra vez
    como($this, $e['pro'])->putJson('/api/avisos/leidos')->assertOk();
    como($this, $e['sec'])->putJson('/api/worker-schedule/'.$turno.'/aprobacion', ['aprobado' => true])->assertOk();
    expect(avisosDe($this, $e['pro'])['avisos'][0]['titulo'])->toBe('Tu horario fue aprobado');
});

test('cambiar la modalidad o el enlace de una cita le avisa al paciente, y cancelarla, a quien no lo hizo', function () {
    $e = escenarioDeHorarios($this);
    $cita = citaDePrueba($this, $e, '09:00');
    $turno = citaComo($this, $e['sec'], $cita)['worker_schedule']['worker_schedule_id'];
    como($this, $e['sec'])->putJson('/api/appointment/appointment-approve', ['appointmentId' => $cita])->assertOk();
    como($this, $e['ana'])->putJson('/api/avisos/leidos')->assertOk();
    como($this, $e['pro'])->putJson('/api/avisos/leidos')->assertOk();

    // Secretaría la pasa a virtual: se enteran la paciente y su profesional; falta el enlace
    como($this, $e['sec'])->putJson('/api/worker-schedule/'.$turno.'/modalidad', ['modalidad' => 'virtual'])->assertOk();
    expect(avisosDe($this, $e['ana'])['avisos'][0])->toMatchArray(['tipo' => Aviso::CITA_MODALIDAD, 'titulo' => 'Tu cita ahora es virtual', 'enlace' => '/dashboard?cita='.$cita]);
    expect(avisosDe($this, $e['pro'])['avisos'][0]['tipo'])->toBe(Aviso::HORARIO_CAMBIADO);
    expect(porRevisar($this, $e['sec'], 'citas_virtuales_sin_enlace'))->toBe(1);
    expect(porRevisar($this, $e['pro'], 'citas_virtuales_sin_enlace'))->toBe(1);

    // La profesional pone el enlace: se entera la paciente (ella no), y ya no falta
    como($this, $e['pro'])->putJson('/api/worker-schedule/'.$turno.'/modalidad', ['enlace' => 'https://meet.google.com/abc-defg-hij'])->assertOk();
    expect(avisosDe($this, $e['ana'])['avisos'][0]['tipo'])->toBe(Aviso::CITA_ENLACE);
    expect(avisosDe($this, $e['pro'])['sin_leer'])->toBe(1);
    expect(porRevisar($this, $e['sec'], 'citas_virtuales_sin_enlace'))->toBe(0);
    // Guardar lo mismo otra vez no repite el aviso
    como($this, $e['pro'])->putJson('/api/worker-schedule/'.$turno.'/modalidad', ['enlace' => 'https://meet.google.com/abc-defg-hij'])->assertOk();
    expect(avisosDe($this, $e['ana'])['sin_leer'])->toBe(2);

    // Secretaría cancela: se enteran las dos. Si cancela la paciente, solo su profesional
    como($this, $e['sec'])->putJson('/api/appointment/appointment-cancel', ['appointmentId' => $cita])->assertOk();
    expect(avisosDe($this, $e['ana'])['avisos'][0])->toMatchArray(['tipo' => Aviso::CITA_CANCELADA, 'titulo' => 'Tu cita fue cancelada']);
    expect(avisosDe($this, $e['pro'])['avisos'][0]['texto'])->toContain('La fundación canceló la cita de Prueba Consentimiento');

    $otra = citaDePrueba($this, $e, '15:00');
    $antes = avisosDe($this, $e['ana'])['sin_leer'];
    como($this, $e['ana'])->putJson('/api/appointment/appointment-cancel', ['appointmentId' => $otra])->assertOk();
    expect(avisosDe($this, $e['ana'])['sin_leer'])->toBe($antes);
    expect(avisosDe($this, $e['pro'])['avisos'][0]['texto'])->toContain('Prueba Consentimiento canceló su cita');
});

test('lo que pasó sin marcar le sale a su profesional, cada cuenta guarda un máximo de avisos y los viejos se borran', function () {
    $e = escenarioDeHorarios($this);
    $cita = citaDePrueba($this, $e, '09:00');
    como($this, $e['sec'])->putJson('/api/appointment/appointment-approve', ['appointmentId' => $cita])->assertOk();
    expect(porRevisar($this, $e['pro'], 'citas_sin_marcar'))->toBe(0);

    // El viernes 16 a las 09:30 la cita ya empezó
    $this->travelTo(Carbon::parse('2026-10-16 09:30:00'));
    expect(porRevisar($this, $e['pro'], 'citas_sin_marcar'))->toBe(1);
    expect(porRevisar($this, $e['otro'], 'citas_sin_marcar'))->toBe(0);
    expect(collect(avisosDe($this, $e['sec'])['pendientes'])->firstWhere('clave', 'citas_sin_marcar'))->toMatchArray(['cantidad' => 1, 'accion' => false]);
    como($this, $e['pro'])->putJson('/api/appointment/appointment-complete', ['appointmentId' => $cita])->assertOk();
    expect(porRevisar($this, $e['pro'], 'citas_sin_marcar'))->toBe(0);
    expect(porRevisar($this, $e['pro'], 'citas_sin_reporte'))->toBe(1);

    // Tope por cuenta: al llegar uno más se van los más antiguos
    // (la cuenta de la paciente: la última sesión usada es la de la profesional, y nadie se avisa a sí mismo)
    $cuenta = Aviso::where('tipo', Aviso::PAGO_APROBADO)->value('user_account_id');
    for ($i = 0; $i < Aviso::MAX_POR_CUENTA + 5; $i++) {
        Aviso::paraCuenta((int) $cuenta, 'prueba', 'Aviso '.$i, 'Texto');
    }
    expect(Aviso::where('user_account_id', $cuenta)->count())->toBe(Aviso::MAX_POR_CUENTA);

    // Limpieza: los leídos hace más de un mes y cualquiera de más de tres meses
    Aviso::query()->delete();
    Aviso::create(['user_account_id' => $cuenta, 'tipo' => 'prueba', 'titulo' => 'Leído viejo', 'texto' => '-', 'creado_el' => now()->subDays(40), 'leido_el' => now()->subDays(31)]);
    Aviso::create(['user_account_id' => $cuenta, 'tipo' => 'prueba', 'titulo' => 'Leído reciente', 'texto' => '-', 'creado_el' => now()->subDays(40), 'leido_el' => now()->subDays(5)]);
    Aviso::create(['user_account_id' => $cuenta, 'tipo' => 'prueba', 'titulo' => 'Sin leer muy viejo', 'texto' => '-', 'creado_el' => now()->subDays(91)]);
    Aviso::create(['user_account_id' => $cuenta, 'tipo' => 'prueba', 'titulo' => 'Sin leer', 'texto' => '-', 'creado_el' => now()->subDays(60)]);
    \App\Http\Middleware\MantenimientoOportunista::limpiar();
    expect(Aviso::orderBy('aviso_id')->pluck('titulo')->all())->toBe(['Leído reciente', 'Sin leer']);
});
