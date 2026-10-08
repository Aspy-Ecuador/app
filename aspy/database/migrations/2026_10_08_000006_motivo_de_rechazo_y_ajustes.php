<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * - payment.motivo_rechazo: por qué Secretaría rechazó el pago. Queda registrado aunque el comprobante
 *   se borre después, y el paciente lo puede leer.
 * - ajuste: ajustes del sistema que decide el Admin (clave → valor). El primero: cuántos días se
 *   conserva el comprobante de un pago rechazado (0 = no se borra nunca).
 *
 * Es idempotente: solo crea lo que falte.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('payment') && ! Schema::hasColumn('payment', 'motivo_rechazo')) {
            Schema::table('payment', function (Blueprint $table) {
                $table->string('motivo_rechazo', 500)->nullable();
            });
        }

        if (! Schema::hasTable('ajuste')) {
            Schema::create('ajuste', function (Blueprint $table) {
                $table->string('clave', 60)->primary();
                $table->string('valor', 255)->nullable();
                $table->integer('modified_by')->nullable();
                $table->timestamp('modification_date')->nullable();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('ajuste');
        if (Schema::hasTable('payment') && Schema::hasColumn('payment', 'motivo_rechazo')) {
            Schema::table('payment', function (Blueprint $table) {
                $table->dropColumn('motivo_rechazo');
            });
        }
    }
};
