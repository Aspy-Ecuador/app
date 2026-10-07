<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * - payment.amount: monto cobrado en ese pago. Antes se leía siempre el precio actual del servicio,
 *   así que cambiar un precio alteraba los recibos e ingresos ya registrados. Los pagos existentes
 *   se completan con el precio actual de su servicio (el mejor dato disponible).
 * - bank_account: datos de la cuenta donde las familias transfieren. Una sola fila; la edita el Admin.
 *
 * Es idempotente: si la columna o la tabla ya existen, no hace nada.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('payment', 'amount')) {
            Schema::table('payment', function (Blueprint $table) {
                $table->decimal('amount', 10, 2)->nullable();
            });
        }
        DB::statement(
            'UPDATE payment SET amount = (SELECT service.price FROM service WHERE service.service_id = payment.service_id) WHERE amount IS NULL'
        );

        if (! Schema::hasTable('bank_account')) {
            Schema::create('bank_account', function (Blueprint $table) {
                $table->increments('bank_account_id');
                $table->string('bank_name', 80);
                $table->string('account_type', 20);
                $table->string('account_number', 30);
                $table->string('holder_name', 120);
                $table->string('holder_id', 20);
                $table->integer('modified_by')->nullable();
                $table->timestamp('modification_date')->nullable();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('bank_account');
        if (Schema::hasColumn('payment', 'amount')) {
            Schema::table('payment', function (Blueprint $table) {
                $table->dropColumn('amount');
            });
        }
    }
};
