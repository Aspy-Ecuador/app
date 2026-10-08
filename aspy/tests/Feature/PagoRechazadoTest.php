<?php

declare(strict_types=1);

// Rechazo de un pago: el motivo es obligatorio, queda registrado y el paciente lo lee; el comprobante
// se conserva los días que elija el Admin (por defecto uno; 0 = no se borra) y después se borra solo.
// Corre sin servidor, sobre SQLite en memoria:
//   cd aspy && DB_CONNECTION=sqlite DB_DATABASE=:memory: vendor/bin/pest tests/Feature/PagoRechazadoTest.php

use App\Http\Middleware\MantenimientoOportunista;
use App\Models\ArchivoPrivado;
use App\Models\Payment;
use App\Models\PaymentData;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed();
    $this->travelTo(now()->setTime(10, 0));
});

/**
 * Una profesional con horarios, Secretaría y una paciente con una cita pagada por cada horario.
 * Devuelve las sesiones, las citas y las referencias de los comprobantes.
 */
function escenarioConPagos($prueba, int $cuantos = 2): array
{
    $admin = entrar($prueba, 'admin@aspy.com', 'ADMIN')->json('access_token');
    como($prueba, $admin)->postJson('/api/user-account/crear', cuentaNueva('pro@prueba.test', ['role_id' => 2, 'role' => 'professional', 'specialty' => 'Psicología']))->assertStatus(201);
    como($prueba, $admin)->postJson('/api/user-account/crear', cuentaNueva('sec@prueba.test', ['role_id' => 4, 'role' => 'staff']))->assertStatus(201);
    $servicio = como($prueba, $admin)->postJson('/api/service', ['name' => 'Terapia de prueba', 'price' => 25])->json('service_id');
    $pro = entrar($prueba, 'pro@prueba.test')->json('access_token');
    $proId = como($prueba, $pro)->getJson('/api/user')->json('person.person_id');
    como($prueba, $admin)->postJson('/api/professional-service', ['service_id' => $servicio, 'professional_id' => $proId])->assertSuccessful();

    $ana = pacienteConSesion($prueba, 'ana@prueba.test');
    $anaId = como($prueba, $ana)->getJson('/api/user')->json('person.person_id');
    $citas = [];
    $archivos = [];
    for ($i = 0; $i < $cuantos; $i++) {
        $turno = como($prueba, $pro)->postJson('/api/professional/create-horario', [
            'professional_id' => $proId, 'date' => now()->addDays(3)->toDateString(),
            'start_time' => sprintf('%02d:00', 8 + $i), 'end_time' => sprintf('%02d:00', 9 + $i), 'name' => 'Turno',
        ])->assertStatus(201)->json('worker_schedule.worker_schedule_id');
        $archivos[$i] = subirPdf($prueba, $ana)->json('archivo');
        $citas[$i] = como($prueba, $ana)->postJson('/api/appointment/appointment-create', [
            'client_id' => $anaId, 'professional_id' => $proId, 'service_id' => $servicio, 'worker_schedule_id' => $turno,
            'payment_type' => 'Transferencia', 'payment_file' => $archivos[$i],
        ])->assertStatus(201)->json('appointment.appointment_id');
    }

    return [
        'admin' => $admin, 'ana' => $ana, 'sec' => entrar($prueba, 'sec@prueba.test')->json('access_token'),
        'citas' => $citas, 'archivos' => $archivos,
    ];
}

function idDeArchivo(string $referencia): string
{
    return explode(':', $referencia)[1];
}

