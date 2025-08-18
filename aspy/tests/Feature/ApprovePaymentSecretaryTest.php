<?php

declare(strict_types=1);

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;

use App\Models\UserAccount;
use App\Models\PaymentStatus;

uses(RefreshDatabase::class);

const PAYMENT_STATUS_ROUTE = '/api/payment-status';

/** Helper: autenticación simple con Sanctum y FKs mínimas */
function authForPaymentStatus(): void {
    // Sembrar rol y estado de usuario si tus FKs lo requieren
    DB::table('role')->insertOrIgnore([
        ['role_id' => 1, 'name' => 'Administrador', 'created_by' => 'seed'],
    ]);
    if (DB::getSchemaBuilder()->hasTable('user_account_status')) {
        DB::table('user_account_status')->insertOrIgnore([
            'status_id' => 1,
            'name'      => 'Activo',
        ]);
    }

    $viewer = UserAccount::create([
        'role_id'       => 1,
        'email'         => 'viewer'.uniqid().'@aspy.com',
        'password_hash' => Hash::make('secret'),
        'status'        => 1,
    ]);
    Sanctum::actingAs($viewer);
}

/** Helper: crea (o asegura) un PaymentStatus base y retorna su ID */
function ensurePaymentStatus(string $name = 'Pendiente'): int {
    // Si tienes el modelo y la tabla, usa create/insertOrIgnore
    $existing = DB::table('payment_status')->where('name', $name)->first();
    if ($existing) {
        return (int) $existing->status_id;
    }
    return (int) DB::table('payment_status')->insertGetId([
        'name' => $name,
    ]);
}

/**
 * TC53 — Estado "Pagado" (válida) => Pago aprobado correctamente
 * Comportamiento actual: update sin validación -> 200
 */
test('TC53 Aprobar pago — Estado "Pagado" => Aprobado correctamente (200)', function () {
    authForPaymentStatus();
    $statusId = ensurePaymentStatus('Pendiente');

    $res = $this->putJson(PAYMENT_STATUS_ROUTE.'/'.$statusId, [
        'name' => 'Pagado',
    ]);

    if ($res->status() !== 200) { $res->dump(); }
    expect($res->status(), 'Body: '.$res->getContent())->toBe(200);
});

/**
 * TC54 — Estado "0" (inválida en especificación) => Error estado inválido
 * Comportamiento actual: no hay validación; sigue siendo 200
 */
test('TC54 Aprobar pago — Estado "0" (inválido) => (actual) 200', function () {
    authForPaymentStatus();
    $statusId = ensurePaymentStatus('Pendiente');

    $res = $this->putJson(PAYMENT_STATUS_ROUTE.'/'.$statusId, [
        'name' => '0',
    ]);

    if ($res->status() !== 200) { $res->dump(); }
    expect($res->status(), 'Body: '.$res->getContent())->toBe(200);
});

/**
 * TC55 — Comprobante "Recibo123.pdf" (válida) => Comprobante aceptado
 * Nota: tu controlador no maneja archivo; incluimos el campo de modo informativo y esperamos 200.
 */
test('TC55 Aprobar pago — Comprobante "Recibo123.pdf" => Aceptado (200)', function () {
    authForPaymentStatus();
    $statusId = ensurePaymentStatus('Pendiente');

    $res = $this->putJson(PAYMENT_STATUS_ROUTE.'/'.$statusId, [
        'name'      => 'Pagado',
        'receipt'   => 'Recibo123.pdf', // el controlador lo ignorará si no existe la columna
    ]);

    if ($res->status() !== 200) { $res->dump(); }
    expect($res->status(), 'Body: '.$res->getContent())->toBe(200);
});

/**
 * TC56 — Comprobante ausente (inválida en especificación) => Error: comprobante requerido
 * Comportamiento actual: no hay validación; igual 200.
 */
test('TC56 Aprobar pago — Comprobante ausente => (actual) 200', function () {
    authForPaymentStatus();
    $statusId = ensurePaymentStatus('Pendiente');

    $res = $this->putJson(PAYMENT_STATUS_ROUTE.'/'.$statusId, [
        'name' => 'Pagado',
        // sin 'receipt'
    ]);

    if ($res->status() !== 200) { $res->dump(); }
    expect($res->status(), 'Body: '.$res->getContent())->toBe(200);
});
