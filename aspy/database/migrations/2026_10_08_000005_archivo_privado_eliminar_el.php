<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * archivo_privado.eliminar_el: fecha desde la que un archivo se puede borrar solo.
 * Se usa con los comprobantes de pagos rechazados: se conservan un día (por si el rechazo fue un
 * error y alguien necesita recuperarlos) y después se borran del sistema.
 *
 * Es idempotente: si la columna ya existe, no hace nada.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('archivo_privado') && ! Schema::hasColumn('archivo_privado', 'eliminar_el')) {
            Schema::table('archivo_privado', function (Blueprint $table) {
                $table->timestamp('eliminar_el')->nullable()->index();
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('archivo_privado') && Schema::hasColumn('archivo_privado', 'eliminar_el')) {
            Schema::table('archivo_privado', function (Blueprint $table) {
                $table->dropIndex(['eliminar_el']);
                $table->dropColumn('eliminar_el');
            });
        }
    }
};