test('para rechazar un pago hay que escribir el motivo, y el paciente lo puede leer', function () {
    $e = escenarioConPagos($this, 1);

    como($this, $e['sec'])->putJson('/api/appointment/appointment-reject', ['appointmentId' => $e['citas'][0]])
        ->assertStatus(422)->assertJsonValidationErrors('motivo');
    como($this, $e['sec'])->putJson('/api/appointment/appointment-reject', ['appointmentId' => $e['citas'][0], 'motivo' => 'no'])
        ->assertStatus(422)->assertJsonValidationErrors('motivo');
    expect(Payment::where('payment_status_id', 3)->count())->toBe(0); // sin motivo no se rechazó nada

    como($this, $e['sec'])->putJson('/api/appointment/appointment-reject', [
        'appointmentId' => $e['citas'][0], 'motivo' => '  El monto transferido no coincide con el precio del servicio.  ',
    ])->assertOk();

    // Queda registrado en el pago (sin espacios sobrantes)
    expect(Payment::where('payment_status_id', 3)->sole()->motivo_rechazo)->toBe('El monto transferido no coincide con el precio del servicio.');

    // La paciente lo lee en sus pagos; otra persona no ve ese pago
    $pago = collect(como($this, $e['ana'])->getJson('/api/payment')->assertOk()->json())->firstWhere('payment_status_id', 3);
    expect($pago['motivo_rechazo'])->toBe('El monto transferido no coincide con el precio del servicio.');
    $beto = pacienteConSesion($this, 'beto@prueba.test');
    expect(como($this, $beto)->getJson('/api/payment')->assertOk()->json())->toBe([]);
});

test('el comprobante de un pago rechazado se conserva un día y después se borra solo; el motivo queda', function () {
    $e = escenarioConPagos($this, 2);
    [$rechazadoRef, $aprobadoRef] = $e['archivos'];

    como($this, $e['sec'])->putJson('/api/appointment/appointment-reject', ['appointmentId' => $e['citas'][0], 'motivo' => 'El comprobante es de otra persona.'])->assertOk();
    como($this, $e['sec'])->putJson('/api/appointment/appointment-approve', ['appointmentId' => $e['citas'][1]])->assertOk();

    // El rechazado queda con fecha de borrado para el día siguiente; el aprobado, no
    $pagos = collect(como($this, $e['sec'])->getJson('/api/payment')->assertOk()->json());
    $rechazado = $pagos->firstWhere('payment_status_id', 3);
    expect($rechazado['comprobante_se_borra_el'])->not->toBeNull()
        ->and($rechazado['payment_data']['file'])->toBe($rechazadoRef)
        ->and($pagos->firstWhere('payment_status_id', 1)['comprobante_se_borra_el'])->toBeNull();

    // Durante ese día todavía se puede recuperar: lo abren Secretaría y la paciente
    $this->travel(23)->hours();
    como($this, $e['sec'])->get('/api/archivos/'.idDeArchivo($rechazadoRef))->assertOk();
    como($this, $e['ana'])->get('/api/archivos/'.idDeArchivo($rechazadoRef))->assertOk();

    // Pasado el día, ya no se entrega y se borra del sistema
    $this->travel(2)->hours();
    $sec = entrar($this, 'sec@prueba.test')->json('access_token');
    como($this, $sec)->get('/api/archivos/'.idDeArchivo($rechazadoRef))->assertStatus(404);
    expect(ArchivoPrivado::whereKey(idDeArchivo($rechazadoRef))->exists())->toBeFalse()
        ->and(PaymentData::whereKey($rechazado['payment_data_id'])->value('file'))->toBeNull();

    // El pago rechazado sigue en la lista con su motivo, ya sin comprobante; el aprobado conserva el suyo
    $despues = collect(como($this, $sec)->getJson('/api/payment')->assertOk()->json())->firstWhere('payment_status_id', 3);
    expect($despues['payment_data']['file'])->toBeNull()
        ->and($despues['comprobante_se_borra_el'])->toBeNull()
        ->and($despues['motivo_rechazo'])->toBe('El comprobante es de otra persona.');
    como($this, $sec)->get('/api/archivos/'.idDeArchivo($aprobadoRef))->assertOk();
});

test('el Admin decide cuántos días se conservan los comprobantes rechazados, o que no se borren', function () {
    $e = escenarioConPagos($this, 2);

    // Lo leen Secretaría y el Admin; solo el Admin lo cambia; los pacientes no entran
    como($this, $e['sec'])->getJson('/api/ajustes')->assertOk()->assertJson(['comprobante_rechazado_dias' => 1]);
    como($this, $e['ana'])->getJson('/api/ajustes')->assertStatus(403);
    como($this, $e['sec'])->putJson('/api/ajustes', ['comprobante_rechazado_dias' => 7])->assertStatus(403);
    como($this, $e['admin'])->putJson('/api/ajustes', ['comprobante_rechazado_dias' => 2])->assertStatus(422); // no es una opción
    como($this, null)->getJson('/api/ajustes')->assertStatus(401);

    // Con 7 días, un rechazo nuevo dura 7 días
    como($this, $e['admin'])->putJson('/api/ajustes', ['comprobante_rechazado_dias' => 7])->assertOk()->assertJson(['comprobante_rechazado_dias' => 7]);
    como($this, $e['sec'])->putJson('/api/appointment/appointment-reject', ['appointmentId' => $e['citas'][0], 'motivo' => 'La imagen no se puede leer.'])->assertOk();
    $archivo = ArchivoPrivado::sinContenido()->findOrFail(idDeArchivo($e['archivos'][0]));
    expect($archivo->eliminar_el->toDateString())->toBe(now()->addDays(7)->toDateString());

    $this->travel(6)->days();
    $sec = entrar($this, 'sec@prueba.test')->json('access_token');
    como($this, $sec)->get('/api/archivos/'.$archivo->archivo_privado_id)->assertOk();

    // El Admin cambia a "no borrar nunca": también vale para el que ya estaba rechazado
    $admin = entrar($this, 'admin@aspy.com', 'ADMIN')->json('access_token');
    como($this, $admin)->putJson('/api/ajustes', ['comprobante_rechazado_dias' => 0])->assertOk();
    expect($archivo->fresh()->eliminar_el)->toBeNull();

    $this->travel(5)->days(); // (las sesiones duran 7 días: se vuelve a entrar)
    MantenimientoOportunista::limpiar();
    $sec = entrar($this, 'sec@prueba.test')->json('access_token');
    como($this, $sec)->get('/api/archivos/'.$archivo->archivo_privado_id)->assertOk();
    $pago = collect(como($this, $sec)->getJson('/api/payment')->assertOk()->json())->firstWhere('payment_status_id', 3);
    expect($pago['comprobante_se_borra_el'])->toBeNull()->and($pago['payment_data']['file'])->not->toBeNull();

    // Y si vuelve a 1 día, el plazo se cuenta desde el rechazo: como ya pasó, se borra
    $admin = entrar($this, 'admin@aspy.com', 'ADMIN')->json('access_token');
    como($this, $admin)->putJson('/api/ajustes', ['comprobante_rechazado_dias' => 1])->assertOk();
    como($this, $sec)->get('/api/archivos/'.$archivo->archivo_privado_id)->assertStatus(404);
    expect(Payment::where('payment_status_id', 3)->sole()->motivo_rechazo)->toBe('La imagen no se puede leer.');
});

test('la limpieza periódica también borra los comprobantes rechazados cuyo plazo ya pasó', function () {
    $ana = pacienteConSesion($this, 'ana@prueba.test');
    $archivo = ArchivoPrivado::findOrFail(idDeArchivo(subirPdf($this, $ana)->json('archivo')));
    // Se simula un comprobante ya usado en un pago y rechazado hace más tiempo del que se conserva
    $comprobante = PaymentData::create(['client_id' => null, 'type' => 'Transferencia', 'file' => $archivo->referencia()]);
    ArchivoPrivado::whereKey($archivo->archivo_privado_id)->update(['payment_data_id' => $comprobante->payment_data_id, 'eliminar_el' => now()->subHour()]);

    MantenimientoOportunista::limpiar();

    expect(ArchivoPrivado::count())->toBe(0)->and($comprobante->fresh()->file)->toBeNull();
});
